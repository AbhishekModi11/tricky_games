from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import random
import os

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'trickyking_secret_2024')

# Use DATABASE_URL env var when set (production), otherwise local SQLite
_db_url = os.environ.get('DATABASE_URL', '')
if _db_url.startswith('postgres://'):
    # SQLAlchemy requires postgresql:// scheme
    _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_DATABASE_URI'] = _db_url or 'sqlite:///trickyking.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ─── Models ───────────────────────────────────────────────────────────────────

class User(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    username   = db.Column(db.String(80), unique=True, nullable=False)
    email      = db.Column(db.String(120), unique=True, nullable=False)
    password   = db.Column(db.String(200), nullable=False)
    avatar     = db.Column(db.String(10), default='👑')
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    games      = db.relationship('GameRecord', backref='user', lazy=True)


class GameRecord(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    game_type  = db.Column(db.String(20), nullable=False)   # 'hangman' | 'rps'
    result     = db.Column(db.String(10), nullable=False)   # 'win' | 'loss' | 'draw'
    detail     = db.Column(db.String(200))
    played_at  = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# ─── Helpers ──────────────────────────────────────────────────────────────────

def make_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


def current_user():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    token = auth.split(' ', 1)[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return User.query.get(data['user_id'])
    except Exception:
        return None


def require_auth(fn):
    from functools import wraps
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = current_user()
        if not user:
            return jsonify({'error': 'Unauthorized'}), 401
        return fn(user, *args, **kwargs)
    return wrapper

# ─── Auth Routes ──────────────────────────────────────────────────────────────

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json or {}
    username = (data.get('username') or '').strip()
    email    = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    if len(password) < 4:
        return jsonify({'error': 'Password must be at least 4 characters'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already taken'}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    avatars = ['👑', '🎯', '🃏', '🎲', '🏆', '🦁', '🐉', '⚡']
    user = User(
        username=username,
        email=email,
        password=generate_password_hash(password),
        avatar=random.choice(avatars)
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'token': make_token(user.id), 'user': user_dict(user)}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    return jsonify({'token': make_token(user.id), 'user': user_dict(user)})


@app.route('/api/me', methods=['GET'])
@require_auth
def me(user):
    return jsonify({'user': user_dict(user)})


@app.route('/api/me/avatar', methods=['PUT'])
@require_auth
def update_avatar(user):
    data = request.json or {}
    emoji = data.get('avatar', '').strip()
    if not emoji:
        return jsonify({'error': 'Avatar required'}), 400
    user.avatar = emoji
    db.session.commit()
    return jsonify({'user': user_dict(user)})

# ─── Stats helper ─────────────────────────────────────────────────────────────

def user_dict(user):
    records = GameRecord.query.filter_by(user_id=user.id).all()
    wins   = sum(1 for r in records if r.result == 'win')
    losses = sum(1 for r in records if r.result == 'loss')
    draws  = sum(1 for r in records if r.result == 'draw')
    total  = len(records)
    win_pct = round((wins / total * 100), 1) if total else 0

    hm_wins = sum(1 for r in records if r.game_type == 'hangman' and r.result == 'win')
    rps_wins = sum(1 for r in records if r.game_type == 'rps' and r.result == 'win')

    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'avatar': user.avatar,
        'created_at': user.created_at.isoformat(),
        'stats': {
            'total': total,
            'wins': wins,
            'losses': losses,
            'draws': draws,
            'win_pct': win_pct,
            'hangman_wins': hm_wins,
            'rps_wins': rps_wins,
        }
    }

# ─── Game Routes ──────────────────────────────────────────────────────────────

HANGMAN_WORDS = [
    'python', 'javascript', 'react', 'flask', 'database',
    'keyboard', 'challenge', 'tricky', 'champion', 'victory',
    'adventure', 'mystery', 'galaxy', 'dragon', 'wizard',
    'abhishek', 'jathin', 'poojith', 'thunder', 'diamond'
]


@app.route('/api/hangman/new', methods=['GET'])
@require_auth
def hangman_new(user):
    word = random.choice(HANGMAN_WORDS)
    return jsonify({'word_length': len(word), 'word_id': word})   # word sent to client only for game logic; masked in display


@app.route('/api/hangman/result', methods=['POST'])
@require_auth
def hangman_result(user):
    data   = request.json or {}
    result = data.get('result')    # 'win' | 'loss'
    word   = data.get('word', '')
    lives  = data.get('lives_left', 0)

    if result not in ('win', 'loss'):
        return jsonify({'error': 'Invalid result'}), 400

    record = GameRecord(
        user_id=user.id,
        game_type='hangman',
        result=result,
        detail=f"Word: {word} | Lives left: {lives}"
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({'message': 'Saved', 'stats': user_dict(user)['stats']})


@app.route('/api/rps/play', methods=['POST'])
@require_auth
def rps_play(user):
    data        = request.json or {}
    user_choice = data.get('choice')   # 0=rock, 1=paper, 2=scissors
    if user_choice not in (0, 1, 2):
        return jsonify({'error': 'Invalid choice'}), 400

    computer_choice = random.randint(0, 2)
    names = ['Rock', 'Paper', 'Scissors']

    if user_choice == computer_choice:
        result = 'draw'
    elif (user_choice == 0 and computer_choice == 2) or \
         (user_choice == 1 and computer_choice == 0) or \
         (user_choice == 2 and computer_choice == 1):
        result = 'win'
    else:
        result = 'loss'

    record = GameRecord(
        user_id=user.id,
        game_type='rps',
        result=result,
        detail=f"You: {names[user_choice]} | CPU: {names[computer_choice]}"
    )
    db.session.add(record)
    db.session.commit()

    return jsonify({
        'computer_choice': computer_choice,
        'result': result,
        'stats': user_dict(user)['stats']
    })


# ─── History Routes ───────────────────────────────────────────────────────────

@app.route('/api/history', methods=['GET'])
@require_auth
def history(user):
    game_type = request.args.get('game')   # optional filter
    page      = int(request.args.get('page', 1))
    per_page  = 10

    q = GameRecord.query.filter_by(user_id=user.id)
    if game_type in ('hangman', 'rps'):
        q = q.filter_by(game_type=game_type)
    q = q.order_by(GameRecord.played_at.desc())

    total   = q.count()
    records = q.offset((page - 1) * per_page).limit(per_page).all()

    return jsonify({
        'total': total,
        'page': page,
        'pages': (total + per_page - 1) // per_page,
        'records': [
            {
                'id': r.id,
                'game_type': r.game_type,
                'result': r.result,
                'detail': r.detail,
                'played_at': r.played_at.isoformat()
            } for r in records
        ]
    })


@app.route('/api/leaderboard', methods=['GET'])
def leaderboard():
    users = User.query.all()
    board = []
    for u in users:
        wins = GameRecord.query.filter_by(user_id=u.id, result='win').count()
        total = GameRecord.query.filter_by(user_id=u.id).count()
        board.append({
            'username': u.username,
            'avatar': u.avatar,
            'wins': wins,
            'total': total,
            'win_pct': round(wins / total * 100, 1) if total else 0
        })
    board.sort(key=lambda x: (-x['wins'], -x['win_pct']))
    return jsonify({'leaderboard': board[:10]})


# ─── Bootstrap ────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("\n  👑 Tricky King is running!")
    print("  Open your browser at:  http://localhost:5000\n")
    app.run(debug=False, port=5000)

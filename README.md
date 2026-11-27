<div align="center">

# 👑 TRICKY KING

### *Two games. One throne. Prove you're the trickiest of them all.*

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

<br/>

> Built from two raw Python scripts — **`tricky.py`** (Hangman) and **`rockpapersgame.py`** (Rock Paper Scissors) —  
> evolved into a full-stack web application with user profiles, win history, and a live leaderboard.

<br/>

```
  +---+          🪨  📄  ✂️
  |   |
  O   |       YOU vs THE MACHINE
 /|\  |
 / \  |       WHO WEARS THE CROWN?
=========
```

</div>

---

## 🎮 Games Inside

<table>
<tr>
<td width="50%">

### 🎭 Hangman
Guess the hidden word **letter by letter** before the man gets hanged.

- 6 lives per round
- 20-word pool (names, tech, fantasy)
- Full ASCII art gallows
- Click buttons **or** use your keyboard
- Each game saved to your profile

</td>
<td width="50%">

### ✊ Rock Paper Scissors
The classic hand game — **you vs the CPU**, every round tracked.

- Instant win / loss / draw detection
- 🔥 Win streak counter
- Session stats (wins, games, streak)
- Every round logged to history
- Leaderboard impact on every play

</td>
</tr>
</table>

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **Auth System** | Register, login, JWT tokens, bcrypt password hashing |
| 👤 **User Profile** | Custom avatar picker with 12 emoji options |
| 📊 **Live Stats** | Wins, losses, draws, win rate, per-game breakdown |
| 📜 **Game History** | Paginated log of every match — filterable by game type |
| 🏆 **Leaderboard** | Top 10 players ranked by wins with 🥇🥈🥉 medals |
| 🔥 **Win Streak** | Real-time streak tracker in RPS |
| 📱 **Responsive** | Works on desktop and mobile |
| ⚡ **Zero Install** | Single HTML file — open in any browser, no npm needed |

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────┐
│                    TRICKY KING                      │
├───────────────────────┬─────────────────────────────┤
│      FRONTEND         │         BACKEND             │
│                       │                             │
│  React 18 (CDN)       │  Python + Flask 3.0         │
│  Babel Standalone     │  Flask-SQLAlchemy           │
│  Hash-based Router    │  SQLite Database            │
│  CSS Variables        │  PyJWT (Auth Tokens)        │
│  Orbitron Font        │  Werkzeug (Passwords)       │
│  Fetch API            │  Flask-CORS                 │
└───────────────────────┴─────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip

### 1. Clone the repo

```bash
git clone https://github.com/ModiAbhishek/tricky-king.git
cd tricky-king
```

### 2. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Run

```bash
python app.py
```

### 4. Open your browser

```
http://localhost:5000
```

That's it. The database is created automatically on first run. 🎉

> **Windows users** — just double-click `start_backend.bat` and it handles everything.

---

## 📁 Project Structure

```
tricky-king/
│
├── 📄 tricky_king.html          ← Full frontend (single file, no build needed)
├── 📄 start_backend.bat         ← One-click launcher for Windows
│
├── 📂 backend/
│   ├── 🐍 app.py                ← Flask API — auth, games, history, leaderboard
│   ├── 📄 requirements.txt
│   └── 🗄️  trickyking.db        ← SQLite (auto-created on first run)
│
└── 📂 frontend/                 ← Full Vite + React source (optional dev setup)
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   ├── History.jsx
    │   │   ├── HangmanGame.jsx
    │   │   ├── RPSGame.jsx
    │   │   └── Leaderboard.jsx
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── AuthContext.jsx
    │   └── api.js
    └── package.json
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | ❌ | Create account |
| `POST` | `/api/login` | ❌ | Login + get token |
| `GET` | `/api/me` | ✅ | Get current user + stats |
| `PUT` | `/api/me/avatar` | ✅ | Update avatar emoji |
| `GET` | `/api/hangman/new` | ✅ | Start a new hangman game |
| `POST` | `/api/hangman/result` | ✅ | Save hangman result |
| `POST` | `/api/rps/play` | ✅ | Play an RPS round |
| `GET` | `/api/history` | ✅ | Get paginated game history |
| `GET` | `/api/leaderboard` | ❌ | Get top 10 players |

---

## 🎯 Origin Story

This project started as two simple Python terminal scripts:

```python
# tricky.py — a hangman game that ran in the console
choice = random.choice(['abhishek', 'jathin', 'poojith'])
guess = input("Guess a letter: ").lower()
```

```python
# rockpapersgame.py — a one-round RPS game
user_choice = int(input("0 for Rock, 1 for Paper, 2 for Scissors: "))
computer_choice = random.randint(0, 2)
```

They became **Tricky King** — a full web platform with accounts, history, and leaderboards.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 👨‍💻 Author

**Modi Abhishek**  
📧 abhishekmodi051@gmail.com  
Built with 🔥 and Python

---

<div align="center">

*If you made it to the leaderboard — you earned the crown.* 👑

</div>

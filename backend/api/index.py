# Vercel WSGI entrypoint — imports the Flask app and initialises the DB.
# Vercel looks for a callable named `app` in this file.

import sys
import os

# Make sure the backend root is on the path so `from app import app` works
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app import app, db

# Create tables on cold start (safe to call repeatedly)
with app.app_context():
    db.create_all()

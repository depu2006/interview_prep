#!/usr/bin/env bash
# setup.sh — One-time setup for Why Did You Reject Me? — Module 1

set -e

echo "🚀 Setting up Why Did You Reject Me? — Module 1"
echo "================================================"

# Backend
echo "\n📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Frontend
echo "\n📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Python venv
echo "\n🐍 Setting up Python virtual environment..."
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo "✅ Python dependencies installed"

echo "\n✅ Setup complete!"
echo "\nTo start the app, open 3 terminals:"
echo "  Terminal 1 (ML):       cd ml-service && source venv/bin/activate && python app.py"
echo "  Terminal 2 (Backend):  cd backend && npm run dev"
echo "  Terminal 3 (Frontend): cd frontend && npm run dev"
echo "\nThen open http://localhost:5173 in your browser."

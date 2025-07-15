# 📝 JournalWithAI

**JournalWithAI** is a journaling web application enhanced with AI features to help you reflect, track, and grow daily. It allows users to write entries, summarize their day, get inspirational feedback, and store journal data locally with backend support.

## 🚀 Features

- ✍️ Write daily journal entries
- 💡 AI-generated reflections and motivational feedback
- 🔍 Search and filter past entries
- 📂 JSON-based backend to persist data
- 🧠 Thoughtful templates: Wins, Inspirations, Quotes, Emotions, and more
- 📦 React frontend + Node.js backend

## 🗂️ Project Structure

JournalWithAI/
├── backend/ # Node.js backend (handles API & storage)
│ ├── index.js
│ ├── entries.json
│ └── .env # Environment variables (not committed)
├── final/ # React frontend
│ └── src/
├── .gitignore
├── README.md
└── package.json

## 🛠️ Getting Started

# Clone the repository

git clone https://github.com/your-username/JournalWithAI.git

# Install dependencies
cd JournalWithAI
cd backend
npm install

cd ../final
npm install

# Start the apps
cd backend
node index.js

cd final
npm start

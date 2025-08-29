#!/bin/bash

echo "🚀 Starting App-Ocalypse Competition Setup..."
echo "========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js which includes npm."
    exit 1
fi

# Install dependencies
echo -e "\n📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check the error above."
    exit 1
fi

# Make shell scripts executable
chmod +x setup-competition-branches.sh competition-verification.sh

# Setup competition branches
echo -e "\n🔄 Setting up competition branches..."
./setup-competition-branches.sh
if [ $? -ne 0 ]; then
    echo "❌ Failed to set up competition branches."
    exit 1
fi

# Verify setup
echo -e "\n🔍 Verifying setup..."
./competition-verification.sh
if [ $? -ne 0 ]; then
    echo "⚠️  Some verification checks failed. The competition can still proceed, but some features might not work as expected."
fi

echo -e "\n========================================="
echo "🎉 App-Ocalypse Competition Setup Complete!"
echo "========================================="
echo -e "\n📋 What to do next:"
echo "1. Start the server: npm start"
echo "2. Open http://localhost:3000 in your browser"
echo "3. For Wave 0 (beginner): git checkout wave-0"
echo "4. For full challenge: git checkout bonus-bugs"
echo -e "\n🚀 Good luck and happy hacking!"

exit 0

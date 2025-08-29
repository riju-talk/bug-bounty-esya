# App-Ocalypse: Bug Bounty E-commerce Challenge

A deliberately vulnerable e-commerce application designed for security training and bug bounty practice. This project contains multiple security vulnerabilities and functional bugs of varying difficulty levels, organized into waves of increasing complexity.

## Features

- **Multiple Vulnerability Types**: XSS, CSRF, IDOR, Prototype Pollution, and more
- **Progressive Difficulty**: Bugs organized into waves from easy to expert level
- **Real-world Scenarios**: Realistic vulnerabilities found in production applications
- **Training Platform**: Perfect for security training and CTF challenges

## Challenge Waves

1. **Wave 0**: 8 bugs (115 points) - Easy warm-up round
2. **Wave 1**: 9 additional bugs (155 points) - Complex functional issues
3. **Wave 2**: 9 critical security bugs (285 points) - Security vulnerabilities
4. **Wave 3**: 10 expert-level bugs (395 points) - Advanced exploitation required
5. **Bonus Round**: All 46 bugs (1,285 points) - Ultimate challenge

## Project Structure

```
├── data/               # Product and category data
├── img/                # Product images and assets
├── js/                 # JavaScript source files
│   ├── security-issues.js  # Security vulnerabilities
│   ├── products.js     # Product and cart logic
│   ├── countdown.js    # Marketing countdown timer
│   └── ...
├── scss/              # Stylesheets (SASS)
├── views/             # HTML templates (LiquidJS)
├── server.js          # Express server
└── package.json       # Project dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ and npm 6+
- Git (for version control)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bug-bounty-esya.git
   cd bug-bounty-esya
   ```

2. Run the setup script:

   #### Windows:
   ```cmd
   start-competition.bat
   ```

   #### Linux/macOS:
   ```bash
   chmod +x start-competition.sh
   ./start-competition.sh
   ```

   This will:
   - Install all dependencies
   - Set up the competition branches
   - Verify the installation

### Running the Application

1. Start the development server with live reload:
   ```bash
   npm start
   ```
   or
   ```bash
   gulp
   ```

2. For production build:
   ```bash
   npm run build
   ```

3. Open `http://localhost:3000` in your browser

### Competition Waves

Switch between competition waves using git:

```bash
# Beginner level (8 bugs)
git checkout wave-0

# Intermediate level (17 bugs)
git checkout wave-1

# Advanced level (26 bugs)
git checkout wave-2

# Expert level (36 bugs)
git checkout wave-3

# All bugs (46 bugs)
git checkout bonus-bugs
```

### Verification

To verify all bugs are properly set up:

#### Windows:
```cmd
competition-verification.bat
```

#### Linux/macOS:
```bash
./competition-verification.sh
```

## Verifying Bugs

To verify all bugs are present and properly configured:

```bash
npm run verify
```

This will run the verification script that checks for all vulnerabilities.

## Security Considerations

 **WARNING**: This application is intentionally vulnerable and should NEVER be deployed to a public-facing server. Use only in a controlled environment for security training and testing purposes.

## Documentation

For detailed information about each vulnerability and how to exploit them, see the [WAVE-X-BUGS.md](WAVE-X-BUGS.md) files in the repository.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deploy Vercel

Build Command
```bash
gulp dist
```

Output Directory
```bash
dist
```

## Installation

```bash
git clone https://github.com/hey-fk/vanilla-js-ecommerce
cd vanilla-js-ecommerce
npm install or yarn install
```

## Start the server

```bash
gulp
```

Now enter [`localhost:3000`](http://localhost:3000) in the address bar of your browser.

## Dist Folder

```bash
gulp dist
```

Production files will be prepared in /dist folder.

## Deploy Vercel

Build Command
```bash
gulp dist
```

Output Directory
```bash
dist
```

## Contributing

Did you found a bug or got an idea for a new feature? Feel free to use the [issue tracker](https://github.com/hey-fk/vanilla-js-ecommerce/issues) to let me know. Or make directly a [pull request](https://github.com/hey-fk/vanilla-js-ecommerce/pulls).

## License

This template is released under the MIT License.
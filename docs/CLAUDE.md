# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Web IDE Display is a web-based IDE interface that enables AI-driven development to be visualized in real-time. It simulates a human-like coding experience where an AI agent writes and edits code within a browser-based IDE.

### Architecture

- **Frontend**: Next.js + TypeScript + TailwindCSS + Monaco Editor
- **Backend**: Node.js with REST API and WebSocket servers
- **AI Integration**: MCP (Master Control Program) Server for AI command processing

```
Browser Client (Next.js) <--> Node.js Backend (REST + WebSocket) <--> AI Agent via MCP
```

### Repository Structure

```
├── frontend/      # Next.js app with Monaco-based IDE
│   ├── pages/
│   ├── components/
│   └── hooks/
├── backend/       # REST and WebSocket servers 
│   ├── api/
│   └── ws/
├── mcp/           # Master Control Program for AI instructions
│   └── actions/
├── scripts/
├── public/
└── .github/
```

## Development Commands

### Setup

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with necessary credentials

# Start development server
pnpm dev
```

### Build & Deploy

```bash
# Build the project
pnpm build

# Lint the codebase
pnpm lint

# Run tests
pnpm test

# Run specific test
pnpm test -- -t "test name"
```

## MCP Action API

The MCP server translates AI instructions into WebSocket messages that the frontend executes. Key actions include:

**Editor Actions**:
- `openFile(path)`
- `typeText(text, speed)`
- `deleteText(range)`
- `selectText(range)`
- `moveCursor(position)`
- `saveFile()`

**UI Actions**:
- `showThinking(duration)`
- `openPanel(panelId)`
- `highlightCode(range, type)`
- `executeCommand(cmd)`
- `showNotification(message)`

**System Actions**:
- `createFile(path, content)`
- `createDirectory(path)`
- `deleteFileOrDirectory(path)`
- `renameFileOrDirectory(oldPath, newPath)`
- `listDirectory(path)`

## Issue and Project Management

### Issue Guidelines

- Create detailed, focused issues for each task
- Follow proper issue templates when available
- Always assign issues to yourself when working on them
- Include clear acceptance criteria in each issue
- Reference related issues when applicable

### GitHub Project Board Usage

- All work must be tracked through GitHub Projects
- New issues start in "Todo" status
- Move issues to "In Progress" when actively working on them 
- Only work on one issue at a time for focus
- Move issues to "Done" when fully completed and reviewed
- Include relevant labels for categorization

## Git Workflow

- Create feature branches from `main`: `git checkout -b feature/<short-desc>`
- Use prefixes: `feature/`, `fix/`, `chore/`
- Follow conventional commits: `feat:`, `fix:`, `chore:`, etc.
- Open PRs against `main` with descriptive titles
- Reference issues in PR descriptions: `Closes #42`

## Important Development Guidelines

- Node.js v18+ and pnpm are required
- All code should be TypeScript with proper typing
- Follow the existing modular architecture
- Keep PRs small and focused on a single task
- Add tests for new functionality
- Ensure security considerations for any file operations
- Always follow the development guidelines in `DEVELOPMENT_GUIDELINES.md`
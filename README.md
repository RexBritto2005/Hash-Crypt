# Hash Encrypt Utility

A cyber-terminal aesthetic cryptographic hashing tool. Generate, verify, and inspect hashes for text and files using SHA-256, SHA-512, SHA-1, and MD5 — all via Node.js's built-in `crypto` module.

![Cyber Terminal Aesthetic](https://img.shields.io/badge/design-cyber--terminal-00ffcc?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Express-4ae176?style=flat-square)

## Features

- **Hash Generator** — Hash any text with optional salt, copy output instantly
- **Hash Verifier** — Compare plaintext against an existing hash to validate integrity
- **File Hasher** — Drag-and-drop file hashing, download result as `.txt`
- **Algorithm Info** — Visual overview of MD5, SHA-1, SHA-256, SHA-512 with security ratings
- **History** — Live session log of all hash operations with copy and clear controls

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Backend | Node.js, Express 4 |
| Hashing | Node.js built-in `crypto` module |
| HTTP client | Axios |
| Routing | React Router v6 |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
# Install all dependencies (backend + frontend)
npm run install:all
```

Or manually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Run in Development

Open two terminals:

**Terminal 1 — Backend (port 3001)**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (port 5173)**
```bash
cd frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
npm run build
```

Output goes to `frontend/dist/`.

## Project Structure

```
hash-encrypt-utility/
├── backend/
│   ├── routes/
│   │   └── hash.js        # All API endpoints
│   ├── server.js          # Express app entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx  # Top nav + side nav + footer shell
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── HashGenerator.jsx
│   │   │   ├── HashVerifier.jsx
│   │   │   ├── FileHasher.jsx
│   │   │   ├── AlgorithmInfo.jsx
│   │   │   └── History.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .gitignore
├── package.json           # Root convenience scripts
└── README.md
```

## API Reference

**Base URL:** `http://localhost:3001`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/hash/generate` | Generate hash for text |
| `POST` | `/api/hash/verify` | Verify text against a hash |
| `POST` | `/api/hash/file` | Hash an uploaded file |
| `GET` | `/api/history` | Get session history |
| `DELETE` | `/api/history` | Clear session history |

## Design System

Built on a **Cyber-Terminal** aesthetic — deep blacks, cyan glow accents (`#00ffcc`), and green functional states (`#4ae176`). Full token set lives in `frontend/tailwind.config.js`.

- **Font:** Geist (UI) + JetBrains Mono (code/hash output)
- **Primary accent:** `#00ffcc` (cyan)
- **Success:** `#4ae176` (green)
- **Error:** `#ffb4ab` (red)
- **Background:** `#131313`

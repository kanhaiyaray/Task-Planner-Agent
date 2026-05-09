# Task Planner Agent

An AI-powered task planning app that breaks big goals into actionable phases and tasks, powered by **Groq** (free, fast inference).

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express (API proxy — keeps API key server-side)
- **LLM**: Groq — `llama-3.3-70b-versatile`
- **State**: React hooks + JSON
- **Prompting**: System prompts + role-based prompting

## 🧠 **LLM** (the actual “brain”)

     -llama-3.3-70b-versatile → this is the LLM
     -Created by Meta (Llama family)
     -It’s the model that understands prompts and generates responses

## ⚡ **Groq** (the serving/inference layer)

   Groq provides:
     Ultra-fast inference (low latency responses) & API to access models like Llama

    Think of it like: “The engine that runs the brain really fast”

## Project Structure

```
task-planner-agent/
├── server.js                  # Express proxy → Groq API
├── vite.config.js             # Vite + /api proxy to Express
├── index.html                 # HTML entry (Google Fonts in <head>)
├── .env.example               # Environment variable template
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Root + server health check
    ├── index.css              # Global styles + @keyframes
    ├── constants/index.js     # MODEL, SYSTEM_PROMPT, UI configs
    ├── hooks/usePlanAgent.js  # All API + state logic
    └── components/
        ├── Header.jsx
        ├── GoalInput.jsx
        ├── ErrorBanner.jsx    # Contextual error hints for Groq errors
        ├── AgentLog.jsx
        ├── TabBar.jsx
        ├── ProgressHeader.jsx
        ├── TaskItem.jsx
        ├── PhaseCard.jsx
        ├── TipsPanel.jsx
        ├── PlanView.jsx
        ├── JsonView.jsx
        └── LogView.jsx
```

## Quick Start

### 1. Get a free Groq API key

Go to https://console.groq.com/keys and create a key. It's free.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set your key:

```
GROQ_API_KEY=gsk_your_key_here
```

### 4. Run

```bash
npm run dev
```

Starts two servers concurrently:
- **Vite** dev server → http://localhost:5173
- **Express** proxy  → http://localhost:3001

Open http://localhost:5173 in your browser.

## How It Works

```
Browser → POST /api/messages (Vite proxy)
       → Express server (attaches GROQ_API_KEY)
       → https://api.groq.com/openai/v1/chat/completions
       → llama-3.3-70b-versatile
       → JSON plan → React renders phases + tasks
```

The API key never leaves the server. The frontend only talks to `localhost:3001`.

## Groq vs Anthropic (migration notes)

| | Anthropic | Groq |
|---|---|---|
| Auth header | `x-api-key` | `Authorization: Bearer` |
| Endpoint | `/v1/messages` | `/openai/v1/chat/completions` |
| System prompt | Top-level `system` field | `messages[0]` with `role:"system"` |
| Response path | `content[0].text` | `choices[0].message.content` |
| JSON mode | Manual (strip fences) | `response_format: {type:"json_object"}` |

## Bugs Fixed (Groq migration)

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `constants/index.js` | MODEL was `claude-sonnet-4-6` — Groq rejects unknown models | Changed to `llama-3.3-70b-versatile` |
| 2 | `server.js` | `x-api-key` + `anthropic-version` headers — Groq returns 401 | Replaced with `Authorization: Bearer` |
| 3 | `server.js` | Endpoint was `api.anthropic.com/v1/messages` | Changed to `api.groq.com/openai/v1/chat/completions` |
| 4 | `server.js` | Read `ANTHROPIC_API_KEY` env var | Changed to `GROQ_API_KEY` |
| 5 | `usePlanAgent.js` | Request had top-level `system` field (Anthropic format) | Moved to `messages[0]` (OpenAI/Groq format) |
| 6 | `usePlanAgent.js` | Response parsed at `data.content[0].text` (Anthropic path) | Fixed to `data.choices[0].message.content` (Groq path) |
| 7 | `usePlanAgent.js` | No `response_format` — model could return fenced markdown JSON | Added `response_format: {type:"json_object"}` |
| 8 | `ErrorBanner.jsx` | Hints mentioned `ANTHROPIC_API_KEY`, `console.anthropic.com` | All hints rewritten for Groq errors |
| 9 | `.env.example` | Listed `ANTHROPIC_API_KEY` | Replaced with `GROQ_API_KEY` |

## Production Build

```bash
npm run build
NODE_ENV=production GROQ_API_KEY=gsk_... node server.js
```

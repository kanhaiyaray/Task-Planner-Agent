import "dotenv/config";
import express from "express";
import cors    from "cors";
import fetch   from "node-fetch";
import path    from "path";
import { fileURLToPath } from "url";

const __dirname      = path.dirname(fileURLToPath(import.meta.url));
const app            = express();
const DEFAULT_PORT   = process.env.PORT || 3001;

// ── CORS with multi‑origin support ─────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin} not allowed`));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));

// Groq API endpoint
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  const hasKey = !!process.env.GROQ_API_KEY;
  res.status(hasKey ? 200 : 503).json({
    ok:     hasKey,
    server: "task-planner-agent",
    model:  "llama-3.3-70b-versatile",
    error:  hasKey ? null : "GROQ_API_KEY is not set in your .env file",
  });
});

// ── Groq proxy ────────────────────────────────────────────────────────────────
app.post("/api/messages", async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GROQ_API_KEY is not set. Copy .env.example → .env and add your key.",
    });
  }

  const { model, messages, max_tokens } = req.body;
  if (!model || !Array.isArray(messages) || messages.length === 0 || !max_tokens) {
    return res.status(400).json({
      error: "Request body must include: model (string), messages (non-empty array), max_tokens (number).",
    });
  }

  const hasSystemMsg = messages.some((m) => m.role === "system");
  if (!hasSystemMsg) {
    return res.status(400).json({
      error: "messages array must contain a { role: 'system', content: '...' } entry.",
    });
  }

  try {
    const upstream = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    let data;
    try {
      data = await upstream.json();
    } catch {
      return res.status(502).json({
        error: `Groq returned a non-JSON response (HTTP ${upstream.status})`,
      });
    }

    if (!upstream.ok) {
      const groqMsg = data?.error?.message || data?.error || JSON.stringify(data);
      console.error(`[groq ${upstream.status}]`, groqMsg);
      return res.status(upstream.status).json({
        error:            groqMsg,
        _upstream_status: upstream.status,
        _upstream_body:   data,
      });
    }

    res.json(data);
  } catch (err) {
    console.error("[proxy error]", err.message);
    res.status(502).json({ error: `Proxy failed: ${err.message}` });
  }
});

// ── Production static serving ─────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (_req, res) =>
    res.sendFile(path.join(__dirname, "dist", "index.html"))
  );
}

// ── Auto port fallback (tries next ports if busy) ────────────────────────────
function startServer(port) {
  const server = app.listen(port, () => {
    const actualPort = server.address().port;
    console.log(`[server] http://localhost:${actualPort}`);
    console.log(`[server] CORS allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`[server] Groq API key: ${process.env.GROQ_API_KEY ? "✓ set" : "✗ MISSING — add GROQ_API_KEY to .env"}`);
    console.log(`[server] Groq endpoint: ${GROQ_API_URL}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[server] Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[server error]', err);
    }
  });
}

startServer(DEFAULT_PORT);
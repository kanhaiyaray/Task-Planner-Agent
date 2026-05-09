const mono = "'IBM Plex Mono', 'Courier New', monospace";
const sans = "'IBM Plex Sans', sans-serif";

// Bug fix: all hints previously mentioned ANTHROPIC_API_KEY / console.anthropic.com
function getHint(message) {
  if (!message) return null;
  const m = message.toLowerCase();
  if (m.includes("invalid api key") || m.includes("authentication") || m.includes("unauthorized") || m.includes("401"))
    return "Your GROQ_API_KEY looks wrong. Double-check it in your .env file.";
  if (m.includes("rate limit") || m.includes("429"))
    return "Groq rate limit hit. Wait a few seconds and try again.";
  if (m.includes("credit") || m.includes("billing") || m.includes("quota") || m.includes("402"))
    return "Your Groq account may be out of credits. Visit console.groq.com.";
  if (m.includes("model") && (m.includes("not found") || m.includes("invalid") || m.includes("404")))
    return "The model name in constants/index.js is invalid. Check MODEL value — e.g. llama-3.3-70b-versatile.";
  if (m.includes("timed out"))
    return "The server took too long. Check your network or try a simpler goal.";
  if (m.includes("groq_api_key") || m.includes("not set") || m.includes("missing"))
    return "Run the Express server with GROQ_API_KEY set in your .env file.";
  if (m.includes("cannot reach") || m.includes("econnrefused") || m.includes("proxy failed"))
    return "Express server is not running. Start it with: npm run dev";
  if (m.includes("json"))
    return "The model returned malformed JSON. Try rephrasing your goal.";
  return null;
}

export default function ErrorBanner({ message }) {
  if (!message) return null;
  const hint = getHint(message);

  return (
    <div style={{
      background: "#fef2f2",
      border: "0.5px solid #fecaca",
      borderRadius: 8,
      padding: "12px 14px",
      marginBottom: "1rem",
    }}>
      <div style={{ fontSize: 13, color: "#dc2626", fontFamily: mono, marginBottom: hint ? 6 : 0 }}>
        ✗ {message}
      </div>
      {hint && (
        <div style={{ fontSize: 12, color: "#b91c1c", fontFamily: sans }}>
          → {hint}
        </div>
      )}
    </div>
  );
}

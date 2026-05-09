// ── Header.jsx ───────────────────────────────────────────────────────────────
const mono = "'IBM Plex Mono', 'Courier New', monospace";
const sans = "'IBM Plex Sans', sans-serif";

export default function Header({ loading, hasPlan }) {
  const dotColor = loading ? "#f59e0b" : hasPlan ? "#22c55e" : "#d1d5db";

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, transition: "background 0.3s" }} />
        <span style={{ fontSize: 11, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: mono }}>
          Task Planner Agent v1.0
        </span>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, fontFamily: sans, color: "#111111" }}>
        Goal → Action Plan
      </h1>
      <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0", fontFamily: sans }}>
        Break any big goal into phases, tasks, and priorities using AI
      </p>
    </div>
  );
}

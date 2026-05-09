import { EXAMPLE_GOALS } from "../constants";

const mono = "'IBM Plex Mono', 'Courier New', monospace";

export default function GoalInput({ value, onChange, onSubmit, loading, hasPlan, disabled }) {
  const isBlocked = loading || disabled;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isBlocked || !value.trim()) return;
      onSubmit();
    }
  };

  return (
    <div style={{
      background: "#ffffff",
      border: "0.5px solid #e5e7eb",
      borderRadius: 12,
      padding: "1.25rem",
      marginBottom: "1rem",
      opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.2s",
    }}>
      <label
        htmlFor="goal-input"
        style={{
          fontSize: 11, color: "#9ca3af",
          letterSpacing: "0.1em", textTransform: "uppercase",
          display: "block", marginBottom: 8, fontFamily: mono,
        }}
      >
        Your Goal
      </label>

      <textarea
        id="goal-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Build and launch a SaaS product in 90 days..."
        rows={2}
        disabled={isBlocked}
        aria-label="Enter your goal"
        style={{ fontFamily: mono, fontSize: 14, cursor: isBlocked ? "not-allowed" : "text" }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={onSubmit}
          disabled={isBlocked || !value.trim()}
          aria-busy={loading}
          style={{
            fontFamily: mono, fontSize: 13, padding: "6px 18px",
            background: isBlocked || !value.trim() ? "#f3f4f6" : "#111111",
            color:      isBlocked || !value.trim() ? "#9ca3af" : "#ffffff",
            border: "0.5px solid #e5e7eb",
            borderRadius: 8, fontWeight: 500,
          }}
        >
          {loading ? "Planning..." : "→ Generate Plan"}
        </button>
        <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: mono }}>
          ↵ enter
        </span>
      </div>

      {!hasPlan && !isBlocked && (
        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {EXAMPLE_GOALS.map((g) => (
            <button
              key={g}
              onClick={() => onChange(g)}
              style={{
                fontSize: 11, padding: "4px 10px", fontFamily: mono,
                borderRadius: 8, background: "#f9fafb",
                border: "0.5px solid #e5e7eb", color: "#6b7280",
              }}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

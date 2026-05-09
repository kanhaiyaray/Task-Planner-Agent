const mono = "'IBM Plex Mono', 'Courier New', monospace";
const sans = "'IBM Plex Sans', sans-serif";

export default function ProgressHeader({ goal, summary, progress }) {
  return (
    <div style={{
      background: "#ffffff", border: "0.5px solid #e5e7eb",
      borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem",
    }}>
      <div style={{
        fontFamily: sans, fontSize: 15, fontWeight: 500,
        color: "#111111", marginBottom: 4,
      }}>
        {goal}
      </div>
      <div style={{ fontSize: 13, color: "#6b7280", fontFamily: sans, marginBottom: 12 }}>
        {summary}
      </div>

      {/* Fix: aria attributes so screen readers can announce progress */}
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Plan progress: ${progress}%`}
        style={{ height: 4, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}
      >
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: progress === 100 ? "#22c55e" : "#111111",
          borderRadius: 4,
          transition: "width 0.4s ease",
        }} />
      </div>

      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, fontFamily: mono }}>
        {progress}% complete{progress === 100 ? " — all done!" : ""}
      </div>
    </div>
  );
}

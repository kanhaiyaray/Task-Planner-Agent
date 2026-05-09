const mono = "'IBM Plex Mono', 'Courier New', monospace";
const sans = "'IBM Plex Sans', sans-serif";

export default function TipsPanel({ tips }) {
  if (!tips?.length) return null;

  return (
    // Fix: removed borderRadius from element with borderLeft — broken rounded corners on single-sided border
    // Using a wrapper+inner pattern instead: outer has left accent, inner has the border-radius
    <div style={{
      marginTop: "0.75rem",
      borderLeft: "2px solid #111111",
      borderRadius: 0,       // no radius on the accentuated element
      paddingLeft: 0,
    }}>
      <div style={{
        background: "#fafafa",
        border: "0.5px solid #e5e7eb",
        borderLeft: "none",  // left side is the parent accent
        borderRadius: "0 8px 8px 0",
        padding: "1rem 1.25rem",
      }}>
        <div style={{
          fontSize: 11, color: "#9ca3af", letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 8, fontFamily: mono,
        }}>
          Agent Tips
        </div>

        {tips.map((tip, i) => (
          <div key={i} style={{
            fontSize: 13, color: "#6b7280", marginBottom: i < tips.length - 1 ? 8 : 0,
            fontFamily: sans, display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            <span style={{ color: "#9ca3af", fontFamily: mono, flexShrink: 0, marginTop: 1 }}>
              {i + 1}.
            </span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

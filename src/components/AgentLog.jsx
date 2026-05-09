import { useEffect, useRef } from "react";

const mono = "'IBM Plex Mono', 'Courier New', monospace";

function LogLine({ entry }) {
  const isError = entry.msg.startsWith("Error:");
  return (
    <div style={{
      fontSize: 12, fontFamily: mono,
      color: isError ? "#dc2626" : "#6b7280",
      marginBottom: 4, display: "flex", gap: 10,
    }}>
      <span style={{ color: "#9ca3af", minWidth: 65, flexShrink: 0 }}>{entry.time}</span>
      <span>{entry.msg}</span>
    </div>
  );
}

function PulseDots() {
  return (
    <div style={{ display: "flex", gap: 4, marginTop: 8 }} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#d1d5db",
          animation: `pulse 1.2s ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function AgentLog({ logs, visible }) {
  const bottomRef = useRef(null);

  // Fix: auto-scroll as new log lines arrive during loading
  useEffect(() => {
    if (visible) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, visible]);

  if (!visible) return null;

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Agent activity log"
      style={{
        background: "#ffffff", border: "0.5px solid #e5e7eb",
        borderRadius: 12, padding: "1.25rem", marginBottom: "1rem",
        maxHeight: 200, overflowY: "auto",
      }}
    >
      <div style={{
        fontSize: 11, color: "#9ca3af", letterSpacing: "0.1em",
        textTransform: "uppercase", marginBottom: 10, fontFamily: mono,
      }}>
        Agent Log
      </div>
      {logs.map((entry, i) => <LogLine key={i} entry={entry} />)}
      <PulseDots />
      {/* Fix: scroll sentinel */}
      <div ref={bottomRef} />
    </div>
  );
}

import { useEffect, useRef } from "react";

const mono = "'IBM Plex Mono', 'Courier New', monospace";

export default function LogView({ logs }) {
  const bottomRef = useRef(null);

  // Fix: auto-scroll to newest log entry when logs change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!logs.length) {
    return (
      <div style={{
        background: "#f9fafb", border: "0.5px solid #e5e7eb",
        borderRadius: 12, padding: "1rem",
        fontSize: 12, color: "#9ca3af", fontFamily: mono,
      }}>
        No log entries yet. Generate a plan to see agent activity.
      </div>
    );
  }

  return (
    <div style={{
      background: "#f9fafb", border: "0.5px solid #e5e7eb",
      borderRadius: 12, padding: "1rem",
      maxHeight: 320, overflowY: "auto",
    }}>
      {logs.map((entry, i) => (
        <div key={i} style={{
          fontSize: 12, fontFamily: mono, color: "#6b7280",
          marginBottom: 4, display: "flex", gap: 10,
        }}>
          <span style={{ color: "#9ca3af", minWidth: 65, flexShrink: 0 }}>
            {entry.time}
          </span>
          <span style={{
            color: entry.msg.startsWith("Error:") ? "#dc2626" : "#6b7280",
          }}>
            {entry.msg}
          </span>
        </div>
      ))}
      {/* Fix: invisible sentinel element to scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
}

const mono = "'IBM Plex Mono', 'Courier New', monospace";

export default function JsonView({ plan, completed, progress, totalTasks, doneCount }) {
  const snapshot = {
    ...plan,
    _state: {
      completed,
      progress: `${progress}%`,
      totalTasks,
      completedTasks: doneCount,
    },
  };

  return (
    <div style={{
      background: "#f9fafb",
      border: "0.5px solid #e5e7eb",
      borderRadius: 12,
      padding: "1rem",
      overflow: "auto",
      maxHeight: 480,
    }}>
      <pre style={{
        margin: 0,
        fontSize: 11,
        fontFamily: mono,
        color: "#6b7280",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}>
        {JSON.stringify(snapshot, null, 2)}
      </pre>
    </div>
  );
}

import TaskItem from "./TaskItem";

const mono = "'IBM Plex Mono', 'Courier New', monospace";
const sans = "'IBM Plex Sans', sans-serif";

export default function PhaseCard({ phase, index, isExpanded, completed, onTogglePhase, onToggleTask }) {
  const doneInPhase = phase.tasks.filter((t) => completed[t.id]).length;
  const allDone     = doneInPhase === phase.tasks.length;

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTogglePhase(phase.id);
    }
  };

  return (
    <div style={{
      background: "#ffffff",
      border: "0.5px solid #e5e7eb",
      borderRadius: 12,
      marginBottom: 8,
      overflow: "hidden",
    }}>
      {/* Phase header — Fix: div role=button (no outline:none), aria-expanded */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onTogglePhase(phase.id)}
        onKeyDown={handleKey}
        aria-expanded={isExpanded}
        aria-label={`Phase ${index + 1}: ${phase.title}, ${doneInPhase} of ${phase.tasks.length} tasks done`}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", cursor: "pointer",
          userSelect: "none",
          // Fix: removed outline:"none" — :focus-visible in index.css handles it
        }}
      >
        <span style={{
          fontSize: 11, color: "#9ca3af", fontFamily: mono, minWidth: 28, flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 500,
            color: allDone ? "#9ca3af" : "#111111",
            fontFamily: sans,
            textDecoration: allDone ? "line-through" : "none",
          }}>
            {phase.title}
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af", fontFamily: sans }}>
            {phase.description}
          </div>
        </div>

        {/* Progress counter */}
        <div style={{
          fontSize: 11, color: allDone ? "#22c55e" : "#9ca3af",
          fontFamily: mono, marginRight: 8, flexShrink: 0,
          fontWeight: allDone ? 500 : 400,
        }}>
          {doneInPhase}/{phase.tasks.length}
        </div>

        <span style={{ color: "#9ca3af", fontSize: 11, flexShrink: 0 }}>
          {isExpanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Task list */}
      {isExpanded && (
        <div style={{ borderTop: "0.5px solid #f3f4f6", padding: "4px 0" }}>
          {phase.tasks.map((task, ti) => (
            <TaskItem
              key={task.id}
              task={task}
              isDone={!!completed[task.id]}
              isLast={ti === phase.tasks.length - 1}
              onToggle={onToggleTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

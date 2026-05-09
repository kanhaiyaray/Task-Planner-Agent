import { PRIORITY_CONFIG, CATEGORY_ICONS, EFFORT_COLOR } from "../constants";

const mono = "'IBM Plex Mono', 'Courier New', monospace";
const sans = "'IBM Plex Sans', sans-serif";

export default function TaskItem({ task, isDone, isLast, onToggle }) {
  const priority    = PRIORITY_CONFIG[task.priority] ?? {};
  const effortColor = EFFORT_COLOR[task.effort]      ?? "#888";

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(task.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggle(task.id)}
      onKeyDown={handleKey}
      aria-pressed={isDone}
      aria-label={`${isDone ? "Undo" : "Complete"}: ${task.title}`}
      style={{
        display: "flex", gap: 12, padding: "10px 16px", cursor: "pointer",
        borderBottom: isLast ? "none" : "0.5px solid #f3f4f6",
        opacity: isDone ? 0.55 : 1, transition: "opacity 0.2s",
        alignItems: "flex-start",
        background: isDone ? "#f9fafb" : "transparent",
        // Fix: removed outline:"none" — focus ring now handled by index.css :focus-visible
      }}
    >
      {/* Checkbox */}
      <div style={{
        width: 16, height: 16, borderRadius: 3, flexShrink: 0, marginTop: 2,
        border: `0.5px solid ${isDone ? "#111111" : "#d1d5db"}`,
        background: isDone ? "#111111" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, color: "#ffffff",
        transition: "background 0.15s, border-color 0.15s",
      }}>
        {isDone && "✓"}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500, color: "#111111", fontFamily: sans,
          textDecoration: isDone ? "line-through" : "none",
          // Prevent long task titles overflowing container
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {task.title}
        </div>
        <div style={{
          fontSize: 12, color: "#6b7280", fontFamily: sans, marginTop: 2,
          // Allow description to wrap normally
          whiteSpace: "normal",
        }}>
          {task.description}
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 4,
            background: priority.bg, color: priority.color, fontFamily: mono,
          }}>
            {priority.label}
          </span>
          <span style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 4,
            background: "#f3f4f6", color: "#6b7280", fontFamily: mono,
            borderLeft: `2px solid ${effortColor}`,
          }}>
            {task.effort}
          </span>
          <span style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 4,
            background: "#f3f4f6", color: "#9ca3af", fontFamily: mono,
          }}>
            {CATEGORY_ICONS[task.category]} {task.category}
          </span>
        </div>
      </div>
    </div>
  );
}

import { TABS } from "../constants";

const mono = "'IBM Plex Mono', 'Courier New', monospace";

export default function TabBar({ activeTab, onTabChange, doneCount, totalTasks }) {
  return (
    <div style={{
      display: "flex",
      gap: 8,
      marginBottom: "1rem",
      borderBottom: "0.5px solid #e5e7eb",
    }}>
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          style={{
            fontSize: 12,
            padding: "6px 12px",
            fontFamily: mono,
            background: "transparent",
            border: "none",
            borderBottom: activeTab === tab
              ? "2px solid #111111"
              : "2px solid transparent",
            color: activeTab === tab ? "#111111" : "#9ca3af",
            cursor: "pointer",
            marginBottom: -0.5,
            fontWeight: activeTab === tab ? 500 : 400,
          }}
        >
          {tab}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <div style={{
        fontSize: 12,
        color: "#9ca3af",
        alignSelf: "center",
        fontFamily: mono,
      }}>
        {doneCount}/{totalTasks} done
      </div>
    </div>
  );
}

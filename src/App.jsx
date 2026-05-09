import { useEffect, useState } from "react";
import { usePlanAgent }  from "./hooks/usePlanAgent";
import Header            from "./components/Header";
import GoalInput         from "./components/GoalInput";
import ErrorBanner       from "./components/ErrorBanner";
import AgentLog          from "./components/AgentLog";
import TabBar            from "./components/TabBar";
import PlanView          from "./components/PlanView";
import JsonView          from "./components/JsonView";
import LogView           from "./components/LogView";

// Startup health check — tells user immediately if server/key is missing
function useServerHealth() {
  const [health, setHealth] = useState(null); // null=checking, true=ok, string=error

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setHealth(d.ok ? true : d.error))
      .catch(() => setHealth("Cannot reach the Express server. Run: npm run dev"));
  }, []);

  return health;
}

export default function App() {
  const health = useServerHealth();

  const {
    goalInput, setGoalInput,
    plan, loading, error,
    completed, expandedPhases,
    activeTab, setActiveTab,
    logs,
    totalTasks, doneCount, progress,
    generatePlan,
    toggleTask,
    togglePhase,
  } = usePlanAgent();

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      maxWidth: 720,
      margin: "0 auto",
      padding: "1.5rem 1rem",
    }}>
      <Header loading={loading} hasPlan={!!plan} />

      {/* Server health banner — shown once on load if server/key is broken */}
      {typeof health === "string" && (
        <ErrorBanner message={health} />
      )}

      <GoalInput
        value={goalInput}
        onChange={setGoalInput}
        onSubmit={generatePlan}
        loading={loading}
        hasPlan={!!plan}
        disabled={health !== true}
      />

      <ErrorBanner message={error} />

      <AgentLog logs={logs} visible={loading} />

      {plan && (
        <>
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            doneCount={doneCount}
            totalTasks={totalTasks}
          />

          {activeTab === "plan" && (
            <PlanView
              plan={plan}
              progress={progress}
              completed={completed}
              expandedPhases={expandedPhases}
              onTogglePhase={togglePhase}
              onToggleTask={toggleTask}
            />
          )}

          {activeTab === "json" && (
            <JsonView
              plan={plan}
              completed={completed}
              progress={progress}
              totalTasks={totalTasks}
              doneCount={doneCount}
            />
          )}

          {activeTab === "log" && (
            <LogView logs={logs} />
          )}
        </>
      )}
    </div>
  );
}

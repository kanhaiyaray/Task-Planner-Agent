import ProgressHeader from "./ProgressHeader";
import PhaseCard      from "./PhaseCard";
import TipsPanel      from "./TipsPanel";

export default function PlanView({
  plan,
  progress,
  completed,
  expandedPhases,
  onTogglePhase,
  onToggleTask,
}) {
  return (
    <>
      <ProgressHeader
        goal={plan.goal}
        summary={plan.summary}
        progress={progress}
      />

      {plan.phases?.map((phase, i) => (
        <PhaseCard
          key={phase.id}
          phase={phase}
          index={i}
          isExpanded={!!expandedPhases[phase.id]}
          completed={completed}
          onTogglePhase={onTogglePhase}
          onToggleTask={onToggleTask}
        />
      ))}

      <TipsPanel tips={plan.tips} />
    </>
  );
}

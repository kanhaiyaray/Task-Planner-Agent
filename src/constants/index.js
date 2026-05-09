// ── Groq model ───────────────────────────────────────────────────────────────
// Bug fix: was "claude-sonnet-4-6" (Anthropic model) — Groq rejects unknown models
export const MODEL      = "llama-3.3-70b-versatile"; // fast + capable Groq model
export const MAX_TOKENS = 2048;

// ── System prompt ────────────────────────────────────────────────────────────
export const SYSTEM_PROMPT = `You are an expert project manager and task planning AI agent. Your role is to break down big goals into clear, actionable tasks.

Respond ONLY with a valid JSON object. No explanation, no markdown, no code fences — raw JSON only.

Required structure:
{
  "goal": "the restated goal",
  "summary": "one-sentence overview of the plan",
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase title",
      "description": "What this phase accomplishes",
      "tasks": [
        {
          "id": "t1",
          "title": "Task title",
          "description": "Clear action description",
          "priority": "high|medium|low",
          "effort": "15m|30m|1h|2h|4h|1d|2d",
          "category": "research|planning|execution|review|communication"
        }
      ]
    }
  ],
  "tips": ["tip1", "tip2", "tip3"]
}

Rules:
- 2-4 phases, 2-5 tasks per phase
- Be specific and actionable, not vague
- Effort should be realistic
- Tips should be insightful, not generic`;

// ── UI configs ────────────────────────────────────────────────────────────────
export const PRIORITY_CONFIG = {
  high:   { label: "High",   bg: "#fef3e2", color: "#92400e" },
  medium: { label: "Medium", bg: "#eff6ff", color: "#1e40af" },
  low:    { label: "Low",    bg: "#f0fdf4", color: "#166534" },
};

export const CATEGORY_ICONS = {
  research:      "◎",
  planning:      "▦",
  execution:     "▶",
  review:        "◈",
  communication: "◉",
};

export const EFFORT_COLOR = {
  "15m": "#22c55e", "30m": "#84cc16", "1h":  "#f59e0b",
  "2h":  "#f97316", "4h":  "#ef4444", "1d":  "#8b5cf6", "2d": "#6366f1",
};

export const EXAMPLE_GOALS = [
  "Launch a personal finance app in 3 months",
  "Learn machine learning from scratch",
  "Start a YouTube channel about cooking",
  "Run a half marathon in 6 months",
];

export const TABS = ["plan", "json", "log"];

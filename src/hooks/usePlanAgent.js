import { useState, useCallback } from "react";
import { SYSTEM_PROMPT, MODEL, MAX_TOKENS } from "../constants";

const FETCH_TIMEOUT_MS = 30_000;

export function usePlanAgent() {
  const [goalInput,      setGoalInput]      = useState("");
  const [plan,           setPlan]           = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [completed,      setCompleted]      = useState({});
  const [expandedPhases, setExpandedPhases] = useState({});
  const [activeTab,      setActiveTab]      = useState("plan");
  const [logs,           setLogs]           = useState([]);

  const addLog = useCallback((msg) => {
    setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), msg }]);
  }, []);

  const totalTasks = plan?.phases?.flatMap((p) => p.tasks).length ?? 0;
  const doneCount  = Object.values(completed).filter(Boolean).length;
  const progress   = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  const generatePlan = useCallback(async () => {
    if (!goalInput.trim()) return;

    setLoading(true);
    setError("");
    setPlan(null);
    setCompleted({});
    setExpandedPhases({});
    setLogs([
      { time: new Date().toLocaleTimeString(), msg: `Goal: "${goalInput.trim()}"` },
      { time: new Date().toLocaleTimeString(), msg: `Model: ${MODEL}` },
      { time: new Date().toLocaleTimeString(), msg: "Connecting to Groq..." },
    ]);

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      // ── 1. Build Groq-compatible (OpenAI format) request ──────────────────
      // Bug fix: was sending Anthropic format with top-level "system" field.
      // Groq uses OpenAI chat format — system prompt goes as messages[0].
      const body = {
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        // Bug fix: Groq supports response_format — forces pure JSON output,
        // eliminates code-fence stripping entirely
        response_format: { type: "json_object" },
        messages: [
          { role: "system",  content: SYSTEM_PROMPT },
          { role: "user",    content: `Break down this goal into actionable tasks: ${goalInput.trim()}` },
        ],
      };

      const res = await fetch("/api/messages", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        signal:  controller.signal,
        body:    JSON.stringify(body),
      });

      // ── 2. Handle HTTP errors ─────────────────────────────────────────────
      if (!res.ok) {
        let errMsg = `Server error: HTTP ${res.status}`;
        try {
          const errData = await res.json();
          errMsg = errData.error || errData.message || errMsg;
        } catch { /* non-JSON body */ }
        throw new Error(errMsg);
      }

      addLog("Response received, parsing plan...");

      // ── 3. Extract text from Groq response ────────────────────────────────
      const data = await res.json();

      // Bug fix: was reading data.content?.[0]?.text (Anthropic format).
      // Groq returns OpenAI format: choices[0].message.content
      const raw = data.choices?.[0]?.message?.content ?? "";

      if (!raw || raw.trim() === "") {
        // Surface the finish_reason if content is empty (e.g. "length", "stop")
        const reason = data.choices?.[0]?.finish_reason ?? "unknown";
        throw new Error(`Empty response from model (finish_reason: ${reason}). Try again.`);
      }

      // ── 4. Parse JSON ─────────────────────────────────────────────────────
      // response_format:json_object means content should already be clean JSON,
      // but strip stray fences defensively just in case.
      const cleaned = raw.replace(/```json\s*/gi, "").replace(/\s*```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        // Last-resort: pull the outermost {...} block
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Model did not return valid JSON. Please try again.");
        parsed = JSON.parse(jsonMatch[0]);
      }

      if (!parsed.phases || !Array.isArray(parsed.phases)) {
        throw new Error("Response is missing required 'phases' array.");
      }

      // ── 5. Commit to state ────────────────────────────────────────────────
      const initExpanded = {};
      parsed.phases.forEach((p, i) => { initExpanded[p.id] = i === 0; });

      setExpandedPhases(initExpanded);
      setPlan(parsed);
      setActiveTab("plan");
      addLog(
        `Plan ready: ${parsed.phases.length} phases, ` +
        `${parsed.phases.flatMap((p) => p.tasks).length} tasks`
      );
      addLog("Done.");
    } catch (err) {
      const msg = err.name === "AbortError"
        ? "Request timed out after 30 s. Check your network and try again."
        : err.message || "Unknown error. Please try again.";
      setError(msg);
      addLog("Error: " + msg);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [goalInput, addLog]);

  const toggleTask = useCallback((taskId) => {
    setCompleted((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  }, []);

  const togglePhase = useCallback((phaseId) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  }, []);

  return {
    goalInput, setGoalInput,
    plan, loading, error,
    completed, expandedPhases,
    activeTab, setActiveTab,
    logs,
    totalTasks, doneCount, progress,
    generatePlan, toggleTask, togglePhase,
  };
}

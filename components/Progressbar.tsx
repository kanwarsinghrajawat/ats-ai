import { MCPPhase } from "@/lib/types";

const progressMap: Record<MCPPhase, number> = {
  [MCPPhase.THINK]: 25,
  [MCPPhase.ACT1]: 50,
  [MCPPhase.ACT2]: 75,
  [MCPPhase.SPEAK]: 90,
  [MCPPhase.COMPLETE]: 100,
};

export function ProgressBar({ phase }: { phase: MCPPhase | null }) {
  const progress = phase != null ? progressMap[phase] ?? 0 : 0;

  return (
    <div className="h-1 bg-gray-200 dark:bg-gray-700 w-full">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

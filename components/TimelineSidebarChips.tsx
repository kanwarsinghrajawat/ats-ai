import { AiOutlineCheckSquare } from "react-icons/ai";

export function FilterChips({ filter }: { filter: Record<string, any> }) {
  const entries = Object.entries(filter).filter(([, value]) => {
    if (value == null) return false;
    if (typeof value === "object") return Object.keys(value).length > 0;
    if (typeof value === "string") return value !== "";
    return true;
  });
  if (!entries.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <span
          key={key}
          className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm"
        >
          <AiOutlineCheckSquare className="h-4 w-4 text-blue-600" />
          <span>
            {key.replace(/_/g, " ")}:{" "}
            <strong>
              {typeof value === "object"
                ? Object.values(value).join(", ")
                : String(value)}
            </strong>
          </span>
        </span>
      ))}
    </div>
  );
}

export function RankChips({
  rank,
}: {
  rank?: { primary: string; tie_breakers?: string[] };
}) {
  if (!rank) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2 text-sm">
      <span className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
        <AiOutlineCheckSquare className="h-4 w-4 text-blue-600" />
        <span>
          Primary: <strong>{rank.primary.replace(/_/g, " ")}</strong>
        </span>
      </span>
      {rank.tie_breakers?.map((tb) => (
        <span
          key={tb}
          className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm"
        >
          <AiOutlineCheckSquare className="h-4 w-4 text-blue-600" />
          <span>
            Tie-breaker: <strong>{tb.replace(/_/g, " ")}</strong>
          </span>
        </span>
      ))}
    </div>
  );
}

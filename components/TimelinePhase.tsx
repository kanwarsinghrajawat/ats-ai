export function TimelinePhase({
  number,
  label,
  active,
  children,
}: {
  number: number;
  label: string;
  active: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start ml-2">
      <div
        className={`relative z-10 rounded-full h-6 w-6 flex items-center justify-center mr-2 ${
          active ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        {number}
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 shadow-sm w-full">
        <p className="text-xs font-medium">{label}</p>
        {children}
      </div>
    </div>
  );
}

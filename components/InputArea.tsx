import { FaSpinner } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
export function InputArea({
  input,
  setInput,
  onSubmit,
  isProcessing,
  inputRef,
  onNewChat,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onNewChat: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-4 flex justify-between items-center absolute bottom-0 w-full bg-white dark:bg-gray-900"
    >
      <button
        type="button"
        title="Start new chat"
        onClick={onNewChat}
        className="absolute left-2 ml-2 border-1  top-1/2 transform -translate-y-1/2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        disabled={isProcessing}
      >
        <FiPlus className="h-5 w-5" />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your query…"
        className="w-full pl-10 pr-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        disabled={isProcessing}
      />
      <button
        type="submit"
        className="ml-2 flex items-center bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:opacity-50"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center text-sm">
            <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Processing
          </span>
        ) : (
          <>
            Send <span className="ml-1 text-xs opacity-70">(⌘+↵)</span>
          </>
        )}
      </button>
    </form>
  );
}

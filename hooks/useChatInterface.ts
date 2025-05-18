import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, MCPPhase, Candidate } from "@/lib/types";
import { getSpeakResponse, getThinkPlan } from "@/lib/api";
import {
  parseCSV,
  filterCandidates,
  rankCandidates,
  delay,
  aggregateStats,
} from "@/lib/utils";

export const useChatInterface = (candidatesData: string) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<MCPPhase | null>(null);
  const [phaseInfo, setPhaseInfo] = useState<any>({});
  const [rankedCandidates, setRankedCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"timeline" | "candidates">(
    "timeline"
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const candidates = useRef(parseCSV(candidatesData));
  const csvHeader = candidatesData.split("\n")[0];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (!isProcessing && input.trim()) handleSubmit(e as any);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input, isProcessing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isProcessing) return;

      const userMessage = input.trim();
      setMessages((m) => [...m, { role: "user", content: userMessage }]);
      setInput("");
      setIsProcessing(true);

      try {
        setCurrentPhase(MCPPhase.THINK);
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Thinking..." },
        ]);

        const thinkPlan = await getThinkPlan(userMessage, csvHeader);
        setPhaseInfo({ filter: thinkPlan.filter, rank: thinkPlan.rank });

        setCurrentPhase(MCPPhase.ACT1);
        setMessages((m) => [
          ...m.slice(0, -1),
          { role: "assistant", content: "Filtering candidates..." },
        ]);

        const filtered = filterCandidates(candidates.current, thinkPlan.filter);
        await delay(1000);
        setPhaseInfo((p: any) => ({ ...p, filteredCount: filtered.length }));

        setCurrentPhase(MCPPhase.ACT2);
        setMessages((m) => [
          ...m.slice(0, -1),
          { role: "assistant", content: "Ranking candidates..." },
        ]);

        const ranked = rankCandidates(filtered, thinkPlan.rank);
        await delay(1000);

        if (ranked.length) {
          setMessages((m) => [
            ...m.slice(0, -1),
            {
              role: "assistant",
              content: `Found ${ranked.length} candidates matching your criteria.`,
            },
          ]);
        }

        setRankedCandidates(ranked);

        setMessages((m) => [
          ...m.slice(0, -1),
          {
            role: "assistant",
            content: "Here are the candidates that match your criteria.",
          },
        ]);

        setCurrentPhase(MCPPhase.SPEAK);
        const stats = aggregateStats(filtered);
        const topCandidates = ranked.slice(0, 5);

        setMessages((m) => [
          ...m.slice(0, -1),
          {
            role: "assistant",
            content: "Formatting response for you...",
          },
        ]);

        const speakResponse = await getSpeakResponse(
          userMessage,
          topCandidates,
          stats
        );

        setMessages((m) => [
          ...m.slice(0, -1),
          {
            role: "assistant",
            content: speakResponse.content,
          },
          {
            role: "assistant",
            content: "Here is a summary in a table format.",
          },
          {
            role: "assistant",
            content: "",
            tableData: ranked,
          },
        ]);

        setCurrentPhase(MCPPhase.COMPLETE);
      } catch (err) {
        console.error(err);
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Sorry, something went wrong." },
        ]);
      } finally {
        setIsProcessing(false);
        inputRef.current?.focus();
      }
    },
    [input, isProcessing, csvHeader]
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setCurrentPhase(null);
    setPhaseInfo({});
    setRankedCandidates([]);
    setSelectedCandidate(null);
    setInput("");
    inputRef.current?.focus();
  }, []);

  return {
    input,
    setInput,
    messages,
    isProcessing,
    currentPhase,
    phaseInfo,
    rankedCandidates,
    selectedCandidate,
    setSelectedCandidate,
    activeTab,
    setActiveTab,
    inputRef,
    handleSubmit,
    handleNewChat,
  };
};

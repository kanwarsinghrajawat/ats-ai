import type { Candidate, ChatMessage, MCPPhase } from "@/lib/types";

export interface TimelineSidebarProps {
  open: boolean;
  activeTab: "timeline" | "candidates";
  onTabChange: (t: "timeline" | "candidates") => void;
  currentPhase: MCPPhase | null;
  phaseInfo: any;
  candidates: Candidate[];
  onCandidateSelect: (c: Candidate) => void;
}

export interface PhaseConfig {
  number: number;
  label: string;
  isActive: (phase: MCPPhase | null) => boolean;
  content: (
    phase: MCPPhase | null,
    info: TimelineSidebarProps["phaseInfo"]
  ) => React.ReactNode;
}

export type TabKey = "timeline" | "candidates";
export const TABS: { key: TabKey; label: string }[] = [
  { key: "timeline", label: "MCP Timeline" },
  { key: "candidates", label: "Candidates" },
];

export interface ChatInterfaceProps {
  candidatesData: string;
}

export interface MessagesListProps {
  messages: ChatMessage[];
  onCandidateSelect: (c: Candidate) => void;
}

"use client";

import React, { useMemo, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { MCPPhase } from "@/lib/types";
import { ResultTable } from "./ResultTable";
import {
  TABS,
  type PhaseConfig,
  type TabKey,
  type TimelineSidebarProps,
} from "@/types";
import { LuPanelRightClose, LuPanelRightOpen } from "react-icons/lu";
import { FilterChips, RankChips } from "./TimelineSidebarChips";

export const PHASE_CONFIG: PhaseConfig[] = [
  {
    number: 1,
    label: "THINKING",
    isActive: (phase) =>
      !!phase &&
      [
        MCPPhase.THINK,
        MCPPhase.ACT1,
        MCPPhase.ACT2,
        MCPPhase.SPEAK,
        MCPPhase.COMPLETE,
      ].includes(phase),
    content: (_, info) =>
      info.filter ? <FilterChips filter={info.filter} /> : null,
  },
  {
    number: 2,
    label: "Candidate Filtering",
    isActive: (phase) =>
      !!phase &&
      [
        MCPPhase.ACT1,
        MCPPhase.ACT2,
        MCPPhase.SPEAK,
        MCPPhase.COMPLETE,
      ].includes(phase),
    content: (_, info) =>
      typeof info.filteredCount === "number" ? (
        <p className="text-sm mt-2">
          {`Found ${info.filteredCount} of ${info.totalCount} candidates`}
        </p>
      ) : null,
  },
  {
    number: 3,
    label: "Candidate Ranking",
    isActive: (phase) =>
      !!phase &&
      [MCPPhase.ACT2, MCPPhase.SPEAK, MCPPhase.COMPLETE].includes(phase),
    content: (_, info) => <RankChips rank={info.rank} />,
  },
  {
    number: 4,
    label: "Generating Summary",
    isActive: (phase) =>
      !!phase && [MCPPhase.SPEAK, MCPPhase.COMPLETE].includes(phase),
    content: (phase) => (
      <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
        {phase === MCPPhase.SPEAK
          ? "Generating response…"
          : phase === MCPPhase.COMPLETE
          ? "Response complete"
          : "Waiting..."}
      </p>
    ),
  },
];
export const TimelineSidebar: React.FC<TimelineSidebarProps> = React.memo(
  ({
    open,
    activeTab,
    onTabChange,
    currentPhase,
    phaseInfo,
    candidates,
    onCandidateSelect,
  }) => {
    const handleTabChange = useCallback(
      (key: TabKey) => onTabChange(key),
      [onTabChange]
    );
    const phaseItems = useMemo(
      () =>
        PHASE_CONFIG.map(({ label, isActive, content }) => ({
          label,
          active: isActive(currentPhase),
          content: content(currentPhase, phaseInfo),
        })),
      [currentPhase, phaseInfo]
    );

    return (
      <div
        className={`transition-width duration-300 flex flex-col ${
          open ? "w-80" : "w-0"
        }`}
      >
        {open && (
          <div className="flex flex-col flex-1  bg-[#0b0b1d]">
            <LayoutGroup>
              <div className="flex border-b border-gray-500">
                {TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={`flex-1 py-2 ${
                      activeTab === key
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </LayoutGroup>

            <AnimatePresence initial={false} mode="wait">
              {activeTab === "timeline" ? (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 overflow-y-auto"
                >
                  <h3 className="text-lg font-semibold">Process Steps</h3>
                  <ul className="mt-2 space-y-4">
                    {phaseItems.map(({ label, active, content }) => (
                      <li key={label} className="flex items-start space-x-2">
                        <AiOutlineCheckSquare
                          className={`h-5 w-5 ${
                            active ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-sm">{label}</p>
                          {content}
                        </div>
                      </li>
                    ))}
                    {phaseInfo.error && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {phaseInfo.error}
                      </p>
                    )}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="candidates"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 overflow-y-auto"
                >
                  <h3 className="text-lg font-semibold mb-3">Candidates</h3>
                  <ResultTable
                    candidates={candidates}
                    onRowClick={onCandidateSelect}
                    simple
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }
);
TimelineSidebar.displayName = "TimelineSidebar";

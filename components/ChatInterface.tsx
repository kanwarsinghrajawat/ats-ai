"use client";
import React, { useState } from "react";

import { ProgressBar } from "./Progressbar";
import { MessagesList } from "./MessageList";
import { InputArea } from "./InputArea";
import { TimelineSidebar } from "./TimelineSidebar";
import Header from "./Header";
import Suggestions from "./Prompt";
import ResumeDetail from "./ResumeDetail";
import { ModalWrapper } from "./ModalWrapper";
import type { ChatInterfaceProps } from "@/types";
import { useChatInterface } from "@/hooks/useChatInterface";

export default function ChatInterface({ candidatesData }: ChatInterfaceProps) {
  const [timelineOpen, setTimelineOpen] = useState(true);

  const {
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
  } = useChatInterface(candidatesData);

  return (
    <>
      <div className="flex flex-1 min-h-0 overflow-auto">
        <TimelineSidebar
          open={timelineOpen} // ✅ correct now
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentPhase={currentPhase}
          phaseInfo={phaseInfo}
          candidates={rankedCandidates}
          onCandidateSelect={setSelectedCandidate}
        />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {isProcessing && <ProgressBar phase={currentPhase} />}

          <Header
            toggleOpen={() => setTimelineOpen((o) => !o)}
            open={timelineOpen}
          />
          {messages.length === 0 && <Suggestions onSelect={setInput} />}
          <MessagesList
            messages={messages}
            onCandidateSelect={setSelectedCandidate}
          />

          <InputArea
            input={input}
            setInput={setInput}
            onNewChat={handleNewChat}
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
            inputRef={inputRef}
          />
        </div>
      </div>

      {selectedCandidate && (
        <ModalWrapper
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        >
          <ResumeDetail
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        </ModalWrapper>
      )}
    </>
  );
}

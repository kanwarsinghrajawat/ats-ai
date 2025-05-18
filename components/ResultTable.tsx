"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Candidate } from "@/lib/types";

export function ResultTable({
  candidates,
  onRowClick,
  simple = false,
}: {
  candidates: Candidate[];
  onRowClick: (c: Candidate) => void;
  simple?: boolean;
}) {
  return (
    <table className="w-full text-sm table-auto">
      <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
        <tr>
          <th className="p-2 text-left">Name</th>
          {!simple && <th className="p-2 text-left">Title</th>}
          {!simple && <th className="p-2 text-left">Location</th>}
          <th className="p-2 text-left">Experience</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((c) => (
          <motion.tr
            key={c.id}
            layout
            onClick={() => onRowClick(c)}
            className="border-t border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <td className="p-2">{c.full_name}</td>
            {!simple && <td className="p-2">{c.title}</td>}
            {!simple && <td className="p-2">{c.location}</td>}
            <td className="p-2">{c.years_experience}</td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}

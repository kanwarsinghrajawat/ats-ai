"use client";
import React from "react";
import type { Candidate } from "@/lib/types";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiGlobe,
  FiBriefcase,
  FiDollarSign,
  FiAward,
  FiLinkedin,
  FiX,
} from "react-icons/fi";

import { GiGraduateCap } from "react-icons/gi";

import { MdLanguage } from "react-icons/md";

export default function ResumeDetail({
  candidate,
  onClose,
}: {
  candidate: Candidate;
  onClose: () => void;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
      >
        <FiX size={24} />
      </button>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-2xl font-bold text-gray-800"
            >
              {candidate.full_name}
            </motion.h1>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-lg text-gray-600 mt-1"
            >
              {candidate.title}
            </motion.p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FiMapPin size={16} className="text-gray-400" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiGlobe size={16} className="text-gray-400" />
                <span>{candidate.timezone}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <a
              href={candidate.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FiLinkedin size={18} />
              <span className="text-sm font-medium">LinkedIn Profile</span>
            </a>
            <div className="flex flex-wrap gap-2 mt-1">
              {candidate.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Professional Summary
            </h2>
            <p className="text-gray-600 leading-relaxed">{candidate.summary}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm font-medium rounded-md"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Experience
            </h2>
            <div className="flex items-center gap-2 text-gray-700">
              <FiBriefcase size={18} className="text-gray-500" />
              <span className="font-medium">
                {candidate.years_experience} years
              </span>{" "}
              total experience
            </div>
            {candidate.remote_experience_years > 0 && (
              <div className="flex items-center gap-2 text-gray-700 mt-2">
                <FiGlobe size={18} className="text-gray-500" />
                <span className="font-medium">
                  {candidate.remote_experience_years} years
                </span>
                remote work experience
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              Education
            </h2>
            <div className="flex items-start gap-2">
              <GiGraduateCap size={20} className="text-gray-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-800">
                  {candidate.education_level}
                </div>
                <div className="text-gray-600">{candidate.degree_major}</div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MdLanguage size={16} className="text-gray-500" />
              Languages
            </h2>
            <ul className="space-y-1.5">
              {candidate.languages.map((language) => (
                <li key={language} className="text-gray-700">
                  {language}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiBriefcase size={16} className="text-gray-500" />
              Work Preferences
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Preference:</span>
                <span className="font-medium text-gray-800">
                  {candidate.work_preference}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Willing to relocate:</span>
                <span className="font-medium text-gray-800">
                  {candidate.willing_to_relocate ? "Yes" : "No"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Open to contract:</span>
                <span className="font-medium text-gray-800">
                  {candidate.open_to_contract ? "Yes" : "No"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Notice period:</span>
                <span className="font-medium text-gray-800">
                  {candidate.notice_period_weeks} weeks
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Available in:</span>
                <span className="font-medium text-gray-800">
                  {candidate.availability_weeks}{" "}
                  {candidate.availability_weeks === 1 ? "week" : "weeks"}
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiDollarSign size={16} className="text-gray-500" />
              Compensation
            </h2>
            <div className="text-gray-800 font-medium">
              {formatCurrency(candidate.desired_salary_usd)}{" "}
              <span className="text-gray-500 font-normal">/ year</span>
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiAward size={16} className="text-gray-500" />
              Visa & Citizenship
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-600">Visa status:</span>
                <span className="font-medium text-gray-800">
                  {candidate.visa_status}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Citizenship:</span>
                <span className="font-medium text-gray-800">
                  {candidate.citizenships}
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

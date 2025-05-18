export interface Candidate {
  id: string;
  full_name: string;
  title: string;
  location: string;
  timezone: string;
  years_experience: number;
  skills: string[];
  languages: string[];
  education_level: string;
  degree_major: string;
  availability_weeks: number;
  willing_to_relocate: boolean;
  work_preference: string;
  notice_period_weeks: number;
  desired_salary_usd: number;
  open_to_contract: boolean;
  remote_experience_years: number;
  visa_status: string;
  citizenships: string;
  summary: string;
  tags: string[];
  last_active: string;
  linkedin_url: string;
}

export interface FilterPlan {
  include?: {
    [key: string]: string | string[];
  };
  exclude?: {
    [key: string]: string | string[];
  };
}

export interface RankingPlan {
  primary: {
    field: string;
    direction: "asc" | "desc";
  };
  tie_breakers?: Array<{
    field: string;
    direction: "asc" | "desc";
  }>;
}

export interface AggregateStats {
  count: number;
  avg_experience: number;
  top_skills: string[];
}

export interface ThinkResponse {
  filter: FilterPlan;
  rank: RankingPlan;
}

export enum MCPPhase {
  THINK = "THINK",
  ACT1 = "ACT1",
  ACT2 = "ACT2",
  SPEAK = "SPEAK",
  COMPLETE = "COMPLETE",
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  tableData?: Candidate[];
}

// new table message
export interface TableMessage {
  role: "assistant";
  type: "table";
  candidates: Candidate[];
}

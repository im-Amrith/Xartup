export interface Company {
  id: string;
  name: string;
  domain: string;
  stage: "Pre-seed" | "Seed" | "Series A" | "Series B" | "Series C+";
  sector: string;
  tags: string[];
  location: string;
  foundedYear: number;
  employees: string;
  description: string;
  thesisScore: number;
  thesisReasons: string[];
  signals: Signal[];
  lastActivity: string;
  fundingTotal?: string;
}

export interface Signal {
  id: string;
  type: "funding" | "hiring" | "product" | "press" | "founder";
  title: string;
  date: string;
  source?: string;
}

export interface EnrichmentResult {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  signals: string[];
  sources: { url: string; fetchedAt: string }[];
  cachedAt?: string;
  error?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: string;
}

export interface SearchFilters {
  stage: string[];
  sector: string[];
  minThesisScore: number;
}

export interface List {
  id: string;
  name: string;
  description?: string;
  companies: string[];
  createdAt: string;
}

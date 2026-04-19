export interface CutoffData {
  id?: string;
  college: string;
  type: string;
  program: string;
  category: string;
  year: number;
  cutoff: number;
}

// 1. Locate this interface
export interface CutoffFilters {
  programs: string[];
  categories: string[];
  types: string[];
  years: string[]; 
}

export interface CutoffStats {
  total: number;
  colleges: number;
  programs: number;
}
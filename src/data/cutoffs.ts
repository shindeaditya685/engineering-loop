export interface CutoffData {
  id?: string;
  college: string;
  type: string;
  program: string;
  category: string;
  cutoff: number;
}

export interface CutoffFilters {
  colleges: string[];
  programs: string[];
  categories: string[];
  types: string[];
}

export interface CutoffStats {
  total: number;
  colleges: number;
  programs: number;
}
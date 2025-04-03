export interface Note {
  id: number;
  eleveId: number;
  professeurId: number;
  matiere: string;
  note: number;
  coefficient: number;
  trimestre: number;
  dateEvaluation: string;
  commentaire?: string;
  type: string;
  created_at?: string;
  updated_at?: string;
} 
export interface Note {
  id: number;
  eleveId: number;
  professeurId: number;
  professeur: string;
  classe: string;
  eleveNom: string;
  elevePrenom: string;
  matiere: string;
  note_1: number;
  note_2: number;
  coefficient: number;
  semestre: number;
  dateEvaluation: string;
  commentaire?: string;
  type: string;
  created_at?: string;
  updated_at?: string;
} 
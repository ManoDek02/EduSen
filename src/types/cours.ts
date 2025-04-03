export interface Cours {
  id: number;
  classe: string;
  matiere: string;
  professeurId: number;
  professeur: string;
  salle: string;
  jour: number;
  debut: number;
  duree: number;
  couleur: string;
  created_at?: string;
  updated_at?: string;
} 
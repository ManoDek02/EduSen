export interface Professeur {
  id: number;
  user_id: number;
  matricule: string;
  email: string;
  nom: string;
  prenom: string;
  matiere: string;
  telephone?: string;
  status: 'Temps plein' | 'Temps partiel' | 'Vacataire';
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
}

// Données mockées pour le professeur connecté
export const professeurConnecte: Professeur = {
  id: 1,
  user_id: 1,
  matricule: "123456789",
  email: "marie.dubois@ecole.fr",
  nom: "Dubois",
  prenom: "Marie",
  matiere: "Mathématiques",
  telephone: "0123456789",
  status: "Temps plein"
}; 
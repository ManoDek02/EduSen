export interface Eleve {
  id: number;
  user_id: number;
  matricule: string;
  email: string;
  nom: string;
  prenom: string;
  classe: string;
  dateNaissance: string;
  responsable: string;
  status: 'Actif' | 'Inactif';
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
}


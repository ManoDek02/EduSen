export interface BulletinMatiere {
  id: number;
  bulletin_id: number;
  matiere: string;
  moyenne: number;
  moyenneClasse: number;
  appreciation: string;
  professeur: string;
  created_at?: string;
  updated_at?: string;
}

export interface Bulletin {
  id: number;
  eleveId: number;
  eleveNom: string;
  elevePrenom: string;
  trimestre: number;
  annee: string;
  matieres: BulletinMatiere[];
  moyenneGenerale: number;
  moyenneClasse: number;
  appreciationGenerale: string;
  datePrinted?: string;
  status: 'brouillon' | 'publié' | 'archivé';
  created_at?: string;
  updated_at?: string;
} 
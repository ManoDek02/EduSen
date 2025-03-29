export interface Professeur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  matieres: string[];
  classes: {
    id: string;
    nom: string;
    matieres: string[];
  }[];
}

// Données mockées pour le professeur connecté
export const professeurConnecte: Professeur = {
  id: "P1",
  nom: "Dubois",
  prenom: "Marie",
  email: "marie.dubois@ecole.fr",
  matieres: ["Mathématiques", "Physique-Chimie"],
  classes: [
    { 
      id: "TS1", 
      nom: "Terminal S1", 
      matieres: ["Mathématiques", "Physique-Chimie"] 
    },
    { 
      id: "TS2", 
      nom: "Terminal S2", 
      matieres: ["Mathématiques", "Physique-Chimie"] 
    },
    { 
      id: "TS3", 
      nom: "Terminal S3", 
      matieres: ["Mathématiques"] 
    }
  ]
}; 
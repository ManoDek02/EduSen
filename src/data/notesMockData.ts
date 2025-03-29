import type { Note } from '@/types/note';
import { professeurConnecte } from '@/types/professeur';

// Fonction utilitaire pour générer une date aléatoire dans un intervalle
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

// Types d'évaluation possibles
const typesEvaluation = ['Contrôle', 'DS', 'TP', 'Oral'];

// Génération des notes pour chaque élève
const generateNotes = (eleveId: string, eleveNom: string, elevePrenom: string, classe: string, matiere: string): Note[] => {
  const notes: Note[] = [];
  const trimestres = [1, 2, 3];
  
  // Générer 2 notes par trimestre
  trimestres.forEach(trimestre => {
    // Première note (Contrôle)
    notes.push({
      id: `${eleveId}-${matiere}-${trimestre}-1`,
      eleveId,
      eleveNom,
      elevePrenom,
      classe,
      matiere,
      note: Math.floor(Math.random() * 5) + 12, // Note entre 12 et 17
      coefficient: 1,
      professeur: professeurConnecte.id,
      trimestre,
      dateEvaluation: randomDate(new Date('2024-01-01'), new Date('2024-06-30')),
      commentaire: "Bon travail, quelques erreurs de calcul",
      type: 'Contrôle'
    });

    // Deuxième note (DS)
    notes.push({
      id: `${eleveId}-${matiere}-${trimestre}-2`,
      eleveId,
      eleveNom,
      elevePrenom,
      classe,
      matiere,
      note: Math.floor(Math.random() * 4) + 13, // Note entre 13 et 17
      coefficient: 2,
      professeur: professeurConnecte.id,
      trimestre,
      dateEvaluation: randomDate(new Date('2024-01-01'), new Date('2024-06-30')),
      commentaire: "Très bonne copie, démonstration claire",
      type: 'DS'
    });
  });

  return notes;
};

// Liste des élèves par classe
const elevesParClasse = {
  "TS1": [
    { id: "E1", nom: "Martin", prenom: "Marie" },
    { id: "E2", nom: "Dubois", prenom: "Pierre" },
    { id: "E3", nom: "Bernard", prenom: "Sophie" },
    { id: "E4", nom: "Petit", prenom: "Lucas" },
    { id: "E5", nom: "Robert", prenom: "Emma" }
  ],
  "TS2": [
    { id: "E6", nom: "Richard", prenom: "Léo" },
    { id: "E7", nom: "Durand", prenom: "Julie" },
    { id: "E8", nom: "Moreau", prenom: "Thomas" },
    { id: "E9", nom: "Simon", prenom: "Léa" },
    { id: "E10", nom: "Laurent", prenom: "Hugo" }
  ],
  "TS3": [
    { id: "E11", nom: "Michel", prenom: "Alice" },
    { id: "E12", nom: "Leroy", prenom: "Nathan" },
    { id: "E13", nom: "Roux", prenom: "Chloé" },
    { id: "E14", nom: "David", prenom: "Raphaël" },
    { id: "E15", nom: "Bertrand", prenom: "Inès" }
  ]
};

// Génération des notes pour tous les élèves
export const notesMockData: Note[] = [];

Object.entries(elevesParClasse).forEach(([classe, eleves]) => {
  eleves.forEach(eleve => {
    // Pour TS1 et TS2, ajouter les notes de Mathématiques et Physique-Chimie
    if (classe === "TS1" || classe === "TS2") {
      notesMockData.push(...generateNotes(eleve.id, eleve.nom, eleve.prenom, classe, "Mathématiques"));
      notesMockData.push(...generateNotes(eleve.id, eleve.nom, eleve.prenom, classe, "Physique-Chimie"));
    }
    // Pour TS3, ajouter uniquement les notes de Mathématiques
    if (classe === "TS3") {
      notesMockData.push(...generateNotes(eleve.id, eleve.nom, eleve.prenom, classe, "Mathématiques"));
    }
  });
});

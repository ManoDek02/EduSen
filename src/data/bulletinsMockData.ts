
export interface BulletinMatiere {
  matiere: string;
  moyenne: number;
  moyenneClasse: number;
  appreciation: string;
  professeur: string;
}

export interface Bulletin {
  id: string;
  eleveId: string;
  eleveNom: string;
  elevePrenom: string;
  classe: string;
  trimestre: number;
  annee: string;
  matieres: BulletinMatiere[];
  moyenneGenerale: number;
  moyenneClasse: number;
  appreciationGenerale: string;
  datePrinted?: string;
  status: 'brouillon' | 'publié' | 'archivé';
}

export const bulletinsMockData: Bulletin[] = [
  {
    id: '1',
    eleveId: '1',
    eleveNom: 'Martin',
    elevePrenom: 'Sophie',
    classe: '3ème A',
    trimestre: 1,
    annee: '2023-2024',
    matieres: [
      {
        matiere: 'Mathématiques',
        moyenne: 14.5,
        moyenneClasse: 12.7,
        appreciation: 'Bon travail, assez régulier. Poursuivez vos efforts.',
        professeur: 'M. Dupont'
      },
      {
        matiere: 'Français',
        moyenne: 16,
        moyenneClasse: 13.2,
        appreciation: 'Excellente participation à l\'oral. Analyses pertinentes.',
        professeur: 'Mme Robert'
      },
      {
        matiere: 'Histoire-Géographie',
        moyenne: 13.5,
        moyenneClasse: 12.8,
        appreciation: 'Travail satisfaisant. Poursuivez dans cette voie.',
        professeur: 'M. Bernard'
      }
    ],
    moyenneGenerale: 14.7,
    moyenneClasse: 12.9,
    appreciationGenerale: 'Très bon trimestre. Sophie est une élève sérieuse et impliquée.',
    status: 'publié'
  },
  {
    id: '2',
    eleveId: '2',
    eleveNom: 'Dubois',
    elevePrenom: 'Lucas',
    classe: '6ème B',
    trimestre: 1,
    annee: '2023-2024',
    matieres: [
      {
        matiere: 'Mathématiques',
        moyenne: 12.0,
        moyenneClasse: 11.5,
        appreciation: 'Des efforts à poursuivre pour améliorer la rigueur.',
        professeur: 'M. Dupont'
      },
      {
        matiere: 'Français',
        moyenne: 14.0,
        moyenneClasse: 12.8,
        appreciation: 'Bon niveau à l\'écrit. Participation active en classe.',
        professeur: 'Mme Roux'
      }
    ],
    moyenneGenerale: 13.0,
    moyenneClasse: 12.1,
    appreciationGenerale: 'Lucas progresse bien et montre de l\'intérêt pour les cours.',
    status: 'brouillon'
  },
  {
    id: '3',
    eleveId: '3',
    eleveNom: 'Bernard',
    elevePrenom: 'Emma',
    classe: 'Terminale S',
    trimestre: 1,
    annee: '2023-2024',
    matieres: [
      {
        matiere: 'Mathématiques',
        moyenne: 17.0,
        moyenneClasse: 13.1,
        appreciation: 'Excellent niveau. Rigueur et méthode remarquables.',
        professeur: 'M. Girard'
      },
      {
        matiere: 'Physique-Chimie',
        moyenne: 18.0,
        moyenneClasse: 14.2,
        appreciation: 'Excellente maîtrise des concepts. Travaux pratiques de grande qualité.',
        professeur: 'Mme Petit'
      },
      {
        matiere: 'SVT',
        moyenne: 16.5,
        moyenneClasse: 13.7,
        appreciation: 'Très bon niveau. Raisonnement scientifique rigoureux.',
        professeur: 'M. Lefevre'
      }
    ],
    moyenneGenerale: 17.2,
    moyenneClasse: 13.6,
    appreciationGenerale: 'Emma fait preuve d\'excellentes capacités dans les matières scientifiques. Félicitations pour ce trimestre exemplaire.',
    status: 'publié'
  }
];

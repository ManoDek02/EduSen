
import * as z from 'zod';

// Schéma de validation pour le formulaire
export const noteFormSchema = z.object({
  eleveId: z.string().min(1, { message: 'Veuillez sélectionner un élève' }),
  matiere: z.string().min(1, { message: 'Veuillez saisir une matière' }),
  note: z.coerce.number().min(0, { message: 'La note doit être positive' }).max(20, { message: 'La note ne peut pas dépasser 20' }),
  coefficient: z.coerce.number().min(1, { message: 'Le coefficient minimum est 1' }),
  professeur: z.string().min(1, { message: 'Veuillez saisir un professeur' }),
  semestre: z.coerce.number().min(1, { message: 'Veuillez sélectionner un semestre' }).max(2, { message: 'Semestre invalide' }),
  dateEvaluation: z.string().min(1, { message: 'Veuillez saisir une date d\'évaluation' }),
  commentaire: z.string().optional(),
  type: z.string().min(1, { message: 'Veuillez sélectionner un type d\'évaluation' }),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;

export const matieres = [
  'Mathématiques', 'Français', 'Histoire-Géographie', 'Anglais', 'Espagnol', 
  'Allemand', 'Physique-Chimie', 'SVT', 'SES', 'NSI', 'Philosophie', 
  'EPS', 'Arts Plastiques', 'Musique'
];

export const typesEvaluation = [
  'Contrôle', 'Devoir', 'Interrogation', 'TP', 'Exposé', 'Dissertation', 'Oral', 'Projet'
];

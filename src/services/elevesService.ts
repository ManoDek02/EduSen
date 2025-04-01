
import { supabase } from '@/lib/supabase';
import { Eleve } from '@/types/eleve';

// Récupérer tous les élèves
export async function getEleves(): Promise<Eleve[]> {
  const { data, error } = await supabase
    .from('eleves')
    .select('*')
    .order('nom', { ascending: true });

  if (error) {
    console.error('Erreur lors de la récupération des élèves:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// Récupérer un élève par son ID
export async function getEleveById(id: string): Promise<Eleve | null> {
  const { data, error } = await supabase
    .from('eleves')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erreur lors de la récupération de l'élève ${id}:`, error);
    throw new Error(error.message);
  }

  return data;
}

// Ajouter un nouvel élève
export async function addEleve(eleve: Omit<Eleve, 'id'>): Promise<Eleve> {
  const { data, error } = await supabase
    .from('eleves')
    .insert([eleve])
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de l\'ajout d\'un élève:', error);
    throw new Error(error.message);
  }

  return data;
}

// Mettre à jour un élève existant
export async function updateEleve(id: string, eleve: Partial<Eleve>): Promise<Eleve> {
  const { data, error } = await supabase
    .from('eleves')
    .update(eleve)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Erreur lors de la mise à jour de l'élève ${id}:`, error);
    throw new Error(error.message);
  }

  return data;
}

// Supprimer un élève
export async function deleteEleve(id: string): Promise<void> {
  const { error } = await supabase
    .from('eleves')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erreur lors de la suppression de l'élève ${id}:`, error);
    throw new Error(error.message);
  }
}

// Filtrer les élèves
export async function filterEleves(filters: {
  terme?: string;
  classe?: string;
  niveaux?: string[];
  statut?: string[];
}): Promise<Eleve[]> {
  let query = supabase
    .from('eleves')
    .select('*');

  if (filters.classe) {
    query = query.eq('classe', filters.classe);
  }

  if (filters.statut && filters.statut.length > 0) {
    query = query.in('status', filters.statut);
  }

  if (filters.terme) {
    query = query.or(`nom.ilike.%${filters.terme}%,prenom.ilike.%${filters.terme}%,classe.ilike.%${filters.terme}%,responsable.ilike.%${filters.terme}%`);
  }

  const { data, error } = await query.order('nom', { ascending: true });

  if (error) {
    console.error('Erreur lors du filtrage des élèves:', error);
    throw new Error(error.message);
  }

  // Filtrage côté client pour les niveaux (plus complexe)
  if (filters.niveaux && filters.niveaux.length > 0) {
    const niveauMapping = {
      '1': ['6ème', '5ème', '4ème', '3ème'],
      '2': ['2nde', '1ère', 'Terminale']
    };

    return data.filter(eleve => {
      for (const niveauId of filters.niveaux) {
        const niveauClasses = niveauMapping[niveauId];
        for (const niveauClasse of niveauClasses) {
          if (eleve.classe.includes(niveauClasse)) {
            return true;
          }
        }
      }
      return false;
    });
  }

  return data || [];
}

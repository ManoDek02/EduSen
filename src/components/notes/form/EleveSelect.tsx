import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filterEleves } from '@/services/elevesService';

interface EleveSelectProps {
  form: any;
  selectedClass: string;
}

const EleveSelect: React.FC<EleveSelectProps> = ({ form, selectedClass }) => {
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEleves = async () => {
      if (!selectedClass) return;
      
      try {
        setLoading(true);
        setError(null);
        const filteredEleves = await filterEleves({ classe: selectedClass });
        setEleves(filteredEleves);
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors du chargement des élèves:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEleves();
  }, [selectedClass]);

  if (loading) {
    return <div>Chargement des élèves...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  return (
    <FormField
      control={form.control}
      name="eleveId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Élève</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un élève" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {eleves.map((eleve) => (
                <SelectItem key={eleve.id} value={eleve.id}>
                  {eleve.prenom} {eleve.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EleveSelect;

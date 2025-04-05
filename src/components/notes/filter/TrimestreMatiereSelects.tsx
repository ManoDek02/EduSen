
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TrimestreMatiereSelectsProps {
  semestre: string;
  setSemestre: (value: string) => void;
  matiere: string;
  setMatiere: (value: string) => void;
  matieres: string[];
}

const TrimestreMatiereSelects: React.FC<TrimestreMatiereSelectsProps> = ({
  semestre,
  setSemestre,
  matiere,
  setMatiere,
  matieres,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="semestre">Semestre</Label>
        <Select 
          value={semestre} 
          onValueChange={setSemestre}
        >
          <SelectTrigger id="semestre">
            <SelectValue placeholder="Tous les semestres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les semestres</SelectItem>
            <SelectItem value="1">Semestre 1</SelectItem>
            <SelectItem value="2">Semestre 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="matiere">Matière</Label>
        <Select 
          value={matiere} 
          onValueChange={setMatiere}
        >
          <SelectTrigger id="matiere">
            <SelectValue placeholder="Toutes les matières" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les matières</SelectItem>
            {matieres.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TrimestreMatiereSelects;

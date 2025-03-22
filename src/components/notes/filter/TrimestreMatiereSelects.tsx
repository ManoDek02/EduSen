
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
  trimestre: string;
  setTrimestre: (value: string) => void;
  matiere: string;
  setMatiere: (value: string) => void;
  matieres: string[];
}

const TrimestreMatiereSelects: React.FC<TrimestreMatiereSelectsProps> = ({
  trimestre,
  setTrimestre,
  matiere,
  setMatiere,
  matieres,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="trimestre">Trimestre</Label>
        <Select 
          value={trimestre} 
          onValueChange={setTrimestre}
        >
          <SelectTrigger id="trimestre">
            <SelectValue placeholder="Tous les trimestres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les trimestres</SelectItem>
            <SelectItem value="1">Trimestre 1</SelectItem>
            <SelectItem value="2">Trimestre 2</SelectItem>
            <SelectItem value="3">Trimestre 3</SelectItem>
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

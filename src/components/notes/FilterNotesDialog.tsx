
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter } from 'lucide-react';

interface FilterNotesDialogProps {
  onApplyFilters: (filters: any) => void;
}

const FilterNotesDialog: React.FC<FilterNotesDialogProps> = ({ onApplyFilters }) => {
  const [open, setOpen] = useState(false);
  const [trimestre, setTrimestre] = useState('');
  const [matiere, setMatiere] = useState('');
  const [typesEvaluation, setTypesEvaluation] = useState<string[]>([]);
  const [noteRange, setNoteRange] = useState<{ min?: number; max?: number }>({});

  const typesEvaluationOptions = [
    'Contrôle', 'Devoir', 'Interrogation', 'TP', 'Exposé', 'Dissertation', 'Oral', 'Projet'
  ];

  const matieres = [
    'Mathématiques', 'Français', 'Histoire-Géographie', 'Anglais', 'Espagnol', 
    'Allemand', 'Physique-Chimie', 'SVT', 'SES', 'NSI', 'Philosophie', 
    'EPS', 'Arts Plastiques', 'Musique'
  ];

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setTypesEvaluation([...typesEvaluation, type]);
    } else {
      setTypesEvaluation(typesEvaluation.filter(t => t !== type));
    }
  };

  const applyFilters = () => {
    const filters = {
      ...(trimestre ? { trimestre: parseInt(trimestre) } : {}),
      ...(matiere ? { matiere } : {}),
      ...(typesEvaluation.length > 0 ? { typesEvaluation } : {}),
      ...(noteRange.min !== undefined || noteRange.max !== undefined ? { noteRange } : {})
    };
    
    onApplyFilters(filters);
    setOpen(false);
  };

  const resetFilters = () => {
    setTrimestre('');
    setMatiere('');
    setTypesEvaluation([]);
    setNoteRange({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtrer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrer les notes</DialogTitle>
          <DialogDescription>
            Définissez des critères pour filtrer la liste des notes
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          
          <div className="space-y-2">
            <Label>Types d'évaluation</Label>
            <div className="grid grid-cols-2 gap-2">
              {typesEvaluationOptions.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`}
                    checked={typesEvaluation.includes(type)}
                    onCheckedChange={(checked) => 
                      handleTypeChange(type, checked === true)
                    }
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Plage de notes</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="min-note" className="w-12">Min:</Label>
                <input
                  type="number"
                  id="min-note"
                  min="0"
                  max="20"
                  step="0.5"
                  value={noteRange.min !== undefined ? noteRange.min : ''}
                  onChange={(e) => setNoteRange({
                    ...noteRange,
                    min: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="max-note" className="w-12">Max:</Label>
                <input
                  type="number"
                  id="max-note"
                  min="0"
                  max="20"
                  step="0.5"
                  value={noteRange.max !== undefined ? noteRange.max : ''}
                  onChange={(e) => setNoteRange({
                    ...noteRange,
                    max: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={resetFilters}>
            Réinitialiser
          </Button>
          <Button onClick={applyFilters}>Appliquer les filtres</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterNotesDialog;

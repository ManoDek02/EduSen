
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import TrimestreMatiereSelects from './filter/TrimestreMatiereSelects';
import TypesEvaluationCheckboxes from './filter/TypesEvaluationCheckboxes';
import NoteRangeInputs from './filter/NoteRangeInputs';
import FilterDialogActions from './filter/FilterDialogActions';

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
          <TrimestreMatiereSelects 
            trimestre={trimestre}
            setTrimestre={setTrimestre}
            matiere={matiere}
            setMatiere={setMatiere}
            matieres={matieres}
          />
          
          <TypesEvaluationCheckboxes 
            typesEvaluation={typesEvaluation}
            typesEvaluationOptions={typesEvaluationOptions}
            handleTypeChange={handleTypeChange}
          />
          
          <NoteRangeInputs 
            noteRange={noteRange}
            setNoteRange={setNoteRange}
          />
        </div>
        <FilterDialogActions 
          resetFilters={resetFilters}
          applyFilters={applyFilters}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FilterNotesDialog;

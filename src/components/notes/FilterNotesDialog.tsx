import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";

interface NoteFilters {
  trimestre?: number;
  matiere?: string;
  classe?: string;
  typesEvaluation?: string[];
  noteRange?: {
    min?: number;
    max?: number;
  };
}

interface FilterNotesDialogProps {
  onApplyFilters: (filters: NoteFilters) => void;
}

const MATIERES = [
  "Mathématiques",
  "Physique-Chimie",
  "SVT",
  "Histoire-Géographie",
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand"
];

const CLASSES = [
  "6ème A", "6ème B",
  "5ème A", "5ème B",
  "4ème A", "4ème B",
  "3ème A", "3ème B",
  "2nde",
  "1ère ES", "1ère S",
  "Terminale ES", "Terminale S"
];

const TYPES_EVALUATION = [
  "Contrôle",
  "Devoir maison",
  "Interrogation",
  "TP",
  "Examen"
];

export const FilterNotesDialog = ({ onApplyFilters }: FilterNotesDialogProps) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<NoteFilters>({
    trimestre: undefined,
    matiere: undefined,
    classe: undefined,
    typesEvaluation: [],
    noteRange: {
      min: undefined,
      max: undefined
    }
  });

  const handleApply = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  const handleReset = () => {
    setFilters({
      trimestre: undefined,
      matiere: undefined,
      classe: undefined,
      typesEvaluation: [],
      noteRange: {
        min: undefined,
        max: undefined
      }
    });
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Filter className="mr-2 h-4 w-4" />
        Filtres
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrer les notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select
                value={filters.classe}
                onValueChange={(value) => setFilters({ ...filters, classe: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((classe) => (
                    <SelectItem key={classe} value={classe}>
                      {classe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trimestre</Label>
              <Select
                value={filters.trimestre?.toString()}
                onValueChange={(value) => setFilters({ ...filters, trimestre: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un trimestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Trimestre 1</SelectItem>
                  <SelectItem value="2">Trimestre 2</SelectItem>
                  <SelectItem value="3">Trimestre 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Matière</Label>
              <Select
                value={filters.matiere}
                onValueChange={(value) => setFilters({ ...filters, matiere: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {MATIERES.map((matiere) => (
                    <SelectItem key={matiere} value={matiere}>
                      {matiere}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Types d'évaluation</Label>
              <div className="space-y-2">
                {TYPES_EVALUATION.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.typesEvaluation?.includes(type)}
                      onCheckedChange={(checked) => {
                        const newTypes = checked
                          ? [...(filters.typesEvaluation || []), type]
                          : (filters.typesEvaluation || []).filter(t => t !== type);
                        setFilters({ ...filters, typesEvaluation: newTypes });
                      }}
                    />
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Plage de notes</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.noteRange?.min || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    noteRange: {
                      ...filters.noteRange,
                      min: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  min="0"
                  max="20"
                  step="0.25"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.noteRange?.max || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    noteRange: {
                      ...filters.noteRange,
                      max: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  min="0"
                  max="20"
                  step="0.25"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
            <Button onClick={handleApply}>
              Appliquer les filtres
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilterNotesDialog;

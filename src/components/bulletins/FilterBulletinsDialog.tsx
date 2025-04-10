import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter } from 'lucide-react';

interface FilterBulletinsDialogProps {
  onApplyFilters: (filters: {
    semestre?: string;
    classe?: string;
    status?: string[];
  }) => void;
  activeFilters?: {
    semestre?: string;
    classe?: string;
    status?: string[];
  };
  trigger?: React.ReactNode;
}

const FilterBulletinsDialog: React.FC<FilterBulletinsDialogProps> = ({ 
  onApplyFilters, 
  activeFilters = {},
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(activeFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  const handleReset = () => {
    setFilters({});
    onApplyFilters({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrer les bulletins</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Trimestre</Label>
            <Select
              value={filters.semestre}
              onValueChange={(value) => setFilters({ ...filters, semestre: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un trimestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semestre 1</SelectItem>
                <SelectItem value="2">Semestre 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <SelectItem value="3ème A">3ème A</SelectItem>
                <SelectItem value="3ème B">3ème B</SelectItem>
                <SelectItem value="4ème A">4ème A</SelectItem>
                <SelectItem value="4ème B">4ème B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="brouillon"
                  checked={filters.status?.includes('brouillon')}
                  onCheckedChange={(checked) => {
                    const newStatus = checked
                      ? [...(filters.status || []), 'brouillon']
                      : (filters.status || []).filter(s => s !== 'brouillon');
                    setFilters({ ...filters, status: newStatus });
                  }}
                />
                <Label htmlFor="brouillon">Brouillon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="publie"
                  checked={filters.status?.includes('publié')}
                  onCheckedChange={(checked) => {
                    const newStatus = checked
                      ? [...(filters.status || []), 'publié']
                      : (filters.status || []).filter(s => s !== 'publié');
                    setFilters({ ...filters, status: newStatus });
                  }}
                />
                <Label htmlFor="publie">Publié</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="archive"
                  checked={filters.status?.includes('archivé')}
                  onCheckedChange={(checked) => {
                    const newStatus = checked
                      ? [...(filters.status || []), 'archivé']
                      : (filters.status || []).filter(s => s !== 'archivé');
                    setFilters({ ...filters, status: newStatus });
                  }}
                />
                <Label htmlFor="archive">Archivé</Label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button onClick={handleApply}>
            Appliquer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterBulletinsDialog;

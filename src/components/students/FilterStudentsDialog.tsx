
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const classes = [
  { id: '1', name: '6ème A' },
  { id: '2', name: '6ème B' },
  { id: '3', name: '5ème A' },
  { id: '4', name: '5ème B' },
  { id: '5', name: '4ème A' },
  { id: '6', name: '4ème B' },
  { id: '7', name: '3ème A' },
  { id: '8', name: '3ème B' },
  { id: '9', name: '2nde' },
  { id: '10', name: '1ère ES' },
  { id: '11', name: '1ère S' },
  { id: '12', name: 'Terminale ES' },
  { id: '13', name: 'Terminale S' },
];

const FilterStudentsDialog = ({ onApplyFilters }) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    classe: '',
    status: [],
    niveaux: []
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      classe: '',
      status: [],
      niveaux: []
    });
    onApplyFilters({});
    setOpen(false);
  };

  const handleStatusChange = (value) => {
    if (filters.status.includes(value)) {
      setFilters({
        ...filters,
        status: filters.status.filter(s => s !== value)
      });
    } else {
      setFilters({
        ...filters,
        status: [...filters.status, value]
      });
    }
  };

  const handleNiveauChange = (value) => {
    if (filters.niveaux.includes(value)) {
      setFilters({
        ...filters,
        niveaux: filters.niveaux.filter(n => n !== value)
      });
    } else {
      setFilters({
        ...filters,
        niveaux: [...filters.niveaux, value]
      });
    }
  };

  // Grouper les classes par niveau
  const niveaux = [
    { id: '1', name: 'Collège', classes: ['6ème', '5ème', '4ème', '3ème'] },
    { id: '2', name: 'Lycée', classes: ['2nde', '1ère', 'Terminale'] }
  ];

  const hasActiveFilters = filters.classe || filters.status.length > 0 || filters.niveaux.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={hasActiveFilters ? "border-primary text-primary" : ""}>
          <Filter className="mr-2 h-4 w-4" />
          {hasActiveFilters ? `Filtres (${filters.status.length + filters.niveaux.length + (filters.classe ? 1 : 0)})` : "Filtres"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrer les élèves</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Classe spécifique</Label>
            <Select 
              value={filters.classe} 
              onValueChange={(value) => setFilters({...filters, classe: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les classes" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(classe => (
                  <SelectItem key={classe.id} value={classe.name}>
                    {classe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Niveau</Label>
            <div className="grid grid-cols-2 gap-2">
              {niveaux.map(niveau => (
                <div key={niveau.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`niveau-${niveau.id}`}
                    checked={filters.niveaux.includes(niveau.id)}
                    onCheckedChange={() => handleNiveauChange(niveau.id)}
                  />
                  <label
                    htmlFor={`niveau-${niveau.id}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {niveau.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-actif"
                  checked={filters.status.includes('Actif')}
                  onCheckedChange={() => handleStatusChange('Actif')}
                />
                <label
                  htmlFor="status-actif"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Actif
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-inactif"
                  checked={filters.status.includes('Inactif')}
                  onCheckedChange={() => handleStatusChange('Inactif')}
                />
                <label
                  htmlFor="status-inactif"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Inactif
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleResetFilters}>
            Réinitialiser
          </Button>
          <Button onClick={handleApplyFilters}>
            Appliquer les filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterStudentsDialog;

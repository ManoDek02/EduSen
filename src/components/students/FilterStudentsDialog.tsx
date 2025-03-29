import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const classes = [
  { id: '1', name: '6ème A', niveau: 'Collège' },
  { id: '2', name: '6ème B', niveau: 'Collège' },
  { id: '3', name: '5ème A', niveau: 'Collège' },
  { id: '4', name: '5ème B', niveau: 'Collège' },
  { id: '5', name: '4ème A', niveau: 'Collège' },
  { id: '6', name: '4ème B', niveau: 'Collège' },
  { id: '7', name: '3ème A', niveau: 'Collège' },
  { id: '8', name: '3ème B', niveau: 'Collège' },
  { id: '9', name: '2nde', niveau: 'Lycée' },
  { id: '10', name: '1ère ES', niveau: 'Lycée' },
  { id: '11', name: '1ère S', niveau: 'Lycée' },
  { id: '12', name: 'Terminale ES', niveau: 'Lycée' },
  { id: '13', name: 'Terminale S', niveau: 'Lycée' },
];

const niveaux = [
  { id: '1', name: 'Collège', classes: ['6ème', '5ème', '4ème', '3ème'] },
  { id: '2', name: 'Lycée', classes: ['2nde', '1ère', 'Terminale'] }
];

interface FilterStudentsDialogProps {
  onApplyFilters: (filters: any) => void;
}

const FilterStudentsDialog: React.FC<FilterStudentsDialogProps> = ({ onApplyFilters }) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    classe: '',
    niveaux: [],
    statut: []
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      classe: '',
      niveaux: [],
      statut: []
    });
    onApplyFilters({});
    setOpen(false);
  };

  const handleNiveauChange = (value: string) => {
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

  const handleStatutChange = (value: string) => {
    if (filters.statut.includes(value)) {
      setFilters({
        ...filters,
        statut: filters.statut.filter(s => s !== value)
      });
    } else {
      setFilters({
        ...filters,
        statut: [...filters.statut, value]
      });
    }
  };

  const hasActiveFilters = filters.classe || filters.niveaux.length > 0 || filters.statut.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={hasActiveFilters ? "border-primary text-primary" : ""}>
          <Filter className="mr-2 h-4 w-4" />
          {hasActiveFilters ? `Filtres (${filters.niveaux.length + (filters.classe ? 1 : 0) + filters.statut.length})` : "Filtres"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrer les élèves</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="classe" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classe">Classe</TabsTrigger>
            <TabsTrigger value="niveau">Niveau</TabsTrigger>
            <TabsTrigger value="statut">Statut</TabsTrigger>
          </TabsList>

          <TabsContent value="classe" className="space-y-4 pt-4">
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
          </TabsContent>

          <TabsContent value="niveau" className="space-y-4 pt-4">
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
          </TabsContent>

          <TabsContent value="statut" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="actif"
                    checked={filters.statut.includes('Actif')}
                    onCheckedChange={() => handleStatutChange('Actif')}
                  />
                  <label
                    htmlFor="actif"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Actif
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inactif"
                    checked={filters.statut.includes('Inactif')}
                    onCheckedChange={() => handleStatutChange('Inactif')}
                  />
                  <label
                    htmlFor="inactif"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Inactif
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleResetFilters}>
            Réinitialiser
          </Button>
          <Button onClick={handleApplyFilters}>
            Appliquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterStudentsDialog;

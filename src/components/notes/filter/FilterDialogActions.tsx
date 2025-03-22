
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface FilterDialogActionsProps {
  resetFilters: () => void;
  applyFilters: () => void;
}

const FilterDialogActions: React.FC<FilterDialogActionsProps> = ({
  resetFilters,
  applyFilters,
}) => {
  return (
    <DialogFooter className="flex justify-between">
      <Button variant="outline" onClick={resetFilters}>
        Réinitialiser
      </Button>
      <Button onClick={applyFilters}>Appliquer les filtres</Button>
    </DialogFooter>
  );
};

export default FilterDialogActions;

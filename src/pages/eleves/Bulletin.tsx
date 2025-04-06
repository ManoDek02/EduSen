import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Eye, RefreshCw, Users } from 'lucide-react';
import NewBulletinDialog from '@/components/bulletins/NewBulletinDialog';
import FilterBulletinsDialog from '@/components/bulletins/FilterBulletinsDialog';
import { formatDate } from '@/lib/utils';
import DataTable from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Bulletin } from '@/types/bulletin';
import {  Pencil, Trash2, FilePlus, Download, Filter, X } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import BulletinDetailDialog from '@/components/bulletins/BulletinDetailDialog';

interface ActiveFilters {
  semestre?: number;
}

const bulletin = () => {
  const navigate = useNavigate();
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [filteredBulletins, setFilteredBulletins] = useState<Bulletin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [bulletinToDelete, setBulletinToDelete] = useState<Bulletin | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});

  const handleAddBulletin = (newBulletin: Bulletin) => {
    const updatedBulletins = [...bulletins, newBulletin];
    setBulletins(updatedBulletins);
    setFilteredBulletins(updatedBulletins);
    toast.success('Bulletin créé avec succès');
  };

  const handleViewBulletin = (bulletin: Bulletin) => {
    setSelectedBulletin(bulletin);
    setIsDetailOpen(true);
  };

  const handleEditBulletin = (bulletin: Bulletin) => {
    toast.info("Fonctionnalité d'édition à implémenter");
  };

  const handleDeleteBulletin = (bulletin: Bulletin) => {
    setBulletinToDelete(bulletin);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!bulletinToDelete) return;
    
    const updatedBulletins = bulletins.filter(b => b.id !== bulletinToDelete.id);
    setBulletins(updatedBulletins);
    setFilteredBulletins(updatedBulletins);
    toast.success('Bulletin supprimé avec succès');
    
    setConfirmDialogOpen(false);
    setBulletinToDelete(null);
  };

  const handlePrintBulletin = (bulletin: Bulletin) => {
    setSelectedBulletin(bulletin);
    setIsDetailOpen(true);
    toast.success('Préparation de l\'impression...');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(bulletins, term, {});
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(bulletins, searchTerm, filters);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    applyFiltersAndSearch(bulletins, searchTerm, {});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.semestre) count++;
    return count;
  };

  const applyFiltersAndSearch = (data: Bulletin[], term: string, filters: ActiveFilters) => {
    let result = [...data];

    if (filters.semestre) {
      result = result.filter(bulletin => bulletin.semestre === filters.semestre);
    }

    if (term) {
      result = result.filter(bulletin => 
        Object.values(bulletin).some(
          value => 
            value && 
            typeof value === 'string' &&
            value.toLowerCase().includes(term.toLowerCase())
        ) ||
        `${bulletin.elevePrenom} ${bulletin.eleveNom}`.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredBulletins(result);
  };

  const columns = [
    {
      key: 'eleveNom',
      header: 'Élève',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="font-medium">{row.eleveNom} {row.elevePrenom}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              {row.classe}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'semestre',
      header: 'Période',
      cell: (row) => (
        <div className="flex flex-col">
          <Badge variant="outline" className="w-fit">
            Trimestre {row.semestre}
          </Badge>
          <div className="text-xs text-muted-foreground">{row.annee}</div>
        </div>
      )
    },
    {
      key: 'moyenneGenerale',
      header: 'Moyenne',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant={
            row.moyenneGenerale >= 14 ? "default" :
            row.moyenneGenerale >= 10 ? "secondary" : "destructive"
          }>
            {row.moyenneGenerale.toFixed(1)}
          </Badge>
          <div className="text-xs text-muted-foreground">/20</div>
        </div>
      )
    },
    {
      key: 'moyenneClasse',
      header: 'Moy. Classe',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {row.moyenneClasse.toFixed(1)}
          </Badge>
          <div className="text-xs text-muted-foreground">/20</div>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleViewBulletin(row)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handlePrintBulletin(row)}
            className="hover:bg-green-50 hover:text-green-600"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleEditBulletin(row)}
            className="hover:bg-yellow-50 hover:text-yellow-600"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDeleteBulletin(row)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des bulletins"
          description="Créez, visualisez et imprimez les bulletins des élèves"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.info("Export des bulletins")}>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
              <NewBulletinDialog onAddBulletin={handleAddBulletin} />
            </div>
          }
        />

        <DataTable 
          columns={columns}
          data={filteredBulletins}
          searchable={true}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          additionalFilters={
            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Réinitialiser les filtres
                </Button>
              )}
              {/* <FilterBulletinsDialog 
                onApplyFilters={handleApplyFilters}
                activeFilters={activeFilters}
                trigger={
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtres
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                }
              /> */}
            </div>
          }
        />
      </div>

      {selectedBulletin && (
        <BulletinDetailDialog
          bulletin={selectedBulletin}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}

    </MainLayout>
  );
};

export default bulletin;

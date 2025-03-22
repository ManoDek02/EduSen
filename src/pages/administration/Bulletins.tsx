
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Bulletin, bulletinsMockData } from '@/data/bulletinsMockData';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/tables/DataTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Printer, Eye, Pencil, Trash2, FilePlus, Download } from 'lucide-react';
import BulletinDetailDialog from '@/components/bulletins/BulletinDetailDialog';
import NewBulletinDialog from '@/components/bulletins/NewBulletinDialog';
import FilterBulletinsDialog from '@/components/bulletins/FilterBulletinsDialog';
import { formatDate } from '@/lib/utils';

const Bulletins = () => {
  const navigate = useNavigate();
  const [bulletins, setBulletins] = useState<Bulletin[]>(bulletinsMockData);
  const [filteredBulletins, setFilteredBulletins] = useState<Bulletin[]>(bulletinsMockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [bulletinToDelete, setBulletinToDelete] = useState<Bulletin | null>(null);

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
    
    // Simuler une impression (en utilisant le dialogue détaillé avec mode impression)
    setIsDetailOpen(true);
    toast.success('Préparation de l\'impression...');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(bulletins, term, {});
  };

  const handleApplyFilters = (filters) => {
    applyFiltersAndSearch(bulletins, searchTerm, filters);
  };

  const applyFiltersAndSearch = (data: Bulletin[], term: string, filters: any) => {
    let result = [...data];

    if (filters.trimestre) {
      result = result.filter(bulletin => bulletin.trimestre === filters.trimestre);
    }

    if (filters.classe) {
      result = result.filter(bulletin => bulletin.classe === filters.classe);
    }

    if (filters.status && filters.status.length > 0) {
      result = result.filter(bulletin => filters.status.includes(bulletin.status));
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'brouillon':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'publié':
        return <Badge variant="default" className="bg-green-600">Publié</Badge>;
      case 'archivé':
        return <Badge variant="secondary">Archivé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    {
      key: 'eleveNom',
      header: 'Élève',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.eleveNom} {row.elevePrenom}</div>
          <div className="text-xs text-muted-foreground">{row.classe}</div>
        </div>
      )
    },
    {
      key: 'trimestre',
      header: 'Trimestre',
      cell: (row) => `Trimestre ${row.trimestre} - ${row.annee}`
    },
    {
      key: 'moyenneGenerale',
      header: 'Moyenne',
      cell: (row) => (
        <span className={`font-medium ${
          row.moyenneGenerale >= 14 ? 'text-green-600' : 
          row.moyenneGenerale >= 10 ? 'text-blue-600' : 
          'text-red-600'
        }`}>
          {row.moyenneGenerale.toFixed(1)}
        </span>
      )
    },
    {
      key: 'moyenneClasse',
      header: 'Moy. Classe',
      cell: (row) => row.moyenneClasse.toFixed(1)
    },
    {
      key: 'status',
      header: 'Statut',
      cell: (row) => getStatusBadge(row.status)
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { 
              e.stopPropagation(); 
              handleViewBulletin(row); 
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { 
              e.stopPropagation(); 
              handlePrintBulletin(row); 
            }}
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { 
              e.stopPropagation(); 
              handleEditBulletin(row); 
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive" 
            onClick={(e) => { 
              e.stopPropagation(); 
              handleDeleteBulletin(row); 
            }}
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
            <FilterBulletinsDialog onApplyFilters={handleApplyFilters} />
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

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bulletin ? 
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Bulletins;

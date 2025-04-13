import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Bulletin } from '@/types/bulletin';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/tables/DataTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Printer, Eye, Pencil, Trash2, FilePlus, Download, Users, Filter, X } from 'lucide-react';
import BulletinDetailDialog from '@/components/bulletins/BulletinDetailDialog';
import NewBulletinDialog from '@/components/bulletins/NewBulletinDialog';
import FilterBulletinsDialog from '@/components/bulletins/FilterBulletinsDialog';
import { formatDate } from '@/lib/utils';

interface ActiveFilters {
  semestre?: string;
  classe?: string;
  status?: string[];
}

const Bulletins = () => {
  const navigate = useNavigate();
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [filteredBulletins, setFilteredBulletins] = useState<Bulletin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [bulletinToDelete, setBulletinToDelete] = useState<Bulletin | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [loading, setLoading] = useState(false); // ✅ Pour UX

  // ✅ Chargement des bulletins depuis le backend
  useEffect(() => {
    const fetchBulletins = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/bulletins');
        const data = await res.json();
        setBulletins(data);
        setFilteredBulletins(data);
      } catch (err) {
        toast.error('Erreur lors du chargement des bulletins');
      } finally {
        setLoading(false);
      }
    };

    fetchBulletins();
  }, []);

  const handleAddBulletin = (newBulletin: Bulletin) => {
    const updatedBulletins = [...bulletins, newBulletin];
    setBulletins(updatedBulletins);
    setFilteredBulletins(updatedBulletins);
    toast.success('Bulletin créé avec succès');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(bulletins, term, activeFilters); // ✅ Garder les filtres actifs
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(bulletins, searchTerm, filters);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    applyFiltersAndSearch(bulletins, searchTerm, {});
  };

  const applyFiltersAndSearch = (data: Bulletin[], term: string, filters: ActiveFilters) => {
    let result = [...data];

    if (filters.semestre) {
      result = result.filter(bulletin => bulletin.semestre === Number(filters.semestre));
    }

    if (filters.classe) {
      result = result.filter(bulletin => bulletin.classe === filters.classe);
    }

    if (filters.status?.length) {
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

  const confirmDelete = () => {
    if (!bulletinToDelete) return;

    const updated = bulletins.filter(b => b.id !== bulletinToDelete.id);
    setBulletins(updated);
    setFilteredBulletins(updated);
    toast.success('Bulletin supprimé avec succès');

    setConfirmDialogOpen(false);
    setBulletinToDelete(null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.semestre) count++;
    if (activeFilters.classe) count++;
    if (activeFilters.status?.length) count++;
    return count;
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

  const columns = [/* ... tes colonnes sont bonnes, pas besoin de modifier ici */];

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
          loading={loading} // ✅ si ton DataTable supporte une prop `loading`
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
              <FilterBulletinsDialog
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
              />
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

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bulletin ? Cette action ne peut pas être annulée.
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

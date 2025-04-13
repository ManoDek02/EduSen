import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/tables/DataTable';
import FilterStudentsDialog from '@/components/students/FilterStudentsDialog';
import { getElevesColumns } from '@/components/students/ElevesTableColumns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, File } from 'lucide-react';
import EleveDetailDialog from '@/components/students/EleveDetailDialog';
import { professeurConnecte } from '@/types/professeur';
import { Eleve } from '@/types/eleve';
import { filterEleves } from '@/services/elevesService';
import { toast } from 'sonner';


interface FilterOptions {
  status?: string[];
  searchTerm?: string;
  // Autres options de filtrage
}

const ElevesProf = () => {
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [filteredEleves, setFilteredEleves] = useState<Eleve[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger les élèves quand une classe est sélectionnée
  const handleClassChange = async (classe: string) => {
    setSelectedClass(classe);
    try {
      setLoading(true);
      const data = await filterEleves({ classe });
      setEleves(data);
      setFilteredEleves(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des élèves");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (filters: FilterOptions) => {
    setActiveFilters(filters);
    try {
      setLoading(true);
      const data = await filterEleves({ 
        classe: selectedClass,
        searchTerm: searchTerm,
        status: filters.status
      });
      setFilteredEleves(data);
    } catch (error) {
      toast.error("Erreur lors du filtrage des élèves");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    try {
      setLoading(true);
      const data = await filterEleves({ 
        classe: selectedClass,
        searchTerm: term,
        status: activeFilters.status
      });
      setFilteredEleves(data);
    } catch (error) {
      toast.error("Erreur lors de la recherche");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEleve = (eleve: Eleve) => {
    setSelectedEleve(eleve);
    setIsDetailDialogOpen(true);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Export ${format} pour la classe ${selectedClass}`);
    toast.success(`Exportation au format ${format} en cours...`);
    // Logique d'exportation à implémenter
  };

  const columns = getElevesColumns(() => {}, () => {}, handleViewEleve);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Liste des élèves - ${professeurConnecte.prenom} ${professeurConnecte.nom}`}
          description="Consultez les informations des élèves de votre classe"
          actions={
            <div className="flex items-center gap-2">
              <div className="w-[200px]">
                <Select value={selectedClass} onValueChange={handleClassChange}>
                  <SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 focus:ring-blue-500">
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(professeurConnecte.classe) ? professeurConnecte.classe.map((classe) => (
                      <SelectItem key={classe.id} value={classe.id}>
                        {classe.nom}
                      </SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>
              </div>
              {selectedClass && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                    <File className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              )}
            </div>
          }
        />

        {selectedClass ? (
          <DataTable 
            columns={columns}
            data={filteredEleves}
            searchable={true}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            loading={loading}
            additionalFilters={
              <FilterStudentsDialog onApplyFilters={handleApplyFilters} />
            }
          />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Veuillez sélectionner une classe pour voir la liste des élèves
          </div>
        )}

        <EleveDetailDialog
          eleve={selectedEleve}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
        />
      </div>
    </MainLayout>
  );
};

export default ElevesProf;

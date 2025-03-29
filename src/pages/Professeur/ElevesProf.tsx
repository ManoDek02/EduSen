import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/tables/DataTable';
import FilterStudentsDialog from '@/components/students/FilterStudentsDialog';
import { getElevesColumns } from '@/components/students/ElevesTableColumns';
import { elevesMockData } from '@/data/elevesMockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, File } from 'lucide-react';
import EleveDetailDialog from '@/components/students/EleveDetailDialog';
import { professeurConnecte } from '@/types/professeur';

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  classe: string;
  dateNaissance: string;
  responsable: string;
  status: string;
  [key: string]: string;
}

const ElevesProf = () => {
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [eleves] = useState<Eleve[]>(elevesMockData);
  const [filteredEleves, setFilteredEleves] = useState<Eleve[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Filtrer les élèves pour ne garder que ceux des classes assignées au professeur
  const professeurEleves = eleves.filter(eleve => 
    professeurConnecte.classes.some(classe => classe.id === eleve.classe)
  );

  const handleClassChange = (classe: string) => {
    setSelectedClass(classe);
    const elevesClasse = professeurEleves.filter(eleve => eleve.classe === classe);
    setFilteredEleves(elevesClasse);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(professeurEleves.filter(eleve => eleve.classe === selectedClass), searchTerm, filters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFiltersAndSearch(professeurEleves.filter(eleve => eleve.classe === selectedClass), term, activeFilters);
  };

  const applyFiltersAndSearch = (data: Eleve[], term: string, filters: any) => {
    let result = [...data];

    if (filters.status && filters.status.length > 0) {
      result = result.filter(eleve => filters.status.includes(eleve.status));
    }

    if (term) {
      result = result.filter(eleve => 
        Object.values(eleve).some(
          value => 
            value && 
            value.toString().toLowerCase().includes(term.toLowerCase())
        )
      );
    }

    setFilteredEleves(result);
  };

  const handleViewEleve = (eleve: Eleve) => {
    setSelectedEleve(eleve);
    setIsDetailDialogOpen(true);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Export ${format} pour la classe ${selectedClass}`);
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
                    {professeurConnecte.classes.map((classe) => (
                      <SelectItem key={classe.id} value={classe.id}>
                        {classe.nom}
                      </SelectItem>
                    ))}
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

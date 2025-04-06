import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import EleveDetailDialog from '@/components/students/EleveDetailDialog';
import EditStudentDialog from '@/components/students/EditStudentDialog';
import DeleteEleveDialog from '@/components/students/DeleteEleveDialog';
import ElevesList from '@/components/students/ElevesList';
import ElevesActions from '@/components/students/ElevesActions';
import { useEleves } from '@/hooks/use-eleves';

const Eleves = () => {
  const {
    filteredEleves,
    selectedEleve,
    setSelectedEleve,
    loading,
    searchTerm,
    handleAddStudent,
    handleImportStudents,
    handleUpdateEleve,
    handleDeleteEleve,
    handleApplyFilters,
    handleSearch
  } = useEleves();

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleViewEleve = (eleve) => {
    setSelectedEleve(eleve);
    setIsDetailDialogOpen(true);
  };

  const handleEditEleve = (eleve) => {
    setSelectedEleve(eleve);
    setIsEditDialogOpen(true);
  };

  const handleDeleteEleveClick = (eleve) => {
    setSelectedEleve(eleve);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEleve) {
      await handleDeleteEleve();
      setIsDeleteDialogOpen(false);
      setSelectedEleve(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestion des élèves"
          description="Gérez les dossiers des élèves de l'établissement"
          actions={
            <ElevesActions 
              filteredEleves={filteredEleves}
              onAddStudent={handleAddStudent}
              onImportStudents={handleImportStudents}
            />
          }
        />

        <ElevesList 
          eleves={filteredEleves}
          loading={loading}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onApplyFilters={handleApplyFilters}
          onEditEleve={handleEditEleve}
          onDeleteEleve={handleDeleteEleveClick}
          onViewEleve={handleViewEleve}
          setSelectedEleve={setSelectedEleve}
        />

        <EleveDetailDialog
          eleve={{
            ...selectedEleve,
            id: selectedEleve?.id.toString()
          }}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
        />

        <EditStudentDialog
          eleve={{
            ...selectedEleve,
            id: selectedEleve?.id.toString()
          }}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={handleUpdateEleve}
        />

        <DeleteEleveDialog
          eleve={selectedEleve}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={confirmDelete}
        />
      </div>
    </MainLayout>
  );
};

export default Eleves;

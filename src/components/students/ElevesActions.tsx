
import React from 'react';
import NewStudentDialog from '@/components/students/NewStudentDialog';
import ImportStudentsDialog from '@/components/students/ImportStudentsDialog';
import ExportStudentsButton from '@/components/students/ExportStudentsButton';
import { Eleve } from '@/types/eleve';

interface ElevesActionsProps {
  filteredEleves: Eleve[];
  onAddStudent: (newStudent: Omit<Eleve, 'id'>) => Promise<void>;
  onImportStudents: (importedStudents: Omit<Eleve, 'id'>[]) => Promise<void>;
}

const ElevesActions: React.FC<ElevesActionsProps> = ({
  filteredEleves,
  onAddStudent,
  onImportStudents
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <ImportStudentsDialog onImportStudents={onImportStudents} />
      <ExportStudentsButton data={filteredEleves} />
      <NewStudentDialog onAddStudent={onAddStudent} />
    </div>
  );
};

export default ElevesActions;

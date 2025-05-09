
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Eleves from "./pages/administration/Eleves";
import Professeurs from "./pages/administration/Professeurs";
import EmploiDuTemps from "./pages/administration/EmploiDuTemps";
import Notes from "./pages/administration/Notes";
import Bulletins from "./pages/administration/Bulletins";
import EmploiDuTempsProf from "./pages/Professeur/EmploiDuTempsProf";
import ElevesProf from "./pages/Professeur/ElevesProf";
import SyllabusProf from "./pages/Professeur/SyllabusProf";
import Notifications from "./pages/eleves/Notifications";
import ContactProfesseurs from "./pages/eleves/ContactProfesseurs";
import Baki from "./pages/eleves/Baki";
import Syllabus from "./pages/eleves/Syllabus";
import NotesProf from "./pages/Professeur/NotesProf";
import DashboardAdmin from "./pages/administration/DashboardAdmin";
import DashboardProf from "./pages/Professeur/DashboardProf";
import DashboardEleves from "./pages/Eleve/DashboardEleve";
import DashboardParents from "./pages/Parent/DashboardParent";
import NotesEleve from "./pages/eleves/NotesEleve";
import Bulletin from "./pages/eleves/Bulletin";
import EmploiDuTemp from "./pages/eleves/EmploiDuTemp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Page d'accueil et de connexion */}
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Routes Administration */}
          <Route path="/administration/eleves" element={<Eleves />} />
          <Route path="/administration/professeurs" element={<Professeurs />} />
          <Route path="/administration/emploi-du-temps" element={<EmploiDuTemps />} />
          <Route path="/administration/notes" element={<Notes />} />
          <Route path="/administration/bulletins" element={<Bulletins />} />
          <Route path="/administration/dashboard" element={<DashboardAdmin />} />

          {/* Routes Professeurs */}
          <Route path="/professeurs/classes" element={<ElevesProf />} />
          <Route path="/professeurs/emploi-du-temps" element={<EmploiDuTempsProf />} />
          <Route path="/professeurs/notes" element={<NotesProf />} />
          <Route path="/professeurs/syllabus" element={<SyllabusProf />} />
          <Route path="/professeurs/dashboard" element={<DashboardProf />} />

          {/* Routes Élèves */}
          <Route path="/eleves/dashboard" element={<DashboardEleves />} />
          <Route path="/eleves/syllabus" element={<Syllabus />} />
          <Route path="/eleves/emploi-du-temps" element={<EmploiDuTemp />} />
          <Route path="/eleves/notes" element={<NotesEleve />} />
          <Route path="/eleves/bulletin" element={<Bulletin />} />
          <Route path="/eleves/notifications" element={<Notifications />} />
          <Route path="/eleves/contact-professeurs" element={<ContactProfesseurs />} />
          <Route path="/eleves/baki" element={<Baki />} />
          
          {/* Routes Parents */}
          <Route path="/parents/dashboard" element={<DashboardParents />} />
                    
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

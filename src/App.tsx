import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Eleves from "./pages/administration/Eleves";
import Professeurs from "./pages/administration/Professeurs";
import { EmploiDuTemps as EmploiDuTempsAdmin } from "./pages/administration/EmploiDuTemps";
import Notes from "./pages/administration/Notes";
import Bulletins from "./pages/administration/Bulletins";
import EmploiDuTempsProf from "./pages/Professeur/EmploiDuTempsProf";
import ElevesProf from "./pages/Professeur/ElevesProf";
import SyllabusProf from "./pages/Professeur/SyllabusProf";
import Notifications from "./pages/eleves/Notifications";
import ContactProfesseurs from "./pages/eleves/Contactprofesseurs";
import Baki from "./pages/eleves/Baki";
import DashboardEleve from "./pages/eleves/DashboardEleve";

// Routes pour les élèves
import Syllabus from "./pages/eleves/Syllabus";
import NotesEleve from "./pages/eleves/Notes";
import Bulletin from "./pages/eleves/Bulletin";
import EmploiDuTemps from "./pages/eleves/Emploi du temps";

// Routes pour les professeurs
// Ces composants seront créés à la demande

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
          <Route path="/administration/emploi-du-temps" element={<EmploiDuTempsAdmin />} />
          <Route path="/administration/notes" element={<Notes />} />
          <Route path="/administration/bulletins" element={<Bulletins />} />
          
          {/* Routes Professeurs */}
          <Route path="/professeurs/classes" element={<Professeurs />} />
          <Route path="/professeurs/emploi-du-temps" element={<EmploiDuTemps />} />
          <Route path="/professeurs/notes" element={<Eleves />} />
          <Route path="/professeurs/syllabus" element={<SyllabusProf />} />
          
          {/* Routes Élèves */}
          <Route path="/eleves/dashboard" element={<DashboardEleve />} />
          <Route path="/eleves/syllabus" element={<Syllabus />} />
          <Route path="/eleves/emploi-du-temps" element={<EmploiDuTemps />} />
          <Route path="/eleves/notes" element={<NotesEleve />} />
          <Route path="/eleves/bulletin" element={<Bulletin />} />
          <Route path="/eleves/notifications" element={<Notifications />} />
          <Route path="/eleves/contact-professeurs" element={<ContactProfesseurs />} />
          <Route path="/eleves/baki" element={<Baki />} />
          
          {/* Routes Parents */}
          <Route path="/parents" element={<Dashboard />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

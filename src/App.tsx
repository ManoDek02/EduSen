
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Eleves from "./pages/administration/Eleves";
import Professeurs from "./pages/administration/Professeurs";
import EmploiDuTemps from "./pages/administration/EmploiDuTemps";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* Routes Administration */}
          <Route path="/administration/eleves" element={<Eleves />} />
          <Route path="/administration/professeurs" element={<Professeurs />} />
          <Route path="/administration/emploi-du-temps" element={<EmploiDuTemps />} />
          
          {/* Ajouter d'autres routes ici */}
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

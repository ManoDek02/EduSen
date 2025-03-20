
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { School } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md text-center px-6 py-12 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <School size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl font-medium mb-6">Page non trouvée</p>
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild size="lg" className="animate-pulse">
          <Link to="/">
            Retour au tableau de bord
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

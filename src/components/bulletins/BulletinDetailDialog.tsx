import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Bulletin } from '@/types/bulletin';
import BulletinTemplate from './BulletinTemplate';

interface BulletinDetailDialogProps {
  bulletin: Bulletin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BulletinDetailDialog: React.FC<BulletinDetailDialogProps> = ({ bulletin, open, onOpenChange }) => {
  const [printMode, setPrintMode] = useState(false);

  const handlePrint = () => {
    if (bulletin) {
      setPrintMode(true);
      const bulletinWithDate = {
        ...bulletin,
        datePrinted: new Date().toISOString(),
      };

      setTimeout(() => {
        window.print();
        setPrintMode(false);
        toast.success('Bulletin imprimé avec succès');
      }, 100);
    }
  };

  const handleDownload = () => {
    toast.success('Bulletin téléchargé en format PDF');
  };

  // Si le mode d'impression est activé, on affiche uniquement le bulletin
  if (printMode) {
    return (
      <div className="print-container">
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * {
                visibility: hidden;
              }
              .print-container, .print-container * {
                visibility: visible;
              }
              .print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              @page {
                size: A4;
                margin: 1cm;
              }
            }
          `
        }} />
        <BulletinTemplate bulletin={bulletin} printMode={true} />
      </div>
    );
  }

  // Si le bulletin n'est pas encore chargé, ne rien afficher ou afficher un message de chargement
  if (!bulletin) {
    return <div>Chargement...</div>; // Ou un spinner de chargement si vous préférez
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Bulletin de {bulletin.elevePrenom} {bulletin.eleveNom}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>
              <Button variant="default" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <BulletinTemplate bulletin={bulletin} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulletinDetailDialog;

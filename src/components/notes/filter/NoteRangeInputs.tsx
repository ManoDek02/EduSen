
import React from 'react';
import { Label } from '@/components/ui/label';

interface NoteRangeInputsProps {
  noteRange: { min?: number; max?: number };
  setNoteRange: (range: { min?: number; max?: number }) => void;
}

const NoteRangeInputs: React.FC<NoteRangeInputsProps> = ({
  noteRange,
  setNoteRange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Plage de notes</Label>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="min-note" className="w-12">Min:</Label>
          <input
            type="number"
            id="min-note"
            min="0"
            max="20"
            step="0.5"
            value={noteRange.min !== undefined ? noteRange.min : ''}
            onChange={(e) => setNoteRange({
              ...noteRange,
              min: e.target.value ? parseFloat(e.target.value) : undefined
            })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="max-note" className="w-12">Max:</Label>
          <input
            type="number"
            id="max-note"
            min="0"
            max="20"
            step="0.5"
            value={noteRange.max !== undefined ? noteRange.max : ''}
            onChange={(e) => setNoteRange({
              ...noteRange,
              max: e.target.value ? parseFloat(e.target.value) : undefined
            })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default NoteRangeInputs;

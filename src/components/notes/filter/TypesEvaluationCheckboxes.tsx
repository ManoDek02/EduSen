
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TypesEvaluationCheckboxesProps {
  typesEvaluation: string[];
  typesEvaluationOptions: string[];
  handleTypeChange: (type: string, checked: boolean) => void;
}

const TypesEvaluationCheckboxes: React.FC<TypesEvaluationCheckboxesProps> = ({
  typesEvaluation,
  typesEvaluationOptions,
  handleTypeChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Types d'évaluation</Label>
      <div className="grid grid-cols-2 gap-2">
        {typesEvaluationOptions.map(type => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox 
              id={`type-${type}`}
              checked={typesEvaluation.includes(type)}
              onCheckedChange={(checked) => 
                handleTypeChange(type, checked === true)
              }
            />
            <label
              htmlFor={`type-${type}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypesEvaluationCheckboxes;

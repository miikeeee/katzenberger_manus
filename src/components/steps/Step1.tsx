import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Info, ArrowRight } from 'lucide-react';

const Step1UserConcern: React.FC = () => {
  const { formData, updateFormData, nextStep } = useFormContext();

  const options = [
    {
      value: 'Über Förderung informieren',
      label: 'Über Förderung informieren',
      description: 'Informationen zu verfügbaren Förderungen für Heizungsmodernisierung'
    },
    {
      value: 'Angebot prüfen lassen',
      label: 'Angebot prüfen lassen',
      description: 'Überprüfung eines vorliegenden Angebots auf Angemessenheit'
    },
    {
      value: 'Heizung auslegen',
      label: 'Heizung auslegen',
      description: 'Planung der optimalen Heizungslösung für Ihr Gebäude'
    },
    {
      value: 'Angebot für die Heizung',
      label: 'Angebot für die Heizung',
      description: 'Konkretes Angebot für eine neue Heizungsanlage erhalten'
    },
    {
      value: 'Hilfe beim Förderantrag',
      label: 'Hilfe beim Förderantrag',
      description: 'Unterstützung bei der Beantragung von Fördergeldern'
    },
  ];

  const handleSelect = (value: string) => {
    updateFormData({ userConcern: value });
    // No auto-advance anymore
  };

  const handleNext = () => {
    if (formData.userConcern) { // Only proceed if a selection is made
        nextStep();
    }
    // Optionally show an error/prompt if nothing is selected
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Label className="text-xl font-semibold text-gray-700">Was ist Ihr Anliegen?</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Bitte wählen Sie aus, wobei wir Ihnen helfen können.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RadioGroup
        value={formData.userConcern}
        onValueChange={handleSelect}
        className="space-y-3"
      >
        {options.map((option) => (
          <Label
            key={option.value}
            htmlFor={option.value}
            className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors ${formData.userConcern === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <RadioGroupItem value={option.value} id={option.value} />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{option.label}</span>
              <span className="text-sm text-gray-500">{option.description}</span>
            </div>
          </Label>
        ))}
      </RadioGroup>

      {/* Navigation Buttons */}
      <div className="flex justify-end pt-6 border-t mt-6">
        {/* No Back button on Step 1 */}
        <Button
            onClick={handleNext}
            disabled={!formData.userConcern} // Disable if no selection
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step1UserConcern;


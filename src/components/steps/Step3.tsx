import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ArrowLeft, ArrowRight } from 'lucide-react';

const Step3CurrentSystemAge: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const options = [
    { value: 'Jünger als 20 Jahre', label: 'Jünger als 20 Jahre' },
    { value: '20 Jahre oder älter', label: '20 Jahre oder älter' },
    { value: 'Unbekannt', label: 'Unbekannt' },
  ];

  const handleSelect = (value: string) => {
    updateFormData({ currentSystemAge: value });
    // No auto-advance
  };

  const handleNext = () => {
    if (formData.currentSystemAge) {
        nextStep();
    }
    // Optionally add feedback if validation fails
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Label className="text-xl font-semibold text-gray-700">Wie alt ist die aktuelle Heizungsanlage ungefähr?</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Das Alter der Anlage ist relevant für die Einschätzung der Effizienz und möglicher Austauschpflichten.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col space-y-3">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={formData.currentSystemAge === option.value ? 'default' : 'outline'}
            onClick={() => handleSelect(option.value)}
            className={`w-full justify-start h-auto py-3 px-4 rounded-md transition-colors ${formData.currentSystemAge === option.value ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button
            onClick={handleNext}
            disabled={!formData.currentSystemAge}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step3CurrentSystemAge;


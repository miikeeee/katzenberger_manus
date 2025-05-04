import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ArrowLeft, ArrowRight } from 'lucide-react';

const Step4PlanningHeatPump: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const options = [
    { value: 'Ja', label: 'Ja' },
    { value: 'Nein', label: 'Nein' },
    { value: 'Weiß ich noch nicht', label: 'Weiß ich noch nicht' },
  ];

  const handleSelect = (value: string) => {
    updateFormData({ planningHeatPump: value });
    // No auto-advance
  };

  const handleNext = () => {
    if (formData.planningHeatPump) {
        nextStep();
    }
    // Optionally add feedback if validation fails
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Label className="text-xl font-semibold text-gray-700">Planen Sie eine Wärmepumpe einzubauen?</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Dies ist eine erste Einschätzung Ihrer Pläne.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col space-y-3">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={formData.planningHeatPump === option.value ? 'default' : 'outline'}
            onClick={() => handleSelect(option.value)}
            className={`w-full justify-start h-auto py-3 px-4 rounded-md transition-colors ${formData.planningHeatPump === option.value ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
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
            disabled={!formData.planningHeatPump}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step4PlanningHeatPump;


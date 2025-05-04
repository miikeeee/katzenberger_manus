import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ArrowLeft, ArrowRight } from 'lucide-react';

const Step10WaterHeating: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const options = [
    { value: 'Über die Heizung', label: 'Über die Heizung' },
    { value: 'Elektrisch (Boiler/Durchlauferhitzer)', label: 'Elektrisch (Boiler/Durchlauferhitzer)' },
    { value: 'Solarthermie', label: 'Solarthermie' },
    { value: 'Andere', label: 'Andere' }, // Consider adding an input for 'Andere'
  ];

  const handleSelect = (value: string) => {
    updateFormData({ waterHeating: value });
    // No auto-advance
  };

  const handleNext = () => {
    if (formData.waterHeating) {
        nextStep();
    }
    // Optionally add feedback if validation fails
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Label className="text-xl font-semibold text-gray-700">Wie wird das Warmwasser erzeugt?</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Die Art der Warmwasserbereitung ist wichtig für die Gesamtenergiebilanz und die Auslegung einer neuen Anlage.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RadioGroup
        value={formData.waterHeating}
        onValueChange={handleSelect}
        className="space-y-3"
      >
        {options.map((option) => (
          <Label
            key={option.value}
            htmlFor={option.value}
            className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors ${formData.waterHeating === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <RadioGroupItem value={option.value} id={option.value} />
            <span className="font-medium text-gray-800">{option.label}</span>
          </Label>
        ))}
      </RadioGroup>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button
            onClick={handleNext}
            disabled={!formData.waterHeating}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step10WaterHeating;


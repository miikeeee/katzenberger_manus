import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ArrowLeft, ArrowRight } from 'lucide-react';

const Step9HeatingDistribution: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const options = [
    { value: 'Heizkörper', label: 'Heizkörper' },
    { value: 'Fußbodenheizung', label: 'Fußbodenheizung' },
    { value: 'Gemischt', label: 'Gemischt (Heizkörper & Fußbodenheizung)' },
    { value: 'Andere', label: 'Andere' }, // Consider adding an input for 'Andere'
  ];

  const handleSelect = (value: string) => {
    updateFormData({ heatingDistribution: value });
    // No auto-advance
  };

  const handleNext = () => {
    if (formData.heatingDistribution) {
        nextStep();
    }
    // Optionally add feedback if validation fails
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Label className="text-xl font-semibold text-gray-700">Welche Art von Heizverteilung ist im Gebäude vorhanden?</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Die Art der Wärmeverteilung (z.B. Heizkörper, Fußbodenheizung) beeinflusst die benötigte Vorlauftemperatur und die Effizienz, insbesondere bei Wärmepumpen.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RadioGroup
        value={formData.heatingDistribution}
        onValueChange={handleSelect}
        className="space-y-3"
      >
        {options.map((option) => (
          <Label
            key={option.value}
            htmlFor={option.value}
            className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors ${formData.heatingDistribution === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
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
            disabled={!formData.heatingDistribution}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step9HeatingDistribution;


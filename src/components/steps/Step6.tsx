import React, { useState, useEffect } from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ArrowLeft, ArrowRight } from 'lucide-react';

const Step6HouseholdSize: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  // Use buttons for selection: "1", "2", "3", "4", "5+"
  const options = ["1", "2", "3", "4", "5+"];
  const [selectedSize, setSelectedSize] = useState<string | undefined>(formData.householdSize);

  // Update context when selection changes
  useEffect(() => {
    updateFormData({ householdSize: selectedSize });
  }, [selectedSize, updateFormData]);

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
  };

  const handleNext = () => {
    if (selectedSize) {
      nextStep();
    }
    // Optional: Add feedback if no size is selected
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Label className="text-xl font-semibold text-gray-700">Wie viele Personen leben dauerhaft im Haushalt?</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Die Anzahl der Personen beeinflusst den Warmwasserbedarf und somit die Auslegung der Heizungsanlage.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Button Selection */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {options.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            onClick={() => handleSelectSize(size)}
            className={`text-lg h-12 ${selectedSize === size ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {size}
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
            disabled={!selectedSize} // Disable if no size is selected
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step6HouseholdSize;


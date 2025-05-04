import React, { useState, useEffect } from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ArrowLeft, Send } from 'lucide-react'; // Using Send icon for submit

const Step11PostalCode: React.FC = () => {
  const { formData, updateFormData, submitForm, prevStep, isSubmitting } = useFormContext();
  const [postalCode, setPostalCode] = useState<string>(formData.postalCode || '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Update context whenever local state changes
    updateFormData({ postalCode: postalCode });
    if (postalCode) {
        setError(''); // Clear error when user types
    }
  }, [postalCode, updateFormData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only numbers, max 5 digits for German PLZ
    if (/^\d{0,5}$/.test(value)) {
      setPostalCode(value);
    }
  };

  const validateAndSubmit = () => {
    // Basic German PLZ validation (exactly 5 digits)
    if (!/^\d{5}$/.test(postalCode)) {
      setError('Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.');
    } else {
      setError('');
      submitForm(); // Trigger the submission process from context
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Label htmlFor="postalCode" className="text-xl font-semibold text-gray-700">Wie lautet Ihre Postleitzahl?</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Die Postleitzahl hilft uns, regionale Gegebenheiten und mögliche Partner in Ihrer Nähe zu berücksichtigen.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div>
        <Input
          id="postalCode"
          type="text" // Use text to allow leading zeros if needed, pattern enforces digits
          inputMode="numeric" // Hint for numeric keyboard
          pattern="[0-9]{5}" // HTML5 pattern validation
          value={postalCode}
          onChange={handleInputChange}
          placeholder="z.B. 10115"
          maxLength={5}
          className={`w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button
            onClick={validateAndSubmit}
            disabled={!postalCode || !!error || isSubmitting} // Disable if empty, error, or submitting
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? 'Sende...' : 'Absenden'} <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step11PostalCode;


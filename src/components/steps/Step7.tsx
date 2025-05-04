import React, { useState, useEffect } from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// Import AlertTriangle icon
import { Info, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

const Step7ConstructionYear: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  const [constructionYear, setConstructionYear] = useState<string>(formData.constructionYear?.toString() || '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const yearValue = parseInt(constructionYear, 10);
    if (!isNaN(yearValue)) {
      updateFormData({ constructionYear: yearValue });
      // Clear error if input becomes potentially valid (validation on proceed)
      setError(''); 
    } else if (constructionYear === '') {
      updateFormData({ constructionYear: undefined });
      setError('');
    } else {
      updateFormData({ constructionYear: undefined });
      // Don't set error here, wait for validation on next step attempt
    }
  }, [constructionYear, updateFormData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setConstructionYear(value);
    }
  };

  const validateAndProceed = () => {
    const yearValue = parseInt(constructionYear, 10);
    // Updated validation range: 1850 - 2027
    if (isNaN(yearValue) || yearValue < 1850 || yearValue > 2027) {
      // Updated error message
      setError('Bitte geben Sie ein gültiges Baujahr zwischen 1850 und 2027 ein.');
    } else {
      setError('');
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1"> {/* Reduced space-y for tighter error message */} 
        <div className="flex items-center space-x-2">
          <Label htmlFor="constructionYear" className="text-xl font-semibold text-gray-700">In welchem Jahr wurde das Gebäude ca. gebaut?</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Das Baujahr gibt Aufschluss über die Bauweise und mögliche energetische Standards.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <Input
            id="constructionYear"
            type="number"
            inputMode="numeric"
            value={constructionYear}
            onChange={handleInputChange}
            placeholder="z.B. 1985"
            maxLength={4}
            // Updated styling for error state
            className={`w-full ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            aria-invalid={!!error}
            aria-describedby={error ? "year-error" : undefined}
          />
        </div>
        {/* Enhanced Error Message */} 
        {error && (
            <p id="year-error" className="flex items-center text-sm text-red-600 mt-1">
                <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                {error}
            </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button
            onClick={validateAndProceed}
            // Disable if empty or potentially invalid (error state updates on validation)
            disabled={!constructionYear || !!error} 
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step7ConstructionYear;


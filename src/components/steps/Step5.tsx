import React, { useState, useEffect } from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// Import AlertTriangle icon
import { Info, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

const Step5LivingArea: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const [livingAreaTotal, setLivingAreaTotal] = useState<string>(formData.livingAreaTotal?.toString() || '');
  const [livingAreaHeated, setLivingAreaHeated] = useState<string>(formData.livingAreaHeated?.toString() || '');
  const [errors, setErrors] = useState<{ total?: string; heated?: string }>({});

  useEffect(() => {
    const totalValue = parseInt(livingAreaTotal, 10);
    const heatedValue = parseInt(livingAreaHeated, 10);

    updateFormData({
      livingAreaTotal: !isNaN(totalValue) ? totalValue : undefined,
      livingAreaHeated: !isNaN(heatedValue) ? heatedValue : undefined,
    });

    // Dynamic validation as user types (optional, can be intensive)
    // For now, clear errors on input change, validate on proceed
    setErrors(prev => ({
        total: livingAreaTotal && prev.total ? '' : prev.total,
        heated: livingAreaHeated && prev.heated ? '' : prev.heated
    }));

  }, [livingAreaTotal, livingAreaHeated, updateFormData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'total' | 'heated') => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      if (type === 'total') {
        setLivingAreaTotal(value);
      } else {
        setLivingAreaHeated(value);
      }
    }
  };

  const validateAndProceed = () => {
    const totalValue = parseInt(livingAreaTotal, 10);
    const heatedValue = parseInt(livingAreaHeated, 10);
    let currentErrors: { total?: string; heated?: string } = {};

    if (isNaN(totalValue) || totalValue < 30 || totalValue > 450) {
      currentErrors.total = 'Gesamtfläche muss zwischen 30 und 450 m² liegen.';
    } else {
        currentErrors.total = '';
    }

    if (isNaN(heatedValue) || heatedValue <= 0) {
      currentErrors.heated = 'Beheizte Fläche muss eine positive Zahl sein.';
    } else if (!isNaN(totalValue) && heatedValue > totalValue) {
      currentErrors.heated = 'Beheizte Fläche darf nicht größer als die Gesamtfläche sein.';
    } else {
        currentErrors.heated = '';
    }

    setErrors(currentErrors);

    if (!currentErrors.total && !currentErrors.heated) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      {/* Total Living Area */}
      <div className="space-y-1"> {/* Reduced space-y for tighter error message */} 
        <div className="flex items-center space-x-2">
          <Label htmlFor="livingAreaTotal" className="text-lg font-semibold text-gray-700">Wie groß ist die Wohnfläche ca.?</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Geben Sie die ungefähre gesamte Wohnfläche in Quadratmetern an.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative flex items-center">
          <Input
            id="livingAreaTotal"
            type="number"
            inputMode="numeric"
            value={livingAreaTotal}
            onChange={(e) => handleInputChange(e, 'total')}
            placeholder="z.B. 150"
            className={`w-full pr-10 ${errors.total ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            min="30"
            max="450"
            aria-invalid={!!errors.total}
            aria-describedby={errors.total ? "total-error" : undefined}
          />
          <span className="absolute right-3 text-gray-500 pointer-events-none">m²</span>
        </div>
        {/* Enhanced Error Message */} 
        {errors.total && (
            <p id="total-error" className="flex items-center text-sm text-red-600 mt-1">
                <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.total}
            </p>
        )}
      </div>

      {/* Heated Living Area */}
      <div className="space-y-1"> {/* Reduced space-y for tighter error message */} 
        <div className="flex items-center space-x-2">
          <Label htmlFor="livingAreaHeated" className="text-lg font-semibold text-gray-700">Davon beheizte Fläche ca.?</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Geben Sie die ungefähre beheizte Wohnfläche in Quadratmetern an. Diese muss kleiner oder gleich der Gesamtfläche sein.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="relative flex items-center">
          <Input
            id="livingAreaHeated"
            type="number"
            inputMode="numeric"
            value={livingAreaHeated}
            onChange={(e) => handleInputChange(e, 'heated')}
            placeholder="z.B. 120"
            className={`w-full pr-10 ${errors.heated ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            min="1"
            max={livingAreaTotal || undefined}
            aria-invalid={!!errors.heated}
            aria-describedby={errors.heated ? "heated-error" : undefined}
          />
          <span className="absolute right-3 text-gray-500 pointer-events-none">m²</span>
        </div>
        {/* Enhanced Error Message */} 
        {errors.heated && (
            <p id="heated-error" className="flex items-center text-sm text-red-600 mt-1">
                <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.heated}
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
            // Disable logic remains the same, but relies on error state being accurate
            disabled={!livingAreaTotal || !livingAreaHeated || !!errors.total || !!errors.heated}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step5LivingArea;


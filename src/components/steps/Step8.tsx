import React, { useState, useEffect } from 'react';
import { useFormContext } from '@/context/FormContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the structure for sanitation details as expected by FormContext
interface SanitationDetail {
  type: string; // e.g., 'dach', 'fassade'
  scope: string; // e.g., 'übliche Sanierung', 'tiefgehendere Sanierung'
}

// Define the options available in the UI
interface SanitationArea {
  id: string; // Corresponds to 'type' in SanitationDetail
  label: string;
}

const Step8Sanitation: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  // State for the initial Yes/No question - Renamed state variable and use correct formData property
  const [sanitationPerformedValue, setSanitationPerformedValue] = useState<string | undefined>(formData.sanitationPerformed);
  // State for the selected areas (checkboxes)
  const [selectedAreas, setSelectedAreas] = useState<string[]>(formData.sanitationDetails?.map(d => d.type) || []);
  // State for the scope of each selected area
  const [areaScopes, setAreaScopes] = useState<Record<string, string>>(
    formData.sanitationDetails?.reduce((acc, detail) => {
      acc[detail.type] = detail.scope;
      return acc;
    }, {} as Record<string, string>) || {}
  );

  const areas: SanitationArea[] = [
    { id: 'dach', label: 'Dach' },
    { id: 'fassade', label: 'Fassade (Wände Außen)' }, // Match reference image label
    { id: 'fenster', label: 'Fenster' },
    { id: 'kellerdecke', label: 'Kellerdecke (Boden/Kellerdecke)' }, // Match reference image label
    { id: 'haustuer', label: 'Haustür' }, // Add Haustür
  ];

  const scopeOptions = ['übliche Sanierung', 'tiefgehendere Sanierung'];

  // Update context whenever relevant state changes
  useEffect(() => {
    const details: SanitationDetail[] = selectedAreas.map(areaId => ({
      type: areaId,
      scope: areaScopes[areaId] || '', // Ensure scope exists, default to empty if not set yet
    })).filter(detail => detail.scope); // Only include details with a selected scope

    updateFormData({
      sanitationPerformed: sanitationPerformedValue, // Use correct property name and state variable
      sanitationDetails: sanitationPerformedValue === 'yes' ? details : [], // Only save details if 'yes'
    });
  }, [sanitationPerformedValue, selectedAreas, areaScopes, updateFormData]);

  const handleSanitationPerformedChange = (value: string) => {
    setSanitationPerformedValue(value); // Update renamed state variable
    if (value === 'no') {
      // Clear selections if user chooses 'no'
      setSelectedAreas([]);
      setAreaScopes({});
    }
  };

  const handleAreaCheckboxChange = (areaId: string, checked: boolean | 'indeterminate') => {
    setSelectedAreas(prev => {
      if (checked) {
        return [...prev, areaId];
      } else {
        // Also remove scope when unchecking
        setAreaScopes(currentScopes => {
            const newScopes = {...currentScopes};
            delete newScopes[areaId];
            return newScopes;
        });
        return prev.filter(id => id !== areaId);
      }
    });
  };

  const handleScopeChange = (areaId: string, scope: string) => {
    setAreaScopes(prev => ({
      ...prev,
      [areaId]: scope,
    }));
  };

  const handleNext = () => {
    // Validation: If 'yes', at least one area must be selected and have a scope
    if (sanitationPerformedValue === 'yes') { // Use renamed state variable
        const hasValidSelection = selectedAreas.length > 0 && selectedAreas.every(areaId => areaScopes[areaId]);
        if (!hasValidSelection) {
            // Optional: Add user feedback about needing to select scope
            console.log("Please select a scope for all checked areas.");
            return; // Prevent proceeding
        }
    }
    if (sanitationPerformedValue) { // Use renamed state variable
        nextStep();
    }
    // Optional: Add feedback if sanitationPerformedValue is not selected
  }

  return (
    <div className="space-y-6">
      {/* Initial Yes/No Question */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Label className="text-xl font-semibold text-gray-700">Wurden bereits energetische Sanierungen durchgeführt?</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Angaben zu bereits durchgeführten Sanierungen helfen, den energetischen Zustand des Gebäudes besser einzuschätzen.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <RadioGroup
          value={sanitationPerformedValue} // Use renamed state variable
          onValueChange={handleSanitationPerformedChange} // Use renamed handler
          className="space-y-3"
        >
          <Label
            htmlFor="sanitation-yes"
            className={`flex flex-col space-y-1 rounded-md border p-4 cursor-pointer transition-colors ${sanitationPerformedValue === 'yes' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="yes" id="sanitation-yes" />
              <span className="font-medium text-gray-800">Ja</span>
            </div>
            <span className="pl-7 text-sm text-gray-600">Es wurden bereits energetische Sanierungsmaßnahmen durchgeführt</span>
          </Label>
          <Label
            htmlFor="sanitation-no"
            className={`flex flex-col space-y-1 rounded-md border p-4 cursor-pointer transition-colors ${sanitationPerformedValue === 'no' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="no" id="sanitation-no" />
              <span className="font-medium text-gray-800">Nein</span>
            </div>
            <span className="pl-7 text-sm text-gray-600">Es wurden keine energetischen Sanierungsmaßnahmen durchgeführt</span>
          </Label>
        </RadioGroup>
      </div>

      {/* Conditional Sanitation Details Section */}
      <AnimatePresence>
        {sanitationPerformedValue === 'yes' && ( // Use renamed state variable
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 border-t pt-6 mt-6 overflow-hidden"
          >
            <Label className="text-lg font-semibold text-gray-700">Art der Sanierung:</Label>
            {areas.map((area) => (
              <div key={area.id} className="space-y-3 border p-4 rounded-md bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`area-${area.id}`}
                    checked={selectedAreas.includes(area.id)}
                    onCheckedChange={(checked) => handleAreaCheckboxChange(area.id, checked)}
                  />
                  <Label htmlFor={`area-${area.id}`} className="font-medium text-gray-800 cursor-pointer">
                    {area.label}
                  </Label>
                </div>
                {/* Conditional Dropdown for Scope */}
                <AnimatePresence>
                  {selectedAreas.includes(area.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-7 pt-2 overflow-hidden"
                    >
                      <Label htmlFor={`scope-${area.id}`} className="text-sm font-medium text-gray-600 mb-1 block">Umfang der Sanierung am {area.label.split('(')[0].trim()}:</Label>
                      <Select
                        value={areaScopes[area.id] || ''}
                        onValueChange={(value) => handleScopeChange(area.id, value)}
                      >
                        <SelectTrigger id={`scope-${area.id}`} className="w-full bg-white">
                          <SelectValue placeholder="Bitte auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {scopeOptions.map((scope) => (
                            <SelectItem key={scope} value={scope}>{scope}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button
            onClick={handleNext}
            disabled={!sanitationPerformedValue || (sanitationPerformedValue === 'yes' && selectedAreas.some(areaId => !areaScopes[areaId]))} // Disable if 'yes' and any selected area lacks scope
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step8Sanitation;


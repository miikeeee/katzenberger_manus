import React, { useState, useEffect } from 'react';
import { useFormContext } from '@/context/FormContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input'; // For 'Sonstiges'
import { Info, Flame, Wind, Network, Droplet, Terminal, ArrowLeft, ArrowRight } from 'lucide-react';

interface EnergySourceOption {
  id: string;
  label: string;
  icon: React.ElementType;
}

const Step2EnergySource: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  // Initialize selectedSources from context, ensuring it's always an array
  const initialSources = Array.isArray(formData.energySource) ? formData.energySource.map(s => s.split(':')[0].trim().toLowerCase().replace(' ', '')) : [];
  const initialOtherText = Array.isArray(formData.energySource) ? formData.energySource.find(s => s.startsWith('Sonstiges:'))?.split(':')[1]?.trim() || '' : '';

  const [selectedSources, setSelectedSources] = useState<string[]>(initialSources);
  const [otherSourceText, setOtherSourceText] = useState<string>(initialOtherText);
  const [showFernwaermeAlert, setShowFernwaermeAlert] = useState<boolean>(false);

  const options: EnergySourceOption[] = [
    { id: 'oel', label: 'Öl', icon: Flame },
    { id: 'waermepumpe', label: 'Wärmepumpe', icon: Wind },
    { id: 'gas', label: 'Gas', icon: Flame },
    { id: 'fernwaerme', label: 'Fernwärme', icon: Network },
    { id: 'sonstiges', label: 'Sonstiges', icon: Droplet },
  ];

  // Effect to check for Fernwärme and update context
  useEffect(() => {
    const hasFernwaerme = selectedSources.includes('fernwaerme');
    setShowFernwaermeAlert(hasFernwaerme);

    // Prepare data for context update
    let sourcesToSave: string[] = [];
    if (selectedSources.includes('sonstiges')) {
      // Find the full label for selected options (excluding 'sonstiges')
      sourcesToSave = selectedSources
        .filter(id => id !== 'sonstiges')
        .map(id => options.find(opt => opt.id === id)?.label || id);
      // Add the 'Sonstiges' entry with its text
      sourcesToSave.push(`Sonstiges: ${otherSourceText}`);
    } else {
      // Find the full label for all selected options
      sourcesToSave = selectedSources.map(id => options.find(opt => opt.id === id)?.label || id);
    }
    updateFormData({ energySource: sourcesToSave });

  }, [selectedSources, otherSourceText, updateFormData]); // Dependency array includes updateFormData

  const handleCheckboxChange = (checked: boolean | 'indeterminate', sourceId: string) => {
    setSelectedSources(prev =>
      checked
        ? [...prev, sourceId]
        : prev.filter(id => id !== sourceId)
    );
     // Clear 'Sonstiges' text if it's unchecked
    if (sourceId === 'sonstiges' && !checked) {
        setOtherSourceText('');
    }
  };

  const handleOtherTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherSourceText(event.target.value);
  };

  const isSonstigesSelected = selectedSources.includes('sonstiges');

  const handleNext = () => {
      // Basic validation: ensure at least one option is selected unless it's Fernwärme
      if (selectedSources.length > 0 && !showFernwaermeAlert) {
          nextStep();
      }
      // Optionally add feedback if validation fails
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Label className="text-xl font-semibold text-gray-700">Welcher Energieträger wird derzeit für die Heizung verwendet?</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-5 w-5 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Mehrfachauswahl möglich. Die Angabe hilft bei der Einschätzung der aktuellen Situation und möglicher Alternativen.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {showFernwaermeAlert && (
        <Alert variant="destructive" className="bg-red-50 border-red-300 text-red-800">
          <Terminal className="h-5 w-5" />
          <AlertTitle className="font-semibold">Hinweis</AlertTitle>
          <AlertDescription>
            Wir bieten leider keinen Service für Fernwärme an. Eine weitere Bearbeitung ist nicht möglich.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {options.map((option) => {
          const IconComponent = option.icon; // Get the icon component
          return (
            <div key={option.id} className="flex flex-col space-y-2">
              <Label
                htmlFor={option.id}
                className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors ${selectedSources.includes(option.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'} ${showFernwaermeAlert && option.id !== 'fernwaerme' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Checkbox
                  id={option.id}
                  checked={selectedSources.includes(option.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(checked, option.id)}
                  disabled={showFernwaermeAlert && option.id !== 'fernwaerme'}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <IconComponent className={`h-6 w-6 ${selectedSources.includes(option.id) ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium text-gray-800">{option.label}</span>
              </Label>
              {option.id === 'sonstiges' && isSonstigesSelected && (
                <Input
                  type="text"
                  placeholder="Bitte Energieträger angeben"
                  value={otherSourceText}
                  onChange={handleOtherTextChange}
                  className="ml-12 w-[calc(100%-3rem)]" // Indent the text field
                  disabled={showFernwaermeAlert}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t mt-6">
        <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück
        </Button>
        <Button
            onClick={handleNext}
            disabled={selectedSources.length === 0 || showFernwaermeAlert}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Weiter <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step2EnergySource;


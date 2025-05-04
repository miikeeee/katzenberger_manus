import React, { useEffect, useState } from 'react';
import { useFormContext } from '@/context/FormContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Edit, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// Helper to format labels
const formatLabel = (key: string): string => {
  const labels: { [key: string]: string } = {
    userConcern: 'Ihr Anliegen',
    energySource: 'Aktueller Energieträger',
    currentSystemAge: 'Alter der Heizung',
    planningHeatPump: 'Wärmepumpe geplant',
    livingAreaTotal: 'Gesamte Wohnfläche',
    livingAreaHeated: 'Beheizte Wohnfläche',
    householdSize: 'Personen im Haushalt',
    constructionYear: 'Baujahr des Gebäudes',
    sanitationPerformed: 'Sanierungen durchgeführt',
    sanitationDetails: 'Details der Sanierung',
    heatingDistribution: 'Wärmeverteilung',
    waterHeating: 'Warmwasserbereitung',
    postalCode: 'Postleitzahl',
  };
  // Add specific labels for sanitation detail types if needed
  const detailLabels: { [key: string]: string } = {
    dach: 'Dach',
    fassade: 'Fassade',
    fenster: 'Fenster',
    kellerdecke: 'Kellerdecke',
    haustuer: 'Haustür',
  };
  return detailLabels[key] || labels[key] || key;
};

// Helper to format values
const formatValue = (key: string, value: any): string => {
  if (value === undefined || value === null || value === '') return 'Nicht angegeben';
  if (typeof value === 'boolean') return value ? 'Ja' : 'Nein';
  if (key === 'livingAreaTotal' || key === 'livingAreaHeated') return `${value} m²`;
  if (key === 'constructionYear') return value.toString();
  if (key === 'sanitationPerformed') return value === 'yes' ? 'Ja' : 'Nein';
  if (key === 'sanitationDetails') {
    if (Array.isArray(value) && value.length > 0) {
      return value
        .filter(detail => detail && detail.type && detail.scope)
        .map(detail => `${formatLabel(detail.type)}: ${detail.scope}`)
        .join('; '); // Use semicolon for better separation
    } else {
      return 'Keine Details angegeben';
    }
  }
  // Handle array values like energySource
  if (Array.isArray(value)) {
      return value.join(', ');
  }
  return value.toString();
};

const ResultsPage: React.FC = () => {
  const { formData, webhookResponse, isSubmitting, goToStep, resetForm } = useFormContext();
  const [loadingText, setLoadingText] = useState('Ihre Angaben werden verarbeitet...');
  const [progress, setProgress] = useState(0);

  // Dynamic loading text and progress effect
  useEffect(() => {
    let textIntervalId: NodeJS.Timeout | null = null;
    let progressIntervalId: NodeJS.Timeout | null = null;
    const loadingDuration = 3000; // Minimum 3 seconds

    if (isSubmitting) {
      // Text animation
      const texts = [
        'Ihre Angaben werden verarbeitet...',
        'Berechnungen werden durchgeführt...',
        'Ergebnisse werden aufbereitet...'
      ];
      let textIndex = 0;
      setLoadingText(texts[textIndex]);
      textIntervalId = setInterval(() => {
        textIndex = (textIndex + 1) % texts.length;
        setLoadingText(texts[textIndex]);
      }, 1200);

      // Progress animation
      setProgress(0);
      const startTime = Date.now();
      progressIntervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        // Ensure progress stops at 100 even if webhook takes longer
        const calculatedProgress = Math.min(100, (elapsedTime / loadingDuration) * 100);
        setProgress(calculatedProgress);
        // Stop interval based on time, not just reaching 100%
        if (elapsedTime >= loadingDuration) {
            if (progressIntervalId) clearInterval(progressIntervalId);
            // Ensure progress is exactly 100 at the end
            setProgress(100);
        }
      }, 100);

    } else {
        // Reset progress if not submitting (e.g., navigating back)
        setProgress(0);
    }

    return () => {
      if (textIntervalId) clearInterval(textIntervalId);
      if (progressIntervalId) clearInterval(progressIntervalId);
    };
  }, [isSubmitting]);

  const handleEdit = (step: number) => {
    goToStep(step);
  };

  const handleRestart = () => {
    resetForm();
    goToStep(1);
  };

  // --- Render Logic --- 

  // 1. Loading State
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 min-h-[300px]">
        <div className="relative w-24 h-24">
            <Home className="absolute inset-0 m-auto h-10 w-10 text-blue-500 opacity-50" />
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                ></circle>
                <circle
                    className="text-green-500 stroke-current progress-ring__circle"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                ></circle>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-gray-700">
                {Math.round(progress)}%
            </span>
        </div>
        <p className="text-lg font-semibold text-muted-foreground text-center mt-4">{loadingText}</p>
      </div>
    );
  }

  // 2. Error State (Check *after* loading state)
  if (webhookResponse?.error) {
    return (
      <div className="space-y-4 p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Fehler bei der Verarbeitung</AlertTitle>
          <AlertDescription>
            Es gab ein Problem bei der Übermittlung oder Verarbeitung Ihrer Daten:
            <br />
            {webhookResponse.error}
            <br />
            Bitte versuchen Sie es später erneut oder kontaktieren Sie uns.
          </AlertDescription>
        </Alert>
        <Button onClick={handleRestart} variant="outline">Erneut versuchen</Button>
      </div>
    );
  }

  // 3. No Response State (If not loading and no response yet - should be brief)
  if (!webhookResponse) {
      return (
          <div className="flex flex-col items-center justify-center space-y-4 p-8 min-h-[300px]">
              <p className="text-lg text-muted-foreground">Ergebnisse werden geladen...</p>
              {/* Optional: Add a simpler spinner here if needed */}
          </div>
      );
  }

  // 4. Success State (Only if not loading, no error, and response exists)
  const heizlastWert1 = webhookResponse.heizlast_wert1;
  const heizlastWert2 = webhookResponse.heizlast_wert2;
  const heizlastWert3 = webhookResponse.heizlast_wert3;

  const stepMap: { [key: string]: number } = {
    userConcern: 1,
    energySource: 2,
    currentSystemAge: 3,
    planningHeatPump: 4,
    livingAreaTotal: 5,
    livingAreaHeated: 5,
    householdSize: 6,
    constructionYear: 7,
    sanitationPerformed: 8,
    sanitationDetails: 8,
    heatingDistribution: 9,
    waterHeating: 10,
    postalCode: 11,
  };

  return (
    <div className="space-y-8 p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-800">Ihre Ergebnisse</CardTitle>
          <CardDescription className="text-center">Basierend auf Ihren Angaben wurden folgende Heizlasten geschätzt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[heizlastWert1, heizlastWert2, heizlastWert3].map((wert, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <Label className="text-sm font-medium text-gray-500">Heizlastwert {index + 1}</Label>
                {wert !== undefined && wert !== null ? (
                  <p className="text-3xl font-bold text-blue-600 mt-1">{wert.toFixed(1)} <span className="text-lg font-normal text-gray-600">kWh</span></p>
                ) : (
                  <p className="text-lg text-muted-foreground mt-1">N/A</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center pt-4 border-t">Dies sind erste Schätzungen. Für eine genaue Planung ist eine detaillierte Berechnung durch einen Fachmann erforderlich.</p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Ihre Eingaben im Überblick</CardTitle>
          <CardDescription>Sie können Ihre Angaben hier überprüfen und bei Bedarf ändern.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(formData).map(([key, value]) => {
            if (value === undefined || value === null || value === '' || (key === 'sanitationDetails' && (!formData.sanitationPerformed || formData.sanitationPerformed === 'no'))) {
              return null;
            }
            const stepNumber = stepMap[key];
            return (
              <div key={key} className="flex justify-between items-center p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                <div>
                  <Label className="font-medium text-gray-700">{formatLabel(key)}</Label>
                  <p className="text-sm text-gray-600">{formatValue(key, value)}</p>
                </div>
                {stepNumber && (
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(stepNumber)} className="text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4 mr-1" /> Ändern
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button onClick={handleRestart} variant="outline" className="w-full max-w-xs">
          Neue Berechnung starten
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;


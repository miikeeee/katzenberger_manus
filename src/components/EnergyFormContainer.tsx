import React from 'react';
import { FormProvider, useFormContext } from '@/context/FormContext';
import { Progress } from '@/components/ui/progress';
// Removed Framer Motion imports: AnimatePresence, motion, Variants
import { Card, CardContent } from '@/components/ui/card';

// Import Step Components
import Step1UserConcern from '@/components/steps/Step1';
import Step2EnergySource from '@/components/steps/Step2';
import Step3CurrentSystemAge from '@/components/steps/Step3';
import Step4PlanningHeatPump from '@/components/steps/Step4';
import Step5LivingArea from '@/components/steps/Step5';
import Step6HouseholdSize from '@/components/steps/Step6';
import Step7ConstructionYear from '@/components/steps/Step7';
import Step8Sanitation from '@/components/steps/Step8';
import Step9HeatingDistribution from '@/components/steps/Step9';
import Step10WaterHeating from '@/components/steps/Step10';
import Step11PostalCode from '@/components/steps/Step11';
import ResultsPage from '@/components/ResultsPage';

const totalSteps = 11;

const StepComponent: React.FC<{ step: number }> = ({ step }) => {
  const components = [
    Step1UserConcern,
    Step2EnergySource,
    Step3CurrentSystemAge,
    Step4PlanningHeatPump,
    Step5LivingArea,
    Step6HouseholdSize,
    Step7ConstructionYear,
    Step8Sanitation,
    Step9HeatingDistribution,
    Step10WaterHeating,
    Step11PostalCode,
    ResultsPage // Step 12 is results
  ];

  const CurrentStepComponent = components[step - 1];

  if (!CurrentStepComponent) {
    return <div>Ungültiger Schritt</div>;
  }

  return <CurrentStepComponent />;
};

const EnergyFormContent: React.FC = () => {
  const { currentStep } = useFormContext();
  const progressValue = currentStep <= totalSteps ? ((currentStep - 1) / totalSteps) * 100 : 100;
  const progressPercent = Math.round(progressValue);

  // Removed state and effect for transition direction
  // const [prevStepState, setPrevStepState] = React.useState(currentStep);
  // const direction = currentStep > prevStepState ? 1 : -1;
  // React.useEffect(() => {
  //   setPrevStepState(currentStep);
  // }, [currentStep]);

  // Removed variants object

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-8">
         <span className="inline-block bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1 rounded-full text-sm mb-2">Energieberatung</span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Heizungsberatung</h1>
        <p className="text-gray-600 max-w-xl mx-auto">Füllen Sie das Formular aus und erhalten Sie eine kostenlose Erstberatung zu Ihrer neuen Heizungsanlage</p>
      </div>

      <Card className="w-full max-w-2xl shadow-lg rounded-lg overflow-hidden">
        {currentStep <= totalSteps && (
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Schritt {currentStep} von {totalSteps}</span>
                <span className="text-sm font-medium text-gray-700">{progressPercent}% abgeschlossen</span>
            </div>
            <Progress value={progressValue} className="w-full h-2 [&>*]:bg-gradient-to-r [&>*]:from-blue-500 [&>*]:to-green-500" />
          </div>
        )}
         {currentStep > totalSteps && (
            <div className="p-6 border-b text-center">
                 <span className="text-lg font-semibold text-gray-700">Ergebnis</span>
            </div>
         )}

        {/* Removed outer motion.div for layout animation */}
        <CardContent className="p-6 relative overflow-hidden">
          {/* Removed AnimatePresence and inner motion.div */}
          <StepComponent step={currentStep} />
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Energieberatung Musterfirma. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
};

const EnergyFormContainer: React.FC = () => {
  return (
    <FormProvider>
      <EnergyFormContent />
    </FormProvider>
  );
};

export default EnergyFormContainer;


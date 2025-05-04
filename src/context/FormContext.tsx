import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the structure for the form data
interface FormData {
  userConcern?: string;
  energySource?: string[];
  currentSystemAge?: string;
  planningHeatPump?: string;
  livingAreaTotal?: number | string; // Allow string for initial empty input
  livingAreaHeated?: number | string; // Allow string for initial empty input
  householdSize?: string;
  constructionYear?: number | string; // Allow string for initial empty input
  sanitationPerformed?: string; // 'yes' or 'no'
  sanitationDetails?: {
    type: string;
    scope: string;
  }[];
  heatingDistribution?: string;
  waterHeating?: string; // 'yes' or 'no'
  postalCode?: string;
}

// Define the structure for the webhook response
interface WebhookResponse {
  heizlast_wert1?: number; // Assuming these keys based on ResultsPage implementation
  heizlast_wert2?: number;
  heizlast_wert3?: number;
  error?: string; // To handle potential errors from the webhook
}

// Define the context type
interface FormContextType {
  formData: FormData;
  currentStep: number;
  isSubmitting: boolean;
  webhookResponse: WebhookResponse | null;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitForm: () => Promise<void>;
  setSubmitting: (isSubmitting: boolean) => void;
  setWebhookResponse: (response: WebhookResponse | null) => void;
  resetForm: () => void; // Added resetForm function type
}

// Create the context with a default value
const FormContext = createContext<FormContextType | undefined>(undefined);

// Create the provider component
interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const totalSteps = 11; // Total number of form steps

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps + 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps + 1) {
      setCurrentStep(step);
    }
  };

  const setSubmitting = (submitting: boolean) => {
    setIsSubmitting(submitting);
  };

  // Function to reset form state
  const resetForm = () => {
    setFormData({});
    setWebhookResponse(null);
    setIsSubmitting(false);
    // Optionally reset currentStep to 1, handled by handleRestart in ResultsPage
    // setCurrentStep(1);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setWebhookResponse(null);
    console.log('Submitting form data:', formData);

    const webhookUrl = 'https://hook.eu2.make.com/g4jmg8gej4hv3wn3tgdahnxpwxzy05jb';
    let responseData: WebhookResponse | null = null;
    const startTime = Date.now();

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to get error message from response body
        let errorBody = 'Unknown webhook error';
        try {
            errorBody = await response.text();
        } catch {}
        throw new Error(`Webhook failed with status: ${response.status}. ${errorBody}`);
      }

      responseData = await response.json();
      console.log('Webhook response received:', responseData);

    } catch (error) {
      console.error('Error submitting form:', error);
      responseData = { error: error instanceof Error ? error.message : 'An unknown error occurred during submission.' };
    } finally {
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 3000;

        // Navigate to results page *before* potentially waiting or setting submitting to false
        setCurrentStep(totalSteps + 1);

        if (elapsedTime < minLoadingTime) {
            await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
        setWebhookResponse(responseData);
        setIsSubmitting(false);
        // Removed navigation from here, moved it up
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        isSubmitting,
        webhookResponse,
        updateFormData,
        nextStep,
        prevStep,
        goToStep,
        submitForm,
        setSubmitting,
        setWebhookResponse,
        resetForm // Provide resetForm function
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};


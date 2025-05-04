import EnergyFormContainer from "@/components/EnergyFormContainer";
import { Toaster } from "@/components/ui/toaster"; // If using Toasts for notifications

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4">
      <EnergyFormContainer />
      <Toaster /> {/* Add Toaster if you plan to use toasts */}
    </main>
  );
}

export default App;


import { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // You can also log the error to an error reporting service here
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4">
            <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Ein Fehler ist aufgetreten</AlertTitle>
            <AlertDescription>
                Entschuldigung, bei der Anzeige dieser Komponente ist ein unerwarteter Fehler aufgetreten.
                {this.state.error && <pre className="mt-2 text-xs whitespace-pre-wrap">{this.state.error.toString()}</pre>}
                <br />
                Bitte versuchen Sie, die Seite neu zu laden oder starten Sie den Vorgang neu.
            </AlertDescription>
            </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


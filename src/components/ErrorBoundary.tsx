import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to monitoring service in production
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.retry} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>Something went wrong</span>
              </CardTitle>
              <CardDescription>
                An unexpected error occurred in the MedTrace Flash application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">{this.state.error?.message}</p>
                    {process.env.NODE_ENV === 'development' && (
                      <details className="text-xs">
                        <summary className="cursor-pointer">Technical Details</summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                          {this.state.error?.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Suggested Actions:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Try refreshing the page</li>
                  <li>Check your internet connection</li>
                  <li>Clear browser cache and cookies</li>
                  <li>Contact support if the problem persists</li>
                </ul>
              </div>

              <div className="flex space-x-2">
                <Button onClick={this.retry} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
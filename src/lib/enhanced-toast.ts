import { toast } from "sonner";

// Enhanced toast functions with better UX for MedTrace Flash
export const enhancedToast = {
  success: (title: string, description?: string) => {
    toast.success(title, { description });
  },
  
  error: (title: string, description?: string, action?: { label: string; onClick: () => void }) => {
    toast.error(title, { 
      description,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined
    });
  },
  
  loading: (title: string, description?: string) => {
    return toast.loading(title, { description });
  },
  
  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
  
  info: (title: string, description?: string) => {
    toast.info(title, { description });
  },
  
  warning: (title: string, description?: string) => {
    toast.warning(title, { description });
  },
  
  // Agent-specific notifications
  agentStarted: (agentName: string) => {
    toast.info(`${agentName} Started`, {
      description: `${agentName} agent has begun processing`
    });
  },
  
  agentCompleted: (agentName: string, duration?: number) => {
    toast.success(`${agentName} Completed`, {
      description: duration ? `Completed in ${duration}ms` : 'Processing completed successfully'
    });
  },
  
  agentError: (agentName: string, error: string, retry?: () => void) => {
    toast.error(`${agentName} Failed`, {
      description: error,
      action: retry ? {
        label: 'Retry',
        onClick: retry
      } : undefined
    });
  },
  
  // Test-specific notifications
  testGenerated: (count: number) => {
    toast.success('Tests Generated', {
      description: `${count} test cases generated successfully`
    });
  },
  
  testCompleted: (passed: number, failed: number) => {
    const total = passed + failed;
    const isSuccess = failed === 0;
    
    if (isSuccess) {
      toast.success('All Tests Passed', {
        description: `${total} test cases executed successfully`
      });
    } else {
      toast.warning('Tests Completed with Failures', {
        description: `${passed} passed, ${failed} failed out of ${total} tests`
      });
    }
  },
  
  // File operations
  fileUploaded: (filename: string) => {
    toast.success('File Uploaded', {
      description: `${filename} uploaded successfully`
    });
  },
  
  fileExported: (filename: string, format: string) => {
    toast.success('Export Complete', {
      description: `${filename} exported as ${format}`
    });
  },
  
  // Connection status
  connectionSuccess: (service: string) => {
    toast.success('Connection Successful', {
      description: `Connected to ${service} successfully`
    });
  },
  
  connectionError: (service: string, retry?: () => void) => {
    toast.error('Connection Failed', {
      description: `Unable to connect to ${service}`,
      action: retry ? {
        label: 'Retry',
        onClick: retry
      } : undefined
    });
  },
  
  // Workflow notifications
  workflowStarted: (workflowName: string) => {
    toast.info('Workflow Started', {
      description: `${workflowName} workflow has been initiated`
    });
  },
  
  workflowCompleted: (workflowName: string, duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    toast.success('Workflow Completed', {
      description: `${workflowName} completed in ${minutes}m ${seconds}s`
    });
  },
  
  // Configuration notifications
  settingsSaved: () => {
    toast.success('Settings Saved', {
      description: 'Configuration has been updated successfully'
    });
  },
  
  configurationError: (error: string) => {
    toast.error('Configuration Error', {
      description: error
    });
  },
  
  // API notifications
  apiKeyUpdated: (service: string) => {
    toast.success('API Key Updated', {
      description: `${service} API key has been updated`
    });
  },
  
  rateLimitWarning: (service: string, resetTime?: string) => {
    toast.warning('Rate Limit Warning', {
      description: `${service} rate limit approaching${resetTime ? `. Resets at ${resetTime}` : ''}`
    });
  },
  
  // Retry mechanism with exponential backoff
  retryOperation: async <T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt === 1) {
          toast.loading(`${operationName}...`, {
            description: 'Starting operation'
          });
        } else {
          toast.loading(`${operationName}... (Attempt ${attempt}/${maxRetries})`, {
            description: `Retrying after ${baseDelay * Math.pow(2, attempt - 2)}ms delay`
          });
        }
        
        const result = await operation();
        toast.success(`${operationName} Successful`, {
          description: attempt > 1 ? `Succeeded on attempt ${attempt}` : 'Operation completed'
        });
        return result;
        
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          toast.error(`${operationName} Failed`, {
            description: `Failed after ${maxRetries} attempts: ${lastError.message}`,
            action: {
              label: 'Retry',
              onClick: () => enhancedToast.retryOperation(operation, operationName, maxRetries, baseDelay)
            }
          });
          throw lastError;
        }
        
        // Exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
};

export default enhancedToast;
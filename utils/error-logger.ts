interface ErrorLogData {
  message: string;
  stack?: string;
  componentName?: string;
  userId?: number | string;
  url?: string;
  additionalData?: Record<string, any>;
  timestamp: string;
  errorId: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logQueue: ErrorLogData[] = [];
  private isProcessing = false;
  private maxQueueSize = 50;
  private logEndpoint = '/api/logs/error';
  
  private constructor() {
    // Initialize error logger
    if (typeof window !== 'undefined') {
      // Set up global error handler for client-side errors
      window.addEventListener('error', this.handleWindowError.bind(this));
      window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
      
      // Process logs when the page is about to unload
      window.addEventListener('beforeunload', () => {
        this.processLogQueue(true);
      });
    }
  }
  
  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }
  
  private handleWindowError(event: ErrorEvent): void {
    this.logError({
      message: event.message,
      stack: event.error?.stack,
      url: window.location.href,
      additionalData: {
        columnNumber: event.colno,
        lineNumber: event.lineno,
        filename: event.filename,
      },
    });
  }
  
  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    const error = event.reason;
    this.logError({
      message: error?.message || 'Unhandled Promise Rejection',
      stack: error?.stack,
      url: window.location.href,
      additionalData: {
        reason: error,
      },
    });
  }
  
  public logError(error: Error | string | Partial<ErrorLogData>): void {
    try {
      let errorData: ErrorLogData;
      
      if (error instanceof Error) {
        errorData = {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          errorId: this.generateErrorId(),
        };
      } else if (typeof error === 'string') {
        errorData = {
          message: error,
          timestamp: new Date().toISOString(),
          errorId: this.generateErrorId(),
        };
      } else {
        errorData = {
          ...error,
          message: error.message || 'Unknown error',
          timestamp: new Date().toISOString(),
          errorId: this.generateErrorId(),
        };
      }
      
      // Add user ID if available
      if (typeof window !== 'undefined') {
        const userId = this.getUserId();
        if (userId) {
          errorData.userId = userId;
        }
        
        // Add current URL if not provided
        if (!errorData.url) {
          errorData.url = window.location.href;
        }
      }
      
      // Add to queue and process
      this.addToQueue(errorData);
    } catch (loggingError) {
      console.error('Error in error logger:', loggingError);
    }
  }
  
  private addToQueue(errorData: ErrorLogData): void {
    // Add to queue
    this.logQueue.push(errorData);
    
    // Trim queue if it gets too large
    if (this.logQueue.length > this.maxQueueSize) {
      this.logQueue = this.logQueue.slice(-this.maxQueueSize);
    }
    
    // Process queue
    this.processLogQueue();
  }
  
  private async processLogQueue(forceSync: boolean = false): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      const logsToProcess = [...this.logQueue];
      this.logQueue = [];
      
      // Log to console
      logsToProcess.forEach(log => {
        console.error('[ErrorLogger]', log);
      });
      
      // Send to server
      if (typeof window !== 'undefined' && this.logEndpoint) {
        const sendLogs = async () => {
          try {
            const response = await fetch(this.logEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ logs: logsToProcess }),
              // Use keepalive for beforeunload events
              keepalive: forceSync,
            });
            
            if (!response.ok) {
              console.error('[ErrorLogger] Failed to send logs to server:', await response.text());
            }
          } catch (error) {
            console.error('[ErrorLogger] Error sending logs to server:', error);
          }
        };
        
        if (forceSync) {
          // Use synchronous approach for beforeunload
          const xhr = new XMLHttpRequest();
          xhr.open('POST', this.logEndpoint, false); // false makes it synchronous
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({ logs: logsToProcess }));
        } else {
          // Use async approach
          sendLogs();
        }
      }
    } finally {
      this.isProcessing = false;
      
      // If more logs were added while processing, process them too
      if (this.logQueue.length > 0) {
        setTimeout(() => this.processLogQueue(), 0);
      }
    }
  }
  
  private generateErrorId(): string {
    // Simple UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  private getUserId(): string | number | null {
    // Try to get user ID from localStorage or other source
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.id;
      }
    } catch (e) {
      // Ignore errors
    }
    return null;
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

// Utility function for components to log errors
export function logComponentError(error: Error, componentName: string, additionalData?: Record<string, any>): void {
  errorLogger.logError({
    message: error.message,
    stack: error.stack,
    componentName,
    additionalData,
  });
}

export default errorLogger;

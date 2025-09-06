// logger.ts
export const logError = (error: any, context?: string) => {
    const message = error?.message || error;
    
    // Optional: attach context
    const logMessage = context ? `[${context}] ${message}` : message;
  
    // 1. Console (for local/dev)
    if (import.meta.env.MODE !== "production") {
      console.error(logMessage);
    }
  
    // 2. Send to monitoring service in production
    if (import.meta.env.MODE === "production") {
      // e.g., Sentry, LogRocket, or your own API endpoint
      // Sentry.captureException(error);
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: logMessage, stack: error.stack, context:context || "" }),
      });
    }
  };
  
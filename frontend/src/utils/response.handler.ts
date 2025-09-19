/**
 * Post error to server for logger
 * @param error 
 * @param context 
 * api/logs
 */
export const postError = (error: any, context?: string) => {
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


/** ===========================================
 * Throw error for catch block
 * @param error 
 * =========================================== */
export const throwCatchError = (error: any) => {
    throw (error.response.data || "Request Failed");
}

/** ===========================================
 * log error for catch block
 * @param error 
 * =========================================== */
export const runCatchErrorLogger = (error:any) => {
  if(error.response?.status && error.response?.statusText){
    console.error("posting Error: ", error.response.status,error.response.statusText);
  }
  console.error("posting Error data: ", error.response.data);
  console.log("Message: ",error.response.data?.message); 
  console.log("Field: ",error.response.data?.field);  
}

/** ===========================================
 * Throw error for try block
 * @param response 
 * =========================================== */
export const throwTryError = (response: any) => {
  throw (response.data || "Operation Failed");
}

/** ===========================================
 * log error for try block
 * @param response 
 * =========================================== */
export const runTryErrorLogger = (response: any) => {
  if(response?.status && response?.statusText){
    console.error("posting Error: ", response.status,response.statusText);
  }
  console.error("posting Error data: ", response.data);
  console.log("Message: ",response.data?.message);
  if(response.data?.data){
    console.log("datas: ",response.data.data)
  } 
}


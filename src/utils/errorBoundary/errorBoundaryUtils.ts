import type { ErrorInfo } from "react";

export const logError = (error: Error, info: ErrorInfo) => {  // ErrorInfo: { componentStack: string }
   console.error(`ErrorBoundary ⚠️: ${error.message} - ComponentStack: ${info.componentStack}`);
};
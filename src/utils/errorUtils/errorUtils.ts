export function getErrorMessage(error: unknown, defaultMessage?: string) {
   let errorMessage = defaultMessage ?? 'Unknown Error';
   if (error instanceof Error) {
      errorMessage = error.message;
   } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
   } else if (typeof error === 'string') {
      errorMessage = error;
   }

   return errorMessage;
}
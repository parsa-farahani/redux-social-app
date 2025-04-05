interface SerializedError {
   status: number;
   data: unknown;
}

 
export const isFetchBaseQueryError = (error: unknown): error is { status: number; data: unknown } => {
   return typeof error === 'object' && error != null && 'status' in error;
}


export function getErrorMessage(error: unknown): string {
   if (isFetchBaseQueryError(error)) {
     if (typeof error.data === 'object' && error.data && 'message' in error.data) {
       return String(error.data.message);
     }
     return `Error ${error.status}`;
   }
   return 'Unknown error';
}
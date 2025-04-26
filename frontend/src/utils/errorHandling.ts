import { AxiosError } from 'axios';

/**
 * Standard error response format for API errors
 */
export interface ApiErrorResponse {
  message: string;
  status: number;
  details?: Record<string, any>;
}

/**
 * Formats an error from an API call into a consistent structure
 * @param error The error object from Axios or other sources
 * @returns A standardized error object
 */
export const formatApiError = (error: unknown): ApiErrorResponse => {
  // Handle Axios errors specifically
  if (error instanceof Error && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;
    
    // Get response data if available
    const responseData = axiosError.response?.data as any;
    
    return {
      message: responseData?.detail || responseData?.message || axiosError.message || 'An unexpected error occurred',
      status: axiosError.response?.status || 500,
      details: responseData
    };
  }
  
  // Handle regular Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 500
    };
  }
  
  // Handle unknown error types
  return {
    message: typeof error === 'string' ? error : 'An unexpected error occurred',
    status: 500
  };
};

/**
 * Gets a user-friendly error message
 * @param error The raw error object
 * @returns A string that can be displayed to users
 */
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  const formattedError = formatApiError(error);
  
  // Common HTTP status codes with user-friendly messages
  switch (formattedError.status) {
    case 400:
      return 'The request was invalid. Please check your input and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You don\'t have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'There was a conflict with the current state of the resource.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'A server error occurred. Please try again later.';
    default:
      return formattedError.message;
  }
};

/**
 * Logs an error for debugging purposes
 * @param error The error object
 * @param context Additional context for the error
 */
export const logError = (error: unknown, context: string = 'API Error'): void => {
  const formattedError = formatApiError(error);
  
  console.error(`${context}:`, {
    message: formattedError.message,
    status: formattedError.status,
    details: formattedError.details,
    originalError: error
  });
  
  // In a production app, you would send this to a logging service
  // like Sentry, LogRocket, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   sendToErrorLoggingService(formattedError);
  // }
}; 
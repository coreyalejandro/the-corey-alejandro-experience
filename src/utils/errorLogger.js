export const logError = (error, context = '') => {
  console.error(`[${context}] Error:`, error);
  
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to error tracking service
    // errorTrackingService.captureException(error, { context });
  }
};

export const handleApiError = (error, fallbackMessage = 'An unexpected error occurred') => {
  logError(error, 'API');
  return {
    error: true,
    message: error.message || fallbackMessage,
    status: error.status || 500
  };
};

export const errorBoundary = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    logError(error, fn.name);
    return null;
  }
};

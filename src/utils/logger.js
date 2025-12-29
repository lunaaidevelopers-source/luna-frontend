// Utility for logging - can be disabled in production
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  error: (message, error) => {
    if (isDevelopment) {
      console.error(message, error);
    }
    // In production, you could send errors to an error tracking service
    // e.g., Sentry, LogRocket, etc.
  },
  
  warn: (message, data) => {
    if (isDevelopment) {
      console.warn(message, data);
    }
  },
  
  info: (message, data) => {
    if (isDevelopment) {
      console.log(message, data);
    }
  }
};


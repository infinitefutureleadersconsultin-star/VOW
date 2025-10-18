import axios from 'axios';
import jwt from 'jsonwebtoken';

// Error logging utility
const logError = (error, context) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    stack: error.stack,
  };
  
  console.error('[API_ERROR]', JSON.stringify(errorLog, null, 2));
  
  // Send to monitoring service in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to monitoring service (e.g., Sentry, LogRocket)
  }
};

// ============================================
// JWT TOKEN VERIFICATION (for API routes)
// ============================================
export const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

// Create axios instance with defaults
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('vow_auth_token') 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return config;
  },
  (error) => {
    logError(error, 'REQUEST_INTERCEPTOR');
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle different error types
    if (!error.response) {
      // Network error
      logError(error, 'NETWORK_ERROR');
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        type: 'NETWORK_ERROR',
        retryable: true,
      });
    }

    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 400:
        logError(error, 'BAD_REQUEST');
        return Promise.reject({
          message: data.message || 'Invalid request. Please check your input.',
          type: 'BAD_REQUEST',
          details: data.errors,
        });

      case 401:
        logError(error, 'UNAUTHORIZED');
        
        // Try to refresh token
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('vow_refresh_token');
            const response = await axios.post('/api/auth', { action: 'refresh', refreshToken });
            const { token } = response.data.data;
            
            localStorage.setItem('vow_auth_token', token);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('vow_auth_token');
            localStorage.removeItem('vow_refresh_token');
            
            if (typeof window !== 'undefined') {
              window.location.href = '/login?session_expired=true';
            }
            
            return Promise.reject({
              message: 'Session expired. Please log in again.',
              type: 'SESSION_EXPIRED',
            });
          }
        }
        
        return Promise.reject({
          message: 'Unauthorized. Please log in.',
          type: 'UNAUTHORIZED',
        });

      case 402:
        logError(error, 'PAYMENT_REQUIRED');
        return Promise.reject({
          message: 'Payment required. Please update your subscription.',
          type: 'PAYMENT_REQUIRED',
          redirectTo: '/subscription',
        });

      case 403:
        logError(error, 'FORBIDDEN');
        return Promise.reject({
          message: 'Access denied. You do not have permission.',
          type: 'FORBIDDEN',
        });

      case 404:
        logError(error, 'NOT_FOUND');
        return Promise.reject({
          message: data.message || 'Resource not found.',
          type: 'NOT_FOUND',
        });

      case 429:
        logError(error, 'RATE_LIMIT');
        const retryAfter = error.response.headers['retry-after'] || 60;
        return Promise.reject({
          message: `Too many requests. Please try again in ${retryAfter} seconds.`,
          type: 'RATE_LIMIT',
          retryAfter: parseInt(retryAfter),
        });

      case 500:
        logError(error, 'SERVER_ERROR');
        return Promise.reject({
          message: 'Server error. Our team has been notified.',
          type: 'SERVER_ERROR',
          retryable: true,
        });

      case 502:
      case 503:
      case 504:
        logError(error, 'SERVICE_UNAVAILABLE');
        return Promise.reject({
          message: 'Service temporarily unavailable. Please try again.',
          type: 'SERVICE_UNAVAILABLE',
          retryable: true,
        });

      default:
        logError(error, 'UNKNOWN_ERROR');
        return Promise.reject({
          message: 'An unexpected error occurred. Please try again.',
          type: 'UNKNOWN_ERROR',
          status,
        });
    }
  }
);

// Retry logic for retryable errors
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.retryable) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// API methods with error handling
export const api = {
  get: (url, config = {}) => retryRequest(() => apiClient.get(url, config)),
  post: (url, data, config = {}) => retryRequest(() => apiClient.post(url, data, config)),
  put: (url, data, config = {}) => retryRequest(() => apiClient.put(url, data, config)),
  patch: (url, data, config = {}) => retryRequest(() => apiClient.patch(url, data, config)),
  delete: (url, config = {}) => retryRequest(() => apiClient.delete(url, config)),
};

export default apiClient;

import { z } from 'zod';

// Custom error handler
const handleValidationError = (error, context) => {
  console.error(`[VALIDATION_ERROR] ${context}:`, {
    timestamp: new Date().toISOString(),
    errors: error.errors,
    context,
  });
  
  return {
    success: false,
    errors: error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
};

// Email validation
export const emailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email too short')
  .max(255, 'Email too long');

export const validateEmail = (email) => {
  try {
    emailSchema.parse(email);
    return { success: true, value: email };
  } catch (error) {
    return handleValidationError(error, 'EMAIL_VALIDATION');
  }
};

// Password validation
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password);
    return { success: true, value: password };
  } catch (error) {
    return handleValidationError(error, 'PASSWORD_VALIDATION');
  }
};

// User registration schema
export const userRegistrationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  email: emailSchema,
  password: passwordSchema,
  
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say', 'other'])
    .optional(),
  
  nationality: z.string()
    .max(100, 'Nationality too long')
    .optional(),
  
  language: z.string()
    .length(2, 'Invalid language code')
    .default('en'),
  
  consentData: z.boolean()
    .refine(val => val === true, 'Must consent to data usage'),
  
  consentAI: z.boolean()
    .refine(val => val === true, 'Must consent to AI coaching'),
});

export const validateUserRegistration = (data) => {
  try {
    const validated = userRegistrationSchema.parse(data);
    return { success: true, value: validated };
  } catch (error) {
    return handleValidationError(error, 'USER_REGISTRATION');
  }
};

// Vow creation schema
export const vowCreationSchema = z.object({
  type: z.enum(['addiction', 'health', 'faithfulness', 'focus', 'character', 'purpose', 'custom']),
  
  text: z.string()
    .min(10, 'Vow must be at least 10 characters')
    .max(500, 'Vow too long'),
  
  duration: z.number()
    .int('Duration must be whole number')
    .min(1, 'Duration must be at least 1 day')
    .max(3650, 'Duration cannot exceed 10 years'),
  
  isPublic: z.boolean().default(false),
  
  accountabilityPartner: z.string().email().optional(),
});

export const validateVowCreation = (data) => {
  try {
    const validated = vowCreationSchema.parse(data);
    return { success: true, value: validated };
  } catch (error) {
    return handleValidationError(error, 'VOW_CREATION');
  }
};

// Trigger logging schema
export const triggerLogSchema = z.object({
  vowId: z.string().uuid('Invalid vow ID'),
  
  timestamp: z.string().datetime('Invalid timestamp'),
  
  location: z.string().max(200).optional(),
  
  emotions: z.array(z.string().max(50))
    .min(1, 'At least one emotion required')
    .max(10, 'Too many emotions'),
  
  urgeIntensity: z.number()
    .int()
    .min(1, 'Intensity must be at least 1')
    .max(10, 'Intensity cannot exceed 10'),
  
  context: z.string()
    .max(1000, 'Context too long')
    .optional(),
  
  voiceNoteUrl: z.string().url().optional(),
});

export const validateTriggerLog = (data) => {
  try {
    const validated = triggerLogSchema.parse(data);
    return { success: true, value: validated };
  } catch (error) {
    return handleValidationError(error, 'TRIGGER_LOG');
  }
};

// Reflection schema
export const reflectionSchema = z.object({
  vowId: z.string().uuid('Invalid vow ID'),
  
  date: z.string().datetime('Invalid date'),
  
  didBreakVow: z.boolean(),
  
  reflection: z.string()
    .min(10, 'Reflection must be at least 10 characters')
    .max(2000, 'Reflection too long'),
  
  lessons: z.string().max(1000).optional(),
  
  linkedMemories: z.array(z.string().uuid()).optional(),
});

export const validateReflection = (data) => {
  try {
    const validated = reflectionSchema.parse(data);
    return { success: true, value: validated };
  } catch (error) {
    return handleValidationError(error, 'REFLECTION');
  }
};

// Payment schema
export const paymentSchema = z.object({
  priceId: z.string().min(1, 'Price ID required'),
  
  paymentMethodId: z.string().min(1, 'Payment method required'),
  
  email: emailSchema,
  
  promoCode: z.string().max(50).optional(),
});

export const validatePayment = (data) => {
  try {
    const validated = paymentSchema.parse(data);
    return { success: true, value: validated };
  } catch (error) {
    return handleValidationError(error, 'PAYMENT');
  }
};

// General input sanitization
export const sanitizeInput = (input, maxLength = 1000) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Phone number validation (international)
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const validatePhone = (phone) => {
  try {
    phoneSchema.parse(phone);
    return { success: true, value: phone };
  } catch (error) {
    return handleValidationError(error, 'PHONE_VALIDATION');
  }
};

// URL validation
export const urlSchema = z.string().url('Invalid URL format');

export const validateUrl = (url) => {
  try {
    urlSchema.parse(url);
    return { success: true, value: url };
  } catch (error) {
    return handleValidationError(error, 'URL_VALIDATION');
  }
};

// Date range validation
export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine(
  data => new Date(data.endDate) > new Date(data.startDate),
  'End date must be after start date'
);

export const validateDateRange = (data) => {
  try {
    const validated = dateRangeSchema.parse(data);
    return { success: true, value: validated };
  } catch (error) {
    return handleValidationError(error, 'DATE_RANGE_VALIDATION');
  }
};

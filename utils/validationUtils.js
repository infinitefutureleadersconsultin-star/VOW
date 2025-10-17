import { z } from 'zod';

// Email validation
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Name validation
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters');

// Gender validation
export const genderSchema = z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say'], {
  errorMap: () => ({ message: 'Please select a valid gender' })
});

// Nationality validation
export const nationalitySchema = z.string()
  .min(2, 'Please select your nationality')
  .optional();

// Ethnicity validation
export const ethnicitySchema = z.string()
  .optional();

// Language validation
export const languageSchema = z.string()
  .min(2, 'Please select a language');

// Simplified password validation - just 8+ characters
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters');

// Consent validation
export const consentSchema = z.boolean()
  .refine(val => val === true, {
    message: 'You must agree to continue'
  });

// Full user registration validation
export const userRegistrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  gender: genderSchema,
  nationality: nationalitySchema.optional(),
  ethnicity: ethnicitySchema.optional(),
  language: languageSchema,
  consentData: consentSchema,
  consentAI: consentSchema,
});

// Validate email
export function validateEmail(email) {
  try {
    emailSchema.parse(email);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: error.errors.map(e => e.message)
    };
  }
}

// Validate password
export function validatePassword(password) {
  try {
    passwordSchema.parse(password);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: error.errors.map(e => e.message)
    };
  }
}

// Validate user registration
export function validateUserRegistration(data) {
  try {
    userRegistrationSchema.parse(data);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    };
  }
}

// Validate name
export function validateName(name) {
  try {
    nameSchema.parse(name);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: error.errors.map(e => e.message)
    };
  }
}

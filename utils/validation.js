/**
 * Validation Utility Functions
 * Helper functions for form validation
 */

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmed = email.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password) {
    return { 
      valid: false, 
      error: 'Password is required',
      strength: 0
    };
  }

  const errors = [];
  let strength = 0;

  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else {
    strength += 20;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Include at least one uppercase letter');
  } else {
    strength += 20;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Include at least one lowercase letter');
  } else {
    strength += 20;
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Include at least one number');
  } else {
    strength += 20;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Include at least one special character');
  } else {
    strength += 20;
  }

  // Length bonus
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;

  const valid = errors.length === 0;

  return {
    valid,
    error: errors.length > 0 ? errors[0] : null,
    errors,
    strength: Math.min(strength, 100)
  };
}

/**
 * Validate vow statement
 */
export function validateVowStatement(statement) {
  if (!statement || typeof statement !== 'string') {
    return { valid: false, error: 'Vow statement is required' };
  }

  const trimmed = statement.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Vow statement is required' };
  }

  if (trimmed.length < 10) {
    return { 
      valid: false, 
      error: 'Vow statement should be at least 10 characters' 
    };
  }

  if (trimmed.length > 500) {
    return { 
      valid: false, 
      error: 'Vow statement is too long (max 500 characters)' 
    };
  }

  // Check for first-person statement
  const firstPerson = /\b(I|I'm|I am|my|me)\b/i.test(trimmed);
  
  if (!firstPerson) {
    return {
      valid: true,
      value: trimmed,
      warning: 'Consider using "I" or "I am" for a more personal vow'
    };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate reflection text
 */
export function validateReflection(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Reflection text is required' };
  }

  const trimmed = text.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Reflection text is required' };
  }

  if (trimmed.length < 5) {
    return { 
      valid: false, 
      error: 'Reflection should be at least 5 characters' 
    };
  }

  if (trimmed.length > 5000) {
    return { 
      valid: false, 
      error: 'Reflection is too long (max 5000 characters)' 
    };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate name
 */
export function validateName(name, fieldName = 'Name') {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }

  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (trimmed.length < 2) {
    return { 
      valid: false, 
      error: `${fieldName} must be at least 2 characters` 
    };
  }

  if (trimmed.length > 50) {
    return { 
      valid: false, 
      error: `${fieldName} is too long (max 50 characters)` 
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { 
      valid: false, 
      error: `${fieldName} contains invalid characters` 
    };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate vow duration
 */
export function validateVowDuration(duration) {
  const num = parseInt(duration);
  
  if (isNaN(num)) {
    return { valid: false, error: 'Duration must be a number' };
  }

  if (num < 1) {
    return { valid: false, error: 'Duration must be at least 1 day' };
  }

  if (num > 365) {
    return { valid: false, error: 'Duration cannot exceed 365 days' };
  }

  // Suggest common durations
  const suggestions = [];
  if (num === 21) suggestions.push('Perfect! 21 days to form a habit');
  if (num === 30) suggestions.push('Excellent! A full month of practice');
  if (num === 90) suggestions.push('Powerful! 90 days for transformation');

  return { 
    valid: true, 
    value: num,
    suggestions 
  };
}

/**
 * Validate trigger description
 */
export function validateTriggerDescription(description) {
  if (!description || typeof description !== 'string') {
    return { valid: false, error: 'Trigger description is required' };
  }

  const trimmed = description.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Trigger description is required' };
  }

  if (trimmed.length < 3) {
    return { 
      valid: false, 
      error: 'Description should be at least 3 characters' 
    };
  }

  if (trimmed.length > 500) {
    return { 
      valid: false, 
      error: 'Description is too long (max 500 characters)' 
    };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validate URL
 */
export function validateUrl(url) {
  if (!url) {
    return { valid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS' };
    }

    return { valid: true, value: url };
  } catch (e) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate phone number (US format)
 */
export function validatePhone(phone) {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length !== 10) {
    return { 
      valid: false, 
      error: 'Phone number must be 10 digits' 
    };
  }

  // Format as (XXX) XXX-XXXX
  const formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;

  return { valid: true, value: formatted, digits };
}

/**
 * Sanitize input (remove potentially dangerous characters)
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Check if string contains profanity (basic)
 */
export function containsProfanity(text) {
  if (!text) return false;
  
  const profanityList = [
    // Add your profanity list here
    // This is a placeholder - implement as needed
  ];
  
  const lowerText = text.toLowerCase();
  
  return profanityList.some(word => lowerText.includes(word));
}

/**
 * Validate form data
 */
export function validateForm(data, rules) {
  const errors = {};
  const values = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];

    // Required check
    if (rule.required && (!value || value.toString().trim().length === 0)) {
      errors[field] = `${rule.label || field} is required`;
      isValid = false;
      return;
    }

    // Skip validation if not required and empty
    if (!rule.required && (!value || value.toString().trim().length === 0)) {
      values[field] = value;
      return;
    }

    // Type validation
    if (rule.type) {
      let result;
      
      switch (rule.type) {
        case 'email':
          result = validateEmail(value);
          break;
        case 'password':
          result = validatePassword(value);
          break;
        case 'name':
          result = validateName(value, rule.label);
          break;
        case 'url':
          result = validateUrl(value);
          break;
        case 'phone':
          result = validatePhone(value);
          break;
        default:
          result = { valid: true, value };
      }

      if (!result.valid) {
        errors[field] = result.error;
        isValid = false;
      } else {
        values[field] = result.value || value;
      }
    } else {
      values[field] = value;
    }

    // Min length
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
      isValid = false;
    }

    // Max length
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} cannot exceed ${rule.maxLength} characters`;
      isValid = false;
    }

    // Pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.patternError || `${rule.label || field} format is invalid`;
      isValid = false;
    }

    // Custom validator
    if (rule.validator) {
      const customResult = rule.validator(value);
      if (!customResult.valid) {
        errors[field] = customResult.error;
        isValid = false;
      }
    }
  });

  return { isValid, errors, values };
}

/**
 * Password strength meter
 */
export function getPasswordStrengthLabel(strength) {
  if (strength < 20) return { label: 'Very Weak', color: '#FF0000' };
  if (strength < 40) return { label: 'Weak', color: '#FF6347' };
  if (strength < 60) return { label: 'Fair', color: '#FFA500' };
  if (strength < 80) return { label: 'Good', color: '#90EE90' };
  return { label: 'Strong', color: '#5FD3A5' };
}

/**
 * Validate date range
 */
export function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Invalid start date' };
  }

  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid end date' };
  }

  if (end < start) {
    return { valid: false, error: 'End date must be after start date' };
  }

  return { valid: true, start, end };
}

/**
 * Validate number range
 */
export function validateNumberRange(value, min, max, fieldName = 'Value') {
  const num = parseFloat(value);

  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }

  if (num < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (num > max) {
    return { valid: false, error: `${fieldName} cannot exceed ${max}` };
  }

  return { valid: true, value: num };
}

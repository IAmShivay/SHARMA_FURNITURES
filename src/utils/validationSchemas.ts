import * as Yup from 'yup';

// Auth Validation Schemas
export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  phone: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional(),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .notOneOf([Yup.ref('currentPassword')], 'New password must be different from current password')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

// Profile Validation Schemas
export const updateProfileSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Name is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional(),
  preferences: Yup.object({
    newsletter: Yup.boolean(),
    notifications: Yup.object({
      email: Yup.boolean(),
      sms: Yup.boolean(),
    }),
    currency: Yup.string(),
    language: Yup.string(),
  }).optional(),
});

export const addressSchema = Yup.object({
  type: Yup.string()
    .oneOf(['home', 'work', 'other'], 'Please select a valid address type')
    .required('Address type is required'),
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  street: Yup.string()
    .min(5, 'Street address must be at least 5 characters')
    .required('Street address is required'),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .required('City is required'),
  state: Yup.string()
    .min(2, 'State must be at least 2 characters')
    .required('State is required'),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code')
    .required('ZIP code is required'),
  country: Yup.string()
    .required('Country is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional(),
  instructions: Yup.string()
    .max(200, 'Instructions must be less than 200 characters')
    .optional(),
});

// Contact Form Schema
export const contactSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional(),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters')
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .required('Message is required'),
  category: Yup.string()
    .oneOf(['general', 'support', 'sales', 'returns', 'feedback'], 'Please select a valid category')
    .required('Category is required'),
});

// Newsletter Schema
export const newsletterSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  preferences: Yup.object({
    newProducts: Yup.boolean(),
    sales: Yup.boolean(),
    designTips: Yup.boolean(),
  }).optional(),
});

// Review Schema
export const reviewSchema = Yup.object({
  rating: Yup.number()
    .min(1, 'Please select a rating')
    .max(5, 'Rating cannot be more than 5')
    .required('Rating is required'),
  title: Yup.string()
    .min(5, 'Review title must be at least 5 characters')
    .max(100, 'Review title must be less than 100 characters')
    .required('Review title is required'),
  comment: Yup.string()
    .min(10, 'Review comment must be at least 10 characters')
    .max(1000, 'Review comment must be less than 1000 characters')
    .required('Review comment is required'),
  recommend: Yup.boolean(),
});

// Search Schema
export const searchSchema = Yup.object({
  query: Yup.string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters')
    .required('Search query is required'),
  category: Yup.string().optional(),
  priceMin: Yup.number()
    .min(0, 'Minimum price cannot be negative')
    .optional(),
  priceMax: Yup.number()
    .min(0, 'Maximum price cannot be negative')
    .when('priceMin', (priceMin, schema) => {
      return priceMin ? schema.min(priceMin, 'Maximum price must be greater than minimum price') : schema;
    })
    .optional(),
});

// Checkout Schema
export const checkoutSchema = Yup.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema.when('sameAsShipping', {
    is: false,
    then: (schema) => schema.required('Billing address is required'),
    otherwise: (schema) => schema.optional(),
  }),
  sameAsShipping: Yup.boolean(),
  shippingMethod: Yup.string()
    .oneOf(['standard', 'express', 'white_glove'], 'Please select a valid shipping method')
    .required('Shipping method is required'),
  paymentMethod: Yup.string()
    .oneOf(['credit_card', 'debit_card', 'paypal'], 'Please select a valid payment method')
    .required('Payment method is required'),
  notes: Yup.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

// Product Customization Schema
export const customizationSchema = Yup.object({
  woodType: Yup.string().optional(),
  finish: Yup.string().optional(),
  color: Yup.string().optional(),
  assembly: Yup.string()
    .oneOf(['self', 'white_glove'], 'Please select a valid assembly option')
    .optional(),
  hardware: Yup.array().of(Yup.string()).optional(),
  protection: Yup.string().optional(),
});

// Admin Product Schema
export const adminProductSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters')
    .required('Product name is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .required('Description is required'),
  shortDescription: Yup.string()
    .max(500, 'Short description must be less than 500 characters')
    .optional(),
  brand: Yup.string()
    .required('Brand is required'),
  category: Yup.string()
    .oneOf(['sofas', 'chairs', 'tables', 'storage', 'lighting', 'decor', 'bedroom', 'dining', 'office'])
    .required('Category is required'),
  subcategory: Yup.string()
    .required('Subcategory is required'),
  basePrice: Yup.number()
    .min(0, 'Base price cannot be negative')
    .required('Base price is required'),
  originalPrice: Yup.number()
    .min(0, 'Original price cannot be negative')
    .when('basePrice', (basePrice, schema) => {
      return basePrice ? schema.min(basePrice, 'Original price must be greater than or equal to base price') : schema;
    })
    .optional(),
  images: Yup.array()
    .of(Yup.string().url('Please enter valid image URLs'))
    .min(1, 'At least one image is required')
    .required('Images are required'),
  materials: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one material is required')
    .required('Materials are required'),
  colors: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one color is required')
    .required('Colors are required'),
  dimensions: Yup.object({
    length: Yup.string().required('Length is required'),
    width: Yup.string().required('Width is required'),
    height: Yup.string().required('Height is required'),
    weight: Yup.string().required('Weight is required'),
  }).required('Dimensions are required'),
  inventory: Yup.number()
    .min(0, 'Inventory cannot be negative')
    .integer('Inventory must be a whole number')
    .required('Inventory is required'),
  status: Yup.string()
    .oneOf(['draft', 'active', 'inactive', 'discontinued'])
    .required('Status is required'),
  featured: Yup.boolean(),
  bestseller: Yup.boolean(),
  newArrival: Yup.boolean(),
});

// Type exports for TypeScript
export type LoginFormData = Yup.InferType<typeof loginSchema>;
export type RegisterFormData = Yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormData = Yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = Yup.InferType<typeof resetPasswordSchema>;
export type ChangePasswordFormData = Yup.InferType<typeof changePasswordSchema>;
export type UpdateProfileFormData = Yup.InferType<typeof updateProfileSchema>;
export type AddressFormData = Yup.InferType<typeof addressSchema>;
export type ContactFormData = Yup.InferType<typeof contactSchema>;
export type NewsletterFormData = Yup.InferType<typeof newsletterSchema>;
export type ReviewFormData = Yup.InferType<typeof reviewSchema>;
export type SearchFormData = Yup.InferType<typeof searchSchema>;
export type CheckoutFormData = Yup.InferType<typeof checkoutSchema>;
export type CustomizationFormData = Yup.InferType<typeof customizationSchema>;
export type AdminProductFormData = Yup.InferType<typeof adminProductSchema>;

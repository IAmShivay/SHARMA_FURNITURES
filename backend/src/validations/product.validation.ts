import { z } from 'zod';

const dimensionsSchema = z.object({
  length: z.string().min(1, 'Length is required'),
  width: z.string().min(1, 'Width is required'),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  unit: z.string().default('inches'),
});

const specificationSchema = z.object({
  name: z.string().min(1, 'Specification name is required'),
  value: z.string().min(1, 'Specification value is required'),
});

const customizationOptionSchema = z.object({
  id: z.string().min(1, 'Option ID is required'),
  name: z.string().min(1, 'Option name is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  description: z.string().optional(),
  image: z.string().url().optional(),
  available: z.boolean().default(true),
});

const customizationSectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
  title: z.string().min(1, 'Section title is required'),
  description: z.string().optional(),
  required: z.boolean().default(false),
  type: z.enum(['single', 'multiple']),
  options: z.array(customizationOptionSchema).min(1, 'At least one option is required'),
});

const inventorySchema = z.object({
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  reserved: z.number().int().min(0, 'Reserved quantity must be non-negative').default(0),
  lowStockThreshold: z.number().int().min(0, 'Low stock threshold must be non-negative').default(10),
  trackInventory: z.boolean().default(true),
});

const variantSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  images: z.array(z.string().url()).optional(),
  attributes: z.object({
    color: z.string().optional(),
    size: z.string().optional(),
    material: z.string().optional(),
    finish: z.string().optional(),
  }),
  inventory: inventorySchema,
});

const shippingInfoSchema = z.object({
  weight: z.number().min(0, 'Weight must be non-negative').optional(),
  dimensions: z.object({
    length: z.number().min(0, 'Length must be non-negative'),
    width: z.number().min(0, 'Width must be non-negative'),
    height: z.number().min(0, 'Height must be non-negative'),
  }).optional(),
  freeShipping: z.boolean().default(false),
  shippingClass: z.enum(['standard', 'white-glove', 'freight']).default('standard'),
});

const seoDataSchema = z.object({
  metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  keywords: z.array(z.string()).optional(),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Product name is required')
      .max(100, 'Product name must be less than 100 characters'),
    
    description: z
      .string()
      .min(1, 'Description is required')
      .max(2000, 'Description must be less than 2000 characters'),
    
    shortDescription: z
      .string()
      .max(500, 'Short description must be less than 500 characters')
      .optional(),
    
    brand: z.string().min(1, 'Brand is required'),
    
    category: z.enum([
      'sofas',
      'chairs',
      'tables',
      'storage',
      'lighting',
      'decor',
      'bedroom',
      'dining',
      'office'
    ]),
    
    subcategory: z.string().min(1, 'Subcategory is required'),
    
    tags: z.array(z.string()).default([]),
    
    basePrice: z
      .number()
      .min(0, 'Base price must be non-negative'),
    
    originalPrice: z
      .number()
      .min(0, 'Original price must be non-negative')
      .optional(),
    
    costPrice: z
      .number()
      .min(0, 'Cost price must be non-negative')
      .optional(),
    
    currency: z.string().default('USD'),
    
    images: z
      .array(z.string().url())
      .min(1, 'At least one image is required'),
    
    videos: z.array(z.string().url()).optional(),
    
    dimensions: dimensionsSchema,
    
    materials: z.array(z.string()).min(1, 'At least one material is required'),
    
    colors: z.array(z.string()).min(1, 'At least one color is required'),
    
    styles: z.array(z.string()).default([]),
    
    features: z.array(z.string()).default([]),
    
    specifications: z.array(specificationSchema).default([]),
    
    customization: z.array(customizationSectionSchema).default([]),
    
    variants: z.array(variantSchema).default([]),
    
    inventory: inventorySchema,
    
    shipping: shippingInfoSchema.optional(),
    
    seo: seoDataSchema.optional(),
    
    status: z.enum(['draft', 'active', 'inactive', 'discontinued']).default('draft'),
    
    featured: z.boolean().default(false),
    
    bestseller: z.boolean().default(false),
    
    newArrival: z.boolean().default(false),
    
    onSale: z.boolean().default(false),
    
    saleStartDate: z.string().datetime().optional(),
    
    saleEndDate: z.string().datetime().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a number')
      .transform(Number)
      .refine(val => val >= 1, 'Page must be at least 1')
      .default('1'),
    
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a number')
      .transform(Number)
      .refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
      .default('20'),
    
    category: z.string().optional(),
    
    subcategory: z.string().optional(),
    
    priceMin: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'Price minimum must be a number')
      .transform(Number)
      .optional(),
    
    priceMax: z
      .string()
      .regex(/^\d+(\.\d+)?$/, 'Price maximum must be a number')
      .transform(Number)
      .optional(),
    
    materials: z
      .union([z.string(), z.array(z.string())])
      .transform(val => Array.isArray(val) ? val : [val])
      .optional(),
    
    colors: z
      .union([z.string(), z.array(z.string())])
      .transform(val => Array.isArray(val) ? val : [val])
      .optional(),
    
    styles: z
      .union([z.string(), z.array(z.string())])
      .transform(val => Array.isArray(val) ? val : [val])
      .optional(),
    
    brands: z
      .union([z.string(), z.array(z.string())])
      .transform(val => Array.isArray(val) ? val : [val])
      .optional(),
    
    inStock: z
      .string()
      .transform(val => val === 'true')
      .optional(),
    
    featured: z
      .string()
      .transform(val => val === 'true')
      .optional(),
    
    onSale: z
      .string()
      .transform(val => val === 'true')
      .optional(),
    
    search: z.string().optional(),
    
    sortBy: z
      .enum(['name', 'price', 'rating', 'createdAt', 'salesCount', 'viewCount'])
      .default('createdAt'),
    
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const searchProductsSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query is required'),
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a number')
      .transform(Number)
      .default('1'),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a number')
      .transform(Number)
      .default('20'),
  }),
});

export const addReviewSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    
    title: z
      .string()
      .min(1, 'Review title is required')
      .max(100, 'Review title must be less than 100 characters'),
    
    comment: z
      .string()
      .min(1, 'Review comment is required')
      .max(1000, 'Review comment must be less than 1000 characters'),
    
    images: z.array(z.string().url()).optional(),
  }),
  
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type GetProductsInput = z.infer<typeof getProductsSchema>['query'];
export type SearchProductsInput = z.infer<typeof searchProductsSchema>['query'];
export type AddReviewInput = z.infer<typeof addReviewSchema>['body'];

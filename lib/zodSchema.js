import z from "zod";
import { dateStatus } from "./utils";

export const zSchema = z.object({
    name: z.string()
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name must be less than 50 characters"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)"),
    otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d{6}$/, "OTP must contain only numbers"),
    phone: z.string()
        .regex(/^03[0-9]{9}$/, "Invalid mobile number. Format: 03XXXXXXXXX"),
    category: z.string().min(3, "Category should contain at least 3 letters"),
    subcategory: z.string().min(3, "Sub Category should contain at least 3 letters"),
    slug: z.string().min(3, "Slug is required"),
    _id: z.string().min(3, "Id is required"),
    country: z.string().min(3, "Country should contain at least 3 letters"),
    state: z.string().min(3, "State should contain at least 3 letters"),
    city: z.string().min(3, "City should contain at least 3 letters"),
    address: z.string().min(3, "Address should contain at least 3 letters"),
    locality: z.string().optional(),
    status: z.string().min(3, "Status should contain at least 3 letters"),
    dateStatus: z.enum(dateStatus),
    sublocality: z.string().nullable().optional(),
    serviceCode: z.string().min(3, "Service Code required"),
    description: z.string().min(10, "Description required"),
    listing: z.string().min(1, "Listing required"),
    product: z.string().min(1, "Product required").optional(),
    title: z.string().min(1, "Title required"),
    listingId: z.string().min(1, 'Select listing'),
    userId: z.string().min(1, 'User Id required'),
    code: z.string().min(1, "Country Code should contain at least 1 letter"),
    role: z.string().min(1, "Required"),
    review: z.string().min(10, "Review must be at least 10 characters long"),
    pricingType: z.string().min(1, "Required"),
    adminNote: z.string().optional(),
    note: z.string().optional(),
    media: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    listingType: z.string().optional(),
    inquirePrice: z.boolean().optional(),
    availability: z.object({
        monday: z.boolean().optional(),
        tuesday: z.boolean().optional(),
        wednesday: z.boolean().optional(),
        thursday: z.boolean().optional(),
        friday: z.boolean().optional(),
        saturday: z.boolean().optional(),
        sunday: z.boolean().optional(),
    }).optional(),
    expire: z.string().nullable().optional(),

    minPersons: z.coerce.number().min(0),
    price: z.coerce.number().min(0),
    startingPrice: z.coerce.number().min(0),
    points: z.array(z.string()).optional(),
    capacity: z.coerce.number().min(0).optional(),
    date: z.coerce.date(),
    variantId: z.string().optional(),
    rating: z.union([
        z.number().positive('Expected positive number'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, 'Expected positive number')
    ]),
    amount: z.union([
        z.number().positive('Expected positive number'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val > 0, 'Expected positive number')
    ])
});

export const productSchema = z.object({
    _id: z.string().optional(),
    _id: z.string().optional(),
    name: z.string().trim().min(3, "Product name must be at least 3 characters").max(100),
    slug: z.string().trim().min(3, "Slug is required").max(120),
    category: z.string().min(1, "Select a category"),
    subcategory: z.string().min(1, "Select a subcategory"),
    price: z.coerce.number().min(0),
    sku: z.string().trim().min(1, "SKU is required").max(50),
    discountPercentage: z.coerce.number().min(0).max(100).default(0),
    stockType: z.enum(["in_stock", "made_to_order"]),
    stockQuantity: z.coerce.number().int().min(0).default(0),
    minimumOrderQuantity: z.coerce.number().int().min(1).default(1),
    processingTime: z.object({
        value: z.coerce.number().min(0),
        unit: z.enum(["hours", "days"]),
    }),
    customizable: z.boolean().default(false),
    media: z.array(z.string()).min(1, "Select at least one image"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    country: z.string().min(1, "Select a country"),
    state: z.string().min(1, "Select a state"),
    city: z.string().min(1, "Select a city"),
    tags: z.array(z.string().trim().min(1)).default([]),
    inquirePrice: z.boolean().default(false),
})

export const productFormSchema = productSchema
    .omit({ _id: true, media: true, processingTime: true })
    .extend({
        processingValue: z.coerce.number().min(0),
        processingUnit: z.enum(["hours", "days"]),
        tags: z.string().optional(),
    })

export const productVariantSchema = z.object({
    _id: z.string().optional(),
    productId: z.string().min(1, "Select a product"),
    name: z.string().trim().min(1, "Variant name is required").max(100),
    attributes: z.object({
        size: z.string().trim().optional(),
        color: z.string().trim().optional(),
    }).optional(),
    price: z.coerce.number().min(0),
    sku: z.string().trim().min(1, "SKU is required").max(50),
    discountPercentage: z.coerce.number().min(0).max(100).default(0),
    stockType: z.enum(["in_stock", "made_to_order"]),
    stockQuantity: z.coerce.number().int().min(0).default(0),
    processingTime: z.object({
        value: z.coerce.number().min(0),
        unit: z.enum(["hours", "days"]),
    }),
    media: z.array(z.string()).default([]),
    inquirePrice: z.boolean().default(false),
})

export const productVariantBatchSchema = z.object({
    productId: z.string().min(1, "Select a product"),
    variants: z.array(productVariantSchema.omit({ _id: true, productId: true })).min(1).max(100),
})

export const productVariantFormSchema = productVariantSchema
    .omit({ _id: true, processingTime: true, media: true })
    .extend({
        processingValue: z.coerce.number().min(0),
        processingUnit: z.enum(["hours", "days"]),
    })
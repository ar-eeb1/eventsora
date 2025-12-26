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
    locality: z.string().min(3, "Locality should contain at least 3 letters"),
    status: z.string().min(3, "Status should contain at least 3 letters"),
    dateStatus: z.enum(dateStatus),
    sublocality: z.string().nullable().optional(),
    description: z.string().min(10, "Description required"),
    listing: z.string().min(1, "Listing required"),
    listingId: z.string().min(1, 'Select listing'),
    code: z.string().min(1, "Country Code should contain at least 1 letter"),
    role: z.string().min(1, "Required"),
    adminNote: z.string().optional(),
    media: z.array(z.string()),
    startingPrice: z.coerce
        .number({ invalid_type_error: "Please enter valid number" })
        .min(0, "Expected positive value"),
    price: z.number().nullable().optional(),
    capacity: z.coerce.number().min(0).optional(),
    date: z.coerce.date(),
});
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const listingStatus = ['pending', 'approved', 'rejected']
export const pricingType = ['per_hour', 'per_day', 'per_person', 'fixed']
export const dateStatus = ['available', 'booked', 'blocked']
export const sortings = [
  { label: 'Default Sorting', value: 'default_sorting' },
  { label: 'Ascending Sorting', value: 'asc' },
  { label: 'Descending Sorting', value: 'desc' },
  { label: 'Price: Low to High', value: 'price_low_high' },
  { label: 'Price: High to Low', value: 'price_high_low' },
]

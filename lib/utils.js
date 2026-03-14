import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const listingStatus = ['pending', 'approved', 'rejected']
export const bookingStatus = ['pending', 'confirmed', 'awaiting-payment', 'completed', 'cancelled', 'unverified']
export const paymentStatus = ['pending', 'paid', 'partially-paid', 'cancelled', 'unverified', 'refunded']
export const pricingType = ['per_hour', 'per_day', 'per_person', 'fixed']
export const dateStatus = ['available', 'booked', 'blocked']
export const banks = [
  'Al Baraka',
  'Allied Bank Limited',
  'Askari Bank',
  'Bank Al Habib Limited',
  'Bank Alfalah',
  'Bank Mukaramah Limited (BML)',
  'Bank Of Punjab',
  'Bank Of Khyber',
  'Bank Islamic',
  'Burj Bank Limited',
  'Citi Bank',
  'Digitt+',
  'Dubai Islamic Bank',
  'Faysal Bank',
  'First Women Bank',
  'HBL Microfinance Bank',
  'Habib Metro Bank',
  'JS Bank',
  'KEENU',
  'MCB Bank',
  'MCB Islamic Bank',
  'Meezan Bank',
  'Mobilink Bank/Jazzcash',
  'NBP FUND',
  'National Bank of Pakistan',
  'NayaPay',
  'PayFast',
  'SadaPay',
  'Samba Bank Limited',
  'Slik Bank',
  'Sindh Bank',
  'Soneri Bank',
  'Standard Chartered Bank',
  'United Bank Limited',
  'U Microfinance Bank',

]
export const sortings = [
  { label: 'Default Sorting', value: 'default_sorting' },
  { label: 'Ascending Sorting', value: 'asc' },
  { label: 'Descending Sorting', value: 'desc' },
  { label: 'Price: Low to High', value: 'price_low_high' },
  { label: 'Price: High to Low', value: 'price_high_low' },
]

// common role options used across admin interfaces
export const userRoleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Provider', value: 'provider' },
  { label: 'Admin', value: 'admin' },
  { label: 'Master', value: 'master' },
  { label: 'Suspended', value: 'suspended' },
]

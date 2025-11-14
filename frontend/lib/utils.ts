import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the correct Russian declension for "услуга/услуги/услуг" based on count
 * @param count - The number of services
 * @returns String with count and correct declension (e.g., "63 услуги")
 */
export function getServiceCountText(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  
  // 1, 21, 31, etc. (but not 11)
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} услуга`;
  }
  // 2-4, 22-24, 32-34, etc. (but not 12-14)
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} услуги`;
  }
  // All other cases: 5-20, 25-30, 35-40, etc.
  return `${count} услуг`;
}
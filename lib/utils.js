import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { id } from "date-fns/locale";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Date utilities with WIB timezone support
export const WIB_TIMEZONE = "Asia/Jakarta";

export function formatDateWIB(date, formatString = "dd/MM/yyyy HH:mm") {
  return formatInTimeZone(date, WIB_TIMEZONE, formatString, { locale: id });
}

export function formatDate(date, formatString = "dd/MM/yyyy") {
  return format(date, formatString, { locale: id });
}

export function formatDateTime(date) {
  return formatDateWIB(date, "dd/MM/yyyy HH:mm:ss");
}

export function formatDateOnly(date) {
  return formatDateWIB(date, "dd/MM/yyyy");
}

// Get user initials for avatar fallback
export function getUserInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

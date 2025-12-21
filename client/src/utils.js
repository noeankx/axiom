import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const createPageUrl = (pageName) => {
  if (pageName === 'Landing') return '/';
  return `/${pageName}`;
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString();
};

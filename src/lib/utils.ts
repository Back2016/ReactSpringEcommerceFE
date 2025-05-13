import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BASE_URL } from '@/lib/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmpersandToHyphen(input: string): string {
  if (input.includes(' & ')) {
    const parts = input.split(' & ').map(part => part.trim());
    return parts.join('-');
  }
  return input;
}

export function convertHyphenToAmpersand(input: string): string {
  if (input.includes('-')) {
    const parts = input.split('-').map(part => part.trim());
    return parts.join(' & ');
  }
  return input;
}


export function getPublicUrl(path: string): string {
  // console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production') {
    return path;
  }

  // In development, prepend base URL (e.g. localhost:9090)
  return `${BASE_URL}${path}`;
}

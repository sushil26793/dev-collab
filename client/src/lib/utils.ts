import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function debounce<A extends unknown[]>(
  func: (...args: A) => void,
  delay: number
): (...args: A) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: A): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const rates: any = {
  "0": 0.01,
  "1": 0.02,
  "2": 0.03,
};

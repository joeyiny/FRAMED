import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toHexString = (bytes: any) =>
  bytes.reduce(
    (str: any, byte: any) => str + byte.toString(16).padStart(2, "0"),
    ""
  );

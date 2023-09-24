import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenEthAddress(address: string, frontLength = 4, backLength = 4) {
  // Check the address first
  if (!address) {
    console.log("Provided Ethereum address is undefined!");
    return undefined;
  }

  // Ensure the address starts with 0x, remove it if so for our process
  const cleanAddress = address.startsWith("0x") ? address.substr(2) : address;

  // Shorten it
  const shortenedAddress = `${cleanAddress.substr(0, frontLength)}...${cleanAddress.substr(
    cleanAddress.length - backLength
  )}`;

  // Finally add 0x back
  return "0x" + shortenedAddress;
}

export const toHexString = (bytes: any) =>
  bytes.reduce((str: any, byte: any) => str + byte.toString(16).padStart(2, "0"), "");

export const shuffleArray = <T>(arr: T[]): T[] => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

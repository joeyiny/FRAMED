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

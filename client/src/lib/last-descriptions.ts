export interface LastDescription {
  name: string;
  displayName: string;
  description: string;
  characteristics: string[];
  style: string;
  fit: string;
  occasions: string[];
  craftsmanship?: string;
}

export const lastDescriptions: Record<string, LastDescription> = {
  palazzo: {
    name: "palazzo",
    displayName: "Palazzo",
    description: "Soft square toe Albert slipper with refined proportions.",
    characteristics: [
      "Soft square toe",
      "Albert slipper design",
      "Refined proportions"
    ],
    style: "Albert Slipper",
    fit: "Standard width with refined comfort",
    occasions: ["Indoor luxury", "Evening wear"],
    craftsmanship: "Goodyear welted construction"
  },
  santiago: {
    name: "santiago",
    displayName: "Santiago",
    description: "Albert slipper with generous proportions for maximum comfort.",
    characteristics: [
      "Albert slipper design",
      "Generous proportions",
      "Maximum comfort"
    ],
    style: "Comfort Albert Slipper",
    fit: "Generous fit for maximum comfort",
    occasions: ["Indoor luxury", "Traditional comfort"],
    craftsmanship: "Premium construction"
  },
  cadiz: {
    name: "cadiz",
    displayName: "Cadiz",
    description: "Chisel toe with narrow waist and Cuban heel.",
    characteristics: [
      "Chisel toe",
      "Narrow waist",
      "Cuban heel"
    ],
    style: "Continental Chisel",
    fit: "Refined fit with narrow waist",
    occasions: ["Formal business", "European style"],
    craftsmanship: "Goodyear welted"
  },
  vizcaya: {
    name: "vizcaya",
    displayName: "Vizcaya",
    description: "Soft chisel toe with sleek and refined proportions.",
    characteristics: [
      "Soft chisel toe",
      "Sleek proportions",
      "Refined elegance"
    ],
    style: "Modern Soft Chisel",
    fit: "Classic fit with refined proportions",
    occasions: ["Modern business", "Sophisticated occasions"],
    craftsmanship: "Goodyear welted construction"
  },
  alhambra: {
    name: "alhambra",
    displayName: "Alhambra",
    description: "Rounded toe in British tradition.",
    characteristics: [
      "Rounded toe",
      "British tradition",
      "Heritage elegance"
    ],
    style: "British",
    fit: "Precise fit with British proportions",
    occasions: ["Traditional business", "British heritage"],
    craftsmanship: "Goodyear welted with burnished finish"
  },
  prado: {
    name: "prado",
    displayName: "Prado",
    description: "Soft square toe with commanding presence.",
    characteristics: [
      "Soft square toe",
      "Commanding presence",
      "Traditional elegance"
    ],
    style: "Traditional Soft Square",
    fit: "Generous fit with traditional proportions",
    occasions: ["Traditional business", "Authoritative presence"],
    craftsmanship: "Premium construction"
  }
};

export const getLastDescription = (lastName: string): LastDescription | null => {
  return lastDescriptions[lastName.toLowerCase()] || null;
};

export const getAllLastDescriptions = (): LastDescription[] => {
  return Object.values(lastDescriptions);
}; 
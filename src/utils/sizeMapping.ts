/**
 * Size mapping utility for converting between numeric values and string representations
 */

export interface SizeMapping {
  value: number;
  label: string;
}

export const SIZE_MAPPINGS: SizeMapping[] = [
  { value: 34.0, label: 'XS' },
  { value: 36.0, label: 'S' },
  { value: 38.0, label: 'M' },
  { value: 40.0, label: 'L' },
  { value: 42.0, label: 'XL' },
  { value: 44.0, label: 'XXL' },
];

/**
 * Convert numeric size value to string label
 */
export const getSizeLabel = (value: number): string => {
  const mapping = SIZE_MAPPINGS.find(size => Math.abs(size.value - value) < 0.001);
  return mapping ? mapping.label : `Size ${value}`;
};

/**
 * Convert string label to numeric size value
 */
export const getSizeValue = (label: string): number | null => {
  const mapping = SIZE_MAPPINGS.find(size => size.label === label);
  return mapping ? mapping.value : null;
};

/**
 * Get all size labels
 */
export const getAllSizeLabels = (): string[] => {
  return SIZE_MAPPINGS.map(size => size.label);
};

/**
 * Get all size values
 */
export const getAllSizeValues = (): number[] => {
  return SIZE_MAPPINGS.map(size => size.value);
};

/**
 * Check if a value is a valid size
 */
export const isValidSizeValue = (value: number): boolean => {
  return SIZE_MAPPINGS.some(size => Math.abs(size.value - value) < 0.001);
};

/**
 * Check if a label is a valid size
 */
export const isValidSizeLabel = (label: string): boolean => {
  return SIZE_MAPPINGS.some(size => size.label === label);
}; 
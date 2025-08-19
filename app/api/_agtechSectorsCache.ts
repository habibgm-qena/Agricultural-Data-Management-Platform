type AgtechSector = 'Livestock' | 'Vegetables' | 'Fishery' | 'Seedlings' | 'Seed Prod.' | 'Apiculture' | 'Poultry';

const sectorsCache = new Map<string, AgtechSector[]>();

export function setAgtechSectors(customerId: string, sectors: AgtechSector[]) {
  sectorsCache.set(customerId, sectors);
}

export function getAgtechSectors(customerId: string): AgtechSector[] | undefined {
  return sectorsCache.get(customerId);
}

export function clearAgtechSectors(customerId?: string) {
  if (!customerId) {
    sectorsCache.clear();
    return;
  }
  sectorsCache.delete(customerId);
}

export type { AgtechSector }; 
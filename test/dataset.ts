import type { DataItem } from '../src/types.js';

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

const adjectives = [
  'Wireless',
  'Mechanical',
  'Portable',
  'Rechargeable',
  'Compact',
  'Ergonomic',
  'Magnetic',
  'Smart',
  'Ultra',
  'Durable',
  'Silent',
  'Backlit'
] as const;

const nouns = [
  'Keyboard',
  'Mouse',
  'Charging Cable',
  'Switches',
  'Headphones',
  'Microphone',
  'Monitor Stand',
  'USB Hub',
  'Trackpad',
  'Webcam',
  'Adapter',
  'Power Bank'
] as const;

const qualifiers = [
  'Layout',
  'Blue',
  'Brown',
  'Red',
  'USB-C',
  '2m',
  '1m',
  'Gen2',
  'Aluminum',
  'Mini',
  'Max',
  'Pro'
] as const;

export function generateRealisticDataset(count = 2000, seed = 1337): DataItem[] {
  const rng = mulberry32(seed);
  const items: DataItem[] = [];
  for (let i = 0; i < count; i++) {
    const phrase = `${pick(rng, adjectives)} ${pick(rng, nouns)} ${pick(rng, qualifiers)}`;
    items.push({ id: `ITEM-${i.toString().padStart(4, '0')}`, phrase });
  }
  return items;
}


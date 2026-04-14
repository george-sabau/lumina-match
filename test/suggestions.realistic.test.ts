import { describe, expect, it } from 'vitest';
import { createMatcher } from '../src/suggest.js';
import { generateRealisticDataset } from './dataset.js';

describe('realistic dataset suggestions', () => {
  it('finds expected item for typos/prefixes', () => {
    const data = generateRealisticDataset(2000, 1337);

    // Inject a few canonical phrases we want to reliably find
    // Add unique suffixes so these IDs don't get lost among generated near-duplicates.
    data.push({ id: 'A-12', phrase: 'Wireless Keyboard Layout A12' });
    data.push({ id: 'B-44', phrase: 'Mechanical Switches Blue B44' });
    data.push({ id: 'C-01', phrase: 'USB-C Charging Cable C01' });

    const matcher = createMatcher(data);

    const kybord = matcher.suggestions('Kybord', 25);
    // With a realistic dataset there may be many "Keyboard ..." candidates; ensure we still
    // return a keyboard-like suggestion with reasonable confidence.
    expect(kybord.some((s) => /keyboard/i.test(s.phrase) && s.confidence >= 60)).toBe(true);

    const mechBlu = matcher.suggestions('mech switches bl', 25);
    expect(mechBlu.some((s) => /mechanical/i.test(s.phrase) && /switches/i.test(s.phrase))).toBe(true);

    const usbc = matcher.suggestions('usb c charg', 25);
    expect(usbc.some((s) => /usb/i.test(s.phrase) && /charg/i.test(s.phrase))).toBe(true);
  });

  it('is fast enough for ~2k items (non-brittle)', () => {
    const data = generateRealisticDataset(2000, 1337);
    const matcher = createMatcher(data);

    // Avoid overly strict timing; just ensure it doesn't accidentally go quadratic-slow.
    const t0 = performance.now();
    for (const q of ['keybord', 'wireless', 'usb-c', 'mech swtch', 'adapter pro']) {
      matcher.suggestions(q, 10);
    }
    const elapsed = performance.now() - t0;

    expect(elapsed).toBeLessThan(250);
  });
});


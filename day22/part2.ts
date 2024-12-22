import { rng } from "./part1.ts";

export function solvePart2(text: string): number {
  const xs = text.split("\n").map(BigInt);

  const patternPricesMaps: Map<string, number>[] = [];
  const allPatterns = new Set<string>();
  const sequences = xs.map(prices);

  for (const seq of sequences) {
    const xszxs = new Map<string, number>();
    patternPricesMaps.push(xszxs);
    for (const [pat, price] of patternPrices(seq)) {
      allPatterns.add(pat);
      if (!xszxs.has(pat)) {
        xszxs.set(pat, price);
      }
    }
  }

  return Math.max(
    ...allPatterns.values().map((pat) =>
      patternPricesMaps.map((x) => Math.max(0, x.get(pat) ?? 0)).reduce(
        (l, r) => l + r,
        0,
      )
    ),
  );
}

export function patternPrices(
  prices: number[],
): [string, number][] {
  const res: [string, number][] = [];
  for (let i = 4; i < prices.length; i++) {
    const n0 = prices[i - 4];
    const n1 = prices[i - 3];
    const n2 = prices[i - 2];
    const n3 = prices[i - 1];
    const n4 = prices[i - 0];
    const pattern = [n1 - n0, n2 - n1, n3 - n2, n4 - n3].join(",");
    res.push([pattern, n4] as const);
  }
  return res;
}

export function prices(seed: bigint): number[] {
  const res: number[] = [price(seed)];
  let prev = seed;
  for (let i = 0; i < 2_000; i++) {
    prev = rng(prev);
    res.push(price(prev));
  }
  return res;
}

function price(n: bigint): number {
  const s = n.toString();
  return Number(s[s.length - 1]);
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part2 = `, solvePart2(fileText));
}

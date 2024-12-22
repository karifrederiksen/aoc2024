export function solvePart1(text: string): bigint {
  const xs = text.split("\n").map(BigInt);

  return xs.map((x) => loopRng(x, 2000)).reduce((l, r) => l + r, 0n);
}

function loopRng(seed: bigint, iterations: number): bigint {
  for (let i = 0; i < iterations; i++) {
    seed = rng(seed);
  }
  return seed;
}

export function rng(seed: bigint): bigint {
  seed = mix(seed, seed * 64n);
  seed = prune(seed);
  seed = mix(seed, (seed / 32n) | 0n);
  seed = prune(seed);
  seed = mix(seed, seed * 2048n);
  seed = prune(seed);
  return seed;
}

function mix(n: bigint, m: bigint): bigint {
  return m ^ n;
}

function prune(n: bigint): bigint {
  return n % 16_777_216n;
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
}

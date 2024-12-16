import { sum } from "../util/index.ts";

async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  const chars = [...text].map(Number);
  const files = chars.filter((_, i) => i % 2 === 0);
  const space = chars.filter((_, i) => i % 2 === 1);
  const memory: number[] = [];
  for (let i = 0; i < files.length; i++) {
    const fileLen = files[i];
    const emptyLen = space[i];
    memory.push(...new Array(fileLen).fill(i));
    memory.push(...new Array(emptyLen).fill(-1));
  }

  let l = 0;
  let r = memory.length - 1;
  while (r >= 0 && l < r) {
    if (memory[l] !== -1) {
      l++;
      continue;
    }
    if (memory[r] === -1) {
      r--;
      continue;
    }
    memory[l] = memory[r];
    memory[r] = -1;
  }

  return sum(memory.map((n, i) => Math.max(0, n) * i));
}

type MemoryChunk = {
  readonly size: number;
  readonly id: number;
  readonly isFile: boolean;
};

export function solvePart2(text: string): number {
  const chunks: MemoryChunk[] = [...text].map(Number).map((size, idx) => ({
    size,
    id: idx / 2,
    isFile: idx % 2 === 0,
  }));

  for (let fileIdx = chunks.length - 1; fileIdx >= 0; fileIdx--) {
    const file = chunks[fileIdx];
    if (!file.isFile) continue;

    for (let spaceIdx = 0; spaceIdx < chunks.length; spaceIdx++) {
      const space = chunks[spaceIdx];
      if (space.isFile) continue;
      if (spaceIdx > fileIdx) break;

      const remainingSpace = space.size - file.size;
      if (remainingSpace === 0) {
        chunks[spaceIdx] = file;
        chunks[fileIdx] = space;
        break;
      } else if (remainingSpace > 0) {
        chunks[fileIdx] = {
          id: -1,
          isFile: false,
          size: space.size - remainingSpace,
        };
        chunks[spaceIdx] = file;
        chunks.splice(spaceIdx + 1, 0, {
          id: -1,
          isFile: false,
          size: remainingSpace,
        });
        break;
      }
    }
  }

  const memory = chunks.flatMap(({ size, id, isFile }) =>
    new Array(size).fill(isFile ? id : -1)
  );
  return sum(
    memory.map((n, i) => Math.max(0, n) * i),
  );
}

if (import.meta.main) {
  await main();
}

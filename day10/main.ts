import { Grid, Queue, sum, Vec2 } from "../util/index.ts";

async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  const grid = new Grid(text.split("\n").map((ln) => [...ln].map(Number)));
  const railHeads = [...grid.iter()].filter((x) => x.val === 0);

  const nodeQueue = new Queue(
    railHeads.map(({ val, coord }) => ({
      height: val,
      path: [coord],
      pos: coord,
    })),
  );
  const results: Map<string, Set<string>> = new Map();
  while (nodeQueue.length > 0) {
    const { height, path, pos } = nodeQueue.next()!;
    if (height === 9) {
      const key = path[0].toString();
      const peaks = results.get(key) ?? new Set();
      peaks.add(pos.toString());
      results.set(key, peaks);
      continue;
    }
    const directions = [
      pos.up(),
      pos.right(),
      pos.down(),
      pos.left(),
    ];
    for (const dir of directions) {
      const dirHeight = grid.get(dir);
      if (dirHeight === height + 1) {
        nodeQueue.add({ height: height + 1, path: [...path, dir], pos: dir });
      }
    }
  }

  return sum([...results].map(([_, x]) => x.size));
}

export function solvePart2(text: string): number {
  const grid = new Grid(text.split("\n").map((ln) => [...ln].map(Number)));
  const railHeads = [...grid.iter()].filter((x) => x.val === 0);

  const nodeQueue = new Queue(
    railHeads.map(({ val, coord }) => ({
      height: val,
      path: [coord],
      pos: coord,
    })),
  );
  const results: Map<string, Vec2[][]> = new Map();
  while (nodeQueue.length > 0) {
    const { height, path, pos } = nodeQueue.next()!;
    if (height === 9) {
      const key = path[0].toString();
      const paths = results.get(key) ?? [];
      paths.push(path);
      results.set(key, paths);
      continue;
    }
    const directions = [
      pos.up(),
      pos.right(),
      pos.down(),
      pos.left(),
    ];
    for (const dir of directions) {
      const dirHeight = grid.get(dir);
      if (dirHeight === height + 1) {
        nodeQueue.add({ height: height + 1, path: [...path, dir], pos: dir });
      }
    }
  }

  return sum([...results].map(([_, x]) => x.length));
}

// deno-lint-ignore no-unused-vars
function pathsToString(
  grid: Grid<number>,
  paths: readonly (readonly Vec2[])[],
): string {
  return grid.toString((_, gx, gy) => {
    const pathIndices = paths.flatMap((path) =>
      path.findIndex(({ x, y }) => x === gx && y === gy)
    );
    const idx = pathIndices.find((x) => x !== -1);
    if (!idx) {
      return ".";
    }
    return idx.toString();
  });
}

// deno-lint-ignore no-unused-vars
function pathToString(grid: Grid<number>, path: readonly Vec2[]): string {
  return grid.toString((_, gx, gy) => {
    const pathIdx = path.findIndex(({ x, y }) => x === gx && y === gy);
    if (pathIdx === -1) {
      return ".";
    }
    return pathIdx.toString();
  });
}

if (import.meta.main) {
  await main();
}

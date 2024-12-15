import { Grid, MultiMap, Vec2 } from "../util.ts";

async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  const grid = new Grid(text.split("\n").map((ln) => [...ln]));
  const freqs = new MultiMap<string, Vec2>();

  for (const { val, coord } of grid.iter()) {
    if (val !== ".") {
      freqs.add(val, coord);
    }
  }

  const antinodes: Vec2[] = [];
  for (const [_, pts] of freqs) {
    let i = 1;
    for (const val1 of pts) {
      for (const val2 of pts.values().drop(i)) {
        const min = Vec2.min(val1, val2);
        const max = Vec2.max(val1, val2);
        const d = max.sub(min);
        const apt1 = min.sub(d);
        const apt2 = max.add(d);

        if (grid.isInBounds(apt1)) antinodes.push(apt1);
        if (grid.isInBounds(apt2)) antinodes.push(apt2);
      }
      i++;
    }
  }

  return new Set(antinodes.map((a) => a.toString())).size;
}

export function solvePart2(text: string): number {
  const grid = new Grid(text.split("\n").map((ln) => [...ln]));
  const freqs = new MultiMap<string, Vec2>();

  for (const { val, coord } of grid.iter()) {
    if (val !== ".") {
      freqs.add(val, coord);
    }
  }

  const antinodes: Vec2[] = [];
  for (const [_, pts] of freqs) {
    let i = 1;
    for (const val1 of pts) {
      for (const val2 of pts.values().drop(i)) {
        const min = Vec2.min(val1, val2);
        const max = Vec2.max(val1, val2);
        const d = max.sub(min);

        for (let j = 0; true; j++) {
          const pt = min.sub(d.mulN(j));
          if (!grid.isInBounds(pt)) {
            break;
          }
          antinodes.push(pt);
        }

        for (let j = 0; true; j++) {
          const pt = max.add(d.mulN(j));
          if (!grid.isInBounds(pt)) {
            break;
          }
          antinodes.push(pt);
        }
      }
      i++;
    }
  }

  return new Set(antinodes.map((a) => a.toString())).size;
}

if (import.meta.main) {
  await main();
}

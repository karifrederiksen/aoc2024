import { Grid, Queue, Vec2 } from "../util.ts";

export function solvePart2(text: string): number {
  const grid = new Grid(text.split("\n").map((s) => [...s]));

  const q = new Queue<Vec2>([new Vec2(0, 0)]);
  const checked = new Set<string>();

  let fence = 0;
  while (q.length) {
    const pos = q.next()!;
    if (!grid.isInBounds(pos)) continue;
    if (checked.has(pos.toString())) continue;

    const res = getAreaAndCircumference(grid, checked, pos);
    for (const adj of res.adjacent) {
      q.add(adj);
    }
    for (const p of res.area) {
      checked.add(p.toString());
    }
    fence += res.sides * res.area.length;
  }

  return fence;
}

export function getAreaAndCircumference(
  grid: Grid<string>,
  checkedPreviously: ReadonlySet<string>,
  pos: Vec2,
): { area: Vec2[]; adjacent: Vec2[]; sides: number } {
  const area: Vec2[] = [pos];
  const adjacent: Vec2[] = [];
  const q = new Queue<Vec2>([pos]);
  const val = grid.get(pos);
  const checked = new Set<string>(checkedPreviously);
  checked.add(pos.toString());
  while (q.length) {
    const pos = q.next()!;
    const dirs = [
      pos.up(),
      pos.right(),
      pos.down(),
      pos.left(),
    ];
    for (const dir of dirs) {
      if (checked.has(dir.toString())) continue;

      if (grid.get(dir) !== val) {
        adjacent.push(dir);
      } else {
        area.push(dir);
        q.add(dir);
      }
      checked.add(dir.toString());
    }
  }
  const sides: Set<string>[] = [];
  {
    // don't judge me
    const dirs: { move: (p: Vec2) => Vec2; sideToCheck: (p: Vec2) => Vec2 }[] =
      [
        { move: (p) => p.down(), sideToCheck: (p) => p.left() },
        { move: (p) => p.down(), sideToCheck: (p) => p.right() },
        { move: (p) => p.right(), sideToCheck: (p) => p.up() },
        { move: (p) => p.right(), sideToCheck: (p) => p.down() },
      ];
    area.sort(Vec2.compare);
    const areaSet = new Set(area.map((x) => x.toString()));
    for (const { move, sideToCheck } of dirs) {
      const checked = new Set<string>();
      for (const startPos of area) {
        if (checked.has(startPos.toString())) continue;

        const side = new Set<string>();
        let pos = startPos;
        while (true) {
          if (!areaSet.has(pos.toString())) break;
          if (areaSet.has(sideToCheck(pos).toString())) break;

          side.add(pos.toString());
          pos = move(pos);
          checked.add(pos.toString());
        }
        if (side.size) {
          sides.push(side);
        }
      }
    }
  }
  return { area, adjacent, sides: sides.length };
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part2 = `, solvePart2(fileText));
}

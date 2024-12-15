import { Grid, Queue, Vec2 } from "../util.ts";

export function solvePart1(text: string): number {
  const grid = new Grid(text.split("\n").map((s) => [...s]));

  const q = new Queue<Vec2>([new Vec2(0, 0)]);
  const checked = new Set<string>();

  let fence = 0;
  while (q.length) {
    const pos = q.next()!;
    if (checked.has(pos.toString())) continue;

    const res = getAreaAndCircumference(grid, checked, pos);
    for (const adj of res.adjacent) {
      q.add(adj);
    }
    for (const p of res.area) {
      checked.add(p.toString());
    }
    fence += res.perimeter * res.area.length;
  }

  return fence;
}

export function getAreaAndCircumference(
  grid: Grid<string>,
  checkedPreviously: ReadonlySet<string>,
  pos: Vec2,
): { area: Vec2[]; adjacent: Vec2[]; perimeter: number } {
  const area: Vec2[] = [pos];
  const adjacent: Vec2[] = [];
  const q = new Queue<Vec2>([pos]);
  const val = grid.get(pos);
  const checked = new Set<string>(checkedPreviously);
  checked.add(pos.toString());
  let perimeter = 0;
  while (q.length) {
    const pos = q.next()!;
    const dirs = [
      pos.up(),
      pos.right(),
      pos.down(),
      pos.left(),
    ];
    for (const dir of dirs) {
      const hasBeenChecked = checked.has(dir.toString());
      const isInBounds = grid.isInBounds(dir);
      if (grid.get(dir) !== val) {
        perimeter++;
        if (isInBounds && !hasBeenChecked) {
          adjacent.push(dir);
        }
      } else if (isInBounds && !hasBeenChecked) {
        area.push(dir);
        q.add(dir);
        checked.add(dir.toString());
      }
    }
  }
  return { area, adjacent, perimeter };
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
}

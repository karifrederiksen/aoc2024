import {
  Grid,
  MultiMap,
  numberLT,
  OrdMap,
  OrdSet,
  Queue,
  Vec2,
} from "../util/index.ts";
import { stringLT } from "../util/shared.ts";

export function solvePart2(text: string): number {
  const grid = new Grid(text.split("\n").map((s) => [...s]));

  const start = grid.find((x) => x === "S")!.coord;
  const goal = grid.find((x) => x === "E")!.coord;
  grid.set(start, ".");
  grid.set(goal, ".");

  const distancesFromStart = dijkstra(grid, new DirVec2(start, "R"));
  const paths = retrace(distancesFromStart, new DirVec2(start, "R"), goal);
  const bestSeats = new Set(paths.flat().map((x) => x.pos.toString()));
  // console.log(
  //   grid.toString((v, coord) => {
  //     if (coord.equals(start)) return "S";
  //     if (coord.equals(goal)) return "E";
  //     if (bestSeats.has(coord.toString())) return "O";
  //     return v;
  //   }),
  // );
  return bestSeats.size;
}

type Path = DirVec2[];

function dijkstra(
  grid: Grid<string>,
  start: DirVec2,
): Grid<OrdMap<Dir, number>> {
  const distGrid: Grid<OrdMap<Dir, number>> = new Grid(
    new Array(grid.height).fill(grid.width).map((w) =>
      new Array(w).fill(OrdMap.empty<Dir, number>(stringLT))
    ),
  );
  distGrid.set(
    start.pos,
    OrdMap.empty<Dir, number>(stringLT).insert(start.dir, 0),
  );
  let visited = OrdSet.empty<DirVec2>(DirVec2.lessThan);
  let toVisit = MultiMap.empty<number, DirVec2>(numberLT, DirVec2.lessThan)
    .insert(0, start);

  while (toVisit.size) {
    const [dist, pos, nextToVisit] = toVisit.popFirst()!;
    toVisit = nextToVisit;
    visited = visited.insert(pos);

    const neighbors = [
      pos.up(),
      pos.right(),
      pos.down(),
      pos.left(),
    ].filter((x) =>
      x != null && grid.isInBounds(x.pos) && grid.get(x.pos) === "."
    ) as DirVec2[];

    for (const n of neighbors) {
      const cell = distGrid.get(n.pos)!;
      const prevNDist = cell.find(n.dir);
      const nDist = dist + deltaCost(pos, n);
      if (!prevNDist || nDist < prevNDist) {
        distGrid.set(n.pos, cell.insert(n.dir, nDist));
      }
      if (!visited.has(n)) {
        toVisit = toVisit.insert(nDist, n);
      }
    }
  }

  return distGrid;
}

function retrace(
  distFromStart: Grid<OrdMap<Dir, number>>,
  start: DirVec2,
  goal: Vec2,
): Path[] {
  const results: Path[] = [];
  const wips = new Queue<Path>([[start]]);
  const goalDist = distFromStart.get(goal)!.min()![1];

  while (wips.length) {
    const path = wips.next()!;
    const pos = path[path.length - 1];
    const dist = distFromStart.get(pos.pos)!.find(pos.dir)!;

    const neighbors = [
      pos.up(),
      pos.right(),
      pos.down(),
      pos.left(),
    ];

    if (pos.pos.equals(goal)) {
      results.push(path);
      continue;
    }

    for (const n of neighbors) {
      if (n === null) continue;

      const nDist = distFromStart.get(n.pos)?.find(n.dir);
      if (nDist == null) continue;
      if (nDist > goalDist) continue;

      const delta = deltaCost(pos, n);
      if (nDist - dist !== delta) continue;

      wips.add([...path, n]);
    }
  }

  return results;
}

type Dir = "L" | "R" | "U" | "D";

class DirVec2 {
  static lessThan(l: DirVec2, r: DirVec2): boolean {
    if (l.dir < r.dir) {
      return true;
    }
    if (l.dir > r.dir) {
      return false;
    }
    return Vec2.lessThan(l.pos, r.pos);
  }

  constructor(readonly pos: Vec2, readonly dir: Dir) {}

  equals(r: DirVec2): boolean {
    return this.dir === r.dir && this.pos.equals(r.pos);
  }

  up(): DirVec2 | null {
    if (this.dir === "D") {
      return null;
    }
    return new DirVec2(this.pos.up(), "U");
  }

  right(): DirVec2 | null {
    if (this.dir === "L") {
      return null;
    }
    return new DirVec2(this.pos.right(), "R");
  }

  down(): DirVec2 | null {
    if (this.dir === "U") {
      return null;
    }
    return new DirVec2(this.pos.down(), "D");
  }

  left(): DirVec2 | null {
    if (this.dir === "R") {
      return null;
    }
    return new DirVec2(this.pos.left(), "L");
  }

  toString(): string {
    return `${this.dir}${this.pos}`;
  }
}

function deltaCost(prev: DirVec2, next: DirVec2): number {
  let sum = 0;
  if (prev.dir !== next.dir) {
    sum += 1000;
  }
  if (!prev.pos.equals(next.pos)) {
    sum += 1;
  }
  return sum;
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part2 = `, solvePart2(fileText));
}

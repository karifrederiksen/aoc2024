import { compare, Grid, Seq, Vec2 } from "../util/index.ts";

export function solvePart1(text: string): number {
  const grid = new Grid(text.split("\n").map((s) => [...s]));

  const start = grid.find((x) => x === "S")!.coord;
  const end = grid.find((x) => x === "E")!.coord;
  grid.set(start, ".");
  grid.set(end, ".");

  const h = (p: DirVec2): number => {
    const { x, y } = start.sub(p.pos).abs();
    return x + y;
  };

  const path = astar(grid, new DirVec2(start, "R"), new DirVec2(end, "R"), h);

  console.log("path", path!.join("\n"));
  console.log(
    grid.toString((v, coord) =>
      path!.find(({ pos }) => pos.equals(coord))?.dir ?? v
    ),
  );
  console.log(path?.length);
  return cost(path!);
}

type Dir = "L" | "R" | "U" | "D";

class DirVec2 {
  constructor(readonly pos: Vec2, readonly dir: Dir) {}

  equals(r: DirVec2): boolean {
    return this.dir === r.dir && this.pos.equals(r.pos);
  }

  up(): DirVec2 | null {
    if (this.dir === "U") {
      return new DirVec2(this.pos.up(), this.dir);
    }
    if (this.dir === "D") {
      return null;
    }
    return new DirVec2(this.pos, "U");
  }

  right(): DirVec2 | null {
    if (this.dir === "R") {
      return new DirVec2(this.pos.right(), this.dir);
    }
    if (this.dir === "L") {
      return null;
    }
    return new DirVec2(this.pos, "R");
  }

  down(): DirVec2 | null {
    if (this.dir === "D") {
      return new DirVec2(this.pos.down(), this.dir);
    }
    if (this.dir === "U") {
      return null;
    }
    return new DirVec2(this.pos, "D");
  }

  left(): DirVec2 | null {
    if (this.dir === "L") {
      return new DirVec2(this.pos.left(), this.dir);
    }
    if (this.dir === "R") {
      return null;
    }
    return new DirVec2(this.pos, "L");
  }

  dist(next: DirVec2): number {
    if (this.dir !== next.dir) {
      return 1000;
    }
    return 1;
  }

  toString(): string {
    return `${this.dir}${this.pos}`;
  }
}

function astar(
  grid: Grid<string>,
  start: DirVec2,
  goal: DirVec2,
  h: (v: DirVec2) => number,
): DirVec2[] | null {
  const openSet = new Map<string, DirVec2>();
  openSet.set(start.toString(), start);
  const cameFrom = new Map<string, DirVec2>();
  const gScore = new Map<string, number>();

  // Fastest known path from start to pos
  gScore.set(start.toString(), 0);

  // Estimated path (using `h`) from start to end, through pos
  const fScore = new Map<string, number>();
  fScore.set(start.toString(), h(goal));

  while (openSet.size) {
    // console.log();
    const current = new Seq(openSet.values()).sorted((l, r) =>
      compare(
        fScore.get(l.toString())!,
        fScore.get(r.toString())!,
      )
    ).first()!;
    openSet.delete(current.toString());

    // console.log("openSet", openSet);
    // console.log("cameFrom", cameFrom);
    // console.log("gScore", gScore);
    // console.log("fScore", fScore);
    // console.log("current: " + current);
    if (current.equals(goal)) {
      return reconstructPath(cameFrom, current);
    }

    const neighbors = [
      current.left(),
      current.right(),
      current.up(),
      current.down(),
    ].filter((x) => x !== null && grid.get(x.pos) === ".") as DirVec2[];
    // console.log(
    //   "neighbors",
    //   current.toString() + " => " +
    //     neighbors.join(" | "),
    // );

    const currentGScore = gScore.get(current.toString())!;

    for (const n of neighbors) {
      const tentativeGScore = currentGScore + current.dist(n);
      if (
        !gScore.has(n.toString()) ||
        tentativeGScore <
          (gScore.get(n.toString()) ?? Number.POSITIVE_INFINITY)
      ) {
        cameFrom.set(n.toString(), current);
        gScore.set(n.toString(), tentativeGScore);
        fScore.set(n.toString(), tentativeGScore + h(n));
        openSet.set(n.toString(), n);
      }
    }
  }
  return null;
}
function reconstructPath(
  cameFrom: ReadonlyMap<string, DirVec2>,
  current: DirVec2,
): DirVec2[] {
  const totalPath = [current];
  let next = cameFrom.get(current.toString());
  while (next) {
    totalPath.push(next);
    next = cameFrom.get(next.toString());
  }
  totalPath.reverse();
  const secondLast = totalPath[totalPath.length - 2];
  const last = totalPath[totalPath.length - 1];
  if (last.pos.equals(secondLast.pos)) {
    totalPath.splice(totalPath.length - 1, 1);
  }
  return totalPath;
}

function cost(path: readonly DirVec2[]): number {
  let sum = 0;
  let prev = path[0];
  for (let i = 1; i < path.length; i++) {
    const next = path[i];
    sum += prev.dist(next);
    prev = next;
  }
  return sum;
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
}

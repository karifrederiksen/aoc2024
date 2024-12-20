import {
  compareNumber,
  Grid,
  MultiMap,
  numberLT,
  OrdSet,
  Vec2,
} from "../util/index.ts";

export function solvePart1(
  text: string,
): { p1: Vec2; p2: Vec2; saved: number }[] {
  const grid = new Grid(text.split("\n").map((s) => [...s]));

  const start = grid.find((x) => x === "S")!.coord;
  const goal = grid.find((x) => x === "E")!.coord;
  grid.set(start, ".");
  grid.set(goal, ".");

  const distFromStart = dijkstra(grid, start);
  const distFromGoal = dijkstra(grid, goal);
  const cheats = cheatPaths(distFromGoal, distFromStart);

  return cheats;
}

function cheatPaths(
  distFromStart: Grid<number>,
  distFromGoal: Grid<number>,
): { p1: Vec2; p2: Vec2; saved: number }[] {
  const results: { p1: Vec2; p2: Vec2; saved: number }[] = [];

  for (const { coord, val: dist } of distFromStart.iter()) {
    if (!Number.isFinite(dist)) {
      continue;
    }

    const cheatPaths: [Vec2, Vec2][] = [
      [coord.up(), coord.up().up()],
      [coord.up(), coord.up().right()],
      [coord.up(), coord.up().left()],
      [coord.right(), coord.right().up()],
      [coord.right(), coord.right().right()],
      [coord.right(), coord.right().down()],
      [coord.down(), coord.down().right()],
      [coord.down(), coord.down().down()],
      [coord.down(), coord.down().left()],
      [coord.left(), coord.left().up()],
      [coord.left(), coord.left().down()],
      [coord.left(), coord.left().left()],
    ];
    const fromGoal = distFromGoal.get(coord)!;
    for (const [p1, p2] of cheatPaths) {
      if (!distFromGoal.isInBounds(p1)) continue;
      if (!distFromGoal.isInBounds(p2)) continue;

      const p1dist = distFromGoal.get(p1)!;
      if (Number.isFinite(p1dist)) continue;

      const p2dist = distFromGoal.get(p2)!;
      if (!Number.isFinite(p2dist)) continue;

      const movesSaved = -(fromGoal - p2dist + 2);
      if (movesSaved <= 0) continue;

      results.push({
        p1,
        p2,
        saved: movesSaved,
      });
    }
  }
  results.sort((l, r) => compareNumber(l.saved, r.saved));

  return results;
}

function dijkstra(
  grid: Grid<string>,
  start: Vec2,
): Grid<number> {
  const distGrid: Grid<number> = new Grid(
    new Array(grid.height).fill(grid.width).map((w) =>
      new Array(w).fill(Number.POSITIVE_INFINITY)
    ),
  );
  distGrid.set(start, 0);
  let visited = OrdSet.empty<Vec2>(Vec2.lessThan)
    .insert(start);
  let toVisit = MultiMap.empty<number, Vec2>(numberLT, Vec2.lessThan)
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
    ];

    for (const n of neighbors) {
      if (n == null) continue;
      if (!grid.isInBounds(n)) continue;
      if (grid.get(n) !== ".") continue;

      const nDist = dist + 1;
      if (nDist < distGrid.get(n)!) {
        distGrid.set(n, nDist);
      }
      if (!visited.has(n)) {
        toVisit = toVisit.insert(nDist, n);
      }
    }
  }

  return distGrid;
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(
    `part1 = `,
    solvePart1(fileText).filter((x) => x.saved >= 100).length,
  );
}

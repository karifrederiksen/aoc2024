import {
  compareNumber,
  Grid,
  MultiMap,
  numberLT,
  OrdMap,
  OrdSet,
  Vec2,
} from "../util/index.ts";

export function solvePart2(
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

    const cheatPaths = getCheatPaths(distFromGoal, coord);
    const fromGoal = distFromGoal.get(coord)!;
    const p1 = coord;
    for (const [p2, steps] of cheatPaths) {
      const p2dist = distFromGoal.get(p2)!;
      if (!Number.isFinite(p2dist)) continue;
      const movesSaved = -(fromGoal - p2dist + steps);
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

function getCheatPaths<A>(grid: Grid<A>, startPos: Vec2): OrdMap<Vec2, number> {
  let visited = OrdMap.empty<Vec2, number>(Vec2.lessThan);

  const workWork = [startPos];
  let iWork = 0;

  for (let stepCount = 1; stepCount <= 20; stepCount++) {
    const itEnd = workWork.length;
    while (iWork < itEnd) {
      const pos = workWork[iWork++];
      const neighbors = [
        pos.up(),
        pos.right(),
        pos.down(),
        pos.left(),
      ];

      for (let j = 0; j < 4; j++) {
        const n = neighbors[j];
        if (!grid.isInBounds(n)) continue;
        if (visited.find(n)) continue;

        workWork.push(n);
        visited = visited.insert(n, stepCount);
      }
    }
  }
  return visited;
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
    `part2 = `,
    solvePart2(fileText).filter((x) => x.saved >= 100).length,
  );
}

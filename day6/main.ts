async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

type Pt = readonly [number, number];
type Dir = "^" | "v" | "<" | ">";
type Grid = string[][];

type Grid2 = { height: number; cells: string[] };

export function solvePart1(text: string): number {
  const grid: Grid = text.split("\n").map((x) => [...x]);

  const startPos = grid
    .map((s, y) => {
      const x = s.findIndex((x) => /[\^v<>]/.test(x));

      if (x > -1) {
        return [x, y] as Pt;
      }
      return null;
    })
    .filter((x) => x)
    .at(0)!;

  let pos = startPos;
  while (isOnGrid(grid, pos)) {
    const dir = getCell(grid, pos) as Dir;
    const nextPos = getNextPos(pos, dir);
    const nextVal = getCell(grid, nextPos);
    if (nextVal === "#") {
      setCell(grid, pos, turn(dir));
    } else {
      setCell(grid, pos, "X");
      setCell(grid, nextPos, dir);
      pos = nextPos;
    }
  }
  console.log(grid.map((x) => x.join("")).join("\n"));

  return grid.flatMap((x) => x).filter((x) => ![".", "#"].includes(x)).length;
}

const getCell = (grid: Grid, [x, y]: Pt): string => {
  return grid.at(y)?.at(x) ?? ".";
};
const setCell = (grid: Grid, [x, y]: Pt, val: string) => {
  if (isOnGrid(grid, [x, y])) {
    grid[y][x] = val;
  }
};

const getNextPos = ([x, y]: Pt, dir: Dir): Pt => {
  switch (dir) {
    case "^":
      return [x, y - 1];
    case ">":
      return [x + 1, y];
    case "v":
      return [x, y + 1];
    case "<":
      return [x - 1, y];
    default:
      throw new Error("merry christmas: " + dir);
  }
};

const isOnGrid = (grid: Grid, [x, y]: Pt): boolean => {
  return x >= 0 && y >= 0 && x < grid[0].length && y < grid.length;
};

const turn = (dir: Dir): Dir => {
  switch (dir) {
    case "^":
      return ">";
    case ">":
      return "v";
    case "v":
      return "<";
    case "<":
      return "^";
    default:
      throw new Error("merry christmas");
  }
};

export function solvePart2(text: string): number {
  const initialGrid: Grid = text.split("\n").map((x) => [...x]);

  const startPos = initialGrid
    .map((s, y) => {
      const x = s.findIndex((x) => /[\^v<>]/.test(x));

      if (x > -1) {
        return [x, y] as Pt;
      }
      return null;
    })
    .filter((x) => x)
    .at(0)!;

  let stuckCount = 0;
  for (let y = 0; y < initialGrid.length; y += 1) {
    for (let x = 0; x < initialGrid[0].length; x += 1) {
      {
        if (startPos[0] === x && startPos[1] === y) continue;
        const val = getCell(initialGrid, [x, y]);
        if (val === "#") continue;
      }

      const visited = new Map<string, string>();
      const grid = initialGrid.map((x) => x.slice());
      setCell(grid, [x, y], "#");

      let isLooping = false;
      let pos = startPos;
      let dir = getCell(grid, pos) as Dir;
      visited.set(startPos.join(","), dir);
      while (!isLooping && isOnGrid(grid, pos)) {
        const nextPos = getNextPos(pos, dir);
        const nextVal = getCell(grid, nextPos);
        if (nextVal === "#") {
          dir = turn(dir);
          setCell(grid, pos, dir);
          continue;
        }
        setCell(grid, pos, "X");
        setCell(grid, nextPos, dir);
        pos = nextPos;
        {
          const key = nextPos.join(",");
          const prevVisit = visited.get(key) ?? "";
          if (prevVisit.includes(dir)) {
            stuckCount += 1;
            isLooping = true;
            continue;
          }
          visited.set(key, prevVisit + dir);
        }
      }
    }
  }

  return stuckCount;
}

if (import.meta.main) {
  await main();
}

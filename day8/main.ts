async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

type Pt = readonly [number, number];

function isInBounds(grid: readonly string[], [x, y]: Pt): boolean {
  return x >= 0 && y >= 0 && x < grid[0].length && y < grid.length;
}

function compare(l: number, r: number): number {
  return r > l ? 1 : l > r ? -1 : 0;
}

function comparePt(l: Pt, r: Pt): number {
  const xOrd = compare(l[0], r[0]);
  return xOrd !== 0 ? xOrd : compare(l[1], r[1]);
}

export function solvePart1(text: string): number {
  const grid = text.split("\n");
  const height = grid.length;
  const width = grid[0].length;
  const freqs = new Map<string, Pt[]>();

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const freq = grid[y][x];
      if (freq !== ".") {
        const points = freqs.get(freq) ?? [];
        points.push([x, y]);
        freqs.set(freq, points);
      }
    }
  }

  const antinodes: Pt[] = [];
  for (const [_, pts] of freqs) {
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const [[x1, y1], [x2, y2]] = [pts[i], pts[j]].sort(comparePt);
        const dx = x2 - x1;
        const dy = y2 - y1;

        const aPts = [
          [x1 - dx, y1 - dy],
          [x2 + dx, y2 + dy],
        ] as const;

        for (const aPt of aPts) {
          if (isInBounds(grid, aPt)) {
            antinodes.push(aPt);
          }
        }
      }
    }
  }

  const uniqueAntiLocations = [
    ...new Set(antinodes.map(([x, y]) => `${x},${y}`)),
  ];
  return uniqueAntiLocations.length;
}

export function solvePart2(text: string): number {
  const grid = text.split("\n");
  const height = grid.length;
  const width = grid[0].length;
  const freqs = new Map<string, Pt[]>();

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const freq = grid[y][x];
      if (freq !== ".") {
        const points = freqs.get(freq) ?? [];
        points.push([x, y]);
        freqs.set(freq, points);
      }
    }
  }

  const antinodes: Pt[] = [];
  for (const [_, pts] of freqs) {
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const [[x1, y1], [x2, y2]] = [pts[i], pts[j]].sort(comparePt);
        const dx = x2 - x1;
        const dy = y2 - y1;

        for (let i = 0; true; i += 1) {
          const aPt: Pt = [x1 - dx * i, y1 - dy * i];
          if (!isInBounds(grid, aPt)) {
            break;
          }
          antinodes.push(aPt);
        }

        for (let i = 0; true; i += 1) {
          const aPt: Pt = [x2 + dx * i, y2 + dy * i];
          if (!isInBounds(grid, aPt)) {
            break;
          }
          antinodes.push(aPt);
        }
      }
    }
  }

  // console.log(
  //   grid.map((ln, y) =>
  //     [...ln].map((c, x) => {
  //       if (c !== ".") {
  //         return c;
  //       }
  //       return antinodes.find(([ax, ay]) => x === ax && y === ay) ? "#" : c;
  //     }).join("")
  //   ).join("\n"),
  // );
  const uniqueAntiLocations = [
    ...new Set(antinodes.map(([x, y]) => `${x},${y}`)),
  ];
  return uniqueAntiLocations.length;
}

if (import.meta.main) {
  await main();
}

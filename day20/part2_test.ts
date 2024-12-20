import { assertEquals } from "@std/assert";
import { solvePart2 } from "./part2.ts";

const EXAMPLE_GRID = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

Deno.test(function part1_example() {
  const res = solvePart2(EXAMPLE_GRID);
  assertEquals(res.filter((x) => x.saved === 50).length, 32);
  assertEquals(res.filter((x) => x.saved === 52).length, 31);
  assertEquals(res.filter((x) => x.saved === 54).length, 29);
  assertEquals(res.filter((x) => x.saved === 56).length, 39);
  assertEquals(res.filter((x) => x.saved === 58).length, 25);
  assertEquals(res.filter((x) => x.saved === 60).length, 23);
  assertEquals(res.filter((x) => x.saved === 62).length, 20);
  assertEquals(res.filter((x) => x.saved === 64).length, 19);
  assertEquals(res.filter((x) => x.saved === 66).length, 12);
  assertEquals(res.filter((x) => x.saved === 68).length, 14);
  assertEquals(res.filter((x) => x.saved === 70).length, 12);
  assertEquals(res.filter((x) => x.saved === 72).length, 22);
  assertEquals(res.filter((x) => x.saved === 74).length, 4);
  assertEquals(res.filter((x) => x.saved === 76).length, 3);
});

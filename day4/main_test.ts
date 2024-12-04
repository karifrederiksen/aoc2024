import { assertEquals } from "@std/assert";
import { solvePart1, solvePart2 } from "./main.ts";

Deno.test(function part1_example() {
  const exampleInput1 = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
  assertEquals(solvePart1(exampleInput1), 18);
});

Deno.test(function part2_example() {
  const exampleInput2 = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
  assertEquals(solvePart2(exampleInput2), 9);
});

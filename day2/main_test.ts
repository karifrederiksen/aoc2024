import { assertEquals } from "@std/assert";
import { solvePart1, solvePart2 } from "./main.ts";

Deno.test(function part1_example() {
  const exampleInput1 = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
  assertEquals(solvePart1(exampleInput1), 2);
});

Deno.test(function part2_example() {
  const exampleInput2 = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
  assertEquals(solvePart2(exampleInput2), 4);
});

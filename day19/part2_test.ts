import { assertEquals } from "@std/assert";
import { solvePart2 } from "./part2.ts";

Deno.test(function part2_example() {
  const exampleInput = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;
  assertEquals(solvePart2(exampleInput), 16);
});

import { assertEquals } from "@std/assert";
import { solvePart1 } from "./part1.ts";

Deno.test(function part1_example() {
  const exampleInput = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;
  assertEquals(solvePart1(exampleInput), 6);
});

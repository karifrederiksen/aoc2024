import { assertEquals } from "@std/assert";
import { solvePart1 } from "./part1.ts";

Deno.test(function part1_example_small() {
  const exampleInput = `AAAA
BBCD
BBCC
EEEC`;
  assertEquals(solvePart1(exampleInput), 140);
});

Deno.test(function part1_example_medium() {
  const exampleInput = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;
  assertEquals(solvePart1(exampleInput), 772);
});

Deno.test(function part1_example_large() {
  const exampleInput = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;
  assertEquals(solvePart1(exampleInput), 1930);
});

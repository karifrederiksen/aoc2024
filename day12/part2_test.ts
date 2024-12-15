import { assertEquals } from "@std/assert";
import { solvePart2 } from "./part2.ts";

Deno.test(function part2_example_small() {
  const exampleInput = `AAAA
BBCD
BBCC
EEEC`;
  assertEquals(solvePart2(exampleInput), 80);
});

Deno.test(function part2_example_medium() {
  const exampleInput = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`;
  assertEquals(solvePart2(exampleInput), 436);
});

Deno.test(function part2_example_E() {
  const exampleInput = `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`;
  assertEquals(solvePart2(exampleInput), 236);
});

Deno.test(function part2_example_abba() {
  const exampleInput = `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`;
  assertEquals(solvePart2(exampleInput), 368);
});

Deno.test(function part2_example_large() {
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
  assertEquals(solvePart2(exampleInput), 1206);
});

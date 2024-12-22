import { assert, assertEquals } from "@std/assert";
import { patternPrices, prices, solvePart2 } from "./part2.ts";

Deno.test(function part2_prices() {
  const seq = prices(123n);
  assertEquals(seq.slice(0, 10).join(""), "3065446442");
});

Deno.test(function part2_patternPrices() {
  const xs = patternPrices(prices(123n));
  assertEquals(xs[0], ["-3,6,-1,-1", 4]);
  assertEquals(xs[1], ["6,-1,-1,0", 4]);
  assertEquals(xs[2], ["-1,-1,0,2", 6]);
  assertEquals(xs[3], ["-1,0,2,-2", 4]);
  assertEquals(xs[4], ["0,2,-2,0", 4]);
  assertEquals(xs[5], ["2,-2,0,-2", 2]);
});

Deno.test(function part2_patternPrices_positive_example() {
  assert(
    patternPrices(prices(1n)).some(([p, n]) => p === "-2,1,-1,3" && n === 7),
  );
  assert(
    patternPrices(prices(2n)).some(([p, n]) => p === "-2,1,-1,3" && n === 7),
  );
  assert(
    patternPrices(prices(2024n)).some(([p, n]) => p === "-2,1,-1,3" && n === 9),
  );
});

Deno.test(function part2_patternPrices_negative_example() {
  assert(patternPrices(prices(3n)).every(([p]) => p !== "-2,1,-1,3"));
});

Deno.test(function part2_example() {
  const exampleInput = `1
2
3
2024`;
  assertEquals(solvePart2(exampleInput), 23);
});

import { assertEquals } from "@std/assert";
import { rng, solvePart1 } from "./part1.ts";

Deno.test(function part1_rng() {
  assertEquals(rng(123n), 15887950n);
  assertEquals(rng(15887950n), 16495136n);
  assertEquals(rng(16495136n), 527345n);
  assertEquals(rng(527345n), 704524n);
  assertEquals(rng(704524n), 1553684n);
  assertEquals(rng(1553684n), 12683156n);
  assertEquals(rng(12683156n), 11100544n);
  assertEquals(rng(11100544n), 12249484n);
  assertEquals(rng(12249484n), 7753432n);
  assertEquals(rng(7753432n), 5908254n);
});

Deno.test(function part1_example() {
  const exampleInput = `1
10
100
2024`;
  assertEquals(solvePart1(exampleInput), 37327623n);
});

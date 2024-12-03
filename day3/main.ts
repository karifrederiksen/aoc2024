async function main() {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
  console.log(`part2 = `, solvePart2(fileText));
}

export function solvePart1(text: string): number {
  let n = 0;
  let s = text;
  while (true) {
    if (s.length === 0) break;

    const res = /^mul\(([0-9]+),([0-9]+)\)([\s\S]*)$/gm.exec(s);
    if (res === null) {
      s = s.substring(1);
      continue;
    }
    const [_, l, r, rest] = res;
    n += Number(l) * Number(r);
    s = rest;
  }
  return n;
}

export function solvePart2(text: string): number {
  let n = 0;
  let s = text;
  let enabled = true;
  while (true) {
    if (s.length === 0) break;
    let res = /^do\(\)([\s\S]*)$/gm.exec(s);
    if (res !== null) {
      enabled = true;
      s = res[1];
      continue;
    }
    res = /^don't\(\)([\s\S]*)$/gm.exec(s);
    if (res !== null) {
      enabled = false;
      s = res[1];
      continue;
    }

    res = /^mul\(([0-9]+),([0-9]+)\)([\s\S]*)$/gm.exec(s);
    if (res === null) {
      s = s.substring(1);
      continue;
    }
    const [_, l, r, rest] = res;
    if (enabled) {
      n += Number(l) * Number(r);
    }
    s = rest;
  }
  return n;
}

if (import.meta.main) {
  await main();
}

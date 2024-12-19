export function solvePart1(text: string): number {
  const [typesText, patternsText] = text.split("\n\n");
  const types = typesText.split(", ");
  const patterns = patternsText.split("\n");
  const matcher = MatchTree.create(types);

  return patterns.filter((p) => {
    return matcher.hasMatch(p);
  }).length;
}

class MatchTree {
  static create(types: readonly string[]): MatchTree {
    const root: MatchTree = new MatchTree("");
    for (const type of types) {
      MatchTree.createSubMatcher(type, root, 0);
    }
    return root;
  }

  private static createSubMatcher(type: string, tree: MatchTree, idx: number) {
    if (idx === type.length) {
      tree.isLeaf = true;
      return;
    }
    const ch = type[idx];
    let subTree = tree.nodes.find((x) => x.ch === ch);
    if (!subTree) {
      subTree = new MatchTree(ch);
      tree.nodes.push(subTree);
    }
    MatchTree.createSubMatcher(type, subTree, idx + 1);
  }

  isLeaf: boolean = false;
  readonly nodes: MatchTree[] = [];
  constructor(readonly ch: string) {}

  toStrings(): string[] {
    if (this.isLeaf && this.nodes.length === 0) {
      return [this.ch];
    }
    return (this.isLeaf ? [this.ch] : []).concat(
      this.nodes.flatMap((x) => x.toStrings().map((y) => this.ch + y)),
    );
  }

  hasMatch(pattern: string): boolean {
    return this.nodes.some((x) => x.subHasMatch(this, pattern, 0));
  }

  private subHasMatch(root: MatchTree, pattern: string, idx: number): boolean {
    if (idx >= pattern.length) {
      return true;
    }
    if (this.ch !== pattern[idx]) {
      return false;
    }
    if (
      this.isLeaf &&
      root.nodes.some((x) => x.subHasMatch(root, pattern, idx + 1))
    ) {
      return true;
    }
    return this.nodes.some((x) => x.subHasMatch(root, pattern, idx + 1));
  }
}

if (import.meta.main) {
  const fileBuffer = await Deno.readFile("./inputs");
  const fileText = new TextDecoder().decode(fileBuffer);
  console.log(`part1 = `, solvePart1(fileText));
}

// Seventeen Syllables of Debugging — make.fun entry.
//
// The program writes one haiku about debugging to /output/entry.txt:
// three lines in the 5-7-5 syllable shape, 78 characters, plain text.
// The haiku was chosen from 11 verified candidates (see the build
// notes in the session transcript): rubber-duck debugging is a concrete,
// real debugging practice, and the last line turns the poem — three
// hours of swearing collapse into a bug sitting on line two.
//
// Before writing, the program checks its own frozen text: exactly three
// lines, 5-7-5 syllables by a phonetic word map counted by hand, and
// 1-200 characters, so a drifted edit fails loudly instead of shipping
// a malformed haiku.
import { mkdirSync, writeFileSync } from "node:fs";

// Syllables per word, counted phonetically by hand.
const SYLLABLES: Record<string, number> = {
  rubber: 2, duck: 1, stares: 1, back: 1,
  through: 1, three: 1, hours: 1, of: 1, my: 1, swearing: 2,
  i: 1, see: 1, it: 1, line: 1, two: 1,
};

const HAIKU = [
  "Rubber duck stares back",
  "through three hours of my swearing",
  "I see it — line two",
].join("\n");

function syllablesOf(line: string): number {
  return line
    .toLowerCase()
    .replace(/[^a-z0-9 '-]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const n = SYLLABLES[w.replace(/[.,:;!?]$/, "")];
      if (n === undefined) throw new Error(`no syllable count for word: ${w}`);
      return n;
    })
    .reduce((a, b) => a + b, 0);
}

const lines = HAIKU.split("\n");
if (lines.length !== 3) throw new Error(`expected 3 lines, got ${lines.length}`);
const counts = lines.map(syllablesOf);
const expected = [5, 7, 5];
if (counts.join("-") !== expected.join("-")) {
  throw new Error(`syllable shape ${counts.join("-")} is not 5-7-5`);
}
if (HAIKU.length < 1 || HAIKU.length > 200) {
  throw new Error(`length ${HAIKU.length} outside 1-200 characters`);
}
if (HAIKU.trim().length === 0) throw new Error("haiku is only whitespace");

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", HAIKU, "utf8");

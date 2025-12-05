// find available ingredients

import { readFileSync } from "fs";

type FileInput = [number[], number[]];

// given input in a file, split into ranges, get actual numbers, and flatten
function parseFile(path: string): FileInput {
  // expect input of 1-5,30-60,444-888
  const fileContent: string = readFileSync(path, "utf-8");
  const sections = fileContent
    .split("\n\n")
    .map((section) => section.split("\n"));
  const ranges = sections[0].flatMap((line) =>
    line.split("-").map((num) => parseInt(num)),
  );
  const ingredients = sections[1].map((id) => parseInt(id));

  return [ranges, ingredients];
}

function addNewRange(ranges: number[], newRange: number[]): number[] {
  return ranges;
}

function getTotal(
  ranges: number[],
  ingredients: number[],
  isPart2 = false,
): number {
  return 0;
}

function main() {
  type TestData = [
    path: string,
    isPart2: boolean,
    expected: number | undefined,
  ];

  const tests: TestData[] = [
    ["example.txt", false, 3],
    // ["input.txt", false, 1480],
    // ["example.txt", true, 43],
    // ["input.txt", true, 8899],
  ];

  for (const [path, isPart2, expected] of tests) {
    const content = parseFile(path);
    const result = getTotal(content[0], content[1], isPart2);
    if (expected != undefined) {
      if (result != expected) {
        console.log(`error: ${result} != ${expected}`);
        return;
      }
    }
    console.log(result);
  }
}

main();

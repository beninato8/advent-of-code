// do math problems

import { readFileSync } from "fs";

type FileOutput = [number[][], string[]];

// given input in a file, get rows and cols
function parseFile(path: string): FileOutput {
  // expect input of rows of spaces numbers with last row with spaced operations
  const fileContent: string = readFileSync(path, "utf-8");
  const sections = fileContent.split("\n");
  console.log(sections);

  const operations = sections[sections.length - 1].trim().split(/\s+/);

  const values = sections.slice(0, -1).map((line) =>
    line
      .trim()
      .split(/\s+/)
      .map((num) => parseInt(num)),
  );

  return [values, operations];
}

function parseFilePart2(path: string): FileOutput {
  const fileContent: string = readFileSync(path, "utf-8");
  const sections = fileContent.split("\n");
  console.log(sections);

  const operations = sections[sections.length - 1].trim().split(/\s+/);

  const values = sections.slice(0, -1);
  const results: number[][] = [];
  let tempArr: string[] = Array(values.length).map((value) => "");
  let idx = 0;
  for (let j = values[0].length - 1; j >= 0; j--, idx++) {
    let spaceCount = 0;
    for (let i = 0; i < values.length; i++) {
      let val = values[i][j];
      if (val == " ") {
        spaceCount++;
      } else {
        tempArr[idx] = tempArr[idx] ? tempArr[idx] + val : val;
      }
      // console.log(val, j, i, spaceCount, idx);
    }

    if (spaceCount == values.length || j == 0) {
      results.push(tempArr.map((value) => parseInt(value)));
      tempArr = Array(values.length).map((value) => "");
      idx = -1;
      // console.log("reset");
    }
  }

  return [results, operations.reverse()];
}

// if part 1, we want count of fresh ingredients
// if part 2, we want all possible fresh ingredients in range
function getTotal(
  values: number[][],
  operations: string[],
  isPart2 = false,
): number {
  console.log(operations);
  console.log(values);
  let total = 0;
  const multiply = (a: number, b: number): number => a * b;
  const add = (a: number, b: number): number => a + b;

  if (!isPart2) {
    for (let j = 0; j < values[0].length; j++) {
      const operation = operations[j] == "+" ? add : multiply;
      let result = operations[j] == "+" ? 0 : 1;
      for (let i = 0; i < values.length; i++) {
        result = operation(result, values[i][j]);
      }
      console.log("result", result);
      total += result;
    }
  } else {
    for (let i = 0; i < values.length; i++) {
      const operation = operations[i] == "+" ? add : multiply;
      let result = operations[i] == "+" ? 0 : 1;
      for (let j = 0; j < values[0].length; j++) {
        console.log(
          "operating with",
          operations[i],
          "on",
          result,
          "and",
          values[i][j],
        );
        if (values[i][j] == undefined) {
          continue;
        }
        result = operation(result, values[i][j]);
      }
      console.log("result", result);
      total += result;
    }
  }

  return total;
}

function main() {
  type TestData = [
    path: string,
    isPart2: boolean,
    expected: number | undefined,
  ];

  const tests: TestData[] = [
    // ["example.txt", false, 4277556],
    // ["input.txt", false, 4405895212738],
    // ["example.txt", true, 3263827],
    ["input.txt", true, undefined],
  ];

  for (const [path, isPart2, expected] of tests) {
    const content = isPart2 ? parseFilePart2(path) : parseFile(path);
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

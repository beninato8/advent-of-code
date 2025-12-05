// find rolls in grid

import { readFileSync } from "fs";

// given input in a file, split into rows (1 if paper, 0 if empty)
function parseFile(path: string): number[][] {
  const fileContent: string = readFileSync(path, "utf-8");
  const values = fileContent.split("\n").map((bank) => {
    return bank
      .replaceAll(".", "0")
      .replaceAll("@", "1")
      .split("")
      .map((value) => parseInt(value));
  });
  return values;
}

function removeUsed(grid: number[][], indices: number[][]): number[][] {
  for (const [i, j] of indices) {
    grid[i][j] = 0;
  }
  return grid;
}

function getTotal(grid: number[][], isPart2 = false): number {
  const nRows = grid.length;
  const nCols = grid[0].length;
  let adjacent = Array.from({ length: nRows }, (_, i) =>
    Array.from({ length: nCols }, (_, i) => 0),
  );

  // first loop to populate adjacent
  for (let i = 0; i < nRows; i++) {
    for (let j = 0; j < nCols; j++) {
      const value = grid[i][j];
      // skip if it isn't paper
      if (value == 0) {
        continue;
      }
      for (const [rowOffset, colOffset] of [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 0],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ]) {
        let row = i + rowOffset;
        let col = j + colOffset;
        if (
          row >= 0 &&
          row < nRows &&
          col >= 0 &&
          col < nRows &&
          grid[row][col] > 0
        ) {
          adjacent[row][col] += value;
        }
      }
    }
  }

  let adjacentIdx = [];
  for (let i = 0; i < nRows; i++) {
    for (let j = 0; j < nCols; j++) {
      let value = adjacent[i][j];
      if (value <= 4 && value > 0) {
        adjacentIdx.push([i, j]);
      }
    }
  }

  if (adjacentIdx.length == 0 || !isPart2) {
    return adjacentIdx.length;
  }

  return adjacentIdx.length + getTotal(removeUsed(grid, adjacentIdx), isPart2);
}

function main() {
  type TestData = [
    path: string,
    isPart2: boolean,
    expected: number | undefined,
  ];

  const tests: TestData[] = [
    ["example.txt", false, 13],
    ["input.txt", false, 1480],
    ["example.txt", true, 43],
    ["input.txt", true, 8899],
  ];

  for (const [path, isPart2, expected] of tests) {
    const content = parseFile(path);
    const result = getTotal(content, isPart2);
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

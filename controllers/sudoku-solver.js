class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    } else if (!/[1-9.]{81}/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    } else {
      return true;
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let j = 0; j < 9; ++j) {
      if (j !== column && puzzleString[row * 9 + j] === value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; ++i) {
      if (i !== row && puzzleString[i * 9 + column] === value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let regRowStart = ~~(row / 3); // result from ~~ is equivalent to Math.floor for positive numbers
    let regColStart = ~~(column / 3);

    for (let i = regRowStart * 3; i < (regRowStart + 1) * 3; ++i) {
      for (let j = regColStart * 3; j < (regColStart + 1) * 3; ++j) {
        if ((i !== row || j !== column) && puzzleString[i * 9 + j] === value) {
          return false;
        }
      }
    }

    return true;
  }

  solve(puzzleString) {
    let puzzle = [], row;

    for (let i = 0; i < 9; ++i) {
      row = [];
      for (let j = 0; j < 9; ++j) {
        row.push(puzzleString[i * 9 + j]);
      }
      puzzle.push(row);
    }

    let rows = [[],[],[],[],[],[],[],[],[]];
    let cols = [[],[],[],[],[],[],[],[],[]];
    let regions = [[[], [], []], [[], [], []], [[], [], []]];
    let regRow, regCol;

    for (let i = 0; i < 9; ++i) {
      for (let j = 0; j < 9; ++j) {
        if (puzzle[i][j] !== '.') {
          regRow = ~~(i / 3);
          regCol = ~~(j / 3);

          if (rows[i].includes(puzzle[i][j])
          || cols[j].includes(puzzle[i][j])
          || regions[regRow][regCol].includes(puzzle[i][j])) {
            return { error: "Puzzle cannot be solved" };
          }
          
          rows[i].push(puzzle[i][j]);
          cols[j].push(puzzle[i][j]);
          regions[regRow][regCol].push(puzzle[i][j]);
        }
      }
    }

    if (this.dfs(puzzle, 0, rows, cols, regions)) {
      return { solution: puzzle.flat().join('') };
    }

    return { error: 'Puzzle cannot be solved' };
  }

  dfs(puzzle, idx, rows, cols, regions) { // depth first search algorithm
    if (idx === 81) return true;

    let row = ~~(idx / 9);
    let col = idx % 9;
    let regRow = ~~(row / 3);
    let regCol = ~~(col / 3);

    if (puzzle[row][col] !== '.') {
      return this.dfs(puzzle, idx + 1, rows, cols, regions);
    }

    for (let i = 1, cell, indexOf; i <= 9; ++i) {
      cell = '' + i;

      if (rows[row].includes(cell)) continue;
      if (cols[col].includes(cell)) continue;
      if (regions[regRow][regCol].includes(cell)) continue;

      rows[row].push(cell);
      cols[col].push(cell);
      regions[regRow][regCol].push(cell);
      puzzle[row][col] = cell;

      if (this.dfs(puzzle, idx + 1, rows, cols, regions)) return true;

      puzzle[row][col] = '.';

      indexOf = rows[row].indexOf(cell);
      rows[row].splice(indexOf, 1);

      indexOf = cols[col].indexOf(cell);
      cols[col].splice(indexOf, 1);

      indexOf = regions[regRow][regCol].indexOf(cell);
      regions[regRow][regCol].splice(indexOf, 1);
    }

    return false;
  }

}

module.exports = SudokuSolver;


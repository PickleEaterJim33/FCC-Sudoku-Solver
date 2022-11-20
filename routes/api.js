'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;

      if (typeof puzzle === "undefined" || typeof coordinate === "undefined"
      || typeof value === "undefined" || puzzle === null
      || coordinate === null || value === null
      || puzzle === "" || coordinate === "" || value === "") {
        return res.send({ error: "Required field(s) missing" });
      }

      const validity = solver.validate(puzzle);
      if (validity !== true) return res.send(validity);

      if (!/^[1-9]$/.test(value)) {
        return res.send({ error: "Invalid value" });
      }

      coordinate = coordinate.toLowerCase();
      if (!/^[a-i][1-9]$/.test(coordinate)) {
        return res.send({ error: "Invalid coordinate" });
      }

      let row = coordinate[0].charCodeAt() - 'a'.charCodeAt();
      let col = +coordinate[1] - 1;

      let checkRow = solver.checkRowPlacement(puzzle, row, col, value);
      let checkCol = solver.checkColPlacement(puzzle, row, col, value);
      let checkRegion = solver.checkRegionPlacement(puzzle, row, col, value);

      if (checkRow && checkCol && checkRegion) {
        return res.send({ valid: true });
      }

      let conflict = [];
      if (!checkRow) conflict.push("row");
      if (!checkCol) conflict.push("column");
      if (!checkRegion) conflict.push("region");

      res.send({ valid: false, conflict: conflict });
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (typeof req.body.puzzle === "undefined" || req.body.puzzle === null
      || req.body.puzzle === "") {
        return res.send({ error: "Required field missing" });
      }

      const validity = solver.validate(req.body.puzzle);
      res.send(validity === true ? solver.solve(req.body.puzzle) : validity);
    });
};

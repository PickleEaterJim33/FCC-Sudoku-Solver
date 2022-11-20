const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

let solver = new Solver();

suite('Unit Tests', () => {
    suite("String validation tests", () => {
        test("Logic handles a valid puzzle string of 81 characters", () => {
            assert.equal(solver.validate(puzzlesAndSolutions[0][0]), true);
            assert.equal(solver.validate(puzzlesAndSolutions[1][0]), true);
        });
        test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
            let test1 = solver.validate(puzzlesAndSolutions[0][0].replace(/./g, ","));
            let test2 = solver.validate(puzzlesAndSolutions[1][0].replace(/[1-9]/g, "0"));
            assert.equal(test1.error, "Invalid characters in puzzle");
            assert.equal(test2.error, "Invalid characters in puzzle");
        });
        test("Logic handles a puzzle string that is not 81 characters in length", () => {
            let test1 = solver.validate("123456789...");
            let test2 = solver.validate(",0,0,0,0,0,0");
            assert.equal(test1.error, "Expected puzzle to be 81 characters long");
            assert.equal(test2.error, "Expected puzzle to be 81 characters long");
        });
    });
    suite("Grid placement tests", () => {
        test("Logic handles a valid row placement", () => {
            assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 8, 8, "5"), true);
            assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[1][0], 5, 5, "1"), true);
        });
        test("Logic handles an invalid row placement", () => {
            assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 8, 8, "1"), false);
            assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[1][0], 5, 5, "4"), false);
        });
        test("Logic handles a valid column placement", () => {
            assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 8, 8, "2"), true);
            assert.equal(solver.checkColPlacement(puzzlesAndSolutions[1][0], 5, 5, "4"), true);
        });
        test("Logic handles an invalid column placement", () => {
            assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 8, 8, "9"), false);
            assert.equal(solver.checkColPlacement(puzzlesAndSolutions[1][0], 5, 5, "3"), false);
        });
        test("Logic handles a valid region (3x3 grid) placement", () => {
            assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 8, 8, "4"), true);
            assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[1][0], 5, 5, "3"), true);
        });
        test("Logic handles an invalid region (3x3 grid) placement", () => {
            assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 8, 8, "3"), false);
            assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[1][0], 5, 5, "5"), false);
        });
    });
    suite("(Sudoku)Solver.solve tests", () => {
        test("Valid puzzle strings pass the solver", () => {
            assert.property(solver.solve(puzzlesAndSolutions[0][0]), "solution");
            assert.property(solver.solve(puzzlesAndSolutions[1][0]), "solution");
        });
        test("Invalid puzzle strings fail the solver", () => {
            assert.equal(solver.solve(
                "999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            ).error, "Puzzle cannot be solved");
            assert.equal(solver.solve(
                "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..666"
            ).error, "Puzzle cannot be solved");
        });
        test("Solver returns the expected solution for an incomplete puzzle", () => {
            assert.equal(solver.solve(puzzlesAndSolutions[0][0]).solution, puzzlesAndSolutions[0][1]);
            assert.equal(solver.solve(puzzlesAndSolutions[1][0]).solution, puzzlesAndSolutions[1][1]);
            assert.equal(solver.solve(puzzlesAndSolutions[2][0]).solution, puzzlesAndSolutions[2][1]);
            assert.equal(solver.solve(puzzlesAndSolutions[3][0]).solution, puzzlesAndSolutions[3][1]);
            assert.equal(solver.solve(puzzlesAndSolutions[4][0]).solution, puzzlesAndSolutions[4][1]);
        });
    });
});

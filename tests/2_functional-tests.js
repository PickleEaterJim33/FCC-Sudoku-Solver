const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite("Test POST requests to /api/solve", () => {
        test("Solve a puzzle with valid puzzle string", done => {
            chai
            .request(server)
            .post("/api/solve")
            .send({
                puzzle: puzzlesAndSolutions[0][0]
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
                done();
            });
        });
        test("Solve a puzzle with missing puzzle string", done => {
            chai
            .request(server)
            .post("/api/solve")
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Required field missing");
                done();
            });
        });
        test("Solve a puzzle with invalid characters", done => {
            chai
            .request(server)
            .post("/api/solve")
            .send({
                puzzle: ",,009.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            });
        });
        test("Solve a puzzle with incorrect length", done => {
            chai
            .request(server)
            .post("/api/solve")
            .send({
                puzzle: "123..."
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            });
        });
        test("Solve a puzzle that cannot be solved", done => {
            chai
            .request(server)
            .post("/api/solve")
            .send({
                puzzle: "88839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Puzzle cannot be solved");
                done();
            });
        });
    });
    suite("Test POST requests to /api/check", () => {
        test("Check a puzzle placement with all fields", done => {
            chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: "A2",
                value: "3"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.valid, true);
                done();
            });
        });
        test("Check a puzzle placement with single placement conflict", done => {
            chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: "A2",
                value: "4"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 1);
                done();
            });
        });
        test("Check a puzzle placement with multiple placement conflicts", done => {
            chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: "A2",
                value: "1"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 2);
                done();
            });
        });
        test("Check a puzzle placement with all placement conflicts", done => {
            chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: "a2",
                value: "2"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 3);
                assert.include(res.body.conflict, "row");
                assert.include(res.body.conflict, "column");
                assert.include(res.body.conflict, "region");
                done();
            });
        });
        test("Check a puzzle placement with missing required fields", done => {
            chai
            .request(server)
            .post("/api/check")
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Required field(s) missing");
                done();
            });
        });
        test("Check a puzzle placement with invalid characters", done => {
            chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: "00,,4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
                coordinate: "A2",
                value: "1"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done();
            });
        });
        test("Check a puzzle placement with incorrect length", done => {
            chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: "123...",
                coordinate: "A3",
                value: "2"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            });
        });
        test("Check a puzzle placement with invalid placement coordinate", done => {
            chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: "Z0",
                value: "1"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Invalid coordinate");
                done();
            });
        });
        test("Check a puzzle placement with invalid placement value", done => {
            chai
            .request(server)
            .post("/api/check")
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: "a2",
                value: "0"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body.error, "Invalid value");
                done();
            });
        });
    });
});


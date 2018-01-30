var assert = require('assert');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var profiler = require('../lib/profiler');
var injector = require('../lib/injector');
var fs = require("fs");
var path = require("path");

describe("fixture tests", function() {
    const fixturesDir = path.join(__dirname, "fixtures");
    const TEST_INTERVAL = 1;
    const profileBody = profiler(TEST_INTERVAL);
    const profileCode = escodegen.generate({
        type: "Program",
        body: profileBody
    });
    const dummyFileName = "example.js";
    fs.readdirSync(fixturesDir).map(caseName => {
        it(`should inject profiler for ${caseName.replace(/-/g, " ")}`, () => {
            const fixtureDir = path.join(fixturesDir, caseName);
            const actualPath = path.join(fixtureDir, "input.js");
            const actual = injector.inject(dummyFileName, fs.readFileSync(actualPath, "utf-8"), TEST_INTERVAL);
            const outputPath = path.join(fixtureDir, "output.js");
            const expected = fs.readFileSync(outputPath, "utf-8");
            if (process.env.UPDATE === "1") {
                fs.writeFileSync(outputPath, actual.trim(), "utf-8");
            } else {
                const profileWithExpected = expected;
                assert.deepStrictEqual(actual.trim(), profileWithExpected.trim(), actual);
            }
        });
    });
});

const fs = require('fs');
const path = require('path');
const esprima = require('esprima');

const RUN_TIME = fs.readFileSync(path.join(__dirname, "./runtime.js"), "utf-8");
function profiler(interval){
    const code = RUN_TIME.replace("INTERVAL", interval);
    return esprima.parse(code).body;
}

module.exports = profiler;

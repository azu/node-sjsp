(window || self).sjsp__result = (window || self).sjsp__result || {};
(window || self).sjsp__state = (window || self).sjsp__state || {
    time: 0,
    line: 0,
    col: 0,
    name: ''
};
(window || self).sjsp__start = (window || self).sjsp__start || function (fname, line, col, name, linestr) {
    return {
        start: Date.now(),
        line: line,
        col: col,
        name: name,
        fname: fname,
        linestr: linestr
    };
};
(window || self).sjsp__end = (window || self).sjsp__end || function (x) {
    if (!x.start)
        return;
    var key = x.fname + ' :: ' + x.line + ' :: ' + x.col;
    sjsp__result[key] = sjsp__result[key] || {
        count: 0,
        time: 0,
        line: x.line,
        col: x.col,
        name: x.name,
        fname: x.fname,
        linestr: x.linestr
    };
    sjsp__result[key].time += Date.now() - x.start;
    sjsp__result[key].count += 1;
};
if (!(window || self).hasOwnProperty('sjsp__interval'))
    (window || self).sjsp__interval = setInterval(function () {
        var sjsp__print = function (x, n) {
            if (!x) {
                return '';
            }
            return Array(Math.max(0, n - x.toString().length + 1)).join(' ') + x;
        };
        var sjsp__format = function (x) {
            if (!x) {
                return '';
            }
            return 'time: ' + sjsp__print((x.time / 1000).toFixed(2), 7) + 'sec   count: ' + sjsp__print(x.count, 7) + ' ' + sjsp__print(x.fname, 15) + '  ' + sjsp__print(x.name, 13) + '  ' + ' (line:' + sjsp__print(x.line, 4) + ', col:' + sjsp__print(x.col, 3) + ')   ' + x.linestr;
        };
        var sjsp__result = Object.keys(sjsp__result).map(function (key) {
            return sjsp__result[key];
        }).sort(function (x, y) {
            return y.time - x.time;
        }).slice(0, 30).map(function (x) {
            var filePath = x.fname + ':' + x.line + ':' + x.col;
            return {
                time: x.time,
                count: x.count,
                name: x.name,
                line: x.linestr,
                filePath: filePath
            };
        });
        console.table(sjsp__result);
    }, 1 * 1000);
function fn() {
    var sjsp__state = typeof sjsp__start === 'function' && sjsp__start('example.js', 1, 15, 'fn', 'function fn() {');
    if (true) {
        return function (arguments) {
            var sjsp__return = 1;
            typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
            return sjsp__return;
        }.call(this, arguments);
    }
    typeof sjsp__end === 'function' && sjsp__end(sjsp__state);
}
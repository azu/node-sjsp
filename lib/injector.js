var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');
var profiler = require('./profiler');
const generate = require("@babel/generator").default;
const template = require("@babel/template").default;
const t = require("@babel/types");

/**
 * inject profile
 * @param fileName {String} target file name
 * @param source {String} target source code
 * @param interval {Number} interval(seconds) to output a profile
 * @return {String} profile-injected source code
 */
function inject(fileName, source, interval) {
    var srcLines = source.split(/\r?\n/);
    var ast = esprima.parse(source, { loc: true });
    var lineLimit = 100;

    estraverse.traverse(ast, {
        enter: function(node, parent) {
            /*
             rewrite function
                 function foo(){ body } -> function() { start('foo'); body; end; }
                 function(){ body } -> function() { start('anonymous'); body; end; }
            */
            if (node.type === "FunctionDeclaration" ||
                node.type === "FunctionExpression") {

                var funcName = node.id === null ? 'anonymous' : node.id.name;
                var funcPos = node.body.loc.start;
                var funcBody = node.body.body;

                // prepend
                funcBody.unshift(
                    start(fileName, funcPos.line, funcPos.column + 1,
                        funcName, srcLines[funcPos.line - 1].substr(0, lineLimit))
                );

                // append
                funcBody.push(
                    end()
                );
            }
        },

        leave: function(node, parent) {
            /*
             rewrite return
                 return expr; -> return (function(arguments) { start(); var value = expr; end(); return value; }).call(this, arguments);
            */
            if (node.type === 'ReturnStatement') {
                wrapReturn(node);
            }

            /*
             rewrite var func
                var test = function() { body; }; -> function() { start("test"); body; end(); };
            */
            if (node.type === "VariableDeclarator") {
                if (node.init && node.init.type === "FunctionExpression") {
                    rewriteFuncName(node.init, node.id.name);
                }
            }

            /*
             rewrite assign func
                a.test = function() { body; }; -> function() { start("a.test"); body; end(); };
            */
            if (node.type === "AssignmentExpression") {
                if (node.right.type === "FunctionExpression") {
                    rewriteFuncName(node.right, getStaticName(node.left));
                }
            }
        }
    });

    ast.body = profiler(interval).concat(ast.body);

    return escodegen.generate(ast);
}

function start(fname, line, col, name, linestr) {
    const buildRequire = template(`var sjsp__state = typeof sjsp__start === 'function' && sjsp__start(FILE_NAME, LINE, COL, NAME, LINE_STR)`);
    const ast = buildRequire({
        FILE_NAME: t.stringLiteral(fname),
        LINE: t.numericLiteral(line),
        COL: t.numericLiteral(col),
        NAME: t.stringLiteral(name),
        LINE_STR: t.stringLiteral(linestr)
    });
    // TODO: use babel directory
    return parseStatement(generate(ast).code);
}

function end() {
    const buildRequire = template(`typeof sjsp__end === "function" && sjsp__end(sjsp__state)`);
    const ast = buildRequire();
    // TODO: use babel directory
    return parseStatement(generate(ast).code);
}

function wrapReturn(returnStmt) {
    var wrapperFunc = parseStatement(
        "(function(arguments){" +
        "   var sjsp__return = __here__;" +
        "   typeof sjsp__end === 'function' && sjsp__end(sjsp__state);" +
        "   return sjsp__return;" +
        "}).call(this, arguments);"
    );

    // rewrite __here__
    wrapperFunc.expression.callee.object.body.body[0].declarations[0].init = returnStmt.argument;

    // assign express to argument.
    returnStmt.argument = wrapperFunc.expression;
}

function rewriteFuncName(funcAst, funcName) {
    var startArguments = funcAst.body.body[0].declarations[0].init.right.arguments;
    // argument[3]: function's name
    startArguments[3].value = funcName;
}

function getStaticName(expr) {
    if (expr.type === "MemberExpression") {
        return getStaticName(expr.object) + '.' + expr.property.name;
    } else if (expr.type === "Identifier") {
        return expr.name;
    } else if (expr.type === "ThisExpression") {
        return "this"
    } else {
        throw "Invalid member expression";
    }
}

function parseStatement(code) {
    return esprima.parse(code).body[0];
}

function makeLiteral(literal) {
    return {
        type: 'Literal',
        value: literal
    };
}

exports.inject = inject;

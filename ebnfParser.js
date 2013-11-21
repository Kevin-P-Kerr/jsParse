#!/usr/local/bin/node
/** ebnfParser: a recursive descent parser for ebnf grammars **/

// get exec to call the scanner
var exec = require('child_process').exec;

var inputFile = process.argv[2];

if (!inputFile) { 
	throw new Error('ebnfParser: ./ebnfParser [FILE]');
}

var parse = function (scannedInput) {
	var outputParser = '';	
	var sym;
	var peek;
	var nextSym = (function () {
		var i = 0;
		return function () {
			if (i >= scannedInput.length) {
				peek = false;
				return false;
			}
			peek = scannedInput[i++];
			return true;
		};
	})();
	
	var killWhite = function () {
		while (peek.BLANK) {
			nextSym();
		}
	};

	var getSym = function () { // push the look ahead cursor up one character
		sym = peek; // undefined the first call
		nextSym();
		killWhite();
	};

	var Node = function (type, symbol) {
		this.type = type;
		this.sym = symbol;
		this.right;
		this.left;
	};
	
	var createParser = function () {
		getSym();
		getSym(); // call getSym twice to initialize the sym pointer to something other than undefined
		var ast = syntax();
		var util = require('util');
		process.stdout.write(JSON.stringify(ast));
	};


	var syntax = function () {
		var ast = new Node("SYNTAX");
		var topAst = ast;
		ast.left = new Node();
		while (production(ast.left)) {
			ast.right = new Node("SYNTAX");
			ast = ast.right;
			ast.left = new Node();
			getSym();
		}
		return topAst;
	};
	
	var production = function (ast) {
		if (!sym) {
			return false;
		}
		ast.type = "PRODUCTION";
		if (!sym.IDENT) {
			throw new Error(" PARSE: expected IDENT");
		}
		ast.left = new Node("IDENT", sym.IDENT);
		getSym();
		if (!sym.EQ) {
			console.log(sym);
			throw new Error(" PARSE: expeted EQ");
		}
		getSym();
		ast.right = new Node();
		expression(ast.right);
		getSym();
		if (!sym.DOT) {
			console.log(sym);
			console.log(peek);
			throw new Error(" Parse: expected DOT");
		}
		return true;
	};

	var expression = function (ast) {
		ast.type = "EXPRESSION";
		ast.left = new Node();
		term(ast.left);
		var repeat = function () {
			if (peek.DISJ) {
				getSym();
				getSym();
				ast.right = new Node("OPTION");
				ast = ast.right;
				ast.left = new Node();
				term(ast.left);
				repeat();
			}
		};
		repeat();
	};
	
	var term = function (ast) {
		ast.type = "TERM";
		ast.left = new Node();
		factor(ast.left);
		var repeat = function () {
			if (peek.IDENT || peek.STRING || peek.LPAREN || peek.LBRAK || peek.LBRACE) {
				getSym();
				ast.right = new Node();
				ast = ast.right;
				ast.left = new Node();
				factor(ast.left);
				repeat();
			}
		};
		repeat();
	};
	
	var factor = function (ast) {
		ast.type = "FACTOR";
		if (sym.IDENT) {
			ast.val = sym.IDENT;
		}
		else if (sym.STRING) {
			ast.val = sym.STRING;
		}
		else if (sym.LPAREN) {
			getSym();
			ast.left = new Node();
			expression(ast.left);
			getSym();
			if (!sym.RPAREN) {
				throw new Error("unbalanced parens");
			}
		}
		else if (sym.LBRAK) {
			ast.val = "OPTION";
			ast.left = new Node();
			getSym();
			expression(ast.left);
			if (!sym.RBRAK) {
				throw new Error("unbalanced brackets");
			}
		}
		else if (sym.LBRACE) {
			ast.val = "REPEAT";
			ast.left = new Node();
			getSym();
			expression(ast.left);
			getSym();
			if (!sym.RBRACE) {
				console.log(sym);
				throw new Error("unbalanced braces");
			}
		}
		else {
			return false;
		}
		return true;
	};
	createParser();
};

exec("./ebnfScanner.js " + inputFile, function(error, stdout, stderr) {
	parse(JSON.parse(stdout));
});	
			
			
			
	

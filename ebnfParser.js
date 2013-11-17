#!/usr/local/bin/node
/** ebnfParser: a recursive descent parser for ebnf grammars **/

// get exec to call the scanner
var exec = require('child_process').exec;

var inputFile = process.argv[2];

if (!inputFile) { 
	throw new Error('ebnfParser: ./ebnfParser [FILE]');
}

var parse = function (scannedInput) {
	
	var sym;
	var peek;
	var ast = {};
	var currentAstRef = ast;
	var nextSym = (function () {
		var i = 0;
		return function () {
			console.log(i);
			if (i >= scannedInput.length) {
				return false;
			}
			sym = scannedInput[i++];
			peek = scannedInput[i];
			return true;
		};
	})();
	
	var killWhite = function () {
		while (sym.BLANK) {
			getSym();
		}
	};

	var getSym = function () {
		nextSym();
		killWhite();
	};

	
	var createAST = function () {
		syntax();
		process.stdout.write(JSON.stringify(ast));
	};


	var syntax = function () {
		while (production()) {
			getSym();
		}
	};
	
	var production = function () {
		if (!sym) {
			return false;
		}
		if (!sym.IDENT) {
			throw new Error(" PARSE: expected IDENT");
		}
		getSym();
		if (!sym.EQ) {
			console.log(sym);
			throw new Error(" PARSE: expeted EQ");
		}
		getSym();
		expression();
		getSym();
		if (!sym.DOT) {
			console.log(sym);
			throw new Error(" Parse: expected DOT");
		}
		return true;
	};

	var expression = function () {
		term();
		var repeat = function () {
			if (peek.DISJ) {
				getSym();
				getSym();
				term();
				repeat();
			}
		};
		repeat();
	};
	
	var term = function () {
		factor();
		var repeat = function () {
			if (peek.IDENT || peek.STRING || peek.LPAREN || peek.LBRAK || peek.LBRACE) {
				getSym();
				factor();
				repeat();
			}
		};
		repeat();
	};
	
	var factor = function () {
		if (sym.IDENT) {
		}
		else if (sym.STRING) {
		}
		else if (sym.LPAREN) {
			getSym();
			expression();
			getSym();
			if (!sym.RPAREN) {
				throw new Error("unbalanced parens");
			}
		}
		else if (sym.LBRAK) {
			getSym();
			expression();
			if (!sym.RBRAK) {
				throw new Error("unbalanced brackets");
			}
		}
		else if (sym.LBRACE) {
			getSym();
			expression();
			getSym();
			if (!sym.RBRACE) {
				console.log(ast);
				console.log(sym);
				throw new Error("unbalanced braces");
			}
		}
		else {
			return false;
		}
		return true;
	};
	createAST();
};

exec("./ebnfScanner.js " + inputFile, function(error, stdout, stderr) {
	parse(JSON.parse(stdout));
});	
			
			
			
	

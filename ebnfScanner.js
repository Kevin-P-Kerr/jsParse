#!/usr/local/bin/node
/** EBNF SCANNER--scan EBNF**/

/** THE SCANNING GRAMMAR 
	
	symbol = {blank} (identifier|string|RPAREN|LPAREN|RBRAK|LBRAK|RBRACE|LBRACE|DISJ|EQ|DOT)
	blank = /\s+/
	identifer = /\w+/
	string = /"\w?"/

**/


var fs = require('fs');

var scanFile = process.argv[2];

if (!scanFile) {
	throw new Error("ebnfScanner: ./ebnfs FILENAME");
}

var rawFile = fs.readFileSync(scanFile);
var rawString = rawFile.toString();

var scannedFile = [];

var start = 0;

var getSymbol = function () {
	// EOF
	if (start >= rawString.length) {
		return false;
	}
	var symbol = {};
	var intermediateString = rawString.slice(start);
	// is it a blank?
	if (intermediateString.match(/^\s+/)) {
		symbol.BLANK = intermediateString.match(/^\s+/)[0];
		start += symbol.BLANK.length;
	}
	// is it an identifer?
	else if (intermediateString.match(/^[^"\s=\[\]\(\)\.\{\}]+/)) {
		symbol.IDENT = intermediateString.match(/^[^"\s=\[\]\(\)\.\{\}]+/)[0];
		start += symbol.IDENT.length;
	}
	// is it a string
	else if (intermediateString.match(/^"[^"]*"/)) {
		symbol.STRING = intermediateString.match(/^"[^"]*"/)[0];
		start += symbol.STRING.length;
	}
	else if (intermediateString.match(/^\(/)) {
		symbol.LPAREN = "(";
		start++;
	}
	else if (intermediateString.match(/^\)/)) {
		symbol.RPAREN = ")";
		start++;
	}
	else if (intermediateString.match(/^\[/)) {
		symbol.LBRAK = '[';
		start++;
	}
	else if (intermediateString.match(/^\]/)) {
		symbol.RBRAK = ']';
		start++;
	}
	else if (intermediateString.match(/^\{/)) {
		symbol.LBRACE = '{';
		start++;
	}
	else if (intermediateString.match(/^\}/)) {
		symbol.RBRACE = '}';
		start++;
	}
	else if (intermediateString.match(/^\|/)) {
		symbol.DISJ = '|';
		start++;
	}
	else if (intermediateString.match(/^\=/)) {
		symbol.EQ = '=';
		start++;
	}
	else if (intermediateString.match(/^\./)) {
		symbol.DOT = '.';
		start++;
	}
	else {
		console.log(scannedFile);
		console.log(intermediateString);
		throw new Error('SCAN ERROR: UNKOWN CHARACTER TYPE ' + intermediateString[0]);
	}
	scannedFile.push(symbol);
	return true;
};

while (getSymbol()) {
}

process.stdout.write(JSON.stringify(scannedFile));

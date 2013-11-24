#!/usr/local/bin/node

var fs = require('fs');
var exec = require('child_process').exec;
var inputFile = process.argv[2];

if (!inputFile) {
	throw new Error('jsParse: ./jsParse [FILE]');
}

var makeParser = function (grammerTable) {
	var template = fs.readFileSync('parser.js');
	template.replace('%%%GRAMMARTABLE%%%', grammerTable);
	return template;
};

var jsParse = function () {
	exec("./ebnfParser.js " + inputFile, function (error, stdout, stderr) { 
		var parser = makeParser(stdout);
		process.stdout.write(parser.toString());
	});
};

jsParse();		

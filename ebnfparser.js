// get exec to call the scanner
var exec = require('child_process').exec;

var inputFile = process.argv[2];

if (!inputFile) { 
	throw new Error('ebnfParser: ./ebnfParser [FILE]');
}

var parse = function (input) {
    var getsym = function () {
        var s = input.shift();
        while (s.BLANK) {
          s = input.shift();
        }
        currentSym = s;
    };

    var check = function (t) {
      if (!currentSym[t]) {
        console.log('ERR: ' + JSON.stringify(currentSym));
        throw new Error(t);
      }
    };


    var syntax = function () {
      while (currentSym) {
        production();
      }
    };

    var production = function () {
      debug("production");
      check("IDENT");
      if (!currentSym.EQ) {
        console.log(currentSym);
        throw new Error();
      }
      expression();
      check("DOT");
    };

    var expression = function ()  {
      debug("expresion");
      term();
      while (currentSym.DISJ) {
        term();
      }
    };

    var term = function () {
      debug("term");
      factor();
      while (factorCheck()) {
        factor();
      }
    };

    var factorCheck = function () {
      var sym = currentSym;
      return sym.IDENT || sym.STRING || sym.LPAREN || sym.LBRAK || sym.LBRACE;
    };

    var factor = function () {
      debug("factor");
      var sym = currentSym;
      if (sym.IDENT) {
      }
      if (sym.STRING) {
      }
      if (sym.LPAREN) {
        expression();
        check("RPAREN");
      }
      if (sym.LBRAK) {
        expression();
        check("RBRAK");
      }
      if (sym.LBRACE) {
        expression();
        check("RBRACE");
      }
      else {
        throw new Error();
      }
    };
    var debug = function (caller) {
      console.log(caller + " : " + JSON.stringify(currentSym));
    };
    getsym();
    syntax();
};

exec("./ebnfScanner.js " + inputFile, function(error, stdout, stderr) {
	parse(JSON.parse(stdout));
});	
			
      

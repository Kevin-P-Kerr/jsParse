jsParse
=======

a parsing suite for LR(1) grammars

jsLex and jsParse are tools designed to scan and parse LL(1) context-free grammars.

jsLex
jsLex takes in a regular language specified in a modified EBNF notation, and returns a javascript program that reads in strings in the specified language, and returns a JSON object representing the parsed string.  Here follows an exmample:

The Regular Grammar (find identifiers and integers)

identifier = letter {letter|digit}
integer = digit|digit
letter = [A-Za-z]
digit = [0-9]

The only difference between the EBNF used by jsLex and that defined by Wirth in "Compiler Construction", is that the terminal symbols are given in Unix regular expressions, rather than listed discretely.

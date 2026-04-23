<a id="language"></a>

# Python Language Services

Python provides a number of modules to assist in working with the Python
language.  These modules support tokenizing, parsing, syntax analysis, bytecode
disassembly, and various other facilities.

These modules include:

* [`ast` — Abstract syntax trees](ast.md)
  * [Abstract grammar](ast.md#abstract-grammar)
  * [Node classes](ast.md#node-classes)
    * [Root nodes](ast.md#root-nodes)
    * [Literals](ast.md#literals)
    * [Variables](ast.md#variables)
    * [Expressions](ast.md#expressions)
      * [Subscripting](ast.md#subscripting)
      * [Comprehensions](ast.md#comprehensions)
    * [Statements](ast.md#statements)
      * [Imports](ast.md#imports)
    * [Control flow](ast.md#control-flow)
    * [Pattern matching](ast.md#pattern-matching)
    * [Type annotations](ast.md#type-annotations)
    * [Type parameters](ast.md#type-parameters)
    * [Function and class definitions](ast.md#function-and-class-definitions)
    * [Async and await](ast.md#async-and-await)
  * [`ast` helpers](ast.md#ast-helpers)
  * [Compiler flags](ast.md#compiler-flags)
  * [Command-line usage](ast.md#command-line-usage)
* [`symtable` — Access to the compiler’s symbol tables](symtable.md)
  * [Generating Symbol Tables](symtable.md#generating-symbol-tables)
  * [Examining Symbol Tables](symtable.md#examining-symbol-tables)
  * [Command-Line Usage](symtable.md#command-line-usage)
* [`token` — Constants used with Python parse trees](token.md)
* [`keyword` — Testing for Python keywords](keyword.md)
* [`tokenize` — Tokenizer for Python source](tokenize.md)
  * [Tokenizing Input](tokenize.md#tokenizing-input)
  * [Command-Line Usage](tokenize.md#command-line-usage)
  * [Examples](tokenize.md#examples)
* [`tabnanny` — Detection of ambiguous indentation](tabnanny.md)
* [`pyclbr` — Python module browser support](pyclbr.md)
  * [Function Objects](pyclbr.md#function-objects)
  * [Class Objects](pyclbr.md#class-objects)
* [`py_compile` — Compile Python source files](py_compile.md)
  * [Command-Line Interface](py_compile.md#command-line-interface)
* [`compileall` — Byte-compile Python libraries](compileall.md)
  * [Command-line use](compileall.md#command-line-use)
  * [Public functions](compileall.md#public-functions)
* [`dis` — Disassembler for Python bytecode](dis.md)
  * [Command-line interface](dis.md#command-line-interface)
  * [Bytecode analysis](dis.md#bytecode-analysis)
  * [Analysis functions](dis.md#analysis-functions)
  * [Python Bytecode Instructions](dis.md#python-bytecode-instructions)
  * [Opcode collections](dis.md#opcode-collections)
* [`pickletools` — Tools for pickle developers](pickletools.md)
  * [Command-line usage](pickletools.md#command-line-usage)
    * [Command-line options](pickletools.md#command-line-options)
  * [Programmatic interface](pickletools.md#programmatic-interface)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

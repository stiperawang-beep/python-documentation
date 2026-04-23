<a id="tutorial-index"></a>

# The Python Tutorial

Python is an easy to learn, powerful programming language. It has efficient
high-level data structures and a simple but effective approach to
object-oriented programming. Python’s elegant syntax and dynamic typing,
together with its interpreted nature, make it an ideal language for scripting
and rapid application development in many areas on most platforms.

The Python interpreter and the extensive standard library are freely available
in source or binary form for all major platforms from the Python website,
[https://www.python.org/](https://www.python.org/), and may be freely distributed. The same site also
contains distributions of and pointers to many free third party Python modules,
programs and tools, and additional documentation.

The Python interpreter is easily extended with new functions and data types
implemented in C or C++ (or other languages callable from C). Python is also
suitable as an extension language for customizable applications.

This tutorial introduces the reader informally to the basic concepts and
features of the Python language and system. Be aware that it expects you to
have a basic understanding of programming in general. It helps to have a Python
interpreter handy for hands-on experience, but all examples are self-contained,
so the tutorial can be read off-line as well.

For a description of standard objects and modules, see [The Python Standard Library](../library/index.md#library-index).
[The Python Language Reference](../reference/index.md#reference-index) gives a more formal definition of the language.  To write
extensions in C or C++, read [Extending and Embedding the Python Interpreter](../extending/index.md#extending-index) and
[Python/C API reference manual](../c-api/index.md#c-api-index). There are also several books covering Python in depth.

This tutorial does not attempt to be comprehensive and cover every single
feature, or even every commonly used feature. Instead, it introduces many of
Python’s most noteworthy features, and will give you a good idea of the
language’s flavor and style. After reading it, you will be able to read and
write Python modules and programs, and you will be ready to learn more about the
various Python library modules described in [The Python Standard Library](../library/index.md#library-index).

The [Glossary](../glossary.md#glossary) is also worth going through.

* [Whetting Your Appetite](appetite.md)
* [Using the Python Interpreter](interpreter.md)
  * [Invoking the Interpreter](interpreter.md#invoking-the-interpreter)
    * [Argument Passing](interpreter.md#argument-passing)
    * [Interactive Mode](interpreter.md#interactive-mode)
  * [The Interpreter and Its Environment](interpreter.md#the-interpreter-and-its-environment)
    * [Source Code Encoding](interpreter.md#source-code-encoding)
* [An Informal Introduction to Python](introduction.md)
  * [Using Python as a Calculator](introduction.md#using-python-as-a-calculator)
    * [Numbers](introduction.md#numbers)
    * [Text](introduction.md#text)
    * [Lists](introduction.md#lists)
  * [First Steps Towards Programming](introduction.md#first-steps-towards-programming)
* [More Control Flow Tools](controlflow.md)
  * [`if` Statements](controlflow.md#if-statements)
  * [`for` Statements](controlflow.md#for-statements)
  * [The `range()` Function](controlflow.md#the-range-function)
  * [`break` and `continue` Statements](controlflow.md#break-and-continue-statements)
  * [`else` Clauses on Loops](controlflow.md#else-clauses-on-loops)
  * [`pass` Statements](controlflow.md#pass-statements)
  * [`match` Statements](controlflow.md#match-statements)
  * [Defining Functions](controlflow.md#defining-functions)
  * [More on Defining Functions](controlflow.md#more-on-defining-functions)
    * [Default Argument Values](controlflow.md#default-argument-values)
    * [Keyword Arguments](controlflow.md#keyword-arguments)
    * [Special parameters](controlflow.md#special-parameters)
      * [Positional-or-Keyword Arguments](controlflow.md#positional-or-keyword-arguments)
      * [Positional-Only Parameters](controlflow.md#positional-only-parameters)
      * [Keyword-Only Arguments](controlflow.md#keyword-only-arguments)
      * [Function Examples](controlflow.md#function-examples)
      * [Recap](controlflow.md#recap)
    * [Arbitrary Argument Lists](controlflow.md#arbitrary-argument-lists)
    * [Unpacking Argument Lists](controlflow.md#unpacking-argument-lists)
    * [Lambda Expressions](controlflow.md#lambda-expressions)
    * [Documentation Strings](controlflow.md#documentation-strings)
    * [Function Annotations](controlflow.md#function-annotations)
  * [Intermezzo: Coding Style](controlflow.md#intermezzo-coding-style)
* [Data Structures](datastructures.md)
  * [More on Lists](datastructures.md#more-on-lists)
    * [Using Lists as Stacks](datastructures.md#using-lists-as-stacks)
    * [Using Lists as Queues](datastructures.md#using-lists-as-queues)
    * [List Comprehensions](datastructures.md#list-comprehensions)
    * [Nested List Comprehensions](datastructures.md#nested-list-comprehensions)
    * [Unpacking in Lists and List Comprehensions](datastructures.md#unpacking-in-lists-and-list-comprehensions)
  * [The `del` statement](datastructures.md#the-del-statement)
  * [Tuples and Sequences](datastructures.md#tuples-and-sequences)
  * [Sets](datastructures.md#sets)
  * [Dictionaries](datastructures.md#dictionaries)
  * [Looping Techniques](datastructures.md#looping-techniques)
  * [More on Conditions](datastructures.md#more-on-conditions)
  * [Comparing Sequences and Other Types](datastructures.md#comparing-sequences-and-other-types)
* [Modules](modules.md)
  * [More on Modules](modules.md#more-on-modules)
    * [Executing modules as scripts](modules.md#executing-modules-as-scripts)
    * [The Module Search Path](modules.md#the-module-search-path)
    * [“Compiled” Python files](modules.md#compiled-python-files)
  * [Standard Modules](modules.md#standard-modules)
  * [The `dir()` Function](modules.md#the-dir-function)
  * [Packages](modules.md#packages)
    * [Importing \* From a Package](modules.md#importing-from-a-package)
    * [Intra-package References](modules.md#intra-package-references)
    * [Packages in Multiple Directories](modules.md#packages-in-multiple-directories)
* [Input and Output](inputoutput.md)
  * [Fancier Output Formatting](inputoutput.md#fancier-output-formatting)
    * [Formatted String Literals](inputoutput.md#formatted-string-literals)
    * [The String format() Method](inputoutput.md#the-string-format-method)
    * [Manual String Formatting](inputoutput.md#manual-string-formatting)
    * [Old string formatting](inputoutput.md#old-string-formatting)
  * [Reading and Writing Files](inputoutput.md#reading-and-writing-files)
    * [Methods of File Objects](inputoutput.md#methods-of-file-objects)
    * [Saving structured data with `json`](inputoutput.md#saving-structured-data-with-json)
* [Errors and Exceptions](errors.md)
  * [Syntax Errors](errors.md#syntax-errors)
  * [Exceptions](errors.md#exceptions)
  * [Handling Exceptions](errors.md#handling-exceptions)
  * [Raising Exceptions](errors.md#raising-exceptions)
  * [Exception Chaining](errors.md#exception-chaining)
  * [User-defined Exceptions](errors.md#user-defined-exceptions)
  * [Defining Clean-up Actions](errors.md#defining-clean-up-actions)
  * [Predefined Clean-up Actions](errors.md#predefined-clean-up-actions)
  * [Raising and Handling Multiple Unrelated Exceptions](errors.md#raising-and-handling-multiple-unrelated-exceptions)
  * [Enriching Exceptions with Notes](errors.md#enriching-exceptions-with-notes)
* [Classes](classes.md)
  * [A Word About Names and Objects](classes.md#a-word-about-names-and-objects)
  * [Python Scopes and Namespaces](classes.md#python-scopes-and-namespaces)
    * [Scopes and Namespaces Example](classes.md#scopes-and-namespaces-example)
  * [A First Look at Classes](classes.md#a-first-look-at-classes)
    * [Class Definition Syntax](classes.md#class-definition-syntax)
    * [Class Objects](classes.md#class-objects)
    * [Instance Objects](classes.md#instance-objects)
    * [Method Objects](classes.md#method-objects)
    * [Class and Instance Variables](classes.md#class-and-instance-variables)
  * [Random Remarks](classes.md#random-remarks)
  * [Inheritance](classes.md#inheritance)
    * [Multiple Inheritance](classes.md#multiple-inheritance)
  * [Private Variables](classes.md#private-variables)
  * [Odds and Ends](classes.md#odds-and-ends)
  * [Iterators](classes.md#iterators)
  * [Generators](classes.md#generators)
  * [Generator Expressions](classes.md#generator-expressions)
* [Brief tour of the standard library](stdlib.md)
  * [Operating system interface](stdlib.md#operating-system-interface)
  * [File wildcards](stdlib.md#file-wildcards)
  * [Command-line arguments](stdlib.md#command-line-arguments)
  * [Error output redirection and program termination](stdlib.md#error-output-redirection-and-program-termination)
  * [String pattern matching](stdlib.md#string-pattern-matching)
  * [Mathematics](stdlib.md#mathematics)
  * [Internet access](stdlib.md#internet-access)
  * [Dates and times](stdlib.md#dates-and-times)
  * [Data compression](stdlib.md#data-compression)
  * [Performance measurement](stdlib.md#performance-measurement)
  * [Quality control](stdlib.md#quality-control)
  * [Batteries included](stdlib.md#batteries-included)
* [Brief Tour of the Standard Library — Part II](stdlib2.md)
  * [Output Formatting](stdlib2.md#output-formatting)
  * [Templating](stdlib2.md#templating)
  * [Working with Binary Data Record Layouts](stdlib2.md#working-with-binary-data-record-layouts)
  * [Multi-threading](stdlib2.md#multi-threading)
  * [Logging](stdlib2.md#logging)
  * [Weak References](stdlib2.md#weak-references)
  * [Tools for Working with Lists](stdlib2.md#tools-for-working-with-lists)
  * [Decimal Floating-Point Arithmetic](stdlib2.md#decimal-floating-point-arithmetic)
* [Virtual Environments and Packages](venv.md)
  * [Introduction](venv.md#introduction)
  * [Creating Virtual Environments](venv.md#creating-virtual-environments)
  * [Managing Packages with pip](venv.md#managing-packages-with-pip)
* [What Now?](whatnow.md)
* [Interactive Input Editing and History Substitution](interactive.md)
  * [Tab Completion and History Editing](interactive.md#tab-completion-and-history-editing)
  * [Alternatives to the Interactive Interpreter](interactive.md#alternatives-to-the-interactive-interpreter)
* [Floating-Point Arithmetic:  Issues and Limitations](floatingpoint.md)
  * [Representation Error](floatingpoint.md#representation-error)
* [Appendix](appendix.md)
  * [Interactive Mode](appendix.md#interactive-mode)
    * [Error Handling](appendix.md#error-handling)
    * [Executable Python Scripts](appendix.md#executable-python-scripts)
    * [The Interactive Startup File](appendix.md#the-interactive-startup-file)
    * [The Customization Modules](appendix.md#the-customization-modules)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

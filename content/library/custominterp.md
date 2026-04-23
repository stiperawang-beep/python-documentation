<a id="custominterp"></a>

# Custom Python Interpreters

The modules described in this chapter allow writing interfaces similar to
Python’s interactive interpreter.  If you want a Python interpreter that
supports some special feature in addition to the Python language, you should
look at the [`code`](code.md#module-code) module.  (The [`codeop`](codeop.md#module-codeop) module is lower-level, used
to support compiling a possibly incomplete chunk of Python code.)

The full list of modules described in this chapter is:

* [`code` — Interpreter base classes](code.md)
  * [Interactive Interpreter Objects](code.md#interactive-interpreter-objects)
  * [Interactive Console Objects](code.md#interactive-console-objects)
* [`codeop` — Compile Python code](codeop.md)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

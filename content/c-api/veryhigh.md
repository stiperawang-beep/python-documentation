<a id="veryhigh"></a>

# The Very High Level Layer

The functions in this chapter will let you execute Python source code given in a
file or a buffer, but they will not let you interact in a more detailed way with
the interpreter.

Several of these functions accept a start symbol from the grammar as a
parameter.  The available start symbols are [`Py_eval_input`](#c.Py_eval_input),
[`Py_file_input`](#c.Py_file_input), [`Py_single_input`](#c.Py_single_input), and
[`Py_func_type_input`](#c.Py_func_type_input).  These are described following the functions
which accept them as parameters.

Note also that several of these functions take  parameters.  One
particular issue which needs to be handled carefully is that the `FILE`
structure for different C libraries can be different and incompatible.  Under
Windows (at least), it is possible for dynamically linked extensions to actually
use different libraries, so care should be taken that  parameters
are only passed to these functions if it is certain that they were created by
the same library that the Python runtime is using.

### int PyRun_AnyFile(FILE \*fp, const char \*filename)

This is a simplified interface to [`PyRun_AnyFileExFlags()`](#c.PyRun_AnyFileExFlags) below, leaving
*closeit* set to `0` and *flags* set to `NULL`.

### int PyRun_AnyFileFlags(FILE \*fp, const char \*filename, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

This is a simplified interface to [`PyRun_AnyFileExFlags()`](#c.PyRun_AnyFileExFlags) below, leaving
the *closeit* argument set to `0`.

### int PyRun_AnyFileEx(FILE \*fp, const char \*filename, int closeit)

This is a simplified interface to [`PyRun_AnyFileExFlags()`](#c.PyRun_AnyFileExFlags) below, leaving
the *flags* argument set to `NULL`.

### int PyRun_AnyFileExFlags(FILE \*fp, const char \*filename, int closeit, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

If *fp* refers to a file associated with an interactive device (console or
terminal input or Unix pseudo-terminal), return the value of
[`PyRun_InteractiveLoop()`](#c.PyRun_InteractiveLoop), otherwise return the result of
[`PyRun_SimpleFile()`](#c.PyRun_SimpleFile).  *filename* is decoded from the filesystem
encoding ([`sys.getfilesystemencoding()`](../library/sys.md#sys.getfilesystemencoding)).  If *filename* is `NULL`, this
function uses `"???"` as the filename.
If *closeit* is true, the file is closed before
`PyRun_SimpleFileExFlags()` returns.

### int PyRun_SimpleString(const char \*command)

This is a simplified interface to [`PyRun_SimpleStringFlags()`](#c.PyRun_SimpleStringFlags) below,
leaving the [`PyCompilerFlags`](#c.PyCompilerFlags)\* argument set to `NULL`.

### int PyRun_SimpleStringFlags(const char \*command, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

Executes the Python source code from *command* in the [`__main__`](../library/__main__.md#module-__main__) module
according to the *flags* argument. If [`__main__`](../library/__main__.md#module-__main__) does not already exist, it
is created.  Returns `0` on success or `-1` if an exception was raised.  If
there was an error, there is no way to get the exception information. For the
meaning of *flags*, see below.

Note that if an otherwise unhandled [`SystemExit`](../library/exceptions.md#SystemExit) is raised, this
function will not return `-1`, but exit the process, as long as
[`PyConfig.inspect`](init_config.md#c.PyConfig.inspect) is zero.

### int PyRun_SimpleFile(FILE \*fp, const char \*filename)

This is a simplified interface to [`PyRun_SimpleFileExFlags()`](#c.PyRun_SimpleFileExFlags) below,
leaving *closeit* set to `0` and *flags* set to `NULL`.

### int PyRun_SimpleFileEx(FILE \*fp, const char \*filename, int closeit)

This is a simplified interface to [`PyRun_SimpleFileExFlags()`](#c.PyRun_SimpleFileExFlags) below,
leaving *flags* set to `NULL`.

### int PyRun_SimpleFileExFlags(FILE \*fp, const char \*filename, int closeit, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

Similar to [`PyRun_SimpleStringFlags()`](#c.PyRun_SimpleStringFlags), but the Python source code is read
from *fp* instead of an in-memory string. *filename* should be the name of
the file, it is decoded from [filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).
If *closeit* is true, the file is closed before
`PyRun_SimpleFileExFlags()` returns.

#### NOTE
On Windows, *fp* should be opened as binary mode (e.g. `fopen(filename, "rb")`).
Otherwise, Python may not handle script file with LF line ending correctly.

### int PyRun_InteractiveOneObject(FILE \*fp, [PyObject](structures.md#c.PyObject) \*filename, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

Read and execute a single statement from a file associated with an
interactive device according to the *flags* argument.  The user will be
prompted using `sys.ps1` and `sys.ps2`. *filename* must be a Python
[`str`](../library/stdtypes.md#str) object.

Returns `0` when the input was
executed successfully, `-1` if there was an exception, or an error code
from the `errcode.h` include file distributed as part of Python if
there was a parse error.  (Note that `errcode.h` is not included by
`Python.h`, so must be included specifically if needed.)

### int PyRun_InteractiveOne(FILE \*fp, const char \*filename)

This is a simplified interface to [`PyRun_InteractiveOneFlags()`](#c.PyRun_InteractiveOneFlags) below,
leaving *flags* set to `NULL`.

### int PyRun_InteractiveOneFlags(FILE \*fp, const char \*filename, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

Similar to [`PyRun_InteractiveOneObject()`](#c.PyRun_InteractiveOneObject), but *filename* is a
, which is decoded from the
[filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).

### int PyRun_InteractiveLoop(FILE \*fp, const char \*filename)

This is a simplified interface to [`PyRun_InteractiveLoopFlags()`](#c.PyRun_InteractiveLoopFlags) below,
leaving *flags* set to `NULL`.

### int PyRun_InteractiveLoopFlags(FILE \*fp, const char \*filename, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

Read and execute statements from a file associated with an interactive device
until EOF is reached.  The user will be prompted using `sys.ps1` and
`sys.ps2`.  *filename* is decoded from the [filesystem encoding and
error handler](../glossary.md#term-filesystem-encoding-and-error-handler).  Returns `0` at EOF or a negative number upon failure.

### int (\*PyOS_InputHook)(void)

 *Part of the [Stable ABI](stable.md#stable).*

Can be set to point to a function with the prototype
`int func(void)`.  The function will be called when Python’s
interpreter prompt is about to become idle and wait for user input
from the terminal.  The return value is ignored.  Overriding this
hook can be used to integrate the interpreter’s prompt with other
event loops, as done in `Modules/_tkinter.c` in the
Python source code.

#### Versionchanged
Changed in version 3.12: This function is only called from the
[main interpreter](subinterpreters.md#sub-interpreter-support).

### char \*(\*PyOS_ReadlineFunctionPointer)(FILE\*, FILE\*, const char\*)

Can be set to point to a function with the prototype
`char *func(FILE *stdin, FILE *stdout, char *prompt)`,
overriding the default function used to read a single line of input
at the interpreter’s prompt.  The function is expected to output
the string *prompt* if it’s not `NULL`, and then read a line of
input from the provided standard input file, returning the
resulting string.  For example, The [`readline`](../library/readline.md#module-readline) module sets
this hook to provide line-editing and tab-completion features.

The result must be a string allocated by [`PyMem_RawMalloc()`](memory.md#c.PyMem_RawMalloc) or
[`PyMem_RawRealloc()`](memory.md#c.PyMem_RawRealloc), or `NULL` if an error occurred.

#### Versionchanged
Changed in version 3.4: The result must be allocated by [`PyMem_RawMalloc()`](memory.md#c.PyMem_RawMalloc) or
[`PyMem_RawRealloc()`](memory.md#c.PyMem_RawRealloc), instead of being allocated by
[`PyMem_Malloc()`](memory.md#c.PyMem_Malloc) or [`PyMem_Realloc()`](memory.md#c.PyMem_Realloc).

#### Versionchanged
Changed in version 3.12: This function is only called from the
[main interpreter](subinterpreters.md#sub-interpreter-support).

### [PyObject](structures.md#c.PyObject) \*PyRun_String(const char \*str, int start, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*locals)

*Return value: New reference.*

This is a simplified interface to [`PyRun_StringFlags()`](#c.PyRun_StringFlags) below, leaving
*flags* set to `NULL`.

### [PyObject](structures.md#c.PyObject) \*PyRun_StringFlags(const char \*str, int start, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*locals, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

*Return value: New reference.*

Execute Python source code from *str* in the context specified by the
objects *globals* and *locals* with the compiler flags specified by
*flags*.  *globals* must be a dictionary; *locals* can be any object
that implements the mapping protocol.  The parameter *start* specifies
the start symbol and must be one of the [available start symbols](#start-symbols).

Returns the result of executing the code as a Python object, or `NULL` if an
exception was raised.

### [PyObject](structures.md#c.PyObject) \*PyRun_File(FILE \*fp, const char \*filename, int start, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*locals)

*Return value: New reference.*

This is a simplified interface to [`PyRun_FileExFlags()`](#c.PyRun_FileExFlags) below, leaving
*closeit* set to `0` and *flags* set to `NULL`.

### [PyObject](structures.md#c.PyObject) \*PyRun_FileEx(FILE \*fp, const char \*filename, int start, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*locals, int closeit)

*Return value: New reference.*

This is a simplified interface to [`PyRun_FileExFlags()`](#c.PyRun_FileExFlags) below, leaving
*flags* set to `NULL`.

### [PyObject](structures.md#c.PyObject) \*PyRun_FileFlags(FILE \*fp, const char \*filename, int start, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*locals, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

*Return value: New reference.*

This is a simplified interface to [`PyRun_FileExFlags()`](#c.PyRun_FileExFlags) below, leaving
*closeit* set to `0`.

### [PyObject](structures.md#c.PyObject) \*PyRun_FileExFlags(FILE \*fp, const char \*filename, int start, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*locals, int closeit, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

*Return value: New reference.*

Similar to [`PyRun_StringFlags()`](#c.PyRun_StringFlags), but the Python source code is read from
*fp* instead of an in-memory string. *filename* should be the name of the file,
it is decoded from the [filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).
If *closeit* is true, the file is closed before [`PyRun_FileExFlags()`](#c.PyRun_FileExFlags)
returns.

### [PyObject](structures.md#c.PyObject) \*Py_CompileString(const char \*str, const char \*filename, int start)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

This is a simplified interface to [`Py_CompileStringFlags()`](#c.Py_CompileStringFlags) below, leaving
*flags* set to `NULL`.

### [PyObject](structures.md#c.PyObject) \*Py_CompileStringFlags(const char \*str, const char \*filename, int start, [PyCompilerFlags](#c.PyCompilerFlags) \*flags)

*Return value: New reference.*

This is a simplified interface to [`Py_CompileStringExFlags()`](#c.Py_CompileStringExFlags) below, with
*optimize* set to `-1`.

### [PyObject](structures.md#c.PyObject) \*Py_CompileStringObject(const char \*str, [PyObject](structures.md#c.PyObject) \*filename, int start, [PyCompilerFlags](#c.PyCompilerFlags) \*flags, int optimize)

*Return value: New reference.*

Parse and compile the Python source code in *str*, returning the resulting code
object.  The start symbol is given by *start*; this can be used to constrain the
code which can be compiled and should be [available start symbols](#start-symbols).  The filename specified by
*filename* is used to construct the code object and may appear in tracebacks or
[`SyntaxError`](../library/exceptions.md#SyntaxError) exception messages.  This returns `NULL` if the code
cannot be parsed or compiled.

The integer *optimize* specifies the optimization level of the compiler; a
value of `-1` selects the optimization level of the interpreter as given by
[`-O`](../using/cmdline.md#cmdoption-O) options.  Explicit levels are `0` (no optimization;
`__debug__` is true), `1` (asserts are removed, `__debug__` is false)
or `2` (docstrings are removed too).

#### Versionadded
Added in version 3.4.

### [PyObject](structures.md#c.PyObject) \*Py_CompileStringExFlags(const char \*str, const char \*filename, int start, [PyCompilerFlags](#c.PyCompilerFlags) \*flags, int optimize)

*Return value: New reference.*

Like [`Py_CompileStringObject()`](#c.Py_CompileStringObject), but *filename* is a byte string
decoded from the [filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).

#### Versionadded
Added in version 3.2.

### [PyObject](structures.md#c.PyObject) \*PyEval_EvalCode([PyObject](structures.md#c.PyObject) \*co, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*locals)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

This is a simplified interface to [`PyEval_EvalCodeEx()`](#c.PyEval_EvalCodeEx), with just
the code object, and global and local variables.  The other arguments are
set to `NULL`.

### [PyObject](structures.md#c.PyObject) \*PyEval_EvalCodeEx([PyObject](structures.md#c.PyObject) \*co, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*locals, [PyObject](structures.md#c.PyObject) \*const \*args, int argcount, [PyObject](structures.md#c.PyObject) \*const \*kws, int kwcount, [PyObject](structures.md#c.PyObject) \*const \*defs, int defcount, [PyObject](structures.md#c.PyObject) \*kwdefs, [PyObject](structures.md#c.PyObject) \*closure)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Evaluate a precompiled code object, given a particular environment for its
evaluation.  This environment consists of a dictionary of global variables,
a mapping object of local variables, arrays of arguments, keywords and
defaults, a dictionary of default values for [keyword-only](../glossary.md#keyword-only-parameter) arguments and a closure tuple of cells.

### [PyObject](structures.md#c.PyObject) \*PyEval_EvalFrame([PyFrameObject](frame.md#c.PyFrameObject) \*f)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Evaluate an execution frame.  This is a simplified interface to
[`PyEval_EvalFrameEx()`](#c.PyEval_EvalFrameEx), for backward compatibility.

### [PyObject](structures.md#c.PyObject) \*PyEval_EvalFrameEx([PyFrameObject](frame.md#c.PyFrameObject) \*f, int throwflag)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

This is the main, unvarnished function of Python interpretation.  The code
object associated with the execution frame *f* is executed, interpreting
bytecode and executing calls as needed.  The additional *throwflag*
parameter can mostly be ignored - if true, then it causes an exception
to immediately be thrown; this is used for the [`throw()`](../reference/expressions.md#generator.throw)
methods of generator objects.

#### Versionchanged
Changed in version 3.4: This function now includes a debug assertion to help ensure that it
does not silently discard an active exception.

### int PyEval_MergeCompilerFlags([PyCompilerFlags](#c.PyCompilerFlags) \*cf)

This function changes the flags of the current evaluation frame, and returns
true on success, false on failure.

### struct PyCompilerFlags

This is the structure used to hold compiler flags.  In cases where code is only
being compiled, it is passed as `int flags`, and in cases where code is being
executed, it is passed as `PyCompilerFlags *flags`.  In this case, `from
__future__ import` can modify *flags*.

Whenever `PyCompilerFlags *flags` is `NULL`, [`cf_flags`](#c.PyCompilerFlags.cf_flags) is treated as
equal to `0`, and any modification due to `from __future__ import` is
discarded.

### int cf_flags

Compiler flags.

### int cf_feature_version

*cf_feature_version* is the minor Python version. It should be
initialized to `PY_MINOR_VERSION`.

The field is ignored by default, it is used if and only if
`PyCF_ONLY_AST` flag is set in [`cf_flags`](#c.PyCompilerFlags.cf_flags).

#### Versionchanged
Changed in version 3.8: Added *cf_feature_version* field.

The available compiler flags are accessible as macros:

### PyCF_ALLOW_TOP_LEVEL_AWAIT

### PyCF_ONLY_AST

### PyCF_OPTIMIZED_AST

### PyCF_TYPE_COMMENTS

See [compiler flags](../library/ast.md#ast-compiler-flags) in documentation of the
`ast` Python module, which exports these constants under
the same names.

The “`PyCF`” flags above can be combined with “`CO_FUTURE`” flags such
as [`CO_FUTURE_ANNOTATIONS`](code.md#c.CO_FUTURE_ANNOTATIONS) to enable features normally
selectable using [future statements](../reference/simple_stmts.md#future).
See [Code Object Flags](code.md#c-codeobject-flags) for a complete list.

<a id="start-symbols"></a>

## Available start symbols

### int Py_eval_input

<a id="index-0"></a>

The start symbol from the Python grammar for isolated expressions; for use with
[`Py_CompileString()`](#c.Py_CompileString).

### int Py_file_input

<a id="index-1"></a>

The start symbol from the Python grammar for sequences of statements as read
from a file or other source; for use with [`Py_CompileString()`](#c.Py_CompileString).  This is
the symbol to use when compiling arbitrarily long Python source code.

### int Py_single_input

<a id="index-2"></a>

The start symbol from the Python grammar for a single statement; for use with
[`Py_CompileString()`](#c.Py_CompileString). This is the symbol used for the interactive
interpreter loop.

### int Py_func_type_input

<a id="index-3"></a>

The start symbol from the Python grammar for a function type; for use with
[`Py_CompileString()`](#c.Py_CompileString). This is used to parse “signature type comments”
from [**PEP 484**](https://peps.python.org/pep-0484/).

This requires the [`PyCF_ONLY_AST`](#c.PyCF_ONLY_AST) flag to be set.

#### SEE ALSO
* [`ast.FunctionType`](../library/ast.md#ast.FunctionType)
* [**PEP 484**](https://peps.python.org/pep-0484/)

#### Versionadded
Added in version 3.8.

## Stack Effects

#### SEE ALSO
[`dis.stack_effect()`](../library/dis.md#dis.stack_effect)

### PY_INVALID_STACK_EFFECT

Sentinel value representing an invalid stack effect.

This is currently equivalent to `INT_MAX`.

#### Versionadded
Added in version 3.8.

### int PyCompile_OpcodeStackEffect(int opcode, int oparg)

Compute the stack effect of *opcode* with argument *oparg*.

On success, this function returns the stack effect; on failure, this
returns [`PY_INVALID_STACK_EFFECT`](#c.PY_INVALID_STACK_EFFECT).

#### Versionadded
Added in version 3.4.

### int PyCompile_OpcodeStackEffectWithJump(int opcode, int oparg, int jump)

Similar to [`PyCompile_OpcodeStackEffect()`](#c.PyCompile_OpcodeStackEffect), but don’t include the
stack effect of jumping if *jump* is zero.

If *jump* is `0`, this will not include the stack effect of jumping, but
if *jump* is `1` or `-1`, this will include it.

On success, this function returns the stack effect; on failure, this
returns [`PY_INVALID_STACK_EFFECT`](#c.PY_INVALID_STACK_EFFECT).

#### Versionadded
Added in version 3.8.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

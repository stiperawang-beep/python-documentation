# Extending/Embedding FAQ

<!-- XXX need review for Python 3. -->

## Can I create my own functions in C?

Yes, you can create built-in modules containing functions, variables, exceptions
and even new types in C.  This is explained in the document
[Extending and Embedding the Python Interpreter](../extending/index.md#extending-index).

Most intermediate or advanced Python books will also cover this topic.

## Can I create my own functions in C++?

Yes, using the C compatibility features found in C++.  Place `extern "C" {
... }` around the Python include files and put `extern "C"` before each
function that is going to be called by the Python interpreter.  Global or static
C++ objects with constructors are probably not a good idea.

<a id="c-wrapper-software"></a>

## Writing C is hard; are there any alternatives?

There are a number of alternatives to writing your own C extensions, depending
on what you’re trying to do. [Recommended third party tools](../c-api/intro.md#c-api-tools)
offer both simpler and more sophisticated approaches to creating C and C++
extensions for Python.

## How can I execute arbitrary Python statements from C?

The highest-level function to do this is [`PyRun_SimpleString()`](../c-api/veryhigh.md#c.PyRun_SimpleString) which takes
a single string argument to be executed in the context of the module
`__main__` and returns `0` for success and `-1` when an exception occurred
(including [`SyntaxError`](../library/exceptions.md#SyntaxError)).  If you want more control, use
[`PyRun_String()`](../c-api/veryhigh.md#c.PyRun_String); see the source for [`PyRun_SimpleString()`](../c-api/veryhigh.md#c.PyRun_SimpleString) in
`Python/pythonrun.c`.

## How can I evaluate an arbitrary Python expression from C?

Call the function [`PyRun_String()`](../c-api/veryhigh.md#c.PyRun_String) from the previous question with the
start symbol [`Py_eval_input`](../c-api/veryhigh.md#c.Py_eval_input); it parses an expression, evaluates it and
returns its value.

## How do I extract C values from a Python object?

That depends on the object’s type.  If it’s a tuple, [`PyTuple_Size()`](../c-api/tuple.md#c.PyTuple_Size)
returns its length and [`PyTuple_GetItem()`](../c-api/tuple.md#c.PyTuple_GetItem) returns the item at a specified
index.  Lists have similar functions, [`PyList_Size()`](../c-api/list.md#c.PyList_Size) and
[`PyList_GetItem()`](../c-api/list.md#c.PyList_GetItem).

For bytes, [`PyBytes_Size()`](../c-api/bytes.md#c.PyBytes_Size) returns its length and
[`PyBytes_AsStringAndSize()`](../c-api/bytes.md#c.PyBytes_AsStringAndSize) provides a pointer to its value and its
length.  Note that Python bytes objects may contain null bytes so C’s
`strlen()` should not be used.

To test the type of an object, first make sure it isn’t `NULL`, and then use
[`PyBytes_Check()`](../c-api/bytes.md#c.PyBytes_Check), [`PyTuple_Check()`](../c-api/tuple.md#c.PyTuple_Check), [`PyList_Check()`](../c-api/list.md#c.PyList_Check), etc.

There is also a high-level API to Python objects which is provided by the
so-called ‘abstract’ interface – read `Include/abstract.h` for further
details.  It allows interfacing with any kind of Python sequence using calls
like [`PySequence_Length()`](../c-api/sequence.md#c.PySequence_Length), [`PySequence_GetItem()`](../c-api/sequence.md#c.PySequence_GetItem), etc. as well
as many other useful protocols such as numbers ([`PyNumber_Index()`](../c-api/number.md#c.PyNumber_Index) et
al.) and mappings in the PyMapping APIs.

## How do I use Py_BuildValue() to create a tuple of arbitrary length?

You can’t.  Use [`PyTuple_Pack()`](../c-api/tuple.md#c.PyTuple_Pack) instead.

## How do I call an object’s method from C?

The [`PyObject_CallMethod()`](../c-api/call.md#c.PyObject_CallMethod) function can be used to call an arbitrary
method of an object.  The parameters are the object, the name of the method to
call, a format string like that used with [`Py_BuildValue()`](../c-api/arg.md#c.Py_BuildValue), and the
argument values:

```c
PyObject *
PyObject_CallMethod(PyObject *object, const char *method_name,
                    const char *arg_format, ...);
```

This works for any object that has methods – whether built-in or user-defined.
You are responsible for eventually [`Py_DECREF()`](../c-api/refcounting.md#c.Py_DECREF)‘ing the return value.

To call, e.g., a file object’s “seek” method with arguments 10, 0 (assuming the
file object pointer is “f”):

```c
res = PyObject_CallMethod(f, "seek", "(ii)", 10, 0);
if (res == NULL) {
        ... an exception occurred ...
}
else {
        Py_DECREF(res);
}
```

Note that since [`PyObject_CallObject()`](../c-api/call.md#c.PyObject_CallObject) *always* wants a tuple for the
argument list, to call a function without arguments, pass “()” for the format,
and to call a function with one argument, surround the argument in parentheses,
e.g. “(i)”.

## How do I catch the output from PyErr_Print() (or anything that prints to stdout/stderr)?

In Python code, define an object that supports the `write()` method.  Assign
this object to [`sys.stdout`](../library/sys.md#sys.stdout) and [`sys.stderr`](../library/sys.md#sys.stderr).  Call print_error, or
just allow the standard traceback mechanism to work. Then, the output will go
wherever your `write()` method sends it.

The easiest way to do this is to use the [`io.StringIO`](../library/io.md#io.StringIO) class:

```pycon
>>> import io, sys
>>> sys.stdout = io.StringIO()
>>> print('foo')
>>> print('hello world!')
>>> sys.stderr.write(sys.stdout.getvalue())
foo
hello world!
```

A custom object to do the same would look like this:

```pycon
>>> import io, sys
>>> class StdoutCatcher(io.TextIOBase):
...     def __init__(self):
...         self.data = []
...     def write(self, stuff):
...         self.data.append(stuff)
...
>>> import sys
>>> sys.stdout = StdoutCatcher()
>>> print('foo')
>>> print('hello world!')
>>> sys.stderr.write(''.join(sys.stdout.data))
foo
hello world!
```

## How do I access a module written in Python from C?

You can get a pointer to the module object as follows:

```c
module = PyImport_ImportModule("<modulename>");
```

If the module hasn’t been imported yet (i.e. it is not yet present in
[`sys.modules`](../library/sys.md#sys.modules)), this initializes the module; otherwise it simply returns
the value of `sys.modules["<modulename>"]`.  Note that it doesn’t enter the
module into any namespace – it only ensures it has been initialized and is
stored in [`sys.modules`](../library/sys.md#sys.modules).

You can then access the module’s attributes (i.e. any name defined in the
module) as follows:

```c
attr = PyObject_GetAttrString(module, "<attrname>");
```

Calling [`PyObject_SetAttrString()`](../c-api/object.md#c.PyObject_SetAttrString) to assign to variables in the module
also works.

## How do I interface to C++ objects from Python?

Depending on your requirements, there are many approaches.  To do this manually,
begin by reading [the “Extending and Embedding” document](../extending/index.md#extending-index).  Realize that for the Python run-time system, there isn’t a
whole lot of difference between C and C++ – so the strategy of building a new
Python type around a C structure (pointer) type will also work for C++ objects.

For C++ libraries, see [Writing C is hard; are there any alternatives?](#c-wrapper-software).

## I added a module using the Setup file and the make fails; why?

Setup must end in a newline, if there is no newline there, the build process
fails.  (Fixing this requires some ugly shell script hackery, and this bug is so
minor that it doesn’t seem worth the effort.)

## How do I debug an extension?

When using GDB with dynamically loaded extensions, you can’t set a breakpoint in
your extension until your extension is loaded.

In your `.gdbinit` file (or interactively), add the command:

```none
br _PyImport_LoadDynamicModule
```

Then, when you run GDB:

```shell-session
$ gdb /local/bin/python
gdb) run myscript.py
gdb) continue # repeat until your extension is loaded
gdb) finish   # so that your extension is loaded
gdb) br myfunction.c:50
gdb) continue
```

## I want to compile a Python module on my Linux system, but some files are missing. Why?

Most packaged versions of Python omit some files
required for compiling Python extensions.

For Red Hat, install the python3-devel RPM to get the necessary files.

For Debian, run `apt-get install python3-dev`.

## How do I tell “incomplete input” from “invalid input”?

Sometimes you want to emulate the Python interactive interpreter’s behavior,
where it gives you a continuation prompt when the input is incomplete (e.g. you
typed the start of an “if” statement or you didn’t close your parentheses or
triple string quotes), but it gives you a syntax error message immediately when
the input is invalid.

In Python you can use the [`codeop`](../library/codeop.md#module-codeop) module, which approximates the parser’s
behavior sufficiently.  IDLE uses this, for example.

The easiest way to do it in C is to call [`PyRun_InteractiveLoop()`](../c-api/veryhigh.md#c.PyRun_InteractiveLoop) (perhaps
in a separate thread) and let the Python interpreter handle the input for
you. You can also set the [`PyOS_ReadlineFunctionPointer()`](../c-api/veryhigh.md#c.PyOS_ReadlineFunctionPointer) to point at your
custom input function. See `Modules/readline.c` and `Parser/myreadline.c`
for more hints.

## How do I find undefined g++ symbols \_\_builtin_new or \_\_pure_virtual?

To dynamically load g++ extension modules, you must recompile Python, relink it
using g++ (change LINKCC in the Python Modules Makefile), and link your
extension module using g++ (e.g., `g++ -shared -o mymodule.so mymodule.o`).

## Can I create an object class with some methods implemented in C and others in Python (e.g. through inheritance)?

Yes, you can inherit from built-in classes such as [`int`](../library/functions.md#int), [`list`](../library/stdtypes.md#list),
[`dict`](../library/stdtypes.md#dict), etc.

The Boost Python Library (BPL, [https://www.boost.org/libs/python/doc/index.html](https://www.boost.org/libs/python/doc/index.html))
provides a way of doing this from C++ (i.e. you can inherit from an extension
class written in C++ using the BPL).

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

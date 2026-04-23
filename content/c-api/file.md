<a id="fileobjects"></a>

# File objects

<a id="index-0"></a>

These APIs are a minimal emulation of the Python 2 C API for built-in file
objects, which used to rely on the buffered I/O () support
from the C standard library.  In Python 3, files and streams use the new
[`io`](../library/io.md#module-io) module, which defines several layers over the low-level unbuffered
I/O of the operating system.  The functions described below are
convenience C wrappers over these new APIs, and meant mostly for internal
error reporting in the interpreter; third-party code is advised to access
the [`io`](../library/io.md#module-io) APIs instead.

### [PyObject](structures.md#c.PyObject) \*PyFile_FromFd(int fd, const char \*name, const char \*mode, int buffering, const char \*encoding, const char \*errors, const char \*newline, int closefd)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a Python file object from the file descriptor of an already
opened file *fd*.  The arguments *name*, *encoding*, *errors* and *newline*
can be `NULL` to use the defaults; *buffering* can be  *-1* to use the
default. *name* is ignored and kept for backward compatibility. Return
`NULL` on failure. For a more comprehensive description of the arguments,
please refer to the [`io.open()`](../library/io.md#io.open) function documentation.

#### WARNING
Since Python streams have their own buffering layer, mixing them with
OS-level file descriptors can produce various issues (such as unexpected
ordering of data).

#### Versionchanged
Changed in version 3.2: Ignore *name* attribute.

### int PyObject_AsFileDescriptor([PyObject](structures.md#c.PyObject) \*p)

 *Part of the [Stable ABI](stable.md#stable).*

Return the file descriptor associated with *p* as an .  If the
object is an integer, its value is returned.  If not, the
object’s [`fileno()`](../library/io.md#io.IOBase.fileno) method is called if it exists; the
method must return an integer, which is returned as the file descriptor
value.  Sets an exception and returns `-1` on failure.

### [PyObject](structures.md#c.PyObject) \*PyFile_GetLine([PyObject](structures.md#c.PyObject) \*p, int n)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-1"></a>

Equivalent to `p.readline([n])`, this function reads one line from the
object *p*.  *p* may be a file object or any object with a
[`readline()`](../library/io.md#io.IOBase.readline)
method.  If *n* is `0`, exactly one line is read, regardless of the length of
the line.  If *n* is greater than `0`, no more than *n* bytes will be read
from the file; a partial line can be returned.  In both cases, an empty string
is returned if the end of the file is reached immediately.  If *n* is less than
`0`, however, one line is read regardless of length, but [`EOFError`](../library/exceptions.md#EOFError) is
raised if the end of the file is reached immediately.

### int PyFile_SetOpenCodeHook([Py_OpenCodeHookFunction](#c.Py_OpenCodeHookFunction) handler)

Overrides the normal behavior of [`io.open_code()`](../library/io.md#io.open_code) to pass its parameter
through the provided handler.

The *handler* is a function of type:

### typedef [PyObject](structures.md#c.PyObject) \*(\*Py_OpenCodeHookFunction)([PyObject](structures.md#c.PyObject)\*, void\*)

Equivalent of , where *path* is guaranteed to be
[`PyUnicodeObject`](unicode.md#c.PyUnicodeObject).

The *userData* pointer is passed into the hook function. Since hook
functions may be called from different runtimes, this pointer should not
refer directly to Python state.

As this hook is intentionally used during import, avoid importing new modules
during its execution unless they are known to be frozen or available in
`sys.modules`.

Once a hook has been set, it cannot be removed or replaced, and later calls to
[`PyFile_SetOpenCodeHook()`](#c.PyFile_SetOpenCodeHook) will fail. On failure, the function returns
-1 and sets an exception if the interpreter has been initialized.

This function is safe to call before [`Py_Initialize()`](interp-lifecycle.md#c.Py_Initialize).

Raises an [auditing event](../library/sys.md#auditing) `setopencodehook` with no arguments.

#### Versionadded
Added in version 3.8.

### [PyObject](structures.md#c.PyObject) \*PyFile_OpenCodeObject([PyObject](structures.md#c.PyObject) \*path)

Open *path* with the mode `'rb'`. *path* must be a Python [`str`](../library/stdtypes.md#str)
object. The behavior of this function may be overridden by
[`PyFile_SetOpenCodeHook()`](#c.PyFile_SetOpenCodeHook) to allow for some preprocessing of the
text.

This is analogous to [`io.open_code()`](../library/io.md#io.open_code) in Python.

On success, this function returns a [strong reference](../glossary.md#term-strong-reference) to a Python
file object. On failure, this function returns `NULL` with an exception
set.

#### Versionadded
Added in version 3.8.

### [PyObject](structures.md#c.PyObject) \*PyFile_OpenCode(const char \*path)

Similar to [`PyFile_OpenCodeObject()`](#c.PyFile_OpenCodeObject), but *path* is a
UTF-8 encoded .

#### Versionadded
Added in version 3.8.

### int PyFile_WriteObject([PyObject](structures.md#c.PyObject) \*obj, [PyObject](structures.md#c.PyObject) \*p, int flags)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-2"></a>

Write object *obj* to file object *p*.  The only supported flag for *flags* is
[`Py_PRINT_RAW`](object.md#c.Py_PRINT_RAW); if given, the [`str()`](../library/stdtypes.md#str) of the object is written
instead of the [`repr()`](../library/functions.md#repr).

If *obj* is `NULL`, write the string `"<NULL>"`.

Return `0` on success or `-1` on failure; the
appropriate exception will be set.

### int PyFile_WriteString(const char \*s, [PyObject](structures.md#c.PyObject) \*p)

 *Part of the [Stable ABI](stable.md#stable).*

Write string *s* to file object *p*.  Return `0` on success or `-1` on
failure; the appropriate exception will be set.

## Soft-deprecated API

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.15.

These are APIs that were included in Python’s C API
by mistake. They are documented solely for completeness; use other
`PyFile*` APIs instead.

### [PyObject](structures.md#c.PyObject) \*PyFile_NewStdPrinter(int fd)

Use [`PyFile_FromFd()`](#c.PyFile_FromFd) with defaults (`fd, NULL, "w", -1, NULL, NULL, NULL, 0`) instead.

### [PyTypeObject](type.md#c.PyTypeObject) PyStdPrinter_Type

Type of file-like objects used internally at Python startup when [`io`](../library/io.md#module-io) is
not yet available.
Use Python [`open()`](../library/functions.md#open) or [`PyFile_FromFd()`](#c.PyFile_FromFd) to create file objects instead.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

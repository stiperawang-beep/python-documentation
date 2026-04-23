<a id="os"></a>

# Operating System Utilities

### [PyObject](structures.md#c.PyObject) \*PyOS_FSPath([PyObject](structures.md#c.PyObject) \*path)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.6.*

Return the file system representation for *path*. If the object is a
[`str`](../library/stdtypes.md#str) or [`bytes`](../library/stdtypes.md#bytes) object, then a new
[strong reference](../glossary.md#term-strong-reference) is returned.
If the object implements the [`os.PathLike`](../library/os.md#os.PathLike) interface,
then [`__fspath__()`](../library/os.md#os.PathLike.__fspath__) is returned as long as it is a
[`str`](../library/stdtypes.md#str) or [`bytes`](../library/stdtypes.md#bytes) object. Otherwise [`TypeError`](../library/exceptions.md#TypeError) is raised
and `NULL` is returned.

#### Versionadded
Added in version 3.6.

### int Py_FdIsInteractive(FILE \*fp, const char \*filename)

Return true (nonzero) if the standard I/O file *fp* with name *filename* is
deemed interactive.  This is the case for files for which `isatty(fileno(fp))`
is true.  If the [`PyConfig.interactive`](init_config.md#c.PyConfig.interactive) is non-zero, this function
also returns true if the *filename* pointer is `NULL` or if the name is equal to
one of the strings `'<stdin>'` or `'???'`.

This function must not be called before Python is initialized.

### void PyOS_BeforeFork()

 *Part of the [Stable ABI](stable.md#stable) on platforms with fork() since version 3.7.*

Function to prepare some internal state before a process fork.  This
should be called before calling `fork()` or any similar function
that clones the current process.
Only available on systems where `fork()` is defined.

#### WARNING
The C `fork()` call should only be made from the
[“main” thread](threads.md#fork-and-threads) (of the
[“main” interpreter](subinterpreters.md#sub-interpreter-support)).  The same is
true for `PyOS_BeforeFork()`.

#### Versionadded
Added in version 3.7.

### void PyOS_AfterFork_Parent()

 *Part of the [Stable ABI](stable.md#stable) on platforms with fork() since version 3.7.*

Function to update some internal state after a process fork.  This
should be called from the parent process after calling `fork()`
or any similar function that clones the current process, regardless
of whether process cloning was successful.
Only available on systems where `fork()` is defined.

#### WARNING
The C `fork()` call should only be made from the
[“main” thread](threads.md#fork-and-threads) (of the
[“main” interpreter](subinterpreters.md#sub-interpreter-support)).  The same is
true for `PyOS_AfterFork_Parent()`.

#### Versionadded
Added in version 3.7.

### void PyOS_AfterFork_Child()

 *Part of the [Stable ABI](stable.md#stable) on platforms with fork() since version 3.7.*

Function to update internal interpreter state after a process fork.
This must be called from the child process after calling `fork()`,
or any similar function that clones the current process, if there is
any chance the process will call back into the Python interpreter.
Only available on systems where `fork()` is defined.

#### WARNING
The C `fork()` call should only be made from the
[“main” thread](threads.md#fork-and-threads) (of the
[“main” interpreter](subinterpreters.md#sub-interpreter-support)).  The same is
true for `PyOS_AfterFork_Child()`.

#### Versionadded
Added in version 3.7.

#### SEE ALSO
[`os.register_at_fork()`](../library/os.md#os.register_at_fork) allows registering custom Python functions
to be called by [`PyOS_BeforeFork()`](#c.PyOS_BeforeFork),
[`PyOS_AfterFork_Parent()`](#c.PyOS_AfterFork_Parent) and  [`PyOS_AfterFork_Child()`](#c.PyOS_AfterFork_Child).

### void PyOS_AfterFork()

 *Part of the [Stable ABI](stable.md#stable) on platforms with fork().*

Function to update some internal state after a process fork; this should be
called in the new process if the Python interpreter will continue to be used.
If a new executable is loaded into the new process, this function does not need
to be called.

#### Deprecated
Deprecated since version 3.7: This function is superseded by [`PyOS_AfterFork_Child()`](#c.PyOS_AfterFork_Child).

### int PyOS_CheckStack()

 *Part of the [Stable ABI](stable.md#stable) on platforms with USE_STACKCHECK since version 3.7.*

<a id="index-0"></a>

Return true when the interpreter runs out of stack space.  This is a reliable
check, but is only available when `USE_STACKCHECK` is defined (currently
on certain versions of Windows using the Microsoft Visual C++ compiler).
`USE_STACKCHECK` will be defined automatically; you should never
change the definition in your own code.

### typedef void (\*PyOS_sighandler_t)(int)

 *Part of the [Stable ABI](stable.md#stable).*

### [PyOS_sighandler_t](#c.PyOS_sighandler_t) PyOS_getsig(int i)

 *Part of the [Stable ABI](stable.md#stable).*

Return the current signal handler for signal *i*.  This is a thin wrapper around
either `sigaction()` or `signal()`.  Do not call those functions
directly!

### [PyOS_sighandler_t](#c.PyOS_sighandler_t) PyOS_setsig(int i, [PyOS_sighandler_t](#c.PyOS_sighandler_t) h)

 *Part of the [Stable ABI](stable.md#stable).*

Set the signal handler for signal *i* to be *h*; return the old signal handler.
This is a thin wrapper around either `sigaction()` or `signal()`.  Do
not call those functions directly!

### int PyOS_InterruptOccurred(void)

 *Part of the [Stable ABI](stable.md#stable).*

Check if a `SIGINT` signal has been received.

Returns `1` if a `SIGINT` has occurred and clears the signal flag,
or `0` otherwise.

In most cases, you should prefer [`PyErr_CheckSignals()`](exceptions.md#c.PyErr_CheckSignals) over this function.
`PyErr_CheckSignals()` invokes the appropriate signal handlers
for all pending signals, allowing Python code to handle the signal properly.
This function only detects `SIGINT` and does not invoke any Python
signal handlers.

This function is async-signal-safe and this function cannot fail.
The caller must hold an [attached thread state](../glossary.md#term-attached-thread-state).

### wchar_t \*Py_DecodeLocale(const char \*arg, size_t \*size)

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

#### WARNING
This function should not be called directly: use the [`PyConfig`](init_config.md#c.PyConfig)
API with the [`PyConfig_SetBytesString()`](init_config.md#c.PyConfig_SetBytesString) function which ensures
that [Python is preinitialized](init_config.md#c-preinit).

This function must not be called before [Python is preinitialized](init_config.md#c-preinit) and so that the LC_CTYPE locale is properly configured: see
the [`Py_PreInitialize()`](init_config.md#c.Py_PreInitialize) function.

Decode a byte string from the [filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).
If the error handler is [surrogateescape error handler](../library/codecs.md#surrogateescape), undecodable bytes are decoded as characters in range
U+DC80..U+DCFF; and if a byte sequence can be decoded as a surrogate
character, the bytes are escaped using the surrogateescape error handler
instead of decoding them.

Return a pointer to a newly allocated wide character string, use
[`PyMem_RawFree()`](memory.md#c.PyMem_RawFree) to free the memory. If size is not `NULL`, write
the number of wide characters excluding the null character into `*size`

Return `NULL` on decoding error or memory allocation error. If *size* is
not `NULL`, `*size` is set to `(size_t)-1` on memory error or set to
`(size_t)-2` on decoding error.

The [filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler) are selected by
[`PyConfig_Read()`](init_config.md#c.PyConfig_Read): see [`filesystem_encoding`](init_config.md#c.PyConfig.filesystem_encoding) and
[`filesystem_errors`](init_config.md#c.PyConfig.filesystem_errors) members of [`PyConfig`](init_config.md#c.PyConfig).

Decoding errors should never happen, unless there is a bug in the C
library.

Use the [`Py_EncodeLocale()`](#c.Py_EncodeLocale) function to encode the character string
back to a byte string.

#### SEE ALSO
The [`PyUnicode_DecodeFSDefaultAndSize()`](unicode.md#c.PyUnicode_DecodeFSDefaultAndSize) and
[`PyUnicode_DecodeLocaleAndSize()`](unicode.md#c.PyUnicode_DecodeLocaleAndSize) functions.

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.7: The function now uses the UTF-8 encoding in the [Python UTF-8 Mode](../library/os.md#utf8-mode).

#### Versionchanged
Changed in version 3.8: The function now uses the UTF-8 encoding on Windows if
[`PyPreConfig.legacy_windows_fs_encoding`](init_config.md#c.PyPreConfig.legacy_windows_fs_encoding) is zero;

### char \*Py_EncodeLocale(const wchar_t \*text, size_t \*error_pos)

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Encode a wide character string to the [filesystem encoding and error
handler](../glossary.md#term-filesystem-encoding-and-error-handler). If the error handler is [surrogateescape error handler](../library/codecs.md#surrogateescape), surrogate characters in the range U+DC80..U+DCFF are
converted to bytes 0x80..0xFF.

Return a pointer to a newly allocated byte string, use [`PyMem_Free()`](memory.md#c.PyMem_Free)
to free the memory. Return `NULL` on encoding error or memory allocation
error.

If error_pos is not `NULL`, `*error_pos` is set to `(size_t)-1` on
success,  or set to the index of the invalid character on encoding error.

The [filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler) are selected by
[`PyConfig_Read()`](init_config.md#c.PyConfig_Read): see [`filesystem_encoding`](init_config.md#c.PyConfig.filesystem_encoding) and
[`filesystem_errors`](init_config.md#c.PyConfig.filesystem_errors) members of [`PyConfig`](init_config.md#c.PyConfig).

Use the [`Py_DecodeLocale()`](#c.Py_DecodeLocale) function to decode the bytes string back
to a wide character string.

#### WARNING
This function must not be called before [Python is preinitialized](init_config.md#c-preinit) and so that the LC_CTYPE locale is properly configured: see
the [`Py_PreInitialize()`](init_config.md#c.Py_PreInitialize) function.

#### SEE ALSO
The [`PyUnicode_EncodeFSDefault()`](unicode.md#c.PyUnicode_EncodeFSDefault) and
[`PyUnicode_EncodeLocale()`](unicode.md#c.PyUnicode_EncodeLocale) functions.

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.7: The function now uses the UTF-8 encoding in the [Python UTF-8 Mode](../library/os.md#utf8-mode).

#### Versionchanged
Changed in version 3.8: The function now uses the UTF-8 encoding on Windows if
[`PyPreConfig.legacy_windows_fs_encoding`](init_config.md#c.PyPreConfig.legacy_windows_fs_encoding) is zero.

### FILE \*Py_fopen([PyObject](structures.md#c.PyObject) \*path, const char \*mode)

Similar to `fopen()`, but *path* is a Python object and
an exception is set on error.

*path* must be a [`str`](../library/stdtypes.md#str) object, a [`bytes`](../library/stdtypes.md#bytes) object,
or a [path-like object](../glossary.md#term-path-like-object).

On success, return the new file pointer.
On error, set an exception and return `NULL`.

The file must be closed by [`Py_fclose()`](#c.Py_fclose) rather than calling directly
`fclose()`.

The file descriptor is created non-inheritable ([**PEP 446**](https://peps.python.org/pep-0446/)).

The caller must have an [attached thread state](../glossary.md#term-attached-thread-state).

#### Versionadded
Added in version 3.14.

### int Py_fclose(FILE \*file)

Close a file that was opened by [`Py_fopen()`](#c.Py_fopen).

On success, return `0`.
On error, return `EOF` and `errno` is set to indicate the error.
In either case, any further access (including another call to
[`Py_fclose()`](#c.Py_fclose)) to the stream results in undefined behavior.

#### Versionadded
Added in version 3.14.

<a id="systemfunctions"></a>

# System Functions

These are utility functions that make functionality from the [`sys`](../library/sys.md#module-sys) module
accessible to C code.  They all work with the current interpreter thread’s
[`sys`](../library/sys.md#module-sys) module’s dict, which is contained in the internal thread state structure.

### [PyObject](structures.md#c.PyObject) \*PySys_GetAttr([PyObject](structures.md#c.PyObject) \*name)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Get the attribute *name* of the [`sys`](../library/sys.md#module-sys) module.
Return a [strong reference](../glossary.md#term-strong-reference).
Raise [`RuntimeError`](../library/exceptions.md#RuntimeError) and return `NULL` if it does not exist or
if the [`sys`](../library/sys.md#module-sys) module cannot be found.

If the non-existing object should not be treated as a failure, you can use
[`PySys_GetOptionalAttr()`](#c.PySys_GetOptionalAttr) instead.

#### Versionadded
Added in version 3.15.

### [PyObject](structures.md#c.PyObject) \*PySys_GetAttrString(const char \*name)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

This is the same as [`PySys_GetAttr()`](#c.PySys_GetAttr), but *name* is
specified as a  UTF-8 encoded bytes string,
rather than a .

If the non-existing object should not be treated as a failure, you can use
[`PySys_GetOptionalAttrString()`](#c.PySys_GetOptionalAttrString) instead.

#### Versionadded
Added in version 3.15.

### int PySys_GetOptionalAttr([PyObject](structures.md#c.PyObject) \*name, [PyObject](structures.md#c.PyObject) \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Variant of [`PySys_GetAttr()`](#c.PySys_GetAttr) which doesn’t raise
exception if the object does not exist.

* Set  *\*result* to a new [strong reference](../glossary.md#term-strong-reference) to the object and
  return `1` if the object exists.
* Set  *\*result* to `NULL` and return `0` without setting an exception
  if the object does not exist.
* Set an exception, set  *\*result* to `NULL`, and return `-1`,
  if an error occurred.

#### Versionadded
Added in version 3.15.

### int PySys_GetOptionalAttrString(const char \*name, [PyObject](structures.md#c.PyObject) \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

This is the same as [`PySys_GetOptionalAttr()`](#c.PySys_GetOptionalAttr), but *name* is
specified as a  UTF-8 encoded bytes string,
rather than a .

#### Versionadded
Added in version 3.15.

### [PyObject](structures.md#c.PyObject) \*PySys_GetObject(const char \*name)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

Similar to [`PySys_GetAttrString()`](#c.PySys_GetAttrString), but return a [borrowed
reference](../glossary.md#term-borrowed-reference) and return `NULL` *without* setting exception on failure.

Preserves exception that was set before the call.

### int PySys_SetObject(const char \*name, [PyObject](structures.md#c.PyObject) \*v)

 *Part of the [Stable ABI](stable.md#stable).*

Set *name* in the [`sys`](../library/sys.md#module-sys) module to *v* unless *v* is `NULL`, in which
case *name* is deleted from the sys module. Returns `0` on success, `-1`
on error.

### void PySys_WriteStdout(const char \*format, ...)

 *Part of the [Stable ABI](stable.md#stable).*

Write the output string described by *format* to [`sys.stdout`](../library/sys.md#sys.stdout).  No
exceptions are raised, even if truncation occurs (see below).

*format* should limit the total size of the formatted output string to
1000 bytes or less – after 1000 bytes, the output string is truncated.
In particular, this means that no unrestricted “%s” formats should occur;
these should be limited using “%.<N>s” where <N> is a decimal number
calculated so that <N> plus the maximum size of other formatted text does not
exceed 1000 bytes.  Also watch out for “%f”, which can print hundreds of
digits for very large numbers.

If a problem occurs, or [`sys.stdout`](../library/sys.md#sys.stdout) is unset, the formatted message
is written to the real (C level) *stdout*.

### void PySys_WriteStderr(const char \*format, ...)

 *Part of the [Stable ABI](stable.md#stable).*

As [`PySys_WriteStdout()`](#c.PySys_WriteStdout), but write to [`sys.stderr`](../library/sys.md#sys.stderr) or *stderr*
instead.

### void PySys_FormatStdout(const char \*format, ...)

 *Part of the [Stable ABI](stable.md#stable).*

Function similar to PySys_WriteStdout() but format the message using
[`PyUnicode_FromFormatV()`](unicode.md#c.PyUnicode_FromFormatV) and don’t truncate the message to an
arbitrary length.

#### Versionadded
Added in version 3.2.

### void PySys_FormatStderr(const char \*format, ...)

 *Part of the [Stable ABI](stable.md#stable).*

As [`PySys_FormatStdout()`](#c.PySys_FormatStdout), but write to [`sys.stderr`](../library/sys.md#sys.stderr) or *stderr*
instead.

#### Versionadded
Added in version 3.2.

### [PyObject](structures.md#c.PyObject) \*PySys_GetXOptions()

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Return the current dictionary of [`-X`](../using/cmdline.md#cmdoption-X) options, similarly to
[`sys._xoptions`](../library/sys.md#sys._xoptions).  On error, `NULL` is returned and an exception is
set.

#### Versionadded
Added in version 3.2.

### int PySys_Audit(const char \*event, const char \*format, ...)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Raise an auditing event with any active hooks. Return zero for success
and non-zero with an exception set on failure.

The *event* string argument must not be *NULL*.

If any hooks have been added, *format* and other arguments will be used
to construct a tuple to pass. Apart from `N`, the same format characters
as used in [`Py_BuildValue()`](arg.md#c.Py_BuildValue) are available. If the built value is not
a tuple, it will be added into a single-element tuple.

The `N` format option must not be used. It consumes a reference, but since
there is no way to know whether arguments to this function will be consumed,
using it may cause reference leaks.

Note that `#` format characters should always be treated as
[`Py_ssize_t`](intro.md#c.Py_ssize_t), regardless of whether `PY_SSIZE_T_CLEAN` was defined.

[`sys.audit()`](../library/sys.md#sys.audit) performs the same function from Python code.

See also [`PySys_AuditTuple()`](#c.PySys_AuditTuple).

#### Versionadded
Added in version 3.8.

#### Versionchanged
Changed in version 3.8.2: Require [`Py_ssize_t`](intro.md#c.Py_ssize_t) for `#` format characters. Previously, an
unavoidable deprecation warning was raised.

### int PySys_AuditTuple(const char \*event, [PyObject](structures.md#c.PyObject) \*args)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Similar to [`PySys_Audit()`](#c.PySys_Audit), but pass arguments as a Python object.
*args* must be a [`tuple`](../library/stdtypes.md#tuple). To pass no arguments, *args* can be *NULL*.

#### Versionadded
Added in version 3.13.

### int PySys_AddAuditHook([Py_AuditHookFunction](#c.Py_AuditHookFunction) hook, void \*userData)

Append the callable *hook* to the list of active auditing hooks.
Return zero on success
and non-zero on failure. If the runtime has been initialized, also set an
error on failure. Hooks added through this API are called for all
interpreters created by the runtime.

The *userData* pointer is passed into the hook function. Since hook
functions may be called from different runtimes, this pointer should not
refer directly to Python state.

This function is safe to call before [`Py_Initialize()`](interp-lifecycle.md#c.Py_Initialize). When called
after runtime initialization, existing audit hooks are notified and may
silently abort the operation by raising an error subclassed from
[`Exception`](../library/exceptions.md#Exception) (other errors will not be silenced).

The hook function is always called with an [attached thread state](../glossary.md#term-attached-thread-state) by
the Python interpreter that raised the event.

See [**PEP 578**](https://peps.python.org/pep-0578/) for a detailed description of auditing.  Functions in the
runtime and standard library that raise events are listed in the
[audit events table](../library/audit_events.md#audit-events).
Details are in each function’s documentation.

If the interpreter is initialized, this function raises an auditing event
`sys.addaudithook` with no arguments. If any existing hooks raise an
exception derived from [`Exception`](../library/exceptions.md#Exception), the new hook will not be
added and the exception is cleared. As a result, callers cannot assume
that their hook has been added unless they control all existing hooks.

### typedef int (\*Py_AuditHookFunction)(const char \*event, [PyObject](structures.md#c.PyObject) \*args, void \*userData)

The type of the hook function.
*event* is the C string event argument passed to [`PySys_Audit()`](#c.PySys_Audit) or
[`PySys_AuditTuple()`](#c.PySys_AuditTuple).
*args* is guaranteed to be a [`PyTupleObject`](tuple.md#c.PyTupleObject).
*userData* is the argument passed to PySys_AddAuditHook().

#### Versionadded
Added in version 3.8.

<a id="processcontrol"></a>

# Process Control

### void Py_FatalError(const char \*message)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-3"></a>

Print a fatal error message and kill the process.  No cleanup is performed.
This function should only be invoked when a condition is detected that would
make it dangerous to continue using the Python interpreter; e.g., when the
object administration appears to be corrupted.  On Unix, the standard C library
function `abort()` is called which will attempt to produce a `core`
file.

The `Py_FatalError()` function is replaced with a macro which logs
automatically the name of the current function, unless the
`Py_LIMITED_API` macro is defined.

#### Versionchanged
Changed in version 3.9: Log the function name automatically.

### void Py_Exit(int status)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-4"></a>

Exit the current process.  This calls [`Py_FinalizeEx()`](interp-lifecycle.md#c.Py_FinalizeEx) and then calls the
standard C library function `exit(status)`.  If [`Py_FinalizeEx()`](interp-lifecycle.md#c.Py_FinalizeEx)
indicates an error, the exit status is set to 120.

#### Versionchanged
Changed in version 3.6: Errors from finalization no longer ignored.

### int Py_AtExit(void (\*func)())

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-5"></a>

Register a cleanup function to be called by [`Py_FinalizeEx()`](interp-lifecycle.md#c.Py_FinalizeEx).  The cleanup
function will be called with no arguments and should return no value.  At most
32 cleanup functions can be registered.  When the registration is successful,
[`Py_AtExit()`](#c.Py_AtExit) returns `0`; on failure, it returns `-1`.  The cleanup
function registered last is called first. Each cleanup function will be called
at most once.  Since Python’s internal finalization will have completed before
the cleanup function, no Python APIs should be called by *func*.

#### SEE ALSO
[`PyUnstable_AtExit()`](interp-lifecycle.md#c.PyUnstable_AtExit) for passing a `void *data` argument.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

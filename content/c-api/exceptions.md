<a id="exceptionhandling"></a>

# Exception Handling

The functions described in this chapter will let you handle and raise Python
exceptions.  It is important to understand some of the basics of Python
exception handling.  It works somewhat like the POSIX `errno` variable:
there is a global indicator (per thread) of the last error that occurred.  Most
C API functions don’t clear this on success, but will set it to indicate the
cause of the error on failure.  Most C API functions also return an error
indicator, usually `NULL` if they are supposed to return a pointer, or `-1`
if they return an integer (exception: the `PyArg_*` functions
return `1` for success and `0` for failure).

Concretely, the error indicator consists of three object pointers: the
exception’s type, the exception’s value, and the traceback object.  Any
of those pointers can be `NULL` if non-set (although some combinations are
forbidden, for example you can’t have a non-`NULL` traceback if the exception
type is `NULL`).

When a function must fail because some function it called failed, it generally
doesn’t set the error indicator; the function it called already set it.  It is
responsible for either handling the error and clearing the exception or
returning after cleaning up any resources it holds (such as object references or
memory allocations); it should *not* continue normally if it is not prepared to
handle the error.  If returning due to an error, it is important to indicate to
the caller that an error has been set.  If the error is not handled or carefully
propagated, additional calls into the Python/C API may not behave as intended
and may fail in mysterious ways.

#### NOTE
The error indicator is **not** the result of [`sys.exc_info()`](../library/sys.md#sys.exc_info).
The former corresponds to an exception that is not yet caught (and is
therefore still propagating), while the latter returns an exception after
it is caught (and has therefore stopped propagating).

## Printing and clearing

### void PyErr_Clear()

 *Part of the [Stable ABI](stable.md#stable).*

Clear the error indicator.  If the error indicator is not set, there is no
effect.

### void PyErr_PrintEx(int set_sys_last_vars)

 *Part of the [Stable ABI](stable.md#stable).*

Print a standard traceback to `sys.stderr` and clear the error indicator.
**Unless** the error is a `SystemExit`, in that case no traceback is
printed and the Python process will exit with the error code specified by
the `SystemExit` instance.

Call this function **only** when the error indicator is set.  Otherwise it
will cause a fatal error!

If *set_sys_last_vars* is nonzero, the variable [`sys.last_exc`](../library/sys.md#sys.last_exc) is
set to the printed exception. For backwards compatibility, the
deprecated variables [`sys.last_type`](../library/sys.md#sys.last_type), [`sys.last_value`](../library/sys.md#sys.last_value) and
[`sys.last_traceback`](../library/sys.md#sys.last_traceback) are also set to the type, value and traceback
of this exception, respectively.

#### Versionchanged
Changed in version 3.12: The setting of [`sys.last_exc`](../library/sys.md#sys.last_exc) was added.

### void PyErr_Print()

 *Part of the [Stable ABI](stable.md#stable).*

Alias for `PyErr_PrintEx(1)`.

### void PyErr_WriteUnraisable([PyObject](structures.md#c.PyObject) \*obj)

 *Part of the [Stable ABI](stable.md#stable).*

Call [`sys.unraisablehook()`](../library/sys.md#sys.unraisablehook) using the current exception and *obj*
argument.

This utility function prints a warning message to `sys.stderr` when an
exception has been set but it is impossible for the interpreter to actually
raise the exception.  It is used, for example, when an exception occurs in an
[`__del__()`](../reference/datamodel.md#object.__del__) method.

The function is called with a single argument *obj* that identifies the context
in which the unraisable exception occurred. If possible,
the repr of *obj* will be printed in the warning message.
If *obj* is `NULL`, only the traceback is printed.

An exception must be set when calling this function.

#### Versionchanged
Changed in version 3.4: Print a traceback. Print only traceback if *obj* is `NULL`.

#### Versionchanged
Changed in version 3.8: Use [`sys.unraisablehook()`](../library/sys.md#sys.unraisablehook).

### void PyErr_FormatUnraisable(const char \*format, ...)

Similar to [`PyErr_WriteUnraisable()`](#c.PyErr_WriteUnraisable), but the *format* and subsequent
parameters help format the warning message; they have the same meaning and
values as in [`PyUnicode_FromFormat()`](unicode.md#c.PyUnicode_FromFormat).
`PyErr_WriteUnraisable(obj)` is roughly equivalent to
`PyErr_FormatUnraisable("Exception ignored in: %R", obj)`.
If *format* is `NULL`, only the traceback is printed.

#### Versionadded
Added in version 3.13.

### void PyErr_DisplayException([PyObject](structures.md#c.PyObject) \*exc)

 *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

Print the standard traceback display of `exc` to `sys.stderr`, including
chained exceptions and notes.

#### Versionadded
Added in version 3.12.

## Raising exceptions

These functions help you set the current thread’s error indicator.
For convenience, some of these functions will always return a
`NULL` pointer for use in a `return` statement.

### void PyErr_SetString([PyObject](structures.md#c.PyObject) \*type, const char \*message)

 *Part of the [Stable ABI](stable.md#stable).*

This is the most common way to set the error indicator.  The first argument
specifies the exception type; it is normally one of the standard exceptions,
e.g. [`PyExc_RuntimeError`](#c.PyExc_RuntimeError).  You need not create a new
[strong reference](../glossary.md#term-strong-reference) to it (e.g. with [`Py_INCREF()`](refcounting.md#c.Py_INCREF)).
The second argument is an error message; it is decoded from `'utf-8'`.

### void PyErr_SetObject([PyObject](structures.md#c.PyObject) \*type, [PyObject](structures.md#c.PyObject) \*value)

 *Part of the [Stable ABI](stable.md#stable).*

This function is similar to [`PyErr_SetString()`](#c.PyErr_SetString) but lets you specify an
arbitrary Python object for the “value” of the exception.

### [PyObject](structures.md#c.PyObject) \*PyErr_Format([PyObject](structures.md#c.PyObject) \*exception, const char \*format, ...)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable).*

This function sets the error indicator and returns `NULL`.  *exception*
should be a Python exception class.  The *format* and subsequent
parameters help format the error message; they have the same meaning and
values as in [`PyUnicode_FromFormat()`](unicode.md#c.PyUnicode_FromFormat). *format* is an ASCII-encoded
string.

### [PyObject](structures.md#c.PyObject) \*PyErr_FormatV([PyObject](structures.md#c.PyObject) \*exception, const char \*format, va_list vargs)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) since version 3.5.*

Same as [`PyErr_Format()`](#c.PyErr_Format), but taking a `va_list` argument rather
than a variable number of arguments.

#### Versionadded
Added in version 3.5.

### void PyErr_SetNone([PyObject](structures.md#c.PyObject) \*type)

 *Part of the [Stable ABI](stable.md#stable).*

This is a shorthand for `PyErr_SetObject(type, Py_None)`.

### int PyErr_BadArgument()

 *Part of the [Stable ABI](stable.md#stable).*

This is a shorthand for `PyErr_SetString(PyExc_TypeError, message)`, where
*message* indicates that a built-in operation was invoked with an illegal
argument.  It is mostly for internal use.

### [PyObject](structures.md#c.PyObject) \*PyErr_NoMemory()

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable).*

This is a shorthand for `PyErr_SetNone(PyExc_MemoryError)`; it returns `NULL`
so an object allocation function can write `return PyErr_NoMemory();` when it
runs out of memory.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetFromErrno([PyObject](structures.md#c.PyObject) \*type)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-0"></a>

This is a convenience function to raise an exception when a C library function
has returned an error and set the C variable `errno`.  It constructs a
tuple object whose first item is the integer `errno` value and whose
second item is the corresponding error message (gotten from `strerror()`),
and then calls `PyErr_SetObject(type, object)`.  On Unix, when the
`errno` value is `EINTR`, indicating an interrupted system call,
this calls [`PyErr_CheckSignals()`](#c.PyErr_CheckSignals), and if that set the error indicator,
leaves it set to that.  The function always returns `NULL`, so a wrapper
function around a system call can write `return PyErr_SetFromErrno(type);`
when the system call returns an error.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetFromErrnoWithFilenameObject([PyObject](structures.md#c.PyObject) \*type, [PyObject](structures.md#c.PyObject) \*filenameObject)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable).*

Similar to [`PyErr_SetFromErrno()`](#c.PyErr_SetFromErrno), with the additional behavior that if
*filenameObject* is not `NULL`, it is passed to the constructor of *type* as
a third parameter.  In the case of [`OSError`](../library/exceptions.md#OSError) exception,
this is used to define the `filename` attribute of the
exception instance.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetFromErrnoWithFilenameObjects([PyObject](structures.md#c.PyObject) \*type, [PyObject](structures.md#c.PyObject) \*filenameObject, [PyObject](structures.md#c.PyObject) \*filenameObject2)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Similar to [`PyErr_SetFromErrnoWithFilenameObject()`](#c.PyErr_SetFromErrnoWithFilenameObject), but takes a second
filename object, for raising errors when a function that takes two filenames
fails.

#### Versionadded
Added in version 3.4.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetFromErrnoWithFilename([PyObject](structures.md#c.PyObject) \*type, const char \*filename)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable).*

Similar to [`PyErr_SetFromErrnoWithFilenameObject()`](#c.PyErr_SetFromErrnoWithFilenameObject), but the filename
is given as a C string.  *filename* is decoded from the [filesystem
encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).

### [PyObject](structures.md#c.PyObject) \*PyErr_SetFromWindowsErr(int ierr)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) on Windows since version 3.7.*

This is a convenience function to raise [`OSError`](../library/exceptions.md#OSError). If called with
*ierr* of `0`, the error code returned by a call to `GetLastError()`
is used instead.  It calls the Win32 function `FormatMessage()` to retrieve
the Windows description of error code given by *ierr* or `GetLastError()`,
then it constructs a [`OSError`](../library/exceptions.md#OSError) object with the [`winerror`](../library/exceptions.md#OSError.winerror)
attribute set to the error code, the [`strerror`](../library/exceptions.md#OSError.strerror) attribute
set to the corresponding error message (gotten from
`FormatMessage()`), and then calls `PyErr_SetObject(PyExc_OSError,
object)`. This function always returns `NULL`.

[Availability](../library/intro.md#availability): Windows.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetExcFromWindowsErr([PyObject](structures.md#c.PyObject) \*type, int ierr)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) on Windows since version 3.7.*

Similar to [`PyErr_SetFromWindowsErr()`](#c.PyErr_SetFromWindowsErr), with an additional parameter
specifying the exception type to be raised.

[Availability](../library/intro.md#availability): Windows.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetFromWindowsErrWithFilename(int ierr, const char \*filename)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) on Windows since version 3.7.*

Similar to [`PyErr_SetFromWindowsErr()`](#c.PyErr_SetFromWindowsErr), with the additional behavior
that if *filename* is not `NULL`, it is decoded from the filesystem
encoding ([`os.fsdecode()`](../library/os.md#os.fsdecode)) and passed to the constructor of
[`OSError`](../library/exceptions.md#OSError) as a third parameter to be used to define the
`filename` attribute of the exception instance.

[Availability](../library/intro.md#availability): Windows.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetExcFromWindowsErrWithFilenameObject([PyObject](structures.md#c.PyObject) \*type, int ierr, [PyObject](structures.md#c.PyObject) \*filename)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) on Windows since version 3.7.*

Similar to [`PyErr_SetExcFromWindowsErr()`](#c.PyErr_SetExcFromWindowsErr), with the additional behavior
that if *filename* is not `NULL`, it is passed to the constructor of
[`OSError`](../library/exceptions.md#OSError) as a third parameter to be used to define the
`filename` attribute of the exception instance.

[Availability](../library/intro.md#availability): Windows.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetExcFromWindowsErrWithFilenameObjects([PyObject](structures.md#c.PyObject) \*type, int ierr, [PyObject](structures.md#c.PyObject) \*filename, [PyObject](structures.md#c.PyObject) \*filename2)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) on Windows since version 3.7.*

Similar to [`PyErr_SetExcFromWindowsErrWithFilenameObject()`](#c.PyErr_SetExcFromWindowsErrWithFilenameObject),
but accepts a second filename object.

[Availability](../library/intro.md#availability): Windows.

#### Versionadded
Added in version 3.4.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetExcFromWindowsErrWithFilename([PyObject](structures.md#c.PyObject) \*type, int ierr, const char \*filename)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) on Windows since version 3.7.*

Similar to [`PyErr_SetFromWindowsErrWithFilename()`](#c.PyErr_SetFromWindowsErrWithFilename), with an additional
parameter specifying the exception type to be raised.

[Availability](../library/intro.md#availability): Windows.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetImportError([PyObject](structures.md#c.PyObject) \*msg, [PyObject](structures.md#c.PyObject) \*name, [PyObject](structures.md#c.PyObject) \*path)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

This is a convenience function to raise [`ImportError`](../library/exceptions.md#ImportError). *msg* will be
set as the exception’s message string. *name* and *path*, both of which can
be `NULL`, will be set as the [`ImportError`](../library/exceptions.md#ImportError)’s respective `name`
and `path` attributes.

#### Versionadded
Added in version 3.3.

### [PyObject](structures.md#c.PyObject) \*PyErr_SetImportErrorSubclass([PyObject](structures.md#c.PyObject) \*exception, [PyObject](structures.md#c.PyObject) \*msg, [PyObject](structures.md#c.PyObject) \*name, [PyObject](structures.md#c.PyObject) \*path)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable) since version 3.6.*

Much like [`PyErr_SetImportError()`](#c.PyErr_SetImportError) but this function allows for
specifying a subclass of [`ImportError`](../library/exceptions.md#ImportError) to raise.

#### Versionadded
Added in version 3.6.

### void PyErr_SyntaxLocationObject([PyObject](structures.md#c.PyObject) \*filename, int lineno, int col_offset)

Set file, line, and offset information for the current exception.  If the
current exception is not a [`SyntaxError`](../library/exceptions.md#SyntaxError), then it sets additional
attributes, which make the exception printing subsystem think the exception
is a [`SyntaxError`](../library/exceptions.md#SyntaxError).

#### Versionadded
Added in version 3.4.

### void PyErr_RangedSyntaxLocationObject([PyObject](structures.md#c.PyObject) \*filename, int lineno, int col_offset, int end_lineno, int end_col_offset)

Similar to [`PyErr_SyntaxLocationObject()`](#c.PyErr_SyntaxLocationObject), but also sets the
*end_lineno* and *end_col_offset* information for the current exception.

#### Versionadded
Added in version 3.10.

### void PyErr_SyntaxLocationEx(const char \*filename, int lineno, int col_offset)

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Like [`PyErr_SyntaxLocationObject()`](#c.PyErr_SyntaxLocationObject), but *filename* is a byte string
decoded from the [filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).

#### Versionadded
Added in version 3.2.

### void PyErr_SyntaxLocation(const char \*filename, int lineno)

 *Part of the [Stable ABI](stable.md#stable).*

Like [`PyErr_SyntaxLocationEx()`](#c.PyErr_SyntaxLocationEx), but the *col_offset* parameter is
omitted.

### void PyErr_BadInternalCall()

 *Part of the [Stable ABI](stable.md#stable).*

This is a shorthand for `PyErr_SetString(PyExc_SystemError, message)`,
where *message* indicates that an internal operation (e.g. a Python/C API
function) was invoked with an illegal argument.  It is mostly for internal
use.

### [PyObject](structures.md#c.PyObject) \*PyErr_ProgramTextObject([PyObject](structures.md#c.PyObject) \*filename, int lineno)

Get the source line in *filename* at line *lineno*. *filename* should be a
Python [`str`](../library/stdtypes.md#str) object.

On success, this function returns a Python string object with the found line.
On failure, this function returns `NULL` without an exception set.

### [PyObject](structures.md#c.PyObject) \*PyErr_ProgramText(const char \*filename, int lineno)

 *Part of the [Stable ABI](stable.md#stable).*

Similar to [`PyErr_ProgramTextObject()`](#c.PyErr_ProgramTextObject), but *filename* is a
, which is decoded with the
[filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler), instead of a
Python object reference.

## Issuing warnings

Use these functions to issue warnings from C code.  They mirror similar
functions exported by the Python [`warnings`](../library/warnings.md#module-warnings) module.  They normally
print a warning message to *sys.stderr*; however, it is
also possible that the user has specified that warnings are to be turned into
errors, and in that case they will raise an exception.  It is also possible that
the functions raise an exception because of a problem with the warning machinery.
The return value is `0` if no exception is raised, or `-1` if an exception
is raised.  (It is not possible to determine whether a warning message is
actually printed, nor what the reason is for the exception; this is
intentional.)  If an exception is raised, the caller should do its normal
exception handling (for example, [`Py_DECREF()`](refcounting.md#c.Py_DECREF) owned references and return
an error value).

### int PyErr_WarnEx([PyObject](structures.md#c.PyObject) \*category, const char \*message, [Py_ssize_t](intro.md#c.Py_ssize_t) stack_level)

 *Part of the [Stable ABI](stable.md#stable).*

Issue a warning message.  The *category* argument is a warning category (see
below) or `NULL`; the *message* argument is a UTF-8 encoded string.  *stack_level* is a
positive number giving a number of stack frames; the warning will be issued from
the  currently executing line of code in that stack frame.  A *stack_level* of 1
is the function calling [`PyErr_WarnEx()`](#c.PyErr_WarnEx), 2 is  the function above that,
and so forth.

Warning categories must be subclasses of [`PyExc_Warning`](#c.PyExc_Warning);
[`PyExc_Warning`](#c.PyExc_Warning) is a subclass of [`PyExc_Exception`](#c.PyExc_Exception);
the default warning category is [`PyExc_RuntimeWarning`](#c.PyExc_RuntimeWarning). The standard
Python warning categories are available as global variables whose names are
enumerated at [Warning types](#standardwarningcategories).

For information about warning control, see the documentation for the
[`warnings`](../library/warnings.md#module-warnings) module and the [`-W`](../using/cmdline.md#cmdoption-W) option in the command line
documentation.  There is no C API for warning control.

### int PyErr_WarnExplicitObject([PyObject](structures.md#c.PyObject) \*category, [PyObject](structures.md#c.PyObject) \*message, [PyObject](structures.md#c.PyObject) \*filename, int lineno, [PyObject](structures.md#c.PyObject) \*module, [PyObject](structures.md#c.PyObject) \*registry)

Issue a warning message with explicit control over all warning attributes.  This
is a straightforward wrapper around the Python function
[`warnings.warn_explicit()`](../library/warnings.md#warnings.warn_explicit); see there for more information.  The *module*
and *registry* arguments may be set to `NULL` to get the default effect
described there.

#### Versionadded
Added in version 3.4.

### int PyErr_WarnExplicit([PyObject](structures.md#c.PyObject) \*category, const char \*message, const char \*filename, int lineno, const char \*module, [PyObject](structures.md#c.PyObject) \*registry)

 *Part of the [Stable ABI](stable.md#stable).*

Similar to [`PyErr_WarnExplicitObject()`](#c.PyErr_WarnExplicitObject) except that *message* and
*module* are UTF-8 encoded strings, and *filename* is decoded from the
[filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).

### int PyErr_WarnFormat([PyObject](structures.md#c.PyObject) \*category, [Py_ssize_t](intro.md#c.Py_ssize_t) stack_level, const char \*format, ...)

 *Part of the [Stable ABI](stable.md#stable).*

Function similar to [`PyErr_WarnEx()`](#c.PyErr_WarnEx), but use
[`PyUnicode_FromFormat()`](unicode.md#c.PyUnicode_FromFormat) to format the warning message.  *format* is
an ASCII-encoded string.

#### Versionadded
Added in version 3.2.

### int PyErr_WarnExplicitFormat([PyObject](structures.md#c.PyObject) \*category, const char \*filename, int lineno, const char \*module, [PyObject](structures.md#c.PyObject) \*registry, const char \*format, ...)

Similar to [`PyErr_WarnExplicit()`](#c.PyErr_WarnExplicit), but uses
[`PyUnicode_FromFormat()`](unicode.md#c.PyUnicode_FromFormat) to format the warning message. *format* is
an ASCII-encoded string.

#### Versionadded
Added in version 3.2.

### int PyErr_ResourceWarning([PyObject](structures.md#c.PyObject) \*source, [Py_ssize_t](intro.md#c.Py_ssize_t) stack_level, const char \*format, ...)

 *Part of the [Stable ABI](stable.md#stable) since version 3.6.*

Function similar to [`PyErr_WarnFormat()`](#c.PyErr_WarnFormat), but *category* is
[`ResourceWarning`](../library/exceptions.md#ResourceWarning) and it passes *source* to `warnings.WarningMessage`.

#### Versionadded
Added in version 3.6.

## Querying the error indicator

### [PyObject](structures.md#c.PyObject) \*PyErr_Occurred()

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

Test whether the error indicator is set.  If set, return the exception *type*
(the first argument to the last call to one of the `PyErr_Set*`
functions or to [`PyErr_Restore()`](#c.PyErr_Restore)).  If not set, return `NULL`.  You do not
own a reference to the return value, so you do not need to [`Py_DECREF()`](refcounting.md#c.Py_DECREF)
it.

The caller must have an [attached thread state](../glossary.md#term-attached-thread-state).

#### NOTE
Do not compare the return value to a specific exception; use
[`PyErr_ExceptionMatches()`](#c.PyErr_ExceptionMatches) instead, shown below.  (The comparison could
easily fail since the exception may be an instance instead of a class, in the
case of a class exception, or it may be a subclass of the expected exception.)

### int PyErr_ExceptionMatches([PyObject](structures.md#c.PyObject) \*exc)

 *Part of the [Stable ABI](stable.md#stable).*

Equivalent to `PyErr_GivenExceptionMatches(PyErr_Occurred(), exc)`.  This
should only be called when an exception is actually set; a memory access
violation will occur if no exception has been raised.

### int PyErr_GivenExceptionMatches([PyObject](structures.md#c.PyObject) \*given, [PyObject](structures.md#c.PyObject) \*exc)

 *Part of the [Stable ABI](stable.md#stable).*

Return true if the *given* exception matches the exception type in *exc*.  If
*exc* is a class object, this also returns true when *given* is an instance
of a subclass.  If *exc* is a tuple, all exception types in the tuple (and
recursively in subtuples) are searched for a match.

### [PyObject](structures.md#c.PyObject) \*PyErr_GetRaisedException(void)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

Return the exception currently being raised, clearing the error indicator at
the same time. Return `NULL` if the error indicator is not set.

This function is used by code that needs to catch exceptions,
or code that needs to save and restore the error indicator temporarily.

For example:

```c
{
   PyObject *exc = PyErr_GetRaisedException();

   /* ... code that might produce other errors ... */

   PyErr_SetRaisedException(exc);
}
```

#### SEE ALSO
[`PyErr_GetHandledException()`](#c.PyErr_GetHandledException),
to save the exception currently being handled.

#### Versionadded
Added in version 3.12.

### void PyErr_SetRaisedException([PyObject](structures.md#c.PyObject) \*exc)

 *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

Set *exc* as the exception currently being raised,
clearing the existing exception if one is set.

#### WARNING
This call steals a reference to *exc*, which must be a valid exception.

#### Versionadded
Added in version 3.12.

### void PyErr_Fetch([PyObject](structures.md#c.PyObject) \*\*ptype, [PyObject](structures.md#c.PyObject) \*\*pvalue, [PyObject](structures.md#c.PyObject) \*\*ptraceback)

 *Part of the [Stable ABI](stable.md#stable).*

#### Deprecated
Deprecated since version 3.12: Use [`PyErr_GetRaisedException()`](#c.PyErr_GetRaisedException) instead.

Retrieve the error indicator into three variables whose addresses are passed.
If the error indicator is not set, set all three variables to `NULL`.  If it is
set, it will be cleared and you own a reference to each object retrieved.  The
value and traceback object may be `NULL` even when the type object is not.

#### NOTE
This function is normally only used by legacy code that needs to catch
exceptions or save and restore the error indicator temporarily.

For example:

```c
{
   PyObject *type, *value, *traceback;
   PyErr_Fetch(&type, &value, &traceback);

   /* ... code that might produce other errors ... */

   PyErr_Restore(type, value, traceback);
}
```

### void PyErr_Restore([PyObject](structures.md#c.PyObject) \*type, [PyObject](structures.md#c.PyObject) \*value, [PyObject](structures.md#c.PyObject) \*traceback)

 *Part of the [Stable ABI](stable.md#stable).*

#### Deprecated
Deprecated since version 3.12: Use [`PyErr_SetRaisedException()`](#c.PyErr_SetRaisedException) instead.

Set the error indicator from the three objects,
*type*, *value*, and *traceback*,
clearing the existing exception if one is set.
If the objects are `NULL`, the error
indicator is cleared.  Do not pass a `NULL` type and non-`NULL` value or
traceback.  The exception type should be a class.  Do not pass an invalid
exception type or value. (Violating these rules will cause subtle problems
later.)  This call takes away a reference to each object: you must own a
reference to each object before the call and after the call you no longer own
these references.  (If you don’t understand this, don’t use this function.  I
warned you.)

#### NOTE
This function is normally only used by legacy code that needs to
save and restore the error indicator temporarily.
Use [`PyErr_Fetch()`](#c.PyErr_Fetch) to save the current error indicator.

### void PyErr_NormalizeException([PyObject](structures.md#c.PyObject) \*\*exc, [PyObject](structures.md#c.PyObject) \*\*val, [PyObject](structures.md#c.PyObject) \*\*tb)

 *Part of the [Stable ABI](stable.md#stable).*

#### Deprecated
Deprecated since version 3.12: Use [`PyErr_GetRaisedException()`](#c.PyErr_GetRaisedException) instead,
to avoid any possible de-normalization.

Under certain circumstances, the values returned by [`PyErr_Fetch()`](#c.PyErr_Fetch) below
can be “unnormalized”, meaning that `*exc` is a class object but `*val` is
not an instance of the  same class.  This function can be used to instantiate
the class in that case.  If the values are already normalized, nothing happens.
The delayed normalization is implemented to improve performance.

#### NOTE
This function *does not* implicitly set the
[`__traceback__`](../library/exceptions.md#BaseException.__traceback__)
attribute on the exception value. If setting the traceback
appropriately is desired, the following additional snippet is needed:

```c
if (tb != NULL) {
  PyException_SetTraceback(val, tb);
}
```

### [PyObject](structures.md#c.PyObject) \*PyErr_GetHandledException(void)

 *Part of the [Stable ABI](stable.md#stable) since version 3.11.*

Retrieve the active exception instance, as would be returned by [`sys.exception()`](../library/sys.md#sys.exception).
This refers to an exception that was *already caught*, not to an exception that was
freshly raised. Returns a new reference to the exception or `NULL`.
Does not modify the interpreter’s exception state.

#### NOTE
This function is not normally used by code that wants to handle exceptions.
Rather, it can be used when code needs to save and restore the exception
state temporarily.  Use [`PyErr_SetHandledException()`](#c.PyErr_SetHandledException) to restore or
clear the exception state.

#### Versionadded
Added in version 3.11.

### void PyErr_SetHandledException([PyObject](structures.md#c.PyObject) \*exc)

 *Part of the [Stable ABI](stable.md#stable) since version 3.11.*

Set the active exception, as known from `sys.exception()`.  This refers
to an exception that was *already caught*, not to an exception that was
freshly raised.
To clear the exception state, pass `NULL`.

#### NOTE
This function is not normally used by code that wants to handle exceptions.
Rather, it can be used when code needs to save and restore the exception
state temporarily.  Use [`PyErr_GetHandledException()`](#c.PyErr_GetHandledException) to get the exception
state.

#### Versionadded
Added in version 3.11.

### void PyErr_GetExcInfo([PyObject](structures.md#c.PyObject) \*\*ptype, [PyObject](structures.md#c.PyObject) \*\*pvalue, [PyObject](structures.md#c.PyObject) \*\*ptraceback)

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Retrieve the old-style representation of the exception info, as known from
[`sys.exc_info()`](../library/sys.md#sys.exc_info).  This refers to an exception that was *already caught*,
not to an exception that was freshly raised.  Returns new references for the
three objects, any of which may be `NULL`.  Does not modify the exception
info state.  This function is kept for backwards compatibility. Prefer using
[`PyErr_GetHandledException()`](#c.PyErr_GetHandledException).

#### NOTE
This function is not normally used by code that wants to handle exceptions.
Rather, it can be used when code needs to save and restore the exception
state temporarily.  Use [`PyErr_SetExcInfo()`](#c.PyErr_SetExcInfo) to restore or clear the
exception state.

#### Versionadded
Added in version 3.3.

### void PyErr_SetExcInfo([PyObject](structures.md#c.PyObject) \*type, [PyObject](structures.md#c.PyObject) \*value, [PyObject](structures.md#c.PyObject) \*traceback)

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Set the exception info, as known from `sys.exc_info()`.  This refers
to an exception that was *already caught*, not to an exception that was
freshly raised.  This function steals the references of the arguments.
To clear the exception state, pass `NULL` for all three arguments.
This function is kept for backwards compatibility. Prefer using
[`PyErr_SetHandledException()`](#c.PyErr_SetHandledException).

#### NOTE
This function is not normally used by code that wants to handle exceptions.
Rather, it can be used when code needs to save and restore the exception
state temporarily.  Use [`PyErr_GetExcInfo()`](#c.PyErr_GetExcInfo) to read the exception
state.

#### Versionadded
Added in version 3.3.

#### Versionchanged
Changed in version 3.11: The `type` and `traceback` arguments are no longer used and
can be NULL. The interpreter now derives them from the exception
instance (the `value` argument). The function still steals
references of all three arguments.

## Signal Handling

### int PyErr_CheckSignals()

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-1"></a>

Handle external interruptions, such as signals or activating a debugger,
whose processing has been delayed until it is safe
to run Python code and/or raise exceptions.

For example, pressing `Ctrl`-`C` causes a terminal to send the
[`signal.SIGINT`](../library/signal.md#signal.SIGINT) signal.
This function executes the corresponding Python signal handler, which,
by default, raises the [`KeyboardInterrupt`](../library/exceptions.md#KeyboardInterrupt) exception.

`PyErr_CheckSignals()` should be called by long-running C code
frequently enough so that the response appears immediate to humans.

Handlers invoked by this function currently include:

- Signal handlers, including Python functions registered using
  the [`signal`](../library/signal.md#module-signal) module.

  Signal handlers are only run in the main thread of the main interpreter.

  (This is where the function got the name: originally, signals
  were the only way to interrupt the interpreter.)
- Running the garbage collector, if necessary.
- Executing a pending [remote debugger](../howto/remote_debugging.md#remote-debugging) script.
- Raise the exception set by [`PyThreadState_SetAsyncExc()`](threads.md#c.PyThreadState_SetAsyncExc).

If any handler raises an exception, immediately return `-1` with that
exception set.
Any remaining interruptions are left to be processed on the next
[`PyErr_CheckSignals()`](#c.PyErr_CheckSignals) invocation, if appropriate.

If all handlers finish successfully, or there are no handlers to run,
return `0`.

#### Versionchanged
Changed in version 3.12: This function may now invoke the garbage collector.

#### Versionchanged
Changed in version 3.14: This function may now execute a remote debugger script, if remote
debugging is enabled.

#### Versionchanged
Changed in version 3.15: The exception set by [`PyThreadState_SetAsyncExc()`](threads.md#c.PyThreadState_SetAsyncExc) is now raised.

### void PyErr_SetInterrupt()

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-2"></a>

Simulate the effect of a `SIGINT` signal arriving.
This is equivalent to `PyErr_SetInterruptEx(SIGINT)`.

#### NOTE
This function is async-signal-safe.  It can be called without
an [attached thread state](../glossary.md#term-attached-thread-state) and from a C signal handler.

### int PyErr_SetInterruptEx(int signum)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

<a id="index-3"></a>

Simulate the effect of a signal arriving. The next time
[`PyErr_CheckSignals()`](#c.PyErr_CheckSignals) is called,  the Python signal handler for
the given signal number will be called.

This function can be called by C code that sets up its own signal handling
and wants Python signal handlers to be invoked as expected when an
interruption is requested (for example when the user presses Ctrl-C
to interrupt an operation).

If the given signal isn’t handled by Python (it was set to
[`signal.SIG_DFL`](../library/signal.md#signal.SIG_DFL) or [`signal.SIG_IGN`](../library/signal.md#signal.SIG_IGN)), it will be ignored.

If *signum* is outside of the allowed range of signal numbers, `-1`
is returned.  Otherwise, `0` is returned.  The error indicator is
never changed by this function.

#### NOTE
This function is async-signal-safe.  It can be called without
an [attached thread state](../glossary.md#term-attached-thread-state) and from a C signal handler.

#### Versionadded
Added in version 3.10.

### int PySignal_SetWakeupFd(int fd)

This utility function specifies a file descriptor to which the signal number
is written as a single byte whenever a signal is received. *fd* must be
non-blocking. It returns the previous such file descriptor.

The value `-1` disables the feature; this is the initial state.
This is equivalent to [`signal.set_wakeup_fd()`](../library/signal.md#signal.set_wakeup_fd) in Python, but without any
error checking.  *fd* should be a valid file descriptor.  The function should
only be called from the main thread.

#### Versionchanged
Changed in version 3.5: On Windows, the function now also supports socket handles.

## Exception Classes

### [PyObject](structures.md#c.PyObject) \*PyErr_NewException(const char \*name, [PyObject](structures.md#c.PyObject) \*base, [PyObject](structures.md#c.PyObject) \*dict)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

This utility function creates and returns a new exception class. The *name*
argument must be the name of the new exception, a C string of the form
`module.classname`.  The *base* and *dict* arguments are normally `NULL`.
This creates a class object derived from [`Exception`](../library/exceptions.md#Exception) (accessible in C as
[`PyExc_Exception`](#c.PyExc_Exception)).

The [`__module__`](../reference/datamodel.md#type.__module__) attribute of the new class is set to the first part (up
to the last dot) of the *name* argument, and the class name is set to the last
part (after the last dot).  The *base* argument can be used to specify alternate
base classes; it can either be only one class or a tuple of classes. The *dict*
argument can be used to specify a dictionary of class variables and methods.

### [PyObject](structures.md#c.PyObject) \*PyErr_NewExceptionWithDoc(const char \*name, const char \*doc, [PyObject](structures.md#c.PyObject) \*base, [PyObject](structures.md#c.PyObject) \*dict)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Same as [`PyErr_NewException()`](#c.PyErr_NewException), except that the new exception class can
easily be given a docstring: If *doc* is non-`NULL`, it will be used as the
docstring for the exception class.

#### Versionadded
Added in version 3.2.

### int PyExceptionClass_Check([PyObject](structures.md#c.PyObject) \*ob)

Return non-zero if *ob* is an exception class, zero otherwise. This function always succeeds.

### const char \*PyExceptionClass_Name([PyObject](structures.md#c.PyObject) \*ob)

 *Part of the [Stable ABI](stable.md#stable) since version 3.8.*

Return [`tp_name`](typeobj.md#c.PyTypeObject.tp_name) of the exception class *ob*.

### PyException_HEAD

This is a macro including the base fields for an
exception object.

This was included in Python’s C API by mistake and is not designed for use
in extensions. For creating custom exception objects, use
[`PyErr_NewException()`](#c.PyErr_NewException) or otherwise create a class inheriting from
[`PyExc_BaseException`](#c.PyExc_BaseException).

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.15.

## Exception Objects

### int PyExceptionInstance_Check([PyObject](structures.md#c.PyObject) \*op)

Return true if *op* is an instance of [`BaseException`](../library/exceptions.md#BaseException), false
otherwise. This function always succeeds.

### PyExceptionInstance_Class(op)

Equivalent to [`Py_TYPE(op)`](structures.md#c.Py_TYPE).

### [PyObject](structures.md#c.PyObject) \*PyException_GetTraceback([PyObject](structures.md#c.PyObject) \*ex)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the traceback associated with the exception as a new reference, as
accessible from Python through the [`__traceback__`](../library/exceptions.md#BaseException.__traceback__)
attribute. If there is no
traceback associated, this returns `NULL`.

### int PyException_SetTraceback([PyObject](structures.md#c.PyObject) \*ex, [PyObject](structures.md#c.PyObject) \*tb)

 *Part of the [Stable ABI](stable.md#stable).*

Set the traceback associated with the exception to *tb*.  Use `Py_None` to
clear it.

### [PyObject](structures.md#c.PyObject) \*PyException_GetContext([PyObject](structures.md#c.PyObject) \*ex)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the context (another exception instance during whose handling *ex* was
raised) associated with the exception as a new reference, as accessible from
Python through the [`__context__`](../library/exceptions.md#BaseException.__context__) attribute.
If there is no context associated, this returns `NULL`.

### void PyException_SetContext([PyObject](structures.md#c.PyObject) \*ex, [PyObject](structures.md#c.PyObject) \*ctx)

 *Part of the [Stable ABI](stable.md#stable).*

Set the context associated with the exception to *ctx*.  Use `NULL` to clear
it.  There is no type check to make sure that *ctx* is an exception instance.
This steals a reference to *ctx*.

### [PyObject](structures.md#c.PyObject) \*PyException_GetCause([PyObject](structures.md#c.PyObject) \*ex)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the cause (either an exception instance, or `None`,
set by `raise ... from ...`) associated with the exception as a new
reference, as accessible from Python through the
[`__cause__`](../library/exceptions.md#BaseException.__cause__) attribute.

### void PyException_SetCause([PyObject](structures.md#c.PyObject) \*ex, [PyObject](structures.md#c.PyObject) \*cause)

 *Part of the [Stable ABI](stable.md#stable).*

Set the cause associated with the exception to *cause*.  Use `NULL` to clear
it.  There is no type check to make sure that *cause* is either an exception
instance or `None`.  This steals a reference to *cause*.

The [`__suppress_context__`](../library/exceptions.md#BaseException.__suppress_context__) attribute is implicitly set
to `True` by this function.

### [PyObject](structures.md#c.PyObject) \*PyException_GetArgs([PyObject](structures.md#c.PyObject) \*ex)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

Return [`args`](../library/exceptions.md#BaseException.args) of exception *ex*.

### void PyException_SetArgs([PyObject](structures.md#c.PyObject) \*ex, [PyObject](structures.md#c.PyObject) \*args)

 *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

Set [`args`](../library/exceptions.md#BaseException.args) of exception *ex* to *args*.

### [PyObject](structures.md#c.PyObject) \*PyUnstable_Exc_PrepReraiseStar([PyObject](structures.md#c.PyObject) \*orig, [PyObject](structures.md#c.PyObject) \*excs)

Implement part of the interpreter’s implementation of `except*`.
*orig* is the original exception that was caught, and *excs* is the list of
the exceptions that need to be raised. This list contains the unhandled
part of *orig*, if any, as well as the exceptions that were raised from the
`except*` clauses (so they have a different traceback from *orig*) and
those that were reraised (and have the same traceback as *orig*).
Return the [`ExceptionGroup`](../library/exceptions.md#ExceptionGroup) that needs to be reraised in the end, or
`None` if there is nothing to reraise.

#### Versionadded
Added in version 3.12.

<a id="unicodeexceptions"></a>

## Unicode Exception Objects

The following functions are used to create and modify Unicode exceptions from C.

### [PyObject](structures.md#c.PyObject) \*PyUnicodeDecodeError_Create(const char \*encoding, const char \*object, [Py_ssize_t](intro.md#c.Py_ssize_t) length, [Py_ssize_t](intro.md#c.Py_ssize_t) start, [Py_ssize_t](intro.md#c.Py_ssize_t) end, const char \*reason)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a [`UnicodeDecodeError`](../library/exceptions.md#UnicodeDecodeError) object with the attributes *encoding*,
*object*, *length*, *start*, *end* and *reason*. *encoding* and *reason* are
UTF-8 encoded strings.

### [PyObject](structures.md#c.PyObject) \*PyUnicodeDecodeError_GetEncoding([PyObject](structures.md#c.PyObject) \*exc)

### [PyObject](structures.md#c.PyObject) \*PyUnicodeEncodeError_GetEncoding([PyObject](structures.md#c.PyObject) \*exc)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the *encoding* attribute of the given exception object.

### [PyObject](structures.md#c.PyObject) \*PyUnicodeDecodeError_GetObject([PyObject](structures.md#c.PyObject) \*exc)

### [PyObject](structures.md#c.PyObject) \*PyUnicodeEncodeError_GetObject([PyObject](structures.md#c.PyObject) \*exc)

### [PyObject](structures.md#c.PyObject) \*PyUnicodeTranslateError_GetObject([PyObject](structures.md#c.PyObject) \*exc)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the *object* attribute of the given exception object.

### int PyUnicodeDecodeError_GetStart([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) \*start)

### int PyUnicodeEncodeError_GetStart([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) \*start)

### int PyUnicodeTranslateError_GetStart([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) \*start)

 *Part of the [Stable ABI](stable.md#stable).*

Get the *start* attribute of the given exception object and place it into
 *\*start*.  *start* must not be `NULL`.  Return `0` on success, `-1` on
failure.

If the [`UnicodeError.object`](../library/exceptions.md#UnicodeError.object) is an empty sequence, the resulting
*start* is `0`. Otherwise, it is clipped to `[0, len(object) - 1]`.

#### SEE ALSO
[`UnicodeError.start`](../library/exceptions.md#UnicodeError.start)

### int PyUnicodeDecodeError_SetStart([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) start)

### int PyUnicodeEncodeError_SetStart([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) start)

### int PyUnicodeTranslateError_SetStart([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) start)

 *Part of the [Stable ABI](stable.md#stable).*

Set the *start* attribute of the given exception object to *start*.
Return `0` on success, `-1` on failure.

#### NOTE
While passing a negative *start* does not raise an exception,
the corresponding getters will not consider it as a relative
offset.

### int PyUnicodeDecodeError_GetEnd([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) \*end)

### int PyUnicodeEncodeError_GetEnd([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) \*end)

### int PyUnicodeTranslateError_GetEnd([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) \*end)

 *Part of the [Stable ABI](stable.md#stable).*

Get the *end* attribute of the given exception object and place it into
 *\*end*.  *end* must not be `NULL`.  Return `0` on success, `-1` on
failure.

If the [`UnicodeError.object`](../library/exceptions.md#UnicodeError.object) is an empty sequence, the resulting
*end* is `0`. Otherwise, it is clipped to `[1, len(object)]`.

### int PyUnicodeDecodeError_SetEnd([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) end)

### int PyUnicodeEncodeError_SetEnd([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) end)

### int PyUnicodeTranslateError_SetEnd([PyObject](structures.md#c.PyObject) \*exc, [Py_ssize_t](intro.md#c.Py_ssize_t) end)

 *Part of the [Stable ABI](stable.md#stable).*

Set the *end* attribute of the given exception object to *end*.  Return `0`
on success, `-1` on failure.

#### SEE ALSO
[`UnicodeError.end`](../library/exceptions.md#UnicodeError.end)

### [PyObject](structures.md#c.PyObject) \*PyUnicodeDecodeError_GetReason([PyObject](structures.md#c.PyObject) \*exc)

### [PyObject](structures.md#c.PyObject) \*PyUnicodeEncodeError_GetReason([PyObject](structures.md#c.PyObject) \*exc)

### [PyObject](structures.md#c.PyObject) \*PyUnicodeTranslateError_GetReason([PyObject](structures.md#c.PyObject) \*exc)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the *reason* attribute of the given exception object.

### int PyUnicodeDecodeError_SetReason([PyObject](structures.md#c.PyObject) \*exc, const char \*reason)

### int PyUnicodeEncodeError_SetReason([PyObject](structures.md#c.PyObject) \*exc, const char \*reason)

### int PyUnicodeTranslateError_SetReason([PyObject](structures.md#c.PyObject) \*exc, const char \*reason)

 *Part of the [Stable ABI](stable.md#stable).*

Set the *reason* attribute of the given exception object to *reason*.  Return
`0` on success, `-1` on failure.

<a id="recursion"></a>

## Recursion Control

These two functions provide a way to perform safe recursive calls at the C
level, both in the core and in extension modules.  They are needed if the
recursive code does not necessarily invoke Python code (which tracks its
recursion depth automatically).
They are also not needed for *tp_call* implementations
because the [call protocol](call.md#call) takes care of recursion handling.

### int Py_EnterRecursiveCall(const char \*where)

 *Part of the [Stable ABI](stable.md#stable) since version 3.9.*

Marks a point where a recursive C-level call is about to be performed.

The function then checks if the stack limit is reached.  If this is the
case, a [`RecursionError`](../library/exceptions.md#RecursionError) is set and a nonzero value is returned.
Otherwise, zero is returned.

*where* should be a UTF-8 encoded string such as `" in instance check"` to
be concatenated to the [`RecursionError`](../library/exceptions.md#RecursionError) message caused by the recursion
depth limit.

#### SEE ALSO
The [`PyUnstable_ThreadState_SetStackProtection()`](threads.md#c.PyUnstable_ThreadState_SetStackProtection) function.

#### Versionchanged
Changed in version 3.9: This function is now also available in the [limited API](stable.md#limited-c-api).

### void Py_LeaveRecursiveCall(void)

 *Part of the [Stable ABI](stable.md#stable) since version 3.9.*

Ends a [`Py_EnterRecursiveCall()`](#c.Py_EnterRecursiveCall).  Must be called once for each
*successful* invocation of [`Py_EnterRecursiveCall()`](#c.Py_EnterRecursiveCall).

#### Versionchanged
Changed in version 3.9: This function is now also available in the [limited API](stable.md#limited-c-api).

Properly implementing [`tp_repr`](typeobj.md#c.PyTypeObject.tp_repr) for container types requires
special recursion handling.  In addition to protecting the stack,
[`tp_repr`](typeobj.md#c.PyTypeObject.tp_repr) also needs to track objects to prevent cycles.  The
following two functions facilitate this functionality.  Effectively,
these are the C equivalent to [`reprlib.recursive_repr()`](../library/reprlib.md#reprlib.recursive_repr).

### int Py_ReprEnter([PyObject](structures.md#c.PyObject) \*object)

 *Part of the [Stable ABI](stable.md#stable).*

Called at the beginning of the [`tp_repr`](typeobj.md#c.PyTypeObject.tp_repr) implementation to
detect cycles.

If the object has already been processed, the function returns a
positive integer.  In that case the [`tp_repr`](typeobj.md#c.PyTypeObject.tp_repr) implementation
should return a string object indicating a cycle.  As examples,
[`dict`](../library/stdtypes.md#dict) objects return `{...}` and [`list`](../library/stdtypes.md#list) objects
return `[...]`.

The function will return a negative integer if the recursion limit
is reached.  In that case the [`tp_repr`](typeobj.md#c.PyTypeObject.tp_repr) implementation should
typically return `NULL`.

Otherwise, the function returns zero and the [`tp_repr`](typeobj.md#c.PyTypeObject.tp_repr)
implementation can continue normally.

### void Py_ReprLeave([PyObject](structures.md#c.PyObject) \*object)

 *Part of the [Stable ABI](stable.md#stable).*

Ends a [`Py_ReprEnter()`](#c.Py_ReprEnter).  Must be called once for each
invocation of [`Py_ReprEnter()`](#c.Py_ReprEnter) that returns zero.

### int Py_GetRecursionLimit(void)

 *Part of the [Stable ABI](stable.md#stable).*

Get the recursion limit for the current interpreter. It can be set with
[`Py_SetRecursionLimit()`](#c.Py_SetRecursionLimit). The recursion limit prevents the
Python interpreter stack from growing infinitely.

This function cannot fail, and the caller must hold an
[attached thread state](../glossary.md#term-attached-thread-state).

#### SEE ALSO
[`sys.getrecursionlimit()`](../library/sys.md#sys.getrecursionlimit)

### void Py_SetRecursionLimit(int new_limit)

 *Part of the [Stable ABI](stable.md#stable).*

Set the recursion limit for the current interpreter.

This function cannot fail, and the caller must hold an
[attached thread state](../glossary.md#term-attached-thread-state).

#### SEE ALSO
[`sys.setrecursionlimit()`](../library/sys.md#sys.setrecursionlimit)

<a id="standardexceptions"></a>

## Exception and warning types

All standard Python exceptions and warning categories are available as global
variables whose names are `PyExc_` followed by the Python exception name.
These have the type ; they are all class objects.

For completeness, here are all the variables:

### Exception types

| C name                                                                                                                                            | Python name                                                                   |
|---------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| ### [PyObject](structures.md#c.PyObject) \*PyExc_BaseException<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                            | [`BaseException`](../library/exceptions.md#BaseException)                     |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_BaseExceptionGroup<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.11.*    | [`BaseExceptionGroup`](../library/exceptions.md#BaseExceptionGroup)           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_Exception<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                                | [`Exception`](../library/exceptions.md#Exception)                             |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ArithmeticError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                          | [`ArithmeticError`](../library/exceptions.md#ArithmeticError)                 |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_AssertionError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                           | [`AssertionError`](../library/exceptions.md#AssertionError)                   |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_AttributeError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                           | [`AttributeError`](../library/exceptions.md#AttributeError)                   |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_BlockingIOError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*        | [`BlockingIOError`](../library/exceptions.md#BlockingIOError)                 |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_BrokenPipeError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*        | [`BrokenPipeError`](../library/exceptions.md#BrokenPipeError)                 |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_BufferError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                              | [`BufferError`](../library/exceptions.md#BufferError)                         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ChildProcessError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*      | [`ChildProcessError`](../library/exceptions.md#ChildProcessError)             |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ConnectionAbortedError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.* | [`ConnectionAbortedError`](../library/exceptions.md#ConnectionAbortedError)   |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ConnectionError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*        | [`ConnectionError`](../library/exceptions.md#ConnectionError)                 |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ConnectionRefusedError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.* | [`ConnectionRefusedError`](../library/exceptions.md#ConnectionRefusedError)   |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ConnectionResetError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*   | [`ConnectionResetError`](../library/exceptions.md#ConnectionResetError)       |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_EOFError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                                 | [`EOFError`](../library/exceptions.md#EOFError)                               |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_FileExistsError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*        | [`FileExistsError`](../library/exceptions.md#FileExistsError)                 |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_FileNotFoundError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*      | [`FileNotFoundError`](../library/exceptions.md#FileNotFoundError)             |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_FloatingPointError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                       | [`FloatingPointError`](../library/exceptions.md#FloatingPointError)           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_GeneratorExit<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                            | [`GeneratorExit`](../library/exceptions.md#GeneratorExit)                     |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ImportCycleError                                                                                 | [`ImportCycleError`](../library/exceptions.md#ImportCycleError)               |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ImportError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                              | [`ImportError`](../library/exceptions.md#ImportError)                         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_IndentationError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                         | [`IndentationError`](../library/exceptions.md#IndentationError)               |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_IndexError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                               | [`IndexError`](../library/exceptions.md#IndexError)                           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_InterruptedError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*       | [`InterruptedError`](../library/exceptions.md#InterruptedError)               |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_IsADirectoryError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*      | [`IsADirectoryError`](../library/exceptions.md#IsADirectoryError)             |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_KeyError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                                 | [`KeyError`](../library/exceptions.md#KeyError)                               |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_KeyboardInterrupt<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                        | [`KeyboardInterrupt`](../library/exceptions.md#KeyboardInterrupt)             |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_LookupError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                              | [`LookupError`](../library/exceptions.md#LookupError)                         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_MemoryError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                              | [`MemoryError`](../library/exceptions.md#MemoryError)                         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ModuleNotFoundError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.6.*    | [`ModuleNotFoundError`](../library/exceptions.md#ModuleNotFoundError)         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_NameError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                                | [`NameError`](../library/exceptions.md#NameError)                             |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_NotADirectoryError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*     | [`NotADirectoryError`](../library/exceptions.md#NotADirectoryError)           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_NotImplementedError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                      | [`NotImplementedError`](../library/exceptions.md#NotImplementedError)         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_OSError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                                  | [`OSError`](../library/exceptions.md#OSError)                                 |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_OverflowError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                            | [`OverflowError`](../library/exceptions.md#OverflowError)                     |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_PermissionError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*        | [`PermissionError`](../library/exceptions.md#PermissionError)                 |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ProcessLookupError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*     | [`ProcessLookupError`](../library/exceptions.md#ProcessLookupError)           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_PythonFinalizationError                                                                          | [`PythonFinalizationError`](../library/exceptions.md#PythonFinalizationError) |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_RecursionError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*         | [`RecursionError`](../library/exceptions.md#RecursionError)                   |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ReferenceError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                           | [`ReferenceError`](../library/exceptions.md#ReferenceError)                   |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_RuntimeError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                             | [`RuntimeError`](../library/exceptions.md#RuntimeError)                       |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_StopAsyncIteration<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*     | [`StopAsyncIteration`](../library/exceptions.md#StopAsyncIteration)           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_StopIteration<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                            | [`StopIteration`](../library/exceptions.md#StopIteration)                     |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_SyntaxError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                              | [`SyntaxError`](../library/exceptions.md#SyntaxError)                         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_SystemError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                              | [`SystemError`](../library/exceptions.md#SystemError)                         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_SystemExit<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                               | [`SystemExit`](../library/exceptions.md#SystemExit)                           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_TabError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                                 | [`TabError`](../library/exceptions.md#TabError)                               |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_TimeoutError<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*           | [`TimeoutError`](../library/exceptions.md#TimeoutError)                       |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_TypeError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                                | [`TypeError`](../library/exceptions.md#TypeError)                             |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_UnboundLocalError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                        | [`UnboundLocalError`](../library/exceptions.md#UnboundLocalError)             |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_UnicodeDecodeError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                       | [`UnicodeDecodeError`](../library/exceptions.md#UnicodeDecodeError)           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_UnicodeEncodeError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                       | [`UnicodeEncodeError`](../library/exceptions.md#UnicodeEncodeError)           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_UnicodeError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                             | [`UnicodeError`](../library/exceptions.md#UnicodeError)                       |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_UnicodeTranslateError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                    | [`UnicodeTranslateError`](../library/exceptions.md#UnicodeTranslateError)     |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ValueError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                               | [`ValueError`](../library/exceptions.md#ValueError)                           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ZeroDivisionError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                        | [`ZeroDivisionError`](../library/exceptions.md#ZeroDivisionError)             |

#### Versionadded
Added in version 3.3: [`PyExc_BlockingIOError`](#c.PyExc_BlockingIOError), [`PyExc_BrokenPipeError`](#c.PyExc_BrokenPipeError),
[`PyExc_ChildProcessError`](#c.PyExc_ChildProcessError), [`PyExc_ConnectionError`](#c.PyExc_ConnectionError),
[`PyExc_ConnectionAbortedError`](#c.PyExc_ConnectionAbortedError), [`PyExc_ConnectionRefusedError`](#c.PyExc_ConnectionRefusedError),
[`PyExc_ConnectionResetError`](#c.PyExc_ConnectionResetError), [`PyExc_FileExistsError`](#c.PyExc_FileExistsError),
[`PyExc_FileNotFoundError`](#c.PyExc_FileNotFoundError), [`PyExc_InterruptedError`](#c.PyExc_InterruptedError),
[`PyExc_IsADirectoryError`](#c.PyExc_IsADirectoryError), [`PyExc_NotADirectoryError`](#c.PyExc_NotADirectoryError),
[`PyExc_PermissionError`](#c.PyExc_PermissionError), [`PyExc_ProcessLookupError`](#c.PyExc_ProcessLookupError)
and [`PyExc_TimeoutError`](#c.PyExc_TimeoutError) were introduced following [**PEP 3151**](https://peps.python.org/pep-3151/).

#### Versionadded
Added in version 3.5: [`PyExc_StopAsyncIteration`](#c.PyExc_StopAsyncIteration) and [`PyExc_RecursionError`](#c.PyExc_RecursionError).

#### Versionadded
Added in version 3.6: [`PyExc_ModuleNotFoundError`](#c.PyExc_ModuleNotFoundError).

#### Versionadded
Added in version 3.11: [`PyExc_BaseExceptionGroup`](#c.PyExc_BaseExceptionGroup).

### OSError aliases

The following are a compatibility aliases to [`PyExc_OSError`](#c.PyExc_OSError).

#### Versionchanged
Changed in version 3.3: These aliases used to be separate exception types.

| C name                                                                                                                                             | Python name                                   | Notes         |
|----------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|---------------|
| ### [PyObject](structures.md#c.PyObject) \*PyExc_EnvironmentError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                          | [`OSError`](../library/exceptions.md#OSError) |               |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_IOError<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                                   | [`OSError`](../library/exceptions.md#OSError) |               |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_WindowsError<br/><br/> *Part of the [Stable ABI](stable.md#stable) on Windows since version 3.7.* | [`OSError`](../library/exceptions.md#OSError) | [[win]](#win) |

Notes:

<a id="standardwarningcategories"></a>

### Warning types

| C name                                                                                                                                      | Python name                                                                       |
|---------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| ### [PyObject](structures.md#c.PyObject) \*PyExc_Warning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                            | [`Warning`](../library/exceptions.md#Warning)                                     |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_BytesWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                       | [`BytesWarning`](../library/exceptions.md#BytesWarning)                           |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_DeprecationWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                 | [`DeprecationWarning`](../library/exceptions.md#DeprecationWarning)               |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_EncodingWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.10.* | [`EncodingWarning`](../library/exceptions.md#EncodingWarning)                     |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_FutureWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                      | [`FutureWarning`](../library/exceptions.md#FutureWarning)                         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ImportWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                      | [`ImportWarning`](../library/exceptions.md#ImportWarning)                         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_PendingDeprecationWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*          | [`PendingDeprecationWarning`](../library/exceptions.md#PendingDeprecationWarning) |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_ResourceWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.7.*  | [`ResourceWarning`](../library/exceptions.md#ResourceWarning)                     |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_RuntimeWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                     | [`RuntimeWarning`](../library/exceptions.md#RuntimeWarning)                       |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_SyntaxWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                      | [`SyntaxWarning`](../library/exceptions.md#SyntaxWarning)                         |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_UnicodeWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                     | [`UnicodeWarning`](../library/exceptions.md#UnicodeWarning)                       |
| ### [PyObject](structures.md#c.PyObject) \*PyExc_UserWarning<br/><br/> *Part of the [Stable ABI](stable.md#stable).*                        | [`UserWarning`](../library/exceptions.md#UserWarning)                             |

#### Versionadded
Added in version 3.2: [`PyExc_ResourceWarning`](#c.PyExc_ResourceWarning).

#### Versionadded
Added in version 3.10: [`PyExc_EncodingWarning`](#c.PyExc_EncodingWarning).

## Tracebacks

### [PyTypeObject](type.md#c.PyTypeObject) PyTraceBack_Type

 *Part of the [Stable ABI](stable.md#stable).*

Type object for traceback objects. This is available as
[`types.TracebackType`](../library/types.md#types.TracebackType) in the Python layer.

### int PyTraceBack_Check([PyObject](structures.md#c.PyObject) \*op)

Return true if *op* is a traceback object, false otherwise. This function
does not account for subtypes.

### int PyTraceBack_Here([PyFrameObject](frame.md#c.PyFrameObject) \*f)

 *Part of the [Stable ABI](stable.md#stable).*

Replace the [`__traceback__`](../library/exceptions.md#BaseException.__traceback__) attribute on the current
exception with a new traceback prepending *f* to the existing chain.

Calling this function without an exception set is undefined behavior.

This function returns `0` on success, and returns `-1` with an
exception set on failure.

### int PyTraceBack_Print([PyObject](structures.md#c.PyObject) \*tb, [PyObject](structures.md#c.PyObject) \*f)

 *Part of the [Stable ABI](stable.md#stable).*

Write the traceback *tb* into the file *f*.

This function returns `0` on success, and returns `-1` with an
exception set on failure.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

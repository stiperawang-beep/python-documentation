<a id="reflection"></a>

# Reflection

### [PyObject](structures.md#c.PyObject) \*PyEval_GetBuiltins(void)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

#### Deprecated
Deprecated since version 3.13: Use [`PyEval_GetFrameBuiltins()`](#c.PyEval_GetFrameBuiltins) instead.

Return a dictionary of the builtins in the current execution frame,
or the interpreter of the thread state if no frame is currently executing.

### [PyObject](structures.md#c.PyObject) \*PyEval_GetLocals(void)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

#### Deprecated
Deprecated since version 3.13: Use either [`PyEval_GetFrameLocals()`](#c.PyEval_GetFrameLocals) to obtain the same behaviour as calling
[`locals()`](../library/functions.md#locals) in Python code, or else call [`PyFrame_GetLocals()`](frame.md#c.PyFrame_GetLocals) on the result
of [`PyEval_GetFrame()`](#c.PyEval_GetFrame) to access the [`f_locals`](../reference/datamodel.md#frame.f_locals) attribute of the
currently executing frame.

Return a mapping providing access to the local variables in the current execution frame,
or `NULL` if no frame is currently executing.

Refer to [`locals()`](../library/functions.md#locals) for details of the mapping returned at different scopes.

As this function returns a [borrowed reference](../glossary.md#term-borrowed-reference), the dictionary returned for
[optimized scopes](../glossary.md#term-optimized-scope) is cached on the frame object and will remain
alive as long as the frame object does. Unlike [`PyEval_GetFrameLocals()`](#c.PyEval_GetFrameLocals) and
[`locals()`](../library/functions.md#locals), subsequent calls to this function in the same frame will update the
contents of the cached dictionary to reflect changes in the state of the local variables
rather than returning a new snapshot.

#### Versionchanged
Changed in version 3.13: As part of [**PEP 667**](https://peps.python.org/pep-0667/), [`PyFrame_GetLocals()`](frame.md#c.PyFrame_GetLocals), [`locals()`](../library/functions.md#locals), and
[`FrameType.f_locals`](../reference/datamodel.md#frame.f_locals) no longer make use of the shared cache
dictionary. Refer to the [What’s New entry](../whatsnew/3.13.md#whatsnew313-locals-semantics) for
additional details.

### [PyObject](structures.md#c.PyObject) \*PyEval_GetGlobals(void)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

#### Deprecated
Deprecated since version 3.13: Use [`PyEval_GetFrameGlobals()`](#c.PyEval_GetFrameGlobals) instead.

Return a dictionary of the global variables in the current execution frame,
or `NULL` if no frame is currently executing.

### [PyFrameObject](frame.md#c.PyFrameObject) \*PyEval_GetFrame(void)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the [attached thread state](../glossary.md#term-attached-thread-state)’s frame, which is `NULL` if no frame is
currently executing.

See also [`PyThreadState_GetFrame()`](threads.md#c.PyThreadState_GetFrame).

### [PyObject](structures.md#c.PyObject) \*PyEval_GetFrameBuiltins(void)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Return a dictionary of the builtins in the current execution frame,
or the interpreter of the thread state if no frame is currently executing.

#### Versionadded
Added in version 3.13.

### [PyObject](structures.md#c.PyObject) \*PyEval_GetFrameLocals(void)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Return a dictionary of the local variables in the current execution frame,
or `NULL` if no frame is currently executing. Equivalent to calling
[`locals()`](../library/functions.md#locals) in Python code.

To access [`f_locals`](../reference/datamodel.md#frame.f_locals) on the current frame without making an independent
snapshot in [optimized scopes](../glossary.md#term-optimized-scope), call [`PyFrame_GetLocals()`](frame.md#c.PyFrame_GetLocals)
on the result of [`PyEval_GetFrame()`](#c.PyEval_GetFrame).

#### Versionadded
Added in version 3.13.

### [PyObject](structures.md#c.PyObject) \*PyEval_GetFrameGlobals(void)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Return a dictionary of the global variables in the current execution frame,
or `NULL` if no frame is currently executing. Equivalent to calling
[`globals()`](../library/functions.md#globals) in Python code.

#### Versionadded
Added in version 3.13.

### const char \*PyEval_GetFuncName([PyObject](structures.md#c.PyObject) \*func)

 *Part of the [Stable ABI](stable.md#stable).*

Return the name of *func* if it is a function, class or instance object, else the
name of *func*s type.

### const char \*PyEval_GetFuncDesc([PyObject](structures.md#c.PyObject) \*func)

 *Part of the [Stable ABI](stable.md#stable).*

Return a description string, depending on the type of *func*.
Return values include “()” for functions and methods, “ constructor”,
“ instance”, and “ object”.  Concatenated with the result of
[`PyEval_GetFuncName()`](#c.PyEval_GetFuncName), the result will be a description of
*func*.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

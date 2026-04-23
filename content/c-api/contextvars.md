<a id="contextvarsobjects"></a>

# Context Variables Objects

<a id="contextvarsobjects-pointertype-change"></a>

#### Versionadded
Added in version 3.7.

#### Versionchanged
Changed in version 3.7.1: 

#### NOTE
In Python 3.7.1 the signatures of all context variables
C APIs were **changed** to use [`PyObject`](structures.md#c.PyObject) pointers instead
of [`PyContext`](#c.PyContext), [`PyContextVar`](#c.PyContextVar), and
[`PyContextToken`](#c.PyContextToken), e.g.:

```c
// in 3.7.0:
PyContext *PyContext_New(void);

// in 3.7.1+:
PyObject *PyContext_New(void);
```

See [bpo-34762](https://bugs.python.org/issue?@action=redirect&bpo=34762) for more details.

This section details the public C API for the [`contextvars`](../library/contextvars.md#module-contextvars) module.

### type PyContext

The C structure used to represent a [`contextvars.Context`](../library/contextvars.md#contextvars.Context)
object.

### type PyContextVar

The C structure used to represent a [`contextvars.ContextVar`](../library/contextvars.md#contextvars.ContextVar)
object.

### type PyContextToken

The C structure used to represent a [`contextvars.Token`](../library/contextvars.md#contextvars.Token) object.

### [PyTypeObject](type.md#c.PyTypeObject) PyContext_Type

The type object representing the *context* type.

### [PyTypeObject](type.md#c.PyTypeObject) PyContextVar_Type

The type object representing the *context variable* type.

### [PyTypeObject](type.md#c.PyTypeObject) PyContextToken_Type

The type object representing the *context variable token* type.

Type-check macros:

### int PyContext_CheckExact([PyObject](structures.md#c.PyObject) \*o)

Return true if *o* is of type [`PyContext_Type`](#c.PyContext_Type). *o* must not be
`NULL`.  This function always succeeds.

### int PyContextVar_CheckExact([PyObject](structures.md#c.PyObject) \*o)

Return true if *o* is of type [`PyContextVar_Type`](#c.PyContextVar_Type). *o* must not be
`NULL`.  This function always succeeds.

### int PyContextToken_CheckExact([PyObject](structures.md#c.PyObject) \*o)

Return true if *o* is of type [`PyContextToken_Type`](#c.PyContextToken_Type).
*o* must not be `NULL`.  This function always succeeds.

Context object management functions:

### [PyObject](structures.md#c.PyObject) \*PyContext_New(void)

*Return value: New reference.*

Create a new empty context object.  Returns `NULL` if an error
has occurred.

### [PyObject](structures.md#c.PyObject) \*PyContext_Copy([PyObject](structures.md#c.PyObject) \*ctx)

*Return value: New reference.*

Create a shallow copy of the passed *ctx* context object.
Returns `NULL` if an error has occurred.

### [PyObject](structures.md#c.PyObject) \*PyContext_CopyCurrent(void)

*Return value: New reference.*

Create a shallow copy of the current thread context.
Returns `NULL` if an error has occurred.

### int PyContext_Enter([PyObject](structures.md#c.PyObject) \*ctx)

Set *ctx* as the current context for the current thread.
Returns `0` on success, and `-1` on error.

### int PyContext_Exit([PyObject](structures.md#c.PyObject) \*ctx)

Deactivate the *ctx* context and restore the previous context as the
current context for the current thread.  Returns `0` on success,
and `-1` on error.

### int PyContext_AddWatcher([PyContext_WatchCallback](#c.PyContext_WatchCallback) callback)

Register *callback* as a context object watcher for the current interpreter.
Return an ID which may be passed to [`PyContext_ClearWatcher()`](#c.PyContext_ClearWatcher).
In case of error (e.g. no more watcher IDs available),
return `-1` and set an exception.

#### Versionadded
Added in version 3.14.

### int PyContext_ClearWatcher(int watcher_id)

Clear watcher identified by *watcher_id* previously returned from
[`PyContext_AddWatcher()`](#c.PyContext_AddWatcher) for the current interpreter.
Return `0` on success, or `-1` and set an exception on error
(e.g. if the given *watcher_id* was never registered.)

#### Versionadded
Added in version 3.14.

### type PyContextEvent

Enumeration of possible context object watcher events:

- `Py_CONTEXT_SWITCHED`: The [current context](../glossary.md#term-current-context) has switched to a
  different context.  The object passed to the watch callback is the
  now-current [`contextvars.Context`](../library/contextvars.md#contextvars.Context) object, or None if no context is
  current.

#### Versionadded
Added in version 3.14.

### typedef int (\*PyContext_WatchCallback)([PyContextEvent](#c.PyContextEvent) event, [PyObject](structures.md#c.PyObject) \*obj)

Context object watcher callback function.  The object passed to the callback
is event-specific; see [`PyContextEvent`](#c.PyContextEvent) for details.

If the callback returns with an exception set, it must return `-1`; this
exception will be printed as an unraisable exception using
[`PyErr_FormatUnraisable()`](exceptions.md#c.PyErr_FormatUnraisable). Otherwise it should return `0`.

There may already be a pending exception set on entry to the callback. In
this case, the callback should return `0` with the same exception still
set. This means the callback may not call any other API that can set an
exception unless it saves and clears the exception state first, and restores
it before returning.

#### Versionadded
Added in version 3.14.

Context variable functions:

### [PyObject](structures.md#c.PyObject) \*PyContextVar_New(const char \*name, [PyObject](structures.md#c.PyObject) \*def)

*Return value: New reference.*

Create a new `ContextVar` object.  The *name* parameter is used
for introspection and debug purposes.  The *def* parameter specifies
a default value for the context variable, or `NULL` for no default.
If an error has occurred, this function returns `NULL`.

### int PyContextVar_Get([PyObject](structures.md#c.PyObject) \*var, [PyObject](structures.md#c.PyObject) \*default_value, [PyObject](structures.md#c.PyObject) \*\*value)

Get the value of a context variable.  Returns `-1` if an error has
occurred during lookup, and `0` if no error occurred, whether or not
a value was found.

If the context variable was found, *value* will be a pointer to it.
If the context variable was *not* found, *value* will point to:

- *default_value*, if not `NULL`;
- the default value of *var*, if not `NULL`;
- `NULL`

Except for `NULL`, the function returns a new reference.

### [PyObject](structures.md#c.PyObject) \*PyContextVar_Set([PyObject](structures.md#c.PyObject) \*var, [PyObject](structures.md#c.PyObject) \*value)

*Return value: New reference.*

Set the value of *var* to *value* in the current context.  Returns
a new token object for this change, or `NULL` if an error has occurred.

### int PyContextVar_Reset([PyObject](structures.md#c.PyObject) \*var, [PyObject](structures.md#c.PyObject) \*token)

Reset the state of the *var* context variable to that it was in before
[`PyContextVar_Set()`](#c.PyContextVar_Set) that returned the *token* was called.
This function returns `0` on success and `-1` on error.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

<a id="common-structs"></a>

# Common Object Structures

There are a large number of structures which are used in the definition of
object types for Python.  This section describes these structures and how they
are used.

## Base object types and macros

All Python objects ultimately share a small number of fields at the beginning
of the object’s representation in memory.  These are represented by the
[`PyObject`](#c.PyObject) and [`PyVarObject`](#c.PyVarObject) types, which are defined, in turn,
by the expansions of some macros also used, whether directly or indirectly, in
the definition of all other Python objects.  Additional macros can be found
under [reference counting](refcounting.md#countingrefs).

### type PyObject

 *Part of the [Stable ABI](stable.md#stable) (see below).*

All object types are extensions of this type.  This is a type which
contains the information Python needs to treat a pointer to an object as an
object.  In a normal “release” build, it contains only the object’s
reference count and a pointer to the corresponding type object.
Nothing is actually declared to be a [`PyObject`](#c.PyObject), but every pointer
to a Python object can be cast to a .

The members must not be accessed directly; instead use macros such as
[`Py_REFCNT`](refcounting.md#c.Py_REFCNT) and [`Py_TYPE`](#c.Py_TYPE).

In the [Stable ABI](stable.md#stable-abi) for Free-Threaded Builds (`abi3t`),
this struct is opaque; its size and layout may change between
Python versions.
In Stable ABI for non-free-threaded builds (`abi3`), the
`ob_refcnt` and `ob_type` fields are available,
but using them directly is discouraged.

### [Py_ssize_t](intro.md#c.Py_ssize_t) ob_refcnt

 *Part of the [Stable ABI](stable.md#stable).*

The object’s reference count, as returned by [`Py_REFCNT`](refcounting.md#c.Py_REFCNT).
Do not use this field directly; instead use functions and macros such as
`Py_REFCNT`, [`Py_INCREF()`](refcounting.md#c.Py_INCREF) and [`Py_DecRef()`](refcounting.md#c.Py_DecRef).

The field type may be different from `Py_ssize_t`, depending on
build configuration and platform.

### [PyTypeObject](type.md#c.PyTypeObject) \*ob_type

 *Part of the [Stable ABI](stable.md#stable).*

The object’s type.
Do not use this field directly; use [`Py_TYPE`](#c.Py_TYPE) and
[`Py_SET_TYPE()`](#c.Py_SET_TYPE) instead.

### [PyMutex](synchronization.md#c.PyMutex) ob_mutex

A [per-object lock](../howto/free-threading-extensions.md#per-object-locks), present only in the [free-threaded](../glossary.md#term-free-threading)
build (when [`Py_GIL_DISABLED`](../using/configure.md#c.Py_GIL_DISABLED) is defined).

This field is **reserved for use by the critical section API**
([`Py_BEGIN_CRITICAL_SECTION`](synchronization.md#c.Py_BEGIN_CRITICAL_SECTION) / [`Py_END_CRITICAL_SECTION`](synchronization.md#c.Py_END_CRITICAL_SECTION)).
Do **not** lock it directly with `PyMutex_Lock`; doing so can cause
deadlocks.  If you need your own lock, add a separate [`PyMutex`](synchronization.md#c.PyMutex)
field to your object struct.

#### Versionadded
Added in version 3.13.

### type PyVarObject

 *Part of the [Stable ABI](stable.md#stable) (see below).*

An extension of [`PyObject`](#c.PyObject) that adds the
[`ob_size`](#c.PyVarObject.ob_size) field.
This is intended for objects that have some notion of *length*.

As with `PyObject`, the members must not be accessed directly;
instead use macros such as [`Py_SIZE`](#c.Py_SIZE), [`Py_REFCNT`](refcounting.md#c.Py_REFCNT) and
[`Py_TYPE`](#c.Py_TYPE).

In the [Stable ABI](stable.md#stable-abi) for Free-Threaded Builds (`abi3t`),
this struct is opaque; its size and layout may change between
Python versions.
In Stable ABI for non-free-threaded builds (`abi3`), the
`ob_base` and `ob_size` fields are available,
but using them directly is discouraged.

### [PyObject](#c.PyObject) ob_base

 *Part of the [Stable ABI](stable.md#stable).*

Common object header.
Typically, this field is not accessed directly; instead
`PyVarObject` can be cast to [`PyObject`](#c.PyObject).

### [Py_ssize_t](intro.md#c.Py_ssize_t) ob_size

 *Part of the [Stable ABI](stable.md#stable).*

A size field, whose contents should be considered an object’s internal
implementation detail.

Do not use this field directly; use [`Py_SIZE`](#c.Py_SIZE) instead.

Object creation functions such as [`PyObject_NewVar()`](allocation.md#c.PyObject_NewVar) will
generally set this field to the requested size (number of items).
After creation, arbitrary values can be stored in `ob_size`
using [`Py_SET_SIZE`](#c.Py_SET_SIZE).

To get an object’s publicly exposed length, as returned by
the Python function [`len()`](../library/functions.md#len), use [`PyObject_Length()`](object.md#c.PyObject_Length)
instead.

### PyObject_HEAD

This is a macro used when declaring new types which represent objects
without a varying length.  The PyObject_HEAD macro expands to:

```c
PyObject ob_base;
```

See documentation of [`PyObject`](#c.PyObject) above.

### PyObject_VAR_HEAD

This is a macro used when declaring new types which represent objects
with a length that varies from instance to instance.
The PyObject_VAR_HEAD macro expands to:

```c
PyVarObject ob_base;
```

See documentation of [`PyVarObject`](#c.PyVarObject) above.

### [PyTypeObject](type.md#c.PyTypeObject) PyBaseObject_Type

 *Part of the [Stable ABI](stable.md#stable).*

The base class of all other objects, the same as [`object`](../library/functions.md#object) in Python.

### int Py_Is([PyObject](#c.PyObject) \*x, [PyObject](#c.PyObject) \*y)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Test if the *x* object is the *y* object, the same as `x is y` in Python.

#### Versionadded
Added in version 3.10.

### int Py_IsNone([PyObject](#c.PyObject) \*x)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Test if an object is the `None` singleton,
the same as `x is None` in Python.

#### Versionadded
Added in version 3.10.

### int Py_IsTrue([PyObject](#c.PyObject) \*x)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Test if an object is the `True` singleton,
the same as `x is True` in Python.

#### Versionadded
Added in version 3.10.

### int Py_IsFalse([PyObject](#c.PyObject) \*x)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Test if an object is the `False` singleton,
the same as `x is False` in Python.

#### Versionadded
Added in version 3.10.

### [PyTypeObject](type.md#c.PyTypeObject) \*Py_TYPE([PyObject](#c.PyObject) \*o)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Get the type of the Python object *o*.

The returned reference is [borrowed](../glossary.md#term-borrowed-reference) from *o*.
Do not release it with [`Py_DECREF()`](refcounting.md#c.Py_DECREF) or similar.

#### Versionchanged
Changed in version 3.11: [`Py_TYPE()`](#c.Py_TYPE) is changed to an inline static function.
The parameter type is no longer .

### int Py_IS_TYPE([PyObject](#c.PyObject) \*o, [PyTypeObject](type.md#c.PyTypeObject) \*type)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Return non-zero if the object *o* type is *type*. Return zero otherwise.
Equivalent to: `Py_TYPE(o) == type`.

#### Versionadded
Added in version 3.9.

### void Py_SET_TYPE([PyObject](#c.PyObject) \*o, [PyTypeObject](type.md#c.PyTypeObject) \*type)

Set the type of object *o* to *type*, without any checking or reference
counting.

This is a very low-level operation.
Consider instead setting the Python attribute [`__class__`](../reference/datamodel.md#object.__class__)
using [`PyObject_SetAttrString()`](object.md#c.PyObject_SetAttrString) or similar.

Note that assigning an incompatible type can lead to undefined behavior.

If *type* is a [heap type](typeobj.md#heap-types), the caller must create a
new reference to it.
Similarly, if the old type of *o* is a heap type, the caller must release
a reference to that type.

#### Versionadded
Added in version 3.9.

### [Py_ssize_t](intro.md#c.Py_ssize_t) Py_SIZE([PyVarObject](#c.PyVarObject) \*o)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Get the [`ob_size`](#c.PyVarObject.ob_size) field of *o*.

#### Versionchanged
Changed in version 3.11: [`Py_SIZE()`](#c.Py_SIZE) is changed to an inline static function.
The parameter type is no longer .

### void Py_SET_SIZE([PyVarObject](#c.PyVarObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) size)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Set the [`ob_size`](#c.PyVarObject.ob_size) field of *o* to *size*.

#### Versionadded
Added in version 3.9.

### PyObject_HEAD_INIT(type)

This is a macro which expands to initialization values for a new
[`PyObject`](#c.PyObject) type.  This macro expands to:

```c
_PyObject_EXTRA_INIT
1, type,
```

### PyVarObject_HEAD_INIT(type, size)

This is a macro which expands to initialization values for a new
[`PyVarObject`](#c.PyVarObject) type, including the [`ob_size`](#c.PyVarObject.ob_size) field.
This macro expands to:

```c
_PyObject_EXTRA_INIT
1, type, size,
```

## Implementing functions and methods

### type PyCFunction

 *Part of the [Stable ABI](stable.md#stable).*

Type of the functions used to implement most Python callables in C.
Functions of this type take two  parameters and return
one such value.  If the return value is `NULL`, an exception shall have
been set.  If not `NULL`, the return value is interpreted as the return
value of the function as exposed in Python.  The function must return a new
reference.

The function signature is:

```c
PyObject *PyCFunction(PyObject *self,
                      PyObject *args);
```

### type PyCFunctionWithKeywords

 *Part of the [Stable ABI](stable.md#stable).*

Type of the functions used to implement Python callables in C
with signature [METH_VARARGS | METH_KEYWORDS](#meth-varargs-meth-keywords).
The function signature is:

```c
PyObject *PyCFunctionWithKeywords(PyObject *self,
                                  PyObject *args,
                                  PyObject *kwargs);
```

### type PyCFunctionFast

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Type of the functions used to implement Python callables in C
with signature [`METH_FASTCALL`](#c.METH_FASTCALL).
The function signature is:

```c
PyObject *PyCFunctionFast(PyObject *self,
                          PyObject *const *args,
                          Py_ssize_t nargs);
```

### type PyCFunctionFastWithKeywords

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Type of the functions used to implement Python callables in C
with signature [METH_FASTCALL | METH_KEYWORDS](#meth-fastcall-meth-keywords).
The function signature is:

```c
PyObject *PyCFunctionFastWithKeywords(PyObject *self,
                                      PyObject *const *args,
                                      Py_ssize_t nargs,
                                      PyObject *kwnames);
```

### type PyCMethod

Type of the functions used to implement Python callables in C
with signature [METH_METHOD | METH_FASTCALL | METH_KEYWORDS](#meth-method-meth-fastcall-meth-keywords).
The function signature is:

```c
PyObject *PyCMethod(PyObject *self,
                    PyTypeObject *defining_class,
                    PyObject *const *args,
                    Py_ssize_t nargs,
                    PyObject *kwnames)
```

#### Versionadded
Added in version 3.9.

### type PyMethodDef

 *Part of the [Stable ABI](stable.md#stable) (including all members).*

Structure used to describe a method of an extension type.  This structure has
four fields:

### const char \*ml_name

Name of the method.

A `NULL` *ml_name* marks the end of a `PyMethodDef` array.

### [PyCFunction](#c.PyCFunction) ml_meth

Pointer to the C implementation.

### int ml_flags

Flags bits indicating how the call should be constructed.

### const char \*ml_doc

Points to the contents of the docstring.

The [`ml_meth`](#c.PyMethodDef.ml_meth) is a C function pointer.
The functions may be of different
types, but they always return .  If the function is not of
the [`PyCFunction`](#c.PyCFunction), the compiler will require a cast in the method table.
Even though [`PyCFunction`](#c.PyCFunction) defines the first parameter as
, it is common that the method implementation uses the
specific C type of the *self* object.

The [`ml_flags`](#c.PyMethodDef.ml_flags) field is a bitfield which can include
the following flags.
The individual flags indicate either a calling convention or a binding
convention.

There are these calling conventions:

### METH_VARARGS

 *Part of the [Stable ABI](stable.md#stable).*

This is the typical calling convention, where the methods have the type
[`PyCFunction`](#c.PyCFunction). The function expects two  values.
The first one is the *self* object for methods; for module functions, it is
the module object.  The second parameter (often called *args*) is a tuple
object representing all arguments. This parameter is typically processed
using [`PyArg_ParseTuple()`](arg.md#c.PyArg_ParseTuple) or [`PyArg_UnpackTuple()`](arg.md#c.PyArg_UnpackTuple).

### METH_KEYWORDS

Can only be used in certain combinations with other flags:
[METH_VARARGS | METH_KEYWORDS](#meth-varargs-meth-keywords),
[METH_FASTCALL | METH_KEYWORDS](#meth-fastcall-meth-keywords) and
[METH_METHOD | METH_FASTCALL | METH_KEYWORDS](#meth-method-meth-fastcall-meth-keywords).

<a id="meth-varargs-meth-keywords"></a>

: Methods with these flags must be of type [`PyCFunctionWithKeywords`](#c.PyCFunctionWithKeywords).
  The function expects three parameters: *self*, *args*, *kwargs* where
  *kwargs* is a dictionary of all the keyword arguments or possibly `NULL`
  if there are no keyword arguments.  The parameters are typically processed
  using [`PyArg_ParseTupleAndKeywords()`](arg.md#c.PyArg_ParseTupleAndKeywords).

### METH_FASTCALL

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Fast calling convention supporting only positional arguments.
The methods have the type [`PyCFunctionFast`](#c.PyCFunctionFast).
The first parameter is *self*, the second parameter is a C array
of  values indicating the arguments and the third
parameter is the number of arguments (the length of the array).

#### Versionadded
Added in version 3.7.

#### Versionchanged
Changed in version 3.10: `METH_FASTCALL` is now part of the [stable ABI](stable.md#stable-abi).

<a id="meth-fastcall-meth-keywords"></a>

: Extension of [`METH_FASTCALL`](#c.METH_FASTCALL) supporting also keyword arguments,
  with methods of type [`PyCFunctionFastWithKeywords`](#c.PyCFunctionFastWithKeywords).
  Keyword arguments are passed the same way as in the
  [vectorcall protocol](call.md#vectorcall):
  there is an additional fourth  parameter
  which is a tuple representing the names of the keyword arguments
  (which are guaranteed to be strings)
  or possibly `NULL` if there are no keywords.  The values of the keyword
  arguments are stored in the *args* array, after the positional arguments.
  <br/>
  #### Versionadded
  Added in version 3.7.

### METH_METHOD

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Can only be used in the combination with other flags:
[METH_METHOD | METH_FASTCALL | METH_KEYWORDS](#meth-method-meth-fastcall-meth-keywords).

<a id="meth-method-meth-fastcall-meth-keywords"></a>

: Extension of [METH_FASTCALL | METH_KEYWORDS](#meth-fastcall-meth-keywords)
  supporting the *defining class*, that is,
  the class that contains the method in question.
  The defining class might be a superclass of `Py_TYPE(self)`.
  <br/>
  The method needs to be of type [`PyCMethod`](#c.PyCMethod), the same as for
  `METH_FASTCALL | METH_KEYWORDS` with `defining_class` argument added after
  `self`.
  <br/>
  #### Versionadded
  Added in version 3.9.

### METH_NOARGS

 *Part of the [Stable ABI](stable.md#stable).*

Methods without parameters don’t need to check whether arguments are given if
they are listed with the [`METH_NOARGS`](#c.METH_NOARGS) flag.  They need to be of type
[`PyCFunction`](#c.PyCFunction).  The first parameter is typically named *self* and will
hold a reference to the module or object instance.  In all cases the second
parameter will be `NULL`.

The function must have 2 parameters. Since the second parameter is unused,
[`Py_UNUSED`](intro.md#c.Py_UNUSED) can be used to prevent a compiler warning.

### METH_O

 *Part of the [Stable ABI](stable.md#stable).*

Methods with a single object argument can be listed with the [`METH_O`](#c.METH_O)
flag, instead of invoking [`PyArg_ParseTuple()`](arg.md#c.PyArg_ParseTuple) with a `"O"` argument.
They have the type [`PyCFunction`](#c.PyCFunction), with the *self* parameter, and a
 parameter representing the single argument.

These two constants are not used to indicate the calling convention but the
binding when used with methods of classes.  These may not be used for functions
defined for modules.  At most one of these flags may be set for any given
method.

### METH_CLASS

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-0"></a>

The method will be passed the type object as the first parameter rather
than an instance of the type.  This is used to create *class methods*,
similar to what is created when using the [`classmethod()`](../library/functions.md#classmethod) built-in
function.

### METH_STATIC

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-1"></a>

The method will be passed `NULL` as the first parameter rather than an
instance of the type.  This is used to create *static methods*, similar to
what is created when using the [`staticmethod()`](../library/functions.md#staticmethod) built-in function.

One other constant controls whether a method is loaded in place of another
definition with the same method name.

### METH_COEXIST

 *Part of the [Stable ABI](stable.md#stable).*

The method will be loaded in place of existing definitions.  Without
*METH_COEXIST*, the default is to skip repeated definitions.  Since slot
wrappers are loaded before the method table, the existence of a
*sq_contains* slot, for example, would generate a wrapped method named
[`__contains__()`](../reference/datamodel.md#object.__contains__) and preclude the loading of a corresponding
PyCFunction with the same name.  With the flag defined, the PyCFunction
will be loaded in place of the wrapper object and will co-exist with the
slot.  This is helpful because calls to PyCFunctions are optimized more
than wrapper object calls.

### [PyTypeObject](type.md#c.PyTypeObject) PyCMethod_Type

The type object corresponding to Python C method objects. This is
available as [`types.BuiltinMethodType`](../library/types.md#types.BuiltinMethodType) in the Python layer.

### int PyCMethod_Check([PyObject](#c.PyObject) \*op)

Return true if *op* is an instance of the [`PyCMethod_Type`](#c.PyCMethod_Type) type
or a subtype of it. This function always succeeds.

### int PyCMethod_CheckExact([PyObject](#c.PyObject) \*op)

This is the same as [`PyCMethod_Check()`](#c.PyCMethod_Check), but does not account for
subtypes.

### [PyObject](#c.PyObject) \*PyCMethod_New([PyMethodDef](#c.PyMethodDef) \*ml, [PyObject](#c.PyObject) \*self, [PyObject](#c.PyObject) \*module, [PyTypeObject](type.md#c.PyTypeObject) \*cls)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.9.*

Turn *ml* into a Python [callable](../glossary.md#term-callable) object.
The caller must ensure that *ml* outlives the [callable](../glossary.md#term-callable).
Typically, *ml* is defined as a static variable.

The *self* parameter will be passed as the *self* argument
to the C function in `ml->ml_meth` when invoked.
*self* can be `NULL`.

The [callable](../glossary.md#term-callable) object’s `__module__` attribute
can be set from the given *module* argument.
*module* should be a Python string,
which will be used as name of the module the function is defined in.
If unavailable, it can be set to [`None`](../library/constants.md#None) or `NULL`.

#### SEE ALSO
[`function.__module__`](../reference/datamodel.md#function.__module__)

The *cls* parameter will be passed as the *defining_class*
argument to the C function.
Must be set if [`METH_METHOD`](#c.METH_METHOD) is set on `ml->ml_flags`.

#### Versionadded
Added in version 3.9.

### [PyTypeObject](type.md#c.PyTypeObject) PyCFunction_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object corresponding to Python C function objects. This is
available as [`types.BuiltinFunctionType`](../library/types.md#types.BuiltinFunctionType) in the Python layer.

### int PyCFunction_Check([PyObject](#c.PyObject) \*op)

Return true if *op* is an instance of the [`PyCFunction_Type`](#c.PyCFunction_Type) type
or a subtype of it. This function always succeeds.

### int PyCFunction_CheckExact([PyObject](#c.PyObject) \*op)

This is the same as [`PyCFunction_Check()`](#c.PyCFunction_Check), but does not account for
subtypes.

### [PyObject](#c.PyObject) \*PyCFunction_NewEx([PyMethodDef](#c.PyMethodDef) \*ml, [PyObject](#c.PyObject) \*self, [PyObject](#c.PyObject) \*module)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Equivalent to `PyCMethod_New(ml, self, module, NULL)`.

### [PyObject](#c.PyObject) \*PyCFunction_New([PyMethodDef](#c.PyMethodDef) \*ml, [PyObject](#c.PyObject) \*self)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.4.*

Equivalent to `PyCMethod_New(ml, self, NULL, NULL)`.

### int PyCFunction_GetFlags([PyObject](#c.PyObject) \*func)

 *Part of the [Stable ABI](stable.md#stable).*

Get the function’s flags on *func* as they were passed to
[`ml_flags`](#c.PyMethodDef.ml_flags).

If *func* is not a C function object, this fails with an exception.
*func* must not be `NULL`.

This function returns the function’s flags on success, and `-1` with an
exception set on failure.

### int PyCFunction_GET_FLAGS([PyObject](#c.PyObject) \*func)

This is the same as [`PyCFunction_GetFlags()`](#c.PyCFunction_GetFlags), but without error
or type checking.

### [PyCFunction](#c.PyCFunction) PyCFunction_GetFunction([PyObject](#c.PyObject) \*func)

 *Part of the [Stable ABI](stable.md#stable).*

Get the function pointer on *func* as it was passed to
[`ml_meth`](#c.PyMethodDef.ml_meth).

If *func* is not a C function object, this fails with an exception.
*func* must not be `NULL`.

This function returns the function pointer on success, and `NULL` with an
exception set on failure.

### int PyCFunction_GET_FUNCTION([PyObject](#c.PyObject) \*func)

This is the same as [`PyCFunction_GetFunction()`](#c.PyCFunction_GetFunction), but without error
or type checking.

### [PyObject](#c.PyObject) \*PyCFunction_GetSelf([PyObject](#c.PyObject) \*func)

 *Part of the [Stable ABI](stable.md#stable).*

Get the “self” object on *func*. This is the object that would be passed
to the first argument of a [`PyCFunction`](#c.PyCFunction). For C function objects
created through a [`PyMethodDef`](#c.PyMethodDef) on a [`PyModuleDef`](module.md#c.PyModuleDef), this
is the resulting module object.

If *func* is not a C function object, this fails with an exception.
*func* must not be `NULL`.

This function returns a [borrowed reference](../glossary.md#term-borrowed-reference) to the “self” object
on success, and `NULL` with an exception set on failure.

### [PyObject](#c.PyObject) \*PyCFunction_GET_SELF([PyObject](#c.PyObject) \*func)

This is the same as [`PyCFunction_GetSelf()`](#c.PyCFunction_GetSelf), but without error or
type checking.

## Accessing attributes of extension types

### type PyMemberDef

 *Part of the [Stable ABI](stable.md#stable) (including all members).*

Structure which describes an attribute of a type which corresponds to a C
struct member.
When defining a class, put a NULL-terminated array of these
structures in the [`tp_members`](typeobj.md#c.PyTypeObject.tp_members) slot.

Its fields are, in order:

### const char \*name

Name of the member.
A NULL value marks the end of a `PyMemberDef[]` array.

The string should be static, no copy is made of it.

### int type

The type of the member in the C struct.
See [Member types](#pymemberdef-types) for the possible values.

### [Py_ssize_t](intro.md#c.Py_ssize_t) offset

The offset in bytes that the member is located on the type’s object struct.

### int flags

Zero or more of the [Member flags](#pymemberdef-flags), combined using bitwise OR.

### const char \*doc

The docstring, or NULL.
The string should be static, no copy is made of it.
Typically, it is defined using [`PyDoc_STR`](intro.md#c.PyDoc_STR).

By default (when [`flags`](#c.PyMemberDef.flags) is `0`), members allow
both read and write access.
Use the [`Py_READONLY`](#c.Py_READONLY) flag for read-only access.
Certain types, like [`Py_T_STRING`](#c.Py_T_STRING), imply [`Py_READONLY`](#c.Py_READONLY).
Only [`Py_T_OBJECT_EX`](#c.Py_T_OBJECT_EX) (and legacy [`T_OBJECT`](#c.T_OBJECT)) members can
be deleted.

<a id="pymemberdef-offsets"></a>

For heap-allocated types (created using [`PyType_FromSpec()`](type.md#c.PyType_FromSpec) or similar),
`PyMemberDef` may contain a definition for the special member
`"__vectorcalloffset__"`, corresponding to
[`tp_vectorcall_offset`](typeobj.md#c.PyTypeObject.tp_vectorcall_offset) in type objects.
This member must be defined with `Py_T_PYSSIZET`, and either
`Py_READONLY` or `Py_READONLY | Py_RELATIVE_OFFSET`. For example:

```c
static PyMemberDef spam_type_members[] = {
    {"__vectorcalloffset__", Py_T_PYSSIZET,
     offsetof(Spam_object, vectorcall), Py_READONLY},
    {NULL}  /* Sentinel */
};
```

(You may need to `#include <stddef.h>` for `offsetof()`.)

The legacy offsets [`tp_dictoffset`](typeobj.md#c.PyTypeObject.tp_dictoffset) and
[`tp_weaklistoffset`](typeobj.md#c.PyTypeObject.tp_weaklistoffset) can be defined similarly using
`"__dictoffset__"` and `"__weaklistoffset__"` members, but extensions
are strongly encouraged to use [`Py_TPFLAGS_MANAGED_DICT`](typeobj.md#c.Py_TPFLAGS_MANAGED_DICT) and
[`Py_TPFLAGS_MANAGED_WEAKREF`](typeobj.md#c.Py_TPFLAGS_MANAGED_WEAKREF) instead.

#### Versionchanged
Changed in version 3.12: `PyMemberDef` is always available.
Previously, it required including `"structmember.h"`.

#### Versionchanged
Changed in version 3.14: [`Py_RELATIVE_OFFSET`](#c.Py_RELATIVE_OFFSET) is now allowed for
`"__vectorcalloffset__"`, `"__dictoffset__"` and
`"__weaklistoffset__"`.

### [PyObject](#c.PyObject) \*PyMember_GetOne(const char \*obj_addr, struct [PyMemberDef](#c.PyMemberDef) \*m)

 *Part of the [Stable ABI](stable.md#stable).*

Get an attribute belonging to the object at address *obj_addr*.  The
attribute is described by `PyMemberDef` *m*.  Returns `NULL`
on error.

#### Versionchanged
Changed in version 3.12: `PyMember_GetOne` is always available.
Previously, it required including `"structmember.h"`.

### int PyMember_SetOne(char \*obj_addr, struct [PyMemberDef](#c.PyMemberDef) \*m, [PyObject](#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).*

Set an attribute belonging to the object at address *obj_addr* to object *o*.
The attribute to set is described by `PyMemberDef` *m*.  Returns `0`
if successful and a negative value on failure.

#### Versionchanged
Changed in version 3.12: `PyMember_SetOne` is always available.
Previously, it required including `"structmember.h"`.

<a id="pymemberdef-flags"></a>

### Member flags

The following flags can be used with [`PyMemberDef.flags`](#c.PyMemberDef.flags):

### Py_READONLY

 *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

Not writable.

### Py_AUDIT_READ

 *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

Emit an `object.__getattr__` [audit event](../library/audit_events.md#audit-events)
before reading.

### Py_RELATIVE_OFFSET

 *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

Indicates that the [`offset`](#c.PyMemberDef.offset) of this `PyMemberDef`
entry indicates an offset from the subclass-specific data, rather than
from `PyObject`.

Can only be used as part of the [`Py_tp_members`](typeobj.md#c.Py_tp_members)
[`slot`](type.md#c.PyType_Slot) when creating a class using negative
[`basicsize`](type.md#c.PyType_Spec.basicsize).
It is mandatory in that case.
When setting [`tp_members`](typeobj.md#c.PyTypeObject.tp_members) from the slot during
class creation, Python clears the flag and sets
[`PyMemberDef.offset`](#c.PyMemberDef.offset) to the offset from the `PyObject` struct.

<a id="index-2"></a>

#### Versionchanged
Changed in version 3.10: The `RESTRICTED`, `READ_RESTRICTED` and
`WRITE_RESTRICTED` macros available with
`#include "structmember.h"` are deprecated.
`READ_RESTRICTED` and `RESTRICTED` are equivalent to
[`Py_AUDIT_READ`](#c.Py_AUDIT_READ); `WRITE_RESTRICTED` does nothing.

<a id="index-3"></a>

#### Versionchanged
Changed in version 3.12: The `READONLY` macro was renamed to [`Py_READONLY`](#c.Py_READONLY).
The `PY_AUDIT_READ` macro was renamed with the `Py_` prefix.
The new names are now always available.
Previously, these required `#include "structmember.h"`.
The header is still available and it provides the old names.

<a id="pymemberdef-types"></a>

### Member types

[`PyMemberDef.type`](#c.PyMemberDef.type) can be one of the following macros corresponding
to various C types.
When the member is accessed in Python, it will be converted to the
equivalent Python type.
When it is set from Python, it will be converted back to the C type.
If that is not possible, an exception such as [`TypeError`](../library/exceptions.md#TypeError) or
[`ValueError`](../library/exceptions.md#ValueError) is raised.

Unless marked (D), attributes defined this way cannot be deleted
using e.g. [`del`](../reference/simple_stmts.md#del) or [`delattr()`](../library/functions.md#delattr).

| Macro name                                                                                         | C type                   | Python type                                    |
|----------------------------------------------------------------------------------------------------|--------------------------|------------------------------------------------|
| ### Py_T_BYTE<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*           |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_SHORT<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*          |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_INT<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*            |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_LONG<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*           |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_LONGLONG<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*       |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_UBYTE<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*          |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_UINT<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*           |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_USHORT<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*         |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_ULONG<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*          |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_ULONGLONG<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*      |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_PYSSIZET<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*       |                          | [`int`](../library/functions.md#int)           |
| ### Py_T_FLOAT<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*          |                          | [`float`](../library/functions.md#float)       |
| ### Py_T_DOUBLE<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*         |                          | [`float`](../library/functions.md#float)       |
| ### Py_T_BOOL<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*           | <br/>(written as 0 or 1) | [`bool`](../library/functions.md#bool)         |
| ### Py_T_STRING<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*         | (\*)                     | [`str`](../library/stdtypes.md#str) (RO)       |
| ### Py_T_STRING_INPLACE<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.* | (\*)                     | [`str`](../library/stdtypes.md#str) (RO)       |
| ### Py_T_CHAR<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*           | (0-127)                  | [`str`](../library/stdtypes.md#str) (\*\*)     |
| ### Py_T_OBJECT_EX<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.12.*      |                          | [`object`](../library/functions.md#object) (D) |
> (\*): Zero-terminated, UTF8-encoded C string.
> With `Py_T_STRING` the C representation is a pointer;
> with `Py_T_STRING_INPLACE` the string is stored directly
> in the structure.

> (\*\*): String of length 1. Only ASCII is accepted.

> (RO): Implies [`Py_READONLY`](#c.Py_READONLY).

> (D): Can be deleted, in which case the pointer is set to `NULL`.
> Reading a `NULL` pointer raises [`AttributeError`](../library/exceptions.md#AttributeError).

<a id="index-4"></a>

#### Versionadded
Added in version 3.12: In previous versions, the macros were only available with
`#include "structmember.h"` and were named without the `Py_` prefix
(e.g. as `T_INT`).
The header is still available and contains the old names, along with
the following deprecated types:

### T_OBJECT

Like `Py_T_OBJECT_EX`, but `NULL` is converted to `None`.
This results in surprising behavior in Python: deleting the attribute
effectively sets it to `None`.

### T_NONE

Always `None`. Must be used with [`Py_READONLY`](#c.Py_READONLY).

### Defining Getters and Setters

### type PyGetSetDef

 *Part of the [Stable ABI](stable.md#stable) (including all members).*

Structure to define property-like access for a type. See also description of
the [`PyTypeObject.tp_getset`](typeobj.md#c.PyTypeObject.tp_getset) slot.

### const char \*name

attribute name

### [getter](#c.getter) get

C function to get the attribute.

### [setter](#c.setter) set

Optional C function to set or delete the attribute.
If `NULL`, the attribute is read-only.

### const char \*doc

optional docstring

### void \*closure

Optional user data pointer, providing additional data for getter and setter.

### typedef [PyObject](#c.PyObject) \*(\*getter)([PyObject](#c.PyObject)\*, void\*)

 *Part of the [Stable ABI](stable.md#stable).*

The `get` function takes one  parameter (the
instance) and a user data pointer (the associated `closure`):

It should return a new reference on success or `NULL` with a set exception
on failure.

### typedef int (\*setter)([PyObject](#c.PyObject)\*, [PyObject](#c.PyObject)\*, void\*)

 *Part of the [Stable ABI](stable.md#stable).*

`set` functions take two  parameters (the instance and
the value to be set) and a user data pointer (the associated `closure`):

In case the attribute should be deleted the second parameter is `NULL`.
Should return `0` on success or `-1` with a set exception on failure.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

<a id="allocating-objects"></a>

# Allocating objects on the heap

### [PyObject](structures.md#c.PyObject) \*\_PyObject_New([PyTypeObject](type.md#c.PyTypeObject) \*type)

*Return value: New reference.*

### [PyVarObject](structures.md#c.PyVarObject) \*\_PyObject_NewVar([PyTypeObject](type.md#c.PyTypeObject) \*type, [Py_ssize_t](intro.md#c.Py_ssize_t) size)

*Return value: New reference.*

### [PyObject](structures.md#c.PyObject) \*PyObject_Init([PyObject](structures.md#c.PyObject) \*op, [PyTypeObject](type.md#c.PyTypeObject) \*type)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

Initialize a newly allocated object *op* with its type and initial
reference.  Returns the initialized object.  Other fields of the object are
not initialized.  Despite its name, this function is unrelated to the
object’s [`__init__()`](../reference/datamodel.md#object.__init__) method ([`tp_init`](typeobj.md#c.PyTypeObject.tp_init)
slot).  Specifically, this function does **not** call the object’s
`__init__()` method.

In general, consider this function to be a low-level routine. Use
[`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) where possible.
For implementing `tp_alloc` for your type, prefer
[`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc) or [`PyObject_New()`](#c.PyObject_New).

#### NOTE
This function only initializes the object’s memory corresponding to the
initial [`PyObject`](structures.md#c.PyObject) structure.  It does not zero the rest.

### [PyVarObject](structures.md#c.PyVarObject) \*PyObject_InitVar([PyVarObject](structures.md#c.PyVarObject) \*op, [PyTypeObject](type.md#c.PyTypeObject) \*type, [Py_ssize_t](intro.md#c.Py_ssize_t) size)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

This does everything [`PyObject_Init()`](#c.PyObject_Init) does, and also initializes the
length information for a variable-size object.

#### NOTE
This function only initializes some of the object’s memory.  It does not
zero the rest.

### PyObject_New(TYPE, typeobj)

Allocates a new Python object using the C structure type *TYPE* and the
Python type object *typeobj* (`PyTypeObject*`) by calling
[`PyObject_Malloc()`](memory.md#c.PyObject_Malloc) to allocate memory and initializing it like
[`PyObject_Init()`](#c.PyObject_Init).  The caller will own the only reference to the
object (i.e. its reference count will be one).

Avoid calling this directly to allocate memory for an object; call the type’s
[`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot instead.

When populating a type’s [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot,
[`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc) is preferred over a custom function that
simply calls this macro.

This macro does not call [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc),
[`tp_new`](typeobj.md#c.PyTypeObject.tp_new) ([`__new__()`](../reference/datamodel.md#object.__new__)), or
[`tp_init`](typeobj.md#c.PyTypeObject.tp_init) ([`__init__()`](../reference/datamodel.md#object.__init__)).

This cannot be used for objects with [`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC) set in
[`tp_flags`](typeobj.md#c.PyTypeObject.tp_flags); use [`PyObject_GC_New`](gcsupport.md#c.PyObject_GC_New) instead.

Memory allocated by this macro must be freed with [`PyObject_Free()`](memory.md#c.PyObject_Free)
(usually called via the object’s [`tp_free`](typeobj.md#c.PyTypeObject.tp_free) slot).

#### NOTE
The returned memory is not guaranteed to have been completely zeroed
before it was initialized.

#### NOTE
This macro does not construct a fully initialized object of the given
type; it merely allocates memory and prepares it for further
initialization by [`tp_init`](typeobj.md#c.PyTypeObject.tp_init).  To construct a
fully initialized object, call *typeobj* instead.  For example:

```c
PyObject *foo = PyObject_CallNoArgs((PyObject *)&PyFoo_Type);
```

#### SEE ALSO
* [`PyObject_Free()`](memory.md#c.PyObject_Free)
* [`PyObject_GC_New`](gcsupport.md#c.PyObject_GC_New)
* [`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc)
* [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc)

### PyObject_NewVar(TYPE, typeobj, size)

Like [`PyObject_New`](#c.PyObject_New) except:

* It allocates enough memory for the *TYPE* structure plus *size*
  (`Py_ssize_t`) fields of the size given by the
  [`tp_itemsize`](typeobj.md#c.PyTypeObject.tp_itemsize) field of *typeobj*.
* The memory is initialized like [`PyObject_InitVar()`](#c.PyObject_InitVar).

This is useful for implementing objects like tuples, which are able to
determine their size at construction time.  Embedding the array of fields
into the same allocation decreases the number of allocations, improving the
memory management efficiency.

Avoid calling this directly to allocate memory for an object; call the type’s
[`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot instead.

When populating a type’s [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot,
[`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc) is preferred over a custom function that
simply calls this macro.

This cannot be used for objects with [`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC) set in
[`tp_flags`](typeobj.md#c.PyTypeObject.tp_flags); use [`PyObject_GC_NewVar`](gcsupport.md#c.PyObject_GC_NewVar)
instead.

Memory allocated by this function must be freed with [`PyObject_Free()`](memory.md#c.PyObject_Free)
(usually called via the object’s [`tp_free`](typeobj.md#c.PyTypeObject.tp_free) slot).

#### NOTE
The returned memory is not guaranteed to have been completely zeroed
before it was initialized.

#### NOTE
This macro does not construct a fully initialized object of the given
type; it merely allocates memory and prepares it for further
initialization by [`tp_init`](typeobj.md#c.PyTypeObject.tp_init).  To construct a
fully initialized object, call *typeobj* instead.  For example:

```c
PyObject *list_instance = PyObject_CallNoArgs((PyObject *)&PyList_Type);
```

#### SEE ALSO
* [`PyObject_Free()`](memory.md#c.PyObject_Free)
* [`PyObject_GC_NewVar`](gcsupport.md#c.PyObject_GC_NewVar)
* [`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc)
* [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc)

### [PyObject](structures.md#c.PyObject) \_Py_NoneStruct

Object which is visible in Python as `None`.  This should only be accessed
using the [`Py_None`](none.md#c.Py_None) macro, which evaluates to a pointer to this
object.

#### SEE ALSO
[Module Objects](module.md#moduleobjects)
: To allocate and create extension modules.

## Soft-deprecated aliases

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.15.

These are aliases to existing functions and macros.
They exist solely for backwards compatibility.

| Soft-deprecated alias                  | Function                                             |
|----------------------------------------|------------------------------------------------------|
| ### PyObject_NEW(type, typeobj)        | [`PyObject_New`](#c.PyObject_New)                    |
| ### PyObject_NEW_VAR(type, typeobj, n) | [`PyObject_NewVar`](#c.PyObject_NewVar)              |
| ### PyObject_INIT(op, typeobj)         | [`PyObject_Init()`](#c.PyObject_Init)                |
| ### PyObject_INIT_VAR(op, typeobj, n)  | [`PyObject_InitVar()`](#c.PyObject_InitVar)          |
| ### PyObject_MALLOC(n)                 | [`PyObject_Malloc()`](memory.md#c.PyObject_Malloc)   |
| ### PyObject_REALLOC(p, n)             | [`PyObject_Realloc()`](memory.md#c.PyObject_Realloc) |
| ### PyObject_FREE(p)                   | [`PyObject_Free()`](memory.md#c.PyObject_Free)       |
| ### PyObject_DEL(p)                    | [`PyObject_Free()`](memory.md#c.PyObject_Free)       |
| ### PyObject_Del(p)                    | [`PyObject_Free()`](memory.md#c.PyObject_Free)       |
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

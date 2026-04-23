<a id="moduleobjects"></a>

# Module Objects

<a id="index-0"></a>

### [PyTypeObject](type.md#c.PyTypeObject) PyModule_Type

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-1"></a>

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python module type.  This
is exposed to Python programs as [`types.ModuleType`](../library/types.md#types.ModuleType).

### int PyModule_Check([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a module object, or a subtype of a module object.
This function always succeeds.

### int PyModule_CheckExact([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a module object, but not a subtype of
[`PyModule_Type`](#c.PyModule_Type).  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyModule_NewObject([PyObject](structures.md#c.PyObject) \*name)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

<a id="index-2"></a>

Return a new module object with [`module.__name__`](../reference/datamodel.md#module.__name__) set to *name*.
The module’s `__name__`, [`__doc__`](../reference/datamodel.md#module.__doc__),
[`__package__`](../reference/datamodel.md#module.__package__) and [`__loader__`](../reference/datamodel.md#module.__loader__) attributes are
filled in (all but `__name__` are set to `None`). The caller is
responsible for setting a [`__file__`](../reference/datamodel.md#module.__file__) attribute.

Return `NULL` with an exception set on error.

#### Versionadded
Added in version 3.3.

#### Versionchanged
Changed in version 3.4: [`__package__`](../reference/datamodel.md#module.__package__) and [`__loader__`](../reference/datamodel.md#module.__loader__) are now set to
`None`.

### [PyObject](structures.md#c.PyObject) \*PyModule_New(const char \*name)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Similar to [`PyModule_NewObject()`](#c.PyModule_NewObject), but the name is a UTF-8 encoded
string instead of a Unicode object.

### [PyObject](structures.md#c.PyObject) \*PyModule_GetDict([PyObject](structures.md#c.PyObject) \*module)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-3"></a>

Return the dictionary object that implements *module*’s namespace; this object
is the same as the [`__dict__`](../reference/datamodel.md#object.__dict__) attribute of the module object.
If *module* is not a module object (or a subtype of a module object),
[`SystemError`](../library/exceptions.md#SystemError) is raised and `NULL` is returned.

It is recommended extensions use other `PyModule_*` and
`PyObject_*` functions rather than directly manipulate a module’s
[`__dict__`](../reference/datamodel.md#object.__dict__).

The returned reference is borrowed from the module; it is valid until
the module is destroyed.

### [PyObject](structures.md#c.PyObject) \*PyModule_GetNameObject([PyObject](structures.md#c.PyObject) \*module)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

<a id="index-4"></a>

Return *module*’s [`__name__`](../reference/datamodel.md#module.__name__) value.  If the module does not
provide one, or if it is not a string, [`SystemError`](../library/exceptions.md#SystemError) is raised and
`NULL` is returned.

#### Versionadded
Added in version 3.3.

### const char \*PyModule_GetName([PyObject](structures.md#c.PyObject) \*module)

 *Part of the [Stable ABI](stable.md#stable).*

Similar to [`PyModule_GetNameObject()`](#c.PyModule_GetNameObject) but return the name encoded to
`'utf-8'`.

The returned buffer is only valid until the module is renamed or destroyed.
Note that Python code may rename a module by setting its [`__name__`](../reference/datamodel.md#module.__name__)
attribute.

### [PyModuleDef](#c.PyModuleDef) \*PyModule_GetDef([PyObject](structures.md#c.PyObject) \*module)

 *Part of the [Stable ABI](stable.md#stable).*

Return a pointer to the [`PyModuleDef`](#c.PyModuleDef) struct from which the module was
created, or `NULL` if the module wasn’t created from a definition.

On error, return `NULL` with an exception set.
Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to tell this case apart from a missing
`PyModuleDef`.

### [PyObject](structures.md#c.PyObject) \*PyModule_GetFilenameObject([PyObject](structures.md#c.PyObject) \*module)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-5"></a>

Return the name of the file from which *module* was loaded using *module*’s
[`__file__`](../reference/datamodel.md#module.__file__) attribute.  If this is not defined, or if it is not a
string, raise [`SystemError`](../library/exceptions.md#SystemError) and return `NULL`; otherwise return
a reference to a Unicode object.

#### Versionadded
Added in version 3.2.

### const char \*PyModule_GetFilename([PyObject](structures.md#c.PyObject) \*module)

 *Part of the [Stable ABI](stable.md#stable).*

Similar to [`PyModule_GetFilenameObject()`](#c.PyModule_GetFilenameObject) but return the filename
encoded to ‘utf-8’.

The returned buffer is only valid until the module’s [`__file__`](../reference/datamodel.md#module.__file__) attribute
is reassigned or the module is destroyed.

#### Deprecated
Deprecated since version 3.2: [`PyModule_GetFilename()`](#c.PyModule_GetFilename) raises [`UnicodeEncodeError`](../library/exceptions.md#UnicodeEncodeError) on
unencodable filenames, use [`PyModule_GetFilenameObject()`](#c.PyModule_GetFilenameObject) instead.

<a id="pymoduledef-slot"></a>

## Module definition

Modules created using the C API are typically defined using an
array of *slots*.
The slots provide a “description” of how a module should be created.

#### Versionchanged
Changed in version 3.15: Previously, a [`PyModuleDef`](#c.PyModuleDef) struct was necessary to define modules.
The older way of defining modules is still available: consult either the
[Module definition struct](#pymoduledef) section or earlier versions of this documentation
if you plan to support earlier Python versions.

The slots array is usually used to define an extension module’s “main”
module object (see [Defining extension modules](extension-modules.md#extension-modules) for details).
It can also be used to
[create extension modules dynamically](#module-from-slots).

Unless specified otherwise, the same slot ID may not be repeated
in an array of slots.

### type PyModuleDef_Slot

 *Part of the [Stable ABI](stable.md#stable) (including all members) since version 3.5.*

### int slot

A slot ID, chosen from the available `Py_mod_*` values explained below.

An ID of 0 marks the end of a `PyModuleDef_Slot` array.

### void \*value

Value of the slot, whose meaning depends on the slot ID.

The value may not be NULL.
To leave a slot out, omit the [`PyModuleDef_Slot`](#c.PyModuleDef_Slot) entry entirely.

#### Versionadded
Added in version 3.5.

### Metadata slots

### Py_mod_name

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for the name of the new module,
as a NUL-terminated UTF8-encoded `const char *`.

Note that modules are typically created using a
[`ModuleSpec`](../library/importlib.md#importlib.machinery.ModuleSpec), and when they are, the
name from the spec will be used instead of `Py_mod_name`.
However, it is still recommended to include this slot for introspection
and debugging purposes.

#### Versionadded
Added in version 3.15: Use [`PyModuleDef.m_name`](#c.PyModuleDef.m_name) instead to support previous versions.

### Py_mod_doc

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for the docstring of the new
module, as a NUL-terminated UTF8-encoded `const char *`.

Usually it is set to a variable created with [`PyDoc_STRVAR`](intro.md#c.PyDoc_STRVAR).

#### Versionadded
Added in version 3.15: Use [`PyModuleDef.m_doc`](#c.PyModuleDef.m_doc) instead to support previous versions.

### Feature slots

### Py_mod_abi

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) whose value points to
a [`PyABIInfo`](stable.md#c.PyABIInfo) structure describing the ABI that
the extension is using.

A suitable `PyABIInfo` variable can be defined using the
[`PyABIInfo_VAR`](stable.md#c.PyABIInfo_VAR) macro, as in:

```c
PyABIInfo_VAR(abi_info);

static PyModuleDef_Slot mymodule_slots[] = {
   {Py_mod_abi, &abi_info},
   ...
};
```

When creating a module, Python checks the value of this slot
using [`PyABIInfo_Check()`](stable.md#c.PyABIInfo_Check).

This slot is required, except for modules created from
[`PyModuleDef`](#c.PyModuleDef).

#### Versionadded
Added in version 3.15.

### Py_mod_multiple_interpreters

 *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) whose value is one of:

### Py_MOD_MULTIPLE_INTERPRETERS_NOT_SUPPORTED

The module does not support being imported in subinterpreters.

### Py_MOD_MULTIPLE_INTERPRETERS_SUPPORTED

The module supports being imported in subinterpreters,
but only when they share the main interpreter’s GIL.
(See [Isolating Extension Modules](../howto/isolating-extensions.md#isolating-extensions-howto).)

### Py_MOD_PER_INTERPRETER_GIL_SUPPORTED

The module supports being imported in subinterpreters,
even when they have their own GIL.
(See [Isolating Extension Modules](../howto/isolating-extensions.md#isolating-extensions-howto).)

This slot determines whether or not importing this module
in a subinterpreter will fail.

If `Py_mod_multiple_interpreters` is not specified, the import
machinery defaults to `Py_MOD_MULTIPLE_INTERPRETERS_SUPPORTED`.

#### Versionadded
Added in version 3.12.

### Py_mod_gil

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) whose value is one of:

### Py_MOD_GIL_USED

The module depends on the presence of the global interpreter lock (GIL),
and may access global state without synchronization.

### Py_MOD_GIL_NOT_USED

The module is safe to run without an active GIL.

This slot is ignored by Python builds not configured with
[`--disable-gil`](../using/configure.md#cmdoption-disable-gil).  Otherwise, it determines whether or not importing
this module will cause the GIL to be automatically enabled. See
[Free-threaded CPython](../whatsnew/3.13.md#whatsnew313-free-threaded-cpython) for more detail.

If `Py_mod_gil` is not specified, the import machinery defaults to
`Py_MOD_GIL_USED`.

#### Versionadded
Added in version 3.13.

### Creation and initialization slots

### Py_mod_create

 *Part of the [Stable ABI](stable.md#stable) since version 3.5.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for a function that creates
the module object itself.
The function must have the signature:

### [PyObject](structures.md#c.PyObject) \*create_module([PyObject](structures.md#c.PyObject) \*spec, [PyModuleDef](#c.PyModuleDef) \*def)

The function will be called with:

- *spec*: a `ModuleSpec`-like object, meaning that any attributes defined
  for [`importlib.machinery.ModuleSpec`](../library/importlib.md#importlib.machinery.ModuleSpec) have matching semantics.
  However, any of the attributes may be missing.
- *def*: `NULL`, or the module definition if the module is created from one.

The function should return a new module object, or set an error
and return `NULL`.

This function should be kept minimal. In particular, it should not
call arbitrary Python code, as trying to import the same module again may
result in an infinite loop.

If `Py_mod_create` is not specified, the import machinery will create
a normal module object using [`PyModule_New()`](#c.PyModule_New). The name is taken from
*spec*, not the definition, to allow extension modules to dynamically adjust
to their place in the module hierarchy and be imported under different
names through symlinks, all while sharing a single module definition.

There is no requirement for the returned object to be an instance of
[`PyModule_Type`](#c.PyModule_Type).
However, some slots may only be used with
`PyModule_Type` instances; in particular:

- [`Py_mod_exec`](#c.Py_mod_exec),
- [module state slots](#ext-module-state-slots) (`Py_mod_state_*`),
- [`Py_mod_token`](#c.Py_mod_token).

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.15: The *slots* argument may be a `ModuleSpec`-like object, rather than
a true [`ModuleSpec`](../library/importlib.md#importlib.machinery.ModuleSpec) instance.
Note that previous versions of CPython did not enforce this.

The *def* argument may now be `NULL`, since modules are not necessarily
made from definitions.

### Py_mod_exec

 *Part of the [Stable ABI](stable.md#stable) since version 3.5.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for a function that will
*execute*, or initialize, the module.
This function does the equivalent to executing the code of a Python module:
typically, it adds classes and constants to the module.
The signature of the function is:

### int exec_module([PyObject](structures.md#c.PyObject) \*module)

See the [Support functions](#capi-module-support-functions) section for some useful
functions to call.

For backwards compatibility, the [`PyModuleDef.m_slots`](#c.PyModuleDef.m_slots) array may
contain multiple `Py_mod_exec` slots; these are processed in the
order they appear in the array.
Elsewhere (that is, in arguments to [`PyModule_FromSlotsAndSpec()`](#c.PyModule_FromSlotsAndSpec)
and in return values of `PyModExport_ *<name>*`), repeating the slot
is not allowed.

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.15: Repeated `Py_mod_exec` slots are disallowed, except in
[`PyModuleDef.m_slots`](#c.PyModuleDef.m_slots).

### Py_mod_methods

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for a table of module-level
functions, as an array of [`PyMethodDef`](structures.md#c.PyMethodDef) values suitable as the
*functions* argument to [`PyModule_AddFunctions()`](#c.PyModule_AddFunctions).

Like other slot IDs, a slots array may only contain one
`Py_mod_methods` entry.
To add functions from multiple [`PyMethodDef`](structures.md#c.PyMethodDef) arrays, call
[`PyModule_AddFunctions()`](#c.PyModule_AddFunctions) in the [`Py_mod_exec`](#c.Py_mod_exec) function.

The table must be statically allocated (or otherwise guaranteed to outlive
the module object).

#### Versionadded
Added in version 3.15: Use [`PyModuleDef.m_methods`](#c.PyModuleDef.m_methods) instead to support previous versions.

<a id="ext-module-state"></a>

## Module state

Extension modules can have *module state* – a
piece of memory that is allocated on module creation,
and freed when the module object is deallocated.
The module state is specified using [dedicated slots](#ext-module-state-slots).

A typical use of module state is storing an exception type – or indeed *any*
type object defined by the module –

Unlike the module’s Python attributes, Python code cannot replace or delete
data stored in module state.

Keeping per-module information in attributes and module state, rather than in
static globals, makes module objects *isolated* and safer for use in
multiple sub-interpreters.
It also helps Python do an orderly clean-up when it shuts down.

Extensions that keep references to Python objects as part of module state must
implement [`Py_mod_state_traverse`](#c.Py_mod_state_traverse) and [`Py_mod_state_clear`](#c.Py_mod_state_clear)
functions to avoid reference leaks.

To retrieve the state from a given module, use the following functions:

### void \*PyModule_GetState([PyObject](structures.md#c.PyObject) \*module)

 *Part of the [Stable ABI](stable.md#stable).*

Return the “state” of the module, that is, a pointer to the block of memory
allocated at module creation time, or `NULL`.  See
[`Py_mod_state_size`](#c.Py_mod_state_size).

On error, return `NULL` with an exception set.
Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to tell this case apart from missing
module state.

### int PyModule_GetStateSize([PyObject](structures.md#c.PyObject) \*module, [Py_ssize_t](intro.md#c.Py_ssize_t) \*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Set  *\*result* to the size of *module*’s state, as specified
using [`Py_mod_state_size`](#c.Py_mod_state_size) (or [`PyModuleDef.m_size`](#c.PyModuleDef.m_size)),
and return 0.

On error, set  *\*result* to -1, and return -1 with an exception set.

#### Versionadded
Added in version 3.15.

<a id="ext-module-state-slots"></a>

### Slots for defining module state

The following [`PyModuleDef_Slot.slot`](#c.PyModuleDef_Slot.slot) IDs are available for
defining the module state.

### Py_mod_state_size

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for the size of the module state,
in bytes.

Setting the value to a non-negative value means that the module can be
re-initialized and specifies the additional amount of memory it requires
for its state.

See [**PEP 3121**](https://peps.python.org/pep-3121/) for more details.

Use [`PyModule_GetStateSize()`](#c.PyModule_GetStateSize) to retrieve the size of a given module.

#### Versionadded
Added in version 3.15: Use [`PyModuleDef.m_size`](#c.PyModuleDef.m_size) instead to support previous versions.

### Py_mod_state_traverse

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for a traversal function to call
during GC traversal of the module object.

The signature of the function, and meanings of the arguments,
is similar as for [`PyTypeObject.tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse):

### int traverse_module_state([PyObject](structures.md#c.PyObject) \*module, [visitproc](gcsupport.md#c.visitproc) visit, void \*arg)

This function is not called if the module state was requested but is not
allocated yet. This is the case immediately after the module is created
and before the module is executed ([`Py_mod_exec`](#c.Py_mod_exec) function). More
precisely, this function is not called if the state size
([`Py_mod_state_size`](#c.Py_mod_state_size)) is greater than 0 and the module state
(as returned by [`PyModule_GetState()`](#c.PyModule_GetState)) is `NULL`.

#### Versionadded
Added in version 3.15: Use [`PyModuleDef.m_size`](#c.PyModuleDef.m_size) instead to support previous versions.

### Py_mod_state_clear

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for a clear function to call
during GC clearing of the module object.

The signature of the function is:

### int clear_module_state([PyObject](structures.md#c.PyObject) \*module)

This function is not called if the module state was requested but is not
allocated yet. This is the case immediately after the module is created
and before the module is executed ([`Py_mod_exec`](#c.Py_mod_exec) function). More
precisely, this function is not called if the state size
([`Py_mod_state_size`](#c.Py_mod_state_size)) is greater than 0 and the module state
(as returned by [`PyModule_GetState()`](#c.PyModule_GetState)) is `NULL`.

Like [`PyTypeObject.tp_clear`](typeobj.md#c.PyTypeObject.tp_clear), this function is not *always*
called before a module is deallocated. For example, when reference
counting is enough to determine that an object is no longer used,
the cyclic garbage collector is not involved and
the [`Py_mod_state_free`](#c.Py_mod_state_free) function is called directly.

#### Versionadded
Added in version 3.15: Use [`PyModuleDef.m_clear`](#c.PyModuleDef.m_clear) instead to support previous versions.

### Py_mod_state_free

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for a function to call during
deallocation of the module object.

The signature of the function is:

### int free_module_state([PyObject](structures.md#c.PyObject) \*module)

This function is not called if the module state was requested but is not
allocated yet. This is the case immediately after the module is created
and before the module is executed ([`Py_mod_exec`](#c.Py_mod_exec) function). More
precisely, this function is not called if the state size
([`Py_mod_state_size`](#c.Py_mod_state_size)) is greater than 0 and the module state
(as returned by [`PyModule_GetState()`](#c.PyModule_GetState)) is `NULL`.

#### Versionadded
Added in version 3.15: Use [`PyModuleDef.m_free`](#c.PyModuleDef.m_free) instead to support previous versions.

<a id="ext-module-token"></a>

### Module token

Each module may have an associated *token*: a pointer-sized value intended to
identify of the module state’s memory layout.
This means that if you have a module object, but you are not sure if it
“belongs” to your extension, you can check using code like this:

```c
PyObject *module = <the module in question>

void *module_token;
if (PyModule_GetToken(module, &module_token) < 0) {
    return NULL;
}
if (module_token != your_token) {
    PyErr_SetString(PyExc_ValueError, "unexpected module")
    return NULL;
}

// This module's state has the expected memory layout; it's safe to cast
struct my_state state = (struct my_state*)PyModule_GetState(module)
```

A module’s token – and the *your_token* value to use in the above code – is:

- For modules created with [`PyModuleDef`](#c.PyModuleDef): the address of that
  [`PyModuleDef`](#c.PyModuleDef);
- For modules defined with the [`Py_mod_token`](#c.Py_mod_token) slot: the value
  of that slot;
- For modules created from an `PyModExport_*`
  [export hook](extension-modules.md#extension-export-hook): the slots array that the export
  hook returned (unless overridden with [`Py_mod_token`](#c.Py_mod_token)).

### Py_mod_token

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

[`Slot ID`](#c.PyModuleDef_Slot.slot) for the module token.

If you use this slot to set the module token (rather than rely on the
default), you must ensure that:

* The pointer outlives the class, so it’s not reused for something else
  while the class exists.
* It “belongs” to the extension module where the class lives, so it will not
  clash with other extensions.
* If the token points to a [`PyModuleDef`](#c.PyModuleDef) struct, the module should
  behave as if it was created from that [`PyModuleDef`](#c.PyModuleDef).
  In particular, the module state must have matching layout and semantics.

Modules created from [`PyModuleDef`](#c.PyModuleDef) always use the address of
the [`PyModuleDef`](#c.PyModuleDef) as the token.
This means that `Py_mod_token` cannot be used in
[`PyModuleDef.m_slots`](#c.PyModuleDef.m_slots).

#### Versionadded
Added in version 3.15.

### int PyModule_GetToken([PyObject](structures.md#c.PyObject) \*module, void \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Set  *\*result* to the module token for *module* and return 0.

On error, set  *\*result* to NULL, and return -1 with an exception set.

#### Versionadded
Added in version 3.15.

See also [`PyType_GetModuleByToken()`](type.md#c.PyType_GetModuleByToken).

<a id="module-from-slots"></a>

## Creating extension modules dynamically

The following functions may be used to create an extension module dynamically,
rather than from an extension’s [export hook](extension-modules.md#extension-export-hook).

### [PyObject](structures.md#c.PyObject) \*PyModule_FromSlotsAndSpec(const [PyModuleDef_Slot](#c.PyModuleDef_Slot) \*slots, [PyObject](structures.md#c.PyObject) \*spec)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Create a new module object, given an array of [slots](#pymoduledef-slot)
and the [`ModuleSpec`](../library/importlib.md#importlib.machinery.ModuleSpec) *spec*.

The *slots* argument must point to an array of [`PyModuleDef_Slot`](#c.PyModuleDef_Slot)
structures, terminated by an entry with slot ID of 0
(typically written as `{0}` or `{0, NULL}` in C).
The array must include a [`Py_mod_abi`](#c.Py_mod_abi) entry.

The *spec* argument may be any `ModuleSpec`-like object, as described
in [`Py_mod_create`](#c.Py_mod_create) documentation.
Currently, the *spec* must have a `name` attribute.

On success, return the new module.
On error, return `NULL` with an exception set.

Note that this does not process the module’s execution slot
([`Py_mod_exec`](#c.Py_mod_exec)).
Both `PyModule_FromSlotsAndSpec()` and [`PyModule_Exec()`](#c.PyModule_Exec)
must be called to fully initialize a module.
(See also [Multi-phase initialization](extension-modules.md#multi-phase-initialization).)

The *slots* array only needs to be valid for the duration of the
`PyModule_FromSlotsAndSpec()` call.
In particular, it may be heap-allocated.

#### Versionadded
Added in version 3.15.

### int PyModule_Exec([PyObject](structures.md#c.PyObject) \*module)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Execute the [`Py_mod_exec`](#c.Py_mod_exec) slot(s) of *module*.

On success, return 0.
On error, return -1 with an exception set.

For clarity: If *module* has no slots, for example if it uses
[legacy single-phase initialization](extension-modules.md#single-phase-initialization),
this function does nothing and returns 0.

#### Versionadded
Added in version 3.15.

<a id="pymoduledef"></a>

## Module definition struct

Traditionally, extension modules were defined using a *module definition*
as the “description” of how a module should be created.
Rather than using an array of [slots](#pymoduledef-slot) directly,
the definition has dedicated members for most common functionality,
and allows additional slots as an extension mechanism.

This way of defining modules is still available and there are no plans to
remove it.

### type PyModuleDef

 *Part of the [Stable ABI](stable.md#stable) (see below).*

The module definition struct, which holds information needed to create
a module object.

This structure must be statically allocated (or be otherwise guaranteed
to be valid while any modules created from it exist).
Usually, there is only one variable of this type for each extension module
defined this way.

The struct, including all members, is part of the
[Stable ABI](stable.md#stable-abi) for non-free-threaded builds (`abi3`).
In the Stable ABI for free-threaded builds (`abi3t`),
this struct is opaque, and unusable in practice; see [Module definition](#pymoduledef-slot)
for a replacement.

### [PyModuleDef_Base](#c.PyModuleDef_Base) m_base

Always initialize this member to [`PyModuleDef_HEAD_INIT`](#c.PyModuleDef_HEAD_INIT):

### type PyModuleDef_Base

 *Part of the [Stable ABI](stable.md#stable) (see below).*

The type of `PyModuleDef.m_base`.

The struct is part of the [Stable ABI](stable.md#stable-abi) for
non-free-threaded builds (`abi3`).
In the Stable ABI for Free-Threaded Builds
(`abi3t`), this struct is opaque, and unusable in practice.

### PyModuleDef_HEAD_INIT

The required initial value for `PyModuleDef.m_base`.

### const char \*m_name

Corresponds to the [`Py_mod_name`](#c.Py_mod_name) slot.

### const char \*m_doc

These members correspond to the [`Py_mod_doc`](#c.Py_mod_doc) slot.
Setting this to NULL is equivalent to omitting the slot.

### [Py_ssize_t](intro.md#c.Py_ssize_t) m_size

Corresponds to the [`Py_mod_state_size`](#c.Py_mod_state_size) slot.
Setting this to zero is equivalent to omitting the slot.

When using [legacy single-phase initialization](extension-modules.md#single-phase-initialization)
or when creating modules dynamically using [`PyModule_Create()`](#c.PyModule_Create)
or [`PyModule_Create2()`](#c.PyModule_Create2), `m_size` may be set to -1.
This indicates that the module does not support sub-interpreters,
because it has global state.

### [PyMethodDef](structures.md#c.PyMethodDef) \*m_methods

Corresponds to the [`Py_mod_methods`](#c.Py_mod_methods) slot.
Setting this to NULL is equivalent to omitting the slot.

### [PyModuleDef_Slot](#c.PyModuleDef_Slot) \*m_slots

An array of additional slots, terminated by a `{0, NULL}` entry.

If the array contains slots corresponding to [`PyModuleDef`](#c.PyModuleDef)
members, the values must match.
For example, if you use [`Py_mod_name`](#c.Py_mod_name) in `m_slots`,
[`PyModuleDef.m_name`](#c.PyModuleDef.m_name) must be set to the same pointer
(not just an equal string).

#### Versionchanged
Changed in version 3.5: Prior to version 3.5, this member was always set to `NULL`,
and was defined as:

> ### [inquiry](gcsupport.md#c.inquiry) m_reload

### [traverseproc](gcsupport.md#c.traverseproc) m_traverse

### [inquiry](gcsupport.md#c.inquiry) m_clear

### [freefunc](typeobj.md#c.freefunc) m_free

These members correspond to the [`Py_mod_state_traverse`](#c.Py_mod_state_traverse),
[`Py_mod_state_clear`](#c.Py_mod_state_clear), and [`Py_mod_state_free`](#c.Py_mod_state_free) slots,
respectively.

Setting these members to NULL is equivalent to omitting the
corresponding slots.

#### Versionchanged
Changed in version 3.9: [`m_traverse`](#c.PyModuleDef.m_traverse), [`m_clear`](#c.PyModuleDef.m_clear) and [`m_free`](#c.PyModuleDef.m_free)
functions are no longer called before the module state is allocated.

### [PyTypeObject](type.md#c.PyTypeObject) PyModuleDef_Type

 *Part of the [Stable ABI](stable.md#stable) since version 3.5.*

The type of `PyModuleDef` objects.

<a id="moduledef-dynamic"></a>

The following API can be used to create modules from a `PyModuleDef`
struct:

### [PyObject](structures.md#c.PyObject) \*PyModule_Create([PyModuleDef](#c.PyModuleDef) \*def)

*Return value: New reference.*

Create a new module object, given the definition in *def*.
This is a macro that calls [`PyModule_Create2()`](#c.PyModule_Create2) with
*module_api_version* set to [`PYTHON_API_VERSION`](#c.PYTHON_API_VERSION), or
to [`PYTHON_ABI_VERSION`](#c.PYTHON_ABI_VERSION) if using the
[limited API](stable.md#limited-c-api).

### [PyObject](structures.md#c.PyObject) \*PyModule_Create2([PyModuleDef](#c.PyModuleDef) \*def, int module_api_version)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a new module object, given the definition in *def*, assuming the
API version *module_api_version*.  If that version does not match the version
of the running interpreter, a [`RuntimeWarning`](../library/exceptions.md#RuntimeWarning) is emitted.

Return `NULL` with an exception set on error.

This function does not support slots.
The [`m_slots`](#c.PyModuleDef.m_slots) member of *def* must be `NULL`.

#### NOTE
Most uses of this function should be using [`PyModule_Create()`](#c.PyModule_Create)
instead; only use this if you are sure you need it.

### [PyObject](structures.md#c.PyObject) \*PyModule_FromDefAndSpec([PyModuleDef](#c.PyModuleDef) \*def, [PyObject](structures.md#c.PyObject) \*spec)

*Return value: New reference.*

This macro calls [`PyModule_FromDefAndSpec2()`](#c.PyModule_FromDefAndSpec2) with
*module_api_version* set to [`PYTHON_API_VERSION`](#c.PYTHON_API_VERSION), or
to [`PYTHON_ABI_VERSION`](#c.PYTHON_ABI_VERSION) if using the
[limited API](stable.md#limited-c-api).

#### Versionadded
Added in version 3.5.

### [PyObject](structures.md#c.PyObject) \*PyModule_FromDefAndSpec2([PyModuleDef](#c.PyModuleDef) \*def, [PyObject](structures.md#c.PyObject) \*spec, int module_api_version)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Create a new module object, given the definition in *def* and the
ModuleSpec *spec*, assuming the API version *module_api_version*.
If that version does not match the version of the running interpreter,
a [`RuntimeWarning`](../library/exceptions.md#RuntimeWarning) is emitted.

Return `NULL` with an exception set on error.

Note that this does not process execution slots ([`Py_mod_exec`](#c.Py_mod_exec)).
Both `PyModule_FromDefAndSpec` and `PyModule_ExecDef` must be called
to fully initialize a module.

#### NOTE
Most uses of this function should be using [`PyModule_FromDefAndSpec()`](#c.PyModule_FromDefAndSpec)
instead; only use this if you are sure you need it.

#### Versionadded
Added in version 3.5.

### int PyModule_ExecDef([PyObject](structures.md#c.PyObject) \*module, [PyModuleDef](#c.PyModuleDef) \*def)

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Process any execution slots ([`Py_mod_exec`](#c.Py_mod_exec)) given in *def*.

#### Versionadded
Added in version 3.5.

### PYTHON_API_VERSION

### PYTHON_API_STRING

The C API version, as an integer (`1013`) and string (`"1013"`), respectively.
Defined for backwards compatibility.

Currently, this constant is not updated in new Python versions, and is not
useful for versioning. This may change in the future.

### PYTHON_ABI_VERSION

### PYTHON_ABI_STRING

Defined as `3` and `"3"`, respectively, for backwards compatibility.

Currently, this constant is not updated in new Python versions, and is not
useful for versioning. This may change in the future.

<a id="capi-module-support-functions"></a>

## Support functions

The following functions are provided to help initialize a module object.
They are intended for a module’s execution slot ([`Py_mod_exec`](#c.Py_mod_exec)),
the initialization function for legacy [single-phase initialization](extension-modules.md#single-phase-initialization),
or code that creates modules dynamically.

### int PyModule_AddObjectRef([PyObject](structures.md#c.PyObject) \*module, const char \*name, [PyObject](structures.md#c.PyObject) \*value)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Add an object to *module* as *name*.  This is a convenience function which
can be used from the module’s initialization function.

On success, return `0`. On error, raise an exception and return `-1`.

Example usage:

```c
static int
add_spam(PyObject *module, int value)
{
    PyObject *obj = PyLong_FromLong(value);
    if (obj == NULL) {
        return -1;
    }
    int res = PyModule_AddObjectRef(module, "spam", obj);
    Py_DECREF(obj);
    return res;
 }
```

To be convenient, the function accepts `NULL` *value* with an exception
set. In this case, return `-1` and just leave the raised exception
unchanged.

The example can also be written without checking explicitly if *obj* is
`NULL`:

```c
static int
add_spam(PyObject *module, int value)
{
    PyObject *obj = PyLong_FromLong(value);
    int res = PyModule_AddObjectRef(module, "spam", obj);
    Py_XDECREF(obj);
    return res;
 }
```

Note that `Py_XDECREF()` should be used instead of `Py_DECREF()` in
this case, since *obj* can be `NULL`.

The number of different *name* strings passed to this function
should be kept small, usually by only using statically allocated strings
as *name*.
For names that aren’t known at compile time, prefer calling
[`PyUnicode_FromString()`](unicode.md#c.PyUnicode_FromString) and [`PyObject_SetAttr()`](object.md#c.PyObject_SetAttr) directly.
For more details, see [`PyUnicode_InternFromString()`](unicode.md#c.PyUnicode_InternFromString), which may be
used internally to create a key object.

#### Versionadded
Added in version 3.10.

### int PyModule_Add([PyObject](structures.md#c.PyObject) \*module, const char \*name, [PyObject](structures.md#c.PyObject) \*value)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Similar to [`PyModule_AddObjectRef()`](#c.PyModule_AddObjectRef), but “steals” a reference
to *value*.
It can be called with a result of function that returns a new reference
without bothering to check its result or even saving it to a variable.

Example usage:

```c
if (PyModule_Add(module, "spam", PyBytes_FromString(value)) < 0) {
    goto error;
}
```

#### Versionadded
Added in version 3.13.

### int PyModule_AddObject([PyObject](structures.md#c.PyObject) \*module, const char \*name, [PyObject](structures.md#c.PyObject) \*value)

 *Part of the [Stable ABI](stable.md#stable).*

Similar to [`PyModule_AddObjectRef()`](#c.PyModule_AddObjectRef), but steals a reference to
*value* on success (if it returns `0`).

The new [`PyModule_Add()`](#c.PyModule_Add) or [`PyModule_AddObjectRef()`](#c.PyModule_AddObjectRef)
functions are recommended, since it is
easy to introduce reference leaks by misusing the
[`PyModule_AddObject()`](#c.PyModule_AddObject) function.

#### NOTE
Unlike other functions that steal references, `PyModule_AddObject()`
only releases the reference to *value* **on success**.

This means that its return value must be checked, and calling code must
[`Py_XDECREF()`](refcounting.md#c.Py_XDECREF) *value* manually on error.

Example usage:

```c
PyObject *obj = PyBytes_FromString(value);
if (PyModule_AddObject(module, "spam", obj) < 0) {
    // If 'obj' is not NULL and PyModule_AddObject() failed,
    // 'obj' strong reference must be deleted with Py_XDECREF().
    // If 'obj' is NULL, Py_XDECREF() does nothing.
    Py_XDECREF(obj);
    goto error;
}
// PyModule_AddObject() stole a reference to obj:
// Py_XDECREF(obj) is not needed here.
```

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.13.

### int PyModule_AddIntConstant([PyObject](structures.md#c.PyObject) \*module, const char \*name, long value)

 *Part of the [Stable ABI](stable.md#stable).*

Add an integer constant to *module* as *name*.  This convenience function can be
used from the module’s initialization function.
Return `-1` with an exception set on error, `0` on success.

This is a convenience function that calls [`PyLong_FromLong()`](long.md#c.PyLong_FromLong) and
[`PyModule_AddObjectRef()`](#c.PyModule_AddObjectRef); see their documentation for details.

### int PyModule_AddStringConstant([PyObject](structures.md#c.PyObject) \*module, const char \*name, const char \*value)

 *Part of the [Stable ABI](stable.md#stable).*

Add a string constant to *module* as *name*.  This convenience function can be
used from the module’s initialization function.  The string *value* must be
`NULL`-terminated.
Return `-1` with an exception set on error, `0` on success.

This is a convenience function that calls
[`PyUnicode_InternFromString()`](unicode.md#c.PyUnicode_InternFromString) and [`PyModule_AddObjectRef()`](#c.PyModule_AddObjectRef);
see their documentation for details.

### PyModule_AddIntMacro(module, macro)

Add an int constant to *module*. The name and the value are taken from
*macro*. For example `PyModule_AddIntMacro(module, AF_INET)` adds the int
constant *AF_INET* with the value of *AF_INET* to *module*.
Return `-1` with an exception set on error, `0` on success.

### PyModule_AddStringMacro(module, macro)

Add a string constant to *module*.

### int PyModule_AddType([PyObject](structures.md#c.PyObject) \*module, [PyTypeObject](type.md#c.PyTypeObject) \*type)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Add a type object to *module*.
The type object is finalized by calling internally [`PyType_Ready()`](type.md#c.PyType_Ready).
The name of the type object is taken from the last component of
[`tp_name`](typeobj.md#c.PyTypeObject.tp_name) after dot.
Return `-1` with an exception set on error, `0` on success.

#### Versionadded
Added in version 3.9.

### int PyModule_AddFunctions([PyObject](structures.md#c.PyObject) \*module, [PyMethodDef](structures.md#c.PyMethodDef) \*functions)

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Add the functions from the `NULL` terminated *functions* array to *module*.
Refer to the [`PyMethodDef`](structures.md#c.PyMethodDef) documentation for details on individual
entries (due to the lack of a shared module namespace, module level
“functions” implemented in C typically receive the module as their first
parameter, making them similar to instance methods on Python classes).

This function is called automatically when creating a module from
`PyModuleDef` (such as when using [Multi-phase initialization](extension-modules.md#multi-phase-initialization),
`PyModule_Create`, or `PyModule_FromDefAndSpec`).
Some module authors may prefer defining functions in multiple
[`PyMethodDef`](structures.md#c.PyMethodDef) arrays; in that case they should call this function
directly.

The *functions* array must be statically allocated (or otherwise guaranteed
to outlive the module object).

#### Versionadded
Added in version 3.5.

### int PyModule_SetDocString([PyObject](structures.md#c.PyObject) \*module, const char \*docstring)

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Set the docstring for *module* to *docstring*.
This function is called automatically when creating a module from
`PyModuleDef` (such as when using [Multi-phase initialization](extension-modules.md#multi-phase-initialization),
`PyModule_Create`, or `PyModule_FromDefAndSpec`).

Return `0` on success.
Return `-1` with an exception set on error.

#### Versionadded
Added in version 3.5.

### int PyUnstable_Module_SetGIL([PyObject](structures.md#c.PyObject) \*module, void \*gil)

Indicate that *module* does or does not support running without the global
interpreter lock (GIL), using one of the values from
[`Py_mod_gil`](#c.Py_mod_gil). It must be called during *module*’s initialization
function when using [Legacy single-phase initialization](extension-modules.md#single-phase-initialization).
If this function is not called during module initialization, the
import machinery assumes the module does not support running without the
GIL. This function is only available in Python builds configured with
[`--disable-gil`](../using/configure.md#cmdoption-disable-gil).
Return `-1` with an exception set on error, `0` on success.

#### Versionadded
Added in version 3.13.

### Module lookup (single-phase initialization)

The legacy [single-phase initialization](extension-modules.md#single-phase-initialization)
initialization scheme creates singleton modules that can be looked up
in the context of the current interpreter. This allows the module object to be
retrieved later with only a reference to the module definition.

These functions will not work on modules created using multi-phase initialization,
since multiple such modules can be created from a single definition.

### [PyObject](structures.md#c.PyObject) \*PyState_FindModule([PyModuleDef](#c.PyModuleDef) \*def)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the module object that was created from *def* for the current interpreter.
This method requires that the module object has been attached to the interpreter state with
[`PyState_AddModule()`](#c.PyState_AddModule) beforehand. In case the corresponding module object is not
found or has not been attached to the interpreter state yet, it returns `NULL`.

### int PyState_AddModule([PyObject](structures.md#c.PyObject) \*module, [PyModuleDef](#c.PyModuleDef) \*def)

 *Part of the [Stable ABI](stable.md#stable) since version 3.3.*

Attaches the module object passed to the function to the interpreter state. This allows
the module object to be accessible via [`PyState_FindModule()`](#c.PyState_FindModule).

Only effective on modules created using single-phase initialization.

Python calls `PyState_AddModule` automatically after importing a module
that uses [single-phase initialization](extension-modules.md#single-phase-initialization),
so it is unnecessary (but harmless) to call it from module initialization
code. An explicit call is needed only if the module’s own init code
subsequently calls `PyState_FindModule`.
The function is mainly intended for implementing alternative import
mechanisms (either by calling it directly, or by referring to its
implementation for details of the required state updates).

If a module was attached previously using the same *def*, it is replaced
by the new *module*.

The caller must have an [attached thread state](../glossary.md#term-attached-thread-state).

Return `-1` with an exception set on error, `0` on success.

#### Versionadded
Added in version 3.3.

### int PyState_RemoveModule([PyModuleDef](#c.PyModuleDef) \*def)

 *Part of the [Stable ABI](stable.md#stable) since version 3.3.*

Removes the module object created from *def* from the interpreter state.
Return `-1` with an exception set on error, `0` on success.

The caller must have an [attached thread state](../glossary.md#term-attached-thread-state).

#### Versionadded
Added in version 3.3.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

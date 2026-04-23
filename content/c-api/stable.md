<a id="stable"></a>

# C API and ABI Stability

Unless documented otherwise, Python’s C API is covered by the Backwards
Compatibility Policy, [**PEP 387**](https://peps.python.org/pep-0387/).
Most changes to it are source-compatible (typically by only adding new API).
Changing existing API or removing API is only done after a deprecation period
or to fix serious issues.

CPython’s Application Binary Interface (ABI) is forward- and
backwards-compatible across a minor release (if these are compiled the same
way; see [Platform Considerations](#stable-abi-platform) below).
So, code compiled for Python 3.10.0 will work on 3.10.8 and vice versa,
but will need to be compiled separately for 3.9.x and 3.11.x.

There are two tiers of C API with different stability expectations:

- [Unstable API](#unstable-c-api), may change in minor versions without
  a deprecation period. It is marked by the `PyUnstable` prefix in names.
- [Limited API](#limited-c-api), is compatible across several minor releases.
  When [`Py_LIMITED_API`](#c.Py_LIMITED_API) is defined, only this subset is exposed
  from `Python.h`.

These are discussed in more detail below.

Names prefixed by an underscore, such as `_Py_InternalState`,
are private API that can change without notice even in patch releases.
If you need to use this API, consider reaching out to
[CPython developers](https://discuss.python.org/c/core-dev/c-api/30)
to discuss adding public API for your use case.

<a id="unstable-c-api"></a>

## Unstable C API

<a id="index-1"></a>

Any API named with the `PyUnstable` prefix exposes CPython implementation
details, and may change in every minor release (e.g. from 3.9 to 3.10) without
any deprecation warnings.
However, it will not change in a bugfix release (e.g. from 3.10.0 to 3.10.1).

It is generally intended for specialized, low-level tools like debuggers.

Projects that use this API are expected to follow
CPython development and spend extra effort adjusting to changes.

<a id="stable-abi"></a>

<a id="stable-application-binary-interface"></a>

## Stable Application Binary Interfaces

Python’s *Stable ABI* allows extensions to be compatible with multiple
versions of Python, without recompilation.

#### NOTE
For simplicity, this document talks about *extensions*, but Stable ABI
works the same way for all uses of the API – for example, embedding Python.

There are two Stable ABIs:

- `abi3`, introduced in Python 3.2, is compatible with
  **non**-[free-threaded](../glossary.md#term-free-threaded-build) builds of CPython.
- `abi3t`, introduced in Python 3.15, is compatible with
  [free-threaded](../glossary.md#term-free-threaded-build) builds of CPython.
  It has stricter API limitations than `abi3`.
  > #### Versionadded
  > Added in version 3.15.0a8 (unreleased): `abi3t` was added in [**PEP 803**](https://peps.python.org/pep-0803/)

It is possible for an extension to be compiled for *both* `abi3` and
`abi3t` at the same time; the result will be compatible with
both free-threaded and non-free-threaded builds of Python.
Currently, this has no downsides compared to compiling for `abi3t` only.

Each Stable ABI is versioned using the first two numbers of the Python version.
For example, Stable ABI 3.14 corresponds to Python 3.14.
An extension compiled for Stable ABI 3.x is ABI-compatible with Python 3.x
and above.

Extensions that target a stable ABI must only use a limited subset of
the C API. This subset is known as the *Limited API*; its contents
are [listed below](#limited-api-list).

On Windows, extensions that use a Stable ABI should be linked against
`python3.dll` rather than a version-specific library such as
`python39.dll`.
This library only exposes the relevant symbols.

On some platforms, Python will look for and load shared library files named
with the `abi3` or `abi3t` tag (for example, `mymodule.abi3.so`).
[Free-threaded](../glossary.md#term-free-threaded-build) interpreters only recognize the
`abi3t` tag, while non-free-threaded ones will prefer `abi3` but fall back
to `abi3t`.
Thus, extensions compatible with both ABIs should use the `abi3t` tag.

Python does not necessarily check that extensions it loads
have compatible ABI.
Extension authors are encouraged to add a check using the [`Py_mod_abi`](module.md#c.Py_mod_abi)
slot or the [`PyABIInfo_Check()`](#c.PyABIInfo_Check) function, but the user
(or their packaging tool) is ultimately responsible for ensuring that,
for example, extensions built for Stable ABI 3.10 are not installed for lower
versions of Python.

All functions in Stable ABI are present as functions in Python’s shared
library, not solely as macros.
This makes them usable are usable from languages that don’t use the C
preprocessor, including Python’s [`ctypes`](../library/ctypes.md#module-ctypes).

<a id="abi3-compiling"></a>

### Compiling for Stable ABI

#### NOTE
Build tools (such as, for example, meson-python, scikit-build-core,
or Setuptools) often have a mechanism for setting macros and synchronizing
them with extension filenames and other metadata.
Prefer using such a mechanism, if it exists, over defining the
macros manually.

The rest of this section is mainly relevant for tool authors, and for
people who compile extensions manually.

#### SEE ALSO
[list of recommended tools](https://packaging.python.org/en/latest/guides/tool-recommendations/#build-backends-for-extension-modules) in the Python Packaging User Guide

To compile for a Stable ABI, define one or both of the following macros
to the lowest Python version your extension should support, in
[`Py_PACK_VERSION`](apiabiversion.md#c.Py_PACK_VERSION) format.
Typically, you should choose a specific value rather than the version of
the Python headers you are compiling against.

The macros must be defined before including `Python.h`.
Since [`Py_PACK_VERSION`](apiabiversion.md#c.Py_PACK_VERSION) is not available at this point, you
will need to use the numeric value directly.
For reference, the values for a few recent Python versions are:

```c
0x30a0000  /* Py_PACK_VERSION(3.10) */
0x30b0000  /* Py_PACK_VERSION(3.11) */
0x30c0000  /* Py_PACK_VERSION(3.12) */
0x30d0000  /* Py_PACK_VERSION(3.13) */
0x30e0000  /* Py_PACK_VERSION(3.14) */
0x30f0000  /* Py_PACK_VERSION(3.15) */
```

When one of the macros is defined, `Python.h` will only expose API that is
compatible with the given Stable ABI – that is, the
[Limited API](#limited-api-list) plus some definitions that need to be
visible to the compiler but should not be used directly.
When both are defined, `Python.h` will only expose API compatible with
both Stable ABIs.

### Py_LIMITED_API

Target `abi3`, that is,
non-[free-threaded builds](../glossary.md#term-free-threaded-build) of CPython.
See [above](#abi3-compiling) for common information.

### Py_TARGET_ABI3T

Target `abi3t`, that is,
[free-threaded builds](../glossary.md#term-free-threaded-build) of CPython.
See [above](#abi3-compiling) for common information.

#### Versionadded
Added in version 3.15.0a8 (unreleased).

Both macros specify a target ABI; the different naming style is due to
backwards compatibility.

When both are defined, `Python.h` may, or may not, redefine
`Py_LIMITED_API` to match `Py_TARGET_ABI3T`.

On a [free-threaded build](../glossary.md#term-free-threaded-build) – that is, when
[`Py_GIL_DISABLED`](../using/configure.md#c.Py_GIL_DISABLED) is defined – `Py_TARGET_ABI3T`
defaults to the value of `Py_LIMITED_API`.
This means that there are two ways to build for both `abi3` and `abi3t`:

- define both `Py_LIMITED_API` and `Py_TARGET_ABI3T`, or
- define only `Py_LIMITED_API` and:
  - on Windows, define `Py_GIL_DISABLED`;
  - on other systems, use the headers of free-threaded build of Python.

<a id="limited-api-scope-and-performance"></a>

### Stable ABI Scope and Performance

The goal for Stable ABI is to allow everything that is possible with the
full C API, but possibly with a performance penalty.
Generally, compatibility with Stable ABI will require some changes to an
extension’s source code.

For example, while [`PyList_GetItem()`](list.md#c.PyList_GetItem) is available, its “unsafe” macro
variant [`PyList_GET_ITEM()`](list.md#c.PyList_GET_ITEM) is not.
The macro can be faster because it can rely on version-specific implementation
details of the list object.

For another example, when *not* compiling for Stable ABI, some C API
functions are inlined or replaced by macros.
Compiling for Stable ABI disables this inlining, allowing stability as
Python’s data structures are improved, but possibly reducing performance.

By leaving out the `Py_LIMITED_API` or `Py_TARGET_ABI3T`
definition, it is possible to compile Stable-ABI-compatible source
for a version-specific ABI.
A potentially faster version-specific extension can then be distributed
alongside a version compiled for Stable ABI – a slower but more compatible
fallback.

<a id="limited-api-caveats"></a>

### Stable ABI Caveats

Note that compiling for Stable ABI is *not* a complete guarantee that code will
be compatible with the expected Python versions.
Stable ABI prevents *ABI* issues, like linker errors due to missing
symbols or data corruption due to changes in structure layouts or function
signatures.
However, other changes in Python can change the *behavior* of extensions.

One issue that the [`Py_TARGET_ABI3T`](#c.Py_TARGET_ABI3T) and [`Py_LIMITED_API`](#c.Py_LIMITED_API)
macros do not guard against is calling a function with arguments that are
invalid in a lower Python version.
For example, consider a function that starts accepting `NULL` for an
argument. In Python 3.9, `NULL` now selects a default behavior, but in
Python 3.8, the argument will be used directly, causing a `NULL` dereference
and crash. A similar argument works for fields of structs.

For these reasons, we recommend testing an extension with *all* minor Python
versions it supports.

We also recommend reviewing documentation of all used API to check
if it is explicitly part of the Limited API. Even with `Py_LIMITED_API`
defined, a few private declarations are exposed for technical reasons (or
even unintentionally, as bugs).

Also note that while compiling with `Py_LIMITED_API` 3.8 means that the
extension should *load* on Python 3.12, and *compile* with Python 3.12,
the same source will not necessarily compile with `Py_LIMITED_API`
set to 3.12.
In general, parts of the Limited API may be deprecated and removed,
provided that Stable ABI stays stable.

<a id="stable-abi-platform"></a>

## Platform Considerations

ABI stability depends not only on Python, but also on the compiler used,
lower-level libraries and compiler options. For the purposes of
the [Stable ABIs](#stable-abi), these details define a “platform”. They
usually depend on the OS type and processor architecture

It is the responsibility of each particular distributor of Python
to ensure that all Python versions on a particular platform are built
in a way that does not break the Stable ABIs, or the version-specific ABIs.
This is the case with Windows and macOS releases from `python.org` and many
third-party distributors.

## ABI Checking

#### Versionadded
Added in version 3.15.

Python includes a rudimentary check for ABI compatibility.

This check is not comprehensive.
It only guards against common cases of incompatible modules being
installed for the wrong interpreter.
It also does not take [platform incompatibilities](#stable-abi-platform)
into account.
It can only be done after an extension is successfully loaded.

Despite these limitations, it is recommended that extension modules use this
mechanism, so that detectable incompatibilities raise exceptions rather than
crash.

Most modules can use this check via the [`Py_mod_abi`](module.md#c.Py_mod_abi)
slot and the [`PyABIInfo_VAR`](#c.PyABIInfo_VAR) macro, for example like this:

```c
PyABIInfo_VAR(abi_info);

static PyModuleDef_Slot mymodule_slots[] = {
   {Py_mod_abi, &abi_info},
   ...
};
```

The full API is described below for advanced use cases.

### int PyABIInfo_Check([PyABIInfo](#c.PyABIInfo) \*info, const char \*module_name)

 *Part of the [Stable ABI](#stable) since version 3.15.*

Verify that the given *info* is compatible with the currently running
interpreter.

Return 0 on success. On failure, raise an exception and return -1.

If the ABI is incompatible, the raised exception will be [`ImportError`](../library/exceptions.md#ImportError).

The *module_name* argument can be `NULL`, or point to a NUL-terminated
UTF-8-encoded string used for error messages.

Note that if *info* describes the ABI that the current code uses (as defined
by [`PyABIInfo_VAR`](#c.PyABIInfo_VAR), for example), using any other Python C API
may lead to crashes.
In particular, it is not safe to examine the raised exception.

#### Versionadded
Added in version 3.15.

### PyABIInfo_VAR(NAME)

 *Part of the [Stable ABI](#stable) since version 3.15.*

Define a static [`PyABIInfo`](#c.PyABIInfo) variable with the given *NAME* that
describes the ABI that the current code will use.
This macro expands to:

```c
static PyABIInfo NAME = {
    1, 0,
    PyABIInfo_DEFAULT_FLAGS,
    PY_VERSION_HEX,
    PyABIInfo_DEFAULT_ABI_VERSION
}
```

#### Versionadded
Added in version 3.15.

### type PyABIInfo

 *Part of the [Stable ABI](#stable) (including all members) since version 3.15.*

### uint8_t abiinfo_major_version

The major version of [`PyABIInfo`](#c.PyABIInfo). Can be set to:

* `0` to skip all checking, or
* `1` to specify this version of `PyABIInfo`.

### uint8_t abiinfo_minor_version

The minor version of [`PyABIInfo`](#c.PyABIInfo).
Must be set to `0`; larger values are reserved for backwards-compatible
future versions of `PyABIInfo`.

### uint16_t flags

This field is usually set to the following macro:

### PyABIInfo_DEFAULT_FLAGS

 *Part of the [Stable ABI](#stable) since version 3.15.*

Default flags, based on current values of macros such as
[`Py_LIMITED_API`](#c.Py_LIMITED_API) and [`Py_GIL_DISABLED`](../using/configure.md#c.Py_GIL_DISABLED).

Alternately, the field can be set to the following flags, combined
by bitwise OR.
Unused bits must be set to zero.

ABI variant – one of:

> ### PyABIInfo_STABLE

>  *Part of the [Stable ABI](#stable) since version 3.15.*

> Specifies that Stable ABI is used.

> ### PyABIInfo_INTERNAL

> Specifies ABI specific to a particular build of CPython.
> Internal use only.

Free-threading compatibility – one of:

> ### PyABIInfo_FREETHREADED

>  *Part of the [Stable ABI](#stable) since version 3.15.*

> Specifies ABI compatible with [free-threaded builds](../glossary.md#term-free-threaded-build) of CPython.
> (That is, ones compiled with [`--disable-gil`](../using/configure.md#cmdoption-disable-gil); with `t`
> in [`sys.abiflags`](../library/sys.md#sys.abiflags))

> ### PyABIInfo_GIL

>  *Part of the [Stable ABI](#stable) since version 3.15.*

> Specifies ABI compatible with non-free-threaded builds of CPython
> (ones compiled *without* [`--disable-gil`](../using/configure.md#cmdoption-disable-gil)).

> ### PyABIInfo_FREETHREADING_AGNOSTIC

>  *Part of the [Stable ABI](#stable) since version 3.15.*

> Specifies ABI compatible with both free-threaded and
> non-free-threaded builds of CPython, that is, both
> `abi3` and `abi3t`.

### uint32_t build_version

The version of the Python headers used to build the code, in the format
used by [`PY_VERSION_HEX`](apiabiversion.md#c.PY_VERSION_HEX).

This can be set to `0` to skip any checks related to this field.
This option is meant mainly for projects that do not use the CPython
headers directly, and do not emulate a specific version of them.

### uint32_t abi_version

The ABI version.

For Stable ABI, this field should be the value of
[`Py_LIMITED_API`](#c.Py_LIMITED_API) or [`Py_TARGET_ABI3T`](#c.Py_TARGET_ABI3T).
If both are defined, use the smaller value.
(If [`Py_LIMITED_API`](#c.Py_LIMITED_API) is `3`; use
 instead of `3`.)

Otherwise, it should be set to [`PY_VERSION_HEX`](apiabiversion.md#c.PY_VERSION_HEX).

It can also be set to `0` to skip any checks related to this field.

### PyABIInfo_DEFAULT_ABI_VERSION

 *Part of the [Stable ABI](#stable) since version 3.15.*

The value that should be used for this field, based on current
values of macros such as [`Py_LIMITED_API`](#c.Py_LIMITED_API),
[`PY_VERSION_HEX`](apiabiversion.md#c.PY_VERSION_HEX) and [`Py_GIL_DISABLED`](../using/configure.md#c.Py_GIL_DISABLED).

#### Versionadded
Added in version 3.15.

<a id="limited-c-api"></a>

<a id="limited-api-list"></a>

## Contents of Limited API

This is the definitive list of [Limited API](#limited-c-api) for
Python 3.15:

* [`METH_CLASS`](structures.md#c.METH_CLASS)
* [`METH_COEXIST`](structures.md#c.METH_COEXIST)
* [`METH_FASTCALL`](structures.md#c.METH_FASTCALL)
* [`METH_METHOD`](structures.md#c.METH_METHOD)
* [`METH_NOARGS`](structures.md#c.METH_NOARGS)
* [`METH_O`](structures.md#c.METH_O)
* [`METH_STATIC`](structures.md#c.METH_STATIC)
* [`METH_VARARGS`](structures.md#c.METH_VARARGS)
* [`PY_VECTORCALL_ARGUMENTS_OFFSET`](call.md#c.PY_VECTORCALL_ARGUMENTS_OFFSET)
* [`PyABIInfo`](#c.PyABIInfo)
* [`PyABIInfo_Check()`](#c.PyABIInfo_Check)
* [`PyABIInfo_DEFAULT_ABI_VERSION`](#c.PyABIInfo_DEFAULT_ABI_VERSION)
* [`PyABIInfo_DEFAULT_FLAGS`](#c.PyABIInfo_DEFAULT_FLAGS)
* [`PyABIInfo_FREETHREADED`](#c.PyABIInfo_FREETHREADED)
* [`PyABIInfo_FREETHREADING_AGNOSTIC`](#c.PyABIInfo_FREETHREADING_AGNOSTIC)
* [`PyABIInfo_GIL`](#c.PyABIInfo_GIL)
* [`PyABIInfo_STABLE`](#c.PyABIInfo_STABLE)
* [`PyABIInfo_VAR`](#c.PyABIInfo_VAR)
* [`PyAIter_Check()`](iter.md#c.PyAIter_Check)
* [`PyArg_Parse()`](arg.md#c.PyArg_Parse)
* [`PyArg_ParseTuple()`](arg.md#c.PyArg_ParseTuple)
* [`PyArg_ParseTupleAndKeywords()`](arg.md#c.PyArg_ParseTupleAndKeywords)
* [`PyArg_UnpackTuple()`](arg.md#c.PyArg_UnpackTuple)
* [`PyArg_VaParse()`](arg.md#c.PyArg_VaParse)
* [`PyArg_VaParseTupleAndKeywords()`](arg.md#c.PyArg_VaParseTupleAndKeywords)
* [`PyArg_ValidateKeywordArguments()`](arg.md#c.PyArg_ValidateKeywordArguments)
* [`PyBUF_ANY_CONTIGUOUS`](buffer.md#c.PyBUF_ANY_CONTIGUOUS)
* [`PyBUF_CONTIG`](buffer.md#c.PyBUF_CONTIG)
* [`PyBUF_CONTIG_RO`](buffer.md#c.PyBUF_CONTIG_RO)
* [`PyBUF_C_CONTIGUOUS`](buffer.md#c.PyBUF_C_CONTIGUOUS)
* [`PyBUF_FORMAT`](buffer.md#c.PyBUF_FORMAT)
* [`PyBUF_FULL`](buffer.md#c.PyBUF_FULL)
* [`PyBUF_FULL_RO`](buffer.md#c.PyBUF_FULL_RO)
* [`PyBUF_F_CONTIGUOUS`](buffer.md#c.PyBUF_F_CONTIGUOUS)
* [`PyBUF_INDIRECT`](buffer.md#c.PyBUF_INDIRECT)
* [`PyBUF_MAX_NDIM`](buffer.md#c.PyBUF_MAX_NDIM)
* [`PyBUF_ND`](buffer.md#c.PyBUF_ND)
* [`PyBUF_READ`](memoryview.md#c.PyBUF_READ)
* [`PyBUF_RECORDS`](buffer.md#c.PyBUF_RECORDS)
* [`PyBUF_RECORDS_RO`](buffer.md#c.PyBUF_RECORDS_RO)
* [`PyBUF_SIMPLE`](buffer.md#c.PyBUF_SIMPLE)
* [`PyBUF_STRIDED`](buffer.md#c.PyBUF_STRIDED)
* [`PyBUF_STRIDED_RO`](buffer.md#c.PyBUF_STRIDED_RO)
* [`PyBUF_STRIDES`](buffer.md#c.PyBUF_STRIDES)
* [`PyBUF_WRITABLE`](buffer.md#c.PyBUF_WRITABLE)
* [`PyBUF_WRITE`](memoryview.md#c.PyBUF_WRITE)
* [`PyBaseObject_Type`](structures.md#c.PyBaseObject_Type)
* [`PyBool_FromLong()`](bool.md#c.PyBool_FromLong)
* [`PyBool_Type`](bool.md#c.PyBool_Type)
* [`PyBuffer_FillContiguousStrides()`](buffer.md#c.PyBuffer_FillContiguousStrides)
* [`PyBuffer_FillInfo()`](buffer.md#c.PyBuffer_FillInfo)
* [`PyBuffer_FromContiguous()`](buffer.md#c.PyBuffer_FromContiguous)
* [`PyBuffer_GetPointer()`](buffer.md#c.PyBuffer_GetPointer)
* [`PyBuffer_IsContiguous()`](buffer.md#c.PyBuffer_IsContiguous)
* [`PyBuffer_Release()`](buffer.md#c.PyBuffer_Release)
* [`PyBuffer_SizeFromFormat()`](buffer.md#c.PyBuffer_SizeFromFormat)
* [`PyBuffer_ToContiguous()`](buffer.md#c.PyBuffer_ToContiguous)
* [`PyByteArrayIter_Type`](iterator.md#c.PyByteArrayIter_Type)
* [`PyByteArray_AsString()`](bytearray.md#c.PyByteArray_AsString)
* [`PyByteArray_Concat()`](bytearray.md#c.PyByteArray_Concat)
* [`PyByteArray_FromObject()`](bytearray.md#c.PyByteArray_FromObject)
* [`PyByteArray_FromStringAndSize()`](bytearray.md#c.PyByteArray_FromStringAndSize)
* [`PyByteArray_Resize()`](bytearray.md#c.PyByteArray_Resize)
* [`PyByteArray_Size()`](bytearray.md#c.PyByteArray_Size)
* [`PyByteArray_Type`](bytearray.md#c.PyByteArray_Type)
* [`PyBytesIter_Type`](iterator.md#c.PyBytesIter_Type)
* [`PyBytes_AsString()`](bytes.md#c.PyBytes_AsString)
* [`PyBytes_AsStringAndSize()`](bytes.md#c.PyBytes_AsStringAndSize)
* [`PyBytes_Concat()`](bytes.md#c.PyBytes_Concat)
* [`PyBytes_ConcatAndDel()`](bytes.md#c.PyBytes_ConcatAndDel)
* [`PyBytes_DecodeEscape()`](bytes.md#c.PyBytes_DecodeEscape)
* [`PyBytes_FromFormat()`](bytes.md#c.PyBytes_FromFormat)
* [`PyBytes_FromFormatV()`](bytes.md#c.PyBytes_FromFormatV)
* [`PyBytes_FromObject()`](bytes.md#c.PyBytes_FromObject)
* [`PyBytes_FromString()`](bytes.md#c.PyBytes_FromString)
* [`PyBytes_FromStringAndSize()`](bytes.md#c.PyBytes_FromStringAndSize)
* [`PyBytes_Repr()`](bytes.md#c.PyBytes_Repr)
* [`PyBytes_Size()`](bytes.md#c.PyBytes_Size)
* [`PyBytes_Type`](bytes.md#c.PyBytes_Type)
* [`PyCFunction`](structures.md#c.PyCFunction)
* [`PyCFunctionFast`](structures.md#c.PyCFunctionFast)
* [`PyCFunctionFastWithKeywords`](structures.md#c.PyCFunctionFastWithKeywords)
* [`PyCFunctionWithKeywords`](structures.md#c.PyCFunctionWithKeywords)
* [`PyCFunction_GetFlags()`](structures.md#c.PyCFunction_GetFlags)
* [`PyCFunction_GetFunction()`](structures.md#c.PyCFunction_GetFunction)
* [`PyCFunction_GetSelf()`](structures.md#c.PyCFunction_GetSelf)
* [`PyCFunction_New()`](structures.md#c.PyCFunction_New)
* [`PyCFunction_NewEx()`](structures.md#c.PyCFunction_NewEx)
* [`PyCFunction_Type`](structures.md#c.PyCFunction_Type)
* [`PyCMethod_New()`](structures.md#c.PyCMethod_New)
* [`PyCallIter_New()`](iterator.md#c.PyCallIter_New)
* [`PyCallIter_Type`](iterator.md#c.PyCallIter_Type)
* [`PyCallable_Check()`](call.md#c.PyCallable_Check)
* [`PyCapsule_Destructor`](capsule.md#c.PyCapsule_Destructor)
* [`PyCapsule_GetContext()`](capsule.md#c.PyCapsule_GetContext)
* [`PyCapsule_GetDestructor()`](capsule.md#c.PyCapsule_GetDestructor)
* [`PyCapsule_GetName()`](capsule.md#c.PyCapsule_GetName)
* [`PyCapsule_GetPointer()`](capsule.md#c.PyCapsule_GetPointer)
* [`PyCapsule_Import()`](capsule.md#c.PyCapsule_Import)
* [`PyCapsule_IsValid()`](capsule.md#c.PyCapsule_IsValid)
* [`PyCapsule_New()`](capsule.md#c.PyCapsule_New)
* [`PyCapsule_SetContext()`](capsule.md#c.PyCapsule_SetContext)
* [`PyCapsule_SetDestructor()`](capsule.md#c.PyCapsule_SetDestructor)
* [`PyCapsule_SetName()`](capsule.md#c.PyCapsule_SetName)
* [`PyCapsule_SetPointer()`](capsule.md#c.PyCapsule_SetPointer)
* [`PyCapsule_Type`](capsule.md#c.PyCapsule_Type)
* [`PyClassMethodDescr_Type`](descriptor.md#c.PyClassMethodDescr_Type)
* [`PyCodec_BackslashReplaceErrors()`](codec.md#c.PyCodec_BackslashReplaceErrors)
* [`PyCodec_Decode()`](codec.md#c.PyCodec_Decode)
* [`PyCodec_Decoder()`](codec.md#c.PyCodec_Decoder)
* [`PyCodec_Encode()`](codec.md#c.PyCodec_Encode)
* [`PyCodec_Encoder()`](codec.md#c.PyCodec_Encoder)
* [`PyCodec_IgnoreErrors()`](codec.md#c.PyCodec_IgnoreErrors)
* [`PyCodec_IncrementalDecoder()`](codec.md#c.PyCodec_IncrementalDecoder)
* [`PyCodec_IncrementalEncoder()`](codec.md#c.PyCodec_IncrementalEncoder)
* [`PyCodec_KnownEncoding()`](codec.md#c.PyCodec_KnownEncoding)
* [`PyCodec_LookupError()`](codec.md#c.PyCodec_LookupError)
* [`PyCodec_NameReplaceErrors()`](codec.md#c.PyCodec_NameReplaceErrors)
* [`PyCodec_Register()`](codec.md#c.PyCodec_Register)
* [`PyCodec_RegisterError()`](codec.md#c.PyCodec_RegisterError)
* [`PyCodec_ReplaceErrors()`](codec.md#c.PyCodec_ReplaceErrors)
* [`PyCodec_StreamReader()`](codec.md#c.PyCodec_StreamReader)
* [`PyCodec_StreamWriter()`](codec.md#c.PyCodec_StreamWriter)
* [`PyCodec_StrictErrors()`](codec.md#c.PyCodec_StrictErrors)
* [`PyCodec_Unregister()`](codec.md#c.PyCodec_Unregister)
* [`PyCodec_XMLCharRefReplaceErrors()`](codec.md#c.PyCodec_XMLCharRefReplaceErrors)
* [`PyComplex_FromDoubles()`](complex.md#c.PyComplex_FromDoubles)
* [`PyComplex_ImagAsDouble()`](complex.md#c.PyComplex_ImagAsDouble)
* [`PyComplex_RealAsDouble()`](complex.md#c.PyComplex_RealAsDouble)
* [`PyComplex_Type`](complex.md#c.PyComplex_Type)
* [`PyDescr_NewClassMethod()`](descriptor.md#c.PyDescr_NewClassMethod)
* [`PyDescr_NewGetSet()`](descriptor.md#c.PyDescr_NewGetSet)
* [`PyDescr_NewMember()`](descriptor.md#c.PyDescr_NewMember)
* [`PyDescr_NewMethod()`](descriptor.md#c.PyDescr_NewMethod)
* [`PyDictItems_Type`](dict.md#c.PyDictItems_Type)
* [`PyDictIterItem_Type`](iterator.md#c.PyDictIterItem_Type)
* [`PyDictIterKey_Type`](iterator.md#c.PyDictIterKey_Type)
* [`PyDictIterValue_Type`](iterator.md#c.PyDictIterValue_Type)
* [`PyDictKeys_Type`](dict.md#c.PyDictKeys_Type)
* [`PyDictProxy_New()`](dict.md#c.PyDictProxy_New)
* [`PyDictProxy_Type`](dict.md#c.PyDictProxy_Type)
* [`PyDictRevIterItem_Type`](iterator.md#c.PyDictRevIterItem_Type)
* [`PyDictRevIterKey_Type`](iterator.md#c.PyDictRevIterKey_Type)
* [`PyDictRevIterValue_Type`](iterator.md#c.PyDictRevIterValue_Type)
* [`PyDictValues_Type`](dict.md#c.PyDictValues_Type)
* [`PyDict_Clear()`](dict.md#c.PyDict_Clear)
* [`PyDict_Contains()`](dict.md#c.PyDict_Contains)
* [`PyDict_Copy()`](dict.md#c.PyDict_Copy)
* [`PyDict_DelItem()`](dict.md#c.PyDict_DelItem)
* [`PyDict_DelItemString()`](dict.md#c.PyDict_DelItemString)
* [`PyDict_GetItem()`](dict.md#c.PyDict_GetItem)
* [`PyDict_GetItemRef()`](dict.md#c.PyDict_GetItemRef)
* [`PyDict_GetItemString()`](dict.md#c.PyDict_GetItemString)
* [`PyDict_GetItemStringRef()`](dict.md#c.PyDict_GetItemStringRef)
* [`PyDict_GetItemWithError()`](dict.md#c.PyDict_GetItemWithError)
* [`PyDict_Items()`](dict.md#c.PyDict_Items)
* [`PyDict_Keys()`](dict.md#c.PyDict_Keys)
* [`PyDict_Merge()`](dict.md#c.PyDict_Merge)
* [`PyDict_MergeFromSeq2()`](dict.md#c.PyDict_MergeFromSeq2)
* [`PyDict_New()`](dict.md#c.PyDict_New)
* [`PyDict_Next()`](dict.md#c.PyDict_Next)
* [`PyDict_SetDefaultRef()`](dict.md#c.PyDict_SetDefaultRef)
* [`PyDict_SetItem()`](dict.md#c.PyDict_SetItem)
* [`PyDict_SetItemString()`](dict.md#c.PyDict_SetItemString)
* [`PyDict_Size()`](dict.md#c.PyDict_Size)
* [`PyDict_Type`](dict.md#c.PyDict_Type)
* [`PyDict_Update()`](dict.md#c.PyDict_Update)
* [`PyDict_Values()`](dict.md#c.PyDict_Values)
* [`PyEllipsis_Type`](slice.md#c.PyEllipsis_Type)
* [`PyEnum_Type`](iterator.md#c.PyEnum_Type)
* [`PyErr_BadArgument()`](exceptions.md#c.PyErr_BadArgument)
* [`PyErr_BadInternalCall()`](exceptions.md#c.PyErr_BadInternalCall)
* [`PyErr_CheckSignals()`](exceptions.md#c.PyErr_CheckSignals)
* [`PyErr_Clear()`](exceptions.md#c.PyErr_Clear)
* `PyErr_Display()`
* [`PyErr_DisplayException()`](exceptions.md#c.PyErr_DisplayException)
* [`PyErr_ExceptionMatches()`](exceptions.md#c.PyErr_ExceptionMatches)
* [`PyErr_Fetch()`](exceptions.md#c.PyErr_Fetch)
* [`PyErr_Format()`](exceptions.md#c.PyErr_Format)
* [`PyErr_FormatV()`](exceptions.md#c.PyErr_FormatV)
* [`PyErr_GetExcInfo()`](exceptions.md#c.PyErr_GetExcInfo)
* [`PyErr_GetHandledException()`](exceptions.md#c.PyErr_GetHandledException)
* [`PyErr_GetRaisedException()`](exceptions.md#c.PyErr_GetRaisedException)
* [`PyErr_GivenExceptionMatches()`](exceptions.md#c.PyErr_GivenExceptionMatches)
* [`PyErr_NewException()`](exceptions.md#c.PyErr_NewException)
* [`PyErr_NewExceptionWithDoc()`](exceptions.md#c.PyErr_NewExceptionWithDoc)
* [`PyErr_NoMemory()`](exceptions.md#c.PyErr_NoMemory)
* [`PyErr_NormalizeException()`](exceptions.md#c.PyErr_NormalizeException)
* [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred)
* [`PyErr_Print()`](exceptions.md#c.PyErr_Print)
* [`PyErr_PrintEx()`](exceptions.md#c.PyErr_PrintEx)
* [`PyErr_ProgramText()`](exceptions.md#c.PyErr_ProgramText)
* [`PyErr_ResourceWarning()`](exceptions.md#c.PyErr_ResourceWarning)
* [`PyErr_Restore()`](exceptions.md#c.PyErr_Restore)
* [`PyErr_SetExcFromWindowsErr()`](exceptions.md#c.PyErr_SetExcFromWindowsErr)
* [`PyErr_SetExcFromWindowsErrWithFilename()`](exceptions.md#c.PyErr_SetExcFromWindowsErrWithFilename)
* [`PyErr_SetExcFromWindowsErrWithFilenameObject()`](exceptions.md#c.PyErr_SetExcFromWindowsErrWithFilenameObject)
* [`PyErr_SetExcFromWindowsErrWithFilenameObjects()`](exceptions.md#c.PyErr_SetExcFromWindowsErrWithFilenameObjects)
* [`PyErr_SetExcInfo()`](exceptions.md#c.PyErr_SetExcInfo)
* [`PyErr_SetFromErrno()`](exceptions.md#c.PyErr_SetFromErrno)
* [`PyErr_SetFromErrnoWithFilename()`](exceptions.md#c.PyErr_SetFromErrnoWithFilename)
* [`PyErr_SetFromErrnoWithFilenameObject()`](exceptions.md#c.PyErr_SetFromErrnoWithFilenameObject)
* [`PyErr_SetFromErrnoWithFilenameObjects()`](exceptions.md#c.PyErr_SetFromErrnoWithFilenameObjects)
* [`PyErr_SetFromWindowsErr()`](exceptions.md#c.PyErr_SetFromWindowsErr)
* [`PyErr_SetFromWindowsErrWithFilename()`](exceptions.md#c.PyErr_SetFromWindowsErrWithFilename)
* [`PyErr_SetHandledException()`](exceptions.md#c.PyErr_SetHandledException)
* [`PyErr_SetImportError()`](exceptions.md#c.PyErr_SetImportError)
* [`PyErr_SetImportErrorSubclass()`](exceptions.md#c.PyErr_SetImportErrorSubclass)
* [`PyErr_SetInterrupt()`](exceptions.md#c.PyErr_SetInterrupt)
* [`PyErr_SetInterruptEx()`](exceptions.md#c.PyErr_SetInterruptEx)
* [`PyErr_SetNone()`](exceptions.md#c.PyErr_SetNone)
* [`PyErr_SetObject()`](exceptions.md#c.PyErr_SetObject)
* [`PyErr_SetRaisedException()`](exceptions.md#c.PyErr_SetRaisedException)
* [`PyErr_SetString()`](exceptions.md#c.PyErr_SetString)
* [`PyErr_SyntaxLocation()`](exceptions.md#c.PyErr_SyntaxLocation)
* [`PyErr_SyntaxLocationEx()`](exceptions.md#c.PyErr_SyntaxLocationEx)
* [`PyErr_WarnEx()`](exceptions.md#c.PyErr_WarnEx)
* [`PyErr_WarnExplicit()`](exceptions.md#c.PyErr_WarnExplicit)
* [`PyErr_WarnFormat()`](exceptions.md#c.PyErr_WarnFormat)
* [`PyErr_WriteUnraisable()`](exceptions.md#c.PyErr_WriteUnraisable)
* [`PyEval_AcquireThread()`](threads.md#c.PyEval_AcquireThread)
* [`PyEval_EvalCode()`](veryhigh.md#c.PyEval_EvalCode)
* [`PyEval_EvalCodeEx()`](veryhigh.md#c.PyEval_EvalCodeEx)
* [`PyEval_EvalFrame()`](veryhigh.md#c.PyEval_EvalFrame)
* [`PyEval_EvalFrameEx()`](veryhigh.md#c.PyEval_EvalFrameEx)
* [`PyEval_GetBuiltins()`](reflection.md#c.PyEval_GetBuiltins)
* [`PyEval_GetFrame()`](reflection.md#c.PyEval_GetFrame)
* [`PyEval_GetFrameBuiltins()`](reflection.md#c.PyEval_GetFrameBuiltins)
* [`PyEval_GetFrameGlobals()`](reflection.md#c.PyEval_GetFrameGlobals)
* [`PyEval_GetFrameLocals()`](reflection.md#c.PyEval_GetFrameLocals)
* [`PyEval_GetFuncDesc()`](reflection.md#c.PyEval_GetFuncDesc)
* [`PyEval_GetFuncName()`](reflection.md#c.PyEval_GetFuncName)
* [`PyEval_GetGlobals()`](reflection.md#c.PyEval_GetGlobals)
* [`PyEval_GetLocals()`](reflection.md#c.PyEval_GetLocals)
* [`PyEval_InitThreads()`](threads.md#c.PyEval_InitThreads)
* [`PyEval_ReleaseThread()`](threads.md#c.PyEval_ReleaseThread)
* [`PyEval_RestoreThread()`](threads.md#c.PyEval_RestoreThread)
* [`PyEval_SaveThread()`](threads.md#c.PyEval_SaveThread)
* [`PyExc_ArithmeticError`](exceptions.md#c.PyExc_ArithmeticError)
* [`PyExc_AssertionError`](exceptions.md#c.PyExc_AssertionError)
* [`PyExc_AttributeError`](exceptions.md#c.PyExc_AttributeError)
* [`PyExc_BaseException`](exceptions.md#c.PyExc_BaseException)
* [`PyExc_BaseExceptionGroup`](exceptions.md#c.PyExc_BaseExceptionGroup)
* [`PyExc_BlockingIOError`](exceptions.md#c.PyExc_BlockingIOError)
* [`PyExc_BrokenPipeError`](exceptions.md#c.PyExc_BrokenPipeError)
* [`PyExc_BufferError`](exceptions.md#c.PyExc_BufferError)
* [`PyExc_BytesWarning`](exceptions.md#c.PyExc_BytesWarning)
* [`PyExc_ChildProcessError`](exceptions.md#c.PyExc_ChildProcessError)
* [`PyExc_ConnectionAbortedError`](exceptions.md#c.PyExc_ConnectionAbortedError)
* [`PyExc_ConnectionError`](exceptions.md#c.PyExc_ConnectionError)
* [`PyExc_ConnectionRefusedError`](exceptions.md#c.PyExc_ConnectionRefusedError)
* [`PyExc_ConnectionResetError`](exceptions.md#c.PyExc_ConnectionResetError)
* [`PyExc_DeprecationWarning`](exceptions.md#c.PyExc_DeprecationWarning)
* [`PyExc_EOFError`](exceptions.md#c.PyExc_EOFError)
* [`PyExc_EncodingWarning`](exceptions.md#c.PyExc_EncodingWarning)
* [`PyExc_EnvironmentError`](exceptions.md#c.PyExc_EnvironmentError)
* [`PyExc_Exception`](exceptions.md#c.PyExc_Exception)
* [`PyExc_FileExistsError`](exceptions.md#c.PyExc_FileExistsError)
* [`PyExc_FileNotFoundError`](exceptions.md#c.PyExc_FileNotFoundError)
* [`PyExc_FloatingPointError`](exceptions.md#c.PyExc_FloatingPointError)
* [`PyExc_FutureWarning`](exceptions.md#c.PyExc_FutureWarning)
* [`PyExc_GeneratorExit`](exceptions.md#c.PyExc_GeneratorExit)
* [`PyExc_IOError`](exceptions.md#c.PyExc_IOError)
* [`PyExc_ImportError`](exceptions.md#c.PyExc_ImportError)
* [`PyExc_ImportWarning`](exceptions.md#c.PyExc_ImportWarning)
* [`PyExc_IndentationError`](exceptions.md#c.PyExc_IndentationError)
* [`PyExc_IndexError`](exceptions.md#c.PyExc_IndexError)
* [`PyExc_InterruptedError`](exceptions.md#c.PyExc_InterruptedError)
* [`PyExc_IsADirectoryError`](exceptions.md#c.PyExc_IsADirectoryError)
* [`PyExc_KeyError`](exceptions.md#c.PyExc_KeyError)
* [`PyExc_KeyboardInterrupt`](exceptions.md#c.PyExc_KeyboardInterrupt)
* [`PyExc_LookupError`](exceptions.md#c.PyExc_LookupError)
* [`PyExc_MemoryError`](exceptions.md#c.PyExc_MemoryError)
* [`PyExc_ModuleNotFoundError`](exceptions.md#c.PyExc_ModuleNotFoundError)
* [`PyExc_NameError`](exceptions.md#c.PyExc_NameError)
* [`PyExc_NotADirectoryError`](exceptions.md#c.PyExc_NotADirectoryError)
* [`PyExc_NotImplementedError`](exceptions.md#c.PyExc_NotImplementedError)
* [`PyExc_OSError`](exceptions.md#c.PyExc_OSError)
* [`PyExc_OverflowError`](exceptions.md#c.PyExc_OverflowError)
* [`PyExc_PendingDeprecationWarning`](exceptions.md#c.PyExc_PendingDeprecationWarning)
* [`PyExc_PermissionError`](exceptions.md#c.PyExc_PermissionError)
* [`PyExc_ProcessLookupError`](exceptions.md#c.PyExc_ProcessLookupError)
* [`PyExc_RecursionError`](exceptions.md#c.PyExc_RecursionError)
* [`PyExc_ReferenceError`](exceptions.md#c.PyExc_ReferenceError)
* [`PyExc_ResourceWarning`](exceptions.md#c.PyExc_ResourceWarning)
* [`PyExc_RuntimeError`](exceptions.md#c.PyExc_RuntimeError)
* [`PyExc_RuntimeWarning`](exceptions.md#c.PyExc_RuntimeWarning)
* [`PyExc_StopAsyncIteration`](exceptions.md#c.PyExc_StopAsyncIteration)
* [`PyExc_StopIteration`](exceptions.md#c.PyExc_StopIteration)
* [`PyExc_SyntaxError`](exceptions.md#c.PyExc_SyntaxError)
* [`PyExc_SyntaxWarning`](exceptions.md#c.PyExc_SyntaxWarning)
* [`PyExc_SystemError`](exceptions.md#c.PyExc_SystemError)
* [`PyExc_SystemExit`](exceptions.md#c.PyExc_SystemExit)
* [`PyExc_TabError`](exceptions.md#c.PyExc_TabError)
* [`PyExc_TimeoutError`](exceptions.md#c.PyExc_TimeoutError)
* [`PyExc_TypeError`](exceptions.md#c.PyExc_TypeError)
* [`PyExc_UnboundLocalError`](exceptions.md#c.PyExc_UnboundLocalError)
* [`PyExc_UnicodeDecodeError`](exceptions.md#c.PyExc_UnicodeDecodeError)
* [`PyExc_UnicodeEncodeError`](exceptions.md#c.PyExc_UnicodeEncodeError)
* [`PyExc_UnicodeError`](exceptions.md#c.PyExc_UnicodeError)
* [`PyExc_UnicodeTranslateError`](exceptions.md#c.PyExc_UnicodeTranslateError)
* [`PyExc_UnicodeWarning`](exceptions.md#c.PyExc_UnicodeWarning)
* [`PyExc_UserWarning`](exceptions.md#c.PyExc_UserWarning)
* [`PyExc_ValueError`](exceptions.md#c.PyExc_ValueError)
* [`PyExc_Warning`](exceptions.md#c.PyExc_Warning)
* [`PyExc_WindowsError`](exceptions.md#c.PyExc_WindowsError)
* [`PyExc_ZeroDivisionError`](exceptions.md#c.PyExc_ZeroDivisionError)
* [`PyExceptionClass_Name()`](exceptions.md#c.PyExceptionClass_Name)
* [`PyException_GetArgs()`](exceptions.md#c.PyException_GetArgs)
* [`PyException_GetCause()`](exceptions.md#c.PyException_GetCause)
* [`PyException_GetContext()`](exceptions.md#c.PyException_GetContext)
* [`PyException_GetTraceback()`](exceptions.md#c.PyException_GetTraceback)
* [`PyException_SetArgs()`](exceptions.md#c.PyException_SetArgs)
* [`PyException_SetCause()`](exceptions.md#c.PyException_SetCause)
* [`PyException_SetContext()`](exceptions.md#c.PyException_SetContext)
* [`PyException_SetTraceback()`](exceptions.md#c.PyException_SetTraceback)
* [`PyFile_FromFd()`](file.md#c.PyFile_FromFd)
* [`PyFile_GetLine()`](file.md#c.PyFile_GetLine)
* [`PyFile_WriteObject()`](file.md#c.PyFile_WriteObject)
* [`PyFile_WriteString()`](file.md#c.PyFile_WriteString)
* [`PyFilter_Type`](iterator.md#c.PyFilter_Type)
* [`PyFloat_AsDouble()`](float.md#c.PyFloat_AsDouble)
* [`PyFloat_FromDouble()`](float.md#c.PyFloat_FromDouble)
* [`PyFloat_FromString()`](float.md#c.PyFloat_FromString)
* [`PyFloat_GetInfo()`](float.md#c.PyFloat_GetInfo)
* [`PyFloat_GetMax()`](float.md#c.PyFloat_GetMax)
* [`PyFloat_GetMin()`](float.md#c.PyFloat_GetMin)
* [`PyFloat_Type`](float.md#c.PyFloat_Type)
* [`PyFrameObject`](frame.md#c.PyFrameObject)
* [`PyFrame_GetCode()`](frame.md#c.PyFrame_GetCode)
* [`PyFrame_GetLineNumber()`](frame.md#c.PyFrame_GetLineNumber)
* [`PyFrozenSet_New()`](set.md#c.PyFrozenSet_New)
* [`PyFrozenSet_Type`](set.md#c.PyFrozenSet_Type)
* [`PyGC_Collect()`](gcsupport.md#c.PyGC_Collect)
* [`PyGC_Disable()`](gcsupport.md#c.PyGC_Disable)
* [`PyGC_Enable()`](gcsupport.md#c.PyGC_Enable)
* [`PyGC_IsEnabled()`](gcsupport.md#c.PyGC_IsEnabled)
* [`PyGILState_Ensure()`](threads.md#c.PyGILState_Ensure)
* [`PyGILState_GetThisThreadState()`](threads.md#c.PyGILState_GetThisThreadState)
* [`PyGILState_Release()`](threads.md#c.PyGILState_Release)
* [`PyGILState_STATE`](threads.md#c.PyGILState_STATE)
* [`PyGetSetDef`](structures.md#c.PyGetSetDef)
* [`PyGetSetDescr_Type`](descriptor.md#c.PyGetSetDescr_Type)
* [`PyImport_AddModule()`](import.md#c.PyImport_AddModule)
* [`PyImport_AddModuleObject()`](import.md#c.PyImport_AddModuleObject)
* [`PyImport_AddModuleRef()`](import.md#c.PyImport_AddModuleRef)
* [`PyImport_AppendInittab()`](import.md#c.PyImport_AppendInittab)
* [`PyImport_ExecCodeModule()`](import.md#c.PyImport_ExecCodeModule)
* [`PyImport_ExecCodeModuleEx()`](import.md#c.PyImport_ExecCodeModuleEx)
* [`PyImport_ExecCodeModuleObject()`](import.md#c.PyImport_ExecCodeModuleObject)
* [`PyImport_ExecCodeModuleWithPathnames()`](import.md#c.PyImport_ExecCodeModuleWithPathnames)
* [`PyImport_GetImporter()`](import.md#c.PyImport_GetImporter)
* [`PyImport_GetMagicNumber()`](import.md#c.PyImport_GetMagicNumber)
* [`PyImport_GetMagicTag()`](import.md#c.PyImport_GetMagicTag)
* [`PyImport_GetModule()`](import.md#c.PyImport_GetModule)
* [`PyImport_GetModuleDict()`](import.md#c.PyImport_GetModuleDict)
* [`PyImport_Import()`](import.md#c.PyImport_Import)
* [`PyImport_ImportFrozenModule()`](import.md#c.PyImport_ImportFrozenModule)
* [`PyImport_ImportFrozenModuleObject()`](import.md#c.PyImport_ImportFrozenModuleObject)
* [`PyImport_ImportModule()`](import.md#c.PyImport_ImportModule)
* [`PyImport_ImportModuleLevel()`](import.md#c.PyImport_ImportModuleLevel)
* [`PyImport_ImportModuleLevelObject()`](import.md#c.PyImport_ImportModuleLevelObject)
* [`PyImport_ReloadModule()`](import.md#c.PyImport_ReloadModule)
* [`PyIndex_Check()`](number.md#c.PyIndex_Check)
* [`PyInterpreterState`](subinterpreters.md#c.PyInterpreterState)
* [`PyInterpreterState_Clear()`](subinterpreters.md#c.PyInterpreterState_Clear)
* [`PyInterpreterState_Delete()`](subinterpreters.md#c.PyInterpreterState_Delete)
* [`PyInterpreterState_Get()`](subinterpreters.md#c.PyInterpreterState_Get)
* [`PyInterpreterState_GetDict()`](subinterpreters.md#c.PyInterpreterState_GetDict)
* [`PyInterpreterState_GetID()`](subinterpreters.md#c.PyInterpreterState_GetID)
* [`PyInterpreterState_New()`](subinterpreters.md#c.PyInterpreterState_New)
* [`PyIter_Check()`](iter.md#c.PyIter_Check)
* [`PyIter_Next()`](iter.md#c.PyIter_Next)
* [`PyIter_NextItem()`](iter.md#c.PyIter_NextItem)
* [`PyIter_Send()`](iter.md#c.PyIter_Send)
* [`PyListIter_Type`](iterator.md#c.PyListIter_Type)
* [`PyListRevIter_Type`](iterator.md#c.PyListRevIter_Type)
* [`PyList_Append()`](list.md#c.PyList_Append)
* [`PyList_AsTuple()`](list.md#c.PyList_AsTuple)
* [`PyList_GetItem()`](list.md#c.PyList_GetItem)
* [`PyList_GetItemRef()`](list.md#c.PyList_GetItemRef)
* [`PyList_GetSlice()`](list.md#c.PyList_GetSlice)
* [`PyList_Insert()`](list.md#c.PyList_Insert)
* [`PyList_New()`](list.md#c.PyList_New)
* [`PyList_Reverse()`](list.md#c.PyList_Reverse)
* [`PyList_SetItem()`](list.md#c.PyList_SetItem)
* [`PyList_SetSlice()`](list.md#c.PyList_SetSlice)
* [`PyList_Size()`](list.md#c.PyList_Size)
* [`PyList_Sort()`](list.md#c.PyList_Sort)
* [`PyList_Type`](list.md#c.PyList_Type)
* [`PyLongExport`](long.md#c.PyLongExport)
* [`PyLongLayout`](long.md#c.PyLongLayout)
* [`PyLongObject`](long.md#c.PyLongObject)
* [`PyLongRangeIter_Type`](iterator.md#c.PyLongRangeIter_Type)
* [`PyLongWriter`](long.md#c.PyLongWriter)
* [`PyLongWriter_Create()`](long.md#c.PyLongWriter_Create)
* [`PyLongWriter_Discard()`](long.md#c.PyLongWriter_Discard)
* [`PyLongWriter_Finish()`](long.md#c.PyLongWriter_Finish)
* [`PyLong_AsDouble()`](long.md#c.PyLong_AsDouble)
* [`PyLong_AsInt()`](long.md#c.PyLong_AsInt)
* [`PyLong_AsInt32()`](long.md#c.PyLong_AsInt32)
* [`PyLong_AsInt64()`](long.md#c.PyLong_AsInt64)
* [`PyLong_AsLong()`](long.md#c.PyLong_AsLong)
* [`PyLong_AsLongAndOverflow()`](long.md#c.PyLong_AsLongAndOverflow)
* [`PyLong_AsLongLong()`](long.md#c.PyLong_AsLongLong)
* [`PyLong_AsLongLongAndOverflow()`](long.md#c.PyLong_AsLongLongAndOverflow)
* [`PyLong_AsNativeBytes()`](long.md#c.PyLong_AsNativeBytes)
* [`PyLong_AsSize_t()`](long.md#c.PyLong_AsSize_t)
* [`PyLong_AsSsize_t()`](long.md#c.PyLong_AsSsize_t)
* [`PyLong_AsUInt32()`](long.md#c.PyLong_AsUInt32)
* [`PyLong_AsUInt64()`](long.md#c.PyLong_AsUInt64)
* [`PyLong_AsUnsignedLong()`](long.md#c.PyLong_AsUnsignedLong)
* [`PyLong_AsUnsignedLongLong()`](long.md#c.PyLong_AsUnsignedLongLong)
* [`PyLong_AsUnsignedLongLongMask()`](long.md#c.PyLong_AsUnsignedLongLongMask)
* [`PyLong_AsUnsignedLongMask()`](long.md#c.PyLong_AsUnsignedLongMask)
* [`PyLong_AsVoidPtr()`](long.md#c.PyLong_AsVoidPtr)
* [`PyLong_Export()`](long.md#c.PyLong_Export)
* [`PyLong_FreeExport()`](long.md#c.PyLong_FreeExport)
* [`PyLong_FromDouble()`](long.md#c.PyLong_FromDouble)
* [`PyLong_FromInt32()`](long.md#c.PyLong_FromInt32)
* [`PyLong_FromInt64()`](long.md#c.PyLong_FromInt64)
* [`PyLong_FromLong()`](long.md#c.PyLong_FromLong)
* [`PyLong_FromLongLong()`](long.md#c.PyLong_FromLongLong)
* [`PyLong_FromNativeBytes()`](long.md#c.PyLong_FromNativeBytes)
* [`PyLong_FromSize_t()`](long.md#c.PyLong_FromSize_t)
* [`PyLong_FromSsize_t()`](long.md#c.PyLong_FromSsize_t)
* [`PyLong_FromString()`](long.md#c.PyLong_FromString)
* [`PyLong_FromUInt32()`](long.md#c.PyLong_FromUInt32)
* [`PyLong_FromUInt64()`](long.md#c.PyLong_FromUInt64)
* [`PyLong_FromUnsignedLong()`](long.md#c.PyLong_FromUnsignedLong)
* [`PyLong_FromUnsignedLongLong()`](long.md#c.PyLong_FromUnsignedLongLong)
* [`PyLong_FromUnsignedNativeBytes()`](long.md#c.PyLong_FromUnsignedNativeBytes)
* [`PyLong_FromVoidPtr()`](long.md#c.PyLong_FromVoidPtr)
* [`PyLong_GetInfo()`](long.md#c.PyLong_GetInfo)
* [`PyLong_GetNativeLayout()`](long.md#c.PyLong_GetNativeLayout)
* [`PyLong_Type`](long.md#c.PyLong_Type)
* [`PyMODEXPORT_FUNC`](extension-modules.md#c.PyMODEXPORT_FUNC)
* [`PyMap_Type`](iterator.md#c.PyMap_Type)
* [`PyMapping_Check()`](mapping.md#c.PyMapping_Check)
* [`PyMapping_GetItemString()`](mapping.md#c.PyMapping_GetItemString)
* [`PyMapping_GetOptionalItem()`](mapping.md#c.PyMapping_GetOptionalItem)
* [`PyMapping_GetOptionalItemString()`](mapping.md#c.PyMapping_GetOptionalItemString)
* [`PyMapping_HasKey()`](mapping.md#c.PyMapping_HasKey)
* [`PyMapping_HasKeyString()`](mapping.md#c.PyMapping_HasKeyString)
* [`PyMapping_HasKeyStringWithError()`](mapping.md#c.PyMapping_HasKeyStringWithError)
* [`PyMapping_HasKeyWithError()`](mapping.md#c.PyMapping_HasKeyWithError)
* [`PyMapping_Items()`](mapping.md#c.PyMapping_Items)
* [`PyMapping_Keys()`](mapping.md#c.PyMapping_Keys)
* [`PyMapping_Length()`](mapping.md#c.PyMapping_Length)
* [`PyMapping_SetItemString()`](mapping.md#c.PyMapping_SetItemString)
* [`PyMapping_Size()`](mapping.md#c.PyMapping_Size)
* [`PyMapping_Values()`](mapping.md#c.PyMapping_Values)
* [`PyMem_Calloc()`](memory.md#c.PyMem_Calloc)
* [`PyMem_Free()`](memory.md#c.PyMem_Free)
* [`PyMem_Malloc()`](memory.md#c.PyMem_Malloc)
* [`PyMem_RawCalloc()`](memory.md#c.PyMem_RawCalloc)
* [`PyMem_RawFree()`](memory.md#c.PyMem_RawFree)
* [`PyMem_RawMalloc()`](memory.md#c.PyMem_RawMalloc)
* [`PyMem_RawRealloc()`](memory.md#c.PyMem_RawRealloc)
* [`PyMem_Realloc()`](memory.md#c.PyMem_Realloc)
* [`PyMemberDef`](structures.md#c.PyMemberDef)
* [`PyMemberDescr_Type`](descriptor.md#c.PyMemberDescr_Type)
* [`PyMember_GetOne()`](structures.md#c.PyMember_GetOne)
* [`PyMember_SetOne()`](structures.md#c.PyMember_SetOne)
* [`PyMemoryView_FromBuffer()`](memoryview.md#c.PyMemoryView_FromBuffer)
* [`PyMemoryView_FromMemory()`](memoryview.md#c.PyMemoryView_FromMemory)
* [`PyMemoryView_FromObject()`](memoryview.md#c.PyMemoryView_FromObject)
* [`PyMemoryView_GetContiguous()`](memoryview.md#c.PyMemoryView_GetContiguous)
* [`PyMemoryView_Type`](memoryview.md#c.PyMemoryView_Type)
* [`PyMethodDef`](structures.md#c.PyMethodDef)
* [`PyMethodDescr_Type`](descriptor.md#c.PyMethodDescr_Type)
* [`PyModuleDef`](module.md#c.PyModuleDef)
* [`PyModuleDef_Base`](module.md#c.PyModuleDef_Base)
* [`PyModuleDef_Init()`](extension-modules.md#c.PyModuleDef_Init)
* [`PyModuleDef_Slot`](module.md#c.PyModuleDef_Slot)
* [`PyModuleDef_Type`](module.md#c.PyModuleDef_Type)
* [`PyModule_Add()`](module.md#c.PyModule_Add)
* [`PyModule_AddFunctions()`](module.md#c.PyModule_AddFunctions)
* [`PyModule_AddIntConstant()`](module.md#c.PyModule_AddIntConstant)
* [`PyModule_AddObject()`](module.md#c.PyModule_AddObject)
* [`PyModule_AddObjectRef()`](module.md#c.PyModule_AddObjectRef)
* [`PyModule_AddStringConstant()`](module.md#c.PyModule_AddStringConstant)
* [`PyModule_AddType()`](module.md#c.PyModule_AddType)
* [`PyModule_Create2()`](module.md#c.PyModule_Create2)
* [`PyModule_Exec()`](module.md#c.PyModule_Exec)
* [`PyModule_ExecDef()`](module.md#c.PyModule_ExecDef)
* [`PyModule_FromDefAndSpec2()`](module.md#c.PyModule_FromDefAndSpec2)
* [`PyModule_FromSlotsAndSpec()`](module.md#c.PyModule_FromSlotsAndSpec)
* [`PyModule_GetDef()`](module.md#c.PyModule_GetDef)
* [`PyModule_GetDict()`](module.md#c.PyModule_GetDict)
* [`PyModule_GetFilename()`](module.md#c.PyModule_GetFilename)
* [`PyModule_GetFilenameObject()`](module.md#c.PyModule_GetFilenameObject)
* [`PyModule_GetName()`](module.md#c.PyModule_GetName)
* [`PyModule_GetNameObject()`](module.md#c.PyModule_GetNameObject)
* [`PyModule_GetState()`](module.md#c.PyModule_GetState)
* [`PyModule_GetStateSize()`](module.md#c.PyModule_GetStateSize)
* [`PyModule_GetState_DuringGC()`](gcsupport.md#c.PyModule_GetState_DuringGC)
* [`PyModule_GetToken()`](module.md#c.PyModule_GetToken)
* [`PyModule_GetToken_DuringGC()`](gcsupport.md#c.PyModule_GetToken_DuringGC)
* [`PyModule_New()`](module.md#c.PyModule_New)
* [`PyModule_NewObject()`](module.md#c.PyModule_NewObject)
* [`PyModule_SetDocString()`](module.md#c.PyModule_SetDocString)
* [`PyModule_Type`](module.md#c.PyModule_Type)
* [`PyNumber_Absolute()`](number.md#c.PyNumber_Absolute)
* [`PyNumber_Add()`](number.md#c.PyNumber_Add)
* [`PyNumber_And()`](number.md#c.PyNumber_And)
* [`PyNumber_AsSsize_t()`](number.md#c.PyNumber_AsSsize_t)
* [`PyNumber_Check()`](number.md#c.PyNumber_Check)
* [`PyNumber_Divmod()`](number.md#c.PyNumber_Divmod)
* [`PyNumber_Float()`](number.md#c.PyNumber_Float)
* [`PyNumber_FloorDivide()`](number.md#c.PyNumber_FloorDivide)
* [`PyNumber_InPlaceAdd()`](number.md#c.PyNumber_InPlaceAdd)
* [`PyNumber_InPlaceAnd()`](number.md#c.PyNumber_InPlaceAnd)
* [`PyNumber_InPlaceFloorDivide()`](number.md#c.PyNumber_InPlaceFloorDivide)
* [`PyNumber_InPlaceLshift()`](number.md#c.PyNumber_InPlaceLshift)
* [`PyNumber_InPlaceMatrixMultiply()`](number.md#c.PyNumber_InPlaceMatrixMultiply)
* [`PyNumber_InPlaceMultiply()`](number.md#c.PyNumber_InPlaceMultiply)
* [`PyNumber_InPlaceOr()`](number.md#c.PyNumber_InPlaceOr)
* [`PyNumber_InPlacePower()`](number.md#c.PyNumber_InPlacePower)
* [`PyNumber_InPlaceRemainder()`](number.md#c.PyNumber_InPlaceRemainder)
* [`PyNumber_InPlaceRshift()`](number.md#c.PyNumber_InPlaceRshift)
* [`PyNumber_InPlaceSubtract()`](number.md#c.PyNumber_InPlaceSubtract)
* [`PyNumber_InPlaceTrueDivide()`](number.md#c.PyNumber_InPlaceTrueDivide)
* [`PyNumber_InPlaceXor()`](number.md#c.PyNumber_InPlaceXor)
* [`PyNumber_Index()`](number.md#c.PyNumber_Index)
* [`PyNumber_Invert()`](number.md#c.PyNumber_Invert)
* [`PyNumber_Long()`](number.md#c.PyNumber_Long)
* [`PyNumber_Lshift()`](number.md#c.PyNumber_Lshift)
* [`PyNumber_MatrixMultiply()`](number.md#c.PyNumber_MatrixMultiply)
* [`PyNumber_Multiply()`](number.md#c.PyNumber_Multiply)
* [`PyNumber_Negative()`](number.md#c.PyNumber_Negative)
* [`PyNumber_Or()`](number.md#c.PyNumber_Or)
* [`PyNumber_Positive()`](number.md#c.PyNumber_Positive)
* [`PyNumber_Power()`](number.md#c.PyNumber_Power)
* [`PyNumber_Remainder()`](number.md#c.PyNumber_Remainder)
* [`PyNumber_Rshift()`](number.md#c.PyNumber_Rshift)
* [`PyNumber_Subtract()`](number.md#c.PyNumber_Subtract)
* [`PyNumber_ToBase()`](number.md#c.PyNumber_ToBase)
* [`PyNumber_TrueDivide()`](number.md#c.PyNumber_TrueDivide)
* [`PyNumber_Xor()`](number.md#c.PyNumber_Xor)
* [`PyOS_AfterFork()`](sys.md#c.PyOS_AfterFork)
* [`PyOS_AfterFork_Child()`](sys.md#c.PyOS_AfterFork_Child)
* [`PyOS_AfterFork_Parent()`](sys.md#c.PyOS_AfterFork_Parent)
* [`PyOS_BeforeFork()`](sys.md#c.PyOS_BeforeFork)
* [`PyOS_CheckStack()`](sys.md#c.PyOS_CheckStack)
* [`PyOS_FSPath()`](sys.md#c.PyOS_FSPath)
* [`PyOS_InputHook`](veryhigh.md#c.PyOS_InputHook)
* [`PyOS_InterruptOccurred()`](sys.md#c.PyOS_InterruptOccurred)
* [`PyOS_double_to_string()`](conversion.md#c.PyOS_double_to_string)
* [`PyOS_getsig()`](sys.md#c.PyOS_getsig)
* [`PyOS_mystricmp()`](conversion.md#c.PyOS_mystricmp)
* [`PyOS_mystrnicmp()`](conversion.md#c.PyOS_mystrnicmp)
* [`PyOS_setsig()`](sys.md#c.PyOS_setsig)
* [`PyOS_sighandler_t`](sys.md#c.PyOS_sighandler_t)
* [`PyOS_snprintf()`](conversion.md#c.PyOS_snprintf)
* [`PyOS_string_to_double()`](conversion.md#c.PyOS_string_to_double)
* [`PyOS_strtol()`](conversion.md#c.PyOS_strtol)
* [`PyOS_strtoul()`](conversion.md#c.PyOS_strtoul)
* [`PyOS_vsnprintf()`](conversion.md#c.PyOS_vsnprintf)
* [`PyObject`](structures.md#c.PyObject)
* [`PyObject.ob_refcnt`](structures.md#c.PyObject.ob_refcnt)
* [`PyObject.ob_type`](structures.md#c.PyObject.ob_type)
* [`PyObject_ASCII()`](object.md#c.PyObject_ASCII)
* [`PyObject_AsFileDescriptor()`](file.md#c.PyObject_AsFileDescriptor)
* [`PyObject_Bytes()`](object.md#c.PyObject_Bytes)
* [`PyObject_Call()`](call.md#c.PyObject_Call)
* [`PyObject_CallFunction()`](call.md#c.PyObject_CallFunction)
* [`PyObject_CallFunctionObjArgs()`](call.md#c.PyObject_CallFunctionObjArgs)
* [`PyObject_CallMethod()`](call.md#c.PyObject_CallMethod)
* [`PyObject_CallMethodObjArgs()`](call.md#c.PyObject_CallMethodObjArgs)
* [`PyObject_CallNoArgs()`](call.md#c.PyObject_CallNoArgs)
* [`PyObject_CallObject()`](call.md#c.PyObject_CallObject)
* [`PyObject_Calloc()`](memory.md#c.PyObject_Calloc)
* [`PyObject_CheckBuffer()`](buffer.md#c.PyObject_CheckBuffer)
* [`PyObject_ClearWeakRefs()`](weakref.md#c.PyObject_ClearWeakRefs)
* [`PyObject_CopyData()`](buffer.md#c.PyObject_CopyData)
* [`PyObject_DelAttr()`](object.md#c.PyObject_DelAttr)
* [`PyObject_DelAttrString()`](object.md#c.PyObject_DelAttrString)
* [`PyObject_DelItem()`](object.md#c.PyObject_DelItem)
* [`PyObject_DelItemString()`](object.md#c.PyObject_DelItemString)
* [`PyObject_Dir()`](object.md#c.PyObject_Dir)
* [`PyObject_Format()`](object.md#c.PyObject_Format)
* [`PyObject_Free()`](memory.md#c.PyObject_Free)
* [`PyObject_GC_Del()`](gcsupport.md#c.PyObject_GC_Del)
* [`PyObject_GC_IsFinalized()`](gcsupport.md#c.PyObject_GC_IsFinalized)
* [`PyObject_GC_IsTracked()`](gcsupport.md#c.PyObject_GC_IsTracked)
* [`PyObject_GC_Track()`](gcsupport.md#c.PyObject_GC_Track)
* [`PyObject_GC_UnTrack()`](gcsupport.md#c.PyObject_GC_UnTrack)
* [`PyObject_GenericGetAttr()`](object.md#c.PyObject_GenericGetAttr)
* [`PyObject_GenericGetDict()`](object.md#c.PyObject_GenericGetDict)
* [`PyObject_GenericSetAttr()`](object.md#c.PyObject_GenericSetAttr)
* [`PyObject_GenericSetDict()`](object.md#c.PyObject_GenericSetDict)
* [`PyObject_GetAIter()`](object.md#c.PyObject_GetAIter)
* [`PyObject_GetAttr()`](object.md#c.PyObject_GetAttr)
* [`PyObject_GetAttrString()`](object.md#c.PyObject_GetAttrString)
* [`PyObject_GetBuffer()`](buffer.md#c.PyObject_GetBuffer)
* [`PyObject_GetItem()`](object.md#c.PyObject_GetItem)
* [`PyObject_GetIter()`](object.md#c.PyObject_GetIter)
* [`PyObject_GetOptionalAttr()`](object.md#c.PyObject_GetOptionalAttr)
* [`PyObject_GetOptionalAttrString()`](object.md#c.PyObject_GetOptionalAttrString)
* [`PyObject_GetTypeData()`](object.md#c.PyObject_GetTypeData)
* [`PyObject_GetTypeData_DuringGC()`](gcsupport.md#c.PyObject_GetTypeData_DuringGC)
* [`PyObject_HasAttr()`](object.md#c.PyObject_HasAttr)
* [`PyObject_HasAttrString()`](object.md#c.PyObject_HasAttrString)
* [`PyObject_HasAttrStringWithError()`](object.md#c.PyObject_HasAttrStringWithError)
* [`PyObject_HasAttrWithError()`](object.md#c.PyObject_HasAttrWithError)
* [`PyObject_Hash()`](object.md#c.PyObject_Hash)
* [`PyObject_HashNotImplemented()`](object.md#c.PyObject_HashNotImplemented)
* [`PyObject_Init()`](allocation.md#c.PyObject_Init)
* [`PyObject_InitVar()`](allocation.md#c.PyObject_InitVar)
* [`PyObject_IsInstance()`](object.md#c.PyObject_IsInstance)
* [`PyObject_IsSubclass()`](object.md#c.PyObject_IsSubclass)
* [`PyObject_IsTrue()`](object.md#c.PyObject_IsTrue)
* [`PyObject_Length()`](object.md#c.PyObject_Length)
* [`PyObject_Malloc()`](memory.md#c.PyObject_Malloc)
* [`PyObject_Not()`](object.md#c.PyObject_Not)
* [`PyObject_Realloc()`](memory.md#c.PyObject_Realloc)
* [`PyObject_Repr()`](object.md#c.PyObject_Repr)
* [`PyObject_RichCompare()`](object.md#c.PyObject_RichCompare)
* [`PyObject_RichCompareBool()`](object.md#c.PyObject_RichCompareBool)
* [`PyObject_SelfIter()`](object.md#c.PyObject_SelfIter)
* [`PyObject_SetAttr()`](object.md#c.PyObject_SetAttr)
* [`PyObject_SetAttrString()`](object.md#c.PyObject_SetAttrString)
* [`PyObject_SetItem()`](object.md#c.PyObject_SetItem)
* [`PyObject_Size()`](object.md#c.PyObject_Size)
* [`PyObject_Str()`](object.md#c.PyObject_Str)
* [`PyObject_Type()`](object.md#c.PyObject_Type)
* [`PyObject_Vectorcall()`](call.md#c.PyObject_Vectorcall)
* [`PyObject_VectorcallMethod()`](call.md#c.PyObject_VectorcallMethod)
* [`PyProperty_Type`](descriptor.md#c.PyProperty_Type)
* [`PyRangeIter_Type`](iterator.md#c.PyRangeIter_Type)
* [`PyRange_Type`](iterator.md#c.PyRange_Type)
* [`PyReversed_Type`](iterator.md#c.PyReversed_Type)
* [`PySeqIter_New()`](iterator.md#c.PySeqIter_New)
* [`PySeqIter_Type`](iterator.md#c.PySeqIter_Type)
* [`PySequence_Check()`](sequence.md#c.PySequence_Check)
* [`PySequence_Concat()`](sequence.md#c.PySequence_Concat)
* [`PySequence_Contains()`](sequence.md#c.PySequence_Contains)
* [`PySequence_Count()`](sequence.md#c.PySequence_Count)
* [`PySequence_DelItem()`](sequence.md#c.PySequence_DelItem)
* [`PySequence_DelSlice()`](sequence.md#c.PySequence_DelSlice)
* [`PySequence_Fast()`](sequence.md#c.PySequence_Fast)
* [`PySequence_GetItem()`](sequence.md#c.PySequence_GetItem)
* [`PySequence_GetSlice()`](sequence.md#c.PySequence_GetSlice)
* [`PySequence_In()`](sequence.md#c.PySequence_In)
* [`PySequence_InPlaceConcat()`](sequence.md#c.PySequence_InPlaceConcat)
* [`PySequence_InPlaceRepeat()`](sequence.md#c.PySequence_InPlaceRepeat)
* [`PySequence_Index()`](sequence.md#c.PySequence_Index)
* [`PySequence_Length()`](sequence.md#c.PySequence_Length)
* [`PySequence_List()`](sequence.md#c.PySequence_List)
* [`PySequence_Repeat()`](sequence.md#c.PySequence_Repeat)
* [`PySequence_SetItem()`](sequence.md#c.PySequence_SetItem)
* [`PySequence_SetSlice()`](sequence.md#c.PySequence_SetSlice)
* [`PySequence_Size()`](sequence.md#c.PySequence_Size)
* [`PySequence_Tuple()`](sequence.md#c.PySequence_Tuple)
* [`PySetIter_Type`](iterator.md#c.PySetIter_Type)
* [`PySet_Add()`](set.md#c.PySet_Add)
* [`PySet_Clear()`](set.md#c.PySet_Clear)
* [`PySet_Contains()`](set.md#c.PySet_Contains)
* [`PySet_Discard()`](set.md#c.PySet_Discard)
* [`PySet_New()`](set.md#c.PySet_New)
* [`PySet_Pop()`](set.md#c.PySet_Pop)
* [`PySet_Size()`](set.md#c.PySet_Size)
* [`PySet_Type`](set.md#c.PySet_Type)
* [`PySlice_AdjustIndices()`](slice.md#c.PySlice_AdjustIndices)
* [`PySlice_GetIndices()`](slice.md#c.PySlice_GetIndices)
* [`PySlice_GetIndicesEx()`](slice.md#c.PySlice_GetIndicesEx)
* [`PySlice_New()`](slice.md#c.PySlice_New)
* [`PySlice_Type`](slice.md#c.PySlice_Type)
* [`PySlice_Unpack()`](slice.md#c.PySlice_Unpack)
* [`PyState_AddModule()`](module.md#c.PyState_AddModule)
* [`PyState_FindModule()`](module.md#c.PyState_FindModule)
* [`PyState_RemoveModule()`](module.md#c.PyState_RemoveModule)
* [`PyStructSequence_Desc`](tuple.md#c.PyStructSequence_Desc)
* [`PyStructSequence_Field`](tuple.md#c.PyStructSequence_Field)
* [`PyStructSequence_GetItem()`](tuple.md#c.PyStructSequence_GetItem)
* [`PyStructSequence_New()`](tuple.md#c.PyStructSequence_New)
* [`PyStructSequence_NewType()`](tuple.md#c.PyStructSequence_NewType)
* [`PyStructSequence_SetItem()`](tuple.md#c.PyStructSequence_SetItem)
* [`PyStructSequence_UnnamedField`](tuple.md#c.PyStructSequence_UnnamedField)
* [`PySuper_Type`](descriptor.md#c.PySuper_Type)
* [`PySys_Audit()`](sys.md#c.PySys_Audit)
* [`PySys_AuditTuple()`](sys.md#c.PySys_AuditTuple)
* [`PySys_FormatStderr()`](sys.md#c.PySys_FormatStderr)
* [`PySys_FormatStdout()`](sys.md#c.PySys_FormatStdout)
* [`PySys_GetAttr()`](sys.md#c.PySys_GetAttr)
* [`PySys_GetAttrString()`](sys.md#c.PySys_GetAttrString)
* [`PySys_GetObject()`](sys.md#c.PySys_GetObject)
* [`PySys_GetOptionalAttr()`](sys.md#c.PySys_GetOptionalAttr)
* [`PySys_GetOptionalAttrString()`](sys.md#c.PySys_GetOptionalAttrString)
* [`PySys_GetXOptions()`](sys.md#c.PySys_GetXOptions)
* [`PySys_SetArgv()`](interp-lifecycle.md#c.PySys_SetArgv)
* [`PySys_SetArgvEx()`](interp-lifecycle.md#c.PySys_SetArgvEx)
* [`PySys_SetObject()`](sys.md#c.PySys_SetObject)
* [`PySys_WriteStderr()`](sys.md#c.PySys_WriteStderr)
* [`PySys_WriteStdout()`](sys.md#c.PySys_WriteStdout)
* [`PyThreadState`](threads.md#c.PyThreadState)
* [`PyThreadState_Clear()`](threads.md#c.PyThreadState_Clear)
* [`PyThreadState_Delete()`](threads.md#c.PyThreadState_Delete)
* [`PyThreadState_Get()`](threads.md#c.PyThreadState_Get)
* [`PyThreadState_GetDict()`](threads.md#c.PyThreadState_GetDict)
* [`PyThreadState_GetFrame()`](threads.md#c.PyThreadState_GetFrame)
* [`PyThreadState_GetID()`](threads.md#c.PyThreadState_GetID)
* [`PyThreadState_GetInterpreter()`](threads.md#c.PyThreadState_GetInterpreter)
* [`PyThreadState_New()`](threads.md#c.PyThreadState_New)
* [`PyThreadState_SetAsyncExc()`](threads.md#c.PyThreadState_SetAsyncExc)
* [`PyThreadState_Swap()`](threads.md#c.PyThreadState_Swap)
* [`PyThread_GetInfo()`](threads.md#c.PyThread_GetInfo)
* [`PyThread_ReInitTLS()`](tls.md#c.PyThread_ReInitTLS)
* [`PyThread_acquire_lock()`](synchronization.md#c.PyThread_acquire_lock)
* [`PyThread_acquire_lock_timed()`](synchronization.md#c.PyThread_acquire_lock_timed)
* [`PyThread_allocate_lock()`](synchronization.md#c.PyThread_allocate_lock)
* [`PyThread_create_key()`](tls.md#c.PyThread_create_key)
* [`PyThread_delete_key()`](tls.md#c.PyThread_delete_key)
* [`PyThread_delete_key_value()`](tls.md#c.PyThread_delete_key_value)
* [`PyThread_exit_thread()`](threads.md#c.PyThread_exit_thread)
* [`PyThread_free_lock()`](synchronization.md#c.PyThread_free_lock)
* [`PyThread_get_key_value()`](tls.md#c.PyThread_get_key_value)
* [`PyThread_get_stacksize()`](threads.md#c.PyThread_get_stacksize)
* [`PyThread_get_thread_ident()`](threads.md#c.PyThread_get_thread_ident)
* [`PyThread_get_thread_native_id()`](threads.md#c.PyThread_get_thread_native_id)
* [`PyThread_init_thread()`](threads.md#c.PyThread_init_thread)
* [`PyThread_release_lock()`](synchronization.md#c.PyThread_release_lock)
* [`PyThread_set_key_value()`](tls.md#c.PyThread_set_key_value)
* [`PyThread_set_stacksize()`](threads.md#c.PyThread_set_stacksize)
* [`PyThread_start_new_thread()`](threads.md#c.PyThread_start_new_thread)
* [`PyThread_tss_alloc()`](tls.md#c.PyThread_tss_alloc)
* [`PyThread_tss_create()`](tls.md#c.PyThread_tss_create)
* [`PyThread_tss_delete()`](tls.md#c.PyThread_tss_delete)
* [`PyThread_tss_free()`](tls.md#c.PyThread_tss_free)
* [`PyThread_tss_get()`](tls.md#c.PyThread_tss_get)
* [`PyThread_tss_is_created()`](tls.md#c.PyThread_tss_is_created)
* [`PyThread_tss_set()`](tls.md#c.PyThread_tss_set)
* [`PyTraceBack_Here()`](exceptions.md#c.PyTraceBack_Here)
* [`PyTraceBack_Print()`](exceptions.md#c.PyTraceBack_Print)
* [`PyTraceBack_Type`](exceptions.md#c.PyTraceBack_Type)
* [`PyTupleIter_Type`](iterator.md#c.PyTupleIter_Type)
* [`PyTuple_GetItem()`](tuple.md#c.PyTuple_GetItem)
* [`PyTuple_GetSlice()`](tuple.md#c.PyTuple_GetSlice)
* [`PyTuple_New()`](tuple.md#c.PyTuple_New)
* [`PyTuple_Pack()`](tuple.md#c.PyTuple_Pack)
* [`PyTuple_SetItem()`](tuple.md#c.PyTuple_SetItem)
* [`PyTuple_Size()`](tuple.md#c.PyTuple_Size)
* [`PyTuple_Type`](tuple.md#c.PyTuple_Type)
* [`PyTypeObject`](type.md#c.PyTypeObject)
* [`PyType_ClearCache()`](type.md#c.PyType_ClearCache)
* [`PyType_Freeze()`](type.md#c.PyType_Freeze)
* [`PyType_FromMetaclass()`](type.md#c.PyType_FromMetaclass)
* [`PyType_FromModuleAndSpec()`](type.md#c.PyType_FromModuleAndSpec)
* [`PyType_FromSpec()`](type.md#c.PyType_FromSpec)
* [`PyType_FromSpecWithBases()`](type.md#c.PyType_FromSpecWithBases)
* [`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc)
* [`PyType_GenericNew()`](type.md#c.PyType_GenericNew)
* [`PyType_GetBaseByToken()`](type.md#c.PyType_GetBaseByToken)
* [`PyType_GetBaseByToken_DuringGC()`](gcsupport.md#c.PyType_GetBaseByToken_DuringGC)
* [`PyType_GetFlags()`](type.md#c.PyType_GetFlags)
* [`PyType_GetFullyQualifiedName()`](type.md#c.PyType_GetFullyQualifiedName)
* [`PyType_GetModule()`](type.md#c.PyType_GetModule)
* [`PyType_GetModuleByDef()`](type.md#c.PyType_GetModuleByDef)
* [`PyType_GetModuleByToken()`](type.md#c.PyType_GetModuleByToken)
* [`PyType_GetModuleByToken_DuringGC()`](gcsupport.md#c.PyType_GetModuleByToken_DuringGC)
* [`PyType_GetModuleName()`](type.md#c.PyType_GetModuleName)
* [`PyType_GetModuleState()`](type.md#c.PyType_GetModuleState)
* [`PyType_GetModuleState_DuringGC()`](gcsupport.md#c.PyType_GetModuleState_DuringGC)
* [`PyType_GetModule_DuringGC()`](gcsupport.md#c.PyType_GetModule_DuringGC)
* [`PyType_GetName()`](type.md#c.PyType_GetName)
* [`PyType_GetQualName()`](type.md#c.PyType_GetQualName)
* [`PyType_GetSlot()`](type.md#c.PyType_GetSlot)
* [`PyType_GetTypeDataSize()`](object.md#c.PyType_GetTypeDataSize)
* [`PyType_IsSubtype()`](type.md#c.PyType_IsSubtype)
* [`PyType_Modified()`](type.md#c.PyType_Modified)
* [`PyType_Ready()`](type.md#c.PyType_Ready)
* [`PyType_Slot`](type.md#c.PyType_Slot)
* [`PyType_Spec`](type.md#c.PyType_Spec)
* [`PyType_Type`](type.md#c.PyType_Type)
* [`PyUnicodeDecodeError_Create()`](exceptions.md#c.PyUnicodeDecodeError_Create)
* [`PyUnicodeDecodeError_GetEncoding()`](exceptions.md#c.PyUnicodeDecodeError_GetEncoding)
* [`PyUnicodeDecodeError_GetEnd()`](exceptions.md#c.PyUnicodeDecodeError_GetEnd)
* [`PyUnicodeDecodeError_GetObject()`](exceptions.md#c.PyUnicodeDecodeError_GetObject)
* [`PyUnicodeDecodeError_GetReason()`](exceptions.md#c.PyUnicodeDecodeError_GetReason)
* [`PyUnicodeDecodeError_GetStart()`](exceptions.md#c.PyUnicodeDecodeError_GetStart)
* [`PyUnicodeDecodeError_SetEnd()`](exceptions.md#c.PyUnicodeDecodeError_SetEnd)
* [`PyUnicodeDecodeError_SetReason()`](exceptions.md#c.PyUnicodeDecodeError_SetReason)
* [`PyUnicodeDecodeError_SetStart()`](exceptions.md#c.PyUnicodeDecodeError_SetStart)
* [`PyUnicodeEncodeError_GetEncoding()`](exceptions.md#c.PyUnicodeEncodeError_GetEncoding)
* [`PyUnicodeEncodeError_GetEnd()`](exceptions.md#c.PyUnicodeEncodeError_GetEnd)
* [`PyUnicodeEncodeError_GetObject()`](exceptions.md#c.PyUnicodeEncodeError_GetObject)
* [`PyUnicodeEncodeError_GetReason()`](exceptions.md#c.PyUnicodeEncodeError_GetReason)
* [`PyUnicodeEncodeError_GetStart()`](exceptions.md#c.PyUnicodeEncodeError_GetStart)
* [`PyUnicodeEncodeError_SetEnd()`](exceptions.md#c.PyUnicodeEncodeError_SetEnd)
* [`PyUnicodeEncodeError_SetReason()`](exceptions.md#c.PyUnicodeEncodeError_SetReason)
* [`PyUnicodeEncodeError_SetStart()`](exceptions.md#c.PyUnicodeEncodeError_SetStart)
* [`PyUnicodeIter_Type`](unicode.md#c.PyUnicodeIter_Type)
* [`PyUnicodeTranslateError_GetEnd()`](exceptions.md#c.PyUnicodeTranslateError_GetEnd)
* [`PyUnicodeTranslateError_GetObject()`](exceptions.md#c.PyUnicodeTranslateError_GetObject)
* [`PyUnicodeTranslateError_GetReason()`](exceptions.md#c.PyUnicodeTranslateError_GetReason)
* [`PyUnicodeTranslateError_GetStart()`](exceptions.md#c.PyUnicodeTranslateError_GetStart)
* [`PyUnicodeTranslateError_SetEnd()`](exceptions.md#c.PyUnicodeTranslateError_SetEnd)
* [`PyUnicodeTranslateError_SetReason()`](exceptions.md#c.PyUnicodeTranslateError_SetReason)
* [`PyUnicodeTranslateError_SetStart()`](exceptions.md#c.PyUnicodeTranslateError_SetStart)
* [`PyUnicode_Append()`](unicode.md#c.PyUnicode_Append)
* [`PyUnicode_AppendAndDel()`](unicode.md#c.PyUnicode_AppendAndDel)
* [`PyUnicode_AsASCIIString()`](unicode.md#c.PyUnicode_AsASCIIString)
* [`PyUnicode_AsCharmapString()`](unicode.md#c.PyUnicode_AsCharmapString)
* [`PyUnicode_AsEncodedString()`](unicode.md#c.PyUnicode_AsEncodedString)
* [`PyUnicode_AsLatin1String()`](unicode.md#c.PyUnicode_AsLatin1String)
* [`PyUnicode_AsMBCSString()`](unicode.md#c.PyUnicode_AsMBCSString)
* [`PyUnicode_AsRawUnicodeEscapeString()`](unicode.md#c.PyUnicode_AsRawUnicodeEscapeString)
* [`PyUnicode_AsUCS4()`](unicode.md#c.PyUnicode_AsUCS4)
* [`PyUnicode_AsUCS4Copy()`](unicode.md#c.PyUnicode_AsUCS4Copy)
* [`PyUnicode_AsUTF16String()`](unicode.md#c.PyUnicode_AsUTF16String)
* [`PyUnicode_AsUTF32String()`](unicode.md#c.PyUnicode_AsUTF32String)
* [`PyUnicode_AsUTF8AndSize()`](unicode.md#c.PyUnicode_AsUTF8AndSize)
* [`PyUnicode_AsUTF8String()`](unicode.md#c.PyUnicode_AsUTF8String)
* [`PyUnicode_AsUnicodeEscapeString()`](unicode.md#c.PyUnicode_AsUnicodeEscapeString)
* [`PyUnicode_AsWideChar()`](unicode.md#c.PyUnicode_AsWideChar)
* [`PyUnicode_AsWideCharString()`](unicode.md#c.PyUnicode_AsWideCharString)
* [`PyUnicode_BuildEncodingMap()`](unicode.md#c.PyUnicode_BuildEncodingMap)
* [`PyUnicode_Compare()`](unicode.md#c.PyUnicode_Compare)
* [`PyUnicode_CompareWithASCIIString()`](unicode.md#c.PyUnicode_CompareWithASCIIString)
* [`PyUnicode_Concat()`](unicode.md#c.PyUnicode_Concat)
* [`PyUnicode_Contains()`](unicode.md#c.PyUnicode_Contains)
* [`PyUnicode_Count()`](unicode.md#c.PyUnicode_Count)
* [`PyUnicode_Decode()`](unicode.md#c.PyUnicode_Decode)
* [`PyUnicode_DecodeASCII()`](unicode.md#c.PyUnicode_DecodeASCII)
* [`PyUnicode_DecodeCharmap()`](unicode.md#c.PyUnicode_DecodeCharmap)
* [`PyUnicode_DecodeCodePageStateful()`](unicode.md#c.PyUnicode_DecodeCodePageStateful)
* [`PyUnicode_DecodeFSDefault()`](unicode.md#c.PyUnicode_DecodeFSDefault)
* [`PyUnicode_DecodeFSDefaultAndSize()`](unicode.md#c.PyUnicode_DecodeFSDefaultAndSize)
* [`PyUnicode_DecodeLatin1()`](unicode.md#c.PyUnicode_DecodeLatin1)
* [`PyUnicode_DecodeLocale()`](unicode.md#c.PyUnicode_DecodeLocale)
* [`PyUnicode_DecodeLocaleAndSize()`](unicode.md#c.PyUnicode_DecodeLocaleAndSize)
* [`PyUnicode_DecodeMBCS()`](unicode.md#c.PyUnicode_DecodeMBCS)
* [`PyUnicode_DecodeMBCSStateful()`](unicode.md#c.PyUnicode_DecodeMBCSStateful)
* [`PyUnicode_DecodeRawUnicodeEscape()`](unicode.md#c.PyUnicode_DecodeRawUnicodeEscape)
* [`PyUnicode_DecodeUTF16()`](unicode.md#c.PyUnicode_DecodeUTF16)
* [`PyUnicode_DecodeUTF16Stateful()`](unicode.md#c.PyUnicode_DecodeUTF16Stateful)
* [`PyUnicode_DecodeUTF32()`](unicode.md#c.PyUnicode_DecodeUTF32)
* [`PyUnicode_DecodeUTF32Stateful()`](unicode.md#c.PyUnicode_DecodeUTF32Stateful)
* [`PyUnicode_DecodeUTF7()`](unicode.md#c.PyUnicode_DecodeUTF7)
* [`PyUnicode_DecodeUTF7Stateful()`](unicode.md#c.PyUnicode_DecodeUTF7Stateful)
* [`PyUnicode_DecodeUTF8()`](unicode.md#c.PyUnicode_DecodeUTF8)
* [`PyUnicode_DecodeUTF8Stateful()`](unicode.md#c.PyUnicode_DecodeUTF8Stateful)
* [`PyUnicode_DecodeUnicodeEscape()`](unicode.md#c.PyUnicode_DecodeUnicodeEscape)
* [`PyUnicode_EncodeCodePage()`](unicode.md#c.PyUnicode_EncodeCodePage)
* [`PyUnicode_EncodeFSDefault()`](unicode.md#c.PyUnicode_EncodeFSDefault)
* [`PyUnicode_EncodeLocale()`](unicode.md#c.PyUnicode_EncodeLocale)
* [`PyUnicode_Equal()`](unicode.md#c.PyUnicode_Equal)
* [`PyUnicode_EqualToUTF8()`](unicode.md#c.PyUnicode_EqualToUTF8)
* [`PyUnicode_EqualToUTF8AndSize()`](unicode.md#c.PyUnicode_EqualToUTF8AndSize)
* [`PyUnicode_FSConverter()`](unicode.md#c.PyUnicode_FSConverter)
* [`PyUnicode_FSDecoder()`](unicode.md#c.PyUnicode_FSDecoder)
* [`PyUnicode_Find()`](unicode.md#c.PyUnicode_Find)
* [`PyUnicode_FindChar()`](unicode.md#c.PyUnicode_FindChar)
* [`PyUnicode_Format()`](unicode.md#c.PyUnicode_Format)
* [`PyUnicode_FromEncodedObject()`](unicode.md#c.PyUnicode_FromEncodedObject)
* [`PyUnicode_FromFormat()`](unicode.md#c.PyUnicode_FromFormat)
* [`PyUnicode_FromFormatV()`](unicode.md#c.PyUnicode_FromFormatV)
* [`PyUnicode_FromObject()`](unicode.md#c.PyUnicode_FromObject)
* [`PyUnicode_FromOrdinal()`](unicode.md#c.PyUnicode_FromOrdinal)
* [`PyUnicode_FromString()`](unicode.md#c.PyUnicode_FromString)
* [`PyUnicode_FromStringAndSize()`](unicode.md#c.PyUnicode_FromStringAndSize)
* [`PyUnicode_FromWideChar()`](unicode.md#c.PyUnicode_FromWideChar)
* [`PyUnicode_GetDefaultEncoding()`](unicode.md#c.PyUnicode_GetDefaultEncoding)
* [`PyUnicode_GetLength()`](unicode.md#c.PyUnicode_GetLength)
* [`PyUnicode_InternFromString()`](unicode.md#c.PyUnicode_InternFromString)
* [`PyUnicode_InternInPlace()`](unicode.md#c.PyUnicode_InternInPlace)
* [`PyUnicode_IsIdentifier()`](unicode.md#c.PyUnicode_IsIdentifier)
* [`PyUnicode_Join()`](unicode.md#c.PyUnicode_Join)
* [`PyUnicode_Partition()`](unicode.md#c.PyUnicode_Partition)
* [`PyUnicode_RPartition()`](unicode.md#c.PyUnicode_RPartition)
* [`PyUnicode_RSplit()`](unicode.md#c.PyUnicode_RSplit)
* [`PyUnicode_ReadChar()`](unicode.md#c.PyUnicode_ReadChar)
* [`PyUnicode_Replace()`](unicode.md#c.PyUnicode_Replace)
* [`PyUnicode_Resize()`](unicode.md#c.PyUnicode_Resize)
* [`PyUnicode_RichCompare()`](unicode.md#c.PyUnicode_RichCompare)
* [`PyUnicode_Split()`](unicode.md#c.PyUnicode_Split)
* [`PyUnicode_Splitlines()`](unicode.md#c.PyUnicode_Splitlines)
* [`PyUnicode_Substring()`](unicode.md#c.PyUnicode_Substring)
* [`PyUnicode_Tailmatch()`](unicode.md#c.PyUnicode_Tailmatch)
* [`PyUnicode_Translate()`](unicode.md#c.PyUnicode_Translate)
* [`PyUnicode_Type`](unicode.md#c.PyUnicode_Type)
* [`PyUnicode_WriteChar()`](unicode.md#c.PyUnicode_WriteChar)
* [`PyVarObject`](structures.md#c.PyVarObject)
* [`PyVarObject.ob_base`](structures.md#c.PyVarObject.ob_base)
* [`PyVarObject.ob_size`](structures.md#c.PyVarObject.ob_size)
* [`PyVectorcall_Call()`](call.md#c.PyVectorcall_Call)
* [`PyVectorcall_NARGS()`](call.md#c.PyVectorcall_NARGS)
* `PyWeakReference`
* [`PyWeakref_GetRef()`](weakref.md#c.PyWeakref_GetRef)
* [`PyWeakref_NewProxy()`](weakref.md#c.PyWeakref_NewProxy)
* [`PyWeakref_NewRef()`](weakref.md#c.PyWeakref_NewRef)
* [`PyWrapperDescr_Type`](descriptor.md#c.PyWrapperDescr_Type)
* [`PyWrapper_New()`](descriptor.md#c.PyWrapper_New)
* [`PyZip_Type`](iterator.md#c.PyZip_Type)
* [`Py_ASNATIVEBYTES_ALLOW_INDEX`](long.md#c.Py_ASNATIVEBYTES_ALLOW_INDEX)
* [`Py_ASNATIVEBYTES_BIG_ENDIAN`](long.md#c.Py_ASNATIVEBYTES_BIG_ENDIAN)
* [`Py_ASNATIVEBYTES_DEFAULTS`](long.md#c.Py_ASNATIVEBYTES_DEFAULTS)
* [`Py_ASNATIVEBYTES_LITTLE_ENDIAN`](long.md#c.Py_ASNATIVEBYTES_LITTLE_ENDIAN)
* [`Py_ASNATIVEBYTES_NATIVE_ENDIAN`](long.md#c.Py_ASNATIVEBYTES_NATIVE_ENDIAN)
* [`Py_ASNATIVEBYTES_REJECT_NEGATIVE`](long.md#c.Py_ASNATIVEBYTES_REJECT_NEGATIVE)
* [`Py_ASNATIVEBYTES_UNSIGNED_BUFFER`](long.md#c.Py_ASNATIVEBYTES_UNSIGNED_BUFFER)
* [`Py_AUDIT_READ`](structures.md#c.Py_AUDIT_READ)
* [`Py_AddPendingCall()`](threads.md#c.Py_AddPendingCall)
* [`Py_AtExit()`](sys.md#c.Py_AtExit)
* [`Py_BEGIN_ALLOW_THREADS`](threads.md#c.Py_BEGIN_ALLOW_THREADS)
* [`Py_BLOCK_THREADS`](threads.md#c.Py_BLOCK_THREADS)
* [`Py_BuildValue()`](arg.md#c.Py_BuildValue)
* [`Py_BytesMain()`](interp-lifecycle.md#c.Py_BytesMain)
* [`Py_CompileString()`](veryhigh.md#c.Py_CompileString)
* [`Py_DecRef()`](refcounting.md#c.Py_DecRef)
* [`Py_DecodeLocale()`](sys.md#c.Py_DecodeLocale)
* [`Py_END_ALLOW_THREADS`](threads.md#c.Py_END_ALLOW_THREADS)
* [`Py_EncodeLocale()`](sys.md#c.Py_EncodeLocale)
* [`Py_EndInterpreter()`](subinterpreters.md#c.Py_EndInterpreter)
* [`Py_EnterRecursiveCall()`](exceptions.md#c.Py_EnterRecursiveCall)
* [`Py_Exit()`](sys.md#c.Py_Exit)
* [`Py_FatalError()`](sys.md#c.Py_FatalError)
* `Py_FileSystemDefaultEncodeErrors`
* `Py_FileSystemDefaultEncoding`
* [`Py_Finalize()`](interp-lifecycle.md#c.Py_Finalize)
* [`Py_FinalizeEx()`](interp-lifecycle.md#c.Py_FinalizeEx)
* [`Py_GenericAlias()`](typehints.md#c.Py_GenericAlias)
* [`Py_GenericAliasType`](typehints.md#c.Py_GenericAliasType)
* [`Py_GetBuildInfo()`](interp-lifecycle.md#c.Py_GetBuildInfo)
* [`Py_GetCompiler()`](interp-lifecycle.md#c.Py_GetCompiler)
* [`Py_GetConstant()`](object.md#c.Py_GetConstant)
* [`Py_GetConstantBorrowed()`](object.md#c.Py_GetConstantBorrowed)
* [`Py_GetCopyright()`](interp-lifecycle.md#c.Py_GetCopyright)
* [`Py_GetPlatform()`](interp-lifecycle.md#c.Py_GetPlatform)
* [`Py_GetRecursionLimit()`](exceptions.md#c.Py_GetRecursionLimit)
* [`Py_GetVersion()`](interp-lifecycle.md#c.Py_GetVersion)
* `Py_HasFileSystemDefaultEncoding`
* [`Py_IS_TYPE()`](structures.md#c.Py_IS_TYPE)
* [`Py_IncRef()`](refcounting.md#c.Py_IncRef)
* [`Py_Initialize()`](interp-lifecycle.md#c.Py_Initialize)
* [`Py_InitializeEx()`](interp-lifecycle.md#c.Py_InitializeEx)
* [`Py_Is()`](structures.md#c.Py_Is)
* [`Py_IsFalse()`](structures.md#c.Py_IsFalse)
* [`Py_IsFinalizing()`](interp-lifecycle.md#c.Py_IsFinalizing)
* [`Py_IsInitialized()`](interp-lifecycle.md#c.Py_IsInitialized)
* [`Py_IsNone()`](structures.md#c.Py_IsNone)
* [`Py_IsTrue()`](structures.md#c.Py_IsTrue)
* [`Py_LeaveRecursiveCall()`](exceptions.md#c.Py_LeaveRecursiveCall)
* [`Py_Main()`](interp-lifecycle.md#c.Py_Main)
* [`Py_MakePendingCalls()`](threads.md#c.Py_MakePendingCalls)
* [`Py_NewInterpreter()`](subinterpreters.md#c.Py_NewInterpreter)
* [`Py_NewRef()`](refcounting.md#c.Py_NewRef)
* [`Py_PACK_FULL_VERSION()`](apiabiversion.md#c.Py_PACK_FULL_VERSION)
* [`Py_PACK_VERSION()`](apiabiversion.md#c.Py_PACK_VERSION)
* [`Py_READONLY`](structures.md#c.Py_READONLY)
* [`Py_REFCNT()`](refcounting.md#c.Py_REFCNT)
* [`Py_RELATIVE_OFFSET`](structures.md#c.Py_RELATIVE_OFFSET)
* [`Py_ReprEnter()`](exceptions.md#c.Py_ReprEnter)
* [`Py_ReprLeave()`](exceptions.md#c.Py_ReprLeave)
* [`Py_SET_SIZE()`](structures.md#c.Py_SET_SIZE)
* [`Py_SIZE()`](structures.md#c.Py_SIZE)
* [`Py_SetProgramName()`](interp-lifecycle.md#c.Py_SetProgramName)
* [`Py_SetPythonHome()`](interp-lifecycle.md#c.Py_SetPythonHome)
* [`Py_SetRecursionLimit()`](exceptions.md#c.Py_SetRecursionLimit)
* [`Py_TPFLAGS_BASETYPE`](typeobj.md#c.Py_TPFLAGS_BASETYPE)
* [`Py_TPFLAGS_DEFAULT`](typeobj.md#c.Py_TPFLAGS_DEFAULT)
* [`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC)
* [`Py_TPFLAGS_HAVE_VECTORCALL`](typeobj.md#c.Py_TPFLAGS_HAVE_VECTORCALL)
* [`Py_TPFLAGS_ITEMS_AT_END`](typeobj.md#c.Py_TPFLAGS_ITEMS_AT_END)
* [`Py_TPFLAGS_METHOD_DESCRIPTOR`](typeobj.md#c.Py_TPFLAGS_METHOD_DESCRIPTOR)
* [`Py_TP_USE_SPEC`](type.md#c.Py_TP_USE_SPEC)
* [`Py_TYPE()`](structures.md#c.Py_TYPE)
* [`Py_T_BOOL`](structures.md#c.Py_T_BOOL)
* [`Py_T_BYTE`](structures.md#c.Py_T_BYTE)
* [`Py_T_CHAR`](structures.md#c.Py_T_CHAR)
* [`Py_T_DOUBLE`](structures.md#c.Py_T_DOUBLE)
* [`Py_T_FLOAT`](structures.md#c.Py_T_FLOAT)
* [`Py_T_INT`](structures.md#c.Py_T_INT)
* [`Py_T_LONG`](structures.md#c.Py_T_LONG)
* [`Py_T_LONGLONG`](structures.md#c.Py_T_LONGLONG)
* [`Py_T_OBJECT_EX`](structures.md#c.Py_T_OBJECT_EX)
* [`Py_T_PYSSIZET`](structures.md#c.Py_T_PYSSIZET)
* [`Py_T_SHORT`](structures.md#c.Py_T_SHORT)
* [`Py_T_STRING`](structures.md#c.Py_T_STRING)
* [`Py_T_STRING_INPLACE`](structures.md#c.Py_T_STRING_INPLACE)
* [`Py_T_UBYTE`](structures.md#c.Py_T_UBYTE)
* [`Py_T_UINT`](structures.md#c.Py_T_UINT)
* [`Py_T_ULONG`](structures.md#c.Py_T_ULONG)
* [`Py_T_ULONGLONG`](structures.md#c.Py_T_ULONGLONG)
* [`Py_T_USHORT`](structures.md#c.Py_T_USHORT)
* [`Py_UCS4`](unicode.md#c.Py_UCS4)
* [`Py_UNBLOCK_THREADS`](threads.md#c.Py_UNBLOCK_THREADS)
* `Py_UTF8Mode`
* [`Py_VaBuildValue()`](arg.md#c.Py_VaBuildValue)
* [`Py_Version`](apiabiversion.md#c.Py_Version)
* [`Py_XNewRef()`](refcounting.md#c.Py_XNewRef)
* [`Py_am_aiter`](typeobj.md#c.Py_am_aiter)
* [`Py_am_anext`](typeobj.md#c.Py_am_anext)
* [`Py_am_await`](typeobj.md#c.Py_am_await)
* [`Py_am_send`](typeobj.md#c.Py_am_send)
* [`Py_bf_getbuffer`](typeobj.md#c.Py_bf_getbuffer)
* [`Py_bf_releasebuffer`](typeobj.md#c.Py_bf_releasebuffer)
* [`Py_buffer`](buffer.md#c.Py_buffer)
* `Py_intptr_t`
* [`Py_mod_abi`](module.md#c.Py_mod_abi)
* [`Py_mod_create`](module.md#c.Py_mod_create)
* [`Py_mod_doc`](module.md#c.Py_mod_doc)
* [`Py_mod_exec`](module.md#c.Py_mod_exec)
* [`Py_mod_gil`](module.md#c.Py_mod_gil)
* [`Py_mod_methods`](module.md#c.Py_mod_methods)
* [`Py_mod_multiple_interpreters`](module.md#c.Py_mod_multiple_interpreters)
* [`Py_mod_name`](module.md#c.Py_mod_name)
* [`Py_mod_state_clear`](module.md#c.Py_mod_state_clear)
* [`Py_mod_state_free`](module.md#c.Py_mod_state_free)
* [`Py_mod_state_size`](module.md#c.Py_mod_state_size)
* [`Py_mod_state_traverse`](module.md#c.Py_mod_state_traverse)
* [`Py_mod_token`](module.md#c.Py_mod_token)
* [`Py_mp_ass_subscript`](typeobj.md#c.Py_mp_ass_subscript)
* [`Py_mp_length`](typeobj.md#c.Py_mp_length)
* [`Py_mp_subscript`](typeobj.md#c.Py_mp_subscript)
* [`Py_nb_absolute`](typeobj.md#c.Py_nb_absolute)
* [`Py_nb_add`](typeobj.md#c.Py_nb_add)
* [`Py_nb_and`](typeobj.md#c.Py_nb_and)
* [`Py_nb_bool`](typeobj.md#c.Py_nb_bool)
* [`Py_nb_divmod`](typeobj.md#c.Py_nb_divmod)
* [`Py_nb_float`](typeobj.md#c.Py_nb_float)
* [`Py_nb_floor_divide`](typeobj.md#c.Py_nb_floor_divide)
* [`Py_nb_index`](typeobj.md#c.Py_nb_index)
* [`Py_nb_inplace_add`](typeobj.md#c.Py_nb_inplace_add)
* [`Py_nb_inplace_and`](typeobj.md#c.Py_nb_inplace_and)
* [`Py_nb_inplace_floor_divide`](typeobj.md#c.Py_nb_inplace_floor_divide)
* [`Py_nb_inplace_lshift`](typeobj.md#c.Py_nb_inplace_lshift)
* [`Py_nb_inplace_matrix_multiply`](typeobj.md#c.Py_nb_inplace_matrix_multiply)
* [`Py_nb_inplace_multiply`](typeobj.md#c.Py_nb_inplace_multiply)
* [`Py_nb_inplace_or`](typeobj.md#c.Py_nb_inplace_or)
* [`Py_nb_inplace_power`](typeobj.md#c.Py_nb_inplace_power)
* [`Py_nb_inplace_remainder`](typeobj.md#c.Py_nb_inplace_remainder)
* [`Py_nb_inplace_rshift`](typeobj.md#c.Py_nb_inplace_rshift)
* [`Py_nb_inplace_subtract`](typeobj.md#c.Py_nb_inplace_subtract)
* [`Py_nb_inplace_true_divide`](typeobj.md#c.Py_nb_inplace_true_divide)
* [`Py_nb_inplace_xor`](typeobj.md#c.Py_nb_inplace_xor)
* [`Py_nb_int`](typeobj.md#c.Py_nb_int)
* [`Py_nb_invert`](typeobj.md#c.Py_nb_invert)
* [`Py_nb_lshift`](typeobj.md#c.Py_nb_lshift)
* [`Py_nb_matrix_multiply`](typeobj.md#c.Py_nb_matrix_multiply)
* [`Py_nb_multiply`](typeobj.md#c.Py_nb_multiply)
* [`Py_nb_negative`](typeobj.md#c.Py_nb_negative)
* [`Py_nb_or`](typeobj.md#c.Py_nb_or)
* [`Py_nb_positive`](typeobj.md#c.Py_nb_positive)
* [`Py_nb_power`](typeobj.md#c.Py_nb_power)
* [`Py_nb_remainder`](typeobj.md#c.Py_nb_remainder)
* [`Py_nb_rshift`](typeobj.md#c.Py_nb_rshift)
* [`Py_nb_subtract`](typeobj.md#c.Py_nb_subtract)
* [`Py_nb_true_divide`](typeobj.md#c.Py_nb_true_divide)
* [`Py_nb_xor`](typeobj.md#c.Py_nb_xor)
* [`Py_sq_ass_item`](typeobj.md#c.Py_sq_ass_item)
* [`Py_sq_concat`](typeobj.md#c.Py_sq_concat)
* [`Py_sq_contains`](typeobj.md#c.Py_sq_contains)
* [`Py_sq_inplace_concat`](typeobj.md#c.Py_sq_inplace_concat)
* [`Py_sq_inplace_repeat`](typeobj.md#c.Py_sq_inplace_repeat)
* [`Py_sq_item`](typeobj.md#c.Py_sq_item)
* [`Py_sq_length`](typeobj.md#c.Py_sq_length)
* [`Py_sq_repeat`](typeobj.md#c.Py_sq_repeat)
* [`Py_ssize_t`](intro.md#c.Py_ssize_t)
* [`Py_tp_alloc`](typeobj.md#c.Py_tp_alloc)
* [`Py_tp_base`](typeobj.md#c.Py_tp_base)
* [`Py_tp_bases`](typeobj.md#c.Py_tp_bases)
* [`Py_tp_call`](typeobj.md#c.Py_tp_call)
* [`Py_tp_clear`](typeobj.md#c.Py_tp_clear)
* [`Py_tp_dealloc`](typeobj.md#c.Py_tp_dealloc)
* [`Py_tp_del`](typeobj.md#c.Py_tp_del)
* [`Py_tp_descr_get`](typeobj.md#c.Py_tp_descr_get)
* [`Py_tp_descr_set`](typeobj.md#c.Py_tp_descr_set)
* [`Py_tp_doc`](typeobj.md#c.Py_tp_doc)
* [`Py_tp_finalize`](typeobj.md#c.Py_tp_finalize)
* [`Py_tp_free`](typeobj.md#c.Py_tp_free)
* [`Py_tp_getattr`](typeobj.md#c.Py_tp_getattr)
* [`Py_tp_getattro`](typeobj.md#c.Py_tp_getattro)
* [`Py_tp_getset`](typeobj.md#c.Py_tp_getset)
* [`Py_tp_hash`](typeobj.md#c.Py_tp_hash)
* [`Py_tp_init`](typeobj.md#c.Py_tp_init)
* [`Py_tp_is_gc`](typeobj.md#c.Py_tp_is_gc)
* [`Py_tp_iter`](typeobj.md#c.Py_tp_iter)
* [`Py_tp_iternext`](typeobj.md#c.Py_tp_iternext)
* [`Py_tp_members`](typeobj.md#c.Py_tp_members)
* [`Py_tp_methods`](typeobj.md#c.Py_tp_methods)
* [`Py_tp_new`](typeobj.md#c.Py_tp_new)
* [`Py_tp_repr`](typeobj.md#c.Py_tp_repr)
* [`Py_tp_richcompare`](typeobj.md#c.Py_tp_richcompare)
* [`Py_tp_setattr`](typeobj.md#c.Py_tp_setattr)
* [`Py_tp_setattro`](typeobj.md#c.Py_tp_setattro)
* [`Py_tp_str`](typeobj.md#c.Py_tp_str)
* [`Py_tp_token`](type.md#c.Py_tp_token)
* [`Py_tp_traverse`](typeobj.md#c.Py_tp_traverse)
* [`Py_tp_vectorcall`](typeobj.md#c.Py_tp_vectorcall)
* `Py_uintptr_t`
* [`allocfunc`](typeobj.md#c.allocfunc)
* [`binaryfunc`](typeobj.md#c.binaryfunc)
* [`descrgetfunc`](typeobj.md#c.descrgetfunc)
* [`descrsetfunc`](typeobj.md#c.descrsetfunc)
* [`destructor`](typeobj.md#c.destructor)
* [`getattrfunc`](typeobj.md#c.getattrfunc)
* [`getattrofunc`](typeobj.md#c.getattrofunc)
* [`getbufferproc`](typeobj.md#c.getbufferproc)
* [`getiterfunc`](typeobj.md#c.getiterfunc)
* [`getter`](structures.md#c.getter)
* [`hashfunc`](typeobj.md#c.hashfunc)
* [`initproc`](typeobj.md#c.initproc)
* [`inquiry`](gcsupport.md#c.inquiry)
* [`iternextfunc`](typeobj.md#c.iternextfunc)
* [`lenfunc`](typeobj.md#c.lenfunc)
* [`newfunc`](typeobj.md#c.newfunc)
* [`objobjargproc`](typeobj.md#c.objobjargproc)
* [`objobjproc`](typeobj.md#c.objobjproc)
* [`releasebufferproc`](typeobj.md#c.releasebufferproc)
* [`reprfunc`](typeobj.md#c.reprfunc)
* [`richcmpfunc`](typeobj.md#c.richcmpfunc)
* [`setattrfunc`](typeobj.md#c.setattrfunc)
* [`setattrofunc`](typeobj.md#c.setattrofunc)
* [`setter`](structures.md#c.setter)
* [`ssizeargfunc`](typeobj.md#c.ssizeargfunc)
* [`ssizeobjargproc`](typeobj.md#c.ssizeobjargproc)
* `ssizessizeargfunc`
* `ssizessizeobjargproc`
* `symtable`
* [`ternaryfunc`](typeobj.md#c.ternaryfunc)
* [`traverseproc`](gcsupport.md#c.traverseproc)
* [`unaryfunc`](typeobj.md#c.unaryfunc)
* [`vectorcallfunc`](call.md#c.vectorcallfunc)
* [`visitproc`](gcsupport.md#c.visitproc)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

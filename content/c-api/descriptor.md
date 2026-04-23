<a id="descriptor-objects"></a>

# Descriptor Objects

“Descriptors” are objects that describe some attribute of an object. They are
found in the dictionary of type objects.

### [PyObject](structures.md#c.PyObject) \*PyDescr_NewGetSet([PyTypeObject](type.md#c.PyTypeObject) \*type, struct [PyGetSetDef](structures.md#c.PyGetSetDef) \*getset)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a new get-set descriptor for extension type *type* from the
[`PyGetSetDef`](structures.md#c.PyGetSetDef) structure *getset*.

Get-set descriptors expose attributes implemented by C getter and setter
functions rather than stored directly in the instance. This is the same kind
of descriptor created for entries in [`tp_getset`](typeobj.md#c.PyTypeObject.tp_getset), and
it appears in Python as a [`types.GetSetDescriptorType`](../library/types.md#types.GetSetDescriptorType) object.

On success, return a [strong reference](../glossary.md#term-strong-reference) to the descriptor. Return
`NULL` with an exception set on failure.

### [PyObject](structures.md#c.PyObject) \*PyDescr_NewMember([PyTypeObject](type.md#c.PyTypeObject) \*type, struct [PyMemberDef](structures.md#c.PyMemberDef) \*member)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a new member descriptor for extension type *type* from the
[`PyMemberDef`](structures.md#c.PyMemberDef) structure *member*.

Member descriptors expose fields in the type’s C struct as Python
attributes. This is the same kind of descriptor created for entries in
[`tp_members`](typeobj.md#c.PyTypeObject.tp_members), and it appears in Python as a
[`types.MemberDescriptorType`](../library/types.md#types.MemberDescriptorType) object.

On success, return a [strong reference](../glossary.md#term-strong-reference) to the descriptor. Return
`NULL` with an exception set on failure.

### [PyTypeObject](type.md#c.PyTypeObject) PyMemberDescr_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object for member descriptor objects created from
[`PyMemberDef`](structures.md#c.PyMemberDef) structures. These descriptors expose fields of a
C struct as attributes on a type, and correspond
to [`types.MemberDescriptorType`](../library/types.md#types.MemberDescriptorType) objects in Python.

### [PyTypeObject](type.md#c.PyTypeObject) PyGetSetDescr_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object for get/set descriptor objects created from
[`PyGetSetDef`](structures.md#c.PyGetSetDef) structures. These descriptors implement attributes
whose value is computed by C getter and setter functions, and are used
for many built-in type attributes. They correspond to
[`types.GetSetDescriptorType`](../library/types.md#types.GetSetDescriptorType) objects in Python.

### [PyObject](structures.md#c.PyObject) \*PyDescr_NewMethod([PyTypeObject](type.md#c.PyTypeObject) \*type, struct [PyMethodDef](structures.md#c.PyMethodDef) \*meth)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a new method descriptor for extension type *type* from the
[`PyMethodDef`](structures.md#c.PyMethodDef) structure *meth*.

Method descriptors expose C functions as methods on a type. This is the same
kind of descriptor created for entries in
[`tp_methods`](typeobj.md#c.PyTypeObject.tp_methods), and it appears in Python as a
[`types.MethodDescriptorType`](../library/types.md#types.MethodDescriptorType) object.

On success, return a [strong reference](../glossary.md#term-strong-reference) to the descriptor. Return
`NULL` with an exception set on failure.

### [PyTypeObject](type.md#c.PyTypeObject) PyMethodDescr_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object for method descriptor objects created from
[`PyMethodDef`](structures.md#c.PyMethodDef) structures. These descriptors expose C functions as
methods on a type, and correspond to [`types.MethodDescriptorType`](../library/types.md#types.MethodDescriptorType)
objects in Python.

### struct wrapperbase

Describes a slot wrapper used by [`PyDescr_NewWrapper()`](#c.PyDescr_NewWrapper).

Each `wrapperbase` record stores the Python-visible name and metadata for a
special method implemented by a type slot, together with the wrapper
function used to adapt that slot to Python’s calling convention.

### [PyObject](structures.md#c.PyObject) \*PyDescr_NewWrapper([PyTypeObject](type.md#c.PyTypeObject) \*type, struct [wrapperbase](#c.wrapperbase) \*base, void \*wrapped)

*Return value: New reference.*

Create a new wrapper descriptor for extension type *type* from the
[`wrapperbase`](#c.wrapperbase) structure *base* and the wrapped slot function
pointer
*wrapped*.

Wrapper descriptors expose special methods implemented by type slots. This
is the same kind of descriptor that CPython creates for slot-based special
methods such as `__repr__` or `__add__`, and it appears in Python as a
[`types.WrapperDescriptorType`](../library/types.md#types.WrapperDescriptorType) object.

On success, return a [strong reference](../glossary.md#term-strong-reference) to the descriptor. Return
`NULL` with an exception set on failure.

### [PyTypeObject](type.md#c.PyTypeObject) PyWrapperDescr_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object for wrapper descriptor objects created by
[`PyDescr_NewWrapper()`](#c.PyDescr_NewWrapper) and [`PyWrapper_New()`](#c.PyWrapper_New). Wrapper
descriptors are used internally to expose special methods implemented
via wrapper structures, and appear in Python as
[`types.WrapperDescriptorType`](../library/types.md#types.WrapperDescriptorType) objects.

### [PyObject](structures.md#c.PyObject) \*PyDescr_NewClassMethod([PyTypeObject](type.md#c.PyTypeObject) \*type, [PyMethodDef](structures.md#c.PyMethodDef) \*method)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a new class method descriptor for extension type *type* from the
[`PyMethodDef`](structures.md#c.PyMethodDef) structure *method*.

Class method descriptors expose C methods that receive the class rather than
an instance when accessed. This is the same kind of descriptor created for
`METH_CLASS` entries in [`tp_methods`](typeobj.md#c.PyTypeObject.tp_methods), and it
appears in Python as a [`types.ClassMethodDescriptorType`](../library/types.md#types.ClassMethodDescriptorType) object.

On success, return a [strong reference](../glossary.md#term-strong-reference) to the descriptor. Return
`NULL` with an exception set on failure.

### int PyDescr_IsData([PyObject](structures.md#c.PyObject) \*descr)

Return non-zero if the descriptor object *descr* describes a data attribute, or
`0` if it describes a method.  *descr* must be a descriptor object; there is
no error checking.

### [PyObject](structures.md#c.PyObject) \*PyWrapper_New([PyObject](structures.md#c.PyObject) \*d, [PyObject](structures.md#c.PyObject) \*self)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a new bound wrapper object from the wrapper descriptor *d* and the
instance *self*.

This is the bound form of a wrapper descriptor created by
[`PyDescr_NewWrapper()`](#c.PyDescr_NewWrapper). CPython creates these objects when a slot
wrapper is accessed through an instance, and they appear in Python as
[`types.MethodWrapperType`](../library/types.md#types.MethodWrapperType) objects.

On success, return a [strong reference](../glossary.md#term-strong-reference) to the wrapper object. Return
`NULL` with an exception set on failure.

### PyDescr_COMMON

This is a macro including the common fields for a
descriptor object.

This was included in Python’s C API by mistake; do not use it in extensions.
For creating custom descriptor objects, create a class implementing the
descriptor protocol ([`tp_descr_get`](typeobj.md#c.PyTypeObject.tp_descr_get) and
[`tp_descr_set`](typeobj.md#c.PyTypeObject.tp_descr_set)).

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.15.

## Built-in descriptors

### [PyTypeObject](type.md#c.PyTypeObject) PyProperty_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object for property objects. This is the same object as
[`property`](../library/functions.md#property) in the Python layer.

### [PyTypeObject](type.md#c.PyTypeObject) PySuper_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object for super objects. This is the same object as
[`super`](../library/functions.md#super) in the Python layer.

### [PyTypeObject](type.md#c.PyTypeObject) PyClassMethod_Type

The type of class method objects. This is the same object as
[`classmethod`](../library/functions.md#classmethod) in the Python layer.

### [PyTypeObject](type.md#c.PyTypeObject) PyClassMethodDescr_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object for C-level class method descriptor objects.
This is the type of the descriptors created for [`classmethod()`](../library/functions.md#classmethod) defined
in C extension types, and corresponds to
[`types.ClassMethodDescriptorType`](../library/types.md#types.ClassMethodDescriptorType) objects in Python.

### [PyObject](structures.md#c.PyObject) \*PyClassMethod_New([PyObject](structures.md#c.PyObject) \*callable)

Create a new [`classmethod`](../library/functions.md#classmethod) object wrapping *callable*.
*callable* must be a callable object and must not be `NULL`.

On success, this function returns a [strong reference](../glossary.md#term-strong-reference) to a new class
method descriptor. On failure, this function returns `NULL` with an
exception set.

### [PyTypeObject](type.md#c.PyTypeObject) PyStaticMethod_Type

The type of static method objects. This is the same object as
[`staticmethod`](../library/functions.md#staticmethod) in the Python layer.

### [PyObject](structures.md#c.PyObject) \*PyStaticMethod_New([PyObject](structures.md#c.PyObject) \*callable)

Create a new [`staticmethod`](../library/functions.md#staticmethod) object wrapping *callable*.
*callable* must be a callable object and must not be `NULL`.

On success, this function returns a [strong reference](../glossary.md#term-strong-reference) to a new static
method descriptor. On failure, this function returns `NULL` with an
exception set.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

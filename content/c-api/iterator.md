<a id="iterator-objects"></a>

# Iterator Objects

Python provides two general-purpose iterator objects.  The first, a sequence
iterator, works with an arbitrary sequence supporting the [`__getitem__()`](../reference/datamodel.md#object.__getitem__)
method.  The second works with a callable object and a sentinel value, calling
the callable for each item in the sequence, and ending the iteration when the
sentinel value is returned.

### [PyTypeObject](type.md#c.PyTypeObject) PySeqIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

Type object for iterator objects returned by [`PySeqIter_New()`](#c.PySeqIter_New) and the
one-argument form of the [`iter()`](../library/functions.md#iter) built-in function for built-in sequence
types.

### int PySeqIter_Check([PyObject](structures.md#c.PyObject) \*op)

Return true if the type of *op* is [`PySeqIter_Type`](#c.PySeqIter_Type).  This function
always succeeds.

### [PyObject](structures.md#c.PyObject) \*PySeqIter_New([PyObject](structures.md#c.PyObject) \*seq)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return an iterator that works with a general sequence object, *seq*.  The
iteration ends when the sequence raises [`IndexError`](../library/exceptions.md#IndexError) for the subscripting
operation.

### [PyTypeObject](type.md#c.PyTypeObject) PyCallIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

Type object for iterator objects returned by [`PyCallIter_New()`](#c.PyCallIter_New) and the
two-argument form of the [`iter()`](../library/functions.md#iter) built-in function.

### int PyCallIter_Check([PyObject](structures.md#c.PyObject) \*op)

Return true if the type of *op* is [`PyCallIter_Type`](#c.PyCallIter_Type).  This
function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyCallIter_New([PyObject](structures.md#c.PyObject) \*callable, [PyObject](structures.md#c.PyObject) \*sentinel)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new iterator.  The first parameter, *callable*, can be any Python
callable object that can be called with no parameters; each call to it should
return the next item in the iteration.  When *callable* returns a value equal to
*sentinel*, the iteration will be terminated.

## Range Objects

### [PyTypeObject](type.md#c.PyTypeObject) PyRange_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object for [`range`](../library/stdtypes.md#range) objects.

### int PyRange_Check([PyObject](structures.md#c.PyObject) \*o)

Return true if the object *o* is an instance of a [`range`](../library/stdtypes.md#range) object.
This function always succeeds.

## Builtin Iterator Types

These are built-in iteration types that are included in Python’s C API, but
provide no additional functions. They are here for completeness.

| C type                                                                                                             | Python type                                      |
|--------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|
| ### [PyTypeObject](type.md#c.PyTypeObject) PyEnum_Type<br/><br/> *Part of the [Stable ABI](stable.md#stable).*     | [`enumerate`](../library/functions.md#enumerate) |
| ### [PyTypeObject](type.md#c.PyTypeObject) PyFilter_Type<br/><br/> *Part of the [Stable ABI](stable.md#stable).*   | [`filter`](../library/functions.md#filter)       |
| ### [PyTypeObject](type.md#c.PyTypeObject) PyMap_Type<br/><br/> *Part of the [Stable ABI](stable.md#stable).*      | [`map`](../library/functions.md#map)             |
| ### [PyTypeObject](type.md#c.PyTypeObject) PyReversed_Type<br/><br/> *Part of the [Stable ABI](stable.md#stable).* | [`reversed`](../library/functions.md#reversed)   |
| ### [PyTypeObject](type.md#c.PyTypeObject) PyZip_Type<br/><br/> *Part of the [Stable ABI](stable.md#stable).*      | [`zip`](../library/functions.md#zip)             |

## Other Iterator Objects

### [PyTypeObject](type.md#c.PyTypeObject) PyByteArrayIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyBytesIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyListIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyListRevIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PySetIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyTupleIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyRangeIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyLongRangeIter_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyDictIterKey_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyDictRevIterKey_Type

 *Part of the [Stable ABI](stable.md#stable) since version 3.8.*

### [PyTypeObject](type.md#c.PyTypeObject) PyDictIterValue_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyDictRevIterValue_Type

 *Part of the [Stable ABI](stable.md#stable) since version 3.8.*

### [PyTypeObject](type.md#c.PyTypeObject) PyDictIterItem_Type

 *Part of the [Stable ABI](stable.md#stable).*

### [PyTypeObject](type.md#c.PyTypeObject) PyDictRevIterItem_Type

 *Part of the [Stable ABI](stable.md#stable) since version 3.8.*

### [PyTypeObject](type.md#c.PyTypeObject) PyODictIter_Type

Type objects for iterators of various built-in objects.

Do not create instances of these directly; prefer calling
[`PyObject_GetIter()`](object.md#c.PyObject_GetIter) instead.

Note that there is no guarantee that a given built-in type uses a given iterator
type. For example, iterating over [`range`](../library/stdtypes.md#range) will use one of two iterator
types depending on the size of the range. Other types may start using a
similar scheme in the future, without warning.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

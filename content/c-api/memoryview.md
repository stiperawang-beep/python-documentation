<a id="memoryview-objects"></a>

<a id="index-0"></a>

# MemoryView objects

A [`memoryview`](../library/stdtypes.md#memoryview) object exposes the C level [buffer interface](buffer.md#bufferobjects) as a Python object which can then be passed around like
any other object.

### [PyTypeObject](type.md#c.PyTypeObject) PyMemoryView_Type

 *Part of the [Stable ABI](stable.md#stable).*

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python memoryview
type. This is the same object as [`memoryview`](../library/stdtypes.md#memoryview) in the Python layer.

### [PyObject](structures.md#c.PyObject) \*PyMemoryView_FromObject([PyObject](structures.md#c.PyObject) \*obj)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a memoryview object from an object that provides the buffer interface.
If *obj* supports writable buffer exports, the memoryview object will be
read/write, otherwise it may be either read-only or read/write at the
discretion of the exporter.

### PyBUF_READ

 *Part of the [Stable ABI](stable.md#stable) since version 3.11.*

Flag to request a readonly buffer.

### PyBUF_WRITE

 *Part of the [Stable ABI](stable.md#stable) since version 3.11.*

Flag to request a writable buffer.

### [PyObject](structures.md#c.PyObject) \*PyMemoryView_FromMemory(char \*mem, [Py_ssize_t](intro.md#c.Py_ssize_t) size, int flags)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Create a memoryview object using *mem* as the underlying buffer.
*flags* can be one of [`PyBUF_READ`](#c.PyBUF_READ) or [`PyBUF_WRITE`](#c.PyBUF_WRITE).

#### Versionadded
Added in version 3.3.

### [PyObject](structures.md#c.PyObject) \*PyMemoryView_FromBuffer(const [Py_buffer](buffer.md#c.Py_buffer) \*view)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.11.*

Create a memoryview object wrapping the given buffer structure *view*.
For simple byte buffers, [`PyMemoryView_FromMemory()`](#c.PyMemoryView_FromMemory) is the preferred
function.

### [PyObject](structures.md#c.PyObject) \*PyMemoryView_GetContiguous([PyObject](structures.md#c.PyObject) \*obj, int buffertype, char order)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a memoryview object to a [contiguous](../glossary.md#term-contiguous) chunk of memory (in either
‘C’ or ‘F’ortran *order*) from an object that defines the buffer
interface. If memory is contiguous, the memoryview object points to the
original memory. Otherwise, a copy is made and the memoryview points to a
new bytes object.

*buffertype* can be one of [`PyBUF_READ`](#c.PyBUF_READ) or [`PyBUF_WRITE`](#c.PyBUF_WRITE).

### int PyMemoryView_Check([PyObject](structures.md#c.PyObject) \*obj)

Return true if the object *obj* is a memoryview object.  It is not
currently allowed to create subclasses of [`memoryview`](../library/stdtypes.md#memoryview).  This
function always succeeds.

### [Py_buffer](buffer.md#c.Py_buffer) \*PyMemoryView_GET_BUFFER([PyObject](structures.md#c.PyObject) \*mview)

Return a pointer to the memoryview’s private copy of the exporter’s buffer.
*mview* **must** be a memoryview instance; this macro doesn’t check its type,
you must do it yourself or you will risk crashes.

### [PyObject](structures.md#c.PyObject) \*PyMemoryView_GET_BASE([PyObject](structures.md#c.PyObject) \*mview)

Return either a pointer to the exporting object that the memoryview is based
on or `NULL` if the memoryview has been created by one of the functions
[`PyMemoryView_FromMemory()`](#c.PyMemoryView_FromMemory) or [`PyMemoryView_FromBuffer()`](#c.PyMemoryView_FromBuffer).
*mview* **must** be a memoryview instance.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

<a id="picklebuffer-objects"></a>

<a id="index-0"></a>

# Pickle buffer objects

#### Versionadded
Added in version 3.8.

A [`pickle.PickleBuffer`](../library/pickle.md#pickle.PickleBuffer) object wraps a [buffer-providing object](buffer.md#bufferobjects) for out-of-band data transfer with the [`pickle`](../library/pickle.md#module-pickle) module.

### [PyTypeObject](type.md#c.PyTypeObject) PyPickleBuffer_Type

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python pickle buffer type.
This is the same object as [`pickle.PickleBuffer`](../library/pickle.md#pickle.PickleBuffer) in the Python layer.

### int PyPickleBuffer_Check([PyObject](structures.md#c.PyObject) \*op)

Return true if *op* is a pickle buffer instance.
This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyPickleBuffer_FromObject([PyObject](structures.md#c.PyObject) \*obj)

Create a pickle buffer from the object *obj*.

This function will fail if *obj* doesn’t support the [buffer protocol](buffer.md#bufferobjects).

On success, return a new pickle buffer instance.
On failure, set an exception and return `NULL`.

Analogous to calling [`pickle.PickleBuffer`](../library/pickle.md#pickle.PickleBuffer) with *obj* in Python.

### const [Py_buffer](buffer.md#c.Py_buffer) \*PyPickleBuffer_GetBuffer([PyObject](structures.md#c.PyObject) \*picklebuf)

Get a pointer to the underlying [`Py_buffer`](buffer.md#c.Py_buffer) that the pickle buffer wraps.

The returned pointer is valid as long as *picklebuf* is alive and has not been
released. The caller must not modify or free the returned [`Py_buffer`](buffer.md#c.Py_buffer).
If the pickle buffer has been released, raise [`ValueError`](../library/exceptions.md#ValueError).

On success, return a pointer to the buffer view.
On failure, set an exception and return `NULL`.

### int PyPickleBuffer_Release([PyObject](structures.md#c.PyObject) \*picklebuf)

Release the underlying buffer held by the pickle buffer.

Return `0` on success. On failure, set an exception and return `-1`.

Analogous to calling [`pickle.PickleBuffer.release()`](../library/pickle.md#pickle.PickleBuffer.release) in Python.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

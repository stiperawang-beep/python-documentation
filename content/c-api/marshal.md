<a id="marshalling-utils"></a>

# Data marshalling support

These routines allow C code to work with serialized objects using the same
data format as the [`marshal`](../library/marshal.md#module-marshal) module.  There are functions to write data
into the serialization format, and additional functions that can be used to
read the data back.  Files used to store marshalled data must be opened in
binary mode.

Numeric values are stored with the least significant byte first.

The module supports several versions of the data format; see
the [`Python module documentation`](../library/marshal.md#module-marshal) for details.

### Py_MARSHAL_VERSION

The current format version. See [`marshal.version`](../library/marshal.md#marshal.version).

### void PyMarshal_WriteLongToFile(long value, FILE \*file, int version)

Marshal a  integer, *value*, to *file*.  This will only write
the least-significant 32 bits of *value*; regardless of the size of the
native  type.  *version* indicates the file format.

This function can fail, in which case it sets the error indicator.
Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to check for that.

### void PyMarshal_WriteObjectToFile([PyObject](structures.md#c.PyObject) \*value, FILE \*file, int version)

Marshal a Python object, *value*, to *file*.
*version* indicates the file format.

This function can fail, in which case it sets the error indicator.
Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to check for that.

### [PyObject](structures.md#c.PyObject) \*PyMarshal_WriteObjectToString([PyObject](structures.md#c.PyObject) \*value, int version)

*Return value: New reference.*

Return a bytes object containing the marshalled representation of *value*.
*version* indicates the file format.

The following functions allow marshalled values to be read back in.

### long PyMarshal_ReadLongFromFile(FILE \*file)

Return a C  from the data stream in a  opened
for reading.  Only a 32-bit value can be read in using this function,
regardless of the native size of .

On error, sets the appropriate exception ([`EOFError`](../library/exceptions.md#EOFError)) and returns
`-1`.

### int PyMarshal_ReadShortFromFile(FILE \*file)

Return a C  from the data stream in a  opened
for reading.  Only a 16-bit value can be read in using this function,
regardless of the native size of .

On error, sets the appropriate exception ([`EOFError`](../library/exceptions.md#EOFError)) and returns
`-1`.

### [PyObject](structures.md#c.PyObject) \*PyMarshal_ReadObjectFromFile(FILE \*file)

*Return value: New reference.*

Return a Python object from the data stream in a  opened for
reading.

On error, sets the appropriate exception ([`EOFError`](../library/exceptions.md#EOFError), [`ValueError`](../library/exceptions.md#ValueError)
or [`TypeError`](../library/exceptions.md#TypeError)) and returns `NULL`.

### [PyObject](structures.md#c.PyObject) \*PyMarshal_ReadLastObjectFromFile(FILE \*file)

*Return value: New reference.*

Return a Python object from the data stream in a  opened for
reading.  Unlike [`PyMarshal_ReadObjectFromFile()`](#c.PyMarshal_ReadObjectFromFile), this function
assumes that no further objects will be read from the file, allowing it to
aggressively load file data into memory so that the de-serialization can
operate from data in memory rather than reading a byte at a time from the
file.  Only use this variant if you are certain that you won’t be reading
anything else from the file.

On error, sets the appropriate exception ([`EOFError`](../library/exceptions.md#EOFError), [`ValueError`](../library/exceptions.md#ValueError)
or [`TypeError`](../library/exceptions.md#TypeError)) and returns `NULL`.

### [PyObject](structures.md#c.PyObject) \*PyMarshal_ReadObjectFromString(const char \*data, [Py_ssize_t](intro.md#c.Py_ssize_t) len)

*Return value: New reference.*

Return a Python object from the data stream in a byte buffer
containing *len* bytes pointed to by *data*.

On error, sets the appropriate exception ([`EOFError`](../library/exceptions.md#EOFError), [`ValueError`](../library/exceptions.md#ValueError)
or [`TypeError`](../library/exceptions.md#TypeError)) and returns `NULL`.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

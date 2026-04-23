<a id="iterator"></a>

# Iterator Protocol

There are two functions specifically for working with iterators.

### int PyIter_Check([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable) since version 3.8.*

Return non-zero if the object *o* can be safely passed to
[`PyIter_NextItem()`](#c.PyIter_NextItem) and `0` otherwise.
This function always succeeds.

### int PyAIter_Check([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Return non-zero if the object *o* provides the `AsyncIterator`
protocol, and `0` otherwise.  This function always succeeds.

#### Versionadded
Added in version 3.10.

### int PyIter_NextItem([PyObject](structures.md#c.PyObject) \*iter, [PyObject](structures.md#c.PyObject) \*\*item)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Return `1` and set *item* to a [strong reference](../glossary.md#term-strong-reference) of the
next value of the iterator *iter* on success.
Return `0` and set *item* to `NULL` if there are no remaining values.
Return `-1`, set *item* to `NULL` and set an exception on error.

#### Versionadded
Added in version 3.14.

### [PyObject](structures.md#c.PyObject) \*PyIter_Next([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

This is an older version of `PyIter_NextItem()`,
which is retained for backwards compatibility.
Prefer [`PyIter_NextItem()`](#c.PyIter_NextItem).

Return the next value from the iterator *o*.  The object must be an iterator
according to [`PyIter_Check()`](#c.PyIter_Check) (it is up to the caller to check this).
If there are no remaining values, returns `NULL` with no exception set.
If an error occurs while retrieving the item, returns `NULL` and passes
along the exception.

### type PySendResult

The enum value used to represent different results of [`PyIter_Send()`](#c.PyIter_Send).

#### Versionadded
Added in version 3.10.

### [PySendResult](#c.PySendResult) PyIter_Send([PyObject](structures.md#c.PyObject) \*iter, [PyObject](structures.md#c.PyObject) \*arg, [PyObject](structures.md#c.PyObject) \*\*presult)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Sends the *arg* value into the iterator *iter*. Returns:

- `PYGEN_RETURN` if iterator returns. Return value is returned via *presult*.
- `PYGEN_NEXT` if iterator yields. Yielded value is returned via *presult*.
- `PYGEN_ERROR` if iterator has raised an exception. *presult* is set to `NULL`.

#### Versionadded
Added in version 3.10.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

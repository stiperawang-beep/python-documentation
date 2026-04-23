<a id="typehintobjects"></a>

# Objects for Type Hinting

Various built-in types for type hinting are provided.  Currently,
two types exist – [GenericAlias](../library/stdtypes.md#types-genericalias) and
[Union](../library/stdtypes.md#types-union).  Only `GenericAlias` is exposed to C.

### [PyObject](structures.md#c.PyObject) \*Py_GenericAlias([PyObject](structures.md#c.PyObject) \*origin, [PyObject](structures.md#c.PyObject) \*args)

 *Part of the [Stable ABI](stable.md#stable) since version 3.9.*

Create a [GenericAlias](../library/stdtypes.md#types-genericalias) object.
Equivalent to calling the Python class
[`types.GenericAlias`](../library/types.md#types.GenericAlias).  The *origin* and *args* arguments set the
`GenericAlias`‘s `__origin__` and `__args__` attributes respectively.
*origin* should be a , and *args* can be a
 or any `PyObject*`.  If *args* passed is
not a tuple, a 1-tuple is automatically constructed and `__args__` is set
to `(args,)`.
Minimal checking is done for the arguments, so the function will succeed even
if *origin* is not a type.
The `GenericAlias`‘s `__parameters__` attribute is constructed lazily
from `__args__`.  On failure, an exception is raised and `NULL` is
returned.

Here’s an example of how to make an extension type generic:

```c
...
static PyMethodDef my_obj_methods[] = {
    // Other methods.
    ...
    {"__class_getitem__", Py_GenericAlias, METH_O|METH_CLASS, "See PEP 585"}
    ...
}
```

#### SEE ALSO
The data model method [`__class_getitem__()`](../reference/datamodel.md#object.__class_getitem__).

#### Versionadded
Added in version 3.9.

### [PyTypeObject](type.md#c.PyTypeObject) Py_GenericAliasType

 *Part of the [Stable ABI](stable.md#stable) since version 3.9.*

The C type of the object returned by [`Py_GenericAlias()`](#c.Py_GenericAlias). Equivalent to
[`types.GenericAlias`](../library/types.md#types.GenericAlias) in Python.

#### Versionadded
Added in version 3.9.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

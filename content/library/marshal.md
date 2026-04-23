# `marshal` — Internal Python object serialization

---

This module contains functions that can read and write Python values in a binary
format.  The format is specific to Python, but independent of machine
architecture issues (e.g., you can write a Python value to a file on a PC,
transport the file to a Mac, and read it back there).  Details of the format are
undocumented on purpose; it may change between Python versions (although it
rarely does). <sup>[1](#id2)</sup>

<a id="index-0"></a>

This is not a general “persistence” module.  For general persistence and
transfer of Python objects through RPC calls, see the modules [`pickle`](pickle.md#module-pickle) and
[`shelve`](shelve.md#module-shelve).  The `marshal` module exists mainly to support reading and
writing the “pseudo-compiled” code for Python modules of `.pyc` files.
Therefore, the Python maintainers reserve the right to modify the marshal format
in backward incompatible ways should the need arise.
The format of code objects is not compatible between Python versions,
even if the version of the format is the same.
De-serializing a code object in the incorrect Python version has undefined behavior.
If you’re serializing and
de-serializing Python objects, use the [`pickle`](pickle.md#module-pickle) module instead – the
performance is comparable, version independence is guaranteed, and pickle
supports a substantially wider range of objects than marshal.

#### WARNING
The `marshal` module is not intended to be secure against erroneous or
maliciously constructed data.  Never unmarshal data received from an
untrusted or unauthenticated source.

There are functions that read/write files as well as functions operating on
bytes-like objects.

<a id="index-1"></a>

Not all Python object types are supported; in general, only objects whose value
is independent from a particular invocation of Python can be written and read by
this module.  The following types are supported:

* Numeric types: [`int`](functions.md#int), [`bool`](functions.md#bool), [`float`](functions.md#float), [`complex`](functions.md#complex).
* Strings ([`str`](stdtypes.md#str)) and [`bytes`](stdtypes.md#bytes).
  [Bytes-like objects](../glossary.md#term-bytes-like-object) like [`bytearray`](stdtypes.md#bytearray) are
  marshalled as `bytes`.
* Containers: [`tuple`](stdtypes.md#tuple), [`list`](stdtypes.md#list), [`dict`](stdtypes.md#dict), [`frozendict`](stdtypes.md#frozendict)
  (since [`version`](#marshal.version) 6), [`set`](stdtypes.md#set), [`frozenset`](stdtypes.md#frozenset), and
  [`slice`](functions.md#slice) (since [`version`](#marshal.version) 5).
  It should be understood that these are supported only if the values contained
  therein are themselves supported.
  Recursive containers are supported since [`version`](#marshal.version) 3.
* The singletons [`None`](constants.md#None), [`Ellipsis`](constants.md#Ellipsis) and [`StopIteration`](exceptions.md#StopIteration).
* [`code`](code.md#module-code) objects, if *allow_code* is true. See note above about
  version dependence.

#### Versionchanged
Changed in version 3.4: 

* Added format version 3, which supports marshalling recursive lists, sets
  and dictionaries.
* Added format version 4, which supports efficient representations
  of short strings.

#### Versionchanged
Changed in version 3.14: Added format version 5, which allows marshalling slices.

#### Versionchanged
Changed in version 3.15: Added format version 6, which allows marshalling [`frozendict`](stdtypes.md#frozendict).

The module defines these functions:

### marshal.dump(value, file, version=version, , , allow_code=True)

Write the value on the open file.  The value must be a supported type.  The
file must be a writeable [binary file](../glossary.md#term-binary-file).

If the value has (or contains an object that has) an unsupported type, a
[`ValueError`](exceptions.md#ValueError) exception is raised — but garbage data will also be written
to the file.  The object will not be properly read back by [`load()`](#marshal.load).
[Code objects](../reference/datamodel.md#code-objects) are only supported if *allow_code* is true.

The *version* argument indicates the data format that `dump` should use
(see below).

Raises an [auditing event](sys.md#auditing) `marshal.dumps` with arguments `value`, `version`.

#### Versionchanged
Changed in version 3.13: Added the *allow_code* parameter.

### marshal.load(file, , , allow_code=True)

Read one value from the open file and return it.  If no valid value is read
(e.g. because the data has a different Python version’s incompatible marshal
format), raise [`EOFError`](exceptions.md#EOFError), [`ValueError`](exceptions.md#ValueError) or [`TypeError`](exceptions.md#TypeError).
[Code objects](../reference/datamodel.md#code-objects) are only supported if *allow_code* is true.
The file must be a readable [binary file](../glossary.md#term-binary-file).

Raises an [auditing event](sys.md#auditing) `marshal.load` with no arguments.

#### NOTE
If an object containing an unsupported type was marshalled with [`dump()`](#marshal.dump),
[`load()`](#marshal.load) will substitute `None` for the unmarshallable type.

#### Versionchanged
Changed in version 3.10: This call used to raise a `code.__new__` audit event for each code object. Now
it raises a single `marshal.load` event for the entire load operation.

#### Versionchanged
Changed in version 3.13: Added the *allow_code* parameter.

### marshal.dumps(value, version=version, , , allow_code=True)

Return the bytes object that would be written to a file by `dump(value, file)`.  The
value must be a supported type.  Raise a [`ValueError`](exceptions.md#ValueError) exception if value
has (or contains an object that has) an unsupported type.
[Code objects](../reference/datamodel.md#code-objects) are only supported if *allow_code* is true.

The *version* argument indicates the data format that `dumps` should use
(see below).

Raises an [auditing event](sys.md#auditing) `marshal.dumps` with arguments `value`, `version`.

#### Versionchanged
Changed in version 3.13: Added the *allow_code* parameter.

### marshal.loads(bytes, , , allow_code=True)

Convert the [bytes-like object](../glossary.md#term-bytes-like-object) to a value.  If no valid value is found, raise
[`EOFError`](exceptions.md#EOFError), [`ValueError`](exceptions.md#ValueError) or [`TypeError`](exceptions.md#TypeError).
[Code objects](../reference/datamodel.md#code-objects) are only supported if *allow_code* is true.
Extra bytes in the input are ignored.

Raises an [auditing event](sys.md#auditing) `marshal.loads` with argument `bytes`.

#### Versionchanged
Changed in version 3.10: This call used to raise a `code.__new__` audit event for each code object. Now
it raises a single `marshal.loads` event for the entire load operation.

#### Versionchanged
Changed in version 3.13: Added the *allow_code* parameter.

In addition, the following constants are defined:

### marshal.version

Indicates the format that the module uses.
Version 0 is the historical first version; subsequent versions
add new features.
Generally, a new version becomes the default when it is introduced.

|   Version | Available since   | New features                                               |
|-----------|-------------------|------------------------------------------------------------|
|         1 | Python 2.4        | Sharing interned strings                                   |
|         2 | Python 2.5        | Binary representation of floats                            |
|         3 | Python 3.4        | Support for object instancing and recursion                |
|         4 | Python 3.4        | Efficient representation of short strings                  |
|         5 | Python 3.14       | Support for [`slice`](functions.md#slice) objects          |
|         6 | Python 3.15       | Support for [`frozendict`](stdtypes.md#frozendict) objects |

### Footnotes

* <a id='id2'>**[1]**</a> The name of this module stems from a bit of terminology used by the designers of Modula-3 (amongst others), who use the term “marshalling” for shipping of data around in a self-contained form. Strictly speaking, “to marshal” means to convert some data from internal to external form (in an RPC buffer for instance) and “unmarshalling” for the reverse process.
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

# `tomllib` — Parse TOML files

**Source code:** [Lib/tomllib](https://github.com/python/cpython/tree/main/Lib/tomllib)

---

This module provides an interface for parsing TOML 1.1.0 (Tom’s Obvious Minimal
Language, [https://toml.io](https://toml.io/en/)). This module does not
support writing TOML.

#### Versionadded
Added in version 3.11: The module was added with support for TOML 1.0.0.

#### Versionchanged
Changed in version 3.15: Added TOML 1.1.0 support.
See the [What’s New](../whatsnew/3.15.md#whatsnew315-tomllib-1-1-0) for details.

#### SEE ALSO
The [Tomli-W package](https://pypi.org/project/tomli-w/)
is a TOML writer that can be used in conjunction with this module,
providing a write API familiar to users of the standard library
[`marshal`](marshal.md#module-marshal) and [`pickle`](pickle.md#module-pickle) modules.

#### SEE ALSO
The [TOML Kit package](https://pypi.org/project/tomlkit/)
is a style-preserving TOML library with both read and write capability.
It is a recommended replacement for this module for editing already
existing TOML files.

This module defines the following functions:

### tomllib.load(fp, , , parse_float=float)

Read a TOML file. The first argument should be a readable and binary file object.
Return a [`dict`](stdtypes.md#dict). Convert TOML types to Python using this
[conversion table](#toml-to-py-table).

*parse_float* will be called with the string of every TOML
float to be decoded.  By default, this is equivalent to `float(num_str)`.
This can be used to use another datatype or parser for TOML floats
(e.g. [`decimal.Decimal`](decimal.md#decimal.Decimal)). The callable must not return a
[`dict`](stdtypes.md#dict) or a [`list`](stdtypes.md#list), else a [`ValueError`](exceptions.md#ValueError) is raised.

A [`TOMLDecodeError`](#tomllib.TOMLDecodeError) will be raised on an invalid TOML document.

### tomllib.loads(s, , , parse_float=float)

Load TOML from a [`str`](stdtypes.md#str) object. Return a [`dict`](stdtypes.md#dict). Convert TOML
types to Python using this [conversion table](#toml-to-py-table). The
*parse_float* argument has the same meaning as in [`load()`](#tomllib.load).

A [`TOMLDecodeError`](#tomllib.TOMLDecodeError) will be raised on an invalid TOML document.

The following exceptions are available:

### *exception* tomllib.TOMLDecodeError(msg, doc, pos)

Subclass of [`ValueError`](exceptions.md#ValueError) with the following additional attributes:

#### msg

The unformatted error message.

#### doc

The TOML document being parsed.

#### pos

The index of *doc* where parsing failed.

#### lineno

The line corresponding to *pos*.

#### colno

The column corresponding to *pos*.

#### Versionchanged
Changed in version 3.14: Added the *msg*, *doc* and *pos* parameters.
Added the [`msg`](#tomllib.TOMLDecodeError.msg), [`doc`](#tomllib.TOMLDecodeError.doc), [`pos`](#tomllib.TOMLDecodeError.pos), [`lineno`](#tomllib.TOMLDecodeError.lineno) and [`colno`](#tomllib.TOMLDecodeError.colno) attributes.

#### Deprecated
Deprecated since version 3.14: Passing free-form positional arguments is deprecated.

## Examples

Parsing a TOML file:

```python3
import tomllib

with open("pyproject.toml", "rb") as f:
    data = tomllib.load(f)
```

Parsing a TOML string:

```python3
import tomllib

toml_str = """
python-version = "3.11.0"
python-implementation = "CPython"
"""

data = tomllib.loads(toml_str)
```

## Conversion Table

<a id="toml-to-py-table"></a>

| TOML             | Python                                                                           |
|------------------|----------------------------------------------------------------------------------|
| TOML document    | dict                                                                             |
| string           | str                                                                              |
| integer          | int                                                                              |
| float            | float (configurable with *parse_float*)                                          |
| boolean          | bool                                                                             |
| offset date-time | datetime.datetime (`tzinfo` attribute set to an instance of `datetime.timezone`) |
| local date-time  | datetime.datetime (`tzinfo` attribute set to `None`)                             |
| local date       | datetime.date                                                                    |
| local time       | datetime.time                                                                    |
| array            | list                                                                             |
| table            | dict                                                                             |
| inline table     | dict                                                                             |
| array of tables  | list of dicts                                                                    |
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

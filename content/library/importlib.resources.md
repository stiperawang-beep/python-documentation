# `importlib.resources` – Package resource reading, opening and access

**Source code:** [Lib/importlib/resources/_\_init_\_.py](https://github.com/python/cpython/tree/main/Lib/importlib/resources/__init__.py)

---

#### Versionadded
Added in version 3.7.

This module leverages Python’s import system to provide access to *resources*
within *packages*.

“Resources” are file-like resources associated with a module or package in
Python. The resources may be contained directly in a package, within a
subdirectory contained in that package, or adjacent to modules outside a
package. Resources may be text or binary. As a result, a package’s Python
module sources (.py), compilation artifacts (pycache), and installation
artifacts (like [`reserved filenames`](os.path.md#os.path.isreserved)
in directories) are technically de-facto resources of that package.
In practice, however, resources are primarily those non-Python artifacts
exposed specifically by the package author.

Resources can be opened or read in either binary or text mode.

Resources are roughly akin to files inside directories, though it’s important
to keep in mind that this is just a metaphor.  Resources and packages **do
not** have to exist as physical files and directories on the file system:
for example, a package and its resources can be imported from a zip file using
[`zipimport`](zipimport.md#module-zipimport).

#### WARNING
[`importlib.resources`](#module-importlib.resources) follows the same security model as the built-in
[`open()`](functions.md#open) function. Passing untrusted inputs to the functions
in this module is unsafe.

#### NOTE
The standalone backport of this module provides more information
on [using importlib.resources](https://importlib-resources.readthedocs.io/en/latest/using.html) and
[migrating from pkg_resources to importlib.resources](https://importlib-resources.readthedocs.io/en/latest/migration.html).

[`Loaders`](importlib.md#importlib.abc.Loader) that wish to support resource reading should implement a
`get_resource_reader(fullname)` method as specified by
[`importlib.resources.abc.ResourceReader`](importlib.resources.abc.md#importlib.resources.abc.ResourceReader).

### *class* importlib.resources.Anchor

Represents an anchor for resources, either a [`module object`](types.md#types.ModuleType) or a module name as a string. Defined as
`Union[str, ModuleType]`.

### importlib.resources.files(anchor: [Anchor](#importlib.resources.Anchor) | [None](constants.md#None) = None)

Returns a [`Traversable`](importlib.resources.abc.md#importlib.resources.abc.Traversable) object
representing the resource container (think directory) and its resources
(think files). A Traversable may contain other containers (think
subdirectories).

*anchor* is an optional [`Anchor`](#importlib.resources.Anchor). If the anchor is a
package, resources are resolved from that package. If a module,
resources are resolved adjacent to that module (in the same package
or the package root). If the anchor is omitted, the caller’s module
is used.

#### Versionadded
Added in version 3.9.

#### Versionchanged
Changed in version 3.12: *package* parameter was renamed to *anchor*.
*package* was still accepted, but deprecated.

#### Versionchanged
Changed in version 3.15: *package* parameter was fully removed. *anchor* can now be a
non-package module and if omitted will default to the caller’s module.
*package* is no longer accepted since Python 3.15. Consider passing the
anchor positionally or using `importlib_resources >= 5.10` for a
compatible interface on older Pythons.

### importlib.resources.as_file(traversable)

Given a [`Traversable`](importlib.resources.abc.md#importlib.resources.abc.Traversable) object representing
a file or directory, typically from [`importlib.resources.files()`](#importlib.resources.files),
return a context manager for use in a [`with`](../reference/compound_stmts.md#with) statement.
The context manager provides a [`pathlib.Path`](pathlib.md#pathlib.Path) object.

Exiting the context manager cleans up any temporary file or directory
created when the resource was extracted from e.g. a zip file.

Use `as_file` when the Traversable methods
(`read_text`, etc) are insufficient and an actual file or directory on
the file system is required.

#### Versionadded
Added in version 3.9.

#### Versionchanged
Changed in version 3.12: Added support for *traversable* representing a directory.

<a id="importlib-resources-functional"></a>

## Functional API

A set of simplified, backwards-compatible helpers is available.
These allow common operations in a single function call.

For all the following functions:

- *anchor* is an [`Anchor`](#importlib.resources.Anchor),
  as in [`files()`](#importlib.resources.files).
  Unlike in `files`, it may not be omitted.
- *path_names* are components of a resource’s path name, relative to
  the anchor.
  For example, to get the text of resource named `info.txt`, use:
  ```python3
  importlib.resources.read_text(my_module, "info.txt")
  ```

  Like [`Traversable.joinpath`](importlib.resources.abc.md#importlib.resources.abc.Traversable),
  The individual components should use forward slashes (`/`)
  as path separators.
  For example, the following are equivalent:
  ```python3
  importlib.resources.read_binary(my_module, "pics/painting.png")
  importlib.resources.read_binary(my_module, "pics", "painting.png")
  ```

  For backward compatibility reasons, functions that read text require
  an explicit *encoding* argument if multiple *path_names* are given.
  For example, to get the text of `info/chapter1.txt`, use:
  ```python3
  importlib.resources.read_text(my_module, "info", "chapter1.txt",
                                encoding='utf-8')
  ```

### importlib.resources.open_binary(anchor, \*path_names)

Open the named resource for binary reading.

See [the introduction](#importlib-resources-functional) for
details on *anchor* and *path_names*.

This function returns a [`BinaryIO`](typing.md#typing.BinaryIO) object,
that is, a binary stream open for reading.

This function is roughly equivalent to:

```python3
files(anchor).joinpath(*path_names).open('rb')
```

#### Versionchanged
Changed in version 3.13: Multiple *path_names* are accepted.

### importlib.resources.open_text(anchor, \*path_names, encoding='utf-8', errors='strict')

Open the named resource for text reading.
By default, the contents are read as strict UTF-8.

See [the introduction](#importlib-resources-functional) for
details on *anchor* and *path_names*.
*encoding* and *errors* have the same meaning as in built-in [`open()`](functions.md#open).

For backward compatibility reasons, the *encoding* argument must be given
explicitly if there are multiple *path_names*.
This limitation is scheduled to be removed in Python 3.15.

This function returns a [`TextIO`](typing.md#typing.TextIO) object,
that is, a text stream open for reading.

This function is roughly equivalent to:

```python3
files(anchor).joinpath(*path_names).open('r', encoding=encoding)
```

#### Versionchanged
Changed in version 3.13: Multiple *path_names* are accepted.
*encoding* and *errors* must be given as keyword arguments.

### importlib.resources.read_binary(anchor, \*path_names)

Read and return the contents of the named resource as [`bytes`](stdtypes.md#bytes).

See [the introduction](#importlib-resources-functional) for
details on *anchor* and *path_names*.

This function is roughly equivalent to:

```python3
files(anchor).joinpath(*path_names).read_bytes()
```

#### Versionchanged
Changed in version 3.13: Multiple *path_names* are accepted.

### importlib.resources.read_text(anchor, \*path_names, encoding='utf-8', errors='strict')

Read and return the contents of the named resource as [`str`](stdtypes.md#str).
By default, the contents are read as strict UTF-8.

See [the introduction](#importlib-resources-functional) for
details on *anchor* and *path_names*.
*encoding* and *errors* have the same meaning as in built-in [`open()`](functions.md#open).

For backward compatibility reasons, the *encoding* argument must be given
explicitly if there are multiple *path_names*.
This limitation is scheduled to be removed in Python 3.15.

This function is roughly equivalent to:

```python3
files(anchor).joinpath(*path_names).read_text(encoding=encoding)
```

#### Versionchanged
Changed in version 3.13: Multiple *path_names* are accepted.
*encoding* and *errors* must be given as keyword arguments.

### importlib.resources.path(anchor, \*path_names)

Provides the path to the *resource* as an actual file system path.  This
function returns a context manager for use in a [`with`](../reference/compound_stmts.md#with) statement.
The context manager provides a [`pathlib.Path`](pathlib.md#pathlib.Path) object.

Exiting the context manager cleans up any temporary files created, e.g.
when the resource needs to be extracted from a zip file.

For example, the [`stat()`](pathlib.md#pathlib.Path.stat) method requires
an actual file system path; it can be used like this:

```python3
with importlib.resources.path(anchor, "resource.txt") as fspath:
    result = fspath.stat()
```

See [the introduction](#importlib-resources-functional) for
details on *anchor* and *path_names*.

This function is roughly equivalent to:

```python3
as_file(files(anchor).joinpath(*path_names))
```

#### Versionchanged
Changed in version 3.13: Multiple *path_names* are accepted.
*encoding* and *errors* must be given as keyword arguments.

### importlib.resources.is_resource(anchor, \*path_names)

Return `True` if the named resource exists, otherwise `False`.
This function does not consider directories to be resources.

See [the introduction](#importlib-resources-functional) for
details on *anchor* and *path_names*.

This function is roughly equivalent to:

```python3
files(anchor).joinpath(*path_names).is_file()
```

#### Versionchanged
Changed in version 3.13: Multiple *path_names* are accepted.

### importlib.resources.contents(anchor, \*path_names)

Return an iterable over the named items within the package or path.
The iterable returns names of resources (e.g. files) and non-resources
(e.g. directories) as [`str`](stdtypes.md#str).
The iterable does not recurse into subdirectories.

See [the introduction](#importlib-resources-functional) for
details on *anchor* and *path_names*.

This function is roughly equivalent to:

```python3
for resource in files(anchor).joinpath(*path_names).iterdir():
    yield resource.name
```

#### Deprecated
Deprecated since version 3.11: Prefer `iterdir()` as above, which offers more control over the
results and richer functionality.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

# `plistlib` — Generate and parse Apple `.plist` files

**Source code:** [Lib/plistlib.py](https://github.com/python/cpython/tree/main/Lib/plistlib.py)

<a id="index-0"></a>

---

This module provides an interface for reading and writing the “property list”
files used by Apple, primarily on macOS and iOS. This module supports both binary
and XML plist files.

The property list (`.plist`) file format is a simple serialization supporting
basic object types, like dictionaries, lists, numbers and strings.  Usually the
top level object is a dictionary or a frozen dictionary.

To write out and to parse a plist file, use the [`dump()`](#plistlib.dump) and
[`load()`](#plistlib.load) functions.

To work with plist data in bytes or string objects, use [`dumps()`](#plistlib.dumps)
and [`loads()`](#plistlib.loads).

Values can be strings, integers, floats, booleans, tuples, lists, dictionaries
(but only with string keys), [`bytes`](stdtypes.md#bytes), [`bytearray`](stdtypes.md#bytearray)
or [`datetime.datetime`](datetime.md#datetime.datetime) objects.

#### Versionchanged
Changed in version 3.4: New API, old API deprecated.  Support for binary format plists added.

#### Versionchanged
Changed in version 3.8: Support added for reading and writing [`UID`](#plistlib.UID) tokens in binary plists as used
by NSKeyedArchiver and NSKeyedUnarchiver.

#### Versionchanged
Changed in version 3.9: Old API removed.

#### SEE ALSO
[PList manual page](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/PropertyLists/)
: Apple’s documentation of the file format.

This module defines the following functions:

### plistlib.load(fp, , fmt=None, dict_type=dict, aware_datetime=False)

Read a plist file. *fp* should be a readable and binary file object.
Return the unpacked root object (which usually is a
dictionary).

The *fmt* is the format of the file and the following values are valid:

* [`None`](constants.md#None): Autodetect the file format
* [`FMT_XML`](#plistlib.FMT_XML): XML file format
* [`FMT_BINARY`](#plistlib.FMT_BINARY): Binary plist format

The *dict_type* is the type used for dictionaries that are read from the
plist file.

When *aware_datetime* is true, fields with type `datetime.datetime` will
be created as [aware object](datetime.md#datetime-naive-aware), with
`tzinfo` as [`datetime.UTC`](datetime.md#datetime.UTC).

XML data for the [`FMT_XML`](#plistlib.FMT_XML) format is parsed using the Expat parser
from [`xml.parsers.expat`](pyexpat.md#module-xml.parsers.expat) – see its documentation for possible
exceptions on ill-formed XML.  Unknown elements will simply be ignored
by the plist parser.

The parser raises [`InvalidFileException`](#plistlib.InvalidFileException) when the file cannot be parsed.

#### Versionadded
Added in version 3.4.

#### Versionchanged
Changed in version 3.13: The keyword-only parameter *aware_datetime* has been added.

### plistlib.loads(data, , fmt=None, dict_type=dict, aware_datetime=False)

Load a plist from a bytes or string object. See [`load()`](#plistlib.load) for an
explanation of the keyword arguments.

#### Versionadded
Added in version 3.4.

#### Versionchanged
Changed in version 3.13: *data* can be a string when *fmt* equals [`FMT_XML`](#plistlib.FMT_XML).

### plistlib.dump(value, fp, , fmt=FMT_XML, sort_keys=True, skipkeys=False, aware_datetime=False)

Write *value* to a plist file. *fp* should be a writable, binary
file object.

The *fmt* argument specifies the format of the plist file and can be
one of the following values:

* [`FMT_XML`](#plistlib.FMT_XML): XML formatted plist file
* [`FMT_BINARY`](#plistlib.FMT_BINARY): Binary formatted plist file

When *sort_keys* is true (the default) the keys for dictionaries will be
written to the plist in sorted order, otherwise they will be written in
the iteration order of the dictionary.

When *skipkeys* is false (the default) the function raises [`TypeError`](exceptions.md#TypeError)
when a key of a dictionary is not a string, otherwise such keys are skipped.

When *aware_datetime* is true and any field with type `datetime.datetime`
is set as an [aware object](datetime.md#datetime-naive-aware), it will convert to
UTC timezone before writing it.

A [`TypeError`](exceptions.md#TypeError) will be raised if the object is of an unsupported type or
a container that contains objects of unsupported types.

An [`OverflowError`](exceptions.md#OverflowError) will be raised for integer values that cannot
be represented in (binary) plist files.

#### Versionadded
Added in version 3.4.

#### Versionchanged
Changed in version 3.13: The keyword-only parameter *aware_datetime* has been added.

### plistlib.dumps(value, , fmt=FMT_XML, sort_keys=True, skipkeys=False, aware_datetime=False)

Return *value* as a plist-formatted bytes object. See
the documentation for [`dump()`](#plistlib.dump) for an explanation of the keyword
arguments of this function.

#### Versionadded
Added in version 3.4.

The following classes are available:

### *class* plistlib.UID(data)

Wraps an [`int`](functions.md#int).  This is used when reading or writing NSKeyedArchiver
encoded data, which contains UID (see PList manual).

#### data

Int value of the UID.  It must be in the range `0 <= data < 2**64`.

#### Versionadded
Added in version 3.8.

The following constants are available:

### plistlib.FMT_XML

The XML format for plist files.

#### Versionadded
Added in version 3.4.

### plistlib.FMT_BINARY

The binary format for plist files

#### Versionadded
Added in version 3.4.

The module defines the following exceptions:

### *exception* plistlib.InvalidFileException

Raised when a file cannot be parsed.

#### Versionadded
Added in version 3.4.

## Examples

Generating a plist:

```python3
import datetime as dt
import plistlib

pl = dict(
    aString = "Doodah",
    aList = ["A", "B", 12, 32.1, [1, 2, 3]],
    aFloat = 0.1,
    anInt = 728,
    aDict = dict(
        anotherString = "<hello & hi there!>",
        aThirdString = "M\xe4ssig, Ma\xdf",
        aTrueValue = True,
        aFalseValue = False,
    ),
    someData = b"<binary gunk>",
    someMoreData = b"<lots of binary gunk>" * 10,
    aDate = dt.datetime.now()
)
print(plistlib.dumps(pl).decode())
```

Parsing a plist:

```python3
import plistlib

plist = b"""<plist version="1.0">
<dict>
    <key>foo</key>
    <string>bar</string>
</dict>
</plist>"""
pl = plistlib.loads(plist)
print(pl["foo"])
```

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

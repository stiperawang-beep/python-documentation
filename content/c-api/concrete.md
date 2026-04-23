<a id="concrete"></a>

# Concrete Objects Layer

The functions in this chapter are specific to certain Python object types.
Passing them an object of the wrong type is not a good idea; if you receive an
object from a Python program and you are not sure that it has the right type,
you must perform a type check first; for example, to check that an object is a
dictionary, use [`PyDict_Check()`](dict.md#c.PyDict_Check).  The chapter is structured like the
“family tree” of Python object types.

#### WARNING
While the functions described in this chapter carefully check the type of the
objects which are passed in, many of them do not check for `NULL` being passed
instead of a valid object.  Allowing `NULL` to be passed in can cause memory
access violations and immediate termination of the interpreter.

<a id="fundamental"></a>

## Fundamental Objects

This section describes Python type objects and the singleton object `None`.

* [Type Objects](type.md)
  * [Creating Heap-Allocated Types](type.md#creating-heap-allocated-types)
* [The `None` Object](none.md)

<a id="numericobjects"></a>

## Numeric Objects

<a id="index-0"></a>

* [Integer Objects](long.md)
  * [Export API](long.md#export-api)
  * [PyLongWriter API](long.md#pylongwriter-api)
  * [Deprecated API](long.md#deprecated-api)
* [Boolean Objects](bool.md)
* [Floating-Point Objects](float.md)
  * [Pack and Unpack functions](float.md#pack-and-unpack-functions)
    * [Pack functions](float.md#pack-functions)
    * [Unpack functions](float.md#unpack-functions)
* [Complex Number Objects](complex.md)
  * [Complex Numbers as C Structures](complex.md#complex-numbers-as-c-structures)

<a id="sequenceobjects"></a>

## Sequence Objects

<a id="index-1"></a>

Generic operations on sequence objects were discussed in the previous chapter;
this section deals with the specific kinds of sequence objects that are
intrinsic to the Python language.

<!-- XXX sort out unicode, str, bytes and bytearray -->

* [Bytes Objects](bytes.md)
* [PyBytesWriter](bytes.md#pybyteswriter)
  * [Create, Finish, Discard](bytes.md#create-finish-discard)
  * [High-level API](bytes.md#high-level-api)
  * [Getters](bytes.md#getters)
  * [Low-level API](bytes.md#low-level-api)
* [Byte Array Objects](bytearray.md)
  * [Type check macros](bytearray.md#type-check-macros)
  * [Direct API functions](bytearray.md#direct-api-functions)
  * [Macros](bytearray.md#macros)
* [Unicode Objects and Codecs](unicode.md)
  * [Unicode Objects](unicode.md#unicode-objects)
    * [Unicode Type](unicode.md#unicode-type)
    * [Unicode Character Properties](unicode.md#unicode-character-properties)
    * [Creating and accessing Unicode strings](unicode.md#creating-and-accessing-unicode-strings)
    * [Locale Encoding](unicode.md#locale-encoding)
    * [File System Encoding](unicode.md#file-system-encoding)
    * [wchar_t Support](unicode.md#wchar-t-support)
  * [Built-in Codecs](unicode.md#built-in-codecs)
    * [Generic Codecs](unicode.md#generic-codecs)
    * [UTF-8 Codecs](unicode.md#utf-8-codecs)
    * [UTF-32 Codecs](unicode.md#utf-32-codecs)
    * [UTF-16 Codecs](unicode.md#utf-16-codecs)
    * [UTF-7 Codecs](unicode.md#utf-7-codecs)
    * [Unicode-Escape Codecs](unicode.md#unicode-escape-codecs)
    * [Raw-Unicode-Escape Codecs](unicode.md#raw-unicode-escape-codecs)
    * [Latin-1 Codecs](unicode.md#latin-1-codecs)
    * [ASCII Codecs](unicode.md#ascii-codecs)
    * [Character Map Codecs](unicode.md#character-map-codecs)
    * [MBCS codecs for Windows](unicode.md#mbcs-codecs-for-windows)
  * [Methods and Slot Functions](unicode.md#methods-and-slot-functions)
  * [PyUnicodeWriter](unicode.md#pyunicodewriter)
  * [Deprecated API](unicode.md#deprecated-api)
* [Tuple Objects](tuple.md)
* [Struct Sequence Objects](tuple.md#struct-sequence-objects)
* [List Objects](list.md)

<a id="mapobjects"></a>

## Container Objects

<a id="index-2"></a>

* [Dictionary objects](dict.md)
  * [Dictionary view objects](dict.md#dictionary-view-objects)
  * [Frozen dictionary objects](dict.md#frozen-dictionary-objects)
  * [Ordered dictionaries](dict.md#ordered-dictionaries)
* [Set Objects](set.md)
  * [Deprecated API](set.md#deprecated-api)

<a id="otherobjects"></a>

## Function Objects

* [Function Objects](function.md)
* [Instance Method Objects](method.md)
* [Method Objects](method.md#method-objects)
* [Cell Objects](cell.md)
* [Code Objects](code.md)
* [Code Object Flags](code.md#code-object-flags)
* [Extra information](code.md#extra-information)

## Other Objects

* [File objects](file.md)
  * [Soft-deprecated API](file.md#soft-deprecated-api)
* [Module Objects](module.md)
  * [Module definition](module.md#module-definition)
    * [Metadata slots](module.md#metadata-slots)
    * [Feature slots](module.md#feature-slots)
    * [Creation and initialization slots](module.md#creation-and-initialization-slots)
  * [Module state](module.md#module-state)
    * [Slots for defining module state](module.md#slots-for-defining-module-state)
    * [Module token](module.md#module-token)
  * [Creating extension modules dynamically](module.md#creating-extension-modules-dynamically)
  * [Module definition struct](module.md#module-definition-struct)
  * [Support functions](module.md#support-functions)
    * [Module lookup (single-phase initialization)](module.md#module-lookup-single-phase-initialization)
* [Iterator Objects](iterator.md)
  * [Range Objects](iterator.md#range-objects)
  * [Builtin Iterator Types](iterator.md#builtin-iterator-types)
  * [Other Iterator Objects](iterator.md#other-iterator-objects)
* [Descriptor Objects](descriptor.md)
  * [Built-in descriptors](descriptor.md#built-in-descriptors)
* [Slice Objects](slice.md)
  * [Ellipsis Object](slice.md#ellipsis-object)
* [MemoryView objects](memoryview.md)
* [Pickle buffer objects](picklebuffer.md)
* [Weak Reference Objects](weakref.md)
* [Capsules](capsule.md)
* [Frame objects](frame.md)
  * [Frame locals proxies](frame.md#frame-locals-proxies)
  * [Legacy local variable APIs](frame.md#legacy-local-variable-apis)
  * [Internal frames](frame.md#internal-frames)
* [Generator Objects](gen.md)
  * [Asynchronous Generator Objects](gen.md#asynchronous-generator-objects)
  * [Deprecated API](gen.md#deprecated-api)
* [Coroutine Objects](coro.md)
* [Context Variables Objects](contextvars.md)
* [Objects for Type Hinting](typehints.md)

## C API for extension modules

* [Curses C API](curses.md)
* [Internal data](curses.md#internal-data)
* [DateTime Objects](datetime.md)
* [Internal data](datetime.md#internal-data)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

<a id="newtypes"></a>

# Object Implementation Support

This chapter describes the functions, types, and macros used when defining new
object types.

* [Allocating objects on the heap](allocation.md)
  * [Soft-deprecated aliases](allocation.md#soft-deprecated-aliases)
* [Object Life Cycle](lifecycle.md)
  * [Life Events](lifecycle.md#life-events)
  * [Cyclic Isolate Destruction](lifecycle.md#cyclic-isolate-destruction)
  * [Functions](lifecycle.md#functions)
* [Common Object Structures](structures.md)
  * [Base object types and macros](structures.md#base-object-types-and-macros)
  * [Implementing functions and methods](structures.md#implementing-functions-and-methods)
  * [Accessing attributes of extension types](structures.md#accessing-attributes-of-extension-types)
    * [Member flags](structures.md#member-flags)
    * [Member types](structures.md#member-types)
    * [Defining Getters and Setters](structures.md#defining-getters-and-setters)
* [Type Object Structures](typeobj.md)
  * [Quick Reference](typeobj.md#quick-reference)
    * [“tp slots”](typeobj.md#tp-slots)
    * [sub-slots](typeobj.md#sub-slots)
    * [slot typedefs](typeobj.md#slot-typedefs)
  * [PyTypeObject Definition](typeobj.md#pytypeobject-definition)
  * [PyObject Slots](typeobj.md#pyobject-slots)
  * [PyVarObject Slots](typeobj.md#pyvarobject-slots)
  * [PyTypeObject Slots](typeobj.md#pytypeobject-slots)
  * [Static Types](typeobj.md#static-types)
  * [Heap Types](typeobj.md#heap-types)
  * [Number Object Structures](typeobj.md#number-object-structures)
  * [Mapping Object Structures](typeobj.md#mapping-object-structures)
  * [Sequence Object Structures](typeobj.md#sequence-object-structures)
  * [Buffer Object Structures](typeobj.md#buffer-object-structures)
  * [Async Object Structures](typeobj.md#async-object-structures)
  * [Slot Type typedefs](typeobj.md#slot-type-typedefs)
  * [Examples](typeobj.md#examples)
* [Supporting Cyclic Garbage Collection](gcsupport.md)
  * [Traversal](gcsupport.md#traversal)
    * [Traversal-safe functions](gcsupport.md#traversal-safe-functions)
    * [“DuringGC” functions](gcsupport.md#duringgc-functions)
  * [Controlling the Garbage Collector State](gcsupport.md#controlling-the-garbage-collector-state)
  * [Querying Garbage Collector State](gcsupport.md#querying-garbage-collector-state)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

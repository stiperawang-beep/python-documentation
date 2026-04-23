<a id="abstract"></a>

# Abstract Objects Layer

The functions in this chapter interact with Python objects regardless of their
type, or with wide classes of object types (e.g. all numerical types, or all
sequence types).  When used on object types for which they do not apply, they
will raise a Python exception.

It is not possible to use these functions on objects that are not properly
initialized, such as a list object that has been created by [`PyList_New()`](list.md#c.PyList_New),
but whose items have not been set to some non-`NULL` value yet.

* [Object Protocol](object.md)
* [Call Protocol](call.md)
  * [The *tp_call* Protocol](call.md#the-tp-call-protocol)
  * [The Vectorcall Protocol](call.md#the-vectorcall-protocol)
    * [Recursion Control](call.md#recursion-control)
    * [Vectorcall Support API](call.md#vectorcall-support-api)
  * [Object Calling API](call.md#object-calling-api)
  * [Call Support API](call.md#call-support-api)
* [Number Protocol](number.md)
* [Sequence Protocol](sequence.md)
* [Mapping Protocol](mapping.md)
* [Iterator Protocol](iter.md)
* [Buffer Protocol](buffer.md)
  * [Buffer structure](buffer.md#buffer-structure)
  * [Buffer request types](buffer.md#buffer-request-types)
    * [request-independent fields](buffer.md#request-independent-fields)
    * [readonly, format](buffer.md#readonly-format)
    * [shape, strides, suboffsets](buffer.md#shape-strides-suboffsets)
    * [contiguity requests](buffer.md#contiguity-requests)
    * [compound requests](buffer.md#compound-requests)
  * [Complex arrays](buffer.md#complex-arrays)
    * [NumPy-style: shape and strides](buffer.md#numpy-style-shape-and-strides)
    * [PIL-style: shape, strides and suboffsets](buffer.md#pil-style-shape-strides-and-suboffsets)
  * [Buffer-related functions](buffer.md#buffer-related-functions)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

<a id="instancemethod-objects"></a>

# Instance Method Objects

<a id="index-0"></a>

An instance method is a wrapper for a [`PyCFunction`](structures.md#c.PyCFunction) and the new way
to bind a [`PyCFunction`](structures.md#c.PyCFunction) to a class object. It replaces the former call
`PyMethod_New(func, NULL, class)`.

### [PyTypeObject](type.md#c.PyTypeObject) PyInstanceMethod_Type

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python instance
method type. It is not exposed to Python programs.

### int PyInstanceMethod_Check([PyObject](structures.md#c.PyObject) \*o)

Return true if *o* is an instance method object (has type
[`PyInstanceMethod_Type`](#c.PyInstanceMethod_Type)).  The parameter must not be `NULL`.
This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyInstanceMethod_New([PyObject](structures.md#c.PyObject) \*func)

*Return value: New reference.*

Return a new instance method object, with *func* being any callable object.
*func* is the function that will be called when the instance method is
called.

### [PyObject](structures.md#c.PyObject) \*PyInstanceMethod_Function([PyObject](structures.md#c.PyObject) \*im)

*Return value: Borrowed reference.*

Return the function object associated with the instance method *im*.

### [PyObject](structures.md#c.PyObject) \*PyInstanceMethod_GET_FUNCTION([PyObject](structures.md#c.PyObject) \*im)

*Return value: Borrowed reference.*

Macro version of [`PyInstanceMethod_Function()`](#c.PyInstanceMethod_Function) which avoids error checking.

<a id="method-objects"></a>

# Method Objects

<a id="index-1"></a>

Methods are bound function objects. Methods are always bound to an instance of
a user-defined class. Unbound methods (methods bound to a class object) are
no longer available.

### [PyTypeObject](type.md#c.PyTypeObject) PyMethod_Type

<a id="index-2"></a>

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python method type.  This
is exposed to Python programs as `types.MethodType`.

### int PyMethod_Check([PyObject](structures.md#c.PyObject) \*o)

Return true if *o* is a method object (has type [`PyMethod_Type`](#c.PyMethod_Type)).  The
parameter must not be `NULL`.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyMethod_New([PyObject](structures.md#c.PyObject) \*func, [PyObject](structures.md#c.PyObject) \*self)

*Return value: New reference.*

Return a new method object, with *func* being any callable object and *self*
the instance the method should be bound. *func* is the function that will
be called when the method is called. *self* must not be `NULL`.

### [PyObject](structures.md#c.PyObject) \*PyMethod_Function([PyObject](structures.md#c.PyObject) \*meth)

*Return value: Borrowed reference.*

Return the function object associated with the method *meth*.

### [PyObject](structures.md#c.PyObject) \*PyMethod_GET_FUNCTION([PyObject](structures.md#c.PyObject) \*meth)

*Return value: Borrowed reference.*

Macro version of [`PyMethod_Function()`](#c.PyMethod_Function) which avoids error checking.

### [PyObject](structures.md#c.PyObject) \*PyMethod_Self([PyObject](structures.md#c.PyObject) \*meth)

*Return value: Borrowed reference.*

Return the instance associated with the method *meth*.

### [PyObject](structures.md#c.PyObject) \*PyMethod_GET_SELF([PyObject](structures.md#c.PyObject) \*meth)

*Return value: Borrowed reference.*

Macro version of [`PyMethod_Self()`](#c.PyMethod_Self) which avoids error checking.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

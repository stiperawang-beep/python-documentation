<a id="glossary"></a>

# Glossary

<!-- if you add new entries, keep the alphabetical sorting! -->

<a id="term-0"></a>

`>>>`
: The default Python prompt of the [interactive](#term-interactive) shell.  Often
  seen for code examples which can be executed interactively in the
  interpreter.

<a id="term-..."></a>

`...`
: Can refer to:
  <br/>
  * The default Python prompt of the [interactive](#term-interactive) shell when entering the
    code for an indented code block, when within a pair of matching left and
    right delimiters (parentheses, square brackets, curly braces or triple
    quotes), or after specifying a decorator.
  <br/>
  <a id="index-0"></a>
  * The three dots form of the [Ellipsis](library/stdtypes.md#bltin-ellipsis-object) object.

<a id="term-abstract-base-class"></a>

abstract base class
: Abstract base classes complement [duck-typing](#term-duck-typing) by
  providing a way to define interfaces when other techniques like
  [`hasattr()`](library/functions.md#hasattr) would be clumsy or subtly wrong (for example with
  [magic methods](reference/datamodel.md#special-lookup)).  ABCs introduce virtual
  subclasses, which are classes that don’t inherit from a class but are
  still recognized by [`isinstance()`](library/functions.md#isinstance) and [`issubclass()`](library/functions.md#issubclass); see the
  [`abc`](library/abc.md#module-abc) module documentation.  Python comes with many built-in ABCs for
  data structures (in the [`collections.abc`](library/collections.abc.md#module-collections.abc) module), numbers (in the
  [`numbers`](library/numbers.md#module-numbers) module), streams (in the [`io`](library/io.md#module-io) module), import finders
  and loaders (in the [`importlib.abc`](library/importlib.md#module-importlib.abc) module).  You can create your own
  ABCs with the [`abc`](library/abc.md#module-abc) module.

<a id="term-annotate-function"></a>

annotate function
: A function that can be called to retrieve the [annotations](#term-annotation)
  of an object. This function is accessible as the [`__annotate__`](reference/datamodel.md#object.__annotate__)
  attribute of functions, classes, and modules. Annotate functions are a
  subset of [evaluate functions](#term-evaluate-function).

<a id="term-annotation"></a>

annotation
: A label associated with a variable, a class
  attribute or a function parameter or return value,
  used by convention as a [type hint](#term-type-hint).
  <br/>
  Annotations of local variables cannot be accessed at runtime, but
  annotations of global variables, class attributes, and functions
  can be retrieved by calling [`annotationlib.get_annotations()`](library/annotationlib.md#annotationlib.get_annotations)
  on modules, classes, and functions, respectively.
  <br/>
  See [variable annotation](#term-variable-annotation), [function annotation](#term-function-annotation), [**PEP 484**](https://peps.python.org/pep-0484/),
  [**PEP 526**](https://peps.python.org/pep-0526/), and [**PEP 649**](https://peps.python.org/pep-0649/), which describe this functionality.
  Also see [Annotations Best Practices](howto/annotations.md#annotations-howto)
  for best practices on working with annotations.

<a id="term-argument"></a>

argument
: A value passed to a [function](#term-function) (or [method](#term-method)) when calling the
  function.  There are two kinds of argument:
  <br/>
  * *keyword argument*: an argument preceded by an identifier (e.g.
    `name=`) in a function call or passed as a value in a dictionary
    preceded by `**`.  For example, `3` and `5` are both keyword
    arguments in the following calls to [`complex()`](library/functions.md#complex):
    ```python3
    complex(real=3, imag=5)
    complex(**{'real': 3, 'imag': 5})
    ```
  * *positional argument*: an argument that is not a keyword argument.
    Positional arguments can appear at the beginning of an argument list
    and/or be passed as elements of an [iterable](#term-iterable) preceded by `*`.
    For example, `3` and `5` are both positional arguments in the
    following calls:
    ```python3
    complex(3, 5)
    complex(*(3, 5))
    ```
  <br/>
  Arguments are assigned to the named local variables in a function body.
  See the [Calls](reference/expressions.md#calls) section for the rules governing this assignment.
  Syntactically, any expression can be used to represent an argument; the
  evaluated value is assigned to the local variable.
  <br/>
  See also the [parameter](#term-parameter) glossary entry, the FAQ question on
  [the difference between arguments and parameters](faq/programming.md#faq-argument-vs-parameter), and [**PEP 362**](https://peps.python.org/pep-0362/).

<a id="term-asynchronous-context-manager"></a>

asynchronous context manager
: An object which controls the environment seen in an
  [`async with`](reference/compound_stmts.md#async-with) statement by defining [`__aenter__()`](reference/datamodel.md#object.__aenter__) and
  [`__aexit__()`](reference/datamodel.md#object.__aexit__) methods.  Introduced by [**PEP 492**](https://peps.python.org/pep-0492/).

<a id="term-asynchronous-generator"></a>

asynchronous generator
: A function which returns an [asynchronous generator iterator](#term-asynchronous-generator-iterator).  It
  looks like a coroutine function defined with [`async def`](reference/compound_stmts.md#async-def) except
  that it contains [`yield`](reference/simple_stmts.md#yield) expressions for producing a series of
  values usable in an [`async for`](reference/compound_stmts.md#async-for) loop.
  <br/>
  Usually refers to an asynchronous generator function, but may refer to an
  *asynchronous generator iterator* in some contexts.  In cases where the
  intended meaning isn’t clear, using the full terms avoids ambiguity.
  <br/>
  An asynchronous generator function may contain [`await`](reference/expressions.md#await)
  expressions as well as [`async for`](reference/compound_stmts.md#async-for), and [`async with`](reference/compound_stmts.md#async-with)
  statements.

<a id="term-asynchronous-generator-iterator"></a>

asynchronous generator iterator
: An object created by an [asynchronous generator](#term-asynchronous-generator) function.
  <br/>
  This is an [asynchronous iterator](#term-asynchronous-iterator) which when called using the
  [`__anext__()`](reference/datamodel.md#object.__anext__) method returns an awaitable object which will execute
  the body of the asynchronous generator function until the next
  [`yield`](reference/simple_stmts.md#yield) expression.
  <br/>
  Each [`yield`](reference/simple_stmts.md#yield) temporarily suspends processing, remembering the
  execution state (including local variables and pending
  try-statements).  When the *asynchronous generator iterator* effectively
  resumes with another awaitable returned by [`__anext__()`](reference/datamodel.md#object.__anext__), it
  picks up where it left off.  See [**PEP 492**](https://peps.python.org/pep-0492/) and [**PEP 525**](https://peps.python.org/pep-0525/).

<a id="term-asynchronous-iterable"></a>

asynchronous iterable
: An object, that can be used in an [`async for`](reference/compound_stmts.md#async-for) statement.
  Must return an [asynchronous iterator](#term-asynchronous-iterator) from its
  [`__aiter__()`](reference/datamodel.md#object.__aiter__) method.  Introduced by [**PEP 492**](https://peps.python.org/pep-0492/).

<a id="term-asynchronous-iterator"></a>

asynchronous iterator
: An object that implements the [`__aiter__()`](reference/datamodel.md#object.__aiter__) and [`__anext__()`](reference/datamodel.md#object.__anext__)
  methods.  [`__anext__()`](reference/datamodel.md#object.__anext__) must return an [awaitable](#term-awaitable) object.
  [`async for`](reference/compound_stmts.md#async-for) resolves the awaitables returned by an asynchronous
  iterator’s [`__anext__()`](reference/datamodel.md#object.__anext__) method until it raises a
  [`StopAsyncIteration`](library/exceptions.md#StopAsyncIteration) exception.  Introduced by [**PEP 492**](https://peps.python.org/pep-0492/).

<a id="term-atomic-operation"></a>

atomic operation
: An operation that appears to execute as a single, indivisible step: no
  other thread can observe it half-done, and its effects become visible all
  at once.  Python does not guarantee that high-level statements are atomic
  (for example, `x += 1` performs multiple bytecode operations and is not
  atomic).  Atomicity is only guaranteed where explicitly documented.  See
  also [race condition](#term-race-condition) and [data race](#term-data-race).

<a id="term-attached-thread-state"></a>

attached thread state
: A [thread state](#term-thread-state) that is active for the current OS thread.
  <br/>
  When a [thread state](#term-thread-state) is attached, the OS thread has
  access to the full Python C API and can safely invoke the
  bytecode interpreter.
  <br/>
  Unless a function explicitly notes otherwise, attempting to call
  the C API without an attached thread state will result in a fatal
  error or undefined behavior.  A thread state can be attached and detached
  explicitly by the user through the C API, or implicitly by the runtime,
  including during blocking C calls and by the bytecode interpreter in between
  calls.
  <br/>
  On most builds of Python, having an attached thread state implies that the
  caller holds the [GIL](#term-GIL) for the current interpreter, so only
  one OS thread can have an attached thread state at a given moment. In
  [free-threaded builds](#term-free-threaded-build) of Python, threads can
  concurrently hold an attached thread state, allowing for true parallelism of
  the bytecode interpreter.

<a id="term-attribute"></a>

attribute
: A value associated with an object which is usually referenced by name
  using dotted expressions.
  For example, if an object *o* has an attribute
  *a* it would be referenced as *o.a*.
  <br/>
  It is possible to give an object an attribute whose name is not an
  identifier as defined by [Names (identifiers and keywords)](reference/lexical_analysis.md#identifiers), for example using
  [`setattr()`](library/functions.md#setattr), if the object allows it.
  Such an attribute will not be accessible using a dotted expression,
  and would instead need to be retrieved with [`getattr()`](library/functions.md#getattr).

<a id="term-awaitable"></a>

awaitable
: An object that can be used in an [`await`](reference/expressions.md#await) expression.  Can be
  a [coroutine](#term-coroutine) or an object with an [`__await__()`](reference/datamodel.md#object.__await__) method.
  See also [**PEP 492**](https://peps.python.org/pep-0492/).

<a id="term-BDFL"></a>

BDFL
: Benevolent Dictator For Life, a.k.a. [Guido van Rossum](https://gvanrossum.github.io/), Python’s creator.

<a id="term-binary-file"></a>

binary file
: A [file object](#term-file-object) able to read and write
  [bytes-like objects](#term-bytes-like-object).
  Examples of binary files are files opened in binary mode (`'rb'`,
  `'wb'` or `'rb+'`), [`sys.stdin.buffer`](library/sys.md#sys.stdin),
  [`sys.stdout.buffer`](library/sys.md#sys.stdout), and instances of
  [`io.BytesIO`](library/io.md#io.BytesIO) and [`gzip.GzipFile`](library/gzip.md#gzip.GzipFile).
  <br/>
  See also [text file](#term-text-file) for a file object able to read and write
  [`str`](library/stdtypes.md#str) objects.

<a id="term-borrowed-reference"></a>

borrowed reference
: In Python’s C API, a borrowed reference is a reference to an object,
  where the code using the object does not own the reference.
  It becomes a dangling
  pointer if the object is destroyed. For example, a garbage collection can
  remove the last [strong reference](#term-strong-reference) to the object and so destroy it.
  <br/>
  Calling [`Py_INCREF()`](c-api/refcounting.md#c.Py_INCREF) on the [borrowed reference](#term-borrowed-reference) is
  recommended to convert it to a [strong reference](#term-strong-reference) in-place, except
  when the object cannot be destroyed before the last usage of the borrowed
  reference. The [`Py_NewRef()`](c-api/refcounting.md#c.Py_NewRef) function can be used to create a new
  [strong reference](#term-strong-reference).

<a id="term-bytes-like-object"></a>

bytes-like object
: An object that supports the [Buffer Protocol](c-api/buffer.md#bufferobjects) and can
  export a C-[contiguous](#term-contiguous) buffer. This includes all [`bytes`](library/stdtypes.md#bytes),
  [`bytearray`](library/stdtypes.md#bytearray), and [`array.array`](library/array.md#array.array) objects, as well as many
  common [`memoryview`](library/stdtypes.md#memoryview) objects.  Bytes-like objects can
  be used for various operations that work with binary data; these include
  compression, saving to a binary file, and sending over a socket.
  <br/>
  Some operations need the binary data to be mutable.  The documentation
  often refers to these as “read-write bytes-like objects”.  Example
  mutable buffer objects include [`bytearray`](library/stdtypes.md#bytearray) and a
  [`memoryview`](library/stdtypes.md#memoryview) of a [`bytearray`](library/stdtypes.md#bytearray).
  Other operations require the binary data to be stored in
  immutable objects (“read-only bytes-like objects”); examples
  of these include [`bytes`](library/stdtypes.md#bytes) and a [`memoryview`](library/stdtypes.md#memoryview)
  of a [`bytes`](library/stdtypes.md#bytes) object.

<a id="term-bytecode"></a>

bytecode
: Python source code is compiled into bytecode, the internal representation
  of a Python program in the CPython interpreter.  The bytecode is also
  cached in `.pyc` files so that executing the same file is
  faster the second time (recompilation from source to bytecode can be
  avoided).  This “intermediate language” is said to run on a
  [virtual machine](#term-virtual-machine) that executes the machine code corresponding to
  each bytecode. Do note that bytecodes are not expected to work between
  different Python virtual machines, nor to be stable between Python
  releases.
  <br/>
  A list of bytecode instructions can be found in the documentation for
  [the dis module](library/dis.md#bytecodes).

<a id="term-callable"></a>

callable
: A callable is an object that can be called, possibly with a set
  of arguments (see [argument](#term-argument)), with the following syntax:
  <br/>
  ```python3
  callable(argument1, argument2, argumentN)
  ```
  <br/>
  A [function](#term-function), and by extension a [method](#term-method), is a callable.
  An instance of a class that implements the [`__call__()`](reference/datamodel.md#object.__call__)
  method is also a callable.

<a id="term-callback"></a>

callback
: A subroutine function which is passed as an argument to be executed at
  some point in the future.

<a id="term-class"></a>

class
: A template for creating user-defined objects. Class definitions
  normally contain method definitions which operate on instances of the
  class.

<a id="term-class-variable"></a>

class variable
: A variable defined in a class and intended to be modified only at
  class level (i.e., not in an instance of the class).

<a id="term-closure-variable"></a>

closure variable
: A [free variable](#term-free-variable) referenced from a [nested scope](#term-nested-scope) that is defined in an outer
  scope rather than being resolved at runtime from the globals or builtin namespaces.
  May be explicitly defined with the [`nonlocal`](reference/simple_stmts.md#nonlocal) keyword to allow write access,
  or implicitly defined if the variable is only being read.
  <br/>
  For example, in the `inner` function in the following code, both `x` and `print` are
  [free variables](#term-free-variable), but only `x` is a *closure variable*:
  <br/>
  ```python3
  def outer():
      x = 0
      def inner():
          nonlocal x
          x += 1
          print(x)
      return inner
  ```
  <br/>
  Due to the [`codeobject.co_freevars`](reference/datamodel.md#codeobject.co_freevars) attribute (which, despite its name, only
  includes the names of closure variables rather than listing all referenced free
  variables), the more general [free variable](#term-free-variable) term is sometimes used even
  when the intended meaning is to refer specifically to closure variables.

<a id="term-complex-number"></a>

complex number
: An extension of the familiar real number system in which all numbers are
  expressed as a sum of a real part and an imaginary part.  Imaginary
  numbers are real multiples of the imaginary unit (the square root of
  `-1`), often written `i` in mathematics or `j` in
  engineering.  Python has built-in support for complex numbers, which are
  written with this latter notation; the imaginary part is written with a
  `j` suffix, e.g., `3+1j`.  To get access to complex equivalents of the
  [`math`](library/math.md#module-math) module, use [`cmath`](library/cmath.md#module-cmath).  Use of complex numbers is a fairly
  advanced mathematical feature.  If you’re not aware of a need for them,
  it’s almost certain you can safely ignore them.

<a id="term-concurrency"></a>

concurrency
: The ability of a computer program to perform multiple tasks at the same
  time.  Python provides libraries for writing programs that make use of
  different forms of concurrency.  [`asyncio`](library/asyncio.md#module-asyncio) is a library for dealing
  with asynchronous tasks and coroutines.  [`threading`](library/threading.md#module-threading) provides
  access to operating system threads and [`multiprocessing`](library/multiprocessing.md#module-multiprocessing) to
  operating system processes. Multi-core processors can execute threads and
  processes on different CPU cores at the same time (see
  [parallelism](#term-parallelism)).

<a id="term-concurrent-modification"></a>

concurrent modification
: When multiple threads modify shared data at the same time.  Concurrent
  modification without proper synchronization can cause
  [race conditions](#term-race-condition), and might also trigger a
  [data race](#term-data-race), data corruption, or both.

<a id="term-context"></a>

context
: This term has different meanings depending on where and how it is used.
  Some common meanings:
  <br/>
  * The temporary state or environment established by a [context
    manager](#term-context-manager) via a [`with`](reference/compound_stmts.md#with) statement.
  * The collection of key­value bindings associated with a particular
    [`contextvars.Context`](library/contextvars.md#contextvars.Context) object and accessed via
    [`ContextVar`](library/contextvars.md#contextvars.ContextVar) objects.  Also see [context
    variable](#term-context-variable).
  * A [`contextvars.Context`](library/contextvars.md#contextvars.Context) object.  Also see [current
    context](#term-current-context).

<a id="term-context-management-protocol"></a>

context management protocol
: The [`__enter__()`](reference/datamodel.md#object.__enter__) and [`__exit__()`](reference/datamodel.md#object.__exit__) methods called
  by the [`with`](reference/compound_stmts.md#with) statement.  See [**PEP 343**](https://peps.python.org/pep-0343/).

<a id="term-context-manager"></a>

context manager
: An object which implements the [context management protocol](#term-context-management-protocol) and
  controls the environment seen in a [`with`](reference/compound_stmts.md#with) statement.  See
  [**PEP 343**](https://peps.python.org/pep-0343/).

<a id="term-context-variable"></a>

context variable
: A variable whose value depends on which context is the [current
  context](#term-current-context).  Values are accessed via [`contextvars.ContextVar`](library/contextvars.md#contextvars.ContextVar)
  objects.  Context variables are primarily used to isolate state between
  concurrent asynchronous tasks.

<a id="term-contiguous"></a>

contiguous
: <a id="index-13"></a>
  <br/>
  A buffer is considered contiguous exactly if it is either
  *C-contiguous* or *Fortran contiguous*.  Zero-dimensional buffers are
  C and Fortran contiguous.  In one-dimensional arrays, the items
  must be laid out in memory next to each other, in order of
  increasing indexes starting from zero.  In multidimensional
  C-contiguous arrays, the last index varies the fastest when
  visiting items in order of memory address.  However, in
  Fortran contiguous arrays, the first index varies the fastest.

<a id="term-coroutine"></a>

coroutine
: Coroutines are a more generalized form of subroutines. Subroutines are
  entered at one point and exited at another point.  Coroutines can be
  entered, exited, and resumed at many different points.  They can be
  implemented with the [`async def`](reference/compound_stmts.md#async-def) statement.  See also
  [**PEP 492**](https://peps.python.org/pep-0492/).

<a id="term-coroutine-function"></a>

coroutine function
: A function which returns a [coroutine](#term-coroutine) object.  A coroutine
  function may be defined with the [`async def`](reference/compound_stmts.md#async-def) statement,
  and may contain [`await`](reference/expressions.md#await), [`async for`](reference/compound_stmts.md#async-for), and
  [`async with`](reference/compound_stmts.md#async-with) keywords.  These were introduced
  by [**PEP 492**](https://peps.python.org/pep-0492/).

<a id="term-CPython"></a>

CPython
: The canonical implementation of the Python programming language, as
  distributed on [python.org](https://www.python.org).  The term “CPython”
  is used when necessary to distinguish this implementation from others
  such as Jython or IronPython.

<a id="term-current-context"></a>

current context
: The [context](#term-context) ([`contextvars.Context`](library/contextvars.md#contextvars.Context) object) that is
  currently used by [`ContextVar`](library/contextvars.md#contextvars.ContextVar) objects to access (get
  or set) the values of [context variables](#term-context-variable).  Each
  thread has its own current context.  Frameworks for executing asynchronous
  tasks (see [`asyncio`](library/asyncio.md#module-asyncio)) associate each task with a context which
  becomes the current context whenever the task starts or resumes execution.

<a id="term-cyclic-isolate"></a>

cyclic isolate
: A subgroup of one or more objects that reference each other in a reference
  cycle, but are not referenced by objects outside the group.  The goal of
  the [cyclic garbage collector](#term-garbage-collection) is to identify these groups and break the reference
  cycles so that the memory can be reclaimed.

<a id="term-data-race"></a>

data race
: A situation where multiple threads access the same memory location
  concurrently, at least one of the accesses is a write, and the threads
  do not use any synchronization to control their access.  Data races
  lead to [non-deterministic](#term-non-deterministic) behavior and can cause data corruption.
  Proper use of [locks](#term-lock) and other [synchronization primitives](#term-synchronization-primitive) prevents data races.  Note that data races
  can only happen in native code, but that [native code](#term-native-code) might be
  exposed in a Python API.  See also [race condition](#term-race-condition) and
  [thread-safe](#term-thread-safe).

<a id="term-deadlock"></a>

deadlock
: A situation in which two or more tasks (threads, processes, or coroutines)
  wait indefinitely for each other to release resources or complete actions,
  preventing any from making progress.  For example, if thread A holds lock
  1 and waits for lock 2, while thread B holds lock 2 and waits for lock 1,
  both threads will wait indefinitely.  In Python this often arises from
  acquiring multiple locks in conflicting orders or from circular
  join/await dependencies.  Deadlocks can be avoided by always acquiring
  multiple [locks](#term-lock) in a consistent order.  See also
  [lock](#term-lock) and [reentrant](#term-reentrant).

<a id="term-decorator"></a>

decorator
: A function returning another function, usually applied as a function
  transformation using the `@wrapper` syntax.  Common examples for
  decorators are [`classmethod()`](library/functions.md#classmethod) and [`staticmethod()`](library/functions.md#staticmethod).
  <br/>
  The decorator syntax is merely syntactic sugar, the following two
  function definitions are semantically equivalent:
  <br/>
  ```python3
  def f(arg):
      ...
  f = staticmethod(f)
  <br/>
  @staticmethod
  def f(arg):
      ...
  ```
  <br/>
  The same concept exists for classes, but is less commonly used there.  See
  the documentation for [function definitions](reference/compound_stmts.md#function) and
  [class definitions](reference/compound_stmts.md#class) for more about decorators.

<a id="term-descriptor"></a>

descriptor
: Any object which defines the methods [`__get__()`](reference/datamodel.md#object.__get__),
  [`__set__()`](reference/datamodel.md#object.__set__), or [`__delete__()`](reference/datamodel.md#object.__delete__).
  When a class attribute is a descriptor, its special
  binding behavior is triggered upon attribute lookup.  Normally, using
  *a.b* to get, set or delete an attribute looks up the object named *b* in
  the class dictionary for *a*, but if *b* is a descriptor, the respective
  descriptor method gets called.  Understanding descriptors is a key to a
  deep understanding of Python because they are the basis for many features
  including functions, methods, properties, class methods, static methods,
  and reference to super classes.
  <br/>
  For more information about descriptors’ methods, see [Implementing Descriptors](reference/datamodel.md#descriptors)
  or the [Descriptor How To Guide](howto/descriptor.md#descriptorhowto).

<a id="term-dictionary"></a>

dictionary
: An associative array, where arbitrary keys are mapped to values.  The
  keys can be any object with [`__hash__()`](reference/datamodel.md#object.__hash__) and
  [`__eq__()`](reference/datamodel.md#object.__eq__) methods.
  Called a hash in Perl.

<a id="term-dictionary-comprehension"></a>

dictionary comprehension
: A compact way to process all or part of the elements in an iterable and
  return a dictionary with the results. `results = {n: n ** 2 for n in
  range(10)}` generates a dictionary containing key `n` mapped to
  value `n ** 2`. See [Displays for lists, sets and dictionaries](reference/expressions.md#comprehensions).

<a id="term-dictionary-view"></a>

dictionary view
: The objects returned from [`dict.keys()`](library/stdtypes.md#dict.keys), [`dict.values()`](library/stdtypes.md#dict.values), and
  [`dict.items()`](library/stdtypes.md#dict.items) are called dictionary views. They provide a dynamic
  view on the dictionary’s entries, which means that when the dictionary
  changes, the view reflects these changes. To force the
  dictionary view to become a full list use `list(dictview)`.  See
  [Dictionary view objects](library/stdtypes.md#dict-views).

<a id="term-docstring"></a>

docstring
: A string literal which appears as the first expression in a class,
  function or module.  While ignored when the suite is executed, it is
  recognized by the compiler and put into the [`__doc__`](library/stdtypes.md#definition.__doc__) attribute
  of the enclosing class, function or module.  Since it is available via
  introspection, it is the canonical place for documentation of the
  object.

<a id="term-duck-typing"></a>

duck-typing
: A programming style which does not look at an object’s type to determine
  if it has the right interface; instead, the method or attribute is simply
  called or used (“If it looks like a duck and quacks like a duck, it
  must be a duck.”)  By emphasizing interfaces rather than specific types,
  well-designed code improves its flexibility by allowing polymorphic
  substitution.  Duck-typing avoids tests using [`type()`](library/functions.md#type) or
  [`isinstance()`](library/functions.md#isinstance).  (Note, however, that duck-typing can be complemented
  with [abstract base classes](#term-abstract-base-class).)  Instead, it
  typically employs [`hasattr()`](library/functions.md#hasattr) tests or [EAFP](#term-EAFP) programming.

<a id="term-dunder"></a>

dunder
: An informal short-hand for “double underscore”, used when talking about a
  [special method](#term-special-method). For example, `__init__` is often pronounced
  “dunder init”.

<a id="term-EAFP"></a>

EAFP
: Easier to ask for forgiveness than permission.  This common Python coding
  style assumes the existence of valid keys or attributes and catches
  exceptions if the assumption proves false.  This clean and fast style is
  characterized by the presence of many [`try`](reference/compound_stmts.md#try) and [`except`](reference/compound_stmts.md#except)
  statements.  The technique contrasts with the [LBYL](#term-LBYL) style
  common to many other languages such as C.

<a id="term-evaluate-function"></a>

evaluate function
: A function that can be called to evaluate a lazily evaluated attribute
  of an object, such as the value of type aliases created with the [`type`](reference/simple_stmts.md#type)
  statement.

<a id="term-expression"></a>

expression
: A piece of syntax which can be evaluated to some value.  In other words,
  an expression is an accumulation of expression elements like literals,
  names, attribute access, operators or function calls which all return a
  value.  In contrast to many other languages, not all language constructs
  are expressions.  There are also [statement](#term-statement)s which cannot be used
  as expressions, such as [`while`](reference/compound_stmts.md#while).  Assignments are also statements,
  not expressions.

<a id="term-extension-module"></a>

extension module
: A module written in C or C++, using Python’s C API to interact with the
  core and with user code.

<a id="term-f-string"></a>

f-string

<a id="term-f-strings"></a>

f-strings
: String literals prefixed with `f` or `F` are commonly called
  “f-strings” which is short for
  [formatted string literals](reference/lexical_analysis.md#f-strings).  See also [**PEP 498**](https://peps.python.org/pep-0498/).

<a id="term-file-object"></a>

file object
: An object exposing a file-oriented API (with methods such as
  `read()` or `write()`) to an underlying resource.  Depending
  on the way it was created, a file object can mediate access to a real
  on-disk file or to another type of storage or communication device
  (for example standard input/output, in-memory buffers, sockets, pipes,
  etc.).  File objects are also called *file-like objects* or
  *streams*.
  <br/>
  There are actually three categories of file objects: raw
  [binary files](#term-binary-file), buffered
  [binary files](#term-binary-file) and [text files](#term-text-file).
  Their interfaces are defined in the [`io`](library/io.md#module-io) module.  The canonical
  way to create a file object is by using the [`open()`](library/functions.md#open) function.

<a id="term-file-like-object"></a>

file-like object
: A synonym for [file object](#term-file-object).

<a id="term-filesystem-encoding-and-error-handler"></a>

filesystem encoding and error handler
: Encoding and error handler used by Python to decode bytes from the
  operating system and encode Unicode to the operating system.
  <br/>
  The filesystem encoding must guarantee to successfully decode all bytes
  below 128. If the file system encoding fails to provide this guarantee,
  API functions can raise [`UnicodeError`](library/exceptions.md#UnicodeError).
  <br/>
  The [`sys.getfilesystemencoding()`](library/sys.md#sys.getfilesystemencoding) and
  [`sys.getfilesystemencodeerrors()`](library/sys.md#sys.getfilesystemencodeerrors) functions can be used to get the
  filesystem encoding and error handler.
  <br/>
  The [filesystem encoding and error handler](#term-filesystem-encoding-and-error-handler) are configured at
  Python startup by the [`PyConfig_Read()`](c-api/init_config.md#c.PyConfig_Read) function: see
  [`filesystem_encoding`](c-api/init_config.md#c.PyConfig.filesystem_encoding) and
  [`filesystem_errors`](c-api/init_config.md#c.PyConfig.filesystem_errors) members of [`PyConfig`](c-api/init_config.md#c.PyConfig).
  <br/>
  See also the [locale encoding](#term-locale-encoding).

<a id="term-finder"></a>

finder
: An object that tries to find the [loader](#term-loader) for a module that is
  being imported.
  <br/>
  There are two types of finder: [meta path finders](#term-meta-path-finder) for use with [`sys.meta_path`](library/sys.md#sys.meta_path), and [path
  entry finders](#term-path-entry-finder) for use with [`sys.path_hooks`](library/sys.md#sys.path_hooks).
  <br/>
  See [Finders and loaders](reference/import.md#finders-and-loaders) and [`importlib`](library/importlib.md#module-importlib) for much more detail.

<a id="term-floor-division"></a>

floor division
: Mathematical division that rounds down to nearest integer.  The floor
  division operator is `//`.  For example, the expression `11 // 4`
  evaluates to `2` in contrast to the `2.75` returned by float true
  division.  Note that `(-11) // 4` is `-3` because that is `-2.75`
  rounded *downward*. See [**PEP 238**](https://peps.python.org/pep-0238/).

<a id="term-free-threading"></a>

free threading
: A threading model where multiple threads can run Python bytecode
  simultaneously within the same interpreter.  This is in contrast to
  the [global interpreter lock](#term-global-interpreter-lock) which allows only one thread to
  execute Python bytecode at a time.  See [**PEP 703**](https://peps.python.org/pep-0703/).

<a id="term-free-threaded-build"></a>

free-threaded build
: A build of [CPython](#term-CPython) that supports [free threading](#term-free-threading),
  configured using the [`--disable-gil`](using/configure.md#cmdoption-disable-gil) option before compilation.
  <br/>
  See [Python support for free threading](howto/free-threading-python.md#freethreading-python-howto).

<a id="term-free-variable"></a>

free variable
: Formally, as defined in the [language execution model](reference/executionmodel.md#bind-names), a free
  variable is any variable used in a namespace which is not a local variable in that
  namespace. See [closure variable](#term-closure-variable) for an example.
  Pragmatically, due to the name of the [`codeobject.co_freevars`](reference/datamodel.md#codeobject.co_freevars) attribute,
  the term is also sometimes used as a synonym for [closure variable](#term-closure-variable).

<a id="term-function"></a>

function
: A series of statements which returns some value to a caller. It can also
  be passed zero or more [arguments](#term-argument) which may be used in
  the execution of the body. See also [parameter](#term-parameter), [method](#term-method),
  and the [Function definitions](reference/compound_stmts.md#function) section.

<a id="term-function-annotation"></a>

function annotation
: An [annotation](#term-annotation) of a function parameter or return value.
  <br/>
  Function annotations are usually used for
  [type hints](#term-type-hint): for example, this function is expected to take two
  [`int`](library/functions.md#int) arguments and is also expected to have an [`int`](library/functions.md#int)
  return value:
  <br/>
  ```python3
  def sum_two_numbers(a: int, b: int) -> int:
     return a + b
  ```
  <br/>
  Function annotation syntax is explained in section [Function definitions](reference/compound_stmts.md#function).
  <br/>
  See [variable annotation](#term-variable-annotation) and [**PEP 484**](https://peps.python.org/pep-0484/),
  which describe this functionality.
  Also see [Annotations Best Practices](howto/annotations.md#annotations-howto)
  for best practices on working with annotations.

<a id="term-__future__"></a>

\_\_future_\_
: A [future statement](reference/simple_stmts.md#future), `from __future__ import <feature>`,
  directs the compiler to compile the current module using syntax or
  semantics that will become standard in a future release of Python.
  The [`__future__`](library/__future__.md#module-__future__) module documents the possible values of
  *feature*.  By importing this module and evaluating its variables,
  you can see when a new feature was first added to the language and
  when it will (or did) become the default:
  <br/>
  ```python3
  >>> import __future__
  >>> __future__.division
  _Feature((2, 2, 0, 'alpha', 2), (3, 0, 0, 'alpha', 0), 8192)
  ```

<a id="term-garbage-collection"></a>

garbage collection
: The process of freeing memory when it is not used anymore.  Python
  performs garbage collection via reference counting and a cyclic garbage
  collector that is able to detect and break reference cycles.  The
  garbage collector can be controlled using the [`gc`](library/gc.md#module-gc) module.
  <br/>
  <a id="index-20"></a>

<a id="term-generator"></a>

generator
: A function which returns a [generator iterator](#term-generator-iterator).  It looks like a
  normal function except that it contains [`yield`](reference/simple_stmts.md#yield) expressions
  for producing a series of values usable in a for-loop or that can be
  retrieved one at a time with the [`next()`](library/functions.md#next) function.
  <br/>
  Usually refers to a generator function, but may refer to a
  *generator iterator* in some contexts.  In cases where the intended
  meaning isn’t clear, using the full terms avoids ambiguity.

<a id="term-generator-iterator"></a>

generator iterator
: An object created by a [generator](#term-generator) function.
  <br/>
  Each [`yield`](reference/simple_stmts.md#yield) temporarily suspends processing, remembering the
  execution state (including local variables and pending
  try-statements).  When the *generator iterator* resumes, it picks up where
  it left off (in contrast to functions which start fresh on every
  invocation).
  <br/>
  <a id="index-21"></a>

<a id="term-generator-expression"></a>

generator expression
: An [expression](#term-expression) that returns an [iterator](#term-iterator).  It looks like a normal expression
  followed by a `for` clause defining a loop variable, range,
  and an optional `if` clause.  The combined expression
  generates values for an enclosing function:
  <br/>
  ```python3
  >>> sum(i*i for i in range(10))         # sum of squares 0, 1, 4, ... 81
  285
  ```

<a id="term-generic-function"></a>

generic function
: A function composed of multiple functions implementing the same operation
  for different types. Which implementation should be used during a call is
  determined by the dispatch algorithm.
  <br/>
  See also the [single dispatch](#term-single-dispatch) glossary entry, the
  [`functools.singledispatch()`](library/functools.md#functools.singledispatch) decorator, and [**PEP 443**](https://peps.python.org/pep-0443/).

<a id="term-generic-type"></a>

generic type
: A [type](#term-type) that can be parameterized; typically a
  [container class](reference/datamodel.md#sequence-types) such as [`list`](library/stdtypes.md#list) or
  [`dict`](library/stdtypes.md#dict). Used for [type hints](#term-type-hint) and
  [annotations](#term-annotation).
  <br/>
  For more details, see [generic alias types](library/stdtypes.md#types-genericalias),
  [**PEP 483**](https://peps.python.org/pep-0483/), [**PEP 484**](https://peps.python.org/pep-0484/), [**PEP 585**](https://peps.python.org/pep-0585/), and the [`typing`](library/typing.md#module-typing) module.

<a id="term-GIL"></a>

GIL
: See [global interpreter lock](#term-global-interpreter-lock).

<a id="term-global-interpreter-lock"></a>

global interpreter lock
: The mechanism used by the [CPython](#term-CPython) interpreter to assure that
  only one thread executes Python [bytecode](#term-bytecode) at a time.
  This simplifies the CPython implementation by making the object model
  (including critical built-in types such as [`dict`](library/stdtypes.md#dict)) implicitly
  safe against concurrent access.  Locking the entire interpreter
  makes it easier for the interpreter to be multi-threaded, at the
  expense of much of the parallelism afforded by multi-processor
  machines.
  <br/>
  However, some extension modules, either standard or third-party,
  are designed so as to release the GIL when doing computationally intensive
  tasks such as compression or hashing.  Also, the GIL is always released
  when doing I/O.
  <br/>
  As of Python 3.13, the GIL can be disabled using the [`--disable-gil`](using/configure.md#cmdoption-disable-gil)
  build configuration. After building Python with this option, code must be
  run with [`-X gil=0`](using/cmdline.md#cmdoption-X) or after setting the [`PYTHON_GIL=0`](using/cmdline.md#envvar-PYTHON_GIL)
  environment variable. This feature enables improved performance for
  multi-threaded applications and makes it easier to use multi-core CPUs
  efficiently. For more details, see [**PEP 703**](https://peps.python.org/pep-0703/).
  <br/>
  In prior versions of Python’s C API, a function might declare that it
  requires the GIL to be held in order to use it. This refers to having an
  [attached thread state](#term-attached-thread-state).

<a id="term-global-state"></a>

global state
: Data that is accessible throughout a program, such as module-level
  variables, class variables, or C static variables in [extension modules](#term-extension-module).  In multi-threaded programs, global state shared
  between threads typically requires synchronization to avoid
  [race conditions](#term-race-condition) and
  [data races](#term-data-race).

<a id="term-hash-based-pyc"></a>

hash-based pyc
: A bytecode cache file that uses the hash rather than the last-modified
  time of the corresponding source file to determine its validity. See
  [Cached bytecode invalidation](reference/import.md#pyc-invalidation).

<a id="term-hashable"></a>

hashable
: An object is *hashable* if it has a hash value which never changes during
  its lifetime (it needs a [`__hash__()`](reference/datamodel.md#object.__hash__) method), and can be
  compared to other objects (it needs an [`__eq__()`](reference/datamodel.md#object.__eq__) method).
  Hashable objects which
  compare equal must have the same hash value.
  <br/>
  Hashability makes an object usable as a dictionary key and a set member,
  because these data structures use the hash value internally.
  <br/>
  Most of Python’s immutable built-in objects are hashable; mutable
  containers (such as lists or dictionaries) are not; immutable
  containers (such as tuples and frozensets) are only hashable if
  their elements are hashable.  Objects which are
  instances of user-defined classes are hashable by default.  They all
  compare unequal (except with themselves), and their hash value is derived
  from their [`id()`](library/functions.md#id).

<a id="term-IDLE"></a>

IDLE
: An Integrated Development and Learning Environment for Python.
  [IDLE — Python editor and shell](library/idle.md#idle) is a basic editor and interpreter environment
  which ships with the standard distribution of Python.

<a id="term-immortal"></a>

immortal
: *Immortal objects* are a CPython implementation detail introduced
  in [**PEP 683**](https://peps.python.org/pep-0683/).
  <br/>
  If an object is immortal, its [reference count](#term-reference-count) is never modified,
  and therefore it is never deallocated while the interpreter is running.
  For example, [`True`](library/constants.md#True) and [`None`](library/constants.md#None) are immortal in CPython.
  <br/>
  Immortal objects can be identified via [`sys._is_immortal()`](library/sys.md#sys._is_immortal), or
  via [`PyUnstable_IsImmortal()`](c-api/object.md#c.PyUnstable_IsImmortal) in the C API.

<a id="term-immutable"></a>

immutable
: An object with a fixed value.  Immutable objects include numbers, strings and
  tuples.  Such an object cannot be altered.  A new object has to
  be created if a different value has to be stored.  They play an important
  role in places where a constant hash value is needed, for example as a key
  in a dictionary.  Immutable objects are inherently [thread-safe](#term-thread-safe)
  because their state cannot be modified after creation, eliminating concerns
  about improperly synchronized [concurrent modification](#term-concurrent-modification).

<a id="term-import-path"></a>

import path
: A list of locations (or [path entries](#term-path-entry)) that are
  searched by the [path based finder](#term-path-based-finder) for modules to import. During
  import, this list of locations usually comes from [`sys.path`](library/sys.md#sys.path), but
  for subpackages it may also come from the parent package’s `__path__`
  attribute.

<a id="term-importing"></a>

importing
: The process by which Python code in one module is made available to
  Python code in another module.

<a id="term-importer"></a>

importer
: An object that both finds and loads a module; both a
  [finder](#term-finder) and [loader](#term-loader) object.

<a id="term-index"></a>

index
: A numeric value that represents the position of an element in
  a [sequence](#term-sequence).
  <br/>
  In Python, indexing starts at zero.
  For example, `things[0]` names the *first* element of `things`;
  `things[1]` names the second one.
  <br/>
  In some contexts, Python allows negative indexes for counting from the
  end of a sequence, and indexing using [slices](#term-slice).
  <br/>
  See also [subscript](#term-subscript).

<a id="term-interactive"></a>

interactive
: Python has an interactive interpreter which means you can enter
  statements and expressions at the interpreter prompt, immediately
  execute them and see their results.  Just launch `python` with no
  arguments (possibly by selecting it from your computer’s main
  menu). It is a very powerful way to test out new ideas or inspect
  modules and packages (remember `help(x)`). For more on interactive
  mode, see [Interactive Mode](tutorial/appendix.md#tut-interac).

<a id="term-interpreted"></a>

interpreted
: Python is an interpreted language, as opposed to a compiled one,
  though the distinction can be blurry because of the presence of the
  bytecode compiler.  This means that source files can be run directly
  without explicitly creating an executable which is then run.
  Interpreted languages typically have a shorter development/debug cycle
  than compiled ones, though their programs generally also run more
  slowly.  See also [interactive](#term-interactive).

<a id="term-interpreter-shutdown"></a>

interpreter shutdown
: When asked to shut down, the Python interpreter enters a special phase
  where it gradually releases all allocated resources, such as modules
  and various critical internal structures.  It also makes several calls
  to the [garbage collector](#term-garbage-collection). This can trigger
  the execution of code in user-defined destructors or weakref callbacks.
  Code executed during the shutdown phase can encounter various
  exceptions as the resources it relies on may not function anymore
  (common examples are library modules or the warnings machinery).
  <br/>
  The main reason for interpreter shutdown is that the `__main__` module
  or the script being run has finished executing.

<a id="term-iterable"></a>

iterable
: An object capable of returning its members one at a time. Examples of
  iterables include all sequence types (such as [`list`](library/stdtypes.md#list), [`str`](library/stdtypes.md#str),
  and [`tuple`](library/stdtypes.md#tuple)) and some non-sequence types like [`dict`](library/stdtypes.md#dict),
  [file objects](#term-file-object), and objects of any classes you define
  with an [`__iter__()`](reference/datamodel.md#object.__iter__) method or with a
  [`__getitem__()`](reference/datamodel.md#object.__getitem__) method
  that implements [sequence](#term-sequence) semantics.
  <br/>
  Iterables can be
  used in a [`for`](reference/compound_stmts.md#for) loop and in many other places where a sequence is
  needed ([`zip()`](library/functions.md#zip), [`map()`](library/functions.md#map), …).  When an iterable object is passed
  as an argument to the built-in function [`iter()`](library/functions.md#iter), it returns an
  iterator for the object.  This iterator is good for one pass over the set
  of values.  When using iterables, it is usually not necessary to call
  [`iter()`](library/functions.md#iter) or deal with iterator objects yourself.  The [`for`](reference/compound_stmts.md#for)
  statement does that automatically for you, creating a temporary unnamed
  variable to hold the iterator for the duration of the loop.  See also
  [iterator](#term-iterator), [sequence](#term-sequence), and [generator](#term-generator).

<a id="term-iterator"></a>

iterator
: An object representing a stream of data.  Repeated calls to the iterator’s
  [`__next__()`](library/stdtypes.md#iterator.__next__) method (or passing it to the built-in function
  [`next()`](library/functions.md#next)) return successive items in the stream.  When no more data
  are available a [`StopIteration`](library/exceptions.md#StopIteration) exception is raised instead.  At this
  point, the iterator object is exhausted and any further calls to its
  `__next__()` method just raise [`StopIteration`](library/exceptions.md#StopIteration) again.  Iterators
  are required to have an [`__iter__()`](library/stdtypes.md#iterator.__iter__) method that returns the iterator
  object itself so every iterator is also iterable and may be used in most
  places where other iterables are accepted.  One notable exception is code
  which attempts multiple iteration passes.  A container object (such as a
  [`list`](library/stdtypes.md#list)) produces a fresh new iterator each time you pass it to the
  [`iter()`](library/functions.md#iter) function or use it in a [`for`](reference/compound_stmts.md#for) loop.  Attempting this
  with an iterator will just return the same exhausted iterator object used
  in the previous iteration pass, making it appear like an empty container.
  <br/>
  More information can be found in [Iterator Types](library/stdtypes.md#typeiter).
  <br/>
  **CPython implementation detail:** CPython does not consistently apply the requirement that an iterator
  define [`__iter__()`](library/stdtypes.md#iterator.__iter__).
  And also please note that [free-threaded](#term-free-threading)
  CPython does not guarantee [thread-safe](#term-thread-safe) behavior of iterator
  operations.

<a id="term-key"></a>

key
: A value that identifies an entry in a [mapping](#term-mapping).
  See also [subscript](#term-subscript).

<a id="term-key-function"></a>

key function
: A key function or collation function is a callable that returns a value
  used for sorting or ordering.  For example, [`locale.strxfrm()`](library/locale.md#locale.strxfrm) is
  used to produce a sort key that is aware of locale specific sort
  conventions.
  <br/>
  A number of tools in Python accept key functions to control how elements
  are ordered or grouped.  They include [`min()`](library/functions.md#min), [`max()`](library/functions.md#max),
  [`sorted()`](library/functions.md#sorted), [`list.sort()`](library/stdtypes.md#list.sort), [`heapq.merge()`](library/heapq.md#heapq.merge),
  [`heapq.nsmallest()`](library/heapq.md#heapq.nsmallest), [`heapq.nlargest()`](library/heapq.md#heapq.nlargest), and
  [`itertools.groupby()`](library/itertools.md#itertools.groupby).
  <br/>
  There are several ways to create a key function.  For example. the
  [`str.casefold()`](library/stdtypes.md#str.casefold) method can serve as a key function for case insensitive
  sorts.  Alternatively, a key function can be built from a
  [`lambda`](reference/expressions.md#lambda) expression such as `lambda r: (r[0], r[2])`.  Also,
  [`operator.attrgetter()`](library/operator.md#operator.attrgetter), [`operator.itemgetter()`](library/operator.md#operator.itemgetter), and
  [`operator.methodcaller()`](library/operator.md#operator.methodcaller) are three key function constructors.  See the [Sorting HOW TO](howto/sorting.md#sortinghowto) for examples of how to create and use key functions.

<a id="term-keyword-argument"></a>

keyword argument
: See [argument](#term-argument).

<a id="term-lambda"></a>

lambda
: An anonymous inline function consisting of a single [expression](#term-expression)
  which is evaluated when the function is called.  The syntax to create
  a lambda function is `lambda [parameters]: expression`

<a id="term-LBYL"></a>

LBYL
: Look before you leap.  This coding style explicitly tests for
  pre-conditions before making calls or lookups.  This style contrasts with
  the [EAFP](#term-EAFP) approach and is characterized by the presence of many
  [`if`](reference/compound_stmts.md#if) statements.
  <br/>
  In a multi-threaded environment, the LBYL approach can risk introducing a
  [race condition](#term-race-condition) between “the looking” and “the leaping”.  For example,
  the code, `if key in mapping: return mapping[key]` can fail if another
  thread removes *key* from *mapping* after the test, but before the lookup.
  This issue can be solved with [locks](#term-lock) or by using the
  [EAFP](#term-EAFP) approach.  See also [thread-safe](#term-thread-safe).

<a id="term-lexical-analyzer"></a>

lexical analyzer
: Formal name for the *tokenizer*; see [token](#term-token).

<a id="term-list"></a>

list
: A built-in Python [sequence](#term-sequence).  Despite its name it is more akin
  to an array in other languages than to a linked list since access to
  elements is *O*(1).

<a id="term-list-comprehension"></a>

list comprehension
: A compact way to process all or part of the elements in a sequence and
  return a list with the results.  `result = ['{:#04x}'.format(x) for x in
  range(256) if x % 2 == 0]` generates a list of strings containing
  even hex numbers (0x..) in the range from 0 to 255. The [`if`](reference/compound_stmts.md#if)
  clause is optional.  If omitted, all elements in `range(256)` are
  processed.

<a id="term-lock"></a>

lock
: A [synchronization primitive](#term-synchronization-primitive) that allows only one thread at a
  time to access a shared resource.  A thread must acquire a lock before
  accessing the protected resource and release it afterward.  If a thread
  attempts to acquire a lock that is already held by another thread, it
  will block until the lock becomes available.  Python’s [`threading`](library/threading.md#module-threading)
  module provides [`Lock`](library/threading.md#threading.Lock) (a basic lock) and
  [`RLock`](library/threading.md#threading.RLock) (a [reentrant](#term-reentrant) lock).  Locks are used
  to prevent [race conditions](#term-race-condition) and ensure
  [thread-safe](#term-thread-safe) access to shared data.  Alternative design patterns
  to locks exist such as queues, producer/consumer patterns, and
  thread-local state. See also [deadlock](#term-deadlock), and [reentrant](#term-reentrant).

<a id="term-lock-free"></a>

lock-free
: An operation that does not acquire any [lock](#term-lock) and uses atomic CPU
  instructions to ensure correctness. Lock-free operations can execute
  concurrently without blocking each other and cannot be blocked by
  operations that hold locks. In [free-threaded](#term-free-threading)
  Python, built-in types like [`dict`](library/stdtypes.md#dict) and [`list`](library/stdtypes.md#list) provide
  lock-free read operations, which means other threads may observe
  intermediate states during multi-step modifications even when those
  modifications hold the [per-object lock](#term-per-object-lock).

<a id="term-loader"></a>

loader
: An object that loads a module.
  It must define the `exec_module()` and `create_module()` methods
  to implement the [`Loader`](library/importlib.md#importlib.abc.Loader) interface.
  A loader is typically returned by a [finder](#term-finder).
  See also:
  <br/>
  * [Finders and loaders](reference/import.md#finders-and-loaders)
  * [`importlib.abc.Loader`](library/importlib.md#importlib.abc.Loader)
  * [**PEP 302**](https://peps.python.org/pep-0302/)

<a id="term-locale-encoding"></a>

locale encoding
: On Unix, it is the encoding of the LC_CTYPE locale. It can be set with
  [`locale.setlocale(locale.LC_CTYPE, new_locale)`](library/locale.md#locale.setlocale).
  <br/>
  On Windows, it is the ANSI code page (ex: `"cp1252"`).
  <br/>
  On Android and VxWorks, Python uses `"utf-8"` as the locale encoding.
  <br/>
  [`locale.getencoding()`](library/locale.md#locale.getencoding) can be used to get the locale encoding.
  <br/>
  See also the [filesystem encoding and error handler](#term-filesystem-encoding-and-error-handler).

<a id="term-magic-method"></a>

magic method
: <a id="index-30"></a>
  <br/>
  An informal synonym for [special method](#term-special-method).

<a id="term-mapping"></a>

mapping
: A container object that supports arbitrary key lookups and implements the
  methods specified in the [`collections.abc.Mapping`](library/collections.abc.md#collections.abc.Mapping) or
  [`collections.abc.MutableMapping`](library/collections.abc.md#collections.abc.MutableMapping)
  [abstract base classes](library/collections.abc.md#collections-abstract-base-classes).  Examples
  include [`dict`](library/stdtypes.md#dict), [`collections.defaultdict`](library/collections.md#collections.defaultdict),
  [`collections.OrderedDict`](library/collections.md#collections.OrderedDict) and [`collections.Counter`](library/collections.md#collections.Counter).

<a id="term-meta-path-finder"></a>

meta path finder
: A [finder](#term-finder) returned by a search of [`sys.meta_path`](library/sys.md#sys.meta_path).  Meta path
  finders are related to, but different from [path entry finders](#term-path-entry-finder).
  <br/>
  See [`importlib.abc.MetaPathFinder`](library/importlib.md#importlib.abc.MetaPathFinder) for the methods that meta path
  finders implement.

<a id="term-metaclass"></a>

metaclass
: The class of a class.  Class definitions create a class name, a class
  dictionary, and a list of base classes.  The metaclass is responsible for
  taking those three arguments and creating the class.  Most object oriented
  programming languages provide a default implementation.  What makes Python
  special is that it is possible to create custom metaclasses.  Most users
  never need this tool, but when the need arises, metaclasses can provide
  powerful, elegant solutions.  They have been used for logging attribute
  access, adding thread-safety, tracking object creation, implementing
  singletons, and many other tasks.
  <br/>
  More information can be found in [Metaclasses](reference/datamodel.md#metaclasses).

<a id="term-method"></a>

method
: A function which is defined inside a class body.  If called as an attribute
  of an instance of that class, the method will get the instance object as
  its first [argument](#term-argument) (which is usually called `self`).
  See [function](#term-function) and [nested scope](#term-nested-scope).

<a id="term-method-resolution-order"></a>

method resolution order
: Method Resolution Order is the order in which base classes are searched
  for a member during lookup. See [The Python 2.3 Method Resolution Order](howto/mro.md#python-2-3-mro) for details of the
  algorithm used by the Python interpreter since the 2.3 release.

<a id="term-module"></a>

module
: An object that serves as an organizational unit of Python code.  Modules
  have a namespace containing arbitrary Python objects.  Modules are loaded
  into Python by the process of [importing](#term-importing).
  <br/>
  See also [package](#term-package).

<a id="term-module-spec"></a>

module spec
: A namespace containing the import-related information used to load a
  module. An instance of [`importlib.machinery.ModuleSpec`](library/importlib.md#importlib.machinery.ModuleSpec).
  <br/>
  See also [Module specs](reference/import.md#module-specs).

<a id="term-MRO"></a>

MRO
: See [method resolution order](#term-method-resolution-order).

<a id="term-mutable"></a>

mutable
: An [object](#term-object) with state that is allowed to change during the course
  of the program.  In multi-threaded programs, mutable objects that are
  shared between threads require careful synchronization to avoid
  [race conditions](#term-race-condition).  See also [immutable](#term-immutable),
  [thread-safe](#term-thread-safe), and [concurrent modification](#term-concurrent-modification).

<a id="term-named-tuple"></a>

named tuple
: The term “named tuple” applies to any type or class that inherits from
  tuple and whose indexable elements are also accessible using named
  attributes.  The type or class may have other features as well.
  <br/>
  Several built-in types are named tuples, including the values returned
  by [`time.localtime()`](library/time.md#time.localtime) and [`os.stat()`](library/os.md#os.stat).  Another example is
  [`sys.float_info`](library/sys.md#sys.float_info):
  <br/>
  ```python3
  >>> sys.float_info[1]                   # indexed access
  1024
  >>> sys.float_info.max_exp              # named field access
  1024
  >>> isinstance(sys.float_info, tuple)   # kind of tuple
  True
  ```
  <br/>
  Some named tuples are built-in types (such as the above examples).
  Alternatively, a named tuple can be created from a regular class
  definition that inherits from [`tuple`](library/stdtypes.md#tuple) and that defines named
  fields.  Such a class can be written by hand, or it can be created by
  inheriting [`typing.NamedTuple`](library/typing.md#typing.NamedTuple), or with the factory function
  [`collections.namedtuple()`](library/collections.md#collections.namedtuple).  The latter techniques also add some
  extra methods that may not be found in hand-written or built-in named
  tuples.

<a id="term-namespace"></a>

namespace
: The place where a variable is stored.  Namespaces are implemented as
  dictionaries.  There are the local, global and built-in namespaces as well
  as nested namespaces in objects (in methods).  Namespaces support
  modularity by preventing naming conflicts.  For instance, the functions
  [`builtins.open`](library/functions.md#open) and [`os.open()`](library/os.md#os.open) are distinguished by
  their namespaces.  Namespaces also aid readability and maintainability by
  making it clear which module implements a function.  For instance, writing
  [`random.seed()`](library/random.md#random.seed) or [`itertools.islice()`](library/itertools.md#itertools.islice) makes it clear that those
  functions are implemented by the [`random`](library/random.md#module-random) and [`itertools`](library/itertools.md#module-itertools)
  modules, respectively.

<a id="term-namespace-package"></a>

namespace package
: A [package](#term-package) which serves only as a container for subpackages.
  Namespace packages may have no physical representation,
  and specifically are not like a [regular package](#term-regular-package) because they
  have no `__init__.py` file.
  <br/>
  Namespace packages allow several individually installable packages to have a common parent package.
  Otherwise, it is recommended to use a [regular package](#term-regular-package).
  <br/>
  For more information, see [**PEP 420**](https://peps.python.org/pep-0420/) and [Namespace packages](reference/import.md#reference-namespace-package).
  <br/>
  See also [module](#term-module).

<a id="term-native-code"></a>

native code
: Code that is compiled to machine instructions and runs directly on the
  processor, as opposed to code that is interpreted or runs in a virtual
  machine.  In the context of Python, native code typically refers to
  C, C++, Rust or Fortran code in [extension modules](#term-extension-module)
  that can be called from Python.  See also [extension module](#term-extension-module).

<a id="term-nested-scope"></a>

nested scope
: The ability to refer to a variable in an enclosing definition.  For
  instance, a function defined inside another function can refer to
  variables in the outer function.  Note that nested scopes by default work
  only for reference and not for assignment.  Local variables both read and
  write in the innermost scope.  Likewise, global variables read and write
  to the global namespace.  The [`nonlocal`](reference/simple_stmts.md#nonlocal) allows writing to outer
  scopes.

<a id="term-new-style-class"></a>

new-style class
: Old name for the flavor of classes now used for all class objects.  In
  earlier Python versions, only new-style classes could use Python’s newer,
  versatile features like [`__slots__`](reference/datamodel.md#object.__slots__), descriptors,
  properties, [`__getattribute__()`](reference/datamodel.md#object.__getattribute__), class methods, and static
  methods.

<a id="term-non-deterministic"></a>

non-deterministic
: Behavior where the outcome of a program can vary between executions with
  the same inputs.  In multi-threaded programs, non-deterministic behavior
  often results from [race conditions](#term-race-condition) where the
  relative timing or interleaving of threads affects the result.
  Proper synchronization using [locks](#term-lock) and other
  [synchronization primitives](#term-synchronization-primitive) helps
  ensure deterministic behavior.

<a id="term-object"></a>

object
: Any data with state (attributes or value) and defined behavior
  (methods).  Also the ultimate base class of any [new-style
  class](#term-new-style-class).

<a id="term-optimized-scope"></a>

optimized scope
: A scope where target local variable names are reliably known to the
  compiler when the code is compiled, allowing optimization of read and
  write access to these names. The local namespaces for functions,
  generators, coroutines, comprehensions, and generator expressions are
  optimized in this fashion. Note: most interpreter optimizations are
  applied to all scopes, only those relying on a known set of local
  and nonlocal variable names are restricted to optimized scopes.

<a id="term-optional-module"></a>

optional module
: An [extension module](#term-extension-module) that is part of the [standard library](#term-standard-library),
  but may be absent in some builds of [CPython](#term-CPython),
  usually due to missing third-party libraries or because the module
  is not available for a given platform.
  <br/>
  See [Requirements for optional modules](using/configure.md#optional-module-requirements) for a list of optional modules
  that require third-party libraries.

<a id="term-package"></a>

package
: A Python [module](#term-module) which can contain submodules or recursively,
  subpackages.  Technically, a package is a Python module with a
  `__path__` attribute.
  <br/>
  See also [regular package](#term-regular-package) and [namespace package](#term-namespace-package).

<a id="term-parallelism"></a>

parallelism
: Executing multiple operations at the same time (e.g. on multiple CPU
  cores).  In Python builds with the
  [global interpreter lock (GIL)](#term-global-interpreter-lock), only one
  thread runs Python bytecode at a time, so taking advantage of multiple
  CPU cores typically involves multiple processes
  (e.g. [`multiprocessing`](library/multiprocessing.md#module-multiprocessing)) or native extensions that release the GIL.
  In [free-threaded](#term-free-threading) Python, multiple Python threads
  can run Python code simultaneously on different cores.

<a id="term-parameter"></a>

parameter
: A named entity in a [function](#term-function) (or method) definition that
  specifies an [argument](#term-argument) (or in some cases, arguments) that the
  function can accept.  There are five kinds of parameter:
  <br/>
  * *positional-or-keyword*: specifies an argument that can be passed
    either [positionally](#term-argument) or as a [keyword argument](#term-argument).  This is the default kind of parameter, for example *foo*
    and *bar* in the following:
    ```python3
    def func(foo, bar=None): ...
    ```
  <br/>
  <a id="positional-only-parameter"></a>
  * *positional-only*: specifies an argument that can be supplied only
    by position. Positional-only parameters can be defined by including a
    `/` character in the parameter list of the function definition after
    them, for example *posonly1* and *posonly2* in the following:
    ```python3
    def func(posonly1, posonly2, /, positional_or_keyword): ...
    ```
  <br/>
  <a id="keyword-only-parameter"></a>
  * *keyword-only*: specifies an argument that can be supplied only
    by keyword.  Keyword-only parameters can be defined by including a
    single var-positional parameter or bare `*` in the parameter list
    of the function definition before them, for example *kw_only1* and
    *kw_only2* in the following:
    ```python3
    def func(arg, *, kw_only1, kw_only2): ...
    ```
  * *var-positional*: specifies that an arbitrary sequence of
    positional arguments can be provided (in addition to any positional
    arguments already accepted by other parameters).  Such a parameter can
    be defined by prepending the parameter name with `*`, for example
    *args* in the following:
    ```python3
    def func(*args, **kwargs): ...
    ```
  * *var-keyword*: specifies that arbitrarily many keyword arguments
    can be provided (in addition to any keyword arguments already accepted
    by other parameters).  Such a parameter can be defined by prepending
    the parameter name with `**`, for example *kwargs* in the example
    above.
  <br/>
  Parameters can specify both optional and required arguments, as well as
  default values for some optional arguments.
  <br/>
  See also the [argument](#term-argument) glossary entry, the FAQ question on
  [the difference between arguments and parameters](faq/programming.md#faq-argument-vs-parameter), the [`inspect.Parameter`](library/inspect.md#inspect.Parameter) class, the
  [Function definitions](reference/compound_stmts.md#function) section, and [**PEP 362**](https://peps.python.org/pep-0362/).

<a id="term-per-object-lock"></a>

per-object lock
: A [lock](#term-lock) associated with an individual object instance rather than
  a global lock shared across all objects. In [free-threaded](#term-free-threading) Python, built-in types like [`dict`](library/stdtypes.md#dict) and
  [`list`](library/stdtypes.md#list) use per-object locks to allow concurrent operations on
  different objects while serializing operations on the same object.
  Operations that hold the per-object lock prevent other locking operations
  on the same object from proceeding, but do not block [lock-free](#term-lock-free)
  operations.

<a id="term-path-entry"></a>

path entry
: A single location on the [import path](#term-import-path) which the [path
  based finder](#term-path-based-finder) consults to find modules for importing.

<a id="term-path-entry-finder"></a>

path entry finder
: A [finder](#term-finder) returned by a callable on [`sys.path_hooks`](library/sys.md#sys.path_hooks)
  (i.e. a [path entry hook](#term-path-entry-hook)) which knows how to locate modules given
  a [path entry](#term-path-entry).
  <br/>
  See [`importlib.abc.PathEntryFinder`](library/importlib.md#importlib.abc.PathEntryFinder) for the methods that path entry
  finders implement.

<a id="term-path-entry-hook"></a>

path entry hook
: A callable on the [`sys.path_hooks`](library/sys.md#sys.path_hooks) list which returns a [path
  entry finder](#term-path-entry-finder) if it knows how to find modules on a specific [path
  entry](#term-path-entry).

<a id="term-path-based-finder"></a>

path based finder
: One of the default [meta path finders](#term-meta-path-finder) which
  searches an [import path](#term-import-path) for modules.

<a id="term-path-like-object"></a>

path-like object
: An object representing a file system path. A path-like object is either
  a [`str`](library/stdtypes.md#str) or [`bytes`](library/stdtypes.md#bytes) object representing a path, or an object
  implementing the [`os.PathLike`](library/os.md#os.PathLike) protocol. An object that supports
  the [`os.PathLike`](library/os.md#os.PathLike) protocol can be converted to a [`str`](library/stdtypes.md#str) or
  [`bytes`](library/stdtypes.md#bytes) file system path by calling the [`os.fspath()`](library/os.md#os.fspath) function;
  [`os.fsdecode()`](library/os.md#os.fsdecode) and [`os.fsencode()`](library/os.md#os.fsencode) can be used to guarantee a
  [`str`](library/stdtypes.md#str) or [`bytes`](library/stdtypes.md#bytes) result instead, respectively. Introduced
  by [**PEP 519**](https://peps.python.org/pep-0519/).

<a id="term-PEP"></a>

PEP
: Python Enhancement Proposal. A PEP is a design document
  providing information to the Python community, or describing a new
  feature for Python or its processes or environment. PEPs should
  provide a concise technical specification and a rationale for proposed
  features.
  <br/>
  PEPs are intended to be the primary mechanisms for proposing major new
  features, for collecting community input on an issue, and for documenting
  the design decisions that have gone into Python. The PEP author is
  responsible for building consensus within the community and documenting
  dissenting opinions.
  <br/>
  See [**PEP 1**](https://peps.python.org/pep-0001/).

<a id="term-portion"></a>

portion
: A set of files in a single directory (possibly stored in a zip file)
  that contribute to a namespace package, as defined in [**PEP 420**](https://peps.python.org/pep-0420/).

<a id="term-positional-argument"></a>

positional argument
: See [argument](#term-argument).

<a id="term-provisional-API"></a>

provisional API
: A provisional API is one which has been deliberately excluded from
  the standard library’s backwards compatibility guarantees.  While major
  changes to such interfaces are not expected, as long as they are marked
  provisional, backwards incompatible changes (up to and including removal
  of the interface) may occur if deemed necessary by core developers.  Such
  changes will not be made gratuitously – they will occur only if serious
  fundamental flaws are uncovered that were missed prior to the inclusion
  of the API.
  <br/>
  Even for provisional APIs, backwards incompatible changes are seen as
  a “solution of last resort” - every attempt will still be made to find
  a backwards compatible resolution to any identified problems.
  <br/>
  This process allows the standard library to continue to evolve over
  time, without locking in problematic design errors for extended periods
  of time.  See [**PEP 411**](https://peps.python.org/pep-0411/) for more details.

<a id="term-provisional-package"></a>

provisional package
: See [provisional API](#term-provisional-API).

<a id="term-Python-3000"></a>

Python 3000
: Nickname for the Python 3.x release line (coined long ago when the
  release of version 3 was something in the distant future.)  This is also
  abbreviated “Py3k”.

<a id="term-Pythonic"></a>

Pythonic
: An idea or piece of code which closely follows the most common idioms
  of the Python language, rather than implementing code using concepts
  common to other languages.  For example, a common idiom in Python is
  to loop over all elements of an iterable using a [`for`](reference/compound_stmts.md#for)
  statement.  Many other languages don’t have this type of construct, so
  people unfamiliar with Python sometimes use a numerical counter instead:
  <br/>
  ```python3
  for i in range(len(food)):
      print(food[i])
  ```
  <br/>
  As opposed to the cleaner, Pythonic method:
  <br/>
  ```python3
  for piece in food:
      print(piece)
  ```

<a id="term-qualified-name"></a>

qualified name
: A dotted name showing the “path” from a module’s global scope to a
  class, function or method defined in that module, as defined in
  [**PEP 3155**](https://peps.python.org/pep-3155/).  For top-level functions and classes, the qualified name
  is the same as the object’s name:
  <br/>
  ```python3
  >>> class C:
  ...     class D:
  ...         def meth(self):
  ...             pass
  ...
  >>> C.__qualname__
  'C'
  >>> C.D.__qualname__
  'C.D'
  >>> C.D.meth.__qualname__
  'C.D.meth'
  ```
  <br/>
  When used to refer to modules, the *fully qualified name* means the
  entire dotted path to the module, including any parent packages,
  e.g. `email.mime.text`:
  <br/>
  ```python3
  >>> import email.mime.text
  >>> email.mime.text.__name__
  'email.mime.text'
  ```

<a id="term-race-condition"></a>

race condition
: A condition of a program where the behavior
  depends on the relative timing or ordering of events, particularly in
  multi-threaded programs.  Race conditions can lead to
  [non-deterministic](#term-non-deterministic) behavior and bugs that are difficult to
  reproduce.  A [data race](#term-data-race) is a specific type of race condition
  involving unsynchronized access to shared memory.  The [LBYL](#term-LBYL)
  coding style is particularly susceptible to race conditions in
  multi-threaded code.  Using [locks](#term-lock) and other
  [synchronization primitives](#term-synchronization-primitive)
  helps prevent race conditions.

<a id="term-reference-count"></a>

reference count
: The number of references to an object.  When the reference count of an
  object drops to zero, it is deallocated.  Some objects are
  [immortal](#term-immortal) and have reference counts that are never modified, and
  therefore the objects are never deallocated.  Reference counting is
  generally not visible to Python code, but it is a key element of the
  [CPython](#term-CPython) implementation.  Programmers can call the
  [`sys.getrefcount()`](library/sys.md#sys.getrefcount) function to return the
  reference count for a particular object.
  <br/>
  In [CPython](#term-CPython), reference counts are not considered to be stable
  or well-defined values; the number of references to an object, and how
  that number is affected by Python code, may be different between
  versions.

<a id="term-regular-package"></a>

regular package
: A traditional [package](#term-package), such as a directory containing an
  `__init__.py` file.
  <br/>
  See also [namespace package](#term-namespace-package).

<a id="term-reentrant"></a>

reentrant
: A property of a function or [lock](#term-lock) that allows it to be called or
  acquired multiple times by the same thread without causing errors or a
  [deadlock](#term-deadlock).
  <br/>
  For functions, reentrancy means the function can be safely called again
  before a previous invocation has completed, which is important when
  functions may be called recursively or from signal handlers. Thread-unsafe
  functions may be [non-deterministic](#term-non-deterministic) if they’re called reentrantly in a
  multithreaded program.
  <br/>
  For locks, Python’s [`threading.RLock`](library/threading.md#threading.RLock) (reentrant lock) is
  reentrant, meaning a thread that already holds the lock can acquire it
  again without blocking.  In contrast, [`threading.Lock`](library/threading.md#threading.Lock) is not
  reentrant - attempting to acquire it twice from the same thread will cause
  a deadlock.
  <br/>
  See also [lock](#term-lock) and [deadlock](#term-deadlock).

<a id="term-REPL"></a>

REPL
: An acronym for the “read–eval–print loop”, another name for the
  [interactive](#term-interactive) interpreter shell.

<a id="term-__slots__"></a>

\_\_slots_\_
: A declaration inside a class that saves memory by pre-declaring space for
  instance attributes and eliminating instance dictionaries.  Though
  popular, the technique is somewhat tricky to get right and is best
  reserved for rare cases where there are large numbers of instances in a
  memory-critical application.

<a id="term-sequence"></a>

sequence
: An [iterable](#term-iterable) which supports efficient element access using integer
  indices via the [`__getitem__()`](reference/datamodel.md#object.__getitem__) special method and defines a
  [`__len__()`](reference/datamodel.md#object.__len__) method that returns the length of the sequence.
  Some built-in sequence types are [`list`](library/stdtypes.md#list), [`str`](library/stdtypes.md#str),
  [`tuple`](library/stdtypes.md#tuple), and [`bytes`](library/stdtypes.md#bytes). Note that [`dict`](library/stdtypes.md#dict) also
  supports [`__getitem__()`](reference/datamodel.md#object.__getitem__) and `__len__()`, but is considered a
  mapping rather than a sequence because the lookups use arbitrary
  [hashable](#term-hashable) keys rather than integers.
  <br/>
  The [`collections.abc.Sequence`](library/collections.abc.md#collections.abc.Sequence) abstract base class
  defines a much richer interface that goes beyond just
  [`__getitem__()`](reference/datamodel.md#object.__getitem__) and [`__len__()`](reference/datamodel.md#object.__len__), adding
  [`count()`](library/stdtypes.md#sequence.count), [`index()`](library/stdtypes.md#sequence.index),
  [`__contains__()`](reference/datamodel.md#object.__contains__), and [`__reversed__()`](reference/datamodel.md#object.__reversed__).
  Types that implement this expanded
  interface can be registered explicitly using
  [`register()`](library/abc.md#abc.ABCMeta.register). For more documentation on sequence
  methods generally, see
  [Common Sequence Operations](library/stdtypes.md#typesseq-common).

<a id="term-set-comprehension"></a>

set comprehension
: A compact way to process all or part of the elements in an iterable and
  return a set with the results. `results = {c for c in 'abracadabra' if
  c not in 'abc'}` generates the set of strings `{'r', 'd'}`.  See
  [Displays for lists, sets and dictionaries](reference/expressions.md#comprehensions).

<a id="term-single-dispatch"></a>

single dispatch
: A form of [generic function](#term-generic-function) dispatch where the implementation is
  chosen based on the type of a single argument.

<a id="term-slice"></a>

slice
: An object of type [`slice`](library/functions.md#slice), used to describe a portion of
  a [sequence](#term-sequence).
  A slice object is created when using the [slicing](reference/expressions.md#slicings) form
  of [subscript notation](reference/expressions.md#subscriptions), with colons inside square
  brackets, such as in `variable_name[1:3:5]`.

<a id="term-soft-deprecated"></a>

soft deprecated
: A soft deprecated API should not be used in new code,
  but it is safe for already existing code to use it.
  The API remains documented and tested, but will not be enhanced further.
  <br/>
  Soft deprecation, unlike normal deprecation, does not plan on removing the API
  and will not emit warnings.
  <br/>
  See [PEP 387: Soft Deprecation](https://peps.python.org/pep-0387/#soft-deprecation).

<a id="term-special-method"></a>

special method
: <a id="index-38"></a>
  <br/>
  A method that is called implicitly by Python to execute a certain
  operation on a type, such as addition.  Such methods have names starting
  and ending with double underscores.  Special methods are documented in
  [Special method names](reference/datamodel.md#specialnames).

<a id="term-standard-library"></a>

standard library
: The collection of [packages](#term-package), [modules](#term-module)
  and [extension modules](#term-extension-module) distributed as a part
  of the official Python interpreter package.  The exact membership of the
  collection may vary based on platform, available system libraries, or
  other criteria.  Documentation can be found at [The Python Standard Library](library/index.md#library-index).
  <br/>
  See also [`sys.stdlib_module_names`](library/sys.md#sys.stdlib_module_names) for a list of all possible
  standard library module names.

<a id="term-statement"></a>

statement
: A statement is part of a suite (a “block” of code).  A statement is either
  an [expression](#term-expression) or one of several constructs with a keyword, such
  as [`if`](reference/compound_stmts.md#if), [`while`](reference/compound_stmts.md#while) or [`for`](reference/compound_stmts.md#for).

<a id="term-static-type-checker"></a>

static type checker
: An external tool that reads Python code and analyzes it, looking for
  issues such as incorrect types. See also [type hints](#term-type-hint)
  and the [`typing`](library/typing.md#module-typing) module.

<a id="term-stdlib"></a>

stdlib
: An abbreviation of [standard library](#term-standard-library).

<a id="term-strong-reference"></a>

strong reference
: In Python’s C API, a strong reference is a reference to an object
  which is owned by the code holding the reference.  The strong
  reference is taken by calling [`Py_INCREF()`](c-api/refcounting.md#c.Py_INCREF) when the
  reference is created and released with [`Py_DECREF()`](c-api/refcounting.md#c.Py_DECREF)
  when the reference is deleted.
  <br/>
  The [`Py_NewRef()`](c-api/refcounting.md#c.Py_NewRef) function can be used to create a strong reference
  to an object. Usually, the [`Py_DECREF()`](c-api/refcounting.md#c.Py_DECREF) function must be called on
  the strong reference before exiting the scope of the strong reference, to
  avoid leaking one reference.
  <br/>
  See also [borrowed reference](#term-borrowed-reference).

<a id="term-subscript"></a>

subscript
: The expression in square brackets of a
  [subscription expression](reference/expressions.md#subscriptions), for example,
  the `3` in `items[3]`.
  Usually used to select an element of a container.
  Also called a [key](#term-key) when subscripting a [mapping](#term-mapping),
  or an [index](#term-index) when subscripting a [sequence](#term-sequence).

<a id="term-synchronization-primitive"></a>

synchronization primitive
: A basic building block for coordinating (synchronizing) the execution of
  multiple threads to ensure [thread-safe](#term-thread-safe) access to shared resources.
  Python’s [`threading`](library/threading.md#module-threading) module provides several synchronization primitives
  including [`Lock`](library/threading.md#threading.Lock), [`RLock`](library/threading.md#threading.RLock),
  [`Semaphore`](library/threading.md#threading.Semaphore), [`Condition`](library/threading.md#threading.Condition),
  [`Event`](library/threading.md#threading.Event), and [`Barrier`](library/threading.md#threading.Barrier).  Additionally,
  the [`queue`](library/queue.md#module-queue) module provides multi-producer, multi-consumer queues
  that are especially useful in multithreaded programs. These
  primitives help prevent [race conditions](#term-race-condition) and
  coordinate thread execution.  See also [lock](#term-lock).

<a id="term-t-string"></a>

t-string

<a id="term-t-strings"></a>

t-strings
: String literals prefixed with `t` or `T` are commonly called
  “t-strings” which is short for
  [template string literals](reference/lexical_analysis.md#t-strings).

<a id="term-text-encoding"></a>

text encoding
: A string in Python is a sequence of Unicode code points (in range
  `U+0000`–`U+10FFFF`). To store or transfer a string, it needs to be
  serialized as a sequence of bytes.
  <br/>
  Serializing a string into a sequence of bytes is known as “encoding”, and
  recreating the string from the sequence of bytes is known as “decoding”.
  <br/>
  There are a variety of different text serialization
  [codecs](library/codecs.md#standard-encodings), which are collectively referred to as
  “text encodings”.

<a id="term-text-file"></a>

text file
: A [file object](#term-file-object) able to read and write [`str`](library/stdtypes.md#str) objects.
  Often, a text file actually accesses a byte-oriented datastream
  and handles the [text encoding](#term-text-encoding) automatically.
  Examples of text files are files opened in text mode (`'r'` or `'w'`),
  [`sys.stdin`](library/sys.md#sys.stdin), [`sys.stdout`](library/sys.md#sys.stdout), and instances of
  [`io.StringIO`](library/io.md#io.StringIO).
  <br/>
  See also [binary file](#term-binary-file) for a file object able to read and write
  [bytes-like objects](#term-bytes-like-object).

<a id="term-thread-state"></a>

thread state
: The information used by the [CPython](#term-CPython) runtime to run in an OS thread.
  For example, this includes the current exception, if any, and the
  state of the bytecode interpreter.
  <br/>
  Each thread state is bound to a single OS thread, but threads may have
  many thread states available.  At most, one of them may be
  [attached](#term-attached-thread-state) at once.
  <br/>
  An [attached thread state](#term-attached-thread-state) is required to call most
  of Python’s C API, unless a function explicitly documents otherwise.
  The bytecode interpreter only runs under an attached thread state.
  <br/>
  Each thread state belongs to a single interpreter, but each interpreter
  may have many thread states, including multiple for the same OS thread.
  Thread states from multiple interpreters may be bound to the same
  thread, but only one can be [attached](#term-attached-thread-state) in
  that thread at any given moment.
  <br/>
  See [Thread State and the Global Interpreter Lock](c-api/threads.md#threads) for more
  information.

<a id="term-thread-safe"></a>

thread-safe
: A module, function, or class that behaves correctly when used by multiple
  threads concurrently.  Thread-safe code uses appropriate
  [synchronization primitives](#term-synchronization-primitive) like
  [locks](#term-lock) to protect shared mutable state, or is designed
  to avoid shared mutable state entirely.  In the
  [free-threaded](#term-free-threading) build, built-in types like
  [`dict`](library/stdtypes.md#dict), [`list`](library/stdtypes.md#list), and [`set`](library/stdtypes.md#set) use internal locking
  to make many operations thread-safe, although thread safety is not
  necessarily guaranteed.  Code that is not thread-safe may experience
  [race conditions](#term-race-condition) and [data races](#term-data-race)
  when used in multi-threaded programs.

<a id="term-token"></a>

token
: A small unit of source code, generated by the
  [lexical analyzer](reference/lexical_analysis.md#lexical) (also called the *tokenizer*).
  Names, numbers, strings, operators,
  newlines and similar are represented by tokens.
  <br/>
  The [`tokenize`](library/tokenize.md#module-tokenize) module exposes Python’s lexical analyzer.
  The [`token`](library/token.md#module-token) module contains information on the various types
  of tokens.

<a id="term-triple-quoted-string"></a>

triple-quoted string
: A string which is bound by three instances of either a quotation mark
  (”) or an apostrophe (‘).  While they don’t provide any functionality
  not available with single-quoted strings, they are useful for a number
  of reasons.  They allow you to include unescaped single and double
  quotes within a string and they can span multiple lines without the
  use of the continuation character, making them especially useful when
  writing docstrings.

<a id="term-type"></a>

type
: The type of a Python object determines what kind of object it is; every
  object has a type.  An object’s type is accessible as its
  [`__class__`](reference/datamodel.md#object.__class__) attribute or can be retrieved with
  `type(obj)`.

<a id="term-type-alias"></a>

type alias
: A synonym for a type, created by assigning the type to an identifier.
  <br/>
  Type aliases are useful for simplifying [type hints](#term-type-hint).
  For example:
  <br/>
  ```python3
  def remove_gray_shades(
          colors: list[tuple[int, int, int]]) -> list[tuple[int, int, int]]:
      pass
  ```
  <br/>
  could be made more readable like this:
  <br/>
  ```python3
  Color = tuple[int, int, int]
  <br/>
  def remove_gray_shades(colors: list[Color]) -> list[Color]:
      pass
  ```
  <br/>
  See [`typing`](library/typing.md#module-typing) and [**PEP 484**](https://peps.python.org/pep-0484/), which describe this functionality.

<a id="term-type-hint"></a>

type hint
: An [annotation](#term-annotation) that specifies the expected type for a variable, a class
  attribute, or a function parameter or return value.
  <br/>
  Type hints are optional and are not enforced by Python but
  they are useful to [static type checkers](#term-static-type-checker).
  They can also aid IDEs with code completion and refactoring.
  <br/>
  Type hints of global variables, class attributes, and functions,
  but not local variables, can be accessed using
  [`typing.get_type_hints()`](library/typing.md#typing.get_type_hints).
  <br/>
  See [`typing`](library/typing.md#module-typing) and [**PEP 484**](https://peps.python.org/pep-0484/), which describe this functionality.

<a id="term-universal-newlines"></a>

universal newlines
: A manner of interpreting text streams in which all of the following are
  recognized as ending a line: the Unix end-of-line convention `'\n'`,
  the Windows convention `'\r\n'`, and the old Macintosh convention
  `'\r'`.  See [**PEP 278**](https://peps.python.org/pep-0278/) and [**PEP 3116**](https://peps.python.org/pep-3116/), as well as
  [`bytes.splitlines()`](library/stdtypes.md#bytes.splitlines) for an additional use.

<a id="term-variable-annotation"></a>

variable annotation
: An [annotation](#term-annotation) of a variable or a class attribute.
  <br/>
  When annotating a variable or a class attribute, assignment is optional:
  <br/>
  ```python3
  class C:
      field: 'annotation'
  ```
  <br/>
  Variable annotations are usually used for
  [type hints](#term-type-hint): for example this variable is expected to take
  [`int`](library/functions.md#int) values:
  <br/>
  ```python3
  count: int = 0
  ```
  <br/>
  Variable annotation syntax is explained in section [Annotated assignment statements](reference/simple_stmts.md#annassign).
  <br/>
  See [function annotation](#term-function-annotation), [**PEP 484**](https://peps.python.org/pep-0484/)
  and [**PEP 526**](https://peps.python.org/pep-0526/), which describe this functionality.
  Also see [Annotations Best Practices](howto/annotations.md#annotations-howto)
  for best practices on working with annotations.

<a id="term-virtual-environment"></a>

virtual environment
: A cooperatively isolated runtime environment that allows Python users
  and applications to install and upgrade Python distribution packages
  without interfering with the behaviour of other Python applications
  running on the same system.
  <br/>
  See also [`venv`](library/venv.md#module-venv).

<a id="term-virtual-machine"></a>

virtual machine
: A computer defined entirely in software.  Python’s virtual machine
  executes the [bytecode](#term-bytecode) emitted by the bytecode compiler.

<a id="term-walrus-operator"></a>

walrus operator
: A light-hearted way to refer to the [assignment expression](reference/expressions.md#assignment-expressions) operator `:=` because it looks a bit like a
  walrus if you turn your head.

<a id="term-Zen-of-Python"></a>

Zen of Python
: Listing of Python design principles and philosophies that are helpful in
  understanding and using the language.  The listing can be found by typing
  “`import this`” at the interactive prompt.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

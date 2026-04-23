<a id="sub-interpreter-support"></a>

# Multiple interpreters in a Python process

While in most uses, you will only embed a single Python interpreter, there
are cases where you need to create several independent interpreters in the
same process and perhaps even in the same thread. Sub-interpreters allow
you to do that.

The “main” interpreter is the first one created when the runtime initializes.
It is usually the only Python interpreter in a process.  Unlike sub-interpreters,
the main interpreter has unique process-global responsibilities like signal
handling.  It is also responsible for execution during runtime initialization and
is usually the active interpreter during runtime finalization.  The
[`PyInterpreterState_Main()`](#c.PyInterpreterState_Main) function returns a pointer to its state.

You can switch between sub-interpreters using the [`PyThreadState_Swap()`](threads.md#c.PyThreadState_Swap)
function. You can create and destroy them using the following functions:

### type PyInterpreterConfig

Structure containing most parameters to configure a sub-interpreter.
Its values are used only in [`Py_NewInterpreterFromConfig()`](#c.Py_NewInterpreterFromConfig) and
never modified by the runtime.

#### Versionadded
Added in version 3.12.

Structure fields:

### int use_main_obmalloc

If this is `0` then the sub-interpreter will use its own
“object” allocator state.
Otherwise it will use (share) the main interpreter’s.

If this is `0` then
[`check_multi_interp_extensions`](#c.PyInterpreterConfig.check_multi_interp_extensions)
must be `1` (non-zero).
If this is `1` then [`gil`](#c.PyInterpreterConfig.gil)
must not be [`PyInterpreterConfig_OWN_GIL`](#c.PyInterpreterConfig_OWN_GIL).

### int allow_fork

If this is `0` then the runtime will not support forking the
process in any thread where the sub-interpreter is currently active.
Otherwise fork is unrestricted.

Note that the [`subprocess`](../library/subprocess.md#module-subprocess) module still works
when fork is disallowed.

### int allow_exec

If this is `0` then the runtime will not support replacing the
current process via exec (e.g. [`os.execv()`](../library/os.md#os.execv)) in any thread
where the sub-interpreter is currently active.
Otherwise exec is unrestricted.

Note that the [`subprocess`](../library/subprocess.md#module-subprocess) module still works
when exec is disallowed.

### int allow_threads

If this is `0` then the sub-interpreter’s [`threading`](../library/threading.md#module-threading) module
won’t create threads.
Otherwise threads are allowed.

### int allow_daemon_threads

If this is `0` then the sub-interpreter’s [`threading`](../library/threading.md#module-threading) module
won’t create daemon threads.
Otherwise daemon threads are allowed (as long as
[`allow_threads`](#c.PyInterpreterConfig.allow_threads) is non-zero).

### int check_multi_interp_extensions

If this is `0` then all extension modules may be imported,
including legacy (single-phase init) modules,
in any thread where the sub-interpreter is currently active.
Otherwise only multi-phase init extension modules
(see [**PEP 489**](https://peps.python.org/pep-0489/)) may be imported.
(Also see [`Py_mod_multiple_interpreters`](module.md#c.Py_mod_multiple_interpreters).)

This must be `1` (non-zero) if
[`use_main_obmalloc`](#c.PyInterpreterConfig.use_main_obmalloc) is `0`.

### int gil

This determines the operation of the GIL for the sub-interpreter.
It may be one of the following:

### PyInterpreterConfig_DEFAULT_GIL

Use the default selection ([`PyInterpreterConfig_SHARED_GIL`](#c.PyInterpreterConfig_SHARED_GIL)).

### PyInterpreterConfig_SHARED_GIL

Use (share) the main interpreter’s GIL.

### PyInterpreterConfig_OWN_GIL

Use the sub-interpreter’s own GIL.

If this is [`PyInterpreterConfig_OWN_GIL`](#c.PyInterpreterConfig_OWN_GIL) then
[`PyInterpreterConfig.use_main_obmalloc`](#c.PyInterpreterConfig.use_main_obmalloc) must be `0`.

### [PyStatus](init_config.md#c.PyStatus) Py_NewInterpreterFromConfig([PyThreadState](threads.md#c.PyThreadState) \*\*tstate_p, const [PyInterpreterConfig](#c.PyInterpreterConfig) \*config)

<a id="index-1"></a>

Create a new sub-interpreter.  This is an (almost) totally separate environment
for the execution of Python code.  In particular, the new interpreter has
separate, independent versions of all imported modules, including the
fundamental modules [`builtins`](../library/builtins.md#module-builtins), [`__main__`](../library/__main__.md#module-__main__) and [`sys`](../library/sys.md#module-sys).  The
table of loaded modules (`sys.modules`) and the module search path
(`sys.path`) are also separate.  The new environment has no `sys.argv`
variable.  It has new standard I/O stream file objects `sys.stdin`,
`sys.stdout` and `sys.stderr` (however these refer to the same underlying
file descriptors).

The given *config* controls the options with which the interpreter
is initialized.

Upon success, *tstate_p* will be set to the first [thread state](../glossary.md#term-thread-state)
created in the new sub-interpreter.  This thread state is
[attached](../glossary.md#term-attached-thread-state).
Note that no actual thread is created; see the discussion of thread states
below.  If creation of the new interpreter is unsuccessful,
*tstate_p* is set to `NULL`;
no exception is set since the exception state is stored in the
[attached thread state](../glossary.md#term-attached-thread-state), which might not exist.

Like all other Python/C API functions, an [attached thread state](../glossary.md#term-attached-thread-state)
must be present before calling this function, but it might be detached upon
returning. On success, the returned thread state will be [attached](../glossary.md#term-attached-thread-state).
If the sub-interpreter is created with its own [GIL](../glossary.md#term-GIL) then the
[attached thread state](../glossary.md#term-attached-thread-state) of the calling interpreter will be detached.
When the function returns, the new interpreter’s [thread state](../glossary.md#term-thread-state)
will be [attached](../glossary.md#term-attached-thread-state) to the current thread and
the previous interpreter’s [attached thread state](../glossary.md#term-attached-thread-state) will remain detached.

#### Versionadded
Added in version 3.12.

Sub-interpreters are most effective when isolated from each other,
with certain functionality restricted:

```c
PyInterpreterConfig config = {
    .use_main_obmalloc = 0,
    .allow_fork = 0,
    .allow_exec = 0,
    .allow_threads = 1,
    .allow_daemon_threads = 0,
    .check_multi_interp_extensions = 1,
    .gil = PyInterpreterConfig_OWN_GIL,
};
PyThreadState *tstate = NULL;
PyStatus status = Py_NewInterpreterFromConfig(&tstate, &config);
if (PyStatus_Exception(status)) {
    Py_ExitStatusException(status);
}
```

Note that the config is used only briefly and does not get modified.
During initialization the config’s values are converted into various
[`PyInterpreterState`](#c.PyInterpreterState) values.  A read-only copy of the config
may be stored internally on the [`PyInterpreterState`](#c.PyInterpreterState).

<a id="index-2"></a>

Extension modules are shared between (sub-)interpreters as follows:

* For modules using multi-phase initialization,
  e.g. [`PyModule_FromDefAndSpec()`](module.md#c.PyModule_FromDefAndSpec), a separate module object is
  created and initialized for each interpreter.
  Only C-level static and global variables are shared between these
  module objects.
* For modules using legacy
  [single-phase initialization](extension-modules.md#single-phase-initialization),
  e.g. [`PyModule_Create()`](module.md#c.PyModule_Create), the first time a particular extension
  is imported, it is initialized normally, and a (shallow) copy of its
  module’s dictionary is squirreled away.
  When the same extension is imported by another (sub-)interpreter, a new
  module is initialized and filled with the contents of this copy; the
  extension’s `init` function is not called.
  Objects in the module’s dictionary thus end up shared across
  (sub-)interpreters, which might cause unwanted behavior (see
  [Bugs and caveats]() below).

  Note that this is different from what happens when an extension is
  imported after the interpreter has been completely re-initialized by
  calling [`Py_FinalizeEx()`](interp-lifecycle.md#c.Py_FinalizeEx) and [`Py_Initialize()`](interp-lifecycle.md#c.Py_Initialize); in that
  case, the extension’s `initmodule` function *is* called again.
  As with multi-phase initialization, this means that only C-level static
  and global variables are shared between these modules.

### [PyThreadState](threads.md#c.PyThreadState) \*Py_NewInterpreter(void)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-4"></a>

Create a new sub-interpreter.  This is essentially just a wrapper
around [`Py_NewInterpreterFromConfig()`](#c.Py_NewInterpreterFromConfig) with a config that
preserves the existing behavior.  The result is an unisolated
sub-interpreter that shares the main interpreter’s GIL, allows
fork/exec, allows daemon threads, and allows single-phase init
modules.

### void Py_EndInterpreter([PyThreadState](threads.md#c.PyThreadState) \*tstate)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-5"></a>

Destroy the (sub-)interpreter represented by the given [thread state](../glossary.md#term-thread-state).
The given thread state must be [attached](../glossary.md#term-attached-thread-state).
When the call returns, there will be no [attached thread state](../glossary.md#term-attached-thread-state).
All thread states associated with this interpreter are destroyed.

[`Py_FinalizeEx()`](interp-lifecycle.md#c.Py_FinalizeEx) will destroy all sub-interpreters that
haven’t been explicitly destroyed at that point.

<a id="per-interpreter-gil"></a>

## A per-interpreter GIL

#### Versionadded
Added in version 3.12.

Using [`Py_NewInterpreterFromConfig()`](#c.Py_NewInterpreterFromConfig) you can create
a sub-interpreter that is completely isolated from other interpreters,
including having its own GIL.  The most important benefit of this
isolation is that such an interpreter can execute Python code without
being blocked by other interpreters or blocking any others.  Thus a
single Python process can truly take advantage of multiple CPU cores
when running Python code.  The isolation also encourages a different
approach to concurrency than that of just using threads.
(See [**PEP 554**](https://peps.python.org/pep-0554/) and [**PEP 684**](https://peps.python.org/pep-0684/).)

Using an isolated interpreter requires vigilance in preserving that
isolation.  That especially means not sharing any objects or mutable
state without guarantees about thread-safety.  Even objects that are
otherwise immutable (e.g. `None`, `(1, 5)`) can’t normally be shared
because of the refcount.  One simple but less-efficient approach around
this is to use a global lock around all use of some state (or object).
Alternately, effectively immutable objects (like integers or strings)
can be made safe in spite of their refcounts by making them [immortal](../glossary.md#term-immortal).
In fact, this has been done for the builtin singletons, small integers,
and a number of other builtin objects.

If you preserve isolation then you will have access to proper multi-core
computing without the complications that come with free-threading.
Failure to preserve isolation will expose you to the full consequences
of free-threading, including races and hard-to-debug crashes.

Aside from that, one of the main challenges of using multiple isolated
interpreters is how to communicate between them safely (not break
isolation) and efficiently.  The runtime and stdlib do not provide
any standard approach to this yet.  A future stdlib module would help
mitigate the effort of preserving isolation and expose effective tools
for communicating (and sharing) data between interpreters.

## Bugs and caveats

Because sub-interpreters (and the main interpreter) are part of the same
process, the insulation between them isn’t perfect — for example, using
low-level file operations like [`os.close()`](../library/os.md#os.close) they can
(accidentally or maliciously) affect each other’s open files.  Because of the
way extensions are shared between (sub-)interpreters, some extensions may not
work properly; this is especially likely when using single-phase initialization
or (static) global variables.
It is possible to insert objects created in one sub-interpreter into
a namespace of another (sub-)interpreter; this should be avoided if possible.

Special care should be taken to avoid sharing user-defined functions,
methods, instances or classes between sub-interpreters, since import
operations executed by such objects may affect the wrong (sub-)interpreter’s
dictionary of loaded modules. It is equally important to avoid sharing
objects from which the above are reachable.

Also note that combining this functionality with `PyGILState_*` APIs
is delicate, because these APIs assume a bijection between Python thread states
and OS-level threads, an assumption broken by the presence of sub-interpreters.
It is highly recommended that you don’t switch sub-interpreters between a pair
of matching [`PyGILState_Ensure()`](threads.md#c.PyGILState_Ensure) and [`PyGILState_Release()`](threads.md#c.PyGILState_Release) calls.
Furthermore, extensions (such as [`ctypes`](../library/ctypes.md#module-ctypes)) using these APIs to allow calling
of Python code from non-Python created threads will probably be broken when using
sub-interpreters.

## High-level APIs

### type PyInterpreterState

 *Part of the [Stable ABI](stable.md#stable) (as an opaque struct).*

This data structure represents the state shared by a number of cooperating
threads.  Threads belonging to the same interpreter share their module
administration and a few other internal items. There are no public members in
this structure.

Threads belonging to different interpreters initially share nothing, except
process state like available memory, open file descriptors and such.  The global
interpreter lock is also shared by all threads, regardless of to which
interpreter they belong.

#### Versionchanged
Changed in version 3.12: [**PEP 684**](https://peps.python.org/pep-0684/) introduced the possibility
of a [per-interpreter GIL](#per-interpreter-gil).
See [`Py_NewInterpreterFromConfig()`](#c.Py_NewInterpreterFromConfig).

### [PyInterpreterState](#c.PyInterpreterState) \*PyInterpreterState_Get(void)

 *Part of the [Stable ABI](stable.md#stable) since version 3.9.*

Get the current interpreter.

Issue a fatal error if there is no [attached thread state](../glossary.md#term-attached-thread-state).
It cannot return NULL.

#### Versionadded
Added in version 3.9.

### int64_t PyInterpreterState_GetID([PyInterpreterState](#c.PyInterpreterState) \*interp)

 *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Return the interpreter’s unique ID.  If there was any error in doing
so then `-1` is returned and an error is set.

The caller must have an [attached thread state](../glossary.md#term-attached-thread-state).

#### Versionadded
Added in version 3.7.

### [PyObject](structures.md#c.PyObject) \*PyInterpreterState_GetDict([PyInterpreterState](#c.PyInterpreterState) \*interp)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.8.*

Return a dictionary in which interpreter-specific data may be stored.
If this function returns `NULL` then no exception has been raised and
the caller should assume no interpreter-specific dict is available.

This is not a replacement for [`PyModule_GetState()`](module.md#c.PyModule_GetState), which
extensions should use to store interpreter-specific state information.

The returned dictionary is borrowed from the interpreter and is valid until
interpreter shutdown.

#### Versionadded
Added in version 3.8.

### typedef [PyObject](structures.md#c.PyObject) \*(\*\_PyFrameEvalFunction)([PyThreadState](threads.md#c.PyThreadState) \*tstate, [\_PyInterpreterFrame](frame.md#c._PyInterpreterFrame) \*frame, int throwflag)

Type of a frame evaluation function.

The *throwflag* parameter is used by the `throw()` method of generators:
if non-zero, handle the current exception.

#### Versionchanged
Changed in version 3.9: The function now takes a *tstate* parameter.

#### Versionchanged
Changed in version 3.11: The *frame* parameter changed from `PyFrameObject*` to `_PyInterpreterFrame*`.

### [\_PyFrameEvalFunction](#c._PyFrameEvalFunction) \_PyInterpreterState_GetEvalFrameFunc([PyInterpreterState](#c.PyInterpreterState) \*interp)

Get the frame evaluation function.

See the [**PEP 523**](https://peps.python.org/pep-0523/) “Adding a frame evaluation API to CPython”.

#### Versionadded
Added in version 3.9.

### void \_PyInterpreterState_SetEvalFrameFunc([PyInterpreterState](#c.PyInterpreterState) \*interp, [\_PyFrameEvalFunction](#c._PyFrameEvalFunction) eval_frame)

Set the frame evaluation function.

See the [**PEP 523**](https://peps.python.org/pep-0523/) “Adding a frame evaluation API to CPython”.

#### Versionadded
Added in version 3.9.

### void \_PyInterpreterState_SetEvalFrameAllowSpecialization([PyInterpreterState](#c.PyInterpreterState) \*interp, int allow_specialization)

Enables or disables specialization why a custom frame evaluator is in place.

If *allow_specialization* is non-zero, the adaptive specializer will
continue to specialize bytecodes even though a custom eval frame function
is set. When *allow_specialization* is zero, setting a custom eval frame
disables specialization. The standard interpreter loop will continue to deopt
while a frame evaluation API is in place - the frame evaluation function needs
to handle the specialized opcodes to take advantage of this.

#### Versionadded
Added in version 3.15.

### int \_PyInterpreterState_IsSpecializationEnabled([PyInterpreterState](#c.PyInterpreterState) \*interp)

Return non-zero if adaptive specialization is enabled for the interpreter.
Specialization is enabled when no custom eval frame function is set, or
when one is set with *allow_specialization* enabled.

#### Versionadded
Added in version 3.15.

## Low-level APIs

All of the following functions must be called after [`Py_Initialize()`](interp-lifecycle.md#c.Py_Initialize).

#### Versionchanged
Changed in version 3.7: [`Py_Initialize()`](interp-lifecycle.md#c.Py_Initialize) now initializes the [GIL](../glossary.md#term-GIL)
and sets an [attached thread state](../glossary.md#term-attached-thread-state).

### [PyInterpreterState](#c.PyInterpreterState) \*PyInterpreterState_New()

 *Part of the [Stable ABI](stable.md#stable).*

Create a new interpreter state object.  An [attached thread state](../glossary.md#term-attached-thread-state) is not needed,
but may optionally exist if it is necessary to serialize calls to this
function.

Raises an [auditing event](../library/sys.md#auditing) `cpython.PyInterpreterState_New` with no arguments.

### void PyInterpreterState_Clear([PyInterpreterState](#c.PyInterpreterState) \*interp)

 *Part of the [Stable ABI](stable.md#stable).*

Reset all information in an interpreter state object.  There must be
an [attached thread state](../glossary.md#term-attached-thread-state) for the interpreter.

Raises an [auditing event](../library/sys.md#auditing) `cpython.PyInterpreterState_Clear` with no arguments.

### void PyInterpreterState_Delete([PyInterpreterState](#c.PyInterpreterState) \*interp)

 *Part of the [Stable ABI](stable.md#stable).*

Destroy an interpreter state object.  There **should not** be an
[attached thread state](../glossary.md#term-attached-thread-state) for the target interpreter. The interpreter
state must have been reset with a previous call to [`PyInterpreterState_Clear()`](#c.PyInterpreterState_Clear).

<a id="advanced-debugging"></a>

## Advanced debugger support

These functions are only intended to be used by advanced debugging tools.

### [PyInterpreterState](#c.PyInterpreterState) \*PyInterpreterState_Head()

Return the interpreter state object at the head of the list of all such objects.

### [PyInterpreterState](#c.PyInterpreterState) \*PyInterpreterState_Main()

Return the main interpreter state object.

### [PyInterpreterState](#c.PyInterpreterState) \*PyInterpreterState_Next([PyInterpreterState](#c.PyInterpreterState) \*interp)

Return the next interpreter state object after *interp* from the list of all
such objects.

### [PyThreadState](threads.md#c.PyThreadState) \*PyInterpreterState_ThreadHead([PyInterpreterState](#c.PyInterpreterState) \*interp)

Return the pointer to the first [`PyThreadState`](threads.md#c.PyThreadState) object in the list of
threads associated with the interpreter *interp*.

### [PyThreadState](threads.md#c.PyThreadState) \*PyThreadState_Next([PyThreadState](threads.md#c.PyThreadState) \*tstate)

Return the next thread state object after *tstate* from the list of all such
objects belonging to the same [`PyInterpreterState`](#c.PyInterpreterState) object.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

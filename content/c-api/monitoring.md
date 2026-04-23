<a id="c-api-monitoring"></a>

# Monitoring C API

Added in version 3.13.

An extension may need to interact with the event monitoring system. Subscribing
to events and registering callbacks can be done via the Python API exposed in
[`sys.monitoring`](../library/sys.monitoring.md#module-sys.monitoring).

# Generating Execution Events

The functions below make it possible for an extension to fire monitoring
events as it emulates the execution of Python code. Each of these functions
accepts a `PyMonitoringState` struct which contains concise information
about the activation state of events, as well as the event arguments, which
include a `PyObject*` representing the code object, the instruction offset
and sometimes additional, event-specific arguments (see [`sys.monitoring`](../library/sys.monitoring.md#module-sys.monitoring)
for details about the signatures of the different event callbacks).
The `codelike` argument should be an instance of [`types.CodeType`](../library/types.md#types.CodeType)
or of a type that emulates it.

The VM disables tracing when firing an event, so there is no need for user
code to do that.

Monitoring functions should not be called with an exception set,
except those listed below as working with the current exception.

### type PyMonitoringState

Representation of the state of an event type. It is allocated by the user
while its contents are maintained by the monitoring API functions described below.

All of the functions below return 0 on success and -1 (with an exception set) on error.

See [`sys.monitoring`](../library/sys.monitoring.md#module-sys.monitoring) for descriptions of the events.

### int PyMonitoring_FirePyStartEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset)

Fire a `PY_START` event.

### int PyMonitoring_FirePyResumeEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset)

Fire a `PY_RESUME` event.

### int PyMonitoring_FirePyReturnEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset, [PyObject](structures.md#c.PyObject) \*retval)

Fire a `PY_RETURN` event.

### int PyMonitoring_FirePyYieldEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset, [PyObject](structures.md#c.PyObject) \*retval)

Fire a `PY_YIELD` event.

### int PyMonitoring_FireCallEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset, [PyObject](structures.md#c.PyObject) \*callable, [PyObject](structures.md#c.PyObject) \*arg0)

Fire a `CALL` event.

### int PyMonitoring_FireLineEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset, int lineno)

Fire a `LINE` event.

### int PyMonitoring_FireJumpEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset, [PyObject](structures.md#c.PyObject) \*target_offset)

Fire a `JUMP` event.

### int PyMonitoring_FireBranchLeftEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset, [PyObject](structures.md#c.PyObject) \*target_offset)

Fire a `BRANCH_LEFT` event.

### int PyMonitoring_FireBranchRightEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset, [PyObject](structures.md#c.PyObject) \*target_offset)

Fire a `BRANCH_RIGHT` event.

### int PyMonitoring_FireCReturnEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset, [PyObject](structures.md#c.PyObject) \*retval)

Fire a `C_RETURN` event.

### int PyMonitoring_FirePyThrowEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset)

Fire a `PY_THROW` event with the current exception (as returned by
[`PyErr_GetRaisedException()`](exceptions.md#c.PyErr_GetRaisedException)).

### int PyMonitoring_FireRaiseEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset)

Fire a `RAISE` event with the current exception (as returned by
[`PyErr_GetRaisedException()`](exceptions.md#c.PyErr_GetRaisedException)).

### int PyMonitoring_FireCRaiseEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset)

Fire a `C_RAISE` event with the current exception (as returned by
[`PyErr_GetRaisedException()`](exceptions.md#c.PyErr_GetRaisedException)).

### int PyMonitoring_FireReraiseEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset)

Fire a `RERAISE` event with the current exception (as returned by
[`PyErr_GetRaisedException()`](exceptions.md#c.PyErr_GetRaisedException)).

### int PyMonitoring_FireExceptionHandledEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset)

Fire an `EXCEPTION_HANDLED` event with the current exception (as returned by
[`PyErr_GetRaisedException()`](exceptions.md#c.PyErr_GetRaisedException)).

### int PyMonitoring_FirePyUnwindEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset)

Fire a `PY_UNWIND` event with the current exception (as returned by
[`PyErr_GetRaisedException()`](exceptions.md#c.PyErr_GetRaisedException)).

### int PyMonitoring_FireStopIterationEvent([PyMonitoringState](#c.PyMonitoringState) \*state, [PyObject](structures.md#c.PyObject) \*codelike, int32_t offset, [PyObject](structures.md#c.PyObject) \*value)

Fire a `STOP_ITERATION` event. If `value` is an instance of [`StopIteration`](../library/exceptions.md#StopIteration), it is used. Otherwise,
a new [`StopIteration`](../library/exceptions.md#StopIteration) instance is created with `value` as its argument.

## Managing the Monitoring State

Monitoring states can be managed with the help of monitoring scopes. A scope
would typically correspond to a Python function.

### int PyMonitoring_EnterScope([PyMonitoringState](#c.PyMonitoringState) \*state_array, uint64_t \*version, const uint8_t \*event_types, [Py_ssize_t](intro.md#c.Py_ssize_t) length)

Enter a monitored scope. `event_types` is an array of the event IDs for
events that may be fired from the scope. For example, the ID of a `PY_START`
event is the value `PY_MONITORING_EVENT_PY_START`, which is numerically equal
to the base-2 logarithm of `sys.monitoring.events.PY_START`.
`state_array` is an array with a monitoring state entry for each event in
`event_types`, it is allocated by the user but populated by
`PyMonitoring_EnterScope()` with information about the activation state of
the event. The size of `event_types` (and hence also of `state_array`)
is given in `length`.

The `version` argument is a pointer to a value which should be allocated
by the user together with `state_array` and initialized to 0,
and then set only by `PyMonitoring_EnterScope()` itself. It allows this
function to determine whether event states have changed since the previous call,
and to return quickly if they have not.

The scopes referred to here are lexical scopes: a function, class or method.
`PyMonitoring_EnterScope()` should be called whenever the lexical scope is
entered. Scopes can be reentered, reusing the same *state_array* and *version*,
in situations like when emulating a recursive Python function. When a code-like’s
execution is paused, such as when emulating a generator, the scope needs to
be exited and re-entered.

The macros for *event_types* are:

<!-- The table is here to make the docs searchable, and to allow automatic
links to the identifiers. -->

| Macro                                     | Event                                                                                  |
|-------------------------------------------|----------------------------------------------------------------------------------------|
| ### PY_MONITORING_EVENT_BRANCH_LEFT       | [`BRANCH_LEFT`](../library/sys.monitoring.md#monitoring-event-BRANCH_LEFT)             |
| ### PY_MONITORING_EVENT_BRANCH_RIGHT      | [`BRANCH_RIGHT`](../library/sys.monitoring.md#monitoring-event-BRANCH_RIGHT)           |
| ### PY_MONITORING_EVENT_CALL              | [`CALL`](../library/sys.monitoring.md#monitoring-event-CALL)                           |
| ### PY_MONITORING_EVENT_C_RAISE           | [`C_RAISE`](../library/sys.monitoring.md#monitoring-event-C_RAISE)                     |
| ### PY_MONITORING_EVENT_C_RETURN          | [`C_RETURN`](../library/sys.monitoring.md#monitoring-event-C_RETURN)                   |
| ### PY_MONITORING_EVENT_EXCEPTION_HANDLED | [`EXCEPTION_HANDLED`](../library/sys.monitoring.md#monitoring-event-EXCEPTION_HANDLED) |
| ### PY_MONITORING_EVENT_INSTRUCTION       | [`INSTRUCTION`](../library/sys.monitoring.md#monitoring-event-INSTRUCTION)             |
| ### PY_MONITORING_EVENT_JUMP              | [`JUMP`](../library/sys.monitoring.md#monitoring-event-JUMP)                           |
| ### PY_MONITORING_EVENT_LINE              | [`LINE`](../library/sys.monitoring.md#monitoring-event-LINE)                           |
| ### PY_MONITORING_EVENT_PY_RESUME         | [`PY_RESUME`](../library/sys.monitoring.md#monitoring-event-PY_RESUME)                 |
| ### PY_MONITORING_EVENT_PY_RETURN         | [`PY_RETURN`](../library/sys.monitoring.md#monitoring-event-PY_RETURN)                 |
| ### PY_MONITORING_EVENT_PY_START          | [`PY_START`](../library/sys.monitoring.md#monitoring-event-PY_START)                   |
| ### PY_MONITORING_EVENT_PY_THROW          | [`PY_THROW`](../library/sys.monitoring.md#monitoring-event-PY_THROW)                   |
| ### PY_MONITORING_EVENT_PY_UNWIND         | [`PY_UNWIND`](../library/sys.monitoring.md#monitoring-event-PY_UNWIND)                 |
| ### PY_MONITORING_EVENT_PY_YIELD          | [`PY_YIELD`](../library/sys.monitoring.md#monitoring-event-PY_YIELD)                   |
| ### PY_MONITORING_EVENT_RAISE             | [`RAISE`](../library/sys.monitoring.md#monitoring-event-RAISE)                         |
| ### PY_MONITORING_EVENT_RERAISE           | [`RERAISE`](../library/sys.monitoring.md#monitoring-event-RERAISE)                     |
| ### PY_MONITORING_EVENT_STOP_ITERATION    | [`STOP_ITERATION`](../library/sys.monitoring.md#monitoring-event-STOP_ITERATION)       |

### int PyMonitoring_ExitScope(void)

Exit the last scope that was entered with `PyMonitoring_EnterScope()`.

### int PY_MONITORING_IS_INSTRUMENTED_EVENT(uint8_t ev)

Return true if the event corresponding to the event ID *ev* is
a [local event](../library/sys.monitoring.md#monitoring-event-local).

#### Versionadded
Added in version 3.13.

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.14.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

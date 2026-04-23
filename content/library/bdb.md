# `bdb` — Debugger framework

**Source code:** [Lib/bdb.py](https://github.com/python/cpython/tree/main/Lib/bdb.py)

---

The `bdb` module handles basic debugger functions, like setting breakpoints
or managing execution via the debugger.

The following exception is defined:

### *exception* bdb.BdbQuit

Exception raised by the [`Bdb`](#bdb.Bdb) class for quitting the debugger.

The `bdb` module also defines two classes:

### *class* bdb.Breakpoint(self, file, line, temporary=False, cond=None, funcname=None)

This class implements temporary breakpoints, ignore counts, disabling and
(re-)enabling, and conditionals.

Breakpoints are indexed by number through a list called [`bpbynumber`](#bdb.Breakpoint.bpbynumber)
and by `(file, line)` pairs through [`bplist`](#bdb.Breakpoint.bplist).  The former points to
a single instance of class [`Breakpoint`](#bdb.Breakpoint).  The latter points to a list
of such instances since there may be more than one breakpoint per line.

When creating a breakpoint, its associated [`file name`](#bdb.Breakpoint.file) should
be in canonical form.  If a [`funcname`](#bdb.Breakpoint.funcname) is defined, a breakpoint
[`hit`](#bdb.Breakpoint.hits) will be counted when the first line of that function is
executed.  A [`conditional`](#bdb.Breakpoint.cond) breakpoint always counts a
[`hit`](#bdb.Breakpoint.hits).

[`Breakpoint`](#bdb.Breakpoint) instances have the following methods:

#### deleteMe()

Delete the breakpoint from the list associated to a file/line.  If it is
the last breakpoint in that position, it also deletes the entry for the
file/line.

#### enable()

Mark the breakpoint as enabled.

#### disable()

Mark the breakpoint as disabled.

#### bpformat()

Return a string with all the information about the breakpoint, nicely
formatted:

* Breakpoint number.
* Temporary status (del or keep).
* File/line position.
* Break condition.
* Number of times to ignore.
* Number of times hit.

#### Versionadded
Added in version 3.2.

#### bpprint(out=None)

Print the output of [`bpformat()`](#bdb.Breakpoint.bpformat) to the file *out*, or if it is
`None`, to standard output.

[`Breakpoint`](#bdb.Breakpoint) instances have the following attributes:

#### file

File name of the [`Breakpoint`](#bdb.Breakpoint).

#### line

Line number of the [`Breakpoint`](#bdb.Breakpoint) within [`file`](#bdb.Breakpoint.file).

#### temporary

`True` if a [`Breakpoint`](#bdb.Breakpoint) at (file, line) is temporary.

#### cond

Condition for evaluating a [`Breakpoint`](#bdb.Breakpoint) at (file, line).

#### funcname

Function name that defines whether a [`Breakpoint`](#bdb.Breakpoint) is hit upon
entering the function.

#### enabled

`True` if [`Breakpoint`](#bdb.Breakpoint) is enabled.

#### bpbynumber

Numeric index for a single instance of a [`Breakpoint`](#bdb.Breakpoint).

#### bplist

Dictionary of [`Breakpoint`](#bdb.Breakpoint) instances indexed by
([`file`](#bdb.Breakpoint.file), [`line`](#bdb.Breakpoint.line)) tuples.

#### ignore

Number of times to ignore a [`Breakpoint`](#bdb.Breakpoint).

#### hits

Count of the number of times a [`Breakpoint`](#bdb.Breakpoint) has been hit.

### *class* bdb.Bdb(skip=None, backend='settrace')

The [`Bdb`](#bdb.Bdb) class acts as a generic Python debugger base class.

This class takes care of the details of the trace facility; a derived class
should implement user interaction.  The standard debugger class
([`pdb.Pdb`](pdb.md#pdb.Pdb)) is an example.

The *skip* argument, if given, must be an iterable of glob-style
module name patterns.  The debugger will not step into frames that
originate in a module that matches one of these patterns. Whether a
frame is considered to originate in a certain module is determined
by the `__name__` in the frame globals.

The *backend* argument specifies the backend to use for [`Bdb`](#bdb.Bdb). It
can be either `'settrace'` or `'monitoring'`. `'settrace'` uses
[`sys.settrace()`](sys.md#sys.settrace) which has the best backward compatibility. The
`'monitoring'` backend uses the new [`sys.monitoring`](sys.monitoring.md#module-sys.monitoring) that was
introduced in Python 3.12, which can be much more efficient because it
can disable unused events. We are trying to keep the exact interfaces
for both backends, but there are some differences. The debugger developers
are encouraged to use the `'monitoring'` backend to achieve better
performance.

#### Versionchanged
Changed in version 3.1: Added the *skip* parameter.

#### Versionchanged
Changed in version 3.14: Added the *backend* parameter.

The following methods of [`Bdb`](#bdb.Bdb) normally don’t need to be overridden.

#### canonic(filename)

Return canonical form of *filename*.

For real file names, the canonical form is an operating-system-dependent,
[`case-normalized`](os.path.md#os.path.normcase) [`absolute path`](os.path.md#os.path.abspath). A *filename* with angle brackets, such as `"<stdin>"`
generated in interactive mode, is returned unchanged.

#### start_trace(self)

Start tracing. For `'settrace'` backend, this method is equivalent to
`sys.settrace(self.trace_dispatch)`

#### Versionadded
Added in version 3.14.

#### stop_trace(self)

Stop tracing. For `'settrace'` backend, this method is equivalent to
`sys.settrace(None)`

#### Versionadded
Added in version 3.14.

#### reset()

Set the `botframe`, `stopframe`, `returnframe` and
[`quitting`](#bdb.Bdb.set_quit) attributes with values ready to start debugging.

#### trace_dispatch(frame, event, arg)

This function is installed as the trace function of debugged frames.  Its
return value is the new trace function (in most cases, that is, itself).

The default implementation decides how to dispatch a frame, depending on
the type of event (passed as a string) that is about to be executed.
*event* can be one of the following:

* `"line"`: A new line of code is going to be executed.
* `"call"`: A function is about to be called, or another code block
  entered.
* `"return"`: A function or other code block is about to return.
* `"exception"`: An exception has occurred.

For all the events, specialized functions (see below) are called.

The *arg* parameter depends on the previous event.

See the documentation for [`sys.settrace()`](sys.md#sys.settrace) for more information on the
trace function.  For more information on code and frame objects, refer to
[The standard type hierarchy](../reference/datamodel.md#types).

#### dispatch_line(frame)

If the debugger should stop on the current line, invoke the
[`user_line()`](#bdb.Bdb.user_line) method (which should be overridden in subclasses).
Raise a [`BdbQuit`](#bdb.BdbQuit) exception if the [`quitting`](#bdb.Bdb.set_quit) flag is set
(which can be set from [`user_line()`](#bdb.Bdb.user_line)).  Return a reference to the
[`trace_dispatch()`](#bdb.Bdb.trace_dispatch) method for further tracing in that scope.

#### dispatch_call(frame, arg)

If the debugger should stop on this function call, invoke the
[`user_call()`](#bdb.Bdb.user_call) method (which should be overridden in subclasses).
Raise a [`BdbQuit`](#bdb.BdbQuit) exception if the [`quitting`](#bdb.Bdb.set_quit) flag is set
(which can be set from [`user_call()`](#bdb.Bdb.user_call)).  Return a reference to the
[`trace_dispatch()`](#bdb.Bdb.trace_dispatch) method for further tracing in that scope.

#### dispatch_return(frame, arg)

If the debugger should stop on this function return, invoke the
[`user_return()`](#bdb.Bdb.user_return) method (which should be overridden in subclasses).
Raise a [`BdbQuit`](#bdb.BdbQuit) exception if the [`quitting`](#bdb.Bdb.set_quit) flag is set
(which can be set from [`user_return()`](#bdb.Bdb.user_return)).  Return a reference to the
[`trace_dispatch()`](#bdb.Bdb.trace_dispatch) method for further tracing in that scope.

#### dispatch_exception(frame, arg)

If the debugger should stop at this exception, invokes the
[`user_exception()`](#bdb.Bdb.user_exception) method (which should be overridden in subclasses).
Raise a [`BdbQuit`](#bdb.BdbQuit) exception if the [`quitting`](#bdb.Bdb.set_quit) flag is set
(which can be set from [`user_exception()`](#bdb.Bdb.user_exception)).  Return a reference to the
[`trace_dispatch()`](#bdb.Bdb.trace_dispatch) method for further tracing in that scope.

Normally derived classes don’t override the following methods, but they may
if they want to redefine the definition of stopping and breakpoints.

#### is_skipped_module(module_name)

Return `True` if *module_name* matches any skip pattern.

#### stop_here(frame)

Return `True` if *frame* is below the starting frame in the stack.

#### break_here(frame)

Return `True` if there is an effective breakpoint for this line.

Check whether a line or function breakpoint exists and is in effect.  Delete temporary
breakpoints based on information from [`effective()`](#bdb.effective).

#### break_anywhere(frame)

Return `True` if any breakpoint exists for *frame*’s filename.

Derived classes should override these methods to gain control over debugger
operation.

#### user_call(frame, argument_list)

Called from [`dispatch_call()`](#bdb.Bdb.dispatch_call) if a break might stop inside the
called function.

*argument_list* is not used anymore and will always be `None`.
The argument is kept for backwards compatibility.

#### user_line(frame)

Called from [`dispatch_line()`](#bdb.Bdb.dispatch_line) when either [`stop_here()`](#bdb.Bdb.stop_here) or
[`break_here()`](#bdb.Bdb.break_here) returns `True`.

#### user_return(frame, return_value)

Called from [`dispatch_return()`](#bdb.Bdb.dispatch_return) when [`stop_here()`](#bdb.Bdb.stop_here) returns `True`.

#### user_exception(frame, exc_info)

Called from [`dispatch_exception()`](#bdb.Bdb.dispatch_exception) when [`stop_here()`](#bdb.Bdb.stop_here)
returns `True`.

#### do_clear(arg)

Handle how a breakpoint must be removed when it is a temporary one.

This method must be implemented by derived classes.

Derived classes and clients can call the following methods to affect the
stepping state.

#### set_step()

Stop after one line of code.

#### set_next(frame)

Stop on the next line in or below the given frame.

#### set_return(frame)

Stop when returning from the given frame.

#### set_until(frame, lineno=None)

Stop when the line with the *lineno* greater than the current one is
reached or when returning from current frame.

#### set_trace()

Start debugging from *frame*.  If *frame* is not specified, debugging
starts from caller’s frame.

#### Versionchanged
Changed in version 3.13: [`set_trace()`](#bdb.set_trace) will enter the debugger immediately, rather than
on the next line of code to be executed.

#### set_continue()

Stop only at breakpoints or when finished.  If there are no breakpoints,
set the system trace function to `None`.

#### set_quit()

<a id="index-0"></a>

Set the `quitting` attribute to `True`.  This raises [`BdbQuit`](#bdb.BdbQuit) in
the next call to one of the `dispatch_*()` methods.

Derived classes and clients can call the following methods to manipulate
breakpoints.  These methods return a string containing an error message if
something went wrong, or `None` if all is well.

#### set_break(filename, lineno, temporary=False, cond=None, funcname=None)

Set a new breakpoint.  If the *lineno* line doesn’t exist for the
*filename* passed as argument, return an error message.  The *filename*
should be in canonical form, as described in the [`canonic()`](#bdb.Bdb.canonic) method.

#### clear_break(filename, lineno)

Delete the breakpoints in *filename* and *lineno*.  If none were set,
return an error message.

#### clear_bpbynumber(arg)

Delete the breakpoint which has the index *arg* in the
[`Breakpoint.bpbynumber`](#bdb.Breakpoint.bpbynumber).  If *arg* is not numeric or out of range,
return an error message.

#### clear_all_file_breaks(filename)

Delete all breakpoints in *filename*.  If none were set, return an error
message.

#### clear_all_breaks()

Delete all existing breakpoints.  If none were set, return an error
message.

#### get_bpbynumber(arg)

Return a breakpoint specified by the given number.  If *arg* is a string,
it will be converted to a number.  If *arg* is a non-numeric string, if
the given breakpoint never existed or has been deleted, a
[`ValueError`](exceptions.md#ValueError) is raised.

#### Versionadded
Added in version 3.2.

#### get_break(filename, lineno)

Return `True` if there is a breakpoint for *lineno* in *filename*.

#### get_breaks(filename, lineno)

Return all breakpoints for *lineno* in *filename*, or an empty list if
none are set.

#### get_file_breaks(filename)

Return all breakpoints in *filename*, or an empty list if none are set.

#### get_all_breaks()

Return all breakpoints that are set.

Derived classes and clients can call the following methods to disable and
restart events to achieve better performance. These methods only work
when using the `'monitoring'` backend.

#### disable_current_event()

Disable the current event until the next time [`restart_events()`](#bdb.Bdb.restart_events) is
called. This is helpful when the debugger is not interested in the current
line.

#### Versionadded
Added in version 3.14.

#### restart_events()

Restart all the disabled events. This function is automatically called in
`dispatch_*` methods after `user_*` methods are called. If the
`dispatch_*` methods are not overridden, the disabled events will be
restarted after each user interaction.

#### Versionadded
Added in version 3.14.

Derived classes and clients can call the following methods to get a data
structure representing a stack trace.

#### get_stack(f, t)

Return a list of (frame, lineno) tuples in a stack trace, and a size.

The most recently called frame is last in the list. The size is the number
of frames below the frame where the debugger was invoked.

#### format_stack_entry(frame_lineno, lprefix=': ')

Return a string with information about a stack entry, which is a
`(frame, lineno)` tuple.  The return string contains:

* The canonical filename which contains the frame.
* The function name or `"<lambda>"`.
* The input arguments.
* The return value.
* The line of code (if it exists).

The following two methods can be called by clients to use a debugger to debug
a [statement](../glossary.md#term-statement), given as a string.

#### run(cmd, globals=None, locals=None)

Debug a statement executed via the [`exec()`](functions.md#exec) function.  *globals*
defaults to `__main__.__dict__`, *locals* defaults to *globals*.

#### runeval(expr, globals=None, locals=None)

Debug an expression executed via the [`eval()`](functions.md#eval) function.  *globals* and
*locals* have the same meaning as in [`run()`](#bdb.Bdb.run).

#### runctx(cmd, globals, locals)

For backwards compatibility.  Calls the [`run()`](#bdb.Bdb.run) method.

#### runcall(func, , \*args, \*\*kwds)

Debug a single function call, and return its result.

Finally, the module defines the following functions:

### bdb.checkfuncname(b, frame)

Return `True` if we should break here, depending on the way the
[`Breakpoint`](#bdb.Breakpoint) *b* was set.

If it was set via line number, it checks if
[`b.line`](#bdb.Breakpoint.line) is the same as the one in *frame*.
If the breakpoint was set via
[`function name`](#bdb.Breakpoint.funcname), we have to check we are in
the right *frame* (the right function) and if we are on its first executable
line.

### bdb.effective(file, line, frame)

Return `(active breakpoint, delete temporary flag)` or `(None, None)` as the
breakpoint to act upon.

The *active breakpoint* is the first entry in
[`bplist`](#bdb.Breakpoint.bplist) for the
([`file`](#bdb.Breakpoint.file), [`line`](#bdb.Breakpoint.line))
(which must exist) that is [`enabled`](#bdb.Breakpoint.enabled), for
which [`checkfuncname()`](#bdb.checkfuncname) is true, and that has neither a false
[`condition`](#bdb.Breakpoint.cond) nor positive
[`ignore`](#bdb.Breakpoint.ignore) count.  The *flag*, meaning that a
temporary breakpoint should be deleted, is `False` only when the
[`cond`](#bdb.Breakpoint.cond) cannot be evaluated (in which case,
[`ignore`](#bdb.Breakpoint.ignore) count is ignored).

If no such entry exists, then `(None, None)` is returned.

### bdb.set_trace()

Start debugging with a [`Bdb`](#bdb.Bdb) instance from caller’s frame.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

<a id="initialization"></a>

# Interpreter initialization and finalization

See [Python Initialization Configuration](init_config.md#init-config) for details
on how to configure the interpreter prior to initialization.

<a id="pre-init-safe"></a>

## Before Python initialization

In an application embedding Python, the [`Py_Initialize()`](#c.Py_Initialize) function must
be called before using any other Python/C API functions; with the exception of
a few functions and the [global configuration variables](#global-conf-vars).

The following functions can be safely called before Python is initialized:

* Functions that initialize the interpreter:
  * [`Py_Initialize()`](#c.Py_Initialize)
  * [`Py_InitializeEx()`](#c.Py_InitializeEx)
  * [`Py_InitializeFromConfig()`](#c.Py_InitializeFromConfig)
  * [`Py_BytesMain()`](#c.Py_BytesMain)
  * [`Py_Main()`](#c.Py_Main)
  * the runtime pre-initialization functions covered in [Python Initialization Configuration](init_config.md#init-config)
* Configuration functions:
  * [`PyImport_AppendInittab()`](import.md#c.PyImport_AppendInittab)
  * [`PyImport_ExtendInittab()`](import.md#c.PyImport_ExtendInittab)
  * `PyInitFrozenExtensions()`
  * [`PyMem_SetAllocator()`](memory.md#c.PyMem_SetAllocator)
  * [`PyMem_SetupDebugHooks()`](memory.md#c.PyMem_SetupDebugHooks)
  * [`PyObject_SetArenaAllocator()`](memory.md#c.PyObject_SetArenaAllocator)
  * [`Py_SetProgramName()`](#c.Py_SetProgramName)
  * [`Py_SetPythonHome()`](#c.Py_SetPythonHome)
  * the configuration functions covered in [Python Initialization Configuration](init_config.md#init-config)
* Informative functions:
  * [`Py_IsInitialized()`](#c.Py_IsInitialized)
  * [`PyMem_GetAllocator()`](memory.md#c.PyMem_GetAllocator)
  * [`PyObject_GetArenaAllocator()`](memory.md#c.PyObject_GetArenaAllocator)
  * [`Py_GetBuildInfo()`](#c.Py_GetBuildInfo)
  * [`Py_GetCompiler()`](#c.Py_GetCompiler)
  * [`Py_GetCopyright()`](#c.Py_GetCopyright)
  * [`Py_GetPlatform()`](#c.Py_GetPlatform)
  * [`Py_GetVersion()`](#c.Py_GetVersion)
  * [`Py_IsInitialized()`](#c.Py_IsInitialized)
* Utilities:
  * [`Py_DecodeLocale()`](sys.md#c.Py_DecodeLocale)
  * the status reporting and utility functions covered in [Python Initialization Configuration](init_config.md#init-config)
* Memory allocators:
  * [`PyMem_RawMalloc()`](memory.md#c.PyMem_RawMalloc)
  * [`PyMem_RawRealloc()`](memory.md#c.PyMem_RawRealloc)
  * [`PyMem_RawCalloc()`](memory.md#c.PyMem_RawCalloc)
  * [`PyMem_RawFree()`](memory.md#c.PyMem_RawFree)
* Synchronization:
  * [`PyMutex_Lock()`](synchronization.md#c.PyMutex_Lock)
  * [`PyMutex_Unlock()`](synchronization.md#c.PyMutex_Unlock)

#### NOTE
Despite their apparent similarity to some of the functions listed above,
the following functions **should not be called** before the interpreter has
been initialized: [`Py_EncodeLocale()`](sys.md#c.Py_EncodeLocale), [`PyEval_InitThreads()`](threads.md#c.PyEval_InitThreads), and
[`Py_RunMain()`](#c.Py_RunMain).

<a id="global-conf-vars"></a>

## Global configuration variables

Python has variables for the global configuration to control different features
and options. By default, these flags are controlled by [command line
options](../using/cmdline.md#using-on-interface-options).

When a flag is set by an option, the value of the flag is the number of times
that the option was set. For example, `-b` sets [`Py_BytesWarningFlag`](#c.Py_BytesWarningFlag)
to 1 and `-bb` sets [`Py_BytesWarningFlag`](#c.Py_BytesWarningFlag) to 2.

### int Py_BytesWarningFlag

This API is kept for backward compatibility: setting
[`PyConfig.bytes_warning`](init_config.md#c.PyConfig.bytes_warning) should be used instead, see [Python
Initialization Configuration](init_config.md#init-config).

Issue a warning when comparing [`bytes`](../library/stdtypes.md#bytes) or [`bytearray`](../library/stdtypes.md#bytearray) with
[`str`](../library/stdtypes.md#str) or [`bytes`](../library/stdtypes.md#bytes) with [`int`](../library/functions.md#int).  Issue an error if greater
or equal to `2`.

Set by the [`-b`](../using/cmdline.md#cmdoption-b) option.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_DebugFlag

This API is kept for backward compatibility: setting
[`PyConfig.parser_debug`](init_config.md#c.PyConfig.parser_debug) should be used instead, see [Python
Initialization Configuration](init_config.md#init-config).

Turn on parser debugging output (for expert only, depending on compilation
options).

Set by the [`-d`](../using/cmdline.md#cmdoption-d) option and the [`PYTHONDEBUG`](../using/cmdline.md#envvar-PYTHONDEBUG) environment
variable.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_DontWriteBytecodeFlag

This API is kept for backward compatibility: setting
[`PyConfig.write_bytecode`](init_config.md#c.PyConfig.write_bytecode) should be used instead, see [Python
Initialization Configuration](init_config.md#init-config).

If set to non-zero, Python won’t try to write `.pyc` files on the
import of source modules.

Set by the [`-B`](../using/cmdline.md#cmdoption-B) option and the [`PYTHONDONTWRITEBYTECODE`](../using/cmdline.md#envvar-PYTHONDONTWRITEBYTECODE)
environment variable.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_FrozenFlag

This API is kept for backward compatibility: setting
[`PyConfig.pathconfig_warnings`](init_config.md#c.PyConfig.pathconfig_warnings) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

Private flag used by `_freeze_module` and `frozenmain` programs.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_HashRandomizationFlag

This API is kept for backward compatibility: setting
[`PyConfig.hash_seed`](init_config.md#c.PyConfig.hash_seed) and [`PyConfig.use_hash_seed`](init_config.md#c.PyConfig.use_hash_seed) should
be used instead, see [Python Initialization Configuration](init_config.md#init-config).

Set to `1` if the [`PYTHONHASHSEED`](../using/cmdline.md#envvar-PYTHONHASHSEED) environment variable is set to
a non-empty string.

If the flag is non-zero, read the [`PYTHONHASHSEED`](../using/cmdline.md#envvar-PYTHONHASHSEED) environment
variable to initialize the secret hash seed.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_IgnoreEnvironmentFlag

This API is kept for backward compatibility: setting
[`PyConfig.use_environment`](init_config.md#c.PyConfig.use_environment) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

Ignore all `PYTHON*` environment variables, e.g.
[`PYTHONPATH`](../using/cmdline.md#envvar-PYTHONPATH) and [`PYTHONHOME`](../using/cmdline.md#envvar-PYTHONHOME), that might be set.

Set by the [`-E`](../using/cmdline.md#cmdoption-E) and [`-I`](../using/cmdline.md#cmdoption-I) options.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_InspectFlag

This API is kept for backward compatibility: setting
[`PyConfig.inspect`](init_config.md#c.PyConfig.inspect) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

When a script is passed as first argument or the [`-c`](../using/cmdline.md#cmdoption-c) option is used,
enter interactive mode after executing the script or the command, even when
[`sys.stdin`](../library/sys.md#sys.stdin) does not appear to be a terminal.

Set by the [`-i`](../using/cmdline.md#cmdoption-i) option and the [`PYTHONINSPECT`](../using/cmdline.md#envvar-PYTHONINSPECT) environment
variable.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_InteractiveFlag

This API is kept for backward compatibility: setting
[`PyConfig.interactive`](init_config.md#c.PyConfig.interactive) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

Set by the [`-i`](../using/cmdline.md#cmdoption-i) option.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_IsolatedFlag

This API is kept for backward compatibility: setting
[`PyConfig.isolated`](init_config.md#c.PyConfig.isolated) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

Run Python in isolated mode. In isolated mode [`sys.path`](../library/sys.md#sys.path) contains
neither the script’s directory nor the user’s site-packages directory.

Set by the [`-I`](../using/cmdline.md#cmdoption-I) option.

#### Versionadded
Added in version 3.4.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_LegacyWindowsFSEncodingFlag

This API is kept for backward compatibility: setting
[`PyPreConfig.legacy_windows_fs_encoding`](init_config.md#c.PyPreConfig.legacy_windows_fs_encoding) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

If the flag is non-zero, use the `mbcs` encoding with `replace` error
handler, instead of the UTF-8 encoding with `surrogatepass` error handler,
for the [filesystem encoding and error handler](../glossary.md#term-filesystem-encoding-and-error-handler).

Set to `1` if the [`PYTHONLEGACYWINDOWSFSENCODING`](../using/cmdline.md#envvar-PYTHONLEGACYWINDOWSFSENCODING) environment
variable is set to a non-empty string.

See [**PEP 529**](https://peps.python.org/pep-0529/) for more details.

[Availability](../library/intro.md#availability): Windows.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_LegacyWindowsStdioFlag

This API is kept for backward compatibility: setting
[`PyConfig.legacy_windows_stdio`](init_config.md#c.PyConfig.legacy_windows_stdio) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

If the flag is non-zero, use [`io.FileIO`](../library/io.md#io.FileIO) instead of
`io._WindowsConsoleIO` for [`sys`](../library/sys.md#module-sys) standard streams.

Set to `1` if the [`PYTHONLEGACYWINDOWSSTDIO`](../using/cmdline.md#envvar-PYTHONLEGACYWINDOWSSTDIO) environment
variable is set to a non-empty string.

See [**PEP 528**](https://peps.python.org/pep-0528/) for more details.

[Availability](../library/intro.md#availability): Windows.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_NoSiteFlag

This API is kept for backward compatibility: setting
[`PyConfig.site_import`](init_config.md#c.PyConfig.site_import) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

Disable the import of the module [`site`](../library/site.md#module-site) and the site-dependent
manipulations of [`sys.path`](../library/sys.md#sys.path) that it entails.  Also disable these
manipulations if [`site`](../library/site.md#module-site) is explicitly imported later (call
[`site.main()`](../library/site.md#site.main) if you want them to be triggered).

Set by the [`-S`](../using/cmdline.md#cmdoption-S) option.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_NoUserSiteDirectory

This API is kept for backward compatibility: setting
[`PyConfig.user_site_directory`](init_config.md#c.PyConfig.user_site_directory) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

Don’t add the [`user site-packages directory`](../library/site.md#site.USER_SITE) to
[`sys.path`](../library/sys.md#sys.path).

Set by the [`-s`](../using/cmdline.md#cmdoption-s) and [`-I`](../using/cmdline.md#cmdoption-I) options, and the
[`PYTHONNOUSERSITE`](../using/cmdline.md#envvar-PYTHONNOUSERSITE) environment variable.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_OptimizeFlag

This API is kept for backward compatibility: setting
[`PyConfig.optimization_level`](init_config.md#c.PyConfig.optimization_level) should be used instead, see
[Python Initialization Configuration](init_config.md#init-config).

Set by the [`-O`](../using/cmdline.md#cmdoption-O) option and the [`PYTHONOPTIMIZE`](../using/cmdline.md#envvar-PYTHONOPTIMIZE) environment
variable.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_QuietFlag

This API is kept for backward compatibility: setting
[`PyConfig.quiet`](init_config.md#c.PyConfig.quiet) should be used instead, see [Python
Initialization Configuration](init_config.md#init-config).

Don’t display the copyright and version messages even in interactive mode.

Set by the [`-q`](../using/cmdline.md#cmdoption-q) option.

#### Versionadded
Added in version 3.2.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_UnbufferedStdioFlag

This API is kept for backward compatibility: setting
[`PyConfig.buffered_stdio`](init_config.md#c.PyConfig.buffered_stdio) should be used instead, see [Python
Initialization Configuration](init_config.md#init-config).

Force the stdout and stderr streams to be unbuffered.

Set by the [`-u`](../using/cmdline.md#cmdoption-u) option and the [`PYTHONUNBUFFERED`](../using/cmdline.md#envvar-PYTHONUNBUFFERED)
environment variable.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

### int Py_VerboseFlag

This API is kept for backward compatibility: setting
[`PyConfig.verbose`](init_config.md#c.PyConfig.verbose) should be used instead, see [Python
Initialization Configuration](init_config.md#init-config).

Print a message each time a module is initialized, showing the place
(filename or built-in module) from which it is loaded.  If greater or equal
to `2`, print a message for each file that is checked for when
searching for a module. Also provides information on module cleanup at exit.

Set by the [`-v`](../using/cmdline.md#cmdoption-v) option and the [`PYTHONVERBOSE`](../using/cmdline.md#envvar-PYTHONVERBOSE) environment
variable.

#### Deprecated-removed
Deprecated since version 3.12, removed in version 3.15.

## Initializing and finalizing the interpreter

### void Py_Initialize()

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-15"></a>

Initialize the Python interpreter.  In an application embedding Python,
this should be called before using any other Python/C API functions; see
[Before Python Initialization](#pre-init-safe) for the few exceptions.

This initializes the table of loaded modules (`sys.modules`), and creates
the fundamental modules [`builtins`](../library/builtins.md#module-builtins), [`__main__`](../library/__main__.md#module-__main__) and [`sys`](../library/sys.md#module-sys).
It also initializes the module search path (`sys.path`). It does not set
`sys.argv`; use the [Python Initialization Configuration](init_config.md#init-config)
API for that. This is a no-op when called for a second time (without calling
[`Py_FinalizeEx()`](#c.Py_FinalizeEx) first).  There is no return value; it is a fatal
error if the initialization fails.

Use [`Py_InitializeFromConfig()`](#c.Py_InitializeFromConfig) to customize the
[Python Initialization Configuration](init_config.md#init-config).

#### NOTE
On Windows, changes the console mode from `O_TEXT` to `O_BINARY`,
which will also affect non-Python uses of the console using the C Runtime.

### void Py_InitializeEx(int initsigs)

 *Part of the [Stable ABI](stable.md#stable).*

This function works like [`Py_Initialize()`](#c.Py_Initialize) if *initsigs* is `1`. If
*initsigs* is `0`, it skips initialization registration of signal handlers,
which may be useful when CPython is embedded as part of a larger application.

Use [`Py_InitializeFromConfig()`](#c.Py_InitializeFromConfig) to customize the
[Python Initialization Configuration](init_config.md#init-config).

### [PyStatus](init_config.md#c.PyStatus) Py_InitializeFromConfig(const [PyConfig](init_config.md#c.PyConfig) \*config)

Initialize Python from *config* configuration, as described in
[Initialization with PyConfig](init_config.md#init-from-config).

See the [Python Initialization Configuration](init_config.md#init-config) section for details on pre-initializing the
interpreter, populating the runtime configuration structure, and querying
the returned status structure.

### int Py_IsInitialized()

 *Part of the [Stable ABI](stable.md#stable).*

Return true (nonzero) when the Python interpreter has been initialized, false
(zero) if not.  After [`Py_FinalizeEx()`](#c.Py_FinalizeEx) is called, this returns false until
[`Py_Initialize()`](#c.Py_Initialize) is called again.

#### Versionchanged
Changed in version 3.15.0a8 (unreleased): This function no longer returns true until initialization has fully
completed, including import of the [`site`](../library/site.md#module-site) module.  Previously it
could return true while [`Py_Initialize()`](#c.Py_Initialize) was still running.

### int Py_IsFinalizing()

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Return true (non-zero) if the main Python interpreter is
[shutting down](../glossary.md#term-interpreter-shutdown). Return false (zero) otherwise.

#### Versionadded
Added in version 3.13.

### int Py_FinalizeEx()

 *Part of the [Stable ABI](stable.md#stable) since version 3.6.*

Undo all initializations made by [`Py_Initialize()`](#c.Py_Initialize) and subsequent use of
Python/C API functions, and destroy all sub-interpreters (see
[`Py_NewInterpreter()`](subinterpreters.md#c.Py_NewInterpreter) below) that were created and not yet destroyed since
the last call to [`Py_Initialize()`](#c.Py_Initialize).  This is a no-op when called for a second
time (without calling [`Py_Initialize()`](#c.Py_Initialize) again first).

Since this is the reverse of [`Py_Initialize()`](#c.Py_Initialize), it should be called
in the same thread with the same interpreter active.  That means
the main thread and the main interpreter.
This should never be called while [`Py_RunMain()`](#c.Py_RunMain) is running.

Normally the return value is `0`.
If there were errors during finalization (flushing buffered data),
`-1` is returned.

Note that Python will do a best effort at freeing all memory allocated by the Python
interpreter.  Therefore, any C-Extension should make sure to correctly clean up all
of the previously allocated PyObjects before using them in subsequent calls to
[`Py_Initialize()`](#c.Py_Initialize).  Otherwise it could introduce vulnerabilities and incorrect
behavior.

This function is provided for a number of reasons.  An embedding application
might want to restart Python without having to restart the application itself.
An application that has loaded the Python interpreter from a dynamically
loadable library (or DLL) might want to free all memory allocated by Python
before unloading the DLL. During a hunt for memory leaks in an application a
developer might want to free all memory allocated by Python before exiting from
the application.

**Bugs and caveats:** The destruction of modules and objects in modules is done
in random order; this may cause destructors ([`__del__()`](../reference/datamodel.md#object.__del__) methods) to fail
when they depend on other objects (even functions) or modules.  Dynamically
loaded extension modules loaded by Python are not unloaded.  Small amounts of
memory allocated by the Python interpreter may not be freed (if you find a leak,
please report it).  Memory tied up in circular references between objects is not
freed.  Interned strings will all be deallocated regardless of their reference count.
Some memory allocated by extension modules may not be freed.  Some extensions may not
work properly if their initialization routine is called more than once; this can
happen if an application calls [`Py_Initialize()`](#c.Py_Initialize) and [`Py_FinalizeEx()`](#c.Py_FinalizeEx)
more than once.  [`Py_FinalizeEx()`](#c.Py_FinalizeEx) must not be called recursively from
within itself.  Therefore, it must not be called by any code that may be run
as part of the interpreter shutdown process, such as [`atexit`](../library/atexit.md#module-atexit)
handlers, object finalizers, or any code that may be run while flushing the
stdout and stderr files.

Raises an [auditing event](../library/sys.md#auditing) `cpython._PySys_ClearAuditHooks` with no arguments.

#### Versionadded
Added in version 3.6.

### void Py_Finalize()

 *Part of the [Stable ABI](stable.md#stable).*

This is a backwards-compatible version of [`Py_FinalizeEx()`](#c.Py_FinalizeEx) that
disregards the return value.

### int Py_BytesMain(int argc, char \*\*argv)

 *Part of the [Stable ABI](stable.md#stable) since version 3.8.*

Similar to [`Py_Main()`](#c.Py_Main) but *argv* is an array of bytes strings,
allowing the calling application to delegate the text decoding step to
the CPython runtime.

#### Versionadded
Added in version 3.8.

### int Py_Main(int argc, wchar_t \*\*argv)

 *Part of the [Stable ABI](stable.md#stable).*

The main program for the standard interpreter, encapsulating a full
initialization/finalization cycle, as well as additional
behaviour to implement reading configurations settings from the environment
and command line, and then executing `__main__` in accordance with
[Command line](../using/cmdline.md#using-on-cmdline).

This is made available for programs which wish to support the full CPython
command line interface, rather than just embedding a Python runtime in a
larger application.

The *argc* and *argv* parameters are similar to those which are passed to a
C program’s `main()` function, except that the *argv* entries are first
converted to `wchar_t` using [`Py_DecodeLocale()`](sys.md#c.Py_DecodeLocale). It is also
important to note that the argument list entries may be modified to point to
strings other than those passed in (however, the contents of the strings
pointed to by the argument list are not modified).

The return value is `2` if the argument list does not represent a valid
Python command line, and otherwise the same as [`Py_RunMain()`](#c.Py_RunMain).

In terms of the CPython runtime configuration APIs documented in the
[runtime configuration](init_config.md#init-config) section (and without accounting
for error handling), `Py_Main` is approximately equivalent to:

```c
PyConfig config;
PyConfig_InitPythonConfig(&config);
PyConfig_SetArgv(&config, argc, argv);
Py_InitializeFromConfig(&config);
PyConfig_Clear(&config);

Py_RunMain();
```

In normal usage, an embedding application will call this function
*instead* of calling [`Py_Initialize()`](#c.Py_Initialize), [`Py_InitializeEx()`](#c.Py_InitializeEx) or
[`Py_InitializeFromConfig()`](#c.Py_InitializeFromConfig) directly, and all settings will be applied
as described elsewhere in this documentation. If this function is instead
called *after* a preceding runtime initialization API call, then exactly
which environmental and command line configuration settings will be updated
is version dependent (as it depends on which settings correctly support
being modified after they have already been set once when the runtime was
first initialized).

### int Py_RunMain(void)

Executes the main module in a fully configured CPython runtime.

Executes the command ([`PyConfig.run_command`](init_config.md#c.PyConfig.run_command)), the script
([`PyConfig.run_filename`](init_config.md#c.PyConfig.run_filename)) or the module
([`PyConfig.run_module`](init_config.md#c.PyConfig.run_module)) specified on the command line or in the
configuration. If none of these values are set, runs the interactive Python
prompt (REPL) using the `__main__` module’s global namespace.

If [`PyConfig.inspect`](init_config.md#c.PyConfig.inspect) is not set (the default), the return value
will be `0` if the interpreter exits normally (that is, without raising
an exception), the exit status of an unhandled [`SystemExit`](../library/exceptions.md#SystemExit), or `1`
for any other unhandled exception.

If [`PyConfig.inspect`](init_config.md#c.PyConfig.inspect) is set (such as when the [`-i`](../using/cmdline.md#cmdoption-i) option
is used), rather than returning when the interpreter exits, execution will
instead resume in an interactive Python prompt (REPL) using the `__main__`
module’s global namespace. If the interpreter exited with an exception, it
is immediately raised in the REPL session. The function return value is
then determined by the way the *REPL session* terminates: `0`, `1`, or
the status of a [`SystemExit`](../library/exceptions.md#SystemExit), as specified above.

This function always finalizes the Python interpreter before it returns.

See [Python Configuration](init_config.md#init-python-config) for an example of a
customized Python that always runs in isolated mode using
[`Py_RunMain()`](#c.Py_RunMain).

### int PyUnstable_AtExit([PyInterpreterState](subinterpreters.md#c.PyInterpreterState) \*interp, void (\*func)(void\*), void \*data)

Register an [`atexit`](../library/atexit.md#module-atexit) callback for the target interpreter *interp*.
This is similar to [`Py_AtExit()`](sys.md#c.Py_AtExit), but takes an explicit interpreter and
data pointer for the callback.

There must be an [attached thread state](../glossary.md#term-attached-thread-state) for *interp*.

#### Versionadded
Added in version 3.13.

<a id="cautions-regarding-runtime-finalization"></a>

## Cautions regarding runtime finalization

In the late stage of [interpreter shutdown](../glossary.md#term-interpreter-shutdown), after attempting to wait for
non-daemon threads to exit (though this can be interrupted by
[`KeyboardInterrupt`](../library/exceptions.md#KeyboardInterrupt)) and running the [`atexit`](../library/atexit.md#module-atexit) functions, the runtime
is marked as *finalizing*: [`Py_IsFinalizing()`](#c.Py_IsFinalizing) and
[`sys.is_finalizing()`](../library/sys.md#sys.is_finalizing) return true.  At this point, only the *finalization
thread* that initiated finalization (typically the main thread) is allowed to
acquire the [GIL](../glossary.md#term-GIL).

If any thread, other than the finalization thread, attempts to attach a [thread state](../glossary.md#term-thread-state)
during finalization, either explicitly or
implicitly, the thread enters **a permanently blocked state**
where it remains until the program exits.  In most cases this is harmless, but this can result
in deadlock if a later stage of finalization attempts to acquire a lock owned by the
blocked thread, or otherwise waits on the blocked thread.

Gross? Yes. This prevents random crashes and/or unexpectedly skipped C++
finalizations further up the call stack when such threads were forcibly exited
here in CPython 3.13 and earlier. The CPython runtime [thread state](../glossary.md#term-thread-state) C APIs
have never had any error reporting or handling expectations at [thread state](../glossary.md#term-thread-state)
attachment time that would’ve allowed for graceful exit from this situation. Changing that
would require new stable C APIs and rewriting the majority of C code in the
CPython ecosystem to use those with error handling.

## Process-wide parameters

### void Py_SetProgramName(const wchar_t \*name)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-16"></a>

This API is kept for backward compatibility: setting
[`PyConfig.program_name`](init_config.md#c.PyConfig.program_name) should be used instead, see [Python
Initialization Configuration](init_config.md#init-config).

This function should be called before [`Py_Initialize()`](#c.Py_Initialize) is called for
the first time, if it is called at all.  It tells the interpreter the value
of the `argv[0]` argument to the `main()` function of the program
(converted to wide characters).
This is used by some other functions below to find
the Python run-time libraries relative to the interpreter executable.  The
default value is `'python'`.  The argument should point to a
zero-terminated wide character string in static storage whose contents will not
change for the duration of the program’s execution.  No code in the Python
interpreter will change the contents of this storage.

Use [`Py_DecodeLocale()`](sys.md#c.Py_DecodeLocale) to decode a bytes string to get a
 string.

#### Deprecated-removed
Deprecated since version 3.11, removed in version 3.15.

### const char \*Py_GetVersion()

 *Part of the [Stable ABI](stable.md#stable).*

Return the version of this Python interpreter.  This is a string that looks
something like

```c
"3.0a5+ (py3k:63103M, May 12 2008, 00:53:55) \n[GCC 4.2.3]"
```

<a id="index-17"></a>

The first word (up to the first space character) is the current Python version;
the first characters are the major and minor version separated by a
period.  The returned string points into static storage; the caller should not
modify its value.  The value is available to Python code as [`sys.version`](../library/sys.md#sys.version).

See also the [`Py_Version`](apiabiversion.md#c.Py_Version) constant.

### const char \*Py_GetPlatform()

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-18"></a>

Return the platform identifier for the current platform.  On Unix, this is
formed from the “official” name of the operating system, converted to lower
case, followed by the major revision number; e.g., for Solaris 2.x, which is
also known as SunOS 5.x, the value is `'sunos5'`.  On macOS, it is
`'darwin'`.  On Windows, it is `'win'`.  The returned string points into
static storage; the caller should not modify its value.  The value is available
to Python code as `sys.platform`.

### const char \*Py_GetCopyright()

 *Part of the [Stable ABI](stable.md#stable).*

Return the official copyright string for the current Python version, for example

`'Copyright 1991-1995 Stichting Mathematisch Centrum, Amsterdam'`

<a id="index-19"></a>

The returned string points into static storage; the caller should not modify its
value.  The value is available to Python code as `sys.copyright`.

### const char \*Py_GetCompiler()

 *Part of the [Stable ABI](stable.md#stable).*

Return an indication of the compiler used to build the current Python version,
in square brackets, for example:

```c
"[GCC 2.7.2.2]"
```

<a id="index-20"></a>

The returned string points into static storage; the caller should not modify its
value.  The value is available to Python code as part of the variable
`sys.version`.

### const char \*Py_GetBuildInfo()

 *Part of the [Stable ABI](stable.md#stable).*

Return information about the sequence number and build date and time of the
current Python interpreter instance, for example

```c
"#67, Aug  1 1997, 22:34:28"
```

<a id="index-21"></a>

The returned string points into static storage; the caller should not modify its
value.  The value is available to Python code as part of the variable
`sys.version`.

### void PySys_SetArgvEx(int argc, wchar_t \*\*argv, int updatepath)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-22"></a>

This API is kept for backward compatibility: setting
[`PyConfig.argv`](init_config.md#c.PyConfig.argv), [`PyConfig.parse_argv`](init_config.md#c.PyConfig.parse_argv) and
[`PyConfig.safe_path`](init_config.md#c.PyConfig.safe_path) should be used instead, see [Python
Initialization Configuration](init_config.md#init-config).

Set [`sys.argv`](../library/sys.md#sys.argv) based on *argc* and *argv*.  These parameters are
similar to those passed to the program’s `main()` function with the
difference that the first entry should refer to the script file to be
executed rather than the executable hosting the Python interpreter.  If there
isn’t a script that will be run, the first entry in *argv* can be an empty
string.  If this function fails to initialize [`sys.argv`](../library/sys.md#sys.argv), a fatal
condition is signalled using [`Py_FatalError()`](sys.md#c.Py_FatalError).

If *updatepath* is zero, this is all the function does.  If *updatepath*
is non-zero, the function also modifies [`sys.path`](../library/sys.md#sys.path) according to the
following algorithm:

- If the name of an existing script is passed in `argv[0]`, the absolute
  path of the directory where the script is located is prepended to
  [`sys.path`](../library/sys.md#sys.path).
- Otherwise (that is, if *argc* is `0` or `argv[0]` doesn’t point
  to an existing file name), an empty string is prepended to
  [`sys.path`](../library/sys.md#sys.path), which is the same as prepending the current working
  directory (`"."`).

Use [`Py_DecodeLocale()`](sys.md#c.Py_DecodeLocale) to decode a bytes string to get a
 string.

See also [`PyConfig.orig_argv`](init_config.md#c.PyConfig.orig_argv) and [`PyConfig.argv`](init_config.md#c.PyConfig.argv)
members of the [Python Initialization Configuration](init_config.md#init-config).

#### NOTE
It is recommended that applications embedding the Python interpreter
for purposes other than executing a single script pass `0` as *updatepath*,
and update [`sys.path`](../library/sys.md#sys.path) themselves if desired.
See [**CVE 2008-5983**](https://www.cve.org/CVERecord?id=CVE-2008-5983).

On versions before 3.1.3, you can achieve the same effect by manually
popping the first [`sys.path`](../library/sys.md#sys.path) element after having called
[`PySys_SetArgv()`](#c.PySys_SetArgv), for example using:

```c
PyRun_SimpleString("import sys; sys.path.pop(0)\n");
```

#### Versionadded
Added in version 3.1.3.

#### Deprecated-removed
Deprecated since version 3.11, removed in version 3.15.

### void PySys_SetArgv(int argc, wchar_t \*\*argv)

 *Part of the [Stable ABI](stable.md#stable).*

This API is kept for backward compatibility: setting
[`PyConfig.argv`](init_config.md#c.PyConfig.argv) and [`PyConfig.parse_argv`](init_config.md#c.PyConfig.parse_argv) should be used
instead, see [Python Initialization Configuration](init_config.md#init-config).

This function works like [`PySys_SetArgvEx()`](#c.PySys_SetArgvEx) with *updatepath* set
to `1` unless the **python** interpreter was started with the
[`-I`](../using/cmdline.md#cmdoption-I).

Use [`Py_DecodeLocale()`](sys.md#c.Py_DecodeLocale) to decode a bytes string to get a
 string.

See also [`PyConfig.orig_argv`](init_config.md#c.PyConfig.orig_argv) and [`PyConfig.argv`](init_config.md#c.PyConfig.argv)
members of the [Python Initialization Configuration](init_config.md#init-config).

#### Versionchanged
Changed in version 3.4: The *updatepath* value depends on [`-I`](../using/cmdline.md#cmdoption-I).

#### Deprecated-removed
Deprecated since version 3.11, removed in version 3.15.

### void Py_SetPythonHome(const wchar_t \*home)

 *Part of the [Stable ABI](stable.md#stable).*

This API is kept for backward compatibility: setting
[`PyConfig.home`](init_config.md#c.PyConfig.home) should be used instead, see [Python
Initialization Configuration](init_config.md#init-config).

Set the default “home” directory, that is, the location of the standard
Python libraries.  See [`PYTHONHOME`](../using/cmdline.md#envvar-PYTHONHOME) for the meaning of the
argument string.

The argument should point to a zero-terminated character string in static
storage whose contents will not change for the duration of the program’s
execution.  No code in the Python interpreter will change the contents of
this storage.

Use [`Py_DecodeLocale()`](sys.md#c.Py_DecodeLocale) to decode a bytes string to get a
 string.

#### Deprecated-removed
Deprecated since version 3.11, removed in version 3.15.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

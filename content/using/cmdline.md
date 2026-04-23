<!-- ATTENTION: You probably should update Misc/python.man, too, if you modify
this file. -->

<a id="using-on-general"></a>

# Command line and environment

The CPython interpreter scans the command line and the environment for various
settings.

**CPython implementation detail:** Other implementations’ command line schemes may differ.  See
[Alternate Implementations](../reference/introduction.md#implementations) for further resources.

<a id="using-on-cmdline"></a>

## Command line

When invoking Python, you may specify any of these options:

```sh
python [-bBdEhiIOPqRsSuvVWx?] [-c command | -m module-name | script | - ] [args]
```

The most common use case is, of course, a simple invocation of a script:

```sh
python myscript.py
```

<a id="using-on-interface-options"></a>

### Interface options

The interpreter interface resembles that of the UNIX shell, but provides some
additional methods of invocation:

* When called with standard input connected to a tty device, it prompts for
  commands and executes them until an EOF (an end-of-file character, you can
  produce that with `Ctrl`-`D` on UNIX or `Ctrl`-`Z,` `Enter` on Windows) is read.
  For more on interactive mode, see [Interactive Mode](../tutorial/appendix.md#tut-interac).
* When called with a file name argument or with a file as standard input, it
  reads and executes a script from that file.
* When called with a directory name argument, it reads and executes an
  appropriately named script from that directory.
* When called with `-c command`, it executes the Python statement(s) given as
  *command*.  Here *command* may contain multiple statements separated by
  newlines.
* When called with `-m module-name`, the given module is located on the
  Python module path and executed as a script.

In non-interactive mode, the entire input is parsed before it is executed.

An interface option terminates the list of options consumed by the interpreter,
all consecutive arguments will end up in [`sys.argv`](../library/sys.md#sys.argv) – note that the first
element, subscript zero (`sys.argv[0]`), is a string reflecting the program’s
source.

### -c <command>

Execute the Python code in *command*.  *command* can be one or more
statements separated by newlines, with significant leading whitespace as in
normal module code.

If this option is given, the first element of [`sys.argv`](../library/sys.md#sys.argv) will be
`"-c"` and the current directory will be added to the start of
[`sys.path`](../library/sys.md#sys.path) (allowing modules in that directory to be imported as top
level modules).

Raises an [auditing event](../library/sys.md#auditing) `cpython.run_command` with argument `command`.

#### Versionchanged
Changed in version 3.14: *command* is automatically dedented before execution.

### -m <module-name>

Search [`sys.path`](../library/sys.md#sys.path) for the named module and execute its contents as
the [`__main__`](../library/__main__.md#module-__main__) module.

Since the argument is a *module* name, you must not give a file extension
(`.py`).  The module name should be a valid absolute Python module name, but
the implementation may not always enforce this (e.g. it may allow you to
use a name that includes a hyphen).

Package names (including namespace packages) are also permitted. When a
package name is supplied instead
of a normal module, the interpreter will execute `<pkg>.__main__` as
the main module. This behaviour is deliberately similar to the handling
of directories and zipfiles that are passed to the interpreter as the
script argument.

#### NOTE
This option cannot be used with built-in modules and extension modules
written in C, since they do not have Python module files. However, it
can still be used for precompiled modules, even if the original source
file is not available.

If this option is given, the first element of [`sys.argv`](../library/sys.md#sys.argv) will be the
full path to the module file (while the module file is being located, the
first element will be set to `"-m"`). As with the [`-c`](#cmdoption-c) option,
the current directory will be added to the start of [`sys.path`](../library/sys.md#sys.path).

[`-I`](#cmdoption-I) option can  be used to run the script in isolated mode where
[`sys.path`](../library/sys.md#sys.path) contains neither the current directory nor the user’s
site-packages directory. All `PYTHON*` environment variables are
ignored, too.

Many standard library modules contain code that is invoked on their execution
as a script.  An example is the [`timeit`](../library/timeit.md#module-timeit) module:

```sh
python -m timeit -s "setup here" "benchmarked code here"
python -m timeit -h # for details
```

Raises an [auditing event](../library/sys.md#auditing) `cpython.run_module` with argument `module-name`.

#### SEE ALSO
[`runpy.run_module()`](../library/runpy.md#runpy.run_module)
: Equivalent functionality directly available to Python code

[**PEP 338**](https://peps.python.org/pep-0338/) – Executing modules as scripts

#### Versionchanged
Changed in version 3.1: Supply the package name to run a `__main__` submodule.

#### Versionchanged
Changed in version 3.4: namespace packages are also supported

<a id="cmdarg-dash"></a>

### -

Read commands from standard input ([`sys.stdin`](../library/sys.md#sys.stdin)).  If standard input is
a terminal, [`-i`](#cmdoption-i) is implied.

If this option is given, the first element of [`sys.argv`](../library/sys.md#sys.argv) will be
`"-"` and the current directory will be added to the start of
[`sys.path`](../library/sys.md#sys.path).

Raises an [auditing event](../library/sys.md#auditing) `cpython.run_stdin` with no arguments.

<a id="cmdarg-script"></a>

### <script>

Execute the Python code contained in *script*, which must be a filesystem
path (absolute or relative) referring to either a Python file, a directory
containing a `__main__.py` file, or a zipfile containing a
`__main__.py` file.

If this option is given, the first element of [`sys.argv`](../library/sys.md#sys.argv) will be the
script name as given on the command line.

If the script name refers directly to a Python file, the directory
containing that file is added to the start of [`sys.path`](../library/sys.md#sys.path), and the
file is executed as the [`__main__`](../library/__main__.md#module-__main__) module.

If the script name refers to a directory or zipfile, the script name is
added to the start of [`sys.path`](../library/sys.md#sys.path) and the `__main__.py` file in
that location is executed as the [`__main__`](../library/__main__.md#module-__main__) module.

[`-I`](#cmdoption-I) option can  be used to run the script in isolated mode where
[`sys.path`](../library/sys.md#sys.path) contains neither the script’s directory nor the user’s
site-packages directory. All `PYTHON*` environment variables are
ignored, too.

Raises an [auditing event](../library/sys.md#auditing) `cpython.run_file` with argument `filename`.

#### SEE ALSO
[`runpy.run_path()`](../library/runpy.md#runpy.run_path)
: Equivalent functionality directly available to Python code

If no interface option is given, [`-i`](#cmdoption-i) is implied, `sys.argv[0]` is
an empty string (`""`) and the current directory will be added to the
start of [`sys.path`](../library/sys.md#sys.path).  Also, tab-completion and history editing is
automatically enabled, if available on your platform (see
[Readline configuration](../library/site.md#rlcompleter-config)).

#### SEE ALSO
[Invoking the Interpreter](../tutorial/interpreter.md#tut-invoking)

#### Versionchanged
Changed in version 3.4: Automatic enabling of tab-completion and history editing.

<a id="using-on-generic-options"></a>

### Generic options

### -?

### -h

### --help

Print a short description of all command line options and corresponding
environment variables and exit.

### --help-env

Print a short description of Python-specific environment variables
and exit.

#### Versionadded
Added in version 3.11.

### --help-xoptions

Print a description of implementation-specific [`-X`](#cmdoption-X) options
and exit.

#### Versionadded
Added in version 3.11.

### --help-all

Print complete usage information and exit.

#### Versionadded
Added in version 3.11.

### -V

### --version

Print the Python version number and exit.  Example output could be:

```none
Python 3.8.0b2+
```

When given twice, print more information about the build, like:

```none
Python 3.8.0b2+ (3.8:0c076caaa8, Apr 20 2019, 21:55:00)
[GCC 6.2.0 20161005]
```

#### Versionadded
Added in version 3.6: The `-VV` option.

<a id="using-on-misc-options"></a>

### Miscellaneous options

### -b

Issue a warning when converting [`bytes`](../library/stdtypes.md#bytes) or [`bytearray`](../library/stdtypes.md#bytearray) to
[`str`](../library/stdtypes.md#str) without specifying encoding or comparing `bytes` or
`bytearray` with `str` or `bytes` with [`int`](../library/functions.md#int).
Issue an error when the option is given twice (`-bb`).

#### Versionchanged
Changed in version 3.5: Affects also comparisons of [`bytes`](../library/stdtypes.md#bytes) with [`int`](../library/functions.md#int).

#### Deprecated
Deprecated since version 3.15: Deprecate [`-b`](#cmdoption-b) and `-bb` command line options
and schedule them to become no-op in Python 3.17.
These were primarily helpers for the Python 2 -> 3 transition.
Starting with Python 3.17, no [`BytesWarning`](../library/exceptions.md#BytesWarning) will be raised
for these cases; use a type checker instead.

### -B

If given, Python won’t try to write `.pyc` files on the
import of source modules.  See also [`PYTHONDONTWRITEBYTECODE`](#envvar-PYTHONDONTWRITEBYTECODE).

### --check-hash-based-pycs default|always|never

Control the validation behavior of hash-based `.pyc` files. See
[Cached bytecode invalidation](../reference/import.md#pyc-invalidation). When set to `default`, checked and unchecked
hash-based bytecode cache files are validated according to their default
semantics. When set to `always`, all hash-based `.pyc` files, whether
checked or unchecked, are validated against their corresponding source
file. When set to `never`, hash-based `.pyc` files are not validated
against their corresponding source files.

The semantics of timestamp-based `.pyc` files are unaffected by this
option.

### -d

Turn on parser debugging output (for expert only).
See also the [`PYTHONDEBUG`](#envvar-PYTHONDEBUG) environment variable.

This option requires a [debug build of Python](configure.md#debug-build), otherwise
it’s ignored.

### -E

Ignore all `PYTHON*` environment variables, e.g.
[`PYTHONPATH`](#envvar-PYTHONPATH) and [`PYTHONHOME`](#envvar-PYTHONHOME), that might be set.

See also the [`-P`](#cmdoption-P) and [`-I`](#cmdoption-I) (isolated) options.

### -i

Enter interactive mode after execution.

Using the [`-i`](#cmdoption-i) option will enter interactive mode in any of the following circumstances:

* When a script is passed as first argument
* When the [`-c`](#cmdoption-c) option is used
* When the [`-m`](#cmdoption-m) option is used

Interactive mode will start even when [`sys.stdin`](../library/sys.md#sys.stdin) does not appear to be a terminal. The
[`PYTHONSTARTUP`](#envvar-PYTHONSTARTUP) file is not read.

This can be useful to inspect global variables or a stack trace when a script
raises an exception.  See also [`PYTHONINSPECT`](#envvar-PYTHONINSPECT).

### -I

Run Python in isolated mode. This also implies [`-E`](#cmdoption-E), [`-P`](#cmdoption-P)
and [`-s`](#cmdoption-s) options.

In isolated mode [`sys.path`](../library/sys.md#sys.path) contains neither the script’s directory nor
the user’s site-packages directory. All `PYTHON*` environment
variables are ignored, too. Further restrictions may be imposed to prevent
the user from injecting malicious code.

#### Versionadded
Added in version 3.4.

### -O

Remove assert statements and any code conditional on the value of
[`__debug__`](../library/constants.md#debug__).  Augment the filename for compiled
([bytecode](../glossary.md#term-bytecode)) files by adding `.opt-1` before the `.pyc`
extension (see [**PEP 488**](https://peps.python.org/pep-0488/)).  See also [`PYTHONOPTIMIZE`](#envvar-PYTHONOPTIMIZE).

#### Versionchanged
Changed in version 3.5: Modify `.pyc` filenames according to [**PEP 488**](https://peps.python.org/pep-0488/).

### -OO

Do [`-O`](#cmdoption-O) and also discard docstrings.  Augment the filename
for compiled ([bytecode](../glossary.md#term-bytecode)) files by adding `.opt-2` before the
`.pyc` extension (see [**PEP 488**](https://peps.python.org/pep-0488/)).

#### Versionchanged
Changed in version 3.5: Modify `.pyc` filenames according to [**PEP 488**](https://peps.python.org/pep-0488/).

### -P

Don’t prepend a potentially unsafe path to [`sys.path`](../library/sys.md#sys.path):

* `python -m module` command line: Don’t prepend the current working
  directory.
* `python script.py` command line: Don’t prepend the script’s directory.
  If it’s a symbolic link, resolve symbolic links.
* `python -c code` and `python` (REPL) command lines: Don’t prepend an
  empty string, which means the current working directory.

See also the [`PYTHONSAFEPATH`](#envvar-PYTHONSAFEPATH) environment variable, and [`-E`](#cmdoption-E)
and [`-I`](#cmdoption-I) (isolated) options.

#### Versionadded
Added in version 3.11.

### -q

Don’t display the copyright and version messages even in interactive mode.

#### Versionadded
Added in version 3.2.

### -R

Turn on hash randomization. This option only has an effect if the
[`PYTHONHASHSEED`](#envvar-PYTHONHASHSEED) environment variable is set to anything other
than `random`, since hash randomization is enabled by default.

On previous versions of Python, this option turns on hash randomization,
so that the [`__hash__()`](../reference/datamodel.md#object.__hash__) values of str and bytes objects
are “salted” with an unpredictable random value.  Although they remain
constant within an individual Python process, they are not predictable
between repeated invocations of Python.

Hash randomization is intended to provide protection against a
denial-of-service caused by carefully chosen inputs that exploit the worst
case performance of a dict construction, *O*(*n*<sub>2</sub>) complexity.  See
[https://ocert.org/advisories/ocert-2011-003.html](https://ocert.org/advisories/ocert-2011-003.html) for details.

[`PYTHONHASHSEED`](#envvar-PYTHONHASHSEED) allows you to set a fixed value for the hash
seed secret.

#### Versionadded
Added in version 3.2.3.

#### Versionchanged
Changed in version 3.7: The option is no longer ignored.

### -s

Don’t add the [`user site-packages directory`](../library/site.md#site.USER_SITE) to
[`sys.path`](../library/sys.md#sys.path).

See also [`PYTHONNOUSERSITE`](#envvar-PYTHONNOUSERSITE).

#### SEE ALSO
[**PEP 370**](https://peps.python.org/pep-0370/) – Per user site-packages directory

### -S

Disable the import of the module [`site`](../library/site.md#module-site) and the site-dependent
manipulations of [`sys.path`](../library/sys.md#sys.path) that it entails.  Also disable these
manipulations if [`site`](../library/site.md#module-site) is explicitly imported later (call
[`site.main()`](../library/site.md#site.main) if you want them to be triggered).

### -u

Force the stdout and stderr streams to be unbuffered.  This option has no
effect on the stdin stream.

See also [`PYTHONUNBUFFERED`](#envvar-PYTHONUNBUFFERED).

#### Versionchanged
Changed in version 3.7: The text layer of the stdout and stderr streams now is unbuffered.

### -v

Print a message each time a module is initialized, showing the place
(filename or built-in module) from which it is loaded.  When given twice
(`-vv`), print a message for each file that is checked for when
searching for a module.  Also provides information on module cleanup at exit.

#### Versionchanged
Changed in version 3.10: The [`site`](../library/site.md#module-site) module reports the site-specific paths
and `.pth` files being processed.

See also [`PYTHONVERBOSE`](#envvar-PYTHONVERBOSE).

<a id="using-on-warnings"></a>

### -W arg

Warning control. Python’s warning machinery by default prints warning
messages to [`sys.stderr`](../library/sys.md#sys.stderr).

The simplest settings apply a particular action unconditionally to all
warnings emitted by a process (even those that are otherwise ignored by
default):

```sh
-Wdefault  # Warn once per call location
-Werror    # Convert to exceptions
-Walways   # Warn every time
-Wall      # Same as -Walways
-Wmodule   # Warn once per calling module
-Wonce     # Warn once per Python process
-Wignore   # Never warn
```

The action names can be abbreviated as desired and the interpreter will
resolve them to the appropriate action name. For example, `-Wi` is the
same as `-Wignore`.

The full form of argument is:

```sh
action:message:category:module:lineno
```

Empty fields match all values; trailing empty fields may be omitted. For
example `-W ignore::DeprecationWarning` ignores all DeprecationWarning
warnings.

The *action* field is as explained above but only applies to warnings that
match the remaining fields.

The *message* field must match the start of the warning message;
this match is case-insensitive.
If it starts and ends with a forward slash (`/`), it specifies
a regular expression, otherwise it specifies a literal string.

The *category* field matches the warning category
(ex: `DeprecationWarning`). This must be a class name; the match test
whether the actual warning category of the message is a subclass of the
specified warning category.

The *module* field matches the (fully qualified) module name; this match is
case-sensitive.
If it starts and ends with a forward slash (`/`), it specifies
a regular expression that the start of the fully qualified module name
must match, otherwise it specifies a literal string that the fully
qualified module name must be equal to.

The *lineno* field matches the line number, where zero matches all line
numbers and is thus equivalent to an omitted line number.

Multiple [`-W`](#cmdoption-W) options can be given; when a warning matches more than
one option, the action for the last matching option is performed. Invalid
[`-W`](#cmdoption-W) options are ignored (though, a warning message is printed about
invalid options when the first warning is issued).

Warnings can also be controlled using the [`PYTHONWARNINGS`](#envvar-PYTHONWARNINGS)
environment variable and from within a Python program using the
[`warnings`](../library/warnings.md#module-warnings) module. For example, the [`warnings.filterwarnings()`](../library/warnings.md#warnings.filterwarnings)
function can be used to use a regular expression on the warning message.

See [The Warnings Filter](../library/warnings.md#warning-filter) and [Describing Warning Filters](../library/warnings.md#describing-warning-filters) for more
details.

#### Versionchanged
Changed in version 3.15: Added regular expression support for *message* and *module*.

### -x

Skip the first line of the source, allowing use of non-Unix forms of
`#!cmd`.  This is intended for a DOS specific hack only.

### -X

Reserved for various implementation-specific options.  CPython currently
defines the following possible values:

* `-X faulthandler` to enable [`faulthandler`](../library/faulthandler.md#module-faulthandler).
  See also [`PYTHONFAULTHANDLER`](#envvar-PYTHONFAULTHANDLER).

  #### Versionadded
  Added in version 3.3.
* `-X showrefcount` to output the total reference count and number of used
  memory blocks when the program finishes or after each statement in the
  interactive interpreter. This only works on [debug builds](configure.md#debug-build).

  #### Versionadded
  Added in version 3.4.
* `-X tracemalloc` to start tracing Python memory allocations using the
  [`tracemalloc`](../library/tracemalloc.md#module-tracemalloc) module. By default, only the most recent frame is
  stored in a traceback of a trace. Use `-X tracemalloc=NFRAME` to start
  tracing with a traceback limit of *NFRAME* frames.
  See [`tracemalloc.start()`](../library/tracemalloc.md#tracemalloc.start) and [`PYTHONTRACEMALLOC`](#envvar-PYTHONTRACEMALLOC)
  for more information.

  #### Versionadded
  Added in version 3.4.
* `-X int_max_str_digits` configures the [integer string conversion
  length limitation](../library/stdtypes.md#int-max-str-digits).  See also
  [`PYTHONINTMAXSTRDIGITS`](#envvar-PYTHONINTMAXSTRDIGITS).

  #### Versionadded
  Added in version 3.11.
* `-X importtime` to show how long each import takes. It shows module
  name, cumulative time (including nested imports) and self time (excluding
  nested imports).  Note that its output may be broken in multi-threaded
  application.  Typical usage is `python -X importtime -c 'import asyncio'`.

  `-X importtime=2` enables additional output that indicates when an
  imported module has already been loaded.  In such cases, the string
  `cached` will be printed in both time columns.

  See also [`PYTHONPROFILEIMPORTTIME`](#envvar-PYTHONPROFILEIMPORTTIME).

  #### Versionadded
  Added in version 3.7.

  #### Versionchanged
  Changed in version 3.14: Added `-X importtime=2` to also trace imports of loaded modules,
  and reserved values other than `1` and `2` for future use.
* `-X dev`: enable [Python Development Mode](../library/devmode.md#devmode), introducing
  additional runtime checks that are too expensive to be enabled by
  default.  See also [`PYTHONDEVMODE`](#envvar-PYTHONDEVMODE).

  #### Versionadded
  Added in version 3.7.
* `-X utf8` enables the [Python UTF-8 Mode](../library/os.md#utf8-mode).
  `-X utf8=0` explicitly disables [Python UTF-8 Mode](../library/os.md#utf8-mode)
  (even when it would otherwise activate automatically).
  See also [`PYTHONUTF8`](#envvar-PYTHONUTF8).

  #### Versionadded
  Added in version 3.7.
* `-X pycache_prefix=PATH` enables writing `.pyc` files to a parallel
  tree rooted at the given directory instead of to the code tree. See also
  [`PYTHONPYCACHEPREFIX`](#envvar-PYTHONPYCACHEPREFIX).

  #### Versionadded
  Added in version 3.8.
* `-X warn_default_encoding` issues a [`EncodingWarning`](../library/exceptions.md#EncodingWarning) when the
  locale-specific default encoding is used for opening files.
  See also [`PYTHONWARNDEFAULTENCODING`](#envvar-PYTHONWARNDEFAULTENCODING).

  #### Versionadded
  Added in version 3.10.
* `-X no_debug_ranges` disables the inclusion of the tables mapping extra
  location information (end line, start column offset and end column offset)
  to every instruction in code objects. This is useful when smaller code
  objects and pyc files are desired as well as suppressing the extra visual
  location indicators when the interpreter displays tracebacks. See also
  [`PYTHONNODEBUGRANGES`](#envvar-PYTHONNODEBUGRANGES).

  #### Versionadded
  Added in version 3.11.
* `-X frozen_modules` determines whether or not frozen modules are
  ignored by the import machinery.  A value of `on` means they get
  imported and `off` means they are ignored.  The default is `on`
  if this is an installed Python (the normal case).  If it’s under
  development (running from the source tree) then the default is `off`.
  Note that the `importlib_bootstrap` and
  `importlib_bootstrap_external` frozen modules are always used, even
  if this flag is set to `off`. See also [`PYTHON_FROZEN_MODULES`](#envvar-PYTHON_FROZEN_MODULES).

  #### Versionadded
  Added in version 3.11.
* `-X perf` enables support for the Linux `perf` profiler.
  When this option is provided, the `perf` profiler will be able to
  report Python calls. This option is only available on some platforms and
  will do nothing if is not supported on the current system. The default value
  is “off”. See also [`PYTHONPERFSUPPORT`](#envvar-PYTHONPERFSUPPORT) and [Python support for the perf map compatible profilers](../howto/perf_profiling.md#perf-profiling).

  #### Versionadded
  Added in version 3.12.
* `-X perf_jit` enables support for the Linux `perf` profiler with DWARF
  support. When this option is provided, the `perf` profiler will be able
  to report Python calls using DWARF information. This option is only available on
  some platforms and will do nothing if is not supported on the current
  system. The default value is “off”. See also [`PYTHON_PERF_JIT_SUPPORT`](#envvar-PYTHON_PERF_JIT_SUPPORT)
  and [Python support for the perf map compatible profilers](../howto/perf_profiling.md#perf-profiling).

  #### Versionadded
  Added in version 3.13.
* `-X disable_remote_debug` disables the remote debugging support as described
  in [**PEP 768**](https://peps.python.org/pep-0768/).  This includes both the functionality to schedule code for
  execution in another process and the functionality to receive code for
  execution in the current process.

  This option is only available on some platforms and will do nothing
  if is not supported on the current system. See also
  [`PYTHON_DISABLE_REMOTE_DEBUG`](#envvar-PYTHON_DISABLE_REMOTE_DEBUG) and [**PEP 768**](https://peps.python.org/pep-0768/).

  #### Versionadded
  Added in version 3.14.
* `-X cpu_count=*n*` overrides [`os.cpu_count()`](../library/os.md#os.cpu_count),
  [`os.process_cpu_count()`](../library/os.md#os.process_cpu_count), and [`multiprocessing.cpu_count()`](../library/multiprocessing.md#multiprocessing.cpu_count).
  *n* must be greater than or equal to 1.
  This option may be useful for users who need to limit CPU resources of a
  container system. See also [`PYTHON_CPU_COUNT`](#envvar-PYTHON_CPU_COUNT).
  If *n* is `default`, nothing is overridden.

  #### Versionadded
  Added in version 3.13.
* `-X presite=*module*` or `-X presite=*module:func*` specifies
  an entry point that should be executed before the [`site`](../library/site.md#module-site) module is
  executed and before the
  [`__main__`](../library/__main__.md#module-__main__) module exists.  Therefore, the imported module isn’t
  [`__main__`](../library/__main__.md#module-__main__). This can be used to execute code early during Python
  initialization. Python needs to be [built in debug mode](configure.md#debug-build)
  for this option to exist.  See also [`PYTHON_PRESITE`](#envvar-PYTHON_PRESITE).

  #### Versionchanged
  Changed in version 3.15.0a8 (unreleased): Accept also `module:func` entry point format.

  #### Versionadded
  Added in version 3.13.
* `-X gil=*0,1*` forces the GIL to be disabled or enabled,
  respectively. Setting to `0` is only available in builds configured with
  [`--disable-gil`](configure.md#cmdoption-disable-gil). See also [`PYTHON_GIL`](#envvar-PYTHON_GIL) and
  [Free-threaded CPython](../whatsnew/3.13.md#whatsnew313-free-threaded-cpython).

  #### Versionadded
  Added in version 3.13.
* `-X thread_inherit_context=*0,1*` causes [`Thread`](../library/threading.md#threading.Thread)
  to, by default, use a copy of context of the caller of
  `Thread.start()` when starting.  Otherwise, threads will start
  with an empty context.  If unset, the value of this option defaults
  to `1` on free-threaded builds and to `0` otherwise.  See also
  [`PYTHON_THREAD_INHERIT_CONTEXT`](#envvar-PYTHON_THREAD_INHERIT_CONTEXT).

  #### Versionadded
  Added in version 3.14.
* `-X context_aware_warnings=*0,1*` causes the
  [`warnings.catch_warnings`](../library/warnings.md#warnings.catch_warnings) context manager to use a
  [`ContextVar`](../library/contextvars.md#contextvars.ContextVar) to store warnings filter state.  If
  unset, the value of this option defaults to `1` on free-threaded builds
  and to `0` otherwise.  See also [`PYTHON_CONTEXT_AWARE_WARNINGS`](#envvar-PYTHON_CONTEXT_AWARE_WARNINGS).

  #### Versionadded
  Added in version 3.14.
* `-X pathconfig_warnings=*0,1*` if true (`1`) then
  [The initialization of the sys.path module search path](../library/sys_path_init.md#sys-path-init) is allowed to log warnings into stderr.
  If false (`0`) suppress these warnings. Set to true by default.
  See also [`PYTHON_PATHCONFIG_WARNINGS`](#envvar-PYTHON_PATHCONFIG_WARNINGS).

  #### Versionadded
  Added in version 3.15.
* `-X tlbc=*0,1*` enables (1, the default) or disables (0) thread-local
  bytecode in builds configured with [`--disable-gil`](configure.md#cmdoption-disable-gil).  When disabled,
  this also disables the specializing interpreter.  See also
  [`PYTHON_TLBC`](#envvar-PYTHON_TLBC).

  #### Versionadded
  Added in version 3.14.
* `-X lazy_imports=*all,none,normal*` controls lazy import behavior.
  `all` makes all imports lazy by default, `none` disables lazy imports
  entirely (even explicit `lazy` statements become eager), and `normal`
  (the default) respects the `lazy` keyword in source code.
  See also [`PYTHON_LAZY_IMPORTS`](#envvar-PYTHON_LAZY_IMPORTS).

  #### Versionadded
  Added in version 3.15.

It also allows passing arbitrary values and retrieving them through the
[`sys._xoptions`](../library/sys.md#sys._xoptions) dictionary.

#### Versionadded
Added in version 3.2.

#### Versionchanged
Changed in version 3.9: Removed the `-X showalloccount` option.

#### Versionchanged
Changed in version 3.10: Removed the `-X oldparser` option.

#### Versionremoved
Removed in version 3.14: `-J` is no longer reserved for use by [Jython](https://www.jython.org/),
and now has no special meaning.

<a id="using-on-controlling-color"></a>

### Controlling color

The Python interpreter is configured by default to use colors to highlight
output in certain situations such as when displaying tracebacks. This
behavior can be controlled by setting different environment variables.

Setting the environment variable `TERM` to `dumb` will disable color.

If the [`FORCE_COLOR`](https://force-color.org/) environment variable is set, then color will be
enabled regardless of the value of TERM. This is useful on CI systems which
aren’t terminals but can still display ANSI escape sequences.

If the [`NO_COLOR`](https://no-color.org/) environment variable is set, Python will disable all color
in the output. This takes precedence over `FORCE_COLOR`.

All these environment variables are used also by other tools to control color
output. To control the color output only in the Python interpreter, the
[`PYTHON_COLORS`](#envvar-PYTHON_COLORS) environment variable can be used. This variable takes
precedence over `NO_COLOR`, which in turn takes precedence over
`FORCE_COLOR`.

<a id="using-on-envvars"></a>

## Environment variables

These environment variables influence Python’s behavior, they are processed
before the command-line switches other than -E or -I.  It is customary that
command-line switches override environmental variables where there is a
conflict.

### PYTHONHOME

Change the location of the standard Python libraries.  By default, the
libraries are searched in `*prefix*/lib/python*version*` and
`*exec_prefix*/lib/python*version*`, where `*prefix*` and
`*exec_prefix*` are installation-dependent directories, both defaulting
to `/usr/local`.

When [`PYTHONHOME`](#envvar-PYTHONHOME) is set to a single directory, its value replaces
both `*prefix*` and `*exec_prefix*`.  To specify different values
for these, set [`PYTHONHOME`](#envvar-PYTHONHOME) to `*prefix*:*exec_prefix*`.

### PYTHONPATH

Augment the default search path for module files.  The format is the same as
the shell’s `PATH`: one or more directory pathnames separated by
[`os.pathsep`](../library/os.md#os.pathsep) (e.g. colons on Unix or semicolons on Windows).
Non-existent directories are silently ignored.

In addition to normal directories, individual [`PYTHONPATH`](#envvar-PYTHONPATH) entries
may refer to zipfiles containing pure Python modules (in either source or
compiled form). Extension modules cannot be imported from zipfiles.

The default search path is installation dependent, but generally begins with
`*prefix*/lib/python*version*` (see [`PYTHONHOME`](#envvar-PYTHONHOME) above).  It
is *always* appended to [`PYTHONPATH`](#envvar-PYTHONPATH).

An additional directory will be inserted in the search path in front of
[`PYTHONPATH`](#envvar-PYTHONPATH) as described above under
[Interface options](#using-on-interface-options). The search path can be manipulated from
within a Python program as the variable [`sys.path`](../library/sys.md#sys.path).

### PYTHONSAFEPATH

If this is set to a non-empty string, don’t prepend a potentially unsafe
path to [`sys.path`](../library/sys.md#sys.path): see the [`-P`](#cmdoption-P) option for details.

#### Versionadded
Added in version 3.11.

### PYTHONPLATLIBDIR

If this is set to a non-empty string, it overrides the [`sys.platlibdir`](../library/sys.md#sys.platlibdir)
value.

#### Versionadded
Added in version 3.9.

### PYTHONSTARTUP

If this is the name of a readable file, the Python commands in that file are
executed before the first prompt is displayed in interactive mode.  The file
is executed in the same namespace where interactive commands are executed so
that objects defined or imported in it can be used without qualification in
the interactive session.  You can also change the prompts [`sys.ps1`](../library/sys.md#sys.ps1) and
[`sys.ps2`](../library/sys.md#sys.ps2) and the hook [`sys.__interactivehook__`](../library/sys.md#sys.__interactivehook__) in this file.

Raises an [auditing event](../library/sys.md#auditing) `cpython.run_startup` with
the filename as the argument when called on startup.

### PYTHONOPTIMIZE

If this is set to a non-empty string it is equivalent to specifying the
[`-O`](#cmdoption-O) option.  If set to an integer, it is equivalent to specifying
[`-O`](#cmdoption-O) multiple times.

### PYTHONBREAKPOINT

If this is set, it names a callable using dotted-path notation.  The module
containing the callable will be imported and then the callable will be run
by the default implementation of [`sys.breakpointhook()`](../library/sys.md#sys.breakpointhook) which itself is
called by built-in [`breakpoint()`](../library/functions.md#breakpoint).  If not set, or set to the empty
string, it is equivalent to the value “pdb.set_trace”.  Setting this to the
string “0” causes the default implementation of [`sys.breakpointhook()`](../library/sys.md#sys.breakpointhook)
to do nothing but return immediately.

#### Versionadded
Added in version 3.7.

### PYTHONDEBUG

If this is set to a non-empty string it is equivalent to specifying the
[`-d`](#cmdoption-d) option.  If set to an integer, it is equivalent to specifying
[`-d`](#cmdoption-d) multiple times.

This environment variable requires a [debug build of Python](configure.md#debug-build), otherwise it’s ignored.

### PYTHONINSPECT

If this is set to a non-empty string it is equivalent to specifying the
[`-i`](#cmdoption-i) option.

This variable can also be modified by Python code using [`os.environ`](../library/os.md#os.environ)
to force inspect mode on program termination.

Raises an [auditing event](../library/sys.md#auditing) `cpython.run_stdin` with no arguments.

#### Versionchanged
Changed in version 3.12.5: (also 3.11.10, 3.10.15, 3.9.20, and 3.8.20)
Emits audit events.

#### Versionchanged
Changed in version 3.13: Uses PyREPL if possible, in which case [`PYTHONSTARTUP`](#envvar-PYTHONSTARTUP) is
also executed. Emits audit events.

### PYTHONUNBUFFERED

If this is set to a non-empty string it is equivalent to specifying the
[`-u`](#cmdoption-u) option.

### PYTHONVERBOSE

If this is set to a non-empty string it is equivalent to specifying the
[`-v`](#cmdoption-v) option.  If set to an integer, it is equivalent to specifying
[`-v`](#cmdoption-v) multiple times.

### PYTHONCASEOK

If this is set, Python ignores case in [`import`](../reference/simple_stmts.md#import) statements.  This
only works on Windows and macOS.

### PYTHONDONTWRITEBYTECODE

If this is set to a non-empty string, Python won’t try to write `.pyc`
files on the import of source modules.  This is equivalent to
specifying the [`-B`](#cmdoption-B) option.

### PYTHONPYCACHEPREFIX

If this is set, Python will write `.pyc` files in a mirror directory tree
at this path, instead of in `__pycache__` directories within the source
tree. This is equivalent to specifying the [`-X`](#cmdoption-X)
`pycache_prefix=PATH` option.

#### Versionadded
Added in version 3.8.

### PYTHONHASHSEED

If this variable is not set or set to `random`, a random value is used
to seed the hashes of str and bytes objects.

If [`PYTHONHASHSEED`](#envvar-PYTHONHASHSEED) is set to an integer value, it is used as a fixed
seed for generating the hash() of the types covered by the hash
randomization.

Its purpose is to allow repeatable hashing, such as for selftests for the
interpreter itself, or to allow a cluster of python processes to share hash
values.

The integer must be a decimal number in the range [0,4294967295].  Specifying
the value 0 will disable hash randomization.

#### Versionadded
Added in version 3.2.3.

### PYTHONINTMAXSTRDIGITS

If this variable is set to an integer, it is used to configure the
interpreter’s global [integer string conversion length limitation](../library/stdtypes.md#int-max-str-digits).

#### Versionadded
Added in version 3.11.

### PYTHONIOENCODING

If this is set before running the interpreter, it overrides the encoding used
for stdin/stdout/stderr, in the syntax `encodingname:errorhandler`.  Both
the `encodingname` and the `:errorhandler` parts are optional and have
the same meaning as in [`str.encode()`](../library/stdtypes.md#str.encode).

For stderr, the `:errorhandler` part is ignored; the handler will always be
`'backslashreplace'`.

#### Versionchanged
Changed in version 3.4: The `encodingname` part is now optional.

#### Versionchanged
Changed in version 3.6: On Windows, the encoding specified by this variable is ignored for interactive
console buffers unless [`PYTHONLEGACYWINDOWSSTDIO`](#envvar-PYTHONLEGACYWINDOWSSTDIO) is also specified.
Files and pipes redirected through the standard streams are not affected.

### PYTHONNOUSERSITE

This is equivalent to the [`-s`](#cmdoption-s) option.  If this is set, Python won’t
add the [`user site-packages directory`](../library/site.md#site.USER_SITE) to
[`sys.path`](../library/sys.md#sys.path).

#### SEE ALSO
[**PEP 370**](https://peps.python.org/pep-0370/) – Per user site-packages directory

### PYTHONUSERBASE

Defines the [`user base directory`](../library/site.md#site.USER_BASE), which is used to
compute the path of the [`user site-packages directory`](../library/site.md#site.USER_SITE)
and [installation paths](../library/sysconfig.md#sysconfig-user-scheme) for
`python -m pip install --user`.

To disable the user site-packages, see [`PYTHONNOUSERSITE`](#envvar-PYTHONNOUSERSITE) or the [`-s`](#cmdoption-s)
option.

#### SEE ALSO
[**PEP 370**](https://peps.python.org/pep-0370/) – Per user site-packages directory

### PYTHONEXECUTABLE

If this environment variable is set, `sys.argv[0]` will be set to its
value instead of the value got through the C runtime.  Only works on
macOS.

### PYTHONWARNINGS

This is equivalent to the [`-W`](#cmdoption-W) option. If set to a comma
separated string, it is equivalent to specifying [`-W`](#cmdoption-W) multiple
times, with filters later in the list taking precedence over those earlier
in the list.

The simplest settings apply a particular action unconditionally to all
warnings emitted by a process (even those that are otherwise ignored by
default):

```sh
PYTHONWARNINGS=default  # Warn once per call location
PYTHONWARNINGS=error    # Convert to exceptions
PYTHONWARNINGS=always   # Warn every time
PYTHONWARNINGS=all      # Same as PYTHONWARNINGS=always
PYTHONWARNINGS=module   # Warn once per calling module
PYTHONWARNINGS=once     # Warn once per Python process
PYTHONWARNINGS=ignore   # Never warn
```

See [The Warnings Filter](../library/warnings.md#warning-filter) and [Describing Warning Filters](../library/warnings.md#describing-warning-filters) for more
details.

#### Versionchanged
Changed in version 3.15: Added regular expression support for *message* and *module*.

### PYTHONFAULTHANDLER

If this environment variable is set to a non-empty string,
[`faulthandler.enable()`](../library/faulthandler.md#faulthandler.enable) is called at startup: install a handler for
[`SIGSEGV`](../library/signal.md#signal.SIGSEGV), [`SIGFPE`](../library/signal.md#signal.SIGFPE),
[`SIGABRT`](../library/signal.md#signal.SIGABRT), [`SIGBUS`](../library/signal.md#signal.SIGBUS) and
[`SIGILL`](../library/signal.md#signal.SIGILL) signals to dump the Python traceback.
This is equivalent to [`-X`](#cmdoption-X) `faulthandler` option.

#### Versionadded
Added in version 3.3.

### PYTHONTRACEMALLOC

If this environment variable is set to a non-empty string, start tracing
Python memory allocations using the [`tracemalloc`](../library/tracemalloc.md#module-tracemalloc) module. The value of
the variable is the maximum number of frames stored in a traceback of a
trace. For example, `PYTHONTRACEMALLOC=1` stores only the most recent
frame.
See the [`tracemalloc.start()`](../library/tracemalloc.md#tracemalloc.start) function for more information.
This is equivalent to setting the [`-X`](#cmdoption-X) `tracemalloc` option.

#### Versionadded
Added in version 3.4.

### PYTHONPROFILEIMPORTTIME

If this environment variable is set to `1`, Python will show
how long each import takes. If set to `2`, Python will include output for
imported modules that have already been loaded.
This is equivalent to setting the [`-X`](#cmdoption-X) `importtime` option.

#### Versionadded
Added in version 3.7.

#### Versionchanged
Changed in version 3.14: Added `PYTHONPROFILEIMPORTTIME=2` to also trace imports of loaded modules.

### PYTHONASYNCIODEBUG

If this environment variable is set to a non-empty string, enable the
[debug mode](../library/asyncio-dev.md#asyncio-debug-mode) of the [`asyncio`](../library/asyncio.md#module-asyncio) module.

#### Versionadded
Added in version 3.4.

### PYTHONMALLOC

Set the Python memory allocators and/or install debug hooks.

Set the family of memory allocators used by Python:

* `default`: use the [default memory allocators](../c-api/memory.md#default-memory-allocators).
* `malloc`: use the `malloc()` function of the C library
  for all domains ([`PYMEM_DOMAIN_RAW`](../c-api/memory.md#c.PYMEM_DOMAIN_RAW), [`PYMEM_DOMAIN_MEM`](../c-api/memory.md#c.PYMEM_DOMAIN_MEM),
  [`PYMEM_DOMAIN_OBJ`](../c-api/memory.md#c.PYMEM_DOMAIN_OBJ)).
* `pymalloc`: use the [pymalloc allocator](../c-api/memory.md#pymalloc) for
  [`PYMEM_DOMAIN_MEM`](../c-api/memory.md#c.PYMEM_DOMAIN_MEM) and [`PYMEM_DOMAIN_OBJ`](../c-api/memory.md#c.PYMEM_DOMAIN_OBJ) domains and use
  the `malloc()` function for the [`PYMEM_DOMAIN_RAW`](../c-api/memory.md#c.PYMEM_DOMAIN_RAW) domain.
* `mimalloc`: use the [mimalloc allocator](../c-api/memory.md#mimalloc) for
  [`PYMEM_DOMAIN_MEM`](../c-api/memory.md#c.PYMEM_DOMAIN_MEM) and [`PYMEM_DOMAIN_OBJ`](../c-api/memory.md#c.PYMEM_DOMAIN_OBJ) domains and use
  the `malloc()` function for the [`PYMEM_DOMAIN_RAW`](../c-api/memory.md#c.PYMEM_DOMAIN_RAW) domain.

Install [debug hooks](../c-api/memory.md#pymem-debug-hooks):

* `debug`: install debug hooks on top of the [default memory
  allocators](../c-api/memory.md#default-memory-allocators).
* `malloc_debug`: same as `malloc` but also install debug hooks.
* `pymalloc_debug`: same as `pymalloc` but also install debug hooks.
* `mimalloc_debug`: same as `mimalloc` but also install debug hooks.

#### NOTE
In the [free-threaded](../glossary.md#term-free-threading) build, the `malloc`,
`malloc_debug`, `pymalloc`, and `pymalloc_debug` values are not
supported.  Only `default`, `debug`, `mimalloc`, and
`mimalloc_debug` are accepted.

#### Versionadded
Added in version 3.6.

#### Versionchanged
Changed in version 3.7: Added the `"default"` allocator.

### PYTHONMALLOCSTATS

If set to a non-empty string, Python will print statistics of the
[pymalloc memory allocator](../c-api/memory.md#pymalloc) or the
[mimalloc memory allocator](../c-api/memory.md#mimalloc) (whichever is in use)
every time a new object arena is created, and on shutdown.

This variable is ignored if the [`PYTHONMALLOC`](#envvar-PYTHONMALLOC) environment variable
is used to force the `malloc()` allocator of the C library, or if
Python is configured without both `pymalloc` and `mimalloc` support.

#### Versionchanged
Changed in version 3.6: This variable can now also be used on Python compiled in release mode.
It now has no effect if set to an empty string.

### PYTHON_PYMALLOC_HUGEPAGES

If set to a non-zero integer, enable huge page support for
[pymalloc](../c-api/memory.md#pymalloc) arenas.  Set to `0` or unset to disable.
Python must be compiled with [`--with-pymalloc-hugepages`](configure.md#cmdoption-with-pymalloc-hugepages) for this
variable to have any effect.

When enabled, arena allocation uses `MAP_HUGETLB` (Linux) or
`MEM_LARGE_PAGES` (Windows) with automatic fallback to regular pages if
huge pages are not available.

#### WARNING
On Linux, if the huge-page pool is exhausted, page faults — including
copy-on-write faults triggered by [`os.fork()`](../library/os.md#os.fork) — deliver `SIGBUS`
and kill the process.  Only enable this in environments where the
huge-page pool is properly sized and fork-safety is not a concern.

On Windows you need a special privilege. See the
[Windows documentation for large pages](https://learn.microsoft.com/windows/win32/memory/large-page-support)
for details. Python will fail on startup if the required privilege
[SeLockMemoryPrivilege](https://learn.microsoft.com/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/lock-pages-in-memory)
is not held by the user.

#### Versionadded
Added in version 3.15.

### PYTHONLEGACYWINDOWSFSENCODING

If set to a non-empty string, the default [filesystem encoding and
error handler](../glossary.md#term-filesystem-encoding-and-error-handler) mode will revert to their pre-3.6 values of ‘mbcs’ and
‘replace’, respectively.  Otherwise, the new defaults ‘utf-8’ and
‘surrogatepass’ are used.

This may also be enabled at runtime with
[`sys._enablelegacywindowsfsencoding()`](../library/sys.md#sys._enablelegacywindowsfsencoding).

[Availability](../library/intro.md#availability): Windows.

#### Versionadded
Added in version 3.6: See [**PEP 529**](https://peps.python.org/pep-0529/) for more details.

### PYTHONLEGACYWINDOWSSTDIO

If set to a non-empty string, does not use the new console reader and
writer. This means that Unicode characters will be encoded according to
the active console code page, rather than using utf-8.

This variable is ignored if the standard streams are redirected (to files
or pipes) rather than referring to console buffers.

[Availability](../library/intro.md#availability): Windows.

#### Versionadded
Added in version 3.6.

### PYTHONCOERCECLOCALE

If set to the value `0`, causes the main Python command line application
to skip coercing the legacy ASCII-based C and POSIX locales to a more
capable UTF-8 based alternative.

If this variable is *not* set (or is set to a value other than `0`), the
`LC_ALL` locale override environment variable is also not set, and the
current locale reported for the `LC_CTYPE` category is either the default
`C` locale, or else the explicitly ASCII-based `POSIX` locale, then the
Python CLI will attempt to configure the following locales for the
`LC_CTYPE` category in the order listed before loading the interpreter
runtime:

* `C.UTF-8`
* `C.utf8`
* `UTF-8`

If setting one of these locale categories succeeds, then the `LC_CTYPE`
environment variable will also be set accordingly in the current process
environment before the Python runtime is initialized. This ensures that in
addition to being seen by both the interpreter itself and other locale-aware
components running in the same process (such as the GNU `readline`
library), the updated setting is also seen in subprocesses (regardless of
whether or not those processes are running a Python interpreter), as well as
in operations that query the environment rather than the current C locale
(such as Python’s own [`locale.getdefaultlocale()`](../library/locale.md#locale.getdefaultlocale)).

Configuring one of these locales (either explicitly or via the above
implicit locale coercion) automatically enables the `surrogateescape`
[error handler](../library/codecs.md#error-handlers) for [`sys.stdin`](../library/sys.md#sys.stdin) and
[`sys.stdout`](../library/sys.md#sys.stdout) ([`sys.stderr`](../library/sys.md#sys.stderr) continues to use `backslashreplace`
as it does in any other locale). This stream handling behavior can be
overridden using [`PYTHONIOENCODING`](#envvar-PYTHONIOENCODING) as usual.

For debugging purposes, setting `PYTHONCOERCECLOCALE=warn` will cause
Python to emit warning messages on `stderr` if either the locale coercion
activates, or else if a locale that *would* have triggered coercion is
still active when the Python runtime is initialized.

Also note that even when locale coercion is disabled, or when it fails to
find a suitable target locale, [`PYTHONUTF8`](#envvar-PYTHONUTF8) will still activate by
default in legacy ASCII-based locales. Both features must be disabled in
order to force the interpreter to use `ASCII` instead of `UTF-8` for
system interfaces.

[Availability](../library/intro.md#availability): Unix.

#### Versionadded
Added in version 3.7: See [**PEP 538**](https://peps.python.org/pep-0538/) for more details.

### PYTHONDEVMODE

If this environment variable is set to a non-empty string, enable
[Python Development Mode](../library/devmode.md#devmode), introducing additional runtime
checks that are too expensive to be enabled by default.
This is equivalent to setting the [`-X`](#cmdoption-X) `dev` option.

#### Versionadded
Added in version 3.7.

### PYTHONUTF8

If set to `1`, enable the [Python UTF-8 Mode](../library/os.md#utf8-mode).

If set to `0`, disable the [Python UTF-8 Mode](../library/os.md#utf8-mode).

Setting any other non-empty string causes an error during interpreter
initialisation.

#### Versionadded
Added in version 3.7.

### PYTHONWARNDEFAULTENCODING

If this environment variable is set to a non-empty string, issue a
[`EncodingWarning`](../library/exceptions.md#EncodingWarning) when the locale-specific default encoding is used.

See [Opt-in EncodingWarning](../library/io.md#io-encoding-warning) for details.

#### Versionadded
Added in version 3.10.

### PYTHONNODEBUGRANGES

If this variable is set, it disables the inclusion of the tables mapping
extra location information (end line, start column offset and end column
offset) to every instruction in code objects. This is useful when smaller
code objects and pyc files are desired as well as suppressing the extra visual
location indicators when the interpreter displays tracebacks.

#### Versionadded
Added in version 3.11.

### PYTHONPERFSUPPORT

If this variable is set to a nonzero value, it enables support for
the Linux `perf` profiler so Python calls can be detected by it.

If set to `0`, disable Linux `perf` profiler support.

See also the [`-X perf`](#cmdoption-X) command-line option
and [Python support for the perf map compatible profilers](../howto/perf_profiling.md#perf-profiling).

#### Versionadded
Added in version 3.12.

### PYTHON_PERF_JIT_SUPPORT

If this variable is set to a nonzero value, it enables support for
the Linux `perf` profiler so Python calls can be detected by it
using DWARF information.

If set to `0`, disable Linux `perf` profiler support.

See also the [`-X perf_jit`](#cmdoption-X) command-line option
and [Python support for the perf map compatible profilers](../howto/perf_profiling.md#perf-profiling).

#### Versionadded
Added in version 3.13.

### PYTHON_DISABLE_REMOTE_DEBUG

If this variable is set to a non-empty string, it disables the remote
debugging feature described in [**PEP 768**](https://peps.python.org/pep-0768/). This includes both the functionality
to schedule code for execution in another process and the functionality to
receive code for execution in the current process.

See also the [`-X disable_remote_debug`](#cmdoption-X) command-line option.

#### Versionadded
Added in version 3.14.

### PYTHON_CPU_COUNT

If this variable is set to a positive integer, it overrides the return
values of [`os.cpu_count()`](../library/os.md#os.cpu_count) and [`os.process_cpu_count()`](../library/os.md#os.process_cpu_count).

See also the [`-X cpu_count`](#cmdoption-X) command-line option.

#### Versionadded
Added in version 3.13.

### PYTHON_FROZEN_MODULES

If this variable is set to `on` or `off`, it determines whether or not
frozen modules are ignored by the import machinery.  A value of `on` means
they get imported and `off` means they are ignored.  The default is `on`
for non-debug builds (the normal case) and `off` for debug builds.
Note that the `importlib_bootstrap` and
`importlib_bootstrap_external` frozen modules are always used, even
if this flag is set to `off`.

See also the [`-X frozen_modules`](#cmdoption-X) command-line option.

#### Versionadded
Added in version 3.13.

### PYTHON_COLORS

If this variable is set to `1`, the interpreter will colorize various kinds
of output. Setting it to `0` deactivates this behavior.
See also [Controlling color](#using-on-controlling-color).

#### Versionadded
Added in version 3.13.

### PYTHON_BASIC_REPL

If this variable is set to any value, the interpreter will not attempt to
load the Python-based [REPL](../glossary.md#term-REPL) that requires [`readline`](../library/readline.md#module-readline), and will
instead use the traditional parser-based [REPL](../glossary.md#term-REPL).

#### Versionadded
Added in version 3.13.

### PYTHON_BASIC_COMPLETER

If this variable is set to any value, PyREPL will use [`rlcompleter`](../library/rlcompleter.md#module-rlcompleter) to
implement tab completion, instead of the default one which uses colors.

#### Versionadded
Added in version 3.15.

### PYTHON_HISTORY

This environment variable can be used to set the location of a
`.python_history` file (by default, it is `.python_history` in the
user’s home directory).

#### Versionadded
Added in version 3.13.

### PYTHON_GIL

If this variable is set to `1`, the global interpreter lock (GIL) will be
forced on. Setting it to `0` forces the GIL off (needs Python configured with
the [`--disable-gil`](configure.md#cmdoption-disable-gil) build option).

See also the [`-X gil`](#cmdoption-X) command-line option, which takes
precedence over this variable, and [Free-threaded CPython](../whatsnew/3.13.md#whatsnew313-free-threaded-cpython).

#### Versionadded
Added in version 3.13.

### PYTHON_THREAD_INHERIT_CONTEXT

If this variable is set to `1` then [`Thread`](../library/threading.md#threading.Thread) will,
by default, use a copy of context of the caller of `Thread.start()`
when starting.  Otherwise, new threads will start with an empty context.
If unset, this variable defaults to `1` on free-threaded builds and to
`0` otherwise.  See also [`-X thread_inherit_context`](#cmdoption-X).

#### Versionadded
Added in version 3.14.

### PYTHON_CONTEXT_AWARE_WARNINGS

If set to `1` then the [`warnings.catch_warnings`](../library/warnings.md#warnings.catch_warnings) context
manager will use a [`ContextVar`](../library/contextvars.md#contextvars.ContextVar) to store warnings
filter state.  If unset, this variable defaults to `1` on
free-threaded builds and to `0` otherwise.  See [`-X
context_aware_warnings`](#cmdoption-X).

#### Versionadded
Added in version 3.14.

### PYTHON_PATHCONFIG_WARNINGS

If true (`1`) then [The initialization of the sys.path module search path](../library/sys_path_init.md#sys-path-init) is allowed to log warnings into
stderr. If false (`0`) suppress these warnings. Set to true by default.
See also [`-X pathconfig_warnings`](#cmdoption-X).

#### Versionadded
Added in version 3.15.

### PYTHON_JIT

On builds where experimental just-in-time compilation is available, this
variable can force the JIT to be disabled (`0`) or enabled (`1`) at
interpreter startup.

#### Versionadded
Added in version 3.13.

### PYTHON_TLBC

If set to `1` enables thread-local bytecode. If set to `0` thread-local
bytecode and the specializing interpreter are disabled.  Only applies to
builds configured with [`--disable-gil`](configure.md#cmdoption-disable-gil).

See also the [`-X tlbc`](#cmdoption-X) command-line option.

#### Versionadded
Added in version 3.14.

### PYTHON_LAZY_IMPORTS

Controls lazy import behavior. Accepts three values: `all` makes all
imports lazy by default, `none` disables lazy imports entirely (even
explicit `lazy` statements become eager), and `normal` (the default)
respects the `lazy` keyword in source code.

See also the [`-X lazy_imports`](#cmdoption-X) command-line option.

#### Versionadded
Added in version 3.15.

### Debug-mode variables

### PYTHONDUMPREFS

If set, Python will dump objects and reference counts still alive after
shutting down the interpreter.

Needs Python configured with the [`--with-trace-refs`](configure.md#cmdoption-with-trace-refs) build option.

### PYTHONDUMPREFSFILE

If set, Python will dump objects and reference counts still alive
after shutting down the interpreter into a file under the path given
as the value to this environment variable.

Needs Python configured with the [`--with-trace-refs`](configure.md#cmdoption-with-trace-refs) build option.

#### Versionadded
Added in version 3.11.

### PYTHON_PRESITE

If this variable is set to a module, that module will be imported
early in the interpreter lifecycle, before the [`site`](../library/site.md#module-site) module is
executed, and before the [`__main__`](../library/__main__.md#module-__main__) module is created.
Therefore, the imported module is not treated as [`__main__`](../library/__main__.md#module-__main__).

This can be used to execute code early during Python initialization.

To import a submodule, use `package.module` as the value, like in
an import statement.

See also the [`-X presite`](#cmdoption-X) command-line option,
which takes precedence over this variable.

Needs Python configured with the [`--with-pydebug`](configure.md#cmdoption-with-pydebug) build option.

#### Versionchanged
Changed in version 3.15.0a8 (unreleased): Accept also `module:func` entry point format.

#### Versionadded
Added in version 3.13.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

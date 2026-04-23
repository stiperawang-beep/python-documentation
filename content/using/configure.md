# Configure Python

<a id="build-requirements"></a>

## Build Requirements

To build CPython, you will need:

* A [C11](https://en.cppreference.com/w/c/11) compiler. [Optional C11
  features](https://en.wikipedia.org/wiki/C11_(C_standard_revision)#Optional_features)
  are not required.
* On Windows, Microsoft Visual Studio 2017 or later is required.
* Support for [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754)
  floating-point numbers and [floating-point Not-a-Number (NaN)](https://en.wikipedia.org/wiki/NaN#Floating_point).
* Support for threads.

#### Versionchanged
Changed in version 3.5: On Windows, Visual Studio 2015 or later is now required.

#### Versionchanged
Changed in version 3.6: Selected C99 features, like `<stdint.h>` and `static inline` functions,
are now required.

#### Versionchanged
Changed in version 3.7: Thread support is now required.

#### Versionchanged
Changed in version 3.11: C11 compiler, IEEE 754 and NaN support are now required.
On Windows, Visual Studio 2017 or later is required.

See also [**PEP 7**](https://peps.python.org/pep-0007/) “Style Guide for C Code” and [**PEP 11**](https://peps.python.org/pep-0011/) “CPython platform
support”.

<a id="optional-module-requirements"></a>

### Requirements for optional modules

Some [optional modules](../glossary.md#term-optional-module) of the standard library
require third-party libraries installed for development
(for example, header files must be available).

Missing requirements are reported in the `configure` output.
Modules that are missing due to missing dependencies are listed near the end
of the `make` output,
sometimes using an internal name, for example, `_ctypes` for [`ctypes`](../library/ctypes.md#module-ctypes)
module.

If you distribute a CPython interpreter without optional modules,
it’s best practice to advise users, who generally expect that
standard library modules are available.

Dependencies to build optional modules are:

| Dependency                                                                                                                                   | Minimum version                                            | Python module                                                                                                                               |
|----------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| [libbz2](https://sourceware.org/bzip2/)                                                                                                      |                                                            | [`bz2`](../library/bz2.md#module-bz2)                                                                                                       |
| [libffi](https://sourceware.org/libffi/)                                                                                                     | 3.3.0 recommended                                          | [`ctypes`](../library/ctypes.md#module-ctypes)                                                                                              |
| [liblzma](https://tukaani.org/xz/)                                                                                                           |                                                            | [`lzma`](../library/lzma.md#module-lzma)                                                                                                    |
| [libmpdec](https://www.bytereef.org/mpdecimal/doc/libmpdec/)                                                                                 | 2.5.0                                                      | [`decimal`](../library/decimal.md#module-decimal) <sup>[1](#id7)</sup>                                                                      |
| [libreadline](https://tiswww.case.edu/php/chet/readline/rltop.html) or<br/>[libedit](https://www.thrysoee.dk/editline/) <sup>[2](#id8)</sup> |                                                            | [`readline`](../library/readline.md#module-readline)                                                                                        |
| [libuuid](https://linux.die.net/man/3/libuuid)                                                                                               |                                                            | `_uuid` <sup>[3](#id9)</sup>                                                                                                                |
| [ncurses](https://gnu.org/software/ncurses/ncurses.html) <sup>[4](#id10)</sup>                                                               |                                                            | [`curses`](../library/curses.md#module-curses)                                                                                              |
| [OpenSSL](https://openssl-library.org/)                                                                                                      | 3.0.18 recommended<br/><br/><br/>(1.1.1 minimum)<br/><br/> | [`ssl`](../library/ssl.md#module-ssl), [`hashlib`](../library/hashlib.md#module-hashlib) <sup>[5](#id11)</sup>                              |
| [SQLite](https://sqlite.org/)                                                                                                                | 3.15.2                                                     | [`sqlite3`](../library/sqlite3.md#module-sqlite3)                                                                                           |
| [Tcl/Tk](https://www.tcl-lang.org/)                                                                                                          | 8.5.12                                                     | [`tkinter`](../library/tkinter.md#module-tkinter), [IDLE](../library/idle.md#idle), [`turtle`](../library/turtle.md#module-turtle)          |
| [zlib](https://www.zlib.net)                                                                                                                 | 1.2.2.1                                                    | [`zlib`](../library/zlib.md#module-zlib), [`gzip`](../library/gzip.md#module-gzip), [`ensurepip`](../library/ensurepip.md#module-ensurepip) |
| [zstd](https://facebook.github.io/zstd/)                                                                                                     | 1.4.5                                                      | [`compression.zstd`](../library/compression.zstd.md#module-compression.zstd)                                                                |
* <a id='id7'>**[1]**</a> If *libmpdec* is not available, the [`decimal`](../library/decimal.md#module-decimal) module will use a pure-Python implementation. See [`--with-system-libmpdec`](#cmdoption-with-system-libmpdec) for details.
* <a id='id8'>**[2]**</a> See [`--with-readline`](#cmdoption-with-readline) for choosing the backend for the [`readline`](../library/readline.md#module-readline) module.
* <a id='id9'>**[3]**</a> The [`uuid`](../library/uuid.md#module-uuid) module uses `_uuid` to generate “safe” UUIDs. See the module documentation for details.
* <a id='id10'>**[4]**</a> The [`curses`](../library/curses.md#module-curses) module requires the `libncurses` or `libncursesw` library. The [`curses.panel`](../library/curses.panel.md#module-curses.panel) module additionally requires the `libpanel` or `libpanelw` library.
* <a id='id11'>**[5]**</a> If OpenSSL is not available, the [`hashlib`](../library/hashlib.md#module-hashlib) module will use bundled implementations of several hash functions. See [`--with-builtin-hashlib-hashes`](#cmdoption-with-builtin-hashlib-hashes) for *forcing* usage of OpenSSL.

Note that the table does not include all optional modules; in particular,
platform-specific modules like [`winreg`](../library/winreg.md#module-winreg) are not listed here.

#### SEE ALSO
* The [devguide](https://devguide.python.org/getting-started/setup-building/#install-dependencies)
  includes a full list of dependencies required to build all modules and
  instructions on how to install them on common platforms.
* [`--with-system-expat`](#cmdoption-with-system-expat) allows building with an external
  [libexpat](https://libexpat.github.io/) library.
* [Options for third-party dependencies](#configure-options-for-dependencies)

#### Versionchanged
Changed in version 3.1: Tcl/Tk version 8.3.1 is now required for [`tkinter`](../library/tkinter.md#module-tkinter).

#### Versionchanged
Changed in version 3.5: Tcl/Tk version 8.4 is now required for [`tkinter`](../library/tkinter.md#module-tkinter).

#### Versionchanged
Changed in version 3.7: OpenSSL 1.0.2 is now required for [`hashlib`](../library/hashlib.md#module-hashlib) and [`ssl`](../library/ssl.md#module-ssl).

#### Versionchanged
Changed in version 3.10: OpenSSL 1.1.1 is now required for [`hashlib`](../library/hashlib.md#module-hashlib) and [`ssl`](../library/ssl.md#module-ssl).
SQLite 3.7.15 is now required for [`sqlite3`](../library/sqlite3.md#module-sqlite3).

#### Versionchanged
Changed in version 3.11: Tcl/Tk version 8.5.12 is now required for [`tkinter`](../library/tkinter.md#module-tkinter).

#### Versionchanged
Changed in version 3.13: SQLite 3.15.2 is now required for [`sqlite3`](../library/sqlite3.md#module-sqlite3).

## Generated files

To reduce build dependencies, Python source code contains multiple generated
files. Commands to regenerate all generated files:

```sh
make regen-all
make regen-stdlib-module-names
make regen-limited-abi
make regen-configure
```

The `Makefile.pre.in` file documents generated files, their inputs, and tools used
to regenerate them. Search for `regen-*` make targets.

### configure script

The `make regen-configure` command regenerates the `aclocal.m4` file and
the `configure` script using the `Tools/build/regen-configure.sh` shell
script which uses an Ubuntu container to get the same tools versions and have a
reproducible output.

The container is optional, the following command can be run locally:

```sh
autoreconf -ivf -Werror
```

The generated files can change depending on the exact versions of the
tools used.
The container that CPython uses has
[Autoconf](https://gnu.org/software/autoconf) 2.72,
`aclocal` from [Automake](https://www.gnu.org/software/automake) 1.16.5,
and [pkg-config](https://www.freedesktop.org/wiki/Software/pkg-config/) 1.8.1.

#### Versionchanged
Changed in version 3.13: Autoconf 2.71 and aclocal 1.16.5 and are now used to regenerate
`configure`.

#### Versionchanged
Changed in version 3.14: Autoconf 2.72 is now used to regenerate `configure`.

<a id="configure-options"></a>

## Configure Options

List all `configure` script options using:

```sh
./configure --help
```

See also the `Misc/SpecialBuilds.txt` in the Python source distribution.

### General Options

### --enable-loadable-sqlite-extensions

Support loadable extensions in the `_sqlite` extension module (default
is no) of the [`sqlite3`](../library/sqlite3.md#module-sqlite3) module.

See the [`sqlite3.Connection.enable_load_extension()`](../library/sqlite3.md#sqlite3.Connection.enable_load_extension) method of the
[`sqlite3`](../library/sqlite3.md#module-sqlite3) module.

#### Versionadded
Added in version 3.6.

### --disable-ipv6

Disable IPv6 support (enabled by default if supported), see the
[`socket`](../library/socket.md#module-socket) module.

### --enable-big-digits=[15|30]

Define the size in bits of Python [`int`](../library/functions.md#int) digits: 15 or 30 bits.

By default, the digit size is 30.

Define the `PYLONG_BITS_IN_DIGIT` to `15` or `30`.

See [`sys.int_info.bits_per_digit`](../library/sys.md#sys.int_info).

### --with-suffix=SUFFIX

Set the Python executable suffix to *SUFFIX*.

The default suffix is `.exe` on Windows and macOS (`python.exe`
executable), `.js` on Emscripten node, `.html` on Emscripten browser,
`.wasm` on WASI, and an empty string on other platforms (`python`
executable).

#### Versionchanged
Changed in version 3.11: The default suffix on WASM platform is one of `.js`, `.html`
or `.wasm`.

### --with-tzpath=<list of absolute paths separated by pathsep>

Select the default time zone search path for [`zoneinfo.TZPATH`](../library/zoneinfo.md#zoneinfo.TZPATH).
See the [Compile-time configuration](../library/zoneinfo.md#zoneinfo-data-compile-time-config) of the [`zoneinfo`](../library/zoneinfo.md#module-zoneinfo) module.

Default: `/usr/share/zoneinfo:/usr/lib/zoneinfo:/usr/share/lib/zoneinfo:/etc/zoneinfo`.

See [`os.pathsep`](../library/os.md#os.pathsep) path separator.

#### Versionadded
Added in version 3.9.

### --without-decimal-contextvar

Build the `_decimal` extension module using a thread-local context rather
than a coroutine-local context (default), see the [`decimal`](../library/decimal.md#module-decimal) module.

See [`decimal.HAVE_CONTEXTVAR`](../library/decimal.md#decimal.HAVE_CONTEXTVAR) and the [`contextvars`](../library/contextvars.md#module-contextvars) module.

#### Versionadded
Added in version 3.9.

### --with-dbmliborder=<list of backend names>

Override order to check db backends for the [`dbm`](../library/dbm.md#module-dbm) module

A valid value is a colon (`:`) separated string with the backend names:

* `ndbm`;
* `gdbm`;
* `bdb`.

### --without-c-locale-coercion

Disable C locale coercion to a UTF-8 based locale (enabled by default).

Don’t define the `PY_COERCE_C_LOCALE` macro.

See [`PYTHONCOERCECLOCALE`](cmdline.md#envvar-PYTHONCOERCECLOCALE) and the [**PEP 538**](https://peps.python.org/pep-0538/).

### --with-platlibdir=DIRNAME

Python library directory name (default is `lib`).

Fedora and SuSE use `lib64` on 64-bit platforms.

See [`sys.platlibdir`](../library/sys.md#sys.platlibdir).

#### Versionadded
Added in version 3.9.

### --with-wheel-pkg-dir=PATH

Directory of wheel packages used by the [`ensurepip`](../library/ensurepip.md#module-ensurepip) module
(none by default).

Some Linux distribution packaging policies recommend against bundling
dependencies. For example, Fedora installs wheel packages in the
`/usr/share/python-wheels/` directory and don’t install the
`ensurepip._bundled` package.

#### Versionadded
Added in version 3.10.

### --with-pkg-config=[check|yes|no]

Whether configure should use **pkg-config** to detect build
dependencies.

* `check` (default): **pkg-config** is optional
* `yes`: **pkg-config** is mandatory
* `no`: configure does not use **pkg-config** even when present

#### Versionadded
Added in version 3.11.

### --with-missing-stdlib-config=FILE

Path to a [JSON](https://www.json.org/json-en.html) configuration file
containing custom error messages for missing [standard library](../glossary.md#term-standard-library) modules.

This option is intended for Python distributors who wish to provide
distribution-specific guidance when users encounter standard library
modules that are missing or packaged separately.

The JSON file should map missing module names to custom error message strings.
For example, if your distribution packages [`tkinter`](../library/tkinter.md#module-tkinter) and
[`_tkinter`](../library/tkinter.md#module-_tkinter) separately and excludes `_gdbm` for legal reasons,
the configuration could contain:

```json
{
    "_gdbm": "The '_gdbm' module is not available in this distribution",
    "tkinter": "Install the python-tk package to use tkinter",
    "_tkinter": "Install the python-tk package to use tkinter",
}
```

#### Versionadded
Added in version 3.15.

### --enable-pystats

Turn on internal Python performance statistics gathering.

By default, statistics gathering is off. Use `python3 -X pystats` command
or set `PYTHONSTATS=1` environment variable to turn on statistics
gathering at Python startup.

At Python exit, dump statistics if statistics gathering was on and not
cleared.

Effects:

* Add [`-X pystats`](cmdline.md#cmdoption-X) command line option.
* Add `PYTHONSTATS` environment variable.
* Define the `Py_STATS` macro.
* Add functions to the [`sys`](../library/sys.md#module-sys) module:
  * `sys._stats_on()`: Turns on statistics gathering.
  * `sys._stats_off()`: Turns off statistics gathering.
  * `sys._stats_clear()`: Clears the statistics.
  * `sys._stats_dump()`: Dump statistics to file, and clears the statistics.

The statistics will be dumped to a arbitrary (probably unique) file in
`/tmp/py_stats/` (Unix) or `C:\temp\py_stats\` (Windows). If that
directory does not exist, results will be printed on stderr.

Use `Tools/scripts/summarize_stats.py` to read the stats.

Statistics:

* Opcode:
  * Specialization: success, failure, hit, deferred, miss, deopt, failures;
  * Execution count;
  * Pair count.
* Call:
  * Inlined Python calls;
  * PyEval calls;
  * Frames pushed;
  * Frame object created;
  * Eval calls: vector, generator, legacy, function VECTORCALL, build class,
    slot, function “ex”, API, method.
* Object:
  * incref and decref;
  * interpreter incref and decref;
  * allocations: all, 512 bytes, 4 kiB, big;
  * free;
  * to/from free lists;
  * dictionary materialized/dematerialized;
  * type cache;
  * optimization attempts;
  * optimization traces created/executed;
  * uops executed.
* Garbage collector:
  * Garbage collections;
  * Objects visited;
  * Objects collected.

#### Versionadded
Added in version 3.11.

<a id="free-threading-build"></a>

### --disable-gil

<a id="c.Py_GIL_DISABLED"></a>

Enables support for running Python without the [global interpreter
lock](../glossary.md#term-global-interpreter-lock) (GIL): [free-threaded build](../glossary.md#term-free-threaded-build).

Defines the `Py_GIL_DISABLED` macro and adds `"t"` to
[`sys.abiflags`](../library/sys.md#sys.abiflags).

See [Free-threaded CPython](../whatsnew/3.13.md#whatsnew313-free-threaded-cpython) for more detail.

#### Versionadded
Added in version 3.13.

### --enable-experimental-jit=[no|yes|yes-off|interpreter]

Indicate how to integrate the [experimental just-in-time compiler](../whatsnew/3.14.md#whatsnew314-jit-compiler).

* `no`: Don’t build the JIT.
* `yes`: Enable the JIT. To disable it at runtime, set the environment
  variable [`PYTHON_JIT=0`](cmdline.md#envvar-PYTHON_JIT).
* `yes-off`: Build the JIT, but disable it by default. To enable it at
  runtime, set the environment variable [`PYTHON_JIT=1`](cmdline.md#envvar-PYTHON_JIT).
* `interpreter`: Enable the “JIT interpreter” (only useful for those
  debugging the JIT itself). To disable it at runtime, set the environment
  variable [`PYTHON_JIT=0`](cmdline.md#envvar-PYTHON_JIT).

`--enable-experimental-jit=no` is the default behavior if the option is not
provided, and `--enable-experimental-jit` is shorthand for
`--enable-experimental-jit=yes`.  See `Tools/jit/README.md` for more
information, including how to install the necessary build-time dependencies.

#### NOTE
When building CPython with JIT enabled, ensure that your system has Python 3.11 or later installed.

#### Versionadded
Added in version 3.13.

### PKG_CONFIG

Path to `pkg-config` utility.

### PKG_CONFIG_LIBDIR

### PKG_CONFIG_PATH

`pkg-config` options.

### --disable-epoll

Build without `epoll`, meaning that [`select.epoll()`](../library/select.md#select.epoll) will not be
present even if the system provides an
 function.
This may be used on systems where  or
 is available
but incompatible with Linux semantics.

#### Versionadded
Added in version 3.15.

### C compiler options

### CC

C compiler command.

### CFLAGS

C compiler flags.

### CPP

C preprocessor command.

### CPPFLAGS

C preprocessor flags, e.g. `-I*include_dir*`.

### Linker options

### LDFLAGS

Linker flags, e.g. `-L*library_directory*`.

### LIBS

Libraries to pass to the linker, e.g. `-l*library*`.

### MACHDEP

Name for machine-dependent library files.

<a id="configure-options-for-dependencies"></a>

### Options for third-party dependencies

#### Versionadded
Added in version 3.11.

### BZIP2_CFLAGS

### BZIP2_LIBS

C compiler and linker flags to link Python to `libbz2`, used by [`bz2`](../library/bz2.md#module-bz2)
module, overriding `pkg-config`.

### CURSES_CFLAGS

### CURSES_LIBS

C compiler and linker flags for `libncurses` or `libncursesw`, used by
[`curses`](../library/curses.md#module-curses) module, overriding `pkg-config`.

### GDBM_CFLAGS

### GDBM_LIBS

C compiler and linker flags for `gdbm`.

### LIBEDIT_CFLAGS

### LIBEDIT_LIBS

C compiler and linker flags for `libedit`, used by [`readline`](../library/readline.md#module-readline) module,
overriding `pkg-config`.

### LIBFFI_CFLAGS

### LIBFFI_LIBS

C compiler and linker flags for `libffi`, used by [`ctypes`](../library/ctypes.md#module-ctypes) module,
overriding `pkg-config`.

### LIBMPDEC_CFLAGS

### LIBMPDEC_LIBS

C compiler and linker flags for `libmpdec`, used by [`decimal`](../library/decimal.md#module-decimal) module,
overriding `pkg-config`.

#### NOTE
These environment variables have no effect unless
[`--with-system-libmpdec`](#cmdoption-with-system-libmpdec) is specified.

### LIBLZMA_CFLAGS

### LIBLZMA_LIBS

C compiler and linker flags for `liblzma`, used by [`lzma`](../library/lzma.md#module-lzma) module,
overriding `pkg-config`.

### LIBREADLINE_CFLAGS

### LIBREADLINE_LIBS

C compiler and linker flags for `libreadline`, used by [`readline`](../library/readline.md#module-readline)
module, overriding `pkg-config`.

### LIBSQLITE3_CFLAGS

### LIBSQLITE3_LIBS

C compiler and linker flags for `libsqlite3`, used by [`sqlite3`](../library/sqlite3.md#module-sqlite3)
module, overriding `pkg-config`.

### LIBUUID_CFLAGS

### LIBUUID_LIBS

C compiler and linker flags for `libuuid`, used by [`uuid`](../library/uuid.md#module-uuid) module,
overriding `pkg-config`.

### LIBZSTD_CFLAGS

### LIBZSTD_LIBS

C compiler and linker flags for `libzstd`, used by [`compression.zstd`](../library/compression.zstd.md#module-compression.zstd) module,
overriding `pkg-config`.

#### Versionadded
Added in version 3.14.

### PANEL_CFLAGS

### PANEL_LIBS

C compiler and linker flags for PANEL, overriding `pkg-config`.

C compiler and linker flags for `libpanel` or `libpanelw`, used by
[`curses.panel`](../library/curses.panel.md#module-curses.panel) module, overriding `pkg-config`.

### TCLTK_CFLAGS

### TCLTK_LIBS

C compiler and linker flags for TCLTK, overriding `pkg-config`.

### ZLIB_CFLAGS

### ZLIB_LIBS

C compiler and linker flags for `libzlib`, used by [`gzip`](../library/gzip.md#module-gzip) module,
overriding `pkg-config`.

### WebAssembly Options

### --enable-wasm-dynamic-linking

Turn on dynamic linking support for WASM.

Dynamic linking enables `dlopen`. File size of the executable
increases due to limited dead code elimination and additional features.

#### Versionadded
Added in version 3.11.

### --enable-wasm-pthreads

Turn on pthreads support for WASM.

#### Versionadded
Added in version 3.11.

### Install Options

### --prefix=PREFIX

Install architecture-independent files in PREFIX. On Unix, it
defaults to `/usr/local`.

This value can be retrieved at runtime using [`sys.prefix`](../library/sys.md#sys.prefix).

As an example, one can use `--prefix="$HOME/.local/"` to install
a Python in its home directory.

### --exec-prefix=EPREFIX

Install architecture-dependent files in EPREFIX, defaults to [`--prefix`](#cmdoption-prefix).

This value can be retrieved at runtime using [`sys.exec_prefix`](../library/sys.md#sys.exec_prefix).

### --disable-test-modules

Don’t build nor install test modules, like the [`test`](../library/test.md#module-test) package or the
`_testcapi` extension module (built and installed by default).

#### Versionadded
Added in version 3.10.

### --with-ensurepip=[upgrade|install|no]

Select the [`ensurepip`](../library/ensurepip.md#module-ensurepip) command run on Python installation:

* `upgrade` (default): run `python -m ensurepip --altinstall --upgrade`
  command.
* `install`: run `python -m ensurepip --altinstall` command;
* `no`: don’t run ensurepip;

#### Versionadded
Added in version 3.6.

### Performance options

Configuring Python using `--enable-optimizations --with-lto` (PGO + LTO) is
recommended for best performance. The experimental `--enable-bolt` flag can
also be used to improve performance.

### --enable-optimizations

Enable Profile Guided Optimization (PGO) using [`PROFILE_TASK`](#envvar-PROFILE_TASK)
(disabled by default).

The C compiler Clang requires `llvm-profdata` program for PGO. On
macOS, GCC also requires it: GCC is just an alias to Clang on macOS.

Disable also semantic interposition in libpython if `--enable-shared` and
GCC is used: add `-fno-semantic-interposition` to the compiler and linker
flags.

#### NOTE
During the build, you may encounter compiler warnings about
profile data not being available for some source files.
These warnings are harmless, as only a subset of the code is exercised
during profile data acquisition.
To disable these warnings on Clang, manually suppress them by adding
`-Wno-profile-instr-unprofiled` to [`CFLAGS`](#envvar-CFLAGS).

#### Versionadded
Added in version 3.6.

#### Versionchanged
Changed in version 3.10: Use `-fno-semantic-interposition` on GCC.

### PROFILE_TASK

Environment variable used in the Makefile: Python command line arguments for
the PGO generation task.

Default: `-m test --pgo --timeout=$(TESTTIMEOUT)`.

#### Versionadded
Added in version 3.8.

#### Versionchanged
Changed in version 3.13: Task failure is no longer ignored silently.

### --with-lto=[full|thin|no|yes]

Enable Link Time Optimization (LTO) in any build (disabled by default).

The C compiler Clang requires `llvm-ar` for LTO (`ar` on macOS), as well
as an LTO-aware linker (`ld.gold` or `lld`).

#### Versionadded
Added in version 3.6.

#### Versionadded
Added in version 3.11: To use ThinLTO feature, use `--with-lto=thin` on Clang.

#### Versionchanged
Changed in version 3.12: Use ThinLTO as the default optimization policy on Clang if the compiler accepts the flag.

### --enable-bolt

Enable usage of the [BOLT post-link binary optimizer](https://github.com/llvm/llvm-project/tree/main/bolt) (disabled by
default).

BOLT is part of the LLVM project but is not always included in their binary
distributions. This flag requires that `llvm-bolt` and `merge-fdata`
are available.

BOLT is still a fairly new project so this flag should be considered
experimental for now. Because this tool operates on machine code its success
is dependent on a combination of the build environment + the other
optimization configure args + the CPU architecture, and not all combinations
are supported.
BOLT versions before LLVM 16 are known to crash BOLT under some scenarios.
Use of LLVM 16 or newer for BOLT optimization is strongly encouraged.

The `BOLT_INSTRUMENT_FLAGS` and `BOLT_APPLY_FLAGS`
**configure** variables can be defined to override the default set of
arguments for **llvm-bolt** to instrument and apply BOLT data to
binaries, respectively.

#### Versionadded
Added in version 3.12.

### BOLT_APPLY_FLAGS

Arguments to `llvm-bolt` when creating a [BOLT optimized binary](https://github.com/facebookarchive/BOLT).

#### Versionadded
Added in version 3.12.

### BOLT_INSTRUMENT_FLAGS

Arguments to `llvm-bolt` when instrumenting binaries.

#### Versionadded
Added in version 3.12.

### --with-computed-gotos

Enable computed gotos in evaluation loop (enabled by default on supported
compilers).

### --with-tail-call-interp

Enable interpreters using tail calls in CPython. If enabled, enabling PGO
([`--enable-optimizations`](#cmdoption-enable-optimizations)) is highly recommended. This option specifically
requires a C compiler with proper tail call support, and the
[preserve_none](https://clang.llvm.org/docs/AttributeReference.html#preserve-none)
calling convention. For example, Clang 19 and newer supports this feature.

#### Versionadded
Added in version 3.14.

### --without-mimalloc

Disable the fast [mimalloc](../c-api/memory.md#mimalloc) allocator
(enabled by default).

This option cannot be used together with [`--disable-gil`](#cmdoption-disable-gil)
because the [free-threaded](../glossary.md#term-free-threading) build requires mimalloc.

See also [`PYTHONMALLOC`](cmdline.md#envvar-PYTHONMALLOC) environment variable.

### --without-pymalloc

Disable the specialized Python memory allocator [pymalloc](../c-api/memory.md#pymalloc)
(enabled by default).

See also [`PYTHONMALLOC`](cmdline.md#envvar-PYTHONMALLOC) environment variable.

### --with-pymalloc-hugepages

Enable huge page support for [pymalloc](../c-api/memory.md#pymalloc) arenas (disabled by
default). When enabled, the arena size on 64-bit platforms is increased to
2 MiB and arena allocation uses `MAP_HUGETLB` (Linux) or
`MEM_LARGE_PAGES` (Windows) with automatic fallback to regular pages.

Even when compiled with this option, huge pages are **not** used at runtime
unless the [`PYTHON_PYMALLOC_HUGEPAGES`](cmdline.md#envvar-PYTHON_PYMALLOC_HUGEPAGES) environment variable is set
to `1`. This opt-in is required because huge pages

* carry risks on Linux: if the huge-page pool is exhausted, page faults
  (including copy-on-write faults after [`os.fork()`](../library/os.md#os.fork)) deliver `SIGBUS`
  and kill the process.
* need a special privilege on Windows. See the [Windows documentation for large pages](https://learn.microsoft.com/windows/win32/memory/large-page-support)
  for details. Python will fail on startup if the required privilege
  [SeLockMemoryPrivilege](https://learn.microsoft.com/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/lock-pages-in-memory)
  is not held by the user.

The configure script checks that the platform supports `MAP_HUGETLB`
and emits a warning if it is not available.

On Windows, use the `--pymalloc-hugepages` flag with `build.bat` or
set the `UsePymallocHugepages` MSBuild property.

#### Versionadded
Added in version 3.15.

### --without-doc-strings

Disable static documentation strings to reduce the memory footprint (enabled
by default). Documentation strings defined in Python are not affected.

Don’t define the `WITH_DOC_STRINGS` macro.

See the `PyDoc_STRVAR()` macro.

### --enable-profiling

Enable C-level code profiling with `gprof` (disabled by default).

### --with-strict-overflow

Add `-fstrict-overflow` to the C compiler flags (by default we add
`-fno-strict-overflow` instead).

### --without-remote-debug

Deactivate remote debugging support described in [**PEP 768**](https://peps.python.org/pep-0768/) (enabled by default).
When this flag is provided the code that allows the interpreter to schedule the
execution of a Python file in a separate process as described in [**PEP 768**](https://peps.python.org/pep-0768/) is
not compiled. This includes both the functionality to schedule code to be executed
and the functionality to receive code to be executed.

### Py_REMOTE_DEBUG

This macro is defined by default, unless Python is configured with
[`--without-remote-debug`](#cmdoption-without-remote-debug).

Note that even if the macro is defined, remote debugging may not be
available (for example, on an incompatible platform).

#### Versionadded
Added in version 3.14.

<a id="debug-build"></a>

### Python Debug Build

A debug build is Python built with the [`--with-pydebug`](#cmdoption-with-pydebug) configure
option.

Effects of a debug build:

* Display all warnings by default: the list of default warning filters is empty
  in the [`warnings`](../library/warnings.md#module-warnings) module.
* Add `d` to [`sys.abiflags`](../library/sys.md#sys.abiflags).
* Add `sys.gettotalrefcount()` function.
* Add [`-X showrefcount`](cmdline.md#cmdoption-X) command line option.
* Add [`-d`](cmdline.md#cmdoption-d) command line option and [`PYTHONDEBUG`](cmdline.md#envvar-PYTHONDEBUG) environment
  variable to debug the parser.
* Add support for the `__lltrace__` variable: enable low-level tracing in the
  bytecode evaluation loop if the variable is defined.
* Install [debug hooks on memory allocators](../c-api/memory.md#default-memory-allocators)
  to detect buffer overflow and other memory errors.
* Define `Py_DEBUG` and `Py_REF_DEBUG` macros.
* Add runtime checks: code surrounded by `#ifdef Py_DEBUG` and `#endif`.
  Enable `assert(...)` and `_PyObject_ASSERT(...)` assertions: don’t set
  the `NDEBUG` macro (see also the [`--with-assertions`](#cmdoption-with-assertions) configure
  option). Main runtime checks:
  * Add sanity checks on the function arguments.
  * Unicode and int objects are created with their memory filled with a pattern
    to detect usage of uninitialized objects.
  * Ensure that functions which can clear or replace the current exception are
    not called with an exception raised.
  * Check that deallocator functions don’t change the current exception.
  * The garbage collector ([`gc.collect()`](../library/gc.md#gc.collect) function) runs some basic checks
    on objects consistency.
  * The `Py_SAFE_DOWNCAST()` macro checks for integer underflow and
    overflow when downcasting from wide types to narrow types.

See also the [Python Development Mode](../library/devmode.md#devmode) and the
[`--with-trace-refs`](#cmdoption-with-trace-refs) configure option.

#### Versionchanged
Changed in version 3.8: Release builds are now ABI compatible with debug builds: defining the
`Py_DEBUG` macro no longer implies the `Py_TRACE_REFS` macro (see the
[`--with-trace-refs`](#cmdoption-with-trace-refs) option). However, debug builds still expose
more symbols than release builds and code built against a debug build is not
necessarily compatible with a release build.

### Debug options

### --with-pydebug

[Build Python in debug mode](#debug-build): define the `Py_DEBUG`
macro (disabled by default).

### --with-trace-refs

Enable tracing references for debugging purpose (disabled by default).

Effects:

* Define the `Py_TRACE_REFS` macro.
* Add [`sys.getobjects()`](../library/sys.md#sys.getobjects) function.
* Add [`PYTHONDUMPREFS`](cmdline.md#envvar-PYTHONDUMPREFS) environment variable.

The [`PYTHONDUMPREFS`](cmdline.md#envvar-PYTHONDUMPREFS) environment variable can be used to dump
objects and reference counts still alive at Python exit.

[Statically allocated objects](../c-api/typeobj.md#static-types) are not traced.

#### Versionadded
Added in version 3.8.

#### Versionchanged
Changed in version 3.13: This build is now ABI compatible with release build and [debug build](#debug-build).

### --with-assertions

Build with C assertions enabled (default is no): `assert(...);` and
`_PyObject_ASSERT(...);`.

If set, the `NDEBUG` macro is not defined in the [`OPT`](#envvar-OPT) compiler
variable.

See also the [`--with-pydebug`](#cmdoption-with-pydebug) option ([debug build](#debug-build)) which also enables assertions.

#### Versionadded
Added in version 3.6.

### --with-valgrind

Enable Valgrind support (default is no).

### --with-dtrace

Enable DTrace support (default is no).

See [Instrumenting CPython with DTrace and SystemTap](../howto/instrumentation.md#instrumentation).

#### Versionadded
Added in version 3.6.

### --with-address-sanitizer

Enable AddressSanitizer memory error detector, `asan` (default is no).
To improve ASan detection capabilities you may also want to combine this
with [`--without-pymalloc`](#cmdoption-without-pymalloc) to disable the specialized small-object
allocator whose allocations are not tracked by ASan.

#### Versionadded
Added in version 3.6.

### --with-memory-sanitizer

Enable MemorySanitizer allocation error detector, `msan` (default is no).

#### Versionadded
Added in version 3.6.

### --with-undefined-behavior-sanitizer

Enable UndefinedBehaviorSanitizer undefined behaviour detector, `ubsan`
(default is no).

#### Versionadded
Added in version 3.6.

### --with-thread-sanitizer

Enable ThreadSanitizer data race detector, `tsan`
(default is no).

#### Versionadded
Added in version 3.13.

### Linker options

### --enable-shared

Enable building a shared Python library: `libpython` (default is no).

### --without-static-libpython

Do not build `libpythonMAJOR.MINOR.a` and do not install `python.o`
(built and enabled by default).

#### Versionadded
Added in version 3.10.

### --enable-static-libpython-for-interpreter

Do not link the Python interpreter binary (`python3`) against the
shared Python library; instead, statically link the interpreter
against `libpython` as if `--enable-shared` had not been used,
but continue to build the shared `libpython` (for use by other
programs).

This option does nothing if `--enable-shared` is not used.

The default (when `-enable-shared` is used) is to link the Python
interpreter against the built shared library.

#### Versionadded
Added in version 3.15.0a8 (unreleased).

### Libraries options

### --with-libs='lib1 ...'

Link against additional libraries (default is no).

### --with-system-expat

Build the `pyexpat` module using an installed `expat` library
(default is no).

### --with-system-libmpdec

Build the `_decimal` extension module using an installed `mpdecimal`
library, see the [`decimal`](../library/decimal.md#module-decimal) module (default is yes).

#### Versionadded
Added in version 3.3.

#### Versionchanged
Changed in version 3.13: Default to using the installed `mpdecimal` library.

#### Versionchanged
Changed in version 3.15: A bundled copy of the library will no longer be selected
implicitly if an installed `mpdecimal` library is not found.
In Python 3.15 only, it can still be selected explicitly using
`--with-system-libmpdec=no` or `--without-system-libmpdec`.

#### Deprecated-removed
Deprecated since version 3.13, will be removed in version 3.16: A copy of the `mpdecimal` library sources will no longer be distributed
with Python 3.16.

#### SEE ALSO
[`LIBMPDEC_CFLAGS`](#cmdoption-arg-LIBMPDEC_CFLAGS) and [`LIBMPDEC_LIBS`](#cmdoption-arg-LIBMPDEC_LIBS).

### --with-readline=readline|editline

Designate a backend library for the [`readline`](../library/readline.md#module-readline) module.

* readline: Use readline as the backend.
* editline: Use editline as the backend.

#### Versionadded
Added in version 3.10.

### --without-readline

Don’t build the [`readline`](../library/readline.md#module-readline) module (built by default).

Don’t define the `HAVE_LIBREADLINE` macro.

#### Versionadded
Added in version 3.10.

### --with-libm=STRING

Override `libm` math library to *STRING* (default is system-dependent).

### --with-libc=STRING

Override `libc` C library to *STRING* (default is system-dependent).

### --with-openssl=DIR

Root of the OpenSSL directory.

#### Versionadded
Added in version 3.7.

### --with-openssl-rpath=[no|auto|DIR]

Set runtime library directory (rpath) for OpenSSL libraries:

* `no` (default): don’t set rpath;
* `auto`: auto-detect rpath from [`--with-openssl`](#cmdoption-with-openssl) and
  `pkg-config`;
* *DIR*: set an explicit rpath.

#### Versionadded
Added in version 3.10.

### Security Options

### --with-hash-algorithm=[fnv|siphash13|siphash24]

Select hash algorithm for use in `Python/pyhash.c`:

* `siphash13` (default);
* `siphash24`;
* `fnv`.

#### Versionadded
Added in version 3.4.

#### Versionadded
Added in version 3.11: `siphash13` is added and it is the new default.

### --with-builtin-hashlib-hashes=md5,sha1,sha256,sha512,sha3,blake2

Built-in hash modules:

* `md5`;
* `sha1`;
* `sha256`;
* `sha512`;
* `sha3` (with shake);
* `blake2`.

#### Versionadded
Added in version 3.9.

### --with-ssl-default-suites=[python|openssl|STRING]

Override the OpenSSL default cipher suites string:

* `python` (default): use Python’s preferred selection;
* `openssl`: leave OpenSSL’s defaults untouched;
* *STRING*: use a custom string

See the [`ssl`](../library/ssl.md#module-ssl) module.

#### Versionadded
Added in version 3.7.

#### Versionchanged
Changed in version 3.10: The settings `python` and *STRING* also set TLS 1.2 as minimum
protocol version.

### --disable-safety

Disable compiler options that are [recommended by OpenSSF](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++.md) for security reasons with no performance overhead.
If this option is not enabled, CPython will be built based on safety compiler options with no slow down.
When this option is enabled, CPython will not be built with the compiler options listed below.

The following compiler options are disabled with `--disable-safety`:

* [-fstack-protector-strong](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++.md#enable-run-time-checks-for-stack-based-buffer-overflows): Enable run-time checks for stack-based buffer overflows.
* [-Wtrampolines](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++.md#enable-warning-about-trampolines-that-require-executable-stacks): Enable warnings about trampolines that require executable stacks.

#### Versionadded
Added in version 3.14.

### --enable-slower-safety

Enable compiler options that are [recommended by OpenSSF](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++.md) for security reasons which require overhead.
If this option is not enabled, CPython will not be built based on safety compiler options which performance impact.
When this option is enabled, CPython will be built with the compiler options listed below.

The following compiler options are enabled with `--enable-slower-safety`:

* [-D_FORTIFY_SOURCE=3](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++.md#fortify-sources-for-unsafe-libc-usage-and-buffer-overflows): Fortify sources with compile- and run-time checks for unsafe libc usage and buffer overflows.

#### Versionadded
Added in version 3.14.

### macOS Options

See [Mac/README.rst](https://github.com/python/cpython/tree/main/Mac/README.rst).

### --enable-universalsdk

### --enable-universalsdk=SDKDIR

Create a universal binary build. *SDKDIR* specifies which macOS SDK should
be used to perform the build (default is no).

### --enable-framework

### --enable-framework=INSTALLDIR

Create a Python.framework rather than a traditional Unix install. Optional
*INSTALLDIR* specifies the installation path (default is no).

### --with-universal-archs=ARCH

Specify the kind of universal binary that should be created. This option is
only valid when [`--enable-universalsdk`](#cmdoption-enable-universalsdk) is set.

Options:

* `universal2` (x86-64 and arm64);
* `32-bit` (PPC and i386);
* `64-bit`  (PPC64 and x86-64);
* `3-way` (i386, PPC and x86-64);
* `intel` (i386 and x86-64);
* `intel-32` (i386);
* `intel-64` (x86-64);
* `all`  (PPC, i386, PPC64 and x86-64).

Note that values for this configuration item are *not* the same as the
identifiers used for universal binary wheels on macOS. See the Python
Packaging User Guide for details on the [packaging platform compatibility
tags used on macOS](https://packaging.python.org/en/latest/specifications/platform-compatibility-tags/#macos)

### --with-framework-name=FRAMEWORK

Specify the name for the python framework on macOS only valid when
[`--enable-framework`](#cmdoption-enable-framework) is set (default: `Python`).

### --with-app-store-compliance

### --with-app-store-compliance=PATCH-FILE

The Python standard library contains strings that are known to trigger
automated inspection tool errors when submitted for distribution by
the macOS and iOS App Stores. If enabled, this option will apply the list of
patches that are known to correct app store compliance. A custom patch
file can also be specified. This option is disabled by default.

#### Versionadded
Added in version 3.13.

### iOS Options

See [iOS/README.rst](https://github.com/python/cpython/tree/main/iOS/README.rst).

### --enable-framework=INSTALLDIR

Create a Python.framework. Unlike macOS, the *INSTALLDIR* argument
specifying the installation path is mandatory.

### --with-framework-name=FRAMEWORK

Specify the name for the framework (default: `Python`).

### Cross Compiling Options

Cross compiling, also known as cross building, can be used to build Python
for another CPU architecture or platform. Cross compiling requires a Python
interpreter for the build platform. The version of the build Python must match
the version of the cross compiled host Python.

### --build=BUILD

configure for building on BUILD, usually guessed by **config.guess**.

### --host=HOST

cross-compile to build programs to run on HOST (target platform)

### --with-build-python=path/to/python

path to build `python` binary for cross compiling

#### Versionadded
Added in version 3.11.

### CONFIG_SITE=file

An environment variable that points to a file with configure overrides.

Example *config.site* file:

```ini
# config.site-aarch64
ac_cv_buggy_getaddrinfo=no
ac_cv_file__dev_ptmx=yes
ac_cv_file__dev_ptc=no
```

### HOSTRUNNER

Program to run CPython for the host platform for cross-compilation.

#### Versionadded
Added in version 3.11.

Cross compiling example:

```sh
CONFIG_SITE=config.site-aarch64 ../configure \
    --build=x86_64-pc-linux-gnu \
    --host=aarch64-unknown-linux-gnu \
    --with-build-python=../x86_64/python
```

## Python Build System

### Main files of the build system

* `configure.ac` => `configure`;
* `Makefile.pre.in` => `Makefile` (created by `configure`);
* `pyconfig.h` (created by `configure`);
* `Modules/Setup`: C extensions built by the Makefile using
  `Module/makesetup` shell script;

### Main build steps

* C files (`.c`) are built as object files (`.o`).
* A static `libpython` library (`.a`) is created from objects files.
* `python.o` and the static `libpython` library are linked into the
  final `python` program.
* C extensions are built by the Makefile (see `Modules/Setup`).

### Main Makefile targets

#### make

For the most part, when rebuilding after editing some code or
refreshing your checkout from upstream, all you need to do is execute
`make`, which (per Make’s semantics) builds the default target, the
first one defined in the Makefile.  By tradition (including in the
CPython project) this is usually the `all` target. The
`configure` script expands an `autoconf` variable,
`@DEF_MAKE_ALL_RULE@` to describe precisely which targets `make
all` will build. The three choices are:

* `profile-opt` (configured with `--enable-optimizations`)
* `build_wasm` (chosen if the host platform matches `wasm32-wasi*` or
  `wasm32-emscripten`)
* `build_all` (configured without explicitly using either of the others)

Depending on the most recent source file changes, Make will rebuild
any targets (object files and executables) deemed out-of-date,
including running `configure` again if necessary. Source/target
dependencies are many and maintained manually however, so Make
sometimes doesn’t have all the information necessary to correctly
detect all targets which need to be rebuilt.  Depending on which
targets aren’t rebuilt, you might experience a number of problems. If
you have build or test problems which you can’t otherwise explain,
`make clean && make` should work around most dependency problems, at
the expense of longer build times.

#### make platform

Build the `python` program, but don’t build the standard library
extension modules. This generates a file named `platform` which
contains a single line describing the details of the build platform,
e.g., `macosx-14.3-arm64-3.12` or `linux-x86_64-3.13`.

#### make profile-opt

Build Python using profile-guided optimization (PGO).  You can use the
configure [`--enable-optimizations`](#cmdoption-enable-optimizations) option to make this the
default target of the `make` command (`make all` or just
`make`).

#### make clean

Remove built files.

#### make distclean

In addition to the work done by `make clean`, remove files
created by the configure script.  `configure` will have to be run
before building again. <sup>[6](#id16)</sup>

#### make install

Build the `all` target and install Python.

#### make test

Build the `all` target and run the Python test suite with the
`--fast-ci` option without GUI tests. Variables:

* `TESTOPTS`: additional regrtest command-line options.
* `TESTPYTHONOPTS`: additional Python command-line options.
* `TESTTIMEOUT`: timeout in seconds (default: 10 minutes).

#### make ci

This is similar to `make test`, but uses the `-ugui` to also run GUI tests.

#### Versionadded
Added in version 3.14.

#### make buildbottest

This is similar to `make test`, but uses the `--slow-ci`
option and default timeout of 20 minutes, instead of `--fast-ci` option.

#### make regen-all

Regenerate (almost) all generated files. These include (but are not
limited to) bytecode cases, and parser generator file.
`make regen-stdlib-module-names` and `autoconf` must be run
separately for the remaining [generated files](#generated-files).

### C extensions

Some C extensions are built as built-in modules, like the `sys` module.
They are built with the `Py_BUILD_CORE_BUILTIN` macro defined.
Built-in modules have no `__file__` attribute:

```pycon
>>> import sys
>>> sys
<module 'sys' (built-in)>
>>> sys.__file__
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: module 'sys' has no attribute '__file__'
```

Other C extensions are built as dynamic libraries, like the `_asyncio` module.
They are built with the `Py_BUILD_CORE_MODULE` macro defined.
Example on Linux x86-64:

```pycon
>>> import _asyncio
>>> _asyncio
<module '_asyncio' from '/usr/lib64/python3.9/lib-dynload/_asyncio.cpython-39-x86_64-linux-gnu.so'>
>>> _asyncio.__file__
'/usr/lib64/python3.9/lib-dynload/_asyncio.cpython-39-x86_64-linux-gnu.so'
```

`Modules/Setup` is used to generate Makefile targets to build C extensions.
At the beginning of the files, C extensions are built as built-in modules.
Extensions defined after the `*shared*` marker are built as dynamic libraries.

The `PyAPI_FUNC()`, `PyAPI_DATA()` and
[`PyMODINIT_FUNC`](../c-api/extension-modules.md#c.PyMODINIT_FUNC) macros of `Include/exports.h` are defined
differently depending if the `Py_BUILD_CORE_MODULE` macro is defined:

* Use `Py_EXPORTED_SYMBOL` if the `Py_BUILD_CORE_MODULE` is defined
* Use `Py_IMPORTED_SYMBOL` otherwise.

If the `Py_BUILD_CORE_BUILTIN` macro is used by mistake on a C extension
built as a shared library, its `PyInit_*xxx*()` function is not exported,
causing an [`ImportError`](../library/exceptions.md#ImportError) on import.

## Compiler and linker flags

Options set by the `./configure` script and environment variables and used by
`Makefile`.

### Preprocessor flags

### CONFIGURE_CPPFLAGS

Value of [`CPPFLAGS`](#envvar-CPPFLAGS) variable passed to the `./configure` script.

#### Versionadded
Added in version 3.6.

### CPPFLAGS

(Objective) C/C++ preprocessor flags, e.g. `-I*include_dir*` if you have
headers in a nonstandard directory *include_dir*.

Both [`CPPFLAGS`](#envvar-CPPFLAGS) and [`LDFLAGS`](#envvar-LDFLAGS) need to contain the shell’s
value to be able to build extension modules using the
directories specified in the environment variables.

### BASECPPFLAGS

#### Versionadded
Added in version 3.4.

### PY_CPPFLAGS

Extra preprocessor flags added for building the interpreter object files.

Default: `$(BASECPPFLAGS) -I. -I$(srcdir)/Include $(CONFIGURE_CPPFLAGS) $(CPPFLAGS)`.

#### Versionadded
Added in version 3.2.

### Compiler flags

### CC

C compiler command.

Example: `gcc -pthread`.

### CXX

C++ compiler command.

Example: `g++ -pthread`.

### CFLAGS

C compiler flags.

### CFLAGS_NODIST

[`CFLAGS_NODIST`](#envvar-CFLAGS_NODIST) is used for building the interpreter and stdlib C
extensions.  Use it when a compiler flag should *not* be part of
[`CFLAGS`](#envvar-CFLAGS) once Python is installed ([gh-65320](https://github.com/python/cpython/issues/65320)).

In particular, [`CFLAGS`](#envvar-CFLAGS) should not contain:

* the compiler flag `-I` (for setting the search path for include files).
  The `-I` flags are processed from left to right, and any flags in
  [`CFLAGS`](#envvar-CFLAGS) would take precedence over user- and package-supplied `-I`
  flags.
* hardening flags such as `-Werror` because distributions cannot control
  whether packages installed by users conform to such heightened
  standards.

#### Versionadded
Added in version 3.5.

### COMPILEALL_OPTS

Options passed to the [`compileall`](../library/compileall.md#module-compileall) command line when building PYC files
in `make install`. Default: `-j0`.

#### Versionadded
Added in version 3.12.

### EXTRA_CFLAGS

Extra C compiler flags.

### CONFIGURE_CFLAGS

Value of [`CFLAGS`](#envvar-CFLAGS) variable passed to the `./configure`
script.

#### Versionadded
Added in version 3.2.

### CONFIGURE_CFLAGS_NODIST

Value of [`CFLAGS_NODIST`](#envvar-CFLAGS_NODIST) variable passed to the `./configure`
script.

#### Versionadded
Added in version 3.5.

### BASECFLAGS

Base compiler flags.

### OPT

Optimization flags.

### CFLAGS_ALIASING

Strict or non-strict aliasing flags used to compile `Python/dtoa.c`.

#### Versionadded
Added in version 3.7.

### CFLAGS_CEVAL

Flags used to compile `Python/ceval.c`.

#### Versionadded
Added in version 3.14.5.

### CCSHARED

Compiler flags used to build a shared library.

For example, `-fPIC` is used on Linux and on BSD.

### CFLAGSFORSHARED

Extra C flags added for building the interpreter object files.

Default: `$(CCSHARED)` when [`--enable-shared`](#cmdoption-enable-shared) is used, or an empty
string otherwise.

### PY_CFLAGS

Default: `$(BASECFLAGS) $(OPT) $(CONFIGURE_CFLAGS) $(CFLAGS) $(EXTRA_CFLAGS)`.

### PY_CFLAGS_NODIST

Default: `$(CONFIGURE_CFLAGS_NODIST) $(CFLAGS_NODIST) -I$(srcdir)/Include/internal`.

#### Versionadded
Added in version 3.5.

### PY_STDMODULE_CFLAGS

C flags used for building the interpreter object files.

Default: `$(PY_CFLAGS) $(PY_CFLAGS_NODIST) $(PY_CPPFLAGS) $(CFLAGSFORSHARED)`.

#### Versionadded
Added in version 3.7.

### PY_CORE_CFLAGS

Default: `$(PY_STDMODULE_CFLAGS) -DPy_BUILD_CORE`.

#### Versionadded
Added in version 3.2.

### PY_BUILTIN_MODULE_CFLAGS

Compiler flags to build a standard library extension module as a built-in
module, like the [`posix`](../library/posix.md#module-posix) module.

Default: `$(PY_STDMODULE_CFLAGS) -DPy_BUILD_CORE_BUILTIN`.

#### Versionadded
Added in version 3.8.

### PURIFY

Purify command. Purify is a memory debugger program.

Default: empty string (not used).

### Linker flags

### LINKCC

Linker command used to build programs like `python` and `_testembed`.

Default: `$(PURIFY) $(CC)`.

### CONFIGURE_LDFLAGS

Value of [`LDFLAGS`](#envvar-LDFLAGS) variable passed to the `./configure` script.

Avoid assigning [`CFLAGS`](#envvar-CFLAGS), [`LDFLAGS`](#envvar-LDFLAGS), etc. so users can use
them on the command line to append to these values without stomping the
pre-set values.

#### Versionadded
Added in version 3.2.

### LDFLAGS_NODIST

[`LDFLAGS_NODIST`](#envvar-LDFLAGS_NODIST) is used in the same manner as
[`CFLAGS_NODIST`](#envvar-CFLAGS_NODIST).  Use it when a linker flag should *not* be part of
[`LDFLAGS`](#envvar-LDFLAGS) once Python is installed ([gh-65320](https://github.com/python/cpython/issues/65320)).

In particular, [`LDFLAGS`](#envvar-LDFLAGS) should not contain:

* the compiler flag `-L` (for setting the search path for libraries).
  The `-L` flags are processed from left to right, and any flags in
  [`LDFLAGS`](#envvar-LDFLAGS) would take precedence over user- and package-supplied `-L`
  flags.

### CONFIGURE_LDFLAGS_NODIST

Value of [`LDFLAGS_NODIST`](#envvar-LDFLAGS_NODIST) variable passed to the `./configure`
script.

#### Versionadded
Added in version 3.8.

### LDFLAGS

Linker flags, e.g. `-L*lib_dir*` if you have libraries in a nonstandard
directory *lib_dir*.

Both [`CPPFLAGS`](#envvar-CPPFLAGS) and [`LDFLAGS`](#envvar-LDFLAGS) need to contain the shell’s
value to be able to build extension modules using the
directories specified in the environment variables.

Please consider using `EXE_LDFLAGS` if the supplied linker flags are
executable specific, e.g. GCC’s `-pie` flag.

### LIBS

Linker flags to pass libraries to the linker when linking the Python
executable.

Example: `-lrt`.

### LDSHARED

Command to build a shared library.

Default: `@LDSHARED@ $(PY_LDFLAGS)`.

### BLDSHARED

Command to build `libpython` shared library.

Default: `@BLDSHARED@ $(PY_CORE_LDFLAGS)`.

### PY_LDFLAGS

Default: `$(CONFIGURE_LDFLAGS) $(LDFLAGS)`.

### PY_LDFLAGS_NODIST

Default: `$(CONFIGURE_LDFLAGS_NODIST) $(LDFLAGS_NODIST)`.

#### Versionadded
Added in version 3.8.

### PY_CORE_LDFLAGS

Linker flags used for building the interpreter object files.

#### Versionadded
Added in version 3.8.

### EXE_LDFLAGS

Linker flags used for building executable targets such as the
interpreter. If supplied, [`PY_CORE_EXE_LDFLAGS`](#envvar-PY_CORE_EXE_LDFLAGS)
will be used in replacement of [`PY_CORE_LDFLAGS`](#envvar-PY_CORE_LDFLAGS).

#### Versionadded
Added in version 3.15.

### CONFIGURE_EXE_LDFLAGS

Value of [`EXE_LDFLAGS`](#envvar-EXE_LDFLAGS) variable passed to the `./configure`
script.

#### Versionadded
Added in version 3.15.

### PY_CORE_EXE_LDFLAGS

Linker flags used for building the interpreter and
executable targets.

Default: `$(PY_CORE_LDFLAGS)`

#### Versionadded
Added in version 3.15.

### Footnotes

* <a id='id16'>**[6]**</a> `git clean -fdx` is an even more extreme way to “clean” your checkout. It removes all files not known to Git. When bug hunting using `git bisect`, this is [recommended between probes](https://github.com/python/cpython/issues/114505#issuecomment-1907021718) to guarantee a completely clean build. **Use with care**, as it will delete all files not checked into Git, including your new, uncommitted work.
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

<a id="sys-path-init"></a>

# The initialization of the [`sys.path`](sys.md#sys.path) module search path

A module search path is initialized when Python starts. This module search path
may be accessed at [`sys.path`](sys.md#sys.path).

The first entry in the module search path is the directory that contains the
input script, if there is one. Otherwise, the first entry is the current
directory, which is the case when executing the interactive shell, a [`-c`](../using/cmdline.md#cmdoption-c)
command, or [`-m`](../using/cmdline.md#cmdoption-m) module.

The [`PYTHONPATH`](../using/cmdline.md#envvar-PYTHONPATH) environment variable is often used to add directories
to the search path. If this environment variable is found then the contents are
added to the module search path.

#### NOTE
[`PYTHONPATH`](../using/cmdline.md#envvar-PYTHONPATH) will affect all installed Python versions/environments.
Be wary of setting this in your shell profile or global environment variables.
The [`site`](site.md#module-site) module offers more nuanced techniques as mentioned below.

The next items added are the directories containing standard Python modules as
well as any [extension module](../glossary.md#term-extension-module)s that these modules depend on. Extension
modules are `.pyd` files on Windows and `.so` files on other platforms. The
directory with the platform-independent Python modules is called `prefix`.
The directory with the extension modules is called `exec_prefix`.

The [`PYTHONHOME`](../using/cmdline.md#envvar-PYTHONHOME) environment variable may be used to set the `prefix`
and `exec_prefix` locations. Otherwise these directories are found by using
the Python executable as a starting point and then looking for various ‘landmark’
files and directories. Note that any symbolic links are followed so the real
Python executable location is used as the search starting point. The Python
executable location is called `home`.

Once `home` is determined, the `prefix` directory is found by first looking
for `python*majorversion**minorversion*.zip` (`python311.zip`). On Windows
the zip archive is searched for in `home` and on Unix the archive is expected
to be in `lib`. Note that the expected zip archive location is added to the
module search path even if the archive does not exist. If no archive was found,
Python on Windows will continue the search for `prefix` by looking for `Lib\os.py`.
Python on Unix will look for `lib/python*majorversion*.*minorversion*/os.py`
(`lib/python3.11/os.py`). On Windows `prefix` and `exec_prefix` are the same,
however on other platforms `lib/python*majorversion*.*minorversion*/lib-dynload`
(`lib/python3.11/lib-dynload`) is searched for and used as an anchor for
`exec_prefix`. On some platforms `lib` may be `lib64` or another value,
see [`sys.platlibdir`](sys.md#sys.platlibdir) and [`PYTHONPLATLIBDIR`](../using/cmdline.md#envvar-PYTHONPLATLIBDIR).

Once found, `prefix` and `exec_prefix` are available at
[`sys.base_prefix`](sys.md#sys.base_prefix) and [`sys.base_exec_prefix`](sys.md#sys.base_exec_prefix) respectively.

If [`PYTHONHOME`](../using/cmdline.md#envvar-PYTHONHOME) is not set, and a `pyvenv.cfg` file is found alongside
the main executable, or in its parent directory, [`sys.prefix`](sys.md#sys.prefix) and
[`sys.exec_prefix`](sys.md#sys.exec_prefix) get set to the directory containing `pyvenv.cfg`,
otherwise they are set to the same value as [`sys.base_prefix`](sys.md#sys.base_prefix) and
[`sys.base_exec_prefix`](sys.md#sys.base_exec_prefix), respectively.
This is used by [Virtual Environments](#sys-path-init-virtual-environments).

Finally, the [`site`](site.md#module-site) module is processed and `site-packages`
directories are added to the module search path.  The [`PYTHONUSERBASE`](../using/cmdline.md#envvar-PYTHONUSERBASE)
environment variable controls where is searched for user site-packages and the
[`PYTHONNOUSERSITE`](../using/cmdline.md#envvar-PYTHONNOUSERSITE) environment variable prevents searching for user
site-packages all together.  A common way to customize the search path is to
create [`sitecustomize`](site.md#module-sitecustomize) or [`usercustomize`](site.md#module-usercustomize) modules as described in the
[`site`](site.md#module-site) module documentation.

#### NOTE
The command line options [`-E`](../using/cmdline.md#cmdoption-E), [`-P`](../using/cmdline.md#cmdoption-P), [`-I`](../using/cmdline.md#cmdoption-I),
[`-S`](../using/cmdline.md#cmdoption-S) and [`-s`](../using/cmdline.md#cmdoption-s) further affect path calculations, see their
documentation for details.

#### Versionchanged
Changed in version 3.14: [`sys.prefix`](sys.md#sys.prefix) and [`sys.exec_prefix`](sys.md#sys.exec_prefix) are now set to the
`pyvenv.cfg` directory during the path initialization. This was previously
done by [`site`](site.md#module-site), therefore affected by [`-S`](../using/cmdline.md#cmdoption-S).

<a id="sys-path-init-virtual-environments"></a>

## Virtual Environments

Virtual environments place a `pyvenv.cfg` file in their prefix, which causes
[`sys.prefix`](sys.md#sys.prefix) and [`sys.exec_prefix`](sys.md#sys.exec_prefix) to point to them, instead of the
base installation.

The `prefix` and `exec_prefix` values of the base installation are available
at [`sys.base_prefix`](sys.md#sys.base_prefix) and [`sys.base_exec_prefix`](sys.md#sys.base_exec_prefix).

As well as being used as a marker to identify virtual environments,
`pyvenv.cfg` may also be used to configure the [`site`](site.md#module-site) initialization.
Please refer to [`site`](site.md#module-site)’s
[virtual environments documentation](site.md#site-virtual-environments-configuration).

#### NOTE
[`PYTHONHOME`](../using/cmdline.md#envvar-PYTHONHOME) overrides the `pyvenv.cfg` detection.

#### NOTE
There are other ways “virtual environments” could be implemented.
This documentation refers to implementations based on the `pyvenv.cfg`
mechanism, such as [`venv`](venv.md#module-venv), that many virtual environment implementations
follow.

## \_pth files

To completely override [`sys.path`](sys.md#sys.path) create a `._pth` file with the same
name as the shared library or executable (`python._pth` or `python311._pth`).
The shared library path is always known on Windows, however it may not be
available on other platforms. In the `._pth` file specify one line for each path
to add to [`sys.path`](sys.md#sys.path). The file based on the shared library name overrides
the one based on the executable, which allows paths to be restricted for any
program loading the runtime if desired.

When the file exists, all registry and environment variables are ignored,
isolated mode is enabled, and [`site`](site.md#module-site) is not imported unless one line in the
file specifies `import site`. Blank paths and lines starting with `#` are
ignored. Each path may be absolute or relative to the location of the file.
Import statements other than to `site` are not permitted, and arbitrary code
cannot be specified.

Note that `.pth` files (without leading underscore) will be processed normally
by the [`site`](site.md#module-site) module when `import site` has been specified.

## Embedded Python

If Python is embedded within another application [`Py_InitializeFromConfig()`](../c-api/interp-lifecycle.md#c.Py_InitializeFromConfig) and
the [`PyConfig`](../c-api/init_config.md#c.PyConfig) structure can be used to initialize Python. The path specific
details are described at [Python Path Configuration](../c-api/init_config.md#init-path-config).

#### SEE ALSO
* [Finding modules](../using/windows.md#windows-finding-modules) for detailed Windows notes.
* [Using Python on Unix platforms](../using/unix.md#using-on-unix) for Unix details.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

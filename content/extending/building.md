<a id="building"></a>

# Building C and C++ Extensions

A C extension for CPython is a shared library (for example, a `.so` file on
Linux, `.pyd` on Windows), which exports an *initialization function*.

See [Defining extension modules](../c-api/extension-modules.md#extension-modules) for details.

<a id="install-index"></a>

<a id="setuptools-index"></a>

## Building C and C++ Extensions with setuptools

Building, packaging and distributing extension modules is best done with
third-party tools, and is out of scope of this document.
One suitable tool is Setuptools, whose documentation can be found at
[https://setuptools.pypa.io/en/latest/setuptools.html](https://setuptools.pypa.io/en/latest/setuptools.html).

The [`distutils`](../library/distutils.md#module-distutils) module, which was included in the standard library
until Python 3.12, is now maintained as part of Setuptools.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

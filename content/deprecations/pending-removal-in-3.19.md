# Pending removal in Python 3.19

* [`ctypes`](../library/ctypes.md#module-ctypes):
  * Implicitly switching to the MSVC-compatible struct layout by setting
    [`_pack_`](../library/ctypes.md#ctypes.Structure._pack_) but not [`_layout_`](../library/ctypes.md#ctypes.Structure._layout_)
    on non-Windows platforms.
* [`hashlib`](../library/hashlib.md#module-hashlib):
  - In hash function constructors such as [`new()`](../library/hashlib.md#hashlib.new) or the
    direct hash-named constructors such as [`md5()`](../library/hashlib.md#hashlib.md5) and
    [`sha256()`](../library/hashlib.md#hashlib.sha256), their optional initial data parameter could
    also be passed a keyword argument named `data=` or `string=` in
    various `hashlib` implementations.

    Support for the `string` keyword argument name is now deprecated
    and slated for removal in Python 3.19.

    Before Python 3.13, the `string` keyword parameter was not correctly
    supported depending on the backend implementation of hash functions.
    Prefer passing the initial data as a positional argument for maximum
    backwards compatibility.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

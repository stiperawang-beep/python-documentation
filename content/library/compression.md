# The `compression` package

#### Versionadded
Added in version 3.14.

The `compression` package contains the canonical compression modules
containing interfaces to several different compression algorithms. Some of
these modules have historically been available as separate modules; those will
continue to be available under their original names for compatibility reasons,
and will not be removed without a deprecation cycle. The use of modules in
`compression` is encouraged where practical.

* `compression.bz2` – Re-exports [`bz2`](bz2.md#module-bz2)
* `compression.gzip` – Re-exports [`gzip`](gzip.md#module-gzip)
* `compression.lzma` – Re-exports [`lzma`](lzma.md#module-lzma)
* `compression.zlib` – Re-exports [`zlib`](zlib.md#module-zlib)
* [`compression.zstd`](compression.zstd.md#module-compression.zstd) – Wrapper for the Zstandard compression library

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

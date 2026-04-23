# `mmap` — Memory-mapped file support

---
<!-- include for modules that don't work on WASM -->

[Availability](intro.md#availability): not WASI.

This module does not work or is not available on WebAssembly. See
[WebAssembly platforms](intro.md#wasm-availability) for more information.

Memory-mapped file objects behave like both [`bytearray`](stdtypes.md#bytearray) and like
[file objects](../glossary.md#term-file-object).  You can use mmap objects in most places
where [`bytearray`](stdtypes.md#bytearray) are expected; for example, you can use the [`re`](re.md#module-re)
module to search through a memory-mapped file.  You can also change a single
byte by doing `obj[index] = 97`, or change a subsequence by assigning to a
slice: `obj[i1:i2] = b'...'`.  You can also read and write data starting at
the current file position, and `seek()` through the file to different positions.

A memory-mapped file is created by the [`mmap`](#mmap.mmap) constructor, which is
different on Unix and on Windows.  In either case you must provide a file
descriptor for a file opened for update. If you wish to map an existing Python
file object, use its [`fileno()`](io.md#io.IOBase.fileno) method to obtain the correct value for the
*fileno* parameter.  Otherwise, you can open the file using the
[`os.open()`](os.md#os.open) function, which returns a file descriptor directly (the file
still needs to be closed when done).

#### NOTE
If you want to create a memory-mapping for a writable, buffered file, you
should [`flush()`](io.md#io.IOBase.flush) the file first.  This is necessary to ensure
that local modifications to the buffers are actually available to the
mapping.

For both the Unix and Windows versions of the constructor, *access* may be
specified as an optional keyword parameter. *access* accepts one of four
values: `ACCESS_READ`, `ACCESS_WRITE`, or `ACCESS_COPY` to
specify read-only, write-through or copy-on-write memory respectively, or
`ACCESS_DEFAULT` to defer to *prot*.  *access* can be used on both Unix
and Windows.  If *access* is not specified, Windows mmap returns a
write-through mapping.  The initial memory values for all three access types
are taken from the specified file.  Assignment to an `ACCESS_READ`
memory map raises a [`TypeError`](exceptions.md#TypeError) exception.  Assignment to an
`ACCESS_WRITE` memory map affects both memory and the underlying file.
Assignment to an `ACCESS_COPY` memory map affects memory but does not
update the underlying file.

#### Versionchanged
Changed in version 3.7: Added `ACCESS_DEFAULT` constant.

To map anonymous memory, -1 should be passed as the fileno along with the length.

### *class* mmap.mmap(fileno, length, tagname=None, access=ACCESS_DEFAULT, offset=0, , trackfd=True)

**(Windows version)** Maps *length* bytes from the file specified by the
file descriptor *fileno*, and creates a mmap object.  If *length* is larger
than the current size of the file, the file is extended to contain *length*
bytes.  If *length* is `0`, the maximum length of the map is the current
size of the file, except that if the file is empty Windows raises an
exception (you cannot create an empty mapping on Windows).

*tagname*, if specified and not `None`, is a string giving a tag name for
the mapping.  Windows allows you to have many different mappings against
the same file.  If you specify the name of an existing tag, that tag is
opened, otherwise a new tag of this name is created.  If this parameter is
omitted or `None`, the mapping is created without a name.  Avoiding the
use of the *tagname* parameter will assist in keeping your code portable
between Unix and Windows.

*offset* may be specified as a non-negative integer offset. mmap references
will be relative to the offset from the beginning of the file. *offset*
defaults to 0.  *offset* must be a multiple of the `ALLOCATIONGRANULARITY`.

If *trackfd* is `False`, the file handle corresponding to *fileno* will
not be duplicated, and the resulting `mmap` object will not
be associated with the map’s underlying file.
This means that the [`size()`](#mmap.mmap.size) and [`resize()`](#mmap.mmap.resize)
methods will fail.
This mode is useful to limit the number of open file handles.
The original file can be renamed (but not deleted) after closing *fileno*.

#### Versionchanged
Changed in version 3.15: The *trackfd* parameter was added.

Raises an [auditing event](sys.md#auditing) `mmap.__new__` with arguments `fileno`, `length`, `access`, `offset`.

### *class* mmap.mmap(fileno, length, flags=MAP_SHARED, prot=PROT_WRITE | PROT_READ, access=ACCESS_DEFAULT, offset=0, , trackfd=True)

**(Unix version)** Maps *length* bytes from the file specified by the file
descriptor *fileno*, and returns a mmap object.  If *length* is `0`, the
maximum length of the map will be the current size of the file when
[`mmap`](#mmap.mmap) is called.

*flags* specifies the nature of the mapping. [`MAP_PRIVATE`](#mmap.MAP_PRIVATE) creates a
private copy-on-write mapping, so changes to the contents of the mmap
object will be private to this process, and [`MAP_SHARED`](#mmap.MAP_SHARED) creates a
mapping that’s shared with all other processes mapping the same areas of
the file.  The default value is [`MAP_SHARED`](#mmap.MAP_SHARED). Some systems have
additional possible flags with the full list specified in
[MAP_\* constants](#map-constants).

*prot*, if specified, gives the desired memory protection; the two most
useful values are `PROT_READ` and `PROT_WRITE`, to specify
that the pages may be read or written.  *prot* defaults to
`PROT_READ | PROT_WRITE`.

*access* may be specified in lieu of *flags* and *prot* as an optional
keyword parameter.  It is an error to specify both *flags*, *prot* and
*access*.  See the description of *access* above for information on how to
use this parameter.

*offset* may be specified as a non-negative integer offset. mmap references
will be relative to the offset from the beginning of the file. *offset*
defaults to 0. *offset* must be a multiple of `ALLOCATIONGRANULARITY`
which is equal to `PAGESIZE` on Unix systems.

If *trackfd* is `False`, the file descriptor specified by *fileno* will
not be duplicated, and the resulting `mmap` object will not
be associated with the map’s underlying file.
This means that the [`size()`](#mmap.mmap.size) and [`resize()`](#mmap.mmap.resize)
methods will fail.
This mode is useful to limit the number of open file descriptors.

To ensure validity of the created memory mapping the file specified
by the descriptor *fileno* is internally automatically synchronized
with the physical backing store on macOS.

#### Versionchanged
Changed in version 3.13: The *trackfd* parameter was added.

This example shows a simple way of using [`mmap`](#mmap.mmap):

```python3
import mmap

# write a simple example file
with open("hello.txt", "wb") as f:
    f.write(b"Hello Python!\n")

with open("hello.txt", "r+b") as f:
    # memory-map the file, size 0 means whole file
    mm = mmap.mmap(f.fileno(), 0)
    # read content via standard file methods
    print(mm.readline())  # prints b"Hello Python!\n"
    # read content via slice notation
    print(mm[:5])  # prints b"Hello"
    # update content using slice notation;
    # note that new content must have same size
    mm[6:] = b" world!\n"
    # ... and read again using standard file methods
    mm.seek(0)
    print(mm.readline())  # prints b"Hello  world!\n"
    # close the map
    mm.close()
```

[`mmap`](#mmap.mmap) can also be used as a context manager in a [`with`](../reference/compound_stmts.md#with)
statement:

```python3
import mmap

with mmap.mmap(-1, 13) as mm:
    mm.write(b"Hello world!")
```

#### Versionadded
Added in version 3.2: Context manager support.

The next example demonstrates how to create an anonymous map and exchange
data between the parent and child processes:

```python3
import mmap
import os

mm = mmap.mmap(-1, 13)
mm.write(b"Hello world!")

pid = os.fork()

if pid == 0:  # In a child process
    mm.seek(0)
    print(mm.readline())

    mm.close()
```

Raises an [auditing event](sys.md#auditing) `mmap.__new__` with arguments `fileno`, `length`, `access`, `offset`.

Memory-mapped file objects support the following methods:

#### close()

Closes the mmap. Subsequent calls to other methods of the object will
result in a ValueError exception being raised. This will not close
the open file.

#### closed

`True` if the file is closed.

#### Versionadded
Added in version 3.2.

#### find(sub)

Returns the lowest index in the object where the subsequence *sub* is
found, such that *sub* is contained in the range [*start*, *end*].
Optional arguments *start* and *end* are interpreted as in slice notation.
Returns `-1` on failure.

#### Versionchanged
Changed in version 3.5: Writable [bytes-like object](../glossary.md#term-bytes-like-object) is now accepted.

#### flush(\*, flags=MS_SYNC)

Flushes changes made to the in-memory copy of a file back to disk. Without
use of this call there is no guarantee that changes are written back before
the object is destroyed.  If *offset* and *size* are specified, only
changes to the given range of bytes will be flushed to disk; otherwise, the
whole extent of the mapping is flushed.  *offset* must be a multiple of the
`PAGESIZE` or `ALLOCATIONGRANULARITY`.

The *flags* parameter specifies the synchronization behavior.
*flags* must be one of the [MS_\* constants](#ms-constants) available
on the system.

On Windows, the *flags* parameter is ignored.

`None` is returned to indicate success.  An exception is raised when the
call failed.

#### Versionchanged
Changed in version 3.8: Previously, a nonzero value was returned on success; zero was returned
on error under Windows.  A zero value was returned on success; an
exception was raised on error under Unix.

#### Versionchanged
Changed in version 3.15: Allow specifying *offset* without *size*. Previously, both *offset*
and *size* parameters were required together. Now *offset* can be
specified alone, and the flush operation will extend from *offset*
to the end of the mmap.

#### Versionchanged
Changed in version 3.15: Added *flags* parameter to control synchronization behavior.

#### madvise(option)

Send advice *option* to the kernel about the memory region beginning at
*start* and extending *length* bytes.  *option* must be one of the
[MADV_\* constants](#madvise-constants) available on the system.  If
*start* and *length* are omitted, the entire mapping is spanned.  On
some systems (including Linux), *start* must be a multiple of the
`PAGESIZE`.

Availability: Systems with the `madvise()` system call.

#### Versionadded
Added in version 3.8.

#### move(dest, src, count)

Copy the *count* bytes starting at offset *src* to the destination index
*dest*.  If the mmap was created with `ACCESS_READ`, then calls to
move will raise a [`TypeError`](exceptions.md#TypeError) exception.

#### read()

Return a [`bytes`](stdtypes.md#bytes) containing up to *n* bytes starting from the
current file position. If the argument is omitted, `None` or negative,
return all bytes from the current file position to the end of the
mapping. The file position is updated to point after the bytes that were
returned.

#### Versionchanged
Changed in version 3.3: Argument can be omitted or `None`.

#### read_byte()

Returns a byte at the current file position as an integer, and advances
the file position by 1.

#### readline()

Returns a single line, starting at the current file position and up to the
next newline. The file position is updated to point after the bytes that were
returned.

#### resize(newsize)

Resizes the map and the underlying file, if any.

Resizing a map created with *access* of `ACCESS_READ` or
`ACCESS_COPY`, will raise a [`TypeError`](exceptions.md#TypeError) exception.
Resizing a map created with *trackfd* set to `False`,
will raise a [`ValueError`](exceptions.md#ValueError) exception.

**On Windows**: Resizing the map will raise an [`OSError`](exceptions.md#OSError) if there are other
maps against the same named file. Resizing an anonymous map (ie against the
pagefile) will silently create a new map with the original data copied over
up to the length of the new size.

Availability: Windows and systems with the `mremap()` system call.

#### Versionchanged
Changed in version 3.11: Correctly fails if attempting to resize when another map is held
Allows resize against an anonymous map on Windows

#### rfind(sub)

Returns the highest index in the object where the subsequence *sub* is
found, such that *sub* is contained in the range [*start*, *end*].
Optional arguments *start* and *end* are interpreted as in slice notation.
Returns `-1` on failure.

#### Versionchanged
Changed in version 3.5: Writable [bytes-like object](../glossary.md#term-bytes-like-object) is now accepted.

#### seek(pos)

Set the file’s current position.  *whence* argument is optional and
defaults to `os.SEEK_SET` or `0` (absolute file positioning); other
values are `os.SEEK_CUR` or `1` (seek relative to the current
position) and `os.SEEK_END` or `2` (seek relative to the file’s end).

#### Versionchanged
Changed in version 3.13: Return the new absolute position instead of `None`.

#### seekable()

Return whether the file supports seeking, and the return value is always `True`.

#### Versionadded
Added in version 3.13.

#### set_name(name,)

Annotate the memory mapping with the given *name* for easier identification
in `/proc/<pid>/maps` if the kernel supports the feature and [`-X dev`](../using/cmdline.md#cmdoption-X) is passed
to Python or if Python is built in [debug mode](../using/configure.md#debug-build).
The length of *name* must not exceed 67 bytes including the `'\0'` terminator.

[Availability](intro.md#availability): Linux >= 5.17 (kernel built with `CONFIG_ANON_VMA_NAME` option)

#### Versionadded
Added in version 3.15.

#### size()

Return the length of the file, which can be larger than the size of the
memory-mapped area.
For an anonymous mapping, return its size.

#### Versionchanged
Changed in version 3.15: Anonymous mappings are now supported on Unix.

#### tell()

Returns the current position of the file pointer.

#### write(bytes)

Write the bytes in *bytes* into memory at the current position of the
file pointer and return the number of bytes written (never less than
`len(bytes)`, since if the write fails, a [`ValueError`](exceptions.md#ValueError) will be
raised).  The file position is updated to point after the bytes that
were written.  If the mmap was created with `ACCESS_READ`, then
writing to it will raise a [`TypeError`](exceptions.md#TypeError) exception.

#### Versionchanged
Changed in version 3.5: Writable [bytes-like object](../glossary.md#term-bytes-like-object) is now accepted.

#### Versionchanged
Changed in version 3.6: The number of bytes written is now returned.

#### write_byte(byte)

Write the integer *byte* into memory at the current
position of the file pointer; the file position is advanced by `1`. If
the mmap was created with `ACCESS_READ`, then writing to it will
raise a [`TypeError`](exceptions.md#TypeError) exception.

<a id="madvise-constants"></a>

## MADV_\* Constants

### mmap.MADV_NORMAL

### mmap.MADV_RANDOM

### mmap.MADV_SEQUENTIAL

### mmap.MADV_WILLNEED

### mmap.MADV_DONTNEED

### mmap.MADV_REMOVE

### mmap.MADV_DONTFORK

### mmap.MADV_DOFORK

### mmap.MADV_HWPOISON

### mmap.MADV_MERGEABLE

### mmap.MADV_UNMERGEABLE

### mmap.MADV_SOFT_OFFLINE

### mmap.MADV_HUGEPAGE

### mmap.MADV_NOHUGEPAGE

### mmap.MADV_DONTDUMP

### mmap.MADV_DODUMP

### mmap.MADV_FREE

### mmap.MADV_NOSYNC

### mmap.MADV_AUTOSYNC

### mmap.MADV_NOCORE

### mmap.MADV_CORE

### mmap.MADV_PROTECT

### mmap.MADV_FREE_REUSABLE

### mmap.MADV_FREE_REUSE

These options can be passed to [`mmap.madvise()`](#mmap.mmap.madvise).  Not every option will
be present on every system.

Availability: Systems with the madvise() system call.

#### Versionadded
Added in version 3.8.

<a id="map-constants"></a>

## MAP_\* Constants

### mmap.MAP_SHARED

### mmap.MAP_PRIVATE

### mmap.MAP_32BIT

### mmap.MAP_ALIGNED_SUPER

### mmap.MAP_ANON

### mmap.MAP_ANONYMOUS

### mmap.MAP_CONCEAL

### mmap.MAP_DENYWRITE

### mmap.MAP_EXECUTABLE

### mmap.MAP_HASSEMAPHORE

### mmap.MAP_JIT

### mmap.MAP_NOCACHE

### mmap.MAP_NOEXTEND

### mmap.MAP_NORESERVE

### mmap.MAP_POPULATE

### mmap.MAP_RESILIENT_CODESIGN

### mmap.MAP_RESILIENT_MEDIA

### mmap.MAP_STACK

### mmap.MAP_TPRO

### mmap.MAP_TRANSLATED_ALLOW_EXECUTE

### mmap.MAP_UNIX03

These are the various flags that can be passed to [`mmap.mmap()`](#mmap.mmap).  [`MAP_ALIGNED_SUPER`](#mmap.MAP_ALIGNED_SUPER)
is only available at FreeBSD and [`MAP_CONCEAL`](#mmap.MAP_CONCEAL) is only available at OpenBSD.  Note
that some options might not be present on some systems.

#### Versionchanged
Changed in version 3.10: Added [`MAP_POPULATE`](#mmap.MAP_POPULATE) constant.

#### Versionadded
Added in version 3.11: Added [`MAP_STACK`](#mmap.MAP_STACK) constant.

#### Versionadded
Added in version 3.12: Added [`MAP_ALIGNED_SUPER`](#mmap.MAP_ALIGNED_SUPER) and [`MAP_CONCEAL`](#mmap.MAP_CONCEAL) constants.

#### Versionadded
Added in version 3.13: Added [`MAP_32BIT`](#mmap.MAP_32BIT), [`MAP_HASSEMAPHORE`](#mmap.MAP_HASSEMAPHORE), [`MAP_JIT`](#mmap.MAP_JIT),
[`MAP_NOCACHE`](#mmap.MAP_NOCACHE), [`MAP_NOEXTEND`](#mmap.MAP_NOEXTEND), [`MAP_NORESERVE`](#mmap.MAP_NORESERVE),
[`MAP_RESILIENT_CODESIGN`](#mmap.MAP_RESILIENT_CODESIGN), [`MAP_RESILIENT_MEDIA`](#mmap.MAP_RESILIENT_MEDIA),
[`MAP_TPRO`](#mmap.MAP_TPRO), [`MAP_TRANSLATED_ALLOW_EXECUTE`](#mmap.MAP_TRANSLATED_ALLOW_EXECUTE), and
[`MAP_UNIX03`](#mmap.MAP_UNIX03) constants.

<a id="ms-constants"></a>

## MS_\* Constants

### mmap.MS_SYNC

### mmap.MS_ASYNC

### mmap.MS_INVALIDATE

These flags control the synchronization behavior for [`mmap.flush()`](#mmap.mmap.flush):

* [`MS_SYNC`](#mmap.MS_SYNC) - Synchronous flush: writes are scheduled and the call
  blocks until they are physically written to storage.
* [`MS_ASYNC`](#mmap.MS_ASYNC) - Asynchronous flush: writes are scheduled but the call
  returns immediately without waiting for completion.
* [`MS_INVALIDATE`](#mmap.MS_INVALIDATE) - Invalidate cached data: invalidates other mappings
  of the same file so they can see the changes.

#### Versionadded
Added in version 3.15.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

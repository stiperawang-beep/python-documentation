# `tty` — Terminal control functions

**Source code:** [Lib/tty.py](https://github.com/python/cpython/tree/main/Lib/tty.py)

---

The `tty` module defines functions for putting the tty into cbreak and raw
modes.

[Availability](intro.md#availability): Unix.

Because it requires the [`termios`](termios.md#module-termios) module, it will work only on Unix.

The `tty` module defines the following functions:

### tty.cfmakeraw(mode)

Convert the tty attribute list *mode*, which is a list like the one returned
by [`termios.tcgetattr()`](termios.md#termios.tcgetattr), to that of a tty in raw mode.

#### Versionadded
Added in version 3.12.

### tty.cfmakecbreak(mode)

Convert the tty attribute list *mode*, which is a list like the one returned
by [`termios.tcgetattr()`](termios.md#termios.tcgetattr), to that of a tty in cbreak mode.

This clears the `ECHO` and `ICANON` local mode flags in *mode* as well
as setting the minimum input to 1 byte with no delay.

#### Versionadded
Added in version 3.12.

#### Versionchanged
Changed in version 3.12.2: The `ICRNL` flag is no longer cleared. This matches Linux and macOS
`stty cbreak` behavior and what [`setcbreak()`](#tty.setcbreak) historically did.

### tty.setraw(fd, when=termios.TCSAFLUSH)

Change the mode of the file descriptor *fd* to raw. If *when* is omitted, it
defaults to [`termios.TCSAFLUSH`](termios.md#termios.TCSAFLUSH), and is passed to
[`termios.tcsetattr()`](termios.md#termios.tcsetattr). The return value of [`termios.tcgetattr()`](termios.md#termios.tcgetattr)
is saved before setting *fd* to raw mode; this value is returned.

#### Versionchanged
Changed in version 3.12: The return value is now the original tty attributes, instead of `None`.

### tty.setcbreak(fd, when=termios.TCSAFLUSH)

Change the mode of file descriptor *fd* to cbreak. If *when* is omitted, it
defaults to [`termios.TCSAFLUSH`](termios.md#termios.TCSAFLUSH), and is passed to
[`termios.tcsetattr()`](termios.md#termios.tcsetattr). The return value of [`termios.tcgetattr()`](termios.md#termios.tcgetattr)
is saved before setting *fd* to cbreak mode; this value is returned.

This clears the `ECHO` and `ICANON` local mode flags as well as setting
the minimum input to 1 byte with no delay.

#### Versionchanged
Changed in version 3.12: The return value is now the original tty attributes, instead of `None`.

#### Versionchanged
Changed in version 3.12.2: The `ICRNL` flag is no longer cleared. This restores the behavior
of Python 3.11 and earlier as well as matching what Linux, macOS, & BSDs
describe in their `stty(1)` man pages regarding cbreak mode.

#### SEE ALSO
Module [`termios`](termios.md#module-termios)
: Low-level terminal control interface.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

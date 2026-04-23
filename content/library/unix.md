<a id="unix"></a>

# Unix-specific services

The modules described in this chapter provide interfaces to features that are
unique to the Unix operating system, or in some cases to some or many variants
of it.  Here’s an overview:

* [`shlex` — Simple lexical analysis](shlex.md)
  * [shlex Objects](shlex.md#shlex-objects)
  * [Parsing Rules](shlex.md#parsing-rules)
  * [Improved Compatibility with Shells](shlex.md#improved-compatibility-with-shells)
* [`posix` — The most common POSIX system calls](posix.md)
  * [Large File Support](posix.md#large-file-support)
  * [Notable Module Contents](posix.md#notable-module-contents)
* [`pwd` — The password database](pwd.md)
* [`grp` — The group database](grp.md)
* [`termios` — POSIX style tty control](termios.md)
  * [Example](termios.md#example)
* [`tty` — Terminal control functions](tty.md)
* [`pty` — Pseudo-terminal utilities](pty.md)
  * [Example](pty.md#example)
* [`fcntl` — The `fcntl` and `ioctl` system calls](fcntl.md)
* [`resource` — Resource usage information](resource.md)
  * [Resource Limits](resource.md#resource-limits)
  * [Resource Usage](resource.md#resource-usage)
* [`syslog` — Unix syslog library routines](syslog.md)
  * [Examples](syslog.md#examples)
    * [Simple example](syslog.md#simple-example)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

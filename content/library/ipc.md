<a id="ipc"></a>

# Networking and Interprocess Communication

The modules described in this chapter provide mechanisms for
networking and inter-processes communication.

Some modules only work for two processes that are on the same machine, e.g.
[`signal`](signal.md#module-signal) and [`mmap`](mmap.md#module-mmap).  Other modules support networking protocols
that two or more processes can use to communicate across machines.

The list of modules described in this chapter is:

* [`asyncio` — Asynchronous I/O](asyncio.md)
* [`socket` — Low-level networking interface](socket.md)
* [`ssl` — TLS/SSL wrapper for socket objects](ssl.md)
* [`select` — Waiting for I/O completion](select.md)
* [`selectors` — High-level I/O multiplexing](selectors.md)
* [`signal` — Set handlers for asynchronous events](signal.md)
* [`mmap` — Memory-mapped file support](mmap.md)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

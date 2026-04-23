<a id="superseded"></a>

# Superseded modules

The modules described in this chapter have been superseded by other modules
for most use cases, and are retained primarily to preserve backwards compatibility.

Modules may appear in this chapter because they only cover a limited subset of
a problem space, and a more generally applicable solution is available elsewhere
in the standard library (for example, [`getopt`](getopt.md#module-getopt) covers the very specific
task of “mimic the C `getopt()` API in Python”, rather than the broader
command line option parsing and argument parsing capabilities offered by
[`optparse`](optparse.md#module-optparse) and [`argparse`](argparse.md#module-argparse)).

Alternatively, modules may appear in this chapter because they are deprecated
outright, and awaiting removal in a future release, or they are
[soft deprecated](../glossary.md#term-soft-deprecated) and their use is actively discouraged in new projects.
With the removal of various obsolete modules through [**PEP 594**](https://peps.python.org/pep-0594/), there are
currently no modules in this latter category.

* [`getopt` — C-style parser for command line options](getopt.md)
* [`profile` — Pure Python profiler](profile.md)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

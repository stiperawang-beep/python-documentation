# `fnmatch` — Unix filename pattern matching

**Source code:** [Lib/fnmatch.py](https://github.com/python/cpython/tree/main/Lib/fnmatch.py)

<a id="index-0"></a>

<a id="index-1"></a>

---

This module provides support for Unix shell-style wildcards, which are *not* the
same as regular expressions (which are documented in the [`re`](re.md#module-re) module).  The
special characters used in shell-style wildcards are:

<a id="index-2"></a>

| Pattern   | Meaning                            |
|-----------|------------------------------------|
| `*`       | matches everything                 |
| `?`       | matches any single character       |
| `[seq]`   | matches any character in *seq*     |
| `[!seq]`  | matches any character not in *seq* |

For a literal match, wrap the meta-characters in brackets.
For example, `'[?]'` matches the character `'?'`.

<a id="index-3"></a>

Note that the filename separator (`'/'` on Unix) is *not* special to this
module.  See module [`glob`](glob.md#module-glob) for pathname expansion ([`glob`](glob.md#module-glob) uses
[`filter()`](#fnmatch.filter) to match pathname segments).  Similarly, filenames starting with
a period are not special for this module, and are matched by the `*` and `?`
patterns.

Unless stated otherwise, “filename string” and “pattern string” either refer to
[`str`](stdtypes.md#str) or `ISO-8859-1` encoded [`bytes`](stdtypes.md#bytes) objects. Note that the
functions documented below do not allow to mix a `bytes` pattern with
a `str` filename, and vice-versa.

Finally, note that [`functools.lru_cache()`](functools.md#functools.lru_cache) with a *maxsize* of 32768
is used to cache the (typed) compiled regex patterns in the following
functions: [`fnmatch()`](#module-fnmatch), [`fnmatchcase()`](#fnmatch.fnmatchcase), [`filter()`](#fnmatch.filter), [`filterfalse()`](#fnmatch.filterfalse).

### fnmatch.fnmatch(name, pat)

Test whether the filename string *name* matches the pattern string *pat*,
returning `True` or `False`.  Both parameters are case-normalized
using [`os.path.normcase()`](os.path.md#os.path.normcase). [`fnmatchcase()`](#fnmatch.fnmatchcase) can be used to perform a
case-sensitive comparison, regardless of whether that’s standard for the
operating system.

This example will print all file names in the current directory with the
extension `.txt`:

```python3
import fnmatch
import os

for file in os.listdir('.'):
    if fnmatch.fnmatch(file, '*.txt'):
        print(file)
```

### fnmatch.fnmatchcase(name, pat)

Test whether the filename string *name* matches the pattern string *pat*,
returning `True` or `False`;
the comparison is case-sensitive and does not apply [`os.path.normcase()`](os.path.md#os.path.normcase).

### fnmatch.filter(names, pat)

Construct a list from those elements of the [iterable](../glossary.md#term-iterable) of filename
strings *names* that match the pattern string *pat*.
It is the same as `[n for n in names if fnmatch(n, pat)]`,
but implemented more efficiently.

### fnmatch.filterfalse(names, pat)

Construct a list from those elements of the [iterable](../glossary.md#term-iterable) of filename
strings *names* that do not match the pattern string *pat*.
It is the same as `[n for n in names if not fnmatch(n, pat)]`,
but implemented more efficiently.

#### Versionadded
Added in version 3.14.

### fnmatch.translate(pat)

Return the shell-style pattern *pat* converted to a regular expression for
using with [`re.prefixmatch()`](re.md#re.prefixmatch). The pattern is expected to be a
[`str`](stdtypes.md#str).

Example:

```pycon
>>> import fnmatch, re
>>>
>>> regex = fnmatch.translate('*.txt')
>>> regex
'(?s:.*\\.txt)\\z'
>>> reobj = re.compile(regex)
>>> reobj.prefixmatch('foobar.txt')
<re.Match object; span=(0, 10), match='foobar.txt'>
```

#### SEE ALSO
Module [`glob`](glob.md#module-glob)
: Unix shell-style path expansion.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

# `keyword` — Testing for Python keywords

**Source code:** [Lib/keyword.py](https://github.com/python/cpython/tree/main/Lib/keyword.py)

---

This module allows a Python program to determine if a string is a
[keyword](../reference/lexical_analysis.md#keywords) or [soft keyword](../reference/lexical_analysis.md#soft-keywords).

### keyword.iskeyword(s)

Return `True` if *s* is a Python [keyword](../reference/lexical_analysis.md#keywords).

### keyword.kwlist

Sequence containing all the [keywords](../reference/lexical_analysis.md#keywords) defined for the
interpreter.  If any keywords are defined to only be active when particular
[`__future__`](__future__.md#module-__future__) statements are in effect, these will be included as well.

### keyword.issoftkeyword(s)

Return `True` if *s* is a Python [soft keyword](../reference/lexical_analysis.md#soft-keywords).

#### Versionadded
Added in version 3.9.

### keyword.softkwlist

Sequence containing all the [soft keywords](../reference/lexical_analysis.md#soft-keywords) defined for the
interpreter.  If any soft keywords are defined to only be active when particular
[`__future__`](__future__.md#module-__future__) statements are in effect, these will be included as well.

#### Versionadded
Added in version 3.9.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

# `html.entities` — Definitions of HTML general entities

**Source code:** [Lib/html/entities.py](https://github.com/python/cpython/tree/main/Lib/html/entities.py)

---

This module defines four dictionaries, [`html5`](#html.entities.html5),
[`name2codepoint`](#html.entities.name2codepoint), [`codepoint2name`](#html.entities.codepoint2name), and [`entitydefs`](#html.entities.entitydefs).

### html.entities.html5

A dictionary that maps HTML5 named character references <sup>[1](#id2)</sup> to the
equivalent Unicode character(s), e.g. `html5['gt;'] == '>'`.
Note that the trailing semicolon is included in the name (e.g. `'gt;'`),
however some of the names are accepted by the standard even without the
semicolon: in this case the name is present with and without the `';'`.
See also [`html.unescape()`](html.md#html.unescape).

#### Versionadded
Added in version 3.3.

### html.entities.entitydefs

A dictionary mapping XHTML 1.0 entity definitions to their replacement text in
ISO Latin-1.

### html.entities.name2codepoint

A dictionary that maps HTML4 entity names to the Unicode code points.

### html.entities.codepoint2name

A dictionary that maps Unicode code points to HTML4 entity names.

### Footnotes

* <a id='id2'>**[1]**</a> See [https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references](https://html.spec.whatwg.org/multipage/named-characters.html#named-character-references)
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

# Soft deprecations

There are no plans to remove [soft deprecated](../glossary.md#term-soft-deprecated) APIs.

* [`re.match()`](../library/re.md#re.match) and [`re.Pattern.match()`](../library/re.md#re.Pattern.match) are now
  [soft deprecated](../glossary.md#term-soft-deprecated) in favor of the new [`re.prefixmatch()`](../library/re.md#re.prefixmatch) and
  [`re.Pattern.prefixmatch()`](../library/re.md#re.Pattern.prefixmatch) APIs, which have been added as alternate,
  more explicit names. These are intended to be used to alleviate confusion
  around what *match* means by following the Zen of Python’s  *“Explicit is
  better than implicit”* mantra. Most other language regular expression
  libraries use an API named *match* to mean what Python has always called
  *search*.

  We **do not** plan to remove the older `match()` name, as it has been
  used in code for over 30 years. Code supporting older versions of Python
  should continue to use `match()`, while new code should prefer
  `prefixmatch()`. See [prefixmatch() vs. match()](../library/re.md#prefixmatch-vs-match).

  (Contributed by Gregory P. Smith in [gh-86519](https://github.com/python/cpython/issues/86519) and
  Hugo van Kemenade in [gh-148100](https://github.com/python/cpython/issues/148100).)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

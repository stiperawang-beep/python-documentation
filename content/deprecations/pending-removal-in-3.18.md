# Pending removal in Python 3.18

* No longer accept a boolean value when a file descriptor is expected.
  (Contributed by Serhiy Storchaka in [gh-82626](https://github.com/python/cpython/issues/82626).)
* [`decimal`](../library/decimal.md#module-decimal):
  * The non-standard and undocumented [`Decimal`](../library/decimal.md#decimal.Decimal) format
    specifier `'N'`, which is only supported in the `decimal` module’s
    C implementation, has been deprecated since Python 3.13.
    (Contributed by Serhiy Storchaka in [gh-89902](https://github.com/python/cpython/issues/89902).)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

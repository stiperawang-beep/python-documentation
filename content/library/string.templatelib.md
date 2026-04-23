# `string.templatelib` — Support for template string literals

**Source code:** [Lib/string/templatelib.py](https://github.com/python/cpython/tree/main/Lib/string/templatelib.py)

---

#### SEE ALSO
* [Format strings](../reference/lexical_analysis.md#f-strings)
* [Template string literal (t-string) syntax](../reference/lexical_analysis.md#t-strings)
* [**PEP 750**](https://peps.python.org/pep-0750/)

<a id="template-strings"></a>

## Template strings

#### Versionadded
Added in version 3.14.

Template strings are a mechanism for custom string processing.
They have the full flexibility of Python’s [f-strings](../reference/lexical_analysis.md#f-strings),
but return a [`Template`](#string.templatelib.Template) instance that gives access
to the static and interpolated (in curly brackets) parts of a string
*before* they are combined.

To write a t-string, use a `'t'` prefix instead of an `'f'`, like so:

```pycon
>>> pi = 3.14
>>> t't-strings are new in Python {pi!s}!'
Template(
   strings=('t-strings are new in Python ', '!'),
   interpolations=(Interpolation(3.14, 'pi', 's', ''),)
)
```

## Types

### *class* string.templatelib.Template

The `Template` class describes the contents of a template string.
It is immutable, meaning that attributes of a template cannot be reassigned.

The most common way to create a `Template` instance is to use the
[template string literal syntax](../reference/lexical_analysis.md#t-strings).
This syntax is identical to that of [f-strings](../reference/lexical_analysis.md#f-strings),
except that it uses a `t` prefix in place of an `f`:

```pycon
>>> cheese = 'Red Leicester'
>>> template = t"We're fresh out of {cheese}, sir."
>>> type(template)
<class 'string.templatelib.Template'>
```

Templates are stored as sequences of literal [`strings`](#string.templatelib.Template.strings)
and dynamic [`interpolations`](#string.templatelib.Template.interpolations).
A [`values`](#string.templatelib.Template.values) attribute holds the values of the interpolations:

```pycon
>>> cheese = 'Camembert'
>>> template = t'Ah! We do have {cheese}.'
>>> template.strings
('Ah! We do have ', '.')
>>> template.interpolations
(Interpolation('Camembert', ...),)
>>> template.values
('Camembert',)
```

The `strings` tuple has one more element than `interpolations`
and `values`; the interpolations “belong” between the strings.
This may be easier to understand when tuples are aligned

```python
template.strings:  ('Ah! We do have ',              '.')
template.values:   (                   'Camembert',    )
```

### Attributes

#### strings *: [tuple](stdtypes.md#tuple)[[str](stdtypes.md#str), ...]*

A [`tuple`](stdtypes.md#tuple) of the static strings in the template.

```pycon
>>> cheese = 'Camembert'
>>> template = t'Ah! We do have {cheese}.'
>>> template.strings
('Ah! We do have ', '.')
```

Empty strings *are* included in the tuple:

```pycon
>>> response = 'We do have '
>>> cheese = 'Camembert'
>>> template = t'Ah! {response}{cheese}.'
>>> template.strings
('Ah! ', '', '.')
```

The `strings` tuple is never empty, and always contains one more
string than the `interpolations` and `values` tuples:

```pycon
>>> t''.strings
('',)
>>> t''.values
()
>>> t'{'cheese'}'.strings
('', '')
>>> t'{'cheese'}'.values
('cheese',)
```

#### interpolations *: [tuple](stdtypes.md#tuple)[[Interpolation](#string.templatelib.Interpolation), ...]*

A [`tuple`](stdtypes.md#tuple) of the interpolations in the template.

```pycon
>>> cheese = 'Camembert'
>>> template = t'Ah! We do have {cheese}.'
>>> template.interpolations
(Interpolation('Camembert', 'cheese', None, ''),)
```

The `interpolations` tuple may be empty and always contains one fewer
values than the `strings` tuple:

```pycon
>>> t'Red Leicester'.interpolations
()
```

#### values *: [tuple](stdtypes.md#tuple)[[object](functions.md#object), ...]*

A tuple of all interpolated values in the template.

```pycon
>>> cheese = 'Camembert'
>>> template = t'Ah! We do have {cheese}.'
>>> template.values
('Camembert',)
```

The `values` tuple always has the same length as the
`interpolations` tuple. It is always equivalent to
`tuple(i.value for i in template.interpolations)`.

### Methods

#### \_\_new_\_(\*args: [str](stdtypes.md#str) | [Interpolation](#string.templatelib.Interpolation))

While literal syntax is the most common way to create a `Template`,
it is also possible to create them directly using the constructor:

```pycon
>>> from string.templatelib import Interpolation, Template
>>> cheese = 'Camembert'
>>> template = Template(
...     'Ah! We do have ', Interpolation(cheese, 'cheese'), '.'
... )
>>> list(template)
['Ah! We do have ', Interpolation('Camembert', 'cheese', None, ''), '.']
```

If multiple strings are passed consecutively, they will be concatenated
into a single value in the [`strings`](#string.templatelib.Template.strings) attribute. For example,
the following code creates a [`Template`](#string.templatelib.Template) with a single final string:

```pycon
>>> from string.templatelib import Template
>>> template = Template('Ah! We do have ', 'Camembert', '.')
>>> template.strings
('Ah! We do have Camembert.',)
```

If multiple interpolations are passed consecutively, they will be treated
as separate interpolations and an empty string will be inserted between them.
For example, the following code creates a template with empty placeholders
in the [`strings`](#string.templatelib.Template.strings) attribute:

```pycon
>>> from string.templatelib import Interpolation, Template
>>> template = Template(
...     Interpolation('Camembert', 'cheese'),
...     Interpolation('.', 'punctuation'),
... )
>>> template.strings
('', '', '')
```

### iter(template)

Iterate over the template, yielding each non-empty string and
[`Interpolation`](#string.templatelib.Interpolation) in the correct order:

```pycon
>>> cheese = 'Camembert'
>>> list(t'Ah! We do have {cheese}.')
['Ah! We do have ', Interpolation('Camembert', 'cheese', None, ''), '.']
```

### template + other

### template += other

Concatenate this template with another, returning a new
`Template` instance:

```pycon
>>> cheese = 'Camembert'
>>> list(t'Ah! ' + t'We do have {cheese}.')
['Ah! We do have ', Interpolation('Camembert', 'cheese', None, ''), '.']
```

Concatenating a `Template` and a `str` is **not** supported.
This is because it is unclear whether the string should be treated as
a static string or an interpolation.
If you want to concatenate a `Template` with a string,
you should either wrap the string directly in a `Template`
(to treat it as a static string)
or use an `Interpolation` (to treat it as dynamic):

```pycon
>>> from string.templatelib import Interpolation, Template
>>> template = t'Ah! '
>>> # Treat 'We do have ' as a static string
>>> template += Template('We do have ')
>>> # Treat cheese as an interpolation
>>> cheese = 'Camembert'
>>> template += Template(Interpolation(cheese, 'cheese'))
>>> list(template)
['Ah! We do have ', Interpolation('Camembert', 'cheese', None, '')]
```

### *class* string.templatelib.Interpolation

The `Interpolation` type represents an expression inside a template string.
It is immutable, meaning that attributes of an interpolation cannot be reassigned.

Interpolations support pattern matching, allowing you to match against
their attributes with the [match statement](../reference/compound_stmts.md#match):

```pycon
>>> from string.templatelib import Interpolation
>>> interpolation = t'{1. + 2.:.2f}'.interpolations[0]
>>> interpolation
Interpolation(3.0, '1. + 2.', None, '.2f')
>>> match interpolation:
...     case Interpolation(value, expression, conversion, format_spec):
...         print(value, expression, conversion, format_spec, sep=' | ')
...
3.0 | 1. + 2. | None | .2f
```

### Attributes

#### value *: [object](functions.md#object)*

The evaluated value of the interpolation.

```pycon
>>> t'{1 + 2}'.interpolations[0].value
3
```

#### expression *: [str](stdtypes.md#str)*

For interpolations created by t-string literals, `expression`
is the expression text found inside the curly brackets (`{` & `}`),
including any whitespace, excluding the curly brackets themselves,
and ending before the first `!`, `:`, or `=` if any is present.
For manually created interpolations, `expression` is the arbitrary
string provided when constructing the interpolation instance.

We recommend using valid Python expressions or the empty string for the
`expression` field of manually created `Interpolation`
instances, although this is not enforced at runtime.

```pycon
>>> t'{1 + 2}'.interpolations[0].expression
'1 + 2'
```

#### conversion *: [Literal](typing.md#typing.Literal)['a', 'r', 's'] | [None](constants.md#None)*

The conversion to apply to the value, or `None`.

The `conversion` is the optional conversion to apply
to the value:

```pycon
>>> t'{1 + 2!a}'.interpolations[0].conversion
'a'
```

#### NOTE
Unlike f-strings, where conversions are applied automatically,
the expected behavior with t-strings is that code that *processes* the
`Template` will decide how to interpret and whether to apply
the `conversion`.
For convenience, the [`convert()`](#string.templatelib.convert) function can be used to mimic
f-string conversion semantics.

#### format_spec *: [str](stdtypes.md#str)*

The format specification to apply to the value.

The `format_spec` is an optional, arbitrary string
used as the format specification to present the value:

```pycon
>>> t'{1 + 2:.2f}'.interpolations[0].format_spec
'.2f'
```

#### NOTE
Unlike f-strings, where format specifications are applied automatically
via the [`format()`](functions.md#format) protocol, the expected behavior with
t-strings is that code that *processes* the interpolation will
decide how to interpret and whether to apply the format specification.
As a result, `format_spec` values in interpolations
can be arbitrary strings,
including those that do not conform to the [`format()`](functions.md#format) protocol.

### Methods

#### \_\_new_\_(value: [object](functions.md#object), expression: [str](stdtypes.md#str), conversion: [Literal](typing.md#typing.Literal)['a', 'r', 's'] | [None](constants.md#None) = None, format_spec: [str](stdtypes.md#str) = '')

Create a new `Interpolation` object from component parts.

* **Parameters:**
  * **value** – The evaluated, in-scope result of the interpolation.
  * **expression** – The text of a valid Python expression,
    or an empty string.
  * **conversion** – The [conversion](string.md#formatstrings) to be used,
    one of `None`, `'a'`, `'r'`, or `'s'`.
  * **format_spec** – An optional, arbitrary string used as the
    [format specification](string.md#formatspec) to present the value.

## Helper functions

### string.templatelib.convert(obj, , conversion)

Applies formatted string literal [conversion](string.md#formatstrings-conversion)
semantics to the given object *obj*.
This is frequently useful for custom template string processing logic.

Three conversion flags are currently supported:

* `'s'` which calls [`str()`](stdtypes.md#str) on the value (like `!s`),
* `'r'` which calls [`repr()`](functions.md#repr) (like `!r`), and
* `'a'` which calls [`ascii()`](functions.md#ascii) (like `!a`).

If the conversion flag is `None`, *obj* is returned unchanged.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

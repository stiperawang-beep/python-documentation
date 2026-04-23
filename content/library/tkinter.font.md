# `tkinter.font` — Tkinter font wrapper

**Source code:** [Lib/tkinter/font.py](https://github.com/python/cpython/tree/main/Lib/tkinter/font.py)

---

The `tkinter.font` module provides the [`Font`](#tkinter.font.Font) class for creating
and using named fonts.

The different font weights and slants are:

### tkinter.font.NORMAL

### tkinter.font.BOLD

### tkinter.font.ITALIC

### tkinter.font.ROMAN

### *class* tkinter.font.Font(root=None, font=None, name=None, exists=False, \*\*options)

The [`Font`](#tkinter.font.Font) class represents a named font. *Font* instances are given
unique names and can be specified by their family, size, and style
configuration. Named fonts are Tk’s method of creating and identifying
fonts as a single object, rather than specifying a font by its attributes
with each occurrence.

> arguments:

> > *font* - font specifier tuple (family, size, options)
> > <br/>
> > *name* - unique font name
> > <br/>
> > *exists* - self points to existing named font if true
> > <br/>

> additional keyword options (ignored if *font* is specified):

> > *family* - font family i.e. Courier, Times
> > <br/>
> > *size* - font size
> > <br/>
> > If *size* is positive it is interpreted as size in points.
> > <br/>
> > If *size* is a negative number its absolute value is treated
> > <br/>
> > as size in pixels.
> > <br/>
> > *weight* - font emphasis (NORMAL, BOLD)
> > <br/>
> > *slant* - ROMAN, ITALIC
> > <br/>
> > *underline* - font underlining (0 - none, 1 - underline)
> > <br/>
> > *overstrike* - font strikeout (0 - none, 1 - strikeout)
> > <br/>

#### actual(option=None, displayof=None)

Return the attributes of the font.

#### cget(option)

Retrieve an attribute of the font.

#### config(\*\*options)

Modify attributes of the font.

#### copy()

Return new instance of the current font.

#### measure(text, displayof=None)

Return amount of space the text would occupy on the specified display
when formatted in the current font. If no display is specified then the
main application window is assumed.

#### metrics(\*options, \*\*kw)

Return font-specific data.
Options include:

*ascent* - distance between baseline and highest point that a
: character of the font can occupy

*descent* - distance between baseline and lowest point that a
: character of the font can occupy

*linespace* - minimum vertical separation necessary between any two
: characters of the font that ensures no vertical overlap between lines.

*fixed* - 1 if font is fixed-width else 0

### tkinter.font.families(root=None, displayof=None)

Return the different font families.

### tkinter.font.names(root=None)

Return the names of defined fonts.

### tkinter.font.nametofont(name, root=None)

Return a [`Font`](#tkinter.font.Font) representation of a tk named font.

#### Versionchanged
Changed in version 3.10: The *root* parameter was added.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

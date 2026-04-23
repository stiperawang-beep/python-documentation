# `tkinter.colorchooser` — Color choosing dialog

**Source code:** [Lib/tkinter/colorchooser.py](https://github.com/python/cpython/tree/main/Lib/tkinter/colorchooser.py)

---

The `tkinter.colorchooser` module provides the [`Chooser`](#tkinter.colorchooser.Chooser) class
as an interface to the native color picker dialog. `Chooser` implements
a modal color choosing dialog window. The `Chooser` class inherits from
the [`Dialog`](dialog.md#tkinter.commondialog.Dialog) class.

### *class* tkinter.colorchooser.Chooser(master=None, \*\*options)

### tkinter.colorchooser.askcolor(color=None, \*\*options)

Create a color choosing dialog. A call to this method will show the window,
wait for the user to make a selection, and return the selected color (or
`None`) to the caller.

#### SEE ALSO
Module [`tkinter.commondialog`](dialog.md#module-tkinter.commondialog)
: Tkinter standard dialog module

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

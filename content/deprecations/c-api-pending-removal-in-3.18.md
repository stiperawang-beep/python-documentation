# Pending removal in Python 3.18

* The following private functions are deprecated
  and planned for removal in Python 3.18:
  * `_PyBytes_Join()`: use [`PyBytes_Join()`](../c-api/bytes.md#c.PyBytes_Join).
  * `_PyDict_GetItemStringWithError()`: use [`PyDict_GetItemStringRef()`](../c-api/dict.md#c.PyDict_GetItemStringRef).
  * `_PyDict_Pop()`: use [`PyDict_Pop()`](../c-api/dict.md#c.PyDict_Pop).
  * `_PyLong_Sign()`: use [`PyLong_GetSign()`](../c-api/long.md#c.PyLong_GetSign).
  * `_PyLong_FromDigits()` and `_PyLong_New()`:
    use [`PyLongWriter_Create()`](../c-api/long.md#c.PyLongWriter_Create).
  * `_PyThreadState_UncheckedGet()`: use [`PyThreadState_GetUnchecked()`](../c-api/threads.md#c.PyThreadState_GetUnchecked).
  * `_PyUnicode_AsString()`: use [`PyUnicode_AsUTF8()`](../c-api/unicode.md#c.PyUnicode_AsUTF8).
  * `_PyUnicodeWriter_Init()`:
    replace `_PyUnicodeWriter_Init(&writer)` with
    [`writer = PyUnicodeWriter_Create(0)`](../c-api/unicode.md#c.PyUnicodeWriter_Create).
  * `_PyUnicodeWriter_Finish()`:
    replace `_PyUnicodeWriter_Finish(&writer)` with
    [`PyUnicodeWriter_Finish(writer)`](../c-api/unicode.md#c.PyUnicodeWriter_Finish).
  * `_PyUnicodeWriter_Dealloc()`:
    replace `_PyUnicodeWriter_Dealloc(&writer)` with
    [`PyUnicodeWriter_Discard(writer)`](../c-api/unicode.md#c.PyUnicodeWriter_Discard).
  * `_PyUnicodeWriter_WriteChar()`:
    replace `_PyUnicodeWriter_WriteChar(&writer, ch)` with
    [`PyUnicodeWriter_WriteChar(writer, ch)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteChar).
  * `_PyUnicodeWriter_WriteStr()`:
    replace `_PyUnicodeWriter_WriteStr(&writer, str)` with
    [`PyUnicodeWriter_WriteStr(writer, str)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteStr).
  * `_PyUnicodeWriter_WriteSubstring()`:
    replace `_PyUnicodeWriter_WriteSubstring(&writer, str, start, end)` with
    [`PyUnicodeWriter_WriteSubstring(writer, str, start, end)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteSubstring).
  * `_PyUnicodeWriter_WriteASCIIString()`:
    replace `_PyUnicodeWriter_WriteASCIIString(&writer, str)` with
    [`PyUnicodeWriter_WriteASCII(writer, str)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteASCII).
  * `_PyUnicodeWriter_WriteLatin1String()`:
    replace `_PyUnicodeWriter_WriteLatin1String(&writer, str)` with
    [`PyUnicodeWriter_WriteUTF8(writer, str)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteUTF8).
  * `_PyUnicodeWriter_Prepare()`: (no replacement).
  * `_PyUnicodeWriter_PrepareKind()`: (no replacement).
  * `_Py_HashPointer()`: use [`Py_HashPointer()`](../c-api/hash.md#c.Py_HashPointer).
  * `_Py_fopen_obj()`: use [`Py_fopen()`](../c-api/sys.md#c.Py_fopen).

  The [pythoncapi-compat project](https://github.com/python/pythoncapi-compat/) can be used to get
  these new public functions on Python 3.13 and older.
  (Contributed by Victor Stinner in [gh-128863](https://github.com/python/cpython/issues/128863).)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

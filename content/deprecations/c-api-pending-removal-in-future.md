# Pending removal in future versions

The following APIs are deprecated and will be removed,
although there is currently no date scheduled for their removal.

* [`Py_TPFLAGS_HAVE_FINALIZE`](../c-api/typeobj.md#c.Py_TPFLAGS_HAVE_FINALIZE):
  Unneeded since Python 3.8.
* [`PyErr_Fetch()`](../c-api/exceptions.md#c.PyErr_Fetch):
  Use [`PyErr_GetRaisedException()`](../c-api/exceptions.md#c.PyErr_GetRaisedException) instead.
* [`PyErr_NormalizeException()`](../c-api/exceptions.md#c.PyErr_NormalizeException):
  Use [`PyErr_GetRaisedException()`](../c-api/exceptions.md#c.PyErr_GetRaisedException) instead.
* [`PyErr_Restore()`](../c-api/exceptions.md#c.PyErr_Restore):
  Use [`PyErr_SetRaisedException()`](../c-api/exceptions.md#c.PyErr_SetRaisedException) instead.
* [`PyModule_GetFilename()`](../c-api/module.md#c.PyModule_GetFilename):
  Use [`PyModule_GetFilenameObject()`](../c-api/module.md#c.PyModule_GetFilenameObject) instead.
* [`PyOS_AfterFork()`](../c-api/sys.md#c.PyOS_AfterFork):
  Use [`PyOS_AfterFork_Child()`](../c-api/sys.md#c.PyOS_AfterFork_Child) instead.
* [`PySlice_GetIndicesEx()`](../c-api/slice.md#c.PySlice_GetIndicesEx):
  Use [`PySlice_Unpack()`](../c-api/slice.md#c.PySlice_Unpack) and [`PySlice_AdjustIndices()`](../c-api/slice.md#c.PySlice_AdjustIndices) instead.
* [`PyUnicode_READY()`](../c-api/unicode.md#c.PyUnicode_READY):
  Unneeded since Python 3.12
* `PyErr_Display()`:
  Use [`PyErr_DisplayException()`](../c-api/exceptions.md#c.PyErr_DisplayException) instead.
* `_PyErr_ChainExceptions()`:
  Use `_PyErr_ChainExceptions1()` instead.
* `PyBytesObject.ob_shash` member:
  call [`PyObject_Hash()`](../c-api/object.md#c.PyObject_Hash) instead.
* Thread Local Storage (TLS) API:
  * [`PyThread_create_key()`](../c-api/tls.md#c.PyThread_create_key):
    Use [`PyThread_tss_alloc()`](../c-api/tls.md#c.PyThread_tss_alloc) instead.
  * [`PyThread_delete_key()`](../c-api/tls.md#c.PyThread_delete_key):
    Use [`PyThread_tss_free()`](../c-api/tls.md#c.PyThread_tss_free) instead.
  * [`PyThread_set_key_value()`](../c-api/tls.md#c.PyThread_set_key_value):
    Use [`PyThread_tss_set()`](../c-api/tls.md#c.PyThread_tss_set) instead.
  * [`PyThread_get_key_value()`](../c-api/tls.md#c.PyThread_get_key_value):
    Use [`PyThread_tss_get()`](../c-api/tls.md#c.PyThread_tss_get) instead.
  * [`PyThread_delete_key_value()`](../c-api/tls.md#c.PyThread_delete_key_value):
    Use [`PyThread_tss_delete()`](../c-api/tls.md#c.PyThread_tss_delete) instead.
  * [`PyThread_ReInitTLS()`](../c-api/tls.md#c.PyThread_ReInitTLS):
    Unneeded since Python 3.7.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

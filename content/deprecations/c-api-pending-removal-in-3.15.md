# Pending removal in Python 3.15

* The `PyImport_ImportModuleNoBlock()`:
  Use [`PyImport_ImportModule()`](../c-api/import.md#c.PyImport_ImportModule) instead.
* `PyWeakref_GetObject()` and `PyWeakref_GET_OBJECT()`:
  Use [`PyWeakref_GetRef()`](../c-api/weakref.md#c.PyWeakref_GetRef) instead. The [pythoncapi-compat project](https://github.com/python/pythoncapi-compat/) can be used to get
  [`PyWeakref_GetRef()`](../c-api/weakref.md#c.PyWeakref_GetRef) on Python 3.12 and older.
* `PyUnicode_AsDecodedObject()`:
  Use [`PyCodec_Decode()`](../c-api/codec.md#c.PyCodec_Decode) instead.
* `PyUnicode_AsDecodedUnicode()`:
  Use [`PyCodec_Decode()`](../c-api/codec.md#c.PyCodec_Decode) instead; Note that some codecs (for example, “base64”)
  may return a type other than [`str`](../library/stdtypes.md#str), such as [`bytes`](../library/stdtypes.md#bytes).
* `PyUnicode_AsEncodedObject()`:
  Use [`PyCodec_Encode()`](../c-api/codec.md#c.PyCodec_Encode) instead.
* `PyUnicode_AsEncodedUnicode()`:
  Use [`PyCodec_Encode()`](../c-api/codec.md#c.PyCodec_Encode) instead; Note that some codecs (for example, “base64”)
  may return a type other than [`bytes`](../library/stdtypes.md#bytes), such as [`str`](../library/stdtypes.md#str).
* Python initialization functions, deprecated in Python 3.13:
  * `Py_GetPath()`:
    Use [`PyConfig_Get("module_search_paths")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.path`](../library/sys.md#sys.path)) instead.
  * `Py_GetPrefix()`:
    Use [`PyConfig_Get("base_prefix")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.base_prefix`](../library/sys.md#sys.base_prefix)) instead. Use [`PyConfig_Get("prefix")`](../c-api/init_config.md#c.PyConfig_Get) ([`sys.prefix`](../library/sys.md#sys.prefix)) if [virtual environments](../library/venv.md#venv-def) need to be handled.
  * `Py_GetExecPrefix()`:
    Use [`PyConfig_Get("base_exec_prefix")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.base_exec_prefix`](../library/sys.md#sys.base_exec_prefix)) instead. Use
    [`PyConfig_Get("exec_prefix")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.exec_prefix`](../library/sys.md#sys.exec_prefix)) if [virtual environments](../library/venv.md#venv-def) need to
    be handled.
  * `Py_GetProgramFullPath()`:
    Use [`PyConfig_Get("executable")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.executable`](../library/sys.md#sys.executable)) instead.
  * `Py_GetProgramName()`:
    Use [`PyConfig_Get("executable")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.executable`](../library/sys.md#sys.executable)) instead.
  * `Py_GetPythonHome()`:
    Use [`PyConfig_Get("home")`](../c-api/init_config.md#c.PyConfig_Get) or the
    [`PYTHONHOME`](../using/cmdline.md#envvar-PYTHONHOME) environment variable instead.

  The [pythoncapi-compat project](https://github.com/python/pythoncapi-compat/) can be used to get
  [`PyConfig_Get()`](../c-api/init_config.md#c.PyConfig_Get) on Python 3.13 and older.
* Functions to configure Python’s initialization, deprecated in Python 3.11:
  * `PySys_SetArgvEx()`:
    Set [`PyConfig.argv`](../c-api/init_config.md#c.PyConfig.argv) instead.
  * `PySys_SetArgv()`:
    Set [`PyConfig.argv`](../c-api/init_config.md#c.PyConfig.argv) instead.
  * `Py_SetProgramName()`:
    Set [`PyConfig.program_name`](../c-api/init_config.md#c.PyConfig.program_name) instead.
  * `Py_SetPythonHome()`:
    Set [`PyConfig.home`](../c-api/init_config.md#c.PyConfig.home) instead.
  * `PySys_ResetWarnOptions()`:
    Clear [`sys.warnoptions`](../library/sys.md#sys.warnoptions) and `warnings.filters` instead.

  The [`Py_InitializeFromConfig()`](../c-api/interp-lifecycle.md#c.Py_InitializeFromConfig) API should be used with
  [`PyConfig`](../c-api/init_config.md#c.PyConfig) instead.
* Global configuration variables:
  * [`Py_DebugFlag`](../c-api/interp-lifecycle.md#c.Py_DebugFlag):
    Use [`PyConfig.parser_debug`](../c-api/init_config.md#c.PyConfig.parser_debug) or
    [`PyConfig_Get("parser_debug")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_VerboseFlag`](../c-api/interp-lifecycle.md#c.Py_VerboseFlag):
    Use [`PyConfig.verbose`](../c-api/init_config.md#c.PyConfig.verbose) or
    [`PyConfig_Get("verbose")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_QuietFlag`](../c-api/interp-lifecycle.md#c.Py_QuietFlag):
    Use [`PyConfig.quiet`](../c-api/init_config.md#c.PyConfig.quiet) or
    [`PyConfig_Get("quiet")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_InteractiveFlag`](../c-api/interp-lifecycle.md#c.Py_InteractiveFlag):
    Use [`PyConfig.interactive`](../c-api/init_config.md#c.PyConfig.interactive) or
    [`PyConfig_Get("interactive")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_InspectFlag`](../c-api/interp-lifecycle.md#c.Py_InspectFlag):
    Use [`PyConfig.inspect`](../c-api/init_config.md#c.PyConfig.inspect) or
    [`PyConfig_Get("inspect")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_OptimizeFlag`](../c-api/interp-lifecycle.md#c.Py_OptimizeFlag):
    Use [`PyConfig.optimization_level`](../c-api/init_config.md#c.PyConfig.optimization_level) or
    [`PyConfig_Get("optimization_level")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_NoSiteFlag`](../c-api/interp-lifecycle.md#c.Py_NoSiteFlag):
    Use [`PyConfig.site_import`](../c-api/init_config.md#c.PyConfig.site_import) or
    [`PyConfig_Get("site_import")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_BytesWarningFlag`](../c-api/interp-lifecycle.md#c.Py_BytesWarningFlag):
    Use [`PyConfig.bytes_warning`](../c-api/init_config.md#c.PyConfig.bytes_warning) or
    [`PyConfig_Get("bytes_warning")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_FrozenFlag`](../c-api/interp-lifecycle.md#c.Py_FrozenFlag):
    Use [`PyConfig.pathconfig_warnings`](../c-api/init_config.md#c.PyConfig.pathconfig_warnings) or
    [`PyConfig_Get("pathconfig_warnings")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_IgnoreEnvironmentFlag`](../c-api/interp-lifecycle.md#c.Py_IgnoreEnvironmentFlag):
    Use [`PyConfig.use_environment`](../c-api/init_config.md#c.PyConfig.use_environment) or
    [`PyConfig_Get("use_environment")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_DontWriteBytecodeFlag`](../c-api/interp-lifecycle.md#c.Py_DontWriteBytecodeFlag):
    Use [`PyConfig.write_bytecode`](../c-api/init_config.md#c.PyConfig.write_bytecode) or
    [`PyConfig_Get("write_bytecode")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_NoUserSiteDirectory`](../c-api/interp-lifecycle.md#c.Py_NoUserSiteDirectory):
    Use [`PyConfig.user_site_directory`](../c-api/init_config.md#c.PyConfig.user_site_directory) or
    [`PyConfig_Get("user_site_directory")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_UnbufferedStdioFlag`](../c-api/interp-lifecycle.md#c.Py_UnbufferedStdioFlag):
    Use [`PyConfig.buffered_stdio`](../c-api/init_config.md#c.PyConfig.buffered_stdio) or
    [`PyConfig_Get("buffered_stdio")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_HashRandomizationFlag`](../c-api/interp-lifecycle.md#c.Py_HashRandomizationFlag):
    Use [`PyConfig.use_hash_seed`](../c-api/init_config.md#c.PyConfig.use_hash_seed)
    and [`PyConfig.hash_seed`](../c-api/init_config.md#c.PyConfig.hash_seed) or
    [`PyConfig_Get("hash_seed")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_IsolatedFlag`](../c-api/interp-lifecycle.md#c.Py_IsolatedFlag):
    Use [`PyConfig.isolated`](../c-api/init_config.md#c.PyConfig.isolated) or
    [`PyConfig_Get("isolated")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_LegacyWindowsFSEncodingFlag`](../c-api/interp-lifecycle.md#c.Py_LegacyWindowsFSEncodingFlag):
    Use [`PyPreConfig.legacy_windows_fs_encoding`](../c-api/init_config.md#c.PyPreConfig.legacy_windows_fs_encoding) or
    [`PyConfig_Get("legacy_windows_fs_encoding")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_LegacyWindowsStdioFlag`](../c-api/interp-lifecycle.md#c.Py_LegacyWindowsStdioFlag):
    Use [`PyConfig.legacy_windows_stdio`](../c-api/init_config.md#c.PyConfig.legacy_windows_stdio) or
    [`PyConfig_Get("legacy_windows_stdio")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * `Py_FileSystemDefaultEncoding`, `Py_HasFileSystemDefaultEncoding`:
    Use [`PyConfig.filesystem_encoding`](../c-api/init_config.md#c.PyConfig.filesystem_encoding) or
    [`PyConfig_Get("filesystem_encoding")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * `Py_FileSystemDefaultEncodeErrors`:
    Use [`PyConfig.filesystem_errors`](../c-api/init_config.md#c.PyConfig.filesystem_errors) or
    [`PyConfig_Get("filesystem_errors")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * `Py_UTF8Mode`:
    Use [`PyPreConfig.utf8_mode`](../c-api/init_config.md#c.PyPreConfig.utf8_mode) or
    [`PyConfig_Get("utf8_mode")`](../c-api/init_config.md#c.PyConfig_Get) instead.
    (see [`Py_PreInitialize()`](../c-api/init_config.md#c.Py_PreInitialize))

  The [`Py_InitializeFromConfig()`](../c-api/interp-lifecycle.md#c.Py_InitializeFromConfig) API should be used with
  [`PyConfig`](../c-api/init_config.md#c.PyConfig) to set these options. Or [`PyConfig_Get()`](../c-api/init_config.md#c.PyConfig_Get) can be
  used to get these options at runtime.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

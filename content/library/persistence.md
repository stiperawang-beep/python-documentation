<a id="persistence"></a>

# Data Persistence

The modules described in this chapter support storing Python data in a
persistent form on disk.  The [`pickle`](pickle.md#module-pickle) and [`marshal`](marshal.md#module-marshal) modules can turn
many Python data types into a stream of bytes and then recreate the objects from
the bytes.  The various DBM-related modules support a family of hash-based file
formats that store a mapping of strings to other strings.

The list of modules described in this chapter is:

* [`pickle` — Python object serialization](pickle.md)
  * [Relationship to other Python modules](pickle.md#relationship-to-other-python-modules)
    * [Comparison with `marshal`](pickle.md#comparison-with-marshal)
    * [Comparison with `json`](pickle.md#comparison-with-json)
  * [Data stream format](pickle.md#data-stream-format)
  * [Module Interface](pickle.md#module-interface)
  * [What can be pickled and unpickled?](pickle.md#what-can-be-pickled-and-unpickled)
  * [Pickling Class Instances](pickle.md#pickling-class-instances)
    * [Persistence of External Objects](pickle.md#persistence-of-external-objects)
    * [Dispatch Tables](pickle.md#dispatch-tables)
    * [Handling Stateful Objects](pickle.md#handling-stateful-objects)
  * [Custom Reduction for Types, Functions, and Other Objects](pickle.md#custom-reduction-for-types-functions-and-other-objects)
  * [Out-of-band Buffers](pickle.md#out-of-band-buffers)
    * [Provider API](pickle.md#provider-api)
    * [Consumer API](pickle.md#consumer-api)
    * [Example](pickle.md#example)
  * [Restricting Globals](pickle.md#restricting-globals)
  * [Performance](pickle.md#performance)
  * [Examples](pickle.md#examples)
  * [Command-line interface](pickle.md#command-line-interface)
* [`copyreg` — Register `pickle` support functions](copyreg.md)
  * [Example](copyreg.md#example)
* [`shelve` — Python object persistence](shelve.md)
  * [Restrictions](shelve.md#restrictions)
  * [Example](shelve.md#example)
  * [Exceptions](shelve.md#exceptions)
* [`marshal` — Internal Python object serialization](marshal.md)
* [`dbm` — Interfaces to Unix “databases”](dbm.md)
  * [`dbm.sqlite3` — SQLite backend for dbm](dbm.md#module-dbm.sqlite3)
  * [`dbm.gnu` — GNU database manager](dbm.md#module-dbm.gnu)
  * [`dbm.ndbm` — New Database Manager](dbm.md#module-dbm.ndbm)
  * [`dbm.dumb` — Portable DBM implementation](dbm.md#module-dbm.dumb)
* [`sqlite3` — DB-API 2.0 interface for SQLite databases](sqlite3.md)
  * [Tutorial](sqlite3.md#tutorial)
  * [Reference](sqlite3.md#reference)
    * [Module functions](sqlite3.md#module-functions)
    * [Module constants](sqlite3.md#module-constants)
    * [Connection objects](sqlite3.md#connection-objects)
    * [Cursor objects](sqlite3.md#cursor-objects)
    * [Row objects](sqlite3.md#row-objects)
    * [Blob objects](sqlite3.md#blob-objects)
    * [PrepareProtocol objects](sqlite3.md#prepareprotocol-objects)
    * [Exceptions](sqlite3.md#exceptions)
    * [SQLite and Python types](sqlite3.md#sqlite-and-python-types)
    * [Default adapters and converters (deprecated)](sqlite3.md#default-adapters-and-converters-deprecated)
    * [Command-line interface](sqlite3.md#command-line-interface)
  * [How-to guides](sqlite3.md#how-to-guides)
    * [How to use placeholders to bind values in SQL queries](sqlite3.md#how-to-use-placeholders-to-bind-values-in-sql-queries)
    * [How to adapt custom Python types to SQLite values](sqlite3.md#how-to-adapt-custom-python-types-to-sqlite-values)
      * [How to write adaptable objects](sqlite3.md#how-to-write-adaptable-objects)
      * [How to register adapter callables](sqlite3.md#how-to-register-adapter-callables)
    * [How to convert SQLite values to custom Python types](sqlite3.md#how-to-convert-sqlite-values-to-custom-python-types)
    * [Adapter and converter recipes](sqlite3.md#adapter-and-converter-recipes)
    * [How to use connection shortcut methods](sqlite3.md#how-to-use-connection-shortcut-methods)
    * [How to use the connection context manager](sqlite3.md#how-to-use-the-connection-context-manager)
    * [How to work with SQLite URIs](sqlite3.md#how-to-work-with-sqlite-uris)
    * [How to create and use row factories](sqlite3.md#how-to-create-and-use-row-factories)
    * [How to handle non-UTF-8 text encodings](sqlite3.md#how-to-handle-non-utf-8-text-encodings)
  * [Explanation](sqlite3.md#explanation)
    * [Transaction control](sqlite3.md#transaction-control)
      * [Transaction control via the `autocommit` attribute](sqlite3.md#transaction-control-via-the-autocommit-attribute)
      * [Transaction control via the `isolation_level` attribute](sqlite3.md#transaction-control-via-the-isolation-level-attribute)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

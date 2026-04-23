<a id="modules"></a>

# Importing Modules

The modules described in this chapter provide new ways to import other Python
modules and hooks for customizing the import process.

The full list of modules described in this chapter is:

* [`zipimport` — Import modules from Zip archives](zipimport.md)
  * [zipimporter Objects](zipimport.md#zipimporter-objects)
  * [Examples](zipimport.md#examples)
* [`pkgutil` — Package extension utility](pkgutil.md)
* [`modulefinder` — Find modules used by a script](modulefinder.md)
  * [Example usage of `ModuleFinder`](modulefinder.md#example-usage-of-modulefinder)
* [`runpy` — Locating and executing Python modules](runpy.md)
* [`importlib` — The implementation of `import`](importlib.md)
  * [Introduction](importlib.md#introduction)
  * [Functions](importlib.md#functions)
  * [`importlib.abc` – Abstract base classes related to import](importlib.md#module-importlib.abc)
  * [`importlib.machinery` – Importers and path hooks](importlib.md#module-importlib.machinery)
  * [`importlib.util` – Utility code for importers](importlib.md#module-importlib.util)
  * [Examples](importlib.md#examples)
    * [Importing programmatically](importlib.md#importing-programmatically)
    * [Checking if a module can be imported](importlib.md#checking-if-a-module-can-be-imported)
    * [Importing a source file directly](importlib.md#importing-a-source-file-directly)
    * [Implementing lazy imports](importlib.md#implementing-lazy-imports)
    * [Setting up an importer](importlib.md#setting-up-an-importer)
    * [Approximating `importlib.import_module()`](importlib.md#approximating-importlib-import-module)
* [`importlib.resources` – Package resource reading, opening and access](importlib.resources.md)
  * [Functional API](importlib.resources.md#functional-api)
* [`importlib.resources.abc` – Abstract base classes for resources](importlib.resources.abc.md)
* [`importlib.metadata` – Accessing package metadata](importlib.metadata.md)
  * [Overview](importlib.metadata.md#overview)
  * [Functional API](importlib.metadata.md#functional-api)
    * [Entry points](importlib.metadata.md#entry-points)
    * [Distribution metadata](importlib.metadata.md#distribution-metadata)
    * [Distribution versions](importlib.metadata.md#distribution-versions)
    * [Distribution files](importlib.metadata.md#distribution-files)
    * [Distribution requirements](importlib.metadata.md#distribution-requirements)
    * [Mapping import to distribution packages](importlib.metadata.md#mapping-import-to-distribution-packages)
  * [Distributions](importlib.metadata.md#distributions)
  * [Distribution Discovery](importlib.metadata.md#distribution-discovery)
  * [Implementing Custom Providers](importlib.metadata.md#implementing-custom-providers)
    * [Example](importlib.metadata.md#example)
* [The initialization of the `sys.path` module search path](sys_path_init.md)
  * [Virtual Environments](sys_path_init.md#virtual-environments)
  * [\_pth files](sys_path_init.md#pth-files)
  * [Embedded Python](sys_path_init.md#embedded-python)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

<a id="stringservices"></a>

<a id="textservices"></a>

# Text Processing Services

The modules described in this chapter provide a wide range of string
manipulation operations and other text processing services.

The [`codecs`](codecs.md#module-codecs) module described under [Binary Data Services](binary.md#binaryservices) is also
highly relevant to text processing. In addition, see the documentation for
Python’s built-in string type in [Text Sequence Type — str](stdtypes.md#textseq).

* [`string` — Common string operations](string.md)
  * [String constants](string.md#string-constants)
  * [Custom string formatting](string.md#custom-string-formatting)
  * [Format string syntax](string.md#format-string-syntax)
    * [Format specification mini-language](string.md#format-specification-mini-language)
    * [Format examples](string.md#format-examples)
  * [Template strings ($-strings)](string.md#template-strings-strings)
  * [Helper functions](string.md#helper-functions)
* [`string.templatelib` — Support for template string literals](string.templatelib.md)
  * [Template strings](string.templatelib.md#template-strings)
  * [Types](string.templatelib.md#types)
  * [Helper functions](string.templatelib.md#helper-functions)
* [`re` — Regular expression operations](re.md)
  * [Regular expression syntax](re.md#regular-expression-syntax)
  * [Module contents](re.md#module-contents)
    * [Flags](re.md#flags)
    * [Functions](re.md#functions)
    * [Exceptions](re.md#exceptions)
  * [Regular expression objects](re.md#regular-expression-objects)
  * [Match objects](re.md#match-objects)
  * [Regular expression examples](re.md#regular-expression-examples)
    * [Checking for a pair](re.md#checking-for-a-pair)
    * [Simulating scanf()](re.md#simulating-scanf)
    * [search() vs. prefixmatch()](re.md#search-vs-prefixmatch)
    * [prefixmatch() vs. match()](re.md#prefixmatch-vs-match)
    * [Making a phonebook](re.md#making-a-phonebook)
    * [Text munging](re.md#text-munging)
    * [Finding all adverbs](re.md#finding-all-adverbs)
    * [Finding all adverbs and their positions](re.md#finding-all-adverbs-and-their-positions)
    * [Raw string notation](re.md#raw-string-notation)
    * [Writing a tokenizer](re.md#writing-a-tokenizer)
* [`difflib` — Helpers for computing deltas](difflib.md)
  * [SequenceMatcher objects](difflib.md#sequencematcher-objects)
  * [SequenceMatcher examples](difflib.md#sequencematcher-examples)
  * [Differ objects](difflib.md#differ-objects)
  * [Differ example](difflib.md#differ-example)
  * [A command-line interface to difflib](difflib.md#a-command-line-interface-to-difflib)
  * [ndiff example](difflib.md#ndiff-example)
* [`textwrap` — Text wrapping and filling](textwrap.md)
* [`unicodedata` — Unicode Database](unicodedata.md)
* [`stringprep` — Internet String Preparation](stringprep.md)
* [`readline` — GNU readline interface](readline.md)
  * [Init file](readline.md#init-file)
  * [Line buffer](readline.md#line-buffer)
  * [History file](readline.md#history-file)
  * [History list](readline.md#history-list)
  * [Startup hooks](readline.md#startup-hooks)
  * [Completion](readline.md#completion)
  * [Example](readline.md#example)
* [`rlcompleter` — Completion function for GNU readline](rlcompleter.md)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

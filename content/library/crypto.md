<a id="crypto"></a>

# Cryptographic Services

<a id="index-0"></a>

The modules described in this chapter implement various algorithms of a
cryptographic nature.  They are available at the discretion of the installation.
Here’s an overview:

* [`hashlib` — Secure hashes and message digests](hashlib.md)
  * [Hash algorithms](hashlib.md#hash-algorithms)
  * [Usage](hashlib.md#usage)
  * [Constructors](hashlib.md#constructors)
  * [Attributes](hashlib.md#attributes)
  * [Hash Objects](hashlib.md#hash-objects)
  * [SHAKE variable length digests](hashlib.md#shake-variable-length-digests)
  * [File hashing](hashlib.md#file-hashing)
  * [Key derivation](hashlib.md#key-derivation)
  * [BLAKE2](hashlib.md#blake2)
    * [Creating hash objects](hashlib.md#creating-hash-objects)
    * [Constants](hashlib.md#constants)
    * [Examples](hashlib.md#examples)
      * [Simple hashing](hashlib.md#simple-hashing)
      * [Using different digest sizes](hashlib.md#using-different-digest-sizes)
      * [Keyed hashing](hashlib.md#keyed-hashing)
      * [Randomized hashing](hashlib.md#randomized-hashing)
      * [Personalization](hashlib.md#personalization)
      * [Tree mode](hashlib.md#tree-mode)
    * [Credits](hashlib.md#credits)
* [`hmac` — Keyed-Hashing for Message Authentication](hmac.md)
* [`secrets` — Generate secure random numbers for managing secrets](secrets.md)
  * [Random numbers](secrets.md#random-numbers)
  * [Generating tokens](secrets.md#generating-tokens)
    * [How many bytes should tokens use?](secrets.md#how-many-bytes-should-tokens-use)
  * [Other functions](secrets.md#other-functions)
  * [Recipes and best practices](secrets.md#recipes-and-best-practices)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

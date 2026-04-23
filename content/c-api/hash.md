# PyHash API

See also the [`PyTypeObject.tp_hash`](typeobj.md#c.PyTypeObject.tp_hash) member and [Hashing of numeric types](../library/stdtypes.md#numeric-hash).

### type Py_hash_t

Hash value type: signed integer.

#### Versionadded
Added in version 3.2.

### type Py_uhash_t

Hash value type: unsigned integer.

#### Versionadded
Added in version 3.2.

### Py_HASH_ALGORITHM

A numerical value indicating the algorithm for hashing of [`str`](../library/stdtypes.md#str),
[`bytes`](../library/stdtypes.md#bytes), and [`memoryview`](../library/stdtypes.md#memoryview).

The algorithm name is exposed by [`sys.hash_info.algorithm`](../library/sys.md#sys.hash_info.algorithm).

#### Versionadded
Added in version 3.4.

### Py_HASH_FNV

### Py_HASH_SIPHASH24

### Py_HASH_SIPHASH13

Numerical values to compare to [`Py_HASH_ALGORITHM`](#c.Py_HASH_ALGORITHM) to determine
which algorithm is used for hashing. The hash algorithm can be configured
via the configure [`--with-hash-algorithm`](../using/configure.md#cmdoption-with-hash-algorithm) option.

#### Versionadded
Added in version 3.4: Add `Py_HASH_FNV` and `Py_HASH_SIPHASH24`.

#### Versionadded
Added in version 3.11: Add `Py_HASH_SIPHASH13`.

### Py_HASH_CUTOFF

Buffers of length in range `[1, Py_HASH_CUTOFF)` are hashed using DJBX33A
instead of the algorithm described by [`Py_HASH_ALGORITHM`](#c.Py_HASH_ALGORITHM).

- A `Py_HASH_CUTOFF` of 0 disables the optimization.
- `Py_HASH_CUTOFF` must be non-negative and less or equal than 7.

32-bit platforms should use a cutoff smaller than 64-bit platforms because
it is easier to create colliding strings. A cutoff of 7 on 64-bit platforms
and 5 on 32-bit platforms should provide a decent safety margin.

This corresponds to the [`sys.hash_info.cutoff`](../library/sys.md#sys.hash_info.cutoff) constant.

#### Versionadded
Added in version 3.4.

### PyHASH_MODULUS

The [Mersenne prime](https://en.wikipedia.org/wiki/Mersenne_prime) `P = 2**n -1`,
used for numeric hash scheme.

This corresponds to the [`sys.hash_info.modulus`](../library/sys.md#sys.hash_info.modulus) constant.

#### Versionadded
Added in version 3.13.

### PyHASH_BITS

The exponent `n` of `P` in [`PyHASH_MODULUS`](#c.PyHASH_MODULUS).

#### Versionadded
Added in version 3.13.

### PyHASH_MULTIPLIER

Prime multiplier used in string and various other hashes.

#### Versionadded
Added in version 3.13.

### PyHASH_INF

The hash value returned for a positive infinity.

This corresponds to the [`sys.hash_info.inf`](../library/sys.md#sys.hash_info.inf) constant.

#### Versionadded
Added in version 3.13.

### PyHASH_IMAG

The multiplier used for the imaginary part of a complex number.

This corresponds to the [`sys.hash_info.imag`](../library/sys.md#sys.hash_info.imag) constant.

#### Versionadded
Added in version 3.13.

### type PyHash_FuncDef

Hash function definition used by [`PyHash_GetFuncDef()`](#c.PyHash_GetFuncDef).

### [Py_hash_t](#c.Py_hash_t) (\*const hash)(const void\*, [Py_ssize_t](intro.md#c.Py_ssize_t))

Hash function.

### const char \*name

Hash function name (UTF-8 encoded string).

This corresponds to the [`sys.hash_info.algorithm`](../library/sys.md#sys.hash_info.algorithm) constant.

### const int hash_bits

Internal size of the hash value in bits.

This corresponds to the [`sys.hash_info.hash_bits`](../library/sys.md#sys.hash_info.hash_bits) constant.

### const int seed_bits

Size of seed input in bits.

This corresponds to the [`sys.hash_info.seed_bits`](../library/sys.md#sys.hash_info.seed_bits) constant.

#### Versionadded
Added in version 3.4.

### [PyHash_FuncDef](#c.PyHash_FuncDef) \*PyHash_GetFuncDef(void)

Get the hash function definition.

#### SEE ALSO
[**PEP 456**](https://peps.python.org/pep-0456/) “Secure and interchangeable hash algorithm”.

#### Versionadded
Added in version 3.4.

### [Py_hash_t](#c.Py_hash_t) Py_HashPointer(const void \*ptr)

Hash a pointer value: process the pointer value as an integer (cast it to
`uintptr_t` internally). The pointer is not dereferenced.

The function cannot fail: it cannot return `-1`.

#### Versionadded
Added in version 3.13.

### [Py_hash_t](#c.Py_hash_t) Py_HashBuffer(const void \*ptr, [Py_ssize_t](intro.md#c.Py_ssize_t) len)

Compute and return the hash value of a buffer of *len* bytes
starting at address *ptr*. The hash is guaranteed to match that of
[`bytes`](../library/stdtypes.md#bytes), [`memoryview`](../library/stdtypes.md#memoryview), and other built-in objects
that implement the [buffer protocol](buffer.md#bufferobjects).

Use this function to implement hashing for immutable objects whose
[`tp_richcompare`](typeobj.md#c.PyTypeObject.tp_richcompare) function compares to another
object’s buffer.

*len* must be greater than or equal to `0`.

This function always succeeds.

#### Versionadded
Added in version 3.14.

### [Py_hash_t](#c.Py_hash_t) PyObject_GenericHash([PyObject](structures.md#c.PyObject) \*obj)

Generic hashing function that is meant to be put into a type
object’s `tp_hash` slot.
Its result only depends on the object’s identity.

**CPython implementation detail:** In CPython, it is equivalent to [`Py_HashPointer()`](#c.Py_HashPointer).

#### Versionadded
Added in version 3.13.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

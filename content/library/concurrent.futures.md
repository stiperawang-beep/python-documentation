# `concurrent.futures` — Launching parallel tasks

#### Versionadded
Added in version 3.2.

**Source code:** [Lib/concurrent/futures/thread.py](https://github.com/python/cpython/tree/main/Lib/concurrent/futures/thread.py),
[Lib/concurrent/futures/process.py](https://github.com/python/cpython/tree/main/Lib/concurrent/futures/process.py),
and [Lib/concurrent/futures/interpreter.py](https://github.com/python/cpython/tree/main/Lib/concurrent/futures/interpreter.py)

---

The `concurrent.futures` module provides a high-level interface for
asynchronously executing callables.

The asynchronous execution can be performed with threads, using
[`ThreadPoolExecutor`](#concurrent.futures.ThreadPoolExecutor) or [`InterpreterPoolExecutor`](#concurrent.futures.InterpreterPoolExecutor),
or separate processes, using [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor).
Each implements the same interface, which is defined
by the abstract [`Executor`](#concurrent.futures.Executor) class.

[`concurrent.futures.Future`](#concurrent.futures.Future) must not be confused with
[`asyncio.Future`](asyncio-future.md#asyncio.Future), which is designed for use with [`asyncio`](asyncio.md#module-asyncio)
tasks and coroutines. See the [asyncio’s Future](asyncio-future.md)
documentation for a detailed comparison of the two.

<!-- include for modules that don't work on WASM -->

[Availability](intro.md#availability): not WASI.

This module does not work or is not available on WebAssembly. See
[WebAssembly platforms](intro.md#wasm-availability) for more information.

## Executor Objects

### *class* concurrent.futures.Executor

An abstract class that provides methods to execute calls asynchronously.  It
should not be used directly, but through its concrete subclasses.

#### submit(fn, , \*args, \*\*kwargs)

Schedules the callable, *fn*, to be executed as `fn(*args, **kwargs)`
and returns a [`Future`](#concurrent.futures.Future) object representing the execution of the
callable.

```python3
with ThreadPoolExecutor(max_workers=1) as executor:
    future = executor.submit(pow, 323, 1235)
    print(future.result())
```

#### map(fn, \*iterables, timeout=None, chunksize=1, buffersize=None)

Similar to [`map(fn, *iterables)`](functions.md#map) except:

* The *iterables* are collected immediately rather than lazily, unless a
  *buffersize* is specified to limit the number of submitted tasks whose
  results have not yet been yielded. If the buffer is full, iteration over
  the *iterables* pauses until a result is yielded from the buffer.
* *fn* is executed asynchronously and several calls to
  *fn* may be made concurrently.

The returned iterator raises a [`TimeoutError`](exceptions.md#TimeoutError)
if [`__next__()`](stdtypes.md#iterator.__next__) is called and the result isn’t available
after *timeout* seconds from the original call to [`Executor.map()`](#concurrent.futures.Executor.map).
*timeout* can be an int or a float.  If *timeout* is not specified or
`None`, there is no limit to the wait time.

If a *fn* call raises an exception, then that exception will be
raised when its value is retrieved from the iterator.

When using [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor), this method chops *iterables*
into a number of chunks which it submits to the pool as separate
tasks.  The (approximate) size of these chunks can be specified by
setting *chunksize* to a positive integer.  For very long iterables,
using a large value for *chunksize* can significantly improve
performance compared to the default size of 1.  With
[`ThreadPoolExecutor`](#concurrent.futures.ThreadPoolExecutor) and [`InterpreterPoolExecutor`](#concurrent.futures.InterpreterPoolExecutor),
*chunksize* has no effect.

#### Versionchanged
Changed in version 3.5: Added the *chunksize* parameter.

#### Versionchanged
Changed in version 3.14: Added the *buffersize* parameter.

#### shutdown(wait=True, , cancel_futures=False)

Signal the executor that it should free any resources that it is using
when the currently pending futures are done executing.  Calls to
[`Executor.submit()`](#concurrent.futures.Executor.submit) and [`Executor.map()`](#concurrent.futures.Executor.map) made after shutdown will
raise [`RuntimeError`](exceptions.md#RuntimeError).

If *wait* is `True` then this method will not return until all the
pending futures are done executing and the resources associated with the
executor have been freed.  If *wait* is `False` then this method will
return immediately and the resources associated with the executor will be
freed when all pending futures are done executing.  Regardless of the
value of *wait*, the entire Python program will not exit until all
pending futures are done executing.

If *cancel_futures* is `True`, this method will cancel all pending
futures that the executor has not started running. Any futures that
are completed or running won’t be cancelled, regardless of the value
of *cancel_futures*.

If both *cancel_futures* and *wait* are `True`, all futures that the
executor has started running will be completed prior to this method
returning. The remaining futures are cancelled.

You can avoid having to call this method explicitly if you use the executor
as a [context manager](../glossary.md#term-context-manager) via the  [`with`](../reference/compound_stmts.md#with) statement, which
will shutdown the [`Executor`](#concurrent.futures.Executor) (waiting as if [`Executor.shutdown()`](#concurrent.futures.Executor.shutdown)
were called with *wait* set to `True`):

```python3
import shutil
with ThreadPoolExecutor(max_workers=4) as e:
    e.submit(shutil.copy, 'src1.txt', 'dest1.txt')
    e.submit(shutil.copy, 'src2.txt', 'dest2.txt')
    e.submit(shutil.copy, 'src3.txt', 'dest3.txt')
    e.submit(shutil.copy, 'src4.txt', 'dest4.txt')
```

#### Versionchanged
Changed in version 3.9: Added *cancel_futures*.

## ThreadPoolExecutor

[`ThreadPoolExecutor`](#concurrent.futures.ThreadPoolExecutor) is an [`Executor`](#concurrent.futures.Executor) subclass that uses a pool of
threads to execute calls asynchronously.

Deadlocks can occur when the callable associated with a [`Future`](#concurrent.futures.Future) waits on
the results of another [`Future`](#concurrent.futures.Future).  For example:

```python3
import time
def wait_on_b():
    time.sleep(5)
    print(b.result())  # b will never complete because it is waiting on a.
    return 5

def wait_on_a():
    time.sleep(5)
    print(a.result())  # a will never complete because it is waiting on b.
    return 6


executor = ThreadPoolExecutor(max_workers=2)
a = executor.submit(wait_on_b)
b = executor.submit(wait_on_a)
```

And:

```python3
def wait_on_future():
    f = executor.submit(pow, 5, 2)
    # This will never complete because there is only one worker thread and
    # it is executing this function.
    print(f.result())

executor = ThreadPoolExecutor(max_workers=1)
future = executor.submit(wait_on_future)
# Note: calling future.result() would also cause a deadlock because
# the single worker thread is already waiting for wait_on_future().
```

### *class* concurrent.futures.ThreadPoolExecutor(max_workers=None, thread_name_prefix='', initializer=None, initargs=())

An [`Executor`](#concurrent.futures.Executor) subclass that uses a pool of at most *max_workers*
threads to execute calls asynchronously.

All threads enqueued to `ThreadPoolExecutor` will be joined before the
interpreter can exit. Note that the exit handler which does this is
executed *before* any exit handlers added using `atexit`. This means
exceptions in the main thread must be caught and handled in order to
signal threads to exit gracefully. For this reason, it is recommended
that `ThreadPoolExecutor` not be used for long-running tasks.

*initializer* is an optional callable that is called at the start of
each worker thread; *initargs* is a tuple of arguments passed to the
initializer.  Should *initializer* raise an exception, all currently
pending jobs will raise a [`BrokenThreadPool`](#concurrent.futures.thread.BrokenThreadPool),
as well as any attempt to submit more jobs to the pool.

#### Versionchanged
Changed in version 3.5: If *max_workers* is `None` or
not given, it will default to the number of processors on the machine,
multiplied by `5`, assuming that [`ThreadPoolExecutor`](#concurrent.futures.ThreadPoolExecutor) is often
used to overlap I/O instead of CPU work and the number of workers
should be higher than the number of workers
for [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor).

#### Versionchanged
Changed in version 3.6: Added the *thread_name_prefix* parameter to allow users to
control the [`threading.Thread`](threading.md#threading.Thread) names for worker threads created by
the pool for easier debugging.

#### Versionchanged
Changed in version 3.7: Added the *initializer* and *initargs* arguments.

#### Versionchanged
Changed in version 3.8: Default value of *max_workers* is changed to `min(32, os.cpu_count() + 4)`.
This default value preserves at least 5 workers for I/O bound tasks.
It utilizes at most 32 CPU cores for CPU bound tasks which release the GIL.
And it avoids using very large resources implicitly on many-core machines.

ThreadPoolExecutor now reuses idle worker threads before starting
*max_workers* worker threads too.

#### Versionchanged
Changed in version 3.13: Default value of *max_workers* is changed to
`min(32, (os.process_cpu_count() or 1) + 4)`.

<a id="threadpoolexecutor-example"></a>

### ThreadPoolExecutor Example

```python3
import concurrent.futures
import urllib.request

URLS = ['http://www.foxnews.com/',
        'http://www.cnn.com/',
        'http://europe.wsj.com/',
        'http://www.bbc.co.uk/',
        'http://nonexistent-subdomain.python.org/']

# Retrieve a single page and report the URL and contents
def load_url(url, timeout):
    with urllib.request.urlopen(url, timeout=timeout) as conn:
        return conn.read()

# We can use a with statement to ensure threads are cleaned up promptly
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    # Start the load operations and mark each future with its URL
    future_to_url = {executor.submit(load_url, url, 60): url for url in URLS}
    for future in concurrent.futures.as_completed(future_to_url):
        url = future_to_url[future]
        try:
            data = future.result()
        except Exception as exc:
            print('%r generated an exception: %s' % (url, exc))
        else:
            print('%r page is %d bytes' % (url, len(data)))
```

## InterpreterPoolExecutor

#### Versionadded
Added in version 3.14.

The [`InterpreterPoolExecutor`](#concurrent.futures.InterpreterPoolExecutor) class uses a pool of interpreters
to execute calls asynchronously.  It is a [`ThreadPoolExecutor`](#concurrent.futures.ThreadPoolExecutor)
subclass, which means each worker is running in its own thread.
The difference here is that each worker has its own interpreter,
and runs each task using that interpreter.

The biggest benefit to using interpreters instead of only threads
is true multi-core parallelism.  Each interpreter has its own
[Global Interpreter Lock](../glossary.md#term-global-interpreter-lock), so code
running in one interpreter can run on one CPU core, while code in
another interpreter runs unblocked on a different core.

The tradeoff is that writing concurrent code for use with multiple
interpreters can take extra effort.  However, this is because it
forces you to be deliberate about how and when interpreters interact,
and to be explicit about what data is shared between interpreters.
This results in several benefits that help balance the extra effort,
including true multi-core parallelism,  For example, code written
this way can make it easier to reason about concurrency.  Another
major benefit is that you don’t have to deal with several of the
big pain points of using threads, like race conditions.

Each worker’s interpreter is isolated from all the other interpreters.
“Isolated” means each interpreter has its own runtime state and
operates completely independently.  For example, if you redirect
[`sys.stdout`](sys.md#sys.stdout) in one interpreter, it will not be automatically
redirected to any other interpreter.  If you import a module in one
interpreter, it is not automatically imported in any other.  You
would need to import the module separately in interpreter where
you need it.  In fact, each module imported in an interpreter is
a completely separate object from the same module in a different
interpreter, including [`sys`](sys.md#module-sys), [`builtins`](builtins.md#module-builtins),
and even `__main__`.

Isolation means a mutable object, or other data, cannot be used
by more than one interpreter at the same time.  That effectively means
interpreters cannot actually share such objects or data.  Instead,
each interpreter must have its own copy, and you will have to
synchronize any changes between the copies manually.  Immutable
objects and data, like the builtin singletons, strings, and tuples
of immutable objects, don’t have these limitations.

Communicating and synchronizing between interpreters is most effectively
done using dedicated tools, like those proposed in [**PEP 734**](https://peps.python.org/pep-0734/).  One less
efficient alternative is to serialize with [`pickle`](pickle.md#module-pickle) and then send
the bytes over a shared [`socket`](socket.md#module-socket) or
[`pipe`](os.md#os.pipe).

### *class* concurrent.futures.InterpreterPoolExecutor(max_workers=None, thread_name_prefix='', initializer=None, initargs=())

A [`ThreadPoolExecutor`](#concurrent.futures.ThreadPoolExecutor) subclass that executes calls asynchronously
using a pool of at most *max_workers* threads.  Each thread runs
tasks in its own interpreter.  The worker interpreters are isolated
from each other, which means each has its own runtime state and that
they can’t share any mutable objects or other data.  Each interpreter
has its own [Global Interpreter Lock](../glossary.md#term-global-interpreter-lock),
which means code run with this executor has true multi-core parallelism.

The optional *initializer* and *initargs* arguments have the same
meaning as for `ThreadPoolExecutor`: the initializer is run
when each worker is created, though in this case it is run in
the worker’s interpreter.  The executor serializes the *initializer*
and *initargs* using [`pickle`](pickle.md#module-pickle) when sending them to the worker’s
interpreter.

#### NOTE
The executor may replace uncaught exceptions from *initializer*
with [`ExecutionFailed`](concurrent.interpreters.md#concurrent.interpreters.ExecutionFailed).

Other caveats from parent [`ThreadPoolExecutor`](#concurrent.futures.ThreadPoolExecutor) apply here.

[`submit()`](#concurrent.futures.Executor.submit) and [`map()`](#concurrent.futures.Executor.map) work like normal,
except the worker serializes the callable and arguments using
[`pickle`](pickle.md#module-pickle) when sending them to its interpreter.  The worker
likewise serializes the return value when sending it back.

When a worker’s current task raises an uncaught exception, the worker
always tries to preserve the exception as-is.  If that is successful
then it also sets the `__cause__` to a corresponding
[`ExecutionFailed`](concurrent.interpreters.md#concurrent.interpreters.ExecutionFailed)
instance, which contains a summary of the original exception.
In the uncommon case that the worker is not able to preserve the
original as-is then it directly preserves the corresponding
[`ExecutionFailed`](concurrent.interpreters.md#concurrent.interpreters.ExecutionFailed)
instance instead.

## ProcessPoolExecutor

The [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor) class is an [`Executor`](#concurrent.futures.Executor) subclass that
uses a pool of processes to execute calls asynchronously.
[`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor) uses the [`multiprocessing`](multiprocessing.md#module-multiprocessing) module, which
allows it to side-step the [Global Interpreter Lock](../glossary.md#term-global-interpreter-lock) but also means that
only picklable objects can be executed and returned.

The `__main__` module must be importable by worker subprocesses. This means
that [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor) will not work in the interactive interpreter.

Calling [`Executor`](#concurrent.futures.Executor) or [`Future`](#concurrent.futures.Future) methods from a callable submitted
to a [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor) will result in deadlock.

Note that the restrictions on functions and arguments needing to picklable as
per [`multiprocessing.Process`](multiprocessing.md#multiprocessing.Process) apply when using [`submit()`](#concurrent.futures.Executor.submit)
and [`map()`](#concurrent.futures.Executor.map) on a [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor). A function defined
in a REPL or a lambda should not be expected to work.

### *class* concurrent.futures.ProcessPoolExecutor(max_workers=None, mp_context=None, initializer=None, initargs=(), max_tasks_per_child=None)

An [`Executor`](#concurrent.futures.Executor) subclass that executes calls asynchronously using a pool
of at most *max_workers* processes.  If *max_workers* is `None` or not
given, it will default to [`os.process_cpu_count()`](os.md#os.process_cpu_count).
If *max_workers* is less than or equal to `0`, then a [`ValueError`](exceptions.md#ValueError)
will be raised.
On Windows, *max_workers* must be less than or equal to `61`. If it is not
then [`ValueError`](exceptions.md#ValueError) will be raised. If *max_workers* is `None`, then
the default chosen will be at most `61`, even if more processors are
available.
*mp_context* can be a [`multiprocessing`](multiprocessing.md#module-multiprocessing) context or `None`. It will be
used to launch the workers. If *mp_context* is `None` or not given, the
default [`multiprocessing`](multiprocessing.md#module-multiprocessing) context is used.
See [Contexts and start methods](multiprocessing.md#multiprocessing-start-methods).

*initializer* is an optional callable that is called at the start of
each worker process; *initargs* is a tuple of arguments passed to the
initializer.  Should *initializer* raise an exception, all currently
pending jobs will raise a [`BrokenProcessPool`](#concurrent.futures.process.BrokenProcessPool),
as well as any attempt to submit more jobs to the pool.

*max_tasks_per_child* is an optional argument that specifies the maximum
number of tasks a single process can execute before it will exit and be
replaced with a fresh worker process. By default *max_tasks_per_child* is
`None` which means worker processes will live as long as the pool. When
a max is specified, the “spawn” multiprocessing start method will be used by
default in absence of a *mp_context* parameter. This feature is incompatible
with the “fork” start method.

#### NOTE
Bugs have been reported when using the *max_tasks_per_child* feature that
can result in the [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor) hanging in some
circumstances. Follow its eventual resolution in [gh-115634](https://github.com/python/cpython/issues/115634).

#### Versionchanged
Changed in version 3.3: When one of the worker processes terminates abruptly, a
[`BrokenProcessPool`](#concurrent.futures.process.BrokenProcessPool) error is now raised.
Previously, behaviour
was undefined but operations on the executor or its futures would often
freeze or deadlock.

#### Versionchanged
Changed in version 3.7: The *mp_context* argument was added to allow users to control the
start_method for worker processes created by the pool.

Added the *initializer* and *initargs* arguments.

#### Versionchanged
Changed in version 3.11: The *max_tasks_per_child* argument was added to allow users to
control the lifetime of workers in the pool.

#### Versionchanged
Changed in version 3.12: On POSIX systems, if your application has multiple threads and the
[`multiprocessing`](multiprocessing.md#module-multiprocessing) context uses the `"fork"` start method:
The [`os.fork()`](os.md#os.fork) function called internally to spawn workers may raise a
[`DeprecationWarning`](exceptions.md#DeprecationWarning). Pass a *mp_context* configured to use a
different start method. See the [`os.fork()`](os.md#os.fork) documentation for
further explanation.

#### Versionchanged
Changed in version 3.13: *max_workers* uses [`os.process_cpu_count()`](os.md#os.process_cpu_count) by default, instead of
[`os.cpu_count()`](os.md#os.cpu_count).

#### Versionchanged
Changed in version 3.14: The default process start method (see
[Contexts and start methods](multiprocessing.md#multiprocessing-start-methods)) changed away from *fork*. If you
require the *fork* start method for [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor) you must
explicitly pass `mp_context=multiprocessing.get_context("fork")`.

#### terminate_workers()

Attempt to terminate all living worker processes immediately by calling
[`Process.terminate`](multiprocessing.md#multiprocessing.Process.terminate) on each of them.
Internally, it will also call [`Executor.shutdown()`](#concurrent.futures.Executor.shutdown) to ensure that all
other resources associated with the executor are freed.

After calling this method the caller should no longer submit tasks to the
executor.

#### Versionadded
Added in version 3.14.

#### kill_workers()

Attempt to kill all living worker processes immediately by calling
[`Process.kill`](multiprocessing.md#multiprocessing.Process.kill) on each of them.
Internally, it will also call [`Executor.shutdown()`](#concurrent.futures.Executor.shutdown) to ensure that all
other resources associated with the executor are freed.

After calling this method the caller should no longer submit tasks to the
executor.

#### Versionadded
Added in version 3.14.

<a id="processpoolexecutor-example"></a>

### ProcessPoolExecutor Example

```python3
import concurrent.futures
import math

PRIMES = [
    112272535095293,
    112582705942171,
    112272535095293,
    115280095190773,
    115797848077099,
    1099726899285419]

def is_prime(n):
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False

    sqrt_n = int(math.floor(math.sqrt(n)))
    for i in range(3, sqrt_n + 1, 2):
        if n % i == 0:
            return False
    return True

def main():
    with concurrent.futures.ProcessPoolExecutor() as executor:
        for number, prime in zip(PRIMES, executor.map(is_prime, PRIMES)):
            print('%d is prime: %s' % (number, prime))

if __name__ == '__main__':
    main()
```

## Future Objects

The [`Future`](#concurrent.futures.Future) class encapsulates the asynchronous execution of a callable.
[`Future`](#concurrent.futures.Future) instances are created by [`Executor.submit()`](#concurrent.futures.Executor.submit).

### *class* concurrent.futures.Future

Encapsulates the asynchronous execution of a callable.  [`Future`](#concurrent.futures.Future)
instances are created by [`Executor.submit()`](#concurrent.futures.Executor.submit) and should not be created
directly except for testing.

#### cancel()

Attempt to cancel the call.  If the call is currently being executed or
finished running and cannot be cancelled then the method will return
`False`, otherwise the call will be cancelled and the method will
return `True`.

#### cancelled()

Return `True` if the call was successfully cancelled.

#### running()

Return `True` if the call is currently being executed and cannot be
cancelled.

#### done()

Return `True` if the call was successfully cancelled or finished
running.

#### result(timeout=None)

Return the value returned by the call. If the call hasn’t yet completed
then this method will wait up to *timeout* seconds.  If the call hasn’t
completed in *timeout* seconds, then a
[`TimeoutError`](exceptions.md#TimeoutError) will be raised. *timeout* can be
an int or float.  If *timeout* is not specified or `None`, there is no
limit to the wait time.

If the future is cancelled before completing then [`CancelledError`](#concurrent.futures.CancelledError)
will be raised.

If the call raised an exception, this method will raise the same exception.

#### exception(timeout=None)

Return the exception raised by the call.  If the call hasn’t yet
completed then this method will wait up to *timeout* seconds.  If the
call hasn’t completed in *timeout* seconds, then a
[`TimeoutError`](exceptions.md#TimeoutError) will be raised.  *timeout* can be
an int or float.  If *timeout* is not specified or `None`, there is no
limit to the wait time.

If the future is cancelled before completing then [`CancelledError`](#concurrent.futures.CancelledError)
will be raised.

If the call completed without raising, `None` is returned.

#### add_done_callback(fn)

Attaches the callable *fn* to the future.  *fn* will be called, with the
future as its only argument, when the future is cancelled or finishes
running.

Added callables are called in the order that they were added and are
always called in a thread belonging to the process that added them.  If
the callable raises an [`Exception`](exceptions.md#Exception) subclass, it will be logged and
ignored.  If the callable raises a [`BaseException`](exceptions.md#BaseException) subclass, the
behavior is undefined.

If the future has already completed or been cancelled, *fn* will be
called immediately.

The following [`Future`](#concurrent.futures.Future) methods are meant for use in unit tests and
[`Executor`](#concurrent.futures.Executor) implementations.

#### set_running_or_notify_cancel()

This method should only be called by [`Executor`](#concurrent.futures.Executor) implementations
before executing the work associated with the [`Future`](#concurrent.futures.Future) and by unit
tests.

If the method returns `False` then the [`Future`](#concurrent.futures.Future) was cancelled,
i.e. [`Future.cancel()`](#concurrent.futures.Future.cancel) was called and returned `True`.  Any threads
waiting on the [`Future`](#concurrent.futures.Future) completing (i.e. through
[`as_completed()`](#concurrent.futures.as_completed) or [`wait()`](#concurrent.futures.wait)) will be woken up.

If the method returns `True` then the [`Future`](#concurrent.futures.Future) was not cancelled
and has been put in the running state, i.e. calls to
[`Future.running()`](#concurrent.futures.Future.running) will return `True`.

This method can only be called once and cannot be called after
[`Future.set_result()`](#concurrent.futures.Future.set_result) or [`Future.set_exception()`](#concurrent.futures.Future.set_exception) have been
called.

#### set_result(result)

Sets the result of the work associated with the [`Future`](#concurrent.futures.Future) to
*result*.

This method should only be used by [`Executor`](#concurrent.futures.Executor) implementations and
unit tests.

#### Versionchanged
Changed in version 3.8: This method raises
[`concurrent.futures.InvalidStateError`](#concurrent.futures.InvalidStateError) if the [`Future`](#concurrent.futures.Future) is
already done.

#### set_exception(exception)

Sets the result of the work associated with the [`Future`](#concurrent.futures.Future) to the
[`Exception`](exceptions.md#Exception) *exception*.

This method should only be used by [`Executor`](#concurrent.futures.Executor) implementations and
unit tests.

#### Versionchanged
Changed in version 3.8: This method raises
[`concurrent.futures.InvalidStateError`](#concurrent.futures.InvalidStateError) if the [`Future`](#concurrent.futures.Future) is
already done.

## Module Functions

### concurrent.futures.wait(fs, timeout=None, return_when=ALL_COMPLETED)

Wait for the [`Future`](#concurrent.futures.Future) instances (possibly created by different
[`Executor`](#concurrent.futures.Executor) instances) given by *fs* to complete. Duplicate futures
given to *fs* are removed and will be returned only once. Returns a named
2-tuple of sets.  The first set, named `done`, contains the futures that
completed (finished or cancelled futures) before the wait completed.  The
second set, named `not_done`, contains the futures that did not complete
(pending or running futures).

*timeout* can be used to control the maximum number of seconds to wait before
returning.  *timeout* can be an int or float.  If *timeout* is not specified
or `None`, there is no limit to the wait time.

*return_when* indicates when this function should return.  It must be one of
the following constants:

| Constant                               | Description                                                                                                                                                                                        |
|----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ### concurrent.futures.FIRST_COMPLETED | The function will return when any future finishes or is cancelled.                                                                                                                                 |
| ### concurrent.futures.FIRST_EXCEPTION | The function will return when any future finishes by raising an<br/>exception. If no future raises an exception<br/>then it is equivalent to [`ALL_COMPLETED`](#concurrent.futures.ALL_COMPLETED). |
| ### concurrent.futures.ALL_COMPLETED   | The function will return when all futures finish or are cancelled.                                                                                                                                 |

### concurrent.futures.as_completed(fs, timeout=None)

Returns an iterator over the [`Future`](#concurrent.futures.Future) instances (possibly created by
different [`Executor`](#concurrent.futures.Executor) instances) given by *fs* that yields futures as
they complete (finished or cancelled futures). Any futures given by *fs* that
are duplicated will be returned once. Any futures that completed before
[`as_completed()`](#concurrent.futures.as_completed) is called will be yielded first.  The returned iterator
raises a [`TimeoutError`](exceptions.md#TimeoutError) if [`__next__()`](stdtypes.md#iterator.__next__)
is called and the result isn’t available after *timeout* seconds from the
original call to [`as_completed()`](#concurrent.futures.as_completed).  *timeout* can be an int or float. If
*timeout* is not specified or `None`, there is no limit to the wait time.

#### SEE ALSO
[**PEP 3148**](https://peps.python.org/pep-3148/) – futures - execute computations asynchronously
: The proposal which described this feature for inclusion in the Python
  standard library.

## Exception classes

### *exception* concurrent.futures.CancelledError

Raised when a future is cancelled.

### *exception* concurrent.futures.TimeoutError

A deprecated alias of [`TimeoutError`](exceptions.md#TimeoutError),
raised when a future operation exceeds the given timeout.

#### Versionchanged
Changed in version 3.11: This class was made an alias of [`TimeoutError`](exceptions.md#TimeoutError).

### *exception* concurrent.futures.BrokenExecutor

Derived from [`RuntimeError`](exceptions.md#RuntimeError), this exception class is raised
when an executor is broken for some reason, and cannot be used
to submit or execute new tasks.

#### Versionadded
Added in version 3.7.

### *exception* concurrent.futures.InvalidStateError

Raised when an operation is performed on a future that is not allowed
in the current state.

#### Versionadded
Added in version 3.8.

### *exception* concurrent.futures.thread.BrokenThreadPool

Derived from [`BrokenExecutor`](#concurrent.futures.BrokenExecutor), this exception
class is raised when one of the workers
of a [`ThreadPoolExecutor`](#concurrent.futures.ThreadPoolExecutor)
has failed initializing.

#### Versionadded
Added in version 3.7.

### *exception* concurrent.futures.interpreter.BrokenInterpreterPool

Derived from [`BrokenThreadPool`](#concurrent.futures.thread.BrokenThreadPool),
this exception class is raised when one of the workers
of a [`InterpreterPoolExecutor`](#concurrent.futures.InterpreterPoolExecutor)
has failed initializing.

#### Versionadded
Added in version 3.14.

### *exception* concurrent.futures.process.BrokenProcessPool

Derived from [`BrokenExecutor`](#concurrent.futures.BrokenExecutor) (formerly
[`RuntimeError`](exceptions.md#RuntimeError)), this exception class is raised when one of the
workers of a [`ProcessPoolExecutor`](#concurrent.futures.ProcessPoolExecutor)
has terminated in a non-clean
fashion (for example, if it was killed from the outside).

#### Versionadded
Added in version 3.3.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

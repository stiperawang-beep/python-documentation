# High-level API Index

This page lists all high-level async/await enabled asyncio APIs.

## Tasks

Utilities to run asyncio programs, create Tasks, and
await on multiple things with timeouts.

| [`run()`](asyncio-runner.md#asyncio.run)                                         | Create event loop, run a coroutine, close the loop.                                                                                         |
|----------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| [`Runner`](asyncio-runner.md#asyncio.Runner)                                     | A context manager that simplifies multiple async function calls.                                                                            |
| [`Task`](asyncio-task.md#asyncio.Task)                                           | Task object.                                                                                                                                |
| [`TaskGroup`](asyncio-task.md#asyncio.TaskGroup)                                 | A context manager that holds a group of tasks. Provides<br/>a convenient and reliable way to wait for all tasks in the group to<br/>finish. |
| [`create_task()`](asyncio-task.md#asyncio.create_task)                           | Start an asyncio Task, then returns it.                                                                                                     |
| [`current_task()`](asyncio-task.md#asyncio.current_task)                         | Return the current Task.                                                                                                                    |
| [`all_tasks()`](asyncio-task.md#asyncio.all_tasks)                               | Return all tasks that are not yet finished for an event loop.                                                                               |
| `await` [`sleep()`](asyncio-task.md#asyncio.sleep)                               | Sleep for a number of seconds.                                                                                                              |
| `await` [`gather()`](asyncio-task.md#asyncio.gather)                             | Schedule and wait for things concurrently.                                                                                                  |
| `await` [`wait_for()`](asyncio-task.md#asyncio.wait_for)                         | Run with a timeout.                                                                                                                         |
| `await` [`shield()`](asyncio-task.md#asyncio.shield)                             | Shield from cancellation.                                                                                                                   |
| `await` [`wait()`](asyncio-task.md#asyncio.wait)                                 | Monitor for completion.                                                                                                                     |
| [`timeout()`](asyncio-task.md#asyncio.timeout)                                   | Run with a timeout. Useful in cases when `wait_for` is not suitable.                                                                        |
| [`to_thread()`](asyncio-task.md#asyncio.to_thread)                               | Asynchronously run a function in a separate OS thread.                                                                                      |
| [`run_coroutine_threadsafe()`](asyncio-task.md#asyncio.run_coroutine_threadsafe) | Schedule a coroutine from another OS thread.                                                                                                |
| `for in` [`as_completed()`](asyncio-task.md#asyncio.as_completed)                | Monitor for completion with a `for` loop.                                                                                                   |

### Examples

* [Using asyncio.gather() to run things in parallel](asyncio-task.md#asyncio-example-gather).
* [Using asyncio.wait_for() to enforce a timeout](asyncio-task.md#asyncio-example-waitfor).
* [Cancellation](asyncio-task.md#asyncio-example-task-cancel).
* [Using asyncio.sleep()](asyncio-task.md#asyncio-example-sleep).
* See also the main [Tasks documentation page](asyncio-task.md#coroutine).

## Queues

Queues should be used to distribute work amongst multiple asyncio Tasks,
implement connection pools, and pub/sub patterns.

| [`Queue`](asyncio-queue.md#asyncio.Queue)                 | A FIFO queue.     |
|-----------------------------------------------------------|-------------------|
| [`PriorityQueue`](asyncio-queue.md#asyncio.PriorityQueue) | A priority queue. |
| [`LifoQueue`](asyncio-queue.md#asyncio.LifoQueue)         | A LIFO queue.     |

### Examples

* [Using asyncio.Queue to distribute workload between several
  Tasks](asyncio-queue.md#asyncio-example-queue-dist).
* See also the [Queues documentation page](asyncio-queue.md#asyncio-queues).

## Subprocesses

Utilities to spawn subprocesses and run shell commands.

| `await` [`create_subprocess_exec()`](asyncio-subprocess.md#asyncio.create_subprocess_exec)   | Create a subprocess.   |
|----------------------------------------------------------------------------------------------|------------------------|
| `await` [`create_subprocess_shell()`](asyncio-subprocess.md#asyncio.create_subprocess_shell) | Run a shell command.   |

### Examples

* [Executing a shell command](asyncio-subprocess.md#asyncio-example-subprocess-shell).
* See also the [subprocess APIs](asyncio-subprocess.md#asyncio-subprocess)
  documentation.

## Streams

High-level APIs to work with network IO.

| `await` [`open_connection()`](asyncio-stream.md#asyncio.open_connection)           | Establish a TCP connection.                            |
|------------------------------------------------------------------------------------|--------------------------------------------------------|
| `await` [`open_unix_connection()`](asyncio-stream.md#asyncio.open_unix_connection) | Establish a Unix socket connection.                    |
| `await` [`start_server()`](asyncio-stream.md#asyncio.start_server)                 | Start a TCP server.                                    |
| `await` [`start_unix_server()`](asyncio-stream.md#asyncio.start_unix_server)       | Start a Unix socket server.                            |
| [`StreamReader`](asyncio-stream.md#asyncio.StreamReader)                           | High-level async/await object to receive network data. |
| [`StreamWriter`](asyncio-stream.md#asyncio.StreamWriter)                           | High-level async/await object to send network data.    |

### Examples

* [Example TCP client](asyncio-stream.md#asyncio-example-stream).
* See also the [streams APIs](asyncio-stream.md#asyncio-streams)
  documentation.

## Synchronization

Threading-like synchronization primitives that can be used in Tasks.

| [`Lock`](asyncio-sync.md#asyncio.Lock)                         | A mutex lock.        |
|----------------------------------------------------------------|----------------------|
| [`Event`](asyncio-sync.md#asyncio.Event)                       | An event object.     |
| [`Condition`](asyncio-sync.md#asyncio.Condition)               | A condition object.  |
| [`Semaphore`](asyncio-sync.md#asyncio.Semaphore)               | A semaphore.         |
| [`BoundedSemaphore`](asyncio-sync.md#asyncio.BoundedSemaphore) | A bounded semaphore. |
| [`Barrier`](asyncio-sync.md#asyncio.Barrier)                   | A barrier object.    |

### Examples

* [Using asyncio.Event](asyncio-sync.md#asyncio-example-sync-event).
* [Using asyncio.Barrier](asyncio-sync.md#asyncio-example-barrier).
* See also the documentation of asyncio
  [synchronization primitives](asyncio-sync.md#asyncio-sync).

## Exceptions

| [`asyncio.CancelledError`](asyncio-exceptions.md#asyncio.CancelledError)   | Raised when a Task is cancelled. See also [`Task.cancel()`](asyncio-task.md#asyncio.Task.cancel).   |
|----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| [`asyncio.BrokenBarrierError`](asyncio-sync.md#asyncio.BrokenBarrierError) | Raised when a Barrier is broken. See also [`Barrier.wait()`](asyncio-sync.md#asyncio.Barrier.wait). |

### Examples

* [Handling CancelledError to run code on cancellation request](asyncio-task.md#asyncio-example-task-cancel).
* See also the full list of
  [asyncio-specific exceptions](asyncio-exceptions.md#asyncio-exceptions).

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

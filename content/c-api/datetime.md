<a id="datetimeobjects"></a>

# DateTime Objects

Various date and time objects are supplied by the [`datetime`](../library/datetime.md#module-datetime) module.
Before using any of these functions, the header file `datetime.h` must be
included in your source (note that this is not included by `Python.h`),
and the macro [`PyDateTime_IMPORT`](#c.PyDateTime_IMPORT) must be invoked, usually as part of
the module initialisation function.  The macro puts a pointer to a C structure
into a static variable, [`PyDateTimeAPI`](#c.PyDateTimeAPI), that is used by the following
macros.

### PyDateTime_IMPORT()

Import the datetime C API.

On success, populate the [`PyDateTimeAPI`](#c.PyDateTimeAPI) pointer.
On failure, set [`PyDateTimeAPI`](#c.PyDateTimeAPI) to `NULL` and set an exception.
The caller must check if an error occurred via [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred):

```c
PyDateTime_IMPORT;
if (PyErr_Occurred()) { /* cleanup */ }
```

#### WARNING
This is not compatible with subinterpreters.

#### Versionchanged
Changed in version 3.15: This macro is now thread safe.

### type PyDateTime_CAPI

Structure containing the fields for the datetime C API.

The fields of this structure are private and subject to change.

Do not use this directly; prefer `PyDateTime_*` APIs instead.

### [PyDateTime_CAPI](#c.PyDateTime_CAPI) \*PyDateTimeAPI

Dynamically allocated object containing the datetime C API.

This variable is only available once [`PyDateTime_IMPORT`](#c.PyDateTime_IMPORT) succeeds.

#### Versionchanged
Changed in version 3.15: This variable should not be accessed directly as direct access is not thread-safe.
Use [`PyDateTime_IMPORT()`](#c.PyDateTime_IMPORT) instead.

### type PyDateTime_Date

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python date object.

### type PyDateTime_DateTime

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python datetime object.

### type PyDateTime_Time

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python time object.

### type PyDateTime_Delta

This subtype of [`PyObject`](structures.md#c.PyObject) represents the difference between two datetime values.

### [PyTypeObject](type.md#c.PyTypeObject) PyDateTime_DateType

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python date type;
it is the same object as [`datetime.date`](../library/datetime.md#datetime.date) in the Python layer.

### [PyTypeObject](type.md#c.PyTypeObject) PyDateTime_DateTimeType

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python datetime type;
it is the same object as [`datetime.datetime`](../library/datetime.md#datetime.datetime) in the Python layer.

### [PyTypeObject](type.md#c.PyTypeObject) PyDateTime_TimeType

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python time type;
it is the same object as [`datetime.time`](../library/datetime.md#datetime.time) in the Python layer.

### [PyTypeObject](type.md#c.PyTypeObject) PyDateTime_DeltaType

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python type for
the difference between two datetime values;
it is the same object as [`datetime.timedelta`](../library/datetime.md#datetime.timedelta) in the Python layer.

### [PyTypeObject](type.md#c.PyTypeObject) PyDateTime_TZInfoType

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python time zone info type;
it is the same object as [`datetime.tzinfo`](../library/datetime.md#datetime.tzinfo) in the Python layer.

Macro for access to the UTC singleton:

### [PyObject](structures.md#c.PyObject) \*PyDateTime_TimeZone_UTC

Returns the time zone singleton representing UTC, the same object as
[`datetime.timezone.utc`](../library/datetime.md#datetime.timezone.utc).

#### Versionadded
Added in version 3.7.

Type-check macros:

### int PyDate_Check([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_DateType`](#c.PyDateTime_DateType) or a subtype of
`PyDateTime_DateType`.  *ob* must not be `NULL`.  This function always
succeeds.

### int PyDate_CheckExact([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_DateType`](#c.PyDateTime_DateType). *ob* must not be
`NULL`.  This function always succeeds.

### int PyDateTime_Check([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_DateTimeType`](#c.PyDateTime_DateTimeType) or a subtype of
`PyDateTime_DateTimeType`.  *ob* must not be `NULL`.  This function always
succeeds.

### int PyDateTime_CheckExact([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_DateTimeType`](#c.PyDateTime_DateTimeType). *ob* must not
be `NULL`.  This function always succeeds.

### int PyTime_Check([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_TimeType`](#c.PyDateTime_TimeType) or a subtype of
`PyDateTime_TimeType`.  *ob* must not be `NULL`.  This function always
succeeds.

### int PyTime_CheckExact([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_TimeType`](#c.PyDateTime_TimeType). *ob* must not be
`NULL`.  This function always succeeds.

### int PyDelta_Check([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_DeltaType`](#c.PyDateTime_DeltaType) or a subtype of
`PyDateTime_DeltaType`.  *ob* must not be `NULL`.  This function always
succeeds.

### int PyDelta_CheckExact([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_DeltaType`](#c.PyDateTime_DeltaType). *ob* must not be
`NULL`.  This function always succeeds.

### int PyTZInfo_Check([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_TZInfoType`](#c.PyDateTime_TZInfoType) or a subtype of
`PyDateTime_TZInfoType`.  *ob* must not be `NULL`.  This function always
succeeds.

### int PyTZInfo_CheckExact([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is of type [`PyDateTime_TZInfoType`](#c.PyDateTime_TZInfoType). *ob* must not be
`NULL`.  This function always succeeds.

Macros to create objects:

### [PyObject](structures.md#c.PyObject) \*PyDate_FromDate(int year, int month, int day)

*Return value: New reference.*

Return a [`datetime.date`](../library/datetime.md#datetime.date) object with the specified year, month and day.

### [PyObject](structures.md#c.PyObject) \*PyDateTime_FromDateAndTime(int year, int month, int day, int hour, int minute, int second, int usecond)

*Return value: New reference.*

Return a [`datetime.datetime`](../library/datetime.md#datetime.datetime) object with the specified year, month, day, hour,
minute, second and microsecond.

### [PyObject](structures.md#c.PyObject) \*PyDateTime_FromDateAndTimeAndFold(int year, int month, int day, int hour, int minute, int second, int usecond, int fold)

*Return value: New reference.*

Return a [`datetime.datetime`](../library/datetime.md#datetime.datetime) object with the specified year, month, day, hour,
minute, second, microsecond and fold.

#### Versionadded
Added in version 3.6.

### [PyObject](structures.md#c.PyObject) \*PyTime_FromTime(int hour, int minute, int second, int usecond)

*Return value: New reference.*

Return a [`datetime.time`](../library/datetime.md#datetime.time) object with the specified hour, minute, second and
microsecond.

### [PyObject](structures.md#c.PyObject) \*PyTime_FromTimeAndFold(int hour, int minute, int second, int usecond, int fold)

*Return value: New reference.*

Return a [`datetime.time`](../library/datetime.md#datetime.time) object with the specified hour, minute, second,
microsecond and fold.

#### Versionadded
Added in version 3.6.

### [PyObject](structures.md#c.PyObject) \*PyDelta_FromDSU(int days, int seconds, int useconds)

*Return value: New reference.*

Return a [`datetime.timedelta`](../library/datetime.md#datetime.timedelta) object representing the given number
of days, seconds and microseconds.  Normalization is performed so that the
resulting number of microseconds and seconds lie in the ranges documented for
[`datetime.timedelta`](../library/datetime.md#datetime.timedelta) objects.

### [PyObject](structures.md#c.PyObject) \*PyTimeZone_FromOffset([PyObject](structures.md#c.PyObject) \*offset)

*Return value: New reference.*

Return a [`datetime.timezone`](../library/datetime.md#datetime.timezone) object with an unnamed fixed offset
represented by the *offset* argument.

#### Versionadded
Added in version 3.7.

### [PyObject](structures.md#c.PyObject) \*PyTimeZone_FromOffsetAndName([PyObject](structures.md#c.PyObject) \*offset, [PyObject](structures.md#c.PyObject) \*name)

*Return value: New reference.*

Return a [`datetime.timezone`](../library/datetime.md#datetime.timezone) object with a fixed offset represented
by the *offset* argument and with tzname *name*.

#### Versionadded
Added in version 3.7.

Macros to extract fields from date objects.  The argument must be an instance of
[`PyDateTime_Date`](#c.PyDateTime_Date), including subclasses (such as
[`PyDateTime_DateTime`](#c.PyDateTime_DateTime)).  The argument must not be `NULL`, and the type is
not checked:

### int PyDateTime_GET_YEAR([PyDateTime_Date](#c.PyDateTime_Date) \*o)

Return the year, as a positive int.

### int PyDateTime_GET_MONTH([PyDateTime_Date](#c.PyDateTime_Date) \*o)

Return the month, as an int from 1 through 12.

### int PyDateTime_GET_DAY([PyDateTime_Date](#c.PyDateTime_Date) \*o)

Return the day, as an int from 1 through 31.

Macros to extract fields from datetime objects.  The argument must be an
instance of [`PyDateTime_DateTime`](#c.PyDateTime_DateTime), including subclasses. The argument
must not be `NULL`, and the type is not checked:

### int PyDateTime_DATE_GET_HOUR([PyDateTime_DateTime](#c.PyDateTime_DateTime) \*o)

Return the hour, as an int from 0 through 23.

### int PyDateTime_DATE_GET_MINUTE([PyDateTime_DateTime](#c.PyDateTime_DateTime) \*o)

Return the minute, as an int from 0 through 59.

### int PyDateTime_DATE_GET_SECOND([PyDateTime_DateTime](#c.PyDateTime_DateTime) \*o)

Return the second, as an int from 0 through 59.

### int PyDateTime_DATE_GET_MICROSECOND([PyDateTime_DateTime](#c.PyDateTime_DateTime) \*o)

Return the microsecond, as an int from 0 through 999999.

### int PyDateTime_DATE_GET_FOLD([PyDateTime_DateTime](#c.PyDateTime_DateTime) \*o)

Return the fold, as an int from 0 through 1.

#### Versionadded
Added in version 3.6.

### [PyObject](structures.md#c.PyObject) \*PyDateTime_DATE_GET_TZINFO([PyDateTime_DateTime](#c.PyDateTime_DateTime) \*o)

Return the tzinfo (which may be `None`).

#### Versionadded
Added in version 3.10.

Macros to extract fields from time objects.  The argument must be an instance of
[`PyDateTime_Time`](#c.PyDateTime_Time), including subclasses. The argument must not be `NULL`,
and the type is not checked:

### int PyDateTime_TIME_GET_HOUR([PyDateTime_Time](#c.PyDateTime_Time) \*o)

Return the hour, as an int from 0 through 23.

### int PyDateTime_TIME_GET_MINUTE([PyDateTime_Time](#c.PyDateTime_Time) \*o)

Return the minute, as an int from 0 through 59.

### int PyDateTime_TIME_GET_SECOND([PyDateTime_Time](#c.PyDateTime_Time) \*o)

Return the second, as an int from 0 through 59.

### int PyDateTime_TIME_GET_MICROSECOND([PyDateTime_Time](#c.PyDateTime_Time) \*o)

Return the microsecond, as an int from 0 through 999999.

### int PyDateTime_TIME_GET_FOLD([PyDateTime_Time](#c.PyDateTime_Time) \*o)

Return the fold, as an int from 0 through 1.

#### Versionadded
Added in version 3.6.

### [PyObject](structures.md#c.PyObject) \*PyDateTime_TIME_GET_TZINFO([PyDateTime_Time](#c.PyDateTime_Time) \*o)

Return the tzinfo (which may be `None`).

#### Versionadded
Added in version 3.10.

Macros to extract fields from time delta objects.  The argument must be an
instance of [`PyDateTime_Delta`](#c.PyDateTime_Delta), including subclasses. The argument must
not be `NULL`, and the type is not checked:

### int PyDateTime_DELTA_GET_DAYS([PyDateTime_Delta](#c.PyDateTime_Delta) \*o)

Return the number of days, as an int from -999999999 to 999999999.

#### Versionadded
Added in version 3.3.

### int PyDateTime_DELTA_GET_SECONDS([PyDateTime_Delta](#c.PyDateTime_Delta) \*o)

Return the number of seconds, as an int from 0 through 86399.

#### Versionadded
Added in version 3.3.

### int PyDateTime_DELTA_GET_MICROSECONDS([PyDateTime_Delta](#c.PyDateTime_Delta) \*o)

Return the number of microseconds, as an int from 0 through 999999.

#### Versionadded
Added in version 3.3.

Macros for the convenience of modules implementing the DB API:

### [PyObject](structures.md#c.PyObject) \*PyDateTime_FromTimestamp([PyObject](structures.md#c.PyObject) \*args)

*Return value: New reference.*

Create and return a new [`datetime.datetime`](../library/datetime.md#datetime.datetime) object given an argument
tuple suitable for passing to [`datetime.datetime.fromtimestamp()`](../library/datetime.md#datetime.datetime.fromtimestamp).

### [PyObject](structures.md#c.PyObject) \*PyDate_FromTimestamp([PyObject](structures.md#c.PyObject) \*args)

*Return value: New reference.*

Create and return a new [`datetime.date`](../library/datetime.md#datetime.date) object given an argument
tuple suitable for passing to [`datetime.date.fromtimestamp()`](../library/datetime.md#datetime.date.fromtimestamp).

# Internal data

The following symbols are exposed by the C API but should be considered
internal-only.

### PyDateTime_CAPSULE_NAME

Name of the datetime capsule to pass to [`PyCapsule_Import()`](capsule.md#c.PyCapsule_Import).

Internal usage only. Use [`PyDateTime_IMPORT`](#c.PyDateTime_IMPORT) instead.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

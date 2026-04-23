# `datetime` — Basic date and time types

**Source code:** [Lib/datetime.py](https://github.com/python/cpython/tree/main/Lib/datetime.py)

---

The `datetime` module supplies classes for manipulating dates and times.

While date and time arithmetic is supported, the focus of the implementation is
on efficient attribute extraction for output formatting and manipulation.

#### SEE ALSO
Module [`calendar`](calendar.md#module-calendar)
: General calendar related functions.

Module [`time`](time.md#module-time)
: Time access and conversions.

Module [`zoneinfo`](zoneinfo.md#module-zoneinfo)
: Concrete time zones representing the IANA time zone database.

Package [dateutil](https://dateutil.readthedocs.io/en/stable/)
: Third-party library with expanded time zone and parsing support.

Package [DateType](https://pypi.org/project/DateType/)
: Third-party library that introduces distinct static types to for example,
  allow [static type checkers](../glossary.md#term-static-type-checker)
  to differentiate between naive and aware datetimes.

<a id="datetime-naive-aware"></a>

## Aware and naive objects

Date and time objects may be categorized as “aware” or “naive” depending on
whether or not they include time zone information.

With sufficient knowledge of applicable algorithmic and political time
adjustments, such as time zone and daylight saving time information,
an **aware** object can locate itself relative to other aware objects.
An aware object represents a specific moment in time that is not open to
interpretation. <sup>[1](#id4)</sup>

A **naive** object does not contain enough information to unambiguously locate
itself relative to other date/time objects. Whether a naive object represents
Coordinated Universal Time (UTC), local time, or time in some other time zone is
purely up to the program, just like it is up to the program whether a
particular number represents metres, miles, or mass. Naive objects are easy to
understand and to work with, at the cost of ignoring some aspects of reality.

For applications requiring aware objects, [`datetime`](#datetime.datetime) and [`time`](#datetime.time)
objects have an optional time zone information attribute, `tzinfo`, that
can be set to an instance of a subclass of the abstract `tzinfo` class.
These [`tzinfo`](#datetime.tzinfo) objects capture information about the offset from UTC
time, the time zone name, and whether daylight saving time is in effect.

Only one concrete [`tzinfo`](#datetime.tzinfo) class, the [`timezone`](#datetime.timezone) class, is
supplied by the `datetime` module. The `timezone` class can
represent simple time zones with fixed offsets from UTC, such as UTC itself or
North American EST and EDT time zones. Supporting time zones at deeper levels of
detail is up to the application. The rules for time adjustment across the
world are more political than rational, change frequently, and there is no
standard suitable for every application aside from UTC.

## Constants

The `datetime` module exports the following constants:

### datetime.MINYEAR

The smallest year number allowed in a [`date`](#datetime.date) or [`datetime`](#datetime.datetime) object.
[`MINYEAR`](#datetime.MINYEAR) is 1.

### datetime.MAXYEAR

The largest year number allowed in a [`date`](#datetime.date) or [`datetime`](#datetime.datetime) object.
[`MAXYEAR`](#datetime.MAXYEAR) is 9999.

### datetime.UTC

Alias for the UTC time zone singleton [`datetime.timezone.utc`](#datetime.timezone.utc).

#### Versionadded
Added in version 3.11.

## Available types

### *class* datetime.date

An idealized naive date, assuming the current Gregorian calendar always was, and
always will be, in effect. Attributes: [`year`](#datetime.date.year), [`month`](#datetime.date.month), and
[`day`](#datetime.date.day).

### *class* datetime.time

An idealized time, independent of any particular day, assuming that every day
has exactly 24\*60\*60 seconds.  (There is no notion of “leap seconds” here.)
Attributes: [`hour`](#datetime.time.hour), [`minute`](#datetime.time.minute), [`second`](#datetime.time.second), [`microsecond`](#datetime.time.microsecond),
and [`tzinfo`](#datetime.time.tzinfo).

### *class* datetime.datetime

A combination of a date and a time. Attributes: [`year`](#datetime.datetime.year), [`month`](#datetime.datetime.month),
[`day`](#datetime.datetime.day), [`hour`](#datetime.datetime.hour), [`minute`](#datetime.datetime.minute), [`second`](#datetime.datetime.second), [`microsecond`](#datetime.datetime.microsecond),
and [`tzinfo`](#datetime.datetime.tzinfo).

### *class* datetime.timedelta

A duration expressing the difference between two [`datetime`](#datetime.datetime)
or [`date`](#datetime.date) instances to microsecond resolution.

### *class* datetime.tzinfo

An abstract base class for time zone information objects. These are used by the
[`datetime`](#datetime.datetime) and [`time`](#datetime.time) classes to provide a customizable notion of
time adjustment (for example, to account for time zone and/or daylight saving
time).

### *class* datetime.timezone

A class that implements the [`tzinfo`](#datetime.tzinfo) abstract base class as a
fixed offset from the UTC.

#### Versionadded
Added in version 3.2.

Objects of these types are immutable.

Subclass relationships:

![timedelta, tzinfo, time, and date inherit from object; timezone inherits
from tzinfo; and datetime inherits from date.](library/datetime-inheritance.svg)

### Common properties

The [`date`](#datetime.date), [`datetime`](#datetime.datetime), [`time`](#datetime.time), and [`timezone`](#datetime.timezone) types
share these common features:

- Objects of these types are immutable.
- Objects of these types are [hashable](../glossary.md#term-hashable), meaning that they can be used as
  dictionary keys.
- Objects of these types support efficient pickling via the [`pickle`](pickle.md#module-pickle) module.

### Determining if an object is aware or naive

Objects of the [`date`](#datetime.date) type are always naive.

An object of type [`time`](#datetime.time) or [`datetime`](#datetime.datetime) may be aware or naive.

A [`datetime`](#datetime.datetime) object `d` is aware if both of the following hold:

1. `d.tzinfo` is not `None`
2. `d.tzinfo.utcoffset(d)` does not return `None`

Otherwise, `d` is naive.

A [`time`](#datetime.time) object `t` is aware if both of the following hold:

1. `t.tzinfo` is not `None`
2. `t.tzinfo.utcoffset(None)` does not return `None`.

Otherwise, `t` is naive.

The distinction between aware and naive doesn’t apply to [`timedelta`](#datetime.timedelta)
objects.

<a id="datetime-timedelta"></a>

## `timedelta` objects

A [`timedelta`](#datetime.timedelta) object represents a duration, the difference between two
[`datetime`](#datetime.datetime) or [`date`](#datetime.date) instances.

### *class* datetime.timedelta(days=0, seconds=0, microseconds=0, milliseconds=0, minutes=0, hours=0, weeks=0)

All arguments are optional and default to 0. Arguments may be integers
or floats, and may be positive or negative.

Only *days*, *seconds* and *microseconds* are stored internally.
Arguments are converted to those units:

* A millisecond is converted to 1000 microseconds.
* A minute is converted to 60 seconds.
* An hour is converted to 3600 seconds.
* A week is converted to 7 days.

and days, seconds and microseconds are then normalized so that the
representation is unique, with

* `0 <= microseconds < 1000000`
* `0 <= seconds < 3600*24` (the number of seconds in one day)
* `-999999999 <= days <= 999999999`

The following example illustrates how any arguments besides
*days*, *seconds* and *microseconds* are “merged” and normalized into those
three resulting attributes:

```python3
>>> import datetime as dt
>>> delta = dt.timedelta(
...     days=50,
...     seconds=27,
...     microseconds=10,
...     milliseconds=29000,
...     minutes=5,
...     hours=8,
...     weeks=2
... )
>>> # Only days, seconds, and microseconds remain
>>> delta
datetime.timedelta(days=64, seconds=29156, microseconds=10)
```

If any argument is a float and there are fractional microseconds,
the fractional microseconds left over from all arguments are
combined and their sum is rounded to the nearest microsecond using
round-half-to-even tiebreaker. If no argument is a float, the
conversion and normalization processes are exact (no information is
lost).

If the normalized value of days lies outside the indicated range,
[`OverflowError`](exceptions.md#OverflowError) is raised.

Note that normalization of negative values may be surprising at first. For
example:

```python3
>>> import datetime as dt
>>> d = dt.timedelta(microseconds=-1)
>>> (d.days, d.seconds, d.microseconds)
(-1, 86399, 999999)
```

Since the string representation of `timedelta` objects can be confusing,
use the following recipe to produce a more readable format:

```pycon
>>> def pretty_timedelta(td):
...     if td.days >= 0:
...         return str(td)
...     return f'-({-td!s})'
...
>>> d = timedelta(hours=-1)
>>> str(d)  # not human-friendly
'-1 day, 23:00:00'
>>> pretty_timedelta(d)
'-(1:00:00)'
```

Class attributes:

#### timedelta.min

The most negative [`timedelta`](#datetime.timedelta) object, `timedelta(-999999999)`.

#### timedelta.max

The most positive [`timedelta`](#datetime.timedelta) object, `timedelta(days=999999999,
hours=23, minutes=59, seconds=59, microseconds=999999)`.

#### timedelta.resolution

The smallest possible difference between non-equal [`timedelta`](#datetime.timedelta) objects,
`timedelta(microseconds=1)`.

Note that, because of normalization, `timedelta.max` is greater than `-timedelta.min`.
`-timedelta.max` is not representable as a [`timedelta`](#datetime.timedelta) object.

Instance attributes (read-only):

#### timedelta.days

Between -999,999,999 and 999,999,999 inclusive.

#### timedelta.seconds

Between 0 and 86,399 inclusive.

#### timedelta.microseconds

Between 0 and 999,999 inclusive.

Supported operations:

| Operation                             | Result                                                                                                                                                               |
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `t1 = t2 + t3`                        | Sum of `t2` and `t3`.<br/>Afterwards `t1 - t2 == t3` and<br/>`t1 - t3 == t2` are true. (1)                                                                           |
| `t1 = t2 - t3`                        | Difference of `t2`  and `t3`. Afterwards<br/>`t1 == t2 - t3` and `t2 == t1 + t3` are<br/>true. (1)(6)                                                                |
| `t1 = t2 * i or t1 = i * t2`          | Delta multiplied by an integer.<br/>Afterwards `t1 // i == t2` is true,<br/>provided `i != 0`.                                                                       |
|                                       | In general, `t1  * i == t1 * (i-1) + t1`<br/>is true. (1)                                                                                                            |
| `t1 = t2 * f or t1 = f * t2`          | Delta multiplied by a float. The result is<br/>rounded to the nearest multiple of<br/>timedelta.resolution using round-half-to-even.                                 |
| `f = t2 / t3`                         | Division (3) of overall duration `t2` by<br/>interval unit `t3`. Returns a [`float`](functions.md#float)<br/>object.                                                 |
| `t1 = t2 / f or t1 = t2 / i`          | Delta divided by a float or an int. The result<br/>is rounded to the nearest multiple of<br/>timedelta.resolution using round-half-to-even.                          |
| `t1 = t2 // i` or<br/>`t1 = t2 // t3` | The floor is computed and the remainder (if<br/>any) is thrown away. In the second case, an<br/>integer is returned. (3)                                             |
| `t1 = t2 % t3`                        | The remainder is computed as a<br/>[`timedelta`](#datetime.timedelta) object. (3)                                                                                    |
| `q, r = divmod(t1, t2)`               | Computes the quotient and the remainder:<br/>`q = t1 // t2` (3) and `r = t1 % t2`.<br/>`q` is an integer and `r` is a<br/>[`timedelta`](#datetime.timedelta) object. |
| `+t1`                                 | Returns a [`timedelta`](#datetime.timedelta) object with the<br/>same value. (2)                                                                                     |
| `-t1`                                 | Equivalent to `timedelta(-t1.days,<br/>-t1.seconds, -t1.microseconds)`,<br/>and to `t1 * -1`. (1)(4)                                                                 |
| `abs(t)`                              | Equivalent to `+t` when `t.days >= 0`,<br/>and to `-t` when `t.days < 0`. (2)                                                                                        |
| `str(t)`                              | Returns a string in the form<br/>`[D day[s], ][H]H:MM:SS[.UUUUUU]`, where D<br/>is negative for negative `t`. (5)                                                    |
| `repr(t)`                             | Returns a string representation of the<br/>[`timedelta`](#datetime.timedelta) object as a constructor<br/>call with canonical attribute values.                      |

Notes:

1. This is exact but may overflow.
2. This is exact and cannot overflow.
3. Division by zero raises [`ZeroDivisionError`](exceptions.md#ZeroDivisionError).
4. `-timedelta.max` is not representable as a [`timedelta`](#datetime.timedelta) object.
5. String representations of [`timedelta`](#datetime.timedelta) objects are normalized
   similarly to their internal representation. This leads to somewhat
   unusual results for negative timedeltas. For example:
   ```python3
   >>> timedelta(hours=-5)
   datetime.timedelta(days=-1, seconds=68400)
   >>> print(_)
   -1 day, 19:00:00
   ```
6. The expression `t2 - t3` will always be equal to the expression `t2 + (-t3)` except
   when t3 is equal to `timedelta.max`; in that case the former will produce a result
   while the latter will overflow.

In addition to the operations listed above, [`timedelta`](#datetime.timedelta) objects support
certain additions and subtractions with [`date`](#datetime.date) and [`datetime`](#datetime.datetime)
objects (see below).

#### Versionchanged
Changed in version 3.2: Floor division and true division of a [`timedelta`](#datetime.timedelta) object by another
`timedelta` object are now supported, as are remainder operations and
the [`divmod()`](functions.md#divmod) function. True division and multiplication of a
`timedelta` object by a [`float`](functions.md#float) object are now supported.

[`timedelta`](#datetime.timedelta) objects support equality and order comparisons.

In Boolean contexts, a [`timedelta`](#datetime.timedelta) object is
considered to be true if and only if it isn’t equal to `timedelta(0)`.

Instance methods:

#### timedelta.total_seconds()

Return the total number of seconds contained in the duration. Equivalent to
`td / timedelta(seconds=1)`. For interval units other than seconds, use the
division form directly (for example, `td / timedelta(microseconds=1)`).

Note that for very large time intervals (greater than 270 years on
most platforms) this method will lose microsecond accuracy.

#### Versionadded
Added in version 3.2.

### Examples of usage: `timedelta`

An additional example of normalization:

```python3
>>> # Components of another_year add up to exactly 365 days
>>> import datetime as dt
>>> year = dt.timedelta(days=365)
>>> another_year = dt.timedelta(weeks=40, days=84, hours=23,
...                             minutes=50, seconds=600)
>>> year == another_year
True
>>> year.total_seconds()
31536000.0
```

Examples of [`timedelta`](#datetime.timedelta) arithmetic:

```python3
>>> import datetime as dt
>>> year = dt.timedelta(days=365)
>>> ten_years = 10 * year
>>> ten_years
datetime.timedelta(days=3650)
>>> ten_years.days // 365
10
>>> nine_years = ten_years - year
>>> nine_years
datetime.timedelta(days=3285)
>>> three_years = nine_years // 3
>>> three_years, three_years.days // 365
(datetime.timedelta(days=1095), 3)
```

<a id="datetime-date"></a>

## `date` objects

A [`date`](#datetime.date) object represents a date (year, month and day) in an idealized
calendar, the current Gregorian calendar indefinitely extended in both
directions.

January 1 of year 1 is called day number 1, January 2 of year 1 is
called day number 2, and so on. <sup>[2](#id5)</sup>

### *class* datetime.date(year, month, day)

All arguments are required. Arguments must be integers, in the following
ranges:

* `MINYEAR <= year <= MAXYEAR`
* `1 <= month <= 12`
* `1 <= day <= number of days in the given month and year`

If an argument outside those ranges is given, [`ValueError`](exceptions.md#ValueError) is raised.

Other constructors, all class methods:

#### *classmethod* date.today()

Return the current local date.

This is equivalent to `date.fromtimestamp(time.time())`.

#### *classmethod* date.fromtimestamp(timestamp)

Return the local date corresponding to the POSIX *timestamp*, such as is
returned by [`time.time()`](time.md#time.time).

This may raise [`OverflowError`](exceptions.md#OverflowError), if the timestamp is out
of the range of values supported by the platform C `localtime()`
function, and [`OSError`](exceptions.md#OSError) on `localtime()` failure.
It’s common for this to be restricted to years from 1970 through 2038. Note
that on non-POSIX systems that include leap seconds in their notion of a
timestamp, leap seconds are ignored by [`fromtimestamp()`](#datetime.date.fromtimestamp).

#### Versionchanged
Changed in version 3.3: Raise [`OverflowError`](exceptions.md#OverflowError) instead of [`ValueError`](exceptions.md#ValueError) if the timestamp
is out of the range of values supported by the platform C
`localtime()` function. Raise [`OSError`](exceptions.md#OSError) instead of
[`ValueError`](exceptions.md#ValueError) on `localtime()` failure.

#### Versionchanged
Changed in version 3.15: Accepts any real number as *timestamp*, not only integer or float.

#### *classmethod* date.fromordinal(ordinal)

Return the date corresponding to the proleptic Gregorian *ordinal*, where
January 1 of year 1 has ordinal 1.

[`ValueError`](exceptions.md#ValueError) is raised unless `1 <= ordinal <=
date.max.toordinal()`. For any date `d`,
`date.fromordinal(d.toordinal()) == d`.

#### *classmethod* date.fromisoformat(date_string)

Return a [`date`](#datetime.date) corresponding to a *date_string* given in any valid
ISO 8601 format, with the following exceptions:

1. Reduced precision dates are not currently supported (`YYYY-MM`,
   `YYYY`).
2. Extended date representations are not currently supported
   (`±YYYYYY-MM-DD`).
3. Ordinal dates are not currently supported (`YYYY-OOO`).

Examples:

```python3
>>> import datetime as dt
>>> dt.date.fromisoformat('2019-12-04')
datetime.date(2019, 12, 4)
>>> dt.date.fromisoformat('20191204')
datetime.date(2019, 12, 4)
>>> dt.date.fromisoformat('2021-W01-1')
datetime.date(2021, 1, 4)
```

#### Versionadded
Added in version 3.7.

#### Versionchanged
Changed in version 3.11: Previously, this method only supported the format `YYYY-MM-DD`.

#### *classmethod* date.fromisocalendar(year, week, day)

Return a [`date`](#datetime.date) corresponding to the ISO calendar date specified by
*year*, *week* and *day*. This is the inverse of the function [`date.isocalendar()`](#datetime.date.isocalendar).

#### Versionadded
Added in version 3.8.

#### *classmethod* date.strptime(date_string, format)

Return a [`date`](#datetime.date) corresponding to *date_string*, parsed according to
*format*. This is equivalent to:

```python3
date(*(time.strptime(date_string, format)[0:3]))
```

[`ValueError`](exceptions.md#ValueError) is raised if the date_string and format
can’t be parsed by [`time.strptime()`](time.md#time.strptime) or if it returns a value which isn’t a
time tuple.  See also [strftime() and strptime() behavior](#strftime-strptime-behavior) and
[`date.fromisoformat()`](#datetime.date.fromisoformat).

#### NOTE
If *format* specifies a day of month (`%d`) without a year,
[`ValueError`](exceptions.md#ValueError) is raised.  This is to avoid a quadrennial
leap year bug in code seeking to parse only a month and day as the
default year used in absence of one in the format is not a leap year.
The workaround is to always include a year in your *format*.  If parsing
*date_string* values that do not have a year, explicitly add a year that
is a leap year before parsing:

```pycon
>>> import datetime as dt
>>> date_string = "02/29"
>>> when = dt.date.strptime(f"{date_string};1984", "%m/%d;%Y")  # Avoids leap year bug.
>>> when.strftime("%B %d")
'February 29'
```

#### Versionadded
Added in version 3.14.

Class attributes:

#### date.min

The earliest representable date, `date(MINYEAR, 1, 1)`.

#### date.max

The latest representable date, `date(MAXYEAR, 12, 31)`.

#### date.resolution

The smallest possible difference between non-equal date objects,
`timedelta(days=1)`.

Instance attributes (read-only):

#### date.year

Between [`MINYEAR`](#datetime.MINYEAR) and [`MAXYEAR`](#datetime.MAXYEAR) inclusive.

#### date.month

Between 1 and 12 inclusive.

#### date.day

Between 1 and the number of days in the given month of the given year.

Supported operations:

| Operation                                                                                                             | Result                                                           |
|-----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| `date2 = date1 + timedelta`                                                                                           | `date2` will be `timedelta.days` days<br/>after `date1`. (1)     |
| `date2 = date1 - timedelta`                                                                                           | Computes `date2` such that `date2 +<br/>timedelta == date1`. (2) |
| `timedelta = date1 - date2`                                                                                           | (3)                                                              |
| `date1 == date2`<br/><br/><br/>`date1 != date2`<br/><br/>                                                             | Equality comparison. (4)                                         |
| `date1 < date2`<br/><br/><br/>`date1 > date2`<br/><br/><br/>`date1 <= date2`<br/><br/><br/>`date1 >= date2`<br/><br/> | Order comparison. (5)                                            |

Notes:

1. *date2* is moved forward in time if `timedelta.days > 0`, or backward if
   `timedelta.days < 0`. Afterward `date2 - date1 == timedelta.days`.
   `timedelta.seconds` and `timedelta.microseconds` are ignored.
   [`OverflowError`](exceptions.md#OverflowError) is raised if `date2.year` would be smaller than
   [`MINYEAR`](#datetime.MINYEAR) or larger than [`MAXYEAR`](#datetime.MAXYEAR).
2. `timedelta.seconds` and `timedelta.microseconds` are ignored.
3. This is exact, and cannot overflow. `timedelta.seconds` and
   `timedelta.microseconds` are 0, and `date2 + timedelta == date1` after.
4. [`date`](#datetime.date) objects are equal if they represent the same date.

   `date` objects that are not also [`datetime`](#datetime.datetime) instances
   are never equal to `datetime` objects, even if they represent
   the same date.
5. *date1* is considered less than *date2* when *date1* precedes *date2* in time.
   In other words, `date1 < date2` if and only if `date1.toordinal() <
   date2.toordinal()`.

   Order comparison between a [`date`](#datetime.date) object that is not also a
   [`datetime`](#datetime.datetime) instance and a `datetime` object raises
   [`TypeError`](exceptions.md#TypeError).

#### Versionchanged
Changed in version 3.13: Comparison between [`datetime`](#datetime.datetime) object and an instance of
the [`date`](#datetime.date) subclass that is not a `datetime` subclass
no longer converts the latter to `date`, ignoring the time part
and the time zone.
The default behavior can be changed by overriding the special comparison
methods in subclasses.

In Boolean contexts, all [`date`](#datetime.date) objects are considered to be true.

Instance methods:

#### date.replace(year=self.year, month=self.month, day=self.day)

Return a new [`date`](#datetime.date) object with the same values, but with specified
parameters updated.

Example:

```python3
>>> import datetime as dt
>>> d = dt.date(2002, 12, 31)
>>> d.replace(day=26)
datetime.date(2002, 12, 26)
```

The generic function [`copy.replace()`](copy.md#copy.replace) also supports [`date`](#datetime.date)
objects.

#### date.timetuple()

Return a [`time.struct_time`](time.md#time.struct_time) such as returned by [`time.localtime()`](time.md#time.localtime).

The hours, minutes and seconds are 0, and the DST flag is -1.

`d.timetuple()` is equivalent to:

```python3
time.struct_time((d.year, d.month, d.day, 0, 0, 0, d.weekday(), yday, -1))
```

where `yday = d.toordinal() - date(d.year, 1, 1).toordinal() + 1`
is the day number within the current year starting with 1 for January 1st.

#### date.toordinal()

Return the proleptic Gregorian ordinal of the date, where January 1 of year 1
has ordinal 1. For any [`date`](#datetime.date) object `d`,
`date.fromordinal(d.toordinal()) == d`.

#### date.weekday()

Return the day of the week as an integer, where Monday is 0 and Sunday is 6.
For example, `date(2002, 12, 4).weekday() == 2`, a Wednesday. See also
[`isoweekday()`](#datetime.date.isoweekday).

#### date.isoweekday()

Return the day of the week as an integer, where Monday is 1 and Sunday is 7.
For example, `date(2002, 12, 4).isoweekday() == 3`, a Wednesday. See also
[`weekday()`](#datetime.date.weekday), [`isocalendar()`](#datetime.date.isocalendar).

#### date.isocalendar()

Return a [named tuple](../glossary.md#term-named-tuple) object with three components: `year`,
`week` and `weekday`.

The ISO calendar is a widely used variant of the Gregorian calendar. <sup>[3](#id6)</sup>

The ISO year consists of 52 or 53 full weeks, and where a week starts on a
Monday and ends on a Sunday. The first week of an ISO year is the first
(Gregorian) calendar week of a year containing a Thursday. This is called week
number 1, and the ISO year of that Thursday is the same as its Gregorian year.

For example, 2004 begins on a Thursday, so the first week of ISO year 2004
begins on Monday, 29 Dec 2003 and ends on Sunday, 4 Jan 2004:

```python3
>>> import datetime as dt
>>> dt.date(2003, 12, 29).isocalendar()
datetime.IsoCalendarDate(year=2004, week=1, weekday=1)
>>> dt.date(2004, 1, 4).isocalendar()
datetime.IsoCalendarDate(year=2004, week=1, weekday=7)
```

#### Versionchanged
Changed in version 3.9: Result changed from a tuple to a [named tuple](../glossary.md#term-named-tuple).

#### date.isoformat()

Return a string representing the date in ISO 8601 format, `YYYY-MM-DD`:

```python3
>>> import datetime as dt
>>> dt.date(2002, 12, 4).isoformat()
'2002-12-04'
```

#### date.\_\_str_\_()

For a date `d`, `str(d)` is equivalent to `d.isoformat()`.

#### date.ctime()

Return a string representing the date:

```python3
>>> import datetime as dt
>>> dt.date(2002, 12, 4).ctime()
'Wed Dec  4 00:00:00 2002'
```

`d.ctime()` is equivalent to:

```python3
time.ctime(time.mktime(d.timetuple()))
```

on platforms where the native C
`ctime()` function (which [`time.ctime()`](time.md#time.ctime) invokes, but which
[`date.ctime()`](#datetime.date.ctime) does not invoke) conforms to the C standard.

#### date.strftime(format)

Return a string representing the date, controlled by an explicit format string.
Format codes referring to hours, minutes or seconds will see 0 values.
See also [strftime() and strptime() behavior](#strftime-strptime-behavior) and [`date.isoformat()`](#datetime.date.isoformat).

#### date.\_\_format_\_(format)

Same as [`date.strftime()`](#datetime.date.strftime). This makes it possible to specify a format
string for a [`date`](#datetime.date) object in [formatted string
literals](../reference/lexical_analysis.md#f-strings) and when using [`str.format()`](stdtypes.md#str.format).
See also [strftime() and strptime() behavior](#strftime-strptime-behavior) and [`date.isoformat()`](#datetime.date.isoformat).

### Examples of usage: `date`

Example of counting days to an event:

```python3
>>> import time
>>> import datetime as dt
>>> today = dt.date.today()
>>> today
datetime.date(2007, 12, 5)
>>> today == dt.date.fromtimestamp(time.time())
True
>>> my_birthday = dt.date(today.year, 6, 24)
>>> if my_birthday < today:
...     my_birthday = my_birthday.replace(year=today.year + 1)
...
>>> my_birthday
datetime.date(2008, 6, 24)
>>> time_to_birthday = abs(my_birthday - today)
>>> time_to_birthday.days
202
```

More examples of working with [`date`](#datetime.date):

```pycon
>>> import datetime as dt
>>> d = dt.date.fromordinal(730920) # 730920th day after 1. 1. 0001
>>> d
datetime.date(2002, 3, 11)

>>> # Methods related to formatting string output
>>> d.isoformat()
'2002-03-11'
>>> d.strftime("%d/%m/%y")
'11/03/02'
>>> d.strftime("%A %d. %B %Y")
'Monday 11. March 2002'
>>> d.ctime()
'Mon Mar 11 00:00:00 2002'
>>> 'The {1} is {0:%d}, the {2} is {0:%B}.'.format(d, "day", "month")
'The day is 11, the month is March.'

>>> # Methods for extracting 'components' under different calendars
>>> t = d.timetuple()
>>> for i in t:
...     print(i)
2002                # year
3                   # month
11                  # day
0
0
0
0                   # weekday (0 = Monday)
70                  # 70th day in the year
-1
>>> ic = d.isocalendar()
>>> for i in ic:
...     print(i)
2002                # ISO year
11                  # ISO week number
1                   # ISO day number ( 1 = Monday )

>>> # A date object is immutable; all operations produce a new object
>>> d.replace(year=2005)
datetime.date(2005, 3, 11)
```

<a id="datetime-datetime"></a>

## `datetime` objects

A [`datetime`](#datetime.datetime) object is a single object containing all the information
from a [`date`](#datetime.date) object and a [`time`](#datetime.time) object.

Like a [`date`](#datetime.date) object, [`datetime`](#datetime.datetime) assumes the current Gregorian
calendar extended in both directions; like a [`time`](#datetime.time) object,
`datetime` assumes there are exactly 3600\*24 seconds in every day.

Constructor:

### *class* datetime.datetime(year, month, day, hour=0, minute=0, second=0, microsecond=0, tzinfo=None, , fold=0)

The *year*, *month* and *day* arguments are required. *tzinfo* may be `None`, or an
instance of a [`tzinfo`](#datetime.tzinfo) subclass. The remaining arguments must be integers
in the following ranges:

* `MINYEAR <= year <= MAXYEAR`,
* `1 <= month <= 12`,
* `1 <= day <= number of days in the given month and year`,
* `0 <= hour < 24`,
* `0 <= minute < 60`,
* `0 <= second < 60`,
* `0 <= microsecond < 1000000`,
* `fold in [0, 1]`.

If an argument outside those ranges is given, [`ValueError`](exceptions.md#ValueError) is raised.

#### Versionchanged
Changed in version 3.6: Added the *fold* parameter.

Other constructors, all class methods:

#### *classmethod* datetime.today()

Return the current local date and time, with [`tzinfo`](#datetime.datetime.tzinfo) `None`.

Equivalent to:

```python3
datetime.fromtimestamp(time.time())
```

See also [`now()`](#datetime.datetime.now), [`fromtimestamp()`](#datetime.datetime.fromtimestamp).

This method is functionally equivalent to [`now()`](#datetime.datetime.now), but without a
`tz` parameter.

#### *classmethod* datetime.now(tz=None)

Return the current local date and time.

If optional argument *tz* is `None`
or not specified, this is like [`today()`](#datetime.datetime.today), but, if possible, supplies more
precision than can be gotten from going through a [`time.time()`](time.md#time.time) timestamp
(for example, this may be possible on platforms supplying the C
`gettimeofday()` function).

If *tz* is not `None`, it must be an instance of a [`tzinfo`](#datetime.tzinfo) subclass,
and the current date and time are converted to *tz*’s time zone.

This function is preferred over [`today()`](#datetime.datetime.today) and [`utcnow()`](#datetime.datetime.utcnow).

#### NOTE
Subsequent calls to `datetime.now()` may return the same
instant depending on the precision of the underlying clock.

#### *classmethod* datetime.utcnow()

Return the current UTC date and time, with [`tzinfo`](#datetime.datetime.tzinfo) `None`.

This is like [`now()`](#datetime.datetime.now), but returns the current UTC date and time, as a naive
[`datetime`](#datetime.datetime) object. An aware current UTC datetime can be obtained by
calling `datetime.now(timezone.utc)`. See also [`now()`](#datetime.datetime.now).

#### WARNING
Because naive `datetime` objects are treated by many `datetime` methods
as local times, it is preferred to use aware datetimes to represent times
in UTC. As such, the recommended way to create an object representing the
current time in UTC is by calling `datetime.now(timezone.utc)`.

#### Deprecated
Deprecated since version 3.12: Use [`datetime.now()`](#datetime.datetime.now) with [`UTC`](#datetime.UTC) instead.

#### *classmethod* datetime.fromtimestamp(timestamp, tz=None)

Return the local date and time corresponding to the POSIX timestamp, such as is
returned by [`time.time()`](time.md#time.time). If optional argument *tz* is `None` or not
specified, the timestamp is converted to the platform’s local date and time, and
the returned [`datetime`](#datetime.datetime) object is naive.

If *tz* is not `None`, it must be an instance of a [`tzinfo`](#datetime.tzinfo) subclass, and the
timestamp is converted to *tz*’s time zone.

[`fromtimestamp()`](#datetime.datetime.fromtimestamp) may raise [`OverflowError`](exceptions.md#OverflowError), if the timestamp is out of
the range of values supported by the platform C `localtime()` or
`gmtime()` functions, and [`OSError`](exceptions.md#OSError) on `localtime()` or
`gmtime()` failure.
It’s common for this to be restricted to years in
1970 through 2038. Note that on non-POSIX systems that include leap seconds in
their notion of a timestamp, leap seconds are ignored by [`fromtimestamp()`](#datetime.datetime.fromtimestamp),
and then it’s possible to have two timestamps differing by a second that yield
identical [`datetime`](#datetime.datetime) objects. This method is preferred over
[`utcfromtimestamp()`](#datetime.datetime.utcfromtimestamp).

#### Versionchanged
Changed in version 3.3: Raise [`OverflowError`](exceptions.md#OverflowError) instead of [`ValueError`](exceptions.md#ValueError) if the timestamp
is out of the range of values supported by the platform C
`localtime()` or `gmtime()` functions. Raise [`OSError`](exceptions.md#OSError)
instead of [`ValueError`](exceptions.md#ValueError) on `localtime()` or `gmtime()`
failure.

#### Versionchanged
Changed in version 3.6: [`fromtimestamp()`](#datetime.datetime.fromtimestamp) may return instances with [`fold`](#datetime.datetime.fold) set to 1.

#### Versionchanged
Changed in version 3.15: Accepts any real number as *timestamp*, not only integer or float.

#### *classmethod* datetime.utcfromtimestamp(timestamp)

Return the UTC [`datetime`](#datetime.datetime) corresponding to the POSIX timestamp, with
[`tzinfo`](#datetime.datetime.tzinfo) `None`.  (The resulting object is naive.)

This may raise [`OverflowError`](exceptions.md#OverflowError), if the timestamp is
out of the range of values supported by the platform C `gmtime()` function,
and [`OSError`](exceptions.md#OSError) on `gmtime()` failure.
It’s common for this to be restricted to years in 1970 through 2038.

To get an aware [`datetime`](#datetime.datetime) object, call [`fromtimestamp()`](#datetime.datetime.fromtimestamp):

```python3
datetime.fromtimestamp(timestamp, timezone.utc)
```

On the POSIX compliant platforms, it is equivalent to the following
expression:

```python3
datetime(1970, 1, 1, tzinfo=timezone.utc) + timedelta(seconds=timestamp)
```

except the latter formula always supports the full years range: between
[`MINYEAR`](#datetime.MINYEAR) and [`MAXYEAR`](#datetime.MAXYEAR) inclusive.

#### WARNING
Because naive `datetime` objects are treated by many `datetime` methods
as local times, it is preferred to use aware datetimes to represent times
in UTC. As such, the recommended way to create an object representing a
specific timestamp in UTC is by calling
`datetime.fromtimestamp(timestamp, tz=timezone.utc)`.

#### Versionchanged
Changed in version 3.3: Raise [`OverflowError`](exceptions.md#OverflowError) instead of [`ValueError`](exceptions.md#ValueError) if the timestamp
is out of the range of values supported by the platform C
`gmtime()` function. Raise [`OSError`](exceptions.md#OSError) instead of
[`ValueError`](exceptions.md#ValueError) on `gmtime()` failure.

#### Versionchanged
Changed in version 3.15: Accepts any real number as *timestamp*, not only integer or float.

#### Deprecated
Deprecated since version 3.12: Use [`datetime.fromtimestamp()`](#datetime.datetime.fromtimestamp) with [`UTC`](#datetime.UTC) instead.

#### *classmethod* datetime.fromordinal(ordinal)

Return the [`datetime`](#datetime.datetime) corresponding to the proleptic Gregorian ordinal,
where January 1 of year 1 has ordinal 1. [`ValueError`](exceptions.md#ValueError) is raised unless
`1 <= ordinal <= datetime.max.toordinal()`. The hour, minute, second and
microsecond of the result are all 0, and [`tzinfo`](#datetime.datetime.tzinfo) is `None`.

#### *classmethod* datetime.combine(date, time, tzinfo=time.tzinfo)

Return a new [`datetime`](#datetime.datetime) object whose date components are equal to the
given [`date`](#datetime.date) object’s, and whose time components
are equal to the given [`time`](#datetime.time) object’s. If the *tzinfo*
argument is provided, its value is used to set the [`tzinfo`](#datetime.datetime.tzinfo) attribute
of the result, otherwise the [`tzinfo`](#datetime.time.tzinfo) attribute of the *time* argument
is used.  If the *date* argument is a `datetime` object, its time components
and [`tzinfo`](#datetime.datetime.tzinfo) attributes are ignored.

For any [`datetime`](#datetime.datetime) object `d`,
`d == datetime.combine(d.date(), d.time(), d.tzinfo)`.

#### Versionchanged
Changed in version 3.6: Added the *tzinfo* argument.

#### *classmethod* datetime.fromisoformat(date_string)

Return a [`datetime`](#datetime.datetime) corresponding to a *date_string* in any valid
ISO 8601 format, with the following exceptions:

1. Time zone offsets may have fractional seconds.
2. The `T` separator may be replaced by any single unicode character.
3. Fractional hours and minutes are not supported.
4. Reduced precision dates are not currently supported (`YYYY-MM`,
   `YYYY`).
5. Extended date representations are not currently supported
   (`±YYYYYY-MM-DD`).
6. Ordinal dates are not currently supported (`YYYY-OOO`).

Examples:

```python3
>>> import datetime as dt
>>> dt.datetime.fromisoformat('2011-11-04')
datetime.datetime(2011, 11, 4, 0, 0)
>>> dt.datetime.fromisoformat('20111104')
datetime.datetime(2011, 11, 4, 0, 0)
>>> dt.datetime.fromisoformat('2011-11-04T00:05:23')
datetime.datetime(2011, 11, 4, 0, 5, 23)
>>> dt.datetime.fromisoformat('2011-11-04T00:05:23Z')
datetime.datetime(2011, 11, 4, 0, 5, 23, tzinfo=datetime.timezone.utc)
>>> dt.datetime.fromisoformat('20111104T000523')
datetime.datetime(2011, 11, 4, 0, 5, 23)
>>> dt.datetime.fromisoformat('2011-W01-2T00:05:23.283')
datetime.datetime(2011, 1, 4, 0, 5, 23, 283000)
>>> dt.datetime.fromisoformat('2011-11-04 00:05:23.283')
datetime.datetime(2011, 11, 4, 0, 5, 23, 283000)
>>> dt.datetime.fromisoformat('2011-11-04 00:05:23.283+00:00')
datetime.datetime(2011, 11, 4, 0, 5, 23, 283000, tzinfo=datetime.timezone.utc)
>>> dt.datetime.fromisoformat('2011-11-04T00:05:23+04:00')
datetime.datetime(2011, 11, 4, 0, 5, 23,
    tzinfo=datetime.timezone(datetime.timedelta(seconds=14400)))
```

#### Versionadded
Added in version 3.7.

#### Versionchanged
Changed in version 3.11: Previously, this method only supported formats that could be emitted by
[`date.isoformat()`](#datetime.date.isoformat) or [`datetime.isoformat()`](#datetime.datetime.isoformat).

#### *classmethod* datetime.fromisocalendar(year, week, day)

Return a [`datetime`](#datetime.datetime) corresponding to the ISO calendar date specified
by *year*, *week* and *day*. The non-date components of the datetime are populated
with their normal default values. This is the inverse of the function
[`datetime.isocalendar()`](#datetime.datetime.isocalendar).

#### Versionadded
Added in version 3.8.

#### *classmethod* datetime.strptime(date_string, format)

Return a [`datetime`](#datetime.datetime) corresponding to *date_string*, parsed according to
*format*.

If *format* does not contain microseconds or time zone information, this is equivalent to:

```python3
datetime(*(time.strptime(date_string, format)[0:6]))
```

[`ValueError`](exceptions.md#ValueError) is raised if the date_string and format
can’t be parsed by [`time.strptime()`](time.md#time.strptime) or if it returns a value which isn’t a
time tuple.  See also [strftime() and strptime() behavior](#strftime-strptime-behavior) and
[`datetime.fromisoformat()`](#datetime.datetime.fromisoformat).

#### Versionchanged
Changed in version 3.15: If *format* specifies a day of month (`%d`) without a year,
[`ValueError`](exceptions.md#ValueError) is raised.  This is to avoid a quadrennial
leap year bug in code seeking to parse only a month and day as the
default year used in absence of one in the format is not a leap year.
The workaround is to always include a year in your *format*.  If parsing
*date_string* values that do not have a year, explicitly add a year that
is a leap year before parsing:

```pycon
>>> import datetime as dt
>>> date_string = "02/29"
>>> when = dt.datetime.strptime(f"{date_string};1984", "%m/%d;%Y")  # Avoids leap year bug.
>>> when.strftime("%B %d")
'February 29'
```

Class attributes:

#### datetime.min

The earliest representable [`datetime`](#datetime.datetime), `datetime(MINYEAR, 1, 1,
tzinfo=None)`.

#### datetime.max

The latest representable [`datetime`](#datetime.datetime), `datetime(MAXYEAR, 12, 31, 23, 59,
59, 999999, tzinfo=None)`.

#### datetime.resolution

The smallest possible difference between non-equal [`datetime`](#datetime.datetime) objects,
`timedelta(microseconds=1)`.

Instance attributes (read-only):

#### datetime.year

Between [`MINYEAR`](#datetime.MINYEAR) and [`MAXYEAR`](#datetime.MAXYEAR) inclusive.

#### datetime.month

Between 1 and 12 inclusive.

#### datetime.day

Between 1 and the number of days in the given month of the given year.

#### datetime.hour

In `range(24)`.

#### datetime.minute

In `range(60)`.

#### datetime.second

In `range(60)`.

#### datetime.microsecond

In `range(1000000)`.

#### datetime.tzinfo

The object passed as the *tzinfo* argument to the [`datetime`](#datetime.datetime) constructor,
or `None` if none was passed.

#### datetime.fold

In `[0, 1]`. Used to disambiguate wall times during a repeated interval. (A
repeated interval occurs when clocks are rolled back at the end of daylight saving
time or when the UTC offset for the current zone is decreased for political reasons.)
The values 0 and 1 represent, respectively, the earlier and later of the two
moments with the same wall time representation.

#### Versionadded
Added in version 3.6.

Supported operations:

| Operation                                                                                                                                             | Result                   |
|-------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
| `datetime2 = datetime1 + timedelta`                                                                                                                   | (1)                      |
| `datetime2 = datetime1 - timedelta`                                                                                                                   | (2)                      |
| `timedelta = datetime1 - datetime2`                                                                                                                   | (3)                      |
| `datetime1 == datetime2`<br/><br/><br/>`datetime1 != datetime2`<br/><br/>                                                                             | Equality comparison. (4) |
| `datetime1 < datetime2`<br/><br/><br/>`datetime1 > datetime2`<br/><br/><br/>`datetime1 <= datetime2`<br/><br/><br/>`datetime1 >= datetime2`<br/><br/> | Order comparison. (5)    |
1. `datetime2` is a duration of `timedelta` removed from `datetime1`, moving forward in
   time if `timedelta.days > 0`, or backward if `timedelta.days < 0`. The
   result has the same [`tzinfo`](#datetime.datetime.tzinfo) attribute as the input datetime, and
   `datetime2 - datetime1 == timedelta` after. [`OverflowError`](exceptions.md#OverflowError) is raised if
   `datetime2.year` would be smaller than [`MINYEAR`](#datetime.MINYEAR) or larger than
   [`MAXYEAR`](#datetime.MAXYEAR). Note that no time zone adjustments are done even if the
   input is an aware object.
2. Computes the `datetime2` such that `datetime2 + timedelta == datetime1`. As for
   addition, the result has the same [`tzinfo`](#datetime.datetime.tzinfo) attribute as the input
   datetime, and no time zone adjustments are done even if the input is aware.
3. Subtraction of a [`datetime`](#datetime.datetime) from a `datetime` is defined only if
   both operands are naive, or if both are aware. If one is aware and the other is
   naive, [`TypeError`](exceptions.md#TypeError) is raised.

   If both are naive, or both are aware and have the same [`tzinfo`](#datetime.datetime.tzinfo) attribute,
   the [`tzinfo`](#datetime.datetime.tzinfo) attributes are ignored, and the result is a [`timedelta`](#datetime.timedelta)
   object `t` such that `datetime2 + t == datetime1`. No time zone adjustments
   are done in this case.

   If both are aware and have different [`tzinfo`](#datetime.datetime.tzinfo) attributes, `a-b` acts
   as if `a` and `b` were first converted to naive UTC datetimes. The
   result is `(a.replace(tzinfo=None) - a.utcoffset()) - (b.replace(tzinfo=None)
   - b.utcoffset())` except that the implementation never overflows.
4. [`datetime`](#datetime.datetime) objects are equal if they represent the same date
   and time, taking into account the time zone.

   Naive and aware [`datetime`](#datetime.datetime) objects are never equal.

   If both comparands are aware, and have the same `tzinfo` attribute,
   the `tzinfo` and [`fold`](#datetime.datetime.fold) attributes are ignored and
   the base datetimes are compared.
   If both comparands are aware and have different [`tzinfo`](#datetime.datetime.tzinfo)
   attributes, the comparison acts as comparands were first converted to UTC
   datetimes except that the implementation never overflows.
   [`datetime`](#datetime.datetime) instances in a repeated interval are never equal to
   `datetime` instances in other time zone.
5. *datetime1* is considered less than *datetime2* when *datetime1* precedes
   *datetime2* in time, taking into account the time zone.

   Order comparison between naive and aware [`datetime`](#datetime.datetime) objects
   raises [`TypeError`](exceptions.md#TypeError).

   If both comparands are aware, and have the same `tzinfo` attribute,
   the `tzinfo` and [`fold`](#datetime.datetime.fold) attributes are ignored and
   the base datetimes are compared.
   If both comparands are aware and have different [`tzinfo`](#datetime.datetime.tzinfo)
   attributes, the comparison acts as comparands were first converted to UTC
   datetimes except that the implementation never overflows.

#### Versionchanged
Changed in version 3.3: Equality comparisons between aware and naive [`datetime`](#datetime.datetime)
instances don’t raise [`TypeError`](exceptions.md#TypeError).

#### Versionchanged
Changed in version 3.13: Comparison between [`datetime`](#datetime.datetime) object and an instance of
the [`date`](#datetime.date) subclass that is not a `datetime` subclass
no longer converts the latter to `date`, ignoring the time part
and the time zone.
The default behavior can be changed by overriding the special comparison
methods in subclasses.

Instance methods:

#### datetime.date()

Return [`date`](#datetime.date) object with same year, month and day.

#### datetime.time()

Return [`time`](#datetime.time) object with same hour, minute, second, microsecond and fold.
[`tzinfo`](#datetime.datetime.tzinfo) is `None`. See also method [`timetz()`](#datetime.datetime.timetz).

#### Versionchanged
Changed in version 3.6: The fold value is copied to the returned [`time`](#datetime.time) object.

#### datetime.timetz()

Return [`time`](#datetime.time) object with same hour, minute, second, microsecond, fold, and
tzinfo attributes. See also method [`time()`](time.md#module-time).

#### Versionchanged
Changed in version 3.6: The fold value is copied to the returned [`time`](#datetime.time) object.

#### datetime.replace(year=self.year, month=self.month, day=self.day, hour=self.hour, minute=self.minute, second=self.second, microsecond=self.microsecond, tzinfo=self.tzinfo, , fold=0)

Return a new [`datetime`](#module-datetime) object with the same attributes, but with
specified parameters updated. Note that `tzinfo=None` can be specified to
create a naive datetime from an aware datetime with no conversion of date
and time data.

[`datetime`](#datetime.datetime) objects are also supported by generic function
[`copy.replace()`](copy.md#copy.replace).

#### Versionchanged
Changed in version 3.6: Added the *fold* parameter.

#### datetime.astimezone(tz=None)

Return a [`datetime`](#datetime.datetime) object with new [`tzinfo`](#datetime.datetime.tzinfo) attribute *tz*,
adjusting the date and time data so the result is the same UTC time as
*self*, but in *tz*’s local time.

If provided, *tz* must be an instance of a [`tzinfo`](#datetime.tzinfo) subclass, and its
[`utcoffset()`](#datetime.datetime.utcoffset) and [`dst()`](#datetime.datetime.dst) methods must not return `None`. If *self*
is naive, it is presumed to represent time in the system time zone.

If called without arguments (or with `tz=None`) the system local
time zone is assumed for the target time zone. The `.tzinfo` attribute of the converted
datetime instance will be set to an instance of [`timezone`](#datetime.timezone)
with the zone name and offset obtained from the OS.

If `self.tzinfo` is *tz*, `self.astimezone(tz)` is equal to *self*:  no
adjustment of date or time data is performed. Else the result is local
time in the time zone *tz*, representing the same UTC time as *self*:  after
`astz = dt.astimezone(tz)`, `astz - astz.utcoffset()` will have
the same date and time data as `dt - dt.utcoffset()`.

If you merely want to attach a [`timezone`](#datetime.timezone) object *tz* to a datetime *dt* without
adjustment of date and time data, use `dt.replace(tzinfo=tz)`. If you
merely want to remove the `timezone` object from an aware datetime *dt* without
conversion of date and time data, use `dt.replace(tzinfo=None)`.

Note that the default [`tzinfo.fromutc()`](#datetime.tzinfo.fromutc) method can be overridden in a
[`tzinfo`](#datetime.tzinfo) subclass to affect the result returned by [`astimezone()`](#datetime.datetime.astimezone).
Ignoring error cases, [`astimezone()`](#datetime.datetime.astimezone) acts like:

```python3
def astimezone(self, tz):
    if self.tzinfo is tz:
        return self
    # Convert self to UTC, and attach the new timezone object.
    utc = (self - self.utcoffset()).replace(tzinfo=tz)
    # Convert from UTC to tz's local time.
    return tz.fromutc(utc)
```

#### Versionchanged
Changed in version 3.3: *tz* now can be omitted.

#### Versionchanged
Changed in version 3.6: The [`astimezone()`](#datetime.datetime.astimezone) method can now be called on naive instances that
are presumed to represent system local time.

#### datetime.utcoffset()

If [`tzinfo`](#datetime.datetime.tzinfo) is `None`, returns `None`, else returns
`self.tzinfo.utcoffset(self)`, and raises an exception if the latter doesn’t
return `None` or a [`timedelta`](#datetime.timedelta) object with magnitude less than one day.

#### Versionchanged
Changed in version 3.7: The UTC offset is not restricted to a whole number of minutes.

#### datetime.dst()

If [`tzinfo`](#datetime.datetime.tzinfo) is `None`, returns `None`, else returns
`self.tzinfo.dst(self)`, and raises an exception if the latter doesn’t return
`None` or a [`timedelta`](#datetime.timedelta) object with magnitude less than one day.

#### Versionchanged
Changed in version 3.7: The DST offset is not restricted to a whole number of minutes.

#### datetime.tzname()

If [`tzinfo`](#datetime.datetime.tzinfo) is `None`, returns `None`, else returns
`self.tzinfo.tzname(self)`, raises an exception if the latter doesn’t return
`None` or a string object,

#### datetime.timetuple()

Return a [`time.struct_time`](time.md#time.struct_time) such as returned by [`time.localtime()`](time.md#time.localtime).

`d.timetuple()` is equivalent to:

```python3
time.struct_time((d.year, d.month, d.day,
                  d.hour, d.minute, d.second,
                  d.weekday(), yday, dst))
```

where `yday = d.toordinal() - date(d.year, 1, 1).toordinal() + 1`
is the day number within the current year starting with 1 for January
1st. The [`tm_isdst`](time.md#time.struct_time.tm_isdst) flag of the result is set according to the
[`dst()`](#datetime.datetime.dst) method: [`tzinfo`](#datetime.datetime.tzinfo) is `None` or [`dst()`](#datetime.datetime.dst) returns
`None`, `tm_isdst` is set to `-1`; else if [`dst()`](#datetime.datetime.dst) returns a
non-zero value, `tm_isdst` is set to 1; else `tm_isdst` is
set to 0.

#### datetime.utctimetuple()

If [`datetime`](#datetime.datetime) instance `d` is naive, this is the same as
`d.timetuple()` except that [`tm_isdst`](time.md#time.struct_time.tm_isdst) is forced to 0 regardless of what
`d.dst()` returns. DST is never in effect for a UTC time.

If `d` is aware, `d` is normalized to UTC time, by subtracting
`d.utcoffset()`, and a [`time.struct_time`](time.md#time.struct_time) for the
normalized time is returned. `tm_isdst` is forced to 0. Note
that an [`OverflowError`](exceptions.md#OverflowError) may be raised if `d.year` was
`MINYEAR` or `MAXYEAR` and UTC adjustment spills over a year
boundary.

#### WARNING
Because naive `datetime` objects are treated by many `datetime` methods
as local times, it is preferred to use aware datetimes to represent times
in UTC; as a result, using [`datetime.utctimetuple()`](#datetime.datetime.utctimetuple) may give misleading
results. If you have a naive `datetime` representing UTC, use
`datetime.replace(tzinfo=timezone.utc)` to make it aware, at which point
you can use [`datetime.timetuple()`](#datetime.datetime.timetuple).

#### datetime.toordinal()

Return the proleptic Gregorian ordinal of the date. The same as
`self.date().toordinal()`.

#### datetime.timestamp()

Return POSIX timestamp corresponding to the [`datetime`](#datetime.datetime)
instance. The return value is a [`float`](functions.md#float) similar to that
returned by [`time.time()`](time.md#time.time).

Naive [`datetime`](#datetime.datetime) instances are assumed to represent local
time and this method relies on platform C functions to perform
the conversion. Since `datetime` supports a wider range of
values than the platform C functions on many platforms, this
method may raise [`OverflowError`](exceptions.md#OverflowError) or [`OSError`](exceptions.md#OSError) for times
far in the past or far in the future.

For aware [`datetime`](#datetime.datetime) instances, the return value is computed
as:

```python3
(dt - datetime(1970, 1, 1, tzinfo=timezone.utc)).total_seconds()
```

#### NOTE
There is no method to obtain the POSIX timestamp directly from a
naive [`datetime`](#datetime.datetime) instance representing UTC time. If your
application uses this convention and your system time zone is not
set to UTC, you can obtain the POSIX timestamp by supplying
`tzinfo=timezone.utc`:

```python3
timestamp = dt.replace(tzinfo=timezone.utc).timestamp()
```

or by calculating the timestamp directly:

```python3
timestamp = (dt - datetime(1970, 1, 1)) / timedelta(seconds=1)
```

#### Versionadded
Added in version 3.3.

#### Versionchanged
Changed in version 3.6: The [`timestamp()`](#datetime.datetime.timestamp) method uses the [`fold`](#datetime.datetime.fold) attribute to
disambiguate the times during a repeated interval.

#### Versionchanged
Changed in version 3.6: This method no longer relies on the platform C `mktime()`
function to perform conversions.

#### datetime.weekday()

Return the day of the week as an integer, where Monday is 0 and Sunday is 6.
The same as `self.date().weekday()`. See also [`isoweekday()`](#datetime.datetime.isoweekday).

#### datetime.isoweekday()

Return the day of the week as an integer, where Monday is 1 and Sunday is 7.
The same as `self.date().isoweekday()`. See also [`weekday()`](#datetime.datetime.weekday),
[`isocalendar()`](#datetime.datetime.isocalendar).

#### datetime.isocalendar()

Return a [named tuple](../glossary.md#term-named-tuple) with three components: `year`, `week`
and `weekday`. The same as `self.date().isocalendar()`.

#### datetime.isoformat(sep='T', timespec='auto')

Return a string representing the date and time in ISO 8601 format:

- `YYYY-MM-DDTHH:MM:SS.ffffff`, if [`microsecond`](#datetime.datetime.microsecond) is not 0
- `YYYY-MM-DDTHH:MM:SS`, if [`microsecond`](#datetime.datetime.microsecond) is 0

If [`utcoffset()`](#datetime.datetime.utcoffset) does not return `None`, a string is
appended, giving the UTC offset:

- `YYYY-MM-DDTHH:MM:SS.ffffff+HH:MM[:SS[.ffffff]]`, if [`microsecond`](#datetime.datetime.microsecond)
  is not 0
- `YYYY-MM-DDTHH:MM:SS+HH:MM[:SS[.ffffff]]`,  if [`microsecond`](#datetime.datetime.microsecond) is 0

Examples:

```python3
>>> import datetime as dt
>>> dt.datetime(2019, 5, 18, 15, 17, 8, 132263).isoformat()
'2019-05-18T15:17:08.132263'
>>> dt.datetime(2019, 5, 18, 15, 17, tzinfo=dt.timezone.utc).isoformat()
'2019-05-18T15:17:00+00:00'
```

The optional argument *sep* (default `'T'`) is a one-character separator,
placed between the date and time portions of the result. For example:

```python3
>>> import datetime as dt
>>> class TZ(dt.tzinfo):
...     """A time zone with an arbitrary, constant -06:39 offset."""
...     def utcoffset(self, when):
...         return dt.timedelta(hours=-6, minutes=-39)
...
>>> dt.datetime(2002, 12, 25, tzinfo=TZ()).isoformat(' ')
'2002-12-25 00:00:00-06:39'
>>> dt.datetime(2009, 11, 27, microsecond=100, tzinfo=TZ()).isoformat()
'2009-11-27T00:00:00.000100-06:39'
```

The optional argument *timespec* specifies the number of additional
components of the time to include (the default is `'auto'`).
It can be one of the following:

- `'auto'`: Same as `'seconds'` if [`microsecond`](#datetime.datetime.microsecond) is 0,
  same as `'microseconds'` otherwise.
- `'hours'`: Include the [`hour`](#datetime.datetime.hour) in the two-digit `HH` format.
- `'minutes'`: Include [`hour`](#datetime.datetime.hour) and [`minute`](#datetime.datetime.minute) in `HH:MM` format.
- `'seconds'`: Include [`hour`](#datetime.datetime.hour), [`minute`](#datetime.datetime.minute), and [`second`](#datetime.datetime.second)
  in `HH:MM:SS` format.
- `'milliseconds'`: Include full time, but truncate fractional second
  part to milliseconds. `HH:MM:SS.sss` format.
- `'microseconds'`: Include full time in `HH:MM:SS.ffffff` format.

#### NOTE
Excluded time components are truncated, not rounded.

[`ValueError`](exceptions.md#ValueError) will be raised on an invalid *timespec* argument:

```python3
>>> import datetime as dt
>>> dt.datetime.now().isoformat(timespec='minutes')
'2002-12-25T00:00'
>>> my_datetime = dt.datetime(2015, 1, 1, 12, 30, 59, 0)
>>> my_datetime.isoformat(timespec='microseconds')
'2015-01-01T12:30:59.000000'
```

#### Versionchanged
Changed in version 3.6: Added the *timespec* parameter.

#### datetime.\_\_str_\_()

For a [`datetime`](#datetime.datetime) instance `d`, `str(d)` is equivalent to
`d.isoformat(' ')`.

#### datetime.ctime()

Return a string representing the date and time:

```python3
>>> import datetime as dt
>>> dt.datetime(2002, 12, 4, 20, 30, 40).ctime()
'Wed Dec  4 20:30:40 2002'
```

The output string will *not* include time zone information, regardless
of whether the input is aware or naive.

`d.ctime()` is equivalent to:

```python3
time.ctime(time.mktime(d.timetuple()))
```

on platforms where the native C `ctime()` function
(which [`time.ctime()`](time.md#time.ctime) invokes, but which
[`datetime.ctime()`](#datetime.datetime.ctime) does not invoke) conforms to the C standard.

#### datetime.strftime(format)

Return a string representing the date and time,
controlled by an explicit format string.
See also [strftime() and strptime() behavior](#strftime-strptime-behavior) and [`datetime.isoformat()`](#datetime.datetime.isoformat).

#### datetime.\_\_format_\_(format)

Same as [`datetime.strftime()`](#datetime.datetime.strftime). This makes it possible to specify a format
string for a [`datetime`](#datetime.datetime) object in [formatted string
literals](../reference/lexical_analysis.md#f-strings) and when using [`str.format()`](stdtypes.md#str.format).
See also [strftime() and strptime() behavior](#strftime-strptime-behavior) and [`datetime.isoformat()`](#datetime.datetime.isoformat).

### Examples of usage: `datetime`

Examples of working with [`datetime`](#datetime.datetime) objects:

```pycon
>>> import datetime as dt

>>> # Using datetime.combine()
>>> d = dt.date(2005, 7, 14)
>>> t = dt.time(12, 30)
>>> dt.datetime.combine(d, t)
datetime.datetime(2005, 7, 14, 12, 30)

>>> # Using datetime.now()
>>> dt.datetime.now()
datetime.datetime(2007, 12, 6, 16, 29, 43, 79043)   # GMT +1
>>> dt.datetime.now(dt.timezone.utc)
datetime.datetime(2007, 12, 6, 15, 29, 43, 79060, tzinfo=datetime.timezone.utc)

>>> # Using datetime.strptime()
>>> my_datetime = dt.datetime.strptime("21/11/06 16:30", "%d/%m/%y %H:%M")
>>> my_datetime
datetime.datetime(2006, 11, 21, 16, 30)

>>> # Using datetime.timetuple() to get tuple of all attributes
>>> tt = my_datetime.timetuple()
>>> for it in tt:
...     print(it)
...
2006    # year
11      # month
21      # day
16      # hour
30      # minute
0       # second
1       # weekday (0 = Monday)
325     # number of days since 1st January
-1      # dst - method tzinfo.dst() returned None

>>> # Date in ISO format
>>> ic = my_datetime.isocalendar()
>>> for it in ic:
...     print(it)
...
2006    # ISO year
47      # ISO week
2       # ISO weekday

>>> # Formatting a datetime
>>> my_datetime.strftime("%A, %d. %B %Y %I:%M%p")
'Tuesday, 21. November 2006 04:30PM'
>>> 'The {1} is {0:%d}, the {2} is {0:%B}, the {3} is {0:%I:%M%p}.'.format(my_datetime, "day", "month", "time")
'The day is 21, the month is November, the time is 04:30PM.'
```

The example below defines a [`tzinfo`](#datetime.tzinfo) subclass capturing time zone
information for Kabul, Afghanistan, which used +4 UTC until 1945
and then +4:30 UTC thereafter:

```python3
import datetime as dt

class KabulTz(dt.tzinfo):
    # Kabul used +4 until 1945, when they moved to +4:30
    UTC_MOVE_DATE = dt.datetime(1944, 12, 31, 20, tzinfo=dt.timezone.utc)

    def utcoffset(self, when):
        if when.year < 1945:
            return dt.timedelta(hours=4)
        elif (1945, 1, 1, 0, 0) <= when.timetuple()[:5] < (1945, 1, 1, 0, 30):
            # An ambiguous ("imaginary") half-hour range representing
            # a 'fold' in time due to the shift from +4 to +4:30.
            # If when falls in the imaginary range, use fold to decide how
            # to resolve. See PEP 495.
            return dt.timedelta(hours=4, minutes=(30 if when.fold else 0))
        else:
            return dt.timedelta(hours=4, minutes=30)

    def fromutc(self, when):
        # Follow same validations as in datetime.tzinfo
        if not isinstance(when, dt.datetime):
            raise TypeError("fromutc() requires a datetime argument")
        if when.tzinfo is not self:
            raise ValueError("when.tzinfo is not self")

        # A custom implementation is required for fromutc as
        # the input to this function is a datetime with utc values
        # but with a tzinfo set to self.
        # See datetime.astimezone or fromtimestamp.
        if when.replace(tzinfo=dt.timezone.utc) >= self.UTC_MOVE_DATE:
            return when + dt.timedelta(hours=4, minutes=30)
        else:
            return when + dt.timedelta(hours=4)

    def dst(self, when):
        # Kabul does not observe daylight saving time.
        return dt.timedelta(0)

    def tzname(self, when):
        if when >= self.UTC_MOVE_DATE:
            return "+04:30"
        return "+04"
```

Usage of `KabulTz` from above:

```python3
>>> tz1 = KabulTz()

>>> # Datetime before the change
>>> dt1 = dt.datetime(1900, 11, 21, 16, 30, tzinfo=tz1)
>>> print(dt1.utcoffset())
4:00:00

>>> # Datetime after the change
>>> dt2 = dt.datetime(2006, 6, 14, 13, 0, tzinfo=tz1)
>>> print(dt2.utcoffset())
4:30:00

>>> # Convert datetime to another time zone
>>> dt3 = dt2.astimezone(dt.timezone.utc)
>>> dt3
datetime.datetime(2006, 6, 14, 8, 30, tzinfo=datetime.timezone.utc)
>>> dt2
datetime.datetime(2006, 6, 14, 13, 0, tzinfo=KabulTz())
>>> dt2 == dt3
True
```

<a id="datetime-time"></a>

## `time` objects

A [`time`](#datetime.time) object represents a (local) time of day, independent of any particular
day, and subject to adjustment via a [`tzinfo`](#datetime.tzinfo) object.

### *class* datetime.time(hour=0, minute=0, second=0, microsecond=0, tzinfo=None, , fold=0)

All arguments are optional. *tzinfo* may be `None`, or an instance of a
[`tzinfo`](#datetime.tzinfo) subclass. The remaining arguments must be integers in the
following ranges:

* `0 <= hour < 24`,
* `0 <= minute < 60`,
* `0 <= second < 60`,
* `0 <= microsecond < 1000000`,
* `fold in [0, 1]`.

If an argument outside those ranges is given, [`ValueError`](exceptions.md#ValueError) is raised. All
default to 0 except *tzinfo*, which defaults to `None`.

Class attributes:

#### time.min

The earliest representable [`time`](#datetime.time), `time(0, 0, 0, 0)`.

#### time.max

The latest representable [`time`](#datetime.time), `time(23, 59, 59, 999999)`.

#### time.resolution

The smallest possible difference between non-equal [`time`](#datetime.time) objects,
`timedelta(microseconds=1)`, although note that arithmetic on
[`time`](#datetime.time) objects is not supported.

Instance attributes (read-only):

#### time.hour

In `range(24)`.

#### time.minute

In `range(60)`.

#### time.second

In `range(60)`.

#### time.microsecond

In `range(1000000)`.

#### time.tzinfo

The object passed as the tzinfo argument to the [`time`](#datetime.time) constructor, or
`None` if none was passed.

#### time.fold

In `[0, 1]`. Used to disambiguate wall times during a repeated interval. (A
repeated interval occurs when clocks are rolled back at the end of daylight saving
time or when the UTC offset for the current zone is decreased for political reasons.)
The values 0 and 1 represent, respectively, the earlier and later of the two
moments with the same wall time representation.

#### Versionadded
Added in version 3.6.

[`time`](#datetime.time) objects support equality and order comparisons,
where `a` is considered less than `b` when `a` precedes `b` in time.

Naive and aware `time` objects are never equal.
Order comparison between naive and aware `time` objects raises
[`TypeError`](exceptions.md#TypeError).

If both comparands are aware, and have the same [`tzinfo`](#datetime.time.tzinfo)
attribute, the `tzinfo` and `fold` attributes are
ignored and the base times are compared. If both comparands are aware and
have different `tzinfo` attributes, the comparands are first adjusted by
subtracting their UTC offsets (obtained from `self.utcoffset()`).

#### Versionchanged
Changed in version 3.3: Equality comparisons between aware and naive [`time`](#datetime.time) instances
don’t raise [`TypeError`](exceptions.md#TypeError).

In Boolean contexts, a [`time`](#datetime.time) object is always considered to be true.

#### Versionchanged
Changed in version 3.5: Before Python 3.5, a [`time`](#datetime.time) object was considered to be false if it
represented midnight in UTC. This behavior was considered obscure and
error-prone and has been removed in Python 3.5. See [bpo-13936](https://bugs.python.org/issue?@action=redirect&bpo=13936) for more
information.

Other constructors:

#### *classmethod* time.fromisoformat(time_string)

Return a [`time`](#datetime.time) corresponding to a *time_string* in any valid
ISO 8601 format, with the following exceptions:

1. Time zone offsets may have fractional seconds.
2. The leading `T`, normally required in cases where there may be ambiguity between
   a date and a time, is not required.
3. Fractional seconds may have any number of digits (anything beyond 6 will
   be truncated).
4. Fractional hours and minutes are not supported.

Examples:

```pycon
>>> import datetime as dt
>>> dt.time.fromisoformat('04:23:01')
datetime.time(4, 23, 1)
>>> dt.time.fromisoformat('T04:23:01')
datetime.time(4, 23, 1)
>>> dt.time.fromisoformat('T042301')
datetime.time(4, 23, 1)
>>> dt.time.fromisoformat('04:23:01.000384')
datetime.time(4, 23, 1, 384)
>>> dt.time.fromisoformat('04:23:01,000384')
datetime.time(4, 23, 1, 384)
>>> dt.time.fromisoformat('04:23:01+04:00')
datetime.time(4, 23, 1, tzinfo=datetime.timezone(datetime.timedelta(seconds=14400)))
>>> dt.time.fromisoformat('04:23:01Z')
datetime.time(4, 23, 1, tzinfo=datetime.timezone.utc)
>>> dt.time.fromisoformat('04:23:01+00:00')
datetime.time(4, 23, 1, tzinfo=datetime.timezone.utc)
```

#### Versionadded
Added in version 3.7.

#### Versionchanged
Changed in version 3.11: Previously, this method only supported formats that could be emitted by
[`time.isoformat()`](#datetime.time.isoformat).

#### *classmethod* time.strptime(date_string, format)

Return a [`time`](#datetime.time) corresponding to *date_string*, parsed according to
*format*.

If *format* does not contain microseconds or timezone information, this is equivalent to:

```python3
time(*(time.strptime(date_string, format)[3:6]))
```

[`ValueError`](exceptions.md#ValueError) is raised if the *date_string* and *format*
cannot be parsed by [`time.strptime()`](time.md#time.strptime) or if it returns a value which is not a
time tuple.  See also [strftime() and strptime() behavior](#strftime-strptime-behavior) and
[`time.fromisoformat()`](#datetime.time.fromisoformat).

#### Versionadded
Added in version 3.14.

Instance methods:

#### time.replace(hour=self.hour, minute=self.minute, second=self.second, microsecond=self.microsecond, tzinfo=self.tzinfo, , fold=0)

Return a new [`time`](#datetime.time) with the same values, but with specified
parameters updated. Note that `tzinfo=None` can be specified to create a
naive `time` from an aware `time`, without conversion of the
time data.

[`time`](#datetime.time) objects are also supported by generic function
[`copy.replace()`](copy.md#copy.replace).

#### Versionchanged
Changed in version 3.6: Added the *fold* parameter.

#### time.isoformat(timespec='auto')

Return a string representing the time in ISO 8601 format, one of:

- `HH:MM:SS.ffffff`, if [`microsecond`](#datetime.time.microsecond) is not 0
- `HH:MM:SS`, if [`microsecond`](#datetime.time.microsecond) is 0
- `HH:MM:SS.ffffff+HH:MM[:SS[.ffffff]]`, if [`utcoffset()`](#datetime.time.utcoffset) does not return `None`
- `HH:MM:SS+HH:MM[:SS[.ffffff]]`, if [`microsecond`](#datetime.time.microsecond) is 0 and [`utcoffset()`](#datetime.time.utcoffset) does not return `None`

The optional argument *timespec* specifies the number of additional
components of the time to include (the default is `'auto'`).
It can be one of the following:

- `'auto'`: Same as `'seconds'` if [`microsecond`](#datetime.time.microsecond) is 0,
  same as `'microseconds'` otherwise.
- `'hours'`: Include the [`hour`](#datetime.time.hour) in the two-digit `HH` format.
- `'minutes'`: Include [`hour`](#datetime.time.hour) and [`minute`](#datetime.time.minute) in `HH:MM` format.
- `'seconds'`: Include [`hour`](#datetime.time.hour), [`minute`](#datetime.time.minute), and [`second`](#datetime.time.second)
  in `HH:MM:SS` format.
- `'milliseconds'`: Include full time, but truncate fractional second
  part to milliseconds. `HH:MM:SS.sss` format.
- `'microseconds'`: Include full time in `HH:MM:SS.ffffff` format.

#### NOTE
Excluded time components are truncated, not rounded.

[`ValueError`](exceptions.md#ValueError) will be raised on an invalid *timespec* argument.

Example:

```python3
>>> import datetime as dt
>>> dt.time(hour=12, minute=34, second=56, microsecond=123456).isoformat(timespec='minutes')
'12:34'
>>> my_time = dt.time(hour=12, minute=34, second=56, microsecond=0)
>>> my_time.isoformat(timespec='microseconds')
'12:34:56.000000'
>>> my_time.isoformat(timespec='auto')
'12:34:56'
```

#### Versionchanged
Changed in version 3.6: Added the *timespec* parameter.

#### time.\_\_str_\_()

For a time `t`, `str(t)` is equivalent to `t.isoformat()`.

#### time.strftime(format)

Return a string representing the time, controlled by an explicit format
string.  See also [strftime() and strptime() behavior](#strftime-strptime-behavior) and [`time.isoformat()`](#datetime.time.isoformat).

#### time.\_\_format_\_(format)

Same as [`time.strftime()`](#datetime.time.strftime). This makes it possible to specify
a format string for a [`time`](#datetime.time) object in [formatted string
literals](../reference/lexical_analysis.md#f-strings) and when using [`str.format()`](stdtypes.md#str.format).
See also [strftime() and strptime() behavior](#strftime-strptime-behavior) and [`time.isoformat()`](#datetime.time.isoformat).

#### time.utcoffset()

If [`tzinfo`](#datetime.time.tzinfo) is `None`, returns `None`, else returns
`self.tzinfo.utcoffset(None)`, and raises an exception if the latter doesn’t
return `None` or a [`timedelta`](#datetime.timedelta) object with magnitude less than one day.

#### Versionchanged
Changed in version 3.7: The UTC offset is not restricted to a whole number of minutes.

#### time.dst()

If [`tzinfo`](#datetime.time.tzinfo) is `None`, returns `None`, else returns
`self.tzinfo.dst(None)`, and raises an exception if the latter doesn’t return
`None`, or a [`timedelta`](#datetime.timedelta) object with magnitude less than one day.

#### Versionchanged
Changed in version 3.7: The DST offset is not restricted to a whole number of minutes.

#### time.tzname()

If [`tzinfo`](#datetime.time.tzinfo) is `None`, returns `None`, else returns
`self.tzinfo.tzname(None)`, or raises an exception if the latter doesn’t
return `None` or a string object.

### Examples of usage: `time`

Examples of working with a [`time`](#datetime.time) object:

```python3
>>> import datetime as dt
>>> class TZ1(dt.tzinfo):
...     def utcoffset(self, when):
...         return dt.timedelta(hours=1)
...     def dst(self, when):
...         return dt.timedelta(0)
...     def tzname(self, when):
...         return "+01:00"
...     def  __repr__(self):
...         return f"{self.__class__.__name__}()"
...
>>> t = dt.time(12, 10, 30, tzinfo=TZ1())
>>> t
datetime.time(12, 10, 30, tzinfo=TZ1())
>>> t.isoformat()
'12:10:30+01:00'
>>> t.dst()
datetime.timedelta(0)
>>> t.tzname()
'+01:00'
>>> t.strftime("%H:%M:%S %Z")
'12:10:30 +01:00'
>>> 'The {} is {:%H:%M}.'.format("time", t)
'The time is 12:10.'
```

<a id="datetime-tzinfo"></a>

## `tzinfo` objects

### *class* datetime.tzinfo

This is an [abstract base class](../glossary.md#term-abstract-base-class), meaning that this class should not be
instantiated directly.  Define a subclass of [`tzinfo`](#datetime.tzinfo) to capture
information about a particular time zone.

An instance of (a concrete subclass of) [`tzinfo`](#datetime.tzinfo) can be passed to the
constructors for [`datetime`](#datetime.datetime) and [`time`](#datetime.time) objects. The latter objects
view their attributes as being in local time, and the `tzinfo` object
supports methods revealing offset of local time from UTC, the name of the time
zone, and DST offset, all relative to a date or time object passed to them.

You need to derive a concrete subclass, and (at least)
supply implementations of the standard [`tzinfo`](#datetime.tzinfo) methods needed by the
[`datetime`](#datetime.datetime) methods you use. The `datetime` module provides
[`timezone`](#datetime.timezone), a simple concrete subclass of `tzinfo` which can
represent time zones with fixed offset from UTC such as UTC itself or North
American EST and EDT.

Special requirement for pickling:  A [`tzinfo`](#datetime.tzinfo) subclass must have an
[`__init__()`](../reference/datamodel.md#object.__init__) method that can be called with no arguments,
otherwise it can be
pickled but possibly not unpickled again. This is a technical requirement that
may be relaxed in the future.

A concrete subclass of [`tzinfo`](#datetime.tzinfo) may need to implement the following
methods. Exactly which methods are needed depends on the uses made of aware
`datetime` objects. If in doubt, simply implement all of them.

#### tzinfo.utcoffset(dt)

Return offset of local time from UTC, as a [`timedelta`](#datetime.timedelta) object that is
positive east of UTC. If local time is west of UTC, this should be negative.

This represents the *total* offset from UTC; for example, if a
[`tzinfo`](#datetime.tzinfo) object represents both time zone and DST adjustments,
[`utcoffset()`](#datetime.tzinfo.utcoffset) should return their sum. If the UTC offset isn’t known,
return `None`. Else the value returned must be a [`timedelta`](#datetime.timedelta) object
strictly between `-timedelta(hours=24)` and `timedelta(hours=24)`
(the magnitude of the offset must be less than one day). Most implementations
of [`utcoffset()`](#datetime.tzinfo.utcoffset) will probably look like one of these two:

```python3
return CONSTANT                 # fixed-offset class
return CONSTANT + self.dst(dt)  # daylight-aware class
```

If [`utcoffset()`](#datetime.tzinfo.utcoffset) does not return `None`, [`dst()`](#datetime.tzinfo.dst) should not return
`None` either.

The default implementation of [`utcoffset()`](#datetime.tzinfo.utcoffset) raises
[`NotImplementedError`](exceptions.md#NotImplementedError).

#### Versionchanged
Changed in version 3.7: The UTC offset is not restricted to a whole number of minutes.

#### tzinfo.dst(dt)

Return the daylight saving time (DST) adjustment, as a [`timedelta`](#datetime.timedelta)
object or
`None` if DST information isn’t known.

Return `timedelta(0)` if DST is not in effect.
If DST is in effect, return the offset as a [`timedelta`](#datetime.timedelta) object
(see [`utcoffset()`](#datetime.tzinfo.utcoffset) for details). Note that DST offset, if applicable, has
already been added to the UTC offset returned by [`utcoffset()`](#datetime.tzinfo.utcoffset), so there’s
no need to consult [`dst()`](#datetime.tzinfo.dst) unless you’re interested in obtaining DST info
separately. For example, [`datetime.timetuple()`](#datetime.datetime.timetuple) calls its [`tzinfo`](#datetime.datetime.tzinfo)
attribute’s [`dst()`](#datetime.tzinfo.dst) method to determine how the [`tm_isdst`](time.md#time.struct_time.tm_isdst) flag
should be set, and [`tzinfo.fromutc()`](#datetime.tzinfo.fromutc) calls [`dst()`](#datetime.tzinfo.dst) to account for
DST changes when crossing time zones.

An instance *tz* of a [`tzinfo`](#datetime.tzinfo) subclass that models both standard and
daylight times must be consistent in this sense:

`tz.utcoffset(dt) - tz.dst(dt)`

must return the same result for every [`datetime`](#datetime.datetime) *dt* with `dt.tzinfo ==
tz`. For sane `tzinfo` subclasses, this expression yields the time
zone’s “standard offset”, which should not depend on the date or the time, but
only on geographic location. The implementation of [`datetime.astimezone()`](#datetime.datetime.astimezone)
relies on this, but cannot detect violations; it’s the programmer’s
responsibility to ensure it. If a `tzinfo` subclass cannot guarantee
this, it may be able to override the default implementation of
[`tzinfo.fromutc()`](#datetime.tzinfo.fromutc) to work correctly with [`astimezone()`](#datetime.datetime.astimezone) regardless.

Most implementations of [`dst()`](#datetime.tzinfo.dst) will probably look like one of these two:

```python3
import datetime as dt

def dst(self, when):
    # a fixed-offset class:  doesn't account for DST
    return dt.timedelta(0)
```

or:

```python3
import datetime as dt

def dst(self, when):
    # Code to set dston and dstoff to the time zone's DST
    # transition times based on the input when.year, and expressed
    # in standard local time.

    if dston <= when.replace(tzinfo=None) < dstoff:
        return dt.timedelta(hours=1)
    else:
        return dt.timedelta(0)
```

The default implementation of [`dst()`](#datetime.tzinfo.dst) raises [`NotImplementedError`](exceptions.md#NotImplementedError).

#### Versionchanged
Changed in version 3.7: The DST offset is not restricted to a whole number of minutes.

#### tzinfo.tzname(dt)

Return the time zone name corresponding to the [`datetime`](#datetime.datetime) object *dt*, as
a string. Nothing about string names is defined by the `datetime` module,
and there’s no requirement that it mean anything in particular. For example,
`"GMT"`, `"UTC"`, `"-500"`, `"-5:00"`, `"EDT"`, `"US/Eastern"`, `"America/New York"` are all
valid replies. Return `None` if a string name isn’t known. Note that this is
a method rather than a fixed string primarily because some [`tzinfo`](#datetime.tzinfo)
subclasses will wish to return different names depending on the specific value
of *dt* passed, especially if the `tzinfo` class is accounting for
daylight time.

The default implementation of [`tzname()`](#datetime.tzinfo.tzname) raises [`NotImplementedError`](exceptions.md#NotImplementedError).

These methods are called by a [`datetime`](#datetime.datetime) or [`time`](#datetime.time) object, in
response to their methods of the same names. A `datetime` object passes
itself as the argument, and a `time` object passes `None` as the
argument. A [`tzinfo`](#datetime.tzinfo) subclass’s methods should therefore be prepared to
accept a *dt* argument of `None`, or of class `datetime`.

When `None` is passed, it’s up to the class designer to decide the best
response. For example, returning `None` is appropriate if the class wishes to
say that time objects don’t participate in the [`tzinfo`](#datetime.tzinfo) protocols. It
may be more useful for `utcoffset(None)` to return the standard UTC offset, as
there is no other convention for discovering the standard offset.

When a [`datetime`](#datetime.datetime) object is passed in response to a `datetime`
method, `dt.tzinfo` is the same object as *self*. [`tzinfo`](#datetime.tzinfo) methods can
rely on this, unless user code calls `tzinfo` methods directly. The
intent is that the `tzinfo` methods interpret *dt* as being in local
time, and not need worry about objects in other time zones.

There is one more [`tzinfo`](#datetime.tzinfo) method that a subclass may wish to override:

#### tzinfo.fromutc(dt)

This is called from the default [`datetime.astimezone()`](#datetime.datetime.astimezone)
implementation. When called from that, `dt.tzinfo` is *self*, and *dt*’s
date and time data are to be viewed as expressing a UTC time. The purpose
of [`fromutc()`](#datetime.tzinfo.fromutc) is to adjust the date and time data, returning an
equivalent datetime in *self*’s local time.

Most [`tzinfo`](#datetime.tzinfo) subclasses should be able to inherit the default
[`fromutc()`](#datetime.tzinfo.fromutc) implementation without problems. It’s strong enough to handle
fixed-offset time zones, and time zones accounting for both standard and
daylight time, and the latter even if the DST transition times differ in
different years. An example of a time zone the default [`fromutc()`](#datetime.tzinfo.fromutc)
implementation may not handle correctly in all cases is one where the standard
offset (from UTC) depends on the specific date and time passed, which can happen
for political reasons. The default implementations of [`astimezone()`](#datetime.datetime.astimezone) and
[`fromutc()`](#datetime.tzinfo.fromutc) may not produce the result you want if the result is one of the
hours straddling the moment the standard offset changes.

Skipping code for error cases, the default [`fromutc()`](#datetime.tzinfo.fromutc) implementation acts
like:

```python3
import datetime as dt

def fromutc(self, when):
    # raise ValueError error if when.tzinfo is not self
    dtoff = when.utcoffset()
    dtdst = when.dst()
    # raise ValueError if dtoff is None or dtdst is None
    delta = dtoff - dtdst  # this is self's standard offset
    if delta:
        when += delta   # convert to standard local time
        dtdst = when.dst()
        # raise ValueError if dtdst is None
    if dtdst:
        return when + dtdst
    else:
        return when
```

In the following [`tzinfo_examples.py`](../includes/tzinfo_examples.py) file there are some examples of
[`tzinfo`](#datetime.tzinfo) classes:

```python3
import datetime as dt

# A class capturing the platform's idea of local time.
# (May result in wrong values on historical times in
#  timezones where UTC offset and/or the DST rules had
#  changed in the past.)
import time

ZERO = dt.timedelta(0)
HOUR = dt.timedelta(hours=1)
SECOND = dt.timedelta(seconds=1)

STDOFFSET = dt.timedelta(seconds=-time.timezone)
if time.daylight:
    DSTOFFSET = dt.timedelta(seconds=-time.altzone)
else:
    DSTOFFSET = STDOFFSET

DSTDIFF = DSTOFFSET - STDOFFSET


class LocalTimezone(dt.tzinfo):

    def fromutc(self, when):
        assert when.tzinfo is self
        stamp = (when - dt.datetime(1970, 1, 1, tzinfo=self)) // SECOND
        args = time.localtime(stamp)[:6]
        dst_diff = DSTDIFF // SECOND
        # Detect fold
        fold = (args == time.localtime(stamp - dst_diff))
        return dt.datetime(*args, microsecond=when.microsecond,
                           tzinfo=self, fold=fold)

    def utcoffset(self, when):
        if self._isdst(when):
            return DSTOFFSET
        else:
            return STDOFFSET

    def dst(self, when):
        if self._isdst(when):
            return DSTDIFF
        else:
            return ZERO

    def tzname(self, when):
        return time.tzname[self._isdst(when)]

    def _isdst(self, when):
        tt = (when.year, when.month, when.day,
              when.hour, when.minute, when.second,
              when.weekday(), 0, 0)
        stamp = time.mktime(tt)
        tt = time.localtime(stamp)
        return tt.tm_isdst > 0


Local = LocalTimezone()


# A complete implementation of current DST rules for major US time zones.

def first_sunday_on_or_after(when):
    days_to_go = 6 - when.weekday()
    if days_to_go:
        when += dt.timedelta(days_to_go)
    return when


# US DST Rules
#
# This is a simplified (i.e., wrong for a few cases) set of rules for US
# DST start and end times. For a complete and up-to-date set of DST rules
# and timezone definitions, visit the Olson Database (or try pytz):
# http://www.twinsun.com/tz/tz-link.htm
# https://sourceforge.net/projects/pytz/ (might not be up-to-date)
#
# In the US, since 2007, DST starts at 2am (standard time) on the second
# Sunday in March, which is the first Sunday on or after Mar 8.
DSTSTART_2007 = dt.datetime(1, 3, 8, 2)
# and ends at 2am (DST time) on the first Sunday of Nov.
DSTEND_2007 = dt.datetime(1, 11, 1, 2)
# From 1987 to 2006, DST used to start at 2am (standard time) on the first
# Sunday in April and to end at 2am (DST time) on the last
# Sunday of October, which is the first Sunday on or after Oct 25.
DSTSTART_1987_2006 = dt.datetime(1, 4, 1, 2)
DSTEND_1987_2006 = dt.datetime(1, 10, 25, 2)
# From 1967 to 1986, DST used to start at 2am (standard time) on the last
# Sunday in April (the one on or after April 24) and to end at 2am (DST time)
# on the last Sunday of October, which is the first Sunday
# on or after Oct 25.
DSTSTART_1967_1986 = dt.datetime(1, 4, 24, 2)
DSTEND_1967_1986 = DSTEND_1987_2006


def us_dst_range(year):
    # Find start and end times for US DST. For years before 1967, return
    # start = end for no DST.
    if 2006 < year:
        dststart, dstend = DSTSTART_2007, DSTEND_2007
    elif 1986 < year < 2007:
        dststart, dstend = DSTSTART_1987_2006, DSTEND_1987_2006
    elif 1966 < year < 1987:
        dststart, dstend = DSTSTART_1967_1986, DSTEND_1967_1986
    else:
        return (dt.datetime(year, 1, 1), ) * 2

    start = first_sunday_on_or_after(dststart.replace(year=year))
    end = first_sunday_on_or_after(dstend.replace(year=year))
    return start, end


class USTimeZone(dt.tzinfo):

    def __init__(self, hours, reprname, stdname, dstname):
        self.stdoffset = dt.timedelta(hours=hours)
        self.reprname = reprname
        self.stdname = stdname
        self.dstname = dstname

    def __repr__(self):
        return self.reprname

    def tzname(self, when):
        if self.dst(when):
            return self.dstname
        else:
            return self.stdname

    def utcoffset(self, when):
        return self.stdoffset + self.dst(when)

    def dst(self, when):
        if when is None or when.tzinfo is None:
            # An exception may be sensible here, in one or both cases.
            # It depends on how you want to treat them.  The default
            # fromutc() implementation (called by the default astimezone()
            # implementation) passes a datetime with when.tzinfo is self.
            return ZERO
        assert when.tzinfo is self
        start, end = us_dst_range(when.year)
        # Can't compare naive to aware objects, so strip the timezone from
        # when first.
        when = when.replace(tzinfo=None)
        if start + HOUR <= when < end - HOUR:
            # DST is in effect.
            return HOUR
        if end - HOUR <= when < end:
            # Fold (an ambiguous hour): use when.fold to disambiguate.
            return ZERO if when.fold else HOUR
        if start <= when < start + HOUR:
            # Gap (a non-existent hour): reverse the fold rule.
            return HOUR if when.fold else ZERO
        # DST is off.
        return ZERO

    def fromutc(self, when):
        assert when.tzinfo is self
        start, end = us_dst_range(when.year)
        start = start.replace(tzinfo=self)
        end = end.replace(tzinfo=self)
        std_time = when + self.stdoffset
        dst_time = std_time + HOUR
        if end <= dst_time < end + HOUR:
            # Repeated hour
            return std_time.replace(fold=1)
        if std_time < start or dst_time >= end:
            # Standard time
            return std_time
        if start <= std_time < end - HOUR:
            # Daylight saving time
            return dst_time


Eastern  = USTimeZone(-5, "Eastern",  "EST", "EDT")
Central  = USTimeZone(-6, "Central",  "CST", "CDT")
Mountain = USTimeZone(-7, "Mountain", "MST", "MDT")
Pacific  = USTimeZone(-8, "Pacific",  "PST", "PDT")
```

Note that there are unavoidable subtleties twice per year in a [`tzinfo`](#datetime.tzinfo)
subclass accounting for both standard and daylight time, at the DST transition
points. For concreteness, consider US Eastern (UTC -0500), where EDT begins the
minute after 1:59 (EST) on the second Sunday in March, and ends the minute after
1:59 (EDT) on the first Sunday in November:

```python3
  UTC   3:MM  4:MM  5:MM  6:MM  7:MM  8:MM
  EST  22:MM 23:MM  0:MM  1:MM  2:MM  3:MM
  EDT  23:MM  0:MM  1:MM  2:MM  3:MM  4:MM

start  22:MM 23:MM  0:MM  1:MM  3:MM  4:MM

  end  23:MM  0:MM  1:MM  1:MM  2:MM  3:MM
```

When DST starts (the “start” line), the local wall clock leaps from 1:59 to
3:00. A wall time of the form 2:MM doesn’t really make sense on that day, so
`astimezone(Eastern)` won’t deliver a result with `hour == 2` on the day DST
begins. For example, at the Spring forward transition of 2016, we get:

```python3
>>> import datetime as dt
>>> from tzinfo_examples import HOUR, Eastern
>>> u0 = dt.datetime(2016, 3, 13, 5, tzinfo=dt.timezone.utc)
>>> for i in range(4):
...     u = u0 + i*HOUR
...     t = u.astimezone(Eastern)
...     print(u.time(), 'UTC =', t.time(), t.tzname())
...
05:00:00 UTC = 00:00:00 EST
06:00:00 UTC = 01:00:00 EST
07:00:00 UTC = 03:00:00 EDT
08:00:00 UTC = 04:00:00 EDT
```

When DST ends (the “end” line), there’s a potentially worse problem: there’s an
hour that can’t be spelled unambiguously in local wall time: the last hour of
daylight time. In Eastern, that’s times of the form 5:MM UTC on the day
daylight time ends. The local wall clock leaps from 1:59 (daylight time) back
to 1:00 (standard time) again. Local times of the form 1:MM are ambiguous.
[`astimezone()`](#datetime.datetime.astimezone) mimics the local clock’s behavior by mapping two adjacent UTC
hours into the same local hour then. In the Eastern example, UTC times of the
form 5:MM and 6:MM both map to 1:MM when converted to Eastern, but earlier times
have the [`fold`](#datetime.datetime.fold) attribute set to 0 and the later times have it set to 1.
For example, at the Fall back transition of 2016, we get:

```python3
>>> import datetime as dt
>>> from tzinfo_examples import HOUR, Eastern
>>> u0 = dt.datetime(2016, 11, 6, 4, tzinfo=dt.timezone.utc)
>>> for i in range(4):
...     u = u0 + i*HOUR
...     t = u.astimezone(Eastern)
...     print(u.time(), 'UTC =', t.time(), t.tzname(), t.fold)
...
04:00:00 UTC = 00:00:00 EDT 0
05:00:00 UTC = 01:00:00 EDT 0
06:00:00 UTC = 01:00:00 EST 1
07:00:00 UTC = 02:00:00 EST 0
```

Note that the [`datetime`](#datetime.datetime) instances that differ only by the value of the
[`fold`](#datetime.datetime.fold) attribute are considered equal in comparisons.

Applications that can’t bear wall-time ambiguities should explicitly check the
value of the [`fold`](#datetime.datetime.fold) attribute or avoid using hybrid
[`tzinfo`](#datetime.tzinfo) subclasses; there are no ambiguities when using [`timezone`](#datetime.timezone),
or any other fixed-offset `tzinfo` subclass (such as a class representing
only EST (fixed offset -5 hours), or only EDT (fixed offset -4 hours)).

#### SEE ALSO
> [`zoneinfo`](zoneinfo.md#module-zoneinfo)
> : The `datetime` module has a basic [`timezone`](#datetime.timezone) class (for
>   handling arbitrary fixed offsets from UTC) and its [`timezone.utc`](#datetime.timezone.utc)
>   attribute (a UTC `timezone` instance).
>   <br/>
>   `zoneinfo` brings the *IANA time zone database* (also known as the Olson
>   database) to Python, and its usage is recommended.

[IANA time zone database](https://www.iana.org/time-zones)
: The Time Zone Database (often called tz, tzdata or zoneinfo) contains code
  and data that represent the history of local time for many representative
  locations around the globe. It is updated periodically to reflect changes
  made by political bodies to time zone boundaries, UTC offsets, and
  daylight-saving rules.

<a id="datetime-timezone"></a>

## `timezone` objects

The [`timezone`](#datetime.timezone) class is a subclass of [`tzinfo`](#datetime.tzinfo), each
instance of which represents a time zone defined by a fixed offset from
UTC.

Objects of this class cannot be used to represent time zone information in the
locations where different offsets are used in different days of the year or
where historical changes have been made to civil time.

### *class* datetime.timezone(offset)

The *offset* argument must be specified as a [`timedelta`](#datetime.timedelta)
object representing the difference between the local time and UTC. It must
be strictly between `-timedelta(hours=24)` and
`timedelta(hours=24)`, otherwise [`ValueError`](exceptions.md#ValueError) is raised.

The *name* argument is optional. If specified it must be a string that
will be used as the value returned by the [`datetime.tzname()`](#datetime.datetime.tzname) method.

#### Versionadded
Added in version 3.2.

#### Versionchanged
Changed in version 3.7: The UTC offset is not restricted to a whole number of minutes.

#### timezone.utcoffset(dt)

Return the fixed value specified when the [`timezone`](#datetime.timezone) instance is
constructed.

The *dt* argument is ignored. The return value is a [`timedelta`](#datetime.timedelta)
instance equal to the difference between the local time and UTC.

#### Versionchanged
Changed in version 3.7: The UTC offset is not restricted to a whole number of minutes.

#### timezone.tzname(dt)

Return the fixed value specified when the [`timezone`](#datetime.timezone) instance
is constructed.

If *name* is not provided in the constructor, the name returned by
`tzname(dt)` is generated from the value of the `offset` as follows. If
*offset* is `timedelta(0)`, the name is “UTC”, otherwise it is a string in
the format `UTC±HH:MM`, where ± is the sign of `offset`, HH and MM are
two digits of `offset.hours` and `offset.minutes` respectively.

#### Versionchanged
Changed in version 3.6: Name generated from `offset=timedelta(0)` is now plain `'UTC'`, not
`'UTC+00:00'`.

#### timezone.dst(dt)

Always returns `None`.

#### timezone.fromutc(dt)

Return `dt + offset`. The *dt* argument must be an aware
[`datetime`](#datetime.datetime) instance, with `tzinfo` set to `self`.

Class attributes:

#### timezone.utc

The UTC time zone, `timezone(timedelta(0))`.

<a id="index-0"></a>

<a id="strftime-strptime-behavior"></a>

## `strftime()` and `strptime()` behavior

[`date`](#datetime.date), [`datetime`](#datetime.datetime), and [`time`](#datetime.time) objects all support a
`strftime(format)` method, to create a string representing the time under the
control of an explicit format string.

Conversely, the [`date.strptime()`](#datetime.date.strptime), [`datetime.strptime()`](#datetime.datetime.strptime) and
[`time.strptime()`](time.md#time.strptime) class methods create an object from a string
representing the time and a corresponding format string.

The table below provides a high-level comparison of [`strftime()`](#datetime.datetime.strftime)
versus [`strptime()`](#datetime.datetime.strptime):

|                | `strftime`                                             | `strptime`                                                 |
|----------------|--------------------------------------------------------|------------------------------------------------------------|
| Usage          | Convert object to a string according to a given format | Parse a string into an object given a corresponding format |
| Type of method | Instance method                                        | Class method                                               |
| Signature      | `strftime(format)`                                     | `strptime(date_string, format)`                            |
> <a id="format-codes"></a>

### `strftime()` and `strptime()` format codes

These methods accept format codes that can be used to parse and format dates:

```python3
>>> import datetime as dt
>>> dt.datetime.strptime('31/01/22 23:59:59.999999',
...                      '%d/%m/%y %H:%M:%S.%f')
datetime.datetime(2022, 1, 31, 23, 59, 59, 999999)
>>> _.strftime('%a %d %b %Y, %I:%M%p')
'Mon 31 Jan 2022, 11:59PM'
```

The following is a list of all the format codes that the 2011 C standard
requires, and these work on all supported platforms.

| Directive   | Meaning                                                                                                                                                                                                  | Example                                                                                                      | Notes         |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|---------------|
| `%a`        | Weekday as locale’s<br/>abbreviated name.                                                                                                                                                                | Sun, Mon, …, Sat<br/>(en_US);<br/><br/><br/>So, Mo, …, Sa<br/>(de_DE)<br/><br/>                              | (1)           |
| `%A`        | Weekday as locale’s full name.                                                                                                                                                                           | Sunday, Monday, …,<br/>Saturday (en_US);<br/><br/><br/>Sonntag, Montag, …,<br/>Samstag (de_DE)<br/><br/>     | (1)           |
| `%b`        | Month as locale’s abbreviated<br/>name.                                                                                                                                                                  | Jan, Feb, …, Dec<br/>(en_US);<br/><br/><br/>Jan, Feb, …, Dez<br/>(de_DE)<br/><br/>                           | (1)           |
| `%B`        | Month as locale’s full name.                                                                                                                                                                             | January, February,<br/>…, December (en_US);<br/><br/><br/>Januar, Februar, …,<br/>Dezember (de_DE)<br/><br/> | (1)           |
| `%c`        | Locale’s appropriate date and<br/>time representation.                                                                                                                                                   | Tue Aug 16 21:30:00<br/>1988 (en_US);<br/><br/><br/>Di 16 Aug 21:30:00<br/>1988 (de_DE)<br/><br/>            | (1)           |
| `%C`        | The year divided by 100 and<br/>truncated to an integer as a<br/>zero-padded decimal number.                                                                                                             | 01, 02, …, 99                                                                                                | (0)           |
| `%d`        | Day of the month as a<br/>zero-padded decimal number.                                                                                                                                                    | 01, 02, …, 31                                                                                                | (9),<br/>(10) |
| `%D`        | Equivalent to `%m/%d/%y`.                                                                                                                                                                                | 11/28/25                                                                                                     | (9)           |
| `%e`        | The day of the month as a<br/>space-padded decimal number.                                                                                                                                               | ␣1, ␣2, …, 31                                                                                                | (10)          |
| `%F`        | Equivalent to `%Y-%m-%d`,<br/>the ISO 8601 format.                                                                                                                                                       | 2025-10-11,<br/>1001-12-30                                                                                   |               |
| `%g`        | Last 2 digits of ISO 8601 year<br/>representing the year that<br/>contains the greater part of<br/>the ISO week (`%V`).                                                                                  | 00, 01, …, 99                                                                                                | (0)           |
| `%G`        | ISO 8601 year with century<br/>representing the year that<br/>contains the greater part of<br/>the ISO week (`%V`).                                                                                      | 0001, 0002, …, 2013,<br/>2014, …, 9998, 9999                                                                 | (8)           |
| `%h`        | Equivalent to `%b`.                                                                                                                                                                                      | See `%b`.                                                                                                    | (0)           |
| `%H`        | Hour (24-hour clock) as a<br/>zero-padded decimal number.                                                                                                                                                | 00, 01, …, 23                                                                                                | (9)           |
| `%I`        | Hour (12-hour clock) as a<br/>zero-padded decimal number.                                                                                                                                                | 01, 02, …, 12                                                                                                | (9)           |
| `%j`        | Day of the year as a<br/>zero-padded decimal number.                                                                                                                                                     | 001, 002, …, 366                                                                                             | (9)           |
| `%m`        | Month as a zero-padded<br/>decimal number.                                                                                                                                                               | 01, 02, …, 12                                                                                                | (9)           |
| `%M`        | Minute as a zero-padded<br/>decimal number.                                                                                                                                                              | 00, 01, …, 59                                                                                                | (9)           |
| `%n`        | The newline character<br/>(`'\n'`). For<br/>`strptime()`, zero or<br/>more whitespace.                                                                                                                   | `\n`                                                                                                         |               |
| `%p`        | Locale’s equivalent of either<br/>AM or PM.                                                                                                                                                              | AM, PM (en_US);<br/><br/><br/>am, pm (de_DE)<br/><br/>                                                       | (1),<br/>(3)  |
| `%r`        | Locale’s 12-hour clock time.                                                                                                                                                                             | 12:00:00 AM                                                                                                  | (1),<br/>(0)  |
| `%R`        | Equivalent to `%H:%M`.                                                                                                                                                                                   | 10:01                                                                                                        |               |
| `%S`        | Second as a zero-padded<br/>decimal number.                                                                                                                                                              | 00, 01, …, 59                                                                                                | (4),<br/>(9)  |
| `%t`        | The tab character (`'\t'`).<br/>For `strptime()`,<br/>zero or more whitespace.                                                                                                                           | `\t`                                                                                                         |               |
| `%T`        | ISO 8601 time format,<br/>equivalent to `%H:%M:%S`.                                                                                                                                                      | 10:01:59                                                                                                     |               |
| `%u`        | ISO 8601 weekday as a decimal<br/>number where 1 is Monday.                                                                                                                                              | 1, 2, …, 7                                                                                                   |               |
| `%U`        | Week number of the year<br/>(Sunday as the first day of<br/>the week) as a zero-padded<br/>decimal number. All days in a<br/>new year preceding the first<br/>Sunday are considered to be in<br/>week 0. | 00, 01, …, 53                                                                                                | (7),<br/>(9)  |
| `%V`        | ISO 8601 week as a decimal<br/>number with Monday as<br/>the first day of the week.<br/>Week 01 is the week containing<br/>Jan 4.                                                                        | 01, 02, …, 53                                                                                                | (8),<br/>(9)  |
| `%w`        | Weekday as a decimal number,<br/>where 0 is Sunday and 6 is<br/>Saturday.                                                                                                                                | 0, 1, …, 6                                                                                                   |               |
| `%W`        | Week number of the year<br/>(Monday as the first day of<br/>the week) as a zero-padded<br/>decimal number. All days in a<br/>new year preceding the first<br/>Monday are considered to be in<br/>week 0. | 00, 01, …, 53                                                                                                | (7),<br/>(9)  |
| `%x`        | Locale’s appropriate date<br/>representation.                                                                                                                                                            | 08/16/88 (None);<br/><br/><br/>08/16/1988 (en_US);<br/><br/><br/>16.08.1988 (de_DE)<br/><br/>                | (1)           |
| `%X`        | Locale’s appropriate time<br/>representation.                                                                                                                                                            | 21:30:00 (en_US);<br/><br/><br/>21:30:00 (de_DE)<br/><br/>                                                   | (1)           |
| `%y`        | Year without century as a<br/>zero-padded decimal number.                                                                                                                                                | 00, 01, …, 99                                                                                                | (9)           |
| `%Y`        | Year with century as a decimal<br/>number.                                                                                                                                                               | 0001, 0002, …, 2013,<br/>2014, …, 9998, 9999                                                                 | (2)           |
| `%z`        | UTC offset in the form<br/>`±HHMM[SS[.ffffff]]` (empty<br/>string if the object is<br/>naive).                                                                                                           | (empty), +0000,<br/>-0400, +1030,<br/>+063415,<br/>-030712.345216                                            | (6)           |
| `%Z`        | Time zone name (empty string<br/>if the object is naive).                                                                                                                                                | (empty), UTC, GMT                                                                                            | (6)           |
| `%%`        | A literal `'%'` character.                                                                                                                                                                               | %                                                                                                            |               |

The ISO 8601 year and ISO 8601 week directives are not interchangeable
with the year and week number directives above. Calling [`strptime()`](#datetime.datetime.strptime) with
incomplete or ambiguous ISO 8601 directives will raise a [`ValueError`](exceptions.md#ValueError).

Several additional directives not required by the C11 standard are included for
convenience.

| Directive   | Meaning                                                                                          | Example                                                                  | Notes   |
|-------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|---------|
| `%f`        | Microsecond as a decimal<br/>number, zero-padded to 6<br/>digits.                                | 000000, 000001, …,<br/>999999                                            | (5)     |
| `%:z`       | UTC offset in the form<br/>`±HH:MM[:SS[.ffffff]]`<br/>(empty string if the object is<br/>naive). | (empty), +00:00,<br/>-04:00, +10:30,<br/>+06:34:15,<br/>-03:07:12.345216 | (6)     |

The full set of format codes supported varies across platforms, because Python
calls the platform C library’s `strftime()` function, and platform
variations are common. To see the full set of format codes supported on your
platform, consult the  documentation. There are also
differences between platforms in handling of unsupported format specifiers.

#### Versionadded
Added in version 3.6: `%G`, `%u` and `%V` were added.

#### Versionadded
Added in version 3.12: `%:z` was added for [`strftime()`](#datetime.datetime.strftime).

#### Versionadded
Added in version 3.15: `%D`, `%F`, `%n`, `%t`, and `%:z` were added for
[`strptime()`](#datetime.datetime.strptime).

### Technical detail

Broadly speaking, `d.strftime(fmt)` acts like the [`time`](time.md#module-time) module’s
`time.strftime(fmt, d.timetuple())` although not all objects support a
[`timetuple()`](#datetime.date.timetuple) method.

For the [`datetime.strptime()`](#datetime.datetime.strptime) and [`date.strptime()`](#datetime.date.strptime) class methods,
the default value is `1900-01-01T00:00:00.000`: any components not specified
in the format string will be pulled from the default value.

#### NOTE
Format strings without separators can be ambiguous for parsing. For
example, with `%Y%m%d`, the string `2026111` may be parsed either as
`2026-11-01` or as `2026-01-11`.
Use separators to ensure the input is parsed as intended.

#### NOTE
When used to parse partial dates lacking a year, [`datetime.strptime()`](#datetime.datetime.strptime)
and [`date.strptime()`](#datetime.date.strptime) will raise when encountering February 29 because
the default year of 1900 is *not* a leap year.  Always add a default leap
year to partial date strings before parsing.

<!-- # doctest seems to turn the warning into an error which makes it
# show up and require matching and prevents the actual interesting
# exception from being raised.
# Manually apply the catch_warnings context manager
import warnings
catch_warnings = warnings.catch_warnings()
catch_warnings.__enter__()
warnings.simplefilter("ignore") -->
<!-- catch_warnings.__exit__() -->
```pycon
>>> import datetime as dt
>>> value = "2/29"
>>> dt.datetime.strptime(value, "%m/%d")
Traceback (most recent call last):
...
ValueError: day 29 must be in range 1..28 for month 2 in year 1900
>>> dt.datetime.strptime(f"1904 {value}", "%Y %m/%d")
datetime.datetime(1904, 2, 29, 0, 0)
```

Using `datetime.strptime(date_string, format)` is equivalent to:

```python3
datetime(*(time.strptime(date_string, format)[0:6]))
```

except when the format includes sub-second components or time zone offset
information, which are supported in `datetime.strptime` but are discarded by
`time.strptime`.

For [`time`](#datetime.time) objects, the format codes for year, month, and day should not
be used, as `time` objects have no such values. If they’re used anyway,
1900 is substituted for the year, and 1 for the month and day.

For [`date`](#datetime.date) objects, the format codes for hours, minutes, seconds, and
microseconds should not be used, as [`date`](#datetime.date) objects have no such
values. If they’re used anyway, 0 is substituted for them.

For the same reason, handling of format strings containing Unicode code points
that can’t be represented in the charset of the current locale is also
platform-dependent. On some platforms such code points are preserved intact in
the output, while on others `strftime` may raise [`UnicodeError`](exceptions.md#UnicodeError) or return
an empty string instead.

Notes:

1. This format code is currently unsupported by [`strptime()`](#datetime.datetime.strptime).
2. Because the format depends on the current locale, care should be taken when
   making assumptions about the output value. Field orderings will vary (for
   example, “month/day/year” versus “day/month/year”), and the output may
   contain non-ASCII characters.
3. The [`strptime()`](#datetime.datetime.strptime) method can parse years in the full [1, 9999] range, but
   years < 1000 must be zero-filled to 4-digit width.

   #### Versionchanged
   Changed in version 3.2: In previous versions, [`strftime()`](#datetime.datetime.strftime) method was restricted to
   years >= 1900.

   #### Versionchanged
   Changed in version 3.3: In version 3.2, [`strftime()`](#datetime.datetime.strftime) method was restricted to
   years >= 1000.
4. When used with the [`strptime()`](#datetime.datetime.strptime) method, the `%p` directive only affects
   the output hour field if the `%I` directive is used to parse the hour.
5. Unlike the [`time`](time.md#module-time) module, the `datetime` module does not support
   leap seconds.
6. When used with the [`strptime()`](#datetime.datetime.strptime) method, the `%f` directive
   accepts from one to six digits and zero pads on the right. `%f` is
   an extension to the set of format characters in the C standard (but
   implemented separately in datetime objects, and therefore always
   available).
7. For a naive object, the `%z`, `%:z` and `%Z` format codes are replaced
   by empty strings.

   For an aware object:

   `%z`
   : [`utcoffset()`](#datetime.datetime.utcoffset) is transformed into a string of the form
     `±HHMM[SS[.ffffff]]`, where `HH` is a 2-digit string giving the number
     of UTC offset hours, `MM` is a 2-digit string giving the number of UTC
     offset minutes, `SS` is a 2-digit string giving the number of UTC offset
     seconds and `ffffff` is a 6-digit string giving the number of UTC
     offset microseconds. The `ffffff` part is omitted when the offset is a
     whole number of seconds and both the `ffffff` and the `SS` part is
     omitted when the offset is a whole number of minutes. For example, if
     [`utcoffset()`](#datetime.datetime.utcoffset) returns `timedelta(hours=-3, minutes=-30)`, `%z` is
     replaced with the string `'-0330'`.

   #### Versionchanged
   Changed in version 3.7: The UTC offset is not restricted to a whole number of minutes.

   #### Versionchanged
   Changed in version 3.7: When the `%z` directive is provided to the  [`strptime()`](#datetime.datetime.strptime) method,
   the UTC offsets can have a colon as a separator between hours, minutes
   and seconds.
   For example, both `'+010000'` and `'+01:00:00'` will be parsed as an offset
   of one hour. In addition, providing `'Z'` is identical to `'+00:00'`.

   `%:z`
   : When used with [`strftime()`](#datetime.datetime.strftime), behaves exactly as `%z`,
     except that a colon separator is added between hours, minutes and seconds.
     <br/>
     When used with [`strptime()`](#datetime.datetime.strptime), the UTC offset is *required*
     to have a colon as a separator between hours, minutes and seconds.
     For example, `'+01:00:00'` (but *not* `'+010000'`) will be parsed as
     an offset of one hour. In addition, providing `'Z'` is identical to
     `'+00:00'`.

   `%Z`
   : In [`strftime()`](#datetime.datetime.strftime), `%Z` is replaced by an empty string if
     [`tzname()`](#datetime.datetime.tzname) returns `None`; otherwise `%Z` is replaced by the
     returned value, which must be a string.
     <br/>
     [`strptime()`](#datetime.datetime.strptime) only accepts certain values for `%Z`:
     1. any value in `time.tzname` for your machine’s locale
     2. the hard-coded values `UTC` and `GMT`
     <br/>
     So someone living in Japan may have `JST`, `UTC`, and `GMT` as
     valid values, but probably not `EST`. It will raise `ValueError` for
     invalid values.

   #### Versionchanged
   Changed in version 3.2: When the `%z` directive is provided to the [`strptime()`](#datetime.datetime.strptime) method, an
   aware [`datetime`](#datetime.datetime) object will be produced. The `tzinfo` of the
   result will be set to a [`timezone`](#datetime.timezone) instance.
8. When used with the [`strptime()`](#datetime.datetime.strptime) method, `%U` and `%W` are only used
   in calculations when the day of the week and the calendar year (`%Y`)
   are specified.
9. Similar to `%U` and `%W`, `%V` is only used in calculations when the
   day of the week and the ISO year (`%G`) are specified in a
   [`strptime()`](#datetime.datetime.strptime) format string. Also note that `%G` and `%Y` are not
   interchangeable.
10. When used with the [`strptime()`](#datetime.datetime.strptime) method, the leading zero is optional
    for  formats `%d`, `%m`, `%H`, `%I`, `%M`, `%S`, `%j`, `%U`,
    `%W`, and `%V`. Format `%y` does require a leading zero.
11. When parsing a month and day using [`strptime()`](#datetime.datetime.strptime), always
    include a year in the format.  If the value you need to parse lacks a year,
    append an explicit dummy leap year.  Otherwise your code will raise an
    exception when it encounters leap day because the default year used by the
    parser (1900) is not a leap year.  Users run into that bug every leap year.
    ```pycon
    >>> month_day = "02/29"
    >>> dt.datetime.strptime(f"{month_day};1984", "%m/%d;%Y")  # No leap year bug.
    datetime.datetime(1984, 2, 29, 0, 0)
    ```

    #### Versionchanged
    Changed in version 3.15: Using `%d` without a year now raises [`ValueError`](exceptions.md#ValueError).

    #### Deprecated-removed
    Deprecated since version 3.15, will be removed in version 3.17: [`strptime()`](#datetime.datetime.strptime) calls using a format string containing
    `%e` without a year now emit a [`DeprecationWarning`](exceptions.md#DeprecationWarning).

### Footnotes

* <a id='id4'>**[1]**</a> If, that is, we ignore the effects of relativity.
* <a id='id5'>**[2]**</a> This matches the definition of the “proleptic Gregorian” calendar in Dershowitz and Reingold’s book *Calendrical Calculations*, where it’s the base calendar for all computations. See the book for algorithms for converting between proleptic Gregorian ordinals and many other calendar systems.
* <a id='id6'>**[3]**</a> See R. H. van Gent’s [guide to the mathematics of the ISO 8601 calendar](https://web.archive.org/web/20220531051136/https://webspace.science.uu.nl/~gent0113/calendar/isocalendar.htm) for a good explanation.
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

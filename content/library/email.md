# `email` — An email and MIME handling package

**Source code:** [Lib/email/_\_init_\_.py](https://github.com/python/cpython/tree/main/Lib/email/__init__.py)

---

The `email` package is a library for managing email messages.  It is
specifically *not* designed to do any sending of email messages to SMTP
([**RFC 2821**](https://datatracker.ietf.org/doc/html/rfc2821.html)), NNTP, or other servers; those are functions of modules such as
[`smtplib`](smtplib.md#module-smtplib).  The `email` package attempts to be as
RFC-compliant as possible, supporting [**RFC 5322**](https://datatracker.ietf.org/doc/html/rfc5322.html) and [**RFC 6532**](https://datatracker.ietf.org/doc/html/rfc6532.html), as well as
such MIME-related RFCs as [**RFC 2045**](https://datatracker.ietf.org/doc/html/rfc2045.html), [**RFC 2046**](https://datatracker.ietf.org/doc/html/rfc2046.html), [**RFC 2047**](https://datatracker.ietf.org/doc/html/rfc2047.html), [**RFC 2183**](https://datatracker.ietf.org/doc/html/rfc2183.html),
and [**RFC 2231**](https://datatracker.ietf.org/doc/html/rfc2231.html).

The overall structure of the email package can be divided into three major
components, plus a fourth component that controls the behavior of the other
components.

The central component of the package is an “object model” that represents email
messages.  An application interacts with the package primarily through the
object model interface defined in the [`message`](email.message.md#module-email.message) sub-module.  The
application can use this API to ask questions about an existing email, to
construct a new email, or to add or remove email subcomponents that themselves
use the same object model interface.  That is, following the nature of email
messages and their MIME subcomponents, the email object model is a tree
structure of objects that all provide the [`EmailMessage`](email.message.md#email.message.EmailMessage)
API.

The other two major components of the package are the [`parser`](email.parser.md#module-email.parser) and
the [`generator`](email.generator.md#module-email.generator).  The parser takes the serialized version of an
email message (a stream of bytes) and converts it into a tree of
[`EmailMessage`](email.message.md#email.message.EmailMessage) objects.  The generator takes an
[`EmailMessage`](email.message.md#email.message.EmailMessage) and turns it back into a serialized byte
stream.  (The parser and generator also handle streams of text characters, but
this usage is discouraged as it is too easy to end up with messages that are
not valid in one way or another.)

The control component is the [`policy`](email.policy.md#module-email.policy) module.  Every
[`EmailMessage`](email.message.md#email.message.EmailMessage), every [`generator`](email.generator.md#module-email.generator), and every
[`parser`](email.parser.md#module-email.parser) has an associated [`policy`](email.policy.md#module-email.policy) object that
controls its behavior.  Usually an application only needs to specify the policy
when an [`EmailMessage`](email.message.md#email.message.EmailMessage) is created, either by directly
instantiating an [`EmailMessage`](email.message.md#email.message.EmailMessage)  to create a new email,
or by parsing an input stream using a [`parser`](email.parser.md#module-email.parser).  But the policy can
be changed when the message is serialized using a [`generator`](email.generator.md#module-email.generator).
This allows, for example, a generic email message to be parsed from disk, but
to serialize it using standard SMTP settings when sending it to an email
server.

The email package does its best to hide the details of the various governing
RFCs from the application.  Conceptually the application should be able to
treat the email message as a structured tree of unicode text and binary
attachments, without having to worry about how these are represented when
serialized.  In practice, however, it is often necessary to be aware of at
least some of the rules governing MIME messages and their structure,
specifically the names and nature of the MIME “content types” and how they
identify multipart documents.  For the most part this knowledge should only be
required for more complex applications, and even then it should only be the
high level structure in question, and not the details of how those structures
are represented.  Since MIME content types are used widely in modern internet
software (not just email), this will be a familiar concept to many programmers.

The following sections describe the functionality of the `email` package.
We start with the [`message`](email.message.md#module-email.message) object model, which is the primary
interface an application will use, and follow that with the
[`parser`](email.parser.md#module-email.parser) and [`generator`](email.generator.md#module-email.generator) components.  Then we cover the
[`policy`](email.policy.md#module-email.policy) controls, which completes the treatment of the main
components of the library.

The next three sections cover the exceptions the package may raise and the
defects (non-compliance with the RFCs) that the [`parser`](email.parser.md#module-email.parser) may
detect.  Then we cover the [`headerregistry`](email.headerregistry.md#module-email.headerregistry) and the
[`contentmanager`](email.contentmanager.md#module-email.contentmanager) sub-components, which provide tools for doing more
detailed manipulation of headers and payloads, respectively.  Both of these
components contain features relevant to consuming and producing non-trivial
messages, but also document their extensibility APIs, which will be of interest
to advanced applications.

Following those is a set of examples of using the fundamental parts of the APIs
covered in the preceding sections.

The foregoing represent the modern (unicode friendly) API of the email package.
The remaining sections, starting with the [`Message`](email.compat32-message.md#email.message.Message)
class, cover the legacy [`compat32`](email.policy.md#email.policy.compat32) API that deals much more
directly with the details of how email messages are represented.  The
[`compat32`](email.policy.md#email.policy.compat32) API does *not* hide the details of the RFCs from
the application, but for applications that need to operate at that level, they
can be useful tools.  This documentation is also relevant for applications that
are still using the [`compat32`](email.policy.md#email.policy.compat32) API for backward
compatibility reasons.

#### Versionchanged
Changed in version 3.6: Docs reorganized and rewritten to promote the new
[`EmailMessage`](email.message.md#email.message.EmailMessage)/[`EmailPolicy`](email.policy.md#email.policy.EmailPolicy)
API.

Contents of the `email` package documentation:

* [`email.message`: Representing an email message](email.message.md)
* [`email.parser`: Parsing email messages](email.parser.md)
  * [FeedParser API](email.parser.md#feedparser-api)
  * [Parser API](email.parser.md#parser-api)
  * [Additional notes](email.parser.md#additional-notes)
* [`email.generator`: Generating MIME documents](email.generator.md)
* [`email.policy`: Policy Objects](email.policy.md)
* [`email.errors`: Exception and Defect classes](email.errors.md)
* [`email.headerregistry`: Custom Header Objects](email.headerregistry.md)
* [`email.contentmanager`: Managing MIME Content](email.contentmanager.md)
  * [Content Manager Instances](email.contentmanager.md#content-manager-instances)
* [`email`: Examples](email.examples.md)

Legacy API:

* [`email.message.Message`: Representing an email message using the `compat32` API](email.compat32-message.md)
* [`email.mime`: Creating email and MIME objects from scratch](email.mime.md)
* [`email.header`: Internationalized headers](email.header.md)
* [`email.charset`: Representing character sets](email.charset.md)
* [`email.encoders`: Encoders](email.encoders.md)
* [`email.utils`: Miscellaneous utilities](email.utils.md)
* [`email.iterators`: Iterators](email.iterators.md)

#### SEE ALSO
Module [`smtplib`](smtplib.md#module-smtplib)
: SMTP (Simple Mail Transport Protocol) client

Module [`poplib`](poplib.md#module-poplib)
: POP (Post Office Protocol) client

Module [`imaplib`](imaplib.md#module-imaplib)
: IMAP (Internet Message Access Protocol) client

Module [`mailbox`](mailbox.md#module-mailbox)
: Tools for creating, reading, and managing collections of messages on disk
  using a variety standard formats.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

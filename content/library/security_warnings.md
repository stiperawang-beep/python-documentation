<a id="security-warnings"></a>

<a id="index-0"></a>

# Security Considerations

The following modules have specific security considerations:

* [`base64`](base64.md#module-base64): [base64 security considerations](base64.md#base64-security) in
  [**RFC 4648**](https://datatracker.ietf.org/doc/html/rfc4648.html)
* [`hashlib`](hashlib.md#module-hashlib): [all constructors take a “usedforsecurity” keyword-only
  argument disabling known insecure and blocked algorithms](hashlib.md#hashlib-usedforsecurity)
* [`http.server`](http.server.md#module-http.server) is not suitable for production use, only implementing
  basic security checks. See the [security considerations](http.server.md#http-server-security).
* [`logging`](logging.md#module-logging): [Logging configuration uses eval()](logging.config.md#logging-eval-security)
* [`multiprocessing`](multiprocessing.md#module-multiprocessing): [Connection.recv() uses pickle](multiprocessing.md#multiprocessing-recv-pickle-security)
* [`pickle`](pickle.md#module-pickle): [Restricting globals in pickle](pickle.md#pickle-restrict)
* [`random`](random.md#module-random) shouldn’t be used for security purposes, use [`secrets`](secrets.md#module-secrets)
  instead
* [`shelve`](shelve.md#module-shelve): [shelve is based on pickle and thus unsuitable for
  dealing with untrusted sources](shelve.md#shelve-security)
* [`ssl`](ssl.md#module-ssl): [SSL/TLS security considerations](ssl.md#ssl-security)
* [`subprocess`](subprocess.md#module-subprocess): [Subprocess security considerations](subprocess.md#subprocess-security)
* [`tempfile`](tempfile.md#module-tempfile): [mktemp is deprecated due to vulnerability to race
  conditions](tempfile.md#tempfile-mktemp-deprecated)
* [`xml`](xml.md#module-xml): [XML security](xml.md#xml-security)
* [`zipfile`](zipfile.md#module-zipfile): [maliciously prepared .zip files can cause disk volume
  exhaustion](zipfile.md#zipfile-resources-limitations)

The [`-I`](../using/cmdline.md#cmdoption-I) command line option can be used to run Python in isolated
mode. When it cannot be used, the [`-P`](../using/cmdline.md#cmdoption-P) option or the
[`PYTHONSAFEPATH`](../using/cmdline.md#envvar-PYTHONSAFEPATH) environment variable can be used to not prepend a
potentially unsafe path to [`sys.path`](sys.md#sys.path) such as the current directory, the
script’s directory or an empty string.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->

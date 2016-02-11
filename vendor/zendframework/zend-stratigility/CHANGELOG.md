# Changelog

All notable changes to this project will be documented in this file, in reverse chronological order by release.

Versions prior to 1.0 were originally released as `phly/conduit`; please visit
its [CHANGELOG](https://github.com/phly/conduit/blob/master/CHANGELOG.md) for
details.

## 1.1.2 - 2015-10-09

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#32](https://github.com/zendframework/zend-stratigility/pull/32) updates the
  request and response typehints in `Zend\Stratigility\Dispatch` to use the
  corresponding PSR-7 interfaces, instead of the Stratigility-specific
  decorators. This fixes issues when calling `$next()` with non-Stratigility
  instances of either.

## 1.1.1 - 2015-08-25

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#25](https://github.com/zendframework/zend-stratigility/pull/25) modifies the
  constructor of `Next` to clone the incoming `SplQueue` instance, ensuring the
  original can be re-used for subsequent invocations (e.g., within an async
  listener environment such as React).

## 1.1.0 - 2015-06-25

### Added

- [#13](https://github.com/zendframework/zend-stratigility/pull/13) adds
  `Utils::getStatusCode($error, ResponseInterface $response)`; this static
  method will attempt to use an exception code as an HTTP status code, if it
  falls in a valid HTTP error status range. If the error is not an exception, it
  ensures that the status code is an error status.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#12](https://github.com/zendframework/zend-stratigility/pull/12) updates
  `FinalHandler` such that it will return the response provided at invocation
  if it differs from the response at initialization (i.e., a new response
  instance, or if the body size has changed). This allows you to safely call
  `$next()` from all middleware in order to allow post-processing.

## 1.0.2 - 2015-06-24

### Added

- [#14](https://github.com/zendframework/zend-stratigility/pull/14) adds
  [bookdown](http://bookdown.io) documentation.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

## 1.0.1 - 2015-06-16

### Added

- [#8](https://github.com/zendframework/zend-stratigility/pull/8) adds a
  `phpcs.xml` PHPCS configuration file, allowing execution of each of `phpcs`
  and `phpcbf` without arguments.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#7](https://github.com/zendframework/zend-stratigility/pull/7) ensures that
  arity checks on PHP callables in array format (`[$instance, $method]`,
  `['ClassName', 'method']`) work, as well as on static methods using the string
  syntax (`'ClassName::method'`). This allows them to be used without issue as
  middleware handlers.

## 1.0.0 - 2015-05-14

First stable release, and first relase as `zend-stratigility`.

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- Nothing.

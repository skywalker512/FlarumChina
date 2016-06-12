# Changelog

All notable changes to this project will be documented in this file, in reverse chronological order by release.

Versions prior to 1.0 were originally released as `phly/conduit`; please visit
its [CHANGELOG](https://github.com/phly/conduit/blob/master/CHANGELOG.md) for
details.

## 1.2.1 - 2016-03-24

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#52](https://github.com/zendframework/zend-stratigility/pull/52) fixes the
  behavior of the `FinalHandler` with regards to exception handling, ensuring
  that the reason phrase reported corresponds to the HTTP status code used.
- [#54](https://github.com/zendframework/zend-stratigility/pull/54) modifies the
  behavior of the `FinalHandler` when creating an error or 404 response to call
  `write()` instead of `end()` on the response object. This fixes a lingering
  issue with emitting the `Content-Length` header from the `SapiEmitter`, as
  well as prevents the `SapiEmitter` from raising exceptions when doing so
  (which was happening starting with 1.2.0).

## 1.2.0 - 2016-03-17

This release contains two potential backwards compatibility breaks:

- In versions prior to 1.2.0, after `Zend\Stratigility\Http\Response::end()` was
  called, `with*()` operations were performed as no-ops, which led to
  hard-to-detect errors. Starting with 1.2.0, they now raise a
  `RuntimeException`.

- In versions prior to 1.2.0, `Zend\Stratigility\FinalHandler` always provided
  exception details in the response payload for errors. Starting with 1.2.0, it
  only does so if not in a production environment (which is the default
  environment).

### Added

- [#36](https://github.com/zendframework/zend-stratigility/pull/36) adds a new
  `InvalidMiddlewareException`, with the static factory `fromValue()` that
  provides an exception message detailing the invalid type. `MiddlewarePipe` now
  throws this exception from the `pipe()` method when a non-callable value is
  provided.
- [#46](https://github.com/zendframework/zend-stratigility/pull/46) adds
  `FinalHandler::setOriginalResponse()`, allowing you to alter the response used
  for comparisons when the `FinalHandler` is invoked.
- [#37](https://github.com/zendframework/zend-stratigility/pull/37) and
  [#49](https://github.com/zendframework/zend-stratigility/pull/49) add
  support in `Zend\Stratigility\Dispatch` to catch PHP 7 `Throwable`s.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#30](https://github.com/zendframework/zend-stratigility/pull/30) updates the
  `Response` implementation to raise exceptions from `with*()` methods if they
  are called after `end()`.
- [#46](https://github.com/zendframework/zend-stratigility/pull/46) fixes the
  behavior of `FinalHandler::handleError()` to only display exception details
  when not in production environments, and changes the default environment to
  production.

## 1.1.3 - 2016-03-17

### Added

- Nothing.

### Deprecated

- Nothing.

### Removed

- Nothing.

### Fixed

- [#39](https://github.com/zendframework/zend-stratigility/pull/39) updates the
  FinalHandler to ensure that emitted exception messages include previous
  exceptions.

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

# API Reference

The following make up the primary API of Stratigility.

## Middleware

`Zend\Stratigility\MiddlewarePipe` is the primary application interface, and has been discussed
previously. Its API is:

```php
class MiddlewarePipe implements MiddlewareInterface
{
    public function pipe($path, $middleware = null);
    public function __invoke(
        Psr\Http\Message\ServerRequestInterface $request = null,
        Psr\Http\Message\ResponseInterface $response = null,
        callable $out = null
    );
}
```

`pipe()` takes up to two arguments. If only one argument is provided, `$middleware` will be assigned
that value, and `$path` will be re-assigned to the value `/`; this is an indication that the
`$middleware` should be invoked for any path. If `$path` is provided, the `$middleware` will only be
executed for that path and any subpaths.

Middleware is executed in the order in which it is piped to the `MiddlewarePipe` instance.

`__invoke()` is itself middleware. If `$out` is not provided, an instance of
`Zend\Stratigility\FinalHandler` will be created, and used in the event that the pipe stack is
exhausted (`MiddlewarePipe` passes the `$response` instance it receives to `FinalHandler` as well,
so that the latter can determine if the response it receives is new).

The callable should use the same signature as `Next()`:

```php
function (
    Psr\Http\Message\ServerRequestInterface $request,
    Psr\Http\Message\ResponseInterface $response,
    $err = null
) {
}
```

Internally, `MiddlewarePipe` creates an instance of `Zend\Stratigility\Next`, feeding it its queue,
executes it, and returns a response.

## Next

`Zend\Stratigility\Next` is primarily an implementation detail of middleware, and exists to allow
delegating to middleware registered later in the stack. It is implemented as a functor.

Because `Psr\Http\Message`'s interfaces are immutable, if you make changes to your Request and/or
Response instances, you will have new instances, and will need to make these known to the next
middleware in the chain. `Next` expects these arguments for every invocation. Additionally, if an
error condition has occurred, you may pass an optional third argument, `$err`, representing the
error condition.

```php
class Next
{
    public function __invoke(
        Psr\Http\Message\ServerRequestInterface $request,
        Psr\Http\Message\ResponseInterface $response,
        $err = null
    );
}
```

You should **always** either capture or return the return value of `$next()` when calling it in your
application. The expected return value is a response instance, but if it is not, you may want to
return the response provided to you.

As examples:

### Providing an altered request:

```php
function ($request, $response, $next) use ($bodyParser)
{
    $bodyParams = $bodyParser($request);
    return $next(
        $request->withBodyParams($bodyParams), // Next will pass the new
        $response                              // request instance
    );
}
```

### Providing an altered response:

```php
function ($request, $response, $next)
{
    $updated = $response->addHeader('Cache-Control', [
        'public',
        'max-age=18600',
        's-maxage=18600',
    ]);
    return $next(
        $request,
        $updated
    );
}
```

### Providing both an altered request and response:

```php
function ($request, $response, $next) use ($bodyParser)
{
    $updated = $response->addHeader('Cache-Control', [
        'public',
        'max-age=18600',
        's-maxage=18600',
    ]);
    return $next(
        $request->withBodyParams($bodyParser($request)),
        $updated
    );
}
```

### Returning a response to complete the request

If you have no changes to the response, and do not want further middleware in the pipeline to
execute, do not call `$next()` and simply return from your middleware. However, it's almost always
better and more predictable to return the response instance, as this will ensure it propagates back
up to all callers.

```php
function ($request, $response, $next)
{
    $response = $response->addHeader('Cache-Control', [
        'public',
        'max-age=18600',
        's-maxage=18600',
    ]);
    return $response;
}
```

One caveat: if you are in a nested middleware or not the first in the stack, all parent and/or
previous middleware must also call `return $next(/* ... */)` for this to work correctly.

As such, _we recommend always returning `$next()` when invoking it in your middleware_:

```php
return $next(/* ... */);
```

And, if not calling `$next()`, returning the response instance:

```php
return $response;
```

The `FinalHandler` implementation will check the `$response` instance passed when invoking it
against the instance passed during instantiation, and, if different, return it. As such, `return
$next(/* ... */)` is the recommended workflow.

### Raising an error condition

To raise an error condition, pass a non-null value as the third argument to `$next()`:

```php
function ($request, $response, $next)
{
    try {
        // try some operation...
    } catch (Exception $e) {
        return $next($request, $response, $e); // Next registered error middleware will be invoked
    }
}
```

## FinalHandler

`Zend\Stratigility\FinalHandler` is a default implementation of middleware to execute when the stack
exhausts itself. It expects three arguments when invoked: a request instance, a response instance,
and an error condition (or `null` for no error). It returns a response.

`FinalHandler` allows two optional arguments during instantiation

- `$options`, an array of options with which to configure itself. These options currently include:
  - `env`, the application environment. If set to "production", no stack traces will be provided.
  - `onerror`, a callable to execute if an error is passed when `FinalHandler` is invoked. The
    callable is invoked with the error (which will be `null` in the absence of an error), the request,
    and the response, in that order.
- `Psr\Http\Message\ResponseInterface $response`; if passed, it will compare the response passed
  during invocation against this instance; if they are different, it will return the response from
  the invocation, as this indicates that one or more middleware provided a new response instance.

Internally, `FinalHandler` does the following on invocation:

- If `$error` is non-`null`, it creates an error response from the response provided at invocation,
  ensuring a 400 or 500 series response is returned.
- If the response at invocation matches the response provided at instantiation, it returns it
  without further changes. This is an indication that some middleware at some point in the execution
  chain called `$next()` with a new response instance.
- If the response at invocation does not match the response provided at instantiation, or if no
  response was provided at instantiation, it creates a 404 response, as the assumption is that no
  middleware was capable of handling the request.

## HTTP Messages

### Zend\Stratigility\Http\Request

`Zend\Stratigility\Http\Request` acts as a decorator for a `Psr\Http\Message\ServerRequestInterface`
instance. The primary reason is to allow composing middleware such that you always have access to
the original request instance.

As an example, consider the following:

```php
$app1 = new Middleware();
$app1->pipe('/foo', $fooCallback);

$app2 = new Middleware();
$app2->pipe('/root', $app1);

$server = Server::createServer($app2 /* ... */);
```

In the above, if the URI of the original incoming request is `/root/foo`, what `$fooCallback` will
receive is a URI with a past consisting of only `/foo`. This practice ensures that middleware can be
nested safely and resolve regardless of the nesting level.

If you want access to the full URI — for instance, to construct a fully qualified URI to your
current middleware — `Zend\Stratigility\Http\Request` contains a method, `getOriginalRequest()`,
which will always return the original request provided to the application:

```php
function ($request, $response, $next)
{
    $location = $request->getOriginalRequest()->getUri()->getPath() . '/[:id]';
    $response = $response->setHeader('Location', $location);
    $response = $response->setStatus(302);
    return $response;
}
```

### Zend\Stratigility\Http\Response

`Zend\Stratigility\Http\Response` acts as a decorator for a `Psr\Http\Message\ResponseInterface`
instance, and also implements `Zend\Stratigility\Http\ResponseInterface`, which provides the
following convenience methods:

- `write()`, which proxies to the `write()` method of the composed response stream.
- `end()`, which marks the response as complete; it can take an optional argument, which, when
  provided, will be passed to the `write()` method. Once `end()` has been called, the response is
  immutable and will throw an exception if a state mutating method like `withHeader` is called.
- `isComplete()` indicates whether or not `end()` has been called.

Additionally, it provides access to the original response created by the server via the method
`getOriginalResponse()`.

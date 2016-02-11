# Error Handlers

To handle errors, you can write middleware that accepts **exactly** four arguments:

```php
function ($error, $request, $response, $next) { }
```

Alternately, you can implement `Zend\Stratigility\ErrorMiddlewareInterface`.

When using `MiddlewarePipe`, as the queue is executed, if `$next()` is called with an argument, or
if an exception is thrown, middleware will iterate through the queue until the first such error
handler is found. That error handler can either complete the request, or itself call `$next()`.
**Error handlers that call `$next()` SHOULD call it with the error it received itself, or with
another error.**

Error handlers are usually attached at the end of middleware, to prevent attempts at executing
non-error-handling middleware, and to ensure they can intercept errors from any other handlers.

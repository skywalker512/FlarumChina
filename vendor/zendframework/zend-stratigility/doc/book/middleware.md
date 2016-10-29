# Middleware

What is middleware?

Middleware is code that exists between the request and response, and which can take the incoming
request, perform actions based on it, and either complete the response or pass delegation on to the
next middleware in the queue.

```php
use Zend\Stratigility\MiddlewarePipe;
use Zend\Diactoros\Server;

require __DIR__ . '/../vendor/autoload.php';

$app    = new MiddlewarePipe();
$server = Server::createServer($app, $_SERVER, $_GET, $_POST, $_COOKIE, $_FILES);

// Landing page
$app->pipe('/', function ($req, $res, $next) {
    if (! in_array($req->getUri()->getPath(), ['/', ''], true)) {
        return $next($req, $res);
    }
    return $res->end('Hello world!');
});

// Another page
$app->pipe('/foo', function ($req, $res, $next) {
    return $res->end('FOO!');
});

$server->listen();
```

In the above example, we have two examples of middleware. The first is a landing page, and listens
at the root path. If the request path is empty or `/`, it completes the response. If it is not, it
delegates to the next middleware in the stack. The second middleware matches on the path `/foo` --
meaning it will match `/foo`, `/foo/`, and any path beneath. In that case, it will complete the
response with its own message. If no paths match at this point, a "final handler" is composed by
default to report 404 status.

So, concisely put, _middleware are PHP callables that accept a request and response object, and do
something with it_.

Middleware can decide more processing can be performed by calling the `$next` callable that is
passed as the third argument. With this paradigm, you can build a workflow engine for handling
requests -- for instance, you could have middleware perform the following:

- Handle authentication details
- Perform content negotiation
- Perform HTTP negotiation
- Route the path to a more appropriate, specific handler

Each middleware can itself be middleware, and can attach to specific paths, allowing you to mix
and match applications under a common domain. As an example, you could put API middleware next to
middleware that serves its documentation, next to middleware that serves files, and segregate each
by URI:

```php
$app->pipe('/api', $apiMiddleware);
$app->pipe('/docs', $apiDocMiddleware);
$app->pipe('/files', $filesMiddleware);
```

The handlers in each middleware attached this way will see a URI with that path segment stripped,
allowing them to be developed separately and re-used under any path you wish.

Within Stratigility, middleware can be:

- Any PHP callable that accepts, minimally, a
  [PSR-7](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-7-http-message.md)
  ServerRequest and Response (in that order), and, optionally, a callable (for invoking the next
  middleware in the queue, if any).
- An object implementing `Zend\Stratigility\MiddlewareInterface`. `Zend\Stratigility\MiddlewarePipe`
  implements this interface.

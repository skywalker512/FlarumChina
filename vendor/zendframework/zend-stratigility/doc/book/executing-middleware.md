# Executing and composing middleware

The easiest way to execute middleware is to write closures and attach them to a
`Zend\Stratigility\MiddlewarePipe` instance. You can nest `MiddlewarePipe` instances to create
groups of related middleware, and attach them using a base path so they only execute if that path is
matched.

```php
$api = new MiddlewarePipe();  // API middleware collection
$api->pipe(/* ... */);        // repeat as necessary

$app = new MiddlewarePipe();  // Middleware representing the application
$app->pipe('/api', $api);     // API middleware attached to the path "/api"
```


Another approach is to extend the `Zend\Stratigility\MiddlewarePipe` class itself, particularly if
you want to allow attaching other middleware to your own middleware. In such a case, you will
generally override the `__invoke()` method to perform any additional logic you have, and then call
on the parent in order to iterate through your stack of middleware:

```php
use Zend\Stratigility\MiddlewarePipe;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

class CustomMiddleware extends MiddlewarePipe
{
    public function __invoke(Request $request, Response $response, callable $next = null)
    {
        // perform some work...

        // delegate to parent
        parent::__invoke($request, $response, $next);

        // maybe do more work?
    }
}
```

Another approach using this method would be to override the constructor to add in specific
middleware, perhaps using configuration provided. In this case, make sure to also call
`parent::__construct()` to ensure the middleware queue is initialized; we recommend doing this as the
first action of the method.

```php
use Zend\Stratigility\MiddlewarePipe;

class CustomMiddleware extends MiddlewarePipe
{
    public function __construct($configuration)
    {
        parent::__construct();

        // do something with configuration ...

        // attach some middleware ...

        $this->pipe(/* some middleware */);
    }
}
```

These approaches are particularly suited for cases where you may want to implement a specific
workflow for an application segment using existing middleware, but do not necessarily want that
middleware applied to all requests in the application.

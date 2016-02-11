<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @see       http://github.com/zendframework/zend-stratigility for the canonical source repository
 * @copyright Copyright (c) 2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   https://github.com/zendframework/zend-stratigility/blob/master/LICENSE.md New BSD License
 */

namespace Zend\Stratigility;

use InvalidArgumentException;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use SplQueue;

/**
 * Pipe middleware like unix pipes.
 *
 * This class implements a pipe-line of middleware, which can be attached using
 * the `pipe()` method, and is itself middleware.
 *
 * The request and response objects are decorated using the Zend\Stratigility\Http
 * variants in this package, ensuring that the request may store arbitrary
 * properties, and the response exposes the convenience `write()`, `end()`, and
 * `isComplete()` methods.
 *
 * It creates an instance of `Next` internally, invoking it with the provided
 * request and response instances; if no `$out` argument is provided, it will
 * create a `FinalHandler` instance and pass that to `Next` as well.
 *
 * Inspired by Sencha Connect.
 *
 * @see https://github.com/sencha/connect
 */
class MiddlewarePipe implements MiddlewareInterface
{
    /**
     * @var SplQueue
     */
    protected $pipeline;

    /**
     * Constructor
     *
     * Initializes the queue.
     */
    public function __construct()
    {
        $this->pipeline = new SplQueue();
    }

    /**
     * Handle a request
     *
     * Takes the pipeline, creates a Next handler, and delegates to the
     * Next handler.
     *
     * If $out is a callable, it is used as the "final handler" when
     * $next has exhausted the pipeline; otherwise, a FinalHandler instance
     * is created and passed to $next during initialization.
     *
     * @param Request $request
     * @param Response $response
     * @param callable $out
     * @return Response
     */
    public function __invoke(Request $request, Response $response, callable $out = null)
    {
        $request  = $this->decorateRequest($request);
        $response = $this->decorateResponse($response);

        $done   = $out ?: new FinalHandler([], $response);
        $next   = new Next($this->pipeline, $done);
        $result = $next($request, $response);

        return ($result instanceof Response ? $result : $response);
    }

    /**
     * Attach middleware to the pipeline.
     *
     * Each middleware can be associated with a particular path; if that
     * path is matched when that middleware is invoked, it will be processed;
     * otherwise it is skipped.
     *
     * No path means it should be executed every request cycle.
     *
     * A handler CAN implement MiddlewareInterface, but MUST be callable.
     *
     * Handlers with arity >= 4 or those implementing ErrorMiddlewareInterface
     * are considered error handlers, and will be executed when a handler calls
     * $next with an error or raises an exception.
     *
     * @see MiddlewareInterface
     * @see ErrorMiddlewareInterface
     * @see Next
     * @param string|callable|object $path Either a URI path prefix, or middleware.
     * @param null|callable|object $middleware Middleware
     * @return self
     */
    public function pipe($path, $middleware = null)
    {
        if (null === $middleware && is_callable($path)) {
            $middleware = $path;
            $path       = '/';
        }

        // Ensure we have a valid handler
        if (! is_callable($middleware)) {
            throw new InvalidArgumentException('Middleware must be callable');
        }

        $this->pipeline->enqueue(new Route(
            $this->normalizePipePath($path),
            $middleware
        ));

        // @todo Trigger event here with route details?
        return $this;
    }

    /**
     * Normalize a path used when defining a pipe
     *
     * Strips trailing slashes, and prepends a slash.
     *
     * @param string $path
     * @return string
     */
    private function normalizePipePath($path)
    {
        // Prepend slash if missing
        if (empty($path) || $path[0] !== '/') {
            $path = '/' . $path;
        }

        // Trim trailing slash if present
        if (strlen($path) > 1 && '/' === substr($path, -1)) {
            $path = rtrim($path, '/');
        }

        return $path;
    }

    /**
     * Decorate the Request instance
     *
     * @param Request $request
     * @return Http\Request
     */
    private function decorateRequest(Request $request)
    {
        if ($request instanceof Http\Request) {
            return $request;
        }

        return new Http\Request($request);
    }

    /**
     * Decorate the Response instance
     *
     * @param Response $response
     * @return Http\Response
     */
    private function decorateResponse(Response $response)
    {
        if ($response instanceof Http\Response) {
            return $response;
        }

        return new Http\Response($response);
    }
}

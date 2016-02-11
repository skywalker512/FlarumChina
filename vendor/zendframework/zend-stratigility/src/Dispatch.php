<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @see       http://github.com/zendframework/zend-stratigility for the canonical source repository
 * @copyright Copyright (c) 2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   https://github.com/zendframework/zend-stratigility/blob/master/LICENSE.md New BSD License
 */

namespace Zend\Stratigility;

use Exception;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Dispatch middleware
 *
 * This class is an implementation detail of Next.
 *
 * @internal
 */
class Dispatch
{
    /**
     * Dispatch middleware
     *
     * Given a route (which contains the handler for given middleware),
     * the $err value passed to $next, $next, and the request and response
     * objects, dispatch a middleware handler.
     *
     * If $err is non-falsy, and the current handler has an arity of 4,
     * it will be dispatched.
     *
     * If $err is falsy, and the current handler has an arity of < 4,
     * it will be dispatched.
     *
     * In all other cases, the handler will be ignored, and $next will be
     * invoked with the current $err value.
     *
     * If an exception is raised when executing the handler, the exception
     * will be assigned as the value of $err, and $next will be invoked
     * with it.
     *
     * @param Route $route
     * @param mixed $err
     * @param ServerRequestInterface $request
     * @param ResponseInterface $response
     * @param callable $next
     */
    public function __invoke(
        Route $route,
        $err,
        ServerRequestInterface $request,
        ResponseInterface $response,
        callable $next
    ) {
        $handler  = $route->handler;
        $hasError = (null !== $err);

        switch (true) {
            case ($handler instanceof ErrorMiddlewareInterface):
                $arity = 4;
                break;
            case ($handler instanceof MiddlewareInterface):
                $arity = 3;
                break;
            default:
                $arity = Utils::getArity($handler);
                break;
        }

        // @todo Trigger event with Route, original URL from request?

        try {
            if ($hasError && $arity === 4) {
                return call_user_func($handler, $err, $request, $response, $next);
            }

            if (! $hasError && $arity < 4) {
                return call_user_func($handler, $request, $response, $next);
            }
        } catch (Exception $e) {
            $err = $e;
        }

        return $next($request, $response, $err);
    }
}

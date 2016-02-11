<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @see       http://github.com/zendframework/zend-stratigility for the canonical source repository
 * @copyright Copyright (c) 2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   https://github.com/zendframework/zend-stratigility/blob/master/LICENSE.md New BSD License
 */

namespace ZendTest\Stratigility;

use PHPUnit_Framework_TestCase as TestCase;
use ReflectionProperty;
use SplQueue;
use Zend\Diactoros\ServerRequest as PsrRequest;
use Zend\Diactoros\Response as PsrResponse;
use Zend\Diactoros\Uri;
use Zend\Stratigility\Http\Request;
use Zend\Stratigility\Http\Response;
use Zend\Stratigility\Next;
use Zend\Stratigility\Route;

class NextTest extends TestCase
{
    public function setUp()
    {
        $psrRequest     = new PsrRequest([], [], 'http://example.com/', 'GET', 'php://memory');
        $this->queue    = new SplQueue();
        $this->request  = new Request($psrRequest);
        $this->response = new Response(new PsrResponse());
    }

    public function testDoneHandlerIsInvokedWhenQueueIsExhausted()
    {
        // e.g., 0 length array, or all handlers call next
        $triggered = null;
        $done = function ($req, $res, $err = null) use (&$triggered) {
            $triggered = true;
        };

        $next = new Next($this->queue, $done);
        $next($this->request, $this->response);
        $this->assertTrue($triggered);
    }

    public function testDoneHandlerReceivesRequestAndResponse()
    {
        // e.g., 0 length array, or all handlers call next
        $phpunit   = $this;
        $request   = $this->request;
        $response  = $this->response;
        $triggered = null;
        $done = function ($req, $res, $err = null) use ($phpunit, $request, $response, &$triggered) {
            $phpunit->assertSame($request, $req);
            $phpunit->assertSame($response, $response);
            $triggered = true;
        };

        $next = new Next($this->queue, $done);
        $next($request, $response);
        $this->assertTrue($triggered);
    }

    public function testInvokesItselfWhenRouteDoesNotMatchCurrentUrl()
    {
        // e.g., handler matches "/foo", but path is "/bar"
        $phpunit = $this;
        $route = new Route('/foo', function ($req, $res, $next) use ($phpunit) {
            $phpunit->fail('Route should not be invoked if path does not match');
        });
        $this->queue->enqueue($route);

        $triggered = null;
        $done = function ($req, $res, $err = null) use (&$triggered) {
            $triggered = true;
        };

        $this->request->withUri(new Uri('http://local.example.com/bar'));

        $next = new Next($this->queue, $done);
        $next($this->request, $this->response);
        $this->assertTrue($triggered);
    }

    public function testInvokesItselfIfRouteDoesNotMatchAtABoundary()
    {
        // e.g., if route is "/foo", but path is "/foobar", no match
        $phpunit = $this;
        $route = new Route('/foo', function ($req, $res, $next) use ($phpunit) {
            $phpunit->fail('Route should not be invoked if path does not match');
        });
        $this->queue->enqueue($route);

        $triggered = null;
        $done = function ($req, $res, $err = null) use (&$triggered) {
            $triggered = true;
        };

        $this->request->withUri(new Uri('http://local.example.com/foobar'));

        $next = new Next($this->queue, $done);
        $next($this->request, $this->response);
        $this->assertTrue($triggered);
    }

    public function testInvokesHandlerWhenMatched()
    {
        // e.g., if route is "/foo", but path is "/foobar", no match
        $triggered = null;
        $route = new Route('/foo', function ($req, $res, $next) use (&$triggered) {
            $triggered = true;
        });
        $this->queue->enqueue($route);

        $phpunit = $this;
        $done = function ($req, $res, $err = null) use ($phpunit) {
            $phpunit->fail('Should not hit done handler');
        };

        $request = $this->request->withUri(new Uri('http://local.example.com/foo'));

        $next = new Next($this->queue, $done);
        $next($request, $this->response);
        $this->assertTrue($triggered);
    }

    public function testRequestUriInInvokedHandlerDoesNotContainMatchedPortionOfRoute()
    {
        // e.g., if route is "/foo", and "/foo/bar" is the original path,
        // then the URI path in the handler is "/bar"
        $triggered = null;
        $route = new Route('/foo', function ($req, $res, $next) use (&$triggered) {
            $triggered = $req->getUri()->getPath();
        });
        $this->queue->enqueue($route);

        $phpunit = $this;
        $done = function ($req, $res, $err = null) use ($phpunit) {
            $phpunit->fail('Should not hit done handler');
        };

        $request = $this->request->withUri(new Uri('http://local.example.com/foo/bar'));

        $next = new Next($this->queue, $done);
        $next($request, $this->response);
        $this->assertEquals('/bar', $triggered);
    }

    public function testSlashAndPathGetResetBeforeExecutingNextMiddleware()
    {
        $route1 = new Route('/foo', function ($req, $res, $next) {
            $next($req, $res);
        });
        $route2 = new Route('/foo/bar', function ($req, $res, $next) {
            $next($req, $res);
        });
        $route3 = new Route('/foo/baz', function ($req, $res, $next) {
            $res->end('done');
            return $res;
        });

        $this->queue->enqueue($route1);
        $this->queue->enqueue($route2);
        $this->queue->enqueue($route3);

        $phpunit = $this;
        $done = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Should not hit final handler');
        };

        $request = $this->request->withUri(new Uri('http://example.com/foo/baz/bat'));
        $next = new Next($this->queue, $done);
        $next($request, $this->response);
        $this->assertEquals('done', (string) $this->response->getBody());
    }

    public function testMiddlewareReturningResponseShortcircuits()
    {
        $phpunit = $this;
        $route1 = new Route('/foo', function ($req, $res, $next) {
            return $res;
        });
        $route2 = new Route('/foo/bar', function ($req, $res, $next) use ($phpunit) {
            $next($req, $res);
            $phpunit->fail('Should not hit route2 handler');
        });
        $route3 = new Route('/foo/baz', function ($req, $res, $next) use ($phpunit) {
            $next($req, $res);
            $phpunit->fail('Should not hit route3 handler');
        });

        $this->queue->enqueue($route1);
        $this->queue->enqueue($route2);
        $this->queue->enqueue($route3);

        $done = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Should not hit final handler');
        };

        $request = $this->request->withUri(new Uri('http://example.com/foo/bar/baz'));
        $next = new Next($this->queue, $done);
        $result = $next($request, $this->response);
        $this->assertSame($this->response, $result);
    }

    public function testMiddlewareCallingNextWithResponseAsFirstArgumentResetsResponse()
    {
        $phpunit = $this;
        $cannedResponse = new Response(new PsrResponse());
        $triggered = false;

        $route1 = new Route('/foo', function ($req, $res, $next) use ($cannedResponse) {
            return $next($req, $cannedResponse);
        });
        $route2 = new Route('/foo/bar', function ($req, $res, $next) use ($phpunit, $cannedResponse, &$triggered) {
            $phpunit->assertSame($cannedResponse, $res);
            $triggered = true;
        });

        $this->queue->enqueue($route1);
        $this->queue->enqueue($route2);

        $done = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Should not hit final handler');
        };

        $request = $this->request->withUri(new Uri('http://example.com/foo/bar/baz'));
        $next = new Next($this->queue, $done);
        $result = $next($request, $this->response);
        $this->assertTrue($triggered);
        $this->assertSame($cannedResponse, $result);
    }

    public function testMiddlewareCallingNextWithRequestPassesRequestToNextMiddleware()
    {
        $phpunit       = $this;
        $request       = $this->request->withUri(new Uri('http://example.com/foo/bar/baz'));
        $cannedRequest = clone $request;
        $cannedRequest = $cannedRequest->withMethod('POST');

        $route1 = new Route('/foo/bar', function ($req, $res, $next) use ($cannedRequest) {
            return $next($cannedRequest, $res);
        });
        $route2 = new Route('/foo/bar/baz', function ($req, $res, $next) use ($phpunit, $cannedRequest) {
            $phpunit->assertEquals($cannedRequest->getMethod(), $req->getMethod());
            return $res;
        });

        $this->queue->enqueue($route1);
        $this->queue->enqueue($route2);

        $done = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Should not hit final handler');
        };

        $next = new Next($this->queue, $done);
        $next($request, $this->response);
    }

    public function testMiddlewareCallingNextWithResponseResetsResponse()
    {
        $phpunit        = $this;
        $cannedResponse = new Response(new PsrResponse());

        $route1 = new Route('/foo', function ($req, $res, $next) use ($cannedResponse) {
            return $next($req, $cannedResponse);
        });
        $route2 = new Route('/foo/bar', function ($req, $res, $next) use ($phpunit, $cannedResponse) {
            $phpunit->assertSame($cannedResponse, $res);
            return $res;
        });

        $this->queue->enqueue($route1);
        $this->queue->enqueue($route2);

        $done = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Should not hit final handler');
        };

        $request = $this->request->withUri(new Uri('http://example.com/foo/bar/baz'));
        $next = new Next($this->queue, $done);
        $next($request, $this->response);
    }

    public function testNextShouldReturnPassedResponseWhenNoReturnValueProvided()
    {
        $phpunit        = $this;
        $cannedResponse = new Response(new PsrResponse());

        $route1 = new Route('/foo', function ($req, $res, $next) use ($cannedResponse) {
            $next($req, $cannedResponse);
        });
        $route2 = new Route('/foo/bar', function ($req, $res, $next) use ($phpunit, $cannedResponse) {
            $phpunit->assertSame($cannedResponse, $res);
            return $res;
        });

        $this->queue->enqueue($route1);
        $this->queue->enqueue($route2);

        $done = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Should not hit final handler');
        };

        $request = $this->request->withUri(new Uri('http://example.com/foo/bar/baz'));
        $next    = new Next($this->queue, $done);
        $result  = $next($request, $this->response);
        $this->assertSame($this->response, $result);
    }

    /**
     * @group 25
     */
    public function testNextShouldCloneQueueOnInstantiation()
    {
        $phpunit = $this;
        $done = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Should not hit final handler');
        };
        $next = new Next($this->queue, $done);

        $r = new ReflectionProperty($next, 'queue');
        $r->setAccessible(true);
        $queue = $r->getValue($next);

        $this->assertNotSame($this->queue, $queue);
        $this->assertEquals($this->queue, $queue);
    }
}

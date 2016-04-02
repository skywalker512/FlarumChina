<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @see       http://github.com/zendframework/zend-stratigility for the canonical source repository
 * @copyright Copyright (c) 2015-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   https://github.com/zendframework/zend-stratigility/blob/master/LICENSE.md New BSD License
 */

namespace ZendTest\Stratigility;

use PHPUnit_Framework_TestCase as TestCase;
use ReflectionProperty;
use Zend\Diactoros\ServerRequest as Request;
use Zend\Diactoros\Response;
use Zend\Diactoros\Uri;
use Zend\Stratigility\Http\Request as RequestDecorator;
use Zend\Stratigility\Http\Response as ResponseDecorator;
use Zend\Stratigility\MiddlewarePipe;
use Zend\Stratigility\Utils;

class MiddlewarePipeTest extends TestCase
{
    public function setUp()
    {
        $this->request    = new Request([], [], 'http://example.com/', 'GET', 'php://memory');
        $this->response   = new Response();
        $this->middleware = new MiddlewarePipe();
    }

    public function invalidHandlers()
    {
        return [
            'null' => [null],
            'bool' => [true],
            'int' => [1],
            'float' => [1.1],
            'string' => ['non-function-string'],
            'array' => [['foo', 'bar']],
            'object' => [(object) ['foo' => 'bar']],
        ];
    }

    /**
     * @dataProvider invalidHandlers
     */
    public function testPipeThrowsExceptionForInvalidHandler($handler)
    {
        $this->setExpectedException('InvalidArgumentException');
        $this->middleware->pipe('/foo', $handler);
    }

    public function testHandleInvokesUntilFirstHandlerThatDoesNotCallNext()
    {
        $this->middleware->pipe(function ($req, $res, $next) {
            $res->write("First\n");
            $next($req, $res);
        });
        $this->middleware->pipe(function ($req, $res, $next) {
            $res->write("Second\n");
            $next($req, $res);
        });
        $this->middleware->pipe(function ($req, $res, $next) {
            $res->write("Third\n");
        });
        $phpunit = $this;
        $this->middleware->pipe(function ($req, $res, $next) use ($phpunit) {
            $phpunit->fail('Should not hit fourth handler!');
        });

        $request = new Request([], [], 'http://local.example.com/foo', 'GET', 'php://memory');
        $this->middleware->__invoke($request, $this->response);
        $body = (string) $this->response->getBody();
        $this->assertContains('First', $body);
        $this->assertContains('Second', $body);
        $this->assertContains('Third', $body);
    }

    public function testHandleInvokesFirstErrorHandlerOnErrorInChain()
    {
        $this->middleware->pipe(function ($req, $res, $next) {
            $next($req, $res->write("First\n"));
        });
        $this->middleware->pipe(function ($req, $res, $next) {
            return $next($req, $res, 'error');
        });
        $this->middleware->pipe(function ($req, $res, $next) {
            return $res->write("Third\n");
        });
        $this->middleware->pipe(function ($err, $req, $res, $next) {
            return $res->write("ERROR HANDLER\n");
        });
        $phpunit = $this;
        $this->middleware->pipe(function ($req, $res, $next) use ($phpunit) {
            $phpunit->fail('Should not hit fourth handler!');
        });

        $request  = new Request([], [], 'http://local.example.com/foo', 'GET', 'php://memory');
        $response = $this->middleware->__invoke($request, $this->response);
        $body     = (string) $response->getBody();
        $this->assertContains('First', $body);
        $this->assertContains('ERROR HANDLER', $body);
        $this->assertNotContains('Third', $body);
    }

    public function testHandleInvokesOutHandlerIfQueueIsExhausted()
    {
        $triggered = null;
        $out = function ($err = null) use (&$triggered) {
            $triggered = true;
        };

        $this->middleware->pipe(function ($req, $res, $next) {
            $next($req, $res);
        });
        $this->middleware->pipe(function ($req, $res, $next) {
            $next($req, $res);
        });
        $this->middleware->pipe(function ($req, $res, $next) {
            $next($req, $res);
        });

        $request = new Request([], [], 'http://local.example.com/foo', 'GET', 'php://memory');
        $this->middleware->__invoke($request, $this->response, $out);
        $this->assertTrue($triggered);
    }

    public function testPipeWillCreateErrorClosureForObjectImplementingHandle()
    {
        $this->markTestIncomplete();
        $handler = new TestAsset\ErrorHandler();
        $this->middleware->pipe($handler);
        $r = new ReflectionProperty($this->middleware, 'queue');
        $r->setAccessible(true);
        $queue = $r->getValue($this->middleware);
        $route = $queue[$queue->count() - 1];
        $this->assertInstanceOf('Zend\Stratigility\Route', $route);
        $handler = $route->handler;
        $this->assertInstanceOf('Closure', $handler);
        $this->assertEquals(4, Utils::getArity($handler));
    }

    public function testCanUseDecoratedRequestAndResponseDirectly()
    {
        $baseRequest = new Request([], [], 'http://local.example.com/foo', 'GET', 'php://memory');

        $request  = new RequestDecorator($baseRequest);
        $response = new ResponseDecorator($this->response);
        $phpunit  = $this;
        $executed = false;

        $middleware = $this->middleware;
        $middleware->pipe(function ($req, $res, $next) use ($phpunit, $request, $response, &$executed) {
            $phpunit->assertSame($request, $req);
            $phpunit->assertSame($response, $res);
            $executed = true;
        });

        $middleware($request, $response, function ($err = null) use ($phpunit) {
            $phpunit->fail('Next should not be called');
        });

        $this->assertTrue($executed);
    }

    public function testReturnsOrigionalResponseIfQueueDoesNotReturnAResponse()
    {
        $this->middleware->pipe(function ($req, $res, $next) {
            $next($req, $res);
        });
        $this->middleware->pipe(function ($req, $res, $next) {
            $next($req, $res);
        });
        $this->middleware->pipe(function ($req, $res, $next) {
            return;
        });
        $phpunit = $this;
        $this->middleware->pipe(function ($req, $res, $next) use ($phpunit) {
            $phpunit->fail('Should not hit fourth handler!');
        });

        $request = new Request([], [], 'http://local.example.com/foo', 'GET', 'php://memory');
        $result  = $this->middleware->__invoke($request, $this->response);
        $this->assertSame($this->response, $result->getOriginalResponse());
    }

    public function testReturnsResponseReturnedByQueue()
    {
        $return = new Response();

        $this->middleware->pipe(function ($req, $res, $next) {
            return $next($req, $res);
        });
        $this->middleware->pipe(function ($req, $res, $next) {
            return $next($req, $res);
        });
        $this->middleware->pipe(function ($req, $res, $next) use ($return) {
            return $return;
        });
        $phpunit = $this;
        $this->middleware->pipe(function ($req, $res, $next) use ($phpunit) {
            $phpunit->fail('Should not hit fourth handler!');
        });

        $request = new Request([], [], 'http://local.example.com/foo', 'GET', 'php://memory');
        $result  = $this->middleware->__invoke($request, $this->response);
        $this->assertSame($return, $result, var_export([
            spl_object_hash($return) => get_class($return),
            spl_object_hash($result) => get_class($result),
        ], 1));
    }

    public function testSlashShouldNotBeAppendedInChildMiddlewareWhenLayerDoesNotIncludeIt()
    {
        $this->middleware->pipe('/admin', function ($req, $res, $next) {
            return $next($req, $res);
        });
        $phpunit = $this;
        $this->middleware->pipe(function ($req, $res, $next) use ($phpunit) {
            return $res->write($req->getUri()->getPath());
        });
        $request = new Request([], [], 'http://local.example.com/admin', 'GET', 'php://memory');
        $result  = $this->middleware->__invoke($request, $this->response);
        $body    = (string) $result->getBody();
        $this->assertSame('/admin', $body);
    }

    public function testSlashShouldBeAppendedInChildMiddlewareWhenRequestUriIncludesIt()
    {
        $this->middleware->pipe('/admin', function ($req, $res, $next) {
            return $next($req, $res);
        });
        $phpunit = $this;
        $this->middleware->pipe(function ($req, $res, $next) use ($phpunit) {
            return $res->write($req->getUri()->getPath());
        });
        $request = new Request([], [], 'http://local.example.com/admin/', 'GET', 'php://memory');
        $result  = $this->middleware->__invoke($request, $this->response);
        $body    = (string) $result->getBody();
        $this->assertSame('/admin/', $body);
    }

    public function testNestedMiddlewareMayInvokeDoneToInvokeNextOfParent()
    {
        $child = new MiddlewarePipe();
        $child->pipe('/', function ($req, $res, $next) {
            return $next($req, $res);
        });

        $this->middleware->pipe(function ($req, $res, $next) {
            return $next($req, $res);
        });

        $this->middleware->pipe('/test', $child);

        $triggered = false;
        $this->middleware->pipe(function ($req, $res, $next) use (&$triggered) {
            $triggered = true;
            return $res;
        });

        $request = new Request([], [], 'http://local.example.com/test', 'GET', 'php://memory');
        $result  = $this->middleware->__invoke($request, $this->response);
        $this->assertTrue($triggered);
        $this->assertInstanceOf('Zend\Stratigility\Http\Response', $result);
        $this->assertSame($this->response, $result->getOriginalResponse());
    }

    public function testMiddlewareRequestPathMustBeTrimmedOffWithPipeRoutePath()
    {
        $request  = new Request([], [], 'http://local.example.com/foo/bar', 'GET', 'php://memory');

        $phpunit  = $this;
        $executed = false;

        $this->middleware->pipe('/foo', function ($req, $res, $next) use ($phpunit, &$executed) {
            $phpunit->assertEquals('/bar', $req->getUri()->getPath());
            $executed = true;
        });

        $this->middleware->__invoke($request, $this->response);
        $this->assertTrue($executed);
    }

    public function rootPaths()
    {
        return [
            'empty' => [''],
            'root'  => ['/'],
        ];
    }

    /**
     * @group matching
     * @dataProvider rootPaths
     */
    public function testMiddlewareTreatsBothSlashAndEmptyPathAsTheRootPath($path)
    {
        $middleware = $this->middleware;
        $middleware->pipe($path, function ($req, $res) {
            return $res->withHeader('X-Found', 'true');
        });
        $uri     = (new Uri())->withPath($path);
        $request = (new Request)->withUri($uri);

        $response = $middleware($request, $this->response);
        $this->assertTrue($response->hasHeader('x-found'));
    }

    public function nestedPaths()
    {
        return [
            'empty-bare-bare'            => ['',       'foo',    '/foo',          'assertTrue'],
            'empty-bare-bareplus'        => ['',       'foo',    '/foobar',       'assertFalse'],
            'empty-bare-tail'            => ['',       'foo',    '/foo/',         'assertTrue'],
            'empty-bare-tailplus'        => ['',       'foo',    '/foo/bar',      'assertTrue'],
            'empty-tail-bare'            => ['',       'foo/',   '/foo',          'assertTrue'],
            'empty-tail-bareplus'        => ['',       'foo/',   '/foobar',       'assertFalse'],
            'empty-tail-tail'            => ['',       'foo/',   '/foo/',         'assertTrue'],
            'empty-tail-tailplus'        => ['',       'foo/',   '/foo/bar',      'assertTrue'],
            'empty-prefix-bare'          => ['',       '/foo',   '/foo',          'assertTrue'],
            'empty-prefix-bareplus'      => ['',       '/foo',   '/foobar',       'assertFalse'],
            'empty-prefix-tail'          => ['',       '/foo',   '/foo/',         'assertTrue'],
            'empty-prefix-tailplus'      => ['',       '/foo',   '/foo/bar',      'assertTrue'],
            'empty-surround-bare'        => ['',       '/foo/',  '/foo',          'assertTrue'],
            'empty-surround-bareplus'    => ['',       '/foo/',  '/foobar',       'assertFalse'],
            'empty-surround-tail'        => ['',       '/foo/',  '/foo/',         'assertTrue'],
            'empty-surround-tailplus'    => ['',       '/foo/',  '/foo/bar',      'assertTrue'],
            'root-bare-bare'             => ['/',      'foo',    '/foo',          'assertTrue'],
            'root-bare-bareplus'         => ['/',      'foo',    '/foobar',       'assertFalse'],
            'root-bare-tail'             => ['/',      'foo',    '/foo/',         'assertTrue'],
            'root-bare-tailplus'         => ['/',      'foo',    '/foo/bar',      'assertTrue'],
            'root-tail-bare'             => ['/',      'foo/',   '/foo',          'assertTrue'],
            'root-tail-bareplus'         => ['/',      'foo/',   '/foobar',       'assertFalse'],
            'root-tail-tail'             => ['/',      'foo/',   '/foo/',         'assertTrue'],
            'root-tail-tailplus'         => ['/',      'foo/',   '/foo/bar',      'assertTrue'],
            'root-prefix-bare'           => ['/',      '/foo',   '/foo',          'assertTrue'],
            'root-prefix-bareplus'       => ['/',      '/foo',   '/foobar',       'assertFalse'],
            'root-prefix-tail'           => ['/',      '/foo',   '/foo/',         'assertTrue'],
            'root-prefix-tailplus'       => ['/',      '/foo',   '/foo/bar',      'assertTrue'],
            'root-surround-bare'         => ['/',      '/foo/',  '/foo',          'assertTrue'],
            'root-surround-bareplus'     => ['/',      '/foo/',  '/foobar',       'assertFalse'],
            'root-surround-tail'         => ['/',      '/foo/',  '/foo/',         'assertTrue'],
            'root-surround-tailplus'     => ['/',      '/foo/',  '/foo/bar',      'assertTrue'],
            'bare-bare-bare'             => ['foo',    'bar',    '/foo/bar',      'assertTrue'],
            'bare-bare-bareplus'         => ['foo',    'bar',    '/foo/barbaz',   'assertFalse'],
            'bare-bare-tail'             => ['foo',    'bar',    '/foo/bar/',     'assertTrue'],
            'bare-bare-tailplus'         => ['foo',    'bar',    '/foo/bar/baz',  'assertTrue'],
            'bare-tail-bare'             => ['foo',    'bar/',   '/foo/bar',      'assertTrue'],
            'bare-tail-bareplus'         => ['foo',    'bar/',   '/foo/barbaz',   'assertFalse'],
            'bare-tail-tail'             => ['foo',    'bar/',   '/foo/bar/',     'assertTrue'],
            'bare-tail-tailplus'         => ['foo',    'bar/',   '/foo/bar/baz',  'assertTrue'],
            'bare-prefix-bare'           => ['foo',    '/bar',   '/foo/bar',      'assertTrue'],
            'bare-prefix-bareplus'       => ['foo',    '/bar',   '/foo/barbaz',   'assertFalse'],
            'bare-prefix-tail'           => ['foo',    '/bar',   '/foo/bar/',     'assertTrue'],
            'bare-prefix-tailplus'       => ['foo',    '/bar',   '/foo/bar/baz',  'assertTrue'],
            'bare-surround-bare'         => ['foo',    '/bar/',  '/foo/bar',      'assertTrue'],
            'bare-surround-bareplus'     => ['foo',    '/bar/',  '/foo/barbaz',   'assertFalse'],
            'bare-surround-tail'         => ['foo',    '/bar/',  '/foo/bar/',     'assertTrue'],
            'bare-surround-tailplus'     => ['foo',    '/bar/',  '/foo/bar/baz',  'assertTrue'],
            'tail-bare-bare'             => ['foo/',   'bar',    '/foo/bar',      'assertTrue'],
            'tail-bare-bareplus'         => ['foo/',   'bar',    '/foo/barbaz',   'assertFalse'],
            'tail-bare-tail'             => ['foo/',   'bar',    '/foo/bar/',     'assertTrue'],
            'tail-bare-tailplus'         => ['foo/',   'bar',    '/foo/bar/baz',  'assertTrue'],
            'tail-tail-bare'             => ['foo/',   'bar/',   '/foo/bar',      'assertTrue'],
            'tail-tail-bareplus'         => ['foo/',   'bar/',   '/foo/barbaz',   'assertFalse'],
            'tail-tail-tail'             => ['foo/',   'bar/',   '/foo/bar/',     'assertTrue'],
            'tail-tail-tailplus'         => ['foo/',   'bar/',   '/foo/bar/baz',  'assertTrue'],
            'tail-prefix-bare'           => ['foo/',   '/bar',   '/foo/bar',      'assertTrue'],
            'tail-prefix-bareplus'       => ['foo/',   '/bar',   '/foo/barbaz',   'assertFalse'],
            'tail-prefix-tail'           => ['foo/',   '/bar',   '/foo/bar/',     'assertTrue'],
            'tail-prefix-tailplus'       => ['foo/',   '/bar',   '/foo/bar/baz',  'assertTrue'],
            'tail-surround-bare'         => ['foo/',   '/bar/',  '/foo/bar',      'assertTrue'],
            'tail-surround-bareplus'     => ['foo/',   '/bar/',  '/foo/barbaz',   'assertFalse'],
            'tail-surround-tail'         => ['foo/',   '/bar/',  '/foo/bar/',     'assertTrue'],
            'tail-surround-tailplus'     => ['foo/',   '/bar/',  '/foo/bar/baz',  'assertTrue'],
            'prefix-bare-bare'           => ['/foo',   'bar',    '/foo/bar',      'assertTrue'],
            'prefix-bare-bareplus'       => ['/foo',   'bar',    '/foo/barbaz',   'assertFalse'],
            'prefix-bare-tail'           => ['/foo',   'bar',    '/foo/bar/',     'assertTrue'],
            'prefix-bare-tailplus'       => ['/foo',   'bar',    '/foo/bar/baz',  'assertTrue'],
            'prefix-tail-bare'           => ['/foo',   'bar/',   '/foo/bar',      'assertTrue'],
            'prefix-tail-bareplus'       => ['/foo',   'bar/',   '/foo/barbaz',   'assertFalse'],
            'prefix-tail-tail'           => ['/foo',   'bar/',   '/foo/bar/',     'assertTrue'],
            'prefix-tail-tailplus'       => ['/foo',   'bar/',   '/foo/bar/baz',  'assertTrue'],
            'prefix-prefix-bare'         => ['/foo',   '/bar',   '/foo/bar',      'assertTrue'],
            'prefix-prefix-bareplus'     => ['/foo',   '/bar',   '/foo/barbaz',   'assertFalse'],
            'prefix-prefix-tail'         => ['/foo',   '/bar',   '/foo/bar/',     'assertTrue'],
            'prefix-prefix-tailplus'     => ['/foo',   '/bar',   '/foo/bar/baz',  'assertTrue'],
            'prefix-surround-bare'       => ['/foo',   '/bar/',  '/foo/bar',      'assertTrue'],
            'prefix-surround-bareplus'   => ['/foo',   '/bar/',  '/foo/barbaz',   'assertFalse'],
            'prefix-surround-tail'       => ['/foo',   '/bar/',  '/foo/bar/',     'assertTrue'],
            'prefix-surround-tailplus'   => ['/foo',   '/bar/',  '/foo/bar/baz',  'assertTrue'],
            'surround-bare-bare'         => ['/foo/',  'bar',    '/foo/bar',      'assertTrue'],
            'surround-bare-bareplus'     => ['/foo/',  'bar',    '/foo/barbaz',   'assertFalse'],
            'surround-bare-tail'         => ['/foo/',  'bar',    '/foo/bar/',     'assertTrue'],
            'surround-bare-tailplus'     => ['/foo/',  'bar',    '/foo/bar/baz',  'assertTrue'],
            'surround-tail-bare'         => ['/foo/',  'bar/',   '/foo/bar',      'assertTrue'],
            'surround-tail-bareplus'     => ['/foo/',  'bar/',   '/foo/barbaz',   'assertFalse'],
            'surround-tail-tail'         => ['/foo/',  'bar/',   '/foo/bar/',     'assertTrue'],
            'surround-tail-tailplus'     => ['/foo/',  'bar/',   '/foo/bar/baz',  'assertTrue'],
            'surround-prefix-bare'       => ['/foo/',  '/bar',   '/foo/bar',      'assertTrue'],
            'surround-prefix-bareplus'   => ['/foo/',  '/bar',   '/foo/barbaz',   'assertFalse'],
            'surround-prefix-tail'       => ['/foo/',  '/bar',   '/foo/bar/',     'assertTrue'],
            'surround-prefix-tailplus'   => ['/foo/',  '/bar',   '/foo/bar/baz',  'assertTrue'],
            'surround-surround-bare'     => ['/foo/',  '/bar/',  '/foo/bar',      'assertTrue'],
            'surround-surround-bareplus' => ['/foo/',  '/bar/',  '/foo/barbaz',   'assertFalse'],
            'surround-surround-tail'     => ['/foo/',  '/bar/',  '/foo/bar/',     'assertTrue'],
            'surround-surround-tailplus' => ['/foo/',  '/bar/',  '/foo/bar/baz',  'assertTrue'],
        ];
    }

    /**
     * @group matching
     * @group nesting
     * @dataProvider nestedPaths
     */
    public function testNestedMiddlewareMatchesOnlyAtPathBoundaries($topPath, $nestedPath, $fullPath, $assertion)
    {
        $middleware = $this->middleware;

        $nest = new MiddlewarePipe();
        $nest->pipe($nestedPath, function ($req, $res) use ($nestedPath) {
            return $res->withHeader('X-Found', 'true');
        });
        $middleware->pipe($topPath, function ($req, $res, $next = null) use ($topPath, $nest) {
            $result = $nest($req, $res, $next);
            return $result;
        });

        $uri      = (new Uri())->withPath($fullPath);
        $request  = (new Request)->withUri($uri);
        $response = $middleware($request, $this->response);
        $this->$assertion(
            $response->hasHeader('X-Found'),
            sprintf(
                "%s failed with full path %s against top pipe '%s' and nested pipe '%s'\n",
                $assertion,
                $fullPath,
                $topPath,
                $nestedPath
            )
        );
    }

    /**
     * Test that FinalHandler is passed the original response.
     *
     * Tests that MiddlewarePipe passes the original response passed to it when
     * creating the FinalHandler instance, and that FinalHandler compares the
     * response passed to it on invocation to its original response.
     *
     * If the two differ, the response passed during invocation should be
     * returned unmodified; this is an indication that a middleware has provided
     * a response, and is simply passing further up the chain to allow further
     * processing (e.g., to allow an application-wide logger at the end of the
     * request).
     *
     * @group nextChaining
     */
    public function testPassesOriginalResponseToFinalHandler()
    {
        $request  = new Request([], [], 'http://local.example.com/foo', 'GET', 'php://memory');
        $response = new Response();
        $test     = new Response();

        $pipeline = new MiddlewarePipe();
        $pipeline->pipe(function ($req, $res, $next) use ($test) {
            return $next($req, $test);
        });

        // Pipeline MUST return response passed to $next if it differs from the
        // original.
        $result = $pipeline($request, $response);
        $this->assertSame($test, $result);
    }
}

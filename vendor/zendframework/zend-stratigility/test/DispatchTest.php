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
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use RuntimeException;
use stdClass;
use TypeError;
use Zend\Stratigility\Dispatch;
use Zend\Stratigility\Route;

class DispatchTest extends TestCase
{
    /**
     * @var \Zend\Stratigility\Http\Request|\PHPUnit_Framework_MockObject_MockObject
     */
    private $request;

    /**
     * @var \Zend\Stratigility\Http\Response|\PHPUnit_Framework_MockObject_MockObject
     */
    private $response;

    public function setUp()
    {
        $this->request  = $this->getMockBuilder('Zend\Stratigility\Http\Request')
            ->disableOriginalConstructor()
            ->getMock();
        $this->response = $this->getMockBuilder('Zend\Stratigility\Http\Response')
            ->disableOriginalConstructor()
            ->getMock();
    }

    public function testHasErrorAndHandleArityIsFourTriggersHandler()
    {
        $phpunit   = $this;
        $triggered = false;

        $handler = function ($err, $req, $res, $next) use (&$triggered) {
            $triggered = $err;
        };
        $next = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Next was called; it should not have been');
        };

        $route = new Route('/foo', $handler);
        $dispatch = new Dispatch();
        $err = (object) ['error' => true];
        $dispatch($route, $err, $this->request, $this->response, $next);
        $this->assertSame($err, $triggered);
    }

    public function testHasErrorAndHandleArityLessThanFourTriggersNextWithError()
    {
        $phpunit   = $this;
        $triggered = false;

        $handler = function ($req, $res, $next) use ($phpunit) {
            $phpunit->fail('Handler was called; it should not have been');
        };
        $next = function ($req, $res, $err) use (&$triggered) {
            $triggered = $err;
        };

        $route = new Route('/foo', $handler);
        $dispatch = new Dispatch();
        $err = (object) ['error' => true];
        $dispatch($route, $err, $this->request, $this->response, $next);
        $this->assertSame($err, $triggered);
    }

    public function testNoErrorAndHandleArityGreaterThanThreeTriggersNext()
    {
        $phpunit   = $this;
        $triggered = false;

        $handler = function ($err, $req, $res, $next) use ($phpunit) {
            $phpunit->fail('Handler was called; it should not have been');
        };
        $next = function ($req, $res, $err) use (&$triggered) {
            $triggered = $err;
        };

        $route = new Route('/foo', $handler);
        $dispatch = new Dispatch();
        $err = null;
        $dispatch($route, $err, $this->request, $this->response, $next);
        $this->assertSame($err, $triggered);
    }

    public function testNoErrorAndHandleArityLessThanFourTriggersHandler()
    {
        $phpunit   = $this;
        $triggered = false;

        $handler = function ($req, $res, $next) use (&$triggered) {
            $triggered = $req;
        };
        $next = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Next was called; it should not have been');
        };

        $route = new Route('/foo', $handler);
        $dispatch = new Dispatch();
        $err = null;
        $dispatch($route, $err, $this->request, $this->response, $next);
        $this->assertSame($this->request, $triggered);
    }

    public function testThrowingExceptionInErrorHandlerTriggersNextWithException()
    {
        $phpunit   = $this;
        $exception = new RuntimeException;
        $triggered = null;

        $handler = function ($err, $req, $res, $next) use ($exception) {
            throw $exception;
        };
        $next = function ($req, $res, $err) use (&$triggered) {
            $triggered = $err;
        };

        $route = new Route('/foo', $handler);
        $dispatch = new Dispatch();
        $err = (object) ['error' => true];
        $dispatch($route, $err, $this->request, $this->response, $next);
        $this->assertSame($exception, $triggered);
    }

    public function testThrowingExceptionInNonErrorHandlerTriggersNextWithException()
    {
        $phpunit   = $this;
        $exception = new RuntimeException;
        $triggered = null;

        $handler = function ($req, $res, $next) use ($exception) {
            throw $exception;
        };
        $next = function ($req, $res, $err) use (&$triggered) {
            $triggered = $err;
        };

        $route = new Route('/foo', $handler);
        $dispatch = new Dispatch();
        $err = null;
        $dispatch($route, $err, $this->request, $this->response, $next);
        $this->assertSame($exception, $triggered);
    }

    public function testReturnsValueFromNonErrorHandler()
    {
        $phpunit = $this;
        $handler = function ($req, $res, $next) {
            return $res;
        };
        $next = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Next was called; it should not have been');
        };

        $route = new Route('/foo', $handler);
        $dispatch = new Dispatch();
        $err = null;
        $result = $dispatch($route, $err, $this->request, $this->response, $next);
        $this->assertSame($this->response, $result);
    }

    public function testIfErrorHandlerReturnsResponseDispatchReturnsTheResponse()
    {
        $phpunit = $this;
        $handler = function ($err, $req, $res, $next) {
            return $res;
        };
        $next = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Next was called; it should not have been');
        };

        $route = new Route('/foo', $handler);
        $dispatch = new Dispatch();
        $err = (object) ['error' => true];
        $result = $dispatch($route, $err, $this->request, $this->response, $next);
        $this->assertSame($this->response, $result);
    }

    /**
     * @group 28
     */
    public function testShouldAllowDispatchingPsr7Instances()
    {
        $phpunit = $this;
        $handler = function ($req, $res, $next) {
            return $res;
        };
        $next = function ($req, $res, $err) use ($phpunit) {
            $phpunit->fail('Next was called; it should not have been');
        };

        $request  = $this->prophesize('Psr\Http\Message\ServerRequestInterface');
        $response = $this->prophesize('Psr\Http\Message\ResponseInterface');
        $dispatch = new Dispatch();
        $route    = new Route('/foo', $handler);
        $err      = null;
        $result = $dispatch($route, $err, $request->reveal(), $response->reveal(), $next);
        $this->assertSame($response->reveal(), $result);
    }

    /**
     * @requires PHP 7.0
     * @group 37
     */
    public function testWillCatchPhp7Throwable()
    {
        $callableWithHint = function (stdClass $parameter) {
            // will not be executed
        };

        $middleware = function ($req, $res, $next) use ($callableWithHint) {
            $callableWithHint('not an stdClass');
        };

        $errorHandler = $this->getMock('stdClass', ['__invoke']);
        $errorHandler
            ->expects(self::once())
            ->method('__invoke')
            ->with(
                $this->request,
                $this->response,
                self::callback(function (TypeError $throwable) {
                    self::assertStringStartsWith(
                        'Argument 1 passed to ZendTest\Stratigility\DispatchTest::ZendTest\Stratigility\{closure}()'
                        . ' must be an instance of stdClass, string given',
                        $throwable->getMessage()
                    );

                    return true;
                })
            );

        $dispatch = new Dispatch();

        $dispatch(
            new Route('/foo', $middleware),
            null,
            $this->request,
            $this->response,
            $errorHandler
        );
    }
}

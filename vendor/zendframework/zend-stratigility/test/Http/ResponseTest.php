<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @see       http://github.com/zendframework/zend-stratigility for the canonical source repository
 * @copyright Copyright (c) 2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   https://github.com/zendframework/zend-stratigility/blob/master/LICENSE.md New BSD License
 */

namespace ZendTest\Stratigility\Http;

use PHPUnit_Framework_TestCase as TestCase;
use Zend\Diactoros\Response as PsrResponse;
use Zend\Diactoros\Stream;
use Zend\Stratigility\Http\Response;

class ResponseTest extends TestCase
{
    public function setUp()
    {
        $this->original = new PsrResponse();
        $this->response = new Response($this->original);
    }

    public function testIsNotCompleteByDefault()
    {
        $this->assertFalse($this->response->isComplete());
    }

    public function testCallingEndMarksAsComplete()
    {
        $response = $this->response->end();
        $this->assertTrue($response->isComplete());
    }

    public function testWriteAppendsBody()
    {
        $this->response->write("First\n");
        $this->assertContains('First', (string) $this->response->getBody());
        $this->response->write("Second\n");
        $this->assertContains('First', (string) $this->response->getBody());
        $this->assertContains('Second', (string) $this->response->getBody());
    }

    public function testCannotMutateResponseAfterCallingEnd()
    {
        $response = $this->response->withStatus(201);
        $response = $response->write("First\n");
        $response = $response->end('DONE');

        $test = $response->withStatus(200);
        $test = $test->withHeader('X-Foo', 'Foo');
        $test = $test->write('MOAR!');

        $this->assertSame($response, $test);
        $this->assertEquals(201, $test->getStatusCode());
        $this->assertFalse($test->hasHeader('X-Foo'));
        $this->assertNotContains('MOAR!', (string) $test->getBody());
        $this->assertContains('First', (string) $test->getBody());
        $this->assertContains('DONE', (string) $test->getBody());
    }

    public function testSetBodyReturnsEarlyIfComplete()
    {
        $response = $this->response->end('foo');

        $body = new Stream('php://memory', 'r+');
        $response = $response->withBody($body);

        $this->assertEquals('foo', (string) $response->getBody());
    }

    public function testAddHeaderDoesNothingIfComplete()
    {
        $response = $this->response->end('foo');
        $response = $response->withAddedHeader('Content-Type', 'application/json');
        $this->assertFalse($response->hasHeader('Content-Type'));
    }

    public function testCallingEndMultipleTimesDoesNothingAfterFirstCall()
    {
        $response = $this->response->end('foo');
        $response = $response->end('bar');
        $this->assertEquals('foo', (string) $response->getBody());
    }

    public function testCanAccessOriginalResponse()
    {
        $this->assertSame($this->original, $this->response->getOriginalResponse());
    }

    public function testDecoratorProxiesToAllMethods()
    {
        $this->assertEquals('1.1', $this->response->getProtocolVersion());

        $stream = $this->getMock('Psr\Http\Message\StreamInterface');
        $response = $this->response->withBody($stream);
        $this->assertNotSame($this->response, $response);
        $this->assertSame($stream, $response->getBody());

        $this->assertSame($this->original->getHeaders(), $this->response->getHeaders());

        $response = $this->response->withHeader('Accept', 'application/xml');
        $this->assertNotSame($this->response, $response);
        $this->assertTrue($response->hasHeader('Accept'));
        $this->assertEquals('application/xml', $response->getHeaderLine('Accept'));

        $response = $this->response->withAddedHeader('X-URL', 'http://example.com/foo');
        $this->assertNotSame($this->response, $response);
        $this->assertTrue($response->hasHeader('X-URL'));

        $response = $this->response->withoutHeader('X-URL');
        $this->assertNotSame($this->response, $response);
        $this->assertFalse($response->hasHeader('X-URL'));

        $response = $this->response->withStatus(200, 'FOOBAR');
        $this->assertNotSame($this->response, $response);
        $this->assertEquals('FOOBAR', $response->getReasonPhrase());
    }
}

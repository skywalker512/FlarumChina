<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @see       http://github.com/zendframework/zend-stratigility for the canonical source repository
 * @copyright Copyright (c) 2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   https://github.com/zendframework/zend-stratigility/blob/master/LICENSE.md New BSD License
 */

namespace Zend\Stratigility\Http;

use Psr\Http\Message\ResponseInterface as PsrResponseInterface;
use Psr\Http\Message\StreamInterface;

/**
 * Response decorator
 *
 * Adds in write, end, and isComplete from RequestInterface in order
 * to provide a common interface for all PSR HTTP implementations.
 */
class Response implements
    PsrResponseInterface,
    ResponseInterface
{
    /**
     * @var bool
     */
    private $complete = false;

    /**
     * @var PsrResponseInterface
     */
    private $psrResponse;

    /**
     * @param PsrResponseInterface $response
     */
    public function __construct(PsrResponseInterface $response)
    {
        $this->psrResponse = $response;
    }

    /**
     * Return the original PSR response object
     *
     * @return PsrResponseInterface
     */
    public function getOriginalResponse()
    {
        return $this->psrResponse;
    }

    /**
     * Write data to the response body
     *
     * Proxies to the underlying stream and writes the provided data to it.
     *
     * @param string $data
     */
    public function write($data)
    {
        if ($this->complete) {
            return $this;
        }

        $this->getBody()->write($data);
        return $this;
    }

    /**
     * Mark the response as complete
     *
     * A completed response should no longer allow manipulation of either
     * headers or the content body.
     *
     * If $data is passed, that data should be written to the response body
     * prior to marking the response as complete.
     *
     * @param string $data
     */
    public function end($data = null)
    {
        if ($this->complete) {
            return $this;
        }

        if ($data) {
            $this->write($data);
        }

        $new = clone $this;
        $new->complete = true;
        return $new;
    }

    /**
     * Indicate whether or not the response is complete.
     *
     * I.e., if end() has previously been called.
     *
     * @return bool
     */
    public function isComplete()
    {
        return $this->complete;
    }

    /**
     * Proxy to PsrResponseInterface::getProtocolVersion()
     *
     * {@inheritdoc}
     */
    public function getProtocolVersion()
    {
        return $this->psrResponse->getProtocolVersion();
    }

    /**
     * Proxy to PsrResponseInterface::withProtocolVersion()
     *
     * {@inheritdoc}
     */
    public function withProtocolVersion($version)
    {
        $new = $this->psrResponse->withProtocolVersion($version);
        return new self($new);
    }

    /**
     * Proxy to PsrResponseInterface::getBody()
     *
     * {@inheritdoc}
     */
    public function getBody()
    {
        return $this->psrResponse->getBody();
    }

    /**
     * Proxy to PsrResponseInterface::withBody()
     *
     * {@inheritdoc}
     */
    public function withBody(StreamInterface $body)
    {
        if ($this->complete) {
            return $this;
        }

        $new = $this->psrResponse->withBody($body);
        return new self($new);
    }

    /**
     * Proxy to PsrResponseInterface::getHeaders()
     *
     * {@inheritdoc}
     */
    public function getHeaders()
    {
        return $this->psrResponse->getHeaders();
    }

    /**
     * Proxy to PsrResponseInterface::hasHeader()
     *
     * {@inheritdoc}
     */
    public function hasHeader($header)
    {
        return $this->psrResponse->hasHeader($header);
    }

    /**
     * Proxy to PsrResponseInterface::getHeader()
     *
     * {@inheritdoc}
     */
    public function getHeader($header)
    {
        return $this->psrResponse->getHeader($header);
    }

    /**
     * Proxy to PsrResponseInterface::getHeaderLine()
     *
     * {@inheritdoc}
     */
    public function getHeaderLine($header)
    {
        return $this->psrResponse->getHeaderLine($header);
    }

    /**
     * Proxy to PsrResponseInterface::withHeader()
     *
     * {@inheritdoc}
     */
    public function withHeader($header, $value)
    {
        if ($this->complete) {
            return $this;
        }

        $new = $this->psrResponse->withHeader($header, $value);
        return new self($new);
    }

    /**
     * Proxy to PsrResponseInterface::withAddedHeader()
     *
     * {@inheritdoc}
     */
    public function withAddedHeader($header, $value)
    {
        if ($this->complete) {
            return $this;
        }

        $new = $this->psrResponse->withAddedHeader($header, $value);
        return new self($new);
    }

    /**
     * Proxy to PsrResponseInterface::withoutHeader()
     *
     * {@inheritdoc}
     */
    public function withoutHeader($header)
    {
        if ($this->complete) {
            return $this;
        }

        $new = $this->psrResponse->withoutHeader($header);
        return new self($new);
    }

    /**
     * Proxy to PsrResponseInterface::getStatusCode()
     *
     * {@inheritdoc}
     */
    public function getStatusCode()
    {
        return $this->psrResponse->getStatusCode();
    }

    /**
     * Proxy to PsrResponseInterface::withStatus()
     *
     * {@inheritdoc}
     */
    public function withStatus($code, $reasonPhrase = null)
    {
        if ($this->complete) {
            return $this;
        }

        $new = $this->psrResponse->withStatus($code, $reasonPhrase);
        return new self($new);
    }

    /**
     * Proxy to PsrResponseInterface::getReasonPhrase()
     *
     * {@inheritdoc}
     */
    public function getReasonPhrase()
    {
        return $this->psrResponse->getReasonPhrase();
    }
}

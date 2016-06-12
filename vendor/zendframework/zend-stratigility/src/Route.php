<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @see       http://github.com/zendframework/zend-stratigility for the canonical source repository
 * @copyright Copyright (c) 2015-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   https://github.com/zendframework/zend-stratigility/blob/master/LICENSE.md New BSD License
 */

namespace Zend\Stratigility;

use InvalidArgumentException;
use OutOfRangeException;

/**
 * Value object representing route-based middleware
 *
 * Details the subpath on which the middleware is active, and the
 * handler for the middleware itself.
 *
 * @property-read callable $handler Handler for this route
 * @property-read string $path Path for this route
 */
class Route
{
    /**
     * @var callable
     */
    protected $handler;

    /**
     * @var string
     */
    protected $path;

    /**
     * @param string $path
     * @param callable $handler
     */
    public function __construct($path, callable $handler)
    {
        if (! is_string($path)) {
            throw new InvalidArgumentException('Path must be a string');
        }

        $this->path    = $path;
        $this->handler = $handler;
    }

    /**
     * @param mixed $name
     * @return mixed
     * @throws OutOfRangeException for invalid properties
     */
    public function __get($name)
    {
        if (! property_exists($this, $name)) {
            throw new OutOfRangeException('Only the path and handler may be accessed from a Route instance');
        }
        return $this->{$name};
    }
}

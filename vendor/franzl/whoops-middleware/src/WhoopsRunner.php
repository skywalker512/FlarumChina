<?php

namespace Franzl\Middleware\Whoops;

use Whoops\Handler\PrettyPageHandler;
use Whoops\Run;
use Zend\Diactoros\Response\StringResponse;

class WhoopsRunner
{
    public static function handle($error)
    {
        $whoops = new Run();
        $whoops->pushHandler(new PrettyPageHandler());
        $whoops->register();

        $method = Run::EXCEPTION_HANDLER;

        ob_start();
        $whoops->$method($error);
        $response = ob_get_clean();

        return StringResponse::html($response, 500);
    }
}

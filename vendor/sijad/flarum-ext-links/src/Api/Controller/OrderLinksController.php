<?php

/*
 * (c) Sajjad Hashemian <wolaws@gmail.com>
 */

namespace Sijad\Links\Api\Controller;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Http\Controller\ControllerInterface;
use Sijad\Links\Link;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\EmptyResponse;

class OrderLinksController implements ControllerInterface
{
    use AssertPermissionTrait;

    /**
     * {@inheritdoc}
     */
    public function handle(ServerRequestInterface $request)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $order = array_get($request->getParsedBody(), 'order');

        foreach ($order as $i => $link) {
            Link::where('id', $link['id'])->update(['position' => $i]);
        }

        return new EmptyResponse(204);
    }
}

<?php
/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace  Reflar\UserManagement\Api\Controllers;

use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Core\Access\AssertPermissionTrait;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\UserManagement\Api\Serializers\StrikeSerializer;
use Reflar\UserManagement\Repository\StrikeRepository;
use Tobscure\JsonApi\Document;

class DeleteStrikeController extends AbstractCollectionController
{
    use AssertPermissionTrait;

    protected $strikes;

    public $serializer = StrikeSerializer::class;

    /**
     * @param StrikeRepository $strikes
     */
    public function __construct(StrikeRepository $strikes)
    {
        $this->strikes = $strikes;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $this->assertCan($request->getAttribute('actor'), 'user.strike');
        $id = array_get($request->getQueryParams(), 'id');

        $this->strikes->deleteStrike($id, $actor);
    }
}

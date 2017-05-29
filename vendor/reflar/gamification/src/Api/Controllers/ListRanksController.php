<?php
/**
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\gamification\Api\Controllers;

use Flarum\Api\Controller\AbstractCollectionController;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\gamification\Api\Serializers\RankSerializer;
use Reflar\gamification\Rank;
use Tobscure\JsonApi\Document;

class ListRanksController extends AbstractCollectionController
{
    /**
     * @var RankSerializer
     */
    public $serializer = RankSerializer::class;

    /**
     * @param ServerRequestInterface $request
     * @param Document               $document
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return Rank::all();
    }
}

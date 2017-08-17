<?php

/**
 *  This file is part of reflar/reactions
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\Reactions\Api\Controller;


use Flarum\Api\Controller\AbstractCollectionController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Reflar\Reactions\Reaction;

class ListReactionsController extends AbstractCollectionController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = 'Reflar\Reactions\Api\Serializer\ReactionSerializer';

    /**
     * @param ServerRequestInterface $request
     * @param Document $document
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return Reaction::all();
    }

}

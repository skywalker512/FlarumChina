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
use Reflar\gamification\Gamification;
use Tobscure\JsonApi\Document;

class OrderByPointsController extends AbstractCollectionController
{
    public $serializer = 'Flarum\Api\Serializer\UserSerializer';

    /**
     * @var array
     */
    public $include = ['ranks'];

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @param Gamification $gamification
     */
    public function __construct(Gamification $gamification)
    {
        $this->gamification = $gamification;
    }

    /**
     * @param ServerRequestInterface $request
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        return $this->gamification->orderByPoints($limit, $offset);
    }
}

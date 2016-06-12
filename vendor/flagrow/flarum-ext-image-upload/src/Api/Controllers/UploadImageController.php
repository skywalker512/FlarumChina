<?php 
/*
 * This file is part of flagrow/flarum-ext-image-upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Flagrow\ImageUpload\Api\Controllers;

use Flagrow\ImageUpload\Api\Serializers\ImageSerializer;
use Flagrow\ImageUpload\Commands\UploadImage;
use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UploadImageController extends AbstractResourceController
{

    /**
     * The serializer instance for this request.
     *
     * @var ImageSerializer
     */
    public $serializer = ImageSerializer::class;


    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }
    /**
     * Get the data to be serialized and assigned to the response document.
     *
     * @param ServerRequestInterface $request
     * @param Document               $document
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $postId = array_get($request->getQueryParams(), 'post');
        $actor = $request->getAttribute('actor');
        $file = array_get($request->getUploadedFiles(), 'image');

        return $this->bus->dispatch(
            new UploadImage($postId, $file, $actor)
        );
    }
}

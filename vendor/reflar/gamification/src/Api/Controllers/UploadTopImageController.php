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

use Flarum\Api\Controller\UploadFaviconController;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\MountManager;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UploadTopImageController extends UploadFaviconController
{
    public function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $id = array_get($request->getQueryParams(), 'id');

        $file = array_get($request->getUploadedFiles(), 'reflar/topimage/'.$id);

        $tmpFile = tempnam($this->app->storagePath().'/tmp', 'reflar.topimage.'.$id);
        $file->moveTo($tmpFile);

        $extension = pathinfo($file->getClientFilename(), PATHINFO_EXTENSION);

        if ($id == '1') {
            $size = 125;
        } elseif ($id == '2') {
            $size = 100;
        } else {
            $size = 75;
        }

        $manager = new ImageManager();

        $encodedImage = $manager->make($tmpFile)->resize($size, $size, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        })->encode('png');
        file_put_contents($tmpFile, $encodedImage);

        $extension = 'png';

        $mount = new MountManager([
            'source' => new Filesystem(new Local(pathinfo($tmpFile, PATHINFO_DIRNAME))),
            'target' => new Filesystem(new Local($this->app->publicPath().'/assets')),
        ]);

        if (($path = $this->settings->get('reflar.gamification.topimage.'.$id)) && $mount->has($file = "target://$path")) {
            $mount->delete($file);
        }

        $uploadName = 'topimage-'.Str::lower(Str::quickRandom(8)).'.'.$extension;

        $mount->move('source://'.pathinfo($tmpFile, PATHINFO_BASENAME), "target://$uploadName");

        return $this->settings->set('reflar.gamification.topimage.'.$id, $uploadName);
    }
}

<?php

/*
 * This file is part of flagrow/upload.
 *
 * Copyright (c) Flagrow.
 *
 * http://flagrow.github.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */


namespace Flagrow\Upload\Api\Controllers;

use Flarum\Api\Controller\UploadFaviconController;
use Flarum\Core\Group;
use Illuminate\Support\Str;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use League\Flysystem\MountManager;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class WatermarkUploadController extends UploadFaviconController
{
    public function data(ServerRequestInterface $request, Document $document)
    {
        $this->assertAdmin($request->getAttribute('actor'));


        $file = array_get($request->getUploadedFiles(), 'flagrow/watermark');

        $tmpFile = tempnam($this->app->storagePath() . '/tmp', 'flagrow.watermark');

        $file->moveTo($tmpFile);

        $mount = new MountManager([
            'source' => new Filesystem(new Local(pathinfo($tmpFile, PATHINFO_DIRNAME))),
            'target' => new Filesystem(new Local($this->app->storagePath())),
        ]);

        if (($path = $this->settings->get('flagrow.upload.watermark')) && $mount->has($file = "target://$path")) {
            $mount->delete($file);
        }

        $uploadName = 'watermark-' . Str::lower(Str::quickRandom(8));

        $mount->move('source://' . pathinfo($tmpFile, PATHINFO_BASENAME), "target://$uploadName");

        $this->settings->set('flagrow.upload.watermark', $uploadName);

        return [
            'groups' => Group::whereVisibleTo($request->getAttribute('actor'))->get()
        ];
    }
}

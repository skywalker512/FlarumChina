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


namespace Flagrow\Upload\Adapters;

use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\File;
use Flagrow\Upload\Helpers\Settings;
use Flarum\Forum\UrlGenerator;

class Local extends Flysystem implements UploadAdapter
{
    /**
     * @param File $file
     */
    protected function generateUrl(File $file)
    {
        $file->url = str_replace(
            [public_path(), DIRECTORY_SEPARATOR],
            ['', '/'],
            $this->adapter->applyPathPrefix($this->meta['path'])
        );

        /** @var Settings $settings */
        $settings = app()->make(Settings::class);

        if ($settings->get('cdnUrl')) {
            $file->url = $settings->get('cdnUrl') . $file->url;
        } else {
            $file->url = app(UrlGenerator::class)->toPath(ltrim($file->url, '/'));
        }
    }
}

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

use Flagrow\Upload\Contracts\Filesystem;
use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\File;
use GuzzleHttp\Client as Guzzle;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class Imgur implements UploadAdapter
{
    /**
     * @var Guzzle
     */
    protected $api;

    public function __construct(Guzzle $api)
    {
        $this->api = $api;
    }

    /**
     * Whether the upload adapter works on a specific mime type.
     *
     * @param string $mime
     * @return bool
     */
    public function forMime($mime)
    {
        return Str::startsWith($mime, 'image/');
    }

    /**
     * @return bool
     */
    public function supportsStreams()
    {
        return false;
    }

    /**
     * Attempt to upload to the (remote) filesystem.
     *
     * @param File $file
     * @param UploadedFile $upload
     * @param string $contents
     * @return File|bool
     */
    public function upload(File $file, UploadedFile $upload, $contents)
    {
        $response = $this->api->post('upload', [
            'json' => [
                'type' => 'base64',
                'image' => base64_encode($contents)
            ]
        ]);

        // successful upload, let's get the generated URL
        if ($response->getStatusCode() == 200) {
            $meta = Arr::get(json_decode($response->getBody(), true), 'data', []);

            $link = Arr::get($meta, 'link');

            $file->url = preg_replace('/^https?:/', null, $link);
            $file->remote_id = Arr::get($meta, 'id');
        }

        if ($response->getStatusCode() != 200 || empty($file->url)) {
            return false;
        }

        return $file;
    }

    /**
     * In case deletion is not possible, return false.
     *
     * @param File $file
     * @return File|bool
     */
    public function delete(File $file)
    {
        // TODO: Implement delete() method.
    }
}

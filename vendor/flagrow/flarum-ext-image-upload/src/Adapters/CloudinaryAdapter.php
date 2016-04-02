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

namespace Flagrow\ImageUpload\Adapters;

use Flagrow\ImageUpload\Contracts\UploadAdapterContract;
use Cloudinary;
use Cloudinary\Uploader;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;

class CloudinaryAdapter implements UploadAdapterContract
{

    /**
     * LocalAdapter constructor.
     *
     * @param $cloud_name
     * @param $api_key
     * @param $api_secret
     */
    public function __construct($cloud_name, $api_key, $api_secret)
    {
        Cloudinary::config(compact('cloud_name', 'api_key', 'api_secret'));
    }

    /**
     * Uploads raw contents to the service.
     *
     * @param string $contents
     * @return array    The meta of the file.
     */
    public function uploadContents($name, $contents)
    {
        // raw contents not allowed
        $tmpFilesystem = new Filesystem(new Local(storage_path('tmp/')));
        $tmpFilesystem->write($name, $contents);

        $meta = Uploader::upload(storage_path('tmp/' . $name));
        // force secure url
        $meta['url'] = $meta['secure_url'];
        return $meta;
    }


    public function uploadFile($name, $file)
    {
        // TODO: Implement uploadFile() method.
    }

    /**
     * Delete a remote file based on a adapter identifier.
     *
     * @param string $name
     * @param string $file
     * @return bool
     */
    public function deleteFile($name, $file)
    {
        // TODO: Implement deleteFile() method.
    }
}

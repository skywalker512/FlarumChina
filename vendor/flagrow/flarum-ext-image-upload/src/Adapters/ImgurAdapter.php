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
use GuzzleHttp\Client;

class ImgurAdapter implements UploadAdapterContract
{
    /**
     * @var Client
     */
    protected $client;

    /**
     * ImgurAdapter constructor.
     *
     * @param $clientId
     */
    public function __construct($clientId)
    {
        $this->client = new Client([
            'base_uri' => 'https://api.imgur.com/3/',
            'headers'  => [
                'Authorization' => 'Client-ID ' . $clientId
            ]
        ]);
    }

    /**
     * Uploads raw contents to the service.
     *
     * @param string $name
     * @param string $contents
     * @return array The meta of the file.
     */
    public function uploadContents($name, $contents)
    {
        $result = $this->client->post('upload', [
            'json' => [
                'image' => base64_encode($contents),
                'type'  => 'base64',
            ]
        ]);
        if ($result->getStatusCode() === 200) {
            $meta = array_get(json_decode($result->getBody(), true), 'data', []);
            $meta['url'] = array_get($meta, 'link');
            $meta = preg_replace("/^http:/i", "https:", $meta);
            return $meta;
        } else {
            return false;
        }
    }

    /**
     * Uploads a local (tmp) file to the service.
     *
     * @param string $name
     * @param string $file
     * @return array The meta of the file.
     */
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

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

namespace Flagrow\ImageUpload\Contracts;

interface UploadAdapterContract
{
    /**
     * Uploads raw contents to the service.
     *
     * @param string $name
     * @param string $contents
     * @return array The meta of the file.
     */
    public function uploadContents($name, $contents);

    /**
     * Uploads a local (tmp) file to the service.
     *
     * @param string $name
     * @param string $file
     * @return array The meta of the file.
     */
    public function uploadFile($name, $file);

    /**
     * Delete a remote file based on a adapter identifier.
     *
     * @param string $name
     * @param string $file
     * @return bool
     */
    public function deleteFile($name, $file);
}

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


namespace Flagrow\Upload\Contracts;

use Flagrow\Upload\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

interface UploadAdapter
{
    /**
     * Whether the upload adapter works on a specific mime type.
     *
     * @param string $mime
     * @return bool
     */
    public function forMime($mime);

    /**
     * Whether the upload supports a stream.
     *
     * @return bool
     */
    public function supportsStreams();

    /**
     * Attempt to upload to the (remote) filesystem.
     *
     * @param File $file
     * @param UploadedFile $upload
     * @param string $contents
     * @return File|bool
     */
    public function upload(File $file, UploadedFile $upload, $contents);

    /**
     * In case deletion is not possible, return false.
     *
     * @param File $file
     * @return File|bool
     */
    public function delete(File $file);
}

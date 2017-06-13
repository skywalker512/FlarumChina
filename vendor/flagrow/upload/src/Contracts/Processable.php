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

interface Processable
{

    /**
     * @param File $file
     * @param UploadedFile $upload
     * @return File
     */
    public function process(File &$file, UploadedFile &$upload);
}

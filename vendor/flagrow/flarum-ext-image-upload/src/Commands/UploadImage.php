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

namespace Flagrow\ImageUpload\Commands;

use Flarum\Core\User;
use Psr\Http\Message\UploadedFileInterface;

class UploadImage
{
    /**
     * The ID of the post to upload the image for.
     *
     * @var int
     */
    public $postId;

    /**
     * The avatar file to upload.
     *
     * @var UploadedFileInterface
     */
    public $file;

    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * @param int                          $postId The ID of the post to upload the image for.
     * @param UploadedFileInterface|string $file   The avatar file to upload.
     * @param User                         $actor  The user performing the action.
     */
    public function __construct($postId = null, UploadedFileInterface $file, User $actor)
    {
        $this->postId = $postId;
        $this->file = $file;
        $this->actor = $actor;
    }
}

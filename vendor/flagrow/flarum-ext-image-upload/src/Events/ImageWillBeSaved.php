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

namespace Flagrow\ImageUpload\Events;

use Flagrow\ImageUpload\Image;
use Flarum\Core\Post;
use Flarum\Core\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageWillBeSaved
{

    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The image object.
     *
     * @var Image
     */
    public $image;

    /**
     * The actual image.
     *
     * @var UploadedFile
     */
    public $file;

    /**
     * @param User         $actor The user performing the action.
     * @param Image        $image
     * @param UploadedFile $file
     */
    public function __construct(User $actor, Image $image, UploadedFile $file)
    {
        $this->actor = $actor;
        $this->image = $image;
        $this->body = $file;
    }
}

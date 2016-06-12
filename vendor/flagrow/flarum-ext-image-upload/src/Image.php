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

namespace Flagrow\ImageUpload;

use Flarum\Database\AbstractModel;

class Image extends AbstractModel
{
    /**
     * The database table entries of this model are stored in.
     *
     * @var string
     */
    protected $table = 'flagrow_images';

    public static function boot()
    {
        Image::deleted(function ($image) {
            // todo trigger service to delete image
            // for instance from local storage
        });
    }
}

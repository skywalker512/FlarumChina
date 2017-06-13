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


namespace Flagrow\Upload\Commands;

use Flarum\Core\User;
use Illuminate\Support\Collection;

class Upload
{
    /**
     * @var Collection
     */
    public $files;

    /**
     * @var User
     */
    public $actor;

    public function __construct(Collection $files, User $actor)
    {
        $this->files = $files;
        $this->actor = $actor;
    }
}

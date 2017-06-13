<?php

namespace Flagrow\Upload\Events\Adapter;

use Flagrow\Upload\Contracts\UploadAdapter;
use Flarum\Core\User;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class Identified
{
    /**
     * @var User
     */
    public $actor;

    /**
     * @var UploadedFile
     */
    public $upload;

    /**
     * @var UploadAdapter|null
     */
    public $adapter;

    /**
     * @param User $actor
     * @param UploadedFile $upload
     * @param UploadAdapter|null $adapter
     */
    public function __construct(User $actor, UploadedFile &$upload, UploadAdapter &$adapter = null)
    {
        $this->actor = $actor;
        $this->upload = &$upload;
        $this->adapter = &$adapter;
    }
}

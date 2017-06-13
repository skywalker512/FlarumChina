<?php

namespace Flagrow\Upload\Events\File;

use Flagrow\Upload\Download;
use Flagrow\Upload\File;

class WillBeDownloaded
{
    /**
     * @var File
     */
    public $file;
    public $response;
    /**
     * @var Download
     */
    public $download;

    function __construct(File $file, &$response, Download $download = null)
    {
        $this->file = $file;
        $this->response = $response;
        $this->download = $download;
    }
}

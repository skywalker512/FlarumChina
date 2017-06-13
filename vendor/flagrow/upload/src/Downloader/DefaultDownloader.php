<?php

namespace Flagrow\Upload\Downloader;

use Flagrow\Upload\Commands\Download;
use Flagrow\Upload\Contracts\Downloader;
use Flagrow\Upload\Exceptions\InvalidDownloadException;
use Flagrow\Upload\File;
use GuzzleHttp\Client;
use Psr\Http\Message\ResponseInterface;

class DefaultDownloader implements Downloader
{
    /**
     * @var Client
     */
    private $api;

    public function __construct(Client $api)
    {
        $this->api = $api;
    }

    /**
     * Whether the upload adapter works on a specific mime type.
     *
     * @param File $file
     * @return bool
     */
    public function forFile(File $file)
    {
        return true;
    }

    /**
     * @param File $file
     * @param Download $command
     * @return ResponseInterface
     * @throws InvalidDownloadException
     */
    public function download(File $file, Download $command)
    {
        try {
            $response = $this->api->get($file->url);
        } catch (\Exception $e) {
            throw new InvalidDownloadException($e->getMessage());
        }

        if ($response->getStatusCode() == 200) {

            $response = $this->mutateHeaders($response, $file);

            return $response;
        }

        return null;
    }

    /**
     * @param ResponseInterface $response
     * @param File $file
     * @return ResponseInterface
     */
    protected function mutateHeaders(ResponseInterface $response, File $file)
    {
        $response = $response->withHeader('Content-Type', 'application/force-download');
        $response = $response->withAddedHeader('Content-Type', 'application/octet-stream');
        $response = $response->withAddedHeader('Content-Type', 'application/download');

        $response = $response->withHeader('Content-Transfer-Encoding', 'binary');

        $response = $response->withHeader(
            'Content-Disposition',
            sprintf('attachment; filename="%s"', $file->base_name)
        );

        return $response;
    }
}

<?php

namespace Flagrow\Upload\Commands;

use Flagrow\Upload\Contracts\Downloader;
use Flagrow\Upload\Events\File\WasLoaded;
use Flagrow\Upload\Events\File\WillBeDownloaded;
use Flagrow\Upload\Exceptions\InvalidDownloadException;
use Flagrow\Upload\Helpers\Settings;
use Flagrow\Upload\Repositories\FileRepository;
use Flagrow\Upload\Validators\DownloadValidator;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Repository\DiscussionRepository;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Contracts\Events\Dispatcher;

class DownloadHandler
{
    use AssertPermissionTrait;

    protected static $downloader = [];

    /**
     * @var FileRepository
     */
    private $files;
    /**
     * @var DownloadValidator
     */
    private $validator;
    /**
     * @var DiscussionRepository
     */
    private $discussions;
    /**
     * @var Client
     */
    private $api;
    /**
     * @var Dispatcher
     */
    private $events;
    /**
     * @var Settings
     */
    private $settings;

    public function __construct(FileRepository $files, DownloadValidator $validator, DiscussionRepository $discussions, Client $api, Dispatcher $events, Settings $settings)
    {
        $this->files = $files;
        $this->validator = $validator;
        $this->discussions = $discussions;
        $this->api = $api;
        $this->events = $events;
        $this->settings = $settings;
    }

    /**
     * @param Download $command
     * @return \Psr\Http\Message\ResponseInterface
     * @throws InvalidDownloadException
     */
    public function handle(Download $command)
    {
        $this->assertCan(
            $command->actor,
            'flagrow.upload.download'
        );

        $file = $this->files->findByUuid($command->uuid);

        if (!$file) {
            throw new ModelNotFoundException();
        }

        $this->validator->assertValid(compact('file'));

        $this->events->fire(
            new WasLoaded($file)
        );

        foreach (static::downloader() as $downloader) {
            if ($downloader->forFile($file)) {
                $response = $downloader->download($file, $command);

                if (!$response) {
                    continue;
                }

                $download = null;

                if ($this->settings->get('disableDownloadLogging') != 1) {
                    $download = $this->files->downloadedEntry($file, $command);
                }

                $this->events->fire(
                    new WillBeDownloaded($file, $response, $download)
                );

                return $response;
            }
        }

        throw new InvalidDownloadException();
    }

    /**
     * @param Downloader $downloader
     */
    public static function prependDownloader(Downloader $downloader)
    {
        Arr::prepend(static::$downloader, $downloader);
    }

    /**
     * @param Downloader $downloader
     */
    public static function addDownloader(Downloader $downloader)
    {
        static::$downloader[] = $downloader;
    }

    /**
     * @return array
     */
    public static function downloader()
    {
        return static::$downloader;
    }
}

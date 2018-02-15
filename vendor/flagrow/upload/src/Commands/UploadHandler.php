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

use Exception;
use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\Events;
use Flagrow\Upload\File;
use Flagrow\Upload\Helpers\Settings;
use Flagrow\Upload\Repositories\FileRepository;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\ValidationException;
use Flarum\Foundation\Application;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\UploadedFileInterface;

class UploadHandler
{
    use AssertPermissionTrait;

    /**
     * @var Application
     */
    protected $app;

    /**
     * @var Settings
     */
    protected $settings;

    /**
     * @var Dispatcher
     */
    protected $events;
    /**
     * @var FileRepository
     */
    protected $files;

    public function __construct(
        Application $app,
        Dispatcher $events,
        Settings $settings,
        FileRepository $files
    ) {
        $this->app = $app;
        $this->settings = $settings;
        $this->events = $events;
        $this->files = $files;
    }

    /**
     * @param Upload $command
     * @return \Illuminate\Support\Collection
     */
    public function handle(Upload $command)
    {
        $this->assertCan(
            $command->actor,
            'flagrow.upload'
        );

        $savedFiles = $command->files->map(function (UploadedFileInterface $file) use ($command) {

            try {
                $upload = $this->files->moveUploadedFileToTemp($file);

                $mimeConfiguration = $this->getMimeConfiguration($upload->getMimeType());
                $adapter = $this->getAdapter(Arr::get($mimeConfiguration, 'adapter'));
                $template = $this->getTemplate(Arr::get($mimeConfiguration, 'template', 'file'));

                $this->events->fire(
                    new Events\Adapter\Identified($command->actor, $upload, $adapter)
                );

                if (!$adapter) {
                    throw new ValidationException(['upload' => 'Uploading files of this type is not allowed.']);
                }

                if (!$adapter->forMime($upload->getMimeType())) {
                    throw new ValidationException(['upload' => "Upload adapter does not support the provided mime type: {$upload->getMimeType()}."]);
                }

                $file = $this->files->createFileFromUpload($upload, $command->actor);

                $this->events->fire(
                    new Events\File\WillBeUploaded($command->actor, $file, $upload)
                );

                $response = $adapter->upload(
                    $file,
                    $upload,
                    $this->files->readUpload($upload, $adapter)
                );

                $this->files->removeFromTemp($upload);

                if (!($response instanceof File)) {
                    return false;
                }

                $file = $response;

                $file->upload_method = $adapter;
                $file->tag = $template;

                $this->events->fire(
                    new Events\File\WillBeSaved($command->actor, $file, $upload)
                );

                if ($file->isDirty() || !$file->exists) {
                    $file->save();
                }

                $this->events->fire(
                    new Events\File\WasSaved($command->actor, $file, $upload)
                );

            } catch (Exception $e) {

                if (isset($upload)) {
                    $this->files->removeFromTemp($upload);
                }

                throw $e;
            }

            return $template->preview($file);
        });

        return $savedFiles->filter();
    }

    /**
     * @param $adapter
     * @return UploadAdapter|null
     */
    protected function getAdapter($adapter)
    {
        if (!$adapter) {
            return null;
        }

        return app("flagrow.upload-adapter.$adapter");
    }

    /**
     * @param $template
     * @return \Flagrow\Upload\Templates\AbstractTemplate|null
     */
    protected function getTemplate($template)
    {
        return $this->settings->getTemplate($template);
    }

    /**
     * @param $mime
     * @return mixed
     */
    protected function getMimeConfiguration($mime)
    {
        return $this->settings->getMimeTypesConfiguration()->first(function ($regex) use ($mime) {
            return preg_match("/$regex/", $mime);
        });
    }
}

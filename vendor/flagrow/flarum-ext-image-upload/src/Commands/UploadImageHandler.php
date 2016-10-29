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

use Carbon\Carbon;
use Flagrow\ImageUpload\Contracts\UploadAdapterContract;
use Flagrow\ImageUpload\Events\ImageWillBeSaved;
use Flagrow\ImageUpload\Image;
use Flagrow\ImageUpload\Validators\ImageValidator;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Repository\PostRepository;
use Flarum\Core\Repository\UserRepository;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Foundation\Application;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UploadImageHandler
{
    use DispatchEventsTrait;
    use AssertPermissionTrait;

    /**
     * @var UserRepository
     */
    protected $users;

    /**
     * @var UploadAdapterContract
     */
    protected $upload;

    /**
     * @var Application
     */
    protected $app;

    /**
     * @var ImageValidator
     */
    protected $validator;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param Dispatcher                  $events
     * @param UserRepository              $users
     * @param UploadAdapterContract       $upload
     * @param PostRepository              $posts
     * @param Application                 $app
     * @param ImageValidator              $validator
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(
        Dispatcher $events,
        UserRepository $users,
        UploadAdapterContract $upload,
        PostRepository $posts,
        Application $app,
        ImageValidator $validator,
        SettingsRepositoryInterface $settings
    ) {
        $this->events    = $events;
        $this->users     = $users;
        $this->upload    = $upload;
        $this->posts     = $posts;
        $this->app       = $app;
        $this->validator = $validator;
        $this->settings  = $settings;
    }

    /**
     * Handles the command execution.
     *
     * @param UploadImage $command
     * @return null|string
     *
     * @todo check permission
     */
    public function handle(UploadImage $command)
    {
        // check if the user can upload images, otherwise return
        $this->assertCan(
            $command->actor,
            'flagrow.image.upload'
        );

        $tmpFile = tempnam($this->app->storagePath() . '/tmp', 'image');
        $command->file->moveTo($tmpFile);

        $file = new UploadedFile(
            $tmpFile,
            $command->file->getClientFilename(),
            $command->file->getClientMediaType(),
            $command->file->getSize(),
            $command->file->getError(),
            true
        );

        // validate the file
        $this->validator->maxFileSize = $this->settings->get('flagrow.image-upload.maxFileSize', 2048);
        $this->validator->assertValid(['image' => $file]);

        // resize if enabled
        if ($this->settings->get('flagrow.image-upload.mustResize')) {
            $manager = new ImageManager;
            $manager->make($tmpFile)->fit(
                $this->settings->get('flagrow.image-upload.resizeMaxWidth', 100),
                $this->settings->get('flagrow.image-upload.resizeMaxHeight', 100)
            )->save();
        }

        $image = (new Image())->forceFill([
            'user_id'       => $command->actor->id,
            'upload_method' => $this->settings->get('flagrow.image-upload.uploadMethod', 'local'),
            'created_at'    => Carbon::now(),
            'file_name'     => sprintf(
                '%d-%s.%s',
                $command->actor->id,
                Str::quickRandom(),
                $file->guessExtension() ?: 'jpg'
            ),
            'file_size'     => $file->getSize()
        ]);

        // fire the Event ImageWillBeSaved, which can be extended and/or modified elsewhere
        $this->events->fire(
            new ImageWillBeSaved($command->actor, $image, $file)
        );

        $tmpFilesystem = new Filesystem(new Local(pathinfo($tmpFile, PATHINFO_DIRNAME)));

        $meta = $this->upload->uploadContents(
            $image->file_name,
            $tmpFilesystem->readAndDelete(pathinfo($tmpFile, PATHINFO_BASENAME))
        );

        if ($meta) {
            $image->file_url = array_get($meta, 'url');

            if ($image->isDirty()) {
                $image->save();
            }

            return $image;
        }

        return false;
    }
}

<?php

namespace Flagrow\Upload\Repositories;

use Carbon\Carbon;
use Flagrow\Upload\Commands\Download as DownloadCommand;
use Flagrow\Upload\Contracts\UploadAdapter;
use Flagrow\Upload\Download;
use Flagrow\Upload\Exceptions\InvalidUploadException;
use Flagrow\Upload\File;
use Flagrow\Upload\Validators\UploadValidator;
use Flarum\Core\User;
use Flarum\Foundation\Application;
use Illuminate\Support\Str;
use League\Flysystem\Adapter\Local;
use League\Flysystem\Filesystem;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\File\UploadedFile as Upload;

class FileRepository
{
    /**
     * @var string
     */
    protected $path;
    /**
     * @var FileValidator
     */
    private $validator;

    function __construct(Application $app, UploadValidator $validator)
    {
        $this->path = $app->storagePath();
        $this->validator = $validator;
    }

    /**
     * @param $uuid
     * @return File
     */
    public function findByUuid($uuid)
    {
        return File::query()
            ->with('downloads')
            ->where('uuid', $uuid)
            ->first();
    }

    /**
     * @param Upload $file
     * @param User $actor
     * @return File
     */
    public function createFileFromUpload(Upload $file, User $actor)
    {
        // Generate a guaranteed unique Uuid.
        while($uuid = Uuid::uuid4()->toString()) {
            if (! $this->findByUuid($uuid)) {
                break;
            }
        }

        return (new File)->forceFill([
            'uuid' => $uuid,
            'base_name' => $this->getBasename($file, $uuid),
            'size' => $file->getSize(),
            'type' => $file->getMimeType(),
            'actor_id' => $actor->id,
        ]);
    }

    /**
     * @param UploadedFileInterface $upload
     * @return Upload
     */
    public function moveUploadedFileToTemp(UploadedFileInterface $upload)
    {
        $this->handleUploadError($upload->getError());

        // Move the file to a temporary location first.
        $tempFile = tempnam($this->path . '/tmp', 'flagrow.upload.');
        $upload->moveTo($tempFile);

        $file = new Upload(
            $tempFile,
            $upload->getClientFilename(),
            $upload->getClientMediaType(),
            $upload->getSize(),
            $upload->getError(),
            true
        );

        $this->validator->assertValid(compact('file'));

        return $file;
    }

    protected function handleUploadError($code)
    {
        switch ($code) {
            case UPLOAD_ERR_INI_SIZE:
                throw new InvalidUploadException('Upload max filesize limit reached from php.ini.');
                break;
            case UPLOAD_ERR_FORM_SIZE:
                throw new InvalidUploadException('Upload max filesize limit reached from form.');
                break;
            case UPLOAD_ERR_PARTIAL:
                throw new InvalidUploadException('Partial upload.');
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new InvalidUploadException('No file uploaded.');
                break;
            case UPLOAD_ERR_NO_TMP_DIR:
                throw new InvalidUploadException('No tmp folder for uploading files.');
                break;
            case UPLOAD_ERR_CANT_WRITE:
                throw new InvalidUploadException('Cannot write to disk');
                break;
            case UPLOAD_ERR_EXTENSION:
                throw new InvalidUploadException('A php extension blocked the upload.');
                break;
            case UPLOAD_ERR_OK:
                break;
        }
    }

    /**
     * Deletes a file from the temporary file location.
     *
     * @param Upload $file
     * @return bool
     */
    public function removeFromTemp(Upload $file)
    {
        return $this->getTempFilesystem($file->getPath())->delete($file->getBasename());
    }

    /**
     * Retrieves a filesystem manager for the temporary file location.
     *
     * @param string $path
     * @return Filesystem
     */
    protected function getTempFilesystem($path)
    {
        return new Filesystem(new Local($path));
    }

    /**
     * @param Upload $upload
     * @param string $uuid
     * @return string
     */
    protected function getBasename(Upload $upload, $uuid)
    {
        $name = pathinfo($upload->getClientOriginalName(), PATHINFO_FILENAME);

        $slug = trim(Str::slug($name));

        return sprintf("%s.%s",
            empty($slug) ? $uuid : $slug,
            $upload->guessExtension() ? $upload->guessExtension() : $upload->getClientOriginalExtension()
        );
    }

    /**
     * @param Upload $upload
     * @param UploadAdapter $adapter
     * @return bool|false|resource|string
     */
    public function readUpload(Upload $upload, UploadAdapter $adapter)
    {
        $filesystem = $this->getTempFilesystem($upload->getPath());

        return $adapter->supportsStreams()
            ? $filesystem->readStream($upload->getBasename())
            : $filesystem->read($upload->getBasename());
    }

    /**
     * @param File $file
     * @param DownloadCommand $command
     * @return Download
     */
    public function downloadedEntry(File $file, DownloadCommand $command)
    {
        $download = new Download();

        $download->forceFill([
            'file_id' => $file->id,
            'discussion_id' => $command->discussionId,
            'post_id' => $command->postId,
            'downloaded_at' => new Carbon
        ]);

        if ($command->actor && !$command->actor->isGuest()) {
            $download->actor_id = $command->actor->id;
        }

        $download->save();

        return $download;
    }
}

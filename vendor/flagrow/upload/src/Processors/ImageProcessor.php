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

namespace Flagrow\Upload\Processors;

use Flagrow\Upload\Contracts\Processable;
use Flagrow\Upload\File;
use Flagrow\Upload\Helpers\Settings;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageProcessor implements Processable
{
    /**
     * @var Settings
     */
    protected $settings;


    /**
     * @param Settings $settings
     */
    public function __construct(Settings $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param File $file
     * @param UploadedFile $upload
     * @return File
     */
    public function process(File &$file, UploadedFile &$upload)
    {
        $mimeType = $upload->getMimeType();
        if ($mimeType == 'image/jpeg' || $mimeType == 'image/png') {
            $image = (new ImageManager())->make($upload->getRealPath());

            if ($this->settings->get('mustResize')) {
                $this->resize($image);
            }

            if ($this->settings->get('addsWatermarks')) {
                $this->watermark($image);
            }

            @file_put_contents(
                $upload->getRealPath(),
                $image->encode($upload->getMimeType())
            );
        }
    }

    /**
     * @param Image $manager
     */
    protected function resize(Image $manager)
    {
        $manager->resize(
            $this->settings->get('resizeMaxWidth', Settings::DEFAULT_MAX_IMAGE_WIDTH),
            null,
            function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
    }

    /**
     * @param Image $image
     */
    protected function watermark(Image $image)
    {
        if ($this->settings->get('watermark')) {
            $image->insert(
                storage_path($this->settings->get('watermark')),
                $this->settings->get('watermarkPosition', 'bottom-right')
            );
        }
    }
}

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

namespace Flagrow\Upload\Listeners;

use Flagrow\Upload\Events\File\WillBeSaved;
use Flagrow\Upload\Events\File\WillBeUploaded;
use Flagrow\Upload\Processors\ImageProcessor;
use Flagrow\Upload\Templates\ImageTemplate;
use Illuminate\Contracts\Events\Dispatcher;

class ProcessesImages
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(WillBeUploaded::class, [$this, 'processor']);
        $events->listen(WillBeSaved::class, [$this, 'tag']);
    }

    /**
     * @param WillBeUploaded $event
     */
    public function processor(WillBeUploaded $event)
    {
        if ($this->validateMime($event->file->type)) {
            app(ImageProcessor::class)->process($event->file, $event->uploadedFile);
        }
    }

    /**
     * @param WillBeSaved $event
     */
    public function tag(WillBeSaved $event)
    {
        if ($this->validateMime($event->file->type)) {
            $event->file->tag = (new ImageTemplate())->tag();
        }
    }

    /**
     * @param $mime
     * @return bool
     */
    protected function validateMime($mime)
    {
        if ($mime == 'image/jpeg' || $mime == 'image/png' || $mime == 'image/gif' || $mime == 'image/svg+xml') {
            return true;
        }

        return false;
    }
}

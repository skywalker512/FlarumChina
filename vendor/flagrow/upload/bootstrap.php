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


namespace Flagrow\Upload;

use Flarum\Foundation\Application;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events, Application $app) {
    $events->subscribe(Listeners\AddClientAssets::class);
    $events->subscribe(Listeners\AddPostDownloadTags::class);
    $events->subscribe(Listeners\AddUploadsApi::class);
    $events->subscribe(Listeners\LoadSettingsFromDatabase::class);
    $events->subscribe(Listeners\ProcessesImages::class);

    $app->register(Providers\StorageServiceProvider::class);
    $app->register(Providers\DownloadProvider::class);
};

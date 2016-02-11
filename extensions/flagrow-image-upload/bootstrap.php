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

namespace Flagrow\ImageUpload;

use Flagrow\ImageUpload\Providers\StorageServiceProvider;
use Flarum\Foundation\Application;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events, Application $app) {

    // register the event listeners
    $events->subscribe(Listeners\AddClientAssets::class);
    // add attributes to API
    $events->subscribe(Listeners\LoadSettingsFromDatabase::class);
    // registers the API endpoint and the permission send to the API
    $events->subscribe(Listeners\AddUploadsApi::class);

    // register the service provider
    $app->register(StorageServiceProvider::class);
};

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

namespace Flagrow\Upload\Adapters;

use Flagrow\Upload\File;
use Flagrow\Upload\Helpers\Settings;

class OVH extends Local
{
    protected function generateUrl(File $file)
    {
        $settings = app()->make(Settings::class);
        
        $baseUrl = empty($settings->get('ovhRegion')) ?
            'https://storage.bhs1.cloud.ovh.net/v1/AUTH_' :
            sprintf('https://storage.%s.cloud.ovh.net/v1/AUTH_', $settings->get('ovhRegion'));
        
        $file->url = sprintf(
            $baseUrl . '%s/%s/%s',
            $settings->get('ovhTenantId'),
            $settings->get('ovhContainer'),
            $file->path
        );
    }
}

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

use Carbon\Carbon;
use Flagrow\Upload\Contracts\UploadAdapter;
use Flarum\Core\Discussion;
use Flarum\Core\Post;
use Flarum\Core\User;
use Flarum\Database\AbstractModel;
use Illuminate\Support\Str;

/**
 * @property int $id
 *
 * @property string $base_name
 * @property string $path
 * @property string $url
 * @property string $type
 * @property int $size
 * @property string $uuid
 *
 * @property string $humanSize
 *
 * @property string $upload_method
 * @property string $remote_id
 * @property string $tag
 *
 * @property int $post_id
 * @property Post $post
 *
 * @property int $discussion_id
 * @property Discussion $discussion
 *
 * @property int $actor_id
 * @property User $actor
 *
 * @property \Illuminate\Database\Eloquent\Collection|Download[] $downloads
 *
 * @property Carbon $created_at
 */
class File extends AbstractModel
{
    protected $table = 'flagrow_files';

    protected $appends = ['humanSize'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function discussion()
    {
        return $this->belongsTo(Discussion::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function downloads()
    {
        return $this->hasMany(Download::class);
    }

    /**
     * @param string|UploadAdapter $value
     */
    public function setUploadMethodAttribute($value)
    {
        if (is_object($value) && in_array(UploadAdapter::class, class_implements($value))) {
            $value = Str::snake(last(explode('\\', get_class($value))));
        }

        $this->attributes['upload_method'] = $value;
    }

    /**
     * @return string
     */
    public function getHumanSizeAttribute()
    {
        return $this->human_filesize($this->size);
    }

    /**
     * @param $bytes
     * @param int $decimals
     * @return string
     */
    public function human_filesize($bytes, $decimals = 0) {
        $size = array('B','kB','MB','GB','TB','PB','EB','ZB','YB');
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$size[$factor];
    }
}

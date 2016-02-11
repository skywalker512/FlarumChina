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

namespace flagrow\image\upload\Migration;

use Flarum\Database\AbstractMigration;
use Illuminate\Database\Schema\Blueprint;

class CreateFlagrowImagesTable extends AbstractMigration
{

    /**
     * Run the migrations.
     *
     * @info Called when extension is enabled. Never runs twice.
     */
    public function up()
    {
        $this->schema->create('flagrow_images', function (Blueprint $table) {
            $table->increments('id');

            // the user who posted the image
            $table->integer('user_id')->unsigned()->nullable();

            // the specific post id this image is appearing in
            $table->integer('post_id')->unsigned();

            // file name of the image
            $table->string('file_name')->nullable();

            // the method this file was uploaded to, allows for future erasing on remote systems
            $table->string('upload_method');

            // adds created_at
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @info Called using the uninstall button in the admin.
     */
    public function down()
    {
        $this->schema->drop('flagrow_images');
    }
}

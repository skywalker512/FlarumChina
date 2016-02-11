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

class AlterFlagrowImagesTable extends AbstractMigration
{

    /**
     * Run the migrations.
     *
     * @info Called when extension is enabled. Never runs twice.
     */
    public function up()
    {
        $this->schema->table('flagrow_images', function (Blueprint $table) {
            // the specific post id this image is appearing in
            $table->dropColumn('post_id');
            // file url of the image
            $table->string('file_url')->nullable();
            // file size of the image
            $table->integer('file_size')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @info Called using the uninstall button in the admin.
     */
    public function down()
    {
        $this->schema->table('flagrow_images', function (Blueprint $table) {
            $table->dropColumn('file_url');
            $table->dropColumn('file_size');
            $table->integer('post_id')->unsigned();
        });
    }
}

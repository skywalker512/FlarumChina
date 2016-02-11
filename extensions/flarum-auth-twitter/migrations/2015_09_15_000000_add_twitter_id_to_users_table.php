<?php
/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Auth\Twitter\Migration;

use Flarum\Database\AbstractMigration;
use Illuminate\Database\Schema\Blueprint;

class AddTwitterIdToUsersTable extends AbstractMigration
{
    public function up()
    {
        $this->schema->table('users', function (Blueprint $table) {
            $table->string('twitter_id')->nullable();
        });
    }

    public function down()
    {
        $this->schema->table('users', function (Blueprint $table) {
            $table->dropColumn('twitter_id');
        });
    }
}

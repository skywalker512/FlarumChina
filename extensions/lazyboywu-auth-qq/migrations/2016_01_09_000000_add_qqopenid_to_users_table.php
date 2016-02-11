<?php
namespace Lazyboywu\Auth\Qq\Migration;

use Illuminate\Database\Schema\Blueprint;
use Flarum\Database\AbstractMigration;

class AddQqopenidToUsersTable extends AbstractMigration
{
    public function up()
    {
        $this->schema->table('users', function (Blueprint $table) {
            $table->string('qqopenid', 100)->nullable();
        });
    }

    public function down()
    {
        $this->schema->table('users', function (Blueprint $table) {
            $table->dropColumn('qqopenid');
        });
    }
}

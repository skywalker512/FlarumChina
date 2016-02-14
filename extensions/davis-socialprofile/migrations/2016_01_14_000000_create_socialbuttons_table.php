<?php namespace Davis\SocialProfile\Migration;
use Flarum\Database\AbstractMigration;
use Illuminate\Database\Schema\Blueprint;
class CreateSocialbuttonsTable extends AbstractMigration
{
    public function up()
    {
        $this->schema->create('socialbuttons', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->longText('buttons');
        });
    }
    public function down()
    {
        $this->schema->drop('socialbuttons');
    }
}
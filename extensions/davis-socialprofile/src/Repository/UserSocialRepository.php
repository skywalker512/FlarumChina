<?php namespace Davis\SocialProfile\Repository;

use Davis\SocialProfile\Buttons;
use Illuminate\Database\Eloquent\Builder;
use Flarum\Core\User;

class UserSocialRepository
{
    public function query()
    {
        return Buttons::query();
    }
    public function findOrFail($id)
    {
        return Buttons::where('user_id', $id)->first();
    }
}

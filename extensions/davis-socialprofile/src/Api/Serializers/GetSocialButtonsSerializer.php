<?php namespace Davis\SocialProfile\Api\Serializers;

use Flarum\Core\Access\Gate;
use Flarum\Api\Serializer\UserBasicSerializer;

class GetSocialButtonsSerializer extends UserBasicSerializer
{
    protected $gate;

    public function __construct(Gate $gate)
    {
        $this->gate = $gate;
    }

    protected function getDefaultAttributes($user)
    {
        $gate = $this->gate->forUser($this->actor);

        $attributes = [
            'buttons'              => $user->buttons,
        ];

        return $attributes;
    }
}

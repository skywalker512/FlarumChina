<?php namespace Davis\InviteOnly\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class CreateNewCodeSerializer extends AbstractSerializer
{

    protected $type = 'referals';

    protected function getDefaultAttributes($referals)
    {
        return [
            'id'            => (int) $referals->id,
            'created_at'    => $referals->created_at,
            'token'         => $referals->token,
            'used'          => $referals->used,
            'used_by'       => $referals->used_by,
            'used_at'       => $referals->used_at
        ];
    }
}

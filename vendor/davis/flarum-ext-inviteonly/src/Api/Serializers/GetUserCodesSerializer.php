<?php namespace Davis\InviteOnly\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;

class GetUserCodesSerializer extends AbstractSerializer
{

    protected $type = 'referals';

    protected function getDefaultAttributes($referals)
    {
        $attributes = [];
        for ($i = 0; $i < count($referals); $i++) {
            $attributes[$i] = [
                'id'        => (int) $referals[$i]->id,
                'created_at'   => $referals[$i]->created_at,
                'token'     => $referals[$i]->token,
                'used'      => $referals[$i]->used,
                'used_by'   => $referals[$i]->used_by,
                'used_at'   => $referals[$i]->used_at
            ];
        }
        return $attributes;
    }
    
}
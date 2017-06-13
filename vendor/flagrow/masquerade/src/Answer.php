<?php

namespace Flagrow\Masquerade;

use Carbon\Carbon;
use Flarum\Core\User;
use Flarum\Database\AbstractModel;

/**
 * @property int $id
 * @property int $field_id
 * @property Field $field
 * @property int $user_id
 * @property User $user
 * @property string $content
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Answer extends AbstractModel
{
    protected $table = 'flagrow_masquerade_answers';
    protected $fillable = ['*'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function field()
    {
        return $this->belongsTo(Field::class);
    }
}

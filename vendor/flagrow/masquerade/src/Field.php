<?php

namespace Flagrow\Masquerade;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string $prefix
 * @property string $icon
 * @property bool $required
 * @property string $validation
 * @property integer $sort
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon $deleted_at
 * @property \Illuminate\Database\Eloquent\Collection|Answer[] $answers
 */
class Field extends AbstractModel
{
    use SoftDeletes;

    protected $table = 'flagrow_masquerade_fields';

    protected $casts = ['required' => 'boolean'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}

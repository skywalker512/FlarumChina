<?php

namespace Flagrow\Byobu\Gambits\Discussion;

use Flarum\Core\Search\AbstractRegexGambit;
use Flarum\Core\Search\AbstractSearch;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\Expression;

class PrivacyGambit extends AbstractRegexGambit
{
    /**
     * {@inheritdoc}
     */
    protected $pattern = 'is:private';

    /**
     * Apply conditions to the search, given that the gambit was matched.
     *
     * @param AbstractSearch $search The search object.
     * @param array $matches An array of matches from the search bit.
     * @param bool $negate Whether or not the bit was negated, and thus whether
     *     or not the conditions should be negated.
     * @return mixed
     */
    protected function conditions(AbstractSearch $search, array $matches, $negate)
    {
        $actor = $search->getActor();

        // Flag to indicate whether public discussions should be shown.
        $showPublic = empty($matches) || $negate;

        // Flag to indicate whether to show private discussions.
        $showPrivate = ($showPublic && empty($matches)) || (count($matches) && !$negate);

        $search->getQuery()->where(function (Builder $query) use ($showPublic, $showPrivate, $actor) {
            if ($showPublic) {
                $query->whereNotExists(function (Builder $query) {
                    $query->select(app('flarum.db')->raw(1))
                        ->from('recipients')
                        ->where('discussions.id', new Expression('discussion_id'))
                        ->whereNull('removed_at');
                });
            }
            if ($showPrivate && $actor->exists) {
                $method = $showPublic ? 'orW' : 'w';
                $method .= 'hereExists';

                $query->{$method}(function (Builder $query) use ($actor) {
                    $query->select(app('flarum.db')->raw(1))
                        ->from('recipients')
                        ->where('discussions.id', new Expression('discussion_id'))
                        ->whereNull('removed_at')
                        ->where(function (Builder $query) use ($actor) {
                            $query
                                ->where('user_id', $actor->id)
                                ->orWhereIn('group_id', $actor->groups->pluck('id')->all());
                        });
                });
            }
        });
    }
}

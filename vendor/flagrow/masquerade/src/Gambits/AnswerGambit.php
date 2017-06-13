<?php

namespace Flagrow\Masquerade\Gambits;

use Flarum\Core\Search\AbstractSearch;
use Flarum\Core\Search\GambitInterface;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\Expression;

class AnswerGambit implements GambitInterface
{
    /**
     * Apply conditions to the searcher for a bit of the search string.
     *
     * @param AbstractSearch $search
     * @param string $bit The piece of the search string.
     * @return bool Whether or not the gambit was active for this bit.
     */
    public function apply(AbstractSearch $search, $bit)
    {
        $q = $search->getQuery();

        if ($bit) {
            $q->orWhereExists(function ($query) use ($bit) {
                $query->select(app('flarum.db')->raw(1))
                    ->from('flagrow_masquerade_answers')
                    ->where('users.id', new Expression('user_id'))
                    ->where('content', 'like', "%$bit%");
            });

            return true;
        }

        return false;
    }
}

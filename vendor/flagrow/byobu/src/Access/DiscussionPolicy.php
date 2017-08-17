<?php

namespace Flagrow\Byobu\Access;

use Flagrow\Byobu\Traits\ProvidesAccess;
use Flarum\Core\Discussion;
use Flarum\Core\User;
use Flarum\Event\ScopeHiddenDiscussionVisibility;
use Flarum\Event\ScopePrivateDiscussionVisibility;
use Flarum\Extension\ExtensionManager;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Query\Expression;

class DiscussionPolicy extends AbstractPolicy
{

    use ProvidesAccess;
    /**
     * @var ExtensionManager
     */
    protected $extensions;

    /**
     * {@inheritdoc}
     */
    protected $model = Discussion::class;

    /**
     * DiscussionPolicy constructor.
     * @param ExtensionManager $extensions
     */
    public function __construct(ExtensionManager $extensions)
    {
        $this->extensions = $extensions;
    }

    /**
     * @param User $actor
     * @param string $ability
     * @param Discussion $discussion
     * @return bool
     */
    public function before(User $actor, $ability, Discussion $discussion)
    {
        return $this->granted($discussion, $actor);
    }

    /**
     * @param User $actor
     * @param EloquentBuilder $query
     */
    public function find(User $actor, EloquentBuilder $query)
    {
        $query->where(function($query) use ($actor) {

            $query->whereNotExists(function (Builder $query) {
                return $query->select(app('flarum.db')->raw(1))
                    ->from('recipients')
                    ->where('discussions.id', new Expression('discussion_id'))
                    ->whereNull('removed_at');
            });

            $this->transformVisibilityQuery($actor, $query);
        });
    }

    /**
     * @param ScopePrivateDiscussionVisibility $event
     */
    public function scopePrivateDiscussionVisibility(ScopePrivateDiscussionVisibility $event)
    {
        $this->transformVisibilityQuery($event->actor, $event->query);
    }

    public function scopeHiddenDiscussionVisibility(ScopeHiddenDiscussionVisibility $event)
    {
        $this->transformVisibilityQuery($event->actor, $event->query);
    }

    /**
     * @param User $actor
     * @param EloquentBuilder $query
     */
    protected function transformVisibilityQuery(User $actor, EloquentBuilder &$query)
    {
        if ($actor->exists) {
            $query->orWhereExists(function (Builder $query) use ($actor) {
                return $query->select(app('flarum.db')->raw(1))
                    ->from('recipients')
                    ->where('discussions.id', new Expression('discussion_id'))
                    ->whereNull('removed_at')
                    ->where(function (Builder $query) use ($actor) {
                        $query->where('recipients.user_id', $actor->id);
                        if (!$actor->groups->isEmpty()) {
                            $query->orWhereIn('recipients.group_id', $actor->groups->pluck('id')->all());
                        }

                        return $query;
                    });
            });
        }
    }
}

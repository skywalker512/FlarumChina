<?php

namespace Flagrow\Byobu\Access;

use Flagrow\Byobu\Traits\ProvidesAccess;
use Flarum\Core\Discussion;
use Flarum\Core\Post;
use Flarum\Core\User;
use Flarum\Event\ScopePrivatePostVisibility;
use Flarum\Extension\ExtensionManager;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;

class PostPolicy extends AbstractPolicy
{

    use ProvidesAccess;

    /**
     * @var ExtensionManager
     */
    protected $extensions;

    /**
     * {@inheritdoc}
     */
    protected $model = Post::class;

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

            $this->showWithFlags($query, $actor, 'flags');
        });
    }

    /**
     * @param ScopePrivatePostVisibility $event
     */
    public function scopePrivatePostVisibility(ScopePrivatePostVisibility $event)
    {
        $this->queryConstraints($event->discussion, $event->actor, $event->query);
    }


    /**
     * @param Discussion $discussion
     * @param User $actor
     * @param EloquentBuilder|Builder $query
     */
    protected function queryConstraints(Discussion $discussion, User $actor, EloquentBuilder &$query)
    {
        // Close down to only specific users.
        if (!$discussion->recipientUsers->isEmpty() || !$discussion->recipientGroups->isEmpty()) {
            if ($actor->exists && $this->granted($discussion, $actor)) {
                $query->orWhere('is_private', 1);
            }

            $this->showWithFlags($query, $actor, 'flags');
        }
    }
}

<?php

namespace Flagrow\Byobu\Posts;

use Flagrow\Byobu\Events\AbstractRecipientsEvent;
use Flarum\Core\Post;
use Flarum\Core\Post\AbstractEventPost;
use Flarum\Core\Post\MergeableInterface;

/**
 * @property array $content
 */
class RecipientsModified extends AbstractEventPost implements MergeableInterface
{
    /**
     * {@inheritdoc}
     */
    public static $type = 'recipientsModified';

    protected $states = ['new', 'old'];
    protected $types = ['users', 'groups'];

    /**
     * @param Post|null|RecipientsModified $previous
     * @return $this|RecipientsModified|Post
     */
    public function saveAfter(Post $previous = null)
    {
        /** @var RecipientsModified $previous */
        if ($previous instanceof static) {
            // .. @todo
        }

        $this->save();

        return $this;
    }

    /**
     * Create a new instance in reply to a discussion.
     * @param AbstractRecipientsEvent $event
     * @return static
     */
    public static function reply(AbstractRecipientsEvent $event)
    {
        $post = new static;

        $post->content = [
            'new' => [
                'users' => $event->newUsers->all(),
                'groups' => $event->newGroups->all()
            ],
            'old' => [
                'users' => $event->oldUsers->pluck('id')->all(),
                'groups' => $event->oldGroups->pluck('id')->all()
            ]
        ];
        $post->time = time();
        $post->discussion_id = $event->discussion->id;
        $post->user_id = $event->actor->id;

        return $post;
    }
}


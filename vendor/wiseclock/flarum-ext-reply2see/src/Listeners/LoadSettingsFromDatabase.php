<?php

namespace WiseClock\Reply2See\Listeners;

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;
use Symfony\Component\Translation\TranslatorInterface;
use Flarum\Core\Post\CommentPost;

class LoadSettingsFromDatabase
{
    protected $translator;

    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(PostSerializer::class) && $event->model instanceof CommentPost)
        {
            $newHTML = $event->attributes['contentHtml'];
            if (strpos($newHTML, '<reply2see>') === false)
                return;

            $isStartPost = $event->model['relations']['discussion']->start_post_id == $event->model->id;
            if (!$isStartPost)
            {
                $newHTML = preg_replace('/<reply2see>(.*?)<\/reply2see>/is', '<div>$1</div>', $newHTML);
                $event->attributes['contentHtml'] = $newHTML;
                return;
            }

            $usersModel = $event->model['relations']['discussion']->participants()->get('id');
            $users = array();
            foreach ($usersModel as $user)
            {
                $users[] = $user->id;
            }
            $replied = !$event->actor->isGuest() && in_array($event->actor->id, $users);

            if ($replied)
                $newHTML = preg_replace('/<reply2see>(.*?)<\/reply2see>/is', '<div class="reply2see"><div class="reply2see_title">' . $this->translator->trans('wiseclock-reply2see.forum.hidden_content') . '</div>$1</div>', $newHTML);
            else
                $newHTML = preg_replace('/<reply2see>(.*?)<\/reply2see>/is', '<div class="reply2see"><div class="reply2see_alert">' . $this->translator->trans('wiseclock-reply2see.forum.reply_to_see', array('{reply}' => '<a class="reply2see_reply">' . $this->translator->trans('core.forum.discussion_controls.reply_button') . '</a>')) . '</div></div>', $newHTML);

            $event->attributes['contentHtml'] = $newHTML;
        }
    }
}

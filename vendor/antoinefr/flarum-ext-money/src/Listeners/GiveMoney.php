<?php namespace AntoineFr\Money\Listeners;

use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Event\PostWillBeSaved;
use Flarum\Event\DiscussionWillBeSaved;
use Flarum\Event\UserWillBeSaved;

class GiveMoney
{
    use AssertPermissionTrait;
    
    protected $settings;
    public function __construct(SettingsRepositoryInterface $settings) {
        $this->settings = $settings;
    }
    
    public function subscribe(Dispatcher $events) {
        $events->listen(PostWillBeSaved::class, [$this, 'postWillBeSaved']);
        $events->listen(DiscussionWillBeSaved::class, [$this, 'discussionWillBeSaved']);
        $events->listen(UserWillBeSaved::class, [$this, 'userWillBeSaved']);
    }
    
    public function postWillBeSaved(PostWillBeSaved $event) {
        if (!isset($event->data['id']) && $event->data['type'] == 'posts') {
            $money = (float)$this->settings->get('antoinefr-money.moneyforpost', 0);
            $event->actor->money += $money;
            $event->actor->save();
        }
    }
    
    public function discussionWillBeSaved(DiscussionWillBeSaved $event) {
        if (!isset($event->data['id'])) {
            $money = (float)$this->settings->get('antoinefr-money.moneyfordiscussion', 0);
            $event->actor->money += $money;
            $event->actor->save();
        }
    }
    
    public function userWillBeSaved(UserWillBeSaved $event) {
        $attributes = array_get($event->data, 'attributes', []);
        if (array_key_exists('money', $attributes)) {
            $user = $event->user;
            $actor = $event->actor;
            $this->assertCan($actor, 'edit_money', $user);
            $user->money = (float)$attributes['money'];
        }
    }
}
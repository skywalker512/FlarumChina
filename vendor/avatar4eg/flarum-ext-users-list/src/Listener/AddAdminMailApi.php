<?php
namespace Avatar4eg\UsersList\Listener;

use Avatar4eg\UsersList\Api\Controller\SendAdminEmailController;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\ConfigureApiRoutes;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Events\Dispatcher;

class AddAdminMailApi
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
        //$events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->post('/admin-mail', 'avatar4eg.users-list.create-mail', SendAdminEmailController::class);
    }

//    /**
//     * @param PrepareApiAttributes $event
//     */
//    public function prepareApiAttributes(PrepareApiAttributes $event)
//    {
//        if ($event->isSerializer(ForumSerializer::class)) {
//            $event->attributes['canAddGeotags'] = $event->actor->can('avatar4eg.geotags.create');
//        }
//    }
}

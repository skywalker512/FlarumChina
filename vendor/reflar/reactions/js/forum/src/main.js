import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Post from 'flarum/models/Post';
import Model from 'flarum/Model';
import NotificationGrid from 'flarum/components/NotificationGrid';

import addReactionAction from 'reflar/reactions/addReactionAction';
import PostReactedNotification from 'reflar/reactions/components/PostReactedNotification';
// import addLikesList from 'reflar/reactions/addLikesList';
import Reaction from 'reflar/reactions/models/Reaction';

app.initializers.add('reflar-reactions', () => {
  app.store.models.reactions = Reaction;

  app.notificationComponents.postReacted = PostReactedNotification;

  Post.prototype.canReact = Model.attribute('canReact');
  Post.prototype.reactions = Model.hasMany('reactions');

  addReactionAction();

  extend(NotificationGrid.prototype, 'notificationTypes', (items) => {
    items.add('postReacted', {
      name: 'postReacted',
      icon: 'eye',
      label: app.translator.trans('flarum-likes.forum.settings.notify_post_reacted_label'),
    });
  });
});

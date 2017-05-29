import Notification from 'flarum/components/Notification';

export default class DownvotedNotification extends Notification {
    icon() {
        return 'thumbs-down';
    }

    href() {
        return app.route.post(this.props.notification.subject());
    }

    content() {
        return app.translator.trans('reflar-gamification.forum.notification.downvote');
    }

    excerpt() {
        return this.props.notification.subject().contentPlain();
    }
}

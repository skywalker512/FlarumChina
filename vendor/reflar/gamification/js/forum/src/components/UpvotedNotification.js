import Notification from 'flarum/components/Notification';

export default class UpvotedNotification extends Notification {
    icon() {
        return 'thumbs-up';
    }

    href() {
        return app.route.post(this.props.notification.subject());
    }

    content() {
        return app.translator.trans('reflar-gamification.forum.notification.upvote');
    }

    excerpt() {
        return this.props.notification.subject().contentPlain();
    }
}

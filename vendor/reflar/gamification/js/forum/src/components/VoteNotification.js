import Notification from 'flarum/components/Notification'

export default class UpvotedNotification extends Notification {
  icon () {
    if (this.props.notification.content() === 'Up') {
      return 'thumbs-up'
    } else {
      return 'thumbs-down'
    }
  }

  href () {
    return app.route.post(this.props.notification.subject())
  }

  content () {
    if (this.props.notification.content() === 'Up') {
      return app.translator.trans('reflar-gamification.forum.notification.upvote', {username: this.props.notification.sender().username()})
    } else {
      return app.translator.trans('reflar-gamification.forum.notification.downvote', {username: this.props.notification.sender().username()})
    }
  }

  excerpt () {
    return this.props.notification.subject().contentPlain()
  }
}

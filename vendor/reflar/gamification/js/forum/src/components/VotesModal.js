import Modal from 'flarum/components/Modal';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';

export default class VotesModal extends Modal {
  className() {
    return 'VotesModal Modal--small';
  }

  title() {
    return app.translator.trans('reflar-gamification.forum.modal.title');
  }

  content() {
    return (
      <div className="Modal-body">
        <ul className="VotesModal-list">
          <legend>
            {app.translator.trans('reflar-gamification.forum.modal.upvotes_label')}
          </legend>
          {this.props.post.upvotes().map(user => (
            <li>
              <a href={app.route.user(user)} config={m.route}>
                {avatar(user)} {' '}
                {username(user)}
              </a>
            </li>
          ))}
          <legend>
            {app.translator.trans('reflar-gamification.forum.modal.downvotes_label')}
          </legend>
          {this.props.post.downvotes().map(user => (
            <li>
              <a href={app.route.user(user)} config={m.route}>
                {avatar(user)} {' '}
                {username(user)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
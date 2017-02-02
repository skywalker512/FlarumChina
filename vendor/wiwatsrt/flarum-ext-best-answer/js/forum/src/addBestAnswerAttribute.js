import app from 'flarum/app';
import { extend } from 'flarum/extend';
import CommentPost from 'flarum/components/CommentPost';
import PostComponent from 'flarum/components/Post';

export default function() {
    extend(CommentPost.prototype, 'headerItems', function (items) {
        if (this.props.post.discussion().bestAnswerPost() == this.props.post && !this.props.post.isHidden()) {
            items.add('isBestAnswer', app.translator.trans('flarum-best-answer.forum.best_answer_button'));
        }
    });

    extend(PostComponent.prototype, 'attrs', function (attrs) {
        if (this.props.post.discussion().bestAnswerPost() == this.props.post && !this.props.post.isHidden()) {
            attrs.className += ' Post--bestAnswer';
        }
    });
}
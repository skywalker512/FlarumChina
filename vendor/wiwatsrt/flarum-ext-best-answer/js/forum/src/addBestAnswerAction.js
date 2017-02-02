import app from 'flarum/app';
import { extend } from 'flarum/extend';
import Button from 'flarum/components/Button';
import CommentPost from 'flarum/components/CommentPost';
import DiscussionPage from 'flarum/components/DiscussionPage';

export default function() {
    extend(CommentPost.prototype, 'actionItems', function (items) {
        var post = this.props.post;
        var discussion = this.props.post.discussion();

        if (post.isHidden() || !discussion.canSelectBestAnswer() || !app.session.user || discussion.attribute('startUserId') != app.session.user.id()) return;

        var isBestAnswer = (discussion.bestAnswerPost() && discussion.bestAnswerPost() == post);
        post.pushAttributes({isBestAnswer});

        items.add('bestAnswer', Button.component({
            children: app.translator.trans(isBestAnswer ? 'flarum-best-answer.forum.remove_best_answer' : 'flarum-best-answer.forum.this_best_answer'),
            className: 'Button Button--link',
            onclick: function onclick() {
                isBestAnswer = !isBestAnswer;
                discussion.save({
                    bestAnswerPostId: isBestAnswer ? post.id() : 0,
                    relationships: isBestAnswer ? {bestAnswerPost: post} : delete discussion.data.relationships.bestAnswerPost
                }).then(() => {
                    if (app.current instanceof DiscussionPage) {
                        app.current.stream.update();
                    }
                    m.redraw();
                });
                if(isBestAnswer) {
                    m.route(app.route.post(discussion.posts()[0]));
                }
            }
        }));
    });
}
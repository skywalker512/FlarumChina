import app from 'flarum/app';
import { extend } from 'flarum/extend';
import CommentPost from 'flarum/components/CommentPost';
import icon from 'flarum/helpers/icon';
import PostMeta from 'flarum/components/PostMeta';
import username from 'flarum/helpers/username';
import userOnline from 'flarum/helpers/userOnline';

export default function() {
    extend(CommentPost.prototype, 'footerItems', function (items) {

        var discussion = this.props.post.discussion();

        if (discussion.bestAnswerPost() && this.props.post.number() == 1 && !this.props.post.isHidden()) {
            var post = discussion.bestAnswerPost();
            if (post.isHidden()) return;
            var user = discussion.bestAnswerPost().user();
            items.add('bestAnswerPost', m(
                'div',
                {className: 'CommentPost'},
                m(".Post-header",
                    m('ul',
                        m('li',
                            {className: 'item-user'},
                            m('.PostUser',
                                userOnline(user),
                                m('h3',
                                    m(
                                        'a',
                                        {href: app.route.user(user), config: m.route},
                                        username(user)
                                    )
                                )
                            )
                        ), m('li',
                            {className: 'item-meta'},
                            PostMeta.component({post})
                        ), m('li',
                            {className: 'item-bestAnswerButton'}, m('a',
                                {
                                    href: app.route.post(post),
                                    config: m.route,
                                    'data-number': post.number()
                                },
                                icon('check'),
                                app.translator.trans('flarum-best-answer.forum.best_answer_button')
                            )
                        )
                    )
                ),
                m(".Post-body",
                    m.trust(discussion.bestAnswerPost().contentHtml())
                )
            ), -10);
        }
    });
}
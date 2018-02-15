'use strict';

System.register('wiwatSrt/bestAnswer/addBestAnswerAction', ['flarum/app', 'flarum/extend', 'flarum/components/Button', 'flarum/components/CommentPost', 'flarum/components/DiscussionPage'], function (_export, _context) {
    "use strict";

    var app, extend, Button, CommentPost, DiscussionPage;

    _export('default', function () {
        extend(CommentPost.prototype, 'actionItems', function (items) {
            var post = this.props.post;
            var discussion = this.props.post.discussion();

            if (post.isHidden() || !discussion.canSelectBestAnswer() || !app.session.user || discussion.attribute('startUserId') != app.session.user.id()) return;

            var isBestAnswer = discussion.bestAnswerPost() && discussion.bestAnswerPost() == post;
            post.pushAttributes({ isBestAnswer: isBestAnswer });

            items.add('bestAnswer', Button.component({
                children: app.translator.trans(isBestAnswer ? 'flarum-best-answer.forum.remove_best_answer' : 'flarum-best-answer.forum.this_best_answer'),
                className: 'Button Button--link',
                onclick: function onclick() {
                    isBestAnswer = !isBestAnswer;
                    discussion.save({
                        bestAnswerPostId: isBestAnswer ? post.id() : 0,
                        relationships: isBestAnswer ? { bestAnswerPost: post } : delete discussion.data.relationships.bestAnswerPost
                    }).then(function () {
                        if (app.current instanceof DiscussionPage) {
                            app.current.stream.update();
                        }
                        m.redraw();
                    });
                    if (isBestAnswer) {
                        m.route(app.route.post(discussion.posts()[0]));
                    }
                }
            }));
        });
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }, function (_flarumComponentsDiscussionPage) {
            DiscussionPage = _flarumComponentsDiscussionPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('wiwatSrt/bestAnswer/addBestAnswerAttribute', ['flarum/app', 'flarum/extend', 'flarum/components/CommentPost', 'flarum/components/Post'], function (_export, _context) {
    "use strict";

    var app, extend, CommentPost, PostComponent;

    _export('default', function () {
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
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }, function (_flarumComponentsPost) {
            PostComponent = _flarumComponentsPost.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('wiwatSrt/bestAnswer/addBestAnswerBadge', ['flarum/app', 'flarum/extend', 'flarum/components/Badge', 'flarum/models/Discussion'], function (_export, _context) {
    "use strict";

    var app, extend, Badge, Discussion;

    _export('default', function () {
        extend(Discussion.prototype, 'badges', function (items) {
            if (this.bestAnswerPost() && !items.has('hidden')) {
                items.add('bestAnswer', m(Badge, {
                    type: 'bestAnswer',
                    icon: 'check',
                    label: app.translator.trans('flarum-best-answer.forum.best_answer')
                }));
            }
        });
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsBadge) {
            Badge = _flarumComponentsBadge.default;
        }, function (_flarumModelsDiscussion) {
            Discussion = _flarumModelsDiscussion.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('wiwatSrt/bestAnswer/addBestAnswerFirstPost', ['flarum/app', 'flarum/extend', 'flarum/components/CommentPost', 'flarum/helpers/icon', 'flarum/components/PostMeta', 'flarum/helpers/username', 'flarum/helpers/userOnline'], function (_export, _context) {
    "use strict";

    var app, extend, CommentPost, icon, PostMeta, username, userOnline;

    _export('default', function () {
        extend(CommentPost.prototype, 'footerItems', function (items) {

            var discussion = this.props.post.discussion();

            if (discussion.bestAnswerPost() && this.props.post.number() == 1 && !this.props.post.isHidden()) {
                var post = discussion.bestAnswerPost();
                if (post.isHidden()) return;
                var user = discussion.bestAnswerPost().user();
                items.add('bestAnswerPost', m('div', { className: 'CommentPost' }, m(".Post-header", m('ul', m('li', { className: 'item-user' }, m('.PostUser', userOnline(user), m('h3', m('a', { href: app.route.user(user), config: m.route }, username(user))))), m('li', { className: 'item-meta' }, PostMeta.component({ post: post })), m('li', { className: 'item-bestAnswerButton' }, m('a', {
                    href: app.route.post(post),
                    config: m.route,
                    'data-number': post.number()
                }, icon('check'), app.translator.trans('flarum-best-answer.forum.best_answer_button'))))), m(".Post-body", m.trust(discussion.bestAnswerPost().contentHtml()))), -10);
            }
        });
    });

    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponentsPostMeta) {
            PostMeta = _flarumComponentsPostMeta.default;
        }, function (_flarumHelpersUsername) {
            username = _flarumHelpersUsername.default;
        }, function (_flarumHelpersUserOnline) {
            userOnline = _flarumHelpersUserOnline.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('wiwatSrt/bestAnswer/main', ['flarum/app', 'flarum/extend', 'flarum/models/Discussion', 'flarum/Model', 'wiwatSrt/bestAnswer/addBestAnswerAction', 'wiwatSrt/bestAnswer/addBestAnswerAttribute', 'wiwatSrt/bestAnswer/addBestAnswerBadge', 'wiwatSrt/bestAnswer/addBestAnswerFirstPost'], function (_export, _context) {
    "use strict";

    var app, extend, Discussion, Model, addBestAnswerAction, addBestAnswerAttribute, addBestAnswerBadge, addBestAnswerFirstPost;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumModelsDiscussion) {
            Discussion = _flarumModelsDiscussion.default;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_wiwatSrtBestAnswerAddBestAnswerAction) {
            addBestAnswerAction = _wiwatSrtBestAnswerAddBestAnswerAction.default;
        }, function (_wiwatSrtBestAnswerAddBestAnswerAttribute) {
            addBestAnswerAttribute = _wiwatSrtBestAnswerAddBestAnswerAttribute.default;
        }, function (_wiwatSrtBestAnswerAddBestAnswerBadge) {
            addBestAnswerBadge = _wiwatSrtBestAnswerAddBestAnswerBadge.default;
        }, function (_wiwatSrtBestAnswerAddBestAnswerFirstPost) {
            addBestAnswerFirstPost = _wiwatSrtBestAnswerAddBestAnswerFirstPost.default;
        }],
        execute: function () {

            app.initializers.add('wiwatSrt-bestAnswer', function () {
                Discussion.prototype.bestAnswerPost = Model.hasOne('bestAnswerPost');
                Discussion.prototype.canSelectBestAnswer = Model.attribute('canSelectBestAnswer');

                addBestAnswerAction();
                addBestAnswerAttribute();
                addBestAnswerBadge();
                addBestAnswerFirstPost();
            });
        }
    };
});
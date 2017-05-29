System.register('wiseclock/flarum-ext-reply2see/main', ['flarum/extend', 'flarum/app', 'flarum/components/CommentPost', 'flarum/components/DiscussionPage', 'flarum/utils/DiscussionControls', 'flarum/components/LogInModal'], function (_export) {
    'use strict';

    var extend, override, app, CommentPost, DiscussionPage, DiscussionControls, LogInModal;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
            override = _flarumExtend.override;
        }, function (_flarumApp) {
            app = _flarumApp['default'];
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost['default'];
        }, function (_flarumComponentsDiscussionPage) {
            DiscussionPage = _flarumComponentsDiscussionPage['default'];
        }, function (_flarumUtilsDiscussionControls) {
            DiscussionControls = _flarumUtilsDiscussionControls['default'];
        }, function (_flarumComponentsLogInModal) {
            LogInModal = _flarumComponentsLogInModal['default'];
        }],
        execute: function () {

            app.initializers.add('wiseclock-reply2see', function () {
                extend(CommentPost.prototype, 'config', function () {
                    if (app.session.user && app.current instanceof DiscussionPage) $('.reply2see_reply').off('click').on('click', function () {
                        return DiscussionControls.replyAction.call(app.current.discussion, true, false);
                    });else $('.reply2see_reply').off('click').on('click', function () {
                        return app.modal.show(new LogInModal());
                    });
                });
            });
        }
    };
});
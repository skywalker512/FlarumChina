"use strict";

System.register("flagrow/split/addSplitControl", ["flarum/extend", "flarum/app", "flarum/utils/PostControls", "flarum/components/Button", "flarum/components/CommentPost", "flagrow/split/components/SplitPostModal"], function (_export, _context) {
    "use strict";

    var extend, app, PostControls, Button, CommentPost, SplitPostModal;

    _export("default", function (controller) {

        extend(PostControls, 'moderationControls', function (items, post) {
            var discussion = post.discussion();

            if (post.contentType() !== 'comment' || !discussion.canSplit() || post.number() == 1) return;

            items.add('splitFrom', [m(Button, {
                icon: 'code-fork',
                className: 'flagrow-split-startSplitButton',
                onclick: function onclick() {
                    controller.start(post.id(), post.number());
                }
            }, app.translator.trans('flagrow-split.forum.split.from'))]);
        });

        extend(CommentPost.prototype, 'footerItems', function (items) {
            var post = this.props.post;
            var discussion = post.discussion();

            if (post.contentType() !== 'comment' || !discussion.canSplit() || post.number() == 1) return;

            items.add('splitTo', [m(Button, {
                icon: 'code-fork',
                className: 'flagrow-split-endSplitButton Button Button--link',
                onclick: function onclick() {
                    controller.end(post.number());
                    var splitModal = new SplitPostModal();
                    splitModal.setController(controller);
                    app.modal.show(splitModal);
                },
                style: { display: 'none' }
            }, app.translator.trans('flagrow-split.forum.split.to'))]);
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumUtilsPostControls) {
            PostControls = _flarumUtilsPostControls.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }, function (_flagrowSplitComponentsSplitPostModal) {
            SplitPostModal = _flagrowSplitComponentsSplitPostModal.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/split/components/DiscussionSplit', ['flarum/components/EventPost'], function (_export, _context) {
    "use strict";

    var EventPost, DiscussionSplit;
    return {
        setters: [function (_flarumComponentsEventPost) {
            EventPost = _flarumComponentsEventPost.default;
        }],
        execute: function () {
            DiscussionSplit = function (_EventPost) {
                babelHelpers.inherits(DiscussionSplit, _EventPost);

                function DiscussionSplit() {
                    babelHelpers.classCallCheck(this, DiscussionSplit);
                    return babelHelpers.possibleConstructorReturn(this, (DiscussionSplit.__proto__ || Object.getPrototypeOf(DiscussionSplit)).apply(this, arguments));
                }

                babelHelpers.createClass(DiscussionSplit, [{
                    key: 'icon',
                    value: function icon() {
                        return 'code-fork';
                    }
                }, {
                    key: 'descriptionKey',
                    value: function descriptionKey() {
                        if (this.props.post.content()['toNew']) {
                            return 'flagrow-split.forum.post.was_split_to';
                        }

                        return 'flagrow-split.forum.post.was_split_from';
                    }
                }, {
                    key: 'descriptionData',
                    value: function descriptionData() {
                        return {
                            'count': this.props.post.content()['count'],
                            'target': m(
                                'a',
                                { className: 'EventPost-Split-target', href: this.props.post.content()['url'],
                                    config: m.route },
                                this.props.post.content()['title']
                            )
                        };
                    }
                }]);
                return DiscussionSplit;
            }(EventPost);

            _export('default', DiscussionSplit);
        }
    };
});;
'use strict';

System.register('flagrow/split/components/SplitController', [], function (_export, _context) {
    "use strict";

    var SplitController;
    return {
        setters: [],
        execute: function () {
            SplitController = function () {
                function SplitController() {
                    babelHelpers.classCallCheck(this, SplitController);

                    this.reset();
                }

                babelHelpers.createClass(SplitController, [{
                    key: 'start',
                    value: function start(postId, postNumber) {
                        this.reset();

                        this.startPostId = postId;

                        $('.PostStream-item').each(function () {
                            if ($(this).attr('data-number') >= postNumber) {
                                $('.flagrow-split-endSplitButton', $(this)).show();
                            }
                        });

                        $('.flagrow-split-startSplitButton').hide();
                    }
                }, {
                    key: 'end',
                    value: function end(postNumber) {
                        this.endPostNumber = postNumber;
                    }
                }, {
                    key: 'reset',
                    value: function reset() {
                        this.startPostId = null;
                        this.endPostNumber = null;
                    }
                }]);
                return SplitController;
            }();

            _export('default', SplitController);
        }
    };
});;
"use strict";

System.register("flagrow/split/components/SplitPostModal", ["flarum/components/Modal", "flarum/components/Button"], function (_export, _context) {
    "use strict";

    var Modal, Button, SplitPostModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }],
        execute: function () {
            SplitPostModal = function (_Modal) {
                babelHelpers.inherits(SplitPostModal, _Modal);

                function SplitPostModal() {
                    babelHelpers.classCallCheck(this, SplitPostModal);
                    return babelHelpers.possibleConstructorReturn(this, (SplitPostModal.__proto__ || Object.getPrototypeOf(SplitPostModal)).apply(this, arguments));
                }

                babelHelpers.createClass(SplitPostModal, [{
                    key: "init",
                    value: function init() {
                        babelHelpers.get(SplitPostModal.prototype.__proto__ || Object.getPrototypeOf(SplitPostModal.prototype), "init", this).call(this);

                        this.newDiscussionTitle = m.prop('');
                    }
                }, {
                    key: "setController",
                    value: function setController(controller) {
                        this.split = controller;
                    }
                }, {
                    key: "className",
                    value: function className() {
                        return 'SplitPostModal Modal--small';
                    }
                }, {
                    key: "title",
                    value: function title() {
                        return app.translator.trans('flagrow-split.forum.modal.title');
                    }
                }, {
                    key: "content",
                    value: function content() {
                        return [m('div', { className: 'Modal-body' }, [m('div', { className: 'Form Form--centered' }, [m('div', { className: 'Form-group' }, [m('label', {}, app.translator.trans('flagrow-split.forum.modal.new_discussion_label')), m('input', {
                            className: 'FormControl',
                            name: 'new_discussion_title',
                            value: this.newDiscussionTitle(),
                            oninput: m.withAttr('value', this.newDiscussionTitle)
                        })]), m('div', { className: 'Form-group' }, [m(Button, {
                            className: 'Button Button--primary Button--block',
                            type: 'submit',
                            loading: this.loading,
                            disabled: !this.newDiscussionTitle()
                        }, app.translator.trans('flagrow-split.forum.modal.submit_button'))])])])];
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        var _this2 = this;

                        e.preventDefault();

                        this.loading = true;

                        var data = new FormData();

                        data.append('title', this.newDiscussionTitle());
                        data.append('start_post_id', this.split.startPostId);
                        data.append('end_post_number', this.split.endPostNumber);

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/split',
                            serialize: function serialize(raw) {
                                return raw;
                            },
                            data: data
                        }).then(function (data) {
                            var discussion = {};
                            discussion.id = m.prop(data.data.id);
                            discussion.slug = m.prop(data.data.attributes.slug);
                            discussion.startUser = m.prop(data.data.attributes.startUser);
                            discussion.isUnread = m.prop(data.data.attributes.isUnread);
                            _this2.hide();
                            m.route(app.route.discussion(discussion));
                        }, this.loaded.bind(this));
                    }
                }]);
                return SplitPostModal;
            }(Modal);

            _export("default", SplitPostModal);
        }
    };
});;
'use strict';

System.register('flagrow/split/extendDiscussionPage', ['flarum/extend', 'flarum/components/DiscussionPage'], function (_export, _context) {
    "use strict";

    var extend, DiscussionPage;

    _export('default', function () {
        extend(DiscussionPage.prototype, 'init', function () {
            this.splitting = false;
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsDiscussionPage) {
            DiscussionPage = _flarumComponentsDiscussionPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/split/main', ['flarum/extend', 'flarum/Model', 'flagrow/split/addSplitControl', 'flagrow/split/components/SplitController', 'flagrow/split/components/DiscussionSplit'], function (_export, _context) {
    "use strict";

    var extend, Model, addSplitControl, SplitController, DiscussionSplit;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flagrowSplitAddSplitControl) {
            addSplitControl = _flagrowSplitAddSplitControl.default;
        }, function (_flagrowSplitComponentsSplitController) {
            SplitController = _flagrowSplitComponentsSplitController.default;
        }, function (_flagrowSplitComponentsDiscussionSplit) {
            DiscussionSplit = _flagrowSplitComponentsDiscussionSplit.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-split', function (app) {

                app.store.models.discussions.prototype.canSplit = Model.attribute('canSplit');

                app.postComponents.discussionSplit = DiscussionSplit;

                var splitController = new SplitController();

                addSplitControl(splitController);
            });
        }
    };
});
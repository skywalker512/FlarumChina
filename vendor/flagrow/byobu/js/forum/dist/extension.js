'use strict';

System.register('flagrow/byobu/addDiscussPrivatelyControl', ['flarum/extend', 'flarum/utils/UserControls', 'flarum/components/DiscussionComposer', 'flarum/components/Button', 'flarum/utils/ItemList'], function (_export, _context) {
    "use strict";

    var extend, UserControls, DiscussionComposer, Button, ItemList;

    _export('default', function () {
        // Add a control allowing the discussion to be moved to another category.
        extend(UserControls, 'userControls', function (items, user) {
            if (app.session.user && app.session.user.id() != user.id() && app.forum.attribute('canStartPrivateDiscussion')) {
                items.add('private-discussion', Button.component({
                    children: app.translator.trans('flagrow-byobu.forum.buttons.send_pd', { username: user.username() }),
                    icon: 'map-o',
                    onclick: function onclick() {
                        var deferred = m.deferred();

                        var recipients = new ItemList();
                        recipients.add('users:' + user.id(), user);
                        recipients.add('users:' + app.session.user.id(), app.session.user);

                        DiscussionComposer.prototype.recipients = recipients;

                        var component = new DiscussionComposer({
                            user: app.session.user,
                            recipients: recipients,
                            recipientUsers: recipients
                        });

                        app.composer.load(component);
                        app.composer.show();

                        deferred.resolve(component);

                        return deferred.promise;
                    }
                }));
            }

            return items;
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumUtilsUserControls) {
            UserControls = _flarumUtilsUserControls.default;
        }, function (_flarumComponentsDiscussionComposer) {
            DiscussionComposer = _flarumComponentsDiscussionComposer.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/byobu/addHasRecipientsBadge", ["flarum/extend", "flarum/models/Discussion", "flarum/components/Badge"], function (_export, _context) {
    "use strict";

    var extend, Discussion, Badge;
    function addHasRecipientsBadge() {
        extend(Discussion.prototype, 'badges', function (badges) {
            if (this.recipientUsers().length || this.recipientGroups().length) {
                badges.add('private', Badge.component({
                    type: 'private',
                    label: app.translator.trans('flagrow-byobu.forum.badges.is_private.tooltip'),
                    icon: 'map'
                }), 10);
            }
        });
    }

    _export("default", addHasRecipientsBadge);

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumModelsDiscussion) {
            Discussion = _flarumModelsDiscussion.default;
        }, function (_flarumComponentsBadge) {
            Badge = _flarumComponentsBadge.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/byobu/addRecipientComposer", ["flarum/extend", "flarum/components/DiscussionComposer", "flagrow/byobu/components/AddRecipientModal", "flagrow/byobu/helpers/recipientCountLabel", "flarum/models/User", "flarum/models/Group", "flarum/utils/ItemList"], function (_export, _context) {
    "use strict";

    var extend, override, DiscussionComposer, AddRecipientModal, recipientCountLabel, User, Group, ItemList;

    _export("default", function (app) {
        // Add recipient-selection abilities to the discussion composer.
        DiscussionComposer.prototype.recipients = new ItemList();
        DiscussionComposer.prototype.recipientUsers = [];
        DiscussionComposer.prototype.recipientGroups = [];

        // Add a recipient selection modal when clicking the recipient tag label.
        DiscussionComposer.prototype.chooseRecipients = function () {
            var _this = this;

            app.modal.show(new AddRecipientModal({
                selectedRecipients: this.recipients,
                onsubmit: function onsubmit(recipients) {
                    _this.recipients = recipients;

                    // Focus on recipient autocomplete field.
                    _this.$('.RecipientsInput').focus();
                }
            }));
        };

        // Add a tag-selection menu to the discussion composer's header, after the
        // title.
        extend(DiscussionComposer.prototype, 'headerItems', function (items) {
            if (app.session.user && app.forum.attribute('canStartPrivateDiscussion')) {

                var recipients = this.recipients.toArray();

                items.add('recipients', m(
                    "a",
                    { className: "DiscussionComposer-changeRecipients",
                        onclick: this.chooseRecipients.bind(this) },
                    recipients.length ? recipientCountLabel(recipients.length) : m(
                        "span",
                        { className: "RecipientLabel none" },
                        app.translator.trans('flagrow-byobu.forum.buttons.add_recipients')
                    )
                ), 5);
            }
        });

        // Add the selected tags as data to submit to the server.
        extend(DiscussionComposer.prototype, 'data', function (data) {
            var users = [];
            var groups = [];
            this.recipients.toArray().forEach(function (recipient) {

                if (recipient instanceof User) {
                    users.push(recipient);
                }

                if (recipient instanceof Group) {
                    groups.push(recipient);
                }
            });

            data.relationships = data.relationships || {};

            if (users.length) {
                data.relationships.recipientUsers = users;
            }

            if (groups.length) {
                data.relationships.recipientGroups = groups;
            }
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
            override = _flarumExtend.override;
        }, function (_flarumComponentsDiscussionComposer) {
            DiscussionComposer = _flarumComponentsDiscussionComposer.default;
        }, function (_flagrowByobuComponentsAddRecipientModal) {
            AddRecipientModal = _flagrowByobuComponentsAddRecipientModal.default;
        }, function (_flagrowByobuHelpersRecipientCountLabel) {
            recipientCountLabel = _flagrowByobuHelpersRecipientCountLabel.default;
        }, function (_flarumModelsUser) {
            User = _flarumModelsUser.default;
        }, function (_flarumModelsGroup) {
            Group = _flarumModelsGroup.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/byobu/addRecipientLabels", ["flarum/extend", "flarum/components/DiscussionListItem", "flarum/components/DiscussionPage", "flarum/components/DiscussionHero", "flarum/components/DiscussionList", "flagrow/byobu/helpers/recipientsLabel"], function (_export, _context) {
    "use strict";

    var extend, DiscussionListItem, DiscussionPage, DiscussionHero, DiscussionList, recipientsLabel;

    _export("default", function () {

        var addToDiscussion = function addToDiscussion(discussion, items, long) {
            var recipients = [];

            if (discussion.recipientUsers().length) {
                recipients = recipients.concat(discussion.recipientUsers());
            }

            if (discussion.recipientGroups().length) {
                recipients = recipients.concat(discussion.recipientGroups());
            }

            if (recipients && recipients.length) {
                if (long) {
                    items.add('recipients', recipientsLabel(recipients), 10);
                } else {
                    items.add('recipients', recipientsLabel(recipients, { link: true }), 4);
                }
            }
        };

        /**
         * Adds User labels on the discussion index page.
         */
        extend(DiscussionListItem.prototype, 'infoItems', function (items) {
            var discussion = this.props.discussion;

            addToDiscussion(discussion, items, true);
        });

        /**
         * Require recipients from the API whenever we're loading a Discussion page.
         */
        extend(DiscussionPage.prototype, 'params', function (params) {
            params.include.push('recipientUsers');
            params.include.push('recipientGroups');
        });
        extend(DiscussionList.prototype, 'requestParams', function (params) {
            params.include.push('recipientUsers');
            params.include.push('recipientGroups');
        });

        /**
         * Adds User labels on the discussion Hero.
         */
        extend(DiscussionHero.prototype, 'items', function (items) {
            var discussion = this.props.discussion;

            addToDiscussion(discussion, items, false);
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsDiscussionListItem) {
            DiscussionListItem = _flarumComponentsDiscussionListItem.default;
        }, function (_flarumComponentsDiscussionPage) {
            DiscussionPage = _flarumComponentsDiscussionPage.default;
        }, function (_flarumComponentsDiscussionHero) {
            DiscussionHero = _flarumComponentsDiscussionHero.default;
        }, function (_flarumComponentsDiscussionList) {
            DiscussionList = _flarumComponentsDiscussionList.default;
        }, function (_flagrowByobuHelpersRecipientsLabel) {
            recipientsLabel = _flagrowByobuHelpersRecipientsLabel.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/byobu/addRecipientsControl', ['flarum/extend', 'flarum/utils/DiscussionControls', 'flarum/components/Button', 'flagrow/byobu/components/AddRecipientModal'], function (_export, _context) {
    "use strict";

    var extend, DiscussionControls, Button, AddRecipientModal;

    _export('default', function () {
        // Add a control allowing the discussion to be moved to another category.
        extend(DiscussionControls, 'moderationControls', function (items, discussion) {
            if (discussion.canEditRecipients()) {
                items.add('recipients', Button.component({
                    children: app.translator.trans('flagrow-byobu.forum.buttons.edit_recipients'),
                    icon: 'map-o',
                    onclick: function onclick() {
                        return app.modal.show(new AddRecipientModal({ discussion: discussion }));
                    }
                }));
            }
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumUtilsDiscussionControls) {
            DiscussionControls = _flarumUtilsDiscussionControls.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flagrowByobuComponentsAddRecipientModal) {
            AddRecipientModal = _flagrowByobuComponentsAddRecipientModal.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("flagrow/byobu/components/AddRecipientModal", ["flarum/components/Modal", "flarum/components/DiscussionPage", "flarum/components/Button", "flarum/utils/ItemList", "flagrow/byobu/components/RecipientSearch", "flarum/models/User", "flarum/models/Group"], function (_export, _context) {
    "use strict";

    var Modal, DiscussionPage, Button, ItemList, RecipientSearch, User, Group, AddRecipientModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsDiscussionPage) {
            DiscussionPage = _flarumComponentsDiscussionPage.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }, function (_flagrowByobuComponentsRecipientSearch) {
            RecipientSearch = _flagrowByobuComponentsRecipientSearch.default;
        }, function (_flarumModelsUser) {
            User = _flarumModelsUser.default;
        }, function (_flarumModelsGroup) {
            Group = _flarumModelsGroup.default;
        }],
        execute: function () {
            AddRecipientModal = function (_Modal) {
                babelHelpers.inherits(AddRecipientModal, _Modal);

                function AddRecipientModal() {
                    babelHelpers.classCallCheck(this, AddRecipientModal);
                    return babelHelpers.possibleConstructorReturn(this, (AddRecipientModal.__proto__ || Object.getPrototypeOf(AddRecipientModal)).apply(this, arguments));
                }

                babelHelpers.createClass(AddRecipientModal, [{
                    key: "init",
                    value: function init() {
                        babelHelpers.get(AddRecipientModal.prototype.__proto__ || Object.getPrototypeOf(AddRecipientModal.prototype), "init", this).call(this);

                        this.selected = m.prop(new ItemList());

                        if (this.props.discussion) {
                            // Adds recipients of the currently viewed discussion.
                            this.assignInitialRecipients(this.props.discussion);
                        } else if (this.props.selectedRecipients.toArray().length > 0) {
                            // Adds previously selected recipients.
                            this.selected().merge(this.props.selectedRecipients);
                        } else {
                            // Adds the current user in case there are no selected recipients yet and this is a new discussion.
                            this.selected().add("users:" + app.session.user.id(), app.session.user);
                        }

                        this.recipientSearch = RecipientSearch.component({
                            selected: this.selected,
                            discussion: this.props.discussion
                        });
                    }
                }, {
                    key: "assignInitialRecipients",
                    value: function assignInitialRecipients(discussion) {
                        var _this2 = this;

                        discussion.recipientUsers().map(function (user) {
                            _this2.selected().add("users:" + user.id(), user);
                        });
                        discussion.recipientGroups().map(function (group) {
                            _this2.selected().add("groups:" + group.id(), group);
                        });
                    }
                }, {
                    key: "className",
                    value: function className() {
                        return 'AddRecipientModal';
                    }
                }, {
                    key: "title",
                    value: function title() {
                        return this.props.discussion ? app.translator.trans('flagrow-byobu.forum.modal.titles.update_recipients', { title: m(
                                "em",
                                null,
                                this.props.discussion.title()
                            ) }) : app.translator.trans('flagrow-byobu.forum.modal.titles.add_recipients');
                    }
                }, {
                    key: "content",
                    value: function content() {

                        return [m(
                            "div",
                            { className: "Modal-body" },
                            m(
                                "div",
                                { className: "AddRecipientModal-form" },
                                this.recipientSearch,
                                m(
                                    "div",
                                    { className: "AddRecipientModal-form-submit App-primaryControl" },
                                    Button.component({
                                        type: 'submit',
                                        className: 'Button Button--primary',
                                        disabled: false,
                                        icon: 'check',
                                        children: app.translator.trans('flagrow-byobu.forum.buttons.submit')
                                    })
                                )
                            )
                        )];
                    }
                }, {
                    key: "select",
                    value: function select(e) {
                        // Ctrl + Enter submits the selection, just Enter completes the current entry
                        if (e.metaKey || e.ctrlKey || this.selected.indexOf(this.index) !== -1) {
                            if (this.selected().length) {
                                this.$('form').submit();
                            }
                        }
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        e.preventDefault();

                        var discussion = this.props.discussion;
                        var recipients = this.selected();

                        var recipientGroups = [];
                        var recipientUsers = [];

                        recipients.toArray().forEach(function (recipient) {
                            if (recipient instanceof User) {
                                recipientUsers.push(recipient);
                            }
                            if (recipient instanceof Group) {
                                recipientGroups.push(recipient);
                            }
                        });

                        // Recipients are updated here for existing discussions here.
                        if (discussion) {
                            discussion.save({ relationships: { recipientUsers: recipientUsers, recipientGroups: recipientGroups } }).then(function () {
                                if (app.current instanceof DiscussionPage) {
                                    app.current.stream.update();
                                }
                                m.redraw();
                            });
                        }

                        // Use the onsubmit callback to trigger an update in the DiscussionComposer
                        if (this.props.onsubmit) this.props.onsubmit(recipients);

                        app.modal.close();

                        m.redraw.strategy('none');
                    }
                }]);
                return AddRecipientModal;
            }(Modal);

            _export("default", AddRecipientModal);
        }
    };
});;
'use strict';

System.register('flagrow/byobu/components/PrivateDiscussionIndex', ['flarum/extend', 'flarum/components/Page', 'flarum/utils/ItemList', 'flarum/helpers/listItems', 'flarum/helpers/icon', 'flagrow/byobu/components/PrivateDiscussionList', 'flarum/components/WelcomeHero', 'flarum/components/DiscussionComposer', 'flarum/components/LogInModal', 'flarum/components/DiscussionPage', 'flarum/components/Select', 'flarum/components/Button', 'flarum/components/LinkButton', 'flarum/components/SelectDropdown'], function (_export, _context) {
    "use strict";

    var extend, Page, ItemList, listItems, icon, PrivateDiscussionList, WelcomeHero, DiscussionComposer, LogInModal, DiscussionPage, Select, Button, LinkButton, SelectDropdown, PrivateDiscussionIndex;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }, function (_flarumHelpersListItems) {
            listItems = _flarumHelpersListItems.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flagrowByobuComponentsPrivateDiscussionList) {
            PrivateDiscussionList = _flagrowByobuComponentsPrivateDiscussionList.default;
        }, function (_flarumComponentsWelcomeHero) {
            WelcomeHero = _flarumComponentsWelcomeHero.default;
        }, function (_flarumComponentsDiscussionComposer) {
            DiscussionComposer = _flarumComponentsDiscussionComposer.default;
        }, function (_flarumComponentsLogInModal) {
            LogInModal = _flarumComponentsLogInModal.default;
        }, function (_flarumComponentsDiscussionPage) {
            DiscussionPage = _flarumComponentsDiscussionPage.default;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsLinkButton) {
            LinkButton = _flarumComponentsLinkButton.default;
        }, function (_flarumComponentsSelectDropdown) {
            SelectDropdown = _flarumComponentsSelectDropdown.default;
        }],
        execute: function () {
            PrivateDiscussionIndex = function (_Page) {
                babelHelpers.inherits(PrivateDiscussionIndex, _Page);

                function PrivateDiscussionIndex() {
                    babelHelpers.classCallCheck(this, PrivateDiscussionIndex);
                    return babelHelpers.possibleConstructorReturn(this, (PrivateDiscussionIndex.__proto__ || Object.getPrototypeOf(PrivateDiscussionIndex)).apply(this, arguments));
                }

                babelHelpers.createClass(PrivateDiscussionIndex, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(PrivateDiscussionIndex.prototype.__proto__ || Object.getPrototypeOf(PrivateDiscussionIndex.prototype), 'init', this).call(this);

                        // If the user is returning from a discussion page, then take note of which
                        // discussion they have just visited. After the view is rendered, we will
                        // scroll down so that this discussion is in view.
                        if (app.previous instanceof DiscussionPage) {
                            this.lastDiscussion = app.previous.discussion;
                        }

                        // If the user is coming from the discussion list, then they have either
                        // just switched one of the parameters (filter, sort, search) or they
                        // probably want to refresh the results. We will clear the discussion list
                        // cache so that results are reloaded.
                        if (app.previous instanceof PrivateDiscussionIndex) {
                            app.cache.privateDiscussionList = null;
                        }

                        var params = this.params();

                        if (app.cache.privateDiscussionList) {
                            // Compare the requested parameters (sort, search query) to the ones that
                            // are currently present in the cached discussion list. If they differ, we
                            // will clear the cache and set up a new discussion list component with
                            // the new parameters.
                            Object.keys(params).some(function (key) {
                                if (app.cache.privateDiscussionList.props.params[key] !== params[key]) {
                                    app.cache.privateDiscussionList = null;
                                    return true;
                                }
                            });
                        }

                        if (!app.cache.privateDiscussionList) {
                            app.cache.privateDiscussionList = new PrivateDiscussionList({ params: params });
                        }

                        app.history.push('private-index', icon('map-o'));

                        this.bodyClass = 'App--index';
                    }
                }, {
                    key: 'onunload',
                    value: function onunload() {
                        // Save the scroll position so we can restore it when we return to the
                        // discussion list.
                        app.cache.scrollTop = $(window).scrollTop();
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        return m(
                            'div',
                            { className: 'IndexPage' },
                            this.hero(),
                            m(
                                'div',
                                { className: 'container' },
                                m(
                                    'nav',
                                    { className: 'IndexPage-nav sideNav' },
                                    m(
                                        'ul',
                                        null,
                                        listItems(this.sidebarItems().toArray())
                                    )
                                ),
                                m(
                                    'div',
                                    { className: 'IndexPage-results sideNavOffset' },
                                    m(
                                        'div',
                                        { className: 'IndexPage-toolbar' },
                                        m(
                                            'ul',
                                            { className: 'IndexPage-toolbar-view' },
                                            listItems(this.viewItems().toArray())
                                        ),
                                        m(
                                            'ul',
                                            { className: 'IndexPage-toolbar-action' },
                                            listItems(this.actionItems().toArray())
                                        )
                                    ),
                                    app.cache.discussionList.render()
                                )
                            )
                        );
                    }
                }, {
                    key: 'config',
                    value: function config(isInitialized, context) {
                        babelHelpers.get(PrivateDiscussionIndex.prototype.__proto__ || Object.getPrototypeOf(PrivateDiscussionIndex.prototype), 'config', this).apply(this, arguments);

                        if (isInitialized) return;

                        extend(context, 'onunload', function () {
                            return $('#app').css('min-height', '');
                        });

                        app.setTitle('');
                        app.setTitleCount(0);

                        // Work out the difference between the height of this hero and that of the
                        // previous hero. Maintain the same scroll position relative to the bottom
                        // of the hero so that the sidebar doesn't jump around.
                        var oldHeroHeight = app.cache.heroHeight;
                        var heroHeight = app.cache.heroHeight = this.$('.Hero').outerHeight();
                        var scrollTop = app.cache.scrollTop;

                        $('#app').css('min-height', $(window).height() + heroHeight);

                        // Scroll to the remembered position. We do this after a short delay so that
                        // it happens after the browser has done its own "back button" scrolling,
                        // which isn't right. https://github.com/flarum/core/issues/835
                        var scroll = function scroll() {
                            return $(window).scrollTop(scrollTop - oldHeroHeight + heroHeight);
                        };
                        scroll();
                        setTimeout(scroll, 1);

                        // If we've just returned from a discussion page, then the constructor will
                        // have set the `lastDiscussion` property. If this is the case, we want to
                        // scroll down to that discussion so that it's in view.
                        if (this.lastDiscussion) {
                            var $discussion = this.$('.DiscussionListItem[data-id="' + this.lastDiscussion.id() + '"]');

                            if ($discussion.length) {
                                var indexTop = $('#header').outerHeight();
                                var indexBottom = $(window).height();
                                var discussionTop = $discussion.offset().top;
                                var discussionBottom = discussionTop + $discussion.outerHeight();

                                if (discussionTop < scrollTop + indexTop || discussionBottom > scrollTop + indexBottom) {
                                    $(window).scrollTop(discussionTop - indexTop);
                                }
                            }
                        }
                    }
                }, {
                    key: 'hero',
                    value: function hero() {
                        return WelcomeHero.component();
                    }
                }, {
                    key: 'sidebarItems',
                    value: function sidebarItems() {
                        var items = new ItemList();
                        var canStartDiscussion = app.forum.attribute('canStartDiscussion') || !app.session.user;

                        items.add('newDiscussion', Button.component({
                            children: app.translator.trans(canStartDiscussion ? 'core.forum.index.start_discussion_button' : 'core.forum.index.cannot_start_discussion_button'),
                            icon: 'edit',
                            className: 'Button Button--primary IndexPage-newDiscussion',
                            itemClassName: 'App-primaryControl',
                            onclick: this.newDiscussion.bind(this),
                            disabled: !canStartDiscussion
                        }));

                        items.add('nav', SelectDropdown.component({
                            children: this.navItems(this).toArray(),
                            buttonClassName: 'Button',
                            className: 'App-titleControl'
                        }));

                        return items;
                    }
                }, {
                    key: 'navItems',
                    value: function navItems() {
                        var items = new ItemList();
                        var params = this.stickyParams();

                        items.add('allDiscussions', LinkButton.component({
                            href: app.route('index', params),
                            children: app.translator.trans('core.forum.index.all_discussions_link'),
                            icon: 'comments-o'
                        }), 100);

                        return items;
                    }
                }, {
                    key: 'viewItems',
                    value: function viewItems() {
                        var items = new ItemList();
                        var sortMap = app.cache.discussionList.sortMap();

                        var sortOptions = {};
                        for (var i in sortMap) {
                            sortOptions[i] = app.translator.trans('core.forum.index_sort.' + i + '_button');
                        }

                        items.add('sort', Select.component({
                            options: sortOptions,
                            value: this.params().sort || Object.keys(sortMap)[0],
                            onchange: this.changeSort.bind(this)
                        }));

                        return items;
                    }
                }, {
                    key: 'actionItems',
                    value: function actionItems() {
                        var items = new ItemList();

                        items.add('refresh', Button.component({
                            title: app.translator.trans('core.forum.index.refresh_tooltip'),
                            icon: 'refresh',
                            className: 'Button Button--icon',
                            onclick: function onclick() {
                                return app.cache.discussionList.refresh();
                            }
                        }));

                        if (app.session.user) {
                            items.add('markAllAsRead', Button.component({
                                title: app.translator.trans('core.forum.index.mark_all_as_read_tooltip'),
                                icon: 'check',
                                className: 'Button Button--icon',
                                onclick: this.markAllAsRead.bind(this)
                            }));
                        }

                        return items;
                    }
                }, {
                    key: 'searching',
                    value: function searching() {
                        return this.params().q;
                    }
                }, {
                    key: 'clearSearch',
                    value: function clearSearch() {
                        var params = this.params();
                        delete params.q;

                        m.route(app.route(this.props.routeName, params));
                    }
                }, {
                    key: 'changeSort',
                    value: function changeSort(sort) {
                        var params = this.params();

                        if (sort === Object.keys(app.cache.discussionList.sortMap())[0]) {
                            delete params.sort;
                        } else {
                            params.sort = sort;
                        }

                        m.route(app.route(this.props.routeName, params));
                    }
                }, {
                    key: 'stickyParams',
                    value: function stickyParams() {
                        return {
                            sort: m.route.param('sort'),
                            q: m.route.param('q')
                        };
                    }
                }, {
                    key: 'params',
                    value: function params() {
                        var params = this.stickyParams();

                        params.filter = m.route.param('filter');

                        return params;
                    }
                }, {
                    key: 'newDiscussion',
                    value: function newDiscussion() {
                        var deferred = m.deferred();

                        if (app.session.user) {
                            this.composeNewDiscussion(deferred);
                        } else {
                            app.modal.show(new LogInModal({
                                onlogin: this.composeNewDiscussion.bind(this, deferred)
                            }));
                        }

                        return deferred.promise;
                    }
                }, {
                    key: 'composeNewDiscussion',
                    value: function composeNewDiscussion(deferred) {
                        var component = new DiscussionComposer({ user: app.session.user });

                        app.composer.load(component);
                        app.composer.show();

                        deferred.resolve(component);

                        return deferred.promise;
                    }
                }, {
                    key: 'markAllAsRead',
                    value: function markAllAsRead() {
                        var confirmation = confirm(app.translator.trans('core.forum.index.mark_all_as_read_confirmation'));

                        if (confirmation) {
                            app.session.user.save({ readTime: new Date() });
                        }
                    }
                }]);
                return PrivateDiscussionIndex;
            }(Page);

            _export('default', PrivateDiscussionIndex);
        }
    };
});;
'use strict';

System.register('flagrow/byobu/components/PrivateDiscussionList', ['flarum/components/DiscussionList'], function (_export, _context) {
    "use strict";

    var DiscussionList, PrivateDiscussionList;
    return {
        setters: [function (_flarumComponentsDiscussionList) {
            DiscussionList = _flarumComponentsDiscussionList.default;
        }],
        execute: function () {
            PrivateDiscussionList = function (_DiscussionList) {
                babelHelpers.inherits(PrivateDiscussionList, _DiscussionList);

                function PrivateDiscussionList() {
                    babelHelpers.classCallCheck(this, PrivateDiscussionList);
                    return babelHelpers.possibleConstructorReturn(this, (PrivateDiscussionList.__proto__ || Object.getPrototypeOf(PrivateDiscussionList)).apply(this, arguments));
                }

                babelHelpers.createClass(PrivateDiscussionList, [{
                    key: 'loadResults',
                    value: function loadResults(offset) {
                        var preloadedDiscussions = app.preloadedDocument();

                        if (preloadedDiscussions) {
                            return m.deferred().resolve(preloadedDiscussions).promise;
                        }

                        var params = this.requestParams();
                        params.q = 'q=is:private';
                        params.page = { offset: offset };
                        params.include = params.include.join(',');

                        return app.store.find('discussions', params);
                    }
                }]);
                return PrivateDiscussionList;
            }(DiscussionList);

            _export('default', PrivateDiscussionList);
        }
    };
});;
"use strict";

System.register("flagrow/byobu/components/RecipientSearch", ["flarum/components/Search", "flagrow/byobu/components/sources/UserSearchSource", "flagrow/byobu/components/sources/GroupSearchSource", "flarum/utils/ItemList", "flarum/utils/classList", "flarum/utils/extractText", "flarum/components/LoadingIndicator", "flagrow/byobu/helpers/recipientLabel", "flarum/models/User", "flarum/models/Group"], function (_export, _context) {
    "use strict";

    var Search, UserSearchSource, GroupSearchSource, ItemList, classList, extractText, LoadingIndicator, recipientLabel, User, Group, RecipientSearch;
    return {
        setters: [function (_flarumComponentsSearch) {
            Search = _flarumComponentsSearch.default;
        }, function (_flagrowByobuComponentsSourcesUserSearchSource) {
            UserSearchSource = _flagrowByobuComponentsSourcesUserSearchSource.default;
        }, function (_flagrowByobuComponentsSourcesGroupSearchSource) {
            GroupSearchSource = _flagrowByobuComponentsSourcesGroupSearchSource.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }, function (_flarumUtilsClassList) {
            classList = _flarumUtilsClassList.default;
        }, function (_flarumUtilsExtractText) {
            extractText = _flarumUtilsExtractText.default;
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator.default;
        }, function (_flagrowByobuHelpersRecipientLabel) {
            recipientLabel = _flagrowByobuHelpersRecipientLabel.default;
        }, function (_flarumModelsUser) {
            User = _flarumModelsUser.default;
        }, function (_flarumModelsGroup) {
            Group = _flarumModelsGroup.default;
        }],
        execute: function () {
            RecipientSearch = function (_Search) {
                babelHelpers.inherits(RecipientSearch, _Search);

                function RecipientSearch() {
                    babelHelpers.classCallCheck(this, RecipientSearch);
                    return babelHelpers.possibleConstructorReturn(this, (RecipientSearch.__proto__ || Object.getPrototypeOf(RecipientSearch)).apply(this, arguments));
                }

                babelHelpers.createClass(RecipientSearch, [{
                    key: "config",
                    value: function config(isInitialized) {
                        var _this2 = this;

                        if (isInitialized) return;

                        var $search = this;

                        this.$('.Search-results').on('click', function (e) {
                            var target = _this2.$('.SearchResult.active');

                            $search.addRecipient(target.data('index'));
                            $search.$('.RecipientsInput').focus();
                        });

                        this.$('.Search-results').on('touchstart', function (e) {
                            var target = _this2.$(e.target.parentNode);

                            $search.addRecipient(target.data('index'));
                            $search.$('.RecipientsInput').focus();
                        });

                        babelHelpers.get(RecipientSearch.prototype.__proto__ || Object.getPrototypeOf(RecipientSearch.prototype), "config", this).call(this, isInitialized);
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var _this3 = this;

                        if (typeof this.value() === 'undefined') {
                            this.value('');
                        }

                        var loading = this.value() && this.value().length >= 3;

                        return m('div', {
                            className: 'AddRecipientModal-form-input'
                        }, [m('div', {
                            className: 'RecipientsInput-selected RecipientsLabel'
                        }, this.props.selected().toArray().map(function (recipient) {
                            return recipientLabel(recipient, {
                                onclick: function onclick() {
                                    _this3.removeRecipient(recipient);
                                }
                            });
                        })), m('input', {
                            className: 'RecipientsInput FormControl ' + classList({
                                open: !!this.value(),
                                focused: !!this.value(),
                                active: !!this.value(),
                                loading: !!this.loadingSources
                            }),
                            config: function config(element) {
                                element.focus();
                            },
                            type: 'search',
                            placeholder: extractText(app.translator.trans('flagrow-byobu.forum.input.search_recipients')),
                            value: this.value(),
                            oninput: m.withAttr('value', this.value),
                            onfocus: function onfocus() {
                                return _this3.hasFocus = true;
                            },
                            onblur: function onblur() {
                                return _this3.hasFocus = false;
                            }
                        }), m('ul', {
                            className: 'Dropdown-menu Search-results fade ' + classList({
                                in: !!loading
                            })
                        }, loading ? this.sources.map(function (source) {
                            return source.view(_this3.value());
                        }) : LoadingIndicator.component({ size: 'tiny', className: 'Button Button--icon Button--link' }))]);
                    }
                }, {
                    key: "sourceItems",
                    value: function sourceItems() {
                        var items = new ItemList();

                        // Add user source based on permissions.
                        if (!this.props.discussion && app.forum.attribute('canStartPrivateDiscussionWithUsers') || this.props.discussion && this.props.discussion.canEditUserRecipients()) {
                            items.add('users', new UserSearchSource());
                        }

                        // Add group source based on permissions.
                        if (!this.props.discussion && app.forum.attribute('canStartPrivateDiscussionWithGroups') || this.props.discussion && this.props.discussion.canEditGroupRecipients()) {
                            items.add('groups', new GroupSearchSource());
                        }

                        return items;
                    }
                }, {
                    key: "clear",
                    value: function clear() {
                        this.value('');

                        m.redraw();
                    }
                }, {
                    key: "addRecipient",
                    value: function addRecipient(value) {

                        var values = value.split(':'),
                            type = values[0],
                            id = values[1];

                        var recipient = this.findRecipient(type, id);

                        this.props.selected().add(value, recipient);

                        this.clear();
                    }
                }, {
                    key: "removeRecipient",
                    value: function removeRecipient(recipient) {
                        var type;

                        if (recipient instanceof User) {
                            type = 'users';
                        }
                        if (recipient instanceof Group) {
                            type = 'groups';
                        }

                        this.props.selected().remove(type + ":" + recipient.id());

                        m.redraw();
                    }
                }, {
                    key: "findRecipient",
                    value: function findRecipient(store, id) {
                        return app.store.getById(store, id);
                    }
                }]);
                return RecipientSearch;
            }(Search);

            _export("default", RecipientSearch);
        }
    };
});;
"use strict";

System.register("flagrow/byobu/components/RecipientsModified", ["flarum/components/EventPost", "flagrow/byobu/helpers/recipientsLabel"], function (_export, _context) {
    "use strict";

    var EventPost, recipientsLabel, RecipientsModified;
    return {
        setters: [function (_flarumComponentsEventPost) {
            EventPost = _flarumComponentsEventPost.default;
        }, function (_flagrowByobuHelpersRecipientsLabel) {
            recipientsLabel = _flagrowByobuHelpersRecipientsLabel.default;
        }],
        execute: function () {
            RecipientsModified = function (_EventPost) {
                babelHelpers.inherits(RecipientsModified, _EventPost);

                function RecipientsModified() {
                    babelHelpers.classCallCheck(this, RecipientsModified);
                    return babelHelpers.possibleConstructorReturn(this, (RecipientsModified.__proto__ || Object.getPrototypeOf(RecipientsModified)).apply(this, arguments));
                }

                babelHelpers.createClass(RecipientsModified, [{
                    key: "icon",
                    value: function icon() {
                        return 'map-o';
                    }
                }, {
                    key: "descriptionKey",
                    value: function descriptionKey() {

                        var localeBase = 'flagrow-byobu.forum.post.recipients_modified.';

                        if (this.props.added.length) {
                            if (this.props.removed.length) {
                                return localeBase + 'added_and_removed';
                            }

                            return localeBase + 'added';
                        }

                        return localeBase + 'removed';
                    }
                }, {
                    key: "descriptionData",
                    value: function descriptionData() {
                        var data = {};

                        if (this.props.added.length) {
                            data.added = recipientsLabel(this.props.added, { link: true });
                        }

                        if (this.props.removed.length) {
                            data.removed = recipientsLabel(this.props.removed, { link: true });
                        }

                        return data;
                    }
                }], [{
                    key: "initProps",
                    value: function initProps(props) {
                        babelHelpers.get(RecipientsModified.__proto__ || Object.getPrototypeOf(RecipientsModified), "initProps", this).call(this, props);

                        function diff(diff1, diff2, store) {
                            return diff1.filter(function (item) {
                                return diff2.indexOf(item) === -1;
                            }).map(function (id) {
                                return app.store.getById(store, id);
                            });
                        }

                        var content = props.post.content();

                        // For event posts existing before groups functionality.
                        if (!content['new'] && content.length == 2) {
                            var oldRecipients = props.post.content()[0];
                            var newRecipients = props.post.content()[1];
                            props.added = diff(newRecipients, oldRecipients, 'users');
                            props.removed = diff(oldRecipients, newRecipients, 'users');
                        } else {
                            var usersAdded = diff(content['new']['users'], content['old']['users'], 'users');
                            var usersRemoved = diff(content['old']['users'], content['new']['users'], 'users');
                            var groupsAdded = diff(content['new']['groups'], content['old']['groups'], 'groups');
                            var groupsRemoved = diff(content['old']['groups'], content['new']['groups'], 'groups');

                            props.added = usersAdded.concat(groupsAdded);
                            props.removed = usersRemoved.concat(groupsRemoved);
                        }
                    }
                }]);
                return RecipientsModified;
            }(EventPost);

            _export("default", RecipientsModified);
        }
    };
});;
'use strict';

System.register('flagrow/byobu/components/sources/GroupSearchSource', ['flarum/helpers/highlight'], function (_export, _context) {
    "use strict";

    var highlight, GroupSearchSource;
    return {
        setters: [function (_flarumHelpersHighlight) {
            highlight = _flarumHelpersHighlight.default;
        }],
        execute: function () {
            GroupSearchSource = function () {
                function GroupSearchSource() {
                    babelHelpers.classCallCheck(this, GroupSearchSource);
                }

                babelHelpers.createClass(GroupSearchSource, [{
                    key: 'search',
                    value: function search(query) {
                        return app.store.find('groups', {
                            filter: { q: query },
                            page: { limit: 5 }
                        });
                    }
                }, {
                    key: 'view',
                    value: function view(query) {
                        query = query.toLowerCase();

                        var results = app.store.all('groups').filter(function (group) {
                            return group.namePlural().toLowerCase().substr(0, query.length) === query;
                        });

                        if (!results.length) return '';

                        return [m(
                            'li',
                            { className: 'Dropdown-header' },
                            app.translator.trans('flagrow-byobu.forum.search.headings.groups')
                        ), results.map(function (group) {
                            var groupName = group.namePlural();
                            var name = highlight(groupName, query);

                            return m(
                                'li',
                                { className: 'SearchResult', 'data-index': 'groups:' + group.id() },
                                m(
                                    'a',
                                    { 'data-index': 'groups:' + group.id() },
                                    m(
                                        'span',
                                        { 'class': 'groupName' },
                                        name
                                    )
                                )
                            );
                        })];
                    }
                }]);
                return GroupSearchSource;
            }();

            _export('default', GroupSearchSource);
        }
    };
});;
'use strict';

System.register('flagrow/byobu/components/sources/UserSearchSource', ['flarum/helpers/highlight', 'flarum/helpers/avatar', 'flarum/helpers/username'], function (_export, _context) {
    "use strict";

    var highlight, avatar, username, UserSearchSource;
    return {
        setters: [function (_flarumHelpersHighlight) {
            highlight = _flarumHelpersHighlight.default;
        }, function (_flarumHelpersAvatar) {
            avatar = _flarumHelpersAvatar.default;
        }, function (_flarumHelpersUsername) {
            username = _flarumHelpersUsername.default;
        }],
        execute: function () {
            UserSearchSource = function () {
                function UserSearchSource() {
                    babelHelpers.classCallCheck(this, UserSearchSource);
                }

                babelHelpers.createClass(UserSearchSource, [{
                    key: 'search',
                    value: function search(query) {
                        return app.store.find('users', {
                            filter: { q: query },
                            page: { limit: 5 }
                        });
                    }
                }, {
                    key: 'view',
                    value: function view(query) {
                        query = query.toLowerCase();

                        var results = app.store.all('users').filter(function (user) {
                            return user.username().toLowerCase().substr(0, query.length) === query;
                        });

                        if (!results.length) return '';

                        return [m(
                            'li',
                            { className: 'Dropdown-header' },
                            app.translator.trans('core.forum.search.users_heading')
                        ), results.map(function (user) {
                            var name = username(user);
                            name.children[0] = highlight(name.children[0], query);

                            return m(
                                'li',
                                { className: 'SearchResult', 'data-index': 'users:' + user.id() },
                                m(
                                    'a',
                                    { 'data-index': 'users:' + user.id() },
                                    avatar(user),
                                    name
                                )
                            );
                        })];
                    }
                }]);
                return UserSearchSource;
            }();

            _export('default', UserSearchSource);
        }
    };
});;
'use strict';

System.register('flagrow/byobu/helpers/recipientCountLabel', [], function (_export, _context) {
  "use strict";

  function recipientCountLabel(count) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    attrs.style = attrs.style || {};
    attrs.className = 'RecipientLabel ' + (attrs.className || '');

    var label = app.translator.transChoice('flagrow-byobu.forum.labels.recipients', count, { count: count });

    return m('span', attrs, m(
      'span',
      { className: 'RecipientLabel-text' },
      label
    ));
  }

  _export('default', recipientCountLabel);

  return {
    setters: [],
    execute: function () {}
  };
});;
'use strict';

System.register('flagrow/byobu/helpers/recipientLabel', ['flarum/utils/extract', 'flarum/helpers/username', 'flarum/models/User', 'flarum/models/Group'], function (_export, _context) {
    "use strict";

    var extract, username, User, Group;
    function recipientLabel(recipient) {
        var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        attrs.style = attrs.style || {};
        attrs.className = 'RecipientLabel ' + (attrs.className || '');

        var link = extract(attrs, 'link');

        var label;

        if (recipient instanceof User) {
            label = username(recipient);

            if (link) {
                attrs.title = recipient.username() || '';
                attrs.href = app.route.user(recipient);
                attrs.config = m.route;
            }
        } else if (recipient instanceof Group) {
            label = recipient.namePlural();
        } else {
            attrs.className += ' none';
            label = app.translator.trans('flagrow-byobu.forum.labels.user_deleted');
        }

        return m(link ? 'a' : 'span', attrs, m(
            'span',
            { className: 'RecipientLabel-text' },
            label
        ));
    }

    _export('default', recipientLabel);

    return {
        setters: [function (_flarumUtilsExtract) {
            extract = _flarumUtilsExtract.default;
        }, function (_flarumHelpersUsername) {
            username = _flarumHelpersUsername.default;
        }, function (_flarumModelsUser) {
            User = _flarumModelsUser.default;
        }, function (_flarumModelsGroup) {
            Group = _flarumModelsGroup.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/byobu/helpers/recipientsLabel', ['flarum/utils/extract', 'flagrow/byobu/helpers/recipientLabel'], function (_export, _context) {
  "use strict";

  var extract, recipientLabel;
  function recipientsLabel(recipients) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var children = [];
    var link = extract(attrs, 'link');

    attrs.className = 'RecipientsLabel ' + (attrs.className || '');

    if (recipients) {
      recipients.forEach(function (recipient) {
        children.push(recipientLabel(recipient, { link: link }));
      });
    } else {
      children.push(recipientLabel());
    }

    return m(
      'span',
      attrs,
      children
    );
  }

  _export('default', recipientsLabel);

  return {
    setters: [function (_flarumUtilsExtract) {
      extract = _flarumUtilsExtract.default;
    }, function (_flagrowByobuHelpersRecipientLabel) {
      recipientLabel = _flagrowByobuHelpersRecipientLabel.default;
    }],
    execute: function () {}
  };
});;
"use strict";

System.register("flagrow/byobu/main", ["flarum/Model", "flarum/models/Discussion", "flagrow/byobu/addRecipientComposer", "flagrow/byobu/addRecipientLabels", "flagrow/byobu/addRecipientsControl", "flagrow/byobu/addHasRecipientsBadge", "flagrow/byobu/addDiscussPrivatelyControl", "flagrow/byobu/components/PrivateDiscussionIndex", "flagrow/byobu/components/RecipientsModified"], function (_export, _context) {
    "use strict";

    var Model, Discussion, addRecipientComposer, addRecipientLabels, addRecipientsControl, addHasRecipientsBadge, addDiscussPrivatelyControl, PrivateDiscussionIndex, RecipientsModified;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumModelsDiscussion) {
            Discussion = _flarumModelsDiscussion.default;
        }, function (_flagrowByobuAddRecipientComposer) {
            addRecipientComposer = _flagrowByobuAddRecipientComposer.default;
        }, function (_flagrowByobuAddRecipientLabels) {
            addRecipientLabels = _flagrowByobuAddRecipientLabels.default;
        }, function (_flagrowByobuAddRecipientsControl) {
            addRecipientsControl = _flagrowByobuAddRecipientsControl.default;
        }, function (_flagrowByobuAddHasRecipientsBadge) {
            addHasRecipientsBadge = _flagrowByobuAddHasRecipientsBadge.default;
        }, function (_flagrowByobuAddDiscussPrivatelyControl) {
            addDiscussPrivatelyControl = _flagrowByobuAddDiscussPrivatelyControl.default;
        }, function (_flagrowByobuComponentsPrivateDiscussionIndex) {
            PrivateDiscussionIndex = _flagrowByobuComponentsPrivateDiscussionIndex.default;
        }, function (_flagrowByobuComponentsRecipientsModified) {
            RecipientsModified = _flagrowByobuComponentsRecipientsModified.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-byobu', function (app) {
                app.routes.private_discussions = { path: '/private-discussions', component: PrivateDiscussionIndex.component() };

                Discussion.prototype.recipientUsers = Model.hasMany('recipientUsers');
                Discussion.prototype.oldRecipientUsers = Model.hasMany('oldRecipientUsers');
                Discussion.prototype.recipientGroups = Model.hasMany('recipientGroups');
                Discussion.prototype.oldRecipientGroups = Model.hasMany('oldRecipientGroups');

                Discussion.prototype.canEditRecipients = Model.attribute('canEditRecipients');
                Discussion.prototype.canEditUserRecipients = Model.attribute('canEditUserRecipients');
                Discussion.prototype.canEditGroupRecipients = Model.attribute('canEditGroupRecipients');

                app.postComponents.recipientsModified = RecipientsModified;

                addRecipientComposer(app);
                addRecipientLabels();
                addRecipientsControl();
                addHasRecipientsBadge();

                addDiscussPrivatelyControl();
            });
        }
    };
});
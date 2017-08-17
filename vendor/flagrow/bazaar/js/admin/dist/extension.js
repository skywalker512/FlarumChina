'use strict';

System.register('flagrow/bazaar/addBazaarPage', ['flarum/extend', 'flarum/app', 'flarum/components/AdminNav', 'flarum/components/AdminLinkButton', 'flagrow/bazaar/components/BazaarPage'], function (_export, _context) {
    "use strict";

    var extend, app, AdminNav, AdminLinkButton, BazaarPage;

    _export('default', function () {
        // create the route
        app.routes['flagrow-bazaar'] = { path: '/flagrow/bazaar', component: BazaarPage.component() };

        // Add tab to admin menu
        extend(AdminNav.prototype, 'items', function (items) {
            items.add('flagrow-bazaar', AdminLinkButton.component({
                href: app.route('flagrow-bazaar'),
                icon: 'shopping-bag',
                children: app.translator.trans('flagrow-bazaar.admin.nav.title'),
                description: app.translator.trans('flagrow-bazaar.admin.nav.description')
            }));
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_flagrowBazaarComponentsBazaarPage) {
            BazaarPage = _flagrowBazaarComponentsBazaarPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/bazaar/addTasksPage', ['flarum/extend', 'flarum/app', 'flagrow/bazaar/components/TasksPage'], function (_export, _context) {
    "use strict";

    var extend, app, TasksPage;

    _export('default', function () {
        app.routes['flagrow-bazaar-tasks'] = { path: '/flagrow/bazaar/tasks', component: TasksPage.component() };
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowBazaarComponentsTasksPage) {
            TasksPage = _flagrowBazaarComponentsTasksPage.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('flagrow/bazaar/components/BazaarLoader', ['flarum/Component', 'flarum/helpers/icon', 'flarum/components/Button', 'flarum/components/LinkButton'], function (_export, _context) {
    "use strict";

    var Component, icon, Button, LinkButton, BazaarLoader;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsLinkButton) {
            LinkButton = _flarumComponentsLinkButton.default;
        }],
        execute: function () {
            BazaarLoader = function (_Component) {
                babelHelpers.inherits(BazaarLoader, _Component);

                function BazaarLoader() {
                    babelHelpers.classCallCheck(this, BazaarLoader);
                    return babelHelpers.possibleConstructorReturn(this, (BazaarLoader.__proto__ || Object.getPrototypeOf(BazaarLoader)).apply(this, arguments));
                }

                babelHelpers.createClass(BazaarLoader, [{
                    key: 'view',
                    value: function view() {
                        var error = this.props.loading() === 'error';

                        return m('div', {
                            className: 'Bazaar--Loader ' + (error ? 'Error' : null),
                            hidden: this.props.loading() === false
                        }, [m('.Loader-modal', [m('.Loader-icon', icon(error ? 'exclamation-triangle' : 'shopping-cart')), m('div', [m('p', app.translator.trans(error ? 'flagrow-bazaar.admin.loader.error' : 'flagrow-bazaar.admin.loader.is_loading')), error ? [Button.component({
                            className: 'Button Button--block',
                            icon: 'refresh',
                            onclick: function onclick() {
                                return location.reload();
                            },
                            children: app.translator.trans('flagrow-bazaar.admin.loader.refresh')
                        }), LinkButton.component({
                            className: 'Button Button--block',
                            icon: 'bug',
                            href: 'https://github.com/flagrow/bazaar/issues',
                            target: '_blank',
                            config: {}, // Disable internal Mithril routing
                            children: app.translator.trans('flagrow-bazaar.admin.loader.report_issue')
                        })] : null])])]);
                    }
                }]);
                return BazaarLoader;
            }(Component);

            _export('default', BazaarLoader);
        }
    };
});;
"use strict";

System.register("flagrow/bazaar/components/BazaarPage", ["flarum/Component", "flagrow/bazaar/utils/ExtensionRepository", "flagrow/bazaar/components/ExtensionListItem", "flagrow/bazaar/components/BazaarLoader", "flagrow/bazaar/components/BazaarPageHeader", "flagrow/bazaar/components/CustomCheckbox"], function (_export, _context) {
    "use strict";

    var Component, ExtensionRepository, ExtensionListItem, BazaarLoader, BazaarPageHeader, CustomCheckbox, BazaarPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flagrowBazaarUtilsExtensionRepository) {
            ExtensionRepository = _flagrowBazaarUtilsExtensionRepository.default;
        }, function (_flagrowBazaarComponentsExtensionListItem) {
            ExtensionListItem = _flagrowBazaarComponentsExtensionListItem.default;
        }, function (_flagrowBazaarComponentsBazaarLoader) {
            BazaarLoader = _flagrowBazaarComponentsBazaarLoader.default;
        }, function (_flagrowBazaarComponentsBazaarPageHeader) {
            BazaarPageHeader = _flagrowBazaarComponentsBazaarPageHeader.default;
        }, function (_flagrowBazaarComponentsCustomCheckbox) {
            CustomCheckbox = _flagrowBazaarComponentsCustomCheckbox.default;
        }],
        execute: function () {
            BazaarPage = function (_Component) {
                babelHelpers.inherits(BazaarPage, _Component);

                function BazaarPage() {
                    babelHelpers.classCallCheck(this, BazaarPage);
                    return babelHelpers.possibleConstructorReturn(this, (BazaarPage.__proto__ || Object.getPrototypeOf(BazaarPage)).apply(this, arguments));
                }

                babelHelpers.createClass(BazaarPage, [{
                    key: "init",
                    value: function init() {
                        app.current = this;

                        this.loading = m.prop(false);
                        this.repository = m.prop(new ExtensionRepository(this.loading));
                        this.repository().loadNextPage();
                        this.connected = app.data.settings['flagrow.bazaar.connected'] == 1 || false;
                    }
                }, {
                    key: "view",
                    value: function view() {
                        return m('div', { className: 'ExtensionsPage Bazaar' }, [BazaarPageHeader.component({
                            connected: this.connected
                        }), m('div', { className: 'ExtensionsPage-list' }, [m('div', { className: 'container' }, [this.search(), this.items()])]), BazaarLoader.component({ loading: this.loading })]);
                    }
                }, {
                    key: "search",
                    value: function search() {
                        var _this2 = this;

                        return m('fieldset.ExtensionSearch', [m('input[type=text].FormControl', {
                            value: this.repository().filteredBy('search'),
                            oninput: m.withAttr('value', function (term) {
                                _this2.repository().filterBy('search', term);
                            }),
                            placeholder: app.translator.trans('flagrow-bazaar.admin.search.placeholder')
                        }), CustomCheckbox.component({
                            iconChecked: 'toggle-up',
                            state: this.repository().filterUpdateRequired(),
                            onchange: function onchange(checked) {
                                return _this2.repository().filterUpdateRequired(checked);
                            },
                            children: app.translator.trans('flagrow-bazaar.admin.search.filter_update_required')
                        }), CustomCheckbox.component({
                            iconChecked: 'plus-square',
                            state: this.repository().filterInstalled(),
                            onchange: function onchange(checked) {
                                return _this2.repository().filterInstalled(checked);
                            },
                            children: app.translator.trans('flagrow-bazaar.admin.search.filter_installed')
                        }), this.connected ? CustomCheckbox.component({
                            iconChecked: 'heart',
                            state: this.repository().filterFavorited(),
                            onchange: function onchange(checked) {
                                return _this2.repository().filterFavorited(checked);
                            },
                            children: app.translator.trans('flagrow-bazaar.admin.search.filter_favorited')
                        }) : '']);
                    }
                }, {
                    key: "items",
                    value: function items() {
                        var _this3 = this;

                        return m('ul', { className: 'ExtensionList' }, [this.repository().extensions().filter(function (extension) {
                            if (_this3.repository().filterInstalled() && !extension.installed()) {
                                return false;
                            }

                            if (_this3.repository().filterUpdateRequired() && !extension.outdated()) {
                                return false;
                            }

                            if (_this3.repository().filterFavorited() && !extension.favorited()) {
                                return false;
                            }

                            return true;
                        }).map(function (extension) {
                            return ExtensionListItem.component({
                                extension: extension,
                                repository: _this3.repository,
                                connected: _this3.connected,
                                key: extension.package()
                            });
                        })]);
                    }
                }]);
                return BazaarPage;
            }(Component);

            _export("default", BazaarPage);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/components/BazaarPageHeader', ['flarum/app', 'flarum/Component', 'flarum/components/LinkButton', 'flarum/components/Button', 'flagrow/bazaar/modals/FilePermissionsModal', 'flagrow/bazaar/modals/MemoryLimitModal', 'flagrow/bazaar/modals/BazaarConnectModal'], function (_export, _context) {
    "use strict";

    var app, Component, LinkButton, Button, FilePermissionsModal, MemoryLimitModal, BazaarConnectModal, BazaarPageHeader;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsLinkButton) {
            LinkButton = _flarumComponentsLinkButton.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flagrowBazaarModalsFilePermissionsModal) {
            FilePermissionsModal = _flagrowBazaarModalsFilePermissionsModal.default;
        }, function (_flagrowBazaarModalsMemoryLimitModal) {
            MemoryLimitModal = _flagrowBazaarModalsMemoryLimitModal.default;
        }, function (_flagrowBazaarModalsBazaarConnectModal) {
            BazaarConnectModal = _flagrowBazaarModalsBazaarConnectModal.default;
        }],
        execute: function () {
            BazaarPageHeader = function (_Component) {
                babelHelpers.inherits(BazaarPageHeader, _Component);

                function BazaarPageHeader() {
                    babelHelpers.classCallCheck(this, BazaarPageHeader);
                    return babelHelpers.possibleConstructorReturn(this, (BazaarPageHeader.__proto__ || Object.getPrototypeOf(BazaarPageHeader)).apply(this, arguments));
                }

                babelHelpers.createClass(BazaarPageHeader, [{
                    key: 'view',
                    value: function view() {
                        return m(
                            'div',
                            { className: 'ExtensionsPage-header' },
                            m(
                                'div',
                                { className: 'container' },
                                this.header()
                            )
                        );
                    }
                }, {
                    key: 'header',
                    value: function header() {
                        var buttons = [].concat(this.requirementsButtons(), this.connectedButtons(), this.pagesButtons());

                        return m('div', { className: 'ButtonGroup' }, buttons);
                    }
                }, {
                    key: 'requirementsButtons',
                    value: function requirementsButtons() {
                        var memory_limit_met = app.data.settings['flagrow.bazaar.php.memory_limit-met'] || false;
                        var memory_limit = app.data.settings['flagrow.bazaar.php.memory_limit'];
                        var memory_requested = app.data.settings['flagrow.bazaar.php.memory_requested'];
                        var file_permissions = app.data.settings['flagrow.bazaar.file-permissions'] || [];

                        var components = [];

                        if (!memory_limit_met) {
                            components.push(Button.component({
                                className: 'Button Button--icon Requirement-MemoryLimit',
                                icon: 'signal',
                                onclick: function onclick() {
                                    return app.modal.show(new MemoryLimitModal({ memory_requested: memory_requested, memory_limit: memory_limit }));
                                }
                            }));
                        }

                        if (file_permissions.length > 0) {
                            components.push(Button.component({
                                className: 'Button Button--icon Requirement-FilePermissions',
                                icon: 'hdd-o',
                                onclick: function onclick() {
                                    return app.modal.show(new FilePermissionsModal({ file_permissions: file_permissions }));
                                }
                            }));
                        }

                        return components;
                    }
                }, {
                    key: 'connectedButtons',
                    value: function connectedButtons() {
                        var connected = this.props.connected;
                        var flagrowHost = app.data.settings['flagrow.bazaar.flagrow-host'] || 'https://flagrow.io';

                        if (connected) {
                            return [Button.component({
                                className: 'Button Button--icon Connected',
                                icon: 'dashboard',
                                onclick: function onclick() {
                                    return window.open(flagrowHost + '/home');
                                }
                            })];
                        }

                        return [Button.component({
                            className: 'Button Button--icon Connect',
                            icon: 'plug',
                            onclick: function onclick() {
                                return app.modal.show(new BazaarConnectModal({ flagrowHost: flagrowHost }));
                            }
                        })];
                    }
                }, {
                    key: 'pagesButtons',
                    value: function pagesButtons() {
                        // Sometimes no route has been set as the current one
                        if (typeof app.current === 'undefined') {
                            return null;
                        }

                        var routeName = app.current.props.routeName;
                        var links = [];

                        if (routeName !== 'flagrow-bazaar') {
                            links.push(LinkButton.component({
                                className: 'Button Button--icon',
                                icon: 'shopping-bag',
                                href: app.route('flagrow-bazaar'),
                                title: app.translator.trans('flagrow-bazaar.admin.header.extensions')
                            }));
                        }

                        if (routeName !== 'flagrow-bazaar-tasks') {
                            links.push(LinkButton.component({
                                className: 'Button Button--icon',
                                icon: 'history',
                                href: app.route('flagrow-bazaar-tasks'),
                                title: app.translator.trans('flagrow-bazaar.admin.header.tasks')
                            }));
                        }

                        return links;
                    }
                }]);
                return BazaarPageHeader;
            }(Component);

            _export('default', BazaarPageHeader);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/components/CustomCheckbox', ['flarum/components/Checkbox', 'flarum/components/LoadingIndicator', 'flarum/helpers/icon'], function (_export, _context) {
    "use strict";

    var Checkbox, LoadingIndicator, icon, CustomCheckbox;
    return {
        setters: [function (_flarumComponentsCheckbox) {
            Checkbox = _flarumComponentsCheckbox.default;
        }, function (_flarumComponentsLoadingIndicator) {
            LoadingIndicator = _flarumComponentsLoadingIndicator.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }],
        execute: function () {
            CustomCheckbox = function (_Checkbox) {
                babelHelpers.inherits(CustomCheckbox, _Checkbox);

                function CustomCheckbox() {
                    babelHelpers.classCallCheck(this, CustomCheckbox);
                    return babelHelpers.possibleConstructorReturn(this, (CustomCheckbox.__proto__ || Object.getPrototypeOf(CustomCheckbox)).apply(this, arguments));
                }

                babelHelpers.createClass(CustomCheckbox, [{
                    key: 'getDisplay',
                    value: function getDisplay() {
                        var iconChecked = this.props.iconChecked || 'check';
                        var iconUnchecked = this.props.iconUnchecked || 'times';

                        return this.loading ? LoadingIndicator.component({ size: 'tiny' }) : icon(this.props.state ? iconChecked : iconUnchecked);
                    }
                }]);
                return CustomCheckbox;
            }(Checkbox);

            _export('default', CustomCheckbox);
        }
    };
});;
"use strict";

System.register("flagrow/bazaar/components/ExtensionListItem", ["flarum/Component", "flarum/helpers/icon", "flarum/utils/ItemList", "flarum/components/Button", "flarum/components/Dropdown", "flarum/components/Badge"], function (_export, _context) {
    "use strict";

    var Component, icon, ItemList, Button, Dropdown, Badge, ExtensionListItem;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsDropdown) {
            Dropdown = _flarumComponentsDropdown.default;
        }, function (_flarumComponentsBadge) {
            Badge = _flarumComponentsBadge.default;
        }],
        execute: function () {
            ExtensionListItem = function (_Component) {
                babelHelpers.inherits(ExtensionListItem, _Component);

                function ExtensionListItem() {
                    babelHelpers.classCallCheck(this, ExtensionListItem);
                    return babelHelpers.possibleConstructorReturn(this, (ExtensionListItem.__proto__ || Object.getPrototypeOf(ExtensionListItem)).apply(this, arguments));
                }

                babelHelpers.createClass(ExtensionListItem, [{
                    key: "config",
                    value: function config(isInitialized) {
                        if (isInitialized) return;

                        // Be careful to always use a `key` with this component or this mis-align the tooltips if items are added or removed
                        if (this.props.extension.description()) this.$('.ExtensionIcon').tooltip({ container: 'body' });
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var extension = this.props.extension;
                        var connected = this.props.connected || false;
                        var controls = this.controlItems(extension, connected).toArray();
                        var badges = this.badges(extension).toArray();

                        return m(
                            "li",
                            { className: 'ExtensionListItem ' + (extension.enabled() ? 'enabled ' : 'disabled ') + (extension.installed() ? 'installed ' : 'uninstalled ') + (extension.outdated() ? 'outdated ' : '') },
                            m(
                                "div",
                                { className: "ExtensionListItem-content" },
                                m(
                                    "span",
                                    { className: "ExtensionListItem-icon ExtensionIcon", style: extension.icon() || '', title: extension.description() },
                                    extension.icon() ? icon(extension.icon().name) : ''
                                ),
                                m(
                                    "ul",
                                    { className: "ExtensionListItem-badges badges" },
                                    badges
                                ),
                                controls.length ? m(
                                    Dropdown,
                                    {
                                        className: "ExtensionListItem-controls",
                                        buttonClassName: "Button Button--icon Button--flat",
                                        menuClassName: "Dropdown-menu--right",
                                        icon: "ellipsis-h" },
                                    controls
                                ) : '',
                                m(
                                    "label",
                                    { className: "ExtensionListItem-title" },
                                    extension.title() || extension.package()
                                ),
                                m(
                                    "label",
                                    { className: "ExtensionListItem-vendor" },
                                    app.translator.trans('flagrow-bazaar.admin.page.extension.vendor', {
                                        vendor: extension.package().split('/')[0]
                                    })
                                ),
                                m(
                                    "div",
                                    { className: "ExtensionListItem-version" },
                                    extension.installed_version() || extension.highest_version()
                                )
                            )
                        );
                    }
                }, {
                    key: "controlItems",
                    value: function controlItems(extension, connected) {
                        var items = new ItemList();
                        var repository = this.props.repository;
                        var favoriteTrans = extension.favorited() ? 'flagrow-bazaar.admin.page.button.remove_favorite_button' : 'flagrow-bazaar.admin.page.button.favorite_button';

                        if (connected) {
                            items.add('favorite', Button.component({
                                icon: 'heart',
                                children: app.translator.trans(favoriteTrans),
                                onclick: function onclick() {
                                    repository().favoriteExtension(extension);
                                }
                            }));
                        }

                        if (extension.enabled() && app.extensionSettings[name]) {
                            items.add('settings', Button.component({
                                icon: 'cog',
                                children: app.translator.trans('core.admin.extensions.settings_button'),
                                onclick: app.extensionSettings[name]
                            }));
                        }

                        if (extension.installed() && !extension.enabled()) {
                            items.add('uninstall', Button.component({
                                icon: 'minus-square-o',
                                children: app.translator.trans('flagrow-bazaar.admin.page.button.uninstall'),
                                onclick: function onclick() {
                                    repository().uninstallExtension(extension);
                                }
                            }));
                            items.add('enable', Button.component({
                                icon: 'check-square-o',
                                children: app.translator.trans('flagrow-bazaar.admin.page.button.enable'),
                                onclick: function onclick() {
                                    repository().enableExtension(extension);
                                }
                            }));
                        }

                        if (extension.installed() && extension.outdated()) {
                            items.add('update', Button.component({
                                icon: 'toggle-up',
                                children: app.translator.trans('flagrow-bazaar.admin.page.button.update'),
                                onclick: function onclick() {
                                    repository().updateExtension(extension);
                                }
                            }));
                        }

                        if (extension.installed() && extension.enabled()) {
                            items.add('disable', Button.component({
                                icon: 'square-o',
                                children: app.translator.trans('flagrow-bazaar.admin.page.button.disable'),
                                onclick: function onclick() {
                                    repository().disableExtension(extension);
                                }
                            }));
                        }

                        if (!extension.installed()) {
                            items.add('install', Button.component({
                                icon: 'plus-square-o',
                                children: app.translator.trans('flagrow-bazaar.admin.page.button.install'),
                                onclick: function onclick() {
                                    repository().installExtension(extension);
                                }
                            }));
                        }

                        return items;
                    }
                }, {
                    key: "badges",
                    value: function badges(extension) {
                        var items = new ItemList();

                        if (extension.installed() && extension.outdated()) {
                            items.add('favorited', m(Badge, { icon: "warning", type: "outdated",
                                label: app.translator.trans('flagrow-bazaar.admin.page.extension.outdated', { new: extension.highest_version() }) }));
                        }

                        if (extension.favorited()) {
                            items.add('favorited', m(Badge, { icon: "heart", type: "favorited",
                                label: app.translator.trans('flagrow-bazaar.admin.page.extension.favorited') }));
                        }

                        if (extension.installed() && !extension.enabled()) {
                            items.add('installed', m(Badge, { icon: "plus-square", type: "installed",
                                label: app.translator.trans('flagrow-bazaar.admin.page.extension.installed') }));
                        }
                        if (extension.enabled()) {
                            items.add('enabled', m(Badge, { icon: "check-square", type: "enabled",
                                label: app.translator.trans('flagrow-bazaar.admin.page.extension.enabled') }));
                        }

                        return items;
                    }
                }]);
                return ExtensionListItem;
            }(Component);

            _export("default", ExtensionListItem);
        }
    };
});;
"use strict";

System.register("flagrow/bazaar/components/TaskListItem", ["flarum/app", "flarum/Component", "flarum/helpers/icon", "flarum/components/Button", "flarum/helpers/humanTime", "flarum/helpers/fullTime"], function (_export, _context) {
    "use strict";

    var app, Component, icon, Button, humanTime, fullTime, ExtensionListItem;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumHelpersIcon) {
            icon = _flarumHelpersIcon.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumHelpersHumanTime) {
            humanTime = _flarumHelpersHumanTime.default;
        }, function (_flarumHelpersFullTime) {
            fullTime = _flarumHelpersFullTime.default;
        }],
        execute: function () {
            ExtensionListItem = function (_Component) {
                babelHelpers.inherits(ExtensionListItem, _Component);

                function ExtensionListItem() {
                    babelHelpers.classCallCheck(this, ExtensionListItem);
                    return babelHelpers.possibleConstructorReturn(this, (ExtensionListItem.__proto__ || Object.getPrototypeOf(ExtensionListItem)).apply(this, arguments));
                }

                babelHelpers.createClass(ExtensionListItem, [{
                    key: "init",
                    value: function init() {
                        this.extended = m.prop(false);
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var _this2 = this;

                        var task = this.props.task;
                        var iconName = function () {
                            switch (task.status()) {
                                case 'success':
                                    return 'check';
                                case 'exception':
                                    return 'exclamation';
                                case 'working':
                                    return 'spinner';
                            }
                            return 'clock-o';
                        }();

                        // We need to wrap items in a tbody because Mithril 0.2 and therefore flarum/Component does not allow a list of vnodes to be returned from a view
                        // And we can't wrap <tr> in anything else without breaking the table
                        // Having multiple <tbody> does not seem to be too much an issue https://stackoverflow.com/a/3076790/3133038
                        return m(
                            "tbody",
                            { className: 'TaskListItem status-' + task.status() },
                            m(
                                "tr",
                                null,
                                m(
                                    "td",
                                    { className: "time-column" },
                                    humanTime(task.created_at())
                                ),
                                m(
                                    "td",
                                    { className: "status-column", title: app.translator.trans('flagrow-bazaar.admin.page.task.status.' + (task.status() !== null ? task.status() : 'unknown')) },
                                    m(
                                        "div",
                                        { className: "status" },
                                        icon(iconName)
                                    )
                                ),
                                m(
                                    "td",
                                    { className: "command-column" },
                                    app.translator.trans('flagrow-bazaar.admin.page.task.command.' + task.command(), { extension: m(
                                            "strong",
                                            null,
                                            task.package()
                                        ) })
                                ),
                                m(
                                    "td",
                                    { className: "details-column" },
                                    Button.component({
                                        icon: 'plus',
                                        className: 'Button',
                                        onclick: function onclick() {
                                            _this2.extended(!_this2.extended());
                                        }
                                    })
                                )
                            ),
                            this.extended() ? m(
                                "tr",
                                null,
                                m(
                                    "td",
                                    { className: "output-column", colspan: "4" },
                                    m(
                                        "dl",
                                        null,
                                        m(
                                            "dt",
                                            null,
                                            app.translator.trans('flagrow-bazaar.admin.page.task.attribute.created_at')
                                        ),
                                        m(
                                            "dd",
                                            null,
                                            fullTime(task.created_at())
                                        )
                                    ),
                                    m(
                                        "dl",
                                        null,
                                        m(
                                            "dt",
                                            null,
                                            app.translator.trans('flagrow-bazaar.admin.page.task.attribute.started_at')
                                        ),
                                        m(
                                            "dd",
                                            null,
                                            fullTime(task.started_at())
                                        )
                                    ),
                                    m(
                                        "dl",
                                        null,
                                        m(
                                            "dt",
                                            null,
                                            app.translator.trans('flagrow-bazaar.admin.page.task.attribute.finished_at')
                                        ),
                                        m(
                                            "dd",
                                            null,
                                            fullTime(task.finished_at())
                                        )
                                    ),
                                    m(
                                        "p",
                                        null,
                                        app.translator.trans('flagrow-bazaar.admin.page.task.header.output')
                                    ),
                                    m(
                                        "pre",
                                        { className: "output" },
                                        task.output()
                                    )
                                )
                            ) : null
                        );
                    }
                }]);
                return ExtensionListItem;
            }(Component);

            _export("default", ExtensionListItem);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/components/TasksPage', ['flarum/app', 'flarum/Component', 'flagrow/bazaar/utils/TaskRepository', 'flagrow/bazaar/components/BazaarPageHeader', 'flagrow/bazaar/components/TaskListItem', 'flagrow/bazaar/components/BazaarLoader'], function (_export, _context) {
    "use strict";

    var app, Component, TaskRepository, BazaarPageHeader, TaskListItem, BazaarLoader, TasksPage;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flagrowBazaarUtilsTaskRepository) {
            TaskRepository = _flagrowBazaarUtilsTaskRepository.default;
        }, function (_flagrowBazaarComponentsBazaarPageHeader) {
            BazaarPageHeader = _flagrowBazaarComponentsBazaarPageHeader.default;
        }, function (_flagrowBazaarComponentsTaskListItem) {
            TaskListItem = _flagrowBazaarComponentsTaskListItem.default;
        }, function (_flagrowBazaarComponentsBazaarLoader) {
            BazaarLoader = _flagrowBazaarComponentsBazaarLoader.default;
        }],
        execute: function () {
            TasksPage = function (_Component) {
                babelHelpers.inherits(TasksPage, _Component);

                function TasksPage() {
                    babelHelpers.classCallCheck(this, TasksPage);
                    return babelHelpers.possibleConstructorReturn(this, (TasksPage.__proto__ || Object.getPrototypeOf(TasksPage)).apply(this, arguments));
                }

                babelHelpers.createClass(TasksPage, [{
                    key: 'init',
                    value: function init() {
                        // Used in the header
                        app.current = this;

                        this.loading = m.prop(false);
                        this.repository = new TaskRepository(this.loading);
                        this.repository.loadNextPage();
                        this.loader = BazaarLoader.component({ loading: this.loading });
                    }
                }, {
                    key: 'view',
                    value: function view() {
                        return m(
                            'div',
                            { className: 'ExtensionsPage Bazaar TaskPage' },
                            BazaarPageHeader.component(),
                            m(
                                'div',
                                { className: 'ExtensionsPage-list' },
                                m(
                                    'div',
                                    { className: 'container' },
                                    this.taskGroups().map(function (group) {
                                        return group.tasks.length ? m(
                                            'div',
                                            null,
                                            m(
                                                'h2',
                                                null,
                                                group.title
                                            ),
                                            m(
                                                'table',
                                                { className: 'TaskPage-table' },
                                                m(
                                                    'thead',
                                                    null,
                                                    m(
                                                        'tr',
                                                        null,
                                                        m(
                                                            'th',
                                                            { className: 'time-column' },
                                                            app.translator.trans('flagrow-bazaar.admin.page.task.header.time')
                                                        ),
                                                        m(
                                                            'th',
                                                            { className: 'status-column' },
                                                            app.translator.trans('flagrow-bazaar.admin.page.task.header.status')
                                                        ),
                                                        m(
                                                            'th',
                                                            null,
                                                            app.translator.trans('flagrow-bazaar.admin.page.task.header.command')
                                                        ),
                                                        m(
                                                            'th',
                                                            { className: 'details-column' },
                                                            app.translator.trans('flagrow-bazaar.admin.page.task.header.details')
                                                        )
                                                    )
                                                ),
                                                group.tasks.map(function (task) {
                                                    return m(TaskListItem, { task: task });
                                                })
                                            )
                                        ) : null;
                                    })
                                )
                            ),
                            this.loader
                        );
                    }
                }, {
                    key: 'taskGroups',
                    value: function taskGroups() {
                        var taskGroups = [{
                            title: app.translator.trans('flagrow-bazaar.admin.page.task.group.today'),
                            tasks: []
                        }, {
                            title: app.translator.trans('flagrow-bazaar.admin.page.task.group.lastmonth'),
                            tasks: []
                        }, {
                            title: app.translator.trans('flagrow-bazaar.admin.page.task.group.older'),
                            tasks: []
                        }];
                        var currentGroup = 0;

                        // Milliseconds from 1 January 1970 00:00:00 UTC
                        var today = new Date().setHours(0, 0, 0, 0);

                        this.repository.tasks().forEach(function (task) {
                            // Milliseconds from 1 January 1970 00:00:00 UTC
                            var taskDate = new Date(task.created_at()).setHours(0, 0, 0, 0);

                            switch (currentGroup) {
                                case 0:
                                    if (taskDate === today) {
                                        taskGroups[currentGroup].tasks.push(task);
                                    } else {
                                        currentGroup++;
                                    }
                                    break;
                                case 1:
                                    // Check if the date is within the last 30 days
                                    if ((today - taskDate) / (1000 * 3600 * 24) <= 30) {
                                        taskGroups[currentGroup].tasks.push(task);
                                    } else {
                                        currentGroup++;
                                    }
                                    break;
                                default:
                                    taskGroups[currentGroup].tasks.push(task);
                            }
                        });

                        return taskGroups;
                    }
                }]);
                return TasksPage;
            }(Component);

            _export('default', TasksPage);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/main', ['flarum/extend', 'flarum/app', 'flagrow/bazaar/modals/BazaarSettingsModal', 'flagrow/bazaar/models/Extension', 'flagrow/bazaar/models/Task', 'flagrow/bazaar/addBazaarPage', 'flagrow/bazaar/addTasksPage'], function (_export, _context) {
    "use strict";

    var extend, app, BazaarSettingsModal, Extension, Task, addBazaarPage, addTasksPage;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowBazaarModalsBazaarSettingsModal) {
            BazaarSettingsModal = _flagrowBazaarModalsBazaarSettingsModal.default;
        }, function (_flagrowBazaarModelsExtension) {
            Extension = _flagrowBazaarModelsExtension.default;
        }, function (_flagrowBazaarModelsTask) {
            Task = _flagrowBazaarModelsTask.default;
        }, function (_flagrowBazaarAddBazaarPage) {
            addBazaarPage = _flagrowBazaarAddBazaarPage.default;
        }, function (_flagrowBazaarAddTasksPage) {
            addTasksPage = _flagrowBazaarAddTasksPage.default;
        }],
        execute: function () {

            app.initializers.add('flagrow-bazaar', function (app) {
                app.extensionSettings['flagrow-bazaar'] = function () {
                    return app.modal.show(new BazaarSettingsModal());
                };
                app.store.models['bazaar-extensions'] = Extension;
                app.store.models['bazaar-tasks'] = Task;

                addBazaarPage();
                addTasksPage();
            });
        }
    };
});;
"use strict";

System.register("flagrow/bazaar/modals/BazaarConnectModal", ["flarum/components/Modal", "flarum/components/Button"], function (_export, _context) {
    "use strict";

    var Modal, Button, BazaarConnectModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }],
        execute: function () {
            BazaarConnectModal = function (_Modal) {
                babelHelpers.inherits(BazaarConnectModal, _Modal);

                function BazaarConnectModal() {
                    babelHelpers.classCallCheck(this, BazaarConnectModal);
                    return babelHelpers.possibleConstructorReturn(this, (BazaarConnectModal.__proto__ || Object.getPrototypeOf(BazaarConnectModal)).apply(this, arguments));
                }

                babelHelpers.createClass(BazaarConnectModal, [{
                    key: "className",
                    value: function className() {
                        return 'FilePermissionsModal';
                    }
                }, {
                    key: "title",
                    value: function title() {
                        return app.translator.trans('flagrow-bazaar.admin.modal.connect-bazaar.title');
                    }
                }, {
                    key: "content",
                    value: function content() {
                        var flagrowHost = this.props.flagrowHost;

                        return m('div', { className: 'Modal-body' }, [m('p', app.translator.trans('flagrow-bazaar.admin.modal.connect-bazaar.description', { host: flagrowHost })), m('div', { className: "App-primaryControl" }, [Button.component({
                            type: 'submit',
                            className: 'Button Button--primary Button--block',
                            disabled: false,
                            icon: 'check',
                            children: app.translator.trans('flagrow-bazaar.admin.page.button.connect')
                        })])]);
                    }
                }, {
                    key: "connect",
                    value: function connect() {
                        var popup = window.open();

                        app.request({
                            method: 'GET',
                            url: app.forum.attribute('apiUrl') + '/bazaar/connect'
                        }).then(function (response) {
                            if (response && response.redirect) {
                                popup.location = response.redirect;
                            } else {
                                popup.close();
                            }
                        });
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit() {
                        this.connect();
                    }
                }]);
                return BazaarConnectModal;
            }(Modal);

            _export("default", BazaarConnectModal);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/modals/BazaarSettingsModal', ['flarum/app', 'flarum/components/SettingsModal'], function (_export, _context) {
    "use strict";

    var app, SettingsModal, BazaarSettingsModal;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsSettingsModal) {
            SettingsModal = _flarumComponentsSettingsModal.default;
        }],
        execute: function () {
            BazaarSettingsModal = function (_SettingsModal) {
                babelHelpers.inherits(BazaarSettingsModal, _SettingsModal);

                function BazaarSettingsModal() {
                    babelHelpers.classCallCheck(this, BazaarSettingsModal);
                    return babelHelpers.possibleConstructorReturn(this, (BazaarSettingsModal.__proto__ || Object.getPrototypeOf(BazaarSettingsModal)).apply(this, arguments));
                }

                babelHelpers.createClass(BazaarSettingsModal, [{
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('flagrow-bazaar.admin.modal.settings.title');
                    }
                }, {
                    key: 'form',
                    value: function form() {
                        return [m('div', { className: 'Form-group' }, [m('label', { for: 'bazaar-api-token' }, app.translator.trans('flagrow-bazaar.admin.modal.settings.field.apiToken')), m('input', {
                            id: 'bazaar-api-token',
                            className: 'FormControl',
                            bidi: this.setting('flagrow.bazaar.api_token')
                        }), m('span', app.translator.trans('flagrow-bazaar.admin.modal.settings.field.apiTokenDescription'))])];
                    }
                }]);
                return BazaarSettingsModal;
            }(SettingsModal);

            _export('default', BazaarSettingsModal);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/modals/FilePermissionsModal', ['flarum/components/Modal'], function (_export, _context) {
    "use strict";

    var Modal, FilePermissionsModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }],
        execute: function () {
            FilePermissionsModal = function (_Modal) {
                babelHelpers.inherits(FilePermissionsModal, _Modal);

                function FilePermissionsModal() {
                    babelHelpers.classCallCheck(this, FilePermissionsModal);
                    return babelHelpers.possibleConstructorReturn(this, (FilePermissionsModal.__proto__ || Object.getPrototypeOf(FilePermissionsModal)).apply(this, arguments));
                }

                babelHelpers.createClass(FilePermissionsModal, [{
                    key: 'className',
                    value: function className() {
                        return 'FilePermissionsModal';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('flagrow-bazaar.admin.modal.requirements.file-permissions.title');
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        var permissions = this.props.file_permissions;
                        var paths = [];

                        permissions.forEach(function (path) {
                            paths.push(m('li', m('span', { className: 'code' }, path)));
                        });

                        return m('div', { className: 'Modal-body' }, [m('p', app.translator.trans('flagrow-bazaar.admin.modal.requirements.file-permissions.description', { a: m('a', { href: 'https://github.com/flagrow/bazaar/wiki/File-permissions', target: '_blank' }) })), m('ul', paths)]);
                    }
                }]);
                return FilePermissionsModal;
            }(Modal);

            _export('default', FilePermissionsModal);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/modals/MemoryLimitModal', ['flarum/components/Modal'], function (_export, _context) {
    "use strict";

    var Modal, MemoryLimitModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }],
        execute: function () {
            MemoryLimitModal = function (_Modal) {
                babelHelpers.inherits(MemoryLimitModal, _Modal);

                function MemoryLimitModal() {
                    babelHelpers.classCallCheck(this, MemoryLimitModal);
                    return babelHelpers.possibleConstructorReturn(this, (MemoryLimitModal.__proto__ || Object.getPrototypeOf(MemoryLimitModal)).apply(this, arguments));
                }

                babelHelpers.createClass(MemoryLimitModal, [{
                    key: 'className',
                    value: function className() {
                        return 'MemoryLimitModal';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('flagrow-bazaar.admin.modal.requirements.php-memory_limit.title');
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        var memory_requested = this.props.memory_requested;
                        var memory_limit = this.props.memory_limit;

                        return m('div', { className: 'Modal-body' }, app.translator.trans('flagrow-bazaar.admin.modal.requirements.php-memory_limit.description', {
                            required: memory_requested,
                            limit: memory_limit,
                            a: m('a', { href: 'https://github.com/flagrow/bazaar/wiki/PHP-memory-limit', target: '_blank' })
                        }));
                    }
                }]);
                return MemoryLimitModal;
            }(Modal);

            _export('default', MemoryLimitModal);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/models/Extension', ['flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
    "use strict";

    var Model, mixin, computed, Extension;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }, function (_flarumUtilsComputed) {
            computed = _flarumUtilsComputed.default;
        }],
        execute: function () {
            Extension = function (_mixin) {
                babelHelpers.inherits(Extension, _mixin);

                function Extension() {
                    babelHelpers.classCallCheck(this, Extension);
                    return babelHelpers.possibleConstructorReturn(this, (Extension.__proto__ || Object.getPrototypeOf(Extension)).apply(this, arguments));
                }

                return Extension;
            }(mixin(Model, {
                package: Model.attribute('package'),
                title: Model.attribute('title'),
                description: Model.attribute('description'),
                license: Model.attribute('license'),
                icon: Model.attribute('icon'),

                stars: Model.attribute('stars'),
                forks: Model.attribute('forks'),
                downloads: Model.attribute('downloads'),

                installed: Model.attribute('installed'),
                enabled: Model.attribute('enabled'),
                installed_version: Model.attribute('installed_version'),
                highest_version: Model.attribute('highest_version'),
                outdated: Model.attribute('outdated'),

                flarum_id: Model.attribute('flarum_id'),

                can_install: computed('installed', function (installed) {
                    return !installed;
                }),
                can_uninstall: computed('installed', 'enabled', function (installed, enabled) {
                    return installed && !enabled;
                }),

                favorited: Model.attribute('favorited')
            }));

            _export('default', Extension);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/models/Task', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, Task;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Task = function (_mixin) {
                babelHelpers.inherits(Task, _mixin);

                function Task() {
                    babelHelpers.classCallCheck(this, Task);
                    return babelHelpers.possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));
                }

                return Task;
            }(mixin(Model, {
                status: Model.attribute('status'),
                command: Model.attribute('command'),
                package: Model.attribute('package'),
                output: Model.attribute('output'),
                created_at: Model.attribute('created_at'),
                started_at: Model.attribute('started_at'),
                finished_at: Model.attribute('finished_at')
            }));

            _export('default', Task);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/utils/ExtensionRepository', ['flarum/app', 'flagrow/bazaar/utils/debounce'], function (_export, _context) {
    "use strict";

    var app, debounce, ExtensionRepository;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flagrowBazaarUtilsDebounce) {
            debounce = _flagrowBazaarUtilsDebounce.default;
        }],
        execute: function () {
            ExtensionRepository = function () {
                function ExtensionRepository(loading) {
                    var _this = this;

                    babelHelpers.classCallCheck(this, ExtensionRepository);

                    this.extensions = m.prop([]);
                    this.nextPageUrl = null;
                    this.loading = loading;
                    this.resetNavigation();
                    this.filterInstalled = m.prop(false);
                    this.filterUpdateRequired = m.prop(false);
                    this.filterFavorited = m.prop(false);
                    this.filters = {
                        search: ''
                    };

                    // Code to run once after a serie of filterBy() calls
                    // Must be done in constructor to save a single reference to the output of debounce
                    this.filterByDebounce = debounce(function () {
                        _this.resetNavigation();
                        _this.loadNextPage();
                    }, 500);
                }

                /**
                 * Change the value of a filter
                 * @param {string} filter
                 * @param {string} filterBy
                 */


                babelHelpers.createClass(ExtensionRepository, [{
                    key: 'filterBy',
                    value: function filterBy(filter, _filterBy) {
                        this.filters[filter] = _filterBy;

                        this.filterByDebounce();
                    }
                }, {
                    key: 'filteredBy',
                    value: function filteredBy(filter) {
                        return this.filters[filter];
                    }
                }, {
                    key: 'requestError',
                    value: function requestError() {
                        // If an error occured, we can clear the loading overlay
                        // The error means it's not processing anymore
                        this.loading('error');

                        // Depending on how fast the "Oops! Something went wrong" popup appears,
                        // the loading change is not taken into account. Use redraw to force remove the overlay
                        m.redraw();
                    }
                }, {
                    key: 'loadNextPage',
                    value: function loadNextPage() {
                        var _this2 = this;

                        if (this.loading() || !this.nextPageUrl) {
                            return;
                        }

                        this.loading(true);

                        app.request({
                            method: 'GET',
                            url: this.nextPageUrl,
                            data: {
                                filter: this.filters
                            }
                        }).then(function (result) {
                            var newExtensions = result.data.map(function (data) {
                                return app.store.createRecord('bazaar-extensions', data);
                            });
                            _this2.extensions(newExtensions);
                            _this2.nextPageUrl = result.links.next;
                            _this2.loading(false);

                            m.redraw();
                        }).catch(function () {
                            return _this2.requestError();
                        });
                    }
                }, {
                    key: 'resetNavigation',
                    value: function resetNavigation() {
                        this.loading(false); // Might cause problems if an update is in process
                        this.nextPageUrl = app.forum.attribute('apiUrl') + '/bazaar/extensions';
                        this.extensions([]);
                    }
                }, {
                    key: 'installExtension',
                    value: function installExtension(extension) {
                        var _this3 = this;

                        this.loading(true);

                        app.request({
                            method: 'POST',
                            url: app.forum.attribute('apiUrl') + '/bazaar/extensions',
                            timeout: 0,
                            data: {
                                id: extension.id()
                            }
                        }).then(function (response) {
                            _this3.updateExtensionInRepository(response);
                        }).catch(function () {
                            return _this3.requestError();
                        });
                    }
                }, {
                    key: 'installFailure',
                    value: function installFailure(extension) {
                        this.resetNavigation();
                        this.loadNextPage();
                    }
                }, {
                    key: 'uninstallExtension',
                    value: function uninstallExtension(extension) {
                        var _this4 = this;

                        this.loading(true);

                        app.request({
                            method: 'DELETE',
                            timeout: 0,
                            url: app.forum.attribute('apiUrl') + '/bazaar/extensions/' + extension.id()
                        }).then(function (response) {
                            _this4.updateExtensionInRepository(response);
                        }).catch(function () {
                            return _this4.requestError();
                        });
                    }
                }, {
                    key: 'uninstallFailure',
                    value: function uninstallFailure(extension) {
                        this.resetNavigation();
                        this.loadNextPage();
                    }
                }, {
                    key: 'favoriteExtension',
                    value: function favoriteExtension(extension) {
                        var _this5 = this;

                        this.loading(true);

                        app.request({
                            method: 'post',
                            url: app.forum.attribute('apiUrl') + '/bazaar/extensions/' + extension.id() + '/favorite',
                            data: {
                                favorite: extension.favorited() != true
                            }
                        }).then(function (response) {
                            _this5.updateExtensionInRepository(response);
                        }).catch(function () {
                            return _this5.requestError();
                        });
                    }
                }, {
                    key: 'updateExtension',
                    value: function updateExtension(extension) {
                        var _this6 = this;

                        this.loading(true);

                        app.request({
                            url: app.forum.attribute('apiUrl') + '/bazaar/extensions/' + extension.id(),
                            timeout: 0,
                            method: 'PATCH'
                        }).then(function (response) {
                            _this6.updateExtensionInRepository(response);
                        }).then(function () {
                            location.reload();
                        }).catch(function () {
                            return _this6.requestError();
                        });
                    }
                }, {
                    key: 'toggleExtension',
                    value: function toggleExtension(extension) {
                        var _this7 = this;

                        this.loading(true);

                        var enabled = extension.enabled();

                        app.request({
                            url: app.forum.attribute('apiUrl') + '/bazaar/extensions/' + extension.id() + '/toggle',
                            method: 'PATCH',
                            data: { enabled: !enabled }
                        }).then(function (response) {
                            _this7.updateExtensionInRepository(response);
                        }).catch(function () {
                            return _this7.requestError();
                        });
                    }
                }, {
                    key: 'disableExtension',
                    value: function disableExtension(extension) {
                        this.toggleExtension(extension);
                    }
                }, {
                    key: 'enableExtension',
                    value: function enableExtension(extension) {
                        this.toggleExtension(extension);
                    }
                }, {
                    key: 'getExtensionIndex',
                    value: function getExtensionIndex(extension) {
                        return this.extensions().findIndex(function (ext) {
                            return ext.id() == extension.id();
                        });
                    }
                }, {
                    key: 'updateExtensionInRepository',
                    value: function updateExtensionInRepository(response) {
                        this.loading(false);

                        var extension = app.store.createRecord('bazaar-extensions', response.data);
                        this.extensions()[this.getExtensionIndex(extension)] = extension;
                        m.redraw();
                    }
                }]);
                return ExtensionRepository;
            }();

            _export('default', ExtensionRepository);
        }
    };
});;
'use strict';

System.register('flagrow/bazaar/utils/TaskRepository', ['flarum/app'], function (_export, _context) {
    "use strict";

    var app, ExtensionRepository;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }],
        execute: function () {
            ExtensionRepository = function () {
                function ExtensionRepository(loading) {
                    babelHelpers.classCallCheck(this, ExtensionRepository);

                    this.tasks = m.prop([]);
                    this.nextPageUrl = null;
                    this.loading = loading;
                    this.resetNavigation();
                }

                babelHelpers.createClass(ExtensionRepository, [{
                    key: 'loadNextPage',
                    value: function loadNextPage() {
                        var _this = this;

                        if (this.loading() || !this.nextPageUrl) {
                            return;
                        }

                        this.loading(true);

                        app.request({
                            method: 'GET',
                            url: this.nextPageUrl
                        }).then(function (result) {
                            var newTasks = result.data.map(function (data) {
                                return app.store.createRecord('bazaar-tasks', data);
                            });
                            _this.tasks(newTasks);
                            _this.nextPageUrl = null;
                            _this.loading(false);

                            m.redraw();
                        });
                    }
                }, {
                    key: 'resetNavigation',
                    value: function resetNavigation() {
                        this.loading(false);
                        this.nextPageUrl = app.forum.attribute('apiUrl') + '/bazaar/tasks';
                        this.tasks([]);
                    }
                }]);
                return ExtensionRepository;
            }();

            _export('default', ExtensionRepository);
        }
    };
});;
"use strict";

System.register("flagrow/bazaar/utils/debounce", [], function (_export, _context) {
    "use strict";

    _export("default", function (func, wait, immediate) {
        var timeout = void 0;
        return function () {
            var context = this,
                args = arguments;
            var later = function later() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    });

    return {
        setters: [],
        execute: function () {
            ; /**
               * Based on _.debounce from underscore.js
               * Copyright (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative
               * @see https://davidwalsh.name/javascript-debounce-function
               *
               * Returns a function, that, as long as it continues to be invoked, will not
               * be triggered. The function will be called after it stops being called for
               * N milliseconds. If `immediate` is passed, trigger the function on the
               * leading edge, instead of the trailing.
               */
        }
    };
});
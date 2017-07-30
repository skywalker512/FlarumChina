"use strict";

System.register("Reflar/gamification/addSettingsPage", ["flarum/extend", "flarum/components/AdminNav", "flarum/components/AdminLinkButton", "Reflar/gamification/components/SettingsPage"], function (_export, _context) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, SettingsPage;

    _export("default", function () {
        app.routes['reflar-gamification'] = { path: '/reflar/gamification', component: SettingsPage.component() };

        app.extensionSettings['reflar-gamification'] = function () {
            return m.route(app.route('reflar-gamification'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            items.add('reflar-gamification', AdminLinkButton.component({
                href: app.route('reflar-gamification'),
                icon: 'thumbs-up',
                children: 'Gamification',
                description: app.translator.trans('reflar-gamification.admin.nav.desc')
            }));
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_ReflarGamificationComponentsSettingsPage) {
            SettingsPage = _ReflarGamificationComponentsSettingsPage.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("Reflar/gamification/components/SettingsPage", ["flarum/components/Alert", "flarum/components/Page", "flarum/components/Button", "flarum/components/UploadImageButton", "flarum/utils/saveSettings", "flarum/components/Switch"], function (_export, _context) {
    "use strict";

    var Alert, Page, Button, UploadImageButton, saveSettings, Switch, SettingsPage;
    return {
        setters: [function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
        }, function (_flarumComponentsPage) {
            Page = _flarumComponentsPage.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsUploadImageButton) {
            UploadImageButton = _flarumComponentsUploadImageButton.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponentsSwitch) {
            Switch = _flarumComponentsSwitch.default;
        }],
        execute: function () {
            SettingsPage = function (_Page) {
                babelHelpers.inherits(SettingsPage, _Page);

                function SettingsPage() {
                    babelHelpers.classCallCheck(this, SettingsPage);
                    return babelHelpers.possibleConstructorReturn(this, (SettingsPage.__proto__ || Object.getPrototypeOf(SettingsPage)).apply(this, arguments));
                }

                babelHelpers.createClass(SettingsPage, [{
                    key: "init",
                    value: function init() {
                        var _this2 = this;

                        this.fields = ['convertedLikes', 'amountPerPost', 'amountPerDiscussion', 'postStartAmount', 'rankAmt', 'iconName', 'voteColor', 'blockedUsers', 'pointsPlaceholder'];

                        this.switches = ['autoUpvotePosts', 'customRankingImages'];

                        this.ranks = app.store.all('ranks');

                        this.values = {};

                        this.settingsPrefix = 'reflar.gamification';

                        var settings = app.data.settings;

                        this.fields.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)]);
                        });

                        this.switches.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)] === '1');
                        });

                        this.newRank = {
                            'points': m.prop(''),
                            'name': m.prop(''),
                            'color': m.prop('')
                        };
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var _this3 = this;

                        return [m('div', { className: 'SettingsPage' }, [m('div', { className: 'container' }, [m('form', { onsubmit: this.onsubmit.bind(this) }, [m('div', { className: 'helpText' }, app.translator.trans('reflar-gamification.admin.page.convert.help')), this.values.convertedLikes() === undefined ? Button.component({
                            type: 'button',
                            className: 'Button Button--warning Ranks-button',
                            children: app.translator.trans('reflar-gamification.admin.page.convert.button'),
                            onclick: function onclick() {
                                app.request({
                                    url: app.forum.attribute('apiUrl') + '/reflar/gamification/convert',
                                    method: 'POST'
                                }).then(_this3.values.convertedLikes('converting'));
                            }
                        }) : this.values.convertedLikes() === 'converting' ? m('label', {}, app.translator.trans('reflar-gamification.admin.page.convert.converting')) : m('label', {}, app.translator.trans('reflar-gamification.admin.page.convert.converted', { number: this.values.convertedLikes() })), m('fieldset', { className: 'SettingsPage-ranks' }, [m('legend', {}, app.translator.trans('reflar-gamification.admin.page.ranks.title')), m('label', {}, app.translator.trans('reflar-gamification.admin.page.ranks.ranks')), m('div', { className: 'helpText' }, app.translator.trans('reflar-gamification.admin.page.ranks.help.help')), m('div', { className: 'Ranks--Container' }, this.ranks.map(function (rank) {
                            return m('div', {}, [m('input', {
                                className: 'FormControl Ranks-number',
                                type: 'number',
                                value: rank.points(),
                                placeholder: app.translator.trans('reflar-gamification.admin.page.ranks.help.points'),
                                oninput: m.withAttr('value', _this3.updatePoints.bind(_this3, rank))
                            }), m('input', {
                                className: 'FormControl Ranks-name',
                                value: rank.name(),
                                placeholder: app.translator.trans('reflar-gamification.admin.page.ranks.help.name'),
                                oninput: m.withAttr('value', _this3.updateName.bind(_this3, rank))
                            }), m('input', {
                                className: 'FormControl Ranks-color',
                                value: rank.color(),
                                placeholder: app.translator.trans('reflar-gamification.admin.page.ranks.help.color'),
                                oninput: m.withAttr('value', _this3.updateColor.bind(_this3, rank))
                            }), Button.component({
                                type: 'button',
                                className: 'Button Button--warning Ranks-button',
                                icon: 'times',
                                onclick: _this3.deleteRank.bind(_this3, rank)
                            })]);
                        }), m('div', {}, [m('input', {
                            className: 'FormControl Ranks-number',
                            value: this.newRank.points(),
                            placeholder: app.translator.trans('reflar-gamification.admin.page.ranks.help.points'),
                            type: 'number',
                            oninput: m.withAttr('value', this.newRank.points)
                        }), m('input', {
                            className: 'FormControl Ranks-name',
                            value: this.newRank.name(),
                            placeholder: app.translator.trans('reflar-gamification.admin.page.ranks.help.name'),
                            oninput: m.withAttr('value', this.newRank.name)
                        }), m('input', {
                            className: 'FormControl Ranks-color',
                            value: this.newRank.color(),
                            placeholder: app.translator.trans('reflar-gamification.admin.page.ranks.help.color'),
                            oninput: m.withAttr('value', this.newRank.color)
                        }), Button.component({
                            type: 'button',
                            className: 'Button Button--warning Ranks-button',
                            icon: 'plus',
                            onclick: this.addRank.bind(this)
                        })])), m('label', {}, app.translator.trans('reflar-gamification.admin.page.ranks.number_title')), m('input', {
                            className: 'FormControl Ranks-default',
                            value: this.values.rankAmt() || '',
                            placeholder: 2,
                            oninput: m.withAttr('value', this.values.rankAmt)
                        }), m('legend', {}, app.translator.trans('reflar-gamification.admin.page.votes.title')), m('label', {}, app.translator.trans('reflar-gamification.admin.page.votes.icon_name')), m('div', { className: 'helpText' }, app.translator.trans('reflar-gamification.admin.page.votes.icon_help')), m('input', {
                            className: 'FormControl Ranks-default',
                            value: this.values.iconName() || '',
                            placeholder: 'thumbs',
                            oninput: m.withAttr('value', this.values.iconName)
                        }), Switch.component({
                            state: this.values.autoUpvotePosts() || false,
                            children: app.translator.trans('reflar-gamification.admin.page.votes.auto_upvote'),
                            onchange: this.values.autoUpvotePosts,
                            className: 'votes-switch'
                        }), m('label', {}, app.translator.trans('reflar-gamification.admin.page.votes.points_title')), m('input', {
                            className: 'FormControl Ranks-default',
                            value: this.values.pointsPlaceholder() || '',
                            placeholder: app.translator.trans('reflar-gamification.admin.page.votes.points_placeholder') + '{points}',
                            oninput: m.withAttr('value', this.values.pointsPlaceholder)
                        }), m('label', {}, app.translator.trans('reflar-gamification.admin.page.votes.vote_color')), m('input', {
                            className: 'FormControl Ranks-default',
                            placeholder: app.translator.trans('reflar-gamification.admin.page.votes.color_holder'),
                            value: this.values.voteColor() || '',
                            oninput: m.withAttr('value', this.values.voteColor)
                        }), m('legend', {}, app.translator.trans('reflar-gamification.admin.page.rankings.title')), Switch.component({
                            state: this.values.customRankingImages() || false,
                            children: app.translator.trans('reflar-gamification.admin.page.rankings.enable'),
                            onchange: this.values.customRankingImages,
                            className: 'votes-switch'
                        }), m('label', {}, app.translator.trans('reflar-gamification.admin.page.rankings.blocked.title')), m('input', {
                            className: 'FormControl Ranks-blocked',
                            placeholder: app.translator.trans('reflar-gamification.admin.page.rankings.blocked.placeholder'),
                            value: this.values.blockedUsers() || '',
                            oninput: m.withAttr('value', this.values.blockedUsers)
                        }), m('div', { className: 'helpText' }, app.translator.trans('reflar-gamification.admin.page.rankings.blocked.help')), m('label', { className: "Upload-label" }, app.translator.trans('reflar-gamification.admin.page.rankings.custom_image_1')), m(UploadImageButton, { className: "Upload-button", name: "reflar/topimage/1" }), m('br'), m('label', { className: "Upload-label" }, app.translator.trans('reflar-gamification.admin.page.rankings.custom_image_2')), m(UploadImageButton, { className: "Upload-button", name: "reflar/topimage/2" }), m('br'), m('label', { className: "Upload-label" }, app.translator.trans('reflar-gamification.admin.page.rankings.custom_image_3')), m(UploadImageButton, { className: "Upload-button", name: "reflar/topimage/3" }), m('br'), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary Ranks-save',
                            children: app.translator.trans('reflar-gamification.admin.page.save_settings'),
                            loading: this.loading,
                            disabled: !this.changed()
                        })])])])])];
                    }
                }, {
                    key: "updateName",
                    value: function updateName(rank, value) {
                        rank.save({ name: value });
                    }
                }, {
                    key: "updatePoints",
                    value: function updatePoints(rank, value) {
                        rank.save({ points: value });
                    }
                }, {
                    key: "updateColor",
                    value: function updateColor(rank, value) {
                        rank.save({ color: value });
                    }
                }, {
                    key: "deleteRank",
                    value: function deleteRank(rankToDelete) {
                        var _this4 = this;

                        rankToDelete.delete();
                        this.ranks.some(function (rank, i) {
                            if (rank.data.id === rankToDelete.data.id) {
                                _this4.ranks.splice(i, 1);
                                return true;
                            }
                        });
                    }
                }, {
                    key: "addRank",
                    value: function addRank(rank) {
                        var _this5 = this;

                        app.store.createRecord('ranks').save({
                            points: this.newRank.points(),
                            name: this.newRank.name(),
                            color: this.newRank.color()
                        }).then(function (rank) {
                            _this5.newRank.color('');
                            _this5.newRank.name('');
                            _this5.newRank.points('');
                            _this5.ranks.push(rank);
                            m.redraw();
                        });
                    }
                }, {
                    key: "changed",
                    value: function changed() {
                        var _this6 = this;

                        var switchesCheck = this.switches.some(function (key) {
                            return _this6.values[key]() !== (app.data.settings[_this6.addPrefix(key)] == '1');
                        });
                        var fieldsCheck = this.fields.some(function (key) {
                            return _this6.values[key]() !== app.data.settings[_this6.addPrefix(key)];
                        });
                        return fieldsCheck || switchesCheck;
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        var _this7 = this;

                        e.preventDefault();

                        if (this.loading) return;

                        this.loading = true;

                        app.alerts.dismiss(this.successAlert);

                        var settings = {};

                        this.switches.forEach(function (key) {
                            return settings[_this7.addPrefix(key)] = _this7.values[key]();
                        });
                        this.fields.forEach(function (key) {
                            return settings[_this7.addPrefix(key)] = _this7.values[key]();
                        });

                        saveSettings(settings).then(function () {
                            app.alerts.show(_this7.successAlert = new Alert({
                                type: 'success',
                                children: app.translator.trans('core.admin.basics.saved_message')
                            }));
                        }).catch(function () {}).then(function () {
                            _this7.loading = false;
                            window.location.reload();
                        });
                    }
                }, {
                    key: "addPrefix",
                    value: function addPrefix(key) {
                        return this.settingsPrefix + '.' + key;
                    }
                }]);
                return SettingsPage;
            }(Page);

            _export("default", SettingsPage);
        }
    };
});;
'use strict';

System.register('Reflar/gamification/helpers/rankLabel', [], function (_export, _context) {
  "use strict";

  function rankLabel(rank) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    attrs.style = attrs.style || {};
    attrs.className = 'rankLabel ' + (attrs.className || '');

    var color = rank.color();
    attrs.style.backgroundColor = attrs.style.color = color;
    attrs.className += ' colored';

    return m('span', attrs, m(
      'span',
      { className: 'rankLabel-text' },
      rank.name()
    ));
  }

  _export('default', rankLabel);

  return {
    setters: [],
    execute: function () {}
  };
});;
'use strict';

System.register('Reflar/gamification/main', ['flarum/app', 'flarum/extend', 'flarum/components/PermissionGrid', 'Reflar/gamification/addSettingsPage', 'Reflar/gamification/models/Rank'], function (_export, _context) {
    "use strict";

    var app, extend, PermissionGrid, addSettingsPage, Rank;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }, function (_ReflarGamificationAddSettingsPage) {
            addSettingsPage = _ReflarGamificationAddSettingsPage.default;
        }, function (_ReflarGamificationModelsRank) {
            Rank = _ReflarGamificationModelsRank.default;
        }],
        execute: function () {

            app.initializers.add('reflar-gamification', function (app) {

                app.store.models.ranks = Rank;

                extend(PermissionGrid.prototype, 'replyItems', function (items) {
                    items.add('Vote', {
                        icon: 'thumbs-up',
                        label: app.translator.trans('reflar-gamification.admin.permissions.vote_label'),
                        permission: 'discussion.vote'
                    });
                });

                extend(PermissionGrid.prototype, 'viewItems', function (items) {
                    items.add('canSeeVotes', {
                        icon: 'info-circle',
                        label: app.translator.trans('reflar-gamification.admin.permissions.see_votes_label'),
                        permission: 'discussion.canSeeVotes'
                    });
                });

                addSettingsPage();
            });
        }
    };
});;
'use strict';

System.register('Reflar/gamification/models/Rank', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
  "use strict";

  var Model, mixin, Rank;
  return {
    setters: [function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumUtilsMixin) {
      mixin = _flarumUtilsMixin.default;
    }],
    execute: function () {
      Rank = function (_mixin) {
        babelHelpers.inherits(Rank, _mixin);

        function Rank() {
          babelHelpers.classCallCheck(this, Rank);
          return babelHelpers.possibleConstructorReturn(this, (Rank.__proto__ || Object.getPrototypeOf(Rank)).apply(this, arguments));
        }

        return Rank;
      }(mixin(Model, {
        points: Model.attribute('points'),
        name: Model.attribute('name'),
        color: Model.attribute('color')
      }));

      _export('default', Rank);
    }
  };
});
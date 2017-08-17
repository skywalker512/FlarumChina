"use strict";

System.register("flagrow/byobu/addPrivateDiscussionPermission", ["flarum/extend", "flarum/components/PermissionGrid"], function (_export, _context) {
    "use strict";

    var extend, PermissionGrid;

    _export("default", function () {
        extend(PermissionGrid.prototype, 'startItems', function (items) {
            items.add('startPrivateUsers', {
                icon: 'map-o',
                label: app.translator.trans('flagrow-byobu.admin.permission.create_private_discussions_with_users'),
                permission: 'discussion.startPrivateDiscussionWithUsers'
            }, 95);
            items.add('startPrivateGroups', {
                icon: 'map-o',
                label: app.translator.trans('flagrow-byobu.admin.permission.create_private_discussions_with_groups'),
                permission: 'discussion.startPrivateDiscussionWithGroups'
            }, 95);
        });
        extend(PermissionGrid.prototype, 'moderateItems', function (items) {
            items.add('editUserRecipients', {
                icon: 'map-o',
                label: app.translator.trans('flagrow-byobu.admin.permission.edit_user_recipients'),
                permission: 'discussion.editUserRecipients'
            }, 95);
            items.add('editGroupRecipients', {
                icon: 'map-o',
                label: app.translator.trans('flagrow-byobu.admin.permission.edit_group_recipients'),
                permission: 'discussion.editGroupRecipients'
            }, 95);
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }],
        execute: function () {}
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
'use strict';

System.register('flagrow/byobu/main', ['flarum/core/models/User', 'flagrow/byobu/addPrivateDiscussionPermission'], function (_export, _context) {
  "use strict";

  var User, addPrivateDiscussionPermission;
  return {
    setters: [function (_flarumCoreModelsUser) {
      User = _flarumCoreModelsUser.default;
    }, function (_flagrowByobuAddPrivateDiscussionPermission) {
      addPrivateDiscussionPermission = _flagrowByobuAddPrivateDiscussionPermission.default;
    }],
    execute: function () {

      app.initializers.add('flagrow-byobu', function (app) {
        app.store.models.recipients = User;
        addPrivateDiscussionPermission();
      });
    }
  };
});
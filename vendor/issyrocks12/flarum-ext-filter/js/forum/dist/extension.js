'use strict';

System.register('issyrocks12/filter/main', ['flarum/extend', 'flarum/app', 'flarum/utils/PostControls', 'flarum/components/CommentPost'], function (_export, _context) {
  "use strict";

  var extend, override, app, PostControls, CommentPost;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumUtilsPostControls) {
      PostControls = _flarumUtilsPostControls.default;
    }, function (_flarumComponentsCommentPost) {
      CommentPost = _flarumComponentsCommentPost.default;
    }],
    execute: function () {

      app.initializers.add('issyrocks12-filter', function () {

        override(CommentPost.prototype, 'flagReason', function (original, flag) {
          if (flag.type() === 'issyrocks12-filter.forum.flagger_name') {
            return app.translator.trans('issyrocks12-filter.forum.flagger_name');
          }

          return original(flag);
        });
      }, -20);
    }
  };
});
/*! http://mths.be/details v0.1.0 by @mathias | includes http://mths.be/noselect v1.0.3 */
!function(e,t){var r,n=t.fn,o="[object Opera]"==Object.prototype.toString.call(window.opera),a=function(e){var t,r,n,o=e.createElement("details");return"open"in o?(r=e.body||function(){var r=e.documentElement;return t=!0,r.insertBefore(e.createElement("body"),r.firstElementChild||r.firstChild)}(),o.innerHTML="<summary>a</summary>b",o.style.display="block",r.appendChild(o),n=o.offsetHeight,o.open=!0,n=n!=o.offsetHeight,r.removeChild(o),t&&r.parentNode.removeChild(r),n):!1}(e),i=function(e,t,r,n){var o=e.prop("open"),a=o&&n||!o&&!n;a?(e.removeClass("open").prop("open",!1).triggerHandler("close.details"),t.attr("aria-expanded",!1),r.hide()):(e.addClass("open").prop("open",!0).triggerHandler("open.details"),t.attr("aria-expanded",!0),r.show())};n.noSelect=function(){var e="none";return this.bind("selectstart dragstart mousedown",function(){return!1}).css({MozUserSelect:e,msUserSelect:e,webkitUserSelect:e,userSelect:e})},a?(r=n.details=function(){return this.each(function(e){var r=t(this),n=t("summary",r).first();r.attr("id")||r.attr("id","details-id-"+e),r.attr("role","group"),n.attr({role:"button","aria-expanded":r.prop("open"),"aria-controls":r.attr("id")}).on("click",function(){var e=r.prop("open");n.attr("aria-expanded",!e),r.triggerHandler((e?"close":"open")+".details")})})},r.support=a):(r=n.details=function(){return this.each(function(e){var r=t(this),n=t("summary",r).first(),a=r.children(":not(summary)"),s=r.contents(":not(summary)");r.attr("id")||r.attr("id","details-id-"+e),r.attr("role","group"),n.length||(n=t("<summary>").text("Details").prependTo(r)),a.length!=s.length&&(s.filter(function(){return 3==this.nodeType&&/[^ \t\n\f\r]/.test(this.data)}).wrap("<span>"),a=r.children(":not(summary)")),r.prop("open","string"==typeof r.attr("open")),i(r,n,a),n.attr({role:"button","aria-controls":r.attr("id")}).noSelect().prop("tabIndex",0).on("click",function(){n.focus(),i(r,n,a,!0)}).keyup(function(e){(32==e.keyCode||13==e.keyCode&&!o)&&(e.preventDefault(),n.click())})})},r.support=a)}(document,jQuery);
;
'use strict';

System.register('sijad/details/main', ['flarum/extend', 'flarum/components/Post', 'flarum/components/Page'], function (_export, _context) {
  var extend, Post, Page;
  return {
    setters: [function (_flarumExtend) {
      /* global $ */
      /* global app */
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsPost) {
      Post = _flarumComponentsPost.default;
    }, function (_flarumComponentsPage) {
      Page = _flarumComponentsPage.default;
    }],
    execute: function () {

      app.initializers.add('sijad-details', function (app) {
        extend(Post.prototype, 'config', function (original, isInitialized) {
          if (isInitialized) return;
          this.$('details').details();
        });
        extend(Page.prototype, 'config', function (original, isInitialized) {
          if (isInitialized) return;
          if (!$.fn.details.support) $('#app').addClass('no-details');
        });
      });
    }
  };
});
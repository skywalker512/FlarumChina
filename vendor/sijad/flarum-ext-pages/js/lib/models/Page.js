import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';
import computed from 'flarum/utils/computed';
import { getPlainContent } from 'flarum/utils/string';

export default class Page extends mixin(Model, {
  title: Model.attribute('title'),
  time: Model.attribute('time', Model.transformDate),
  editTime: Model.attribute('editTime', Model.transformDate),
  content: Model.attribute('content'),
  contentHtml: Model.attribute('contentHtml'),
  contentPlain: computed('contentHtml', getPlainContent),
  slug: Model.attribute('slug'),
  isHidden: Model.attribute('isHidden'),
  isHtml: Model.attribute('isHtml')
}) {}

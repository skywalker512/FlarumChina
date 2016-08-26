import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';
import computed from 'flarum/utils/computed';

export default class Link extends mixin(Model, {
  title: Model.attribute('title'),
  type: Model.attribute('type'),
  url: Model.attribute('url'),
  position: Model.attribute('position'),
  isInternal: Model.attribute('isInternal'),
  isNewtab: Model.attribute('isNewtab')
}) {}

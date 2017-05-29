import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Rank extends mixin(Model, {
  points: Model.attribute('points'),
  name: Model.attribute('name'),
  color: Model.attribute('color')
}) {}
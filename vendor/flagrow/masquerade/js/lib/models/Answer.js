import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Answer extends mixin(Model, {
    content: Model.attribute('content'),
    field: Model.hasOne('field'),
    userId: Model.attribute('user_id')
}) {
    /**
     * Construct a path to the API endpoint for this resource.
     *
     * @return {String}
     * @protected
     */
    apiEndpoint() {
        return '/masquerade/configure' + (this.exists ? '/' + this.data.id : '');
    }
}

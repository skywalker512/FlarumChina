import app from 'flarum/app';
import { extend } from 'flarum/extend';
import Badge from 'flarum/components/Badge';
import Discussion from 'flarum/models/Discussion';

export default function() {
    extend(Discussion.prototype, 'badges', function (items) {
        if (this.bestAnswerPost() && !items.has('hidden')) {
            items.add('bestAnswer', m(Badge, {
                type: 'bestAnswer',
                icon: 'check',
                label: app.translator.trans('flarum-best-answer.forum.best_answer')
            }));
        }
    });
}
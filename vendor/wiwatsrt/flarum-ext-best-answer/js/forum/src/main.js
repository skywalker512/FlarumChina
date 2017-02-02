import app from 'flarum/app';
import { extend } from 'flarum/extend';
import Discussion from 'flarum/models/Discussion';
import Model from 'flarum/Model';
import addBestAnswerAction from 'wiwatSrt/bestAnswer/addBestAnswerAction';
import addBestAnswerAttribute from 'wiwatSrt/bestAnswer/addBestAnswerAttribute';
import addBestAnswerBadge from 'wiwatSrt/bestAnswer/addBestAnswerBadge';
import addBestAnswerFirstPost from 'wiwatSrt/bestAnswer/addBestAnswerFirstPost';

app.initializers.add('wiwatSrt-bestAnswer', function() {
    Discussion.prototype.bestAnswerPost = Model.hasOne('bestAnswerPost');
    Discussion.prototype.canSelectBestAnswer = Model.attribute('canSelectBestAnswer');

    addBestAnswerAction();
    addBestAnswerAttribute();
    addBestAnswerBadge();
    addBestAnswerFirstPost();
});
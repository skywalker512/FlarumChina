import app from 'flarum/app';
import {extend} from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';

import addSettingsPage from 'Reflar/gamification/addSettingsPage';
import Rank from 'Reflar/gamification/models/Rank';

app.initializers.add('reflar-gamification', app => {

    app.store.models.ranks = Rank;

    extend(PermissionGrid.prototype, 'replyItems', items => {
        items.add('Vote', {
            icon: 'thumbs-up',
            label: app.translator.trans('reflar-gamification.admin.permissions.vote_label'),
            permission: 'discussion.vote'
        });
    });

    extend(PermissionGrid.prototype, 'viewItems', items => {
        items.add('canSeeVotes', {
            icon: 'info-circle',
            label: app.translator.trans('reflar-gamification.admin.permissions.see_votes_label'),
            permission: 'discussion.canSeeVotes'
        });
    });

    addSettingsPage();

});

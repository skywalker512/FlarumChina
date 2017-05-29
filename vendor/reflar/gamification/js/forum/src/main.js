import {extend} from "flarum/extend";
import app from "flarum/app";
import IndexPage from "flarum/components/IndexPage";
import LinkButton from "flarum/components/LinkButton";
import NotificationGrid from "flarum/components/NotificationGrid";
import AddAttributes from "Reflar/gamification/components/AddAttributes";
import AddHotnessFilter from "Reflar/gamification/components/AddHotnessSort";
import AddVoteButtons from "Reflar/gamification/components/AddVoteButtons";
import Rank from "Reflar/gamification/models/Rank";
import DownvotedNotification from "Reflar/gamification/components/DownvotedNotification";
import UpvotedNotification from "Reflar/gamification/components/UpvotedNotification";
import RankingsPage from "Reflar/gamification/components/RankingsPage";

app.initializers.add('Reflar-gamification', app => {
    app.store.models.ranks = Rank;

    app.notificationComponents.downvoted = DownvotedNotification;
    app.notificationComponents.upvoted = UpvotedNotification;

    app.routes.rankings = {path: '/rankings', component: RankingsPage.component()};

    AddVoteButtons();
    AddHotnessFilter();
    AddAttributes();

    extend(IndexPage.prototype, 'navItems', function (items) {
        items.add('rankings',
            LinkButton.component({
                href: app.route('rankings', {}),
                children: app.translator.trans('reflar-gamification.forum.nav.name'),
                icon: 'trophy'
            }),
            80
        )
    });

    extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
        items.add('upvoted', {
            name: 'upvoted',
            icon: 'thumbs-up',
            label: app.translator.trans('reflar-gamification.forum.notification.grid.upvoted')
        });

        items.add('downvoted', {
            name: 'downvoted',
            icon: 'thumbs-down',
            label: app.translator.trans('reflar-gamification.forum.notification.grid.downvoted')
        });
    });
});

import avatar from "flarum/helpers/avatar";
import AvatarEditor from "flarum/components/AvatarEditor";
import username from "flarum/helpers/username";
import Discussion from "flarum/models/Discussion";
import Dropdown from "flarum/components/Dropdown";
import {extend} from "flarum/extend";
import Model from "flarum/Model";
import Post from "flarum/models/Post";
import PostUser from "flarum/components/PostUser";
import User from "flarum/models/User";
import UserCard from "flarum/components/UserCard";
import UserControls from "flarum/utils/UserControls";
import userOnline from "flarum/helpers/userOnline";
import listItems from "flarum/helpers/listItems";
import rankLabel from "Reflar/gamification/helpers/rankLabel";

export default function () {
    Discussion.prototype.canVote = Model.attribute('canVote');
    Discussion.prototype.canSeeVotes = Model.attribute('canSeeVotes');
    Discussion.prototype.votes = Model.attribute('votes');

    User.prototype.points = Model.attribute('points');
    User.prototype.ranks = Model.hasMany('ranks');

    Post.prototype.upvotes = Model.hasMany('upvotes');
    Post.prototype.downvotes = Model.hasMany('downvotes');

    extend(UserCard.prototype, 'infoItems', function (items, user) {
        let points = '';

        if (points == 0) {
            points = '0';
        }

        if (app.forum.attribute('PointsPlaceholder')) {
            points = app.forum.attribute('PointsPlaceholder').replace('{points}', this.props.user.data.attributes.Points);
        } else {
            points = app.translator.trans('reflar-gamification.forum.user.points', {points: this.props.user.data.attributes.Points});
        }

        items.add('points',
            points
        );
    });

    UserCard.prototype.view = function () {
        const user = this.props.user;
        const controls = UserControls.controls(user, this).toArray();
        const color = user.color();
        const badges = user.badges().toArray();

        return (
            <div className={'UserCard ' + (this.props.className || '')}
                 style={color ? {backgroundColor: color} : ''}>
                <div className="darkenBackground">

                    <div className="container">
                        {controls.length ? Dropdown.component({
                                children: controls,
                                className: 'UserCard-controls App-primaryControl',
                                menuClassName: 'Dropdown-menu--right',
                                buttonClassName: this.props.controlsButtonClassName,
                                label: app.translator.trans('core.forum.user_controls.button'),
                                icon: 'ellipsis-v'
                            }) : ''}

                        <div className="UserCard-profile">
                            <h2 className="UserCard-identity">
                                {this.props.editable
                                    ? [AvatarEditor.component({user, className: 'UserCard-avatar'}), username(user)]
                                    : (
                                        <a href={app.route.user(user)} config={m.route}>
                                            <div className="UserCard-avatar">{avatar(user)}</div>
                                            {username(user)}
                                        </a>
                                    )}
                            </h2>

                            {badges.length ? (
                                    <ul className="UserCard-badges badges">
                                        {listItems(badges)}
                                        {user.ranks() !== false ? (
                                                user.ranks().map((rank, i) => {
                                                    if (i >= app.forum.attribute('ranksAmt') && app.forum.attribute('ranksAmt') !== null) {

                                                    } else {
                                                        return (
                                                            <li className="User-Rank">
                                                                {rankLabel(rank)}
                                                            </li>
                                                        );
                                                    }
                                                })
                                            ) : '' }
                                    </ul>
                                ) : ''}

                            <ul className="UserCard-info">
                                {listItems(this.infoItems().toArray())}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    PostUser.prototype.view = function () {
        const post = this.props.post;
        const user = post.user();

        if (!user) {
            return (
                <div className="PostUser">
                    <h3>{avatar(user, {className: 'PostUser-avatar'})} {username(user)} {rank[0]}</h3>
                </div>
            );
        }

        let card = '';

        if (!post.isHidden() && this.cardVisible) {
            card = UserCard.component({
                user,
                className: 'UserCard--popover',
                controlsButtonClassName: 'Button Button--icon Button--flat'
            });
        }

        return (
            <div className="PostUser">
                {userOnline(user)}
                <h3>
                    <a href={app.route.user(user)} config={m.route}>
                        {avatar(user, {className: 'PostUser-avatar'})}{' '}{username(user)}
                    </a>
                    {user.ranks().map((rank, i) => {
                        if (i >= app.forum.attribute('ranksAmt') && app.forum.attribute('ranksAmt') !== null) {

                        } else {
                            return (<span className="Post-Rank">
                              {rankLabel(rank)}
                            </span>);
                        }
                    })}
                </h3>
                <ul className="PostUser-badges badges">
                    {listItems(user.badges().toArray())}
                </ul>
                {card}
            </div>
        );
    }
}
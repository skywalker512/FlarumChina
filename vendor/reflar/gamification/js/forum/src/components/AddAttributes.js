import avatar from "flarum/helpers/avatar";
import username from "flarum/helpers/username";
import Discussion from "flarum/models/Discussion";
import {extend} from "flarum/extend";
import Model from "flarum/Model";
import Post from "flarum/models/Post";
import PostUser from "flarum/components/PostUser";
import User from "flarum/models/User";
import UserCard from "flarum/components/UserCard";
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
      
      if (this.props.user.ranks() !== false) {

        this.props.user.ranks().map((rank) => {
          items.add(rank.name(), (
            rankLabel(rank)
          ));
        });
      }
    });

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
                    {user.ranks().map(rank => {
                        return (<span className="Post-Rank">
                          {rankLabel(rank)}
                        </span>);
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
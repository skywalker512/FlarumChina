import {extend} from 'flarum/extend'
import app from 'flarum/app'
import Button from 'flarum/components/Button'
import LogInModal from 'flarum/components/LogInModal'
import CommentPost from 'flarum/components/CommentPost'

import VotesModal from 'Reflar/gamification/components/VotesModal'

export default function () {
  extend(CommentPost.prototype, 'actionItems', function (items) {
    const post = this.props.post

    let isUpvoted = app.session.user && post.upvotes().some(user => user === app.session.user)
    let isDownvoted = app.session.user && post.downvotes().some(user => user === app.session.user)

    let color = ''

    if (post.isHidden()) return

    if (app.forum.attribute('autoUpvote') !== null && app.forum.attribute('autoUpvote') !== '') {
      color = app.forum.attribute('VoteColor')
    } else {
      color = '#f44336'
    }

    if (!app.session.user) {
      isDownvoted = false
      isUpvoted = false
    }

    let icon = app.forum.attribute('IconName')

    if (icon === null || icon === '') {
      icon = 'thumbs'
    }

    items.add('upvote',
      Button.component({
        icon: icon + '-up',
        className: 'Post-vote Post-upvote',
        style: isUpvoted !== false ? 'color:' + color : 'color:',
        disabled: !post.discussion().canVote(),
        onclick: () => {
          if (!app.session.user) {
            app.modal.show(new LogInModal())
            return
          }
          if (!post.discussion().canVote()) return
          var upData = post.data.relationships.upvotes.data
          var downData = post.data.relationships.downvotes.data

          isUpvoted = !isUpvoted

          isDownvoted = false

          post.save({isUpvoted, isDownvoted})

          upData.some((upvote, i) => {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1)
              return true
            }
          })

          downData.some((downvote, i) => {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1)
              return true
            }
          })

          if (isUpvoted) {
            upData.unshift({type: 'users', id: app.session.user.id()})
          }
        }
      })
    )

    items.add('points',
      <button disabled={!post.discussion().canSeeVotes()} className='Post-points' onclick={() => {
        if (!post.discussion().canSeeVotes()) return
        app.modal.show(new VotesModal({post}))
      }}>
        {post.data.relationships.upvotes.data.length - post.data.relationships.downvotes.data.length}
      </button>
      )

    items.add('downvote',
      Button.component({
        icon: icon + '-down',
        className: 'Post-vote Post-downvote',
        style: isDownvoted !== false ? 'color:' + color : '',
        disabled: !post.discussion().canVote(),
        onclick: () => {
          if (!app.session.user) {
            app.modal.show(new LogInModal())
            return
          }
          if (!post.discussion().canVote()) return
          var upData = post.data.relationships.upvotes.data
          var downData = post.data.relationships.downvotes.data

          isDownvoted = !isDownvoted

          isUpvoted = false

          post.save({isUpvoted, isDownvoted})

          upData.some((upvote, i) => {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1)
              return true
            }
          })

          downData.some((downvote, i) => {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1)
              return true
            }
          })

          if (isDownvoted) {
            downData.unshift({type: 'users', id: app.session.user.id()})
          }
        }
      })
    )
  })
}

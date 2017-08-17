import Alert from 'flarum/components/Alert'
import Component from 'flarum/Component'
import ItemList from 'flarum/utils/ItemList'
import listItems from 'flarum/helpers/listItems'
import LogInModal from 'flarum/components/LogInModal'
import emoji from 'reflar/reactions/util/emoji'

export default class PostReactAction extends Component {
  config (isInitialized) {
    if (isInitialized) return

    var didTap = false

    if ('ontouchstart' in window) {
      $('.Reactions').unbind().on('touchend', function () {
        $(this).find('.CommentPost--Reactions').toggleClass('mobile-show')
      })
      $(document).click(function (e) {
        var target = e.target
        if (!$(target).is('.Reactions') && !$(target).parents().is('.Reactions')) {
          $('.CommentPost--Reactions').removeClass('mobile-show')
        }
      })
    }
  }

  getReactions () {
    const items = new ItemList()

    app.forum.attribute('reactions').forEach(reaction => {
      let buttonLabel

      if (reaction.type === 'emoji') {
        const url = this.names[reaction.identifier]
        buttonLabel = (
          <span className='Button-label'>
            <img
              alt={reaction.identifier}
              className={reaction.type}
              draggable='false'
              src={url}
              data-reaction={reaction.identifier}
                        />
          </span>
                )
      } else if (reaction.type === 'icon') {
        const spanClass = `fa fa-${reaction.identifier} reaction-icon`
        buttonLabel = (
          <span className='Button-label'>
            <i
              className={spanClass}
              data-reaction={reaction.identifier}
              aria-hidden
                     />
          </span>
              )
      }

      items.add(reaction.identifier, (
        <button
          className='Button Button--link'
          type='button'
          title={reaction.identifier}
          onclick={el => this.react(el)}
          data-reaction={reaction.identifier}
            >
          {buttonLabel}
        </button>
          ))
    })

    return items
  }

  init () {
    this.post = this.props.post

    this.reaction = app.session.user && this.post.reactions().filter(reaction => reaction.user_id() == app.session.user.data.id)[0]

    this.reacted = {}
    this.names = {}

    app.forum.attribute('reactions').forEach(reaction => {
      this.names[reaction.identifier] = emoji(reaction.identifier).url
      this.reacted[reaction.identifier] = []
    })

    const reactions = this.post.reactions()

    Object.keys(this.names).forEach(reaction => {
      this.reacted[reaction] = reactions.filter(e => e.identifier() === reaction)
    })
  }

  view () {
    return (
      <div className='Reactions'>
        {this.reactButton()}
        {Object.keys(this.reacted).map(identifier => {
          const count = this.reacted[identifier].length
          const reaction = app.forum.attribute('reactions').filter(e => e.identifier === identifier)[0]

          if (count === 0) return
          const spanClass = reaction.type === 'icon' && `fa fa-${reaction.identifier} emoji button-emoji reaction-icon`
          const icon = reaction.type === 'emoji' ? (
            <img
              alt={reaction.identifier}
              className='emoji button-emoji'
              draggable='false'
              src={emoji(reaction.identifier).url}
              data-reaction={identifier}
                />
              ) : (
                <i
                  className={spanClass}
                  data-reaction={identifier}
                  aria-hidden />
              )
          return [
            <span className='Button-label Button-emoji-parent' onclick={el => this.react(this.reaction ? identifier : el)} data-reaction={identifier}>
              {icon}
              {count > 1 ? count : ''}
            </span>
          ]
        })}
        {!this.reaction ? (
          <div className='CommentPost--Reactions' style={this.post.number() === 1 ? '' : 'left: -28%;'}>
            <ul className='Reactions--Ul'>
              {listItems(this.getReactions().toArray())}
            </ul>
          </div>
            ) : null}
      </div>
    )
  }

  reactButton () {
    return <button
      className='Button Button--link Reactions--ShowReactions'
      type='Button'
      title='React'>
      <span className='Button-label' style={this.reaction ? 'display: none' : 'display:'}>
        <svg class='button-react' width='20px' height='20px' viewBox='0 0 18 18'>
                  /* Generator: Sketch 40.3 (33839) - http://www.bohemiancoding.com/sketch */
                  <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
                    <g id='ic_reactions_grey_16px'>
                      <g id='Group-2'>
                        <g id='0:0:0:0'>
                          <rect id='Rectangle-5' x='0' y='0' width='18' height='18' />
                          <g id='emoticon' />
                          <path d='M14.6332705,7.33333333 C14.6554304,7.55389388 14.6666667,7.77636769 14.6666667,8 C14.6666667,11.6818983 11.6818983,14.6666667 8,14.6666667 C6.23189007,14.6666667 4.53619732,13.9642877 3.28595479,12.7140452 C2.03571227,11.4638027 1.33333333,9.76810993 1.33333333,8 C1.33333333,4.33333333 4.31333333,1.33333333 8,1.33333333 L8,1.33333333 C8.22363231,1.33333333 8.44610612,1.3445696 8.66666667,1.36672949 L8.66666667,2.70847693 C8.44668912,2.68076722 8.22407146,2.66666667 8,2.66666667 C5.05448133,2.66666667 2.66666667,5.05448133 2.66666667,8 C2.66666667,10.9455187 5.05448133,13.3333333 8,13.3333333 C10.9455187,13.3333333 13.3333333,10.9455187 13.3333333,8 C13.3333333,7.77592854 13.3192328,7.55331088 13.2915231,7.33333333 L14.6332705,7.33333333 Z M8,11.6666667 C9.55333333,11.6666667 10.8666667,10.6933333 11.4066667,9.33333333 L4.59333333,9.33333333 C5.12666667,10.6933333 6.44666667,11.6666667 8,11.6666667 Z M10.3333333,7.33333333 C10.8856181,7.33333333 11.3333333,6.88561808 11.3333333,6.33333333 C11.3333333,5.78104858 10.8856181,5.33333333 10.3333333,5.33333333 C9.78104858,5.33333333 9.33333333,5.78104858 9.33333333,6.33333333 C9.33333333,6.88561808 9.78104858,7.33333333 10.3333333,7.33333333 L10.3333333,7.33333333 Z M5.66666667,7.33333333 C6.21895142,7.33333333 6.66666667,6.88561808 6.66666667,6.33333333 C6.66666667,5.78104858 6.21895142,5.33333333 5.66666667,5.33333333 C5.11438192,5.33333333 4.66666667,5.78104858 4.66666667,6.33333333 C4.66666667,6.88561808 5.11438192,7.33333333 5.66666667,7.33333333 Z' id='Combined-Shape' fill='#667c99' />
                        </g>
                        <g id='Group-15' transform='translate(10.666667, 0.000000)' fill='#667c99'>
                          <polygon id='Path' points='3.33333333 2 3.33333333 0 2 0 2 2 0 2 0 3.33333333 2 3.33333333 2 5.33333333 3.33333333 5.33333333 3.33333333 3.33333333 5.33333333 3.33333333 5.33333333 2' />
                        </g>
                      </g>
                    </g>
                  </g>
        </svg>
      </span>
    </button>
  }

  react (el) {
    if (!app.session.user) {
      app.modal.show(new LogInModal())
      return
    }

    if (!this.post.canReact()) {
      app.alerts.show(this.successAlert = new Alert({
        type: 'error',
        children: app.translator.trans('core.lib.error.permission_denied_message')
      }))
    }

    let isReacted = true

    if (typeof el === 'string') {
      isReacted = false
    }

    let reaction = el && el.srcElement && el.srcElement.attributes['data-reaction'] ? el.srcElement.attributes['data-reaction'].value : ''

    if (reaction === '') {
      reaction = el
    }

    this.post.save({reaction})
          .then(() => {
            const identifier = this.reaction && this.reaction.identifier()
            this.reaction = this.post.reactions().filter(r => r.user_id() == app.session.user.data.id)[0]

            /**
             * We've saved the fact that we have or haven't reacted to the post,
             * but in order to provide instantaneous feedback to the user, we'll
             * need to add or remove the reaction from the current ones manually
             */

            if ((app.forum.data.relationships.ranks !== undefined && (app.forum.attribute('ReactionConverts')[0] === reaction || app.forum.attribute('ReactionConverts')[1] === reaction)) || (this.post.data.relationships.likes !== undefined && app.forum.attribute('ReactionConverts')[2] === reaction)) {
              app.alerts.show(this.successAlert = new Alert({
                type: 'warning',
                children: app.translator.trans('reflar-reactions.forum.warning', {reaction})
              }))
            } else {
              if (isReacted) {
                this.reacted[reaction].push(this.reaction)
              } else {
                this.reacted[identifier] = this.reacted[identifier].filter(r => r.user_id() != app.session.user.id())
              }
            }

            m.redraw()
          })
          .catch(err => $('body').append(err))
  }
}

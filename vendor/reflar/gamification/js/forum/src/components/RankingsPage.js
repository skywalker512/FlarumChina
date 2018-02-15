import {extend} from 'flarum/extend'
import avatar from 'flarum/helpers/avatar'
import Page from 'flarum/components/Page'
import IndexPage from 'flarum/components/IndexPage'
import Button from 'flarum/components/Button'
import ItemList from 'flarum/utils/ItemList'
import LogInModal from 'flarum/components/LogInModal'
import LoadingIndicator from 'flarum/components/LoadingIndicator'
import listItems from 'flarum/helpers/listItems'
import icon from 'flarum/helpers/icon'
import username from 'flarum/helpers/username'

export default class RankingsPage extends Page {
  init () {
    super.init()

    if (!app.session.user || app.session.user.data.attributes.canViewRankingPage !== true) {
      m.route('/')
    }

    this.loading = true
    this.users = []
    this.refresh()
  }

  view () {
    let loading

    if (this.loading) {
      loading = LoadingIndicator.component()
    } else {
      loading = Button.component({
        children: app.translator.trans('core.forum.discussion_list.load_more_button'),
        className: 'Button',
        onclick: this.loadMore.bind(this)
      })
    }
    return (
      <div className='IndexPage'>
        {IndexPage.prototype.hero()}
        <div className='container'>
          <div className='IndexPage-results'>
            <div className='RankingPage'>
              <div className='container'>
                <nav className='IndexPage-nav sideNav'>
                  <ul>{listItems(IndexPage.prototype.sidebarItems().toArray())}</ul>
                </nav>
                <div className='sideNavOffset'>
                  <table class='rankings'>
                    <tr>
                      <th className='rankings-mobile'>{app.translator.trans('reflar-gamification.forum.ranking.rank')}</th>
                      <th>{app.translator.trans('reflar-gamification.forum.ranking.name')}</th>
                      <th>{app.translator.trans('reflar-gamification.forum.ranking.amount')}</th>
                    </tr>
                    {this.users.map((user, i) => {
                      ++i
                      return [
                        <tr className={'ranking-' + i}>
                          {i < 4 ? (app.forum.attribute('CustomRankingImages') == '1' ? (
                            <img className='rankings-mobile rankings-image'
                              src={app.forum.attribute('baseUrl') + '/assets/' + app.forum.attribute('TopImage' + i)} />)
                                                        : (
                                                          <td className={'rankings-mobile rankings-' + i}> {icon('trophy')}</td>))
                                                        : (
                                                          <td className='rankings-4 rankings-mobile'>{this.addOrdinalSuffix(i)}</td>)}
                          <td>
                            <div className='PostUser'>
                              <h3 className='rankings-info'>
                                <a href={app.route.user(user)} config={m.route}>
                                  {i < 4 ? (avatar(user, {className: 'info-avatar rankings-' + i + '-avatar'})) : ''} {username(user)}
                                </a>
                              </h3>
                            </div>
                          </td>
                          {i < 4 ? (
                            <td className={'rankings-' + i}>{user.data.attributes.Points}</td>)
                                                        : (
                                                          <td className='rankings-4'>{user.data.attributes.Points}</td>)}
                        </tr>
                      ]
                    })}
                  </table>
                  <div className='rankings-loadmore'> {loading}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  refresh (clear = true) {
    if (clear) {
      this.loading = true
      this.users = []
    }

    return this.loadResults().then(
            results => {
              this.users = []
              this.parseResults(results)
            },
            () => {
              this.loading = false
              m.redraw()
            }
        )
  }

  addOrdinalSuffix (i) {
    if (app.forum.attribute('DefaultLocale') == 'en') {
      var j = i % 10,
        k = i % 100
      if (j == 1 && k != 11) {
        return i + 'st'
      }
      if (j == 2 && k != 12) {
        return i + 'nd'
      }
      if (j == 3 && k != 13) {
        return i + 'rd'
      }
      return i + 'th'
    } else {
      return i
    }
  }

  stickyParams () {
    return {
      sort: m.route.param('sort'),
      q: m.route.param('q')
    }
  }

  actionItems () {
    const items = new ItemList()

    items.add('refresh',
            Button.component({
              title: app.translator.trans('core.forum.index.refresh_tooltip'),
              icon: 'refresh',
              className: 'Button Button--icon',
              onclick: () => {
                app.cache.discussionList.refresh()
                if (app.session.user) {
                  app.store.find('users', app.session.user.id())
                  m.redraw()
                }
              }
            })
        )

    return items
  }

  newDiscussion () {
    const deferred = m.deferred()

    if (app.session.user) {
      this.composeNewDiscussion(deferred)
    } else {
      app.modal.show(
                new LogInModal({
                  onlogin: this.composeNewDiscussion.bind(this, deferred)
                })
            )
    }

    return deferred.promise
  }

  composeNewDiscussion (deferred) {
    const component = new DiscussionComposer({user: app.session.user})

    app.composer.load(component)
    app.composer.show()

    deferred.resolve(component)

    return deferred.promise
  }

  loadResults (offset) {
    const params = {}
    params.page = {
      offset: offset,
      limit: '10'
    }

    return app.store.find('rankings', params)
  }

  loadMore () {
    this.loading = true

    this.loadResults(this.users.length)
            .then(this.parseResults.bind(this))
  }

  parseResults (results) {
    [].push.apply(this.users, results)

    this.loading = false

    this.users.sort(function (a, b) {
      return parseFloat(b.data.attributes.Points) - parseFloat(a.data.attributes.Points)
    })

    m.lazyRedraw()

    return results
  }
}

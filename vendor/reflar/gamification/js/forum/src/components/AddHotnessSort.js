import {extend} from 'flarum/extend'
import IndexPage from 'flarum/components/IndexPage'
import ItemList from 'flarum/utils/ItemList'
import DiscussionList from 'flarum/components/DiscussionList'
import Dropdown from 'flarum/components/Dropdown'
import Button from 'flarum/components/Button'
import LinkButton from 'flarum/components/LinkButton'

export default function () {
  IndexPage.prototype.viewItems = function () {
    const items = new ItemList()
    const sortMap = app.cache.discussionList.sortMap()

    const sortOptions = {}
    for (const i in sortMap) {
      sortOptions[i] = app.translator.trans('core.forum.index_sort.' + i + '_button')
    }

    let dropDownLabel = sortOptions[this.params().sort] || Object.keys(sortMap).map(key => sortOptions[key])[0]

    if (/^.*?\/hot/.test(m.route())) {
      dropDownLabel = app.translator.trans('core.forum.index_sort.hot_button')
    }

    items.add('sort',
            Dropdown.component({
              buttonClassName: 'Button',
              label: dropDownLabel,
              children: Object.keys(sortOptions).map(value => {
                const label = sortOptions[value]
                let active = (this.params().sort || Object.keys(sortMap)[0]) === value

                if (/^.*?\/hot/.test(m.route()) && value === 'hot') {
                  active = true
                }

                if (/^.*?\/hot/.test(m.route()) && value === 'latest') {
                  active = false
                  m.redraw()
                }

                return Button.component({
                  children: label,
                  icon: active ? 'check' : true,
                  onclick: this.changeSort.bind(this, value),
                  active: active
                })
              })
            })
        )

    return items
  }

  IndexPage.prototype.navItems = function () {
    const items = new ItemList()
    const params = this.stickyParams()

    items.add('allDiscussions',
            LinkButton.component({
              href: app.route('index', params),
              active: (m.route() === '/' || /^.*?\/(\?sort=.*|hot)/.test(m.route())),
              children: app.translator.trans('core.forum.index.all_discussions_link'),
              icon: 'comments-o'
            }),
            100
        )

    if (app.session.user === undefined || app.session.user.data.attributes.canViewRankingPage === false) {
    } else {
      items.add('rankings',
              LinkButton.component({
                href: app.route('rankings', {}),
                children: app.translator.trans('reflar-gamification.forum.nav.name'),
                icon: 'trophy'
              }),
              80
          )
    }

    return items
  }

  IndexPage.prototype.changeSort = function (sort) {
    const params = this.params()

    if (sort === 'hot') {
      m.route(app.route('index'))
      m.route(m.route() + 'hot')
    } else {
      if (sort === Object.keys(app.cache.discussionList.sortMap())[0]) {
        delete params.sort
      } else {
        params.sort = sort
      }
      if (params.filter === 'hot') {
        delete params.filter
      }
      m.route(app.route('index', params))
    }
  }

  extend(DiscussionList.prototype, 'sortMap', function (map) {
    map.hot = 'hot'
  })

  extend(DiscussionList.prototype, 'requestParams', function (params) {
    if (this.props.params.filter === 'hot') {
      params.filter.q = ' is:hot'
    }
  })
}

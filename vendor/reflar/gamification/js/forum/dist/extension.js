'use strict'

System.register('Reflar/gamification/components/AddAttributes', ['flarum/helpers/avatar', 'flarum/components/AvatarEditor', 'flarum/helpers/username', 'flarum/models/Discussion', 'flarum/components/Dropdown', 'flarum/extend', 'flarum/Model', 'flarum/models/Post', 'flarum/components/PostUser', 'flarum/models/User', 'flarum/components/UserCard', 'flarum/utils/UserControls', 'flarum/helpers/userOnline', 'flarum/helpers/listItems', 'Reflar/gamification/helpers/rankLabel'], function (_export, _context) {
  'use strict'

  var avatar, AvatarEditor, username, Discussion, Dropdown, extend, Model, Post, PostUser, User, UserCard, UserControls, userOnline, listItems, rankLabel

  _export('default', function () {
    Discussion.prototype.canVote = Model.attribute('canVote')
    Discussion.prototype.canSeeVotes = Model.attribute('canSeeVotes')
    Discussion.prototype.votes = Model.attribute('votes')

    User.prototype.points = Model.attribute('points')
    User.prototype.ranks = Model.hasMany('ranks')

    Post.prototype.upvotes = Model.hasMany('upvotes')
    Post.prototype.downvotes = Model.hasMany('downvotes')

    extend(UserCard.prototype, 'infoItems', function (items, user) {
      var points = ''

      if (points == 0) {
        points = '0'
      }

      if (app.forum.attribute('PointsPlaceholder')) {
        points = app.forum.attribute('PointsPlaceholder').replace('{points}', this.props.user.data.attributes.Points)
      } else {
        points = app.translator.trans('reflar-gamification.forum.user.points', { points: this.props.user.data.attributes.Points })
      }

      items.add('points', points)
    })

    UserCard.prototype.view = function () {
      var user = this.props.user
      var controls = UserControls.controls(user, this).toArray()
      var color = user.color()
      var badges = user.badges().toArray()

      return m(
                'div',
        { className: 'UserCard ' + (this.props.className || ''),
          style: color ? { backgroundColor: color } : '' },
                m(
                    'div',
                    { className: 'darkenBackground' },
                    m(
                        'div',
                        { className: 'container' },
                        controls.length ? Dropdown.component({
                          children: controls,
                          className: 'UserCard-controls App-primaryControl',
                          menuClassName: 'Dropdown-menu--right',
                          buttonClassName: this.props.controlsButtonClassName,
                          label: app.translator.trans('core.forum.user_controls.button'),
                          icon: 'ellipsis-v'
                        }) : '',
                        m(
                            'div',
                            { className: 'UserCard-profile' },
                            m(
                                'h2',
                                { className: 'UserCard-identity' },
                                this.props.editable ? [AvatarEditor.component({ user: user, className: 'UserCard-avatar' }), username(user)] : m(
                                    'a',
                                    { href: app.route.user(user), config: m.route },
                                    m(
                                        'div',
                                        { className: 'UserCard-avatar' },
                                        avatar(user)
                                    ),
                                    username(user)
                                )
                            ),
                            badges.length ? m(
                                'ul',
                                { className: 'UserCard-badges badges' },
                                listItems(badges),
                                user.ranks() !== false ? user.ranks().map(function (rank, i) {
                                  if (i >= app.forum.attribute('ranksAmt') && app.forum.attribute('ranksAmt') !== null) {} else {
                                    return m(
                                            'li',
                                            { className: 'User-Rank' },
                                            rankLabel(rank)
                                        )
                                  }
                                }) : ''
                            ) : '',
                            m(
                                'ul',
                                { className: 'UserCard-info' },
                                listItems(this.infoItems().toArray())
                            )
                        )
                    )
                )
            )
    }

    PostUser.prototype.view = function () {
      var post = this.props.post
      var user = post.user()

      if (!user) {
        return m(
                    'div',
                    { className: 'PostUser' },
                    m(
                        'h3',
                        null,
                        avatar(user, { className: 'PostUser-avatar' }),
                        ' ',
                        username(user),
                        ' ',
                        rank[0]
                    )
                )
      }

      var card = ''

      if (!post.isHidden() && this.cardVisible) {
        card = UserCard.component({
          user: user,
          className: 'UserCard--popover',
          controlsButtonClassName: 'Button Button--icon Button--flat'
        })
      }

      return m(
                'div',
                { className: 'PostUser' },
                userOnline(user),
                m(
                    'h3',
                    null,
                    m(
                        'a',
                        { href: app.route.user(user), config: m.route },
                        avatar(user, { className: 'PostUser-avatar' }),
                        ' ',
                        username(user)
                    ),
                    user.ranks().map(function (rank, i) {
                      if (i >= app.forum.attribute('ranksAmt') && app.forum.attribute('ranksAmt') !== null) {} else {
                        return m(
                                'span',
                                { className: 'Post-Rank' },
                                rankLabel(rank)
                            )
                      }
                    })
                ),
                m(
                    'ul',
                    { className: 'PostUser-badges badges' },
                    listItems(user.badges().toArray())
                ),
                card
            )
    }
  })

  return {
    setters: [function (_flarumHelpersAvatar) {
      avatar = _flarumHelpersAvatar.default
    }, function (_flarumComponentsAvatarEditor) {
      AvatarEditor = _flarumComponentsAvatarEditor.default
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername.default
    }, function (_flarumModelsDiscussion) {
      Discussion = _flarumModelsDiscussion.default
    }, function (_flarumComponentsDropdown) {
      Dropdown = _flarumComponentsDropdown.default
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend
    }, function (_flarumModel) {
      Model = _flarumModel.default
    }, function (_flarumModelsPost) {
        Post = _flarumModelsPost.default
      }, function (_flarumComponentsPostUser) {
        PostUser = _flarumComponentsPostUser.default
      }, function (_flarumModelsUser) {
          User = _flarumModelsUser.default
        }, function (_flarumComponentsUserCard) {
          UserCard = _flarumComponentsUserCard.default
        }, function (_flarumUtilsUserControls) {
          UserControls = _flarumUtilsUserControls.default
        }, function (_flarumHelpersUserOnline) {
          userOnline = _flarumHelpersUserOnline.default
        }, function (_flarumHelpersListItems) {
          listItems = _flarumHelpersListItems.default
        }, function (_ReflarGamificationHelpersRankLabel) {
          rankLabel = _ReflarGamificationHelpersRankLabel.default
        }],
    execute: function () {}
  }
})
'use strict'

System.register('Reflar/gamification/components/AddHotnessSort', ['flarum/extend', 'flarum/components/IndexPage', 'flarum/utils/ItemList', 'flarum/components/DiscussionList', 'flarum/components/Dropdown', 'flarum/components/Button', 'flarum/components/LinkButton'], function (_export, _context) {
  'use strict'

  var extend, IndexPage, ItemList, DiscussionList, Dropdown, Button, LinkButton

  _export('default', function () {
    IndexPage.prototype.viewItems = function () {
      var _this = this

      var items = new ItemList()
      var sortMap = app.cache.discussionList.sortMap()

      var sortOptions = {}
      for (var i in sortMap) {
        sortOptions[i] = app.translator.trans('core.forum.index_sort.' + i + '_button')
      }

      var dropDownLabel = sortOptions[this.params().sort] || Object.keys(sortMap).map(function (key) {
        return sortOptions[key]
      })[0]

      if (/^.*?\/hot/.test(m.route())) {
        dropDownLabel = app.translator.trans('core.forum.index_sort.hot_button')
      }

      items.add('sort', Dropdown.component({
        buttonClassName: 'Button',
        label: dropDownLabel,
        children: Object.keys(sortOptions).map(function (value) {
          var label = sortOptions[value]
          var active = (_this.params().sort || Object.keys(sortMap)[0]) === value

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
            onclick: _this.changeSort.bind(_this, value),
            active: active
          })
        })
      }))

      return items
    }

    IndexPage.prototype.navItems = function () {
      var items = new ItemList()
      var params = this.stickyParams()

      items.add('allDiscussions', LinkButton.component({
        href: app.route('index', params),
        active: m.route() === '/' || /^.*?\/(\?sort=.*|hot)/.test(m.route()),
        children: app.translator.trans('core.forum.index.all_discussions_link'),
        icon: 'comments-o'
      }), 100)

      if (app.session.user === undefined || app.session.user.data.attributes.canViewRankingPage === false) {} else {
        items.add('rankings', LinkButton.component({
          href: app.route('rankings', {}),
          children: app.translator.trans('reflar-gamification.forum.nav.name'),
          icon: 'trophy'
        }), 80)
      }

      return items
    }

    IndexPage.prototype.changeSort = function (sort) {
      var params = this.params()

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
  })

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend
    }, function (_flarumComponentsIndexPage) {
      IndexPage = _flarumComponentsIndexPage.default
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default
    }, function (_flarumComponentsDiscussionList) {
      DiscussionList = _flarumComponentsDiscussionList.default
    }, function (_flarumComponentsDropdown) {
      Dropdown = _flarumComponentsDropdown.default
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default
    }, function (_flarumComponentsLinkButton) {
      LinkButton = _flarumComponentsLinkButton.default
    }],
    execute: function () {}
  }
})
'use strict'

System.register('Reflar/gamification/components/AddVoteButtons', ['flarum/extend', 'flarum/app', 'flarum/components/Button', 'flarum/components/LogInModal', 'flarum/components/CommentPost', 'Reflar/gamification/components/VotesModal'], function (_export, _context) {
  'use strict'

  var extend, app, Button, LogInModal, CommentPost, VotesModal

  _export('default', function () {
    extend(CommentPost.prototype, 'actionItems', function (items) {
      var post = this.props.post

      var isUpvoted = app.session.user && post.upvotes().some(function (user) {
        return user === app.session.user
      })
      var isDownvoted = app.session.user && post.downvotes().some(function (user) {
        return user === app.session.user
      })

      var color = ''

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

      var icon = app.forum.attribute('IconName')

      if (icon === null || icon === '') {
        icon = 'thumbs'
      }

      items.add('upvote', Button.component({
        icon: icon + '-up',
        className: 'Post-vote Post-upvote',
        style: isUpvoted !== false ? 'color:' + color : 'color:',
        disabled: !post.discussion().canVote(),
        onclick: function onclick () {
          if (!app.session.user) {
            app.modal.show(new LogInModal())
            return
          }
          if (!post.discussion().canVote()) return
          var upData = post.data.relationships.upvotes.data
          var downData = post.data.relationships.downvotes.data

          isUpvoted = !isUpvoted

          isDownvoted = false

          post.save({ isUpvoted: isUpvoted, isDownvoted: isDownvoted })

          upData.some(function (upvote, i) {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1)
              return true
            }
          })

          downData.some(function (downvote, i) {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1)
              return true
            }
          })

          if (isUpvoted) {
            upData.unshift({ type: 'users', id: app.session.user.id() })
          }
        }
      }))

      items.add('points', m(
        'button',
        { disabled: !post.discussion().canSeeVotes(),
          className: 'Post-points',
          onclick: function onclick () {
            if (!post.discussion().canSeeVotes()) return
            app.modal.show(new VotesModal({ post: post }))
          } },
        post.data.relationships.upvotes.data.length - post.data.relationships.downvotes.data.length
      ))

      items.add('downvote', Button.component({
        icon: icon + '-down',
        className: 'Post-vote Post-downvote',
        style: isDownvoted !== false ? 'color:' + color : '',
        disabled: !post.discussion().canVote(),
        onclick: function onclick () {
          if (!app.session.user) {
            app.modal.show(new LogInModal())
            return
          }
          if (!post.discussion().canVote()) return
          var upData = post.data.relationships.upvotes.data
          var downData = post.data.relationships.downvotes.data

          isDownvoted = !isDownvoted

          isUpvoted = false

          post.save({ isUpvoted: isUpvoted, isDownvoted: isDownvoted })

          upData.some(function (upvote, i) {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1)
              return true
            }
          })

          downData.some(function (downvote, i) {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1)
              return true
            }
          })

          if (isDownvoted) {
            downData.unshift({ type: 'users', id: app.session.user.id() })
          }
        }
      }))
    })
  })

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend
    }, function (_flarumApp) {
      app = _flarumApp.default
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default
    }, function (_flarumComponentsLogInModal) {
      LogInModal = _flarumComponentsLogInModal.default
    }, function (_flarumComponentsCommentPost) {
      CommentPost = _flarumComponentsCommentPost.default
    }, function (_ReflarGamificationComponentsVotesModal) {
      VotesModal = _ReflarGamificationComponentsVotesModal.default
    }],
    execute: function () {}
  }
})
'use strict'

System.register('Reflar/gamification/components/RankingsPage', ['flarum/extend', 'flarum/helpers/avatar', 'flarum/components/Page', 'flarum/components/IndexPage', 'flarum/components/Button', 'flarum/utils/ItemList', 'flarum/components/LogInModal', 'flarum/components/LoadingIndicator', 'flarum/helpers/listItems', 'flarum/helpers/icon', 'flarum/helpers/username'], function (_export, _context) {
  'use strict'

  var extend, avatar, Page, IndexPage, Button, ItemList, LogInModal, LoadingIndicator, listItems, icon, username, RankingsPage
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend
    }, function (_flarumHelpersAvatar) {
      avatar = _flarumHelpersAvatar.default
    }, function (_flarumComponentsPage) {
      Page = _flarumComponentsPage.default
    }, function (_flarumComponentsIndexPage) {
      IndexPage = _flarumComponentsIndexPage.default
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default
    }, function (_flarumComponentsLogInModal) {
      LogInModal = _flarumComponentsLogInModal.default
    }, function (_flarumComponentsLoadingIndicator) {
      LoadingIndicator = _flarumComponentsLoadingIndicator.default
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems.default
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername.default
    }],
    execute: function () {
      RankingsPage = (function (_Page) {
        babelHelpers.inherits(RankingsPage, _Page)

        function RankingsPage () {
          babelHelpers.classCallCheck(this, RankingsPage)
          return babelHelpers.possibleConstructorReturn(this, (RankingsPage.__proto__ || Object.getPrototypeOf(RankingsPage)).apply(this, arguments))
        }

        babelHelpers.createClass(RankingsPage, [{
          key: 'init',
          value: function init () {
            babelHelpers.get(RankingsPage.prototype.__proto__ || Object.getPrototypeOf(RankingsPage.prototype), 'init', this).call(this)

            if (!app.session.user || app.session.user.data.attributes.canViewRankingPage !== true) {
              m.route('/')
            }

            this.loading = true
            this.users = []
            this.refresh()
          }
        }, {
          key: 'view',
          value: function view () {
            var _this2 = this

            var loading = void 0

            if (this.loading) {
              loading = LoadingIndicator.component()
            } else {
              loading = Button.component({
                children: app.translator.trans('core.forum.discussion_list.load_more_button'),
                className: 'Button',
                onclick: this.loadMore.bind(this)
              })
            }
            return m(
              'div',
              { className: 'IndexPage' },
              IndexPage.prototype.hero(),
              m(
                'div',
                { className: 'container' },
                m(
                  'div',
                  { className: 'IndexPage-results' },
                  m(
                    'div',
                    { className: 'RankingPage' },
                    m(
                      'div',
                      { className: 'container' },
                      m(
                        'nav',
                        { className: 'IndexPage-nav sideNav' },
                        m(
                          'ul',
                          null,
                          listItems(IndexPage.prototype.sidebarItems().toArray())
                        )
                      ),
                      m(
                        'div',
                        { className: 'sideNavOffset' },
                        m(
                          'table',
                          { 'class': 'rankings' },
                          m(
                            'tr',
                            null,
                            m(
                              'th',
                              { className: 'rankings-mobile' },
                              app.translator.trans('reflar-gamification.forum.ranking.rank')
                            ),
                            m(
                              'th',
                              null,
                              app.translator.trans('reflar-gamification.forum.ranking.name')
                            ),
                            m(
                              'th',
                              null,
                              app.translator.trans('reflar-gamification.forum.ranking.amount')
                            )
                          ),
                          this.users.map(function (user, i) {
                            ++i
                            return [m(
                              'tr',
                              { className: 'ranking-' + i },
                              i < 4 ? app.forum.attribute('CustomRankingImages') == '1' ? m('img', { className: 'rankings-mobile rankings-image',
                                src: app.forum.attribute('baseUrl') + '/assets/' + app.forum.attribute('TopImage' + i) }) : m(
                                'td',
                                { className: 'rankings-mobile rankings-' + i },
                                ' ',
                                icon('trophy')
                              ) : m(
                                'td',
                                { className: 'rankings-4 rankings-mobile' },
                                _this2.addOrdinalSuffix(i)
                              ),
                              m(
                                'td',
                                null,
                                m(
                                  'div',
                                  { className: 'PostUser' },
                                  m(
                                    'h3',
                                    { className: 'rankings-info' },
                                    m(
                                      'a',
                                      { href: app.route.user(user), config: m.route },
                                      i < 4 ? avatar(user, { className: 'info-avatar rankings-' + i + '-avatar' }) : '',
                                      ' ',
                                      username(user)
                                    )
                                  )
                                )
                              ),
                              i < 4 ? m(
                                'td',
                                { className: 'rankings-' + i },
                                user.data.attributes.Points
                              ) : m(
                                'td',
                                { className: 'rankings-4' },
                                user.data.attributes.Points
                              )
                            )]
                          })
                        ),
                        m(
                          'div',
                          { className: 'rankings-loadmore' },
                          ' ',
                          loading
                        )
                      )
                    )
                  )
                )
              )
            )
          }
        }, {
          key: 'refresh',
          value: function refresh () {
            var _this3 = this

            var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true

            if (clear) {
              this.loading = true
              this.users = []
            }

            return this.loadResults().then(function (results) {
              _this3.users = []
              _this3.parseResults(results)
            }, function () {
              _this3.loading = false
              m.redraw()
            })
          }
        }, {
          key: 'addOrdinalSuffix',
          value: function addOrdinalSuffix (i) {
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
        }, {
          key: 'stickyParams',
          value: function stickyParams () {
            return {
              sort: m.route.param('sort'),
              q: m.route.param('q')
            }
          }
        }, {
          key: 'actionItems',
          value: function actionItems () {
            var items = new ItemList()

            items.add('refresh', Button.component({
              title: app.translator.trans('core.forum.index.refresh_tooltip'),
              icon: 'refresh',
              className: 'Button Button--icon',
              onclick: function onclick () {
                app.cache.discussionList.refresh()
                if (app.session.user) {
                  app.store.find('users', app.session.user.id())
                  m.redraw()
                }
              }
            }))

            return items
          }
        }, {
          key: 'newDiscussion',
          value: function newDiscussion () {
            var deferred = m.deferred()

            if (app.session.user) {
              this.composeNewDiscussion(deferred)
            } else {
              app.modal.show(new LogInModal({
                onlogin: this.composeNewDiscussion.bind(this, deferred)
              }))
            }

            return deferred.promise
          }
        }, {
          key: 'composeNewDiscussion',
          value: function composeNewDiscussion (deferred) {
            var component = new DiscussionComposer({ user: app.session.user })

            app.composer.load(component)
            app.composer.show()

            deferred.resolve(component)

            return deferred.promise
          }
        }, {
          key: 'loadResults',
          value: function loadResults (offset) {
            var params = {}
            params.page = {
              offset: offset,
              limit: '10'
            }

            return app.store.find('rankings', params)
          }
        }, {
          key: 'loadMore',
          value: function loadMore () {
            this.loading = true

            this.loadResults(this.users.length).then(this.parseResults.bind(this))
          }
        }, {
          key: 'parseResults',
          value: function parseResults (results) {
            [].push.apply(this.users, results)

            this.loading = false

            this.users.sort(function (a, b) {
              return parseFloat(b.data.attributes.Points) - parseFloat(a.data.attributes.Points)
            })

            m.lazyRedraw()

            return results
          }
        }])
        return RankingsPage
      }(Page))

      _export('default', RankingsPage)
    }
  }
})
'use strict'

System.register('Reflar/gamification/components/VoteNotification', ['flarum/components/Notification'], function (_export, _context) {
  'use strict'

  var Notification, UpvotedNotification
  return {
    setters: [function (_flarumComponentsNotification) {
      Notification = _flarumComponentsNotification.default
    }],
    execute: function () {
      UpvotedNotification = (function (_Notification) {
        babelHelpers.inherits(UpvotedNotification, _Notification)

        function UpvotedNotification () {
          babelHelpers.classCallCheck(this, UpvotedNotification)
          return babelHelpers.possibleConstructorReturn(this, (UpvotedNotification.__proto__ || Object.getPrototypeOf(UpvotedNotification)).apply(this, arguments))
        }

        babelHelpers.createClass(UpvotedNotification, [{
          key: 'icon',
          value: function icon () {
            if (this.props.notification.content() === 'Up') {
              return 'thumbs-up'
            } else {
              return 'thumbs-down'
            }
          }
        }, {
          key: 'href',
          value: function href () {
            return app.route.post(this.props.notification.subject())
          }
        }, {
          key: 'content',
          value: function content () {
            if (this.props.notification.content() === 'Up') {
              return app.translator.trans('reflar-gamification.forum.notification.upvote', { username: this.props.notification.sender().username() })
            } else {
              return app.translator.trans('reflar-gamification.forum.notification.downvote', { username: this.props.notification.sender().username() })
            }
          }
        }, {
          key: 'excerpt',
          value: function excerpt () {
            return this.props.notification.subject().contentPlain()
          }
        }])
        return UpvotedNotification
      }(Notification))

      _export('default', UpvotedNotification)
    }
  }
})
'use strict'

System.register('Reflar/gamification/components/VotesModal', ['flarum/components/Modal', 'flarum/helpers/avatar', 'flarum/helpers/username'], function (_export, _context) {
  'use strict'

  var Modal, avatar, username, VotesModal
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default
    }, function (_flarumHelpersAvatar) {
      avatar = _flarumHelpersAvatar.default
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername.default
    }],
    execute: function () {
      VotesModal = (function (_Modal) {
        babelHelpers.inherits(VotesModal, _Modal)

        function VotesModal () {
          babelHelpers.classCallCheck(this, VotesModal)
          return babelHelpers.possibleConstructorReturn(this, (VotesModal.__proto__ || Object.getPrototypeOf(VotesModal)).apply(this, arguments))
        }

        babelHelpers.createClass(VotesModal, [{
          key: 'className',
          value: function className () {
            return 'VotesModal Modal--small'
          }
        }, {
          key: 'title',
          value: function title () {
            return app.translator.trans('reflar-gamification.forum.modal.title')
          }
        }, {
          key: 'content',
          value: function content () {
            return m(
              'div',
              { className: 'Modal-body' },
              m(
                'ul',
                { className: 'VotesModal-list' },
                m(
                  'legend',
                  null,
                  app.translator.trans('reflar-gamification.forum.modal.upvotes_label')
                ),
                this.props.post.upvotes().map(function (user) {
                  return m(
                    'li',
                    null,
                    m(
                      'a',
                      { href: app.route.user(user), config: m.route },
                      avatar(user),
                      ' ',
                      ' ',
                      username(user)
                    )
                  )
                }),
                m(
                  'legend',
                  null,
                  app.translator.trans('reflar-gamification.forum.modal.downvotes_label')
                ),
                this.props.post.downvotes().map(function (user) {
                  return m(
                    'li',
                    null,
                    m(
                      'a',
                      { href: app.route.user(user), config: m.route },
                      avatar(user),
                      ' ',
                      ' ',
                      username(user)
                    )
                  )
                })
              )
            )
          }
        }])
        return VotesModal
      }(Modal))

      _export('default', VotesModal)
    }
  }
})
'use strict'

System.register('Reflar/gamification/helpers/rankLabel', [], function (_export, _context) {
  'use strict'

  function rankLabel (rank) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

    attrs.style = attrs.style || {}
    attrs.className = 'rankLabel ' + (attrs.className || '')

    var color = rank.color()
    attrs.style.backgroundColor = attrs.style.color = color
    attrs.className += ' colored'

    return m('span', attrs, m(
      'span',
      { className: 'rankLabel-text' },
      rank.name()
    ))
  }

  _export('default', rankLabel)

  return {
    setters: [],
    execute: function () {}
  }
})
'use strict'

System.register('Reflar/gamification/main', ['flarum/extend', 'flarum/app', 'Reflar/gamification/components/AddAttributes', 'Reflar/gamification/components/AddHotnessSort', 'Reflar/gamification/components/AddVoteButtons', 'Reflar/gamification/models/Rank', 'Reflar/gamification/components/RankingsPage', 'Reflar/gamification/components/VoteNotification'], function (_export, _context) {
  'use strict'

  var extend, app, AddAttributes, AddHotnessFilter, AddVoteButtons, Rank, RankingsPage, VoteNotification
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend
    }, function (_flarumApp) {
      app = _flarumApp.default
    }, function (_ReflarGamificationComponentsAddAttributes) {
      AddAttributes = _ReflarGamificationComponentsAddAttributes.default
    }, function (_ReflarGamificationComponentsAddHotnessSort) {
      AddHotnessFilter = _ReflarGamificationComponentsAddHotnessSort.default
    }, function (_ReflarGamificationComponentsAddVoteButtons) {
      AddVoteButtons = _ReflarGamificationComponentsAddVoteButtons.default
    }, function (_ReflarGamificationModelsRank) {
      Rank = _ReflarGamificationModelsRank.default
    }, function (_ReflarGamificationComponentsRankingsPage) {
      RankingsPage = _ReflarGamificationComponentsRankingsPage.default
    }, function (_ReflarGamificationComponentsVoteNotification) {
      VoteNotification = _ReflarGamificationComponentsVoteNotification.default
    }],
    execute: function () {
      app.initializers.add('Reflar-gamification', function (app) {
        app.store.models.ranks = Rank

        app.notificationComponents.vote = VoteNotification

        app.routes.rankings = { path: '/rankings', component: RankingsPage.component() }

        AddVoteButtons()
        AddHotnessFilter()
        AddAttributes()
      })
    }
  }
})
'use strict'

System.register('Reflar/gamification/models/Rank', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
  'use strict'

  var Model, mixin, Rank
  return {
    setters: [function (_flarumModel) {
      Model = _flarumModel.default
    }, function (_flarumUtilsMixin) {
      mixin = _flarumUtilsMixin.default
    }],
    execute: function () {
      Rank = (function (_mixin) {
        babelHelpers.inherits(Rank, _mixin)

        function Rank () {
          babelHelpers.classCallCheck(this, Rank)
          return babelHelpers.possibleConstructorReturn(this, (Rank.__proto__ || Object.getPrototypeOf(Rank)).apply(this, arguments))
        }

        return Rank
      }(mixin(Model, {
        points: Model.attribute('points'),
        name: Model.attribute('name'),
        color: Model.attribute('color')
      })))

      _export('default', Rank)
    }
  }
})

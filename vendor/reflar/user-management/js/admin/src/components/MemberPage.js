import app from 'flarum/app';
import Alert from "flarum/components/Alert";
import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import humanTime from 'flarum/helpers/humanTime';
import Switch from 'flarum/components/Switch';
import icon from 'flarum/helpers/icon';
import saveSettings from "flarum/utils/saveSettings";
import AdminStrikeModal from 'Reflar/UserManagement/components/AdminStrikeModal';


function MemberItem(user) {
    const url = app.forum.attribute('baseUrl') + '/u/' + user.id();
    const online = user.isOnline();
    let activated = user.isActivated();
    
      return [
          m('li', {"data-id": user.id()}, [
              m('div', {className: 'MemberListItem-info'}, [
                  m('span', {className: 'MemberListItem-name'}, [
                      user.username(),
                  ]),
                  m('div', {className: 'MemberListItem-info' + (activated ? '1' : '0')}, [
                      activated
                          ? [m('span', {className: 'MemberCard-lastSeen' + (online ? ' online' : '')}, [
                                online 
                            
                                    ? [{className: 'MemberCard-online'}, icon('circle'), ' ', app.translator.trans('reflar-usermanagement.admin.page.online_text')]
                                    : [icon('clock-o'), ' ', humanTime(user.lastSeenTime())]
                            ])]
                          : [m('span', {className: 'MemberCard-lastSeen'}, [
                                m('a', {
                                  className: 'Button Button--link',
                                  onclick: function onclick() {
                                     app.request({
                                          url: app.forum.attribute('apiUrl') + '/reflar/usermanagement/attributes',
                                          method: 'POST',
                                          data: {username: user.username()}
                                     }).then(function () {
                                          return window.location.reload();
                                        });
                                  }
                              }, [
                                  app.translator.trans('reflar-usermanagement.admin.page.activate')
                              ])
                            ])]
                    ]),
                  m('span', {className: 'MemberListItem-comments'}, [
                      icon('comment-o'),
                      user.commentsCount()
                  ]),
                  m('span', {className: 'MemberListItem-discussions'}, [
                      icon('reorder'),
                      user.discussionsCount()
                  ]),
                 Button.component({
                    className: 'Button Button--link',
                    icon: 'exclamation-triangle',
                    onclick: function (e) {
                        app.modal.show(new AdminStrikeModal({user}));
                        m.redraw();
                    }
                  }),
                  m('a', {
                      className: 'Button Button--link',
                      target: '_blank',
                      href: url
                  }, [
                      icon('eye')
                  ])
              ])
          ])
      ];
}

export default class MemberPage extends Page {
    init() {
        super.init();
      
        const settings = app.data.settings;
      
        this.loading = true;
        this.moreResults = false;
        this.users = [];
        this.refresh();
      
        this.genderRegEnabled = m.prop(settings['Reflar-genderRegEnabled'] === '1');
        this.ageRegEnabled = m.prop(settings['Reflar-ageRegEnabled']  === '1');
        this.emailRegEnabled = m.prop(settings['Reflar-emailRegEnabled']  === '1');
        this.recaptcha = m.prop(settings['Reflar-recaptcha']  === '1');
        this.amountPerPage = m.prop(settings['ReFlar-amountPerPage'] || 25);
    }

    view() {
        let loading;

        if (this.loading) {
            loading = LoadingIndicator.component();
        } else if (this.moreResults) {
            loading = Button.component({
                children: app.translator.trans('reflar-usermanagement.admin.page.load_more_button'),
                className: 'Button',
                onclick: this.loadMore.bind(this)
            });
        }
		console.log(this.users);
        return [
            m('div', {className: 'MemberListPage'}, [
                m('div', {className: 'MemberList-header'}, [
                    m('div', {className: 'container'}, [
                        m('p', {}, app.translator.trans('reflar-usermanagement.admin.page.about_text')),
                              <div className="Form-group">
                                {Switch.component({
                                  className: "SettingsModal-switch",
                                  state: this.emailRegEnabled(),
                                  children: app.translator.trans('reflar-usermanagement.admin.modal.email_switch'),
                                  onchange: this.emailRegEnabled
                                })}
                              </div>,
                              <div className="Form-group">
                              {Switch.component({
                                  className: "SettingsModal-switch",
                                  state: this.genderRegEnabled(),
                                  children: app.translator.trans('reflar-usermanagement.admin.modal.gender_label'),
                                  onchange: this.genderRegEnabled
                                })}
                              </div>,
                              <div className="Form-group">
                              {Switch.component({
                                  className: "SettingsModal-switch",
                                  state: this.ageRegEnabled(),
                                  children: app.translator.trans('reflar-usermanagement.admin.modal.age_label'),
                                  onchange: this.ageRegEnabled
                                })} 
                              </div>,
                              <div className="Form-group">
                              {Switch.component({
                                  className: "SettingsModal-switch",
                                  state: this.recaptcha(),
                                  children: app.translator.trans('reflar-usermanagement.admin.modal.recaptcha'),
                                  onchange: this.recaptcha
                                })} 
                              </div>,
                              <div className="Form-group">
                                <label>
                                  {app.translator.trans('reflar-usermanagement.admin.modal.amount_label')}
                                </label>
                                <input className="FormControl" type="number" value={this.amountPerPage()} onchange={m.withAttr('value', this.amountPerPage)} />
                              </div>,
                        Button.component({
                            className: 'Button Button--primary',
                            icon: 'plus',
                            children: app.translator.trans('core.admin.appearance.submit_button'),
                            onclick: () => {
                      
                                if (this.loading) return;
                      
                                this.loading = true
                      
                                saveSettings({
                                  'Reflar-genderRegEnabled': this.genderRegEnabled(),
                                  'Reflar-ageRegEnabled': this.ageRegEnabled(),
                                  'Reflar-emailRegEnabled': this.emailRegEnabled(),
                                  'Reflar-recaptcha': this.recaptcha(),
                                  'ReFlar-amountPerPage': this.amountPerPage()
                                }).then(() => {
                                    app.alerts.show(this.successAlert = new Alert({
                                    type: 'success',
                                    children: app.translator.trans('core.admin.basics.saved_message')
                                    }));
                                  }).then(() => {
                                    this.loading = false;
                                    window.location.reload();
                                    })
                            }
                        })
                    ])
                ]),
                m('div', {className: 'MemberList-list'}, [
                    m('div', {className: 'container'}, [
                        m('div', {className: 'MemberListItems'}, [
                            m('label', {className: 'MemberListLabel'}, app.translator.trans('reflar-usermanagement.admin.page.list_title')),
                            m('ol', {
                                    className: 'MemberList'
                                },
                                [this.users.map(MemberItem)]
                            ),
                            m('div', {className: 'MemberList-loadMore'}, [loading])
                        ])
                    ])
                ])
            ])
        ];
    }

    refresh(clear = true) {
        if (clear) {
            this.loading = true;
            this.users = [];
        }

        return this.loadResults().then(
            results => {
                this.users = [];
                this.parseResults(results);
            },
            () => {
                this.loading = false;
                m.redraw();
            }
        );
    }

    loadResults(offset) {
        const params = {};
        params.page = {
            offset: offset,
            limit: app.data.settings['ReFlar-amountPerPage']
        };
        params.sort = 'username';

        return app.store.find('users', params);
    }

    loadMore() {
        this.loading = true;

        this.loadResults(this.users.length)
            .then(this.parseResults.bind(this));
    }

    parseResults(results) {
        [].push.apply(this.users, results);

        this.loading = false;
        this.moreResults = !!results.payload.links.next;

        m.lazyRedraw();

        return results;
    }
}
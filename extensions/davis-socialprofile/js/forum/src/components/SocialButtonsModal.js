import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import { slug } from 'flarum/utils/string';

export default class SocialButtonsModal extends Modal {
  init() {
    
    super.init();

    const curuserid = app.current.user.data.id;
    var url = app.forum.attribute('apiUrl') + '/profile/socialbutton/'+curuserid;
      this.socialaccs = null;
      m.request({method: "GET", url: url}).then(result => {
        if(result.data.attributes.hasOwnProperty("buttons")) {
          if(result.data.attributes.buttons == "[]"){
            this.buttons[0] = {};
            this.buttons[0].index = m.prop(0);
            this.buttons[0].iconstyle = m.prop("");
            this.buttons[0].color = m.prop("white");
            this.buttons[0].favicon = m.prop("none");
            this.buttons[0].title = m.prop("");
            this.buttons[0].url = m.prop("");
            this.buttons[0].icon = m.prop("globe");
            this.numberofinputs = 0;
          } else {
            this.socialaccs = JSON.parse(result.data.attributes.buttons);
            this.buttons = [];
            for(var k in this.socialaccs) {
              if(this.socialaccs[k]['title'] != "") {
                this.buttons[k] = {};
                this.buttons[k].index = m.prop(k);
                this.buttons[k].iconstyle = m.prop();
                this.buttons[k].color = m.prop("white");
                this.buttons[k].favicon = m.prop(this.socialaccs[k]["favicon"] || "none");
                this.buttons[k].title = m.prop(this.socialaccs[k]["title"] || "");
                this.buttons[k].url = m.prop(this.socialaccs[k]["url"] || "");
                this.buttons[k].icon = m.prop(this.socialaccs[k]["icon"] || "globe");
                this.numberofinputs = k;
              }
            }
          }
        } else {
            this.buttons[0] = {};
            this.buttons[0].index = m.prop(0);
            this.buttons[0].iconstyle = m.prop("");
            this.buttons[0].color = m.prop("white");
            this.buttons[0].favicon = m.prop("none");
            this.buttons[0].title = m.prop("");
            this.buttons[0].url = m.prop("");
            this.buttons[0].icon = m.prop("globe");
            this.numberofinputs = 0;
        }
        for(var k in this.buttons) {
          if (this.buttons[k].favicon() != 'none') {
            this.buttons[k].color('transparent');
            this.buttons[k].icon('fa-social-favicon-'+this.buttons[k].index());
          }
          var urlpattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
          if(urlpattern.test(this.buttons[k].url().toLowerCase())) {
            var iconurl = (this.buttons[k].url().replace(/(:\/\/[^\/]+).*$/, '$1') + '/favicon.ico');
            var iconstyle = 'a > .social-favicon-'+this.buttons[k].index()+' {background-image: url("'+iconurl+'"); background-position: center; background-repeat: no-repeat; background-size: 100% 100%;width:100%;height:100%;}';
            this.buttons[k].iconstyle(iconstyle);
          }
        }
        m.redraw()
        $('.form-group-social').delay(5).slideDown();
        $('#loading-main').delay(5).removeClass('fa-spin');
        $('#loading-main').delay(5).slideUp();
    });
    this.buttons = [];
  }

  className() {
    return 'SocialButtonsModal Modal--small';
  }

  title() {
    return app.translator.trans('davis-socialprofile.forum.edit.headtitle');
  }

  content() {
     $(() => {
                $('.Modal-content').css('overflow', 'visible');
                $(document).on('click', '.action-placement', function (e) {
                    $('.action-placement').removeClass('active');
                    $(this).addClass('active');
                    e.preventDefault();
                    return false;
                });
                for(var k in this.buttons) {
                  $('#social-favicon-'+this.buttons[k].index()).iconpicker({ 
                        icons:['social-favicon-'+this.buttons[k].index(), "fa-globe", 'fa-amazon', 'fa-angellist', 'fa-apple', 'fa-behance', 'fa-bitbucket', 'fa-codepen', 'fa-connectdevelop', 'fa-dashcube', 'fa-delicious', 'fa-deviantart', 'fa-digg', 'fa-dribbble', 'fa-dropbox', 'fa-drupal', 'fa-facebook', 'fa-flickr', 'fa-foursquare', 'fa-get-pocket', 'fa-git', 'fa-github', 'fa-github-alt', 'fa-gittip', 'fa-google', 'fa-google-plus', 'fa-google-wallet', 'fa-gratipay', 'fa-hacker-news', 'fa-instagram', 'fa-ioxhost', 'fa-joomla', 'fa-jsfiddle', 'fa-lastfm', 'fa-leanpub', 'fa-linkedin', 'fa-meanpath', 'fa-medium', 'fa-odnoklassniki', 'fa-opencart', 'fa-pagelines', 'fa-paypal', 'fa-pied-piper-alt', 'fa-pinterest-p', 'fa-qq', 'fa-reddit', 'fa-renren', 'fa-sellsy', 'fa-share-alt', 'fa-shirtsinbulk', 'fa-simplybuilt', 'fa-skyatlas', 'fa-skype', 'fa-slack', 'fa-slideshare', 'fa-soundcloud', 'fa-spotify', 'fa-stack-exchange', 'fa-stack-overflow', 'fa-steam', 'fa-stumbleupon', 'fa-tencent-weibo', 'fa-trello', 'fa-tripadvisor', 'fa-tumblr', 'fa-twitch', 'fa-twitter', 'fa-viacoin', 'fa-vimeo', 'fa-vine', 'fa-vk', 'fa-wechat', 'fa-weibo', 'fa-weixin', 'fa-whatsapp', 'fa-wordpress', 'fa-xing', 'fa-y-combinator', 'fa-yelp', 'fa-youtube-play' ],
                        hideOnSelect: true,
                        title: "Displayed Icon",
                    });
                }
                $('.icp').on('iconpickerSelected', (e) => {
                    var btn_group = /btn-group="(\d+)"/.exec(e.target.outerHTML)[1];
                    $('#icon'+btn_group).val(e.iconpickerValue.replace("fa-", "")).change();
                    if (e.iconpickerValue.replace("fa-", "") == 'social-favicon-'+this.buttons[btn_group].index()) {
                        var urlpattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
                        if(urlpattern.test(this.buttons[btn_group].url().toLowerCase())) {
                          var iconurl = (this.buttons[btn_group].url().replace(/(:\/\/[^\/]+).*$/, '$1') + '/favicon.ico');
                          this.buttons[btn_group].favicon(iconurl);
                          this.buttons[btn_group].color('transparent');
                      }
                    } else {
                      this.buttons[btn_group].favicon('none');
                      this.buttons[btn_group].color('white');
                    }
                    m.redraw();
                    $('.icp').attr("aria-expanded","false");
                    $('.btn-group').removeClass('open');
                });
            });
       return [
            m('div', {className: 'Modal-body'}, [
                m('div', {className: 'Form'}, [
                  m('i', {className: 'fa fa-spinner fa-spin fa-align-center', id: 'loading-main', style: {'font-size': '3em', 'margin-left': '47%'}}),
                    this.buttons.map((button) => {
                      
                      return [
                          m('div', {className: 'Form-group form-group-social', id: 'socialgroup'+button.index()}, [
                            m('input', {className: 'SocialFormControl SocialTitle',
                              placeholder: app.translator.trans('davis-socialprofile.forum.edit.title'),
                              value: button.title(), 
                              oninput: m.withAttr('value', button.title)
                            }),
                            m('div', {className: 'btn-group'}, [
                              m('null', {className: 'action-create'}),
                              m('button', {type: 'button',
                                tabindex: '-1',
                                className: 'btn btn-primary2 iconpicker-component',
                                style: {
                                  'background-image': (button.favicon() != 'none' ? "url("+button.favicon()+')' : "none"), 
                                  'background-position': 'center',
                                  'background-repeat': 'no-repeat',
                                  'background-size': '50% auto',
                                }
                              }, [
                                m('i', {className: 'fa fa-fw fa-'+button.icon(),
                                  style: {
                                    'color': button.color(),
                                  }
                                })
                              ]),
                              m('button', {type: 'button',
                                'btn-group': button.index(),
                                className: 'form-control icp icp-dd btn btn-primary dropdown-toggle',
                                id: 'social-favicon-'+button.index(),
                                'data-selected': (button.favicon() != 'none' ? button.icon().replace('fa-', '') : "fa-"+button.icon()),
                                'data-toggle': 'dropdown'
                              }, [
                                m('span', {className: 'caret'}),
                                m('span', {className: 'sr-only'}, ['Toggle Dropdown'])
                              ]),
                              m('div', {className: 'social-dropdown-menu'})
                            ]),
                            m('input', {className: 'SocialFormControl Socialurl',
                              placeholder: app.translator.trans('davis-socialprofile.forum.edit.url'),
                              value: button.url(),
                              oninput: m.withAttr('value', (value) => {
                                button.url(value);
                                var urlpattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
                                if(urlpattern.test(button.url().toLowerCase())) {
                                  var iconurl = (button.url().replace(/(:\/\/[^\/]+).*$/, '$1') + '/favicon.ico');
                                  var iconstyle = 'a > .social-favicon-'+button.index()+' {background-image: url("'+iconurl+'"); background-position: center; background-repeat: no-repeat; background-size: 100% 100%;width:100%;height:100%;}';
                                  button.iconstyle(iconstyle);
                                  button.favicon(iconurl);
                                  button.color('transparent');
                                  button.icon('fa-social-favicon-'+button.index());
                                  $('#social-favicon-'+button.index()).attr('data-selected', button.icon().replace('fa-', '')).change();
                                }
                              }),
                            }),
                            m('input', {className: 'SocialFormControl SocialIcon',
                              id: 'icon'+button.index(),
                              style: 'display: none',
                              value: button.icon(),
                              onchange: m.withAttr('value', button.icon)
                            }),
                            m('input', {className: 'SocialFormControl Socialfavicon',
                              id: 'favicon'+button.index(),
                              style: 'display: none',
                              value: button.favicon(),
                              onchange: m.withAttr('value', button.favicon)
                            }),
                            m('style', {}, button.iconstyle()),
                          ]),
                      ];
                    }),
                    m('div', {className: 'Form-group', id: 'submit-button-group'}, [
                      Button.component({
                        type: 'submit',
                        className: 'Button Button--primary EditSocialButtons-save',
                        loading: this.loading,
                        children: app.translator.trans('davis-socialprofile.forum.edit.submit')
                      }),
                      m('div', {className: 'Button Button--primary EditSocialButtons-add', style: 'margin-left: 1%;', 
                        onclick: () => { 
                          var curadd = this.buttons.length; 
                          this.buttons[curadd] = {};
                          this.buttons[curadd].index = m.prop(curadd);
                          this.buttons[curadd].title = m.prop("");
                          this.buttons[curadd].favicon = m.prop("none");
                          this.buttons[curadd].iconstyle = m.prop("");
                          this.buttons[curadd].color = m.prop("");
                          this.buttons[curadd].url = m.prop("");
                          this.buttons[curadd].icon = m.prop("globe");
                          this.numberofinputs = curadd;
      
                          m.redraw(); 
                          $('#socialgroup'+curadd).delay(2).slideDown();
                        }}, [
                        m('i', {className: 'fa fa-fw fa-plus'})
                      ]),
                      m('div', {className: 'Button Button--primary EditSocialButtons-add', style: 'margin-left: 1%;', 
                        onclick: () => { 
                          var curdel = (this.buttons.length - 1); 
                          $('#socialgroup'+curdel).slideUp('normal', () => {
                            this.buttons.splice(curdel, 1);
                            m.redraw();
                          });
                        }}, [
                        m('i', {className: 'fa fa-fw fa-minus'})
                      ]),
                    ]),
                  ]),
                ]),
              ];
  }

  onsubmit(e) {
      
      e.preventDefault();
      
      this.loading = true;
      this.finbuttons = [];
      for(var k in this.buttons) {
        if (this.buttons[k].title() != "") {
          var number = this.finbuttons.length
          this.finbuttons[number] = {};
          this.finbuttons[number].title = m.prop(this.buttons[k].title());
          this.finbuttons[number].url = m.prop(this.buttons[k].url());
          this.finbuttons[number].icon = m.prop(this.buttons[k].icon());
          this.finbuttons[number].favicon = m.prop(this.buttons[k].favicon());
        }
      }
      this.finbuttons = JSON.stringify(this.finbuttons);
      const data = new FormData();
      data.append('buttons', this.finbuttons);
      app.request({
          method: 'POST',
          url: app.forum.attribute('apiUrl') + '/profile/socialbuttons',
          serialize: raw => raw,
          data
      }).then(
          () => this.hide(),
          response => {
            this.loading = false;
            this.handleErrors(response);
          }
      );

  }
}
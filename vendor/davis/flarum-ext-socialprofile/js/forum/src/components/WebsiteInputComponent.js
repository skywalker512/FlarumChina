import Component from 'flarum/Component';
import IconSelectorComponent from 'Davis/SocialProfile/components/IconSelectorComponent';

export default class WebsiteInputComponent extends Component {
  init() {
    super.init();

    this.button = this.props.button;
  }

  view() {
    return m('div', {
      className: 'Form-group form-group-social',
      id: `socialgroup-${this.button.index()}`,
    }, [
      m('input', {
        className: 'SocialFormControl SocialTitle',
        placeholder: app.translator.trans('davis-socialprofile.forum.edit.title'),
        tabIndex: ((this.button.index() + 1) * 2) - 1,
        value: this.button.title(),
        onchange: m.withAttr('value', this.button.title),
      }),
      IconSelectorComponent.component({
        selection: this.button.icon,
        favicon: this.button.favicon,
        index: this.button.index,
      }),
      m('input', {
        className: 'SocialFormControl Socialurl',
        placeholder: app.translator.trans('davis-socialprofile.forum.edit.url'),
        tabIndex: ((this.button.index() + 1) * 2),
        value: this.button.url(),
        onchange: m.withAttr('value', (value) => {
          this.button.url(value);
          clearTimeout(this.waittilfinsihed);
          if (this.button.icon() !== 'fa-circle-o-notch fa-spin') {
            this.button.icon('fa-circle-o-notch fa-spin');
            this.button.favicon('none');
          }
          this.waittilfinsihed = setTimeout(() => {
            const urlpattern =
            /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

            if (urlpattern.test(this.button.url().toLowerCase())) {
              const iconurl = `${this.button.url().replace(/(:\/\/[^\/]+).*$/, '$1')}/favicon.ico`;
              this.button.favicon(iconurl);
              this.button.icon('favicon');
              m.redraw();
            } else {
              this.button.icon('fa-globe');
              this.button.favicon('none');
              m.redraw();
            }
          }, 1000);
        }),
      }),
      m('input', {
        className: 'SocialFormControl SocialIcon',
        id: `icon${this.button.index()}`,
        style: { display: 'none' },
        value: this.button.icon(),
        onchange: m.withAttr('value', this.button.icon),
      }),
      m('input', {
        className: 'SocialFormControl Socialfavicon',
        id: `favicon${this.button.index()}`,
        style: { display: 'none' },
        value: this.button.favicon(),
        onchange: m.withAttr('value', this.button.favicon),
      }),
    ]);
  }
}

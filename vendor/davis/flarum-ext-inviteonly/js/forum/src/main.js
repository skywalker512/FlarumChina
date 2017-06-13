import { extend } from 'flarum/extend';
import app from 'flarum/app';
import SignUpModal from 'flarum/components/SignUpModal';
import extractText from 'flarum/utils/extractText';
import LogInButtons from 'flarum/components/LogInButtons';
import Button from 'flarum/components/Button';
import SettingsPage from 'flarum/components/SettingsPage';
import InviteModal from 'Davis/InviteOnly/components/InviteModal';
import FieldSet from 'flarum/components/FieldSet';

app.initializers.add('davis-inviteonly', () => {
  SignUpModal.prototype.body = function() {
    return [
      this.props.token ? '' : <LogInButtons/>,

      <div className="Form Form--centered">
        <div className="Form-group">
          <input className="FormControl" name="username" type="text" placeholder={extractText(app.translator.trans('core.forum.sign_up.username_placeholder'))}
            value={this.username()}
            onchange={m.withAttr('value', this.username)}
            disabled={this.loading} />
        </div>

        <div className="Form-group">
          <input className="FormControl" name="email" type="email" placeholder={extractText(app.translator.trans('core.forum.sign_up.email_placeholder'))}
            value={this.email()}
            onchange={m.withAttr('value', this.email)}
            disabled={this.loading || (this.props.token && this.props.email)} />
        </div>

        {this.props.token ? '' : (
          <div className="Form-group">
            <input className="FormControl" name="password" type="password" placeholder={extractText(app.translator.trans('core.forum.sign_up.password_placeholder'))}
              value={this.password()}
              onchange={m.withAttr('value', this.password)}
              disabled={this.loading} />
          </div>
        )}
        
        <div className="Form-group">
            <input className="FormControl" name="referal" type="text" placeholder={extractText(app.translator.trans('davis-inviteonly.forum.sign_up.referal_placeholder'))}
              value={this.referal()}
              onchange={m.withAttr('value', this.referal)}
              disabled={this.loading} />
          </div>

        <div className="Form-group">
          <Button
            className="Button Button--primary Button--block"
            type="submit"
            loading={this.loading}>
            {app.translator.trans('core.forum.sign_up.submit_button')}
          </Button>
        </div>
      </div>
    ];
  };
  SignUpModal.prototype.submitData = function() {
    const data = {
      username: this.username(),
      email: this.email(),
      referal: this.referal()
    };

    if (this.props.token) {
      data.token = this.props.token;
    } else {
      data.password = this.password();
    }

    if (this.props.avatarUrl) {
      data.avatarUrl = this.props.avatarUrl;
    }

    return data;
  };
  SignUpModal.prototype.init = function() {
    this.username = m.prop(this.props.username || '');

    this.email = m.prop(this.props.email || '');

    this.password = m.prop(this.props.password || '');
    
    this.referal = m.prop(this.props.referal || '');
  };
  SignUpModal.prototype.onsubmit = function(e) {
    e.preventDefault();

    this.loading = true;

    const data = this.submitData();

    app.request({
      url: app.forum.attribute('baseUrl') + '/api/davis/inviteonly/register',
      method: 'POST',
      data,
      errorHandler: this.onerror.bind(this)
    }).then(
      () => window.location.reload(),
      this.loaded.bind(this)
    );
  };
  extend(SettingsPage.prototype, 'settingsItems', function(items) {
    if (this.codes == undefined) {
    app.request({
          method: 'GET',
          url: app.forum.attribute('apiUrl') + '/davis/inviteonly/'+app.current.user.data.id,
    }).then(
          response => {
            this.codes = response.data.attributes;
            this.flatcodes = [];
            for(var k in this.codes) {
              this.flatcodes[k] = [];
              this.flatcodes[k]['index'] = k;
              this.flatcodes[k]['id'] = this.codes[k]['id'];
              this.flatcodes[k]['token'] = this.codes[k]['token'];
              this.flatcodes[k]['used'] = this.codes[k]['used'];
              this.flatcodes[k]['used_by'] = this.codes[k]['used_by'];
            }
            m.redraw();
            this.loading = false;
            this.handleErrors(response);
    });
  }
  items.add('invite',
      FieldSet.component({
        label: app.translator.trans('davis-inviteonly.forum.edit.title'),
        className: 'Settings-invite',
        children: [
          m('table', {className: "NotificationGrid"}, [m('thead', [m('tr', [m('td',[app.translator.trans('davis-inviteonly.forum.edit.key')]),m('td',[app.translator.trans('davis-inviteonly.forum.edit.used')]),m('td',[app.translator.trans('davis-inviteonly.forum.edit.used_by')]),m('td')])]),m('tbody',[
            (this.flatcodes !== undefined ? 
            this.flatcodes.map((code) => {
              return [
                m('tr', [m('td',[code['token']]),m('td',[code['used']]),m('td',[m('a',{href: app.forum.attribute('baseUrl') + '/u/' + code['used_by']},[code['used_by']])]),m('td',[m('a', {onclick: ()=>{this.createToken(code['id'], code['index'])}},["Regenerate"])])])
              ];
            }) : m('tr', [m('td',[app.translator.trans('davis-inviteonly.forum.loading')])])),
            m('tr', [m('td', {colspan: 4}, [Button.component({className: "Button Button--primary Button--block", onclick: ()=>{this.createToken(0, this.flatcodes.length)}}, ["Create New Code"])])])
          ])]),
          ]
      })
    ,1);
  });
  SettingsPage.prototype.createToken = function (id, index){
    const data = new FormData();
    data.append('refid', id);
      app.request({
          method: 'POST',
          url: app.forum.attribute('apiUrl') + '/davis/inviteonly/create',
          serialize: raw => raw,
          data
      }).then(
          response => {
            this.flatcodes[index] = [];
            this.flatcodes[index]['index'] = index;
            this.flatcodes[index]['id'] = response.data.attributes['id'];
            this.flatcodes[index]['token'] = response.data.attributes['token'];
            this.flatcodes[index]['used'] = response.data.attributes['used'];
            this.flatcodes[index]['used_by'] = response.data.attributes['used_by'];
            m.redraw();
            this.loading = false;
            this.handleErrors(response);
          }
      );
  }
});
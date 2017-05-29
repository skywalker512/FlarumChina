import Alert from 'flarum/components/Alert';
import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

export default class AgeGenderModal extends Modal {
  init() {
    super.init();

    this.age = m.prop(app.session.user.age());
    this.gender = m.prop(app.session.user.gender());

    this.password = m.prop('');
  }

  className() {
    return 'AgeGenderModal Modal--small';
  }

  title() {
    return app.translator.trans('reflar-usermanagement.forum.user.settings.title');
  }

  content() {

    return (
      <div className="Modal-body">
        <div className="Form Form--centered">
          <div className="Form-group">
            <input type="number" name="age" className="FormControl"
              placeholder={app.session.user.age()}
              bidi={this.age}
              disabled={this.loading}/>
          </div>
          <div className="Form-group">
            <select className="FormControl" onchange={m.withAttr('value', this.gender)}>
            
              {this.gender() == "" ? (
                <option value="" disabled selected>{app.translator.trans('reflar-usermanagement.forum.signup.gender')}</option>
              ) : (
                <option value="" disabled>{app.translator.trans('reflar-usermanagement.forum.signup.gender')}</option>
              )}

              {this.gender() == app.translator.trans('reflar-usermanagement.forum.signup.male') ? (
                <option value={app.translator.trans('reflar-usermanagement.forum.signup.male')} selected>{app.translator.trans('reflar-usermanagement.forum.signup.male')}</option>
              ) : (
                <option value={app.translator.trans('reflar-usermanagement.forum.signup.male')}>{app.translator.trans('reflar-usermanagement.forum.signup.male')}</option>
              )}

              {this.gender() == app.translator.trans('reflar-usermanagement.forum.signup.female') ? (
                <option value={app.translator.trans('reflar-usermanagement.forum.signup.female')} selected>{app.translator.trans('reflar-usermanagement.forum.signup.female')}</option>
              ) : (
                <option value={app.translator.trans('reflar-usermanagement.forum.signup.female')}>{app.translator.trans('reflar-usermanagement.forum.signup.female')}</option>
              )}

              {this.gender() == app.translator.trans('reflar-usermanagement.forum.signup.other') ? (
                <option value={app.translator.trans('reflar-usermanagement.forum.signup.other')} selected>{app.translator.trans('reflar-usermanagement.forum.signup.other')}</option>
              ) : (
                <option value={app.translator.trans('reflar-usermanagement.forum.signup.other')}>{app.translator.trans('reflar-usermanagement.forum.signup.other')}</option>
              )}
          </select>
          </div>
          <div className="Form-group">
            <input type="password" name="password" className="FormControl"
              placeholder={app.translator.trans('core.forum.change_email.confirm_password_placeholder')}
              bidi={this.password}
              disabled={this.loading}/>
          </div>
          <div className="Form-group">
            <Button className="Button Button--primary" loading={this.loading} type="submit">
              {app.translator.trans('reflar-usermanagement.forum.user.settings.save')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    
    if (this.loading) return;
    
    this.loading = true;
    

    app.request({
      url: app.forum.attribute('apiUrl') + '/reflar/usermanagement/attributes',
      method: 'POST',
      data: {"gender":this.gender(), "age":this.age(), "password": this.password()},
      errorHandler: this.onerror.bind(this)
    }).then(this.success.bind(this));
  }

  success(response) {
    app.alerts.show(this.successAlert = new Alert({type: 'success', children: app.translator.trans('reflar-usermanagement.forum.user.settings.success')}));
    app.modal.close();
  }

  onerror(error) {
    if (error.status === 401) {
      error.alert.props.children = app.translator.trans('core.forum.change_email.incorrect_password_message');
      this.loading = false;
    }

    super.onerror(error);
  }
}
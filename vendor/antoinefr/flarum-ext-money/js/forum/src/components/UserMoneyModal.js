import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';

export default class UserMoneyModal extends Modal {
  init() {
    super.init();
    this.money = m.prop(this.props.user.data.attributes['money']);
  }

  className() {
    return 'UserMoneyModal Modal--small';
  }

  title() {
    return app.translator.trans('antoinefr-money.forum.modal.title', {user: this.props.user});
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>{app.translator.trans('antoinefr-money.forum.modal.current')} {app.forum.data.attributes['antoinefr-money.moneyname'].replace('{money}', this.props.user.data.attributes['money'])}</label>
            <input required className="FormControl" type="number" step="any" value={this.money()} oninput={m.withAttr('value', this.money)} />
          </div>
          <div className="Form-group">
            <Button className="Button Button--primary" loading={this.loading} type="submit">
              {app.translator.trans('antoinefr-money.forum.modal.submit_button')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    this.props.user.save({'money':this.money()}).then(
      () => this.hide(),
      this.loaded.bind(this)
    );
  }
}
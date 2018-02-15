import SettingsModal from 'flarum/components/SettingsModal';

export default class MoneySettingsModal extends SettingsModal {
  className() {
    return 'Modal--small';
  }

  title() {
    return app.translator.trans('antoinefr-money.admin.settings.title');
  }

  form() {
    return [
      <div className="Form-group">
        <label>{app.translator.trans('antoinefr-money.admin.settings.moneyname')}</label>
        <input required className="FormControl" type="text" bidi={this.setting('antoinefr-money.moneyname')}></input>
        <label>{app.translator.trans('antoinefr-money.admin.settings.moneyforpost')}</label>
        <input required className="FormControl" type="number" step="any" bidi={this.setting('antoinefr-money.moneyforpost')}></input>
        <label>{app.translator.trans('antoinefr-money.admin.settings.moneyfordiscussion')}</label>
        <input required className="FormControl" type="number" step="any" bidi={this.setting('antoinefr-money.moneyfordiscussion')}></input>
        <label>{app.translator.trans('antoinefr-money.admin.settings.postminimumlength')}</label>
        <input required className="FormControl" type="number" step="any" bidi={this.setting('antoinefr-money.postminimumlength')}></input>
      </div>
    ];
  }
}
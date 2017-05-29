import Component from "flarum/Component";
import Button from "flarum/components/Button";
import saveSettings from "flarum/utils/saveSettings";
import Switch from 'flarum/components/Switch';
import Alert from "flarum/components/Alert";
import FieldSet from 'flarum/components/FieldSet';

export default class WordConfigPage extends Component {

    init() {
		const settings = app.data.settings;
			
    this.fields = [
      'Words',
			'flaggedEmail',
			'flaggedSubject'
    ]
			
	this.values = {};
	
	this.autoMergePosts = m.prop(settings.autoMergePosts === '1');		
	this.emailWhenFlagged = m.prop(settings.emailWhenFlagged === '1');		
	this.fields.forEach(key => this.values[key] = m.prop(settings[key]));
    }

    view() {
    return (
      <div className="WordConfigPage">
        <div className="container">
          <form onsubmit={this.onsubmit.bind(this)}>
            <h2>{app.translator.trans('issyrocks12-filter.admin.title')}</h2>
            {FieldSet.component({
              label: app.translator.trans('issyrocks12-filter.admin.filter_label'),
              className: 'WordConfigPage-Settings',
              children: [
                <div className="WordConfigPage-Settings-input">
									<div className="helpText">
              				{app.translator.trans('issyrocks12-filter.admin.help')}
            		</div>
                  <textarea className="FormControl" placeholder={app.translator.trans('issyrocks12-filter.admin.input.placeholder')} rows="6" value={this.values.Words() || null} oninput={m.withAttr('value', this.values.Words)} />
								</div>
              ]
            })}
						{FieldSet.component({
								label: app.translator.trans('issyrocks12-filter.admin.input.email_label'),
              	className: 'WordConfigPage-Settings',
              	children: [
								<div className="WordConfigPage-Settings-input">
										<label>{app.translator.trans('issyrocks12-filter.admin.input.email_subject')}</label>
										<input className="FormControl" value={this.values.flaggedSubject() || app.translator.trans('issyrocks12-filter.admin.email.default_subject')} oninput={m.withAttr('value', this.values.flaggedSubject)} />
										<label>{app.translator.trans('issyrocks12-filter.admin.input.email_body')}</label>
										<div className="helpText">
              					{app.translator.trans('issyrocks12-filter.admin.email_help')}
            				</div>
									<textarea className="FormControl" rows="4" value={this.values.flaggedEmail() || app.translator.trans('issyrocks12-filter.admin.email.default_text')} oninput={m.withAttr('value', this.values.flaggedEmail)} />
									</div>
								]
							})}
							{Switch.component({
                state: this.autoMergePosts(),
                children: app.translator.trans('issyrocks12-filter.admin.input.switch.merge'),
								className: 'WordConfigPage-Settings-switch',
                onchange: this.autoMergePosts
              })}
						{Switch.component({
                state: this.emailWhenFlagged(),
                children: app.translator.trans('issyrocks12-filter.admin.input.switch.email'),
								className: 'WordConfigPage-Settings-switch',
                onchange: this.emailWhenFlagged
              })}
									
            {Button.component({
              type: 'submit',
              className: 'Button Button--primary',
              children: app.translator.trans('core.admin.email.submit_button'),
              loading: this.loading
            })}
          </form>
        </div>
      </div>
    );
  }

    onsubmit(e)
					{
        // prevent the usual form submit behaviour
        e.preventDefault();


        // if the page is already saving, do nothing
        if (this.loading) return;

        // prevents multiple savings
        this.loading = true;
			
    		const settings = {};

				this.fields.forEach(key => settings[key] = this.values[key]());
        // remove previous success popup
        app.alerts.dismiss(this.successAlert);

			 saveSettings({
				 emailWhenFlagged: this.emailWhenFlagged(),
				 autoMergePosts: this.autoMergePosts()
			 });
						
        saveSettings(settings)
            .then(() => {
                // on success, show popup
                app.alerts.show(this.successAlert = new Alert({
                    type: 'success',
                    children: app.translator.trans('core.admin.basics.saved_message')
                }));
            })
            .catch(() => {
            })
            .then(() => {
                // return to the initial state and redraw the page
                this.loading = false;
                m.redraw();
            });
    }
}

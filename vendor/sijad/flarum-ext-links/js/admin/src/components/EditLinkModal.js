import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import { slug } from 'flarum/utils/string';

/**
 * The `EditlinksModal` component shows a modal dialog which allows the user
 * to create or edit a link.
 */
export default class EditlinksModal extends Modal {
  init() {
    super.init();

    this.link = this.props.link || app.store.createRecord('links');

    this.itemTitle = m.prop(this.link.title() || '');
    this.url = m.prop(this.link.url() || '');
    this.isInternal = m.prop(this.link.isInternal() && true);
    this.isNewtab = m.prop(this.link.isNewtab() && true);
  }

  className() {
    return 'EditLinkModal Modal--small';
  }

  title() {
    const title = this.itemTitle();
    return title
      ? title
      : app.translator.trans('sijad-links.admin.edit_link.title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>{app.translator.trans('sijad-links.admin.edit_link.title_label')}</label>
            <input className="FormControl" placeholder={app.translator.trans('sijad-links.admin.edit_link.title_placeholder')} value={this.itemTitle()} oninput={e => {
              this.itemTitle(e.target.value);
            }}/>
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('sijad-links.admin.edit_link.url_label')}</label>
            <input className="FormControl" placeholder={app.translator.trans('sijad-links.admin.edit_link.url_placeholder')} type="url" value={this.url()} oninput={e => {
              this.url(e.target.value);
            }}/>
          </div>

          <div className="Form-group">
            <div>
              <label className="checkbox">
                <input type="checkbox" value="1" checked={this.isInternal()} onchange={e => {
                  if (this.isInternal(e.target.checked)) {
                    this.isNewtab(false)
                  }
                }}/>
                {app.translator.trans('sijad-links.admin.edit_link.internal_link')}
              </label>
              <label className="checkbox">
                <input type="checkbox" value="1" checked={this.isNewtab()} onchange={e => {
                  if (this.isNewtab(e.target.checked)) {
                    this.isInternal(false)
                  }
                }}/>
                {app.translator.trans('sijad-links.admin.edit_link.open_newtab')}
              </label>
            </div>
          </div>

          <div className="Form-group">
            {Button.component({
              type: 'submit',
              className: 'Button Button--primary EditLinkModal-save',
              loading: this.loading,
              children: app.translator.trans('sijad-links.admin.edit_link.submit_button')
            })}
            {this.link.exists ? (
              <button type="button" className="Button EditLinkModal-delete" onclick={this.delete.bind(this)}>
                {app.translator.trans('sijad-links.admin.edit_link.delete_link_button')}
              </button>
            ) : ''}
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    this.link.save({
      title: this.itemTitle(),
      url: this.url(),
      isInternal: this.isInternal(),
      isNewtab: this.isNewtab()
    }).then(
      () => this.hide(),
      response => {
        this.loading = false;
        this.handleErrors(response);
      }
    );
  }

  delete() {
    if (confirm(app.translator.trans('sijad-links.admin.edit_link.delete_link_confirmation'))) {
      this.link.delete().then(() => m.redraw());
      this.hide();
    }
  }
}

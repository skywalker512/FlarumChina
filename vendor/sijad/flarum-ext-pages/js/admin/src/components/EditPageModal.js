import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import { slug } from 'flarum/utils/string';

/**
 * The `EditPageModal` component shows a modal dialog which allows the user
 * to create or edit a page.
 */
export default class EditPageModal extends Modal {
  init() {
    super.init();

    this.page = this.props.page || app.store.createRecord('pages');

    this.pageTitle = m.prop(this.page.title() || '');
    this.slug = m.prop(this.page.slug() || '');
    this.pageContent = m.prop(this.page.content() || '');
    this.isHidden = m.prop(this.page.isHidden() && true);
    this.isHtml = m.prop(this.page.isHtml() && true);
  }

  className() {
    return 'EditPageModal Modal--large';
  }

  title() {
    const title = this.pageTitle();
    return title
      ? title
      : app.translator.trans('sijad-pages.admin.edit_page.title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>{app.translator.trans('sijad-pages.admin.edit_page.title_label')}</label>
            <input className="FormControl" placeholder={app.translator.trans('sijad-pages.admin.edit_page.title_placeholder')} value={this.pageTitle()} oninput={e => {
              this.pageTitle(e.target.value);
              this.slug(slug(e.target.value));
            }}/>
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('sijad-pages.admin.edit_page.slug_label')}</label>
            <input className="FormControl" placeholder={app.translator.trans('sijad-pages.admin.edit_page.slug_placeholder')} value={this.slug()} oninput={e => {
              this.slug(e.target.value);
            }}/>
          </div>

          <div className="Form-group">
            <label>{app.translator.trans('sijad-pages.admin.edit_page.content_label')}</label>
            <textarea className="FormControl" rows="5" value={this.pageContent()} onchange={m.withAttr('value', this.pageContent)}
            placeholder={app.translator.trans('sijad-pages.admin.edit_page.content_placeholder')} />
          </div>

          <div className="Form-group">
            <div>
              <label className="checkbox">
                <input type="checkbox" value="1" checked={this.isHidden()} onchange={m.withAttr('checked', this.isHidden)}/>
                {app.translator.trans('sijad-pages.admin.edit_page.hidden_label')}
              </label>
            </div>
          </div>

          <div className="Form-group">
            <div>
              <label className="checkbox">
                <input type="checkbox" value="1" checked={this.isHtml()} onchange={m.withAttr('checked', this.isHtml)}/>
                {app.translator.trans('sijad-pages.admin.edit_page.html_label')}
              </label>
            </div>
          </div>
          <div className="Form-group">
            {Button.component({
              type: 'submit',
              className: 'Button Button--primary EditPageModal-save',
              loading: this.loading,
              children: app.translator.trans('sijad-pages.admin.edit_page.submit_button')
            })}
            {this.page.exists ? (
              <button type="button" className="Button EditPageModal-delete" onclick={this.delete.bind(this)}>
                {app.translator.trans('sijad-pages.admin.edit_page.delete_page_button')}
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

    this.page.save({
      title: this.pageTitle(),
      slug: this.slug(),
      content: this.pageContent(),
      isHidden: this.isHidden(),
      isHtml: this.isHtml(),
    }, {errorHandler: this.onerror.bind(this)})
      .then(this.hide.bind(this))
      .catch(() => {
        this.loading = false;
        m.redraw();
      });
  }

  onhide() {
    m.route(app.route('pages'));
  }

  delete() {
    if (confirm(app.translator.trans('sijad-pages.admin.edit_page.delete_page_confirmation'))) {
      this.page.delete().then(() => m.redraw());
      this.hide();
    }
  }
}

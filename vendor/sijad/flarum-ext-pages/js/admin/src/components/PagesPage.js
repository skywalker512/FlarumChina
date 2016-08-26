import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

import EditPageModal from 'sijad/pages/components/EditPageModal';
import PagesList from 'sijad/pages/components/PagesList';

export default class PagesPage extends Page {
  view() {
    return (
      <div className="PagesPage">
        <div className="PagesPage-header">
          <div className="container">
            <p>
              {app.translator.trans('sijad-pages.admin.pages.about_text')}
            </p>
            {Button.component({
              className: 'Button Button--primary',
              icon: 'plus',
              children: app.translator.trans('sijad-pages.admin.pages.create_button'),
              onclick: () => app.modal.show(new EditPageModal())
            })}
          </div>
        </div>
        <div className="PagesPage-list">
          <div className="container">
            {PagesList.component()}
          </div>
        </div>
      </div>
    );
  }
}

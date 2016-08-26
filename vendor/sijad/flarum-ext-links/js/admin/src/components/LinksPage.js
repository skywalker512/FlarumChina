import Page from 'flarum/components/Page';
import Button from 'flarum/components/Button';

import EditLinkModal from 'sijad/links/components/EditLinkModal';
import sortLinks from 'sijad/links/utils/sortLinks';

function LinkItem(link) {
  return (
    <li data-id={link.id()}>
      <div className="LinkListItem-info">
        <span className="LinkListItem-name">{link.title()}</span>
        {Button.component({
          className: 'Button Button--link',
          icon: 'pencil',
          onclick: () => app.modal.show(new EditLinkModal({link}))
        })}
      </div>
    </li>
  );
}

export default class LinksPage extends Page {
  view() {
    return (
      <div className="LinksPage">
        <div className="LinksPage-header">
          <div className="container">
            <p>
              {app.translator.trans('sijad-links.admin.links.about_text')}
            </p>
            {Button.component({
              className: 'Button Button--primary',
              icon: 'plus',
              children: app.translator.trans('sijad-links.admin.links.create_button'),
              onclick: () => app.modal.show(new EditLinkModal())
            })}
          </div>
        </div>
        <div className="LinksPage-list">
          <div className="container">
            <div className="LinkItems">
              <label>{app.translator.trans('sijad-links.admin.links.links')}</label>
              <ol className="LinkList">
                {sortLinks(app.store.all('links'))
                  .map(LinkItem)}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  config() {
    this.$('ol')
      .sortable()
      .on('sortupdate', (e, ui) => {
        const order = this.$('.LinkList > li')
          .map(function() {
            return {
              id: $(this).data('id'),
            };
          }).get();

        order.forEach((link, i) => {
          const item = app.store.getById('links', link.id);
          item.pushData({
            attributes: {
              position: i
            }
          });
        });

        app.request({
          url: app.forum.attribute('apiUrl') + '/links/order',
          method: 'POST',
          data: {order}
        });

        m.redraw.strategy('all');
        m.redraw();
      });
  }
}

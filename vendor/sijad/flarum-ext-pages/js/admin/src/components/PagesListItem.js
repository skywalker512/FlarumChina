import Component from 'flarum/Component';
import Button from 'flarum/components/Button';

import EditPageModal from 'sijad/pages/components/EditPageModal';

/**
 * ### Props
 *
 * - `page`
 */
export default class PagesListItem extends Component {
  view() {
    const page = this.props.page;
    const url = app.forum.attribute('baseUrl') + '/p/' + page.id() + '-' + page.slug();
    return (
      <tr key={page.id()}>
        <th>{page.title()}</th>
        <td className="Pages-actions">
          <div className="ButtonGroup">
            {Button.component({
              className: 'Button Button--page-edit',
              icon: 'pencil',
              onclick: () => app.modal.show(new EditPageModal({page}))
            })}
            <a class="Button Button--page-view hasIcon" target="_blank" href={url}>
              <i class="icon fa fa-fw fa-eye Button-icon"></i>
            </a>
            {Button.component({
              className: 'Button Button--danger Button--page-delete',
              icon: 'times',
              onclick: this.delete.bind(this)
            })}
          </div>
        </td>
      </tr>
    );
  }

  delete() {
    if (confirm(app.translator.trans('sijad-pages.admin.edit_page.delete_page_confirmation'))) {
      const page = this.props.page;
      m.redraw.strategy('all');
      page.delete().then(() => m.redraw());
    }
  }
}

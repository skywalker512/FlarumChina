import LinkButton from 'flarum/components/LinkButton';

export default class LinkItem extends LinkButton {
  view() {
    const link = this.props.link;
    return (
      <a
        className='LinksButton Button Button--link'
        target={link.isNewtab() ? '_blank' : ''}
        config={link.isInternal() ? m.route : ''}
        href={link.url()}
        title={link.title()}>
        {link.title()}
      </a>
    );
  }
}

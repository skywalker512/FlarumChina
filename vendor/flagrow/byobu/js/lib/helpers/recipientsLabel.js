import extract from 'flarum/utils/extract';
import recipientLabel from 'flagrow/byobu/helpers/recipientLabel';

export default function recipientsLabel(recipients, attrs = {}) {
  const children = [];
  const link = extract(attrs, 'link');

  attrs.className = 'RecipientsLabel ' + (attrs.className || '');

  if (recipients) {
      recipients.forEach(recipient => {
          children.push(recipientLabel(recipient, {link}));
      });
  } else {
    children.push(recipientLabel());
  }

  return <span {...attrs}>{children}</span>;
}

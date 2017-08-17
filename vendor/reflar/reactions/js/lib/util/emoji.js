export default (reactionOrIdentifier) => {
  const identifier = reactionOrIdentifier.identifier || reactionOrIdentifier;
  const item = emojione.emojioneList[`:${identifier}:`]
  const uc = item && item.uc_base;
  const url = uc && `https://cdn.jsdelivr.net/emojione/assets/png/${uc}.png`;

  return {
    identifier, uc, url,
    type: 'emoji',
  }
}

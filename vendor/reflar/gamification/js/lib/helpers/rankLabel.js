export default function rankLabel(rank, attrs = {}) {
  attrs.style = attrs.style || {};
  attrs.className = 'rankLabel ' + (attrs.className || '');

  const color = rank.color();
  attrs.style.backgroundColor = attrs.style.color = color;
  attrs.className += ' colored';

  return (
    m('span', attrs,
      <span className="rankLabel-text">
        {rank.name()}
      </span>
    )
  );
}
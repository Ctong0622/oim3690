// 👇 The buzzword list. Add your own word (lowercase) to this array to track it.
const BUZZWORDS = [
  'thrive', 'impact', 'cross-functional', 'fast-paced',
  'leverage', 'end-to-end', 'ownership', 'passionate',
  'ambiguity', 'innovative', 'world-class', 'best-in-class',
  'self-starter', 'north star', 'seamless', 'synergy'
];

const BANNER_ID = 'buzzword-banner';
const HIGHLIGHT_CLASS = 'buzzword-highlight';

// Counts how many times each buzzword appears in the page's visible text,
// ignoring capitalization. This runs BEFORE the banner or any highlight spans
// are added, so the extension's own text is never counted.
function countBuzzwords(words) {
  const text = document.body.innerText.toLowerCase();
  const counts = {};
  let total = 0;
  for (const word of words) {
    const occurrences = text.split(word.toLowerCase()).length - 1;
    counts[word] = occurrences;
    total += occurrences;
  }
  return { counts, total };
}

// Wraps every buzzword match inside one text node in a highlight <span>,
// keeping the original letters and capitalization from the page.
function highlightTextNode(node, words) {
  const original = node.nodeValue;
  const lower = original.toLowerCase();

  // Find every match of every word in this text node.
  const matches = [];
  for (const word of words) {
    const needle = word.toLowerCase();
    let from = 0;
    let index;
    while ((index = lower.indexOf(needle, from)) !== -1) {
      matches.push({ start: index, end: index + needle.length });
      from = index + needle.length;
    }
  }
  if (matches.length === 0) return;
  matches.sort((a, b) => a.start - b.start);

  // Rebuild the text node as a mix of plain text and highlighted spans.
  const fragment = document.createDocumentFragment();
  let cursor = 0;
  for (const match of matches) {
    if (match.start < cursor) continue; // overlapping match, already covered
    if (match.start > cursor) {
      fragment.appendChild(document.createTextNode(original.slice(cursor, match.start)));
    }
    const span = document.createElement('span');
    span.className = HIGHLIGHT_CLASS;
    span.textContent = original.slice(match.start, match.end);
    fragment.appendChild(span);
    cursor = match.end;
  }
  if (cursor < original.length) {
    fragment.appendChild(document.createTextNode(original.slice(cursor)));
  }
  node.parentNode.replaceChild(fragment, node);
}

// Walks every text node on the page and highlights buzzwords in each one.
// Script/style tags are skipped, and so is the banner (it doesn't exist yet
// when this runs, since it's added after highlighting).
function highlightBuzzwords(root, words) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parentTag = node.parentNode && node.parentNode.nodeName;
      if (parentTag === 'SCRIPT' || parentTag === 'STYLE') {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  // Collect the nodes first: replacing a node while walking would skip others.
  const textNodes = [];
  let current;
  while ((current = walker.nextNode())) {
    textNodes.push(current);
  }
  for (const node of textNodes) {
    highlightTextNode(node, words);
  }
}

// Builds the banner showing the total score and a per-word breakdown.
function showBanner(total, counts) {
  const banner = document.createElement('div');
  banner.id = BANNER_ID;

  const heading = document.createElement('div');
  heading.id = 'buzzword-banner-total';
  heading.textContent = `Buzzword score: ${total}`;
  banner.appendChild(heading);

  const breakdown = document.createElement('div');
  breakdown.id = 'buzzword-banner-breakdown';
  const parts = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => `${word} (${count})`);
  breakdown.textContent = parts.length ? parts.join(', ') : 'No buzzwords found.';
  banner.appendChild(breakdown);

  document.body.prepend(banner);
}

function main() {
  // Guard against running twice (e.g. if the page re-injects content scripts).
  if (document.getElementById(BANNER_ID)) return;

  const { counts, total } = countBuzzwords(BUZZWORDS);
  highlightBuzzwords(document.body, BUZZWORDS);
  showBanner(total, counts);
}

main();

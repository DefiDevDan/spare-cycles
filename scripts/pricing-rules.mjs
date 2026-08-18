// COMPLIANCE.md red line 3: Task Points are priced by task complexity, never by tokens or quota.
//
// The difficulty is that this project talks about tokens and quota constantly — that is its
// subject. COMPLIANCE.md, GOVERNANCE.md, and most task descriptions mention both. Matching
// the bare words would flag everything, and a check that fires on everything is one people
// learn to click past.
//
// So every pattern here requires the shape of an actual offer: a quantity of quota sitting
// next to a price, or quota being advertised as the thing on sale. Prose *about* the rule
// does not match. Prose *breaking* the rule does.

// Quota, in either language. English keeps a word boundary so `tokens` does not match
// inside `tokenshop`; Chinese must not have one, because `\b` is ASCII-only and fails
// against `额度，` — which silently exempted every Chinese-language offer.
const QUOTA = String.raw`(?:\b(?:tokens?|quota)\b|额度)`
const POINTS = String.raw`(?:\b(?:TP|points?)\b|积分)`
const AMOUNT = String.raw`[\d.]+\s*[kmb万亿]?\s*`

export const PRICING_PATTERNS = [
  {
    id: 'quota-for-points',
    label: 'offering quota in exchange for points',
    re: new RegExp(`${AMOUNT}${QUOTA}[^.。\\n]{0,30}?(?:for|换|=|→|->)\\s*[\\d.]+\\s*${POINTS}`, 'gi'),
  },
  {
    id: 'points-for-quota',
    label: 'offering points in exchange for quota',
    re: new RegExp(`[\\d.]+\\s*${POINTS}[^.。\\n]{0,30}?(?:for|换|=|→|->)\\s*${AMOUNT}${QUOTA}`, 'gi'),
  },
  {
    id: 'per-token-rate',
    label: 'a per-token or per-quota rate',
    re: new RegExp(`(?:[$￥¥][\\d.]*|[\\d.]+\\s*${POINTS})\\s*(?:\\/|per\\s+|每)\\s*[\\d.]*\\s*[kmb万亿]?\\s*${QUOTA}`, 'gi'),
  },
  {
    id: 'quota-on-offer',
    label: 'advertising leftover quota as the thing being traded',
    re: new RegExp(`(?:还剩|剩余|剩下|用不完|left ?over|have)\\s*[^.。\\n]{0,20}?${AMOUNT}${QUOTA}[^.。\\n]{0,40}?(?:谁要|谁需要|who wants|available|出售|转让|卖)`, 'gi'),
  },
]

/** @returns {Array<{ruleId: string, label: string, line: number, excerpt: string}>} */
export function scanPricing(text) {
  const hits = []
  for (const pattern of PRICING_PATTERNS) {
    const re = new RegExp(pattern.re.source, pattern.re.flags)
    let match
    while ((match = re.exec(text)) !== null) {
      if (match[0] === '') {
        re.lastIndex++
        continue
      }
      hits.push({
        ruleId: pattern.id,
        label: pattern.label,
        line: text.slice(0, match.index).split('\n').length,
        excerpt: match[0].trim().slice(0, 80),
      })
    }
  }
  return hits.sort((a, b) => a.line - b.line)
}

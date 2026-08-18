#!/usr/bin/env node
// COMPLIANCE.md: "Human-review attestation — required checkbox in the PR template, CI fails
// if unchecked."
//
// Scope worth being clear about: this only covers pull requests to *this* repository. A
// delivery PR goes to the requester's own repo, where this workflow has no reach. There the
// attestation rides on the `/done` comment, which a bot will check once one exists. Until
// then that half is on the honour system and COMPLIANCE.md says so.

const REQUIRED = [
  { id: 'reviewed', match: /reviewed every line of this change myself/i },
  { id: 'own-account', match: /own subscription account and shared no credentials/i },
  { id: 'no-routing', match: /did not route anyone else's requests/i },
  { id: 'no-secrets', match: /contains no credentials, API keys, tokens, or secrets/i },
]

const body = process.env.BODY ?? ''

if (!body.trim()) {
  console.log('::error::Pull request body is empty. The attestation in the PR template is required.')
  process.exit(1)
}

/** A line is a ticked box when it starts with `- [x]`. `- [ ]` and prose do not count. */
function isTicked(line) {
  return /^\s*[-*]\s*\[\s*[xX]\s*\]/.test(line)
}

const lines = body.split('\n')
const missing = []

for (const item of REQUIRED) {
  const line = lines.find((l) => item.match.test(l))
  if (!line) missing.push(`${item.id}: the statement is not in the body at all`)
  else if (!isTicked(line)) missing.push(`${item.id}: present but not ticked`)
}

if (missing.length) {
  console.log('::error::Attestation incomplete. See COMPLIANCE.md.')
  for (const m of missing) console.log(`::error::  ${m}`)
  console.error(
    '\nThe attestation is a statement of fact, not a formality. AI wrote much of this repository\n' +
      'too — that is fine and expected. What is not fine is shipping output nobody read.\n\n' +
      'If a line does not apply to you, say so in the PR rather than ticking it.',
  )
  process.exit(1)
}

console.log(`All ${REQUIRED.length} attestation statements are present and ticked.`)

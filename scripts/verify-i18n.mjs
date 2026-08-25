#!/usr/bin/env node
/**
 * Checks that a deployed environment actually loaded its translations.
 *
 * Usage:
 *   node scripts/verify-i18n.mjs https://testnet.kleverscan.org
 *
 * For an environment behind basic auth, pass the credentials through the
 * environment rather than the command line, where they would survive in
 * shell history and show up in process listings and CI logs:
 *   VERIFY_I18N_AUTH=user:password node scripts/verify-i18n.mjs <url>
 *
 * Exits non-zero when a page renders keys instead of text, so it can gate a
 * release.
 *
 * Why this exists as its own check: the failure it looks for raises nothing.
 * next-i18next resolves the locale folder against the server's working
 * directory, so an environment that starts the process elsewhere loads every
 * namespace empty, logs nothing, and serves pages that render their own keys.
 * Many keys in this app are the English sentence they stand for
 * ("Total Accounts"), so half of such a page still reads correctly and the
 * failure hides in plain sight. It went unnoticed across three environments.
 * Unit tests cannot see it either: locally the working directory is always
 * the project root.
 */

const [, , baseArg] = process.argv;
const credentials = process.env.VERIFY_I18N_AUTH;

if (!baseArg) {
  console.error('usage: node scripts/verify-i18n.mjs <base-url>');
  console.error('       VERIFY_I18N_AUTH=user:password for basic auth');
  process.exit(2);
}

const base = baseArg.replace(/\/$/, '');

/** Pages chosen because each loads namespaces and renders dotted keys. */
const PAGES = ['/', '/accounts', '/transactions', '/assets'];

/** Generous for a server-rendered page, short enough to fail a stuck one. */
const REQUEST_TIMEOUT_MS = 20_000;

/**
 * Keys that read as a path rather than as a sentence. These are the ones a
 * reader notices; the rest of the failure is invisible, which is why the
 * store itself is checked as well.
 */
const RAW_KEY =
  />(?:Titles|Cards|Filters|Buttons|AccountsPage|Date)\.[A-Za-z .]+</;

const headers = credentials
  ? { Authorization: `Basic ${Buffer.from(credentials).toString('base64')}` }
  : undefined;

const readNextData = html => {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  return match ? JSON.parse(match[1]) : null;
};

const failures = [];
let localePath = null;
let buildId = null;

for (const page of PAGES) {
  const url = `${base}${page}`;
  let html;
  try {
    // The signal covers reading the body too, not just the headers: a
    // response that stalls halfway would otherwise hang this check instead
    // of failing it, which is the worse outcome for something meant to gate
    // a release.
    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      failures.push(`${page}: HTTP ${response.status}`);
      continue;
    }
    html = await response.text();
  } catch (error) {
    failures.push(`${page}: request failed (${error.message})`);
    continue;
  }

  const data = readNextData(html);
  if (!data) {
    failures.push(`${page}: no __NEXT_DATA__ in the response`);
    continue;
  }

  buildId = data.buildId;
  const i18n = data?.props?.pageProps?._nextI18Next;

  // A page that loads no namespaces translates nothing, which is a choice,
  // not a fault: it has no keys to resolve.
  if (!i18n) continue;

  localePath = i18n?.userConfig?.localePath ?? localePath;
  const store = i18n?.initialI18nStore?.en ?? {};

  // Checked against the namespaces the page itself asked for, not against
  // the ones that happen to be in the store: a store that is missing
  // altogether has nothing to iterate, so counting only what is present
  // would let the very failure this script exists for pass silently. Reading
  // the page's own list also means this needs no table to maintain here.
  const requested = i18n?.ns ?? [];
  const unresolved = requested.filter(
    namespace => Object.keys(store[namespace] ?? {}).length === 0,
  );

  if (unresolved.length) {
    failures.push(
      `${page}: namespaces asked for but not loaded: ${unresolved.join(', ')}`,
    );
  }

  const raw = html.match(RAW_KEY);
  if (raw) {
    failures.push(
      `${page}: renders a key instead of text (${raw[0].slice(1, -1)})`,
    );
  }
}

console.log(`base:       ${base}`);
console.log(`buildId:    ${buildId ?? 'unknown'}`);
console.log(`localePath: ${localePath ?? 'unknown'}`);

if (failures.length) {
  console.error('\nTranslations are not loaded:');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error(
    '\nThe files are usually present and the keys usually exist; what fails is',
  );
  console.error(
    'reading them at request time. Check that localePath above is absolute and',
  );
  console.error('points at public/locales inside that image.');
  process.exit(1);
}

console.log(`\nAll ${PAGES.length} pages resolved their translations.`);

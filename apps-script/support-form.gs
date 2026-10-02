/**
 * Ruby Europe — community support form endpoint (Google Apps Script web app).
 *
 * Every request from rubyeurope.com/support:
 *   1. is appended to the "Requests" sheet of the spreadsheet this script is bound to,
 *   2. becomes a page in the Notion database "Community Support Requests",
 *   3. is emailed to the team, with Reply-To set to the person who asked.
 * A request counts as received when at least one of the three succeeds.
 *
 * Setup and deployment: docs/support-form.md
 *
 * Script properties (Project settings → Script properties):
 *   NOTION_TOKEN        secret of the Notion internal integration
 *   NOTION_DATABASE_ID  id of the "Community Support Requests" database
 *   NOTIFY_TO           comma-separated recipients, e.g. contact@rubyeurope.com
 *   TURNSTILE_SECRET    optional; when set, a valid Cloudflare Turnstile token is required
 *   SPREADSHEET_ID      optional; only needed if the script is not bound to the sheet
 *
 * Field names follow worker/grant-form.js so the site can use either backend.
 */

const SHEET_NAME = 'Requests';
const HEADERS = [
  'Received', 'Name', 'Email', 'City & country', 'Meetup or group', 'Stage',
  'Help needed', 'Details', 'Funding (EUR)', 'Meetup page', 'Status', 'Notion page', 'Source'
];
const STAGES = {
  'New meetup - starting from scratch': 'New',
  'Existing meetup - already running': 'Existing',
  'Restarting a meetup - bringing it back': 'Restarting'
};
const SUPPORT = {
  'Finding a venue or host': 'Venue or host',
  'Finding a speaker': 'Speaker',
  'Funding': 'Funding',
  'Getting a group started / Promotion': 'Getting started',
  'Something else (describe)': 'Something else'
};

/** Opening the web app URL in a browser shows this, which is a quick deployment check. */
function doGet() {
  return json({ ok: true, service: 'ruby-europe-support-form' });
}

function doPost(e) {
  const params = (e && e.parameter) || {};
  const lists = (e && e.parameters) || {};
  const props = PropertiesService.getScriptProperties();

  // Honeypot: the "website" field is hidden from people, so only bots fill it in.
  if (params.website) return json({ ok: true });

  let request;
  try {
    request = validate(params, lists);
  } catch (error) {
    return json({ ok: false, error: error.message });
  }

  const turnstileSecret = props.getProperty('TURNSTILE_SECRET');
  if (turnstileSecret && !turnstileOk(params['cf-turnstile-response'], turnstileSecret)) {
    return json({ ok: false, error: 'The verification did not pass. Please try again.' });
  }

  let received = false;
  let row = null;
  let notionUrl = '';

  try {
    row = appendRow(request, props);
    received = true;
  } catch (error) {
    console.error('Sheet failed: ' + error);
  }

  try {
    notionUrl = createNotionPage(request, props);
    if (notionUrl) received = true;
  } catch (error) {
    console.error('Notion failed: ' + error);
  }

  if (row && notionUrl) {
    row.sheet.getRange(row.index, HEADERS.indexOf('Notion page') + 1).setValue(notionUrl);
  }

  try {
    if (notify(request, notionUrl, props)) received = true;
  } catch (error) {
    console.error('Email failed: ' + error);
  }

  if (!received) {
    return json({ ok: false, error: 'Your request could not be saved.' });
  }
  return json({ ok: true });
}

function validate(params, lists) {
  const request = {
    name: clean(params.name, 100),
    email: clean(params.email, 200),
    location: clean(params.location, 160),
    community: clean(params.community_name, 160),
    stage: clean(params.stage, 100),
    support: (lists.support || []).map((value) => clean(value, 100)).filter((value) => SUPPORT[value]),
    idea: clean(params.meetup_idea, 3000),
    amount: clean(params.funding_amount, 3),
    url: clean(params.meetup_url, 500),
    source: clean(params.source, 100)
  };

  if (!request.name || !request.location || !request.idea) {
    throw new Error('Please fill in all required fields.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!STAGES[request.stage]) {
    throw new Error('Please choose what stage your meetup is at.');
  }
  if (request.support.length === 0) {
    throw new Error('Please pick at least one kind of help.');
  }
  if (request.amount) {
    const amount = Number(request.amount);
    if (!Number.isInteger(amount) || amount < 1 || amount > 300) {
      throw new Error('Funding must be a whole number between 1 and 300.');
    }
    request.amount = amount;
  } else {
    request.amount = null;
  }
  if (request.url && !/^https?:\/\/\S+$/i.test(request.url)) {
    throw new Error('Please enter the full link, starting with https://.');
  }
  return request;
}

function appendRow(request, props) {
  const spreadsheetId = props.getProperty('SPREADSHEET_ID');
  const spreadsheet = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      cell(request.name),
      cell(request.email),
      cell(request.location),
      cell(request.community),
      STAGES[request.stage],
      request.support.map((value) => SUPPORT[value]).join(', '),
      cell(request.idea),
      request.amount === null ? '' : request.amount,
      cell(request.url),
      'New',
      '',
      cell(request.source)
    ]);
    return { sheet: sheet, index: sheet.getLastRow() };
  } finally {
    lock.releaseLock();
  }
}

function createNotionPage(request, props) {
  const token = props.getProperty('NOTION_TOKEN');
  const databaseId = props.getProperty('NOTION_DATABASE_ID');
  if (!token || !databaseId) return '';

  const payload = {
    parent: { database_id: databaseId },
    properties: {
      'Name': { title: richText(request.name) },
      'Status': { select: { name: 'New' } },
      'Email': { email: request.email },
      'City & country': { rich_text: richText(request.location) },
      'Meetup or group': { rich_text: richText(request.community) },
      'Stage': { select: { name: STAGES[request.stage] } },
      'Help needed': { multi_select: request.support.map((value) => ({ name: SUPPORT[value] })) },
      'Details': { rich_text: richText(request.idea) },
      'Funding (EUR)': { number: request.amount },
      'Meetup page': { url: request.url || null }
    },
    children: [{ object: 'block', type: 'paragraph', paragraph: { rich_text: richText(request.idea) } }]
  };

  const response = UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token, 'Notion-Version': '2022-06-28' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  if (response.getResponseCode() >= 300) {
    throw new Error(response.getResponseCode() + ' ' + response.getContentText().slice(0, 500));
  }
  return JSON.parse(response.getContentText()).url || '';
}

function notify(request, notionUrl, props) {
  const to = props.getProperty('NOTIFY_TO');
  if (!to) return false;

  const fields = [
    ['Name', request.name],
    ['Email', request.email],
    ['City & country', request.location],
    ['Meetup or group', request.community || '-'],
    ['Stage', STAGES[request.stage]],
    ['Help needed', request.support.map((value) => SUPPORT[value]).join(', ')],
    ['Funding (EUR)', request.amount === null ? '-' : String(request.amount)],
    ['Meetup page', request.url || '-']
  ];
  const plain = fields.map((f) => f[0] + ': ' + f[1]).join('\n') + '\n\n' + request.idea +
    (notionUrl ? '\n\nNotion: ' + notionUrl : '') + '\n\nReply to this email to answer ' + request.name + ' directly.';
  const html =
    '<p>A new request came in through rubyeurope.com/support.</p>' +
    '<table cellpadding="4" style="border-collapse:collapse">' +
    fields.map((f) => '<tr><td style="color:#5a5769">' + escapeHtml(f[0]) + '</td><td>' + escapeHtml(f[1]) + '</td></tr>').join('') +
    '</table>' +
    '<p style="white-space:pre-wrap">' + escapeHtml(request.idea) + '</p>' +
    (notionUrl ? '<p><a href="' + escapeHtml(notionUrl) + '">Open it in Notion</a></p>' : '') +
    '<p>Reply to this email to answer ' + escapeHtml(request.name) + ' directly.</p>';

  MailApp.sendEmail({
    to: to,
    replyTo: request.email,
    name: 'Ruby Europe support form',
    subject: 'Support request: ' + (request.community || 'new meetup') + ', ' + request.location,
    body: plain,
    htmlBody: html
  });
  return true;
}

function turnstileOk(token, secret) {
  if (!token) return false;
  const response = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true
  });
  try {
    return JSON.parse(response.getContentText()).success === true;
  } catch (error) {
    return false;
  }
}

/**
 * Run this once from the editor after setting the script properties. It asks
 * for the permissions the script needs and sends one request marked TEST
 * through all three channels. Delete the test row and Notion page afterwards.
 */
function sendTestRequest() {
  const result = doPost({
    parameter: {
      name: 'TEST - Ruby Europe setup',
      email: Session.getEffectiveUser().getEmail(),
      location: 'Kraków, Poland',
      community_name: 'Test meetup',
      stage: 'Existing meetup - already running',
      meetup_idea: 'Test request sent from the Apps Script editor. Safe to delete.',
      funding_amount: '250',
      meetup_url: 'https://rubyeurope.com',
      source: 'apps-script editor'
    },
    parameters: { support: ['Finding a speaker', 'Funding'] }
  });
  console.log(result.getContent());
}

function clean(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
}

/** Stops text that starts with = + - or @ from being read as a spreadsheet formula. */
function cell(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function richText(value) {
  const chunks = [];
  for (let i = 0; i < value.length; i += 2000) {
    chunks.push({ type: 'text', text: { content: value.slice(i, i + 2000) } });
  }
  return chunks;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

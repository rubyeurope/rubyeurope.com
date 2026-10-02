# Community support form: setup

The form on `/support/` posts to a Google Apps Script web app
(`apps-script/support-form.gs`). For every request the script:

1. appends a row to the **Requests** sheet of the spreadsheet it is bound to,
2. creates a page in the Notion database **Community Support Requests**
   (under Ruby Europe), with Status = New,
3. emails the team, with Reply-To set to the person who asked, so replying
   to the email answers them directly.

A request counts as received when at least one of the three succeeds. The
site shows the thank-you state only after the script answers `{"ok": true}`;
otherwise it shows the error and points people to contact@rubyeurope.com.

Nothing secret lives in this repository. The endpoint URL is public by nature;
the Notion token and the database id are script properties.

## One-time setup (about 20 minutes)

### 1. Spreadsheet and script

1. In Google Drive, on the account that will own the script, create a spreadsheet, e.g.
   *Ruby Europe — support requests*. The script creates the **Requests** tab
   and its header row on the first request.
2. In the spreadsheet: **Extensions → Apps Script**. Replace the contents of
   `Code.gs` with `apps-script/support-form.gs` and save.

### 2. Notion integration

1. Go to <https://www.notion.so/my-integrations> → **New integration**.
   Type: internal. Name: *Ruby Europe website*. Capabilities: read content,
   insert content. Copy the **Internal Integration Secret**.
2. Open the **Community Support Requests** database in Notion →
   **•••** → **Connections** → add *Ruby Europe website*.
3. Copy the database id: the 32-character part of the database URL, before
   any `?`.

### 3. Script properties

In Apps Script: **Project settings → Script properties**, add:

| Property             | Value                                                 |
| -------------------- | ----------------------------------------------------- |
| `NOTION_TOKEN`       | the integration secret                                |
| `NOTION_DATABASE_ID` | the database id                                       |
| `NOTIFY_TO`          | `contact@rubyeurope.com` (comma-separate for several) |
| `TURNSTILE_SECRET`   | optional, see below                                   |

### 4. Test from the editor

Select `sendTestRequest` and press **Run**. Google asks for permission to use
the spreadsheet, send email and call external services; allow it. Check that
a row, a Notion page and an email arrived, then delete the test row and page.
Errors show up under **Executions**.

### 5. Deploy

**Deploy → New deployment → Web app**:

- Execute as: **Me**
- Who has access: **Anyone**

Copy the web app URL (it ends in `/exec`). Opening it in a browser should show
`{"ok":true,"service":"ruby-europe-support-form"}`.

If **Anyone** is not offered, the Google Workspace admin has to allow sharing
Apps Script web apps outside the organisation.

### 6. Connect the site

Set the URL in `_config.yml`:

```yaml
support_form_endpoint: "https://script.google.com/macros/s/…/exec"
```

Commit to `main`; the Pages workflow deploys it. Send one real request through
the live form to confirm.

## Changing the script later

Edit the code, then **Deploy → Manage deployments → edit → Version: New
version**. The URL stays the same. A new deployment (instead of a new version)
gets a new URL, which would then have to go into `_config.yml`.

## Spam

The form has a hidden `website` field; bots fill it in and the script drops
those requests while answering "ok". If spam gets through anyway, turn on
Cloudflare Turnstile: create a widget for rubyeurope.com in Cloudflare, put the
site key in `_config.yml` (`turnstile_site_key`) and the secret in the script
property `TURNSTILE_SECRET`.

## The Cloudflare Worker alternative

`worker/grant-form.js` (from #27) accepts the same field names and writes to a
Google Sheet through a service account, with Turnstile required. To use it
instead, deploy it with `wrangler`, set `support_form_endpoint` to its route and
`turnstile_site_key` / `turnstile_action: grant-application`. It does not write
to Notion or send email yet.

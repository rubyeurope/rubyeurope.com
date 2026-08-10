const FORM_PATH = "/api/grant-applications";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const MAX_REQUEST_BYTES = 64 * 1024;
const HEADERS = [
  "Submitted at",
  "Application ID",
  "Name",
  "Email",
  "City & country",
  "Community name",
  "Stage",
  "Support needed",
  "Other support",
  "Meetup idea",
  "Funding requested (EUR)",
  "Planned date",
  "Meetup URL",
];

let cachedGoogleToken;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const formPath = `${env.BASE_PATH}${FORM_PATH}`;

    if (url.pathname !== formPath)
      return new Response("Not found", { status: 404 });
    if (request.method === "OPTIONS") return corsResponse(request, env);
    if (request.method !== "POST") {
      return jsonResponse(
        { error: "Method not allowed" },
        { status: 405, request, env },
      );
    }

    return submitApplication(request, env);
  },
};

async function submitApplication(request, env) {
  try {
    validateOrigin(request, env);
    validateContentLength(request);

    const formData = await request.formData();

    if (formData.get("website")) {
      return jsonResponse({ ok: true }, { request, env });
    }

    const application = validateApplication(formData);
    await validateTurnstile({ request, formData, env });
    await appendApplication({ application, env });

    return jsonResponse({ ok: true }, { request, env });
  } catch (error) {
    const status = error instanceof SubmissionError ? error.status : 500;
    const message =
      error instanceof SubmissionError
        ? error.message
        : "The application could not be saved.";

    if (!(error instanceof SubmissionError)) {
      console.error("Grant application failed", error);
    }

    return jsonResponse({ error: message }, { status, request, env });
  }
}

function validateOrigin(request, env) {
  if (request.headers.get("Origin") !== env.ALLOWED_ORIGIN) {
    throw new SubmissionError(
      "This form is not available from this origin.",
      403,
    );
  }
}

function validateContentLength(request) {
  const contentLength = Number(request.headers.get("Content-Length") || 0);

  if (contentLength > MAX_REQUEST_BYTES) {
    throw new SubmissionError("The application is too large.", 413);
  }
}

export function validateApplication(formData) {
  const support = formData
    .getAll("support")
    .map((value) => cleanText(value, 100))
    .filter(Boolean);
  const application = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    name: requiredText(formData, "name", 100),
    email: requiredText(formData, "email", 200),
    location: requiredText(formData, "location", 160),
    communityName: optionalText(formData, "community_name", 160),
    stage: requiredText(formData, "stage", 100),
    support,
    otherSupport: optionalText(formData, "other_support", 300),
    meetupIdea: requiredText(formData, "meetup_idea", 3000),
    fundingAmount: optionalText(formData, "funding_amount", 3),
    plannedDate: optionalText(formData, "planned_date", 7),
    meetupUrl: optionalText(formData, "meetup_url", 500),
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) {
    throw new SubmissionError("Enter a valid email address.", 422);
  }

  if (support.length === 0) {
    throw new SubmissionError("Select at least one kind of support.", 422);
  }

  validateChoice(application.stage, [
    "New meetup - starting from scratch",
    "Existing meetup - already running",
    "Restarting a meetup - bringing it back",
  ]);

  if (application.fundingAmount) {
    const amount = Number(application.fundingAmount);

    if (!Number.isInteger(amount) || amount < 1 || amount > 300) {
      throw new SubmissionError(
        "Funding must be a whole number between 1 and 300.",
        422,
      );
    }
  }

  if (application.meetupUrl) {
    try {
      const url = new URL(application.meetupUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      throw new SubmissionError("Enter a valid meetup or social URL.", 422);
    }
  }

  return application;
}

async function validateTurnstile({ request, formData, env }) {
  const token = formData.get("cf-turnstile-response");

  if (!token) {
    throw new SubmissionError("Complete the verification and try again.", 422);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: request.headers.get("CF-Connecting-IP"),
    }),
  });
  const result = await response.json();

  if (
    !result.success ||
    result.hostname !== env.EXPECTED_HOSTNAME ||
    result.action !== "grant-application"
  ) {
    throw new SubmissionError("Verification failed. Please try again.", 422);
  }
}

async function appendApplication({ application, env }) {
  const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const accessToken = await getGoogleAccessToken(credentials);
  const range = encodeURIComponent(`'${env.SHEET_NAME}'!A:M`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${env.SPREADSHEET_ID}` +
    `/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      majorDimension: "ROWS",
      values: [applicationRow(application)],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Sheets returned ${response.status}: ${body}`);
  }
}

function applicationRow(application) {
  return [
    application.submittedAt,
    application.id,
    application.name,
    application.email,
    application.location,
    application.communityName,
    application.stage,
    application.support.join(", "),
    application.otherSupport,
    application.meetupIdea,
    application.fundingAmount,
    application.plannedDate,
    application.meetupUrl,
  ];
}

async function getGoogleAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);

  if (cachedGoogleToken?.expiresAt > now + 60) {
    return cachedGoogleToken.value;
  }

  const assertion = await createGoogleAssertion(credentials, now);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const response = await fetch(GOOGLE_TOKEN_URL, { method: "POST", body });
  const result = await response.json();

  if (!response.ok || !result.access_token) {
    throw new Error(`Google authentication returned ${response.status}`);
  }

  cachedGoogleToken = {
    value: result.access_token,
    expiresAt: now + Number(result.expires_in || 3600),
  };

  return cachedGoogleToken.value;
}

async function createGoogleAssertion(credentials, now) {
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: GOOGLE_SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsignedToken = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(credentials.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedToken),
  );

  return `${unsignedToken}.${base64Url(signature)}`;
}

function requiredText(formData, name, maxLength) {
  const value = optionalText(formData, name, maxLength);

  if (!value) {
    throw new SubmissionError("Complete all required fields.", 422);
  }

  return value;
}

function optionalText(formData, name, maxLength) {
  return cleanText(formData.get(name), maxLength);
}

function cleanText(value, maxLength) {
  return String(value || "")
    .trim()
    .slice(0, maxLength);
}

function validateChoice(value, choices) {
  if (!choices.includes(value)) {
    throw new SubmissionError("Select a valid meetup stage.", 422);
  }
}

function corsResponse(request, env) {
  validateOrigin(request, env);
  return new Response(null, {
    status: 204,
    headers: corsHeaders(env),
  });
}

function jsonResponse(body, { status = 200, request, env }) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });

  if (request.headers.get("Origin") === env.ALLOWED_ORIGIN) {
    for (const [name, value] of Object.entries(corsHeaders(env))) {
      headers.set(name, value);
    }
  }

  return new Response(JSON.stringify(body), { status, headers });
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const bytes = Uint8Array.from(atob(base64), (character) =>
    character.charCodeAt(0),
  );
  return bytes.buffer;
}

function base64Url(value) {
  const bytes =
    typeof value === "string"
      ? new TextEncoder().encode(value)
      : new Uint8Array(value);
  let binary = "";

  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

class SubmissionError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "SubmissionError";
    this.status = status;
  }
}

export { HEADERS };

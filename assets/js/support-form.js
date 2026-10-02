/* Community support form. Native validation runs first; this adds the
   "at least one kind of help" rule and sends the request to the endpoint set
   in _config.yml (support_form_endpoint). The endpoint answers with JSON:
   { "ok": true } or { "ok": false, "error": "message for the person" }. */
(function () {
  var form = document.getElementById('support-form');
  if (!form) return;
  var done = document.getElementById('support-done');
  var helpError = document.getElementById('help-error');
  var status = document.getElementById('form-status');
  var button = form.querySelector('button[type="submit"]');
  var buttonLabel = button.textContent;
  var boxes = form.querySelectorAll('input[name="support"]');
  var endpoint = (form.getAttribute('data-endpoint') || '').trim();
  var email = 'contact@rubyeurope.com';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function anyChecked() {
    for (var i = 0; i < boxes.length; i++) if (boxes[i].checked) return true;
    return false;
  }
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('change', function () { if (anyChecked()) helpError.hidden = true; });
  }
  function showStatus(message) { status.textContent = message; status.hidden = false; }
  function showDone() {
    form.hidden = true;
    done.hidden = false;
    done.querySelector('h3').focus();
    done.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }
  function reset() {
    button.disabled = false;
    button.textContent = buttonLabel;
    if (window.turnstile) window.turnstile.reset();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    status.hidden = true;
    if (!anyChecked()) { helpError.hidden = false; boxes[0].focus(); return; }
    if (form.hasAttribute('data-demo')) { showDone(); return; }
    if (!/^(https:\/\/|\/)/.test(endpoint)) {
      showStatus("This form isn't connected yet. Please email " + email + " and we'll take it from there.");
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending…';
    fetch(endpoint, {
      method: 'POST',
      body: new URLSearchParams(new FormData(form)),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          if (!response.ok || data.ok !== true) throw new Error(data.error || '');
        });
      })
      .then(showDone)
      .catch(function (error) {
        var detail = error && error.message ? error.message + ' ' : '';
        showStatus(detail + "We couldn't send your request. Please try again, or email " + email + '.');
        reset();
      });
  });
})();

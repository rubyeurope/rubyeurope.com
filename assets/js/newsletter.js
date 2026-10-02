/* Newsletter sign-up, straight to the existing Mailchimp list.
   With JavaScript the sign-up happens in place through Mailchimp's JSONP
   endpoint; without it the form posts to Mailchimp in a new tab. */
(function () {
  var form = document.querySelector('[data-newsletter]');
  if (!form) return;
  var status = document.getElementById('nl-status');
  var button = form.querySelector('button[type="submit"]');
  var action = form.getAttribute('action') || '';

  function textOf(html) {
    if (!html) return '';
    var doc = new DOMParser().parseFromString(String(html).replace(/^\d+ - /, ''), 'text/html');
    return (doc.body.textContent || '').trim();
  }
  function show(message, isError) {
    status.textContent = message;
    status.classList.toggle('error', !!isError);
    status.hidden = false;
  }

  form.addEventListener('submit', function (event) {
    if (form.hasAttribute('data-demo')) { event.preventDefault(); form.hidden = true; show("Thanks, you're on the list."); return; }
    if (action.indexOf('list-manage.com/subscribe/post') === -1) return;
    event.preventDefault();

    var callback = 'rubyEuropeNewsletter' + Date.now();
    var params = new URLSearchParams(new FormData(form));
    params.set('c', callback);
    var script = document.createElement('script');
    var timer = setTimeout(function () { finish(null); }, 10000);

    function finish(data) {
      clearTimeout(timer);
      try { delete window[callback]; } catch (e) { window[callback] = undefined; }
      script.remove();
      button.disabled = false;
      if (data && data.result === 'success') {
        form.hidden = true;
        show(textOf(data.msg) || "Thanks, you're on the list.");
      } else {
        show(textOf(data && data.msg) || "That didn't go through. Please try again in a moment.", true);
      }
    }

    window[callback] = finish;
    script.onerror = function () { finish(null); };
    script.src = action.replace('/subscribe/post?', '/subscribe/post-json?') + '&' + params.toString();
    button.disabled = true;
    status.hidden = true;
    document.head.appendChild(script);
  });
})();

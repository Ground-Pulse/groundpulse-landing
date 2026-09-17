/* GroundPulse landing page — the hero record is playable.
   Open a flagged item, read what the inspector found, then approve or decline.
   Approving walks the repair through the same four stages the real tracker uses. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── opening and closing a flagged checklist item ───────────────────── */

  var triggers = Array.prototype.slice.call(document.querySelectorAll('button.item'));
  var hint = document.getElementById('record-hint');

  function closeAll(except) {
    triggers.forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = true;
    });
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;

      var wasOpen = trigger.getAttribute('aria-expanded') === 'true';
      closeAll(trigger);
      trigger.setAttribute('aria-expanded', wasOpen ? 'false' : 'true');
      panel.hidden = wasOpen;
      if (hint) hint.hidden = !wasOpen;

      /* Keep the decision on screen — the drawer is taller than the fold. */
      if (!wasOpen) {
        panel.scrollIntoView({
          block: 'nearest',
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  /* ── the owner's decision ───────────────────────────────────────────── */

  var STAGES = ['Requested', 'Assigned', 'In progress', 'Completed'];

  function stageMarkup(doneCount) {
    return '<ol class="stages">' + STAGES.map(function (name, i) {
      return '<li class="' + (i < doneCount ? 'is-done' : '') + '">' + name + '</li>';
    }).join('') + '</ol>';
  }

  function approved(outcome) {
    outcome.innerHTML =
      '<p class="outcome-line">Repair 0284-1 approved, 18 Sep 11:02</p>' +
      stageMarkup(1) +
      '<p class="outcome-note">Waiting for an admin to assign a verified plumber in Baner.</p>';
    outcome.hidden = false;

    if (reduceMotion) {
      outcome.innerHTML =
        '<p class="outcome-line">Repair 0284-1 approved, 18 Sep 11:02</p>' +
        stageMarkup(2) +
        '<p class="outcome-note"><strong>S. Deshpande</strong>, verified plumber in Baner, ' +
        'accepted the job at 14:40. You will get the after-photos when it closes.</p>';
      return;
    }

    window.setTimeout(function () {
      var note = outcome.querySelector('.outcome-note');
      var stages = outcome.querySelector('.stages');
      if (!note || !stages) return;
      var second = stages.children[1];
      if (second) second.className = 'is-done';
      note.innerHTML = '<strong>S. Deshpande</strong>, verified plumber in Baner, ' +
        'accepted the job at 14:40. You will get the after-photos when it closes.';
    }, 1400);
  }

  function declined(outcome) {
    outcome.innerHTML =
      '<p class="outcome-line is-closed">Issue 0284-1 declined, 18 Sep 11:02</p>' +
      '<p class="outcome-note">Closed without work. Your reason is written to the audit ' +
      'log, and the next inspection will check the same item again.</p>';
    outcome.hidden = false;
  }

  Array.prototype.forEach.call(document.querySelectorAll('.decide'), function (decide) {
    var outcome = decide.parentNode.querySelector('.outcome');

    decide.addEventListener('click', function (event) {
      var button = event.target.closest('[data-act]');
      if (!button || !outcome) return;

      decide.hidden = true;
      if (button.getAttribute('data-act') === 'approve') {
        approved(outcome);
      } else {
        declined(outcome);
      }
    });
  });

  /* ── nav: mark the section you are reading ──────────────────────────── */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var watched = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && watched.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + entry.target.id;
          a.style.color = on ? '#fff' : '';
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    watched.forEach(function (el) { observer.observe(el); });
  }
})();

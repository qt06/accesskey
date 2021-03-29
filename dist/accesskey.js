(function () {
  'use strict';

  function isVisible(t) {
    return !! (!t.hasAttribute('disabled') && t.getAttribute('aria-hidden') !== 'true' && t.offsetParent !== null);
  }

  function gi(i, len, op) {
    let n = op == '+' ? +1 : -1;
    i = i + n;
    if (i >= len) {
      i = 0;
    }
    if (i < 0) {
      i = len - 1;
    }
    return i;
  }

  function _toFocus(el) {
    let tagName = el.tagName.toLowerCase();
    let tagNames = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'form', 'img', 'nav', 'header', 'main', 'footer', 'section', 'aside'];
    if (tagNames.includes(tagName) || (tagName == 'a' && !el.hasAttribute('href'))) {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1');
      }
    }
    el.focus();
  }

  function toFocus(focusSelector, op) {
    let els = [...document.body.querySelectorAll('*')];
    let len = els.length;
    let aeIndex = Math.max(0, els.indexOf(document.activeElement));
    let i = aeIndex == 0 ? 0 : gi(aeIndex, len, op);
    do {
      if (els[i].matches(focusSelector) && isVisible(els[i])) {
        _toFocus(els[i]);
        break;
      }
      i = gi(i, len, op);
    } while ( i != aeIndex );
  }

  function nextFocus(selector) {
    toFocus(selector, '+');
  }

  function previousFocus(selector) {
    toFocus(selector, '-');
  }

  function isIE() {
    return ( !! window.ActiveXObject || "ActiveXObject" in window);
  }

  function accjsMutationObserver(proc, el) {
      let mo = new MutationObserver((records) => {
          proc();
      });
      mo.observe(el, {
          'childList': true,
          'subtree': true
      });
      return mo;
  }
  function accjsProc() {
    document.querySelectorAll('[accesskey]').forEach(function(el) {
      let key = el.getAttribute('accesskey');
  el.removeAttribute('accesskey');
  el.classList.add('accesskey-' + key);
      if (!window.accjsAccesskeys.includes(key)) {
        window.accjsAccesskeys.push(key);
      }
    });
  }

  if (!isIE()) {
    window.accjsAccesskeys = [];
    accjsProc();
    document.addEventListener('keydown',
    function(e) {
      window.accjsAccesskeys.forEach(function(key) {
        let keyCode = key.toUpperCase().charCodeAt();
        if (e.altKey && e.shiftKey && e.keyCode == keyCode) {
          e.preventDefault();
          previousFocus('.accesskey-' + key);
        } else if (e.altKey && e.keyCode == keyCode) {
          e.preventDefault();
          nextFocus('.accesskey-' + key);
        }
      });
    },
    null);
    if(document.querySelectorAll('script[data-accjs-mutation-observer]').length > 0) {
      accjsMutationObserver(accjsProc, document.body);
    }
  }

}());
//# sourceMappingURL=accesskey.js.map

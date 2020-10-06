(function() {
  function isVisible(t) {
    return !! (!t.hasAttribute('disabled') && t.getAttribute('aria-hidden') !== 'true' && t.offsetParent !== null);
  }

  function removeAccesskeyAttribute(selector) {
    document.querySelectorAll(selector).forEach(function(el) {
      el.removeAttribute('accesskey');
    });
  }
  function addClass(selector, clsName) {
    document.querySelectorAll(selector).forEach(function(el) {
      el.classList.add(clsName);
    });
  }
  function toFocus(focusSelector, op) {
    let els = document.all;
    let len = els.length;
    let ae = document.activeElement;
    let aeIndex = 0,
    index = 0;
    for (let i = 0; i < len; i++) {
      if (els[i] == ae) {
        aeIndex = index = i;
        break;
      }
    }
    let i = op == '+' ? index + 1 : index - 1;
    while (i != aeIndex) {
      if (els[i].matches(focusSelector) && isVisible(els[i])) {
        index = i;
        break;
      }
      i = op == '+' ? i + 1 : i - 1;
      if (i >= len) {
        i = 0;
      }
      if (i < 0) {
        i = len - 1;
      }
    }
    let el = els[index];
    let tagName = el.tagName.toLowerCase();
    let pels = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'form', 'img', 'nav', 'header', 'main', 'footer', 'section', 'aside'];
    if (pels.includes(tagName) || (tagName == 'a' && !el.hasAttribute('href'))) {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1');
      }
    }
    el.focus();
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

  if (!isIE()) {
    let els = document.querySelectorAll('[accesskey]');
    let keys = [];
    els.forEach(function(el) {
      let key = el.getAttribute('accesskey');
      if (!keys.includes(key)) {
        keys.push(key);
      }
    });
    keys.forEach(function(key) {
      addClass('[accesskey="' + key + '"]', 'accesskey-' + key);
      removeAccesskeyAttribute('[accesskey="' + key + '"]');
    });

    document.addEventListener('keydown',
    function(e) {
      keys.forEach(function(key) {
        let keyCode = key.toUpperCase().charCodeAt();
        if (e.altKey && e.shiftKey && e.keyCode == keyCode) {
          e.preventDefault();
          previousFocus('.accesskey-' + key);
        }
        else if (e.altKey && e.keyCode == keyCode) {
          e.preventDefault();
          nextFocus('.accesskey-' + key);
        }
      });
    },
    null);
  }

})();

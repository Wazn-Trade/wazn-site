(function () {
  var btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  var root = document.documentElement;
  var sync = function () {
    var dark = root.dataset.theme === 'dark';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.setAttribute('aria-label', dark ? btn.dataset.labelLight : btn.dataset.labelDark);
  };
  btn.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('wazn-theme', next); } catch (e) {}
    sync();
  });
  sync();
})();

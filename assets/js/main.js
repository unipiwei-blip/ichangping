(function () {
  var y = document.querySelectorAll('[data-year]');
  for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();

  var nav = document.querySelector('.nav');
  var btn = document.querySelector('.menu-btn');
  var menu = document.querySelector('.nav-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 页面内锚点定位：等图片与布局稳定后校正一次
  var fixHash = function () {
    if (!location.hash) return;
    var id = decodeURIComponent(location.hash.slice(1));
    var el = document.getElementById(id);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - 96;
    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, Math.max(0, top));
    root.style.scrollBehavior = prev;
  };
  window.addEventListener('load', function () {
    setTimeout(fixHash, 120);
    setTimeout(fixHash, 650);
  });
  window.addEventListener('hashchange', function () { setTimeout(fixHash, 60); });

  var filters = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('#news-grid [data-cat]');
  if (filters.length && cards.length) {
    for (var j = 0; j < filters.length; j++) {
      filters[j].addEventListener('click', function () {
        var f = this.getAttribute('data-filter');
        for (var k = 0; k < filters.length; k++) filters[k].classList.toggle('on', filters[k] === this);
        for (var m = 0; m < cards.length; m++) {
          cards[m].style.display = (f === 'all' || cards[m].getAttribute('data-cat') === f) ? '' : 'none';
        }
      });
    }
  }
})();

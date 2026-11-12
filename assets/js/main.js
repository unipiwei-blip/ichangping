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
  var cards = Array.prototype.slice.call(document.querySelectorAll('#news-grid [data-cat]'));
  var pager = document.getElementById('news-pager');
  if (filters.length && cards.length && pager) {
    var PER_PAGE = 6;
    var currentFilter = 'all';
    var currentPage = 1;

    var render = function () {
      var list = cards.filter(function (c) {
        return currentFilter === 'all' || c.getAttribute('data-cat') === currentFilter;
      });
      var pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      if (currentPage > pages) currentPage = pages;
      var start = (currentPage - 1) * PER_PAGE;
      cards.forEach(function (c) {
        var idx = list.indexOf(c);
        c.style.display = (idx >= start && idx < start + PER_PAGE) ? '' : 'none';
      });
      var html = '<button data-page="prev"' + (currentPage === 1 ? ' disabled' : '') + '>上一页</button>';
      for (var i = 1; i <= pages; i++) {
        html += '<button data-page="' + i + '"' + (i === currentPage ? ' class="on"' : '') + '>' + i + '</button>';
      }
      html += '<button data-page="next"' + (currentPage === pages ? ' disabled' : '') + '>下一页</button>';
      html += '<span class="pager-info">共 ' + list.length + ' 篇 · 第 ' + currentPage + ' / ' + pages + ' 页</span>';
      pager.innerHTML = html;
      var btns = pager.querySelectorAll('button');
      for (var b = 0; b < btns.length; b++) {
        btns[b].addEventListener('click', function () {
          var v = this.getAttribute('data-page');
          if (v === 'prev') currentPage--;
          else if (v === 'next') currentPage++;
          else currentPage = parseInt(v, 10);
          render();
          var grid = document.getElementById('news-grid');
          if (grid && grid.getBoundingClientRect().top < 0) {
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    };
    for (var j = 0; j < filters.length; j++) {
      filters[j].addEventListener('click', function () {
        currentFilter = this.getAttribute('data-filter');
        currentPage = 1;
        for (var k = 0; k < filters.length; k++) filters[k].classList.toggle('on', filters[k] === this);
        render();
      });
    }
    render();
  }
})();

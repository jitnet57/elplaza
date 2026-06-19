/* ============================================================
   인생버킷 · 세부 한달살기 — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- sticky nav ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle) {
    toggle.addEventListener('click', function () { links.classList.toggle('open'); });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- categories ---------- */
  var CAT = {
    yoga:  { label: '요가 테라피',  color: 'var(--cat-yoga)' },
    dance: { label: '라인댄스',     color: 'var(--cat-dance)' },
    eng:   { label: '영어 회화',    color: 'var(--cat-eng)' },
    spa:   { label: '스파·웰니스',  color: 'var(--cat-spa)' },
    free:  { label: '자유 휴식',    color: 'var(--cat-rest)' },
    tour:  { label: '시그니처 투어', color: 'var(--cat-tour)' }
  };

  /* ---------- legend ---------- */
  var legendOrder = ['yoga', 'dance', 'eng', 'spa', 'free', 'tour'];
  var legend = document.getElementById('calLegend');
  if (legend) {
    legendOrder.forEach(function (k) {
      var c = CAT[k];
      var el = document.createElement('span');
      el.className = 'lg';
      el.innerHTML = '<span class="dot" style="background:' + c.color + '"></span>' + c.label;
      legend.appendChild(el);
    });
  }

  /* ---------- 31-day schedule (Mon-start) ---------- */
  // acts: array of {c: catKey, t: text}; tour: big tour label; rest: true
  var DAYS = [
    { acts: [{c:'yoga',t:'09:00 요가'},{c:'eng',t:'10:30 영어'},{c:'spa',t:'오후 자유·스파'}] },
    { acts: [{c:'dance',t:'10:00 라인댄스'}] },
    { acts: [{c:'yoga',t:'09:00 요가'},{c:'spa',t:'오후 웰니스 스파'}] },
    { acts: [{c:'dance',t:'10:00 라인댄스'},{c:'free',t:'나른한 자유휴식'}] },
    { acts: [{c:'yoga',t:'09:00 요가'},{c:'spa',t:'오후 웰니스 스파'}] },
    { tour: '역사문화 & 야경', sub: '시티투어' },
    { rest: true, acts: [{c:'free',t:'일요휴식 · 사우나'}] },

    { acts: [{c:'yoga',t:'09:00 요가'},{c:'eng',t:'10:30 영어'},{c:'spa',t:'오후 자유·스파'}] },
    { acts: [{c:'dance',t:'10:00 라인댄스'},{c:'free',t:'예가식당 맛집탐방'}] },
    { acts: [{c:'yoga',t:'09:00 요가'},{c:'spa',t:'오후 웰니스 스파'}] },
    { acts: [{c:'dance',t:'10:00 라인댄스'},{c:'spa',t:'엘네일 관리추천'}] },
    { acts: [{c:'yoga',t:'09:00 요가'},{c:'spa',t:'오후 웰니스 스파'}] },
    { tour: '에메랄드 바다투어', sub: '호핑' },
    { rest: true, acts: [{c:'free',t:'자유 휴식'}] },

    { acts: [{c:'yoga',t:'09:00 요가'},{c:'eng',t:'10:30 영어'},{c:'spa',t:'오후 자유·스파'}] },
    { acts: [{c:'dance',t:'10:00 라인댄스'},{c:'free',t:'오후 수영·사우나'}] },
    { acts: [{c:'yoga',t:'09:00 요가'},{c:'spa',t:'오후 웰니스 스파'}] },
    { acts: [{c:'dance',t:'10:00 라인댄스'},{c:'spa',t:'스파 미리받기'}] },
    { tour: '고속페리 · 로복강', sub: '보홀 D1' },
    { tour: '초콜릿힐 · 리조트', sub: '보홀 D2' },
    { tour: '세부 복귀 · 마사지', sub: '보홀 D3' },

    { acts: [{c:'yoga',t:'09:00 요가'},{c:'eng',t:'10:30 영어'},{c:'spa',t:'오후 자유·스파'}] },
    { acts: [{c:'dance',t:'10:00 라인댄스'},{c:'free',t:'기프트샵 쇼핑'}] },
    { acts: [{c:'yoga',t:'09:00 요가'},{c:'spa',t:'오후 웰니스 스파'}] },
    { acts: [{c:'dance',t:'10:00 라인댄스'},{c:'free',t:'할리스 아메리카노'}] },
    { acts: [{c:'yoga',t:'09:00 요가'},{c:'spa',t:'오후 웰니스 스파'}] },
    { tour: '고래상어 & 폭포', sub: '오슬롭' },
    { rest: true, acts: [{c:'free',t:'자유 휴식'}] },

    { acts: [{c:'yoga',t:'09:00 요가'},{c:'eng',t:'10:30 영어'},{c:'free',t:'체크아웃 패킹'}] },
    { tour: '수료 · 귀국', sub: 'Check-out' }
  ];

  var grid = document.getElementById('calGrid');
  if (grid) {
    // Day 1 is Monday → no leading empties needed (Mon-start grid). 31 days.
    DAYS.forEach(function (d, i) {
      var n = i + 1;
      var dow = i % 7; // 0=Mon ... 5=Sat,6=Sun
      var weekend = dow >= 5;
      var cell = document.createElement('div');
      cell.className = 'day' + (weekend ? ' we' : '') + (d.tour ? ' tour-day' : '') + (d.rest ? ' rest-day' : '');

      var html = '<div class="dn">' + n + '</div>';
      if (d.tour) {
        html += '<div class="acts"><span class="tour-tag">' + d.tour + '</span>';
        if (d.sub) html += '<span class="act" style="opacity:.85">' + d.sub + '</span>';
        html += '</div>';
      } else if (d.acts) {
        html += '<div class="acts">';
        d.acts.forEach(function (a) {
          var col = CAT[a.c] ? CAT[a.c].color : 'var(--cat-rest)';
          html += '<span class="act"><span class="dot" style="background:' + col + '"></span>' + a.t + '</span>';
        });
        html += '</div>';
      }
      cell.innerHTML = html;
      grid.appendChild(cell);
    });
    // trailing empties to complete final week row (31 days → 3 trailing for 7-col)
    var trailing = (7 - (DAYS.length % 7)) % 7;
    for (var t = 0; t < trailing; t++) {
      var e = document.createElement('div');
      e.className = 'day empty';
      grid.appendChild(e);
    }
  }

  /* ---------- included / excluded ---------- */
  var INCLUDED = [
    ['숙박', '콘도텔 30박 · 풀옵션 룸 렌트'],
    ['식사', '30일 조식 기본 포함 (아메리칸 브런치)'],
    ['골프', '필드 골프 1회 라운딩 기본 포함'],
    ['액티비티', '호핑투어 1회 (중식 포함) · 시티투어 1회'],
    ['장거리 투어', '오슬롭 1회 (고프로·안전장비 일체 포함)'],
    ['힐링', '엘스파 마사지 주 2회 (아로마·드라이 90분)'],
    ['문화·레저', '요가 및 라인댄스 클래스 지원'],
    ['교육', '실전 생활영어 교실 주 1회 운영'],
    ['현지 지원', '3팀당 필리핀 어시스턴트 전담 직원 배정'],
    ['생활', '룸 청소 및 빨래 서비스 주 3회 제공']
  ];
  var EXCLUDED = [
    ['항공', '왕복 항공권'],
    ['비자', '관광비자 연장 비용'],
    ['추가 레저', '골프·스킨스쿠버 추가 이용료'],
    ['차량', '기본 일정 외 쇼핑몰·개인 여행 차량비'],
    ['가이드·팁', '여행지 가이드 비용 및 현지 서비스 팁'],
    ['업그레이드', '마사지 업그레이드 선택 시 추가 비용'],
    ['개인 경비', '개인 식비(조식 외) 및 기타 개인 경비']
  ];

  function fillPane(id, data, kind) {
    var pane = document.getElementById(id);
    if (!pane) return;
    data.forEach(function (row) {
      var item = document.createElement('div');
      item.className = 'inc-item ' + kind;
      item.innerHTML = '<span class="ic">' + (kind === 'in' ? '✓' : '–') + '</span>' +
        '<div><b>' + row[0] + '</b><span>' + row[1] + '</span></div>';
      pane.appendChild(item);
    });
  }
  fillPane('paneIn', INCLUDED, 'in');
  fillPane('paneOut', EXCLUDED, 'out');

  var tabIn = document.getElementById('tabIn');
  var tabOut = document.getElementById('tabOut');
  var paneIn = document.getElementById('paneIn');
  var paneOut = document.getElementById('paneOut');
  function selectTab(which) {
    var isIn = which === 'in';
    tabIn.classList.toggle('active', isIn);
    tabOut.classList.toggle('active', !isIn);
    paneIn.classList.toggle('hidden', !isIn);
    paneOut.classList.toggle('hidden', isIn);
  }
  if (tabIn) tabIn.addEventListener('click', function () { selectTab('in'); });
  if (tabOut) tabOut.addEventListener('click', function () { selectTab('out'); });

  /* ---------- lead form ---------- */
  var form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = document.getElementById('formSuccess');
      ok.classList.add('show');
      form.querySelectorAll('input,textarea,select,button').forEach(function (el) {
        if (el.type !== 'submit' && el.tagName !== 'BUTTON') el.value = el.defaultValue || '';
      });
      ok.scrollIntoView ? null : null; // avoid scrollIntoView per guidelines
    });
  }
})();


/* ============================================================
   Photo gallery: category filter + lightbox
   ============================================================ */
(function () {
  'use strict';
  var grid = document.getElementById('galGrid');
  if (!grid) return;
  var items = Array.prototype.slice.call(grid.querySelectorAll('.gal-item'));
  var filters = Array.prototype.slice.call(document.querySelectorAll('.gal-filter'));

  /* ---- filtering ---- */
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-cat');
      items.forEach(function (it) {
        var show = (cat === 'all' || it.getAttribute('data-cat') === cat);
        it.classList.toggle('hide', !show);
      });
      rebuildVisible();
    });
  });

  /* ---- lightbox ---- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var visible = [];
  var idx = 0;

  function rebuildVisible() {
    visible = items.filter(function (it) { return !it.classList.contains('hide'); });
  }
  rebuildVisible();

  function openAt(i) {
    if (!visible.length) return;
    idx = (i + visible.length) % visible.length;
    var img = visible[idx].querySelector('img');
    lbImg.src = img.getAttribute('data-full');
    lbImg.alt = img.alt;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  items.forEach(function (it) {
    it.addEventListener('click', function () {
      rebuildVisible();
      openAt(visible.indexOf(it));
    });
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); openAt(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); openAt(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') openAt(idx - 1);
    else if (e.key === 'ArrowRight') openAt(idx + 1);
  });
})();


/* ============================================================
   Application (이용 신청서) modal
   ============================================================ */
(function () {
  'use strict';
  var modal = document.getElementById('applyModal');
  if (!modal) return;
  var openers = document.querySelectorAll('[data-open-apply]');
  var closeBtn = document.getElementById('applyClose');
  function open(e) { if (e) e.preventDefault(); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function close() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  openers.forEach(function (b) { b.addEventListener('click', open); });
  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  var form = document.getElementById('applyForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = document.getElementById('applySuccess');
      if (ok) ok.classList.add('show');
      setTimeout(function () { form.reset(); }, 120);
    });
  }
})();

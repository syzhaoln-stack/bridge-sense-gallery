(() => {
  'use strict';
  const icons = {
    fit: 'M8 3H3v5m18 0V3h-5M3 16v5h5m8 0h5v-5',
    minus: 'M5 12h14',
    plus: 'M5 12h14m-7-7v14',
    photo: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6',
    shot: 'M3 7h5l2-3h4l2 3h5v13H3z M16 13a4 4 0 1 1-8 0 4 4 0 1 1 8 0',
    exit: 'M5 12h14m-8-8-8 8 8 8',
    type: 'M3 19l5-14 5 14M5 14h6m4 1h7m-3.5-3.5v7'
  };

  function button(label, icon, action) {
    const el = document.createElement('button');
    el.type = 'button';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('capture-button-icon');
    for (const [k, v] of Object.entries({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'aria-hidden': 'true' })) {
      svg.setAttribute(k, v);
    }
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', icons[icon]);
    svg.append(path);
    el.append(svg, document.createTextNode(label));
    el.addEventListener('click', action);
    return el;
  }

  function start() {
    const stage = document.querySelector('[data-capture-stage]');
    const board = stage?.querySelector('[data-capture-board]');
    const toolbar = document.querySelector('[data-capture-toolbar]');
    if (!board || !toolbar || stage.querySelector('[data-capture-frame]')) return;

    const root = document.documentElement;
    const desktop = window.matchMedia('(min-width: 800px)');
    const frame = document.createElement('div');
    frame.setAttribute('data-capture-frame', '');
    board.before(frame);
    frame.append(board);
    toolbar.setAttribute('role', 'group');
    toolbar.setAttribute('aria-label', '展示设置');
    let zoomStep = 0;
    let pendingFrame = 0;
    let idleTimer = 0;
    let inCapture = false;
    let savedScroll = 0;
    let small = false;
    try { small = sessionStorage.getItem('bridge-capture-small') === '1'; } catch {}
    let largeText = false;
    try { largeText = sessionStorage.getItem('bridge-capture-text') === 'large'; } catch {}

    const fit = button('适应屏幕', 'fit', () => { zoomStep = 0; stage.scrollLeft = 0; redraw(); });
    const smaller = button('小一点', 'minus', () => { zoomStep = Math.max(-3, zoomStep - 1); redraw(); });
    const larger = button('大一点', 'plus', () => { zoomStep = Math.min(4, zoomStep + 1); redraw(); });
    const percent = document.createElement('output');
    percent.className = 'capture-percent';
    percent.setAttribute('aria-label', '画幅缩放比例');
    percent.setAttribute('aria-live', 'polite');
    const photo = button('小图模式', 'photo', () => {
      small = !small;
      try { sessionStorage.setItem('bridge-capture-small', small ? '1' : '0'); } catch {}
      redraw();
    });
    const shot = button('截图模式', 'shot', () => changeMode(true, true));
    const textSize = button('大字阅读', 'type', () => {
      largeText = !largeText;
      try { sessionStorage.setItem('bridge-capture-text', largeText ? 'large' : 'normal'); } catch {}
      redraw();
    });
    textSize.title = '只放大作品说明和读图问题';
    shot.className = 'capture-action';
    shot.title = '隐藏导航和控件，按 Esc 可退出';
    toolbar.append(fit, smaller, percent, larger);
    if (!toolbar.hasAttribute('data-capture-no-photo')) toolbar.append(photo, textSize);
    toolbar.append(shot);

    const exit = button('退出截图', 'exit', () => changeMode(false, true));
    exit.className = 'capture-return';
    exit.title = '退出截图模式（Esc）';
    exit.hidden = true;
    document.body.append(exit);

    function redraw() {
      const large = desktop.matches;
      const layout = large ? 'board' : 'flow';
      root.dataset.captureLayout = layout;
      root.dataset.capturePhotos = small ? 'small' : 'normal';
      root.dataset.captureText = largeText ? 'large' : 'normal';
      textSize.setAttribute('aria-pressed', String(largeText));
      root.dataset.captureMode = inCapture ? 'on' : 'off';
      const multiple = 1.2 ** zoomStep;
      let scale = multiple;
      if (large) {
        const css = getComputedStyle(stage);
        const xPad = parseFloat(css.paddingLeft) + parseFloat(css.paddingRight);
        const yPad = parseFloat(css.paddingTop) + parseFloat(css.paddingBottom);
        const top = inCapture ? 0 : Math.max(0, stage.getBoundingClientRect().top + window.scrollY);
        const height = Math.max(100, root.clientHeight - top - yPad - (inCapture ? 0 : 4));
        const width = Math.max(100, stage.clientWidth - xPad);
        scale = Math.min(width / 1600, height / 900) * multiple;
        frame.style.setProperty('--capture-scaled-width', Math.floor(1600 * scale) + 'px');
        frame.style.setProperty('--capture-scaled-height', Math.floor(900 * scale) + 'px');
        frame.style.setProperty('--capture-zoom', String(scale));
      } else {
        frame.style.setProperty('--capture-mobile-zoom', String(multiple));
      }
      const percentage = Math.round(scale * 100) + '%';
      if (percent.textContent !== percentage) percent.textContent = percentage;
      smaller.disabled = zoomStep <= -3;
      larger.disabled = zoomStep >= 4;
      photo.setAttribute('aria-pressed', String(small));
      fit.setAttribute('aria-pressed', String(zoomStep === 0));
    }

    function schedule() {
      if (!pendingFrame) pendingFrame = requestAnimationFrame(() => { pendingFrame = 0; redraw(); });
    }

    function wake() {
      if (!inCapture) return;
      root.removeAttribute('data-capture-idle');
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => root.setAttribute('data-capture-idle', ''), 1700);
    }

    function changeMode(next, updateURL) {
      if (next && !inCapture) savedScroll = window.scrollY;
      inCapture = next;
      if (updateURL) {
        const url = new URL(window.location.href);
        if (next) url.searchParams.set('capture', '1');
        else url.searchParams.delete('capture');
        try { history.replaceState(history.state, '', url); } catch {}
      }
      exit.hidden = !next;
      redraw();
      if (next) {
        window.scrollTo(0, 0);
        stage.scrollLeft = 0;
        wake();
      } else {
        window.clearTimeout(idleTimer);
        root.removeAttribute('data-capture-idle');
        if (updateURL) {
          shot.focus({ preventScroll: true });
          window.scrollTo(0, savedScroll);
        }
      }
    }

    changeMode(new URL(location.href).searchParams.get('capture') === '1', false);
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('popstate', () => changeMode(new URL(location.href).searchParams.get('capture') === '1', false));
    desktop.addEventListener('change', schedule);
    document.addEventListener('pointermove', wake, { passive: true });
    document.addEventListener('pointerdown', wake, { passive: true });
    document.addEventListener('keydown', event => {
      if (!inCapture) return;
      if (event.key === 'Escape' && !event.defaultPrevented && !document.querySelector('dialog[open]')) {
        event.preventDefault();
        changeMode(false, true);
      } else {
        wake();
      }
    });
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(schedule);
      observer.observe(stage);
      observer.observe(toolbar);
    }
    if (document.fonts) document.fonts.ready.then(schedule);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();

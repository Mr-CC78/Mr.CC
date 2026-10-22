/* ==========================================================
   登录页交互脚本
   ========================================================== */

/* ---------- 背景轮播 + 主题色联动 ---------- */
const AUTO_MS = 4000;               // 自动轮播间隔，改成 0 可关闭
let carouselIndex = 0;
let carouselTimer = null;
const inner = document.getElementById('carouselInner');
const items = inner ? inner.querySelectorAll('.card-item') : [];
const dotsBox = document.getElementById('dots');
const captionEl = document.getElementById('caption');


/* 把当前图的主题色写进 CSS 变量 */
function applyTheme(item) {
    const root = document.documentElement;
    root.style.setProperty('--theme', item.dataset.theme);
    root.style.setProperty('--theme-deep', item.dataset.themeDeep);
}

/* 切换场景名：先淡出，再换字，再淡入 */
function applyCaption(text) {
    if (!captionEl) return;
    captionEl.style.opacity = '0';
    setTimeout(function () {
        captionEl.textContent = text;
        captionEl.style.opacity = '1';
    }, 220);
}
function toggleQR(){
    const stage = document.getElementById('loginStage');
    const btn = document.getElementById('qrcodeBtn');
    const isOpen = stage.classList.toggle('is-open');
    btn.classList.toggle('is-active', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
}
function refreshQR(e) {
    e.stopPropagation();                 // 别触发外层收起
    const card = document.querySelector('.qr-card');
    card.style.transform = 'rotate(-8deg) scale(0.94)';
    card.style.opacity = '0.45';
    setTimeout(() => {
        card.style.transform = '';
        card.style.opacity = '';
    }, 320);
}
/* 核心：跳到第 i 张 */
function goCarousel(i) {
    if (!items.length) return;
    carouselIndex = (i + items.length) % items.length;

    inner.style.transform = 'translateX(' + (-carouselIndex * 100) + '%)';

    items.forEach(function (item, idx) {
        item.classList.toggle('active', idx === carouselIndex);
    });

    const dots = dotsBox ? dotsBox.querySelectorAll('.dot') : [];
    dots.forEach(function (d, idx) {
        d.classList.toggle('active', idx === carouselIndex);
    });

    applyTheme(items[carouselIndex]);
    applyCaption(items[carouselIndex].dataset.caption || '');
    restartAuto();
}

/* 上一张 / 下一张 */
function moveCarousel(step) { goCarousel(carouselIndex + step); }
function left()  { goCarousel(carouselIndex - 1); }
function right() { goCarousel(carouselIndex + 1); }

/* ---------- 自动轮播（鼠标停在轮播区时暂停） ---------- */
function startAuto() {
    if (!AUTO_MS || items.length < 2) return;
    stopAuto();
    carouselTimer = setInterval(function () { goCarousel(carouselIndex + 1); }, AUTO_MS);
}
function stopAuto() {
    if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
}
function restartAuto() { stopAuto(); startAuto(); }

const carouselArea = document.querySelector('.carousel-box');
if (carouselArea) {
    carouselArea.addEventListener('mouseenter', stopAuto);
    carouselArea.addEventListener('mouseleave', startAuto);
}

/* 页面切到后台时停掉，省资源 */
document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAuto(); else startAuto();
});

/* ---------- 其他登录方式：展开 / 收起 ---------- */
function chooseSign() {
    const box = document.getElementById('chooseBox');
    const btn = document.querySelector('.choose-text');
    if (!box) return;
    const open = box.classList.toggle('is-open');
    if (btn) btn.setAttribute('aria-expanded', String(open));
}

/* ---------- 点击某个登录圆圈 ---------- */
function pickWay(el) {
    const way = el.dataset.way || '该方式';
    toast('已选择「' + way + '登录」，功能待接入');
}

/* ---------- 图片加载失败兜底 ---------- */
const FALLBACK_TEXT = { '微信': '微', 'QQ': 'Q', '邮箱': '邮', '抖音': '抖' };

document.addEventListener('error', function (e) {
    const t = e.target;
    if (!t || t.tagName !== 'IMG') return;
    const btn = t.closest && t.closest('.circle-btn');
    if (!btn) return;

    t.style.display = 'none';
    const way = btn.dataset.way || '';
    const span = document.createElement('span');
    span.className = 'fallback';
    span.textContent = FALLBACK_TEXT[way] || way.charAt(0) || '?';
    btn.appendChild(span);
    console.warn('[登录页] 图片加载失败：' + t.getAttribute('src') + '，已替换为文字占位');
}, true);   // 捕获阶段，img 的 error 不冒泡

/* ---------- 启动自检 ---------- */
window.addEventListener('load', function () {
    const imgs = document.querySelectorAll('img');
    const bad = [];
    imgs.forEach(function (img) {
        if (img.complete && img.naturalWidth === 0) bad.push(img.getAttribute('src'));
    });
    if (bad.length) {
        console.warn('[登录页] 以下图片未加载成功，请检查路径：', bad);
    } else {
        console.log('[登录页] 所有图片加载正常，共 ' + imgs.length + ' 张');
    }
});

/* ---------- 找回密码 ---------- */
function found() { toast('找回密码：请先联系管理员重置'); }

/* ---------- 输入框清除按钮 ---------- */
document.querySelectorAll('.input-wrap').forEach(function (wrap) {
    var input = wrap.querySelector('.putin-box');
    var btn   = wrap.querySelector('.clear-btn');
    if (!input || !btn) return;

    function sync() { wrap.classList.toggle('has-text', input.value.length > 0); }

    input.addEventListener('input', sync);
    sync();                    // 初始化一次（处理浏览器自动填充）
    setTimeout(sync, 300);     // 自动填充可能稍慢，再补一次

    btn.addEventListener('click', function () {
        input.value = '';
        sync();
        input.focus();
    });
});

/* ---------- 协议勾选 + 登录校验 ---------- */
/* ---------- 点击协议名 ---------- */
function openPolicy(name) { toast('《' + name + '》详情页待接入'); }

/* ---------- 轻量提示 ---------- */
let toastTimer = null;
function toast(text) {
    let el = document.getElementById('miniToast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'miniToast';
        el.style.cssText = [
            'position:fixed', 'left:50%', 'bottom:40px', 'transform:translate(-50%,12px)',
            'background:rgba(0,0,0,.78)', 'color:#fff', 'padding:8px 16px',
            'border-radius:8px', 'font-size:13px', 'z-index:999',
            'opacity:0', 'transition:opacity .25s ease, transform .25s ease',
            'pointer-events:none'
        ].join(';');
        document.body.appendChild(el);
    }
    el.textContent = text;
    requestAnimationFrame(function () {
        el.style.opacity = '1';
        el.style.transform = 'translate(-50%,0)';
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%,12px)';
    }, 1800);
}

/* ---------- 初始化：应用第一张图的主题色并启动自动轮播 ---------- */
if (items.length) applyTheme(items[0]);
startAuto();
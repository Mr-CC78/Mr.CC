/* ==========================================================
   登录页交互脚本
   ========================================================== */

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

/* ---------- 图片加载失败兜底：显示文字占位，圆圈仍可点击 ---------- */
const FALLBACK_TEXT = { '微信': '微', 'QQ': 'Q', '邮箱': '邮' };

document.addEventListener('error', function (e) {
    const t = e.target;
    if (!t || t.tagName !== 'IMG') return;

    // 只处理三个登录圆圈里的图片
    const btn = t.closest && t.closest('.circle-btn');
    if (!btn) return;

    t.style.display = 'none';                       // 藏掉破图
    const way = btn.dataset.way || '';
    const span = document.createElement('span');
    span.className = 'fallback';
    span.textContent = FALLBACK_TEXT[way] || way.charAt(0) || '?';
    btn.appendChild(span);

    console.warn('[登录页] 图片加载失败：' + t.getAttribute('src') + '，已替换为文字占位');
}, true);   // 捕获阶段，img 的 error 不冒泡

/* ---------- 启动自检：把加载失败的资源打印到控制台 ---------- */
window.addEventListener('load', function () {
    const imgs = document.querySelectorAll('img');
    const bad = [];
    imgs.forEach(function (img) {
        // naturalWidth 为 0 说明没加载成功
        if (img.complete && img.naturalWidth === 0) {
            bad.push(img.getAttribute('src'));
        }
    });
    if (bad.length) {
        console.warn('[登录页] 以下图片未加载成功，请检查路径：', bad);
        console.warn('[登录页] 提示：若你是双击 html 用 file:// 打开，请把 "/xxx.png" 改成 "./xxx.png" 相对路径');
    } else {
        console.log('[登录页] 所有图片加载正常，共 ' + imgs.length + ' 张');
    }
});

/* ---------- 找回密码 ---------- */
function found() {
    toast('找回密码：请先联系管理员重置');
}

/* ---------- 轮播：上一张 / 下一张 ---------- */
let carouselIndex = 0;

function moveCarousel(step) {
    const inner = document.querySelector('.carousel-inner');
    if (!inner) return;

    const items = inner.querySelectorAll('.card-item');
    if (!items.length) return;

    carouselIndex = (carouselIndex + step + items.length) % items.length;

    items.forEach(function (item, i) {
        item.classList.toggle('active', i === carouselIndex);
    });
    inner.style.transform = 'translateX(' + (-carouselIndex * 100) + '%)';
}

function left()  { moveCarousel(-1); }
function right() { moveCarousel(1); }

/* ---------- 输入框清除按钮：有内容才显示，点击清空并聚焦 ---------- */
document.querySelectorAll('.input-wrap').forEach(function (wrap) {
    var input = wrap.querySelector('.putin-box');
    var btn   = wrap.querySelector('.clear-btn');
    if (!input || !btn) return;

    // 同步状态：有内容 → 加 .has-text，按钮弹出
    function sync() {
        wrap.classList.toggle('has-text', input.value.length > 0);
    }

    input.addEventListener('input', sync);
    sync();                          // 初始化一次（处理浏览器自动填充）
    setTimeout(sync, 300);           // 自动填充可能稍慢，再补一次

    btn.addEventListener('click', function () {
        input.value = '';
        sync();
        input.focus();               // 清空后光标回到输入框，可直接重输
    });
});

/* ---------- 协议勾选 + 登录校验 ---------- */
document.getElementById('loginBtn').addEventListener('click', function () {
    const box = document.getElementById('agreeBox');
    const policy = document.getElementById('policy');
    const account = document.getElementById('account');
    const pwd = document.getElementById('password');

    // 先查账号密码
    if (!account.value.trim()) { toast('请输入账号'); account.focus(); return; }
    if (!pwd.value)            { toast('请输入密码'); pwd.focus(); return; }

    // 再查协议
    if (!box.checked) {
        toast('请先阅读并同意以下协议');
        policy.classList.remove('shake');
        void policy.offsetWidth;              // 强制重排，让动画能重复触发
        policy.classList.add('shake');
        return;
    }

    toast('登录成功，欢迎回来！');
});

/* ---------- 点击协议名 ---------- */
function openPolicy(name) {
    toast('《' + name + '》详情页待接入');
}

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

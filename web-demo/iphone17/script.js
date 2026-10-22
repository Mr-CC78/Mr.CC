/* ==========================================================
   iPhone 17 展示页交互脚本
   ========================================================== */

/* ---------- 颜色切换：改 CSS 变量，手机和摄像头模块一起变色 ---------- */
const swatches = document.querySelectorAll('.swatch');
const colorName = document.getElementById('colorName');

swatches.forEach(function (sw) {
    sw.addEventListener('click', function () {
        // 先把所有色块取消选中
        swatches.forEach(function (s) { s.classList.remove('active'); });
        sw.classList.add('active');

        // 写进根变量 → 机身 + 摄像头模块联动
        document.documentElement.style.setProperty('--phone-color', sw.dataset.c1);
        document.documentElement.style.setProperty('--phone-color-2', sw.dataset.c2);

        // 更新颜色名称文字
        colorName.textContent = sw.dataset.name;
    });
});

/* ---------- 滚动渐入：IntersectionObserver ---------- */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);   // 只触发一次，之后不再观察
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(function (el) { observer.observe(el); });

/* ---------- 购买按钮提示（无真实功能） ---------- */
let toastTimer = null;
function buyNow() {
    const el = document.getElementById('miniToast');
    el.textContent = '这是前端练习页面，购买功能未接入';
    el.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        el.classList.remove('show');
    }, 2000);
}
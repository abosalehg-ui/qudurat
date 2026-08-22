// ==================== Data Store ====================
// questionsDB/testsDB تُبنى عند كل تشغيل من (أسئلة العينة في الكود + محتوى المستخدم).
// لا يُخزَّن في localStorage إلا محتوى المستخدم، حتى تصل تحديثات المحتوى
// في الإصدارات الجديدة إلى المستخدمين الحاليين.
// دوال البناء والترحيل والتحقق كلها في app-core.js (نقية وقابلة للاختبار في Node).
let questionsDB = [];
let testsDB = [];
let userContent = emptyUserContent();
let userProgress = {
    streak: 0,
    lastActive: null,
    questionsAnswered: 0,
    correctAnswers: 0,
    savedQuestions: [],
    categoryProgress: {},
    testResults: [],
    dailyStats: {}
};

// Current session state
const EMPTY_SESSION = {
    mode: null, // 'practice' | 'test' | 'daily'
    section: null,
    subcategory: null,
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: null,
    timeLimit: null,
    testName: null
};
let currentSession = { ...EMPTY_SESSION };
let timerInterval = null;

const STORAGE_KEYS = {
    data: 'qudurat_data',
    corruptBackup: 'qudurat_data_corrupt_backup',
    theme: 'qudurat_theme',
    fontSize: 'qudurat_font_size',
    adminPwd: 'qudurat_admin_pwd',
    adminSalt: 'qudurat_admin_salt',
    adminUnlocked: 'qudurat_admin_unlocked',
    session: 'qudurat_session'
};

// ==================== Storage (كل كتابة قد تفشل: حصة ممتلئة أو تصفح خاص) ====================
function storageSet(store, key, value) {
    try {
        store.setItem(key, value);
        return true;
    } catch (err) {
        console.error(`تعذر الحفظ في ${key}:`, err);
        return false;
    }
}

function storageGet(store, key) {
    try {
        return store.getItem(key);
    } catch (err) {
        console.error(`تعذر القراءة من ${key}:`, err);
        return null;
    }
}

let storageWarningShown = false;
function warnStorageFailure() {
    if (storageWarningShown) return;
    storageWarningShown = true;
    showToast('تعذّر حفظ تقدمك — قد تكون مساحة التخزين ممتلئة أو التصفح خاصاً. صدّر نسخة احتياطية للاحتفاظ ببياناتك.', 'error', 8000);
}

// ==================== Theme & Accessibility ====================
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي');
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#14171f' : '#1a5f7a');
    storageSet(localStorage, STORAGE_KEYS.theme, theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

const FONT_SIZES = ['small', 'medium', 'large', 'xlarge'];
const FONT_SIZE_LABELS = { small: 'صغير', medium: 'متوسط', large: 'كبير', xlarge: 'كبير جداً' };

function applyFontSize(size) {
    document.documentElement.setAttribute('data-font-size', size);
    storageSet(localStorage, STORAGE_KEYS.fontSize, size);
}

function cycleFontSize() {
    const current = document.documentElement.getAttribute('data-font-size') || 'medium';
    const idx = FONT_SIZES.indexOf(current);
    const next = FONT_SIZES[(idx + 1) % FONT_SIZES.length];
    applyFontSize(next);
    showToast(`حجم الخط: ${FONT_SIZE_LABELS[next]}`);
}

function loadPreferences() {
    const savedTheme = storageGet(localStorage, STORAGE_KEYS.theme);
    if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    const savedSize = storageGet(localStorage, STORAGE_KEYS.fontSize);
    applyFontSize(FONT_SIZES.includes(savedSize) ? savedSize : 'medium');
}

// ==================== Toast Notifications ====================
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================== Modal infrastructure (تركيز محصور + Escape) ====================
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
let modalStack = [];

function openModal(id, focusSelector) {
    const modal = document.getElementById(id);
    if (!modal) return null;
    modalStack.push({ id, previousFocus: document.activeElement });
    modal.classList.add('show');
    const target = (focusSelector && modal.querySelector(focusSelector)) || modal.querySelector(FOCUSABLE);
    if (target) target.focus();
    return modal;
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
    const idx = modalStack.findIndex(m => m.id === id);
    if (idx > -1) {
        const [entry] = modalStack.splice(idx, 1);
        if (entry.previousFocus && document.contains(entry.previousFocus)) entry.previousFocus.focus();
    }
}

function topModal() {
    return modalStack.length ? document.getElementById(modalStack[modalStack.length - 1].id) : null;
}

document.addEventListener('keydown', (e) => {
    const modal = topModal();
    if (!modal) return;
    if (e.key === 'Escape') {
        e.preventDefault();
        dismissTopModal();
        return;
    }
    if (e.key !== 'Tab') return;
    // حصر التركيز داخل النافذة: Tab عند آخر عنصر يعود للأول والعكس
    const items = Array.from(modal.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

function dismissTopModal() {
    const entry = modalStack[modalStack.length - 1];
    if (!entry) return;
    if (entry.id === 'confirmModal') resolveConfirm(false);
    else if (entry.id === 'passwordModal') resolvePassword(null);
    else closeModal(entry.id);
}

// ---------- confirm بديل النافذة المتصفحية ----------
let confirmResolver = null;

function askConfirm(message, { title = 'تأكيد', okLabel = 'تأكيد', danger = true } = {}) {
    // طلب متداخل فوق طلب معلّق كان يُسقط وعد الأول بلا حل (يتجمّد منتظره
    // للأبد) — نحسم القديم بالرفض قبل فتح الجديد
    if (confirmResolver) resolveConfirm(false);
    return new Promise(resolve => {
        confirmResolver = resolve;
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        const ok = document.getElementById('confirmOkBtn');
        ok.textContent = okLabel;
        ok.className = danger ? 'btn btn-danger' : 'btn btn-primary';
        // في الحوارات الهدّامة يبدأ التركيز على «إلغاء» — ضغطة Enter متسرعة
        // ما تحذف شيئاً؛ التأكيد يحتاج انتقالاً مقصوداً
        openModal('confirmModal', danger ? '#confirmCancelBtn' : '#confirmOkBtn');
    });
}

function resolveConfirm(value) {
    closeModal('confirmModal');
    const r = confirmResolver;
    confirmResolver = null;
    if (r) r(value);
}

// ---------- طلب كلمة المرور في نافذة (بدل prompt الذي يعرض النص) ----------
let passwordResolver = null;

function askPassword({ title, intro, label1, label2 = null, error = '' }) {
    if (passwordResolver) resolvePassword(null);
    return new Promise(resolve => {
        passwordResolver = resolve;
        document.getElementById('passwordModalTitle').textContent = title;
        document.getElementById('passwordModalIntro').textContent = intro;
        document.getElementById('passwordLabel1').textContent = label1;
        const field2 = document.getElementById('passwordField2');
        field2.classList.toggle('is-hidden', !label2);
        if (label2) document.getElementById('passwordLabel2').textContent = label2;
        const input1 = document.getElementById('passwordInput1');
        const input2 = document.getElementById('passwordInput2');
        input1.value = '';
        input2.value = '';
        input1.setAttribute('autocomplete', label2 ? 'new-password' : 'current-password');
        const errorBox = document.getElementById('passwordError');
        errorBox.textContent = error;
        errorBox.classList.toggle('is-hidden', !error);
        openModal('passwordModal', '#passwordInput1');
    });
}

function resolvePassword(value) {
    closeModal('passwordModal');
    const r = passwordResolver;
    passwordResolver = null;
    if (r) r(value);
}

// ==================== Initialization ====================
function init() {
    loadPreferences();
    loadData();
    updateSubcategories();
    updateUI();
    renderStreak();
    renderTests();
    renderSolvedExamples();
    renderSavedQuestions();
    renderProgress();
    renderMasteryBars();
    renderRecommendations();
    renderQuestionsTable();
    registerServiceWorker();
    checkDailyChallenge();
    bindEvents();
    renderRoute(); // دعم الروابط العميقة (مثل ‎#tests) عند فتح الصفحة
    offerSessionResume();
}

function loadData() {
    const stored = storageGet(localStorage, STORAGE_KEYS.data);
    if (stored) {
        try {
            const data = JSON.parse(stored);
            if (data && typeof data === 'object' && data.version >= 2) {
                userContent = applyStoredContent(data);
                if (data.progress && typeof data.progress === 'object' && !Array.isArray(data.progress)) {
                    // بيانات محفوظة قد تكون عُدّلت أو تلفت جزئياً — تُجبر على شكلها الصحيح
                    userProgress = sanitizeProgress({ ...userProgress, ...data.progress });
                }
            } else if (data && typeof data === 'object') {
                const migrated = migrateLegacyData(data, getSampleQuestions(), getSampleTests());
                userContent = migrated.userContent;
                if (migrated.progress) userProgress = sanitizeProgress({ ...userProgress, ...migrated.progress });
                saveData();
            }
        } catch (err) {
            console.error('تعذر قراءة البيانات المحفوظة:', err);
            // نحتفظ بنسخة من البيانات التالفة لإمكانية الاسترجاع اليدوي
            storageSet(localStorage, STORAGE_KEYS.corruptBackup, stored);
            try { localStorage.removeItem(STORAGE_KEYS.data); } catch (_) { /* لا شيء نفعله */ }
            showToast('تعذر قراءة بياناتك المحفوظة فأُعيدت التهيئة، وحُفظت نسخة منها للاسترجاع', 'error', 6000);
        }
    }
    rebuildDB();
}

function rebuildDB() {
    questionsDB = buildQuestionsDB(getSampleQuestions(), userContent);
    testsDB = buildTestsDB(getSampleTests(), userContent);
}

function saveData() {
    pruneProgress(userProgress);
    const ok = storageSet(localStorage, STORAGE_KEYS.data, JSON.stringify({
        version: 2,
        ...userContent,
        progress: userProgress
    }));
    if (!ok) warnStorageFailure();
    return ok;
}

// ==================== Admin Authentication ====================
// ملاحظة صريحة: هذه حماية *تنظيمية* لا أمنية. التطبيق كله يعمل في المتصفح،
// فمن يملك وصولاً للجهاز أو للـ console يستطيع تجاوزها. الغرض منها منع
// التعديل العابر على جهاز مشترك — ولذلك نشتق المفتاح بـPBKDF2 بملح عشوائي
// حتى لا تُكشف كلمة مرور قد يكون المستخدم أعاد استخدامها في مكان آخر.
const PBKDF2_ITERATIONS = 150000;
const MIN_PASSWORD_LENGTH = 8;

function randomSalt() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function derivePassword(password, saltHex) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: enc.encode(saltHex), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
        key, 256
    );
    return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// مقارنة ثابتة الزمن — لا تكشف عدد المحارف المتطابقة
function timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

let failedAttempts = 0;

async function ensureAdminAuth() {
    if (storageGet(sessionStorage, STORAGE_KEYS.adminUnlocked) === '1') return true;

    const storedHash = storageGet(localStorage, STORAGE_KEYS.adminPwd);
    const storedSalt = storageGet(localStorage, STORAGE_KEYS.adminSalt);

    if (!storedHash || !storedSalt) {
        return await setupAdminPassword();
    }

    // تأخير تصاعدي بعد المحاولات الفاشلة يُبطئ التجريب اليدوي
    if (failedAttempts >= 3) {
        const wait = Math.min(2 ** (failedAttempts - 2), 30);
        showToast(`محاولات كثيرة — انتظر ${wait} ثانية`, 'warning', wait * 1000);
        await new Promise(r => setTimeout(r, wait * 1000));
    }

    const pwd = await askPassword({
        title: '🔐 لوحة التحكم محمية',
        intro: 'أدخل كلمة المرور للمتابعة.',
        label1: 'كلمة المرور'
    });
    if (pwd === null) return false;

    const hash = await derivePassword(pwd, storedSalt);
    if (timingSafeEqual(hash, storedHash)) {
        failedAttempts = 0;
        storageSet(sessionStorage, STORAGE_KEYS.adminUnlocked, '1');
        return true;
    }
    failedAttempts++;
    showToast('كلمة المرور غير صحيحة', 'error');
    return false;
}

async function setupAdminPassword() {
    let error = '';
    for (let attempt = 0; attempt < 5; attempt++) {
        const pwd = await askPassword({
            title: '🔐 إعداد كلمة المرور',
            intro: `اختر كلمة مرور لحماية لوحة التحكم على هذا الجهاز (${MIN_PASSWORD_LENGTH} أحرف على الأقل). لا تستخدم كلمة مرور تستعملها في خدمة أخرى.`,
            label1: 'كلمة المرور الجديدة',
            label2: 'تأكيد كلمة المرور',
            error
        });
        if (pwd === null) return false;
        const confirmPwd = document.getElementById('passwordInput2').dataset.lastValue || '';
        if (pwd.length < MIN_PASSWORD_LENGTH) { error = `كلمة المرور قصيرة جداً (${MIN_PASSWORD_LENGTH} أحرف على الأقل)`; continue; }
        if (pwd !== confirmPwd) { error = 'كلمتا المرور غير متطابقتين'; continue; }

        const salt = randomSalt();
        const hash = await derivePassword(pwd, salt);
        storageSet(localStorage, STORAGE_KEYS.adminSalt, salt);
        storageSet(localStorage, STORAGE_KEYS.adminPwd, hash);
        storageSet(sessionStorage, STORAGE_KEYS.adminUnlocked, '1');
        showToast('✓ تم حفظ كلمة المرور', 'success');
        return true;
    }
    return false;
}

async function changeAdminPassword() {
    const storedSalt = storageGet(localStorage, STORAGE_KEYS.adminSalt);
    const storedHash = storageGet(localStorage, STORAGE_KEYS.adminPwd);
    if (!storedSalt || !storedHash) {
        await setupAdminPassword();
        return;
    }
    const oldPwd = await askPassword({
        title: 'تغيير كلمة المرور',
        intro: 'أدخل كلمة المرور الحالية أولاً.',
        label1: 'كلمة المرور الحالية'
    });
    if (oldPwd === null) return;
    const oldHash = await derivePassword(oldPwd, storedSalt);
    if (!timingSafeEqual(oldHash, storedHash)) {
        showToast('كلمة المرور الحالية غير صحيحة', 'error');
        return;
    }
    try { localStorage.removeItem(STORAGE_KEYS.adminPwd); } catch (_) { /* تجاهل */ }
    await setupAdminPassword();
}

function logoutAdmin() {
    try { sessionStorage.removeItem(STORAGE_KEYS.adminUnlocked); } catch (_) { /* تجاهل */ }
    showToast('تم تسجيل الخروج من لوحة التحكم');
    showPage('home');
}

// ==================== Navigation ====================
// توجيه عبر hash: زر الرجوع في المتصفح يعمل، والروابط العميقة
// (مثل ‎#tests) قابلة للمشاركة. showPage تغيّر الـ hash فقط،
// وrenderRoute هي المسؤولة عن العرض عند كل تغيير.
let currentPage = '';
const VALID_PAGES = new Set(['home', 'verbal', 'quant', 'tests', 'practice', 'results', 'solved', 'saved', 'progress', 'admin']);
let routing = false;

async function renderRoute() {
    if (routing) return;
    const raw = location.hash.replace('#', '') || 'home';
    const pageName = VALID_PAGES.has(raw) ? raw : 'home';
    if (pageName === currentPage) return;

    // صفحة التدريب بلا جلسة نشطة (رابط مباشر أو رجوع بعد الانتهاء)
    if (pageName === 'practice' && !currentSession.mode) {
        routing = true;
        location.hash = 'home';
        routing = false;
        return;
    }

    // حماية الاختبار المؤقت الجاري من مغادرة غير مقصودة بزر الرجوع
    if (currentPage === 'practice' && currentSession.mode === 'test' && timerInterval && pageName !== 'results') {
        const leave = await askConfirm('لديك اختبار جارٍ — ستُلغى نتيجته إذا غادرت. هل تريد المغادرة؟', { okLabel: 'مغادرة' });
        if (!leave) {
            routing = true;
            location.hash = 'practice';
            routing = false;
            return;
        }
        clearSession();
    }

    if (pageName === 'admin') {
        const ok = await ensureAdminAuth();
        if (!ok) {
            routing = true;
            location.hash = currentPage || 'home';
            routing = false;
            return;
        }
    }

    activatePage(pageName);
}

function activatePage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => {
        const active = l.dataset.page === pageName;
        l.classList.toggle('active', active);
        if (active) l.setAttribute('aria-current', 'page');
        else l.removeAttribute('aria-current');
    });

    const page = document.getElementById(`page-${pageName}`);
    if (page) page.classList.add('active');

    closeMobileMenu();

    // Stop timer if leaving practice/test
    if (pageName !== 'practice') stopTimer();

    // Refresh content
    if (pageName === 'tests') renderTests();
    if (pageName === 'saved') renderSavedQuestions();
    if (pageName === 'progress') renderProgress();
    if (pageName === 'solved') renderSolvedExamples();
    if (pageName === 'verbal' || pageName === 'quant') renderMasteryBars();
    if (pageName === 'home') { updateUI(); renderRecommendations(); }

    currentPage = pageName;
    document.title = `${pageTitle(pageName)} | قدراتي`;

    // نقل التركيز لبداية الصفحة الجديدة حتى يتابع قارئ الشاشة التنقّل
    if (page) {
        const heading = page.querySelector('h1, h2');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function pageTitle(name) {
    return {
        home: 'الرئيسية', verbal: 'القسم اللفظي', quant: 'القسم الكمي', tests: 'الاختبارات',
        practice: 'التدريب', results: 'النتيجة', solved: 'نماذج محلولة', saved: 'المحفوظات',
        progress: 'تقدمي', admin: 'لوحة التحكم'
    }[name] || 'قدراتي';
}

function showPage(pageName) {
    if (location.hash === `#${pageName}`) {
        currentPage = '';
        renderRoute();
        return;
    }
    location.hash = pageName;
}

function toggleMobileMenu() {
    const links = document.getElementById('navLinks');
    const btn = document.getElementById('mobileMenuBtn');
    const open = links.classList.toggle('show');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'إغلاق قائمة التنقل' : 'فتح قائمة التنقل');
}

function closeMobileMenu() {
    const links = document.getElementById('navLinks');
    const btn = document.getElementById('mobileMenuBtn');
    if (!links.classList.contains('show')) return;
    links.classList.remove('show');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'فتح قائمة التنقل');
}

// ==================== Session persistence ====================
// الجلسة كانت في الذاكرة فقط: تحديث الصفحة أثناء اختبار 125 دقيقة يمحوها.
function persistSession() {
    if (!currentSession.mode) {
        try { sessionStorage.removeItem(STORAGE_KEYS.session); } catch (_) { /* تجاهل */ }
        return;
    }
    // savedAt يسمح عند الاستئناف بخصم مدة الغياب من الوقت المستغرق
    storageSet(sessionStorage, STORAGE_KEYS.session, JSON.stringify({ ...currentSession, savedAt: Date.now() }));
}

function clearSession() {
    currentSession = { ...EMPTY_SESSION };
    stopTimer();
    persistSession();
}

async function offerSessionResume() {
    const raw = storageGet(sessionStorage, STORAGE_KEYS.session);
    if (!raw || currentSession.mode) return;
    let saved;
    try {
        saved = JSON.parse(raw);
    } catch (err) {
        console.error('تعذر قراءة الجلسة المحفوظة:', err);
        try { sessionStorage.removeItem(STORAGE_KEYS.session); } catch (_) { /* تجاهل */ }
        return;
    }
    if (!saved || !saved.mode || !Array.isArray(saved.questions) || !saved.questions.length) return;

    // اختبار مؤقت انتهى وقته أثناء الغياب لا يُستأنف
    if (saved.timeLimit && Date.now() - saved.startTime >= saved.timeLimit) {
        try { sessionStorage.removeItem(STORAGE_KEYS.session); } catch (_) { /* تجاهل */ }
        showToast('انتهى وقت الاختبار الذي كان جارياً', 'warning', 5000);
        return;
    }

    const label = saved.mode === 'test' ? `الاختبار «${saved.testName || 'تجريبي'}»` : 'جلسة التدريب';
    const answered = saved.answers.filter(a => a !== null).length;
    const resume = await askConfirm(
        `${label} لم يكتمل (${answered} من ${saved.questions.length} سؤالاً). هل تريد استئنافه؟`,
        { title: 'استئناف؟', okLabel: 'استئناف', danger: false }
    );
    if (!resume) {
        clearSession();
        return;
    }
    // في التدريب الحر كان «الوقت المستغرق» يُحسب من startTime الأصلي فيتضخم
    // بمدة الغياب — نزيح البداية بمدة الغياب فيُحتسب وقت الحل الفعلي فقط.
    // الاختبارات المؤقتة تُترك على ساعة الحائط عمداً (فحص انتهاء الوقت أعلاه).
    if (!saved.timeLimit && Number.isFinite(saved.savedAt)) {
        saved.startTime += Math.max(0, Date.now() - saved.savedAt);
    }
    delete saved.savedAt;
    currentSession = saved;
    setPracticeBackHandler();
    showPage('practice');
    renderQuestion();
    if (currentSession.timeLimit) startTimer();
}

// ==================== Practice Mode ====================
// الخيارات تُخلط لكل سؤال: ترتيبها في البيانات ثابت وموقع الإجابة الصحيحة
// فيها منحاز، فبلا خلط يستطيع الطالب التخمين بالموقع.
function buildSessionQuestions(list) {
    return shuffleArray([...list]).map(shuffleQuestionOptions);
}

function startPractice(section, subcategory) {
    const questions = questionsDB.filter(q => q.section === section && q.subcategory === subcategory);

    if (questions.length === 0) {
        showToast('لا توجد أسئلة في هذا القسم حالياً', 'warning');
        return;
    }

    currentSession = {
        ...EMPTY_SESSION,
        mode: 'practice',
        section,
        subcategory,
        questions: buildSessionQuestions(questions),
        answers: new Array(questions.length).fill(null),
        startTime: Date.now()
    };

    setPracticeBackHandler();
    persistSession();
    showPage('practice');
    renderQuestion();
}

async function startTest(testId) {
    const test = testsDB.find(t => t.id === testId);
    if (!test) return;

    const verbalPool = shuffleArray(questionsDB.filter(q => q.section === 'verbal'));
    const quantPool = shuffleArray(questionsDB.filter(q => q.section === 'quant'));
    const verbal = verbalPool.slice(0, test.verbalCount);
    const quant = quantPool.slice(0, test.quantCount);
    const questions = verbal.concat(quant);

    if (questions.length === 0) {
        showToast('لا توجد أسئلة كافية لهذا الاختبار', 'warning');
        return;
    }

    // اختبار أقصر من المطلوب كان يبدأ بصمت، والنسبة تُحسب على العدد الناقص
    const requested = test.verbalCount + test.quantCount;
    if (questions.length < requested) {
        const proceed = await askConfirm(
            `هذا الاختبار يطلب ${requested} سؤالاً، والمتوفر ${questions.length} فقط ` +
            `(${verbal.length} لفظي و${quant.length} كمي). هل تريد المتابعة بالعدد المتاح؟`,
            { title: 'أسئلة غير كافية', okLabel: 'متابعة', danger: false }
        );
        if (!proceed) return;
    }

    currentSession = {
        ...EMPTY_SESSION,
        mode: 'test',
        section: 'mixed',
        questions: buildSessionQuestions(questions),
        answers: new Array(questions.length).fill(null),
        startTime: Date.now(),
        timeLimit: test.timeLimit * 60 * 1000,
        testName: test.name
    };

    setPracticeBackHandler();
    persistSession();
    showPage('practice');
    renderQuestion();
    startTimer();
}

function setPracticeBackHandler() {
    const btn = document.getElementById('practiceBackBtn');
    btn.onclick = async () => {
        if (currentSession.mode === 'test') {
            const done = await askConfirm('هل أنت متأكد من إنهاء الاختبار؟ ستُحتسب النتيجة بإجاباتك الحالية.', { okLabel: 'إنهاء' });
            if (done) finishPractice();
        } else if (currentSession.mode === 'daily') {
            showPage('home');
        } else {
            showPage(currentSession.section || 'home');
        }
    };
}

function renderQuestion() {
    const q = currentSession.questions[currentSession.currentIndex];
    if (!q) return;
    const total = currentSession.questions.length;
    const current = currentSession.currentIndex + 1;

    const progressEl = document.getElementById('practiceProgress');
    const pct = Math.round((current / total) * 100);
    progressEl.style.width = `${pct}%`;
    progressEl.setAttribute('aria-valuenow', String(pct));

    const isSaved = userProgress.savedQuestions.includes(q.id);
    const difficulty = safeToken(q.difficulty, DIFFICULTIES, 'medium');
    const answered = currentSession.answers[currentSession.currentIndex];
    const revealed = currentSession.mode === 'practice' && answered !== null;

    let html = `
        <button type="button" class="saved-indicator" data-action="toggle-save" data-id="${safeId(q.id)}"
                aria-pressed="${isSaved}" aria-label="حفظ السؤال للمراجعة لاحقاً">${isSaved ? '🔖' : '☆'}</button>
        <div class="question-header">
            <span class="question-number">السؤال ${current} من ${total}</span>
            <span class="question-difficulty difficulty-${difficulty}">${escapeHTML(getDifficultyLabel(difficulty))}</span>
        </div>
    `;

    if (q.context) {
        html += `<div class="question-context">${escapeHTML(q.context)}</div>`;
    }

    html += `<div class="question-text" id="questionText">${escapeHTML(q.text)}</div>`;

    html += '<div class="options-list" role="radiogroup" aria-labelledby="questionText">';
    q.options.forEach((opt, i) => {
        let stateClass = '';
        if (revealed) {
            if (i === q.correct) stateClass = 'correct';
            else if (i === answered) stateClass = 'wrong';
        } else if (answered === i) {
            stateClass = 'selected';
        }
        // roving tabindex: المجموعة نقطة تركيز واحدة يُتنقَّل داخلها بالأسهم
        const tabindex = (answered === i || (answered === null && i === 0)) ? '0' : '-1';
        html += `
            <button type="button" class="option ${stateClass}" role="radio" tabindex="${tabindex}"
                    aria-checked="${answered === i}" data-action="select-option" data-index="${i}">
                <span class="option-letter" aria-hidden="true">${OPTION_LETTERS[i]}</span>
                <span>${escapeHTML(opt)}</span>
            </button>
        `;
    });
    html += '</div>';

    document.getElementById('questionContainer').innerHTML = html;

    const explanationBox = document.getElementById('explanationBox');
    if (revealed) {
        document.getElementById('explanationText').textContent = q.explanation || 'لا يوجد شرح لهذا السؤال.';
        explanationBox.classList.add('show');
    } else {
        explanationBox.classList.remove('show');
    }

    document.getElementById('prevBtn').classList.toggle('is-hidden', current <= 1);
    document.getElementById('nextBtn').classList.toggle('is-hidden', current >= total);
    document.getElementById('finishBtn').classList.toggle('is-hidden', current !== total);
}

// تحديث زر الحفظ وحده بدل إعادة بناء السؤال كاملاً (يحافظ على التركيز)
function refreshSavedIndicator(qId) {
    const btn = document.querySelector(`.saved-indicator[data-id="${safeId(qId)}"]`);
    if (!btn) return;
    const isSaved = userProgress.savedQuestions.includes(qId);
    btn.textContent = isSaved ? '🔖' : '☆';
    btn.setAttribute('aria-pressed', String(isSaved));
}

function selectOption(index) {
    // في وضع التدريب تُكشف الإجابة الصحيحة بعد أول اختيار،
    // فيُقفل السؤال لمنع تغيير الإجابة وتضخيم الإحصائيات
    if (currentSession.mode === 'practice' && currentSession.answers[currentSession.currentIndex] !== null) {
        return;
    }

    currentSession.answers[currentSession.currentIndex] = index;

    const q = currentSession.questions[currentSession.currentIndex];
    if (currentSession.mode === 'practice') {
        updateCategoryProgress(q.section, q.subcategory, index === q.correct);
    }
    persistSession();
    renderQuestion();
    const active = document.querySelector('.option[tabindex="0"]');
    if (active) active.focus();
}

// تنقّل بالأسهم داخل مجموعة الخيارات (متطلب ARIA لـ radiogroup)
function handleOptionKeydown(e) {
    const option = e.target.closest('.option');
    if (!option) return;
    const options = Array.from(option.closest('.options-list').querySelectorAll('.option'));
    const idx = options.indexOf(option);
    let next = null;
    // في RTL يتبادل السهمان الأفقيان اتجاههما بصرياً؛ نعتمد ترتيب المستند
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') next = options[(idx + 1) % options.length];
    else if (e.key === 'ArrowUp' || e.key === 'ArrowRight') next = options[(idx - 1 + options.length) % options.length];
    else if (e.key === 'Home') next = options[0];
    else if (e.key === 'End') next = options[options.length - 1];
    if (!next) return;
    e.preventDefault();
    options.forEach(o => o.setAttribute('tabindex', '-1'));
    next.setAttribute('tabindex', '0');
    next.focus();
}

function previousQuestion() {
    if (currentSession.currentIndex > 0) {
        currentSession.currentIndex--;
        persistSession();
        renderQuestion();
    }
}

function nextQuestion() {
    if (currentSession.currentIndex < currentSession.questions.length - 1) {
        currentSession.currentIndex++;
        persistSession();
        renderQuestion();
    }
}

function finishPractice() {
    stopTimer();
    const results = calculateSessionResults(currentSession);
    saveResults(results);
    renderResults(results);
    clearSession();
    showPage('results');
}

// ==================== Timer ====================
function startTimer() {
    const container = document.getElementById('timerContainer');
    const timerValue = document.getElementById('timerValue');
    container.classList.add('show');

    const tick = () => {
        const remaining = currentSession.timeLimit - (Date.now() - currentSession.startTime);

        if (remaining <= 0) {
            stopTimer();
            showToast('انتهى الوقت — عُرضت نتيجتك', 'warning', 5000);
            finishPractice();
            return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        timerValue.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        timerValue.classList.toggle('danger', remaining < 60000);
        timerValue.classList.toggle('warning', remaining >= 60000 && remaining < 300000);
        // الإعلان الصوتي عند آخر دقيقة فقط، وإلا أزعج قارئ الشاشة كل ثانية
        container.setAttribute('aria-live', remaining < 60000 ? 'assertive' : 'off');
    };

    tick();
    timerInterval = setInterval(tick, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    const container = document.getElementById('timerContainer');
    if (container) container.classList.remove('show');
}

function saveResults(results) {
    userProgress.questionsAnswered += results.total;
    userProgress.correctAnswers += results.correct;

    awardPoints(results.correct * POINTS_PER_CORRECT);

    if (results.mode === 'test') {
        userProgress.testResults.push({
            date: new Date().toISOString(),
            name: results.testName,
            percentage: results.percentage,
            correct: results.correct,
            total: results.total,
            timeSpent: results.timeSpent
        });
    }

    if (results.mode === 'daily') {
        completeDailyChallenge(results.correct);
    }

    const today = getTodayKey();
    if (!userProgress.dailyStats[today]) {
        userProgress.dailyStats[today] = { questions: 0, correct: 0 };
    }
    userProgress.dailyStats[today].questions += results.total;
    userProgress.dailyStats[today].correct += results.correct;

    updateStreak();
    saveData();
    checkAndAwardBadges();
}

function renderResults(results) {
    let scoreClass = 'poor';
    if (results.percentage >= 85) scoreClass = 'excellent';
    else if (results.percentage >= 70) scoreClass = 'good';
    else if (results.percentage >= 50) scoreClass = 'average';

    const minutes = Math.floor(results.timeSpent / 60000);
    const seconds = Math.floor((results.timeSpent % 60000) / 1000);

    // نفس منطق صفحة التقدم (classifyCategories) حتى لا تصل الطالبَ رسالتان متناقضتان
    const { strengths, weaknesses } = classifyCategories(results.categoryStats);

    document.getElementById('resultsContainer').innerHTML = `
        <h2 class="stack-gap-lg">🎉 نتيجة ${results.mode === 'test' ? 'الاختبار' : 'التدريب'}</h2>

        <div class="results-score ${scoreClass}">
            <span class="score-value">${results.percentage}%</span>
            <span class="score-label">نسبة النجاح</span>
        </div>

        <div class="results-details">
            <div class="result-stat correct">
                <span class="result-stat-value">${results.correct}</span>
                <span class="result-stat-label">إجابات صحيحة</span>
            </div>
            <div class="result-stat wrong">
                <span class="result-stat-value">${results.wrong}</span>
                <span class="result-stat-label">إجابات خاطئة</span>
            </div>
            <div class="result-stat skipped">
                <span class="result-stat-value">${results.unanswered}</span>
                <span class="result-stat-label">بلا إجابة</span>
            </div>
            <div class="result-stat time">
                <span class="result-stat-value">${minutes}:${String(seconds).padStart(2, '0')}</span>
                <span class="result-stat-label">الوقت المستغرق</span>
            </div>
        </div>

        <div class="strength-weakness stack-gap-lg">
            <div class="sw-card strength">
                <h4><span aria-hidden="true">✅</span> نقاط القوة</h4>
                <ul class="sw-list">
                    ${strengths.length ? strengths.map(s => `<li>${escapeHTML(s)}</li>`).join('') : '<li>استمر في التدريب لتحسين أدائك</li>'}
                </ul>
            </div>
            <div class="sw-card weakness">
                <h4><span aria-hidden="true">⚠️</span> تحتاج تحسين</h4>
                <ul class="sw-list">
                    ${weaknesses.length ? weaknesses.map(w => `<li>${escapeHTML(w)}</li>`).join('') : '<li>أداء ممتاز! استمر</li>'}
                </ul>
            </div>
        </div>

        <div class="results-actions">
            <button type="button" class="btn btn-primary" data-action="page" data-page="home">العودة للرئيسية</button>
            <button type="button" class="btn btn-secondary" data-action="page" data-page="tests">اختبار آخر</button>
            <button type="button" class="btn btn-secondary" data-action="print">🖨️ طباعة / PDF</button>
        </div>
    `;
}

// ==================== Progress Tracking ====================
function updateCategoryProgress(section, subcategory, isCorrect) {
    const key = `${section}_${subcategory}`;
    if (!userProgress.categoryProgress[key]) {
        userProgress.categoryProgress[key] = { attempted: 0, correct: 0 };
    }
    userProgress.categoryProgress[key].attempted++;
    if (isCorrect) userProgress.categoryProgress[key].correct++;
    saveData();
}

// يُستدعى عند إكمال تدريب أو اختبار فعلي — لا عند مجرد فتح التطبيق
function updateStreak() {
    const today = getTodayKey();
    const yesterday = getTodayKey(new Date(Date.now() - 86400000));

    if (userProgress.lastActive === today) {
        // نشط اليوم بالفعل
    } else if (userProgress.lastActive === yesterday) {
        userProgress.streak++;
        userProgress.lastActive = today;
    } else {
        userProgress.streak = 1;
        userProgress.lastActive = today;
    }
    renderStreak();
}

function renderStreak() {
    const today = getTodayKey();
    const yesterday = getTodayKey(new Date(Date.now() - 86400000));
    const stillActive = userProgress.lastActive === today || userProgress.lastActive === yesterday;
    document.getElementById('streakCount').textContent = stillActive ? userProgress.streak : 0;
}

// ==================== Saved Questions ====================
function toggleSaveQuestion(qId) {
    const index = userProgress.savedQuestions.indexOf(qId);
    if (index > -1) {
        userProgress.savedQuestions.splice(index, 1);
        showToast('أُزيل السؤال من المحفوظات');
    } else {
        userProgress.savedQuestions.push(qId);
        showToast('حُفظ السؤال للمراجعة', 'success');
    }
    saveData();
    refreshSavedIndicator(qId);
}

function renderSavedQuestions() {
    const container = document.getElementById('savedList');
    const saved = questionsDB.filter(q => userProgress.savedQuestions.includes(q.id));

    if (saved.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon" aria-hidden="true">🔖</div>
                <p>لم تحفظ أي أسئلة بعد</p>
                <p class="empty-state-hint">اضغط على ☆ أثناء حل الأسئلة لحفظها هنا</p>
            </div>
        `;
        return;
    }

    container.innerHTML = saved.map(q => `
        <div class="question-container stack-gap">
            <div class="question-header">
                <span class="question-difficulty difficulty-${safeToken(q.difficulty, DIFFICULTIES, 'medium')}">
                    ${escapeHTML(getDifficultyLabel(q.difficulty))}
                </span>
                <button type="button" class="btn btn-sm btn-danger" data-action="remove-saved" data-id="${safeId(q.id)}">إزالة</button>
            </div>
            <div class="question-text">${escapeHTML(q.text)}</div>
            <div class="explanation-box show">
                <div class="explanation-title"><span aria-hidden="true">💡</span> الإجابة والشرح</div>
                <p><strong>الإجابة:</strong> ${escapeHTML(q.options[q.correct])}</p>
                <p class="explanation-body">${escapeHTML(q.explanation || 'لا يوجد شرح لهذا السؤال.')}</p>
            </div>
        </div>
    `).join('');
}

function removeSaved(qId) {
    userProgress.savedQuestions = userProgress.savedQuestions.filter(id => id !== qId);
    saveData();
    renderSavedQuestions();
    showToast('أُزيل السؤال من المحفوظات');
}

// ==================== Tests ====================
function renderTests() {
    const container = document.getElementById('testsList');

    if (!testsDB.length) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon" aria-hidden="true">📝</div><p>لا توجد اختبارات — أنشئ واحداً من لوحة التحكم</p></div>';
        return;
    }

    container.innerHTML = testsDB.map(test => `
        <button type="button" class="card" data-action="start-test" data-id="${safeId(test.id)}">
            <span class="card-icon test" aria-hidden="true">📝</span>
            <h3>${escapeHTML(test.name)}</h3>
            <p>${escapeHTML(test.description || '')}</p>
            <span class="card-meta">
                <span class="card-badge">${safeId(test.verbalCount) + safeId(test.quantCount)} سؤال</span>
                <span class="card-badge">⏱️ ${safeId(test.timeLimit)} دقيقة</span>
            </span>
        </button>
    `).join('');
}

// ==================== Solved Examples ====================
const SOLVED_PAGE_SIZE = 10;
let solvedFilter = 'all';
let solvedShown = SOLVED_PAGE_SIZE;

function solvedPool() {
    let list = questionsDB.filter(q => q.explanation);
    if (solvedFilter !== 'all') list = list.filter(q => q.section === solvedFilter);
    return list;
}

function renderSolvedExamples() {
    const container = document.getElementById('solvedList');
    const pool = solvedPool();
    const visible = pool.slice(0, solvedShown);

    if (!visible.length) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon" aria-hidden="true">💡</div><p>لا توجد نماذج في هذا القسم</p></div>';
        document.getElementById('solvedMoreBtn').classList.add('is-hidden');
        return;
    }

    container.innerHTML = visible.map(q => `
        <div class="question-container stack-gap-lg">
            <div class="question-header">
                <span class="card-badge">${escapeHTML(getCategoryName(`${q.section}_${q.subcategory}`))}</span>
                <span class="question-difficulty difficulty-${safeToken(q.difficulty, DIFFICULTIES, 'medium')}">
                    ${escapeHTML(getDifficultyLabel(q.difficulty))}
                </span>
            </div>
            ${q.context ? `<div class="question-context">${escapeHTML(q.context)}</div>` : ''}
            <div class="question-text">${escapeHTML(q.text)}</div>
            <div class="options-list options-static">
                ${q.options.map((opt, i) => `
                    <div class="option ${i === q.correct ? 'correct' : ''}">
                        <span class="option-letter" aria-hidden="true">${OPTION_LETTERS[i]}</span>
                        <span>${escapeHTML(opt)}${i === q.correct ? ' <span class="sr-only">(الإجابة الصحيحة)</span>' : ''}</span>
                    </div>
                `).join('')}
            </div>
            <div class="explanation-box show">
                <div class="explanation-title"><span aria-hidden="true">💡</span> الشرح التفصيلي</div>
                <p>${escapeHTML(q.explanation)}</p>
            </div>
        </div>
    `).join('');

    const moreBtn = document.getElementById('solvedMoreBtn');
    const remaining = pool.length - visible.length;
    moreBtn.classList.toggle('is-hidden', remaining <= 0);
    moreBtn.textContent = `عرض المزيد (${remaining} متبقٍ)`;
}

function filterSolved(filter, btn) {
    solvedFilter = filter;
    solvedShown = SOLVED_PAGE_SIZE;
    document.querySelectorAll('#page-solved .admin-tab').forEach(t => {
        const active = t === btn;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
    });
    renderSolvedExamples();
}

function showMoreSolved() {
    solvedShown += SOLVED_PAGE_SIZE;
    renderSolvedExamples();
}

// ==================== Progress Dashboard ====================
function renderProgress() {
    renderLevelDisplay();
    renderBadges();

    const accuracy = userProgress.questionsAnswered > 0
        ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)
        : 0;

    document.getElementById('accuracyStats').innerHTML = bigStat(`${accuracy}%`, 'نسبة الإجابات الصحيحة');
    document.getElementById('questionsStats').innerHTML = bigStat(userProgress.questionsAnswered, 'سؤال تم حله');
    document.getElementById('timeStats').innerHTML = bigStat(userProgress.testResults.length, 'اختبار مكتمل');

    renderPerformanceChart();

    const { strengths, weaknesses } = classifyCategories(userProgress.categoryProgress);

    document.getElementById('strengthsList').innerHTML = strengths.length
        ? strengths.map(s => `<li>${escapeHTML(s)}</li>`).join('')
        : '<li>أكمل المزيد من التدريب لاكتشاف نقاط قوتك</li>';

    document.getElementById('weaknessesList').innerHTML = weaknesses.length
        ? weaknesses.map(w => `<li>${escapeHTML(w)}</li>`).join('')
        : '<li>أكمل المزيد من التدريب لاكتشاف ما تحتاج تحسينه</li>';

    document.getElementById('userScore').textContent = `${accuracy}%`;
}

function bigStat(value, label) {
    return `<div class="big-stat"><div class="big-stat-value">${escapeHTML(value)}</div><div class="big-stat-label">${escapeHTML(label)}</div></div>`;
}

function renderPerformanceChart() {
    const container = document.getElementById('performanceChart');
    const days = [];
    // أسماء قصيرة جاهزة — قصّ الاسم الكامل برمجياً (slice) ينتج «الأ/الا/الث…»
    // لأن الأسماء كلها تبدأ بـ«ال»، ويتطابق الأحد مع الأربعاء
    const DAY_NAMES = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000);
        const stats = userProgress.dailyStats[getTodayKey(date)] || { questions: 0, correct: 0 };
        days.push({ name: DAY_NAMES[date.getDay()], ...stats });
    }

    const max = Math.max(...days.map(d => d.questions), 1);
    const total = days.reduce((s, d) => s + d.questions, 0);
    container.setAttribute('aria-label', `نشاط آخر سبعة أيام: ${total} سؤالاً إجمالاً`);
    container.innerHTML = days.map(day => `
        <div class="chart-col">
            <div class="chart-bar" style="height:${Math.max((day.questions / max) * 100, 4)}%" data-value="${day.questions}"></div>
            <span class="chart-label">${day.name}</span>
        </div>
    `).join('');
}

// أشرطة إتقان الفئات — كانت ثابتة على 0% في HTML بلا أي كود يحدّثها
function renderMasteryBars() {
    document.querySelectorAll('[data-mastery]').forEach(bar => {
        const [section, subcategory] = bar.dataset.mastery.split('_');
        const pct = getCategoryMastery(userProgress, section, subcategory);
        bar.style.width = `${pct}%`;
    });
    document.querySelectorAll('[data-mastery-label]').forEach(label => {
        const key = label.dataset.masteryLabel;
        const [section, subcategory] = key.split('_');
        const stats = userProgress.categoryProgress[key];
        const pct = getCategoryMastery(userProgress, section, subcategory);
        label.textContent = stats && stats.attempted
            ? `${pct}% إتقان · ${stats.attempted} محاولة`
            : 'لم تبدأ بعد';
    });
}

// قسم «مقترحات لك» — كان عنصراً فارغاً لا يملؤه أي كود
function renderRecommendations() {
    const container = document.getElementById('recommendedQuestions');
    if (!container) return;
    const recs = getRecommendedCategories(userProgress, 3);

    container.innerHTML = recs.map(rec => {
        const available = questionsDB.filter(q => q.section === rec.section && q.subcategory === rec.subcategory).length;
        const reason = rec.attempted === 0
            ? 'لم تجرّب هذه الفئة بعد'
            : `دقتك فيها ${Math.round(rec.accuracy * 100)}% من ${rec.attempted} محاولة`;
        return `
            <button type="button" class="card card-recommend" data-action="practice"
                    data-section="${escapeHTML(rec.section)}" data-subcategory="${escapeHTML(rec.subcategory)}"
                    ${available ? '' : 'disabled'}>
                <span class="card-icon ${rec.section === 'verbal' ? 'verbal' : 'quant'}" aria-hidden="true">${rec.section === 'verbal' ? '📖' : '🔢'}</span>
                <h3>${escapeHTML(rec.name)}</h3>
                <p>${escapeHTML(reason)}</p>
                <span class="card-meta">
                    <span class="card-badge">${available} سؤال متاح</span>
                    <span class="card-badge">${rec.attempted === 0 ? 'ابدأ الآن' : 'حسّن أداءك'}</span>
                </span>
            </button>
        `;
    }).join('');
}

// ==================== Admin Panel ====================
function showAdminTab(tab, btn) {
    document.querySelectorAll('#page-admin .admin-tab').forEach(t => {
        const active = t === btn;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
    });

    const panels = { add: 'adminAdd', manage: 'adminManage', tests: 'adminTests', tools: 'adminTools' };
    for (const [key, id] of Object.entries(panels)) {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('is-hidden', key !== tab);
    }

    if (tab === 'manage') renderQuestionsTable();
    if (tab === 'tests') renderAdminTests();
}

function updateSubcategories() {
    const section = document.getElementById('qSection').value;
    const subcatSelect = document.getElementById('qSubcategory');
    subcatSelect.innerHTML = (SUBCATEGORIES[section] || []).map(value =>
        `<option value="${escapeHTML(value)}">${escapeHTML(getCategoryName(`${section}_${value}`))}</option>`
    ).join('');
}

function showFormErrors(containerId, errors) {
    const box = document.getElementById(containerId);
    if (!box) return;
    if (!errors.length) {
        box.classList.add('is-hidden');
        box.innerHTML = '';
        return;
    }
    box.innerHTML = `<strong>يرجى تصحيح ما يلي:</strong><ul>${errors.map(e => `<li>${escapeHTML(e)}</li>`).join('')}</ul>`;
    box.classList.remove('is-hidden');
    box.focus();
}

function markInvalid(ids, invalidIds) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const bad = invalidIds.includes(id);
        el.classList.toggle('field-error', bad);
        el.setAttribute('aria-invalid', String(bad));
    });
}

const ADD_FIELDS = ['qText', 'optionA', 'optionB', 'optionC', 'optionD', 'qExplanation'];

function addQuestion() {
    const options = ['optionA', 'optionB', 'optionC', 'optionD'].map(id => document.getElementById(id).value.trim());
    const newQ = {
        id: Date.now(),
        section: document.getElementById('qSection').value,
        subcategory: document.getElementById('qSubcategory').value,
        difficulty: document.getElementById('qDifficulty').value,
        context: document.getElementById('qContext').value.trim() || null,
        text: document.getElementById('qText').value.trim(),
        options,
        correct: parseInt(document.getElementById('qCorrect').value, 10),
        explanation: document.getElementById('qExplanation').value.trim(),
        custom: true
    };

    const errors = validateQuestion(newQ).concat(validateQuestionMeta(newQ));
    // نربط الخطأ بحقله بدل رسالة عامة
    const invalid = [];
    if (!newQ.text || newQ.text.length < 3) invalid.push('qText');
    options.forEach((o, i) => { if (!o) invalid.push(['optionA', 'optionB', 'optionC', 'optionD'][i]); });
    markInvalid(ADD_FIELDS, invalid);

    if (errors.length) {
        showFormErrors('addQuestionErrors', errors);
        return;
    }
    showFormErrors('addQuestionErrors', []);

    userContent.customQuestions.push(newQ);
    rebuildDB();
    if (!saveData()) {
        userContent.customQuestions.pop();
        rebuildDB();
        return;
    }

    ['qContext', 'qText', 'optionA', 'optionB', 'optionC', 'optionD', 'qExplanation']
        .forEach(id => { document.getElementById(id).value = ''; });

    renderQuestionsTable();
    updateUI();
    showToast('✓ تم إضافة السؤال بنجاح', 'success');
}

// ---------- جدول الأسئلة مع ترقيم صفحات ----------
const TABLE_PAGE_SIZE = 50;
let tablePage = 1;

function filteredQuestions() {
    const section = document.getElementById('filterSection').value;
    const difficulty = document.getElementById('filterDifficulty').value;
    const search = document.getElementById('filterSearch').value.trim();

    return questionsDB.filter(q =>
        (section === 'all' || q.section === section) &&
        (difficulty === 'all' || q.difficulty === difficulty) &&
        (!search || String(q.text).includes(search))
    );
}

function renderQuestionsTable() {
    const filtered = filteredQuestions();
    const pages = Math.max(1, Math.ceil(filtered.length / TABLE_PAGE_SIZE));
    tablePage = Math.min(tablePage, pages);
    const start = (tablePage - 1) * TABLE_PAGE_SIZE;
    const rows = filtered.slice(start, start + TABLE_PAGE_SIZE);

    const tbody = document.getElementById('questionsTableBody');
    tbody.innerHTML = rows.length ? rows.map((q, i) => `
        <tr>
            <td>${start + i + 1}</td>
            <td class="cell-text">${escapeHTML(q.text)}</td>
            <td>${escapeHTML(SECTION_LABELS[q.section] || q.section)}</td>
            <td><span class="question-difficulty difficulty-${safeToken(q.difficulty, DIFFICULTIES, 'medium')}">${escapeHTML(getDifficultyLabel(q.difficulty))}</span></td>
            <td>
                <div class="table-actions">
                    <button type="button" class="action-btn edit" data-action="edit-question" data-id="${safeId(q.id)}" aria-label="تعديل السؤال">✏️</button>
                    <button type="button" class="action-btn delete" data-action="delete-question" data-id="${safeId(q.id)}" aria-label="حذف السؤال">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="5" class="cell-empty">لا توجد أسئلة مطابقة</td></tr>';

    const pagination = document.getElementById('questionsPagination');
    pagination.innerHTML = pages > 1 ? `
        <button type="button" class="btn btn-sm btn-secondary" data-action="table-page" data-page-num="${tablePage - 1}" ${tablePage === 1 ? 'disabled' : ''}>السابق</button>
        <span>صفحة ${tablePage} من ${pages} (${filtered.length} سؤالاً)</span>
        <button type="button" class="btn btn-sm btn-secondary" data-action="table-page" data-page-num="${tablePage + 1}" ${tablePage === pages ? 'disabled' : ''}>التالي</button>
    ` : `<span>${filtered.length} سؤالاً</span>`;
}

function filterQuestions() {
    tablePage = 1;
    renderQuestionsTable();
}

async function deleteQuestion(qId) {
    const q = questionsDB.find(x => x.id === qId);
    if (!q) return;
    const ok = await askConfirm(`سيُحذف السؤال: «${String(q.text).slice(0, 60)}»`, { title: 'حذف سؤال', okLabel: 'حذف' });
    if (!ok) return;

    if (q.custom) {
        userContent.customQuestions = userContent.customQuestions.filter(x => x.id !== qId);
    } else {
        if (!userContent.deletedQuestionIds.includes(qId)) userContent.deletedQuestionIds.push(qId);
        delete userContent.questionOverrides[qId];
    }
    rebuildDB();
    saveData();
    renderQuestionsTable();
    updateUI();
    showToast('حُذف السؤال');
}

function editQuestion(qId) {
    const q = questionsDB.find(x => x.id === qId);
    if (!q) return;

    document.getElementById('editModalContent').innerHTML = `
        <div class="form-group">
            <label class="form-label" for="editText">نص السؤال</label>
            <textarea class="form-textarea" id="editText">${escapeHTML(q.text)}</textarea>
        </div>
        <fieldset class="form-group form-fieldset">
            <legend class="form-label">الخيارات</legend>
            ${[0, 1, 2, 3].map(i => `
                <input type="text" class="form-input stack-gap-sm" id="editOpt${i}"
                       aria-label="الخيار ${OPTION_LETTERS[i]}" value="${escapeHTML(q.options[i] || '')}">
            `).join('')}
        </fieldset>
        <div class="form-group">
            <label class="form-label" for="editCorrect">الإجابة الصحيحة</label>
            <select class="form-select" id="editCorrect">
                ${OPTION_LETTERS.map((letter, i) => `<option value="${i}" ${q.correct === i ? 'selected' : ''}>${letter}</option>`).join('')}
            </select>
        </div>
        <div class="form-group">
            <label class="form-label" for="editExplanation">الشرح</label>
            <textarea class="form-textarea" id="editExplanation">${escapeHTML(q.explanation || '')}</textarea>
        </div>
        <div class="form-errors is-hidden" id="editErrors" role="alert"></div>
        <button type="button" class="btn btn-success btn-block" data-action="save-edit" data-id="${safeId(q.id)}">حفظ التعديلات</button>
    `;

    openModal('editModal', '#editText');
}

function saveEdit(qId) {
    const q = questionsDB.find(x => x.id === qId);
    if (!q) return;

    const updated = {
        ...q,
        text: document.getElementById('editText').value.trim(),
        options: [0, 1, 2, 3].map(i => document.getElementById(`editOpt${i}`).value.trim()),
        correct: parseInt(document.getElementById('editCorrect').value, 10),
        explanation: document.getElementById('editExplanation').value.trim()
    };

    const errors = validateQuestion(updated);
    if (errors.length) {
        showFormErrors('editErrors', errors);
        return;
    }

    Object.assign(q, updated);
    // تعديل سؤال عينة يُحفظ كتجاوز (override) حتى لا يضيع عند تحديث المحتوى
    if (!q.custom) userContent.questionOverrides[q.id] = { ...q };

    saveData();
    closeModal('editModal');
    renderQuestionsTable();
    showToast('✓ حُفظت التعديلات', 'success');
}

function createTest() {
    const name = document.getElementById('testName').value.trim();
    const verbalCount = parseInt(document.getElementById('testVerbalCount').value, 10);
    const quantCount = parseInt(document.getElementById('testQuantCount').value, 10);
    const timeLimit = parseInt(document.getElementById('testTime').value, 10);

    const errors = [];
    if (!name || name.length < 3) errors.push('اسم الاختبار قصير جداً (3 أحرف على الأقل)');
    if (testsDB.some(t => t.name === name)) errors.push('يوجد اختبار آخر بنفس الاسم');
    if (isNaN(verbalCount) || verbalCount < 0) errors.push('عدد الأسئلة اللفظية غير صالح');
    if (isNaN(quantCount) || quantCount < 0) errors.push('عدد الأسئلة الكمية غير صالح');
    if (verbalCount + quantCount === 0) errors.push('يجب أن يحتوي الاختبار على سؤال واحد على الأقل');
    if (isNaN(timeLimit) || timeLimit < 1) errors.push('مدة الاختبار يجب أن تكون دقيقة واحدة على الأقل');

    const availableVerbal = questionsDB.filter(q => q.section === 'verbal').length;
    const availableQuant = questionsDB.filter(q => q.section === 'quant').length;
    if (verbalCount > availableVerbal) errors.push(`عدد الأسئلة اللفظية المطلوب (${verbalCount}) أكبر من المتوفر (${availableVerbal})`);
    if (quantCount > availableQuant) errors.push(`عدد الأسئلة الكمية المطلوب (${quantCount}) أكبر من المتوفر (${availableQuant})`);

    if (errors.length) {
        showFormErrors('createTestErrors', errors);
        return;
    }
    showFormErrors('createTestErrors', []);

    userContent.customTests.push({
        id: Date.now(),
        name,
        verbalCount,
        quantCount,
        timeLimit,
        description: `${verbalCount + quantCount} سؤال في ${timeLimit} دقيقة`,
        custom: true
    });
    rebuildDB();
    saveData();

    document.getElementById('testName').value = '';
    renderAdminTests();
    renderTests();
    updateUI();
    showToast('✓ تم إنشاء الاختبار بنجاح', 'success');
}

function renderAdminTests() {
    document.getElementById('adminTestsList').innerHTML = testsDB.map(test => `
        <div class="admin-list-row">
            <div>
                <strong>${escapeHTML(test.name)}</strong>
                <span class="admin-list-meta">(${safeId(test.verbalCount) + safeId(test.quantCount)} سؤال - ${safeId(test.timeLimit)} دقيقة)</span>
            </div>
            <button type="button" class="btn btn-sm btn-danger" data-action="delete-test" data-id="${safeId(test.id)}">حذف</button>
        </div>
    `).join('');
}

async function deleteTest(testId) {
    const t = testsDB.find(x => x.id === testId);
    if (!t) return;
    const ok = await askConfirm(`سيُحذف الاختبار «${t.name}»`, { title: 'حذف اختبار', okLabel: 'حذف' });
    if (!ok) return;

    if (t.custom) {
        userContent.customTests = userContent.customTests.filter(x => x.id !== testId);
    } else if (!userContent.deletedTestIds.includes(testId)) {
        userContent.deletedTestIds.push(testId);
    }
    rebuildDB();
    saveData();
    renderAdminTests();
    renderTests();
    updateUI();
    showToast('حُذف الاختبار');
}

// ==================== Gamification: Points, Levels, Badges ====================
const BADGES = [
    { id: 'first_q',    icon: '🎯', name: 'البداية',        desc: 'أجب على أول سؤال',        check: p => p.questionsAnswered >= 1 },
    { id: 'q10',        icon: '🌱', name: 'مبتدئ',          desc: 'أجب على 10 أسئلة',        check: p => p.questionsAnswered >= 10 },
    { id: 'q50',        icon: '📚', name: 'مثابر',           desc: 'أجب على 50 سؤالاً',        check: p => p.questionsAnswered >= 50 },
    { id: 'q100',       icon: '🎓', name: 'متفوق',           desc: 'أجب على 100 سؤال',         check: p => p.questionsAnswered >= 100 },
    { id: 'q500',       icon: '🏆', name: 'خبير',            desc: 'أجب على 500 سؤال',         check: p => p.questionsAnswered >= 500 },
    { id: 'streak3',    icon: '🔥', name: 'متحمس',           desc: 'حافظ على تتابع 3 أيام',    check: p => (p.streak || 0) >= 3 },
    { id: 'streak7',    icon: '⚡', name: 'أسبوع كامل',       desc: 'حافظ على تتابع 7 أيام',    check: p => (p.streak || 0) >= 7 },
    { id: 'streak30',   icon: '💎', name: 'لا يُهزم',         desc: 'حافظ على تتابع 30 يوماً',   check: p => (p.streak || 0) >= 30 },
    { id: 'accuracy80', icon: '🎖️', name: 'دقيق',            desc: 'حقق 80% دقة (50+ سؤال)',   check: p => p.questionsAnswered >= 50 && (p.correctAnswers / p.questionsAnswered) >= 0.8 },
    { id: 'firstTest',  icon: '📝', name: 'مختبر',            desc: 'أكمل اختباراً واحداً',      check: p => (p.testResults || []).length >= 1 },
    { id: 'test10',     icon: '🏅', name: 'بطل الاختبارات',   desc: 'أكمل 10 اختبارات',          check: p => (p.testResults || []).length >= 10 },
    { id: 'daily7',     icon: '📅', name: 'منتظم',            desc: 'أكمل تحدي يومي 7 مرات',     check: p => (p.dailyChallengesCompleted || 0) >= 7 },
    { id: 'verbal100',  icon: '🗣️', name: 'لغوي',             desc: 'أجب 100 سؤال لفظي',        check: p => sumCategoryAttempts(p, 'verbal') >= 100 },
    { id: 'quant100',   icon: '🧮', name: 'حاسب',             desc: 'أجب 100 سؤال كمي',         check: p => sumCategoryAttempts(p, 'quant') >= 100 },
    { id: 'level5',     icon: '⭐', name: 'المستوى 5',         desc: 'وصلت إلى المستوى 5',        check: p => getLevel(p.points || 0) >= 5 },
    { id: 'level10',    icon: '🌟', name: 'المستوى 10',        desc: 'وصلت إلى المستوى 10',       check: p => getLevel(p.points || 0) >= 10 }
];

function awardPoints(amount) {
    const prevLevel = getLevel(userProgress.points || 0);
    userProgress.points = (userProgress.points || 0) + amount;
    const newLevel = getLevel(userProgress.points);
    if (newLevel > prevLevel) {
        showToast(`🎉 ترقية! وصلت إلى المستوى ${newLevel}`, 'success', 4000);
    }
}

function checkAndAwardBadges() {
    userProgress.badges = userProgress.badges || [];
    BADGES.forEach(badge => {
        if (!userProgress.badges.includes(badge.id) && badge.check(userProgress)) {
            userProgress.badges.push(badge.id);
            showToast(`${badge.icon} شارة جديدة: ${badge.name}`, 'success', 4000);
        }
    });
    saveData();
}

function renderBadges() {
    const container = document.getElementById('badgesContainer');
    if (!container) return;
    const earned = userProgress.badges || [];
    container.innerHTML = BADGES.map(b => `
        <div class="badge-item ${earned.includes(b.id) ? 'unlocked' : 'locked'}" role="listitem">
            <div class="badge-icon" aria-hidden="true">${b.icon}</div>
            <div class="badge-name">${escapeHTML(b.name)}</div>
            <div class="badge-desc">${escapeHTML(b.desc)}</div>
            <span class="sr-only">${earned.includes(b.id) ? 'محصّلة' : 'غير محصّلة'}</span>
        </div>
    `).join('');
    const countEl = document.getElementById('badgesCount');
    if (countEl) countEl.textContent = `${earned.length} / ${BADGES.length}`;
}

function renderLevelDisplay() {
    const container = document.getElementById('levelDisplay');
    if (!container) return;
    const points = userProgress.points || 0;
    const level = getLevel(points);
    const progress = getLevelProgress(points);
    const inLevel = points % POINTS_PER_LEVEL;
    container.innerHTML = `
        <div class="level-header">
            <div>
                <div class="level-caption">المستوى الحالي</div>
                <div class="level-value"><span aria-hidden="true">⭐</span> ${level}</div>
            </div>
            <div class="level-points">${points} نقطة</div>
        </div>
        <div class="level-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"
             aria-label="التقدم نحو المستوى ${level + 1}">
            <div class="level-bar-fill" style="width:${progress}%">${inLevel} / ${POINTS_PER_LEVEL}</div>
        </div>
    `;
}

function checkDailyChallenge() {
    const today = getTodayKey();
    userProgress.dailyChallenge = userProgress.dailyChallenge || {};
    if (userProgress.dailyChallenge.date !== today) {
        userProgress.dailyChallenge = { date: today, completed: false, correct: 0, total: 5 };
        saveData();
    }
    renderDailyChallenge();
}

function renderDailyChallenge() {
    const card = document.getElementById('dailyChallengeCard');
    if (!card) return;
    const dc = userProgress.dailyChallenge || {};
    card.classList.toggle('completed', Boolean(dc.completed));
    card.innerHTML = dc.completed ? `
        <div class="daily-row">
            <div>
                <div class="daily-title">✓ تم إنجاز تحدي اليوم</div>
                <div class="daily-sub">أصبت ${dc.correct} من ${dc.total} — عُد غداً لتحدٍّ جديد</div>
            </div>
            <div class="daily-emoji" aria-hidden="true">🎉</div>
        </div>
    ` : `
        <div class="daily-row">
            <div>
                <div class="daily-title"><span aria-hidden="true">🔥</span> تحدي اليوم</div>
                <div class="daily-sub">5 أسئلة - مكافأة 50 نقطة عند الإكمال</div>
            </div>
            <button type="button" class="btn btn-glass" data-action="start-daily">ابدأ الآن</button>
        </div>
    `;
}

function startDailyChallenge() {
    if (questionsDB.length < 5) {
        showToast('لا توجد أسئلة كافية', 'warning');
        return;
    }
    const pool = buildSessionQuestions(questionsDB).slice(0, 5);
    currentSession = {
        ...EMPTY_SESSION,
        mode: 'daily',
        section: 'mixed',
        questions: pool,
        answers: new Array(5).fill(null),
        startTime: Date.now()
    };
    setPracticeBackHandler();
    persistSession();
    showPage('practice');
    renderQuestion();
}

function completeDailyChallenge(correctCount) {
    userProgress.dailyChallenge.completed = true;
    userProgress.dailyChallenge.correct = correctCount;
    userProgress.dailyChallengesCompleted = (userProgress.dailyChallengesCompleted || 0) + 1;
    awardPoints(50);
    showToast('🎉 أحسنت! +50 نقطة مكافأة', 'success', 4000);
    renderDailyChallenge();
}

// ==================== Print / PDF Export ====================
// نطبع من داخل الصفحة نفسها: window.open يحجبه المتصفح كثيراً،
// والنافذة الجديدة ترث سياسة الأمان فلا تسمح بسكربت مضمّن فيها.
function printCurrentView() {
    window.print();
}

function exportProgressReport() {
    const points = userProgress.points || 0;
    const accuracy = userProgress.questionsAnswered > 0
        ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)
        : 0;
    const earned = (userProgress.badges || []).map(id => BADGES.find(b => b.id === id)).filter(Boolean);

    const stats = [
        ['المستوى', getLevel(points)],
        ['النقاط', points],
        ['الأسئلة المُجابة', userProgress.questionsAnswered || 0],
        ['الإجابات الصحيحة', userProgress.correctAnswers || 0],
        ['نسبة الدقة', `${accuracy}%`],
        ['أيام متتالية', userProgress.streak || 0],
        ['الاختبارات المُكتملة', (userProgress.testResults || []).length],
        ['الشارات المُحصّلة', `${earned.length} / ${BADGES.length}`]
    ];

    let report = document.getElementById('printReport');
    if (!report) {
        report = document.createElement('section');
        report.id = 'printReport';
        report.className = 'print-only';
        document.body.appendChild(report);
    }
    report.innerHTML = `
        <h1>تقرير التقدم - قدراتي</h1>
        <p>التاريخ: ${escapeHTML(new Date().toLocaleDateString('ar-SA'))}</p>
        <h2>الإحصائيات</h2>
        ${stats.map(([k, v]) => `<div class="print-stat"><span>${escapeHTML(k)}</span><strong>${escapeHTML(v)}</strong></div>`).join('')}
        <h2>الشارات المُحصّلة</h2>
        <p>${earned.length ? earned.map(b => escapeHTML(`${b.icon} ${b.name}`)).join(' • ') : 'لا توجد شارات بعد'}</p>
    `;
    document.body.classList.add('printing-report');
    window.print();
    // تُستدعى بعد إغلاق حوار الطباعة في كل المتصفحات الحديثة
    setTimeout(() => document.body.classList.remove('printing-report'), 500);
}

// ==================== Admin: Backup / Restore / CSV ====================
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function exportAllData() {
    const blob = new Blob([JSON.stringify({
        version: 2,
        ...userContent,
        progress: userProgress,
        exportedAt: new Date().toISOString()
    }, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `qudurat-backup-${getTodayKey()}.json`);
    showToast('✓ تم تصدير النسخة الاحتياطية', 'success');
}

function setBusy(input, busy) {
    const label = input.closest('.btn-file');
    if (label) label.classList.toggle('is-busy', busy);
    input.disabled = busy;
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => reject(reader.error || new Error('تعذر قراءة الملف'));
        reader.readAsText(file);
    });
}

const MAX_IMPORT_ITEMS = 5000;

async function importAllData(input) {
    const file = input.files[0];
    if (!file) return;
    setBusy(input, true);
    showToast('جارٍ قراءة الملف…');
    try {
        const data = JSON.parse(await readFileAsText(file));
        const isV2 = data && typeof data === 'object' && data.version >= 2;
        const isLegacy = data && typeof data === 'object'
            && (Array.isArray(data.questions) || Array.isArray(data.tests) || data.progress);
        if (!isV2 && !isLegacy) {
            showToast('❌ ملف غير صالح: البنية غير معروفة', 'error', 5000);
            return;
        }
        const proceed = await askConfirm('سيتم استبدال جميع البيانات الحالية (الأسئلة المخصصة والاختبارات والتقدم). هل أنت متأكد؟',
            { title: 'استعادة نسخة احتياطية', okLabel: 'استبدال' });
        if (!proceed) return;

        let skipped = 0;
        const next = emptyUserContent();

        if (isV2) {
            const rawQ = (Array.isArray(data.customQuestions) ? data.customQuestions : []).slice(0, MAX_IMPORT_ITEMS);
            next.customQuestions = rawQ.filter(isValidImportedQuestion).map(q => ({ ...q, custom: true }));
            skipped += rawQ.length - next.customQuestions.length;

            const rawOverrides = (data.questionOverrides && typeof data.questionOverrides === 'object' && !Array.isArray(data.questionOverrides))
                ? Object.entries(data.questionOverrides).slice(0, MAX_IMPORT_ITEMS) : [];
            for (const [id, q] of rawOverrides) {
                if (isValidImportedQuestion(q)) next.questionOverrides[id] = q;
                else skipped++;
            }

            next.deletedQuestionIds = (Array.isArray(data.deletedQuestionIds) ? data.deletedQuestionIds : []).filter(Number.isFinite);
            next.deletedTestIds = (Array.isArray(data.deletedTestIds) ? data.deletedTestIds : []).filter(Number.isFinite);

            const rawT = (Array.isArray(data.customTests) ? data.customTests : []).slice(0, MAX_IMPORT_ITEMS);
            next.customTests = rawT.filter(isValidImportedTest).map(t => ({ ...t, custom: true }));
            skipped += rawT.length - next.customTests.length;

            userContent = next;
            if (data.progress && typeof data.progress === 'object' && !Array.isArray(data.progress)) {
                // ملف النسخة الاحتياطية خارجي بالكامل — يُجبر التقدم على شكله الصحيح
                userProgress = pruneProgress(sanitizeProgress({ ...userProgress, ...data.progress }));
            }
        } else {
            // نسخة احتياطية بالصيغة القديمة (قاعدة كاملة): نستخرج محتوى المستخدم منها
            const rawQ = (Array.isArray(data.questions) ? data.questions : []).slice(0, MAX_IMPORT_ITEMS);
            const validQ = rawQ.filter(isValidImportedQuestion);
            skipped += rawQ.length - validQ.length;
            const rawT = (Array.isArray(data.tests) ? data.tests : []).slice(0, MAX_IMPORT_ITEMS);
            const validT = rawT.filter(isValidImportedTest);
            skipped += rawT.length - validT.length;
            const migrated = migrateLegacyData({ ...data, questions: validQ, tests: validT }, getSampleQuestions(), getSampleTests());
            userContent = migrated.userContent;
            if (migrated.progress) userProgress = pruneProgress(sanitizeProgress({ ...userProgress, ...migrated.progress }));
        }

        rebuildDB();
        saveData();
        renderQuestionsTable();
        renderAdminTests();
        renderTests();
        renderProgress();
        updateUI();
        showToast(skipped > 0
            ? `✓ تمت الاستعادة مع استبعاد ${skipped} عنصراً غير صالح`
            : '✓ تم استعادة البيانات بنجاح', skipped > 0 ? 'warning' : 'success', 5000);
    } catch (err) {
        console.error('فشل استيراد النسخة الاحتياطية:', err);
        showToast('❌ ملف غير صالح أو تالف', 'error');
    } finally {
        setBusy(input, false);
        input.value = '';
    }
}

function exportQuestionsCSV() {
    const headers = ['id', 'section', 'subcategory', 'difficulty', 'text', 'optionA', 'optionB', 'optionC', 'optionD', 'correct', 'explanation'];
    const rows = questionsDB.map(q => [
        q.id, q.section, q.subcategory, q.difficulty,
        q.text, q.options[0], q.options[1], q.options[2], q.options[3],
        q.correct, q.explanation || ''
    ].map(escapeCSV).join(','));
    const csv = '﻿' + headers.join(',') + '\n' + rows.join('\n');
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `qudurat-questions-${getTodayKey()}.csv`);
    showToast('✓ تم تصدير الأسئلة', 'success');
}

async function importQuestionsCSV(input) {
    const file = input.files[0];
    if (!file) return;
    setBusy(input, true);
    showToast('جارٍ قراءة الملف…');
    try {
        let text = await readFileAsText(file);
        if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
        const rows = parseCSV(text);
        if (rows.length < 2) {
            showToast('❌ الملف فارغ', 'error');
            return;
        }
        const headers = rows[0].map(h => h.trim());
        const required = ['section', 'subcategory', 'difficulty', 'text', 'optionA', 'optionB', 'optionC', 'optionD', 'correct'];
        const missing = required.filter(h => !headers.includes(h));
        if (missing.length) {
            showToast(`❌ أعمدة ناقصة: ${missing.join('، ')}`, 'error', 5000);
            return;
        }
        const idx = name => headers.indexOf(name);
        const added = [];
        let skipped = 0;
        const limit = Math.min(rows.length, MAX_IMPORT_ITEMS + 1);
        for (let i = 1; i < limit; i++) {
            const r = rows[i];
            if (!r || r.length < required.length) { skipped++; continue; }
            const newQ = {
                id: Date.now() + i,
                section: (r[idx('section')] || '').trim(),
                subcategory: (r[idx('subcategory')] || '').trim(),
                difficulty: (r[idx('difficulty')] || '').trim(),
                text: (r[idx('text')] || '').trim(),
                options: ['optionA', 'optionB', 'optionC', 'optionD'].map(h => (r[idx(h)] || '').trim()),
                correct: parseInt(r[idx('correct')], 10),
                explanation: idx('explanation') >= 0 ? (r[idx('explanation')] || '').trim() : '',
                custom: true
            };
            // نفس التحقق الذي يمرّ به الاستيراد من JSON — التصنيف يدخل HTML
            if (validateQuestion(newQ).length === 0 && validateQuestionMeta(newQ).length === 0) added.push(newQ);
            else skipped++;
        }
        if (!added.length) {
            showToast(`❌ لم يُستورد أي سؤال (${skipped} صفاً غير صالح)`, 'error', 5000);
            return;
        }
        userContent.customQuestions.push(...added);
        rebuildDB();
        saveData();
        renderQuestionsTable();
        updateUI();
        showToast(`✓ تم استيراد ${added.length} سؤالاً${skipped ? ` (تُخطي ${skipped})` : ''}`, 'success', 4000);
    } catch (err) {
        console.error('فشل استيراد ملف CSV:', err);
        showToast('❌ خطأ في قراءة الملف', 'error');
    } finally {
        setBusy(input, false);
        input.value = '';
    }
}

// ==================== Service Worker / PWA ====================
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch(err => {
            // العمل دون اتصال لن يتوفر — نسجّل السبب بدل ابتلاعه بصمت
            console.warn('تعذر تسجيل Service Worker، لن يعمل التطبيق دون اتصال:', err);
        });
    });
}

function updateUI() {
    document.getElementById('verbalProgress').textContent = `${calculateSectionProgress('verbal')}% مكتمل`;
    document.getElementById('quantProgress').textContent = `${calculateSectionProgress('quant')}% مكتمل`;
    document.getElementById('totalQuestions').textContent = questionsDB.length;
    document.getElementById('totalTests').textContent = testsDB.length;
    renderMasteryBars();
}

function calculateSectionProgress(section) {
    const subs = SUBCATEGORIES[section] || [];
    if (!subs.length) return 0;
    const total = subs.reduce((sum, sub) => sum + getCategoryMastery(userProgress, section, sub), 0);
    return Math.round(total / subs.length);
}

// ==================== Event wiring (بلا onclick مضمّنة — شرط تفعيل CSP) ====================
const ACTIONS = {
    'toggle-theme': toggleTheme,
    'cycle-font-size': cycleFontSize,
    'toggle-menu': toggleMobileMenu,
    'page': (el) => showPage(el.dataset.page),
    'practice': (el) => startPractice(el.dataset.section, el.dataset.subcategory),
    'start-test': (el) => startTest(Number(el.dataset.id)),
    'start-daily': startDailyChallenge,
    'select-option': (el) => selectOption(Number(el.dataset.index)),
    'prev-question': previousQuestion,
    'next-question': nextQuestion,
    'finish-practice': finishPractice,
    'toggle-save': (el) => toggleSaveQuestion(Number(el.dataset.id)),
    'remove-saved': (el) => removeSaved(Number(el.dataset.id)),
    'filter-solved': (el) => filterSolved(el.dataset.filter, el),
    'more-solved': showMoreSolved,
    'admin-tab': (el) => showAdminTab(el.dataset.tab, el),
    'add-question': addQuestion,
    'edit-question': (el) => editQuestion(Number(el.dataset.id)),
    'delete-question': (el) => deleteQuestion(Number(el.dataset.id)),
    'save-edit': (el) => saveEdit(Number(el.dataset.id)),
    'table-page': (el) => { tablePage = Number(el.dataset.pageNum); renderQuestionsTable(); },
    'create-test': createTest,
    'delete-test': (el) => deleteTest(Number(el.dataset.id)),
    'export-all': exportAllData,
    'export-csv': exportQuestionsCSV,
    'export-progress': exportProgressReport,
    'print': printCurrentView,
    'change-password': changeAdminPassword,
    'logout-admin': logoutAdmin,
    'close-modal': () => closeModal('editModal'),
    'close-password': () => resolvePassword(null),
    'confirm-ok': () => resolveConfirm(true),
    'confirm-cancel': () => resolveConfirm(false)
};

const CHANGES = {
    'update-subcategories': updateSubcategories,
    'filter-questions': filterQuestions,
    'import-json': (el) => importAllData(el),
    'import-csv': (el) => importQuestionsCSV(el)
};

function bindEvents() {
    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-action]');
        if (!el || el.disabled) return;
        const handler = ACTIONS[el.dataset.action];
        if (!handler) return;
        e.preventDefault();
        handler(el, e);
    });

    document.addEventListener('change', (e) => {
        const el = e.target.closest('[data-change]');
        if (!el) return;
        const handler = CHANGES[el.dataset.change];
        if (handler) handler(el, e);
    });

    // البحث في جدول الأسئلة يستجيب أثناء الكتابة لا عند الخروج من الحقل فقط
    const search = document.getElementById('filterSearch');
    if (search) search.addEventListener('input', filterQuestions);

    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.options-list')) handleOptionKeydown(e);
    });

    // إغلاق النوافذ بالنقر على الخلفية
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => { if (e.target === modal) dismissTopModal(); });
    });

    // نافذة كلمة المرور: الإرسال بـEnter، ونحتفظ بقيمة حقل التأكيد قبل إغلاقها
    const pwdForm = document.getElementById('passwordForm');
    pwdForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input2 = document.getElementById('passwordInput2');
        input2.dataset.lastValue = input2.value;
        resolvePassword(document.getElementById('passwordInput1').value);
    });

    window.addEventListener('hashchange', renderRoute);

    // تحذير المتصفح قبل إغلاق التبويب أثناء اختبار مؤقت جارٍ
    window.addEventListener('beforeunload', (e) => {
        if (currentSession.mode === 'test' && timerInterval) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Initialize app
init();

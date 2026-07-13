// ==================== Data Store ====================
// questionsDB/testsDB تُبنى عند كل تشغيل من (أسئلة العينة في الكود + محتوى المستخدم).
// لا يُخزَّن في localStorage إلا محتوى المستخدم، حتى تصل تحديثات المحتوى
// في الإصدارات الجديدة إلى المستخدمين الحاليين.
let questionsDB = [];
let testsDB = [];
let userContent = {
    customQuestions: [],      // أسئلة أضافها المشرف أو استُوردت
    questionOverrides: {},    // تعديلات المشرف على أسئلة العينة (id -> سؤال)
    deletedQuestionIds: [],   // أسئلة عينة حذفها المشرف
    customTests: [],
    deletedTestIds: []
};
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
let currentSession = {
    mode: null, // 'practice' or 'test'
    section: null,
    subcategory: null,
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: null,
    timeLimit: null,
    timerInterval: null
};

// ==================== Theme & Accessibility ====================
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي');
    }
    localStorage.setItem('qudurat_theme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

const FONT_SIZES = ['small', 'medium', 'large', 'xlarge'];
const FONT_SIZE_LABELS = { small: 'صغير', medium: 'متوسط', large: 'كبير', xlarge: 'كبير جداً' };

function applyFontSize(size) {
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('qudurat_font_size', size);
}

function cycleFontSize() {
    const current = document.documentElement.getAttribute('data-font-size') || 'medium';
    const idx = FONT_SIZES.indexOf(current);
    const next = FONT_SIZES[(idx + 1) % FONT_SIZES.length];
    applyFontSize(next);
    showToast(`حجم الخط: ${FONT_SIZE_LABELS[next]}`);
}

function loadPreferences() {
    const savedTheme = localStorage.getItem('qudurat_theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    const savedSize = localStorage.getItem('qudurat_font_size');
    if (savedSize) applyFontSize(savedSize);
    else applyFontSize('medium');
}

// ==================== Toast Notifications ====================
function showToast(message, type = 'info', duration = 3000) {
    const existing = document.getElementById('toastContainer');
    const container = existing || (() => {
        const c = document.createElement('div');
        c.id = 'toastContainer';
        c.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:10000;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none;';
        c.setAttribute('aria-live', 'polite');
        c.setAttribute('aria-atomic', 'true');
        document.body.appendChild(c);
        return c;
    })();

    const colors = {
        info: 'var(--primary)',
        success: 'var(--success)',
        error: 'var(--danger)',
        warning: 'var(--warning)'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `background:${colors[type] || colors.info};color:#fff;padding:0.75rem 1.5rem;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.2);font-weight:600;animation:toastIn 0.3s ease;pointer-events:auto;`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================== Initialization ====================
function init() {
    loadPreferences();
    loadData();
    updateUI();
    renderStreak();
    renderTests();
    renderSolvedExamples();
    renderSavedQuestions();
    renderProgress();
    renderQuestionsTable();
    registerServiceWorker();
    checkDailyChallenge();
    renderRoute(); // دعم الروابط العميقة (مثل ‎#tests) عند فتح الصفحة
}

function loadData() {
    const stored = localStorage.getItem('qudurat_data');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            if (data && typeof data === 'object' && data.version >= 2) {
                applyStoredContent(data);
                if (data.progress && typeof data.progress === 'object') {
                    userProgress = { ...userProgress, ...data.progress };
                }
            } else if (data && typeof data === 'object') {
                migrateLegacyData(data);
                saveData();
            }
        } catch (err) {
            console.error('تعذر قراءة البيانات المحفوظة:', err);
            // نحتفظ بنسخة من البيانات التالفة لإمكانية الاسترجاع اليدوي
            try {
                localStorage.setItem('qudurat_data_corrupt_backup', stored);
            } catch (backupErr) {
                console.error('تعذر حفظ نسخة من البيانات التالفة:', backupErr);
            }
            localStorage.removeItem('qudurat_data');
            showToast('تعذر قراءة بياناتك المحفوظة فأُعيدت التهيئة، وحُفظت نسخة منها للاسترجاع', 'error', 6000);
        }
    }
    questionsDB = buildQuestionsDB();
    testsDB = buildTestsDB();
}

function applyStoredContent(data) {
    userContent = {
        customQuestions: Array.isArray(data.customQuestions) ? data.customQuestions : [],
        questionOverrides: (data.questionOverrides && typeof data.questionOverrides === 'object') ? data.questionOverrides : {},
        deletedQuestionIds: Array.isArray(data.deletedQuestionIds) ? data.deletedQuestionIds : [],
        customTests: Array.isArray(data.customTests) ? data.customTests : [],
        deletedTestIds: Array.isArray(data.deletedTestIds) ? data.deletedTestIds : []
    };
}

// الصيغة القديمة كانت تخزّن قاعدة الأسئلة كاملة؛ نستخرج منها محتوى
// المستخدم فقط. لا نستنتج الحذف من الغياب: بيانات إصدار أقدم قد
// تنقصها أسئلة أُضيفت لاحقاً، واعتبارها محذوفة يمنع وصولها نهائياً.
function migrateLegacyData(data) {
    const sameQuestion = (a, b) =>
        a.text === b.text && a.section === b.section && a.subcategory === b.subcategory &&
        a.difficulty === b.difficulty && a.correct === b.correct &&
        (a.context || null) === (b.context || null) && (a.explanation || '') === (b.explanation || '') &&
        JSON.stringify(a.options) === JSON.stringify(b.options);

    if (Array.isArray(data.questions)) {
        const sampleById = new Map(getSampleQuestions().map(q => [q.id, q]));
        for (const q of data.questions) {
            if (!q || typeof q !== 'object') continue;
            const sample = sampleById.get(q.id);
            if (!sample) {
                userContent.customQuestions.push({ ...q, custom: true });
            } else if (!sameQuestion(q, sample)) {
                userContent.questionOverrides[q.id] = q;
            }
        }
    }
    if (Array.isArray(data.tests)) {
        const sampleTestIds = new Set(getSampleTests().map(t => t.id));
        for (const t of data.tests) {
            if (!t || typeof t !== 'object') continue;
            if (!sampleTestIds.has(t.id)) {
                userContent.customTests.push({ ...t, custom: true });
            }
        }
    }
    if (data.progress && typeof data.progress === 'object') {
        const p = { ...data.progress };
        // توحيد مفاتيح التواريخ على الصيغة الجديدة (YYYY-MM-DD محلية)
        if (p.lastActive) {
            const d = new Date(p.lastActive);
            if (!isNaN(d)) p.lastActive = getTodayKey(d);
        }
        if (p.dailyStats && typeof p.dailyStats === 'object') {
            const converted = {};
            for (const [key, val] of Object.entries(p.dailyStats)) {
                const d = new Date(key);
                converted[isNaN(d) ? key : getTodayKey(d)] = val;
            }
            p.dailyStats = converted;
        }
        userProgress = { ...userProgress, ...p };
    }
}

function buildQuestionsDB() {
    const merged = [];
    for (const q of getSampleQuestions()) {
        if (userContent.deletedQuestionIds.includes(q.id)) continue;
        merged.push(userContent.questionOverrides[q.id] || q);
    }
    return merged.concat(userContent.customQuestions);
}

function buildTestsDB() {
    const merged = [];
    for (const t of getSampleTests()) {
        if (userContent.deletedTestIds.includes(t.id)) continue;
        merged.push(t);
    }
    return merged.concat(userContent.customTests);
}

function saveData() {
    localStorage.setItem('qudurat_data', JSON.stringify({
        version: 2,
        ...userContent,
        progress: userProgress
    }));
}

// ==================== Admin Authentication ====================
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function ensureAdminAuth() {
    if (sessionStorage.getItem('qudurat_admin_unlocked') === '1') {
        return true;
    }

    const storedHash = localStorage.getItem('qudurat_admin_pwd');

    if (!storedHash) {
        const pwd = prompt('🔐 إعداد كلمة المرور لأول مرة\n\nأدخل كلمة مرور جديدة لحماية لوحة التحكم (4 أحرف على الأقل):');
        if (pwd === null) return false;
        if (!pwd || pwd.length < 4) {
            alert('كلمة المرور قصيرة جداً (4 أحرف على الأقل)');
            return false;
        }
        const confirmPwd = prompt('أعد إدخال كلمة المرور للتأكيد:');
        if (confirmPwd !== pwd) {
            alert('كلمتا المرور غير متطابقتين');
            return false;
        }
        const hash = await hashPassword(pwd);
        localStorage.setItem('qudurat_admin_pwd', hash);
        sessionStorage.setItem('qudurat_admin_unlocked', '1');
        alert('✓ تم حفظ كلمة المرور بنجاح');
        return true;
    }

    const pwd = prompt('🔐 لوحة التحكم محمية\n\nأدخل كلمة المرور:');
    if (pwd === null) return false;
    const hash = await hashPassword(pwd);
    if (hash === storedHash) {
        sessionStorage.setItem('qudurat_admin_unlocked', '1');
        return true;
    }
    alert('❌ كلمة المرور غير صحيحة');
    return false;
}

async function changeAdminPassword() {
    const oldPwd = prompt('أدخل كلمة المرور الحالية:');
    if (oldPwd === null) return;
    const oldHash = await hashPassword(oldPwd);
    if (oldHash !== localStorage.getItem('qudurat_admin_pwd')) {
        alert('❌ كلمة المرور الحالية غير صحيحة');
        return;
    }
    const newPwd = prompt('أدخل كلمة المرور الجديدة (4 أحرف على الأقل):');
    if (newPwd === null) return;
    if (!newPwd || newPwd.length < 4) {
        alert('كلمة المرور قصيرة جداً');
        return;
    }
    const confirmPwd = prompt('أعد إدخال كلمة المرور الجديدة:');
    if (confirmPwd !== newPwd) {
        alert('كلمتا المرور غير متطابقتين');
        return;
    }
    const newHash = await hashPassword(newPwd);
    localStorage.setItem('qudurat_admin_pwd', newHash);
    alert('✓ تم تغيير كلمة المرور بنجاح');
}

function logoutAdmin() {
    sessionStorage.removeItem('qudurat_admin_unlocked');
    showPage('home');
}

// ==================== Navigation ====================
// توجيه عبر hash: زر الرجوع في المتصفح يعمل، والروابط العميقة
// (مثل ‎#tests) قابلة للمشاركة. showPage تغيّر الـ hash فقط،
// وrenderRoute هي المسؤولة عن العرض عند كل تغيير.
let currentPage = '';

async function renderRoute() {
    const pageName = location.hash.replace('#', '') || 'home';
    if (pageName === currentPage) return;

    // صفحة التدريب بلا جلسة نشطة (رابط مباشر أو رجوع بعد الانتهاء)
    if (pageName === 'practice' && !currentSession.mode) {
        location.hash = 'home';
        return;
    }

    // حماية الاختبار المؤقت الجاري من مغادرة غير مقصودة بزر الرجوع
    if (currentPage === 'practice' && currentSession.mode === 'test'
        && currentSession.timerInterval && pageName !== 'results') {
        if (!confirm('لديك اختبار جارٍ — ستُلغى نتيجته إذا غادرت. هل تريد المغادرة؟')) {
            location.hash = 'practice';
            return;
        }
        currentSession.mode = null;
    }

    if (pageName === 'admin') {
        const ok = await ensureAdminAuth();
        if (!ok) {
            location.hash = currentPage || 'home';
            return;
        }
    }

    activatePage(pageName);
}

function activatePage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const page = document.getElementById(`page-${pageName}`);
    if (page) page.classList.add('active');

    const link = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (link) link.classList.add('active');

    // إغلاق قائمة الجوال بعد اختيار وجهة
    document.getElementById('navLinks').classList.remove('show');

    // Stop timer if leaving practice/test
    if (pageName !== 'practice' && currentSession.timerInterval) {
        clearInterval(currentSession.timerInterval);
        currentSession.timerInterval = null;
        document.getElementById('timerContainer').classList.remove('show');
    }

    // Refresh content
    if (pageName === 'tests') renderTests();
    if (pageName === 'saved') renderSavedQuestions();
    if (pageName === 'progress') renderProgress();
    if (pageName === 'solved') renderSolvedExamples();

    currentPage = pageName;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(pageName) {
    if (location.hash === `#${pageName}`) {
        renderRoute();
        return;
    }
    location.hash = pageName;
}

window.addEventListener('hashchange', renderRoute);

function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('show');
}

// ==================== Practice Mode ====================
function startPractice(section, subcategory) {
    const questions = questionsDB.filter(q => 
        q.section === section && q.subcategory === subcategory
    );

    if (questions.length === 0) {
        alert('لا توجد أسئلة في هذا القسم حالياً');
        return;
    }

    currentSession = {
        mode: 'practice',
        section: section,
        subcategory: subcategory,
        questions: shuffleArray([...questions]),
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        startTime: Date.now(),
        timeLimit: null,
        timerInterval: null
    };

    document.getElementById('practiceBackBtn').onclick = () => showPage(section);
    showPage('practice');
    renderQuestion();
}

function startTest(testId) {
    const test = testsDB.find(t => t.id === testId);
    if (!test) return;

    let questions = [];
    
    // Get verbal questions
    const verbalQ = shuffleArray(questionsDB.filter(q => q.section === 'verbal'));
    questions = questions.concat(verbalQ.slice(0, test.verbalCount));
    
    // Get quant questions
    const quantQ = shuffleArray(questionsDB.filter(q => q.section === 'quant'));
    questions = questions.concat(quantQ.slice(0, test.quantCount));

    if (questions.length === 0) {
        alert('لا توجد أسئلة كافية لهذا الاختبار');
        return;
    }

    currentSession = {
        mode: 'test',
        section: 'mixed',
        subcategory: null,
        questions: shuffleArray(questions),
        currentIndex: 0,
        answers: new Array(questions.length).fill(null),
        startTime: Date.now(),
        timeLimit: test.timeLimit * 60 * 1000,
        timerInterval: null,
        testName: test.name
    };

    document.getElementById('practiceBackBtn').onclick = () => {
        if (confirm('هل أنت متأكد من إنهاء الاختبار؟')) {
            finishPractice();
        }
    };

    showPage('practice');
    renderQuestion();
    startTimer();
}

function renderQuestion() {
    const q = currentSession.questions[currentSession.currentIndex];
    const total = currentSession.questions.length;
    const current = currentSession.currentIndex + 1;

    // Update progress
    document.getElementById('practiceProgress').style.width = 
        `${(current / total) * 100}%`;

    // Check if saved
    const isSaved = userProgress.savedQuestions.includes(q.id);
    const savedIcon = isSaved ? '🔖' : '☆';

    // Difficulty label
    const diffLabels = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };
    const diffClass = `difficulty-${q.difficulty}`;

    let html = `
        <button type="button" class="saved-indicator" onclick="toggleSaveQuestion(${q.id})"
                aria-pressed="${isSaved}" aria-label="حفظ السؤال للمراجعة لاحقاً">${savedIcon}</button>
        <div class="question-header">
            <span class="question-number">السؤال ${current} من ${total}</span>
            <span class="question-difficulty ${diffClass}">${diffLabels[q.difficulty]}</span>
        </div>
    `;

    if (q.context) {
        html += `<div class="question-context">${escapeHTML(q.context)}</div>`;
    }

    html += `<div class="question-text">${escapeHTML(q.text)}</div>`;

    html += '<div class="options-list" role="radiogroup" aria-label="خيارات الإجابة">';
    const letters = ['أ', 'ب', 'ج', 'د'];
    const answered = currentSession.answers[currentSession.currentIndex];
    const revealed = currentSession.mode === 'practice' && answered !== null;
    q.options.forEach((opt, i) => {
        let stateClass = '';
        if (revealed) {
            if (i === q.correct) stateClass = 'correct';
            else if (i === answered) stateClass = 'wrong';
        } else if (answered === i) {
            stateClass = 'selected';
        }
        html += `
            <button type="button" class="option ${stateClass}" role="radio"
                    aria-checked="${answered === i}" onclick="selectOption(${i})">
                <span class="option-letter">${letters[i]}</span>
                <span>${escapeHTML(opt)}</span>
            </button>
        `;
    });
    html += '</div>';

    document.getElementById('questionContainer').innerHTML = html;
    if (revealed) {
        document.getElementById('explanationText').textContent = q.explanation;
        document.getElementById('explanationBox').classList.add('show');
    } else {
        document.getElementById('explanationBox').classList.remove('show');
    }

    // Update buttons
    document.getElementById('prevBtn').style.display = current > 1 ? 'inline-flex' : 'none';
    document.getElementById('nextBtn').style.display = current < total ? 'inline-flex' : 'none';
    document.getElementById('finishBtn').style.display = current === total ? 'inline-flex' : 'none';
}

function selectOption(index) {
    // في وضع التدريب تُكشف الإجابة الصحيحة بعد أول اختيار،
    // فيُقفل السؤال لمنع تغيير الإجابة وتضخيم الإحصائيات
    if (currentSession.mode === 'practice'
        && currentSession.answers[currentSession.currentIndex] !== null) {
        return;
    }

    currentSession.answers[currentSession.currentIndex] = index;

    const q = currentSession.questions[currentSession.currentIndex];
    if (currentSession.mode === 'practice') {
        updateCategoryProgress(q.section, q.subcategory, index === q.correct);
    }

    // renderQuestion يعرض حالة الاختيار/الكشف والشرح بالكامل
    renderQuestion();
}

function previousQuestion() {
    if (currentSession.currentIndex > 0) {
        currentSession.currentIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (currentSession.currentIndex < currentSession.questions.length - 1) {
        currentSession.currentIndex++;
        renderQuestion();
    }
}

function finishPractice() {
    if (currentSession.timerInterval) {
        clearInterval(currentSession.timerInterval);
        document.getElementById('timerContainer').classList.remove('show');
    }

    const results = calculateSessionResults(currentSession);
    saveResults(results);
    renderResults(results);
    showPage('results');
}

// ==================== Timer ====================
function startTimer() {
    const container = document.getElementById('timerContainer');
    const timerValue = document.getElementById('timerValue');
    container.classList.add('show');

    currentSession.timerInterval = setInterval(() => {
        const elapsed = Date.now() - currentSession.startTime;
        const remaining = currentSession.timeLimit - elapsed;

        if (remaining <= 0) {
            clearInterval(currentSession.timerInterval);
            finishPractice();
            return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        timerValue.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        timerValue.classList.remove('warning', 'danger');
        if (remaining < 60000) {
            timerValue.classList.add('danger');
        } else if (remaining < 300000) {
            timerValue.classList.add('warning');
        }
    }, 1000);
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

    // Update daily stats
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

    // Find strengths and weaknesses
    const categories = Object.entries(results.categoryStats);
    const strengths = categories
        .filter(([_, s]) => s.correct / s.total >= 0.7)
        .map(([k]) => getCategoryName(k));
    const weaknesses = categories
        .filter(([_, s]) => s.correct / s.total < 0.5)
        .map(([k]) => getCategoryName(k));

    let html = `
        <h2 style="margin-bottom: 2rem;">🎉 نتيجة ${results.mode === 'test' ? 'الاختبار' : 'التدريب'}</h2>
        
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
            <div class="result-stat time">
                <span class="result-stat-value">${minutes}:${String(seconds).padStart(2, '0')}</span>
                <span class="result-stat-label">الوقت المستغرق</span>
            </div>
        </div>

        <div class="strength-weakness" style="margin-top: 2rem;">
            <div class="sw-card strength">
                <h4>✅ نقاط القوة</h4>
                <ul class="sw-list">
                    ${strengths.length > 0 ? strengths.map(s => `<li>⭐ ${escapeHTML(s)}</li>`).join('') : '<li>استمر في التدريب لتحسين أدائك</li>'}
                </ul>
            </div>
            <div class="sw-card weakness">
                <h4>⚠️ تحتاج تحسين</h4>
                <ul class="sw-list">
                    ${weaknesses.length > 0 ? weaknesses.map(w => `<li>📝 ${escapeHTML(w)}</li>`).join('') : '<li>أداء ممتاز! استمر</li>'}
                </ul>
            </div>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="showPage('home')">العودة للرئيسية</button>
            <button class="btn btn-secondary" onclick="showPage('tests')">اختبار آخر</button>
            <button class="btn btn-secondary" onclick="exportTestResultsAsPDF()" aria-label="طباعة النتيجة أو حفظها كـ PDF">🖨️ طباعة / PDF</button>
        </div>
    `;

    document.getElementById('resultsContainer').innerHTML = html;
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
    } else {
        userProgress.savedQuestions.push(qId);
    }
    saveData();
    renderQuestion();
}

function renderSavedQuestions() {
    const container = document.getElementById('savedList');
    const saved = questionsDB.filter(q => userProgress.savedQuestions.includes(q.id));

    if (saved.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔖</div>
                <p>لم تحفظ أي أسئلة بعد</p>
                <p style="font-size: 0.9rem;">اضغط على ☆ أثناء حل الأسئلة لحفظها هنا</p>
            </div>
        `;
        return;
    }

    container.innerHTML = saved.map(q => `
        <div class="question-container" style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span class="question-difficulty difficulty-${q.difficulty}">
                    ${q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                </span>
                <button class="btn btn-sm btn-danger" onclick="removeSaved(${q.id})">إزالة</button>
            </div>
            <div class="question-text">${escapeHTML(q.text)}</div>
            <div class="explanation-box show" style="margin-top: 1rem;">
                <div class="explanation-title">💡 الإجابة والشرح</div>
                <p><strong>الإجابة:</strong> ${escapeHTML(q.options[q.correct])}</p>
                <p style="margin-top: 0.5rem;">${escapeHTML(q.explanation)}</p>
            </div>
        </div>
    `).join('');
}

function removeSaved(qId) {
    userProgress.savedQuestions = userProgress.savedQuestions.filter(id => id !== qId);
    saveData();
    renderSavedQuestions();
}

// ==================== Tests ====================
function renderTests() {
    const container = document.getElementById('testsList');
    
    container.innerHTML = testsDB.map(test => `
        <div class="card" onclick="startTest(${test.id})">
            <div class="card-icon test">📝</div>
            <h3>${escapeHTML(test.name)}</h3>
            <p>${escapeHTML(test.description)}</p>
            <div class="card-meta">
                <span class="card-badge">${test.verbalCount + test.quantCount} سؤال</span>
                <span class="card-badge">⏱️ ${test.timeLimit} دقيقة</span>
            </div>
        </div>
    `).join('');
}

// ==================== Solved Examples ====================
function renderSolvedExamples(filter = 'all') {
    const container = document.getElementById('solvedList');
    let questions = questionsDB.filter(q => q.explanation);
    
    if (filter !== 'all') {
        questions = questions.filter(q => q.section === filter);
    }

    container.innerHTML = questions.slice(0, 10).map(q => `
        <div class="question-container" style="margin-bottom: 1.5rem;">
            <div class="question-header">
                <span class="card-badge">${getCategoryName(q.section + '_' + q.subcategory)}</span>
                <span class="question-difficulty difficulty-${q.difficulty}">
                    ${q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                </span>
            </div>
            ${q.context ? `<div class="question-context">${escapeHTML(q.context)}</div>` : ''}
            <div class="question-text">${escapeHTML(q.text)}</div>
            <div class="options-list" style="margin: 1rem 0;">
                ${q.options.map((opt, i) => `
                    <div class="option ${i === q.correct ? 'correct' : ''}">
                        <span class="option-letter">${['أ', 'ب', 'ج', 'د'][i]}</span>
                        <span>${escapeHTML(opt)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="explanation-box show">
                <div class="explanation-title">💡 الشرح التفصيلي</div>
                <p>${escapeHTML(q.explanation)}</p>
            </div>
        </div>
    `).join('');
}

function filterSolved(filter) {
    document.querySelectorAll('#page-solved .admin-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    renderSolvedExamples(filter);
}

// ==================== Progress Dashboard ====================
function renderProgress() {
    renderLevelDisplay();
    renderBadges();

    // Accuracy stats
    const accuracy = userProgress.questionsAnswered > 0
        ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)
        : 0;
    
    document.getElementById('accuracyStats').innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; font-weight: 800; color: var(--primary);">${accuracy}%</div>
            <div style="color: var(--gray);">نسبة الإجابات الصحيحة</div>
        </div>
    `;

    // Questions stats
    document.getElementById('questionsStats').innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; font-weight: 800; color: var(--primary);">${userProgress.questionsAnswered}</div>
            <div style="color: var(--gray);">سؤال تم حله</div>
        </div>
    `;

    // Time stats
    const totalTests = userProgress.testResults.length;
    document.getElementById('timeStats').innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; font-weight: 800; color: var(--primary);">${totalTests}</div>
            <div style="color: var(--gray);">اختبار مكتمل</div>
        </div>
    `;

    // Performance chart
    renderPerformanceChart();

    // Strengths and weaknesses
    const catProgress = Object.entries(userProgress.categoryProgress);
    const strengths = catProgress
        .filter(([_, s]) => s.attempted >= 3 && s.correct / s.attempted >= 0.7)
        .map(([k]) => getCategoryName(k));
    const weaknesses = catProgress
        .filter(([_, s]) => s.attempted >= 3 && s.correct / s.attempted < 0.5)
        .map(([k]) => getCategoryName(k));

    document.getElementById('strengthsList').innerHTML =
        strengths.length > 0
            ? strengths.map(s => `<li>⭐ ${escapeHTML(s)}</li>`).join('')
            : '<li>⭐ أكمل المزيد من التدريب لاكتشاف نقاط قوتك</li>';

    document.getElementById('weaknessesList').innerHTML =
        weaknesses.length > 0
            ? weaknesses.map(w => `<li>📝 ${escapeHTML(w)}</li>`).join('')
            : '<li>📝 أكمل المزيد من التدريب لاكتشاف ما تحتاج تحسينه</li>';

    // Update home page score
    document.getElementById('userScore').textContent = accuracy + '%';
}

function renderPerformanceChart() {
    const container = document.getElementById('performanceChart');
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = getTodayKey(new Date(Date.now() - i * 86400000));
        const stats = userProgress.dailyStats[date] || { questions: 0, correct: 0 };
        last7Days.push(stats);
    }

    const maxQuestions = Math.max(...last7Days.map(d => d.questions), 1);
    
    container.innerHTML = last7Days.map((day, i) => {
        const height = (day.questions / maxQuestions) * 100;
        return `<div class="chart-bar" style="height: ${Math.max(height, 5)}%" data-value="${day.questions}"></div>`;
    }).join('');
}

// ==================== Admin Panel ====================
function showAdminTab(tab) {
    document.querySelectorAll('#page-admin .admin-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('adminAdd').style.display = tab === 'add' ? 'block' : 'none';
    document.getElementById('adminManage').style.display = tab === 'manage' ? 'block' : 'none';
    document.getElementById('adminTests').style.display = tab === 'tests' ? 'block' : 'none';
    const toolsEl = document.getElementById('adminTools');
    if (toolsEl) toolsEl.style.display = tab === 'tools' ? 'block' : 'none';

    if (tab === 'manage') renderQuestionsTable();
    if (tab === 'tests') renderAdminTests();
}

function updateSubcategories() {
    const section = document.getElementById('qSection').value;
    const subcatSelect = document.getElementById('qSubcategory');
    
    const verbal = [
        { value: 'analogy', text: 'التناظر اللفظي' },
        { value: 'completion', text: 'إكمال الجمل' },
        { value: 'reading', text: 'الاستيعاب المقروء' },
        { value: 'context', text: 'الخطأ السياقي' }
    ];
    
    const quant = [
        { value: 'ratio', text: 'النسب والتناسب' },
        { value: 'algebra', text: 'الجبر والمعادلات' },
        { value: 'statistics', text: 'الإحصاء' },
        { value: 'geometry', text: 'الهندسة' },
        { value: 'comparison', text: 'المقارنة' }
    ];

    const options = section === 'verbal' ? verbal : quant;
    subcatSelect.innerHTML = options.map(o => 
        `<option value="${o.value}">${o.text}</option>`
    ).join('');
}

function addQuestion() {
    const newQ = {
        id: Date.now(),
        section: document.getElementById('qSection').value,
        subcategory: document.getElementById('qSubcategory').value,
        difficulty: document.getElementById('qDifficulty').value,
        context: document.getElementById('qContext').value.trim() || null,
        text: document.getElementById('qText').value.trim(),
        options: [
            document.getElementById('optionA').value.trim(),
            document.getElementById('optionB').value.trim(),
            document.getElementById('optionC').value.trim(),
            document.getElementById('optionD').value.trim()
        ],
        correct: parseInt(document.getElementById('qCorrect').value),
        explanation: document.getElementById('qExplanation').value.trim(),
        custom: true
    };

    const errors = validateQuestion(newQ);
    if (errors.length > 0) {
        alert('❌ يرجى تصحيح الأخطاء التالية:\n\n• ' + errors.join('\n• '));
        return;
    }

    userContent.customQuestions.push(newQ);
    questionsDB = buildQuestionsDB();
    saveData();

    // Clear form
    document.getElementById('qContext').value = '';
    document.getElementById('qText').value = '';
    document.getElementById('optionA').value = '';
    document.getElementById('optionB').value = '';
    document.getElementById('optionC').value = '';
    document.getElementById('optionD').value = '';
    document.getElementById('qExplanation').value = '';

    renderQuestionsTable();
    alert('✓ تم إضافة السؤال بنجاح!');
}

function renderQuestionsTable() {
    const section = document.getElementById('filterSection').value;
    const difficulty = document.getElementById('filterDifficulty').value;
    
    let filtered = [...questionsDB];
    if (section !== 'all') filtered = filtered.filter(q => q.section === section);
    if (difficulty !== 'all') filtered = filtered.filter(q => q.difficulty === difficulty);

    const tbody = document.getElementById('questionsTableBody');
    tbody.innerHTML = filtered.map((q, i) => `
        <tr>
            <td>${i + 1}</td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(q.text)}</td>
            <td>${q.section === 'verbal' ? 'لفظي' : 'كمي'}</td>
            <td><span class="question-difficulty difficulty-${q.difficulty}">${q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editQuestion(${q.id})">✏️</button>
                    <button class="action-btn delete" onclick="deleteQuestion(${q.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterQuestions() {
    renderQuestionsTable();
}

function deleteQuestion(qId) {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
        const q = questionsDB.find(x => x.id === qId);
        if (q && q.custom) {
            userContent.customQuestions = userContent.customQuestions.filter(x => x.id !== qId);
        } else {
            if (!userContent.deletedQuestionIds.includes(qId)) {
                userContent.deletedQuestionIds.push(qId);
            }
            delete userContent.questionOverrides[qId];
        }
        questionsDB = buildQuestionsDB();
        saveData();
        renderQuestionsTable();
    }
}

function editQuestion(qId) {
    const q = questionsDB.find(q => q.id === qId);
    if (!q) return;

    document.getElementById('editModalContent').innerHTML = `
        <div class="form-group">
            <label class="form-label">نص السؤال</label>
            <textarea class="form-textarea" id="editText">${escapeHTML(q.text)}</textarea>
        </div>
        <div class="form-group">
            <label class="form-label">الخيارات</label>
            <input type="text" class="form-input" id="editOpt0" value="${escapeHTML(q.options[0])}" style="margin-bottom: 0.5rem;">
            <input type="text" class="form-input" id="editOpt1" value="${escapeHTML(q.options[1])}" style="margin-bottom: 0.5rem;">
            <input type="text" class="form-input" id="editOpt2" value="${escapeHTML(q.options[2])}" style="margin-bottom: 0.5rem;">
            <input type="text" class="form-input" id="editOpt3" value="${escapeHTML(q.options[3])}">
        </div>
        <div class="form-group">
            <label class="form-label">الإجابة الصحيحة</label>
            <select class="form-select" id="editCorrect">
                <option value="0" ${q.correct === 0 ? 'selected' : ''}>أ</option>
                <option value="1" ${q.correct === 1 ? 'selected' : ''}>ب</option>
                <option value="2" ${q.correct === 2 ? 'selected' : ''}>ج</option>
                <option value="3" ${q.correct === 3 ? 'selected' : ''}>د</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">الشرح</label>
            <textarea class="form-textarea" id="editExplanation">${escapeHTML(q.explanation || '')}</textarea>
        </div>
        <button class="btn btn-success btn-block" onclick="saveEdit(${q.id})">حفظ التعديلات</button>
    `;

    document.getElementById('editModal').classList.add('show');
}

function saveEdit(qId) {
    const q = questionsDB.find(q => q.id === qId);
    if (!q) return;

    const updated = {
        text: document.getElementById('editText').value.trim(),
        options: [
            document.getElementById('editOpt0').value.trim(),
            document.getElementById('editOpt1').value.trim(),
            document.getElementById('editOpt2').value.trim(),
            document.getElementById('editOpt3').value.trim()
        ],
        correct: parseInt(document.getElementById('editCorrect').value),
        explanation: document.getElementById('editExplanation').value.trim()
    };

    const errors = validateQuestion(updated);
    if (errors.length > 0) {
        alert('❌ يرجى تصحيح الأخطاء التالية:\n\n• ' + errors.join('\n• '));
        return;
    }

    q.text = updated.text;
    q.options = updated.options;
    q.correct = updated.correct;
    q.explanation = updated.explanation;

    // تعديل سؤال عينة يُحفظ كتجاوز (override) حتى لا يضيع عند تحديث المحتوى
    if (!q.custom) {
        userContent.questionOverrides[q.id] = q;
    }

    saveData();
    closeEditModal();
    renderQuestionsTable();
    alert('✓ تم حفظ التعديلات بنجاح');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

function createTest() {
    const name = document.getElementById('testName').value.trim();
    const verbalCount = parseInt(document.getElementById('testVerbalCount').value);
    const quantCount = parseInt(document.getElementById('testQuantCount').value);
    const timeLimit = parseInt(document.getElementById('testTime').value);

    const errors = [];
    if (!name || name.length < 3) {
        errors.push('اسم الاختبار قصير جداً (3 أحرف على الأقل)');
    }
    if (testsDB.some(t => t.name === name)) {
        errors.push('يوجد اختبار آخر بنفس الاسم');
    }
    if (isNaN(verbalCount) || verbalCount < 0) {
        errors.push('عدد الأسئلة اللفظية غير صالح');
    }
    if (isNaN(quantCount) || quantCount < 0) {
        errors.push('عدد الأسئلة الكمية غير صالح');
    }
    if (verbalCount + quantCount === 0) {
        errors.push('يجب أن يحتوي الاختبار على سؤال واحد على الأقل');
    }
    if (isNaN(timeLimit) || timeLimit < 1) {
        errors.push('مدة الاختبار يجب أن تكون دقيقة واحدة على الأقل');
    }

    const availableVerbal = questionsDB.filter(q => q.section === 'verbal').length;
    const availableQuant = questionsDB.filter(q => q.section === 'quant').length;
    if (verbalCount > availableVerbal) {
        errors.push(`عدد الأسئلة اللفظية المطلوب (${verbalCount}) أكبر من المتوفر (${availableVerbal})`);
    }
    if (quantCount > availableQuant) {
        errors.push(`عدد الأسئلة الكمية المطلوب (${quantCount}) أكبر من المتوفر (${availableQuant})`);
    }

    if (errors.length > 0) {
        alert('❌ يرجى تصحيح الأخطاء التالية:\n\n• ' + errors.join('\n• '));
        return;
    }

    userContent.customTests.push({
        id: Date.now(),
        name,
        verbalCount,
        quantCount,
        timeLimit,
        description: `${verbalCount + quantCount} سؤال في ${timeLimit} دقيقة`,
        custom: true
    });
    testsDB = buildTestsDB();

    saveData();
    document.getElementById('testName').value = '';
    renderAdminTests();
    renderTests();
    alert('✓ تم إنشاء الاختبار بنجاح!');
}

function renderAdminTests() {
    const container = document.getElementById('adminTestsList');
    container.innerHTML = testsDB.map(test => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--light); border-radius: 12px; margin-bottom: 0.5rem;">
            <div>
                <strong>${escapeHTML(test.name)}</strong>
                <span style="color: var(--gray); margin-right: 1rem;">(${test.verbalCount + test.quantCount} سؤال - ${test.timeLimit} دقيقة)</span>
            </div>
            <button class="btn btn-sm btn-danger" onclick="deleteTest(${test.id})">حذف</button>
        </div>
    `).join('');
}

function deleteTest(testId) {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
        const t = testsDB.find(x => x.id === testId);
        if (t && t.custom) {
            userContent.customTests = userContent.customTests.filter(x => x.id !== testId);
        } else if (!userContent.deletedTestIds.includes(testId)) {
            userContent.deletedTestIds.push(testId);
        }
        testsDB = buildTestsDB();
        saveData();
        renderAdminTests();
    }
}

// ==================== Gamification: Points, Levels, Badges ====================

const BADGES = [
    { id: 'first_q',     icon: '🎯', name: 'البداية',         desc: 'أجب على أول سؤال',                check: p => p.questionsAnswered >= 1 },
    { id: 'q10',         icon: '🌱', name: 'مبتدئ',           desc: 'أجب على 10 أسئلة',                check: p => p.questionsAnswered >= 10 },
    { id: 'q50',         icon: '📚', name: 'مثابر',            desc: 'أجب على 50 سؤالاً',                check: p => p.questionsAnswered >= 50 },
    { id: 'q100',        icon: '🎓', name: 'متفوق',            desc: 'أجب على 100 سؤال',                 check: p => p.questionsAnswered >= 100 },
    { id: 'q500',        icon: '🏆', name: 'خبير',             desc: 'أجب على 500 سؤال',                 check: p => p.questionsAnswered >= 500 },
    { id: 'streak3',     icon: '🔥', name: 'متحمس',            desc: 'حافظ على Streak 3 أيام',           check: p => (p.streak || 0) >= 3 },
    { id: 'streak7',     icon: '⚡', name: 'أسبوع كامل',        desc: 'حافظ على Streak 7 أيام',           check: p => (p.streak || 0) >= 7 },
    { id: 'streak30',    icon: '💎', name: 'لا يُهزم',          desc: 'حافظ على Streak 30 يوماً',          check: p => (p.streak || 0) >= 30 },
    { id: 'accuracy80',  icon: '🎖️', name: 'دقيق',             desc: 'حقق 80% دقة (50+ سؤال)',           check: p => p.questionsAnswered >= 50 && (p.correctAnswers / p.questionsAnswered) >= 0.8 },
    { id: 'firstTest',   icon: '📝', name: 'مختبر',             desc: 'أكمل اختباراً واحداً',              check: p => (p.testResults || []).length >= 1 },
    { id: 'test10',      icon: '🏅', name: 'بطل الاختبارات',    desc: 'أكمل 10 اختبارات',                  check: p => (p.testResults || []).length >= 10 },
    { id: 'daily7',      icon: '📅', name: 'منتظم',             desc: 'أكمل تحدي يومي 7 مرات',             check: p => (p.dailyChallengesCompleted || 0) >= 7 },
    { id: 'verbal100',   icon: '🗣️', name: 'لغوي',              desc: 'أجب 100 سؤال لفظي',                check: p => sumCategoryAttempts(p, 'verbal') >= 100 },
    { id: 'quant100',    icon: '🧮', name: 'حاسب',              desc: 'أجب 100 سؤال كمي',                 check: p => sumCategoryAttempts(p, 'quant') >= 100 },
    { id: 'level5',      icon: '⭐', name: 'المستوى 5',          desc: 'وصلت إلى المستوى 5',                check: p => getLevel(p.points || 0) >= 5 },
    { id: 'level10',     icon: '🌟', name: 'المستوى 10',         desc: 'وصلت إلى المستوى 10',               check: p => getLevel(p.points || 0) >= 10 }
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
        <div class="badge-item ${earned.includes(b.id) ? 'unlocked' : 'locked'}" title="${escapeHTML(b.desc)}">
            <div class="badge-icon" aria-hidden="true">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
            <div class="badge-desc">${b.desc}</div>
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
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <div>
                <div style="font-size:0.9rem;opacity:0.9;">المستوى الحالي</div>
                <div style="font-size:2rem;font-weight:800;">⭐ ${level}</div>
            </div>
            <div style="font-size:1.5rem;font-weight:700;">${points} نقطة</div>
        </div>
        <div class="level-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
            <div class="level-bar-fill" style="width:${progress}%;">${inLevel} / ${POINTS_PER_LEVEL}</div>
        </div>
    `;
}

function checkDailyChallenge() {
    const today = getTodayKey();
    userProgress.dailyChallenge = userProgress.dailyChallenge || {};
    if (userProgress.dailyChallenge.date !== today) {
        userProgress.dailyChallenge = {
            date: today,
            completed: false,
            correct: 0,
            total: 5
        };
        saveData();
    }
    renderDailyChallenge();
}

function renderDailyChallenge() {
    const card = document.getElementById('dailyChallengeCard');
    if (!card) return;
    const dc = userProgress.dailyChallenge || {};
    if (dc.completed) {
        card.classList.add('completed');
        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
                <div>
                    <div style="font-size:1.4rem;font-weight:800;margin-bottom:0.25rem;">✓ تم إنجاز تحدي اليوم</div>
                    <div style="opacity:0.9;">عدت غداً لتحدٍ جديد</div>
                </div>
                <div style="font-size:2.5rem;">🎉</div>
            </div>
        `;
    } else {
        card.classList.remove('completed');
        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
                <div>
                    <div style="font-size:1.4rem;font-weight:800;margin-bottom:0.25rem;">🔥 تحدي اليوم</div>
                    <div style="opacity:0.9;">5 أسئلة - مكافأة 50 نقطة عند الإكمال</div>
                </div>
                <button class="btn" style="background:rgba(255,255,255,0.25);color:#fff;backdrop-filter:blur(10px);" onclick="event.stopPropagation();startDailyChallenge()">ابدأ الآن</button>
            </div>
        `;
    }
}

function startDailyChallenge() {
    const pool = shuffleArray([...questionsDB]).slice(0, 5);
    if (pool.length < 5) {
        showToast('لا توجد أسئلة كافية', 'warning');
        return;
    }
    currentSession = {
        mode: 'daily',
        section: 'mixed',
        subcategory: null,
        questions: pool,
        currentIndex: 0,
        answers: new Array(5).fill(null),
        startTime: Date.now(),
        timeLimit: null,
        timerInterval: null
    };
    document.getElementById('practiceBackBtn').onclick = () => showPage('home');
    showPage('practice');
    renderQuestion();
}

function completeDailyChallenge(correctCount) {
    userProgress.dailyChallenge.completed = true;
    userProgress.dailyChallenge.correct = correctCount;
    userProgress.dailyChallengesCompleted = (userProgress.dailyChallengesCompleted || 0) + 1;
    awardPoints(50);
    showToast('🎉 أحسنت! +50 نقطة مكافأة', 'success', 4000);
    saveData();
    checkAndAwardBadges();
    renderDailyChallenge();
}

// ==================== PDF Export (via print) ====================
function exportTestResultsAsPDF() {
    window.print();
}

function exportProgressReport() {
    const points = userProgress.points || 0;
    const level = getLevel(points);
    const accuracy = userProgress.questionsAnswered > 0
        ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)
        : 0;
    const earnedBadges = (userProgress.badges || []).map(id => BADGES.find(b => b.id === id)).filter(Boolean);

    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>تقرير التقدم - قدراتي</title>
            <style>
                body { font-family: 'Tahoma', sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
                h1 { color: #1a5f7a; border-bottom: 3px solid #1a5f7a; padding-bottom: 0.5rem; }
                .stat { display: flex; justify-content: space-between; padding: 0.75rem; background: #f5f7fa; margin-bottom: 0.5rem; border-radius: 8px; }
                .badge { display: inline-block; padding: 0.5rem 1rem; background: #ecf0f1; border-radius: 20px; margin: 0.25rem; font-size: 0.9rem; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <h1>📊 تقرير التقدم - قدراتي</h1>
            <p>التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
            <h2>الإحصائيات</h2>
            <div class="stat"><span>المستوى</span><strong>⭐ ${level}</strong></div>
            <div class="stat"><span>النقاط</span><strong>${points}</strong></div>
            <div class="stat"><span>الأسئلة المُجابة</span><strong>${userProgress.questionsAnswered || 0}</strong></div>
            <div class="stat"><span>الإجابات الصحيحة</span><strong>${userProgress.correctAnswers || 0}</strong></div>
            <div class="stat"><span>نسبة الدقة</span><strong>${accuracy}%</strong></div>
            <div class="stat"><span>أيام متتالية (Streak)</span><strong>🔥 ${userProgress.streak || 0}</strong></div>
            <div class="stat"><span>الاختبارات المُكتملة</span><strong>${(userProgress.testResults || []).length}</strong></div>
            <div class="stat"><span>الشارات المُحصّلة</span><strong>${earnedBadges.length} / ${BADGES.length}</strong></div>
            <h2>الشارات</h2>
            ${earnedBadges.map(b => `<span class="badge">${b.icon} ${b.name}</span>`).join('')}
            <div class="no-print" style="margin-top:2rem;text-align:center;">
                <button onclick="window.print()" style="padding:0.75rem 1.5rem;background:#1a5f7a;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:1rem;">🖨️ طباعة / حفظ PDF</button>
            </div>
        </body>
        </html>
    `);
    reportWindow.document.close();
}

// ==================== Admin: Backup / Restore / CSV ====================
function exportAllData() {
    const blob = new Blob([JSON.stringify({
        version: 2,
        ...userContent,
        progress: userProgress,
        exportedAt: new Date().toISOString()
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qudurat-backup-${getTodayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ تم تصدير النسخة الاحتياطية', 'success');
}

function importAllData(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const isV2 = data && typeof data === 'object' && data.version >= 2;
            const isLegacy = data && typeof data === 'object'
                && (Array.isArray(data.questions) || Array.isArray(data.tests) || data.progress);
            if (!isV2 && !isLegacy) {
                showToast('❌ ملف غير صالح: البنية غير معروفة', 'error', 5000);
                input.value = '';
                return;
            }
            if (!confirm('سيتم استبدال جميع البيانات الحالية. هل أنت متأكد؟')) {
                input.value = '';
                return;
            }
            let skipped = 0;
            userContent = {
                customQuestions: [], questionOverrides: {},
                deletedQuestionIds: [], customTests: [], deletedTestIds: []
            };
            if (isV2) {
                const rawCustomQ = Array.isArray(data.customQuestions) ? data.customQuestions : [];
                userContent.customQuestions = rawCustomQ.filter(isValidImportedQuestion).map(q => ({ ...q, custom: true }));
                skipped += rawCustomQ.length - userContent.customQuestions.length;

                const rawOverrides = (data.questionOverrides && typeof data.questionOverrides === 'object') ? data.questionOverrides : {};
                for (const [id, q] of Object.entries(rawOverrides)) {
                    if (isValidImportedQuestion(q)) userContent.questionOverrides[id] = q;
                    else skipped++;
                }

                userContent.deletedQuestionIds = (Array.isArray(data.deletedQuestionIds) ? data.deletedQuestionIds : []).filter(Number.isFinite);
                userContent.deletedTestIds = (Array.isArray(data.deletedTestIds) ? data.deletedTestIds : []).filter(Number.isFinite);

                const rawTests = Array.isArray(data.customTests) ? data.customTests : [];
                userContent.customTests = rawTests.filter(isValidImportedTest).map(t => ({ ...t, custom: true }));
                skipped += rawTests.length - userContent.customTests.length;

                if (data.progress && typeof data.progress === 'object' && !Array.isArray(data.progress)) {
                    userProgress = { ...userProgress, ...data.progress };
                }
            } else {
                // نسخة احتياطية بالصيغة القديمة (قاعدة كاملة): نستخرج محتوى المستخدم منها
                const rawQ = Array.isArray(data.questions) ? data.questions : [];
                const validQ = rawQ.filter(isValidImportedQuestion);
                skipped += rawQ.length - validQ.length;
                const rawT = Array.isArray(data.tests) ? data.tests : [];
                const validT = rawT.filter(isValidImportedTest);
                skipped += rawT.length - validT.length;
                migrateLegacyData({ ...data, questions: validQ, tests: validT });
            }
            questionsDB = buildQuestionsDB();
            testsDB = buildTestsDB();
            saveData();
            renderQuestionsTable();
            renderAdminTests();
            renderTests();
            if (skipped > 0) {
                showToast(`✓ تمت الاستعادة مع استبعاد ${skipped} عنصر غير صالح`, 'warning', 5000);
            } else {
                showToast('✓ تم استعادة البيانات بنجاح', 'success');
            }
        } catch (err) {
            console.error('فشل استيراد النسخة الاحتياطية:', err);
            showToast('❌ ملف غير صالح', 'error');
        }
        input.value = '';
    };
    reader.readAsText(file);
}

function exportQuestionsCSV() {
    const headers = ['id', 'section', 'subcategory', 'difficulty', 'text', 'optionA', 'optionB', 'optionC', 'optionD', 'correct', 'explanation'];
    const escapeCSV = (v) => {
        const s = String(v == null ? '' : v);
        if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
    };
    const rows = questionsDB.map(q => [
        q.id, q.section, q.subcategory, q.difficulty,
        q.text, q.options[0], q.options[1], q.options[2], q.options[3],
        q.correct, q.explanation || ''
    ].map(escapeCSV).join(','));
    const csv = '﻿' + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qudurat-questions-${getTodayKey()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ تم تصدير الأسئلة', 'success');
}

function importQuestionsCSV(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            let text = e.target.result;
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
                showToast(`❌ أعمدة ناقصة: ${missing.join(', ')}`, 'error', 5000);
                return;
            }
            const idx = (name) => headers.indexOf(name);
            let added = 0, skipped = 0;
            for (let i = 1; i < rows.length; i++) {
                const r = rows[i];
                if (!r || r.length < required.length) continue;
                const newQ = {
                    id: Date.now() + i,
                    section: r[idx('section')],
                    subcategory: r[idx('subcategory')],
                    difficulty: r[idx('difficulty')],
                    text: r[idx('text')],
                    options: [r[idx('optionA')], r[idx('optionB')], r[idx('optionC')], r[idx('optionD')]],
                    correct: parseInt(r[idx('correct')]),
                    explanation: idx('explanation') >= 0 ? r[idx('explanation')] : '',
                    custom: true
                };
                if (validateQuestion(newQ).length === 0) {
                    userContent.customQuestions.push(newQ);
                    added++;
                } else {
                    skipped++;
                }
            }
            questionsDB = buildQuestionsDB();
            saveData();
            renderQuestionsTable();
            showToast(`✓ تم استيراد ${added} سؤال${skipped ? ` (تم تخطي ${skipped})` : ''}`, 'success', 4000);
        } catch (err) {
            console.error('فشل استيراد ملف CSV:', err);
            showToast('❌ خطأ في قراءة الملف', 'error');
        }
        input.value = '';
    };
    reader.readAsText(file);
}

// ==================== Service Worker / PWA ====================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js').catch(() => {
                // Silently ignore - works fine without SW
            });
        });
    }
}

function updateUI() {
    // Update progress on home page
    const verbalProgress = calculateSectionProgress('verbal');
    const quantProgress = calculateSectionProgress('quant');

    document.getElementById('verbalProgress').textContent = `${verbalProgress}% مكتمل`;
    document.getElementById('quantProgress').textContent = `${quantProgress}% مكتمل`;
    document.getElementById('totalQuestions').textContent = questionsDB.length;
    document.getElementById('totalTests').textContent = testsDB.length;
}

function calculateSectionProgress(section) {
    const categories = Object.entries(userProgress.categoryProgress)
        .filter(([k]) => k.startsWith(section));
    
    if (categories.length === 0) return 0;
    
    const avgProgress = categories.reduce((sum, [_, s]) => {
        return sum + (s.attempted > 0 ? Math.min(s.attempted / 10, 1) : 0);
    }, 0) / categories.length;
    
    return Math.round(avgProgress * 100);
}

// Close modal on outside click
document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) closeEditModal();
});

// Initialize app
init();

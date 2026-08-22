// الدوال النقية المشتركة بين التطبيق (المتصفح) والاختبارات (Node) — بلا أي اعتماد على DOM
(function (global) {
    'use strict';

    const POINTS_PER_CORRECT = 10;
    const POINTS_PER_LEVEL = 100;

    // ==================== تصنيف المحتوى (مصدر واحد للحقيقة) ====================
    // تستهلكه: app.js (نماذج الإدارة والعرض)، وscripts/check-questions.mjs (فحص CI).
    // أي فئة جديدة تُضاف هنا فقط، فيستحيل أن تتباعد النسخ.
    const SUBCATEGORIES = {
        verbal: ['analogy', 'completion', 'reading', 'context'],
        quant: ['ratio', 'algebra', 'statistics', 'geometry', 'comparison']
    };
    const SECTIONS = Object.keys(SUBCATEGORIES);
    const DIFFICULTIES = ['easy', 'medium', 'hard'];
    const DIFFICULTY_LABELS = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };
    const SECTION_LABELS = { verbal: 'لفظي', quant: 'كمي' };
    const OPTION_LETTERS = ['أ', 'ب', 'ج', 'د'];
    const CATEGORY_NAMES = {
        'verbal_analogy': 'التناظر اللفظي',
        'verbal_completion': 'إكمال الجمل',
        'verbal_reading': 'الاستيعاب المقروء',
        'verbal_context': 'الخطأ السياقي',
        'quant_ratio': 'النسب والتناسب',
        'quant_algebra': 'الجبر والمعادلات',
        'quant_statistics': 'الإحصاء',
        'quant_geometry': 'الهندسة',
        'quant_comparison': 'المقارنة'
    };

    function escapeHTML(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // المعرّفات تُحقن داخل سمات onclick في قوالب العرض. لو مُرِّر معرّف نصي
    // من ملف مستورد لأمكن كسر السمة وحقن كود — لذا يُجبَر على رقم دائماً.
    function safeId(value) {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }

    // الحقول التي تدخل سمات class/HTML بلا تهريب كافٍ يجب أن تبقى ضمن قوائم مغلقة.
    function safeToken(value, allowed, fallback) {
        return allowed.includes(value) ? value : fallback;
    }

    function getTodayKey(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function getLevel(points) {
        return Math.floor(points / POINTS_PER_LEVEL) + 1;
    }

    function getLevelProgress(points) {
        const inLevel = points % POINTS_PER_LEVEL;
        return Math.round((inLevel / POINTS_PER_LEVEL) * 100);
    }

    function getDifficultyLabel(difficulty) {
        return DIFFICULTY_LABELS[difficulty] || difficulty || '—';
    }

    // تحقق من حقول المحتوى (النص/الخيارات/الإجابة/الشرح)
    function validateQuestion(data) {
        const errors = [];
        if (!data.text || data.text.length < 3) {
            errors.push('نص السؤال قصير جداً (3 أحرف على الأقل)');
        }
        if (!Array.isArray(data.options) || data.options.length !== 4) {
            errors.push('يجب أن تكون الخيارات أربعة بالضبط');
        } else if (data.options.some(o => !o)) {
            errors.push('يجب ملء جميع الخيارات الأربعة');
        } else {
            const unique = new Set(data.options.map(o => String(o).trim()));
            if (unique.size !== data.options.length) {
                errors.push('توجد خيارات مكررة - يجب أن تكون الخيارات مختلفة');
            }
        }
        if (isNaN(data.correct) || data.correct < 0 || data.correct > 3) {
            errors.push('يجب اختيار إجابة صحيحة');
        }
        if (data.explanation && data.explanation.length > 0 && data.explanation.length < 5) {
            errors.push('الشرح قصير جداً');
        }
        return errors;
    }

    // تحقق من حقول التصنيف — منفصل لأن نماذج الإدارة تملأها من <select>
    // بينما الاستيراد (CSV/JSON) يقبل أي نص، وهذه الحقول تُحقن في HTML.
    function validateQuestionMeta(data) {
        const errors = [];
        if (!SECTIONS.includes(data.section)) {
            errors.push(`قسم غير معروف (${data.section}) — المسموح: ${SECTIONS.join('، ')}`);
        } else if (!SUBCATEGORIES[data.section].includes(data.subcategory)) {
            errors.push(`فئة فرعية غير معروفة (${data.subcategory}) لقسم ${data.section}`);
        }
        if (!DIFFICULTIES.includes(data.difficulty)) {
            errors.push(`مستوى صعوبة غير معروف (${data.difficulty})`);
        }
        return errors;
    }

    function isValidImportedQuestion(q) {
        return Boolean(q && typeof q === 'object'
            && Number.isFinite(q.id)
            && Array.isArray(q.options) && q.options.length === 4
            && q.options.every(o => typeof o === 'string')
            && typeof q.correct === 'number'
            && (q.context == null || typeof q.context === 'string')
            && (q.explanation == null || typeof q.explanation === 'string')
            && validateQuestion(q).length === 0
            && validateQuestionMeta(q).length === 0);
    }

    function isValidImportedTest(t) {
        return Boolean(t && typeof t === 'object'
            && Number.isFinite(t.id)
            && typeof t.name === 'string' && t.name.trim().length > 0
            && (t.description == null || typeof t.description === 'string')
            && Number.isFinite(t.verbalCount) && t.verbalCount >= 0
            && Number.isFinite(t.quantCount) && t.quantCount >= 0
            && (t.verbalCount + t.quantCount) > 0
            && Number.isFinite(t.timeLimit) && t.timeLimit > 0);
    }

    function parseCSV(text) {
        const rows = [];
        let row = [], cell = '', inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (inQuotes) {
                if (c === '"' && text[i+1] === '"') { cell += '"'; i++; }
                else if (c === '"') { inQuotes = false; }
                else { cell += c; }
            } else {
                if (c === '"') { inQuotes = true; }
                else if (c === ',') { row.push(cell); cell = ''; }
                else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
                else if (c === '\r') {}
                else { cell += c; }
            }
        }
        if (cell || row.length) { row.push(cell); rows.push(row); }
        return rows;
    }

    // حقل يبدأ بـ = + - @ يُنفَّذ كصيغة عند فتح الملف في Excel/Sheets
    // (CSV Injection). الفاصلة العليا تُعطّل التنفيذ وتبقى القيمة مقروءة.
    function escapeCSV(value) {
        let s = String(value == null ? '' : value);
        if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
        if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ترتيب الخيارات في قاعدة البيانات ثابت، وموقع الإجابة الصحيحة فيها
    // منحاز بشدة (37% في الموضع "ب"). خلط الخيارات عند بناء الجلسة يمنع
    // التخمين بالموقع ويحاكي الاختبار الحقيقي. يُعيد نسخة ولا يمسّ الأصل.
    function shuffleQuestionOptions(question) {
        if (!question || !Array.isArray(question.options) || question.options.length === 0) {
            return question;
        }
        const indices = shuffleArray(question.options.map((_, i) => i));
        const options = indices.map(i => question.options[i]);
        const correct = indices.indexOf(question.correct);
        return {
            ...question,
            options,
            correct: correct === -1 ? question.correct : correct
        };
    }

    function getCategoryName(key) {
        return CATEGORY_NAMES[key] || key;
    }

    function sumCategoryAttempts(p, section) {
        return Object.entries(p.categoryProgress || {})
            .filter(([k]) => k.startsWith(section))
            .reduce((sum, [, v]) => sum + (v.attempted || 0), 0);
    }

    // نسبة إتقان الفئة: تُحتسب من عدد المحاولات (10 محاولات = 100%)
    // مرجّحة بالدقة، حتى لا يمتلئ الشريط بمحاولات كلها خاطئة.
    function getCategoryMastery(p, section, subcategory) {
        const stats = (p.categoryProgress || {})[`${section}_${subcategory}`];
        if (!stats || !stats.attempted) return 0;
        const coverage = Math.min(stats.attempted / 10, 1);
        const accuracy = stats.correct / stats.attempted;
        return Math.round(coverage * accuracy * 100);
    }

    // الفئات الأضعف أولاً، ثم غير المُجرَّبة — أساس قسم «مقترحات لك».
    function getRecommendedCategories(p, limit = 3) {
        const all = [];
        for (const section of SECTIONS) {
            for (const subcategory of SUBCATEGORIES[section]) {
                const stats = (p.categoryProgress || {})[`${section}_${subcategory}`] || { attempted: 0, correct: 0 };
                all.push({
                    section,
                    subcategory,
                    key: `${section}_${subcategory}`,
                    name: getCategoryName(`${section}_${subcategory}`),
                    attempted: stats.attempted || 0,
                    accuracy: stats.attempted ? stats.correct / stats.attempted : null
                });
            }
        }
        const tried = all.filter(c => c.attempted > 0).sort((a, b) => a.accuracy - b.accuracy);
        const untried = all.filter(c => c.attempted === 0);
        // فئات جُرّبت وأداؤها ضعيف (<70%) أولاً، ثم ما لم يُجرَّب بعد
        const weak = tried.filter(c => c.accuracy < 0.7);
        return [...weak, ...untried, ...tried.filter(c => c.accuracy >= 0.7)].slice(0, limit);
    }

    // ==================== بناء البيانات (نقي — يُمرَّر له كل ما يحتاجه) ====================
    const EMPTY_USER_CONTENT = {
        customQuestions: [],      // أسئلة أضافها المشرف أو استُوردت
        questionOverrides: {},    // تعديلات المشرف على أسئلة العينة (id -> سؤال)
        deletedQuestionIds: [],   // أسئلة عينة حذفها المشرف
        customTests: [],
        deletedTestIds: []
    };

    function emptyUserContent() {
        return { ...EMPTY_USER_CONTENT, questionOverrides: {}, customQuestions: [], deletedQuestionIds: [], customTests: [], deletedTestIds: [] };
    }

    function applyStoredContent(data) {
        return {
            customQuestions: Array.isArray(data.customQuestions) ? data.customQuestions : [],
            questionOverrides: (data.questionOverrides && typeof data.questionOverrides === 'object' && !Array.isArray(data.questionOverrides)) ? data.questionOverrides : {},
            deletedQuestionIds: Array.isArray(data.deletedQuestionIds) ? data.deletedQuestionIds.filter(Number.isFinite) : [],
            customTests: Array.isArray(data.customTests) ? data.customTests : [],
            deletedTestIds: Array.isArray(data.deletedTestIds) ? data.deletedTestIds.filter(Number.isFinite) : []
        };
    }

    function buildQuestionsDB(sampleQuestions, userContent) {
        const deleted = new Set(userContent.deletedQuestionIds);
        const merged = [];
        for (const q of sampleQuestions) {
            if (deleted.has(q.id)) continue;
            merged.push(userContent.questionOverrides[q.id] || q);
        }
        return merged.concat(userContent.customQuestions);
    }

    function buildTestsDB(sampleTests, userContent) {
        const deleted = new Set(userContent.deletedTestIds);
        return sampleTests.filter(t => !deleted.has(t.id)).concat(userContent.customTests);
    }

    // الصيغة القديمة كانت تخزّن قاعدة الأسئلة كاملة؛ نستخرج منها محتوى
    // المستخدم فقط. لا نستنتج الحذف من الغياب: بيانات إصدار أقدم قد
    // تنقصها أسئلة أُضيفت لاحقاً، واعتبارها محذوفة يمنع وصولها نهائياً.
    function migrateLegacyData(data, sampleQuestions, sampleTests) {
        const userContent = emptyUserContent();
        let progress = null;

        const sameQuestion = (a, b) =>
            a.text === b.text && a.section === b.section && a.subcategory === b.subcategory &&
            a.difficulty === b.difficulty && a.correct === b.correct &&
            (a.context || null) === (b.context || null) && (a.explanation || '') === (b.explanation || '') &&
            JSON.stringify(a.options) === JSON.stringify(b.options);

        if (Array.isArray(data.questions)) {
            const sampleById = new Map(sampleQuestions.map(q => [q.id, q]));
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
            const sampleTestIds = new Set(sampleTests.map(t => t.id));
            for (const t of data.tests) {
                if (!t || typeof t !== 'object') continue;
                if (!sampleTestIds.has(t.id)) userContent.customTests.push({ ...t, custom: true });
            }
        }
        if (data.progress && typeof data.progress === 'object' && !Array.isArray(data.progress)) {
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
            progress = p;
        }
        return { userContent, progress };
    }

    // كائن التقدم يصل من localStorage ومن ملفات النسخ الاحتياطية المستوردة،
    // وكلاهما قد يكون معطوباً (حقل null أو نوع خاطئ). الدمج بلا فحص يمرّ
    // بنجاح ثم يفجّر التطبيق لاحقاً (savedQuestions.includes على null مثلاً)
    // — لذا يُجبَر كل حقل على نوعه هنا قبل أي استخدام.
    function sanitizeProgress(raw) {
        const p = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
        const num = v => (typeof v === 'number' && Number.isFinite(v) && v >= 0) ? v : 0;
        const arr = v => Array.isArray(v) ? v : [];
        const obj = v => (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};

        const categoryProgress = {};
        for (const [key, val] of Object.entries(obj(p.categoryProgress))) {
            if (!val || typeof val !== 'object') continue;
            categoryProgress[key] = { attempted: num(val.attempted), correct: num(val.correct) };
        }
        const dailyStats = {};
        for (const [key, val] of Object.entries(obj(p.dailyStats))) {
            if (!val || typeof val !== 'object') continue;
            dailyStats[key] = { questions: num(val.questions), correct: num(val.correct) };
        }

        return {
            ...p,
            streak: num(p.streak),
            lastActive: typeof p.lastActive === 'string' ? p.lastActive : null,
            questionsAnswered: num(p.questionsAnswered),
            correctAnswers: num(p.correctAnswers),
            points: num(p.points),
            savedQuestions: arr(p.savedQuestions).filter(Number.isFinite),
            badges: arr(p.badges).filter(b => typeof b === 'string'),
            categoryProgress,
            dailyStats,
            testResults: arr(p.testResults).filter(r => r && typeof r === 'object'),
            dailyChallenge: obj(p.dailyChallenge),
            dailyChallengesCompleted: num(p.dailyChallengesCompleted)
        };
    }

    // تصنيف موحّد للقوة/الضعف — كان محسوباً في موضعين بعتبات متضاربة
    // (شاشة النتيجة بلا حد أدنى للمحاولات وصفحة التقدم بحد 3) فتصل
    // الطالبَ رسالتان متناقضتان عن الفئة نفسها. يقبل إحصاءات الجلسة
    // ({correct, total}) وإحصاءات التقدم ({correct, attempted}) معاً.
    const CLASSIFY_MIN_ATTEMPTS = 3;

    function classifyCategories(categoryStats, minAttempts = CLASSIFY_MIN_ATTEMPTS) {
        const strengths = [];
        const weaknesses = [];
        for (const [key, stats] of Object.entries(categoryStats || {})) {
            if (!stats || typeof stats !== 'object') continue;
            const attempts = Number.isFinite(stats.total) ? stats.total : (stats.attempted || 0);
            if (attempts < minAttempts) continue;
            const accuracy = (stats.correct || 0) / attempts;
            if (accuracy >= 0.7) strengths.push(getCategoryName(key));
            else if (accuracy < 0.5) weaknesses.push(getCategoryName(key));
        }
        return { strengths, weaknesses };
    }

    // سجل النتائج ينمو بلا حد ويُسلسَل عند كل حفظ — نُبقي الأحدث فقط.
    const MAX_TEST_RESULTS = 100;
    const MAX_DAILY_STATS_DAYS = 400;

    function pruneProgress(progress) {
        if (Array.isArray(progress.testResults) && progress.testResults.length > MAX_TEST_RESULTS) {
            progress.testResults = progress.testResults.slice(-MAX_TEST_RESULTS);
        }
        if (progress.dailyStats && typeof progress.dailyStats === 'object') {
            const keys = Object.keys(progress.dailyStats).sort();
            if (keys.length > MAX_DAILY_STATS_DAYS) {
                const kept = {};
                for (const k of keys.slice(-MAX_DAILY_STATS_DAYS)) kept[k] = progress.dailyStats[k];
                progress.dailyStats = kept;
            }
        }
        return progress;
    }

    function calculateSessionResults(session) {
        let correct = 0;
        let wrong = 0;
        let unanswered = 0;
        const categoryStats = {};

        session.questions.forEach((q, i) => {
            const key = `${q.section}_${q.subcategory}`;
            if (!categoryStats[key]) {
                categoryStats[key] = { correct: 0, total: 0 };
            }
            categoryStats[key].total++;

            if (session.answers[i] === null) {
                unanswered++;
            } else if (session.answers[i] === q.correct) {
                correct++;
                categoryStats[key].correct++;
            } else {
                wrong++;
            }
        });

        const total = session.questions.length;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        const timeSpent = Date.now() - session.startTime;

        return {
            correct,
            wrong,
            unanswered,
            total,
            percentage,
            timeSpent,
            categoryStats,
            mode: session.mode,
            testName: session.testName || null
        };
    }

    const QuduratCore = {
        POINTS_PER_CORRECT,
        POINTS_PER_LEVEL,
        SECTIONS,
        SUBCATEGORIES,
        DIFFICULTIES,
        DIFFICULTY_LABELS,
        SECTION_LABELS,
        OPTION_LETTERS,
        CATEGORY_NAMES,
        escapeHTML,
        safeId,
        safeToken,
        getTodayKey,
        getLevel,
        getLevelProgress,
        getDifficultyLabel,
        validateQuestion,
        validateQuestionMeta,
        isValidImportedQuestion,
        isValidImportedTest,
        parseCSV,
        escapeCSV,
        shuffleArray,
        shuffleQuestionOptions,
        getCategoryName,
        sumCategoryAttempts,
        getCategoryMastery,
        getRecommendedCategories,
        emptyUserContent,
        applyStoredContent,
        buildQuestionsDB,
        buildTestsDB,
        migrateLegacyData,
        sanitizeProgress,
        classifyCategories,
        pruneProgress,
        MAX_TEST_RESULTS,
        calculateSessionResults
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuduratCore;
    } else {
        Object.assign(global, QuduratCore);
    }
})(typeof window !== 'undefined' ? window : globalThis);

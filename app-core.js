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

    // الأمس بحساب التقويم لا بطرح 86400000 مللي ثانية (يخطئ عند تغيّر التوقيت الصيفي)
    function getYesterdayKey(date = new Date()) {
        return getTodayKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
    }

    // تطبيع للبحث: يوحّد الهمزات والتاء المربوطة والألف المقصورة ويحذف التشكيل
    // والتطويل، فيجد البحث بـ«اسرة» كلمة «أسرة» وبـ«مدرسه» كلمة «مدرسة».
    function normalizeArabic(value) {
        return String(value == null ? '' : value)
            .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
            .replace(/[أإآٱ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/ى/g, 'ي')
            .replace(/ؤ/g, 'و')
            .replace(/ئ/g, 'ي')
            .toLowerCase()
            .trim();
    }

    // أكبر معرّف + 1. المعرّفات المبنية على Date.now() كانت تتصادم: استيراد
    // 500 صف يحجز 500 مللي ثانية من الأرقام القادمة فيصطدم بها أي إضافة تالية.
    function nextId(ids) {
        let max = 0;
        for (const id of ids) {
            if (Number.isFinite(id) && id > max) max = id;
        }
        return max + 1;
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
    // القيمة التي تبدأ بفواصل عليا قبل رمز صيغة تُحمى أيضاً، حتى يبقى العكس
    // (unescapeCSVCell) دقيقاً: يُزال دائماً ما أضفناه نحن فقط.
    function escapeCSV(value) {
        let s = String(value == null ? '' : value);
        if (/^'*[=+\-@\t\r]/.test(s)) s = "'" + s;
        if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
    }

    // عكس حماية الصيغ عند الاستيراد: بدونه يعود الخيار «-8» من ملف مُصدَّر
    // بصيغة «'-8»، فيُعدّ تعديلاً ويُفسد السؤال الأصلي عند التحديث بالمعرّف.
    function unescapeCSVCell(value) {
        const s = String(value == null ? '' : value);
        return /^'+[=+\-@\t\r]/.test(s) ? s.slice(1) : s;
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

    // مفتاح التجاوز يجب أن يكون رقماً يطابق معرّف السؤال نفسه: مفتاح «7» بسؤال
    // معرّفه 9999 يستبدل سؤال العينة 7 بسؤال آخر، ومفتاح «__proto__» يغيّر
    // نموذج الكائن بدل أن يضيف خاصية.
    function isValidOverrideEntry(key, q) {
        return /^\d+$/.test(String(key))
            && Boolean(q) && typeof q === 'object' && !Array.isArray(q)
            && q.id === Number(key);
    }

    function sanitizeOverrides(raw) {
        const result = {};
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
        for (const [key, q] of Object.entries(raw)) {
            if (isValidOverrideEntry(key, q)) result[q.id] = q;
        }
        return result;
    }

    function applyStoredContent(data) {
        return {
            customQuestions: Array.isArray(data.customQuestions) ? data.customQuestions : [],
            questionOverrides: sanitizeOverrides(data.questionOverrides),
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

    function sameQuestionContent(a, b) {
        return a.text === b.text && a.section === b.section && a.subcategory === b.subcategory &&
            a.difficulty === b.difficulty && a.correct === b.correct &&
            (a.context || null) === (b.context || null) && (a.explanation || '') === (b.explanation || '') &&
            JSON.stringify(a.options) === JSON.stringify(b.options);
    }

    // الصيغة القديمة كانت تخزّن قاعدة الأسئلة كاملة؛ نستخرج منها محتوى
    // المستخدم فقط. لا نستنتج الحذف من الغياب: بيانات إصدار أقدم قد
    // تنقصها أسئلة أُضيفت لاحقاً، واعتبارها محذوفة يمنع وصولها نهائياً.
    function migrateLegacyData(data, sampleQuestions, sampleTests) {
        const userContent = emptyUserContent();
        let progress = null;

        if (Array.isArray(data.questions)) {
            const sampleById = new Map(sampleQuestions.map(q => [q.id, q]));
            for (const q of data.questions) {
                if (!q || typeof q !== 'object') continue;
                const sample = sampleById.get(q.id);
                if (!sample) {
                    userContent.customQuestions.push({ ...q, custom: true });
                } else if (!sameQuestionContent(q, sample)) {
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

        // التدريب الحر مفتوح: فيه كل أسئلة الفئة والطالب يتوقف متى شاء، فما لم
        // يصل إليه ليس «متروكاً» ولا يدخل النسبة. في الاختبار والتحدي يُعدّ متروكاً.
        const openEnded = session.mode === 'practice';

        session.questions.forEach((q, i) => {
            const answer = session.answers[i];
            if (openEnded && answer == null) return;
            const key = `${q.section}_${q.subcategory}`;
            if (!categoryStats[key]) {
                categoryStats[key] = { correct: 0, total: 0 };
            }
            categoryStats[key].total++;

            if (answer == null) {
                unanswered++;
            } else if (answer === q.correct) {
                correct++;
                categoryStats[key].correct++;
            } else {
                wrong++;
            }
        });

        const total = correct + wrong + unanswered;
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

    // ==================== احتساب الجهد (مصدر وحيد ومُختبَر) ====================
    // كان الاحتساب موزعاً في app.js بلا اختبارات، فاحتُسبت الجلسة الفارغة إنجازاً
    // كاملاً (الأسئلة المتروكة «مُجابة» والتحدي يُكافأ بلا إجابة)، بينما لم يُحتسب
    // التدريب الحر إلا عند بلوغ آخر سؤال في الفئة. القاعدة الآن: لا يُحتسب إلا
    // السؤال المُجاب فعلاً، ويُحتسب في التدريب الحر لحظة إجابته.
    // الدوال تعدّل كائن التقدم المُمرَّر فقط — بلا DOM ولا متغيرات عامة.
    const DAILY_CHALLENGE_BONUS = 50;

    function advanceStreak(progress, now = new Date()) {
        const today = getTodayKey(now);
        if (progress.lastActive === today) return;
        progress.streak = progress.lastActive === getYesterdayKey(now) ? (progress.streak || 0) + 1 : 1;
        progress.lastActive = today;
    }

    // answers: [{ key: 'verbal_analogy', correct: true }] — أسئلة مُجابة فقط
    function creditAnswers(progress, answers, now = new Date()) {
        const list = Array.isArray(answers) ? answers : [];
        if (!list.length) return { answered: 0, correct: 0, pointsEarned: 0 };

        progress.categoryProgress = progress.categoryProgress || {};
        let correct = 0;
        for (const a of list) {
            const stats = progress.categoryProgress[a.key]
                || (progress.categoryProgress[a.key] = { attempted: 0, correct: 0 });
            stats.attempted++;
            if (a.correct) {
                stats.correct++;
                correct++;
            }
        }

        progress.questionsAnswered = (progress.questionsAnswered || 0) + list.length;
        progress.correctAnswers = (progress.correctAnswers || 0) + correct;

        progress.dailyStats = progress.dailyStats || {};
        const today = getTodayKey(now);
        const day = progress.dailyStats[today] || (progress.dailyStats[today] = { questions: 0, correct: 0 });
        day.questions += list.length;
        day.correct += correct;

        const pointsEarned = correct * POINTS_PER_CORRECT;
        progress.points = (progress.points || 0) + pointsEarned;
        advanceStreak(progress, now);
        return { answered: list.length, correct, pointsEarned };
    }

    function answeredItems(session) {
        const items = [];
        (session.questions || []).forEach((q, i) => {
            const answer = session.answers ? session.answers[i] : null;
            if (answer == null) return;
            items.push({ key: `${q.section}_${q.subcategory}`, correct: answer === q.correct });
        });
        return items;
    }

    // يُطبَّق عند إنهاء جلسة. التدريب الحر احتُسب سؤالاً بسؤال لحظة الإجابة،
    // فلا يُضاف هنا منه شيء حتى لا يُحتسب مرتين. الاختبار والتحدي يُحتسبان هنا،
    // ويغذّيان تحليل الفئات (categoryProgress) كالتدريب تماماً.
    function applySessionToProgress(progress, session, results, now = new Date()) {
        const outcome = { answered: 0, correct: 0, pointsEarned: 0, testRecorded: false, dailyCompleted: false };
        if (!session || session.mode === 'practice') return outcome;

        Object.assign(outcome, creditAnswers(progress, answeredItems(session), now));

        if (session.mode === 'test' && outcome.answered > 0) {
            progress.testResults = progress.testResults || [];
            progress.testResults.push({
                date: now.toISOString(),
                name: results.testName,
                percentage: results.percentage,
                correct: results.correct,
                total: results.total,
                timeSpent: results.timeSpent
            });
            outcome.testRecorded = true;
        }

        // التحدي يكتمل بإجابة أسئلته كلها، ومرة واحدة في اليوم
        const total = (session.questions || []).length;
        const today = getTodayKey(now);
        const dc = progress.dailyChallenge || {};
        const alreadyDone = dc.completed && dc.date === today;
        if (session.mode === 'daily' && total > 0 && outcome.answered === total && !alreadyDone) {
            progress.dailyChallenge = { ...dc, date: today, completed: true, correct: outcome.correct, total };
            progress.dailyChallengesCompleted = (progress.dailyChallengesCompleted || 0) + 1;
            progress.points = (progress.points || 0) + DAILY_CHALLENGE_BONUS;
            outcome.pointsEarned += DAILY_CHALLENGE_BONUS;
            outcome.dailyCompleted = true;
        }
        return outcome;
    }

    // ==================== CSV ====================
    // context في آخر الأعمدة حتى تبقى الملفات القديمة (11 عموداً) مقروءة كما هي
    const CSV_HEADERS = ['id', 'section', 'subcategory', 'difficulty', 'text', 'optionA', 'optionB', 'optionC', 'optionD', 'correct', 'explanation', 'context'];
    const CSV_REQUIRED = ['section', 'subcategory', 'difficulty', 'text', 'optionA', 'optionB', 'optionC', 'optionD', 'correct'];

    function questionToCSVRow(q) {
        const options = Array.isArray(q.options) ? q.options : [];
        return [q.id, q.section, q.subcategory, q.difficulty, q.text,
            options[0], options[1], options[2], options[3],
            q.correct, q.explanation || '', q.context || ''];
    }

    // يحوّل صفوف CSV إلى خطة استيراد بلا أي أثر جانبي:
    // - صف بمعرّف موجود يُحدّث سؤاله، فيصير «صدّر ← عدّل في Excel ← استورد» آمناً
    //   بعد أن كان يضاعف البنك كله (التصدير يشمل أسئلة العينة).
    // - صف جديد يُضاف بمعرّف فريد متسلسل يبدأ من firstNewId.
    // - صف يطابق نصُّه سؤالاً موجوداً في القسم نفسه يُتخطّى بدل أن يتكرر.
    function planCSVImport(rows, existing, firstNewId, maxRows = Infinity) {
        const headers = (rows[0] || []).map(h => String(h).trim());
        const missing = CSV_REQUIRED.filter(h => !headers.includes(h));
        if (missing.length) return { error: 'missing-columns', missing };

        const col = name => headers.indexOf(name);
        const cell = (r, name) => (col(name) >= 0 ? unescapeCSVCell(r[col(name)]).trim() : null);
        const isValid = q => validateQuestion(q).length === 0 && validateQuestionMeta(q).length === 0;
        const textKey = q => `${q.section}|${normalizeArabic(q.text)}`;

        const byId = new Map(existing.map(q => [q.id, q]));
        const knownTexts = new Set(existing.map(textKey));
        const plan = { added: [], updated: [], unchanged: 0, duplicates: 0, invalid: 0 };
        let newId = firstNewId;

        const limit = Math.min(rows.length, maxRows + 1);
        for (let i = 1; i < limit; i++) {
            const r = rows[i];
            if (!Array.isArray(r) || r.every(c => !String(c).trim())) continue; // سطر فارغ
            if (r.length < CSV_REQUIRED.length) { plan.invalid++; continue; }

            const fields = {
                section: cell(r, 'section'),
                subcategory: cell(r, 'subcategory'),
                difficulty: cell(r, 'difficulty'),
                text: cell(r, 'text'),
                options: ['optionA', 'optionB', 'optionC', 'optionD'].map(h => cell(r, h)),
                correct: parseInt(cell(r, 'correct'), 10)
            };
            const explanation = cell(r, 'explanation');
            if (explanation !== null) fields.explanation = explanation;
            const context = cell(r, 'context');
            if (context !== null) fields.context = context || null;

            const idCell = cell(r, 'id');
            const target = idCell && /^\d+$/.test(idCell) ? byId.get(Number(idCell)) : undefined;
            if (target) {
                const candidate = { ...target, ...fields };
                if (!isValid(candidate)) { plan.invalid++; continue; }
                if (sameQuestionContent(candidate, target)) { plan.unchanged++; continue; }
                plan.updated.push(candidate);
                byId.set(candidate.id, candidate);
                continue;
            }

            const candidate = { id: newId, explanation: '', context: null, ...fields, custom: true };
            if (!isValid(candidate)) { plan.invalid++; continue; }
            if (knownTexts.has(textKey(candidate))) { plan.duplicates++; continue; }
            knownTexts.add(textKey(candidate));
            plan.added.push(candidate);
            newId++;
        }
        return plan;
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
        getYesterdayKey,
        normalizeArabic,
        nextId,
        getLevel,
        getLevelProgress,
        getDifficultyLabel,
        validateQuestion,
        validateQuestionMeta,
        isValidImportedQuestion,
        isValidImportedTest,
        parseCSV,
        escapeCSV,
        unescapeCSVCell,
        shuffleArray,
        shuffleQuestionOptions,
        getCategoryName,
        sumCategoryAttempts,
        getCategoryMastery,
        getRecommendedCategories,
        emptyUserContent,
        isValidOverrideEntry,
        sanitizeOverrides,
        applyStoredContent,
        sameQuestionContent,
        buildQuestionsDB,
        buildTestsDB,
        migrateLegacyData,
        sanitizeProgress,
        classifyCategories,
        pruneProgress,
        MAX_TEST_RESULTS,
        calculateSessionResults,
        DAILY_CHALLENGE_BONUS,
        advanceStreak,
        creditAnswers,
        answeredItems,
        applySessionToProgress,
        CSV_HEADERS,
        CSV_REQUIRED,
        questionToCSVRow,
        planCSVImport
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuduratCore;
    } else {
        Object.assign(global, QuduratCore);
    }
})(typeof window !== 'undefined' ? window : globalThis);

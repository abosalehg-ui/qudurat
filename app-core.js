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
        calculateSessionResults
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuduratCore;
    } else {
        Object.assign(global, QuduratCore);
    }
})(typeof window !== 'undefined' ? window : globalThis);

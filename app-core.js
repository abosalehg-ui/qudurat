// الدوال النقية المشتركة بين التطبيق (المتصفح) والاختبارات (Node) — بلا أي اعتماد على DOM
(function (global) {
    'use strict';

    const POINTS_PER_CORRECT = 10;
    const POINTS_PER_LEVEL = 100;

    function escapeHTML(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
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

    function validateQuestion(data) {
        const errors = [];
        if (!data.text || data.text.length < 3) {
            errors.push('نص السؤال قصير جداً (3 أحرف على الأقل)');
        }
        if (data.options.some(o => !o)) {
            errors.push('يجب ملء جميع الخيارات الأربعة');
        } else {
            const unique = new Set(data.options.map(o => o.trim()));
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

    function isValidImportedQuestion(q) {
        return Boolean(q && typeof q === 'object'
            && Array.isArray(q.options) && q.options.length === 4
            && q.options.every(o => typeof o === 'string')
            && typeof q.correct === 'number'
            && validateQuestion(q).length === 0);
    }

    function isValidImportedTest(t) {
        return Boolean(t && typeof t === 'object'
            && typeof t.name === 'string' && t.name.trim().length > 0
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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getCategoryName(key) {
        const names = {
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
        return names[key] || key;
    }

    function sumCategoryAttempts(p, section) {
        return Object.entries(p.categoryProgress || {})
            .filter(([k]) => k.startsWith(section))
            .reduce((sum, [, v]) => sum + (v.attempted || 0), 0);
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
        escapeHTML,
        getTodayKey,
        getLevel,
        getLevelProgress,
        validateQuestion,
        isValidImportedQuestion,
        isValidImportedTest,
        parseCSV,
        shuffleArray,
        getCategoryName,
        sumCategoryAttempts,
        calculateSessionResults
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuduratCore;
    } else {
        Object.assign(global, QuduratCore);
    }
})(typeof window !== 'undefined' ? window : globalThis);

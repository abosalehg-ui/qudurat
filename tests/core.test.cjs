// اختبارات وحدات للدوال النقية في app-core.js — تعمل بـ node --test بلا أي اعتماديات
const { test } = require('node:test');
const assert = require('node:assert');
const core = require('../app-core.js');

// ---------- escapeHTML ----------
test('escapeHTML يهرّب كل الرموز الخطرة', () => {
    assert.strictEqual(
        core.escapeHTML(`<img src=x onerror="alert('x')" & >`),
        '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot; &amp; &gt;'
    );
});

test('escapeHTML يتعامل مع null وundefined والأرقام', () => {
    assert.strictEqual(core.escapeHTML(null), '');
    assert.strictEqual(core.escapeHTML(undefined), '');
    assert.strictEqual(core.escapeHTML(42), '42');
});

// ---------- parseCSV ----------
test('parseCSV يقرأ الصفوف البسيطة', () => {
    assert.deepStrictEqual(core.parseCSV('a,b,c\nd,e,f'), [['a', 'b', 'c'], ['d', 'e', 'f']]);
});

test('parseCSV يدعم الحقول المقتبسة بفواصل وأسطر واقتباسات مزدوجة', () => {
    assert.deepStrictEqual(
        core.parseCSV('"a,1",b\n"سطر\nثانٍ","قال ""نعم"""'),
        [['a,1', 'b'], ['سطر\nثانٍ', 'قال "نعم"']]
    );
});

test('parseCSV يتجاهل \\r في نهايات أسطر Windows', () => {
    assert.deepStrictEqual(core.parseCSV('a,b\r\nc,d\r\n'), [['a', 'b'], ['c', 'd']]);
});

// ---------- المستويات والنقاط ----------
test('getLevel: حدود المستويات', () => {
    assert.strictEqual(core.getLevel(0), 1);
    assert.strictEqual(core.getLevel(99), 1);
    assert.strictEqual(core.getLevel(100), 2);
    assert.strictEqual(core.getLevel(1000), 11);
});

test('getLevelProgress: نسبة التقدم داخل المستوى', () => {
    assert.strictEqual(core.getLevelProgress(0), 0);
    assert.strictEqual(core.getLevelProgress(50), 50);
    assert.strictEqual(core.getLevelProgress(100), 0);
    assert.strictEqual(core.getLevelProgress(175), 75);
});

// ---------- validateQuestion ----------
const validQ = {
    id: 9001,
    section: 'verbal',
    subcategory: 'analogy',
    difficulty: 'easy',
    text: 'سؤال صالح للاختبار',
    options: ['أ', 'ب', 'ج', 'د'],
    correct: 2,
    explanation: 'شرح كافٍ للاختبار'
};

test('validateQuestion يقبل سؤالاً سليماً', () => {
    assert.deepStrictEqual(core.validateQuestion(validQ), []);
});

test('validateQuestion يرفض النص القصير والخيار الفارغ والخيارات المكررة ومؤشر الإجابة الخاطئ', () => {
    assert.ok(core.validateQuestion({ ...validQ, text: 'أب' }).length > 0);
    assert.ok(core.validateQuestion({ ...validQ, options: ['أ', '', 'ج', 'د'] }).length > 0);
    assert.ok(core.validateQuestion({ ...validQ, options: ['أ', 'أ', 'ج', 'د'] }).length > 0);
    assert.ok(core.validateQuestion({ ...validQ, correct: 4 }).length > 0);
    assert.ok(core.validateQuestion({ ...validQ, correct: -1 }).length > 0);
});

// ---------- محققات الاستيراد ----------
test('isValidImportedQuestion يرفض البنى المشوهة ويقبل السليمة', () => {
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ }), true);
    assert.strictEqual(core.isValidImportedQuestion(null), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, options: 'ليست مصفوفة' }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, options: ['أ', 'ب', 'ج'] }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, options: ['أ', 'ب', 'ج', 7] }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, correct: '2' }), false);
});

test('isValidImportedTest يتحقق من الاسم والأعداد والوقت', () => {
    const validT = { id: 9001, name: 'اختبار', verbalCount: 5, quantCount: 5, timeLimit: 10 };
    assert.strictEqual(core.isValidImportedTest(validT), true);
    assert.strictEqual(core.isValidImportedTest({ ...validT, name: '' }), false);
    assert.strictEqual(core.isValidImportedTest({ ...validT, verbalCount: 0, quantCount: 0 }), false);
    assert.strictEqual(core.isValidImportedTest({ ...validT, timeLimit: 0 }), false);
    assert.strictEqual(core.isValidImportedTest({ ...validT, quantCount: 'خمسة' }), false);
});

// ---------- calculateSessionResults ----------
test('calculateSessionResults يحسب الصحيح والخاطئ وغير المُجاب وإحصاء الفئات', () => {
    const session = {
        mode: 'test',
        testName: 'اختبار تجريبي',
        startTime: Date.now() - 60000,
        questions: [
            { section: 'verbal', subcategory: 'analogy', correct: 0 },
            { section: 'verbal', subcategory: 'analogy', correct: 1 },
            { section: 'quant', subcategory: 'algebra', correct: 2 },
            { section: 'quant', subcategory: 'algebra', correct: 3 }
        ],
        answers: [0, 2, null, 3]
    };
    const r = core.calculateSessionResults(session);
    assert.strictEqual(r.correct, 2);
    assert.strictEqual(r.wrong, 1);
    assert.strictEqual(r.unanswered, 1);
    assert.strictEqual(r.total, 4);
    assert.strictEqual(r.percentage, 50);
    assert.strictEqual(r.testName, 'اختبار تجريبي');
    assert.deepStrictEqual(r.categoryStats.verbal_analogy, { correct: 1, total: 2 });
    assert.deepStrictEqual(r.categoryStats.quant_algebra, { correct: 1, total: 2 });
    assert.ok(r.timeSpent >= 60000);
});

test('calculateSessionResults لا يقسم على صفر عند جلسة فارغة', () => {
    const r = core.calculateSessionResults({ mode: 'practice', startTime: Date.now(), questions: [], answers: [] });
    assert.strictEqual(r.percentage, 0);
});

// ---------- shuffleArray ----------
test('shuffleArray يحافظ على العناصر والطول', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = core.shuffleArray([...original]);
    assert.strictEqual(shuffled.length, original.length);
    assert.deepStrictEqual([...shuffled].sort((a, b) => a - b), original);
});

// ---------- getTodayKey ----------
test('getTodayKey يعيد YYYY-MM-DD بالتوقيت المحلي ويقبل تاريخاً صريحاً', () => {
    assert.match(core.getTodayKey(), /^\d{4}-\d{2}-\d{2}$/);
    assert.strictEqual(core.getTodayKey(new Date(2026, 0, 5)), '2026-01-05');
});

// ---------- getCategoryName / sumCategoryAttempts ----------
test('getCategoryName يترجم المفاتيح المعروفة ويمرر المجهولة كما هي', () => {
    assert.strictEqual(core.getCategoryName('verbal_analogy'), 'التناظر اللفظي');
    assert.strictEqual(core.getCategoryName('غير_معروف'), 'غير_معروف');
});

test('sumCategoryAttempts يجمع محاولات القسم فقط', () => {
    const p = {
        categoryProgress: {
            verbal_analogy: { attempted: 10, correct: 5 },
            verbal_reading: { attempted: 7, correct: 3 },
            quant_algebra: { attempted: 20, correct: 15 }
        }
    };
    assert.strictEqual(core.sumCategoryAttempts(p, 'verbal'), 17);
    assert.strictEqual(core.sumCategoryAttempts(p, 'quant'), 20);
    assert.strictEqual(core.sumCategoryAttempts({}, 'verbal'), 0);
});

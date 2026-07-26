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

// ---------- safeId / safeToken ----------
test('safeId يجبر المعرّف على رقم فلا يمكن كسر سمة onclick', () => {
    assert.strictEqual(core.safeId(12), 12);
    assert.strictEqual(core.safeId('12'), 12);
    assert.strictEqual(core.safeId('1);alert(1);//'), 0);
    assert.strictEqual(core.safeId('"><script>'), 0);
    assert.strictEqual(core.safeId(null), 0);
    assert.strictEqual(core.safeId(undefined), 0);
    assert.strictEqual(core.safeId(NaN), 0);
});

test('safeToken يقصر القيمة على قائمة مغلقة', () => {
    assert.strictEqual(core.safeToken('easy', core.DIFFICULTIES, 'medium'), 'easy');
    assert.strictEqual(core.safeToken('easy" onmouseover="alert(1)', core.DIFFICULTIES, 'medium'), 'medium');
    assert.strictEqual(core.safeToken(undefined, core.DIFFICULTIES, 'medium'), 'medium');
});

// ---------- parseCSV / escapeCSV ----------
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

test('escapeCSV يعطّل حقن الصيغ ويقتبس عند الحاجة', () => {
    assert.strictEqual(core.escapeCSV('=HYPERLINK("http://evil","x")'), `"'=HYPERLINK(""http://evil"",""x"")"`);
    assert.strictEqual(core.escapeCSV('+1234'), "'+1234");
    assert.strictEqual(core.escapeCSV('-5'), "'-5");
    assert.strictEqual(core.escapeCSV('@cmd'), "'@cmd");
    assert.strictEqual(core.escapeCSV('نص عادي'), 'نص عادي');
    assert.strictEqual(core.escapeCSV('فيه, فاصلة'), '"فيه, فاصلة"');
    assert.strictEqual(core.escapeCSV(null), '');
});

test('escapeCSV وparseCSV يتكاملان ذهاباً وإياباً', () => {
    const row = ['نص "مقتبس"', 'سطر\nثانٍ', 'عادي'];
    const parsed = core.parseCSV(row.map(core.escapeCSV).join(','));
    assert.deepStrictEqual(parsed, [row]);
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

// ---------- validateQuestion / validateQuestionMeta ----------
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

test('validateQuestion لا ينهار على خيارات ليست مصفوفة', () => {
    assert.ok(core.validateQuestion({ ...validQ, options: 'نص' }).length > 0);
    assert.ok(core.validateQuestion({ ...validQ, options: ['أ', 'ب'] }).length > 0);
});

test('validateQuestionMeta يرفض التصنيف المجهول', () => {
    assert.deepStrictEqual(core.validateQuestionMeta(validQ), []);
    assert.ok(core.validateQuestionMeta({ ...validQ, section: 'xyz' }).length > 0);
    assert.ok(core.validateQuestionMeta({ ...validQ, subcategory: 'ratio' }).length > 0); // فئة كمية في قسم لفظي
    assert.ok(core.validateQuestionMeta({ ...validQ, difficulty: 'إلهي' }).length > 0);
});

// ---------- محققات الاستيراد (حدود الثقة) ----------
test('isValidImportedQuestion يقبل السليم ويرفض المشوّه', () => {
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ }), true);
    assert.strictEqual(core.isValidImportedQuestion(null), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, options: 'ليست مصفوفة' }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, options: ['أ', 'ب', 'ج'] }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, options: ['أ', 'ب', 'ج', 7] }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, correct: '2' }), false);
});

// انحدار مباشر لثغرة الحقن: هذه الحقول تدخل سمات HTML
test('isValidImportedQuestion يرفض الحقول التي تُحقن في HTML إن كانت خبيثة', () => {
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, id: '1);alert(document.domain);//' }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, id: '9001' }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, difficulty: 'easy" onmouseover="alert(1)' }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, subcategory: '<img src=x onerror=alert(1)>' }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, section: 'verbal<script>' }), false);
    assert.strictEqual(core.isValidImportedQuestion({ ...validQ, context: { toString: () => '<script>' } }), false);
});

test('isValidImportedTest يتحقق من المعرّف والاسم والأعداد والوقت', () => {
    const validT = { id: 9001, name: 'اختبار', verbalCount: 5, quantCount: 5, timeLimit: 10 };
    assert.strictEqual(core.isValidImportedTest(validT), true);
    assert.strictEqual(core.isValidImportedTest({ ...validT, name: '' }), false);
    assert.strictEqual(core.isValidImportedTest({ ...validT, verbalCount: 0, quantCount: 0 }), false);
    assert.strictEqual(core.isValidImportedTest({ ...validT, timeLimit: 0 }), false);
    assert.strictEqual(core.isValidImportedTest({ ...validT, quantCount: 'خمسة' }), false);
    assert.strictEqual(core.isValidImportedTest({ ...validT, id: '9);alert(1);//' }), false);
    assert.strictEqual(core.isValidImportedTest({ ...validT, description: 42 }), false);
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

// ---------- shuffleArray / shuffleQuestionOptions ----------
test('shuffleArray يحافظ على العناصر والطول', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = core.shuffleArray([...original]);
    assert.strictEqual(shuffled.length, original.length);
    assert.deepStrictEqual([...shuffled].sort((a, b) => a - b), original);
});

test('shuffleQuestionOptions يبقي الإجابة الصحيحة مرتبطة بنصها', () => {
    for (let i = 0; i < 200; i++) {
        const q = { ...validQ, options: ['أول', 'ثانٍ', 'ثالث', 'رابع'], correct: 1 };
        const s = core.shuffleQuestionOptions(q);
        assert.strictEqual(s.options[s.correct], 'ثانٍ');
        assert.deepStrictEqual([...s.options].sort(), [...q.options].sort());
        assert.strictEqual(q.correct, 1, 'يجب ألا يُعدَّل السؤال الأصلي');
    }
});

test('shuffleQuestionOptions يغيّر الترتيب فعلاً عبر عدة محاولات', () => {
    const q = { ...validQ, options: ['أ', 'ب', 'ج', 'د'], correct: 0 };
    const positions = new Set();
    for (let i = 0; i < 200; i++) positions.add(core.shuffleQuestionOptions(q).correct);
    assert.strictEqual(positions.size, 4, 'الإجابة الصحيحة يجب أن تظهر في المواضع الأربعة');
});

test('shuffleQuestionOptions يمرّر المدخلات المشوّهة كما هي بلا انهيار', () => {
    assert.strictEqual(core.shuffleQuestionOptions(null), null);
    const noOpts = { ...validQ, options: undefined };
    assert.strictEqual(core.shuffleQuestionOptions(noOpts), noOpts);
});

// ---------- getTodayKey ----------
test('getTodayKey يعيد YYYY-MM-DD بالتوقيت المحلي ويقبل تاريخاً صريحاً', () => {
    assert.match(core.getTodayKey(), /^\d{4}-\d{2}-\d{2}$/);
    assert.strictEqual(core.getTodayKey(new Date(2026, 0, 5)), '2026-01-05');
});

// ---------- التصنيف ----------
test('getCategoryName يترجم المفاتيح المعروفة ويمرر المجهولة كما هي', () => {
    assert.strictEqual(core.getCategoryName('verbal_analogy'), 'التناظر اللفظي');
    assert.strictEqual(core.getCategoryName('غير_معروف'), 'غير_معروف');
});

test('التصنيف متسق: لكل فئة فرعية اسم معروض', () => {
    for (const section of core.SECTIONS) {
        for (const sub of core.SUBCATEGORIES[section]) {
            const key = `${section}_${sub}`;
            assert.notStrictEqual(core.getCategoryName(key), key, `ينقص اسم للفئة ${key}`);
        }
    }
});

test('getDifficultyLabel يغطي كل مستويات الصعوبة', () => {
    for (const d of core.DIFFICULTIES) assert.ok(core.getDifficultyLabel(d).length > 0);
    assert.strictEqual(core.getDifficultyLabel('مجهول'), 'مجهول');
});

// ---------- إحصاءات الفئات ----------
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

test('getCategoryMastery يرجّح التغطية بالدقة ولا يتجاوز 100', () => {
    const none = { categoryProgress: {} };
    assert.strictEqual(core.getCategoryMastery(none, 'verbal', 'analogy'), 0);

    const perfect = { categoryProgress: { verbal_analogy: { attempted: 10, correct: 10 } } };
    assert.strictEqual(core.getCategoryMastery(perfect, 'verbal', 'analogy'), 100);

    // محاولات كثيرة كلها خاطئة يجب ألا تملأ الشريط
    const allWrong = { categoryProgress: { verbal_analogy: { attempted: 50, correct: 0 } } };
    assert.strictEqual(core.getCategoryMastery(allWrong, 'verbal', 'analogy'), 0);

    const half = { categoryProgress: { verbal_analogy: { attempted: 5, correct: 5 } } };
    assert.strictEqual(core.getCategoryMastery(half, 'verbal', 'analogy'), 50);

    const over = { categoryProgress: { verbal_analogy: { attempted: 100, correct: 100 } } };
    assert.strictEqual(core.getCategoryMastery(over, 'verbal', 'analogy'), 100);
});

test('getRecommendedCategories يقدّم الأضعف ثم غير المُجرَّب', () => {
    const p = {
        categoryProgress: {
            verbal_analogy: { attempted: 10, correct: 2 },   // 20% — الأضعف
            verbal_completion: { attempted: 10, correct: 6 }, // 60% — ضعيف
            quant_algebra: { attempted: 10, correct: 10 }     // 100% — قوي
        }
    };
    const recs = core.getRecommendedCategories(p, 3);
    assert.strictEqual(recs.length, 3);
    assert.strictEqual(recs[0].key, 'verbal_analogy');
    assert.strictEqual(recs[1].key, 'verbal_completion');
    assert.strictEqual(recs[2].attempted, 0, 'الثالثة يجب أن تكون فئة لم تُجرَّب');
    assert.ok(!recs.some(r => r.key === 'quant_algebra'), 'الفئة القوية لا تُقترح مع وجود أضعف منها');
});

test('getRecommendedCategories يعمل على تقدم فارغ', () => {
    const recs = core.getRecommendedCategories({}, 3);
    assert.strictEqual(recs.length, 3);
    assert.ok(recs.every(r => r.attempted === 0));
});

// ---------- بناء قاعدة البيانات ----------
const SAMPLE_Q = [
    { id: 1, section: 'verbal', subcategory: 'analogy', difficulty: 'easy', text: 'أ', options: ['1', '2', '3', '4'], correct: 0, explanation: 'شرح كافٍ' },
    { id: 2, section: 'quant', subcategory: 'algebra', difficulty: 'hard', text: 'ب', options: ['1', '2', '3', '4'], correct: 1, explanation: 'شرح كافٍ' }
];
const SAMPLE_T = [{ id: 1001, name: 'اختبار', verbalCount: 1, quantCount: 1, timeLimit: 5 }];

test('buildQuestionsDB يدمج العينة مع التجاوزات والحذف والأسئلة المخصصة', () => {
    const uc = core.emptyUserContent();
    assert.strictEqual(core.buildQuestionsDB(SAMPLE_Q, uc).length, 2);

    uc.deletedQuestionIds = [1];
    assert.deepStrictEqual(core.buildQuestionsDB(SAMPLE_Q, uc).map(q => q.id), [2]);

    uc.deletedQuestionIds = [];
    uc.questionOverrides = { 2: { ...SAMPLE_Q[1], text: 'نص معدّل' } };
    assert.strictEqual(core.buildQuestionsDB(SAMPLE_Q, uc).find(q => q.id === 2).text, 'نص معدّل');

    uc.customQuestions = [{ id: 99, section: 'verbal', subcategory: 'analogy', difficulty: 'easy', text: 'ج', options: ['1', '2', '3', '4'], correct: 0, custom: true }];
    assert.deepStrictEqual(core.buildQuestionsDB(SAMPLE_Q, uc).map(q => q.id), [1, 2, 99]);
});

test('buildQuestionsDB لا يعدّل أسئلة العينة الأصلية', () => {
    const uc = core.emptyUserContent();
    uc.questionOverrides = { 1: { ...SAMPLE_Q[0], text: 'معدّل' } };
    core.buildQuestionsDB(SAMPLE_Q, uc);
    assert.strictEqual(SAMPLE_Q[0].text, 'أ');
});

test('buildTestsDB يحذف اختبارات العينة ويضيف المخصصة', () => {
    const uc = core.emptyUserContent();
    assert.strictEqual(core.buildTestsDB(SAMPLE_T, uc).length, 1);
    uc.deletedTestIds = [1001];
    assert.strictEqual(core.buildTestsDB(SAMPLE_T, uc).length, 0);
    uc.customTests = [{ id: 5, name: 'خاص', verbalCount: 1, quantCount: 0, timeLimit: 3, custom: true }];
    assert.deepStrictEqual(core.buildTestsDB(SAMPLE_T, uc).map(t => t.id), [5]);
});

// ---------- applyStoredContent ----------
test('applyStoredContent يصلّب البنية أمام البيانات المشوّهة', () => {
    const uc = core.applyStoredContent({
        customQuestions: 'ليست مصفوفة',
        questionOverrides: ['مصفوفة لا كائن'],
        deletedQuestionIds: [1, 'ثلاثة', 3],
        customTests: null,
        deletedTestIds: undefined
    });
    assert.deepStrictEqual(uc.customQuestions, []);
    assert.deepStrictEqual(uc.questionOverrides, {});
    assert.deepStrictEqual(uc.deletedQuestionIds, [1, 3]);
    assert.deepStrictEqual(uc.customTests, []);
    assert.deepStrictEqual(uc.deletedTestIds, []);
});

// ---------- migrateLegacyData ----------
test('migrateLegacyData يفصل محتوى المستخدم عن العينة ولا يستنتج الحذف من الغياب', () => {
    const legacy = {
        questions: [
            { ...SAMPLE_Q[0] },                                  // مطابق للعينة → يُتجاهل
            { ...SAMPLE_Q[1], text: 'معدّل' },                    // مختلف → تجاوز
            { id: 500, section: 'verbal', subcategory: 'analogy', difficulty: 'easy', text: 'مخصص', options: ['1', '2', '3', '4'], correct: 0 }
        ],
        tests: [{ ...SAMPLE_T[0] }, { id: 7, name: 'خاص', verbalCount: 1, quantCount: 0, timeLimit: 3 }],
        progress: { questionsAnswered: 5, lastActive: '2026-01-05T10:00:00.000Z', dailyStats: { '2026-01-05T00:00:00.000Z': { questions: 3, correct: 2 } } }
    };
    const { userContent, progress } = core.migrateLegacyData(legacy, SAMPLE_Q, SAMPLE_T);

    assert.deepStrictEqual(userContent.customQuestions.map(q => q.id), [500]);
    assert.ok(userContent.questionOverrides[2], 'السؤال المعدّل يجب أن يُحفظ كتجاوز');
    assert.strictEqual(userContent.questionOverrides[1], undefined, 'المطابق للعينة لا يُحفظ');
    assert.deepStrictEqual(userContent.deletedQuestionIds, [], 'الغياب لا يعني الحذف');
    assert.deepStrictEqual(userContent.customTests.map(t => t.id), [7]);
    assert.strictEqual(progress.questionsAnswered, 5);
    assert.match(progress.lastActive, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Object.keys(progress.dailyStats).every(k => /^\d{4}-\d{2}-\d{2}$/.test(k)));
});

test('migrateLegacyData يتحمّل بيانات فارغة أو مشوّهة', () => {
    const empty = core.migrateLegacyData({}, SAMPLE_Q, SAMPLE_T);
    assert.deepStrictEqual(empty.userContent.customQuestions, []);
    assert.strictEqual(empty.progress, null);

    const junk = core.migrateLegacyData({ questions: [null, 'نص', 5], tests: [null], progress: [] }, SAMPLE_Q, SAMPLE_T);
    assert.deepStrictEqual(junk.userContent.customQuestions, []);
    assert.strictEqual(junk.progress, null);
});

// ---------- pruneProgress ----------
test('pruneProgress يقصّ سجل النتائج والإحصاءات اليومية ويُبقي الأحدث', () => {
    const progress = {
        testResults: Array.from({ length: 150 }, (_, i) => ({ n: i })),
        dailyStats: {}
    };
    for (let i = 0; i < 500; i++) {
        progress.dailyStats[core.getTodayKey(new Date(2025, 0, 1 + i))] = { questions: i, correct: 0 };
    }
    core.pruneProgress(progress);
    assert.strictEqual(progress.testResults.length, core.MAX_TEST_RESULTS);
    assert.strictEqual(progress.testResults[progress.testResults.length - 1].n, 149, 'يجب الاحتفاظ بالأحدث');
    assert.strictEqual(Object.keys(progress.dailyStats).length, 400);
});

test('pruneProgress لا يمسّ البيانات الصغيرة', () => {
    const progress = { testResults: [{ n: 1 }], dailyStats: { '2026-01-01': { questions: 1, correct: 1 } } };
    core.pruneProgress(progress);
    assert.strictEqual(progress.testResults.length, 1);
    assert.strictEqual(Object.keys(progress.dailyStats).length, 1);
});

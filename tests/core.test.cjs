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

// ---------- sanitizeProgress ----------
test('sanitizeProgress يُجبر الحقول المعطوبة على أنواعها الصحيحة', () => {
    const p = core.sanitizeProgress({
        streak: 'كثير',
        lastActive: 42,
        questionsAnswered: -5,
        correctAnswers: NaN,
        points: null,
        savedQuestions: null,               // كان يفجّر renderQuestion بـTypeError
        badges: 'gold',
        categoryProgress: { verbal_analogy: { attempted: 3, correct: '2' }, bad: null },
        dailyStats: null,                   // typeof null === 'object' — لا يصدّه فحص ساذج
        testResults: [{ percentage: 80 }, null, 'نص'],
        dailyChallenge: [],
        dailyChallengesCompleted: '7'
    });
    assert.strictEqual(p.streak, 0);
    assert.strictEqual(p.lastActive, null);
    assert.strictEqual(p.questionsAnswered, 0);
    assert.strictEqual(p.correctAnswers, 0);
    assert.strictEqual(p.points, 0);
    assert.deepStrictEqual(p.savedQuestions, []);
    assert.deepStrictEqual(p.badges, []);
    assert.deepStrictEqual(p.categoryProgress, { verbal_analogy: { attempted: 3, correct: 0 } });
    assert.deepStrictEqual(p.dailyStats, {});
    assert.deepStrictEqual(p.testResults, [{ percentage: 80 }]);
    assert.deepStrictEqual(p.dailyChallenge, {});
    assert.strictEqual(p.dailyChallengesCompleted, 0);
});

test('sanitizeProgress يمرّر البيانات السليمة كما هي', () => {
    const clean = {
        streak: 4,
        lastActive: '2026-08-20',
        questionsAnswered: 30,
        correctAnswers: 21,
        points: 210,
        savedQuestions: [3, 17],
        badges: ['first_q', 'q10'],
        categoryProgress: { quant_algebra: { attempted: 10, correct: 8 } },
        dailyStats: { '2026-08-20': { questions: 12, correct: 9 } },
        testResults: [{ name: 'اختبار', percentage: 70 }],
        dailyChallenge: { date: '2026-08-20', completed: true, correct: 4, total: 5 },
        dailyChallengesCompleted: 2
    };
    assert.deepStrictEqual(core.sanitizeProgress(clean), clean);
});

test('sanitizeProgress يتحمّل مدخلاً ليس كائناً أصلاً', () => {
    for (const junk of [null, undefined, [], 'نص', 9]) {
        const p = core.sanitizeProgress(junk);
        assert.deepStrictEqual(p.savedQuestions, []);
        assert.deepStrictEqual(p.categoryProgress, {});
        assert.deepStrictEqual(p.dailyStats, {});
    }
});

// ---------- classifyCategories ----------
test('classifyCategories يصنّف القوة والضعف بعتبات موحّدة وحد أدنى للمحاولات', () => {
    const { strengths, weaknesses } = core.classifyCategories({
        verbal_analogy: { correct: 8, total: 10 },        // 80% → قوة
        quant_algebra: { correct: 2, attempted: 5 },      // 40% → ضعف (صيغة التقدم)
        quant_ratio: { correct: 3, total: 5 },            // 60% → لا هذه ولا تلك
        verbal_reading: { correct: 1, total: 1 },         // أقل من الحد الأدنى → تُتجاهل
        bad: null
    });
    assert.deepStrictEqual(strengths, ['التناظر اللفظي']);
    assert.deepStrictEqual(weaknesses, ['الجبر والمعادلات']);
});

test('classifyCategories يقبل حداً أدنى مخصصاً ومدخلاً فارغاً', () => {
    const one = core.classifyCategories({ verbal_analogy: { correct: 1, total: 1 } }, 1);
    assert.deepStrictEqual(one.strengths, ['التناظر اللفظي']);
    const empty = core.classifyCategories(null);
    assert.deepStrictEqual(empty, { strengths: [], weaknesses: [] });
});

// ---------- احتساب الجهد: creditAnswers / applySessionToProgress ----------
const NOW = new Date(2026, 9, 16, 12, 0, 0);
const freshProgress = () => core.sanitizeProgress({});
const q = (section, subcategory, correct) => ({ section, subcategory, correct });

test('calculateSessionResults في التدريب الحر يحتسب المُجاب فقط', () => {
    const r = core.calculateSessionResults({
        mode: 'practice', startTime: Date.now(),
        questions: [q('verbal', 'analogy', 0), q('verbal', 'analogy', 1), q('verbal', 'analogy', 2)],
        answers: [0, null, null]
    });
    assert.strictEqual(r.total, 1);
    assert.strictEqual(r.unanswered, 0);
    assert.strictEqual(r.percentage, 100);
    assert.deepStrictEqual(r.categoryStats.verbal_analogy, { correct: 1, total: 1 });
});

test('creditAnswers يحدّث العدّادات والفئات والإحصاء اليومي والنقاط والتتابع معاً', () => {
    const p = freshProgress();
    const out = core.creditAnswers(p, [
        { key: 'verbal_analogy', correct: true },
        { key: 'verbal_analogy', correct: false },
        { key: 'quant_algebra', correct: true }
    ], NOW);
    assert.deepStrictEqual(out, { answered: 3, correct: 2, pointsEarned: 20 });
    assert.strictEqual(p.questionsAnswered, 3);
    assert.strictEqual(p.correctAnswers, 2);
    assert.strictEqual(p.points, 20);
    assert.deepStrictEqual(p.categoryProgress.verbal_analogy, { attempted: 2, correct: 1 });
    assert.deepStrictEqual(p.dailyStats['2026-10-16'], { questions: 3, correct: 2 });
    assert.strictEqual(p.streak, 1);
    assert.strictEqual(p.lastActive, '2026-10-16');
});

test('creditAnswers بلا إجابات لا يغيّر شيئاً — لا تتابع ولا إحصاء يومي', () => {
    const p = freshProgress();
    const before = JSON.stringify(p);
    assert.deepStrictEqual(core.creditAnswers(p, [], NOW), { answered: 0, correct: 0, pointsEarned: 0 });
    assert.strictEqual(JSON.stringify(p), before);
});

test('advanceStreak: نفس اليوم لا يزيد، الأمس يزيد، الانقطاع يعيد إلى 1', () => {
    const p = { streak: 4, lastActive: '2026-10-16' };
    core.advanceStreak(p, NOW);
    assert.strictEqual(p.streak, 4);
    p.lastActive = '2026-10-15';
    core.advanceStreak(p, NOW);
    assert.strictEqual(p.streak, 5);
    p.lastActive = '2026-10-10';
    core.advanceStreak(p, NOW);
    assert.strictEqual(p.streak, 1);
});

test('getYesterdayKey يعبر حدود الشهر والسنة', () => {
    assert.strictEqual(core.getYesterdayKey(new Date(2026, 2, 1)), '2026-02-28');
    assert.strictEqual(core.getYesterdayKey(new Date(2027, 0, 1)), '2026-12-31');
});

const dailySession = answers => ({
    mode: 'daily',
    questions: [q('verbal', 'analogy', 0), q('verbal', 'reading', 1), q('quant', 'ratio', 2), q('quant', 'algebra', 3), q('quant', 'geometry', 0)],
    answers
});

test('applySessionToProgress: تحدٍّ يومي بلا إجابات لا يمنح نقاطاً ولا تتابعاً ولا إكمالاً', () => {
    const p = freshProgress();
    const out = core.applySessionToProgress(p, dailySession([null, null, null, null, null]), {}, NOW);
    assert.strictEqual(out.dailyCompleted, false);
    assert.strictEqual(p.points, 0);
    assert.strictEqual(p.questionsAnswered, 0);
    assert.strictEqual(p.streak, 0);
    assert.strictEqual(p.dailyChallengesCompleted, 0);
    assert.deepStrictEqual(p.dailyStats, {});
});

test('applySessionToProgress: تحدٍّ جزئي يُحتسب المُجاب منه بلا مكافأة الإكمال', () => {
    const p = freshProgress();
    const out = core.applySessionToProgress(p, dailySession([0, 1, null, null, null]), {}, NOW);
    assert.strictEqual(out.dailyCompleted, false);
    assert.strictEqual(p.questionsAnswered, 2);
    assert.strictEqual(p.points, 20);
    assert.strictEqual(p.dailyChallengesCompleted, 0);
});

test('applySessionToProgress: تحدٍّ مكتمل يُكافأ مرة واحدة في اليوم', () => {
    const p = freshProgress();
    const out = core.applySessionToProgress(p, dailySession([0, 0, 2, 3, 0]), {}, NOW);
    assert.strictEqual(out.dailyCompleted, true);
    assert.strictEqual(p.points, 4 * 10 + core.DAILY_CHALLENGE_BONUS);
    assert.strictEqual(p.dailyChallengesCompleted, 1);
    assert.deepStrictEqual(
        { completed: p.dailyChallenge.completed, correct: p.dailyChallenge.correct, date: p.dailyChallenge.date },
        { completed: true, correct: 4, date: '2026-10-16' }
    );
    const again = core.applySessionToProgress(p, dailySession([0, 0, 2, 3, 0]), {}, NOW);
    assert.strictEqual(again.dailyCompleted, false);
    assert.strictEqual(p.dailyChallengesCompleted, 1);
});

test('applySessionToProgress: الاختبار يغذّي الفئات ويُسجَّل فقط إن أُجيب فيه شيء', () => {
    const p = freshProgress();
    const session = { mode: 'test', questions: [q('verbal', 'analogy', 0), q('quant', 'ratio', 1)], answers: [0, null] };
    const results = { testName: 'تجريبي', percentage: 50, correct: 1, total: 2, timeSpent: 1000 };
    const out = core.applySessionToProgress(p, session, results, NOW);
    assert.strictEqual(out.testRecorded, true);
    assert.strictEqual(p.testResults.length, 1);
    assert.strictEqual(p.testResults[0].name, 'تجريبي');
    assert.deepStrictEqual(p.categoryProgress.verbal_analogy, { attempted: 1, correct: 1 });
    assert.strictEqual(p.categoryProgress.quant_ratio, undefined);

    const empty = core.applySessionToProgress(p, { ...session, answers: [null, null] }, results, NOW);
    assert.strictEqual(empty.testRecorded, false);
    assert.strictEqual(p.testResults.length, 1);
});

test('applySessionToProgress لا يحتسب التدريب الحر مرة ثانية (احتُسب لحظة الإجابة)', () => {
    const p = freshProgress();
    const out = core.applySessionToProgress(p, { mode: 'practice', questions: [q('verbal', 'analogy', 0)], answers: [0] }, {}, NOW);
    assert.strictEqual(out.answered, 0);
    assert.strictEqual(p.questionsAnswered, 0);
});

// ---------- المعرّفات والتجاوزات ----------
test('nextId يعيد أكبر معرّف + 1 ويتجاهل غير الأرقام', () => {
    assert.strictEqual(core.nextId([3, 9, 'x', NaN, null, 4]), 10);
    assert.strictEqual(core.nextId([]), 1);
});

test('isValidOverrideEntry يرفض مفتاحاً لا يطابق معرّف السؤال و__proto__', () => {
    assert.strictEqual(core.isValidOverrideEntry('7', { id: 7 }), true);
    assert.strictEqual(core.isValidOverrideEntry('7', { id: 9999 }), false);
    assert.strictEqual(core.isValidOverrideEntry('__proto__', { id: 7 }), false);
    assert.strictEqual(core.isValidOverrideEntry('7', null), false);
    const parsed = JSON.parse('{"__proto__": {"id": 1}, "5": {"id": 5}}');
    const clean = core.sanitizeOverrides(parsed);
    assert.deepStrictEqual(Object.keys(clean), ['5']);
    assert.strictEqual(Object.getPrototypeOf(clean), Object.prototype);
});

test('applyStoredContent يُسقط التجاوزات ذات المفاتيح المخالفة', () => {
    const uc = core.applyStoredContent({ questionOverrides: { 3: { id: 3 }, 4: { id: 40 } } });
    assert.deepStrictEqual(Object.keys(uc.questionOverrides), ['3']);
});

test('normalizeArabic يوحّد الهمزات والتاء المربوطة والألف المقصورة ويحذف التشكيل', () => {
    assert.strictEqual(core.normalizeArabic('أُسْرَةٌ'), core.normalizeArabic('اسره'));
    assert.strictEqual(core.normalizeArabic('إلى مستشفى'), 'الي مستشفي');
    assert.strictEqual(core.normalizeArabic('مسؤول'), 'مسوول');
    assert.strictEqual(core.normalizeArabic(null), '');
});

// ---------- planCSVImport ----------
const sampleQ = (id, text, extra = {}) => ({
    id, section: 'verbal', subcategory: 'analogy', difficulty: 'easy', text,
    options: ['أ', 'ب', 'ج', 'د'], correct: 0, explanation: 'شرح كافٍ للسؤال', context: null, ...extra
});
const toRows = questions => [core.CSV_HEADERS, ...questions.map(core.questionToCSVRow).map(r => r.map(String))];

test('planCSVImport: تصدير ثم استيراد بلا تعديل لا يضيف شيئاً', () => {
    const existing = [sampleQ(1, 'سؤال أول'), sampleQ(2, 'سؤال ثانٍ')];
    const plan = core.planCSVImport(toRows(existing), existing, 100);
    assert.strictEqual(plan.added.length, 0);
    assert.strictEqual(plan.updated.length, 0);
    assert.strictEqual(plan.unchanged, 2);
});

test('planCSVImport: الصف بمعرّف موجود يحدّث سؤاله ويحفظ السياق إن غاب عموده', () => {
    const existing = [sampleQ(1, 'سؤال أول', { context: 'نص قراءة' })];
    const headers = core.CSV_HEADERS.filter(h => h !== 'context');
    const row = core.questionToCSVRow({ ...existing[0], text: 'سؤال أول معدّل' }).slice(0, headers.length).map(String);
    const plan = core.planCSVImport([headers, row], existing, 100);
    assert.strictEqual(plan.updated.length, 1);
    assert.strictEqual(plan.updated[0].id, 1);
    assert.strictEqual(plan.updated[0].text, 'سؤال أول معدّل');
    assert.strictEqual(plan.updated[0].context, 'نص قراءة');
});

test('planCSVImport: الجديد يُعطى معرّفات فريدة متسلسلة، والمكرر نصاً يُتخطى', () => {
    const existing = [sampleQ(1, 'سؤال موجود')];
    const rows = [core.CSV_HEADERS,
        ['', 'verbal', 'analogy', 'easy', 'سؤال جديد', 'أ', 'ب', 'ج', 'د', '1', 'شرح يكفي للتوضيح', ''],
        ['', 'verbal', 'analogy', 'easy', 'سؤال جديد آخر', 'أ', 'ب', 'ج', 'د', '2', '', ''],
        ['', 'verbal', 'analogy', 'easy', 'سؤال موجود', 'أ', 'ب', 'ج', 'د', '0', '', ''],
        ['', 'verbal', 'analogy', 'easy', 'سؤال جديد', 'أ', 'ب', 'ج', 'د', '1', '', ''],
        ['', 'unknown', 'analogy', 'easy', 'قسم مجهول', 'أ', 'ب', 'ج', 'د', '1', '', ''],
        ['']
    ];
    const plan = core.planCSVImport(rows, existing, 500);
    assert.deepStrictEqual(plan.added.map(x => x.id), [500, 501]);
    assert.ok(plan.added.every(x => x.custom === true));
    assert.strictEqual(plan.duplicates, 2);
    assert.strictEqual(plan.invalid, 1);
});

test('planCSVImport يبلّغ عن الأعمدة الناقصة', () => {
    const plan = core.planCSVImport([['text', 'optionA']], [], 1);
    assert.strictEqual(plan.error, 'missing-columns');
    assert.ok(plan.missing.includes('section'));
});

test('unescapeCSVCell يعكس حماية الصيغ بدقة، حتى لقيمة تبدأ بفاصلة عليا أصلاً', () => {
    for (const original of ['-8', '=SUM(A1)', '+5', '@x', "'-3", "''=x", 'نص عادي', "'نص"]) {
        const [cell] = core.parseCSV(core.escapeCSV(original))[0];
        assert.strictEqual(core.unescapeCSVCell(cell), original, original);
    }
});

test('planCSVImport: تصدير بنك العينة كاملاً ثم استيراده لا يغيّر سؤالاً واحداً', () => {
    const { getSampleQuestions } = require('../questions.js');
    const sample = getSampleQuestions();
    const csv = [core.CSV_HEADERS.join(','),
        ...sample.map(x => core.questionToCSVRow(x).map(core.escapeCSV).join(','))].join('\n');
    const plan = core.planCSVImport(core.parseCSV(csv), sample, 100000);
    assert.strictEqual(plan.updated.length, 0);
    assert.strictEqual(plan.added.length, 0);
    assert.strictEqual(plan.invalid, 0);
    assert.strictEqual(plan.unchanged, sample.length);
});

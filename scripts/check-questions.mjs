#!/usr/bin/env node
// فحص سلامة قاعدة الأسئلة المضمّنة في questions.js
// كل ما يلي يوقف الفحص بكود خروج 1: أخطاء بنيوية (خيارات مكررة، مؤشر إجابة
// خاطئ، تصنيف مجهول)، وشروح مفقودة أو عامة لا تشرح شيئاً.
// التصنيف المعتمد يأتي من app-core.js حتى لا تتباعد نسخته عن نسخة التطبيق.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { SUBCATEGORIES, DIFFICULTIES } = require('../app-core.js');

const source = readFileSync(new URL('../questions.js', import.meta.url), 'utf8');
if (!source.includes('function getSampleQuestions()')) {
    console.error('❌ لم يُعثر على getSampleQuestions في questions.js');
    process.exit(1);
}
const questions = (0, eval)(source + '\ngetSampleQuestions();');

// عبارات تُعيد صياغة السؤال بدل شرحه — لا قيمة تعليمية لها
const GENERIC_EXPLANATIONS = [
    'العلاقة واضحة من السياق',
    'الإجابة واضحة',
    'الإجابة واضحة من السياق',
    'الإجابة واضحة من النص',
    'إكمال الجملة بالكلمة المناسبة',
    'حل رياضي مباشر',
    'حل جبري مباشر',
    'حساب إحصائي',
    'حساب هندسي',
    'مقارنة رياضية'
];
const MIN_EXPLANATION_LENGTH = 25;
const MIN_READING_CONTEXT = 200;

const errors = [];
const seenIds = new Set();
const seenTexts = new Map();

for (const q of questions) {
    const label = `السؤال ${q.id}`;
    if (seenIds.has(q.id)) errors.push(`${label}: معرف مكرر`);
    seenIds.add(q.id);

    if (!Number.isInteger(q.id)) errors.push(`${label}: المعرّف يجب أن يكون عدداً صحيحاً`);

    if (!SUBCATEGORIES[q.section]) {
        errors.push(`${label}: قسم غير معروف (${q.section})`);
    } else if (!SUBCATEGORIES[q.section].includes(q.subcategory)) {
        errors.push(`${label}: فئة فرعية غير معروفة (${q.subcategory})`);
    }
    if (!DIFFICULTIES.includes(q.difficulty)) errors.push(`${label}: مستوى صعوبة غير معروف (${q.difficulty})`);
    if (!q.text || String(q.text).trim().length < 3) errors.push(`${label}: نص السؤال قصير أو مفقود`);

    // نص السؤال وحده لا يكفي مفتاحاً: سؤالان للاستيعاب المقروء قد يشتركان
    // في "ما الفكرة الرئيسية؟" وهما مختلفان لاختلاف نص السياق.
    const textKey = `${String(q.context || '').trim()}||${String(q.text || '').trim()}`;
    if (String(q.text || '').trim()) {
        if (seenTexts.has(textKey)) {
            errors.push(`${label}: نص مكرر مع السؤال ${seenTexts.get(textKey)}`);
        } else {
            seenTexts.set(textKey, q.id);
        }
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(`${label}: يجب أن تكون الخيارات 4 بالضبط`);
    } else {
        if (q.options.some(o => !String(o ?? '').trim())) errors.push(`${label}: خيار فارغ`);
        if (new Set(q.options.map(o => String(o).trim())).size !== 4) errors.push(`${label}: خيارات مكررة`);
    }
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) {
        errors.push(`${label}: مؤشر الإجابة الصحيحة غير صالح (${q.correct})`);
    }
    // «كل ما سبق» ليست خياراً في التناظر اللفظي بامتحان قياس (المطلوب انتقاء
    // الزوج الأوحد المطابق)، ووجودها يتيح التخمين بلا قراءة. تُمنع نهائياً هنا.
    if (q.subcategory === 'analogy' && Array.isArray(q.options)
        && q.options.some(o => /كل ما سبق/.test(String(o)))) {
        errors.push(`${label}: «كل ما سبق» غير مسموحة في التناظر اللفظي — استبدلها بزوج له علاقة مختلفة`);
    }
    // في الإكمال تُنتج «كل ما سبق» جملة مكسورة عند وضعها في الفراغ، فتُمنع كإجابة
    if (q.subcategory === 'completion' && Array.isArray(q.options)
        && Number.isInteger(q.correct) && q.options[q.correct]
        && /كل ما سبق/.test(String(q.options[q.correct]))) {
        errors.push(`${label}: «كل ما سبق» لا تصلح إجابة إكمال (تكسر الجملة عند التعويض)`);
    }

    if (q.subcategory === 'reading') {
        if (!q.context) {
            errors.push(`${label}: سؤال استيعاب مقروء بلا نص سياق`);
        } else if (String(q.context).trim().length < MIN_READING_CONTEXT) {
            // نص أقصر من فقرة لا يدرّب على تتبّع فكرة عبر النص كما في قياس
            errors.push(`${label}: نص الاستيعاب قصير (${String(q.context).trim().length} حرفاً، الحد الأدنى ${MIN_READING_CONTEXT})`);
        }
    }

    const explanation = String(q.explanation || '').trim();
    if (!explanation) {
        errors.push(`${label}: الشرح مفقود`);
    } else if (GENERIC_EXPLANATIONS.includes(explanation)) {
        errors.push(`${label}: شرح عام لا يشرح شيئاً ("${explanation}") — اكتب تعليلاً يوضّح لماذا الإجابة صحيحة`);
    } else if (explanation.length < MIN_EXPLANATION_LENGTH) {
        errors.push(`${label}: الشرح قصير جداً (${explanation.length} حرفاً، الحد الأدنى ${MIN_EXPLANATION_LENGTH})`);
    }
}

console.log(`فُحص ${questions.length} سؤالاً`);

// توزيع موقع الإجابة الصحيحة: مؤشر جودة فقط — الخيارات تُخلط عند العرض
// (shuffleQuestionOptions) فلا يؤثر الانحياز في التدريب الفعلي.
const positions = [0, 0, 0, 0];
for (const q of questions) if (Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4) positions[q.correct]++;
console.log('توزيع موقع الإجابة في البيانات: ' +
    positions.map((n, i) => `${'أبجد'[i]} ${Math.round(n / questions.length * 100)}%`).join(' / ') +
    ' (يُخلط عند العرض)');

if (errors.length) {
    console.error(`\n❌ أخطاء (${errors.length}):`);
    for (const e of errors.slice(0, 40)) console.error('  - ' + e);
    if (errors.length > 40) console.error(`  ... و${errors.length - 40} خطأً آخر`);
    process.exit(1);
}

console.log('\n✓ قاعدة الأسئلة سليمة: بنية صحيحة وشروح تفصيلية لكل سؤال');

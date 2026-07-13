#!/usr/bin/env node
// فحص سلامة قاعدة الأسئلة المضمّنة في index.html
// أخطاء بنيوية (خيارات مكررة، مؤشر إجابة خاطئ، ...) توقف الفحص بكود خروج 1،
// أما ملاحظات الجودة (شروح عامة) فتُعرض كتحذيرات فقط.
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = html.indexOf('function getSampleQuestions()');
const end = html.indexOf('function getSampleTests()');
if (start === -1 || end === -1) {
    console.error('❌ لم يُعثر على getSampleQuestions/getSampleTests في index.html');
    process.exit(1);
}
let body = html.slice(start, end);
body = body.slice(body.indexOf('return [') + 7);
body = body.slice(0, body.lastIndexOf(';'));
const questions = (0, eval)(body);

const SECTIONS = {
    verbal: ['analogy', 'completion', 'reading', 'context'],
    quant: ['ratio', 'algebra', 'statistics', 'geometry', 'comparison']
};
const DIFFICULTIES = ['easy', 'medium', 'hard'];
const GENERIC_EXPLANATIONS = /^(العلاقة واضحة من السياق|الإجابة واضحة|حل رياضي مباشر|حل جبري مباشر|حساب إحصائي|حساب هندسي|مقارنة رياضية)$/;

const errors = [];
const warnings = [];
const seenIds = new Set();

for (const q of questions) {
    const label = `السؤال ${q.id}`;
    if (seenIds.has(q.id)) errors.push(`${label}: معرف مكرر`);
    seenIds.add(q.id);

    if (!SECTIONS[q.section]) {
        errors.push(`${label}: قسم غير معروف (${q.section})`);
    } else if (!SECTIONS[q.section].includes(q.subcategory)) {
        errors.push(`${label}: فئة فرعية غير معروفة (${q.subcategory})`);
    }
    if (!DIFFICULTIES.includes(q.difficulty)) errors.push(`${label}: مستوى صعوبة غير معروف (${q.difficulty})`);
    if (!q.text || String(q.text).trim().length < 3) errors.push(`${label}: نص السؤال قصير أو مفقود`);

    if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(`${label}: يجب أن تكون الخيارات 4 بالضبط`);
    } else {
        if (q.options.some(o => !String(o ?? '').trim())) errors.push(`${label}: خيار فارغ`);
        if (new Set(q.options.map(o => String(o).trim())).size !== 4) errors.push(`${label}: خيارات مكررة`);
    }
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) {
        errors.push(`${label}: مؤشر الإجابة الصحيحة غير صالح (${q.correct})`);
    }
    if (q.subcategory === 'reading' && !q.context) errors.push(`${label}: سؤال استيعاب مقروء بلا نص سياق`);

    if (!q.explanation || q.explanation.trim().length < 5) {
        warnings.push(`${label}: الشرح مفقود أو قصير جداً`);
    } else if (GENERIC_EXPLANATIONS.test(q.explanation.trim())) {
        warnings.push(`${label}: شرح عام غير تفصيلي ("${q.explanation.trim()}")`);
    }
}

console.log(`فُحص ${questions.length} سؤالاً`);

if (warnings.length) {
    console.log(`\n⚠️  تحذيرات جودة (${warnings.length}) — لا توقف الفحص:`);
    for (const w of warnings.slice(0, 15)) console.log('  - ' + w);
    if (warnings.length > 15) console.log(`  ... و${warnings.length - 15} تحذيراً آخر`);
}

if (errors.length) {
    console.error(`\n❌ أخطاء بنيوية (${errors.length}):`);
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
}

console.log('\n✓ قاعدة الأسئلة سليمة بنيوياً');

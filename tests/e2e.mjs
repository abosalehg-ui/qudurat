// اختبار تكامل متصفح واحد يغطي أهم مسارات المستخدم على Chromium:
// فتح → تدريب → إجابة → تحديث واستئناف الجلسة → تحدٍّ يومي → شاشة النتيجة.
//
// التشغيل: npm run test:e2e
// يحتاج حزمة playwright ومتصفح Chromium وقت التشغيل فقط — لا يضيف أي
// اعتمادية دائمة للمشروع (CI يثبّتها بـ--no-save؛ انظر check-questions.yml).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = normalize(fileURLToPath(new URL('..', import.meta.url)));
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff2': 'font/woff2'
};

// خادم ملفات ثابتة بسيط — التطبيق يشترط مصدراً حقيقياً (CSP + Service Worker)
const server = createServer(async (req, res) => {
    try {
        const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        const file = normalize(join(root, urlPath === '/' ? 'index.html' : urlPath.slice(1)));
        if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
        const body = await readFile(file);
        res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
        res.end(body);
    } catch {
        res.writeHead(404);
        res.end();
    }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

let passed = 0;
async function step(name, fn) {
    await fn();
    passed++;
    console.log(`✓ ${name}`);
}

// CHROMIUM_PATH يسمح باستخدام Chromium مثبت مسبقاً بدل تنزيل نسخة Playwright
const browser = await chromium.launch({
    args: ['--no-sandbox'],
    executablePath: process.env.CHROMIUM_PATH || undefined
});
try {
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);

    await step('الفتح: الرئيسية تعرض عدّاد أسئلة غير صفري', async () => {
        await page.goto(base + '/');
        await page.waitForFunction(() =>
            Number(document.getElementById('totalQuestions').textContent) > 0);
    });

    await step('التنقّل: صفحة القسم اللفظي تُفعَّل من شريط التنقل', async () => {
        await page.click('.nav-link[data-page="verbal"]');
        await page.waitForSelector('#page-verbal.active');
    });

    await step('التدريب: بدء فئة التناظر يعرض سؤالاً بأربعة خيارات', async () => {
        await page.click('#page-verbal [data-action="practice"][data-subcategory="analogy"]');
        await page.waitForSelector('#page-practice.active');
        await page.waitForFunction(() =>
            document.querySelectorAll('#questionContainer .option').length === 4);
    });

    await step('الإجابة: اختيار خيار يكشف الإجابة الصحيحة والشرح', async () => {
        await page.click('#questionContainer .option');
        await page.waitForSelector('#questionContainer .option.correct');
        await page.waitForSelector('#explanationBox.show');
    });

    await step('الاستئناف: تحديث الصفحة يعرض حوار الاستئناف ويعيد الجلسة بحالتها', async () => {
        await page.reload();
        await page.waitForSelector('#confirmModal.show');
        await page.click('#confirmOkBtn');
        await page.waitForSelector('#page-practice.active');
        // الإجابة المكشوفة قبل التحديث ما زالت مكشوفة بعد الاستئناف
        await page.waitForSelector('#questionContainer .option.correct');
    });

    await step('الرجوع: زر العودة يخرج من التدريب إلى صفحة القسم', async () => {
        await page.click('#practiceBackBtn');
        await page.waitForSelector('#page-verbal.active');
        await page.click('.nav-link[data-page="home"]');
        await page.waitForSelector('#page-home.active');
    });

    await step('التحدي اليومي: خمسة أسئلة تنتهي بشاشة النتيجة', async () => {
        await page.click('[data-action="start-daily"]');
        await page.waitForSelector('#page-practice.active');
        for (let i = 0; i < 5; i++) {
            await page.waitForFunction(() =>
                document.querySelectorAll('#questionContainer .option').length === 4);
            await page.click('#questionContainer .option');
            await page.waitForSelector('#questionContainer .option.selected');
            if (i < 4) await page.click('#nextBtn');
            else await page.click('#finishBtn:not(.is-hidden)');
        }
        await page.waitForSelector('#page-results.active');
        const score = await page.textContent('.results-score .score-value');
        if (!/^\d+%$/.test(score.trim())) throw new Error(`نتيجة غير متوقعة: «${score}»`);
    });

    console.log(`\n✓ نجحت كل خطوات اختبار التكامل (${passed})`);
} catch (err) {
    console.error(`\n❌ فشل اختبار التكامل بعد ${passed} خطوة ناجحة:`);
    console.error(err);
    process.exitCode = 1;
} finally {
    await browser.close();
    server.close();
}

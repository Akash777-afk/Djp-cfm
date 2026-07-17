const { chromium } = require('playwright');
const base = 'C:/Users/Admin/AppData/Local/Temp/claude/c--Users-Admin-Desktop-The-DJP/e81cf416-d3a9-413e-baa4-d6e34dc7499b/scratchpad/';

(async () => {
  const browser = await chromium.launch();

  for (const [path, name] of [['/change-management', 'cm'], ['/incident-management', 'im']]) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });
    const errors = [];
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });
    await page.goto(`http://localhost:4300${path}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.sidebar-nav', { timeout: 10000 });
    await page.screenshot({ path: base + `visual-${name}-full.png` });
    console.log(name, 'ERRORS:', JSON.stringify(errors));
    await page.close();
  }

  await browser.close();
})();

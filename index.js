const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    'https://www.perucompras.gob.pe/contrataciones/contrataciones-emergencia-covid19.php'
  );

  browser.close();
})();

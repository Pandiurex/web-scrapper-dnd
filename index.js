import puppeteer from "puppeteer";
import fs from "fs"

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(60000);
  await page.setDefaultTimeout(60000);

  await page.goto("https://www.aidedd.org/dnd-filters/spells-5e.php", {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector('input[type="checkbox"]');


  const checkboxes = await page.$$('input[type="checkbox"]');


  for (const checkbox of checkboxes) {
    const isChecked = await page.evaluate(el => el.checked, checkbox);
    if (!isChecked) {
      await page.evaluate(el => el.click(), checkbox);
    }
  }
  await delay(5000);

  await page.waitForSelector('table', {  timeout: 10000, visible: true });

  const tableData = await page.evaluate(() => {
    const table = document.querySelector('table');
    const rows = table.querySelectorAll('tr');
    const data = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      const rowData = [];
      cells.forEach(cell => rowData.push(cell.innerText.trim()));
      data.push(rowData);
    });

    return data;
  });

  const csvContent = tableData.map(row => row.join('|')).join('\n');

  fs.writeFileSync('tableData.csv', csvContent);

  console.log('Datos guardados en tableData.csv');

  await browser.close();
})();

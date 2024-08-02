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

  let i = 1;
  const finalData = [];
  while(i<14){

  
  await page.goto(`https://nivel20.com/games/el-resurgir-del-dragon/spells?page=${i}`, {
    waitUntil: "domcontentloaded",
  });

  // await page.waitForSelector('table', {  timeout: 10000, visible: true });

  await delay(3000);

  const data = await page.evaluate(() => {
    const list = document.querySelector('.resizable-row');

    const rows = list.querySelectorAll('a');
    const data = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll('.spell-row-content');
      const rowData = [];
      cells.forEach(cell => {
        var textarea = cell.innerText.replace(/(\r\n|\n|\r)/gm, "|")
        rowData.push(textarea)
      
      }
      );
      data.push(rowData);

    })
    return data
  })

finalData.push(data);
  // const tableData = await page.evaluate(() => {
  //   const table = document.querySelector('#tablepress-listaconjuros');
  //   const rows = table.querySelectorAll('tbody');
  //   const data = [];

  //   console.log(table)
  //   console.log(rows)
  //   rows.forEach(row => {
  //     const cells = row.querySelectorAll('tr');
  //     const rowData = [];
  //     cells.forEach(cell => rowData.push(cell.innerText.trim()));
  //     data.push(rowData);
  //   });

  //   return data;
  // });

  

  i++;
}

const csvContent = finalData.map(row => row.join('<<')).join('\n');
const fileName = 'Spells_Nivel20_resurgir_dragon.csv'

  fs.writeFileSync(fileName, csvContent);

  console.log(`Datos guardados en ${fileName}`);

  await browser.close();
})();

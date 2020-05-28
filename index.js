const _ = require('lodash');
const { ExportToCsv } = require('export-to-csv');
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(
      'https://app.powerbi.com/view?r=eyJrIjoiNjJkMmYyMWMtOTI2NC00OTliLWFiNDUtODdiYmVhNmVkOTc2IiwidCI6ImVkMDkxNTIxLTI5YjQtNDZhNC1iNzcwLTczOWI1MWU4MGI0MyIsImMiOjR9',
      { waitUntil: 'networkidle2', timeout: 30000 }
    );
    await page.waitForSelector('.bodyCells');

    const dataTable = await page.evaluate(() =>
      Array.from(
        document
          .querySelectorAll('.bodyCells')[0]
          .querySelectorAll('.cell-interactive'),
        (el) => el.title
      )
    );

    const numberOfChunks = dataTable.length / 6;
    const columns = _.chunk(dataTable, numberOfChunks);
    const data = [];
    for (let i = 0; i < numberOfChunks; i += 1) {
      data.push({
        requirementsPDF: columns[0][i],
        object: columns[1][i],
        itemName: columns[2][i],
        invitedSupliersNumber: columns[3][i],
        quoteSupliersNumber: columns[4][i],
      });
    }

    const csvExporter = new ExportToCsv();
    const csvData = csvExporter.generateCsv(data, true);
    fs.writeFileSync('output.csv', csvData);
  } catch (e) {
    console.log(e);
  } finally {
    browser.close();
  }
})();

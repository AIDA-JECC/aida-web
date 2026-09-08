import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const filesToDump = [
  { path: 'D:\\AIDA\\public\\publications details complete\\Student publications\\20-24\\MiniProject_IEEE paper.xlsx', batch: '2020–24' },
  { path: 'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\Conference Paper Status.xlsx', batch: '2021–25' },
  { path: 'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\Miniproject_ConferencePaper.xlsx', batch: '2021–25' },
  { path: 'D:\\AIDA\\public\\publications details complete\\Student publications\\22-26\\Conference_Miniproject.xlsx', batch: '2022–26' },
  { path: 'D:\\AIDA\\public\\publications details complete\\Student publications\\Student Publications.xlsx', batch: '2021–25' },
];

filesToDump.forEach(({ path: filePath, batch }) => {
  console.log('\n======================================================');
  console.log(`FILE (${batch}):`, filePath);
  if (!fs.existsSync(filePath)) {
    console.log('NOT FOUND!');
    return;
  }
  const wb = XLSX.readFile(filePath);
  wb.SheetNames.forEach(sheet => {
    console.log(`\n--- Sheet: ${sheet} ---`);
    const json = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
    console.log(`Count: ${json.length} rows`);
    json.forEach((r, i) => {
      console.log(`Row [${i}]:`, JSON.stringify(r));
    });
  });
});

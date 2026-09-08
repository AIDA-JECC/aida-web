import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

function inspectFile(filePath) {
  console.log('\n=======================================');
  console.log('FILE:', filePath);
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist!');
    return;
  }
  const wb = XLSX.readFile(filePath);
  wb.SheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const sheet = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`Total rows: ${data.length}`);
    if (data.length > 0) {
      console.log('Sample row 0:', JSON.stringify(data[0], null, 2));
      if (data.length > 1) console.log('Sample row 1:', JSON.stringify(data[1], null, 2));
    }
  });
}

const files = [
  'D:\\AIDA\\public\\publications details complete\\Student publications\\20-24\\MiniProject_IEEE paper.xlsx',
  'D:\\AIDA\\public\\publications details complete\\Student publications\\20-24\\ProjectGroups.xlsx',
  'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\ADD416 - Project Phase 2 evaluation Sheet .xlsx',
  'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\Conference Paper Status.xlsx',
  'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\MiNi Project groups.xlsx',
  'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\Miniproject_ConferencePaper.xlsx',
  'D:\\AIDA\\public\\publications details complete\\Student publications\\22-26\\Conference_Miniproject.xlsx',
  'D:\\AIDA\\public\\publications details complete\\Student publications\\22-26\\Guide & Title.xlsx',
  'D:\\AIDA\\public\\publications details complete\\Student publications\\22-26\\Mini Project Marks_2022 Admn.xlsx',
  'D:\\AIDA\\public\\publications details complete\\Student publications\\Student Publications.xlsx'
];

files.forEach(inspectFile);

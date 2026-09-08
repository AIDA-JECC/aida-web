import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const baseDir = 'D:\\AIDA\\public\\publications details complete\\Student publications';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (f.endsWith('.xlsx') || f.endsWith('.xls')) {
      console.log('\n=======================================');
      console.log('FILE:', fullPath);
      try {
        const wb = XLSX.readFile(fullPath);
        console.log('SHEETS:', wb.SheetNames);
        wb.SheetNames.forEach(sheetName => {
          const sheet = wb.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet);
          console.log(`  --- Sheet [${sheetName}]: ${json.length} rows ---`);
          if (json.length > 0) {
            console.log('  Keys/Columns:', Object.keys(json[0]));
            console.log('  Sample row 1:', json[0]);
          }
        });
      } catch (err) {
        console.error('Error reading file:', err.message);
      }
    }
  }
}

scanDir(baseDir);

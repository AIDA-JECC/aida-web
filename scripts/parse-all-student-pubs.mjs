import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const baseDir = 'D:\\AIDA\\public\\publications details complete\\Student publications';

function dumpAllFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      dumpAllFiles(fullPath);
    } else if (f.endsWith('.xlsx') || f.endsWith('.xls')) {
      console.log('\n=======================================');
      console.log('FILE:', fullPath);
      try {
        const wb = XLSX.readFile(fullPath);
        wb.SheetNames.forEach(sheetName => {
          const sheet = wb.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          console.log(`\n--- Sheet [${sheetName}] --- (${json.length} rows)`);
          json.slice(0, 15).forEach((r, idx) => {
            console.log(`Row ${idx}:`, JSON.stringify(r));
          });
        });
      } catch (err) {
        console.error('Error reading file:', err.message);
      }
    }
  }
}

dumpAllFiles(baseDir);

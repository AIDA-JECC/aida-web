import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const baseDir = 'D:\\AIDA\\public\\publications details complete\\Student publications';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (file.endsWith('.xlsx') || file.endsWith('.xls')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk(baseDir);

files.forEach((fullPath, idx) => {
  console.log(`\n======================================================`);
  console.log(`FILE ${idx + 1}: ${path.relative(baseDir, fullPath)}`);
  console.log(`FULL PATH: ${fullPath}`);
  console.log(`======================================================`);

  try {
    const wb = XLSX.readFile(fullPath);
    console.log('SHEETS:', wb.SheetNames);
    wb.SheetNames.forEach((sheetName) => {
      const sheet = wb.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      console.log(`  --- Sheet [${sheetName}]: ${json.length} rows ---`);
      if (json.length > 0) {
        console.log('  Keys/Columns:', Object.keys(json[0]));
        console.log('  Sample Row 0:', JSON.stringify(json[0]));
        if (json.length > 1) {
          console.log('  Sample Row 1:', JSON.stringify(json[1]));
        }
      }
    });
  } catch (err) {
    console.error('Error reading file:', err.message);
  }
});

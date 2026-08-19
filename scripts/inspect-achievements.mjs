import XLSX from 'xlsx';
import fs from 'fs';

const wb = XLSX.readFile('./public/achievements_webp.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

const filesInDir = fs.readdirSync('./public/achievements');
const dirFilesMap = new Map();

filesInDir.forEach(f => {
  // Store exact filename
  dirFilesMap.set(f.toLowerCase(), f);
  // Also store without ' (1)' if present
  const normalized = f.replace(/\s*\(\d+\)\.webp$/i, '.webp').toLowerCase();
  if (!dirFilesMap.has(normalized)) {
    dirFilesMap.set(normalized, f);
  }
});

let matchedCount = 0;
let missingCount = 0;
const missing = [];

rows.forEach((row, i) => {
  const rawImg = row.achievements_images ? String(row.achievements_images).trim() : '';
  const key = rawImg.toLowerCase();
  
  if (key && dirFilesMap.has(key)) {
    matchedCount++;
  } else {
    // Try base name without extension matching
    const baseName = key.replace(/\.webp$/i, '');
    const foundFile = filesInDir.find(f => f.toLowerCase().includes(baseName) || baseName.includes(f.toLowerCase().replace(/\.webp$/i, '')));
    if (foundFile) {
      matchedCount++;
    } else {
      missingCount++;
      missing.push({ row: i + 1, rawImg, student: row['Student Name :'], driveUrl: row['Upload Certificate / Proof / Image Upload  '] });
    }
  }
});

console.log(`Matched: ${matchedCount}, Missing: ${missingCount}`);
if (missing.length > 0) {
  console.log('Sample missing:', missing.slice(0, 10));
}

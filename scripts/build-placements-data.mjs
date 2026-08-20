import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Helper to extract clean domain string from URL (e.g., https://www.tcs.com/ -> tcs.com)
function extractCleanDomain(url) {
  if (!url || typeof url !== 'string') return '';
  let clean = url.trim();
  clean = clean.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  clean = clean.split('/')[0].split('?')[0];
  return clean.toLowerCase();
}

// Check for local student photos if user places them in public/placements or public/students later
const placementsDir = './public/placements';
const studentsDir = './public/students';

const placementFiles = fs.existsSync(placementsDir) ? fs.readdirSync(placementsDir) : [];
const studentFiles = fs.existsSync(studentsDir) ? fs.readdirSync(studentsDir) : [];

function findLocalStudentImage(studentName, slNo) {
  const nameLower = studentName ? studentName.toLowerCase().trim() : '';
  if (!nameLower) return null;

  // 1. Check in public/placements
  let match = placementFiles.find(f => {
    const fl = f.toLowerCase();
    return fl.includes(nameLower) || (slNo && fl.startsWith(`${slNo}_`));
  });
  if (match) return `/placements/${encodeURIComponent(match)}`;

  // 2. Check in public/students
  match = studentFiles.find(f => {
    const fl = f.toLowerCase();
    return fl.includes(nameLower) || (slNo && fl.startsWith(`${slNo}_`));
  });
  if (match) return `/students/${encodeURIComponent(match)}`;

  return null;
}

// Read public/placements.xlsx
const excelPath = './public/placements.xlsx';
if (!fs.existsSync(excelPath)) {
  console.error(`Error: Excel file not found at ${excelPath}`);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawRows = XLSX.utils.sheet_to_json(sheet);

console.log(`Processing ${rawRows.length} placements from Excel...`);

const normalizedPlacements = rawRows.map((row, index) => {
  const studentName = String(row['Name'] || 'Student').trim();
  const companyName = String(row['Company Name'] || 'Company').trim();
  const designation = String(row['Designation'] || 'Employee').trim();
  const year = row['Year'] ? String(row['Year']).trim() : '2026';
  const companyWebsite = String(row['Company Website'] || '').trim();
  const logoUrl = String(row['Logo URL'] || '').trim();
  const slNo = row['SL.No'] || (index + 1);

  const cleanDomain = extractCleanDomain(companyWebsite);
  const studentImage = findLocalStudentImage(studentName, slNo);

  return {
    id: `placement-${index + 1}`,
    slNo,
    studentName,
    companyName,
    designation,
    year,
    status: 'Placed',
    sourceUrl: String(row['Source URL'] || '').trim() || null,
    companyWebsite: companyWebsite || null,
    cleanDomain: cleanDomain || 'website.com',
    logoUrl: logoUrl || null,
    studentImage,
  };
});

const code = `// Auto-generated from placements.xlsx
export const placementsData = ${JSON.stringify(normalizedPlacements, null, 2)};
`;

const outputPath = './src/data/placementsData.js';
fs.writeFileSync(outputPath, code, 'utf-8');
console.log(`Successfully generated ${outputPath} with ${normalizedPlacements.length} records!`);

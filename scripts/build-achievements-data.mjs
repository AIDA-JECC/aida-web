import XLSX from 'xlsx';
import fs from 'fs';

// Helper to format Google Drive link to direct CDN URL
function parseGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) || trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return null;
}

// Read public/achievements directory
const achievementsDir = './public/achievements';
const filesInDir = fs.readdirSync(achievementsDir);

// Build lookup map for filenames
const fileLookupMap = new Map();
filesInDir.forEach(filename => {
  fileLookupMap.set(filename.toLowerCase(), filename);
  // Also store normalized version (removing ' (1)' or ' (2)' before .webp)
  const norm = filename.replace(/\s*\(\d+\)\.webp$/i, '.webp').toLowerCase();
  if (!fileLookupMap.has(norm)) {
    fileLookupMap.set(norm, filename);
  }
  // Store without single quote variations
  const noQuote = norm.replace(/'/g, '_');
  if (!fileLookupMap.has(noQuote)) {
    fileLookupMap.set(noQuote, filename);
  }
});

function resolveImageSrc(excelImgName, driveUrl) {
  if (excelImgName && typeof excelImgName === 'string') {
    const raw = excelImgName.trim();
    const key = raw.toLowerCase();
    
    // 1. Direct key match
    if (fileLookupMap.has(key)) {
      return `/achievements/${encodeURIComponent(fileLookupMap.get(key))}`;
    }
    
    // 2. Normalized key match
    const normKey = key.replace(/'/g, '_');
    if (fileLookupMap.has(normKey)) {
      return `/achievements/${encodeURIComponent(fileLookupMap.get(normKey))}`;
    }

    // 3. Partial filename matching
    const baseName = key.replace(/\.webp$/i, '').replace(/\.0$/i, '');
    for (let f of filesInDir) {
      const fBase = f.toLowerCase().replace(/\.webp$/i, '').replace(/\s*\(\d+\)$/i, '');
      if (fBase.includes(baseName) || baseName.includes(fBase)) {
        return `/achievements/${encodeURIComponent(f)}`;
      }
    }
  }

  // Fallback to Drive URL if available
  const parsedDrive = parseGoogleDriveUrl(driveUrl);
  if (parsedDrive) return parsedDrive;

  return '/achievements/default-certificate.webp';
}

function normalizeTag(tagRaw) {
  if (!tagRaw) return 'Academic Achievement';
  const str = String(tagRaw).trim();
  if (str.toLowerCase().includes('hackathon')) return 'Hackathons';
  if (str.toLowerCase().includes('extra')) return 'Extracurricular';
  return 'Academic Achievement';
}

function normalizeSemester(semRaw) {
  if (!semRaw) return 'Semester 1';
  const str = String(semRaw).trim();
  if (str.startsWith('Semester')) return str;
  return `Semester ${str}`;
}

const workbook = XLSX.readFile('./public/achievements_webp.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawRows = XLSX.utils.sheet_to_json(sheet);

console.log(`Processing ${rawRows.length} achievements from Excel...`);

const normalizedAchievements = rawRows.map((row, index) => {
  const studentName = String(row['Student Name :'] || row['Student Name'] || 'AIDA Student').trim();
  const registerNumber = String(row['Register Number:'] || row['Register Number'] || '').trim();
  const email = String(row['Email Address'] || '').trim();
  const semester = normalizeSemester(row['Semester of Achievement ']);
  const title = String(row['Achievement / Award Name  '] || row['Achievement / Award Name'] || 'Achievement Award').trim();
  const description = String(row['Description'] || '').trim();
  const level = String(row['Achievement  Level:'] || row['Achievement Level'] || 'Achievement').trim();
  const year = row['Date/Year of Achievement'] ? String(row['Date/Year of Achievement']).trim() : '2026';
  const tag = normalizeTag(row['tags']);
  
  const excelImg = row['achievements_images'];
  const driveUrl = row['Upload Certificate / Proof / Image Upload  '];
  const image = resolveImageSrc(excelImg, driveUrl);

  return {
    id: `achievement-${index + 1}`,
    studentName,
    registerNumber,
    email,
    semester,
    title,
    description,
    level,
    year,
    tag,
    image,
  };
});

const code = `// Auto-generated from achievements_webp.xlsx
export const achievementsData = ${JSON.stringify(normalizedAchievements, null, 2)};
`;

fs.writeFileSync('./src/data/achievementsData.js', code, 'utf-8');
console.log(`Successfully generated src/data/achievementsData.js with ${normalizedAchievements.length} achievements!`);

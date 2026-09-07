import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

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

function clean(str) {
  if (!str) return '';
  return String(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getWords(str) {
  if (!str) return [];
  return String(str).toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 0);
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
  const numMatch = str.match(/\d+/);
  if (numMatch) return `Semester ${numMatch[0]}`;
  if (str.startsWith('Semester')) return str;
  return `Semester ${str}`;
}

function parseSemesterNumber(semStr) {
  if (!semStr) return 0;
  const match = String(semStr).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// 1. Locate paths
const excelPath = fs.existsSync('./public/all acheivements.xlsx')
  ? './public/all acheivements.xlsx'
  : './public/achievements_webp.xlsx';

const orientedImagesDir = './public/all acheivements/oriented_images';
const targetAchievementsDir = './public/achievements';

if (!fs.existsSync(targetAchievementsDir)) {
  fs.mkdirSync(targetAchievementsDir, { recursive: true });
}

// 2. Collect image files from oriented_images and copy/sync to targetAchievementsDir
let imageFiles = [];
if (fs.existsSync(orientedImagesDir)) {
  const allInDir = fs.readdirSync(orientedImagesDir);
  imageFiles = allInDir.filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));
  
  console.log(`Copying/syncing ${imageFiles.length} images from ${orientedImagesDir} to ${targetAchievementsDir}...`);
  imageFiles.forEach(f => {
    const srcFile = path.join(orientedImagesDir, f);
    const destFile = path.join(targetAchievementsDir, f);
    if (!fs.existsSync(destFile)) {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

// 3. Read Excel workbook
const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawRows = XLSX.utils.sheet_to_json(sheet);

console.log(`Processing ${rawRows.length} achievement rows from ${excelPath}...`);

// 4. Map images to rows using student token matching + title similarity matrix
const rowsWithDrive = [];
const rowsWithoutDrive = [];

rawRows.forEach((row, idx) => {
  const driveUrl = row['Upload Certificate / Proof / Image Upload'] || row['Upload Certificate / Proof / Image Upload  '];
  const student = String(row['Student Name :'] || row['Student Name'] || '').trim();
  const title = String(row['Achievement / Award Name'] || row['Achievement / Award Name  '] || '').trim();
  
  const item = { idx, student, title, row, driveUrl: driveUrl ? String(driveUrl).trim() : '' };
  if (item.driveUrl) {
    rowsWithDrive.push(item);
  } else {
    rowsWithoutDrive.push(item);
  }
});

// Group images by student
const imagesByStudent = new Map();
imageFiles.forEach(img => {
  let bestStudentKey = null;
  let maxScore = -1;

  rawRows.forEach(r => {
    const student = String(r['Student Name :'] || r['Student Name'] || '').trim();
    if (!student) return;
    const studWords = getWords(student);
    const imgWords = getWords(img);

    // Check if image filename starts with exact student words
    let startsWithStudent = true;
    for (let i = 0; i < studWords.length; i++) {
      if (i >= imgWords.length || imgWords[i] !== studWords[i]) {
        startsWithStudent = false;
        break;
      }
    }

    if (startsWithStudent) {
      const score = studWords.join('').length * 10;
      if (score > maxScore) {
        maxScore = score;
        bestStudentKey = clean(student);
      }
    }
  });

  if (!bestStudentKey) {
    rawRows.forEach(r => {
      const student = String(r['Student Name :'] || r['Student Name'] || '').trim();
      const cleanStud = clean(student);
      const cleanImg = clean(img);
      if (cleanStud && cleanImg.includes(cleanStud)) {
        if (cleanStud.length > maxScore) {
          maxScore = cleanStud.length;
          bestStudentKey = cleanStud;
        }
      }
    });
  }

  if (!bestStudentKey) {
    bestStudentKey = 'UNKNOWN';
  }

  if (!imagesByStudent.has(bestStudentKey)) {
    imagesByStudent.set(bestStudentKey, []);
  }
  imagesByStudent.get(bestStudentKey).push(img);
});

// Perform bipartite matching per student
const rowToImageMap = new Map();
const rowsByStudentKey = new Map();
rowsWithDrive.forEach(r => {
  const key = clean(r.student);
  if (!rowsByStudentKey.has(key)) {
    rowsByStudentKey.set(key, []);
  }
  rowsByStudentKey.get(key).push(r);
});

rowsByStudentKey.forEach((studentRows, studKey) => {
  const studImages = imagesByStudent.get(studKey) || [];
  if (studImages.length === 0) return;

  const matrix = studentRows.map(r => {
    const titleWords = getWords(r.title);
    return studImages.map(img => {
      const cleanImg = clean(img);
      let score = 0;
      titleWords.forEach(w => {
        if (w.length > 1 && cleanImg.includes(w)) score += w.length;
      });
      return score;
    });
  });

  const usedImgIndices = new Set();
  studentRows.forEach((r, rIdx) => {
    let bestIdx = -1;
    let maxVal = -1;
    studImages.forEach((img, iIdx) => {
      if (usedImgIndices.has(iIdx)) return;
      if (matrix[rIdx][iIdx] > maxVal) {
        maxVal = matrix[rIdx][iIdx];
        bestIdx = iIdx;
      }
    });

    if (bestIdx === -1) {
      bestIdx = studImages.findIndex((_, i) => !usedImgIndices.has(i));
    }

    if (bestIdx !== -1) {
      usedImgIndices.add(bestIdx);
      rowToImageMap.set(r.idx, studImages[bestIdx]);
    }
  });
});

console.log(`Successfully mapped ${rowToImageMap.size} records to specific uploaded certificate images!`);

// 5. Construct normalized achievement objects
const normalizedAchievements = rawRows.map((row, index) => {
  const studentName = String(row['Student Name :'] || row['Student Name'] || 'AIDA Student').trim();
  const registerNumber = String(row['Register Number:'] || row['Register Number'] || '').trim();
  const email = String(row['Email Address'] || '').trim();
  const semester = normalizeSemester(row['Semester of Achievement'] || row['Semester of Achievement ']);
  const title = String(row['Achievement / Award Name'] || row['Achievement / Award Name  '] || 'Achievement Award').trim();
  const description = String(row['Description'] || '').trim();
  const level = String(row['Achievement Level:'] || row['Achievement Level'] || 'Achievement').trim();
  const year = row['Date/Year of Achievement'] ? String(row['Date/Year of Achievement']).trim() : '2026';
  const tag = normalizeTag(row['Type'] || row['tags']);
  
  const mappedImageFilename = rowToImageMap.get(index);
  const hasLocalImage = Boolean(mappedImageFilename);
  let image = '/achievements/default-certificate.webp';

  if (mappedImageFilename) {
    image = `/achievements/${encodeURIComponent(mappedImageFilename)}`;
  } else {
    const driveUrl = row['Upload Certificate / Proof / Image Upload'] || row['Upload Certificate / Proof / Image Upload  '];
    const parsedDrive = parseGoogleDriveUrl(driveUrl);
    if (parsedDrive) {
      image = parsedDrive;
    }
  }

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
    hasLocalImage,
  };
});

// Round-robin student interleaving algorithm so no consecutive entries share the same student
function mixAndInterleaveStudents(records) {
  if (!records || records.length <= 1) return records;

  const yearMap = new Map();
  records.forEach(r => {
    const yr = String(r.year || '2026');
    if (!yearMap.has(yr)) yearMap.set(yr, []);
    yearMap.get(yr).push(r);
  });

  const result = [];

  for (const [yr, yrRecords] of yearMap.entries()) {
    const studentBuckets = new Map();
    yrRecords.forEach(r => {
      const key = String(r.registerNumber || r.studentName || '').toLowerCase().trim();
      if (!studentBuckets.has(key)) studentBuckets.set(key, []);
      studentBuckets.get(key).push(r);
    });

    const keys = Array.from(studentBuckets.keys());
    let addedCount = 0;
    const totalInYear = yrRecords.length;

    while (addedCount < totalInYear) {
      let progressThisRound = false;
      for (const k of keys) {
        const bucket = studentBuckets.get(k);
        if (bucket && bucket.length > 0) {
          result.push(bucket.shift());
          addedCount++;
          progressThisRound = true;
        }
      }
      if (!progressThisRound) break;
    }
  }

  return result;
}

// 6. Separate achievements into records WITH local image vs WITHOUT local image
const sortFn = (a, b) => {
  const yrA = parseInt(a.year, 10) || 0;
  const yrB = parseInt(b.year, 10) || 0;
  if (yrB !== yrA) return yrB - yrA;

  const semA = parseSemesterNumber(a.semester);
  const semB = parseSemesterNumber(b.semester);
  if (semB !== semA) return semB - semA;

  const idA = parseInt(a.id.replace('achievement-', ''), 10) || 0;
  const idB = parseInt(b.id.replace('achievement-', ''), 10) || 0;
  return idA - idB;
};

let withImages = normalizedAchievements.filter(item => item.hasLocalImage);
let withoutImages = normalizedAchievements.filter(item => !item.hasLocalImage);

withImages.sort(sortFn);
withoutImages.sort(sortFn);

withImages = mixAndInterleaveStudents(withImages);
withoutImages = mixAndInterleaveStudents(withoutImages);

// Remove temporary internal property before export
withImages.forEach(item => delete item.hasLocalImage);
withoutImages.forEach(item => delete item.hasLocalImage);

const mid = Math.floor(withImages.length / 2);
const finalAchievements = [
  ...withImages.slice(0, mid),
  ...withoutImages,
  ...withImages.slice(mid),
];

console.log(`Placed ${withoutImages.length} achievements without local images at center position (indices ${mid} to ${mid + withoutImages.length - 1}) out of ${finalAchievements.length} total records.`);

const code = `// Auto-generated from all acheivements.xlsx
export const achievementsData = ${JSON.stringify(finalAchievements, null, 2)};
`;

fs.writeFileSync('./src/data/achievementsData.js', code, 'utf-8');
console.log(`Successfully generated src/data/achievementsData.js with ${finalAchievements.length} achievements!`);


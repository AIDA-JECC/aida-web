import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Helper to normalize faculty/person name
function normalizeName(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/^(dr|prof|mr|mrs|ms|er)\.?\s*/i, '')
    .replace(/[^a-z0-9]/g, '');
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/^(dr|prof|mr|mrs|ms|er)\.?\s*/i, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Convert Excel Serial Date or Date string to DD-MM-YYYY or Year string
function formatDate(val) {
  if (!val) return '';
  if (typeof val === 'number') {
    const date = XLSX.SSF.parse_date_code(val);
    if (date) {
      const dd = String(date.d).padStart(2, '0');
      const mm = String(date.m).padStart(2, '0');
      const yyyy = date.y;
      return `${dd}-${mm}-${yyyy}`;
    }
  }
  return String(val).trim();
}

// Format DOI to clickable link
function formatDoiUrl(doi, rawLink) {
  if (rawLink && (rawLink.startsWith('http://') || rawLink.startsWith('https://'))) {
    return rawLink;
  }
  if (!doi || doi === 'Publication Link' || doi === 'DOI') {
    if (rawLink && (rawLink.startsWith('http://') || rawLink.startsWith('https://'))) {
      return rawLink;
    }
    return null;
  }
  const cleanDoi = String(doi).trim();
  if (cleanDoi.startsWith('http://') || cleanDoi.startsWith('https://')) {
    return cleanDoi;
  }
  if (cleanDoi.startsWith('10.')) {
    return `https://doi.org/${cleanDoi}`;
  }
  return null;
}

// Round-robin student interleaving algorithm
function mixAndInterleaveStudents(records, getStudentKeyFn) {
  if (!records || records.length <= 1) return records;

  const yearMap = new Map();
  records.forEach(r => {
    const yr = String(r.batch || r.year || '2025');
    if (!yearMap.has(yr)) yearMap.set(yr, []);
    yearMap.get(yr).push(r);
  });

  const result = [];

  for (const [yr, yrRecords] of yearMap.entries()) {
    const studentBuckets = new Map();
    yrRecords.forEach(r => {
      const key = getStudentKeyFn(r) || 'unknown';
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

// Read faculty list to resolve image paths and slugs
let facultyList = [];
try {
  const facultyFilePath = './src/data/facultyData.js';
  if (fs.existsSync(facultyFilePath)) {
    const fileContent = fs.readFileSync(facultyFilePath, 'utf-8');
    // Extract array using regex or simple evaluation
    const jsonMatch = fileContent.match(/export const facultyData = (\[[\s\S]*?\]);/);
    if (jsonMatch) {
      // Evaluate minimal object literal safely
      facultyList = Function(`"use strict"; return (${jsonMatch[1]})`)();
    }
  }
} catch (err) {
  console.warn('Could not read facultyData.js for image mapping:', err.message);
}

// 1. Process Staff Publications
const staffFilePath = 'C:\\Users\\dell\\Downloads\\staff publications.xlsx';
let rawStaffRows = [];
if (fs.existsSync(staffFilePath)) {
  const wb = XLSX.readFile(staffFilePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  rawStaffRows = XLSX.utils.sheet_to_json(sheet);
} else {
  console.error(`Staff publications file not found at ${staffFilePath}`);
}

console.log(`Loaded ${rawStaffRows.length} staff publication records.`);

const staffPublications = rawStaffRows
  .filter(row => row['Paper Title'])
  .map((row, index) => {
    const rawFacultyName = String(
      row['Name of the Faculty '] || row['Name of the Faculty'] || row['Faculty Name'] || ''
    ).trim();

    const paperTitle = String(row['Paper Title'] || '').trim();
    const publicationType = String(row['Publication Type'] || 'Journal').trim();
    const venue = String(
      row['Name  of Journal /Conference '] || row['Name of Journal/Conference'] || row['Journal/Conference'] || ''
    ).trim();
    const indexing = String(row['Indexing'] || 'Scopus').trim();
    const publisher = String(row['Publisher'] || '').trim();
    const dateStr = formatDate(row['Date of Publication']);
    const doi = String(row['DOI'] || '').trim();
    const doiUrl = formatDoiUrl(doi, row['Publication Link']);

    // Match with faculty list for image and slug
    const normRaw = normalizeName(rawFacultyName);
    const matchedFaculty = facultyList.find(f => {
      const normF = normalizeName(f.name);
      return normF === normRaw || normRaw.includes(normF) || normF.includes(normRaw);
    });

    const facultySlug = matchedFaculty ? matchedFaculty.slug : slugify(rawFacultyName);
    const facultyImage = matchedFaculty ? matchedFaculty.img : null;
    const facultyName = matchedFaculty ? matchedFaculty.name : rawFacultyName;
    const initials = matchedFaculty
      ? matchedFaculty.initials
      : rawFacultyName.replace(/^(Dr|Prof|Mr|Mrs|Ms|Er)\.?\s*/i, '').slice(0, 2).toUpperCase();

    // Extract year for sorting
    let year = '2025';
    const yearMatch = dateStr.match(/\b(20\d\d)\b/);
    if (yearMatch) {
      year = yearMatch[1];
    }

    return {
      id: `staff-pub-${index + 1}`,
      facultyName,
      rawFacultyName,
      facultySlug,
      facultyImage,
      initials,
      paperTitle,
      publicationType,
      venue,
      indexing,
      publisher,
      date: dateStr || year,
      year,
      doi: doi !== 'Publication Link' && doi !== 'DOI' ? doi : null,
      doiUrl,
    };
  });

// Sort staff publications latest year first
staffPublications.sort((a, b) => {
  const yrA = parseInt(a.year, 10) || 0;
  const yrB = parseInt(b.year, 10) || 0;
  return yrB - yrA;
});

// 2. Process Student Publications
const studentFilePath = 'C:\\Users\\dell\\Downloads\\Student Publications.xlsx';
let rawStudentRows = [];
if (fs.existsSync(studentFilePath)) {
  const wb = XLSX.readFile(studentFilePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  rawStudentRows = XLSX.utils.sheet_to_json(sheet);
} else {
  console.error(`Student publications file not found at ${studentFilePath}`);
}

console.log(`Loaded ${rawStudentRows.length} raw student publication records.`);

const rawStudentPublications = rawStudentRows
  .filter(row => row['Paper Title'] && String(row['Paper Title']).trim() !== 'undefined')
  .map((row, index) => {
    const slNo = row['Sl. No.'] || index + 1;
    const batch = String(row['Batch Year'] || '2021–25').trim();
    const projectType = String(row['Project Type'] || 'Main Project').trim();
    const paperTitle = String(row['Paper Title'] || '').trim();
    const guide = String(row['Guide'] || '').trim();
    const conference = String(row['Conference Name'] || row['Conference Short Name'] || '').trim();
    const publicationDate = formatDate(row['Publication Date']);
    const doi = String(row['DOI'] || '').trim();
    const rawLink = String(row['Publication Link'] || '').trim();
    const doiUrl = formatDoiUrl(doi, rawLink);

    // Split authors & register numbers by semicolon
    const authorsRaw = String(row['Authors'] || '').trim();
    const regNosRaw = String(row['Register No.'] || '').trim();

    const authors = authorsRaw
      ? authorsRaw.split(';').map(a => a.trim()).filter(Boolean)
      : [];
    const registerNumbers = regNosRaw
      ? regNosRaw.split(';').map(r => r.trim()).filter(Boolean)
      : [];

    // Pair authors with register numbers if count matches or generate array of objects
    const teamMembers = authors.map((name, i) => ({
      name,
      regNo: registerNumbers[i] || '',
    }));

    let year = '2025';
    const yearMatch = publicationDate.match(/\b(20\d\d)\b/);
    if (yearMatch) {
      year = yearMatch[1];
    }

    return {
      id: `student-pub-${index + 1}`,
      slNo,
      batch,
      projectType,
      paperTitle,
      authors,
      registerNumbers,
      teamMembers,
      guide,
      conference,
      publicationDate: publicationDate || year,
      year,
      doi: doi !== 'DOI' ? doi : null,
      doiUrl,
    };
  });

// Apply student interleaving so adjacent student publication records belong to different lead authors
const studentPublications = mixAndInterleaveStudents(rawStudentPublications, item => {
  if (item.authors && item.authors.length > 0) {
    return normalizeName(item.authors[0]);
  }
  if (item.registerNumbers && item.registerNumbers.length > 0) {
    return item.registerNumbers[0];
  }
  return item.paperTitle;
});

console.log(
  `Processed ${staffPublications.length} staff publications and ${studentPublications.length} student publications.`
);

const code = `// Auto-generated from staff publications.xlsx and Student Publications.xlsx
export const staffPublications = ${JSON.stringify(staffPublications, null, 2)};

export const studentPublications = ${JSON.stringify(studentPublications, null, 2)};
`;

const outputPath = './src/data/publicationsData.js';
fs.writeFileSync(outputPath, code, 'utf-8');
console.log(`Successfully generated ${outputPath}!`);

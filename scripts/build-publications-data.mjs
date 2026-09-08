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

// Helper to shorten indexing names (IIP instead of Iterative International, GS instead of Google Scholar)
function formatIndexing(indexingStr) {
  if (!indexingStr) return 'Scopus';
  const str = String(indexingStr).trim();
  const norm = str.toLowerCase();
  if (norm.includes('google scholar') || norm === 'google scholar') return 'GS';
  if (norm.includes('iterative international') || norm.includes('iip')) return 'IIP';
  if (norm.includes('scopus')) return 'Scopus';
  if (norm === 'scie' || norm.includes('scie')) return 'SCIE';
  if (norm === 'sci') return 'SCI';
  if (norm.includes('ugc')) return 'UGC CARE';
  if (norm.includes('esci')) return 'ESCI';
  return str;
}

// Helper for latest-first sorting
function getSortTimestamp(item) {
  if (item.date) {
    const match = String(item.date).match(/(\d{2})-(\d{2})-(\d{4})/);
    if (match) {
      const [, d, m, y] = match;
      return new Date(`${y}-${m}-${d}`).getTime() || 0;
    }
  }
  const yearMatch = String(item.year || item.publicationDate || item.date || '').match(/\b(20\d\d)\b/);
  if (yearMatch) {
    return new Date(`${yearMatch[1]}-01-01`).getTime() || 0;
  }
  return 0;
}

// Read faculty list to resolve image paths and slugs
let facultyList = [];
try {
  const facultyFilePath = './src/data/facultyData.js';
  if (fs.existsSync(facultyFilePath)) {
    const fileContent = fs.readFileSync(facultyFilePath, 'utf-8');
    const jsonMatch = fileContent.match(/export const facultyData = (\[[\s\S]*?\]);/);
    if (jsonMatch) {
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
  .filter((row) => row['Paper Title'])
  .map((row, index) => {
    const rawFacultyName = String(
      row['Name of the Faculty '] || row['Name of the Faculty'] || row['Faculty Name'] || ''
    ).trim();

    const paperTitle = String(row['Paper Title'] || '').trim();
    const publicationType = String(row['Publication Type'] || 'Journal').trim();
    const venue = String(
      row['Name  of Journal /Conference '] || row['Name of Journal/Conference'] || row['Journal/Conference'] || ''
    ).trim();
    const indexing = formatIndexing(row['Indexing']);
    const publisher = String(row['Publisher'] || '').trim();
    const dateStr = formatDate(row['Date of Publication']);
    const doi = String(row['DOI'] || '').trim();
    const doiUrl = formatDoiUrl(doi, row['Publication Link']);

    const normRaw = normalizeName(rawFacultyName);
    const matchedFaculty = facultyList.find((f) => {
      const normF = normalizeName(f.name);
      return normF === normRaw || normRaw.includes(normF) || normF.includes(normRaw);
    });

    const facultySlug = matchedFaculty ? matchedFaculty.slug : slugify(rawFacultyName);
    const facultyImage = matchedFaculty ? matchedFaculty.img : null;
    const facultyName = matchedFaculty ? matchedFaculty.name : rawFacultyName;
    const initials = matchedFaculty
      ? matchedFaculty.initials
      : rawFacultyName.replace(/^(Dr|Prof|Mr|Mrs|Ms|Er)\.?\s*/i, '').slice(0, 2).toUpperCase();

    let year = '2025';
    const yearMatch = dateStr.match(/\b(20\d\d)\b/);
    if (yearMatch) year = yearMatch[1];

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

staffPublications.sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));

// 2. Process All Student Publications from Folder
const studentPubRecordsMap = new Map();

function normKey(str) {
  if (!str) return '';
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function addStudentPub(rec) {
  const titleKey = normKey(rec.paperTitle);
  if (!titleKey || titleKey.length < 4) return;

  if (studentPubRecordsMap.has(titleKey)) {
    const existing = studentPubRecordsMap.get(titleKey);
    if (!existing.doi && rec.doi) {
      existing.doi = rec.doi;
      existing.doiUrl = rec.doiUrl;
    }
    if ((!existing.conference || existing.conference === 'ACCESS 2025') && rec.conference) {
      existing.conference = rec.conference;
    }
    if (!existing.guide && rec.guide) {
      existing.guide = rec.guide;
    }
    if (rec.authors && rec.authors.length > 0) {
      rec.authors.forEach((a) => {
        if (a && !existing.authors.some((ea) => normKey(ea) === normKey(a))) {
          existing.authors.push(a);
        }
      });
    }
    if (rec.teamMembers && rec.teamMembers.length > 0) {
      rec.teamMembers.forEach((tm) => {
        if (tm.name && !existing.teamMembers.some((etm) => normKey(etm.name) === normKey(tm.name))) {
          existing.teamMembers.push(tm);
        }
      });
    }
  } else {
    studentPubRecordsMap.set(titleKey, rec);
  }
}

// Master Student Publications.xlsx
const masterStudentFile = 'D:\\AIDA\\public\\publications details complete\\Student publications\\Student Publications.xlsx';
if (fs.existsSync(masterStudentFile)) {
  const wb = XLSX.readFile(masterStudentFile);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  rows.filter((r) => r['Paper Title'] && String(r['Paper Title']).trim() !== 'undefined').forEach((row, index) => {
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

    const authorsRaw = String(row['Authors'] || '').trim();
    const regNosRaw = String(row['Register No.'] || '').trim();

    const authors = authorsRaw ? authorsRaw.split(';').map((a) => a.trim()).filter(Boolean) : [];
    const registerNumbers = regNosRaw ? regNosRaw.split(';').map((r) => r.trim()).filter(Boolean) : [];

    const teamMembers = authors.map((name, i) => ({
      name,
      regNo: registerNumbers[i] || '',
    }));

    let year = '2025';
    const yearMatch = publicationDate.match(/\b(20\d\d)\b/);
    if (yearMatch) year = yearMatch[1];

    addStudentPub({
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
    });
  });
}

// 22-26 Batch Mini Projects
const file22_26 = 'D:\\AIDA\\public\\publications details complete\\Student publications\\22-26\\Conference_Miniproject.xlsx';
if (fs.existsSync(file22_26)) {
  const wb = XLSX.readFile(file22_26);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  let currentGroup = null;
  rows.forEach((r, idx) => {
    const grpNum = String(r['Group Number'] || '').trim();
    const title = String(r['Article title'] || '').trim();
    const conf = String(r['Conference Name'] || '').trim();
    const guide = String(r['GUIDE'] || '').trim();
    const doi = String(r['Publication Proof / DOI'] || '').trim();
    const member = String(r['MEMBERS'] || '').trim();
    const regNo = String(r['REGISTER NUMBER'] || '').trim();

    if (grpNum || title || conf || guide) {
      if (title && title !== 'undefined') {
        currentGroup = {
          grpNum: grpNum || `GROUP-${idx}`,
          paperTitle: title,
          conference: conf || 'AISUMMIT 2025',
          guide: guide,
          doi: doi,
          batch: '2022–26',
          projectType: 'Mini Project',
          teamMembers: [],
          authors: [],
        };
      }
    }

    if (currentGroup && member) {
      if (!currentGroup.authors.includes(member)) {
        currentGroup.authors.push(member);
        currentGroup.teamMembers.push({ name: member, regNo });
      }
    }

    const nextRow = rows[idx + 1];
    const isNextNew = !nextRow || nextRow['Group Number'] || nextRow['Article title'];
    if (currentGroup && isNextNew) {
      if (currentGroup.paperTitle) {
        addStudentPub({
          id: `student-pub-2226-${currentGroup.grpNum}`,
          slNo: studentPubRecordsMap.size + 1,
          batch: currentGroup.batch,
          projectType: currentGroup.projectType,
          paperTitle: currentGroup.paperTitle,
          authors: currentGroup.authors,
          registerNumbers: currentGroup.teamMembers.map((m) => m.regNo),
          teamMembers: currentGroup.teamMembers,
          guide: currentGroup.guide,
          conference: currentGroup.conference,
          publicationDate: '2025',
          year: '2025',
          doi: currentGroup.doi ? currentGroup.doi : null,
          doiUrl: formatDoiUrl(currentGroup.doi, null),
        });
      }
    }
  });
}

// 21-25 Batch Conference Papers
const file21_25_conf = 'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\Conference Paper Status.xlsx';
if (fs.existsSync(file21_25_conf)) {
  const wb = XLSX.readFile(file21_25_conf);
  wb.SheetNames.forEach((sName) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sName]);
    let currentGrp = null;
    rows.forEach((r, idx) => {
      const title = String(r['Paper Title'] || r['Article Title'] || r['Title'] || '').trim();
      const conf = String(r['Conference'] || r['Conference Name'] || '').trim();
      const guide = String(r['Guide'] || r['GUIDE'] || '').trim();
      const doi = String(r['DOI'] || r['Proof'] || '').trim();
      const member = String(r['Student Name'] || r['Author'] || r['MEMBERS'] || r['Name'] || '').trim();
      const regNo = String(r['Reg No'] || r['Register Number'] || '').trim();

      if (title && title !== 'undefined') {
        currentGrp = {
          paperTitle: title,
          conference: conf || 'ACCESS 2025',
          guide: guide,
          doi: doi,
          batch: '2021–25',
          projectType: 'Main Project',
          teamMembers: [],
          authors: [],
        };
      }

      if (currentGrp && member) {
        if (!currentGrp.authors.includes(member)) {
          currentGrp.authors.push(member);
          currentGrp.teamMembers.push({ name: member, regNo });
        }
      }

      const nextRow = rows[idx + 1];
      const isNextNew = !nextRow || nextRow['Paper Title'] || nextRow['Article Title'] || nextRow['Title'];
      if (currentGrp && isNextNew) {
        addStudentPub({
          id: `student-pub-2125-${idx}`,
          slNo: studentPubRecordsMap.size + 1,
          batch: currentGrp.batch,
          projectType: currentGrp.projectType,
          paperTitle: currentGrp.paperTitle,
          authors: currentGrp.authors,
          registerNumbers: currentGrp.teamMembers.map((m) => m.regNo),
          teamMembers: currentGrp.teamMembers,
          guide: currentGrp.guide,
          conference: currentGrp.conference,
          publicationDate: '2025',
          year: '2025',
          doi: currentGrp.doi ? currentGrp.doi : null,
          doiUrl: formatDoiUrl(currentGrp.doi, null),
        });
      }
    });
  });
}

const studentPublications = Array.from(studentPubRecordsMap.values());

// Sort student publications latest first
studentPublications.sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));

console.log(
  `Processed ${staffPublications.length} staff publications and ${studentPublications.length} student publications.`
);

const code = `// Auto-generated from staff publications.xlsx and Student Publications folder
export const staffPublications = ${JSON.stringify(staffPublications, null, 2)};

export const studentPublications = ${JSON.stringify(studentPublications, null, 2)};
`;

const outputPath = './src/data/publicationsData.js';
fs.writeFileSync(outputPath, code, 'utf-8');
console.log(`Successfully generated ${outputPath}!`);

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
  if (!doi || doi === 'Publication Link' || doi === 'DOI' || doi === 'Proof') {
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
const staffFilePath = [
  path.join(process.cwd(), 'public', 'publications details complete', 'staff publications.xlsx'),
  path.join(process.cwd(), 'public', 'staff publications.xlsx'),
  'C:\\Users\\dell\\Downloads\\staff publications.xlsx',
].find((p) => fs.existsSync(p));

let rawStaffRows = [];
if (staffFilePath && fs.existsSync(staffFilePath)) {
  const wb = XLSX.readFile(staffFilePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  rawStaffRows = XLSX.utils.sheet_to_json(sheet);
} else {
  console.error(`Staff publications file not found in public folder or local path!`);
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
      doi: doi !== 'Publication Link' && doi !== 'DOI' ? doi : '',
      doiUrl,
    };
  });

staffPublications.sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));

// 2. Process All Student Publications from All 10 Excel Files in Student Publications Folder
const pubRecordsMap = new Map();

function normKey(str) {
  if (!str) return '';
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

function addStudentPub(record) {
  const titleKey = normKey(record.paperTitle);
  if (!titleKey || titleKey.length < 4) return;

  const authors = (record.authors || []).map((a) => (a ? String(a).trim() : '')).filter(Boolean);
  let registerNumbers = (record.registerNumbers || []).map((r) => (r ? String(r).trim() : '')).filter(Boolean);

  const teamMembers = (record.teamMembers || [])
    .map((tm) => ({
      name: tm.name ? String(tm.name).trim() : '',
      regNo: tm.regNo ? String(tm.regNo).trim() : '',
    }))
    .filter((tm) => tm.name);

  if (teamMembers.length > 0) {
    const tmRegs = teamMembers.map((tm) => tm.regNo).filter(Boolean);
    if (tmRegs.length > registerNumbers.length) {
      registerNumbers = tmRegs;
    }
  }

  const cleanRecord = {
    id: record.id,
    batch: record.batch || '2021–25',
    projectType: record.projectType || 'Main Project',
    paperTitle: String(record.paperTitle).trim(),
    authors: authors,
    registerNumbers: registerNumbers,
    teamMembers: teamMembers.length > 0 ? teamMembers : authors.map((a, i) => ({ name: a, regNo: registerNumbers[i] || '' })),
    guide: record.guide ? String(record.guide).trim() : '',
    conference: record.conference ? String(record.conference).trim() : '',
    publicationDate: record.publicationDate ? String(record.publicationDate).trim() : '',
    year: record.year ? String(record.year).trim() : '2025',
    doi: record.doi && record.doi !== 'DOI' && record.doi !== 'Proof' ? String(record.doi).trim() : '',
    doiUrl: record.doiUrl || null,
  };

  if (pubRecordsMap.has(titleKey)) {
    const existing = pubRecordsMap.get(titleKey);

    if (!existing.doi && cleanRecord.doi) {
      existing.doi = cleanRecord.doi;
      existing.doiUrl = cleanRecord.doiUrl;
    }
    if ((!existing.conference || existing.conference === 'ACCESS 2025') && cleanRecord.conference) {
      existing.conference = cleanRecord.conference;
    }
    if (!existing.guide && cleanRecord.guide) {
      existing.guide = cleanRecord.guide;
    }
    if (!existing.batch && cleanRecord.batch) {
      existing.batch = cleanRecord.batch;
    }
    if (cleanRecord.authors.length > 0) {
      cleanRecord.authors.forEach((a) => {
        if (a && !existing.authors.some((ea) => normKey(ea) === normKey(a))) {
          existing.authors.push(a);
        }
      });
    }
    if (cleanRecord.teamMembers.length > 0) {
      cleanRecord.teamMembers.forEach((tm) => {
        const etm = existing.teamMembers.find((item) => normKey(item.name) === normKey(tm.name));
        if (etm) {
          if (!etm.regNo && tm.regNo) etm.regNo = tm.regNo;
        } else {
          existing.teamMembers.push({ name: tm.name, regNo: tm.regNo || '' });
        }
      });
    }
    const combinedRegs = existing.teamMembers.map((tm) => tm.regNo).filter(Boolean);
    if (combinedRegs.length > 0) {
      existing.registerNumbers = combinedRegs;
    }
  } else {
    pubRecordsMap.set(titleKey, cleanRecord);
  }
}

// Master File: Student Publications.xlsx
const masterFile = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', 'Student Publications.xlsx');
if (fs.existsSync(masterFile)) {
  const wb = XLSX.readFile(masterFile);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  rows.forEach((row, index) => {
    const title = row['Paper Title'];
    if (!title || String(title).trim() === 'undefined') return;

    const batch = String(row['Batch Year'] || '2021–25').trim();
    const projectType = String(row['Project Type'] || 'Main Project').trim();
    const guide = String(row['Guide'] || '').trim();
    const conference = String(row['Conference Name'] || row['Conference Short Name'] || '').trim();
    const pubDate = formatDate(row['Publication Date']);
    const doi = String(row['DOI'] || '').trim();
    const rawLink = String(row['Publication Link'] || '').trim();

    const authorsRaw = String(row['Authors'] || '').trim();
    const regNosRaw = String(row['Register No.'] || '').trim();

    const authors = authorsRaw ? authorsRaw.split(';').map((a) => a.trim()).filter(Boolean) : [];
    const regNos = regNosRaw ? regNosRaw.split(';').map((r) => r.trim()).filter(Boolean) : [];

    let year = '2025';
    const match = pubDate.match(/\b(20\d\d)\b/);
    if (match) year = match[1];

    addStudentPub({
      id: `master-${index + 1}`,
      batch,
      projectType,
      paperTitle: String(title).trim(),
      authors,
      registerNumbers: regNos,
      guide,
      conference,
      publicationDate: pubDate || year,
      year,
      doi,
      doiUrl: formatDoiUrl(doi, rawLink),
    });
  });
}

// 22-26\Conference_Miniproject.xlsx
const file22_26_conf = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', '22-26', 'Conference_Miniproject.xlsx');
if (fs.existsSync(file22_26_conf)) {
  const wb = XLSX.readFile(file22_26_conf);
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
          grpNum: grpNum || `GRP-${idx}`,
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
          id: `2226-conf-${currentGroup.grpNum}`,
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
          doi: currentGroup.doi,
          doiUrl: formatDoiUrl(currentGroup.doi, null),
        });
      }
    }
  });
}

// 21-25\Conference Paper Status.xlsx
const file21_25_conf = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', '21-25', 'Conference Paper Status.xlsx');
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
          id: `2125-conf-${idx}`,
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
          doi: currentGrp.doi,
          doiUrl: formatDoiUrl(currentGrp.doi, null),
        });
      }
    });
  });
}

// 21-25\Miniproject_ConferencePaper.xlsx
const file21_25_mini = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', '21-25', 'Miniproject_ConferencePaper.xlsx');
if (fs.existsSync(file21_25_mini)) {
  const wb = XLSX.readFile(file21_25_mini);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  rows.forEach((r, idx) => {
    const regNo = String(r['Register Number'] || '').trim();
    const member = String(r['Name'] || '').trim();
    const guide = String(r['Guide'] || '').trim();
    const typeStr = String(r['Achievement Type'] || '').trim();
    const acadYear = String(r['Academic Year'] || '').trim();
    const proof = String(r['Proof'] || '').trim();

    if (typeStr) {
      const year = acadYear.includes('2024') ? '2024' : '2025';
      addStudentPub({
        id: `2125-mini-${idx}`,
        batch: '2021–25',
        projectType: 'Mini Project',
        paperTitle: typeStr,
        authors: member ? [member] : [],
        registerNumbers: regNo ? [regNo] : [],
        guide,
        conference: 'AREIS 2024',
        publicationDate: year,
        year,
        doi: proof,
        doiUrl: formatDoiUrl(proof, proof),
      });
    }
  });
}

// 20-24\MiniProject_IEEE paper.xlsx
const file20_24_ieee = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', '20-24', 'MiniProject_IEEE paper.xlsx');
if (fs.existsSync(file20_24_ieee)) {
  const wb = XLSX.readFile(file20_24_ieee);
  wb.SheetNames.forEach((sName) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sName]);
    rows.forEach((r, idx) => {
      const title = String(r['Paper Title'] || r['Title'] || r['Article Title'] || '').trim();
      const authorsRaw = String(r['Authors'] || r['Student Names'] || r['Members'] || '').trim();
      const guide = String(r['Guide'] || r['GUIDE'] || '').trim();
      const conf = String(r['Conference'] || r['Conference Name'] || '').trim();
      const doi = String(r['DOI'] || r['Proof'] || '').trim();

      if (title && title !== 'undefined') {
        const authors = authorsRaw ? authorsRaw.split(/;|,/).map((a) => a.trim()).filter(Boolean) : [];
        addStudentPub({
          id: `2024-ieee-${sName}-${idx}`,
          batch: '2020–24',
          projectType: 'Mini Project',
          paperTitle: title,
          authors,
          registerNumbers: [],
          guide,
          conference: conf || 'IEEE 2024',
          publicationDate: '2024',
          year: '2024',
          doi,
          doiUrl: formatDoiUrl(doi, null),
        });
      }
    });
  });
}

// 20-24\ProjectGroups.xlsx
const file20_24_groups = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', '20-24', 'ProjectGroups.xlsx');
if (fs.existsSync(file20_24_groups)) {
  const wb = XLSX.readFile(file20_24_groups);
  wb.SheetNames.forEach((sName) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sName]);
    let currentGrp = null;
    rows.forEach((r, idx) => {
      const title = String(r['Project Title'] || r['Paper Title'] || r['Title'] || '').trim();
      const guide = String(r['Guide'] || r['GUIDE'] || '').trim();
      const member = String(r['Student Name'] || r['Member'] || r['Name'] || '').trim();
      const regNo = String(r['Reg No'] || r['Register Number'] || '').trim();
      const conf = String(r['Conference'] || r['Publication'] || '').trim();

      if (title && title !== 'undefined') {
        currentGrp = {
          paperTitle: title,
          guide: guide,
          conference: conf || 'KTU Conference 2024',
          batch: '2020–24',
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
      const isNextNew = !nextRow || nextRow['Project Title'] || nextRow['Paper Title'] || nextRow['Title'];
      if (currentGrp && isNextNew) {
        addStudentPub({
          id: `2024-grp-${sName}-${idx}`,
          batch: currentGrp.batch,
          projectType: currentGrp.projectType,
          paperTitle: currentGrp.paperTitle,
          authors: currentGrp.authors,
          registerNumbers: currentGrp.teamMembers.map((m) => m.regNo),
          teamMembers: currentGrp.teamMembers,
          guide: currentGrp.guide,
          conference: currentGrp.conference,
          publicationDate: '2024',
          year: '2024',
          doi: '',
          doiUrl: null,
        });
      }
    });
  });
}

// 21-25\ADD416 - Project Phase 2 evaluation Sheet .xlsx
const file21_25_phase2 = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', '21-25', 'ADD416 - Project Phase 2 evaluation Sheet .xlsx');
if (fs.existsSync(file21_25_phase2)) {
  const wb = XLSX.readFile(file21_25_phase2);
  wb.SheetNames.forEach((sName) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sName]);
    let currentGrp = null;
    rows.forEach((r, idx) => {
      const title = String(r['Project Title'] || r['Title'] || '').trim();
      const guide = String(r['Guide'] || r['GUIDE'] || '').trim();
      const member = String(r['Student Name'] || r['Name'] || '').trim();
      const regNo = String(r['Register Number'] || r['Reg No'] || '').trim();

      if (title && title !== 'undefined') {
        currentGrp = {
          paperTitle: title,
          guide: guide,
          conference: 'ACCESS 2025',
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
      const isNextNew = !nextRow || nextRow['Project Title'] || nextRow['Title'];
      if (currentGrp && isNextNew) {
        addStudentPub({
          id: `2125-p2-${sName}-${idx}`,
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
          doi: '',
          doiUrl: null,
        });
      }
    });
  });
}

// 21-25\MiNi Project groups.xlsx
const file21_25_minigrp = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', '21-25', 'MiNi Project groups.xlsx');
if (fs.existsSync(file21_25_minigrp)) {
  const wb = XLSX.readFile(file21_25_minigrp);
  wb.SheetNames.forEach((sName) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sName]);
    let currentGrp = null;
    rows.forEach((r, idx) => {
      const title = String(r['Project Title'] || r['Title'] || '').trim();
      const guide = String(r['Guide'] || r['GUIDE'] || '').trim();
      const member = String(r['Student Name'] || r['Name'] || '').trim();
      const regNo = String(r['Register Number'] || r['Reg No'] || '').trim();

      if (title && title !== 'undefined') {
        currentGrp = {
          paperTitle: title,
          guide: guide,
          conference: 'AREIS 2024',
          batch: '2021–25',
          projectType: 'Mini Project',
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
      const isNextNew = !nextRow || nextRow['Project Title'] || nextRow['Title'];
      if (currentGrp && isNextNew) {
        addStudentPub({
          id: `2125-minigrp-${sName}-${idx}`,
          batch: currentGrp.batch,
          projectType: currentGrp.projectType,
          paperTitle: currentGrp.paperTitle,
          authors: currentGrp.authors,
          registerNumbers: currentGrp.teamMembers.map((m) => m.regNo),
          teamMembers: currentGrp.teamMembers,
          guide: currentGrp.guide,
          conference: currentGrp.conference,
          publicationDate: '2024',
          year: '2024',
          doi: '',
          doiUrl: null,
        });
      }
    });
  });
}

// 22-26\Guide & Title.xlsx
const file22_26_guidetitle = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', '22-26', 'Guide & Title.xlsx');
if (fs.existsSync(file22_26_guidetitle)) {
  const wb = XLSX.readFile(file22_26_guidetitle);
  const sheet = wb.Sheets['AD'];
  if (sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet);
    let currentGrp = null;
    rows.forEach((r, idx) => {
      const title = String(r['TOPIC'] || r['Project Title'] || r['Title'] || '').trim();
      const guide = String(r['GUIDE'] || r['Guide'] || '').trim();
      const member = String(r['STUDENT NAME'] || r['Name'] || '').trim();
      const regNo = String(r['REGISTER NUMBER'] || '').trim();

      if (title && title !== 'undefined') {
        currentGrp = {
          paperTitle: title,
          guide: guide,
          conference: 'AISUMMIT 2025',
          batch: '2022–26',
          projectType: 'Mini Project',
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
      const isNextNew = !nextRow || nextRow['TOPIC'] || nextRow['Project Title'] || nextRow['Title'];
      if (currentGrp && isNextNew) {
        addStudentPub({
          id: `2226-gt-${idx}`,
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
          doi: '',
          doiUrl: null,
        });
      }
    });
  }
}

// 22-26\Mini Project Marks_2022 Admn.xlsx
const file22_26_marks = path.join(process.cwd(), 'public', 'publications details complete', 'Student publications', '22-26', 'Mini Project Marks_2022 Admn.xlsx');
if (fs.existsSync(file22_26_marks)) {
  const wb = XLSX.readFile(file22_26_marks);
  const sheet = wb.Sheets['Topic Guide Area'];
  if (sheet) {
    const rows = XLSX.utils.sheet_to_json(sheet);
    let currentGrp = null;
    rows.forEach((r, idx) => {
      const keys = Object.keys(r);
      const titleKey = keys.find((k) => k.includes('TOPIC') || k === '__EMPTY_3');
      const guideKey = keys.find((k) => k.includes('GUIDE') || k === '__EMPTY_2');
      const memberKey = keys.find((k) => k.includes('STUDENT NAME') || k === '__EMPTY');

      const title = titleKey ? String(r[titleKey] || '').trim() : '';
      const guide = guideKey ? String(r[guideKey] || '').trim() : '';
      const member = memberKey ? String(r[memberKey] || '').trim() : '';

      if (title && title !== 'TOPIC' && title !== 'undefined') {
        currentGrp = {
          paperTitle: title,
          guide: guide,
          conference: 'AISUMMIT 2025',
          batch: '2022–26',
          projectType: 'Mini Project',
          teamMembers: [],
          authors: [],
        };
      }

      if (currentGrp && member && member !== 'STUDENT NAME') {
        if (!currentGrp.authors.includes(member)) {
          currentGrp.authors.push(member);
          currentGrp.teamMembers.push({ name: member, regNo: '' });
        }
      }

      const nextRow = rows[idx + 1];
      const isNextNew = !nextRow;
      if (currentGrp && isNextNew) {
        addStudentPub({
          id: `2226-marks-${idx}`,
          batch: currentGrp.batch,
          projectType: currentGrp.projectType,
          paperTitle: currentGrp.paperTitle,
          authors: currentGrp.authors,
          registerNumbers: [],
          teamMembers: currentGrp.teamMembers,
          guide: currentGrp.guide,
          conference: currentGrp.conference,
          publicationDate: '2025',
          year: '2025',
          doi: '',
          doiUrl: null,
        });
      }
    });
  }
}

const studentPublications = Array.from(pubRecordsMap.values());

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

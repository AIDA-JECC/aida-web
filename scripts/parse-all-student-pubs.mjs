import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

function normStr(str) {
  if (!str) return '';
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

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

const pubRecordsMap = new Map();

function addPublicationRecord(record) {
  const titleKey = normStr(record.paperTitle);
  if (!titleKey || titleKey.length < 4) return;

  // Clean authors and regNos (replace undefined/null with blank)
  const authors = (record.authors || []).map((a) => (a ? String(a).trim() : '')).filter(Boolean);
  const registerNumbers = (record.registerNumbers || []).map((r) => (r ? String(r).trim() : '')).filter(Boolean);

  const teamMembers = (record.teamMembers || [])
    .map((tm) => ({
      name: tm.name ? String(tm.name).trim() : '',
      regNo: tm.regNo ? String(tm.regNo).trim() : '',
    }))
    .filter((tm) => tm.name);

  const cleanRecord = {
    id: record.id,
    batch: record.batch || '2021–25',
    projectType: record.projectType || 'Main Project',
    paperTitle: record.paperTitle.trim(),
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

    // Merge missing fields
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
        if (a && !existing.authors.some((ea) => normStr(ea) === normStr(a))) {
          existing.authors.push(a);
        }
      });
    }
    if (cleanRecord.teamMembers.length > 0) {
      cleanRecord.teamMembers.forEach((tm) => {
        if (tm.name && !existing.teamMembers.some((etm) => normStr(etm.name) === normStr(tm.name))) {
          existing.teamMembers.push(tm);
        }
      });
    }
  } else {
    pubRecordsMap.set(titleKey, cleanRecord);
  }
}

// 1. Student Publications.xlsx (Master File)
const masterFile = 'D:\\AIDA\\public\\publications details complete\\Student publications\\Student Publications.xlsx';
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

    addPublicationRecord({
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

// 2. 22-26\Conference_Miniproject.xlsx
const file22_26_conf = 'D:\\AIDA\\public\\publications details complete\\Student publications\\22-26\\Conference_Miniproject.xlsx';
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
        addPublicationRecord({
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

// 3. 21-25\Conference Paper Status.xlsx
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
        addPublicationRecord({
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

// 4. 21-25\Miniproject_ConferencePaper.xlsx
const file21_25_mini = 'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\Miniproject_ConferencePaper.xlsx';
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
      // Extract title and conference from typeStr (e.g. "(Miniproject)Paper Publication - ARIES24")
      const title = typeStr;
      const year = acadYear.includes('2024') ? '2024' : '2025';
      addPublicationRecord({
        id: `2125-mini-${idx}`,
        batch: '2021–25',
        projectType: 'Mini Project',
        paperTitle: title,
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

// 5. 20-24\MiniProject_IEEE paper.xlsx
const file20_24_ieee = 'D:\\AIDA\\public\\publications details complete\\Student publications\\20-24\\MiniProject_IEEE paper.xlsx';
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
        addPublicationRecord({
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

// 6. 20-24\ProjectGroups.xlsx
const file20_24_groups = 'D:\\AIDA\\public\\publications details complete\\Student publications\\20-24\\ProjectGroups.xlsx';
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
        addPublicationRecord({
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

// 7. 21-25\ADD416 - Project Phase 2 evaluation Sheet .xlsx
const file21_25_phase2 = 'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\ADD416 - Project Phase 2 evaluation Sheet .xlsx';
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
        addPublicationRecord({
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

// 8. 21-25\MiNi Project groups.xlsx
const file21_25_minigrp = 'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\MiNi Project groups.xlsx';
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
        addPublicationRecord({
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

// 9. 22-26\Guide & Title.xlsx
const file22_26_guidetitle = 'D:\\AIDA\\public\\publications details complete\\Student publications\\22-26\\Guide & Title.xlsx';
if (fs.existsSync(file22_26_guidetitle)) {
  const wb = XLSX.readFile(file22_26_guidetitle);
  const sheet = wb.Sheets['AD']; // AD sheet is Artificial Intelligence & Data Science
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
        addPublicationRecord({
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

// 10. 22-26\Mini Project Marks_2022 Admn.xlsx
const file22_26_marks = 'D:\\AIDA\\public\\publications details complete\\Student publications\\22-26\\Mini Project Marks_2022 Admn.xlsx';
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
        addPublicationRecord({
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
console.log(`TOTAL UNIFIED STUDENT PUBLICATIONS FROM ALL 10 EXCEL FILES: ${studentPublications.length}`);

studentPublications.forEach((p, idx) => {
  console.log(`\n[${idx + 1}] ${p.paperTitle}`);
  console.log(`  Batch: ${p.batch} | Type: ${p.projectType}`);
  console.log(`  Guide: ${p.guide || '—'} | Conf: ${p.conference || '—'} | DOI: ${p.doi || '—'}`);
  console.log(`  Authors (${p.authors.length}): ${p.authors.join(', ')}`);
});

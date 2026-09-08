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

const pubRecordsMap = new Map();

function addPublicationRecord(record) {
  const titleKey = normStr(record.paperTitle);
  if (!titleKey || titleKey.length < 5) return;

  if (pubRecordsMap.has(titleKey)) {
    const existing = pubRecordsMap.get(titleKey);
    if (!existing.doi && record.doi) {
      existing.doi = record.doi;
      existing.doiUrl = record.doiUrl;
    }
    if ((!existing.conference || existing.conference === 'ACCESS 2025') && record.conference) {
      existing.conference = record.conference;
    }
    if (!existing.guide && record.guide) {
      existing.guide = record.guide;
    }
    if (record.authors && record.authors.length > 0) {
      record.authors.forEach(a => {
        if (a && !existing.authors.some(ea => normStr(ea) === normStr(a))) {
          existing.authors.push(a);
        }
      });
    }
    if (record.teamMembers && record.teamMembers.length > 0) {
      record.teamMembers.forEach(tm => {
        if (tm.name && !existing.teamMembers.some(etm => normStr(etm.name) === normStr(tm.name))) {
          existing.teamMembers.push(tm);
        }
      });
    }
  } else {
    pubRecordsMap.set(titleKey, record);
  }
}

// 1. Master `Student Publications.xlsx`
const masterFile = 'D:\\AIDA\\public\\publications details complete\\Student publications\\Student Publications.xlsx';
if (fs.existsSync(masterFile)) {
  const wb = XLSX.readFile(masterFile);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  rows.filter(r => r['Paper Title'] && String(r['Paper Title']).trim() !== 'undefined').forEach((row, index) => {
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

    const authors = authorsRaw ? authorsRaw.split(';').map(a => a.trim()).filter(Boolean) : [];
    const registerNumbers = regNosRaw ? regNosRaw.split(';').map(r => r.trim()).filter(Boolean) : [];

    const teamMembers = authors.map((name, i) => ({
      name,
      regNo: registerNumbers[i] || '',
    }));

    let year = '2025';
    const yearMatch = publicationDate.match(/\b(20\d\d)\b/);
    if (yearMatch) year = yearMatch[1];

    addPublicationRecord({
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

// 2. Read `22-26\Conference_Miniproject.xlsx` with multi-line propagation
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

    // If next row starts a new group or we're at the end, commit currentGroup
    const nextRow = rows[idx + 1];
    const isNextNew = !nextRow || nextRow['Group Number'] || nextRow['Article title'];
    if (currentGroup && isNextNew) {
      if (currentGroup.paperTitle) {
        addPublicationRecord({
          id: `student-pub-2226-${currentGroup.grpNum}`,
          slNo: pubRecordsMap.size + 1,
          batch: currentGroup.batch,
          projectType: currentGroup.projectType,
          paperTitle: currentGroup.paperTitle,
          authors: currentGroup.authors,
          registerNumbers: currentGroup.teamMembers.map(m => m.regNo),
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

// 3. Read `21-25\Conference Paper Status.xlsx` & `21-25\Miniproject_ConferencePaper.xlsx`
const file21_25_conf = 'D:\\AIDA\\public\\publications details complete\\Student publications\\21-25\\Conference Paper Status.xlsx';
if (fs.existsSync(file21_25_conf)) {
  const wb = XLSX.readFile(file21_25_conf);
  wb.SheetNames.forEach(sName => {
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
          id: `student-pub-2125-${idx}`,
          slNo: pubRecordsMap.size + 1,
          batch: currentGrp.batch,
          projectType: currentGrp.projectType,
          paperTitle: currentGrp.paperTitle,
          authors: currentGrp.authors,
          registerNumbers: currentGrp.teamMembers.map(m => m.regNo),
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

const allPubs = Array.from(pubRecordsMap.values());
console.log(`Total Unified Student Publications Records: ${allPubs.length}`);
allPubs.forEach((p, idx) => {
  console.log(`\n[${idx + 1}] Batch: ${p.batch} | Type: ${p.projectType}`);
  console.log(`Title: ${p.paperTitle}`);
  console.log(`Guide: ${p.guide || '—'} | Conf: ${p.conference || '—'} | DOI: ${p.doi || '—'}`);
  console.log(`Authors (${p.authors.length}): ${p.authors.join(', ')}`);
});

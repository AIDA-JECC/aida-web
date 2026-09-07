import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Helper to extract clean domain string from URL
function extractCleanDomain(url) {
  if (!url || typeof url !== 'string') return '';
  let clean = url.trim();
  clean = clean.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  clean = clean.split('/')[0].split('?')[0];
  return clean.toLowerCase();
}

// Helper to format string into Title Case if ALL CAPS or messy
function toCleanTitleCase(str) {
  if (!str) return '';
  let clean = str.trim();
  
  // Strip prefixes like "Internship at "
  clean = clean.replace(/^internship\s+at\s+/i, '');

  // If already mixed case and not all caps, keep as is
  const isAllCaps = clean === clean.toUpperCase() && /[A-Z]/.test(clean);
  if (!isAllCaps) {
    return clean;
  }

  // Known acronyms to preserve in upper case
  const acronyms = new Set(['IIT', 'NIT', 'C-DAC', 'CIDAC', 'NIELIT', 'ESAF', 'UST', 'EY', 'TCS', 'TCSL', 'LLP', 'PVT', 'LTD']);

  return clean.split(/\s+/).map(word => {
    const upper = word.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (acronyms.has(upper)) return word.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

// Canonical Company Mapping Dictionary by domain / website / logo hostname
const canonicalDomainMap = new Map([
  ['nestcybercampus.com', 'NeST Cyber Campus'],
  ['softroniics.com', 'Softronics'],
  ['nestdigital.com', 'NeST Information Technologies'],
  ['tcs.com', 'Tata Consultancy Services'],
  ['iitpkd.ac.in', 'IIT Palakkad'],
  ['iith.ac.in', 'IIT Hyderabad'],
  ['iitb.ac.in', 'IIT Bombay'],
  ['nitpy.ac.in', 'NIT Puducherry'],
  ['nielit.in', 'NIELIT'],
  ['esaf.bank.in', 'ESAF Small Finance Bank'],
  ['gofreelab.com', 'GoFreeLab Technologies'],
  ['expertzlab.com', 'Expertzlab Technologies'],
  ['retechnox.in', 'Retechnox Technologies'],
  ['internspotinnovation.com', 'Internspot Innovations'],
  ['singularissoftware.in', 'Singularis Software Technologies'],
  ['techmindz.com', 'Techmindz'],
  ['docwo.com', 'Docwo Private Limited'],
  ['cdac.in', 'C-DAC'],
  ['cdac.gov.in', 'C-DAC'],
  ['ey.com', 'EY Global Delivery Services'],
  ['sutherlandglobal.com', 'Sutherland Global'],
  ['qspiders.com', 'QSpiders'],
  ['bluebuddha.asia', 'Blue Buddha Creative'],
  ['innovature.ai', 'Innovature Software Labs'],
  ['cognizant.com', 'Cognizant'],
  ['candata.ai', 'DataWorks Technologies'],
  ['mitsogo.com', 'Mitsogo Technologies'],
  ['movate.com', 'Movate'],
  ['southindianbank.bank.in', 'South Indian Bank'],
  ['technologicsglobal.in', 'Technologics Global'],
  ['6dtechnologies.com', '6D Technologies'],
  ['konceptslab.com', 'KL Koncepts Lab'],
  ['abacies.com', 'Abacies Logiciels'],
  ['ust.com', 'UST'],
  ['techieshub.in', 'Tech Innovation Enthusiastic Squad'],
  ['cronlabs.com', 'Cronlabs Solutions'],
  ['gapblue.com', 'Gapblue Software Labs'],
  ['grapestechs.com', 'Grapesgenix Technical Solutions'],
  ['nuventureconnect.com', 'Nuventure Connect'],
  ['cynosylix.com', 'Cynosylix'],
]);

function getCanonicalCompanyName(rawName, domain, website, logoUrl) {
  let cleanDomain = domain ? domain.toLowerCase() : '';
  if (!cleanDomain && website) cleanDomain = extractCleanDomain(website);
  if (!cleanDomain && logoUrl) cleanDomain = extractCleanDomain(logoUrl);

  if (cleanDomain && canonicalDomainMap.has(cleanDomain)) {
    return canonicalDomainMap.get(cleanDomain);
  }

  return toCleanTitleCase(rawName);
}

// Check for local student photos
const placementsDir = './public/placements';
const studentsDir = './public/students';
const placementFiles = fs.existsSync(placementsDir) ? fs.readdirSync(placementsDir) : [];
const studentFiles = fs.existsSync(studentsDir) ? fs.readdirSync(studentsDir) : [];

function findLocalStudentImage(studentName, slNo) {
  const nameLower = studentName ? studentName.toLowerCase().trim() : '';
  if (!nameLower) return null;

  let match = placementFiles.find(f => {
    const fl = f.toLowerCase();
    return fl.includes(nameLower) || (slNo && fl.startsWith(`${slNo}_`));
  });
  if (match) return `/placements/${encodeURIComponent(match)}`;

  match = studentFiles.find(f => {
    const fl = f.toLowerCase();
    return fl.includes(nameLower) || (slNo && fl.startsWith(`${slNo}_`));
  });
  if (match) return `/students/${encodeURIComponent(match)}`;

  return null;
}

// 1. Read public/placements.xlsx
const placementsPath = './public/placements.xlsx';
let rawPlacements = [];
if (fs.existsSync(placementsPath)) {
  const workbook = XLSX.readFile(placementsPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  rawPlacements = XLSX.utils.sheet_to_json(sheet);
}
console.log(`Loaded ${rawPlacements.length} placements from placements.xlsx`);

const normalizedPlacements = rawPlacements.map((row, index) => {
  const studentName = String(row['Name'] || 'Student').trim();
  const rawCompanyName = String(row['Company Name'] || 'Company').trim();
  const designation = String(row['Designation'] || 'Employee').trim();
  const year = row['Year'] ? String(row['Year']).trim() : '2026';
  const companyWebsite = String(row['Company Website'] || '').trim();
  const logoUrl = String(row['Logo URL'] || '').trim();
  const slNo = row['SL.No'] || (index + 1);

  const cleanDomain = extractCleanDomain(companyWebsite) || 'website.com';
  const companyName = getCanonicalCompanyName(rawCompanyName, cleanDomain, companyWebsite, logoUrl);
  const studentImage = findLocalStudentImage(studentName, slNo);

  return {
    id: `placement-${index + 1}`,
    slNo,
    studentName,
    companyName,
    designation,
    year,
    type: 'Placement',
    status: 'Placed',
    sourceUrl: String(row['Source URL'] || '').trim() || null,
    companyWebsite: companyWebsite || null,
    cleanDomain,
    logoUrl: logoUrl || null,
    studentImage,
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

// Sort & Interleave Placements latest year first
normalizedPlacements.sort((a, b) => {
  const yrA = parseInt(a.year, 10) || 0;
  const yrB = parseInt(b.year, 10) || 0;
  if (yrB !== yrA) return yrB - yrA;
  return a.slNo - b.slNo;
});
const interleavedPlacements = mixAndInterleaveStudents(normalizedPlacements);

// 2. Read public/Internship Company Details - Complete.xlsx
const internshipPath = './public/Internship Company Details - Complete.xlsx';
let rawInternships = [];
if (fs.existsSync(internshipPath)) {
  const workbook = XLSX.readFile(internshipPath);
  const sheet = workbook.Sheets['Internship Company Details'] || workbook.Sheets[workbook.SheetNames[0]];
  rawInternships = XLSX.utils.sheet_to_json(sheet);
}
console.log(`Loaded ${rawInternships.length} internships from Internship Excel`);

const normalizedInternships = rawInternships.map((row, index) => {
  const studentName = String(row['Name'] || 'Student').trim();
  const registerNumber = String(row['Register Number'] || '').trim();
  const rawCompanyName = String(row['Company'] || 'Company').trim();
  const designation = String(row['Designation'] || 'Internship / Training').trim();
  const year = row['Year'] ? String(row['Year']).trim() : '2026';
  const companyWebsite = String(row['Site Link'] || '').trim();
  const logoUrl = String(row['Company Logo Image Link'] || '').trim();
  const slNo = index + 1;

  const cleanDomain = extractCleanDomain(companyWebsite) || 'website.com';
  const companyName = getCanonicalCompanyName(rawCompanyName, cleanDomain, companyWebsite, logoUrl);
  const studentImage = findLocalStudentImage(studentName, null);

  return {
    id: `internship-${index + 1}`,
    slNo,
    studentName,
    registerNumber,
    companyName,
    designation,
    year,
    type: 'Internship',
    status: 'Intern',
    sourceUrl: companyWebsite || null,
    companyWebsite: companyWebsite || null,
    cleanDomain,
    logoUrl: logoUrl || null,
    studentImage,
  };
});

// Sort & Interleave Internships latest year first
normalizedInternships.sort((a, b) => {
  const yrA = parseInt(a.year, 10) || 0;
  const yrB = parseInt(b.year, 10) || 0;
  if (yrB !== yrA) return yrB - yrA;
  return a.slNo - b.slNo;
});
const interleavedInternships = mixAndInterleaveStudents(normalizedInternships);

// Combined dataset: 1st Interleaved Placements (latest first), 2nd Interleaved Internships (latest first)
const combinedData = [...interleavedPlacements, ...interleavedInternships];

console.log(`Total combined records: ${combinedData.length} (Placements: ${interleavedPlacements.length}, Internships: ${interleavedInternships.length})`);

const code = `// Auto-generated from placements.xlsx and Internship Company Details - Complete.xlsx
export const placementsData = ${JSON.stringify(combinedData, null, 2)};
`;

const outputPath = './src/data/placementsData.js';
fs.writeFileSync(outputPath, code, 'utf-8');
console.log(`Successfully generated ${outputPath} with ${combinedData.length} total records!`);


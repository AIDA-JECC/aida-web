import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Helper to normalize batch string
function normalizeBatch(batchRaw) {
  if (!batchRaw) return '2023–2027';
  const str = String(batchRaw).trim();
  if (str.includes('2023')) return '2023–2027';
  if (str.includes('2024')) return '2024–2028';
  if (str.includes('2025')) return '2025–2029';
  if (str.includes('2026')) return '2026–2030';
  return str;
}

// Helper to normalize project type
function normalizeProjectType(typeRaw) {
  if (!typeRaw) return 'Mini Project';
  const str = String(typeRaw).trim().toLowerCase();
  if (str.includes('micro')) return 'Micro Project';
  if (str.includes('main')) return 'Main Project';
  return 'Mini Project';
}

// Helper to parse tech stack comma-separated string into clean array
function parseTechStack(techRaw) {
  if (!techRaw) return [];
  const parts = String(techRaw).split(',');
  const result = [];
  const seen = new Set();

  for (let part of parts) {
    const clean = part.trim();
    if (clean && !seen.has(clean.toLowerCase())) {
      seen.add(clean.toLowerCase());
      result.push(clean);
    }
  }
  return result;
}

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

// Read local folders
const coverFiles = fs.existsSync('./public/cover page') ? fs.readdirSync('./public/cover page') : [];
const demoFiles = fs.existsSync('./public/working demo') ? fs.readdirSync('./public/working demo') : [];

const usedCoverImages = new Set();
const usedDemoImages = new Set();

function findLocalImage(rawImgName, leaderName, regNumber, projectTitle, files, folderName, usedSet) {
  // Filter out files already taken for another project
  const availableFiles = files.filter(f => !usedSet.has(f));

  // 1. Direct filename check if rawImgName supplied
  if (rawImgName && typeof rawImgName === 'string') {
    const clean = rawImgName.trim().toLowerCase();
    const match = availableFiles.find(f => 
      f.toLowerCase() === clean || 
      f.toLowerCase().replace(/\.[^/.]+$/, '') === clean.replace(/\.[^/.]+$/, '')
    );
    if (match) {
      usedSet.add(match);
      return `/${folderName}/${encodeURIComponent(match)}`;
    }
  }

  const ignoreWords = new Set(['project', 'using', 'based', 'system', 'with', 'from', 'analysis', 'implementation', 'micro', 'main', 'mini']);
  const titleWords = projectTitle ? projectTitle.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !ignoreWords.has(w)) : [];

  const leaderLower = leaderName ? leaderName.toLowerCase().trim() : '';
  const regLower = regNumber ? regNumber.toLowerCase().trim().replace(/jec/i, '') : '';

  // 2. Student Name or Register Number + Title keyword match
  if ((leaderLower || regLower) && titleWords.length > 0) {
    const titleMatch = availableFiles.find(f => {
      const fl = f.toLowerCase();
      const matchLeader = leaderLower && leaderLower.length > 3 && fl.includes(leaderLower);
      const matchReg = regLower && regLower.length > 3 && fl.includes(regLower);
      if (!matchLeader && !matchReg) return false;
      return titleWords.some(w => fl.includes(w));
    });

    if (titleMatch) {
      usedSet.add(titleMatch);
      return `/${folderName}/${encodeURIComponent(titleMatch)}`;
    }
  }

  // 3. Fallback: Student Name or Register Number match (next available unused file)
  if (leaderLower || regLower) {
    const match = availableFiles.find(f => {
      const fl = f.toLowerCase();
      const matchLeader = leaderLower && leaderLower.length > 3 && fl.includes(leaderLower);
      const matchReg = regLower && regLower.length > 3 && fl.includes(regLower);
      return matchLeader || matchReg;
    });

    if (match) {
      usedSet.add(match);
      return `/${folderName}/${encodeURIComponent(match)}`;
    }
  }

  return null;
}

function resolveCoverImage(row, leaderName, regNumber, projectTitle) {
  const localFileName = row['Coverpage Img Names'] || row['Cover Page Img Name'] || row['Coverpage Img Name'];
  const driveUrl = row['AI generated project image reflecting your title.(for cover page of your project)'] || row['Cover Image'];
  
  const localMatch = findLocalImage(localFileName, leaderName, regNumber, projectTitle, coverFiles, 'cover page', usedCoverImages);
  if (localMatch) return localMatch;

  return parseGoogleDriveUrl(driveUrl);
}

function resolveDemoImage(row, leaderName, regNumber, projectTitle) {
  const localFileName = row['Demo Img Names'] || row['Demo Img Name'] || row['Demo Img'];
  const driveUrl = row['Project Working Demo Image '] || row['Project Working Demo Image'] || row['Demo Image'];

  const localMatch = findLocalImage(localFileName, leaderName, regNumber, projectTitle, demoFiles, 'working demo', usedDemoImages);
  if (localMatch) return localMatch;

  return parseGoogleDriveUrl(driveUrl);
}

// Read Excel file
const workbook = XLSX.readFile('./public/Academic Projects.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawRows = XLSX.utils.sheet_to_json(sheet);

console.log(`Processing ${rawRows.length} projects from Excel...`);

const normalizedProjects = rawRows.map((row, index) => {
  const title = String(row['Project Title:'] || row['Project Title'] || 'Untitled Project').trim();
  const abstract = String(row['Project Abstract / Brief Description (up to 500 words):'] || row['Project Abstract'] || '').trim();
  const batch = normalizeBatch(row['Batch year'] || row['Batch']);
  const projectType = normalizeProjectType(row['Project Type:'] || row['Project Type']);
  const techStack = parseTechStack(row['Project Area/ Tech stack (Min 4)'] || row['Tech Stack']);

  const guideName = String(row['Project Guide Name:'] || row['Project Guide Name'] || '').trim();

  // Member 1 (Leader)
  const leaderName = String(row['Member 1  (Team Leader Name) :'] || row['Member 1 (Team Leader Name)'] || row['Member 1'] || '').trim();
  const leaderReg = String(row['Register Number'] || row['Register Number 1'] || '').trim();
  const githubOrEmail = String(row['Team Leader Github Username/ Email '] || row['Team Leader Github Username'] || '').trim();

  const coverImage = resolveCoverImage(row, leaderName, leaderReg, title);
  const demoImage = resolveDemoImage(row, leaderName, leaderReg, title);

  const members = [];
  if (leaderName) {
    members.push({
      name: leaderName,
      registerNumber: leaderReg,
      isLeader: true,
    });
  }

  // Members 2 through 6
  for (let i = 2; i <= 6; i++) {
    const mName = String(row[`Member ${i}`] || '').trim();
    const mReg = String(row[`Register Number ${i}`] || row[`Register Number${i}`] || '').trim();
    if (mName) {
      members.push({
        name: mName,
        registerNumber: mReg,
        isLeader: false,
      });
    }
  }

  // GitHub formatting
  let githubUsername = null;
  let githubUrl = null;
  if (githubOrEmail) {
    if (!githubOrEmail.includes('@') && !githubOrEmail.includes(' ')) {
      githubUsername = githubOrEmail.replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');
      githubUrl = `https://github.com/${githubUsername}`;
    } else if (githubOrEmail.includes('github.com')) {
      githubUrl = githubOrEmail;
      githubUsername = githubOrEmail.split('github.com/')[1]?.replace(/\/$/, '') || 'GitHub Profile';
    }
  }

  return {
    id: `project-${index + 1}`,
    title,
    abstract,
    batch,
    projectType,
    techStack,
    coverImage,
    demoImage,
    guideName,
    members,
    githubUsername,
    githubUrl,
    contactEmail: String(row['Email Address'] || '').trim() || null,
  };
});

// Check existing data file before overwriting
if (fs.existsSync('./src/data/academicProjectsData.js')) {
  try {
    const existingFileContent = fs.readFileSync('./src/data/academicProjectsData.js', 'utf-8');
    const existingMatches = existingFileContent.match(/"id":\s*"project-\d+"/g);
    const existingCount = existingMatches ? existingMatches.length : 0;

    if (existingCount > normalizedProjects.length) {
      console.log(`Preserving src/data/academicProjectsData.js: file contains ${existingCount} projects (greater than Excel count of ${normalizedProjects.length}).`);
      process.exit(0);
    }
  } catch (err) {
    // If error reading, proceed with overwrite
  }
}

const code = `// Academic Projects Data
export const academicProjectsData = ${JSON.stringify(normalizedProjects, null, 2)};
`;

fs.writeFileSync('./src/data/academicProjectsData.js', code, 'utf-8');
console.log(`Successfully generated src/data/academicProjectsData.js with ${normalizedProjects.length} projects!`);


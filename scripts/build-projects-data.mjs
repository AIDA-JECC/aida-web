import XLSX from 'xlsx';
import fs from 'fs';

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

// Helper to resolve cover image path from local /cover page folder or Drive link
function resolveCoverImage(row) {
  const localFileName = row['Coverpage Img Names'] || row['Cover Page Img Name'] || row['Coverpage Img Name'];
  if (localFileName && typeof localFileName === 'string' && localFileName.trim()) {
    const clean = localFileName.trim();
    return `/cover page/${encodeURI(clean)}`;
  }
  return parseGoogleDriveUrl(row['AI generated project image reflecting your title.(for cover page of your project)'] || row['Cover Image']);
}

// Helper to resolve demo image path from local /working demo folder or Drive link
function resolveDemoImage(row) {
  const localFileName = row['Demo Img Names'] || row['Demo Img Name'] || row['Demo Img'];
  if (localFileName && typeof localFileName === 'string' && localFileName.trim()) {
    const clean = localFileName.trim();
    return `/working demo/${encodeURI(clean)}`;
  }
  return parseGoogleDriveUrl(row['Project Working Demo Image '] || row['Project Working Demo Image'] || row['Demo Image']);
}

// Read Excel file
const workbook = XLSX.readFile('./public/Academic Projects.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawRows = XLSX.utils.sheet_to_json(sheet);

console.log(`Processing ${rawRows.length} projects from Excel...`);

const normalizedProjects = rawRows.map((row, index) => {
  const title = (row['Project Title:'] || row['Project Title'] || 'Untitled Project').trim();
  const abstract = (row['Project Abstract / Brief Description (up to 500 words):'] || row['Project Abstract'] || '').trim();
  const batch = normalizeBatch(row['Batch year'] || row['Batch']);
  const projectType = normalizeProjectType(row['Project Type:'] || row['Project Type']);
  const techStack = parseTechStack(row['Project Area/ Tech stack (Min 4)'] || row['Tech Stack']);

  const coverImage = resolveCoverImage(row);
  const demoImage = resolveDemoImage(row);

  const guideName = (row['Project Guide Name:'] || row['Project Guide Name'] || '').trim();

  // Parse Team Members
  const members = [];

  // Member 1 (Leader)
  const leaderName = (row['Member 1  (Team Leader Name) :'] || row['Member 1 (Team Leader Name)'] || row['Member 1'] || '').trim();
  const leaderReg = (row['Register Number'] || row['Register Number 1'] || '').trim();
  const githubOrEmail = (row['Team Leader Github Username/ Email '] || row['Team Leader Github Username'] || '').trim();

  if (leaderName) {
    members.push({
      name: leaderName,
      registerNumber: leaderReg,
      isLeader: true,
    });
  }

  // Members 2 through 6
  for (let i = 2; i <= 6; i++) {
    const mName = (row[`Member ${i}`] || '').trim();
    const mReg = (row[`Register Number ${i}`] || row[`Register Number${i}`] || '').trim();
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
    contactEmail: row['Email Address'] || null,
  };
});

const code = `// Auto-generated from Academic Projects.xlsx
export const academicProjectsData = ${JSON.stringify(normalizedProjects, null, 2)};
`;

fs.writeFileSync('./src/data/academicProjectsData.js', code, 'utf-8');
console.log(`Successfully generated src/data/academicProjectsData.js with ${normalizedProjects.length} projects!`);

import { facultyData } from '../data/facultyData';

/**
 * Normalizes a name string by removing salutations (Dr, Mr, Ms, Prof),
 * stripping extra spaces and punctuation, and converting to lowercase.
 */
export function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .replace(/^(Dr|Prof|Mr|Mrs|Ms|Er)\.?\s*/gi, '')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Finds an official faculty member from facultyData matching a guide's name.
 */
export function findFacultyByGuideName(guideName) {
  if (!guideName) return null;
  const target = normalizeName(guideName);
  if (!target) return null;
  const targetTokens = target.split(' ').filter(Boolean);

  return (
    facultyData.find((f) => {
      const fName = normalizeName(f.name);
      if (fName === target || fName.includes(target) || target.includes(fName)) return true;
      const fTokens = fName.split(' ').filter(Boolean);
      return fTokens.some((t) => t.length > 3 && targetTokens.includes(t));
    }) || null
  );
}

const PROJECT_TYPE_PRIORITY = {
  'Main Project': 1,
  'Mini Project': 2,
  'Micro Project': 3,
};

/**
 * Sorts projects array so that Main Projects always take top priority,
 * followed by Mini Projects, Micro Projects, and others.
 */
export function sortProjectsByPriority(projects = []) {
  if (!Array.isArray(projects)) return [];
  return [...projects].sort((a, b) => {
    // 1. Latest Batch Year descending
    const batchYearA = parseInt((a.batch || '').match(/\d{4}/)?.[0] || '0', 10);
    const batchYearB = parseInt((b.batch || '').match(/\d{4}/)?.[0] || '0', 10);
    if (batchYearB !== batchYearA) return batchYearB - batchYearA;

    // 2. Project Type Priority (Main -> Mini -> Micro)
    const priorityA = PROJECT_TYPE_PRIORITY[a.projectType] ?? 99;
    const priorityB = PROJECT_TYPE_PRIORITY[b.projectType] ?? 99;
    if (priorityA !== priorityB) return priorityA - priorityB;

    // 3. Project ID / Index descending
    const idA = parseInt((a.id || '').replace(/\D/g, '') || '0', 10);
    const idB = parseInt((b.id || '').replace(/\D/g, '') || '0', 10);
    return idB - idA;
  });
}

/**
 * Filters projects guided by a specific faculty member and sorts them by priority.
 */
export function getProjectsByFaculty(facultyName, allProjects = []) {
  if (!facultyName) return [];
  const targetNorm = normalizeName(facultyName);
  if (!targetNorm) return [];
  const targetTokens = targetNorm.split(' ').filter(Boolean);

  const matched = allProjects.filter((project) => {
    if (!project.guideName) return false;
    const guideNorm = normalizeName(project.guideName);
    if (guideNorm === targetNorm || guideNorm.includes(targetNorm) || targetNorm.includes(guideNorm)) {
      return true;
    }
    const guideTokens = guideNorm.split(' ').filter(Boolean);
    return guideTokens.some((gt) => gt.length > 3 && targetTokens.includes(gt));
  });

  return sortProjectsByPriority(matched);
}

/**
 * Checks if a search query matches any field of a project object.
 */
export function matchesProjectSearch(project, query) {
  if (!query || typeof query !== 'string') return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;

  // Title
  if (project.title && project.title.toLowerCase().includes(q)) return true;
  // Abstract
  if (project.abstract && project.abstract.toLowerCase().includes(q)) return true;
  // Project Type
  if (project.projectType && project.projectType.toLowerCase().includes(q)) return true;
  // Batch
  if (project.batch && project.batch.toLowerCase().includes(q)) return true;
  // Guide Name
  if (project.guideName && project.guideName.toLowerCase().includes(q)) return true;
  // GitHub Username / Email
  if (project.githubUsername && project.githubUsername.toLowerCase().includes(q)) return true;
  if (project.contactEmail && project.contactEmail.toLowerCase().includes(q)) return true;

  // Tech Stack array
  if (Array.isArray(project.techStack)) {
    if (project.techStack.some((tech) => tech.toLowerCase().includes(q))) return true;
  }

  // Members & Register numbers
  if (Array.isArray(project.members)) {
    if (
      project.members.some(
        (m) =>
          (m.name && m.name.toLowerCase().includes(q)) ||
          (m.registerNumber && m.registerNumber.toLowerCase().includes(q))
      )
    ) {
      return true;
    }
  }

  return false;
}

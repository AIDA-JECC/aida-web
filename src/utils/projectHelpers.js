import { facultyData } from '../data/facultyData';

/**
 * Normalizes a name string by removing salutations (Dr, Mr, Ms, Prof),
 * stripping extra spaces and punctuation, and converting to lowercase.
 */
export function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .replace(/^(Dr|Prof|Mr|Mrs|Ms|Er)\.?\s+/i, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
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

  return (
    facultyData.find((f) => {
      const fName = normalizeName(f.name);
      return fName === target || fName.includes(target) || target.includes(fName);
    }) || null
  );
}

/**
 * Filters projects guided by a specific faculty member.
 */
export function getProjectsByFaculty(facultyName, allProjects = []) {
  if (!facultyName) return [];
  const targetNorm = normalizeName(facultyName);

  return allProjects.filter((project) => {
    if (!project.guideName) return false;
    const guideNorm = normalizeName(project.guideName);
    return guideNorm === targetNorm || guideNorm.includes(targetNorm) || targetNorm.includes(guideNorm);
  });
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

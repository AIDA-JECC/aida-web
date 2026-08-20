import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const excelPath = './public/EVENTS.xlsx';
const coverDir = './public/events/coverpage';
const galleryDir = './public/events/eventImage';
const outputPath = './src/data/officialEventsData.js';

if (!fs.existsSync(excelPath)) {
  console.error(`Error: Excel file not found at ${excelPath}`);
  process.exit(1);
}

const coverFiles = fs.existsSync(coverDir) ? fs.readdirSync(coverDir) : [];
const galleryFiles = fs.existsSync(galleryDir) ? fs.readdirSync(galleryDir) : [];

function formatCategory(typeStr) {
  if (!typeStr) return 'Event';
  const clean = String(typeStr).trim().toLowerCase();
  if (clean.includes('workshop')) return 'Workshop';
  if (clean.includes('talk') || clean.includes('expert')) return 'Technical Talk';
  if (clean.includes('bootcamp') || clean.includes('boot camp')) return 'Bootcamp';
  if (clean.includes('fdp')) return 'FDP';
  if (clean.includes('hackathon')) return 'Hackathon';
  if (clean.includes('inauguration') || clean.includes('inaugration')) return 'Inauguration';
  if (clean.includes('orientation')) return 'Orientation';
  if (clean.includes('internship')) return 'Internship';
  if (clean.includes('mou')) return 'MOU Signing';
  if (clean.includes('coding')) return 'Coding Competition';
  if (clean.includes('tharang') || clean.includes('fest')) return 'Tharang Fest';
  if (clean.includes('hands on')) return 'Hands-on Session';
  if (clean.includes('awareness') || clean.includes('awarness')) return 'Awareness Program';
  if (clean.includes('celebrartion') || clean.includes('celebration')) return 'Celebration';

  // Capitalize each word fallback
  return clean
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatExcelDate(val, academicYear) {
  if (typeof val === 'number') {
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const isoDate = date.toISOString().split('T')[0];
      return { dateLabel, eventDate: isoDate, year: date.getFullYear() };
    }
  }

  const strVal = String(val || '').trim();
  // Try extract 4-digit year from date string or academic year (e.g. 2022-23 -> 2022)
  const yearMatch = strVal.match(/\b(20\d\d)\b/) || String(academicYear || '').match(/\b(20\d\d)\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 2025;

  return {
    dateLabel: strVal || (academicYear ? `Academic Year ${academicYear}` : 'Event Date'),
    eventDate: year ? `${year}-01-01` : '2025-01-01',
    year,
  };
}

function formatExcelTime(val) {
  if (typeof val === 'number') {
    const totalMinutes = Math.round(val * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const displayMins = mins < 10 ? `0${mins}` : mins;
    return `${displayHours}:${displayMins} ${period}`;
  }
  return String(val || '').trim();
}

function findCoverImage(index) {
  const prefixDot = `${index}.`;
  const prefixSpace = `${index} `;
  const match = coverFiles.find((f) => f.startsWith(prefixDot) || f.startsWith(prefixSpace));
  if (match) {
    return `/events/coverpage/${encodeURIComponent(match)}`;
  }
  return '/events/aida-inauguration-2026.webp';
}

function findGalleryImages(index, coverImage) {
  const prefixDot = `${index}.`;
  const prefixSpace = `${index} `;
  const matches = galleryFiles.filter((f) => f.startsWith(prefixDot) || f.startsWith(prefixSpace));
  if (matches.length > 0) {
    return matches.map((f) => `/events/eventImage/${encodeURIComponent(f)}`);
  }
  return [coverImage];
}

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

console.log(`Processing ${rawRows.length} events from ${excelPath}...`);

const normalizedEvents = rawRows.map((row, i) => {
  const index = i + 1;
  const name = String(row['Event name'] || `Event ${index}`).trim().replace(/^:\s*/, '');
  const eventType = String(row['Event type'] || '').trim();
  const category = formatCategory(eventType);
  const rawDesc = String(row['description'] || '').trim().replace(/^:\s*/, '');
  const venue = String(row['venue'] || '').trim().replace(/^:\s*/, '') || 'Jyothi Engineering College';
  const academicYear = String(row['Academic Year'] || '').trim();
  const rawFocus = String(row['focus area'] || '').trim();

  const { dateLabel: rawDateLabel, eventDate, year } = formatExcelDate(row['Date'], academicYear);
  const formattedTime = formatExcelTime(row['Time']);

  const fullDateLabel = formattedTime ? `${rawDateLabel} • ${formattedTime}` : rawDateLabel;

  const tags = rawFocus
    ? rawFocus.split(/[,;]/).map((t) => t.trim()).filter(Boolean)
    : [category, 'AIDA JECC'];

  const coverImage = findCoverImage(index);
  const galleryImages = findGalleryImages(index, coverImage);

  // Slug generator
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return {
    id: `event-${index}-${slug}`,
    index,
    name,
    category,
    eventType,
    academicYear,
    year,
    dateLabel: fullDateLabel,
    rawDate: rawDateLabel,
    time: formattedTime,
    eventDate,
    status: 'Completed',
    img: coverImage,
    coverPage: coverImage,
    eventImages: galleryImages,
    gallery: galleryImages,
    detail: rawDesc || `Official ${category} organized by the Department of Artificial Intelligence & Data Science at Jyothi Engineering College.`,
    tags,
    location: venue.length > 15 ? venue : `${venue}, Jyothi Engineering College`,
    venue,
    mode: venue.toLowerCase().includes('online') || venue.toLowerCase().includes('google meet') ? 'Online' : 'On-Campus',
  };
});

// Sort events by date newest first
normalizedEvents.sort((a, b) => {
  const dateA = Date.parse(a.eventDate) || (typeof a.year === 'number' ? Date.UTC(a.year, 0, 1) : 0);
  const dateB = Date.parse(b.eventDate) || (typeof b.year === 'number' ? Date.UTC(b.year, 0, 1) : 0);
  return dateB - dateA;
});

const code = `/**
 * AUTO-GENERATED by scripts/build-events-data.mjs from public/EVENTS.xlsx.
 * Total events: ${normalizedEvents.length}
 */
export const officialEventsData = ${JSON.stringify(normalizedEvents, null, 2)};

export const officialEventCount = ${normalizedEvents.length};
`;

fs.writeFileSync(outputPath, code, 'utf-8');
console.log(`Successfully generated ${outputPath} with ${normalizedEvents.length} events!`);

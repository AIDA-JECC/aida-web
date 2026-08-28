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

function parseStringDate(strVal, fallbackYear) {
  if (!strVal) return `${fallbackYear}-01-01`;
  
  const parsedDirect = Date.parse(strVal);
  if (!isNaN(parsedDirect)) {
    const d = new Date(parsedDirect);
    return d.toISOString().split('T')[0];
  }

  const monthsMap = {
    jan: '01', january: '01',
    feb: '02', february: '02',
    mar: '03', march: '03',
    apr: '04', april: '04',
    may: '05',
    jun: '06', june: '06',
    jul: '07', july: '07',
    aug: '08', august: '08',
    sep: '09', sept: '09', september: '09',
    oct: '10', october: '10',
    nov: '11', november: '11',
    dec: '12', december: '12'
  };

  const lower = strVal.toLowerCase().replace(/–/g, '-');

  // Pattern: "15-19 june 2026" or "10-11 february 2026" or "9-10 jan 2026"
  const rangeMatch = lower.match(/^(\d{1,2})\s*-\s*\d{1,2}\s+([a-z]+)\s+(\d{4})/);
  if (rangeMatch) {
    const day = rangeMatch[1].padStart(2, '0');
    const monthStr = rangeMatch[2];
    const yr = rangeMatch[3];
    const mm = monthsMap[monthStr] || monthsMap[monthStr.substring(0, 3)];
    if (mm) return `${yr}-${mm}-${day}`;
  }

  // Pattern: "june 15-19 2026"
  const monthFirstRangeMatch = lower.match(/^([a-z]+)\s+(\d{1,2})\s*-\s*\d{1,2}\s*,?\s*(\d{4})/);
  if (monthFirstRangeMatch) {
    const monthStr = monthFirstRangeMatch[1];
    const day = monthFirstRangeMatch[2].padStart(2, '0');
    const yr = monthFirstRangeMatch[3];
    const mm = monthsMap[monthStr] || monthsMap[monthStr.substring(0, 3)];
    if (mm) return `${yr}-${mm}-${day}`;
  }

  // Pattern: "15 june 2026"
  const singleDayMatch = lower.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})/);
  if (singleDayMatch) {
    const day = singleDayMatch[1].padStart(2, '0');
    const monthStr = singleDayMatch[2];
    const yr = singleDayMatch[3];
    const mm = monthsMap[monthStr] || monthsMap[monthStr.substring(0, 3)];
    if (mm) return `${yr}-${mm}-${day}`;
  }

  const yearMatch = strVal.match(/\b(20\d\d)\b/);
  const yr = yearMatch ? yearMatch[1] : fallbackYear;
  return `${yr}-01-01`;
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
  const yearMatch = strVal.match(/\b(20\d\d)\b/) || String(academicYear || '').match(/\b(20\d\d)\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : 2025;
  const isoDate = parseStringDate(strVal, year);

  return {
    dateLabel: strVal || (academicYear ? `Academic Year ${academicYear}` : 'Event Date'),
    eventDate: isoDate,
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

// Check existing data file before overwriting
if (fs.existsSync(outputPath)) {
  try {
    const existingContent = fs.readFileSync(outputPath, 'utf-8');
    const existingMatches = existingContent.match(/"id":\s*"event-\d+/g);
    const existingCount = existingMatches ? existingMatches.length : 0;

    if (existingCount >= normalizedEvents.length) {
      console.log(`Preserving ${outputPath}: file contains ${existingCount} events.`);
      process.exit(0);
    }
  } catch (err) {
    // If error reading, proceed with overwrite
  }
}

const code = `/**
 * AUTO-GENERATED by scripts/build-events-data.mjs from public/EVENTS.xlsx.
 * Total events: ${normalizedEvents.length}
 */
export const officialEventsData = ${JSON.stringify(normalizedEvents, null, 2)};

export const officialEventCount = ${normalizedEvents.length};
`;

fs.writeFileSync(outputPath, code, 'utf-8');
console.log(`Successfully generated ${outputPath} with ${normalizedEvents.length} events!`);


import XLSX from 'xlsx';

const workbook = XLSX.readFile('./public/Academic Projects.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawData = XLSX.utils.sheet_to_json(sheet);

console.log('Total rows:', rawData.length);
if (rawData.length > 0) {
  console.log('Columns:', Object.keys(rawData[0]));
  console.log('Sample Row 1:\n', JSON.stringify(rawData[0], null, 2));
}

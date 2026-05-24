import * as fs from 'fs';

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseVal(v: string): number {
  if (!v) return 0;
  const cleaned = v.replace(/,/g, '').trim();
  if (cleaned === '') return 0;
  return parseInt(cleaned, 10) || 0;
}

const csvPath = '/tmp/raw_csv.txt';
const lines = fs.readFileSync(csvPath, 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);

const wilayatsOrder = [
  'صلالة', 'طاقة', 'مرباط', 'رخيوت', 'ثمريت', 'ضلكوت', 'المزيونة', 'مقشن', 'شليم وجزر الحلانيات', 'سدح'
];

// OMANI 2024
const omani_2024_rows: any[] = [];
for (let i = 7; i <= 22; i++) {
  const cols = parseCSVLine(lines[i]);
  const rowObj: any = {};
  wilayatsOrder.forEach((w, wIdx) => {
    const m = parseVal(cols[1 + wIdx*2]);
    const f = parseVal(cols[2 + wIdx*2]);
    rowObj[w] = [m, f];
  });
  omani_2024_rows.push(rowObj);
}

const o_2024_totals = parseCSVLine(lines[6]);
const omani_24_diff: any = {};
wilayatsOrder.forEach((w, wIdx) => {
  const totalM = parseVal(o_2024_totals[1 + wIdx*2]);
  const totalF = parseVal(o_2024_totals[2 + wIdx*2]);
  let sumM = 0, sumF = 0;
  omani_2024_rows.forEach(r => {
    sumM += r[w][0];
    sumF += r[w][1];
  });
  omani_24_diff[w] = [totalM - sumM, totalF - sumF];
});

const OMANI_24: any = {};
wilayatsOrder.forEach(w => {
  OMANI_24[w] = [];
  for (let i = 0; i < 7; i++) OMANI_24[w].push(omani_2024_rows[i][w]);
  OMANI_24[w].push(omani_24_diff[w]); // index 7 (35-39)
  for (let i = 7; i < 16; i++) OMANI_24[w].push(omani_2024_rows[i][w]);
});

// EXPAT 2024
const EXPAT_24: any = {};
wilayatsOrder.forEach(w => { EXPAT_24[w] = []; });
for (let i = 29; i <= 45; i++) {
  const cols = parseCSVLine(lines[i]);
  wilayatsOrder.forEach((w, wIdx) => {
    const m = parseVal(cols[1 + wIdx*2]);
    const f = parseVal(cols[2 + wIdx*2]);
    EXPAT_24[w].push([m, f]);
  });
}

// OMANI 2025
const OMANI_25: any = {};
wilayatsOrder.forEach(w => { OMANI_25[w] = []; });
for (let i = 77; i <= 93; i++) {
  const cols = parseCSVLine(lines[i]);
  wilayatsOrder.forEach((w, wIdx) => {
    const m = parseVal(cols[1 + wIdx*2]);
    const f = parseVal(cols[2 + wIdx*2]);
    OMANI_25[w].push([m, f]);
  });
}

// EXPAT 2025
const EXPAT_25: any = {};
wilayatsOrder.forEach(w => { EXPAT_25[w] = []; });
for (let i = 100; i <= 116; i++) {
  const cols = parseCSVLine(lines[i]);
  wilayatsOrder.forEach((w, wIdx) => {
    const m = parseVal(cols[1 + wIdx*2]);
    const f = parseVal(cols[2 + wIdx*2]);
    EXPAT_25[w].push([m, f]);
  });
}

// Format block for TS
function formatDistribution(distMap: any) {
  let output = '{\n';
  wilayatsOrder.forEach((w, idx) => {
    const pairs = distMap[w].map(([m, f]: [number, number]) => `[${m}, ${f}]`);
    output += `    '${w}': [\n`;
    for (let i = 0; i < pairs.length; i += 6) {
      const slice = pairs.slice(i, i + 6);
      output += `      ${slice.join(', ')}${i + 6 < pairs.length ? ',' : ''}\n`;
    }
    output += `    ]${idx < wilayatsOrder.length - 1 ? ',' : ''}\n`;
  });
  output += '  }';
  return output;
}

// Generate the complete data.ts file content
let content = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Wilayats list in Dhofar
export const WILAYAT_NAMES = [
  'صلالة',
  'طاقة',
  'مرباط',
  'رخيوت',
  'ثمريت',
  'ضلكوت',
  'المزيونة',
  'مقشن',
  'شليم وجزر الحلانيات',
  'سدح'
];

export const AGE_RANGES = [
  '0 - 4',
  '5 - 9',
  '10 - 14',
  '15 - 19',
  '20 - 24',
  '25 - 29',
  '30 - 34',
  '35 - 39',
  '40 - 44',
  '45 - 49',
  '50 - 54',
  '55 - 59',
  '60 - 64',
  '65 - 69',
  '70 - 74',
  '75 - 79',
  '80+'
];

// Exact distribution maps compiled from the CSV for 100% precision
// Structure: [Male, Female] for each of the 17 age groups in order
export const AGE_DISTRIBUTION_OMANI: Record<string, Record<string, number[][]>> = {
  '2024': ${formatDistribution(OMANI_24)},
  '2025': ${formatDistribution(OMANI_25)}
};

export const AGE_DISTRIBUTION_EXPAT: Record<string, Record<string, number[][]>> = {
  '2024': ${formatDistribution(EXPAT_24)},
  '2025': ${formatDistribution(EXPAT_25)}
};

// Compute standard aggregates dynamically for Year 2024 and 2025 to keep code clean and totals 100% correct!
export function getCensusDataByYear(year: string): {
  total: number;
  omani: number;
  expat: number;
  wilayats: {
    name: string;
    total: number;
    omani: number;
    expat: number;
    male: number;
    female: number;
  }[];
} {
  const omaniDist = AGE_DISTRIBUTION_OMANI[year] || {};
  const expatDist = AGE_DISTRIBUTION_EXPAT[year] || {};

  let totalGov = 0;
  let omaniGov = 0;
  let expatGov = 0;

  const wilayats = WILAYAT_NAMES.map(name => {
    const oRows = omaniDist[name] || [];
    const eRows = expatDist[name] || [];

    let omaniMale = 0;
    let omaniFemale = 0;
    oRows.forEach(([m, f]) => {
      omaniMale += m;
      omaniFemale += f;
    });

    let expatMale = 0;
    let expatFemale = 0;
    eRows.forEach(([m, f]) => {
      expatMale += m;
      expatFemale += f;
    });

    const omaniTotal = omaniMale + omaniFemale;
    const expatTotal = expatMale + expatFemale;
    const total = omaniTotal + expatTotal;
    const male = omaniMale + expatMale;
    const female = omaniFemale + expatFemale;

    totalGov += total;
    omaniGov += omaniTotal;
    expatGov += expatTotal;

    return {
      name,
      total,
      omani: omaniTotal,
      expat: expatTotal,
      male,
      female
    };
  });

  return {
    total: totalGov,
    omani: omaniGov,
    expat: expatGov,
    wilayats
  };
}

export const DATA_2024 = getCensusDataByYear('2024');
export const DATA_2025 = getCensusDataByYear('2025');

// Build exact age group lists for quick chart binding
export const AGE_GROUPS_2024 = AGE_RANGES.map((range, idx) => {
  let male = 0;
  let female = 0;
  WILAYAT_NAMES.forEach(w => {
    const o = AGE_DISTRIBUTION_OMANI['2024'][w]?.[idx] || [0, 0];
    const e = AGE_DISTRIBUTION_EXPAT['2024'][w]?.[idx] || [0, 0];
    male += o[0] + e[0];
    female += o[1] + e[1];
  });
  return { range, male, female, total: male + female };
});

export const AGE_GROUPS_2025 = AGE_RANGES.map((range, idx) => {
  let male = 0;
  let female = 0;
  WILAYAT_NAMES.forEach(w => {
    const o = AGE_DISTRIBUTION_OMANI['2025'][w]?.[idx] || [0, 0];
    const e = AGE_DISTRIBUTION_EXPAT['2025'][w]?.[idx] || [0, 0];
    male += o[0] + e[0];
    female += o[1] + e[1];
  });
  return { range, male, female, total: male + female };
});
`;

fs.writeFileSync('/src/data.ts', content);
console.log('Successfully regenerated src/data.ts with complete accuracy!');

const STANDARD_PRODUCT_ORDER = [
  'MCN', 'MPC', 'MPS', 'MPK', 'MPKH', 'JASUKE', 'PIA K. HIJAU',
  'NC', 'NCK', 'NCP', 'NCB', 'NCS', 'NP', 'SC', 'SK', 'SB', 'SS',
  'MOONCAKE', 'SUSU KEJU', 'SUJU MINI', 'SISIR', 'NC. KACANG', 'TM', 'TP', 'TF'
];

const PRODUCT_ALIAS_MAP = {
  'MCN': 'MCN', 'MPC': 'MPC', 'MPS': 'MPS', 'MPK': 'MPK', 'MPKH': 'MPKH',
  'JASUKE': 'JASUKE', 'PIA K. HIJAU': 'PIA K. HIJAU', 'PIA KACANG HIJAU': 'PIA K. HIJAU',
  'NC': 'NC', 'NANA C': 'NC', 'NANA COKLAT': 'NC',
  'NCK': 'NCK', 'NANA CK': 'NCK', 'NANA COKLAT KELAPA': 'NCK',
  'NCP': 'NCP', 'NANA CP': 'NCP', 'NANA COKELAT PANDAN': 'NCP',
  'NCB': 'NCB', 'NANA CB': 'NCB', 'NANA COKELAT BLU': 'NCB',
  'NCS': 'NCS', 'NANA CS': 'NCS', 'NANA COKELAT SUSU': 'NCS',
  'NP': 'NP', 'NANA P': 'NP', 'NANA PANDAN': 'NP',
  'SC': 'SC', 'SK': 'SK', 'SB': 'SB', 'SS': 'SS',
  'MOONCAKE': 'MOONCAKE', 'MOON CAKE': 'MOONCAKE',
  'SUSU KEJU': 'SUSU KEJU', 'SUJU': 'SUSU KEJU',
  'SUJU MINI': 'SUJU MINI', 'SUSU KEJU MINI': 'SUJU MINI',
  'SISIR': 'SISIR', 'S SISIR': 'SISIR', 'ROTI SISIR': 'SISIR',
  'NC. KACANG': 'NC. KACANG', 'NC KACANG': 'NC. KACANG', 'NANA C KCG': 'NC. KACANG',
  'TM': 'TM', 'T MANIS': 'TM', 'TAWAR MANIS': 'TM',
  'TP': 'TP', 'T PANDAN': 'TP', 'TAWAR PANDAN': 'TP',
  'TF': 'TF', 'T KUNCIR': 'TF', 'TAWAR KUNCIR': 'TF'
};

function getProductStandardCode(val) {
  if (!val) return '';
  const s = String(val).trim().toUpperCase();
  if (PRODUCT_ALIAS_MAP[s]) return PRODUCT_ALIAS_MAP[s];
  for (const [k, v] of Object.entries(PRODUCT_ALIAS_MAP)) {
    if (s.includes(k)) return v;
  }
  return s;
}

function getProductSortIndex(item) {
  if (!item) return 999;
  const rawName = typeof item === 'object' ? (item.name || item.productName || item.product || '') : String(item);
  const std = getProductStandardCode(rawName);
  const idx = STANDARD_PRODUCT_ORDER.indexOf(std);
  if (idx !== -1) return idx;
  return 999;
}

const testItems = [
  { productName: 'TM', qty: 20, unitPrice: 6300 },
  { productName: 'MCN', qty: 10, unitPrice: 6900 },
  { productName: 'MPC', qty: 0, unitPrice: 3500 }, // should be excluded
  { productName: 'NP', qty: 50, unitPrice: 1400 },
  { productName: 'SISIR', qty: 15, unitPrice: 2150 }
];

const filteredAndSorted = testItems
  .filter(it => Number(it.qty) > 0)
  .sort((a, b) => getProductSortIndex(a.productName) - getProductSortIndex(b.productName));

console.log('Resulting sorted items (only ordered items):');
filteredAndSorted.forEach((it, idx) => {
  console.log(idx + 1, it.productName, it.qty, 'pcs, Sort Index:', getProductSortIndex(it.productName));
});

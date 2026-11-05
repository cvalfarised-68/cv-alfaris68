const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const stdOrder = [
  'MCN', 'MPC', 'MPS', 'MPK', 'MPKH', 'JASUKE', 'PIA K. HIJAU',
  'NC', 'NCK', 'NCP', 'NCB', 'NCS', 'NP', 'SC', 'SK', 'SB', 'SS',
  'MOONCAKE', 'SUSU KEJU', 'SUJU MINI', 'SISIR', 'NC. KACANG', 'TM', 'TP', 'TF'
];

console.log('Total items in list:', stdOrder.length);
let missing = 0;
stdOrder.forEach((name, i) => {
  if (!content.includes(name)) {
    console.error('Missing in index.html:', name);
    missing++;
  } else {
    console.log(`[${i+1}] ${name} OK`);
  }
});

if (missing === 0) {
  console.log('ALL 25 PRODUCTS VERIFIED SUCCESSFULLY!');
}

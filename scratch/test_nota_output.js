const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const regex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let fullScript = '';
while ((m = regex.exec(content)) !== null) {
  if (m[1].includes('function buildNotaHTML')) {
    fullScript = m[1];
    break;
  }
}

const vm = require('vm');
const context = {
  console,
  setTimeout,
  clearTimeout, setInterval: () => {}, clearInterval: () => {},
  document: { addEventListener: () => {},
    getElementById: () => null,
    createElement: () => ({ id: '', innerHTML: '' }),
    head: { appendChild: () => {} }
  },
  window: { addEventListener: () => {} },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  }
};
vm.createContext(context);
vm.runInContext(fullScript, context);

const testTrx = {
  id: 'TRX-2026-9999',
  date: '2026-11-05',
  salesName: 'Pak Faizun',
  salesRoute: 'Rute Bebas Singosari',
  salesPhone: '0812-3456-7890',
  tierName: '1. Sales Besar (+25%)',
  paymentMethod: 'menunggu_setoran',
  paymentStatus: 'belum_lunas',
  deliveryStatus: 'menunggu_setoran',
  totalQty: 270,
  totalAmount: 646000,
  items: [
    { productName: 'TM', qty: 20, unitPrice: 6300, subtotal: 126000 },
    { productName: 'MCN', qty: 0, unitPrice: 6900, subtotal: 0 }, // 0 qty, should NOT appear
    { productName: 'MPS', qty: 200, unitPrice: 3500, subtotal: 700000 },
    { productName: 'NP', qty: 50, unitPrice: 1400, subtotal: 70000 }
  ]
};

const html = context.buildNotaHTML(testTrx);
console.log('--- GENERATED NOTA HTML ---');
console.log(html);

console.log('\n--- VERIFICATION CHECKS ---');
console.log('1. Contains NOTA PENJUALAN SALES?', html.includes('NOTA PENJUALAN SALES'));
console.log('2. Does NOT contain SURAT JALAN?', !html.includes('SURAT JALAN'));
console.log('3. Contains Sales (Penerima): Pak Faizun?', html.includes('Pak Faizun'));
console.log('4. Does NOT contain Penerima Toko in signature?', !html.includes('Penerima Toko'));
console.log('5. Does NOT contain MCN (qty 0)?', !html.includes('MCN'));
console.log('6. Contains MPS, NP, TM?', html.includes('MPS') && html.includes('NP') && html.includes('TM'));

const posMPS = html.indexOf('MPS');
const posNP = html.indexOf('NP');
const posTM = html.indexOf('TM');
console.log('7. Sequence order MPS < NP < TM?', (posMPS < posNP) && (posNP < posTM), `(${posMPS} < ${posNP} < ${posTM})`);
console.log('8. A5 width styling present?', html.includes('max-width: 148mm'));

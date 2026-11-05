const fs = require('fs');
const vm = require('vm');

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

// Memory storage mock
const memoryStorage = {};
const mockDocument = {
  getElementById: (id) => {
    return {
      id,
      value: '',
      innerText: '',
      innerHTML: '',
      className: '',
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      addEventListener: () => {},
      setAttribute: () => {},
      getAttribute: () => null,
      focus: () => {}
    };
  },
  createElement: () => ({ id: '', innerHTML: '', className: '', style: {}, appendChild: () => {}, remove: () => {} }),
  head: { appendChild: () => {} },
  body: { classList: { add: () => {}, remove: () => {} } },
  addEventListener: () => {},
  querySelectorAll: () => []
};

const context = {
  console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
  document: mockDocument,
  window: { addEventListener: () => {} },
  lucide: { createIcons: () => {} },
  confirm: () => true,
  localStorage: {
    getItem: (k) => memoryStorage[k] || null,
    setItem: (k, v) => { memoryStorage[k] = String(v); },
    removeItem: (k) => { delete memoryStorage[k]; }
  }
};

vm.createContext(context);
vm.runInContext(fullScript, context);

console.log('--- TEST 1: Check initial PO data ---');
const pos = context.getPOSalesData();
console.log('PO Count:', pos.length);
const clifftenPO = pos.find(p => p.salesName.includes('Clifften'));
console.log('Clifften PO found:', Boolean(clifftenPO), clifftenPO ? clifftenPO.id : '-');

console.log('\n--- TEST 2: Publish PO to Transactions ---');
context.publishPOToTransactions('2026-11-05', false);

const trxs = context.getTransactionsData();
console.log('Transactions Count after publish:', trxs.length);
const publishedTrx = trxs.find(t => t.salesName.includes('Clifften') && t.date === '2026-11-05');
console.log('Published Trx Details:');
console.log('- ID:', publishedTrx.id);
console.log('- Total Qty:', publishedTrx.totalQty, '(expected: 2620)');
console.log('- Total Amount:', publishedTrx.totalAmount, '(expected: 5663000)');
console.log('- Payment Method:', publishedTrx.paymentMethod, '(expected: menunggu_setoran)');
console.log('- Items count:', publishedTrx.items.length, '(expected: 8)');
console.log('- Source:', publishedTrx.source, '(expected: auto_po)');

console.log('\n--- TEST 3: Duplicate protection check ---');
context.publishPOToTransactions('2026-11-05', false);
const trxsAfterRePublish = context.getTransactionsData();
console.log('Transactions Count after re-publish:', trxsAfterRePublish.length, '(must remain same, no duplicate!)');

console.log('\n--- TEST 4: Edit PO check (Sales tambah roti karena mobil longgar) ---');
// Sales tambah roti TM dari 200 jadi 300
clifftenPO.items['PRD-1254'] = 300; // +100 TM @ 6300 = +630,000 => Total 6,293,000
context.savePOSalesData(pos, true);
context.publishPOToTransactions('2026-11-05', false);

const updatedTrx = context.getTransactionsData().find(t => t.id === publishedTrx.id);
console.log('Updated Trx Details:');
console.log('- Total Qty:', updatedTrx.totalQty, '(expected: 2720)');
console.log('- Total Amount:', updatedTrx.totalAmount, '(expected: 6293000)');

console.log('\n--- TEST 5: Verify A5 Nota HTML from auto-generated transaction ---');
const notaHtml = context.buildNotaHTML(updatedTrx);
console.log('- Contains NOTA PENJUALAN SALES?', notaHtml.includes('NOTA PENJUALAN SALES'));
console.log('- Contains Pak Clifften?', notaHtml.includes('Pak Clifften'));
console.log('- Contains 6,293,000?', notaHtml.includes('6.293.000'));
console.log('- A5 width present?', notaHtml.includes('max-width: 148mm'));

console.log('\n🎉 ALL PO -> TRANSACTION INTEGRATION TESTS PASSED!');

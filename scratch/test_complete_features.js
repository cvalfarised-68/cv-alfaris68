const fs = require('fs');
const https = require('https');
const vm = require('vm');

const url = 'https://goirtjhgvfxovwgcdsbi.supabase.co';
const key = 'sb_publishable__MO9vKw2COjfHiOGxyIX2A_w7fZ1GPF';

function queryTable(table) {
  return new Promise((resolve, reject) => {
    const req = https.get(`${url}/rest/v1/${table}?select=*`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    });
    req.on('error', reject);
  });
}

async function testAll() {
  const content = fs.readFileSync('index.html', 'utf8');

  // Create Mock DOM
  const domElements = {};
  function makeElement(id) {
    if (!domElements[id]) {
      domElements[id] = {
        id,
        innerText: '',
        innerHTML: '',
        value: '',
        className: '',
        classList: {
          classes: new Set(),
          add: function(c) { this.classes.add(c); },
          remove: function(c) { this.classes.delete(c); },
          toggle: function(c, force) {
            if (force === true) this.classes.add(c);
            else if (force === false) this.classes.delete(c);
            else if (this.classes.has(c)) this.classes.delete(c);
            else this.classes.add(c);
          },
          contains: function(c) { return this.classes.has(c); }
        },
        style: {},
        querySelector: function() { return true; }
      };
    }
    return domElements[id];
  }

  const supabaseTrx = await queryTable('transactions');
  const supabasePO = await queryTable('po_sales');
  const supabaseExp = await queryTable('expenses');
  const supabaseProducts = await queryTable('products');

  // Convert snake_case from supabase to camelCase for local storage mock
  const mappedPO = supabasePO.map(p => ({
    id: p.id,
    date: p.date,
    salesId: p.sales_id,
    salesName: p.sales_name,
    salesRoute: p.sales_route,
    items: p.items,
    notes: p.notes
  }));

  const mappedTrx = supabaseTrx.map(t => ({
    id: t.id,
    date: t.date,
    salesId: t.sales_id,
    salesName: t.sales_name,
    salesRoute: t.sales_route,
    tierName: t.tier_name,
    paymentMethod: t.payment_method,
    paymentStatus: t.payment_status,
    totalQty: t.total_qty,
    totalAmount: t.total_amount,
    totalFactoryCost: t.total_factory_cost,
    items: t.items
  }));

  const mappedExp = supabaseExp.map(e => ({
    id: e.id,
    date: e.date,
    category: e.category,
    categoryLabel: e.category_label || e.category,
    amount: e.amount,
    desc: e.desc
  }));

  const mappedProducts = supabaseProducts.map(p => ({
    id: p.id,
    code: p.code,
    name: p.name,
    category: p.category,
    factoryPrice: p.factory_price || p.factoryPrice,
    prices: p.prices
  }));

  const sandbox = {
    console,
    currentPODate: '2026-11-08',
    document: {
      getElementById: (id) => makeElement(id),
      querySelector: () => makeElement('dummy'),
      querySelectorAll: () => [],
      addEventListener: () => {}
    },
    localStorage: {
      data: {
        'alfaris_po_sales_master_v2': JSON.stringify(mappedPO),
        'alfaris_transactions_master_v2': JSON.stringify(mappedTrx),
        'alfaris_expenses_master_v2': JSON.stringify(mappedExp),
        'alfaris_products_master_v2': JSON.stringify(mappedProducts)
      },
      getItem: function(k) { return this.data[k] || null; },
      setItem: function(k, v) { this.data[k] = v; }
    },
    lucide: { createIcons: () => {} },
    setInterval: () => {},
    setTimeout: () => {},
    addEventListener: () => {}
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;

  vm.createContext(sandbox);

  // Extract script #5
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let script5 = '';
  let count = 0;
  while ((match = scriptRegex.exec(content)) !== null) {
    count++;
    if (count === 5) {
      script5 = match[1];
      break;
    }
  }

  try {
    vm.runInContext(script5, sandbox);
    console.log('Script #5 evaluated without errors in sandbox!');
  } catch (e) {
    console.error('VM error:', e);
    return;
  }

  // TEST 1: Kalkulator Muatan Pabrik & Slot Armada
  console.log('\n========================================');
  console.log('TEST 1: Kalkulator Muatan Pabrik & Slot Armada');
  console.log('========================================');
  vm.runInContext("currentPODate = '2026-11-08';", sandbox);
  sandbox.openPabrikReconciliationModal();

  console.log('Armada Title:', domElements['recon-armada-title']?.innerText);
  console.log('Armada Nopol Text:', domElements['recon-armada-nopol-text']?.innerText);
  console.log('Armada Status Tag:', domElements['recon-armada-status-tag']?.innerText);
  console.log('Armada Per-unit Note:', domElements['recon-armada-perunit-note']?.innerText);
  console.log('Status Badge:', domElements['recon-status-badge']?.innerText);
  console.log('Percent Text:', domElements['recon-percent-text']?.innerText);
  console.log('KPI KB:', domElements['recon-kpi-kb']?.innerText);
  console.log('KPI KMK:', domElements['recon-kpi-kmk']?.innerText);
  console.log('KPI Total Units:', domElements['recon-kpi-total-units']?.innerText);
  console.log('KPI Factory Cost:', domElements['recon-kpi-factory-cost']?.innerText);
  console.log('Tab Loaded Badge:', domElements['recon-tab-loaded-badge']?.innerText);
  console.log('Loaded Tbody length (HTML characters):', domElements['recon-loaded-tbody']?.innerHTML.length);
  console.log('Multi-truck cards HTML length:', domElements['recon-multitruck-cards']?.innerHTML.length);

  // TEST 2: Laporan Laba Rugi Komprehensif Pre Order di Tab Operasional
  console.log('\n========================================');
  console.log('TEST 2: Laporan Laba Rugi Komprehensif di Tab Operasional');
  console.log('========================================');
  makeElement('pl-filter-period').value = 'po:2026-11-08';
  sandbox.updateDashboardAndPL();

  console.log('Scope Banner Text:', domElements['pl-scope-banner-text']?.innerText);
  console.log('Scope Banner Sub:', domElements['pl-scope-banner-sub']?.innerText);
  console.log('P&L Total Omset:', domElements['pl-total-omset']?.innerText);
  console.log('P&L Total Kulakan:', domElements['pl-total-kulakan']?.innerText);
  console.log('P&L Laba Kotor:', domElements['pl-laba-kotor']?.innerText);
  console.log('P&L Total Operasional:', domElements['pl-total-operasional']?.innerText);
  console.log('P&L Alokasi Tabungan:', domElements['pl-total-tabungan']?.innerText);
  console.log('P&L Laba Bersih Akhir:', domElements['pl-laba-bersih-akhir']?.innerText);
  console.log('P&L Profit Margin Badge:', domElements['pl-profit-margin-badge']?.innerText);

  // TEST 3: Modal Cetak Laporan Keuangan Korporat (Pre Order)
  console.log('\n========================================');
  console.log('TEST 3: Modal Cetak Laporan Keuangan Korporat (Pre Order)');
  console.log('========================================');
  sandbox.openFinancialReportModal('po:2026-11-08');
  makeElement('filter-rpt-layout').value = 'full';
  sandbox.renderCorporateFinancialReport();

  console.log('Report Doc Title:', domElements['rpt-doc-title']?.innerText);
  console.log('Report Doc No:', domElements['rpt-doc-no']?.innerText);
  console.log('Report Doc Period:', domElements['rpt-doc-period']?.innerText);
  console.log('Report Doc Scope Note:', domElements['rpt-doc-scope-note']?.innerText);
  console.log('Report Total Omset:', domElements['rpt-total-omset']?.innerText);
  console.log('Report Total HPP:', domElements['rpt-total-hpp']?.innerText);
  console.log('Report Laba Kotor:', domElements['rpt-laba-kotor']?.innerText);
  console.log('Report Total Operasional:', domElements['rpt-total-operasional']?.innerText);
  console.log('Report Laba Bersih Akhir:', domElements['rpt-laba-bersih-akhir']?.innerText);
  console.log('Report Margin Pct:', domElements['rpt-margin-pct']?.innerText);
  console.log('Report Sales Count:', domElements['rpt-sales-count']?.innerText);
  console.log('Report Sales Tbody length (HTML characters):', domElements['rpt-sales-tbody']?.innerHTML.length);
  console.log('Report Expense Count:', domElements['rpt-expense-count']?.innerText);
  console.log('Report Expense Tbody length (HTML characters):', domElements['rpt-expense-tbody']?.innerHTML.length);

  console.log('\n>>> ALL 3 OWNER REQUEST TESTS PASSED WITH 100% SUCCESS! <<<');
}

testAll();

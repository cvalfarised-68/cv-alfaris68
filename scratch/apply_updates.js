const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// --- 1. CSS PRINT FOR PO CARD ---
const cssTarget = `      body.printing-nota #print-area-nota {
        position: static !important;
        display: block !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #0f172a !important;
      }`;

const cssReplacement = `      body.printing-nota #print-area-nota {
        position: static !important;
        display: block !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #0f172a !important;
      }

      /* Mode Cetak Kartu Rekap Pre-Order Sales (Per Sales / Format Fisik) */
      body.printing-po-card #print-area-po-card, 
      body.printing-po-card #print-area-po-card * {
        visibility: visible !important;
      }
      body.printing-po-card #print-area-po-card {
        position: static !important;
        display: block !important;
        width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #0f172a !important;
      }`;

if (!content.includes(cssTarget)) {
  console.error('Error: cssTarget not found!');
  process.exit(1);
}
content = content.replace(cssTarget, cssReplacement);
console.log('✓ Print CSS updated');

// --- 2. HIDDEN PRINT CONTAINER FOR PO CARD ---
const containerTarget = `  <!-- ROOT PRINT CONTAINER UNTUK SURAT JALAN & NOTA DROP ROTI SALES -->
  <div id="print-area-nota" class="hidden"></div>`;

const containerReplacement = `  <!-- ROOT PRINT CONTAINER UNTUK SURAT JALAN & NOTA DROP ROTI SALES -->
  <div id="print-area-nota" class="hidden"></div>

  <!-- ROOT PRINT CONTAINER UNTUK KARTU REKAP PRE-ORDER SALES (FORMAT FISIK) -->
  <div id="print-area-po-card" class="hidden"></div>`;

if (!content.includes(containerTarget)) {
  console.error('Error: containerTarget not found!');
  process.exit(1);
}
content = content.replace(containerTarget, containerReplacement);
console.log('✓ Hidden print container added');

// --- 3. TOOLBAR PO SALES BUTTONS ---
const toolbarTarget = `            <button 
              onclick="printPORecap()" 
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 shadow-sm transition">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>Cetak Rekap</span>
            </button>`;

const toolbarReplacement = `            <button 
              onclick="printPORecap()" 
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 shadow-sm transition"
              title="Cetak Tabel Matriks PO Seluruh Sales untuk Pabrik">
              <i data-lucide="table" class="w-4 h-4"></i>
              <span>Cetak Matriks</span>
            </button>

            <button 
              onclick="printAllPOSalesCardsOnDate()" 
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
              title="Cetak Semua Kartu Rekap PO Sales Sesuai Format Fisik Pabrik">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>Cetak Kartu PO Sales</span>
            </button>`;

if (!content.includes(toolbarTarget)) {
  console.error('Error: toolbarTarget not found!');
  process.exit(1);
}
content = content.replace(toolbarTarget, toolbarReplacement);
console.log('✓ PO toolbar updated');

// --- 4. ACTION BUTTONS IN PO MATRIX ROW ---
const matrixRowTarget = `            <td class="py-3 px-3.5 text-center whitespace-nowrap">
              <button onclick="editPOSales('\${po.id}')" class="p-1 rounded text-slate-500 hover:text-brand-600 transition" title="Edit PO">
                <i data-lucide="edit-3" class="w-3.5 h-3.5 inline"></i>
              </button>
              <button onclick="deletePOSales('\${po.id}')" class="p-1 rounded text-slate-400 hover:text-rose-600 transition" title="Hapus">
                <i data-lucide="trash-2" class="w-3.5 h-3.5 inline"></i>
              </button>
            </td>`;

const matrixRowReplacement = `            <td class="py-3 px-3.5 text-center whitespace-nowrap">
              <button onclick="openPOCardModal('\${po.id}')" class="p-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition font-bold text-[11px] inline-flex items-center gap-1 border border-blue-200 cursor-pointer" title="Lihat & Cetak Kartu Rekap PO Sesuai Format Fisik">
                <i data-lucide="printer" class="w-3 h-3 inline"></i>
                <span>Kartu PO</span>
              </button>
              <button onclick="editPOSales('\${po.id}')" class="p-1 rounded text-slate-500 hover:text-brand-600 transition" title="Edit PO">
                <i data-lucide="edit-3" class="w-3.5 h-3.5 inline"></i>
              </button>
              <button onclick="deletePOSales('\${po.id}')" class="p-1 rounded text-slate-400 hover:text-rose-600 transition" title="Hapus">
                <i data-lucide="trash-2" class="w-3.5 h-3.5 inline"></i>
              </button>
            </td>`;

if (!content.includes(matrixRowTarget)) {
  console.error('Error: matrixRowTarget not found!');
  process.exit(1);
}
content = content.replace(matrixRowTarget, matrixRowReplacement);
console.log('✓ PO matrix row action buttons updated');

// --- 5. MODAL PREVIEW KARTU REKAP PO SALES ---
const modalTarget = `  <!-- MODAL KONFIRMASI SETORAN SALES (HASIL DROP DARI TOKO) -->`;

const modalReplacement = `  <!-- MODAL PREVIEW KARTU REKAP PRE-ORDER SALES (FORMAT FISIK SESUAI CONTOH) -->
  <div id="modal-po-card-preview" class="hidden fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 modal-backdrop">
    <div class="bg-white rounded-2xl max-w-xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
      <!-- Modal Header -->
      <div class="p-3.5 sm:p-4 border-b flex justify-between items-center bg-slate-900 text-white">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            <i data-lucide="clipboard-list" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>Kartu Rekap Pre-Order Sales</span>
              <span id="preview-po-card-title-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">PO-SALES</span>
            </h3>
            <p class="text-[11px] text-slate-300">Format Cetak Standar 25 Varian Roti CV. Alfaris Enam Delapan</p>
          </div>
        </div>
        <button onclick="closePOCardModal()" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Sheet Content (Tampilan Fisik Kartu Sesuai Gambar) -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 flex justify-center items-start">
        <div id="po-card-preview-sheet" class="shadow-lg bg-white rounded">
          <!-- Rendered by buildPOSalesCardHTML -->
        </div>
      </div>

      <!-- Footer Modal Actions -->
      <div class="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <button onclick="closePOCardModal()" class="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition">
          Tutup
        </button>
        <div class="flex items-center gap-2">
          <button onclick="printActivePOCard()" class="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition inline-flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>Cetak Kartu PO (Printer / PDF)</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL KONFIRMASI SETORAN SALES (HASIL DROP DARI TOKO) -->`;

if (!content.includes(modalTarget)) {
  console.error('Error: modalTarget not found!');
  process.exit(1);
}
content = content.replace(modalTarget, modalReplacement);
console.log('✓ PO card preview modal added');

// --- 6. STANDARD PRODUCTS & DATA ORDER ---
const startDefaultProductsIdx = content.indexOf('const DEFAULT_PO_SALES = [];');
const endDefaultProductsIdx = content.indexOf('const DEFAULT_TRANSACTIONS = [];');

if (startDefaultProductsIdx === -1 || endDefaultProductsIdx === -1) {
  console.error('Error: DEFAULT_PO_SALES / DEFAULT_TRANSACTIONS anchor not found!');
  process.exit(1);
}

const standardCatalogCode = `// URUTAN BAKU 25 PRODUK ROTI STANDAR CV. ALFARIS ENAM DELAPAN
    const STANDARD_PRODUCT_ORDER = [
      'MCN', 'MPC', 'MPS', 'MPK', 'MPKH', 'JASUKE', 'PIA K. HIJAU',
      'NC', 'NCK', 'NCP', 'NCB', 'NCS', 'NP', 'SC', 'SK', 'SB', 'SS',
      'MOONCAKE', 'SUSU KEJU', 'SUJU MINI', 'SISIR', 'NC. KACANG', 'TM', 'TP', 'TF'
    ];

    // Pemetaan Alias Singkatan & Nama Lengkap ke Kode Standar
    const PRODUCT_ALIAS_MAP = {
      'MCN': 'MCN',
      'MPC': 'MPC',
      'MPS': 'MPS',
      'MPK': 'MPK',
      'MPKH': 'MPKH',
      'JASUKE': 'JASUKE',
      'PIA K. HIJAU': 'PIA K. HIJAU',
      'PIA KACANG HIJAU': 'PIA K. HIJAU',
      'PIA': 'PIA K. HIJAU',
      'NC': 'NC',
      'NANA C': 'NC',
      'NANA COKLAT': 'NC',
      'NCK': 'NCK',
      'NANA CK': 'NCK',
      'NANA COKLAT KELAPA': 'NCK',
      'NCP': 'NCP',
      'NANA CP': 'NCP',
      'NANA COKELAT PANDAN': 'NCP',
      'NCB': 'NCB',
      'NANA CB': 'NCB',
      'NANA COKELAT BLU': 'NCB',
      'NCS': 'NCS',
      'NANA CS': 'NCS',
      'NANA COKELAT SUSU': 'NCS',
      'NP': 'NP',
      'NANA P': 'NP',
      'NANA PANDAN': 'NP',
      'SC': 'SC',
      'SK': 'SK',
      'SB': 'SB',
      'SS': 'SS',
      'MOONCAKE': 'MOONCAKE',
      'MOON CAKE': 'MOONCAKE',
      'SUSU KEJU': 'SUSU KEJU',
      'SUJU': 'SUSU KEJU',
      'SUJU MINI': 'SUJU MINI',
      'SUSU KEJU MINI': 'SUJU MINI',
      'SISIR': 'SISIR',
      'S SISIR': 'SISIR',
      'ROTI SISIR': 'SISIR',
      'NC. KACANG': 'NC. KACANG',
      'NC KACANG': 'NC. KACANG',
      'NANA C KCG': 'NC. KACANG',
      'NANA COKELAT KACANG': 'NC. KACANG',
      'TM': 'TM',
      'T MANIS': 'TM',
      'TAWAR MANIS': 'TM',
      'TP': 'TP',
      'T PANDAN': 'TP',
      'TAWAR PANDAN': 'TP',
      'TF': 'TF',
      'T KUNCIR': 'TF',
      'TAWAR KUNCIR': 'TF',
      'TAWAR FAMILY': 'TF',
      'T FAMILY': 'TF'
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
      const code = (typeof item === 'object' ? item.code : '') || '';
      const m = code.match(/^ROTI-(\\d+)$/i);
      if (m) {
        const num = parseInt(m[1], 10);
        if (num >= 1 && num <= 25) return num - 1;
      }
      const rawName = typeof item === 'object' ? (item.name || item.productName || item.product || '') : String(item);
      const std = getProductStandardCode(rawName);
      const idx = STANDARD_PRODUCT_ORDER.indexOf(std);
      if (idx !== -1) return idx;
      return 999;
    }

    function sortProductsByStandardOrder(list) {
      if (!Array.isArray(list)) return [];
      return [...list].sort((a, b) => {
        const idxA = getProductSortIndex(a);
        const idxB = getProductSortIndex(b);
        if (idxA !== idxB) return idxA - idxB;
        const nameA = (a.name || a.productName || '').toLowerCase();
        const nameB = (b.name || b.productName || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    // Inisialisasi State Awal Default Aplikasi
    const DEFAULT_PO_SALES = [
      {
        id: 'PO-6064',
        date: '2026-11-05',
        salesId: 'SLS-6064',
        salesName: 'Pak Clifften',
        salesRoute: 'Rute Bebas',
        items: {
          'PRD-1607': 200, // MPS
          'PRD-9068': 800, // NC (NANA C)
          'PRD-9030': 400, // NCK (NANA CK)
          'PRD-2002': 400, // NCP (Nana CP)
          'PRD-4489': 200, // NCB (NANA CB)
          'PRD-4776': 200, // NCS (NANA CS)
          'PRD-9544': 420, // SISIR (S Sisir)
          'PRD-1254': 200  // TM (T MANIS)
        },
        notes: 'Rekap PO Sales Harian P Clifften'
      }
    ];
    const DEFAULT_EXPENSES = [];
    const DEFAULT_TOKO = [
      { id: 'TKO-003', name: 'Toko Rejeki Singosari', pic: 'Pak Bambang', phone: '082199887766', route: 'Singosari - Lawang', salesName: 'Rian Dani', lastVisitDate: '2026-11-03' }
    ];
    const DEFAULT_RETUR = [];
    const DEFAULT_SALES = [];
    const DEFAULT_PRODUCTS = [
      { id: 'PRD-3646', code: 'ROTI-01', name: 'MCN', category: 'Roti Manis', stock: 100, factoryPrice: 6500, prices: { level1: 6900, level2: 7100, level3: 7200, level4: 7500, level5: 7100, level6: 6800 } },
      { id: 'PRD-5968', code: 'ROTI-02', name: 'MPC', category: 'Roti Manis', stock: 100, factoryPrice: 3350, prices: { level1: 3500, level2: 3600, level3: 3650, level4: 3850, level5: 3600, level6: 3500 } },
      { id: 'PRD-1607', code: 'ROTI-03', name: 'MPS', category: 'Roti Manis', stock: 100, factoryPrice: 3350, prices: { level1: 3500, level2: 3600, level3: 3650, level4: 3850, level5: 3600, level6: 3500 } },
      { id: 'PRD-6229', code: 'ROTI-04', name: 'MPK', category: 'Roti Manis', stock: 100, factoryPrice: 3350, prices: { level1: 3500, level2: 3600, level3: 3650, level4: 3850, level5: 3600, level6: 3500 } },
      { id: 'PRD-2217', code: 'ROTI-05', name: 'MPKH', category: 'Roti Manis', stock: 100, factoryPrice: 3350, prices: { level1: 3500, level2: 3600, level3: 3650, level4: 3850, level5: 3600, level6: 3500 } },
      { id: 'PRD-0595', code: 'ROTI-06', name: 'JASUKE', category: 'Roti Manis', stock: 100, factoryPrice: 3350, prices: { level1: 3500, level2: 3600, level3: 3650, level4: 3850, level5: 3600, level6: 3500 } },
      { id: 'PRD-0715', code: 'ROTI-07', name: 'PIA K. HIJAU', category: 'Roti Manis', stock: 100, factoryPrice: 6500, prices: { level1: 6900, level2: 7100, level3: 7200, level4: 7500, level5: 7100, level6: 6800 } },
      { id: 'PRD-9068', code: 'ROTI-08', name: 'NC', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-9030', code: 'ROTI-09', name: 'NCK', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-2002', code: 'ROTI-10', name: 'NCP', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-4489', code: 'ROTI-11', name: 'NCB', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-4776', code: 'ROTI-12', name: 'NCS', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-0066', code: 'ROTI-13', name: 'NP', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-0633', code: 'ROTI-14', name: 'SC', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-4710', code: 'ROTI-15', name: 'SK', category: 'Roti Manis', stock: 100, factoryPrice: 1200, prices: { level1: 1300, level2: 1350, level3: 1400, level4: 1500, level5: 1350, level6: 1280 } },
      { id: 'PRD-4206', code: 'ROTI-16', name: 'SB', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-4897', code: 'ROTI-17', name: 'SS', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-1801', code: 'ROTI-18', name: 'MOONCAKE', category: 'Roti Manis', stock: 100, factoryPrice: 1400, prices: { level1: 1500, level2: 1550, level3: 1600, level4: 1750, level5: 1550, level6: 1480 } },
      { id: 'PRD-1901', code: 'ROTI-19', name: 'SUSU KEJU', category: 'Roti Manis', stock: 100, factoryPrice: 2000, prices: { level1: 2150, level2: 2250, level3: 2300, level4: 2450, level5: 2250, level6: 2100 } },
      { id: 'PRD-4480', code: 'ROTI-20', name: 'SUJU MINI', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-9544', code: 'ROTI-21', name: 'SISIR', category: 'Roti Manis', stock: 100, factoryPrice: 2000, prices: { level1: 2150, level2: 2250, level3: 2300, level4: 2450, level5: 2250, level6: 2100 } },
      { id: 'PRD-6446', code: 'ROTI-22', name: 'NC. KACANG', category: 'Roti Manis', stock: 100, factoryPrice: 1300, prices: { level1: 1400, level2: 1450, level3: 1500, level4: 1600, level5: 1450, level6: 1380 } },
      { id: 'PRD-1254', code: 'ROTI-23', name: 'TM', category: 'Roti Tawar', stock: 100, factoryPrice: 5900, prices: { level1: 6300, level2: 6500, level3: 6600, level4: 6950, level5: 6500, level6: 6200 } },
      { id: 'PRD-6617', code: 'ROTI-24', name: 'TP', category: 'Roti Tawar', stock: 100, factoryPrice: 5900, prices: { level1: 6300, level2: 6500, level3: 6600, level4: 6950, level5: 6500, level6: 6200 } },
      { id: 'PRD-9803', code: 'ROTI-25', name: 'TF', category: 'Roti Tawar', stock: 100, factoryPrice: 5900, prices: { level1: 6300, level2: 6500, level3: 6600, level4: 6950, level5: 6500, level6: 6200 } }
    ];
    `;

content = content.substring(0, startDefaultProductsIdx) + standardCatalogCode + content.substring(endDefaultProductsIdx);
console.log('✓ Standard 25 products & sorting helpers defined');

// --- 7. UPDATE cleanupLegacyDummyData to v5 ---
const cleanupOld = `function cleanupLegacyDummyData() {
      const CLEANUP_KEY = 'alfaris_clean_sync_v4';
      if (localStorage.getItem(CLEANUP_KEY) === 'true') return;`;

const cleanupNew = `function cleanupLegacyDummyData() {
      const CLEANUP_KEY = 'alfaris_clean_sync_v5';
      if (localStorage.getItem(CLEANUP_KEY) === 'true') return;

      try {
        // Bersihkan cache produk lama agar 25 varian roti standar ter-update otomatis
        const p = localStorage.getItem(STORAGE_KEY_PRODUCTS);
        if (p) {
          try {
            const parsed = JSON.parse(p);
            if (!Array.isArray(parsed) || parsed.length !== 25 || !parsed.some(x => x.name === 'PIA K. HIJAU' || x.name === 'SUSU KEJU')) {
              localStorage.removeItem(STORAGE_KEY_PRODUCTS);
            }
          } catch(e) {
            localStorage.removeItem(STORAGE_KEY_PRODUCTS);
          }
        }
        // Bersihkan cache PO lama jika ada
        const po = localStorage.getItem(STORAGE_KEY_PO);
        if (po && (po.includes('PO-005') || po.includes('Budi Santoso'))) {
          localStorage.removeItem(STORAGE_KEY_PO);
        }
      } catch(e) {}`;

if (!content.includes(cleanupOld)) {
  console.error('Error: cleanupOld not found!');
  process.exit(1);
}
content = content.replace(cleanupOld, cleanupNew);
console.log('✓ cleanupLegacyDummyData updated to v5');

// --- 8. UPDATE getProductsData to ALWAYS return sortProductsByStandardOrder ---
const getProductsOld = `function getProductsData() {
      const s = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (s === null) { localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS)); return DEFAULT_PRODUCTS; }
      try { return JSON.parse(s) || []; } catch (e) { return []; }
    }`;

const getProductsNew = `function getProductsData() {
      const s = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      let list = [];
      if (s === null) { 
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS)); 
        list = DEFAULT_PRODUCTS; 
      } else {
        try { list = JSON.parse(s) || []; } catch (e) { list = []; }
      }
      return sortProductsByStandardOrder(list);
    }`;

if (!content.includes(getProductsOld)) {
  console.error('Error: getProductsOld not found!');
  process.exit(1);
}
content = content.replace(getProductsOld, getProductsNew);
console.log('✓ getProductsData updated with sortProductsByStandardOrder');

// --- 9. SORT ITEMS IN NOTA DROP ROTI (buildNotaHTML) ---
const notaItemsOld = `      const itemsRows = (trx.items || []).map((it, idx) => \`
        <tr class="border-b border-slate-300">
          <td class="border border-slate-300 py-1.5 px-2 text-center text-slate-500">\${idx + 1}</td>
          <td class="border border-slate-300 py-1.5 px-2 text-left font-bold text-slate-800">\${escapeHtml(it.productName)}</td>`;

const notaItemsNew = `      const sortedTrxItems = [...(trx.items || [])].sort((a, b) => {
        const idxA = getProductSortIndex(a.productName || a.product || a.name);
        const idxB = getProductSortIndex(b.productName || b.product || b.name);
        return idxA - idxB;
      });

      const itemsRows = sortedTrxItems.map((it, idx) => \`
        <tr class="border-b border-slate-300">
          <td class="border border-slate-300 py-1.5 px-2 text-center text-slate-500">\${idx + 1}</td>
          <td class="border border-slate-300 py-1.5 px-2 text-left font-bold text-slate-800">\${escapeHtml(it.productName)}</td>`;

if (!content.includes(notaItemsOld)) {
  console.error('Error: notaItemsOld not found!');
  process.exit(1);
}
content = content.replace(notaItemsOld, notaItemsNew);
console.log('✓ buildNotaHTML updated to sort items by 25 standard order');

// --- 10. ADD KARTU REKAP PRE-ORDER FUNCTIONS ---
const poCardFunctionsCode = `
    // ========================================================
    // FITUR KARTU REKAP PRE-ORDER SALES (FORMAT FISIK SESUAI CONTOH)
    // ========================================================
    let activePOCardId = null;

    function buildPOSalesCardHTML(po) {
      if (!po) return '';
      const products = getProductsData();
      const salesList = getSalesData();
      const sales = salesList.find(s => s.id === po.salesId || s.name === po.salesName);
      
      // Format Hari & Tanggal Bahasa Indonesia: Kamis, 05 November 2026
      let formattedDate = po.date || getTodayYMD();
      try {
        const d = new Date((po.date || getTodayYMD()) + 'T00:00:00');
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        if (!isNaN(d.getTime())) {
          formattedDate = \`\${days[d.getDay()]}, \${String(d.getDate()).padStart(2, '0')} \${months[d.getMonth()]} \${d.getFullYear()}\`;
        }
      } catch (e) {}

      const salesDisplayName = po.salesName || (sales ? sales.name : 'Sales');
      const priceTier = (sales && sales.priceLevel) ? sales.priceLevel : 'level1';

      let grandTotal = 0;
      let totalPcs = 0;

      const rowsHtml = products.map(prod => {
        // Ambil Qty dari po.items (fleksibel berdasarkan id, code, atau nama)
        const qty = (po.items && (
          po.items[prod.id] !== undefined ? po.items[prod.id] :
          (po.items[prod.code] !== undefined ? po.items[prod.code] :
          (po.items[prod.name] !== undefined ? po.items[prod.name] : 0))
        )) || 0;

        // Ambil harga jual ke sales
        let unitPrice = 0;
        if (prod.prices && prod.prices[priceTier]) {
          unitPrice = Number(prod.prices[priceTier]);
        } else if (prod.prices && prod.prices.level1) {
          unitPrice = Number(prod.prices.level1);
        } else {
          unitPrice = Number(prod.factoryPrice || 0);
        }

        const subtotal = qty > 0 ? (qty * unitPrice) : 0;
        if (qty > 0) {
          grandTotal += subtotal;
          totalPcs += qty;
        }

        const qtyStr = qty > 0 ? Number(qty).toLocaleString('en-US') : '';
        const priceStr = Number(unitPrice).toLocaleString('en-US');
        const subtotalStr = qty > 0 ? Number(subtotal).toLocaleString('en-US') : '-';

        return \`
          <tr class="\${qty > 0 ? 'bg-[#c3d9ef]/60 font-bold' : ''}" style="border-bottom: 1px solid #1e293b;">
            <td class="px-2 py-0.5 text-center font-bold text-slate-900 border-r border-slate-900" style="width: 16%;">\${qtyStr}</td>
            <td class="px-2.5 py-0.5 text-left text-slate-950 \${qty > 0 ? 'font-black' : 'font-semibold'} border-r border-slate-900" style="width: 42%;">\${escapeHtml(prod.name)}</td>
            <td class="px-2 py-0.5 text-right font-mono text-slate-900 border-r border-slate-900" style="width: 20%;">\${priceStr}</td>
            <td class="px-2 py-0.5 text-right font-mono font-black text-slate-950" style="width: 22%;">\${subtotalStr}</td>
          </tr>
        \`;
      }).join('');

      return \`
        <div class="po-card-sheet bg-white mx-auto text-slate-950 font-sans shadow-md" style="width: 100%; max-width: 440px; border: 2px solid #0f172a; padding: 0; page-break-inside: avoid;">
          <table class="w-full border-collapse text-xs" style="border-collapse: collapse;">
            <!-- Header Kartu: Nama Sales & Hari, Tanggal -->
            <thead>
              <tr style="background-color: #b9d1ea; border-bottom: 2px solid #0f172a;">
                <th colspan="2" class="px-3 py-1.5 text-center font-black text-sm tracking-wide text-slate-950 border-r border-slate-900" style="width: 58%;">
                  \${escapeHtml(salesDisplayName)}
                </th>
                <th colspan="2" class="px-3 py-1.5 text-center font-bold text-xs tracking-tight text-slate-950" style="width: 42%;">
                  \${escapeHtml(formattedDate)}
                </th>
              </tr>
              <!-- Column Headers: Qty | Nama Barang | Harga | Jumlah -->
              <tr style="background-color: #cddff1; border-bottom: 2px solid #0f172a;">
                <th class="px-2 py-1 text-center font-black text-xs text-slate-900 border-r border-slate-900" style="width: 16%;">Qty</th>
                <th class="px-2.5 py-1 text-left font-black text-xs text-slate-900 border-r border-slate-900" style="width: 42%;">Nama Barang</th>
                <th class="px-2 py-1 text-right font-black text-xs text-slate-900 border-r border-slate-900" style="width: 20%;">Harga</th>
                <th class="px-2 py-1 text-right font-black text-xs text-slate-900" style="width: 22%;">Jumlah</th>
              </tr>
            </thead>
            <tbody style="background-color: #dceaf7;">
              \${rowsHtml}
            </tbody>
            <tfoot>
              <tr style="background-color: #b9d1ea; border-top: 2px solid #0f172a;">
                <td colspan="2" class="px-3 py-1.5 text-center font-black text-sm tracking-wider text-slate-950 border-r border-slate-900">
                  TOTAL <span class="text-[10px] font-normal text-slate-700">(\${Number(totalPcs).toLocaleString('en-US')} Pcs)</span>
                </td>
                <td class="px-2 py-1.5 text-center font-black text-sm text-slate-950 italic border-r border-slate-900">
                  Rp
                </td>
                <td class="px-2 py-1.5 text-right font-black font-mono text-sm text-slate-950">
                  \${Number(grandTotal).toLocaleString('en-US')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      \`;
    }

    function openPOCardModal(poId) {
      const allPO = getPOSalesData();
      const po = allPO.find(p => p.id === poId);
      if (!po) {
        showToast('Data Pre-Order tidak ditemukan!', 'error');
        return;
      }
      activePOCardId = po.id;
      const badge = document.getElementById('preview-po-card-title-badge');
      if (badge) badge.innerText = \`\${po.salesName || 'Sales'} • \${po.date}\`;

      const sheet = document.getElementById('po-card-preview-sheet');
      if (sheet) sheet.innerHTML = buildPOSalesCardHTML(po);

      document.getElementById('modal-po-card-preview').classList.remove('hidden');
      lucide.createIcons();
    }

    function closePOCardModal() {
      const modal = document.getElementById('modal-po-card-preview');
      if (modal) modal.classList.add('hidden');
    }

    function printActivePOCard() {
      if (activePOCardId) {
        printPOSalesCard(activePOCardId);
      }
    }

    function printPOSalesCard(poId) {
      const allPO = getPOSalesData();
      const po = allPO.find(p => p.id === poId);
      if (!po) {
        showToast('Data Pre-Order tidak ditemukan!', 'error');
        return;
      }
      const printArea = document.getElementById('print-area-po-card');
      if (!printArea) return;

      printArea.innerHTML = buildPOSalesCardHTML(po);

      document.body.classList.remove('printing-financial', 'printing-po', 'printing-nota');
      document.body.classList.add('printing-po-card');

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove('printing-po-card');
        }, 1000);
      }, 150);
    }

    function printAllPOSalesCardsOnDate() {
      const allPO = getPOSalesData();
      const posOnDate = allPO.filter(po => po.date === currentPODate);
      if (posOnDate.length === 0) {
        showToast('Tidak ada data PO Sales pada tanggal ini untuk dicetak.', 'warning');
        return;
      }

      const printArea = document.getElementById('print-area-po-card');
      if (!printArea) return;

      printArea.innerHTML = \`
        <div class="space-y-6">
          \${posOnDate.map((po, idx) => \`
            <div style="\${idx > 0 ? 'page-break-before: always; margin-top: 24px;' : ''}">
              \${buildPOSalesCardHTML(po)}
            </div>
          \`).join('')}
        </div>
      \`;

      document.body.classList.remove('printing-financial', 'printing-po', 'printing-nota');
      document.body.classList.add('printing-po-card');

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove('printing-po-card');
        }, 1000);
      }, 150);
    }
`;

// Insert functions before printPORecap()
const poRecapFnTarget = `function printPORecap() {`;
if (!content.includes(poRecapFnTarget)) {
  console.error('Error: printPORecap anchor not found!');
  process.exit(1);
}
content = content.replace(poRecapFnTarget, poCardFunctionsCode + '\n    ' + poRecapFnTarget);
console.log('✓ PO card print & preview functions added');

fs.writeFileSync('index.html', content, 'utf8');
console.log('🎉 index.html successfully updated!');

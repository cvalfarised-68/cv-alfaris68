const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// --- 1. ADD TOOLBAR BUTTONS IN TAB-PO ---
const poToolbarOld = `            <button 
              onclick="printPORecap()" 
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 shadow-sm transition"
              title="Cetak Tabel Matriks PO Seluruh Sales untuk Pabrik">
              <i data-lucide="table" class="w-4 h-4"></i>
              <span>Cetak Matriks</span>
            </button>`;

const poToolbarNew = `            <button 
              onclick="openPabrikReconciliationModal()" 
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm transition cursor-pointer"
              title="Cek Realisasi Kiriman Pabrik vs Slot Muatan Armada Kendaraan">
              <i data-lucide="truck" class="w-4 h-4"></i>
              <span>Muatan Pabrik</span>
            </button>

            <button 
              id="btn-toolbar-fix-po" 
              onclick="publishPOToTransactionsConfirm()" 
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition cursor-pointer"
              title="Kunci & Terbitkan Transaksi Sales Otomatis ke Kasir (Zero Stock)">
              <i data-lucide="zap" class="w-4 h-4"></i>
              <span id="btn-toolbar-fix-text">Fix ke Transaksi</span>
            </button>

            <button 
              onclick="printPORecap()" 
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 shadow-sm transition"
              title="Cetak Tabel Matriks PO Seluruh Sales untuk Pabrik">
              <i data-lucide="table" class="w-4 h-4"></i>
              <span>Cetak Matriks</span>
            </button>`;

if (!content.includes(poToolbarOld)) {
  console.error('Error: poToolbarOld not found!');
  process.exit(1);
}
content = content.replace(poToolbarOld, poToolbarNew);
console.log('✓ PO toolbar buttons added');

// --- 2. ADD INTEGRATION BANNER ABOVE PRINT-AREA-PO ---
const bannerAnchor = `        <!-- PRINTABLE CONTAINER: MATRIX TABLE REKAP PO SALES -->`;

const bannerCode = `        <!-- BANNER STATUS INTEGRASI PO PABRIK KE TRANSAKSI SALES -->
        <div id="po-integration-banner" class="p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border-amber-300 text-amber-950 shadow-xs">
          <div class="flex items-center gap-3">
            <div id="po-status-icon-box" class="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold flex-shrink-0">
              <i data-lucide="clock" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h4 id="po-status-title" class="font-bold text-xs sm:text-sm text-slate-900">Status PO: Menunggu Perolehan Muatan Pabrik (Draft)</h4>
                <span id="po-status-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">Draft PO</span>
              </div>
              <p id="po-status-desc" class="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Sesuaikan pesanan dengan kapasitas muatan mobil armada & kiriman real dari pabrik. Klik tombol di kanan untuk mengunci & menerbitkan Transaksi Sales otomatis (Zero Stock).
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button 
              type="button"
              onclick="openPabrikReconciliationModal()" 
              class="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs inline-flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
              <i data-lucide="truck" class="w-4 h-4 text-brand-600"></i>
              <span>Cek Slot Muatan</span>
            </button>

            <button 
              type="button"
              id="btn-fix-publish-po" 
              onclick="publishPOToTransactionsConfirm()" 
              class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm inline-flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap">
              <i data-lucide="zap" class="w-4 h-4"></i>
              <span id="btn-fix-publish-text">Fix-kan & Terbitkan Transaksi</span>
            </button>
          </div>
        </div>

        <!-- PRINTABLE CONTAINER: MATRIX TABLE REKAP PO SALES -->`;

if (!content.includes(bannerAnchor)) {
  console.error('Error: bannerAnchor not found!');
  process.exit(1);
}
content = content.replace(bannerAnchor, bannerCode);
console.log('✓ PO integration banner added');

// --- 3. ADD MODAL PABRIK RECONCILIATION ---
const modalAnchor = `  <!-- MODAL PREVIEW KARTU REKAP PRE-ORDER SALES (FORMAT FISIK SESUAI CONTOH) -->`;

const modalReconciliationCode = `  <!-- MODAL PENYESUAIAN PEROLEHAN MUATAN PABRIK & ZERO STOCK -->
  <div id="modal-pabrik-reconciliation" class="hidden fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 modal-backdrop">
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
      <!-- Header -->
      <div class="p-3.5 sm:p-4 border-b flex justify-between items-center bg-slate-900 text-white">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
            <i data-lucide="truck" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>Perolehan Muatan Pabrik & Slot Armada</span>
              <span id="recon-modal-date-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">05/11/2026</span>
            </h3>
            <p class="text-[11px] text-slate-400">Verifikasi muatan mobil dari pabrik & pastikan nol stok mengendap di gudang</p>
          </div>
        </div>
        <button onclick="closePabrikReconciliationModal()" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs bg-slate-50">
        <!-- Card KPI Muatan Mobil vs Sales -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div class="text-[10px] text-slate-500 font-semibold">Total Pesanan Sales</div>
            <div id="recon-kpi-sales-pcs" class="text-lg font-black text-slate-900 mt-0.5">0 Pcs</div>
            <div class="text-[9.5px] text-slate-400">Akumulasi PO tim sales</div>
          </div>
          <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div class="text-[10px] text-slate-500 font-semibold">Estimasi Modal Pabrik</div>
            <div id="recon-kpi-factory-cost" class="text-lg font-black text-amber-700 mt-0.5">Rp 0</div>
            <div class="text-[9.5px] text-slate-400">Total HPP ke pabrik</div>
          </div>
          <div class="bg-emerald-50 p-3 rounded-xl border border-emerald-300 shadow-xs">
            <div class="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i>
              <span>Target Stok Gudang</span>
            </div>
            <div class="text-lg font-black text-emerald-900 mt-0.5">0 Pcs (Zero Stock)</div>
            <div class="text-[9.5px] text-emerald-700">Semua roti langsung dibawa sales</div>
          </div>
        </div>

        <!-- Penjelasan Alur Operasional -->
        <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed flex items-start gap-2.5">
          <i data-lucide="info" class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"></i>
          <div>
            <strong>SOP Muatan Pabrik & Penyesuaian Armada:</strong><br>
            Jika ada varian roti yang kurang dari pabrik atau kapasitas mobil armada masih longgar sehingga sales menambah pesanan, sesuaikan kuota roti sales terkait lewat tombol <strong>[✏️ Edit PO]</strong> di bawah. Setelah perolehan muatan pabrik sudah Fix, klik tombol <strong>Fix-kan & Terbitkan Transaksi Sales</strong> agar kasir langsung memiliki nota drop roti tanpa perlu input manual.
          </div>
        </div>

        <!-- Daftar Sales Pada Tanggal Terpilih -->
        <div>
          <h4 class="font-bold text-slate-800 mb-2 flex items-center justify-between">
            <span>Alokasi Roti per Tim Sales (Rute):</span>
            <span id="recon-sales-count-badge" class="text-[10px] text-slate-500 font-normal">0 Sales</span>
          </h4>
          <div id="recon-sales-list" class="space-y-2">
            <!-- Diisi oleh JS -->
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <button onclick="closePabrikReconciliationModal()" class="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
          Tutup
        </button>
        <button onclick="publishPOToTransactionsConfirm()" class="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition inline-flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="zap" class="w-4 h-4"></i>
          <span>Fix-kan & Terbitkan Transaksi Sales Otomatis</span>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL PREVIEW KARTU REKAP PRE-ORDER SALES (FORMAT FISIK SESUAI CONTOH) -->`;

if (!content.includes(modalAnchor)) {
  console.error('Error: modalAnchor not found!');
  process.exit(1);
}
content = content.replace(modalAnchor, modalReconciliationCode);
console.log('✓ Factory load reconciliation modal added');

// --- 4. UPDATE syncTableToSupabase FOR po_sales & transactions ---
const syncSupabaseOld = `        // Khusus tabel transactions: pastikan kolom sesuai schema Supabase & metadata tersimpan rapi di items
        if (tableName === 'transactions') {`;

const syncSupabaseNew = `        // Khusus tabel po_sales: pastikan hanya 7 kolom valid yang dikirim agar tidak error schema
        if (tableName === 'po_sales') {
          rows = list.map(item => ({
            id: item.id,
            date: item.date,
            sales_id: item.salesId || item.sales_id || null,
            sales_name: item.salesName || item.sales_name || '',
            sales_route: item.salesRoute || item.sales_route || '',
            items: item.items || {},
            notes: item.notes || ''
          }));
        }

        // Khusus tabel transactions: pastikan kolom sesuai schema Supabase & metadata tersimpan rapi di items
        if (tableName === 'transactions') {`;

if (!content.includes(syncSupabaseOld)) {
  console.error('Error: syncSupabaseOld not found!');
  process.exit(1);
}
content = content.replace(syncSupabaseOld, syncSupabaseNew);
console.log('✓ syncTableToSupabase sanitized for po_sales schema');

// Preserve poId and source in transactions metadata
const metaEnrichOld = `origPaymentStatus: item.paymentStatus || 'lunas',
                  notes: item.notes || '',`;

const metaEnrichNew = `origPaymentStatus: item.paymentStatus || 'lunas',
                  notes: item.notes || '',
                  poId: item.poId || null,
                  source: item.source || null,`;

if (content.includes(metaEnrichOld)) {
  content = content.replace(metaEnrichOld, metaEnrichNew);
  console.log('✓ Transaction meta enrichment updated with poId and source');
}

// Restore poId and source in parsedTrx
const metaRestoreOld = `if (meta.notes) t.notes = meta.notes;
              if (meta.settledAt) t.settledAt = meta.settledAt;`;

const metaRestoreNew = `if (meta.notes) t.notes = meta.notes;
              if (meta.poId) t.poId = meta.poId;
              if (meta.source) t.source = meta.source;
              if (meta.settledAt) t.settledAt = meta.settledAt;`;

if (content.includes(metaRestoreOld)) {
  content = content.replace(metaRestoreOld, metaRestoreNew);
  console.log('✓ Transaction parser updated to restore poId and source');
}

// --- 5. UPDATE renderPOSalesMatrix WITH INTEGRATION STATUS ---
const matrixRenderOld = `      document.getElementById('po-active-date-badge').innerText = \`Tanggal: \${formatIndoDate(currentPODate)}\`;
      document.getElementById('po-kpi-date-label').innerText = \`Per \${formatIndoDate(currentPODate)}\`;

      const products = getProductsData();
      const allPO = getPOSalesData();
      const posOnDate = allPO.filter(po => po.date === currentPODate);`;

const matrixRenderNew = `      document.getElementById('po-active-date-badge').innerText = \`Tanggal: \${formatIndoDate(currentPODate)}\`;
      document.getElementById('po-kpi-date-label').innerText = \`Per \${formatIndoDate(currentPODate)}\`;

      const products = getProductsData();
      const allPO = getPOSalesData();
      const posOnDate = allPO.filter(po => po.date === currentPODate);

      // Cek apakah PO pada tanggal ini sudah difix-kan dan terhubung ke Transaksi Sales
      const allTrx = getTransactionsData();
      const linkedTrx = allTrx.filter(t => t.date === currentPODate && (t.source === 'auto_po' || t.poId));
      const isFixed = linkedTrx.length > 0 || posOnDate.some(p => p.notes && p.notes.includes('[FIX:TRANSAKSI]'));

      updatePOIntegrationBanner(isFixed, linkedTrx.length, posOnDate.length);`;

if (!content.includes(matrixRenderOld)) {
  console.error('Error: matrixRenderOld not found!');
  process.exit(1);
}
content = content.replace(matrixRenderOld, matrixRenderNew);
console.log('✓ renderPOSalesMatrix integrated with status check');

// Add published indicator to sales row in tbody
const salesNameColOld = `                <div>
                  <div>\${escapeHtml(po.salesName)}</div>
                  <div class="text-[10px] text-slate-400 font-normal">\${escapeHtml(po.salesRoute || '-')}</div>
                </div>`;

const salesNameColNew = `                <div>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span>\${escapeHtml(po.salesName)}</span>
                    \${isFixed ? \`<span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-0.5"><i data-lucide="check" class="w-2.5 h-2.5"></i>Terbit di Transaksi</span>\` : ''}
                  </div>
                  <div class="text-[10px] text-slate-400 font-normal">\${escapeHtml(po.salesRoute || '-')}</div>
                </div>`;

if (!content.includes(salesNameColOld)) {
  console.error('Error: salesNameColOld not found!');
  process.exit(1);
}
content = content.replace(salesNameColOld, salesNameColNew);
console.log('✓ Sales name in matrix row updated with Terbit di Transaksi badge');

// --- 6. UPDATE renderTransactionList WITH DARI PO PABRIK BADGE ---
const trxBadgeAnchor = `const tokoDisplay = t.tokoName ? \`<span class="font-semibold text-slate-700">🏬 \${escapeHtml(t.tokoName)}</span> &bull; \` : '';`;

const trxBadgeNew = `const fromPOBadge = (t.source === 'auto_po' || t.poId) 
            ? \`<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1"><i data-lucide="zap" class="w-3 h-3 text-blue-600"></i>Dari PO Pabrik</span>\` 
            : '';
          const tokoDisplay = t.tokoName ? \`<span class="font-semibold text-slate-700">🏬 \${escapeHtml(t.tokoName)}</span> &bull; \` : '';`;

if (!content.includes(trxBadgeAnchor)) {
  console.error('Error: trxBadgeAnchor not found!');
  process.exit(1);
}
content = content.replace(trxBadgeAnchor, trxBadgeNew);

const trxIdLineOld = `<span class="text-slate-900 font-black">\${t.id}</span>
                  \${badgeMethod}`;

const trxIdLineNew = `<span class="text-slate-900 font-black">\${t.id}</span>
                  \${fromPOBadge}
                  \${badgeMethod}`;

if (!content.includes(trxIdLineOld)) {
  console.error('Error: trxIdLineOld not found!');
  process.exit(1);
}
content = content.replace(trxIdLineOld, trxIdLineNew);
console.log('✓ Transaction list updated with Dari PO Pabrik badge');

// --- 7. AUTO-SYNC TRANSACTION WHEN PO IS EDITED (savePOSales) ---
const savePOSalesEndOld = `      currentPODate = targetDate;
      document.getElementById('po-date-filter').value = currentPODate;
      savePOSalesData(allPO);
      closePOInputModal();`;

const savePOSalesEndNew = `      currentPODate = targetDate;
      document.getElementById('po-date-filter').value = currentPODate;
      savePOSalesData(allPO);
      closePOInputModal();

      // Jika pada tanggal ini sudah ada transaksi sales yang terhubung, perbarui otomatis transaksi tersebut!
      const currentTrx = getTransactionsData();
      const hasLinkedTrx = currentTrx.some(t => t.date === targetDate && (t.source === 'auto_po' || t.poId));
      if (hasLinkedTrx) {
        publishPOToTransactions(targetDate, false);
        showToast(\`Transaksi Drop Roti Sales untuk \${sales.name} otomatis diperbarui mengikuti muatan PO terbaru!\`, 'info');
      }`;

if (!content.includes(savePOSalesEndOld)) {
  console.error('Error: savePOSalesEndOld not found!');
  process.exit(1);
}
content = content.replace(savePOSalesEndOld, savePOSalesEndNew);
console.log('✓ savePOSales auto-sync to transaction updated');

// --- 8. ADD INTEGRATION FUNCTIONS ---
const functionsCode = `
    // ========================================================
    // FITUR INTEGRASI OTOMATIS: REKAP PO PABRIK KE TRANSAKSI SALES
    // ========================================================

    function updatePOIntegrationBanner(isFixed, linkedCount, poCount) {
      const banner = document.getElementById('po-integration-banner');
      const iconBox = document.getElementById('po-status-icon-box');
      const title = document.getElementById('po-status-title');
      const badge = document.getElementById('po-status-badge');
      const desc = document.getElementById('po-status-desc');
      const btn = document.getElementById('btn-fix-publish-po');
      const btnText = document.getElementById('btn-fix-publish-text');
      const tbBtnText = document.getElementById('btn-toolbar-fix-text');

      if (!banner) return;

      if (isFixed) {
        banner.className = 'p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs';
        if (iconBox) iconBox.className = 'w-10 h-10 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold flex-shrink-0';
        if (iconBox) iconBox.innerHTML = '<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-700"></i>';
        if (title) title.innerText = \`Status PO: FIX & Terhubung ke Transaksi Sales (\${linkedCount} Transaksi Terbit)\`;
        if (badge) {
          badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900 border border-emerald-300';
          badge.innerText = 'FIX & TERHUBUNG';
        }
        if (desc) desc.innerText = 'Roti kiriman pabrik sudah resmi dialokasikan menjadi Transaksi Sales (Zero Stock). Kasir langsung dapat mencetak Nota A5 & memproses setoran toko tanpa input manual.';
        if (btnText) btnText.innerText = 'Perbarui Transaksi Sales';
        if (tbBtnText) tbBtnText.innerText = 'Sync Ulang';
        if (btn) btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm inline-flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap';
      } else {
        banner.className = 'p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border-amber-300 text-amber-950 shadow-xs';
        if (iconBox) iconBox.className = 'w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold flex-shrink-0';
        if (iconBox) iconBox.innerHTML = '<i data-lucide="clock" class="w-5 h-5 text-amber-800"></i>';
        if (title) title.innerText = \`Status PO: Menunggu Realisasi Muatan Pabrik (Draft - \${poCount} Sales)\`;
        if (badge) {
          badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300';
          badge.innerText = 'Draft PO';
        }
        if (desc) desc.innerText = 'Sesuaikan pesanan dengan kapasitas muatan mobil armada & perolehan real pabrik. Klik tombol di kanan untuk mengunci & menerbitkan Transaksi Sales otomatis (Zero Stock).';
        if (btnText) btnText.innerText = 'Fix-kan & Terbitkan Transaksi';
        if (tbBtnText) tbBtnText.innerText = 'Fix ke Transaksi';
        if (btn) btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm inline-flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap';
      }
      lucide.createIcons();
    }

    function openPabrikReconciliationModal() {
      const allPO = getPOSalesData();
      const posOnDate = allPO.filter(po => po.date === currentPODate);
      const products = getProductsData();

      const modal = document.getElementById('modal-pabrik-reconciliation');
      if (!modal) return;

      document.getElementById('recon-modal-date-badge').innerText = formatIndoDate(currentPODate);

      let totalPcs = 0;
      let totalCost = 0;

      posOnDate.forEach(po => {
        products.forEach(p => {
          const qty = (po.items && (
            po.items[p.id] !== undefined ? po.items[p.id] :
            (po.items[p.code] !== undefined ? po.items[p.code] :
            (po.items[p.name] !== undefined ? po.items[p.name] : 0))
          )) || 0;
          totalPcs += qty;
          totalCost += (qty * (p.factoryPrice || 0));
        });
      });

      document.getElementById('recon-kpi-sales-pcs').innerText = \`\${totalPcs.toLocaleString('id-ID')} Pcs\`;
      document.getElementById('recon-kpi-factory-cost').innerText = formatRupiah(totalCost);
      document.getElementById('recon-sales-count-badge').innerText = \`\${posOnDate.length} Tim Sales Aktif\`;

      const listContainer = document.getElementById('recon-sales-list');
      if (posOnDate.length === 0) {
        listContainer.innerHTML = \`
          <div class="p-6 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            <i data-lucide="package-x" class="w-8 h-8 mx-auto mb-1 text-slate-300"></i>
            <p class="font-bold">Belum ada PO sales pada tanggal \${formatIndoDate(currentPODate)}</p>
            <p class="text-[10px] text-slate-400">Silakan input PO Sales terlebih dahulu.</p>
          </div>
        \`;
      } else {
        listContainer.innerHTML = posOnDate.map(po => {
          let sPcs = 0;
          let sAmount = 0;
          const salesList = getSalesData();
          const sObj = salesList.find(s => s.id === po.salesId || s.name === po.salesName);
          const tierId = (sObj && sObj.priceLevel) ? sObj.priceLevel : 'level1';

          products.forEach(p => {
            const qty = (po.items && (
              po.items[p.id] !== undefined ? po.items[p.id] :
              (po.items[p.code] !== undefined ? po.items[p.code] :
              (po.items[p.name] !== undefined ? po.items[p.name] : 0))
            )) || 0;
            if (qty > 0) {
              sPcs += qty;
              const uPrice = (p.prices && p.prices[tierId]) ? p.prices[tierId] : (p.prices?.level1 || p.factoryPrice || 0);
              sAmount += (qty * uPrice);
            }
          });

          return \`
            <div class="p-3 bg-white rounded-xl border border-slate-200 hover:border-brand-400 transition flex items-center justify-between gap-3 shadow-2xs">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-brand-100 text-brand-800 font-extrabold flex items-center justify-center text-xs">
                  \${(po.salesName || 'S').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div class="font-bold text-slate-900">\${escapeHtml(po.salesName)}</div>
                  <div class="text-[10px] text-slate-500 font-normal">Rute: \${escapeHtml(po.salesRoute || '-')} &bull; \${sPcs.toLocaleString('id-ID')} Pcs</div>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="text-right">
                  <div class="font-black text-slate-900">\${formatRupiah(sAmount)}</div>
                  <div class="text-[9.5px] text-emerald-600 font-semibold">\${sPcs} Pcs siap bawa</div>
                </div>
                <button 
                  onclick="closePabrikReconciliationModal(); openPOInputModal('\${po.id}');"
                  class="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:border-brand-500 hover:bg-brand-50 text-slate-700 hover:text-brand-800 text-[11px] font-bold transition inline-flex items-center gap-1 cursor-pointer"
                  title="Sesuaikan roti sales ini karena barang pabrik kurang atau mobil masih longgar">
                  <i data-lucide="edit-3" class="w-3 h-3"></i>
                  <span>Edit PO</span>
                </button>
              </div>
            </div>
          \`;
        }).join('');
      }

      modal.classList.remove('hidden');
      lucide.createIcons();
    }

    function closePabrikReconciliationModal() {
      const modal = document.getElementById('modal-pabrik-reconciliation');
      if (modal) modal.classList.add('hidden');
    }

    function publishPOToTransactionsConfirm() {
      const allPO = getPOSalesData();
      const posOnDate = allPO.filter(po => po.date === currentPODate);

      if (posOnDate.length === 0) {
        showToast(\`Belum ada PO Sales untuk tanggal \${formatIndoDate(currentPODate)}!\`, 'warning');
        return;
      }

      const allTrx = getTransactionsData();
      const linkedTrx = allTrx.filter(t => t.date === currentPODate && (t.source === 'auto_po' || t.poId));
      const isAlreadyFixed = linkedTrx.length > 0;

      const promptMsg = isAlreadyFixed
        ? \`Perbarui & Sinkronkan ulang Transaksi Sales untuk \${posOnDate.length} sales pada tanggal \${formatIndoDate(currentPODate)}?\`
        : \`Fix-kan Rekap PO & Terbitkan Transaksi Sales Otomatis untuk \${posOnDate.length} sales pada tanggal \${formatIndoDate(currentPODate)}?\\n\\nData transaksi drop roti akan langsung terbit untuk kasir dan siap cetak Nota A5 tanpa perlu input ulang (Zero Stock).\`;

      if (confirm(promptMsg)) {
        closePabrikReconciliationModal();
        publishPOToTransactions(currentPODate, true);
      }
    }

    function publishPOToTransactions(targetDate = currentPODate, showFeedback = true) {
      const allPO = getPOSalesData();
      const posOnDate = allPO.filter(po => po.date === targetDate);

      if (posOnDate.length === 0) {
        showToast(\`Tidak ada data PO Sales untuk tanggal \${formatIndoDate(targetDate)}!\`, 'error');
        return;
      }

      const products = getProductsData();
      const salesList = getSalesData();
      let trxList = getTransactionsData();

      let createdCount = 0;
      let updatedCount = 0;

      posOnDate.forEach(po => {
        const sales = salesList.find(s => s.id === po.salesId || s.name === po.salesName);
        const tierId = (sales && sales.priceLevel) ? sales.priceLevel : 'level1';
        const tierObj = PRICE_TIERS.find(t => t.id === tierId) || PRICE_TIERS[0];

        // Bangun items roti yang diorder (qty > 0)
        const items = [];
        let totalQty = 0;
        let totalAmount = 0;
        let totalFactoryCost = 0;

        products.forEach(p => {
          const qty = (po.items && (
            po.items[p.id] !== undefined ? po.items[p.id] :
            (po.items[p.code] !== undefined ? po.items[p.code] :
            (po.items[p.name] !== undefined ? po.items[p.name] : 0))
          )) || 0;

          if (qty > 0) {
            let unitPrice = 0;
            if (p.prices && p.prices[tierId]) unitPrice = Number(p.prices[tierId]);
            else if (p.prices && p.prices.level1) unitPrice = Number(p.prices.level1);
            else unitPrice = Number(p.factoryPrice || 0);

            const subtotal = qty * unitPrice;
            const fCost = Number(p.factoryPrice || 0) * qty;

            items.push({
              productName: p.name,
              qty,
              unitPrice,
              subtotal
            });

            totalQty += qty;
            totalAmount += subtotal;
            totalFactoryCost += fCost;
          }
        });

        if (totalQty === 0) return; // Sales tidak ada pesanan

        // Cek apakah transaksi sudah ada sebelumnya
        const existingTrxIdx = trxList.findIndex(t => 
          (t.poId && t.poId === po.id) || (t.date === po.date && t.salesId === po.salesId)
        );

        if (existingTrxIdx >= 0) {
          const ex = trxList[existingTrxIdx];
          // Perbarui transaksi jika masih berstatus menunggu_setoran
          if (ex.paymentMethod === 'menunggu_setoran' || ex.deliveryStatus === 'menunggu_setoran' || ex.paymentStatus === 'menunggu') {
            ex.items = items;
            ex.totalQty = totalQty;
            ex.totalAmount = totalAmount;
            ex.totalFactoryCost = totalFactoryCost;
            ex.remainingAmount = totalAmount;
            ex.poId = po.id;
            ex.source = 'auto_po';
            ex.notes = po.notes || 'Diperbarui otomatis dari Rekap PO Pabrik';
            updatedCount++;
          }
        } else {
          // Buat transaksi baru
          const sIdNum = (po.salesId || '').replace('SLS-', '') || Math.floor(1000 + Math.random() * 9000);
          const dateCompact = (po.date || getTodayYMD()).replace(/-/g, '').slice(2);
          const newTrxId = \`TRX-\${dateCompact}-\${sIdNum}\`;

          const newTrx = {
            id: newTrxId,
            date: po.date,
            salesId: po.salesId || (sales ? sales.id : ''),
            salesName: po.salesName || (sales ? sales.name : 'Sales'),
            salesPhone: (sales ? sales.phone : po.salesPhone) || '-',
            salesRoute: (sales ? sales.route : po.salesRoute) || 'Rute Bebas',
            tokoName: (sales ? sales.route : po.salesRoute) || 'Rute Bebas',
            notes: po.notes || 'Otomatis dari Rekap PO Pabrik Fix',
            tierName: tierObj.name,
            paymentMethod: 'menunggu_setoran',
            paymentStatus: 'menunggu',
            deliveryStatus: 'menunggu_setoran',
            downPayment: 0,
            remainingAmount: totalAmount,
            dueDate: addDaysYMD(po.date, 3),
            items,
            totalQty,
            totalAmount,
            totalFactoryCost,
            poId: po.id,
            source: 'auto_po',
            createdAt: new Date().toISOString()
          };

          trxList.unshift(newTrx);
          createdCount++;
        }
      });

      // Tandai PO pada tanggal ini sebagai FIX di notes
      const updatedAllPO = allPO.map(p => {
        if (p.date === targetDate) {
          const cleanNotes = (p.notes || '').replace(/\\[FIX:TRANSAKSI\\]/g, '').trim();
          return { ...p, notes: cleanNotes ? \`\${cleanNotes} [FIX:TRANSAKSI]\` : '[FIX:TRANSAKSI]' };
        }
        return p;
      });

      saveTransactionsData(trxList);
      savePOSalesData(updatedAllPO);

      if (showFeedback) {
        const msg = createdCount > 0 
          ? \`Berhasil! \${createdCount} Transaksi Sales otomatis diterbitkan dari Rekap PO (\${updatedCount} diperbarui). Kasir siap cetak Nota A5.\`
          : \`Rekap PO Sales & \${updatedCount} Transaksi Sales berhasil disinkronkan ulang.\`;
        showToast(msg, 'success');
      }

      renderPOSalesMatrix();
    }
`;

// Insert functions before printPOSalesCard
const fnAnchor = `function openPOCardModal(poId) {`;
if (!content.includes(fnAnchor)) {
  console.error('Error: fnAnchor not found!');
  process.exit(1);
}
content = content.replace(fnAnchor, functionsCode + '\n    ' + fnAnchor);
console.log('✓ Integration functions added');

fs.writeFileSync('index.html', content, 'utf8');
console.log('🎉 index.html successfully updated with PO -> Transaction auto-sync feature!');

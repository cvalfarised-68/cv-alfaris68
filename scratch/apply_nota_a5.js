const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// --- 1. CSS PRINT FOR NOTA A5 ---
const cssOld = `      /* Mode Cetak Surat Jalan & Nota Drop Roti Sales */
      body.printing-nota #print-area-nota, 
      body.printing-nota #print-area-nota * {
        visibility: visible !important;
      }
      body.printing-nota #print-area-nota {
        position: static !important;
        display: block !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #0f172a !important;
      }`;

const cssNew = `      /* Mode Cetak Nota Penjualan Sales (Ukuran Kertas A5) */
      body.printing-nota #print-area-nota, 
      body.printing-nota #print-area-nota * {
        visibility: visible !important;
      }
      body.printing-nota #print-area-nota {
        position: static !important;
        display: block !important;
        width: 100% !important;
        max-width: 148mm !important;
        margin: 0 auto !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #0f172a !important;
      }`;

if (!content.includes(cssOld)) {
  console.error('Error: cssOld not found!');
  process.exit(1);
}
content = content.replace(cssOld, cssNew);
console.log('✓ CSS print nota A5 updated');

// --- 2. UPDATE ROOT PRINT CONTAINER LABEL ---
const printContainerOld = `<!-- ROOT PRINT CONTAINER UNTUK SURAT JALAN & NOTA DROP ROTI SALES -->`;
const printContainerNew = `<!-- ROOT PRINT CONTAINER UNTUK NOTA PENJUALAN SALES (UKURAN A5) -->`;
if (content.includes(printContainerOld)) {
  content = content.replace(printContainerOld, printContainerNew);
  console.log('✓ Print container label updated');
}

// --- 3. UPDATE MODAL SUCCESS TEXT ---
const successModalOld = `Cetak <strong>Surat Jalan & Nota Drop Roti</strong> sekarang untuk diserahkan ke Sales sebagai bukti bawaan roti.`;
const successModalNew = `Cetak <strong>Nota Penjualan Sales (Ukuran A5)</strong> sekarang untuk diserahkan ke Sales sebagai bukti fisik barang & tagihan penjualan.`;
if (content.includes(successModalOld)) {
  content = content.replace(successModalOld, successModalNew);
  console.log('✓ Success modal text updated');
}

const successBtnOld = `<span>Cetak Surat Jalan & Nota Sekarang</span>`;
const successBtnNew = `<span>Cetak Nota Sales (A5) Sekarang</span>`;
if (content.includes(successBtnOld)) {
  content = content.replace(successBtnOld, successBtnNew);
  console.log('✓ Success button text updated');
}

// --- 4. UPDATE MODAL NOTA PREVIEW HEADER ---
const previewHeaderOld = `          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>Surat Jalan & Nota Drop Roti</span>
              <span id="preview-nota-id-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">TRX-XXXX</span>
            </h3>
            <p class="text-[11px] text-slate-400">Bukti resmi serah terima barang sales & penagihan pembayaran toko</p>
          </div>`;

const previewHeaderNew = `          <div>
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>Nota Penjualan Sales</span>
              <span id="preview-nota-id-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">TRX-XXXX</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">UKURAN A5</span>
            </h3>
            <p class="text-[11px] text-slate-400">Bukti penyerahan barang & tagihan resmi kepada Sales CV. Alfaris Enam Delapan</p>
          </div>`;

if (!content.includes(previewHeaderOld)) {
  console.error('Error: previewHeaderOld not found!');
  process.exit(1);
}
content = content.replace(previewHeaderOld, previewHeaderNew);
console.log('✓ Modal nota preview header updated');

// Update preview sheet container class
const previewSheetOld = `<div id="nota-preview-sheet" class="max-w-2xl mx-auto bg-white p-6 sm:p-8 shadow-md border border-slate-200 rounded-xl text-slate-900">`;
const previewSheetNew = `<div id="nota-preview-sheet" class="max-w-[155mm] mx-auto bg-white p-4 sm:p-5 shadow-lg border border-slate-300 rounded-lg text-slate-900">`;
if (content.includes(previewSheetOld)) {
  content = content.replace(previewSheetOld, previewSheetNew);
  console.log('✓ Modal nota sheet container updated to A5 proportions');
}

const printBtnOld = `<span>Cetak / Print PDF</span>`;
const printBtnNew = `<span>Cetak Nota Sales (A5)</span>`;
if (content.includes(printBtnOld)) {
  content = content.replace(printBtnOld, printBtnNew);
  console.log('✓ Modal print button label updated');
}

// --- 5. UPDATE TRANSACTION LIST BUTTON TOOLTIP ---
const trxListBtnOld = `title="Lihat & Cetak Surat Jalan & Nota Drop Roti"`;
const trxListBtnNew = `title="Lihat & Cetak Nota Penjualan Sales (Ukuran A5)"`;
if (content.includes(trxListBtnOld)) {
  content = content.replace(trxListBtnOld, trxListBtnNew);
  console.log('✓ Transaction list button tooltip updated');
}

// --- 6. REDESIGN buildNotaHTML & printTransactionReceipt ---
const buildNotaStartAnchor = `// --- TEMPLATE & FITUR SURAT JALAN & NOTA DROP ROTI ---`;
const buildNotaEndAnchor = `// --- FITUR UPDATE SETORAN SALES (HASIL DROP DARI TOKO) ---`;

const startIdx = content.indexOf(buildNotaStartAnchor);
const endIdx = content.indexOf(buildNotaEndAnchor);

if (startIdx === -1 || endIdx === -1) {
  console.error('Error: buildNotaHTML anchors not found!');
  process.exit(1);
}

const newNotaCode = `// --- TEMPLATE & FITUR NOTA PENJUALAN SALES (UKURAN KERTAS A5) ---
    function setPrintPageSize(sizeCSS) {
      let styleEl = document.getElementById('dynamic-page-print-style');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamic-page-print-style';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = \`@media print { @page { size: \${sizeCSS}; margin: 6mm 8mm; } }\`;
    }

    function buildNotaHTML(trx) {
      const activeUser = (typeof currentRole !== 'undefined' && currentRole === 'owner') ? 'Owner / Pimpinan' : 'Kasir Operasional';
      const dropDate = formatIndoDate(trx.date || getTodayYMD());
      const dropTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

      const dpAmt = Number(trx.downPayment || 0);
      const sisaAmt = trx.remainingAmount !== undefined ? Number(trx.remainingAmount) : Math.max(0, (trx.totalAmount || 0) - dpAmt);

      let statusBadgeText = '';
      if (trx.paymentMethod === 'menunggu_setoran' || trx.deliveryStatus === 'menunggu_setoran') {
        statusBadgeText = 'DIBAWA SALES (TAGIHAN BELUM DISETOR)';
      } else if (trx.paymentMethod === 'transfer') {
        statusBadgeText = 'LUNAS (TRANSFER BANK)';
      } else if (trx.paymentMethod === 'tunai') {
        statusBadgeText = 'LUNAS (TUNAI / CASH)';
      } else if (trx.paymentMethod === 'kasbon') {
        if (trx.paymentStatus === 'lunas') {
          statusBadgeText = 'LUNAS (KASBON TERSELESAIKAN)';
        } else if (dpAmt > 0) {
          statusBadgeText = \`KASBON TEMPO (DP: \${formatRupiah(dpAmt)}, SISA: \${formatRupiah(sisaAmt)})\`;
        } else {
          statusBadgeText = \`KASBON TEMPO (SISA: \${formatRupiah(trx.totalAmount)})\`;
        }
      } else {
        statusBadgeText = 'LUNAS';
      }

      // 1. Filter HANYA nama barang yang di-order (qty > 0)
      // 2. Tetap diurutkan secara baku sesuai urutan 25 roti standar
      const sortedTrxItems = (trx.items || [])
        .filter(it => Number(it.qty) > 0)
        .sort((a, b) => {
          const idxA = getProductSortIndex(a.productName || a.product || a.name);
          const idxB = getProductSortIndex(b.productName || b.product || b.name);
          return idxA - idxB;
        });

      const itemsRows = sortedTrxItems.length > 0 ? sortedTrxItems.map((it, idx) => \`
        <tr class="border-b border-slate-300 text-slate-900">
          <td class="border border-slate-400 py-1 px-1.5 text-center text-slate-500 font-mono">\${idx + 1}</td>
          <td class="border border-slate-400 py-1 px-2.5 text-left font-bold text-slate-900">\${escapeHtml(it.productName)}</td>
          <td class="border border-slate-400 py-1 px-2 text-center font-bold text-slate-950">\${it.qty} Pcs</td>
          <td class="border border-slate-400 py-1 px-2 text-right font-mono text-slate-700">\${formatRupiah(it.unitPrice)}</td>
          <td class="border border-slate-400 py-1 px-2.5 text-right font-mono font-bold text-slate-950">\${formatRupiah(it.subtotal || (it.qty * it.unitPrice))}</td>
        </tr>
      \`).join('') : \`
        <tr>
          <td colspan="5" class="py-3 text-center text-slate-400 italic border border-slate-400">Tidak ada produk yang dipesan</td>
        </tr>
      \`;

      const kasbonBox = (trx.paymentMethod === 'kasbon' && trx.paymentStatus !== 'lunas') ? \`
        <div class="mb-2 p-1.5 bg-amber-50 border border-amber-300 rounded text-[9px]">
          <div class="flex justify-between font-bold text-amber-950">
            <span>DP Diterima: <strong>\${formatRupiah(dpAmt)}</strong></span>
            <span class="text-rose-700 font-black">Sisa Kasbon Tempo: \${formatRupiah(sisaAmt)}</span>
            <span>Jatuh Tempo: <strong>\${formatIndoDate(trx.dueDate || addDaysYMD(trx.date, 3))}</strong></span>
          </div>
        </div>
      \` : '';

      return \`
        <div class="nota-a5-sheet bg-white text-slate-900 font-sans mx-auto text-xs" style="width: 100%; max-width: 148mm; margin: 0 auto; padding: 2mm 3mm; box-sizing: border-box; page-break-inside: avoid;">
          <!-- KOP PERUSAHAAN & IDENTITAS NOTA -->
          <div class="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-2">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-lg bg-amber-600 text-white font-black text-lg flex items-center justify-center border border-amber-700 shadow-xs flex-shrink-0">
                68
              </div>
              <div>
                <h1 class="text-sm font-black tracking-wide text-slate-900 uppercase leading-none">CV. ALFARIS ENAM DELAPAN</h1>
                <p class="text-[9px] font-bold text-amber-800 uppercase tracking-wider mt-0.5">Distributor Resmi Roti & Makanan Hot Bread</p>
                <p class="text-[8.5px] text-slate-600 leading-tight mt-0.5">Malang, Jawa Timur &bull; Telp/WA: +62 812-3590-3990 &bull; Email: cv.alfaris68@gmail.com</p>
              </div>
            </div>
            <div class="text-right">
              <div class="inline-block bg-slate-900 text-white font-black text-[10.5px] px-2.5 py-0.5 rounded tracking-wide">
                NOTA PENJUALAN SALES
              </div>
              <div class="text-[10px] font-bold text-slate-800 mt-1">NO: <span class="font-black text-amber-700">\${trx.id}</span></div>
              <div class="text-[8.5px] text-slate-500">Tanggal: \${dropDate} (\${dropTime})</div>
            </div>
          </div>

          <!-- INFORMASI SALES PENERIMA & TRANSAKSI (DITUJUKAN KEPADA SALES BUKAN TOKO) -->
          <div class="grid grid-cols-2 gap-2 mb-2 p-2 bg-slate-50 border border-slate-300 rounded text-[9.5px]">
            <div>
              <table class="w-full">
                <tr>
                  <td class="font-bold text-slate-600 w-24">Sales (Penerima)</td>
                  <td class="font-black text-slate-900">: \${escapeHtml(trx.salesName || '-')}</td>
                </tr>
                <tr>
                  <td class="font-bold text-slate-600">Rute Sales</td>
                  <td class="text-slate-800">: \${escapeHtml(trx.salesRoute || '-')}</td>
                </tr>
                <tr>
                  <td class="font-bold text-slate-600">No. Kontak HP</td>
                  <td class="text-slate-800">: \${escapeHtml(trx.salesPhone || '-')}</td>
                </tr>
              </table>
            </div>
            <div>
              <table class="w-full">
                <tr>
                  <td class="font-bold text-slate-600 w-24">Petugas Kasir</td>
                  <td class="font-semibold text-slate-800">: \${activeUser}</td>
                </tr>
                <tr>
                  <td class="font-bold text-slate-600">Level Harga</td>
                  <td class="text-slate-800">: \${escapeHtml(trx.tierName || '-')}</td>
                </tr>
                <tr>
                  <td class="font-bold text-slate-600">Status Pembayaran</td>
                  <td class="font-bold">: <span class="\${trx.paymentStatus === 'lunas' ? 'text-emerald-700' : 'text-amber-700'}">\${statusBadgeText}</span></td>
                </tr>
              </table>
            </div>
          </div>

          <!-- TABEL RINCIAN ROTI BERKOLOM (HANYA ROTI YANG DIORDER DENGAN URUTAN BAKU 25 ROTI) -->
          <table class="w-full border-collapse border border-slate-900 text-[9.5px] mb-2">
            <thead>
              <tr class="bg-slate-200 text-slate-900 font-bold border-b border-slate-900">
                <th class="border border-slate-400 py-1.5 px-1.5 text-center w-7">No</th>
                <th class="border border-slate-400 py-1.5 px-2.5 text-left">Nama Barang</th>
                <th class="border border-slate-400 py-1.5 px-2 text-center w-16">Qty</th>
                <th class="border border-slate-400 py-1.5 px-2 text-right w-24">Harga Satuan</th>
                <th class="border border-slate-400 py-1.5 px-2.5 text-right w-28">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody>
              \${itemsRows}
            </tbody>
            <tfoot>
              <tr class="bg-slate-100 font-bold border-t-2 border-slate-900">
                <td colspan="2" class="border border-slate-400 py-1.5 px-2.5 text-right uppercase font-black text-slate-900">TOTAL:</td>
                <td class="border border-slate-400 py-1.5 px-2 text-center font-black text-slate-950">\${trx.totalQty} Pcs</td>
                <td class="border border-slate-400 py-1.5 px-2 text-right"></td>
                <td class="border border-slate-400 py-1.5 px-2.5 text-right text-xs font-black text-slate-950">\${formatRupiah(trx.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>

          \${kasbonBox}

          <!-- CATATAN NOTA KHUSUS SALES -->
          <div class="mb-2.5 text-[8.5px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 leading-snug">
            <span class="font-bold text-slate-700">Catatan Nota:</span><br>
            1. Nota ini adalah bukti penyerahan barang dan tagihan resmi kepada Sales CV. Alfaris Enam Delapan.<br>
            2. Sales bertanggung jawab penuh atas fisik roti yang dibawa dan setoran hasil penjualan (Tunai, Transfer, atau Kasbon Toko).<br>
            3. Pelunasan kasbon tempo wajib disetorkan paling lambat sesuai dengan batas waktu jatuh tempo.
          </div>

          <!-- KOLOM TANDA TANGAN (KASIR & SALES - TIDAK ADA PIHAK TOKO) -->
          <div class="grid grid-cols-2 gap-4 text-center text-[9.5px] avoid-break">
            <div class="border border-slate-300 rounded p-1.5">
              <div class="text-slate-700 font-bold">Kasir / Admin Gudang</div>
              <div class="text-[8.5px] text-slate-500">Yang Menyerahkan Barang</div>
              <div class="h-9"></div>
              <div class="border-t border-slate-400 font-black pt-1 text-slate-900">( Kasir Alfaris )</div>
            </div>
            <div class="border border-slate-300 rounded p-1.5">
              <div class="text-slate-700 font-bold">Sales Penerima Barang</div>
              <div class="text-[8.5px] text-slate-500">Yang Membawa & Bertanggung Jawab</div>
              <div class="h-9"></div>
              <div class="border-t border-slate-400 font-black pt-1 text-slate-900">( \${escapeHtml(trx.salesName || 'Sales')} )</div>
            </div>
          </div>
        </div>
      \`;
    }

    let activeNotaTrxId = null;

    function openNotaModal(trxId) {
      const trx = getTransactionsData().find(t => t.id === trxId);
      if (!trx) {
        showToast('Transaksi tidak ditemukan!', 'error');
        return;
      }
      activeNotaTrxId = trx.id;
      const badge = document.getElementById('preview-nota-id-badge');
      if (badge) badge.innerText = trx.id;

      const sheet = document.getElementById('nota-preview-sheet');
      if (sheet) sheet.innerHTML = buildNotaHTML(trx);

      document.getElementById('modal-nota-preview').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeNotaModal() {
      const modal = document.getElementById('modal-nota-preview');
      if (modal) modal.classList.add('hidden');
    }

    function printActiveNota() {
      if (activeNotaTrxId) {
        printTransactionReceipt(activeNotaTrxId);
      }
    }

    function printTransactionReceipt(trxId) {
      const trx = getTransactionsData().find(t => t.id === trxId);
      if (!trx) {
        showToast('Data transaksi tidak ditemukan!', 'error');
        return;
      }

      const printArea = document.getElementById('print-area-nota');
      if (!printArea) return;

      // Atur ukuran halaman print ke A5 Portrait secara dinamis
      setPrintPageSize('A5 portrait');
      printArea.innerHTML = buildNotaHTML(trx);

      document.body.classList.remove('printing-financial', 'printing-po', 'printing-po-card');
      document.body.classList.add('printing-nota');

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.body.classList.remove('printing-nota');
        }, 1000);
      }, 150);
    }

    `;

content = content.substring(0, startIdx) + newNotaCode + content.substring(endIdx);
console.log('✓ buildNotaHTML & printTransactionReceipt replaced with A5 Nota Penjualan Sales');

fs.writeFileSync('index.html', content, 'utf8');
console.log('🎉 index.html successfully updated with A5 Sales Nota!');

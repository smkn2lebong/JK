// =========================================
// URC JKN FRONTEND SCRIPT
// =========================================

// 🔗 Ganti URL API di bawah dengan milik kakak:
const API_URL = "https://script.google.com/macros/s/AKfycbwuIcX8AECRV38jnAK8IkwyKfwMuwQAiun0S9W8adcLAKhimuPHG73iJ0d-y4NPsn_u/exec";

// ⚙️ Event listener form
document.getElementById("ajuanForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;
  const loading = document.getElementById("loading");
  const success = document.getElementById("success");
  const waButton = document.getElementById("waButton");

  loading.style.display = "block";
  success.style.display = "none";

  try {
    // Ambil semua data text
    const nama = form.nama.value.trim();
    const kk = form.kk.value.trim();
    const nik = form.nik.value.trim();
    const hp = form.hp.value.trim();
    const alamat = form.alamat.value.trim();
    const puskesmas = form.puskesmas.value.trim();
    const relawan = form.relawan.value.trim();

    // Ambil semua file
    const files = [];
    const fileInputs = [
      { field: "file_kk", input: form.file_kk },
      { field: "file_ktp", input: form.file_ktp },
      { field: "file_rawat", input: form.file_rawat },
      { field: "file_tidak_mampu", input: form.file_tidak_mampu }
    ];

    for (const f of fileInputs) {
      if (f.input.files.length > 0) {
        const file = f.input.files[0];
        const base64 = await toBase64(file);
        files.push({
          field: f.field,
          name: file.name,
          content: base64
        });
      }
    }

    // Data siap dikirim
    const payload = {
      nama, kk, nik, hp, alamat, puskesmas, relawan, files
    };

    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();
    loading.style.display = "none";

    if (result.success) {
      success.style.display = "block";

      // Buat pesan WhatsApp otomatis
      const fileLinks = result.fileLinks || {};
      const waMessage = generateWhatsAppMessage({ nama, kk, nik, hp, alamat, puskesmas, relawan }, fileLinks);
      const waURL = `https://wa.me/6282281115991?text=${encodeURIComponent(waMessage)}`;

      // Tombol WA muncul
      waButton.onclick = () => window.open(waURL, "_blank");

    } else {
      alert("Gagal mengirim: " + result.message);
    }

  } catch (error) {
    loading.style.display = "none";
    alert("Terjadi kesalahan: " + error);
  }
});

// =========================================
// Konversi file ke Base64
// =========================================
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
  });
}

// =========================================
// Buat pesan WhatsApp otomatis
// =========================================
function generateWhatsAppMessage(data, fileLinks) {
  let message = `Assalamualaikum, mohon dibantu proses BPJS pasien A.N ${data.nama}\n\n`;
  message += `Nama Pasien : ${data.nama}\n`;
  message += `No KK : ${data.kk}\n`;
  message += `No NIK : ${data.nik}\n`;
  message += `No HP : ${data.hp}\n`;
  message += `Alamat : ${data.alamat}\n`;
  message += `Puskesmas Terdekat : ${data.puskesmas}\n\n`;

  message += `👥 Relawan Pengaju : ${data.relawan}\n\n`;
  message += `📎 Berkas Pendukung:\n`;

  if (fileLinks["file_kk"]) message += `- KK: ${fileLinks["file_kk"]}\n`;
  if (fileLinks["file_ktp"]) message += `- KTP: ${fileLinks["file_ktp"]}\n`;
  if (fileLinks["file_rawat"]) message += `- Surat Rawat Inap: ${fileLinks["file_rawat"]}\n`;
  if (fileLinks["file_tidak_mampu"]) message += `- Surat Tidak Mampu: ${fileLinks["file_tidak_mampu"]}\n`;

  message += `\nTerima kasih.`;
  return message;
}


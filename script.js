const scriptURL = "https://script.google.com/macros/s/AKfycbxjUNAoPzdSKgrFVTLn9hJkVhb2N3ZV9zUPOLPXl43qhUNEHMvDqPqQAL-qg2TZ56o/exec";

document.getElementById("urcForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("status");
  status.textContent = "⏳ Mengirim data, mohon tunggu...";

  const formData = new FormData(e.target);

  try {
    await fetch(scriptURL, {
      method: "POST",
      body: formData,
      mode: "no-cors" // penting agar tidak diblokir CORS
    });

    status.textContent = "✅ Ajuan berhasil dikirim!";
    
    // Buat pesan WA otomatis
    const nama = formData.get("nama");
    const kk = formData.get("kk");
    const nik = formData.get("nik");
    const hp = formData.get("hp");
    const alamat = formData.get("alamat");
    const puskesmas = formData.get("puskesmas");

    const pesan = `Assalamualaikum, mohon dibantu proses BPJS Pasien A.N ${nama}
No KK: ${kk}
NIK: ${nik}
HP: ${hp}
Alamat: ${alamat}
Puskesmas Terdekat: ${puskesmas}

Terima kasih. 🙏`;

    const nomorAdmin = "6282281115991";
    window.open(`https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`, "_blank");

    e.target.reset();
  } catch (err) {
    status.textContent = "❌ Gagal mengirim data: " + err.message;
  }
});

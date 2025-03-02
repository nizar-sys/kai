function generateRandomPhoneSuffix() {
  // Menghasilkan tiga digit angka acak
  return Math.floor(100 + Math.random() * 900);
}

function updatePhoneNumber() {
  const phoneInput = $("#inputCallerPhone"); // Cari elemen input nomor telepon berdasarkan ID

  if (phoneInput.length) {
    const currentValue = phoneInput.val(); // Ambil nilai nomor telepon saat ini
    const newValue = currentValue.slice(0, -3) + generateRandomPhoneSuffix(); // Ganti tiga digit terakhir dengan angka acak
    phoneInput.val(newValue); // Update input dengan nomor telepon yang baru
    console.log(`✅ Nomor telepon berhasil diperbarui menjadi: ${newValue}`);
    return true; // Menandakan bahwa nomor telepon telah berhasil diperbarui
  } else {
    console.log("⛔ Input nomor telepon tidak ditemukan.");
    return false; // Tidak ditemukan input nomor telepon
  }
}

function checkAlert() {
  const alert = $(".__alert__"); // Menggunakan jQuery untuk memilih elemen .__alert__

  // Pastikan elemen alert ada sebelum melanjutkan
  if (alert.length) {
    const modalBody = alert.find(".modal-body"); // Mencari .modal-body di dalam .__alert__

    if (modalBody.length) {
      const alertText = modalBody.text().trim(); // Mengambil inner text dan menghapus spasi ekstra

      // Memeriksa apakah pesan tertentu ada dalam modal
      if (
        alertText.includes(
          "Tidak dapat melakukan booking pada jadwal ini, karena anda terdeteksi melakukan booking dengan tidak normal."
        )
      ) {
        console.log("⛔ Booking tidak dapat dilakukan.");
        return true; // Menandakan bahwa alert tidak normal terdeteksi
      }
    } else {
      console.log("⛔ Elemen modal-body tidak ditemukan di dalam alert.");
    }
  } else {
    console.log("⛔ Elemen alert tidak ditemukan.");
  }

  return false; // Tidak ada masalah, alert normal
}

function checkAndBook() {
  // Mengecek apakah elemen dengan kelas __close__ ada
  const closeButton = document.querySelector(".__close__"),
    yesButton = document.querySelector(".__yes__");

  if (closeButton) {
    closeButton.click(); // Klik tombol close jika ditemukan
    console.log("✅ Popup berhasil ditutup!");
  }

  if (yesButton) {
    setTimeout(() => {
      yesButton.click(); // Klik tombol yes jika ditemukan
      console.log("✅ Booking berhasil!");
    }, 1000);
  }

  // Panggil fungsi captchaVerification();
  captchaVerification();
}

// Menjalankan fungsi setiap detik (1000ms)
setInterval(() => {
  // Cek apakah ada alert yang menunjukkan masalah booking
  const isAlertNotNormal = checkAlert();

  // Jika ada masalah (alert tidak normal), ganti nomor telepon dulu
  if (isAlertNotNormal) {
    const isPhoneUpdated = updatePhoneNumber();
    if (isPhoneUpdated) {
      // Jika nomor telepon berhasil diganti, lanjutkan booking dengan klik tombol
      checkAndBook();
    }
  } else {
    // Jika tidak ada masalah dengan alert, lanjutkan booking langsung
    checkAndBook();
  }
}, 1000);

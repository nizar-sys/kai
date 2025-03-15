async function solveCaptcha() {
    const captchaImage = document.querySelector('img[alt="https://github.com/igoshev/laravel-captcha"]');
    const inputField = document.querySelector('#captcha');
    const btnSearch = document.querySelector('#bayar');

    if (!captchaImage || !inputField) {
        console.error("Elemen CAPTCHA tidak ditemukan");
        return;
    }

    // Paksa refresh gambar CAPTCHA
    const newSrc = captchaImage.src.split("?")[0] + "?_=" + Date.now();
    captchaImage.src = newSrc;

    // Tunggu hingga gambar baru dimuat
    await new Promise(resolve => captchaImage.onload = resolve);

    // Konversi gambar ke base64
    const base64Image = await getBase64FromImage(captchaImage);

    // Kirim ke backend
    const response = await fetch("https://2ec9-103-119-66-139.ngrok-free.app/solve-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image })
    });

    const data = await response.json();
    if (data.captchaText) {
        inputField.value = data.captchaText;
        btnSearch.click();
    } else {
        console.error("Gagal menyelesaikan CAPTCHA");
    }
}

// Fungsi konversi gambar ke base64
function getBase64FromImage(img) {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/png").split(",")[1]); // Ambil data base64 tanpa prefix
    });
}

// Panggil fungsi saat halaman siap
solveCaptcha();

function autoCheckCheckbox() {
    $("#setuju").prop("checked", true).trigger("change");
}
autoCheckCheckbox();

$(document).ready(() => {
    // jika modal dgn id submitConfirm sudah muncul, maka jalankan clik button id mSubmit
    $("#submitConfirm").on("shown.bs.modal", () => {
        setTimeout(() => {
            $("#mSubmit").click();
        }, 1000);
    });
})

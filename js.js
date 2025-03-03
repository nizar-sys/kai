async function solveCaptcha() {
    const captchaImage = document.querySelector('img[alt="https://github.com/igoshev/laravel-captcha"]');
    const inputField = document.querySelector('#captcha');

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
    const response = await fetch("https://0b35-103-119-66-139.ngrok-free.app/solve-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image })
    });

    const data = await response.json();
    if (data.captchaText) {
        inputField.value = data.captchaText;
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

$(document).ready(function () {
    function loadSheetJS(callback) {
        if (typeof XLSX === "undefined") {
            let script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
            script.onload = callback;
            document.head.appendChild(script);
        } else {
            callback();
        }
    }

    function readExcel(file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            let names = [];
            let ids = [];
            jsonData.forEach((row, index) => {
                if (index > 0 && row.length >= 2) {
                    names.push(row[0]);
                    ids.push(row[1]);
                }
            });

            const formData = {
                "penumpang_nama[]": names,
                "penumpang_notandapengenal[]": ids,
            };

            autoFillForm(formData);
        };
    }

    function autoFillForm(formData) {
        $.each(formData, function (name, values) {
            const inputs = $("input[name='" + name + "']");
            $.each(values, function (index, value) {
                if (inputs.eq(index).length) {
                    inputs.eq(index).val(value);
                }
            });
        });
    }

    function autoCheckCheckbox() {
        $("#setuju").prop("checked", true).trigger("change");
    }
    autoCheckCheckbox();

    $("body").append(
        '<input type="file" id="excelFile" accept=".xlsx,.xls" style="display:none; margin: 10px 0;">'
    );
    $("body").append(
        '<button id="uploadExcel" style="padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer;">Import Excel</button>'
    );

    $("#uploadExcel").click(function () {
        $("#excelFile").click();
    });

    $("#excelFile").change(function (e) {
        const file = e.target.files[0];
        if (file) {
            loadSheetJS(() => readExcel(file));
        }
    });
});

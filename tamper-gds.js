(function () {
  "use strict";

  async function checkExpiration() {
    try {
      const response = await fetch("https://nizar.vercel.app/exp.json"); // Ganti dengan API yang valid
      const data = await response.json();
      const today = new Date();

      if (today > data.expired) {
        alert(`⛔ Skrip ini telah kedaluwarsa pada ${new Date(data.expired).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}. Hubungi penyedia untuk memperbarui lisensi.`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("⚠️ Gagal mengambil status expired:", error);
      return false;
    }
  }

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

  function checkRow(index) {
    if (typeof $ === "undefined" || typeof $("#tableScheduleDepart").bootstrapTable === "undefined") {
      console.log("BootstrapTable tidak ditemukan!");
      return;
    }
    $("#tableScheduleDepart").bootstrapTable("check", parseInt(index));
    console.log(`✅ Baris ke-${index} telah dipilih!`);
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
      jsonData.slice(1).forEach(row => {
        if (row.length >= 2) {
          names.push(row[0]);
          ids.push(row[1]);
        }
      });

      if (names.length > 8) {
        console.log("⛔ Maksimal 8 data diperbolehkan!");
        return;
      }

      autoFillForm({ "inputName": names, "inputIdentity": ids });
    };
  }

  function autoFillForm(formData) {
    ["inputName", "inputIdentity"].forEach(field => {
      document.querySelectorAll(`input[name="${field}"]`).forEach((input, index) => {
        if (formData[field][index]) input.value = formData[field][index];
      });
    });
    console.log("✅ Form berhasil diisi dengan data Excel.");
  }

  async function main() {
    const isValid = await checkExpiration();
    if (!isValid) return;

    let userIndex = prompt("Masukkan nomor index baris yang ingin dipilih:");
    if (userIndex) {
      checkRow(userIndex);
    } else {
      console.log("⛔ Input dibatalkan atau tidak valid.");
    }

    const excelInput = document.createElement("input");
    excelInput.type = "file";
    excelInput.accept = ".xlsx,.xls";
    excelInput.style.display = "none";

    if(!document.getElementById('triggerButton')){
      const triggerButton = document.createElement("button");
      Object.assign(triggerButton.style, {
        padding: "10px 20px",
        marginTop: "20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        cursor: "pointer",
      });
      triggerButton.id = "triggerButton";
      triggerButton.textContent = "Pilih File Excel";
      triggerButton.addEventListener("click", () => excelInput.click());
  
      document.body.appendChild(triggerButton);
    }

    excelInput.addEventListener("change", event => {
      const file = event.target.files[0];
      if (file) {
        console.log("📂 File Excel berhasil dipilih.");
        loadSheetJS(() => readExcel(file));
      } else {
        console.log("⛔ Tidak ada file yang dipilih.");
      }
    });

    excelInput.click();
  }

  main();
})();

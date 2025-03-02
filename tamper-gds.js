// ==UserScript==
// @name         Auto Check BootstrapTable
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Memilih baris pada BootstrapTable secara otomatis berdasarkan input user
// @author       Emnizaar
// @match        :///*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Fungsi untuk menambahkan dan memuat script XLSX jika belum ada
  function loadSheetJS(callback) {
    if (typeof XLSX === "undefined") {
      let script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      script.onload = callback;
      document.head.appendChild(script);
    } else {
      callback();
    }
  }

  // Fungsi untuk memilih baris tabel berdasarkan index
  function checkRow(index) {
    if (
      typeof $ === "undefined" ||
      typeof $("#tableScheduleDepart").bootstrapTable === "undefined"
    ) {
      console.log("BootstrapTable tidak ditemukan!");
      return;
    }
    $("#tableScheduleDepart").bootstrapTable("check", parseInt(index));
    console.log(`✅ Baris ke-${index} telah dipilih!`);
  }

  // Fungsi untuk membaca file Excel dan memproses data
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

      if (names.length > 8) {
        console.log("⛔ Maksimal 8 data diperbolehkan!");
        return;
      }

      const formData = {
        "inputName[]": names,
        "inputIdentity[]": ids,
      };

      // Mengisi form dengan data yang dibaca
      autoFillForm(formData);
    };
  }

  // Fungsi untuk mengisi form dengan data yang telah diproses
  function autoFillForm(formData) {
    formData["inputName[]"].forEach((name, index) => {
      const nameInputs = document.querySelectorAll('input[name="inputName"]');
      if (nameInputs[index]) {
        nameInputs[index].value = name;
      }
    });

    formData["inputIdentity[]"].forEach((id, index) => {
      const identityInputs = document.querySelectorAll(
        'input[name="inputIdentity"]'
      );
      if (identityInputs[index]) {
        identityInputs[index].value = id;
      }
    });

    console.log("✅ Form berhasil diisi dengan data Excel.");
  }

  // Fungsi utama untuk memilih baris dan memuat file Excel
  function main() {
    // Prompt untuk input index dari user
    let userIndex = prompt("Masukkan nomor index baris yang ingin dipilih:");
    if (userIndex !== null && userIndex !== "") {
      checkRow(userIndex);
    } else {
      console.log("⛔ Input dibatalkan atau tidak valid.");
    }

    // Menambahkan input file untuk memilih file Excel
    const excelInput = document.createElement("input");
    excelInput.type = "file";
    excelInput.accept = ".xlsx,.xls"; // Hanya menerima file Excel
    excelInput.style.display = "none"; // Menyembunyikan input file di halaman

    // Menambahkan tombol trigger untuk memilih file Excel
    const triggerButton = document.createElement("button");
    triggerButton.textContent = "Pilih File Excel";
    triggerButton.style.padding = "10px 20px";
    triggerButton.style.marginTop = "20px";
    triggerButton.style.backgroundColor = "#4CAF50";
    triggerButton.style.color = "white";
    triggerButton.style.border = "none";
    triggerButton.style.cursor = "pointer";

    // Ketika tombol diklik, input file akan diklik
    triggerButton.addEventListener("click", function () {
      excelInput.click();
    });

    // Menambahkan tombol ke halaman
    document.body.appendChild(triggerButton);

    // Ketika file dipilih, proses file tersebut
    excelInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        console.log("📂 File Excel berhasil dipilih.");
        loadSheetJS(() => {
          readExcel(file);
        });
      } else {
        console.log("⛔ Tidak ada file yang dipilih.");
      }
    });
  }

  // Jalankan fungsi utama
  main();
})();

// ==UserScript==
// @name         Auto Check BootstrapTable
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Memilih baris pada BootstrapTable secara otomatis berdasarkan input user
// @author       Kamu
// @match        :///*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Fungsi untuk memilih baris tabel berdasarkan index
    function checkRow(index) {
        if (typeof $ === 'undefined' || typeof $("#tableScheduleDepart").bootstrapTable === 'undefined') {
            console.log("BootstrapTable tidak ditemukan!");
            return;
        }
        $("#tableScheduleDepart").bootstrapTable("check", parseInt(index));
        console.log('✅ Baris ke-${index} telah dipilih!');

        booking();
    }

    // Prompt untuk input index dari user
    let userIndex = prompt("Masukkan nomor index baris yang ingin dipilih:");
    if (userIndex !== null && userIndex !== "") {
        checkRow(userIndex);
    } else {
        console.log("⛔ Input dibatalkan atau tidak valid.");
    }
})();

// ==UserScript==
// @name         Auto Solve CAPTCHA & Auto Confirm
// @namespace    http://tampermonkey.net/
// @version      2025-03-02
// @description  Auto-solve CAPTCHA and auto-confirm booking on KAI
// @author       You
// @match        https://booking.kai.id/passengerdata
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kai.id
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  const NGROK_URL = "https://4b0c-103-119-66-139.ngrok-free.app"; // Placeholder, will be replaced by the batch script

  async function solveCaptcha() {
      const captchaImage = document.querySelector('img[alt="https://github.com/igoshev/laravel-captcha"]');
      const inputField = document.getElementById("captcha");
      const btnSearch = document.getElementById("bayar");

      if (!captchaImage || !inputField || !btnSearch) {
          console.error("❌ Elemen CAPTCHA atau tombol bayar tidak ditemukan.");
          return;
      }

      captchaImage.src = captchaImage.src.split("?")[0] + "?_=" + Date.now();

      await new Promise(resolve => (captchaImage.onload = resolve));

      const base64Image = await getBase64FromImage(captchaImage);

      try {
          const response = await fetch(`${NGROK_URL}/solve-captcha`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ base64Image }),
          });

          if (!response.ok) throw new Error("Gagal mendapatkan respons dari server CAPTCHA");

          const data = await response.json();
          if (data.captchaText) {
              inputField.value = data.captchaText;
              btnSearch.click();
              console.log("✅ CAPTCHA berhasil diselesaikan & tombol bayar diklik!");
          } else {
              console.error("❌ Gagal menyelesaikan CAPTCHA.");
          }
      } catch (error) {
          console.error("❌ Terjadi kesalahan saat menghubungi server CAPTCHA:", error);
      }
  }

  function getBase64FromImage(img) {
      return new Promise(resolve => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);

          resolve(canvas.toDataURL("image/png").split(",")[1]);
      });
  }

  function autoCheckCheckbox() {
      const checkBox = document.getElementById("setuju");
      if (checkBox) {
          checkBox.checked = true;
          checkBox.dispatchEvent(new Event("change"));
          console.log("✅ Checkbox 'Saya setuju' otomatis dicentang.");
      } else {
          console.error("❌ Checkbox 'Saya setuju' tidak ditemukan.");
      }
  }

  if (typeof jQuery !== "undefined") {
      jQuery(document).ready(function() {
          jQuery("#submitConfirm").on("shown.bs.modal", function() {
              setTimeout(function() {
                  jQuery("#submitConfirm").modal("toggle");
                  jQuery("#pesanan").submit();
              }, 500);
          });
      });
  }

  autoCheckCheckbox();
  await solveCaptcha();

})();

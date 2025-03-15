let bookingInterval;
let isBookingActive = false;

async function checkExpiration() {
  try {
    const response = await fetch("https://nizar.vercel.app/exp.json");
    const data = await response.json();
    const today = new Date();

    if (today > new Date(data.expired)) {
      alert("⛔ Skrip ini telah kedaluwarsa.");
      return false;
    }
    return true;
  } catch (error) {
    console.error("⚠️ Gagal mengambil status expired:", error);
    return false;
  }
}

function generateRandomPhoneSuffix() {
  return Math.floor(100 + Math.random() * 900);
}

function updatePhoneNumber() {
  const phoneInput = $("#inputCallerPhone");
  if (phoneInput.length) {
    const currentValue = phoneInput.val();
    const newValue = currentValue.slice(0, -3) + generateRandomPhoneSuffix();
    phoneInput.val(newValue);
    console.log(`✅ Nomor telepon diperbarui: ${newValue}`);
    return true;
  }
  console.log("⛔ Input nomor telepon tidak ditemukan.");
  return false;
}

function checkAlert() {
  const alert = $(".__alert__");
  if (alert.length) {
    const modalBody = alert.find(".modal-body");
    if (modalBody.length) {
      const alertText = modalBody.text().trim();
      if (alertText.includes("Unable to make a booking on this schedule, because you are detected making an abnormal booking.")) {
        console.log("⛔ Booking tidak dapat dilakukan.");
        return true;
      }
    }
  }
  return false;
}

function checkMaximum() {
  const alert = $(".__alert__");
  if (alert.length) {
    const modalBody = alert.find(".modal-body");
    if (modalBody.length) {
      const alertText = modalBody.text().trim();
      if (alertText.includes("Maximum booking per minute reached, you need to wait!")) {
        console.log("⛔ Maximum booking limit reached. Waiting...");
        return true;
      }
    }
  }
  return false;
}

function checkAndBook() {
  if (!isBookingActive) return;
  console.log("🔍 Checking booking elements...");
  
  const closeButton = document.querySelector(".__close__"),
        yesButton = document.querySelector(".__yes__");

  if (closeButton) {
    closeButton.click();
    console.log("✅ Popup closed!");
  }

  const overlay = document.getElementById("__overlay__");
  if (overlay) overlay.style.display = "block";

  if (yesButton) {
    const delay = 1000 + Math.random() * 2000;
    console.log(`⏳ Waiting ${Math.round(delay)} ms before booking...`);
    setTimeout(() => {
      if (isBookingActive) {
        yesButton.click();
        console.log("✅ Booking successful!");
      }
    }, delay);
  } else {
    const delay = 1000 + Math.random() * 2000;
    console.log(`⏳ Waiting ${Math.round(delay)} ms before booking...`);
    setTimeout(() => {
      if (isBookingActive) {
        booking();
        console.log("✅ Booking successful!");
      }
    }, delay);
    console.log("⚠️ Booking button not found!");
  }
}

async function startBookingProcess() {
  const isValid = await checkExpiration();
  if (!isValid) {
    stopBookingProcess();
    return;
  }

  if (!isBookingActive) {
    isBookingActive = true;
    function attemptBooking() {
      if (!isBookingActive) return;
      
      console.log("🔄 Attempting to book...");
      // captchaVerification();
      // booking();
      
      if (checkAlert() && updatePhoneNumber()) {
        checkAndBook();
      } else {
        checkAndBook();
      }
      
      const nextTry = 1000 + Math.random() * 2000;
      console.log(`🔁 Next attempt in ${Math.round(nextTry)} ms...`);
      setTimeout(attemptBooking, nextTry);
    }
    attemptBooking();
    console.log("✅ Booking process started.");
  }
}

function stopBookingProcess() {
  isBookingActive = false;
  console.log("⛔ Booking process stopped.");

  document.querySelectorAll(".__confirm__").forEach((modal) => {
    modal.style.display = "none";
  });

  const overlay = document.getElementById("__overlay__");
  if (overlay) {
    overlay.style.display = "none";
  }
}

$(document).ready(function () {
  startBookingProcess();
});
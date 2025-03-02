const { execSync } = require('child_process');

function runScript() {
    try {
        execSync('osascript execute_script.scpt', { stdio: 'inherit' });
        console.log("✅ Script berhasil dijalankan di tab aktif Safari!");
    } catch (err) {
        console.error("❌ Error menjalankan script:", err);
    }
}

// Jalankan pertama kali
runScript();

// Jalankan secara terus-menerus setiap 5 detik untuk mengecek reload
setInterval(runScript, 5000);

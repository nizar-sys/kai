const { execSync } = require('child_process');

function runScript(command) {
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ Script berhasil dijalankan: ${command}`);
    } catch (err) {
        console.error(`❌ Error menjalankan script: ${command}`, err);
    }
}

// Pilih perintah berdasarkan OS
const isMac = process.platform === 'darwin';
const command = isMac ? 'osascript execute_script.scpt' : '';

// Jalankan pertama kali
runScript('pwsh -ExecutionPolicy Bypass -File execute_script.ps1');

// Jalankan secara berkala setiap 5 detik
setInterval(() => runScript('pwsh -ExecutionPolicy Bypass -File execute_script.ps1'), 5000);

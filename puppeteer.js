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
const command = isMac 
    ? 'osascript execute_script.scpt' 
    : 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -ExecutionPolicy Bypass -File execute_script.ps1';

// Jalankan pertama kali
runScript(command);

// Jalankan secara berkala setiap 5 detik
setInterval(() => runScript(command), 5000);

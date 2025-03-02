# Ambil tab aktif di Chrome
$chromeDevToolsURL = "http://localhost:9222/json"

# Cek apakah Chrome/Edge sedang berjalan
try {
    $activeTabs = Invoke-RestMethod -Uri $chromeDevToolsURL -ErrorAction Stop
    $activeTab = $activeTabs | Where-Object { $_.type -eq "page" -and $_.url -match "booking.kai.id" } | Select-Object -First 1
} catch {
    Write-Host "❌ Chrome/Edge tidak berjalan atau debugging belum diaktifkan!"
    exit
}

if ($activeTab -and $activeTab.webSocketDebuggerUrl) {
    $debuggerURL = $activeTab.webSocketDebuggerUrl

    # JavaScript yang akan dieksekusi
    $script = @'
        (async function() {
            try {
                const captchaImage = document.querySelector('img[alt="https://github.com/igoshev/laravel-captcha"]');
                const inputField = document.querySelector('#captcha');
                const btnSearch = document.querySelector('#bayar');

                if (!captchaImage || !inputField) {
                    console.error("❌ Elemen CAPTCHA tidak ditemukan");
                    return;
                }

                // Paksa refresh gambar CAPTCHA
                captchaImage.src = captchaImage.src.split('?')[0] + '?_=' + Date.now();

                // Tunggu hingga gambar baru dimuat
                await new Promise(resolve => captchaImage.onload = resolve);

                // Konversi gambar ke base64
                function getBase64FromImage(img) {
                    return new Promise((resolve) => {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        resolve(canvas.toDataURL("image/png").split(",")[1]);
                    });
                }

                const base64Image = await getBase64FromImage(captchaImage);

                // Kirim ke backend
                const response = await fetch("https://7944-2404-c0-2140-00-470-2f31.ngrok-free.app/solve-captcha", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ base64Image })
                });

                const data = await response.json();
                if (data.captchaText) {
                    inputField.value = data.captchaText;
                    btnSearch.click();
                } else {
                    console.error("❌ Gagal menyelesaikan CAPTCHA");
                }
            } catch (error) {
                console.error("❌ Error menjalankan script:", error);
            }
        })();
'@

    # Kirim perintah eksekusi JavaScript ke tab aktif
    $payload = @{
        id = 1
        method = "Runtime.evaluate"
        params = @{ expression = $script; returnByValue = $true }
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-RestMethod -Uri $debuggerURL -Method Post -Body $payload -ContentType "application/json" | Out-Null
        Write-Host "✅ Script berhasil dieksekusi di tab aktif!"
    } catch {
        Write-Host "❌ Gagal mengeksekusi script di tab aktif!"
    }
} else {
    Write-Host "❌ Tidak ada tab aktif dengan URL booking.kai.id"
}

# change_wallpaper.ps1 — Sets the desktop wallpaper with FIT mode (whole image visible)
param(
    [string]$ImagePath = ""
)

# Locate wallpaper image safely
$resolvedPath = $null

if ($ImagePath -and (Test-Path $ImagePath)) {
    $resolvedPath = (Resolve-Path $ImagePath).Path
} else {
    $requestedName = if ($ImagePath) { [System.IO.Path]::GetFileName($ImagePath) } else { "wallpaper.jpg" }
    $candidates = @(
        (Join-Path $PSScriptRoot "..\assets\$requestedName"),
        (Join-Path $PSScriptRoot "..\picture\$requestedName"),
        (Join-Path (Get-Location) "assets\$requestedName"),
        (Join-Path (Get-Location) "picture\$requestedName"),
        (Join-Path $PSScriptRoot "..\assets\qr_payment.jpg"),
        (Join-Path $PSScriptRoot "..\picture\qrcodeMOBIQUICK.jpeg"),
        (Join-Path $PSScriptRoot "..\assets\wallpaper.jpg"),
        (Join-Path $PSScriptRoot "..\picture\itni-jaldi-kya-hai-meme-on-project-submission.jpg")
    )
    foreach ($cand in $candidates) {
        if ($cand -and (Test-Path $cand)) {
            $resolvedPath = (Resolve-Path $cand).Path
            break
        }
    }
}

if (-not $resolvedPath -or -not (Test-Path $resolvedPath)) {
    Write-Host "[Wallpaper] Wallpaper asset not found, skipping."
    exit 0
}

$ImagePath = $resolvedPath

# Convert JPG to BMP for maximum wallpaper compatibility and razor-sharp clarity
try {
    Add-Type -AssemblyName System.Drawing -ErrorAction SilentlyContinue
    $bmpPath = [System.IO.Path]::ChangeExtension($ImagePath, ".bmp")
    $img = [System.Drawing.Image]::FromFile($ImagePath)
    $img.Save($bmpPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
    $img.Dispose()
    $wallpaperPath = $bmpPath
} catch {
    $wallpaperPath = $ImagePath
}

# Set wallpaper style to FIT (WallpaperStyle=6, TileWallpaper=0) so full image/QR code is visible without cropping
try {
    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name WallpaperStyle -Value 6 -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name TileWallpaper -Value 0 -ErrorAction SilentlyContinue
    # Clean dark navy/black background color around letterboxed image (RGB: 15 23 42)
    Set-ItemProperty -Path "HKCU:\Control Panel\Colors" -Name Background -Value "15 23 42" -ErrorAction SilentlyContinue
} catch {}

# Apply wallpaper using Windows API
try {
    Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class Wallpaper {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
"@ -ErrorAction SilentlyContinue
} catch {}

# SPI_SETDESKWALLPAPER = 0x0014, SPIF_UPDATEINIFILE | SPIF_SENDWININICHANGE = 0x03
try {
    [Wallpaper]::SystemParametersInfo(0x0014, 0, $wallpaperPath, 0x03) | Out-Null
} catch {}

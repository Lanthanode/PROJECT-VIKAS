# change_wallpaper.ps1 — Sets the desktop wallpaper with FIT mode (whole image visible)
param(
    [string]$ImagePath
)

# Locate wallpaper image safely
if (-not $ImagePath -or -not (Test-Path $ImagePath)) {
    $candidates = @(
        (Join-Path $PSScriptRoot "..\assets\wallpaper.jpg"),
        (Join-Path $PSScriptRoot "..\picture\itni-jaldi-kya-hai-meme-on-project-submission.jpg"),
        (Join-Path (Get-Location) "assets\wallpaper.jpg"),
        (Join-Path (Get-Location) "picture\itni-jaldi-kya-hai-meme-on-project-submission.jpg")
    )
    foreach ($cand in $candidates) {
        if (Test-Path $cand) {
            $ImagePath = $cand
            break
        }
    }
}

if (-not (Test-Path $ImagePath)) {
    Write-Host "[Wallpaper] Wallpaper asset not found, skipping."
    exit 0
}

$ImagePath = (Resolve-Path $ImagePath).Path

# Convert JPG to BMP for maximum wallpaper compatibility
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

# Set wallpaper style to FIT (WallpaperStyle=6, TileWallpaper=0) so full image is visible
try {
    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name WallpaperStyle -Value 6 -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name TileWallpaper -Value 0 -ErrorAction SilentlyContinue
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

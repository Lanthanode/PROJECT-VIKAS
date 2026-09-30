# change_wallpaper.ps1 — Sets the desktop wallpaper with FIT mode (whole image visible)
param(
    [string]$ImagePath
)

if (-not $ImagePath) {
    $ImagePath = Join-Path $PSScriptRoot "..\assets\wallpaper.jpg"
}

$ImagePath = (Resolve-Path $ImagePath).Path

# Convert JPG to BMP for maximum wallpaper compatibility
Add-Type -AssemblyName System.Drawing
$bmpPath = [System.IO.Path]::ChangeExtension($ImagePath, ".bmp")
$img = [System.Drawing.Image]::FromFile($ImagePath)
$img.Save($bmpPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
$img.Dispose()

# Set wallpaper style to FIT (WallpaperStyle=6, TileWallpaper=0) so full image is visible
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name WallpaperStyle -Value 6
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name TileWallpaper -Value 0

# Apply wallpaper using Windows API
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class Wallpaper {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
"@

# SPI_SETDESKWALLPAPER = 0x0014, SPIF_UPDATEINIFILE | SPIF_SENDWININICHANGE = 0x03
[Wallpaper]::SystemParametersInfo(0x0014, 0, $bmpPath, 0x03) | Out-Null

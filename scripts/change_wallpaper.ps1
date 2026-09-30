# change_wallpaper.ps1 — Sets the desktop wallpaper to the meme image
param(
    [string]$ImagePath
)

if (-not $ImagePath) {
    $ImagePath = Join-Path $PSScriptRoot "assets\wallpaper.jpg"
}

$ImagePath = (Resolve-Path $ImagePath).Path

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class Wallpaper {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
"@

# SPI_SETDESKWALLPAPER = 0x0014, SPIF_UPDATEINIFILE | SPIF_SENDWININICHANGE = 0x03
[Wallpaper]::SystemParametersInfo(0x0014, 0, $ImagePath, 0x03) | Out-Null

Write-Host "[WALLPAPER] Desktop wallpaper changed successfully!"

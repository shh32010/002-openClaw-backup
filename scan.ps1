[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'SilentlyContinue'

$paths = @{
    "Windows Temp" = "C:\Windows\Temp"
    "User Temp" = "$env:TEMP"
    "Win Update Cache" = "C:\Windows\SoftwareDistribution\Download"
    "Prefetch" = "C:\Windows\Prefetch"
    "Delivery Optimization" = "C:\Windows\SoftwareDistribution\DeliveryOptimization"
    "Windows Error Reports" = "C:\ProgramData\Microsoft\Windows\WER"
    "Crash Dumps" = "C:\Windows\Minidump"
    "User Crash Dumps" = "$env:LOCALAPPDATA\CrashDumps"
    "Thumbnail Cache" = "$env:LOCALAPPDATA\Microsoft\Windows\Explorer"
    "Chrome Cache" = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache"
    "Edge Cache" = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache"
    "Edge Code Cache" = "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Code Cache"
    "npm Cache" = "$env:LOCALAPPDATA\npm-cache"
    "pip Cache" = "$env:LOCALAPPDATA\pip\cache"
    "Windows Logs" = "C:\Windows\Logs"
}

foreach ($entry in $paths.GetEnumerator()) {
    $p = $entry.Value
    if (Test-Path $p) {
        $bytes = (Get-ChildItem $p -Recurse -Force -File | Measure-Object Length -Sum).Sum
        $mb = [math]::Round($bytes / 1MB, 1)
        Write-Output "$($entry.Key) = $mb MB  ($p)"
    }
}

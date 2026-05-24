[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Get-DirSizeMB($path) {
    if (-not (Test-Path $path)) { return -1 }
    $total = 0
    Get-ChildItem $path -Recurse -Force -File -ErrorAction SilentlyContinue | ForEach-Object {
        $total += $_.Length
    }
    return [math]::Round($total/1MB, 2)
}

$checks = @(
    @("Windows Temp", "C:\Windows\Temp"),
    @("User Temp", $env:TEMP),
    @("Windows Update Cache", "C:\Windows\SoftwareDistribution\Download"),
    @("Prefetch", "C:\Windows\Prefetch"),
    @("Delivery Optimization", "C:\Windows\SoftwareDistribution\DeliveryOptimization"),
    @("Windows Error Reports", "C:\ProgramData\Microsoft\Windows\WER"),
    @("Crash Dumps", "C:\Windows\Minidump"),
    @("User Crash Dumps", $env:LOCALAPPDATA + "\CrashDumps"),
    @("Thumbnail Cache", $env:LOCALAPPDATA + "\Microsoft\Windows\Explorer"),
    @("Chrome Cache", $env:LOCALAPPDATA + "\Google\Chrome\User Data\Default\Cache"),
    @("Edge Cache", $env:LOCALAPPDATA + "\Microsoft\Edge\User Data\Default\Cache"),
    @("Edge Code Cache", $env:LOCALAPPDATA + "\Microsoft\Edge\User Data\Default\Code Cache"),
    @("Edge GPU Cache", $env:LOCALAPPDATA + "\Microsoft\Edge\User Data\Default\GPUCache"),
    @("npm Cache", $env:LOCALAPPDATA + "\npm-cache"),
    @("pip Cache", $env:LOCALAPPDATA + "\pip\cache"),
    @("Windows Logs", "C:\Windows\Logs")
)

$results = @()
foreach ($c in $checks) {
    $name = $c[0]
    $path = $c[1]
    $mb = Get-DirSizeMB $path
    if ($mb -gt 0) {
        $results += "$name|$mb|$path"
    }
}

$results | Sort-Object { [double]($_.Split('|')[1]) } -Descending | ForEach-Object {
    $parts = $_.Split('|')
    $name = $parts[0]
    $mb = [double]$parts[1]
    $path = $parts[2]
    if ($mb -gt 1024) {
        $val = "{0:N2} GB" -f ($mb/1024)
    } else {
        $val = "{0:N2} MB" -f $mb
    }
    Write-Output "$name = $val  ($path)"
}

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

function Get-DirSize($path) {
    if (Test-Path $path) {
        try {
            $size = (Get-ChildItem $path -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
            return [math]::Round($size/1MB, 2)
        } catch { return -1 }
    }
    return -1
}

Write-Output "=== C Disk Cleanup Scan ==="

# Disk overview
$disk = Get-PSDrive C
$total = [math]::Round($disk.Used/1GB, 2)
$free = [math]::Round($disk.Free/1GB, 2)
Write-Output "C: Used=${total}GB  Free=${free}GB"
Write-Output ""

# System temp folders
$checks = @(
    @("Windows Temp", "C:\Windows\Temp", "safe"),
    @("User Temp", "$env:TEMP", "safe"),
    @("Windows Update Download", "C:\Windows\SoftwareDistribution\Download", "safe-after-update"),
    @("Prefetch", "C:\Windows\Prefetch", "safe"),
    @("Delivery Optimization", "C:\Windows\SoftwareDistribution\DeliveryOptimization", "safe"),
    @("Windows Error Reports", "C:\ProgramData\Microsoft\Windows\WER", "safe"),
    @("Crash Dumps (Minidump)", "C:\Windows\Minidump", "safe"),
    @("User Crash Dumps", "$env:LOCALAPPDATA\CrashDumps", "safe"),
    @("Thumbnail Cache", "$env:LOCALAPPDATA\Microsoft\Windows\Explorer", "safe"),
    @("Chrome Cache", "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache", "safe"),
    @("Edge Cache", "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache", "safe"),
    @("Edge Cache CodeCache", "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Code Cache", "safe"),
    @("Edge GPU Cache", "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\GPUCache", "safe"),
    @("npm Cache", "$env:LOCALAPPDATA\npm-cache", "safe"),
    @("pip Cache", "$env:LOCALAPPDATA\pip\cache", "safe"),
    @("Windows Logs", "C:\Windows\Logs", "careful"),
    @("Installer Cache", "C:\Windows\Installer", "do NOT delete"),
    @("WinSxS", "C:\Windows\WinSxS", "do NOT delete")
)

$results = @()
foreach ($c in $checks) {
    $name = $c[0]
    $path = $ExecutionContext.InvokeCommand.ExpandString($c[1])
    $safety = $c[2]
    $mb = Get-DirSize $path
    if ($mb -gt 0) {
        $results += [PSCustomObject]@{Name=$name; Path=$path; MB=$mb; Safety=$safety}
    }
}

$results | Sort-Object MB -Descending | ForEach-Object {
    $gb = if ($_.MB -gt 1024) { " ({0:N2} GB)" -f ($_.MB/1024) } else { "" }
    Write-Output ("  [{0}] {1} = {2:N2} MB{3} -- {4}" -f $_.Safety, $_.Name, $_.MB, $gb, $_.Path)
}

Write-Output ""
Write-Output "=== Large folders on C:\ (>500MB) ==="
Get-ChildItem C:\ -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
    try {
        $size = (Get-ChildItem $_.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        if ($size -gt 500MB) {
            $gb = [math]::Round($size/1GB, 2)
            Write-Output ("  {0} = {1} GB" -f $_.FullName, $gb)
        }
    } catch {}
}

Write-Output ""
Write-Output "=== Done ==="

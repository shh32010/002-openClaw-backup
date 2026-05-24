[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Get-DirSizeMB($path) {
    if (-not (Test-Path $path)) { return -1 }
    $total = 0
    try {
        Get-ChildItem $path -Recurse -Force -File -ErrorAction SilentlyContinue | ForEach-Object {
            $total += $_.Length
        }
    } catch {}
    return [math]::Round($total/1MB, 2)
}

$disk = Get-PSDrive C
Write-Output ("C: Used={0}GB  Free={1}GB" -f [math]::Round($disk.Used/1GB,2), [math]::Round($disk.Free/1GB,2))
Write-Output ""

$checks = @(
    @("Windows Temp", "C:\Windows\Temp", "[safe]"),
    @("User Temp", "$env:TEMP", "[safe]"),
    @("Windows Update Cache", "C:\Windows\SoftwareDistribution\Download", "[safe-after-update]"),
    @("Prefetch", "C:\Windows\Prefetch", "[safe]"),
    @("Delivery Optimization", "C:\Windows\SoftwareDistribution\DeliveryOptimization", "[safe]"),
    @("Windows Error Reports", "C:\ProgramData\Microsoft\Windows\WER", "[safe]"),
    @("Crash Dumps", "C:\Windows\Minidump", "[safe]"),
    @("User Crash Dumps", "$env:LOCALAPPDATA\CrashDumps", "[safe]"),
    @("Thumbnail Cache", "$env:LOCALAPPDATA\Microsoft\Windows\Explorer", "[safe]"),
    @("Chrome Cache", "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Cache", "[safe]"),
    @("Edge Cache", "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Cache", "[safe]"),
    @("Edge Code Cache", "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Code Cache", "[safe]"),
    @("Edge GPU Cache", "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\GPUCache", "[safe]"),
    @("npm Cache", "$env:LOCALAPPDATA\npm-cache", "[safe]"),
    @("pip Cache", "$env:LOCALAPPDATA\pip\cache", "[safe]"),
    @("Windows Logs", "C:\Windows\Logs", "[careful]"),
    @("Installer Cache", "C:\Windows\Installer", "[do NOT delete]"),
    @("WinSxS", "C:\Windows\WinSxS", "[do NOT delete]")
)

foreach ($c in $checks) {
    $name = $c[0]
    $rawPath = $c[1]
    $safety = $c[2]
    $path = $ExecutionContext.InvokeCommand.ExpandString($rawPath)
    $mb = Get-DirSizeMB $path
    if ($mb -gt 0) {
        if ($mb -gt 1024) {
            $str = "{0:N2} GB" -f ($mb/1024)
        } else {
            $str = "{0:N2} MB" -f $mb
        }
        Write-Output ("  {0,-28} {1,>12}  {2}  {3}" -f $name, $str, $safety, $path)
    }
}

Write-Output ""
Write-Output "Done."

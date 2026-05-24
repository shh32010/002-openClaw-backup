[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'SilentlyContinue'

$before = (Get-PSDrive C).Free

Write-Output "Cleaning pip cache..."
Remove-Item 'C:\Users\002\AppData\Local\pip\cache\*' -Recurse -Force

Write-Output "Cleaning Edge cache..."
Remove-Item 'C:\Users\002\AppData\Local\Microsoft\Edge\User Data\Default\Cache\*' -Recurse -Force
Remove-Item 'C:\Users\002\AppData\Local\Microsoft\Edge\User Data\Default\Code Cache\*' -Recurse -Force

Write-Output "Cleaning thumbnail cache..."
Remove-Item 'C:\Users\002\AppData\Local\Microsoft\Windows\Explorer\thumbcache_*' -Force

Write-Output "Cleaning npm cache..."
Remove-Item 'C:\Users\002\AppData\Local\npm-cache\*' -Recurse -Force

Write-Output "Cleaning user temp..."
Remove-Item 'C:\Users\002\AppData\Local\Temp\*' -Recurse -Force

Write-Output "Cleaning Windows Update cache..."
Remove-Item 'C:\Windows\SoftwareDistribution\Download\*' -Recurse -Force

Write-Output "Cleaning Windows logs..."
Remove-Item 'C:\Windows\Logs\*.log' -Force
Remove-Item 'C:\Windows\Logs\CBS\*.log' -Force
Remove-Item 'C:\Windows\Logs\DISM\*.log' -Force

$after = (Get-PSDrive C).Free
$freed = [math]::Round(($after - $before) / 1MB, 1)
Write-Output ""
Write-Output "Done. Freed: $freed MB"
Write-Output ("Free space now: " + [math]::Round($after/1GB, 2) + " GB")

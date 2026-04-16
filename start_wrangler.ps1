# Start wrangler dev in background
$ErrorActionPreference = 'SilentlyContinue'
$proc = Start-Process -FilePath "npm" -ArgumentList "run","dev" -WorkingDirectory "C:\Users\60270\Desktop\cfworker2" -WindowStyle Hidden -PassThru
if ($proc) {
    Write-Host "Process started, PID: $($proc.Id)"
    Start-Sleep 10
    Write-Host "Checking port..."
    $result = netstat -ano | Select-String ":8787"
    if ($result) {
        Write-Host "Port 8787 is listening"
    } else {
        Write-Host "Port 8787 is NOT listening"
    }
} else {
    Write-Host "Failed to start process"
}

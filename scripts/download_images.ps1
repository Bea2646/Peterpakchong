$ProjectRoot = if (Test-Path (Join-Path $PSScriptRoot "..\index.html")) { (Resolve-Path "$PSScriptRoot\..").Path } else { (Get-Location).Path }
$BaseUrl     = "https://peterpakchong.com"
$OutputDir   = Join-Path $ProjectRoot "image_downloads"

if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$htmlFiles = Get-ChildItem -Path $ProjectRoot -Filter "*.html" -File

if ($htmlFiles.Count -eq 0) {
    Write-Host "ไม่พบไฟล์ .html ในโฟลเดอร์ $ProjectRoot" -ForegroundColor Red
    exit
}

$allImagePaths = New-Object System.Collections.Generic.HashSet[string]

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $match = [regex]::Match($content, 'window\.PAGE_IMAGES\s*=\s*\[(.*?)\]\s*;', 'Singleline')

    if ($match.Success) {
        $arrayContent = $match.Groups[1].Value
        $imageMatches = [regex]::Matches($arrayContent, '"([^"]+)"')
        Write-Host "พบรูป $($imageMatches.Count) รูปใน $($file.Name)" -ForegroundColor Cyan
        foreach ($m in $imageMatches) {
            $allImagePaths.Add($m.Groups[1].Value) | Out-Null
        }
    }
}

Write-Host ""
Write-Host "รวมรูปทั้งหมดที่ไม่ซ้ำกัน: $($allImagePaths.Count) รูป" -ForegroundColor Yellow
Write-Host "เริ่มดาวน์โหลด..." -ForegroundColor Yellow
Write-Host ""

$success = 0
$failed  = 0
$failedList = @()

foreach ($relPath in $allImagePaths) {
    $url = "$BaseUrl/$relPath"
    $localPath = Join-Path $OutputDir $relPath
    $localDir = Split-Path $localPath -Parent

    if (!(Test-Path $localDir)) {
        New-Item -ItemType Directory -Path $localDir -Force | Out-Null
    }

    if (Test-Path $localPath) { continue }

    try {
        Invoke-WebRequest -Uri $url -OutFile $localPath -UseBasicParsing -TimeoutSec 20
        Write-Host "OK   $relPath" -ForegroundColor Green
        $success++
    }
    catch {
        Write-Host "FAIL $relPath" -ForegroundColor Red
        $failed++
        $failedList += $url
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "เสร็จสิ้น: สำเร็จ $success รูป, ล้มเหลว $failed รูป" -ForegroundColor Yellow
Write-Host "ไฟล์ถูกเก็บไว้ที่: $OutputDir" -ForegroundColor Yellow

if ($failedList.Count -gt 0) {
    $failedLogPath = Join-Path $ProjectRoot "failed_urls.txt"
    $failedList | Out-File -FilePath $failedLogPath -Encoding UTF8
    Write-Host "รายชื่อ URL ที่โหลดไม่สำเร็จถูกบันทึกไว้ที่: $failedLogPath" -ForegroundColor Red
}
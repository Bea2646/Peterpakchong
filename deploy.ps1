# ============================================================
# deploy.ps1 — สร้างโฟลเดอร์ deploy และอัพขึ้น Cloudflare Pages
# ============================================================

$SRC = $PSScriptRoot
$DEPLOY = Join-Path $SRC "_deploy"

# ลบโฟลเดอร์ deploy เก่า (ถ้ามี)
if (Test-Path $DEPLOY) { Remove-Item $DEPLOY -Recurse -Force }
New-Item $DEPLOY -ItemType Directory | Out-Null

# ===== คัดลอกเฉพาะไฟล์เว็บจริง =====

# HTML pages
$htmlFiles = @(
    "index.html",
    "bighouse.html",
    "house1.html", "house2.html", "house3.html",
    "house4.html", "house5.html", "house6.html",
    "nearby2.html", "nearby3.html", "nearby6.html",
    "nearby7.html", "nearby8.html", "nearby9.html"
)

foreach ($f in $htmlFiles) {
    Copy-Item (Join-Path $SRC $f) (Join-Path $DEPLOY $f)
}

# SEO files
Copy-Item (Join-Path $SRC "sitemap.xml") (Join-Path $DEPLOY "sitemap.xml")
Copy-Item (Join-Path $SRC "robots.txt") (Join-Path $DEPLOY "robots.txt")

# JS folder
Copy-Item (Join-Path $SRC "js") (Join-Path $DEPLOY "js") -Recurse

# Image folders
Copy-Item (Join-Path $SRC "image") (Join-Path $DEPLOY "image") -Recurse

# House photo folders
foreach ($dir in @("12", "34", "56", "Big")) {
    Copy-Item (Join-Path $SRC $dir) (Join-Path $DEPLOY $dir) -Recurse
}

# Atmosphere folders
Copy-Item (Join-Path $SRC "View") (Join-Path $DEPLOY "View") -Recurse
Copy-Item (Join-Path $SRC "Darkview") (Join-Path $DEPLOY "Darkview") -Recurse

# Scripts folder (if exists)
if (Test-Path (Join-Path $SRC "scripts")) {
    Copy-Item (Join-Path $SRC "scripts") (Join-Path $DEPLOY "scripts") -Recurse
}

# ===== สรุป =====
$fileCount = (Get-ChildItem $DEPLOY -Recurse -File | Measure-Object).Count
Write-Host ""
Write-Host "✅ เตรียมโฟลเดอร์ deploy เสร็จ: $DEPLOY" -ForegroundColor Green
Write-Host "📁 จำนวนไฟล์: $fileCount ไฟล์" -ForegroundColor Cyan
Write-Host ""
Write-Host "กำลัง deploy ขึ้น Cloudflare Pages..." -ForegroundColor Yellow
Write-Host ""

# ===== Deploy =====
npx wrangler pages deploy $DEPLOY --project-name peterpakchong --branch main --commit-message "Deploy update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

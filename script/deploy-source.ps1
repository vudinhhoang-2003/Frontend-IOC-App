$ErrorActionPreference = "Stop"

$ProjectRoot = "f:\quawaco-ioc-web"
$Server = "chinhnv@34.21.136.177"
$TargetDir = "/var/www/Quanlynhamaynuoc"
$TarFile = "source.tar.gz"

Write-Host "1. Đang nén source code (sử dụng tar để bao gồm cả file chưa commit, bỏ qua node_modules, dist...)..." -ForegroundColor Cyan
Set-Location $ProjectRoot
# Nén toàn bộ thư mục hiện tại nhưng loại trừ các thư mục nặng/không cần thiết
tar.exe -czf $TarFile --exclude="node_modules" --exclude="dist" --exclude=".git" --exclude=".kiro" .

Write-Host "2. Đang copy source code lên server..." -ForegroundColor Cyan
scp $TarFile "${Server}:/tmp/$TarFile"

Write-Host "3. Đang giải nén source code trên server..." -ForegroundColor Cyan
# User chinhnv đã có quyền trên /var/www nên không cần sudo
ssh $Server "mkdir -p $TargetDir && tar -xzf /tmp/$TarFile -C $TargetDir && rm /tmp/$TarFile"

Write-Host "4. Dọn dẹp file tạm ở local..." -ForegroundColor Cyan
Remove-Item -Path $TarFile -Force

Write-Host "XONG! Toàn bộ source code đã được đẩy lên thư mục $TargetDir trên server." -ForegroundColor Green

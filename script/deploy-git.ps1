$ErrorActionPreference = "Stop"

Write-Host "Đang đẩy code qua Git lên server (Push-to-Deploy)..." -ForegroundColor Cyan

# Push nhánh hiện tại lên hệ thống Git bare trên server tại nhánh master
git push production HEAD:master

Write-Host "XONG! Toàn bộ thay đổi của bạn đã được cập nhật siêu tốc vào thư mục /var/www/Quanlynhamaynuoc trên server." -ForegroundColor Green
Write-Host "Lưu ý: Chỉ những file bạn đã commit mới được đẩy lên." -ForegroundColor Yellow

#Requires -Version 5.1

###############################################################################
# QUAWACO IOC React Application - Interactive Deployment Script
# Target: demo.iclever.vn/qioc
# Server: 34.21.136.177
# Note: You will be prompted for password during execution
###############################################################################

param(
    [Parameter(Position=0)]
    [ValidateSet('deploy', 'rollback', 'logs', 'manual')]
    [string]$Action = 'deploy'
)

# Configuration
$SERVER_USER = "chinhnv"
$SERVER_HOST = "34.21.136.177"
$APP_PATH = "/var/www/frontend-ioc-web/dist"
$SITE_NAME = "demo-iclever-qioc"
$DOMAIN = "demo.iclever.vn"
$SUBPATH = "/qioc"

# Functions
function Write-Header {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "========================================`n" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

function Show-ManualInstructions {
    Write-Header "Manual Deployment Instructions"
    
    Write-Info "Since automated password entry is not supported, here are the manual steps:"
    Write-Host ""
    
    Write-Host "1. Connect to server:" -ForegroundColor Yellow
    Write-Host "   ssh $SERVER_USER@$SERVER_HOST" -ForegroundColor White
    Write-Host "   Password: Chinh@1234" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "2. Create backup:" -ForegroundColor Yellow
    Write-Host @"
   BACKUP_DIR="/home/$SERVER_USER/nginx-backups/`$(date +%Y%m%d_%H%M%S)"
   sudo mkdir -p `$BACKUP_DIR
   sudo cp -r /etc/nginx/sites-available/ `$BACKUP_DIR/
   sudo cp -r /etc/nginx/sites-enabled/ `$BACKUP_DIR/
   sudo cp /etc/nginx/nginx.conf `$BACKUP_DIR/
   echo "Backup created at: `$BACKUP_DIR"
"@ -ForegroundColor White
    Write-Host ""
    
    Write-Host "3. Verify application files:" -ForegroundColor Yellow
    Write-Host "   ls -la $APP_PATH/" -ForegroundColor White
    Write-Host ""
    
    Write-Host "4. Fix permissions:" -ForegroundColor Yellow
    Write-Host @"
   sudo chown -R www-data:www-data $APP_PATH
   sudo chmod -R 755 $APP_PATH
"@ -ForegroundColor White
    Write-Host ""
    
    Write-Host "5. Create Nginx configuration:" -ForegroundColor Yellow
    Write-Host "   sudo nano /etc/nginx/sites-available/$SITE_NAME" -ForegroundColor White
    Write-Host ""
    Write-Host "   Paste this configuration:" -ForegroundColor Gray
    Write-Host @"
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    
    root /var/www/html;
    index index.html index.htm;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json 
               image/svg+xml;
    
    location $SUBPATH {
        alias $APP_PATH;
        try_files `$uri `$uri/ $SUBPATH/index.html;
        
        location ~* ^$SUBPATH/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)`$ {
            alias $APP_PATH;
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        
        location = $SUBPATH/index.html {
            alias $APP_PATH/index.html;
            expires -1;
            add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        }
    }
    
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
"@ -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "   Save: Ctrl+X, then Y, then Enter" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "6. Test configuration:" -ForegroundColor Yellow
    Write-Host "   sudo nginx -t" -ForegroundColor White
    Write-Host ""
    
    Write-Host "7. Enable site:" -ForegroundColor Yellow
    Write-Host "   sudo ln -s /etc/nginx/sites-available/$SITE_NAME /etc/nginx/sites-enabled/" -ForegroundColor White
    Write-Host ""
    
    Write-Host "8. Reload Nginx:" -ForegroundColor Yellow
    Write-Host "   sudo systemctl reload nginx" -ForegroundColor White
    Write-Host ""
    
    Write-Host "9. Verify deployment:" -ForegroundColor Yellow
    Write-Host "   curl -I http://$DOMAIN$SUBPATH/" -ForegroundColor White
    Write-Host ""
    
    Write-Host "10. Test in browser:" -ForegroundColor Yellow
    Write-Host "    http://$DOMAIN$SUBPATH/" -ForegroundColor White
    Write-Host ""
    
    Write-Success "Copy and paste these commands into your SSH session!"
}

function Start-InteractiveDeployment {
    Write-Header "QUAWACO IOC Interactive Deployment"
    
    Write-Warning "This script will guide you through deployment steps."
    Write-Warning "You will need to enter the password (Chinh@1234) when prompted."
    Write-Host ""
    
    # Check if ssh is available
    try {
        $null = Get-Command ssh -ErrorAction Stop
        Write-Success "SSH client found"
    } catch {
        Write-ErrorMsg "SSH client not found"
        Write-Info "Please install OpenSSH Client from Windows Optional Features"
        exit 1
    }
    
    Write-Host ""
    Write-Info "Opening SSH connection to $SERVER_USER@$SERVER_HOST..."
    Write-Info "Password: Chinh@1234"
    Write-Host ""
    
    # Create deployment script on local machine
    $deployScript = @"
#!/bin/bash
set -e

echo "========================================="
echo "QUAWACO IOC Deployment Script"
echo "========================================="

# Create backup
echo ""
echo "Step 1: Creating backup..."
BACKUP_DIR="/home/$SERVER_USER/nginx-backups/`$(date +%Y%m%d_%H%M%S)"
sudo mkdir -p `$BACKUP_DIR
sudo cp -r /etc/nginx/sites-available/ `$BACKUP_DIR/
sudo cp -r /etc/nginx/sites-enabled/ `$BACKUP_DIR/
sudo cp /etc/nginx/nginx.conf `$BACKUP_DIR/
echo "✓ Backup created at: `$BACKUP_DIR"

# Verify files
echo ""
echo "Step 2: Verifying application files..."
if [ -f "$APP_PATH/index.html" ]; then
    echo "✓ Application files found"
else
    echo "✗ Application files not found at $APP_PATH"
    exit 1
fi

# Fix permissions
echo ""
echo "Step 3: Setting permissions..."
sudo chown -R www-data:www-data $APP_PATH
sudo chmod -R 755 $APP_PATH
echo "✓ Permissions set"

# Create Nginx config
echo ""
echo "Step 4: Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/$SITE_NAME > /dev/null << 'NGINX_CONFIG'
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    
    root /var/www/html;
    index index.html index.htm;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json 
               image/svg+xml;
    
    location $SUBPATH {
        alias $APP_PATH;
        try_files \`$uri \`$uri/ $SUBPATH/index.html;
        
        location ~* ^$SUBPATH/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
            alias $APP_PATH;
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        
        location = $SUBPATH/index.html {
            alias $APP_PATH/index.html;
            expires -1;
            add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        }
    }
    
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINX_CONFIG
echo "✓ Configuration created"

# Test configuration
echo ""
echo "Step 5: Testing Nginx configuration..."
if sudo nginx -t; then
    echo "✓ Configuration is valid"
else
    echo "✗ Configuration test failed"
    exit 1
fi

# Enable site
echo ""
echo "Step 6: Enabling site..."
sudo ln -sf /etc/nginx/sites-available/$SITE_NAME /etc/nginx/sites-enabled/$SITE_NAME
echo "✓ Site enabled"

# Reload Nginx
echo ""
echo "Step 7: Reloading Nginx..."
if sudo systemctl reload nginx; then
    echo "✓ Nginx reloaded"
else
    echo "✗ Nginx reload failed"
    exit 1
fi

# Verify
echo ""
echo "Step 8: Verifying deployment..."
sleep 2
HTTP_STATUS=`$(curl -s -o /dev/null -w '%{http_code}' http://$DOMAIN$SUBPATH/)
if [ "`$HTTP_STATUS" = "200" ]; then
    echo "✓ Deployment successful! HTTP status: `$HTTP_STATUS"
else
    echo "⚠ HTTP status: `$HTTP_STATUS"
fi

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo "URL: http://$DOMAIN$SUBPATH/"
echo "Backup: `$BACKUP_DIR"
echo ""
"@

    # Save script to temp file with Unix line endings
    $tempScript = [System.IO.Path]::GetTempFileName() + ".sh"
    # Convert to Unix line endings (LF only)
    $deployScript -replace "`r`n", "`n" | Out-File -FilePath $tempScript -Encoding ASCII -NoNewline
    "`n" | Out-File -FilePath $tempScript -Encoding ASCII -Append -NoNewline
    
    Write-Info "Uploading deployment script to server..."
    Write-Host ""
    
    # Upload script
    & scp -o StrictHostKeyChecking=no $tempScript "${SERVER_USER}@${SERVER_HOST}:/tmp/deploy-quawaco.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Script uploaded successfully"
        Write-Host ""
        Write-Info "Executing deployment script on server..."
        Write-Host ""
        
        # Execute script
        & ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" "chmod +x /tmp/deploy-quawaco.sh && /tmp/deploy-quawaco.sh"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Success "Deployment completed successfully!"
            Write-Host ""
            Write-Info "Test your application at: http://$DOMAIN$SUBPATH/"
        } else {
            Write-ErrorMsg "Deployment failed. Check the output above for errors."
        }
    } else {
        Write-ErrorMsg "Failed to upload script"
        Write-Info "Falling back to manual instructions..."
        Show-ManualInstructions
    }
    
    # Cleanup
    Remove-Item $tempScript -ErrorAction SilentlyContinue
}

function Start-Rollback {
    Write-Header "Rolling Back Deployment"
    
    Write-Info "Connecting to server..."
    Write-Info "Password: Chinh@1234"
    Write-Host ""
    
    $rollbackScript = @"
sudo rm -f /etc/nginx/sites-enabled/$SITE_NAME
sudo nginx -t
sudo systemctl reload nginx
echo "✓ Rollback completed"
"@
    
    $tempScript = [System.IO.Path]::GetTempFileName() + ".sh"
    $rollbackScript -replace "`r`n", "`n" | Out-File -FilePath $tempScript -Encoding ASCII -NoNewline
    "`n" | Out-File -FilePath $tempScript -Encoding ASCII -Append -NoNewline
    
    & scp -o StrictHostKeyChecking=no $tempScript "${SERVER_USER}@${SERVER_HOST}:/tmp/rollback-quawaco.sh"
    & ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" "chmod +x /tmp/rollback-quawaco.sh && /tmp/rollback-quawaco.sh"
    
    Remove-Item $tempScript -ErrorAction SilentlyContinue
}

function Show-Logs {
    Write-Header "Checking Nginx Logs"
    
    Write-Info "Connecting to server..."
    Write-Info "Password: Chinh@1234"
    Write-Host ""
    
    & ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" @"
echo "=== Access Log (last 20 lines) ==="
sudo tail -20 /var/log/nginx/access.log | grep '$SUBPATH'
echo ""
echo "=== Error Log (last 20 lines) ==="
sudo tail -20 /var/log/nginx/error.log
"@
}

# Main execution
switch ($Action) {
    'deploy' {
        Start-InteractiveDeployment
    }
    'rollback' {
        Start-Rollback
    }
    'logs' {
        Show-Logs
    }
    'manual' {
        Show-ManualInstructions
    }
}

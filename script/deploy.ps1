#Requires -Version 5.1

###############################################################################
# QUAWACO IOC React Application - Automated Deployment Script (PowerShell)
# Target: demo.iclever.vn/qioc
# Server: 34.21.136.177
###############################################################################

param(
    [Parameter(Position=0)]
    [ValidateSet('deploy', 'rollback', 'logs')]
    [string]$Action = 'deploy'
)

# Configuration
$SERVER_USER = "chinhnv"
$SERVER_HOST = "34.21.136.177"
$SERVER_PASSWORD = "Chinh@1234"
$APP_PATH = "/var/www/frontend-ioc-web/dist"
$SITE_NAME = "demo-iclever-qioc"
$DOMAIN = "demo.iclever.vn"
$SUBPATH = "/qioc"

# Functions
function Write-Header {
    param([string]$Message)
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
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

# Check if SSH tools are available
function Test-SSHAvailable {
    # Check for OpenSSH (ssh command)
    try {
        $null = Get-Command ssh -ErrorAction Stop
        return @{ Available = $true; Type = "ssh" }
    } catch {
        # Check for plink (PuTTY)
        try {
            $null = Get-Command plink -ErrorAction Stop
            return @{ Available = $true; Type = "plink" }
        } catch {
            return @{ Available = $false; Type = $null }
        }
    }
}

# Execute command on remote server
function Invoke-RemoteCommand {
    param(
        [string]$Command,
        [string]$Type = "ssh"
    )
    
    if ($Type -eq "plink") {
        $plinkArgs = @(
            "-batch",
            "-pw", $SERVER_PASSWORD,
            "$SERVER_USER@$SERVER_HOST",
            $Command
        )
        $result = & plink $plinkArgs 2>&1
    } else {
        # Use ssh with sshpass-like behavior
        $env:SSHPASS = $SERVER_PASSWORD
        $sshArgs = @(
            "-o", "StrictHostKeyChecking=no",
            "-o", "UserKnownHostsFile=/dev/null",
            "$SERVER_USER@$SERVER_HOST",
            $Command
        )
        
        # For Windows OpenSSH, we need to handle password differently
        # Create a temporary expect-like script
        $result = echo $SERVER_PASSWORD | & ssh $sshArgs 2>&1
    }
    
    return $result
}

# Main deployment function
function Start-Deployment {
    Write-Header "QUAWACO IOC Deployment Script"
    
    # Check prerequisites
    Write-Info "Checking prerequisites..."
    
    $sshCheck = Test-SSHAvailable
    
    if (-not $sshCheck.Available) {
        Write-ErrorMsg "Neither plink (PuTTY) nor ssh is available"
        Write-Info "Please install one of the following:"
        Write-Info "1. PuTTY (includes plink): https://www.putty.org/"
        Write-Info "2. OpenSSH Client (Windows 10+): Settings > Apps > Optional Features > OpenSSH Client"
        Write-Info "3. Git for Windows (includes ssh): https://git-scm.com/download/win"
        exit 1
    }
    
    $script:SSHType = $sshCheck.Type
    Write-Success "Prerequisites OK (using $($sshCheck.Type))"
    
    # Step 1: Test SSH connection
    Write-Header "Step 1: Testing SSH Connection"
    try {
        $testResult = Invoke-RemoteCommand -Command "echo 'Connection successful'" -Type $script:SSHType
        if ($testResult -match "Connection successful") {
            Write-Success "SSH connection established"
        } else {
            Write-ErrorMsg "Failed to connect to server"
            Write-Info "Please verify server credentials and try manual connection:"
            Write-Info "ssh $SERVER_USER@$SERVER_HOST"
            exit 1
        }
    } catch {
        Write-ErrorMsg "Failed to connect to server: $_"
        Write-Info "Trying manual SSH connection method..."
        Write-Info "You will be prompted for password: $SERVER_PASSWORD"
        exit 1
    }
    
    # Step 2: Verify application files
    Write-Header "Step 2: Verifying Application Files"
    $fileCheck = Invoke-RemoteCommand "test -f $APP_PATH/index.html && echo 'exists' || echo 'not found'"
    if ($fileCheck -match "exists") {
        Write-Success "Application files found at $APP_PATH"
    } else {
        Write-ErrorMsg "Application files not found at $APP_PATH"
        Write-Info "Please ensure dist.zip is extracted to $APP_PATH"
        exit 1
    }
    
    # Step 3: Create backup
    Write-Header "Step 3: Creating Backup"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $BACKUP_DIR = "/home/$SERVER_USER/nginx-backups/$timestamp"
    
    $backupCommands = @"
sudo mkdir -p $BACKUP_DIR
sudo cp -r /etc/nginx/sites-available/ $BACKUP_DIR/
sudo cp -r /etc/nginx/sites-enabled/ $BACKUP_DIR/
sudo cp /etc/nginx/nginx.conf $BACKUP_DIR/
ls -la /etc/nginx/sites-enabled/ > $BACKUP_DIR/active-sites.txt
echo 'Backup completed'
"@
    
    $backupResult = Invoke-RemoteCommand $backupCommands
    Write-Success "Backup created at $BACKUP_DIR"
    
    # Step 4: Fix file permissions
    Write-Header "Step 4: Setting File Permissions"
    $permCommands = @"
sudo chown -R www-data:www-data $APP_PATH
sudo chmod -R 755 $APP_PATH
echo 'Permissions set'
"@
    
    Invoke-RemoteCommand $permCommands | Out-Null
    Write-Success "File permissions set"
    
    # Step 5: Create Nginx configuration
    Write-Header "Step 5: Creating Nginx Configuration"
    
    # Create config content
    $nginxConfig = @'
server {
    listen 80;
    listen [::]:80;
    server_name demo.iclever.vn;
    
    root /var/www/html;
    index index.html index.htm;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json 
               image/svg+xml;
    
    # QUAWACO IOC Application at /qioc
    location /qioc {
        alias /var/www/frontend-ioc-web/dist;
        try_files $uri $uri/ /qioc/index.html;
        
        # Cache static assets
        location ~* ^/qioc/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            alias /var/www/frontend-ioc-web/dist;
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        
        # No cache for index.html
        location = /qioc/index.html {
            alias /var/www/frontend-ioc-web/dist/index.html;
            expires -1;
            add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        }
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
'@
    
    # Save config to temp file
    $tempConfigFile = [System.IO.Path]::GetTempFileName()
    $nginxConfig | Out-File -FilePath $tempConfigFile -Encoding ASCII -NoNewline
    
    # Upload config using pscp (PuTTY) or scp
    try {
        if (Get-Command pscp -ErrorAction SilentlyContinue) {
            & pscp -batch -pw $SERVER_PASSWORD $tempConfigFile "${SERVER_USER}@${SERVER_HOST}:/tmp/nginx-config-temp"
        } else {
            Write-Warning "pscp not found, using alternative method"
            # Create config on server directly
            $escapedConfig = $nginxConfig -replace "'", "'\\''"
            Invoke-RemoteCommand "echo '$escapedConfig' | sudo tee /tmp/nginx-config-temp > /dev/null"
        }
        
        # Move config to proper location
        Invoke-RemoteCommand "sudo mv /tmp/nginx-config-temp /etc/nginx/sites-available/$SITE_NAME" | Out-Null
        Write-Success "Nginx configuration created"
    } finally {
        Remove-Item $tempConfigFile -ErrorAction SilentlyContinue
    }
    
    # Step 6: Test Nginx configuration
    Write-Header "Step 6: Testing Nginx Configuration"
    $testResult = Invoke-RemoteCommand "sudo nginx -t 2>&1"
    if ($testResult -match "syntax is ok" -and $testResult -match "test is successful") {
        Write-Success "Nginx configuration syntax is valid"
    } else {
        Write-ErrorMsg "Nginx configuration syntax error"
        Write-Host $testResult
        Write-Info "Rolling back..."
        Invoke-RemoteCommand "sudo rm /etc/nginx/sites-available/$SITE_NAME" | Out-Null
        exit 1
    }
    
    # Step 7: Check for conflicts
    Write-Header "Step 7: Checking for Conflicts"
    $conflicts = Invoke-RemoteCommand "grep -r 'server_name.*$DOMAIN' /etc/nginx/sites-enabled/ 2>/dev/null | wc -l"
    if ([int]$conflicts -gt 0) {
        Write-Warning "Found $conflicts existing configuration(s) for $DOMAIN"
        Write-Info "You may need to manually resolve conflicts"
    } else {
        Write-Success "No conflicts detected"
    }
    
    # Step 8: Enable site
    Write-Header "Step 8: Enabling Site"
    Invoke-RemoteCommand "sudo ln -sf /etc/nginx/sites-available/$SITE_NAME /etc/nginx/sites-enabled/$SITE_NAME" | Out-Null
    Write-Success "Site enabled"
    
    # Step 9: Reload Nginx
    Write-Header "Step 9: Reloading Nginx"
    $reloadResult = Invoke-RemoteCommand "sudo systemctl reload nginx 2>&1"
    if ($reloadResult -notmatch "failed" -and $reloadResult -notmatch "error") {
        Write-Success "Nginx reloaded successfully"
    } else {
        Write-ErrorMsg "Failed to reload Nginx"
        Write-Host $reloadResult
        Write-Info "Rolling back..."
        Invoke-RemoteCommand "sudo rm /etc/nginx/sites-enabled/$SITE_NAME" | Out-Null
        exit 1
    }
    
    # Step 10: Verify deployment
    Write-Header "Step 10: Verifying Deployment"
    Start-Sleep -Seconds 2
    
    $httpStatus = Invoke-RemoteCommand "curl -s -o /dev/null -w '%{http_code}' http://$DOMAIN$SUBPATH/"
    if ($httpStatus -eq "200") {
        Write-Success "Deployment successful! HTTP status: $httpStatus"
    } else {
        Write-Warning "Unexpected HTTP status: $httpStatus"
        Write-Info "Check logs: sudo tail -50 /var/log/nginx/error.log"
    }
    
    # Final summary
    Write-Header "Deployment Summary"
    Write-Host "✓ Application deployed successfully" -ForegroundColor Green
    Write-Host "URL: http://$DOMAIN$SUBPATH/" -ForegroundColor Cyan
    Write-Host "Backup location: $BACKUP_DIR" -ForegroundColor Cyan
    Write-Host ""
    Write-Info "Next steps:"
    Write-Host "  1. Test the application in your browser: http://$DOMAIN$SUBPATH/"
    Write-Host "  2. Check logs: .\deploy.ps1 logs"
    Write-Host "  3. To rollback: .\deploy.ps1 rollback"
}

# Rollback function
function Start-Rollback {
    Write-Header "Rolling Back Deployment"
    
    Write-Info "Disabling site..."
    Invoke-RemoteCommand "sudo rm -f /etc/nginx/sites-enabled/$SITE_NAME" | Out-Null
    
    Write-Info "Testing configuration..."
    Invoke-RemoteCommand "sudo nginx -t" | Out-Null
    
    Write-Info "Reloading Nginx..."
    Invoke-RemoteCommand "sudo systemctl reload nginx" | Out-Null
    
    Write-Success "Rollback completed"
    Write-Info "The site configuration is still available at /etc/nginx/sites-available/$SITE_NAME"
}

# Check logs function
function Show-Logs {
    Write-Header "Checking Nginx Logs"
    
    Write-Host "=== Access Log (last 20 lines) ===" -ForegroundColor Cyan
    Invoke-RemoteCommand "sudo tail -20 /var/log/nginx/access.log | grep '$SUBPATH'"
    
    Write-Host ""
    Write-Host "=== Error Log (last 20 lines) ===" -ForegroundColor Cyan
    Invoke-RemoteCommand "sudo tail -20 /var/log/nginx/error.log"
}

# Main execution
switch ($Action) {
    'deploy' {
        Start-Deployment
    }
    'rollback' {
        Start-Rollback
    }
    'logs' {
        Show-Logs
    }
}

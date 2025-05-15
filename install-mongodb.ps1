# PowerShell script to download and install MongoDB Community Edition

# Create directories for MongoDB
$mongoDBDir = "C:\MongoDB"
$dataDir = "$mongoDBDir\data\db"
$logDir = "$mongoDBDir\log"

# Create directories if they don't exist
if (!(Test-Path -Path $mongoDBDir)) {
    New-Item -ItemType Directory -Path $mongoDBDir
}
if (!(Test-Path -Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir
}
if (!(Test-Path -Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir
}

# Download MongoDB
$mongoDBVersion = "6.0.12"
$downloadUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.12-signed.msi"
$installerPath = "$env:TEMP\mongodb-installer.msi"

Write-Host "Downloading MongoDB $mongoDBVersion..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath

# Install MongoDB
Write-Host "Installing MongoDB..."
Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet INSTALLLOCATION=`"$mongoDBDir`" ADDLOCAL=`"ServerNoService,Client,Router,MonitoringTools,ImportExportTools,MiscellaneousTools`"" -Wait

# Create MongoDB configuration file
$configContent = @"
# MongoDB Configuration File

# Storage
storage:
  dbPath: $dataDir
  journal:
    enabled: true

# System Log
systemLog:
  destination: file
  path: $logDir\mongod.log
  logAppend: true

# Network
net:
  port: 27017
  bindIp: 127.0.0.1
"@

$configPath = "$mongoDBDir\mongod.cfg"
$configContent | Out-File -FilePath $configPath -Encoding ASCII

# Add MongoDB to PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if (!$currentPath.Contains("$mongoDBDir\bin")) {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$mongoDBDir\bin", "Machine")
    Write-Host "Added MongoDB to PATH"
}

# Create a service for MongoDB
Write-Host "Creating MongoDB service..."
Start-Process -FilePath "$mongoDBDir\bin\mongod.exe" -ArgumentList "--config `"$configPath`" --install" -Wait

# Start MongoDB service
Write-Host "Starting MongoDB service..."
Start-Service MongoDB

Write-Host "MongoDB installation completed!"
Write-Host "MongoDB is installed at: $mongoDBDir"
Write-Host "Data directory: $dataDir"
Write-Host "Log directory: $logDir"
Write-Host "Configuration file: $configPath"
Write-Host "MongoDB service is running on port 27017"

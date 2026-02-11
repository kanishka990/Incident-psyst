# PostgreSQL Setup Script for Windows
# This script helps resolve "password authentication failed" issues

Write-Host "🔧 PostgreSQL Setup Script" -ForegroundColor Cyan
Write-Host "=" -Repeat 50

# Check if PostgreSQL service is running
Write-Host "`n1️⃣ Checking PostgreSQL service..." -ForegroundColor Yellow
$service = Get-Service -Name postgresql-x64-18 -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "✅ PostgreSQL service found: $($service.Name) - Status: $($service.Status)" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL service not found. Please install PostgreSQL 18." -ForegroundColor Red
    exit 1
}

# Test connection with PGPASSWORD
Write-Host "`n2️⃣ Testing connection..." -ForegroundColor Yellow
$env:PGPASSWORD='database'
$result = & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h 127.0.0.1 -U postgres -d postgres -c "SELECT version();" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection successful with password 'database'" -ForegroundColor Green
    Write-Host $result | Select-Object -First 1
} else {
    Write-Host "❌ Connection failed. Attempting alternative methods..." -ForegroundColor Red
    
    # Try without password (trust auth)
    Write-Host "`n3️⃣ Trying connection without password..." -ForegroundColor Yellow
    $env:PGPASSWORD=''
    $result = & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -U postgres -d postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connection successful without password" -ForegroundColor Green
        Write-Host "⚠️  Update .env: DB_PASSWORD= (empty)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Still failing. You may need to:" -ForegroundColor Red
        Write-Host "   - Run pgAdmin and reset postgres user password to: database"
        Write-Host "   - Or reinstall PostgreSQL" -ForegroundColor Yellow
        exit 1
    }
}

# Check if database exists
Write-Host "`n4️⃣ Checking if database 'incidentdb' exists..." -ForegroundColor Yellow
$env:PGPASSWORD='database'
$dbCheck = & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h 127.0.0.1 -U postgres -d postgres -c "\l" 2>&1
if ($dbCheck -like "*incidentdb*") {
    Write-Host "✅ Database 'incidentdb' found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database 'incidentdb' not found. Creating..." -ForegroundColor Yellow
    $createDb = & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h 127.0.0.1 -U postgres -d postgres -c "CREATE DATABASE incidentdb;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not create database: $createDb" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Setup complete! Try running: npm run dev" -ForegroundColor Green

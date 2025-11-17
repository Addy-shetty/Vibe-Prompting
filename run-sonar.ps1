# Run SonarQube Analysis Locally
# Make sure SonarQube is running on localhost:9000

Write-Host "Checking if SonarQube is running..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:9000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ SonarQube is running on localhost:9000" -ForegroundColor Green
} catch {
    Write-Host "✗ SonarQube is not accessible at localhost:9000" -ForegroundColor Red
    Write-Host "  Start SonarQube with: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nRunning SonarQube analysis..." -ForegroundColor Cyan

# Check if sonar-scanner is installed
$sonarScanner = Get-Command sonar-scanner -ErrorAction SilentlyContinue

if (-not $sonarScanner) {
    Write-Host "✗ sonar-scanner not found" -ForegroundColor Red
    Write-Host "  Install it with: npm install -g sonarqube-scanner" -ForegroundColor Yellow
    Write-Host "  Or download from: https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/" -ForegroundColor Yellow
    exit 1
}

# Run the analysis
sonar-scanner

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Analysis complete! View results at http://localhost:9000/dashboard?id=Addy-shetty_Vibe-Prompting_3ea74998-7189-4e3e-a7e0-8be5ce3a3a3c" -ForegroundColor Green
} else {
    Write-Host "`n✗ Analysis failed" -ForegroundColor Red
    exit $LASTEXITCODE
}

# KIU Volunteer Finder - Frontend-Backend Connection Setup Script

Write-Host "Setting up Frontend-Backend Connection..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "backend") -or -not (Test-Path "volunteerfinderfront")) {
    Write-Host "Error: Please run this script from the root directory of the project" -ForegroundColor Red
    exit 1
}

# Install CORS dependency in backend
Write-Host "Installing CORS dependency in backend..." -ForegroundColor Yellow
Set-Location backend
try {
    npm install @fastify/cors
    Write-Host "✓ CORS dependency installed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install CORS dependency. Please run manually: npm install @fastify/cors" -ForegroundColor Red
}

# Go back to root
Set-Location ..

Write-Host "`nSetup complete! Next steps:" -ForegroundColor Green
Write-Host "1. Start the backend server: cd backend && npm run dev" -ForegroundColor Cyan
Write-Host "2. Start the frontend server: cd volunteerfinderfront && npm run dev" -ForegroundColor Cyan
Write-Host "3. Open http://localhost:5173 in your browser" -ForegroundColor Cyan
Write-Host "`nFor detailed instructions, see CONNECTION_SETUP.md" -ForegroundColor Yellow 
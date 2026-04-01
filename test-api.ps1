# Test API endpoint
$uri = "http://localhost:8000/api/v1/dashboard/patient/test/1"

try {
    Write-Host "Testing API endpoint: $uri" -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri $uri -UseBasicParsing -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "API Response Status: 200 OK" -ForegroundColor Green
        
        $data = $response.Content | ConvertFrom-Json
        
        Write-Host "`n=== API Response Data ===" -ForegroundColor Yellow
        Write-Host ($data | ConvertTo-Json -Depth 2) -ForegroundColor White
        
        Write-Host "`n=== Patient Info ===" -ForegroundColor Yellow
        if ($data.data.patient_info) {
            Write-Host ("Name: " + $data.data.patient_info.ho_ten) -ForegroundColor Green
            Write-Host ("Patient ID: " + $data.data.patient_info.ma_benh_nhan) -ForegroundColor Green
            Write-Host ("Blood Type: " + $data.data.patient_info.nhom_mau) -ForegroundColor Green
        }
        
        Write-Host "`n=== Upcoming Appointments ===" -ForegroundColor Yellow
        if ($data.data.upcoming_appointments) {
            Write-Host ("Count: " + $data.data.upcoming_appointments.Count) -ForegroundColor Green
        }
        
    } else {
        Write-Host ("API Error: Status " + $response.StatusCode) -ForegroundColor Red
    }
} catch {
    Write-Host ("Error: " + $_) -ForegroundColor Red
    Write-Host "Make sure backend is running" -ForegroundColor Yellow
}

# Test Patient Profile API
$uri = "http://localhost:8000/api/v1/patients/test/1"

try {
    Write-Host "Testing Patient Profile API: $uri" -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri $uri -UseBasicParsing -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "API Response Status: 200 OK" -ForegroundColor Green
        
        $data = $response.Content | ConvertFrom-Json
        
        Write-Host "`n=== Patient Profile Data ===" -ForegroundColor Yellow
        
        if ($data.data) {
            Write-Host ("Name: " + $data.data.ho_ten) -ForegroundColor Green
            Write-Host ("Patient ID: " + $data.data.ma_benh_nhan) -ForegroundColor Green
            Write-Host ("Birth Date: " + $data.data.ngay_sinh) -ForegroundColor Green
            Write-Host ("Gender: " + $data.data.gioi_tinh) -ForegroundColor Green
            Write-Host ("Phone: " + $data.data.so_dien_thoai) -ForegroundColor Green
            Write-Host ("Email: " + $data.data.email) -ForegroundColor Green
            Write-Host ("Blood Type: " + $data.data.nhom_mau) -ForegroundColor Green
            Write-Host ("Medical History: " + $data.data.tien_su_benh) -ForegroundColor Green
            Write-Host ("Allergies: " + $data.data.tien_su_di_ung) -ForegroundColor Green
        }
        
        Write-Host "`n=== Full Response ===" -ForegroundColor Yellow
        Write-Host ($data | ConvertTo-Json -Depth 2) -ForegroundColor White
        
    } else {
        Write-Host ("API Error: Status " + $response.StatusCode) -ForegroundColor Red
    }
} catch {
    Write-Host ("Error: " + $_) -ForegroundColor Red
    Write-Host "Make sure backend is running" -ForegroundColor Yellow
}

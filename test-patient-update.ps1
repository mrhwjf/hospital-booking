# Test Patient Profile Update API
Write-Host "=== Testing Patient Profile API ===" -ForegroundColor Cyan

# 1. First get the profile
Write-Host "`n1. Fetching patient profile..." -ForegroundColor Yellow
$getUri = "http://localhost:8000/api/v1/patients/test/1"

try {
    $getResponse = Invoke-WebRequest -Uri $getUri -UseBasicParsing -ErrorAction Stop
    $profileData = $getResponse.Content | ConvertFrom-Json
    
    Write-Host "Current Data:" -ForegroundColor Green
    Write-Host ("  Name: " + $profileData.data.ho_ten) -ForegroundColor White
    Write-Host ("  Phone: " + $profileData.data.so_dien_thoai) -ForegroundColor White
    Write-Host ("  Blood Type: " + $profileData.data.nhom_mau) -ForegroundColor White
    
    # 2. Update the profile
    Write-Host "`n2. Updating patient profile..." -ForegroundColor Yellow
    $updateUri = "http://localhost:8000/api/v1/patients/update/1"
    
    $updateData = @{
        ho_ten = "Nguyen Van An - Updated"
        ngay_sinh = $profileData.data.ngay_sinh.Split('T')[0]
        gioi_tinh = $profileData.data.gioi_tinh
        so_dien_thoai = "0909999999"
        email = $profileData.data.email
        so_cccd = $profileData.data.so_cccd
        dia_chi = $profileData.data.dia_chi
        nguoi_lien_he = $profileData.data.nguoi_lien_he
        sdt_nguoi_lien_he = $profileData.data.sdt_nguoi_lien_he
        nhom_mau = "AB+"
        tien_su_di_ung = $profileData.data.tien_su_di_ung
        tien_su_benh = $profileData.data.tien_su_benh
        ghi_chu = $profileData.data.ghi_chu
    } | ConvertTo-Json
    
    $updateResponse = Invoke-WebRequest -Uri $updateUri -Method PUT `
        -Body $updateData `
        -ContentType "application/json" `
        -UseBasicParsing `
        -ErrorAction Stop
    
    $updatedData = $updateResponse.Content | ConvertFrom-Json
    
    if ($updateResponse.StatusCode -eq 200) {
        Write-Host "Updated Data:" -ForegroundColor Green
        Write-Host ("  Name: " + $updatedData.data.ho_ten) -ForegroundColor White
        Write-Host ("  Phone: " + $updatedData.data.so_dien_thoai) -ForegroundColor White
        Write-Host ("  Blood Type: " + $updatedData.data.nhom_mau) -ForegroundColor White
        Write-Host ("  Message: " + $updatedData.message) -ForegroundColor Green
    }
    
    # 3. Verify the update
    Write-Host "`n3. Verifying the update..." -ForegroundColor Yellow
    $verifyResponse = Invoke-WebRequest -Uri $getUri -UseBasicParsing -ErrorAction Stop
    $verifyData = $verifyResponse.Content | ConvertFrom-Json
    
    Write-Host "Verified Data:" -ForegroundColor Green
    Write-Host ("  Name: " + $verifyData.data.ho_ten) -ForegroundColor White
    Write-Host ("  Phone: " + $verifyData.data.so_dien_thoai) -ForegroundColor White
    Write-Host ("  Blood Type: " + $verifyData.data.nhom_mau) -ForegroundColor White
    
    if ($verifyData.data.so_dien_thoai -eq "0909999999" -and $verifyData.data.nhom_mau -eq "AB+") {
        Write-Host "`n[SUCCESS] Update successful!" -ForegroundColor Green
    } else {
        Write-Host "`n[WARNING] Update may have failed" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host ("Error: " + $_) -ForegroundColor Red
    Write-Host "Make sure backend is running on port 8000" -ForegroundColor Yellow
}

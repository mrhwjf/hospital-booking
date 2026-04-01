Hiện tại tôi đã thêm cloudinary vào hệ thống của mình, các file tôi đã viết là:
- `backend\app\Services\CloudinaryService.php`
- `backend\app\Resources\Cloudinary`
- `backend\app\Requests\Cloudinary`
- `backend\app\Http\Controllers\CloudinaryController.php`
- `backend\routes\api\v1\cloudinary.php`
- `backend\config\cloudinary.php`
- `backend\composer.json`
- `backend\composer.lock`
và đã thêm vào .env:
CLOUDINARY_CLOUD_NAME=dq18a5avc
CLOUDINARY_API_KEY=926722282642724
CLOUDINARY_API_SECRET=uBPeeW3nNLv0TtrPH5VIR8ViXjQ
CLOUDINARY_URL=CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

tôi mong muốn là kết hợp nó với ui cho admin của tôi, bạn hãy xem các giao diện của tôi cái nào cần sử dụng cloudinary thì tich hợp nó vào, viết các service API để gọi, các file giao diện `frontend\src\features\admin\pages`
Hãy tạo file gọi API trong này
`frontend\src\services\admin`
Hãy đọc các file backend mà tôi đã viết trên đồng thời đọc schema để hoàn thành đúng
`.github\context-and-instruction-for-AI\schema.sql`
Hãy đọc các file trong này nữa: `backend\database`
Đồng thời xem lại giao diện nhân viên hiện tại của tôi `frontend\src\features\admin\pages\ProfileStaffPage.jsx` nó không hiện dữ liệu lên được, hãy xem file schema để xem và fix lại giúp tôi.
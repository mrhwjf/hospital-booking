<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Account Registration</title>
</head>

<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">

                <table width="600" style="background:white; padding:30px; border-radius:8px">

                    <tr>
                        <td align="center" style="background:#0f766e; color:white; padding:15px; border-radius:6px">
                            <h2>Hệ thống Y tế ABC</h2>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:25px">

                            <h3>Tài khoản đã được đăng ký thành công</h3>

                            <p>Xin chào {{ $hoTen }},</p>

                            <p>Tài khoản của bạn đã được đăng ký thành công trong Hệ thống y tế ABC.</p>

                            <p>Bây giờ bạn có thể đăng nhập vào tài khoản của mình và bắt đầu đặt lịch hẹn với các bác sĩ của chúng tôi.</p>

                            <p style="margin-top:20px">
                                <a href="http://localhost:5173/login"
                                    style="display:inline-block;background:#0f766e;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;white-space:nowrap;">
                                    Đăng nhập vào tài khoản của bạn
                                </a>
                            </p>

                            <p style="margin-top:30px">
                                Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="font-size:12px;color:gray;padding-top:20px">
                            © 2026 Hệ thống Y tế ABC
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
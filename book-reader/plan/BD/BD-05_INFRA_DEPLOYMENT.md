# BD-05 — Hạ tầng và kiểm chứng

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


## 1. Sơ đồ triển khai đề xuất
Giao diện biên dịch tĩnh → nginx HTTPS cùng nguồn; giữ nguyên tiền tố /api/v1 khi chuyển tới Spring → SQL Server và vùng tệp riêng tư. Không dùng Celery/Valkey/Next khi chạy.
Cần kiểm ảnh cài đặt, phiên bản, giấy phép và kiến trúc máy hỗ trợ SQL Server; chưa chốt theo trí nhớ. Phát triển mặc định loopback; điện thoại cần điểm truy cập HTTPS riêng tư theo #1. Không công khai API chưa xác thực.

## 2. Giao diện cấu hình
APP_MODE=personal, PERSONAL_READER_ID, thông tin kết nối cơ sở dữ liệu, STORAGE_ROOT, PUBLIC_ORIGIN và giới hạn dung lượng/giải nén/thời gian/tác vụ đồng thời.
Máy chủ giữ cấu hình, giao diện chỉ nhận khả năng an toàn; không lộ thông tin xác thực. Giới hạn tải của nginx khớp máy chủ và kiểm cả dữ liệu thực nhận. Ví dụ kế thừa chưa sẵn sàng chạy.

## 3. Kiểm chứng dự kiến
Máy chủ: ./mvnw verify, Windows dùng mvnw.cmd; tích hợp SQL Server thật; chạy tiến trình, đợi sẵn sàng có hạn và gọi API qua trung gian.
Giao diện: npm ci, npm run check, npm run build; Playwright kiểm luồng đầy đủ và bố cục. Lệnh chưa tồn tại phải tạo P0, không ghi đã đạt.
CI kiểm mã API sinh khớp giao diện tích hợp, kiểm thử đơn vị/tích hợp và biên dịch tĩnh. Sau triển khai kiểm nhanh chức năng. /health báo tiến trình còn hoạt động khác với sẵn sàng cơ sở dữ liệu/lưu trữ; nginx khỏe không chứng minh API khỏe.

## 4. Ứng dụng web có thể cài đặt (PWA)
service worker chỉ lưu trước phần khung/tài nguyên có mã băm, bộ xử lý và phông chữ; dự phòng ngoại tuyến cho /reader/:id. Không lưu đệm API/tệp đại trà.
Khi còn thay đổi chờ gửi phải thông báo trước cập nhật; cập nhật IndexedDB giữ tương thích, không làm mất dữ liệu. HTTPS/chứng chỉ trên điện thoại là điều kiện vào P3.

## 5. Sao lưu, lưu giữ và phục hồi
Đề xuất sao lưu cơ sở dữ liệu+tệp tại mốc nhất quán mỗi ngày, giữ 7 bản; giữ dấu xóa sách 30 ngày theo #5 chưa xác nhận.
Chưa cam kết mức mất dữ liệu/thời gian phục hồi (RPO/RTO) trước diễn tập. Phục hồi vào hệ riêng, kiểm khóa ngoại/mã toàn vẹn và mở sách. Chỉ xóa tệp vật lý sau thời hạn và đối soát tác vụ. Hết ổ đĩa phải báo rõ, không tạo READY.

## 6. Danh sách điều chỉnh mẫu
Trước lập trình: chuyển CLAUDE/rules/skills/agents sang Java/Vite; thay Dockerfiles/Compose/Makefile, README hai phía, STACK, GETTING-STARTED.
Rà soát rồi xóa/đánh dấu phần Python/Celery/AI không dùng trong bản sao; không sửa template-ai. AGENTS là hướng dẫn đầu vào, thiết kế hiện tại ưu tiên ví dụ cũ. Đợt này chưa chốt chuẩn/chưa viết kế hoạch triển khai.

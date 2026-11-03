# Book Reader — Chiến lược xây dựng

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


## 1. Mục tiêu
Thư viện cá nhân đọc PDF/EPUB trên điện thoại và máy tính: nhập sách, đọc tiếp đúng chỗ, mục lục gốc/cá nhân, đánh dấu, sáng/tối và tải ngoại tuyến. Mô tả đích bản đầu, chưa cam kết lịch hoàn thành.

## 2. Phạm vi
| Phân hệ | Trách nhiệm | Giai đoạn |
|---|---|---|
| MOD-01 Thư viện và nhập sách | Thông tin sách, phiên bản tệp, tác vụ nhập và lưu trữ | P1 |
| MOD-02 Bộ đọc | Xử lý PDF/EPUB, bố cục và hiển thị | P1 PDF; P2 EPUB |
| MOD-03 Điều hướng | Mục lục gốc/cá nhân và đánh dấu | P2 |
| MOD-04 Tiến độ và ngoại tuyến | Vị trí, đồng bộ, bộ nhớ đệm từng thiết bị, PWA | P1 vị trí; P3 ngoại tuyến |
| MOD-05 Tài khoản và truy cập | Giao diện tích hợp tương lai | Chưa lên lịch; CurrentReader thuộc nền tảng P0 |
Ngoài bản đầu: DRM, OCR, AI/RAG, chuyển PDF sang EPUB, xuất tệp sửa mục lục, mạng xã hội, chia sẻ công khai, tổ chức/nhóm và thanh toán. EPUB bố cục cố định chờ #6.

## 3. Luồng và quyền sở hữu
Nhập tệp/URL → kiểm nội dung → lưu tệp bất biến → tạo sách READY → đọc → lưu vị trí → tạo mục lục/đánh dấu → tải ngoại tuyến → đồng bộ khi nối lại.
Một người đọc sở hữu sách; tiến độ, đánh dấu và mục lục cá nhân có reader_id riêng. Vị trí gắn đúng phiên bản tệp; bản đầu không thay nội dung tệp tại chỗ.

## 4. Kiến trúc
Giao diện React/Vite → API cùng nguồn /api/v1 → một ứng dụng Spring Boot chia phân hệ → SQL Server.
Máy chủ gọi StoragePort, đề xuất lưu ổ đĩa theo #2. Trình duyệt dùng IndexedDB và service worker cho ngoại tuyến. Tác vụ URL lưu bền vững trong SQL Server, bộ thực thi có giới hạn; không dùng Celery/Valkey/AI.
CurrentReader và AccessPolicy là giao diện nhỏ; nghiệp vụ không truy cập trực tiếp bảng tài khoản.

## 5. Công nghệ và quy trình bàn giao
Giữ Java/Spring Boot/JPA, React/TypeScript/Vite, SQL Server theo D2. Đề xuất Flyway để cập nhật cấu trúc, cần kiểm phiên bản/giấy phép trước triển khai. Sinh mã gọi API TypeScript từ OpenAPI; chưa chốt phiên bản, xem references/STACK.md.
Mã trong source code/; thiết kế trong plan/; quản lý trong management/. Hạ tầng và hướng dẫn kế thừa chưa chuyển công nghệ, không dùng chạy ứng dụng đích.

## 6. Lộ trình đề xuất
| Giai đoạn | Kết quả dùng được | Kiểm chứng |
|---|---|---|
| P0 | Kiểm sức khỏe máy chủ, khung giao diện/màu, cấu trúc dữ liệu, người đọc cá nhân và quyền sở hữu, CI | Khởi động thật, HTTP qua trung gian, tích hợp SQL Server |
| P1 | Nhập PDF tệp/URL, thư viện, đọc/nhớ vị trí trực tuyến | FR-01 và FR-02 phần PDF; lỗi nhập và hoàn tác |
| P2 | EPUB tự dàn nội dung, mục lục/đánh dấu, sáng/tối | FR-02 EPUB và toàn MOD-03; điện thoại/máy tính |
| P3 | PWA ngoại tuyến, xung đột đồng bộ, hoàn thiện bản đầu | Toàn MOD-04, thiết bị thật, diễn tập phục hồi |
| Tương lai | Tài khoản/truy cập và chuyển dữ liệu cá nhân | Kế hoạch/kiểm chứng riêng, chưa cam kết ngày |

## 7. Quyết định đã chốt
| Mã | Quyết định | Người xác nhận | Ngày |
|---|---|---|---|
| D1 | Bản riêng từ mẫu công ty | Chủ dự án qua hội thoại | 2026-11-03 |
| D2 | Giữ bộ công nghệ hiện tại | Chủ dự án qua hội thoại | 2026-11-03 |
| D3 | Cá nhân trước, nhiều người qua phân hệ sau | Chủ dự án qua hội thoại | 2026-11-03 |
Chưa có D4 trở đi; giới hạn, môi trường và lộ trình chi tiết là đề xuất, không ghi là người dùng đã duyệt.

## 8. Chất lượng và nghiệm thu
Yêu cầu phi chức năng nằm tại RD-00 §8; BD §13 chỉ cách kiểm chứng. Mỗi giai đoạn ghi lệnh, kết quả, ảnh và giới hạn. Chưa chốt chuẩn khi còn quyết định chặn/chưa rà soát. Sau chốt chuẩn mới áp dụng quản lý yêu cầu thay đổi.

## 9. Việc tiếp theo
Rà soát bản nháp và quyết định mở; thử nghiệm rủi ro; chuyển hướng dẫn/cấu hình công nghệ; viết kế hoạch từng giai đoạn trước lập trình.

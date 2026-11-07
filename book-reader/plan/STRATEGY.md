# Book Reader — Chiến lược xây dựng

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.


## 1. Mục tiêu
Thư viện cá nhân đọc PDF/EPUB trên điện thoại và máy tính: nhập sách, đọc tiếp đúng chỗ, mục lục gốc/cá nhân, đánh dấu, sáng/tối và tải ngoại tuyến. Mô tả đích bản đầu, chưa cam kết lịch hoàn thành.

## 2. Phạm vi
| Phân hệ | Trách nhiệm | Giai đoạn |
|---|---|---|
| MOD-01 Thư viện và nhập sách | Thông tin sách, phiên bản tệp, tác vụ nhập và lưu trữ | P1 |
| MOD-02 Bộ đọc | Xử lý PDF/EPUB, bố cục và hiển thị | P1 PDF; P2 EPUB |
| MOD-03 Điều hướng | Mục lục gốc/cá nhân và đánh dấu | P2 trực tuyến; P3 ngoại tuyến |
| MOD-04 Tiến độ và ngoại tuyến | Vị trí, đồng bộ, bộ nhớ đệm từng thiết bị, PWA | P1 vị trí; P3 ngoại tuyến |
| MOD-05 Tài khoản và truy cập | Giao diện tích hợp tương lai | Chưa lên lịch; CurrentReader thuộc nền tảng P0 |
Ngoài bản đầu: DRM, OCR, AI/RAG, chuyển PDF sang EPUB, xuất tệp sửa mục lục, mạng xã hội, chia sẻ công khai, tổ chức/nhóm và thanh toán. Đã chốt EPUB2/3 tự dàn nội dung không DRM; EPUB bố cục cố định và PDF có mật khẩu ngoài bản đầu.

## 3. Luồng và quyền sở hữu
Nhập tệp/URL → kiểm nội dung → lưu tệp bất biến → tạo sách hoàn chỉnh → đọc → lưu vị trí → tạo mục lục/đánh dấu → tải ngoại tuyến → đồng bộ khi nối lại.
Một người đọc sở hữu sách; tiến độ, đánh dấu và mục lục cá nhân có reader_id riêng. Vị trí gắn đúng phiên bản tệp; bản đầu không thay nội dung tệp tại chỗ.

## 4. Kiến trúc
Giao diện React/Vite → API cùng nguồn /api/v1 → một ứng dụng Spring Boot chia phân hệ → SQL Server.
Trước mắt chỉ truy cập qua mạng nội bộ trong nhà: máy chủ ở nhà phải bật, thiết bị trong mạng được cho phép kết nối. Không mở cổng Internet hay truy cập từ xa ở bản đầu. Sách tải đủ vẫn có thể đọc ngoại tuyến ngoài nhà.
Máy chủ gọi StoragePort, lưu ổ đĩa theo D10. Trình duyệt dùng IndexedDB và service worker cho ngoại tuyến. Tác vụ URL lưu bền vững trong SQL Server, bộ thực thi có giới hạn; không dùng Celery/Valkey/AI.
CurrentReader và AccessPolicy là giao diện nhỏ; nghiệp vụ không truy cập trực tiếp bảng tài khoản.

## 5. Công nghệ và quy trình bàn giao
Giữ Java/Spring Boot/JPA, React/TypeScript/Vite, SQL Server theo D2. Chọn Flyway để cập nhật cấu trúc, cần kiểm phiên bản/giấy phép trước triển khai. Sinh mã gọi API TypeScript từ OpenAPI; chưa chốt phiên bản, xem references/STACK.md.
Mã trong source code/; thiết kế trong plan/; quản lý trong management/. Hạ tầng và hướng dẫn kế thừa chưa chuyển công nghệ, không dùng chạy ứng dụng đích.

## 6. Lộ trình đã chốt
| Giai đoạn | Kết quả dùng được | Kiểm chứng |
|---|---|---|
| P0 | Kiểm sức khỏe máy chủ, khung giao diện/màu, cấu trúc dữ liệu, người đọc cá nhân và quyền sở hữu, CI | Khởi động thật, HTTP qua trung gian, tích hợp SQL Server |
| P1 | Nhập PDF tệp/URL, thư viện, đọc/nhớ vị trí trực tuyến | FR-01 và FR-02 phần PDF; lỗi nhập và hoàn tác |
| P2 | EPUB tự dàn nội dung, mục lục/đánh dấu, sáng/tối | FR-02 phần EPUB; FR-03-01..05 trực tuyến; điện thoại/máy tính |
| P3 | PWA ngoại tuyến, xung đột đồng bộ, hoàn thiện bản đầu | Toàn MOD-04 và FR-03-06 ngoại tuyến; thiết bị thật, diễn tập phục hồi |
| Tương lai | Tài khoản/truy cập và chuyển dữ liệu cá nhân | Kế hoạch/kiểm chứng riêng, chưa cam kết ngày |

## 7. Quyết định đã chốt
| Mã | Quyết định | Người xác nhận | Ngày |
|---|---|---|---|
| D1 | Bản riêng từ mẫu công ty | Chủ dự án qua hội thoại | 2026-11-03 |
| D2 | Giữ bộ công nghệ hiện tại | Chủ dự án qua hội thoại | 2026-11-03 |
| D3 | Cá nhân trước, nhiều người qua phân hệ sau | Chủ dự án qua hội thoại | 2026-11-03 |
| D4 | Mạng nội bộ trong nhà trước; Internet để sau | Chủ dự án qua hội thoại | 2026-11-07 |
| D5 | PDF thường/quét ảnh; EPUB2/3 tự dàn không DRM; chưa PDF mật khẩu/EPUB cố định | Chủ dự án qua hội thoại | 2026-11-07 |
| D6 | Đồng bộ hai chiều, chọn bản khi xung đột; đánh dấu tạo khác nhau giữ cả hai | Chủ dự án qua hội thoại | 2026-11-07 |
| D7 | Tách xóa bản tải, xóa sách, đặt lại tiến độ; bảo toàn thay đổi chưa gửi | Chủ dự án qua hội thoại | 2026-11-07 |
| D8 | Chỉ tạo sách sau nhập thành công; tách trạng thái tác vụ và khả năng đọc tệp | Chủ dự án qua hội thoại | 2026-11-07 |
| D9 | Chi tiết API/ngoại lệ và nhiều tiêu chí mỗi yêu cầu; FR-03-06 ở P3 | Chủ dự án qua hội thoại | 2026-11-07 |
| D10 | Tệp trên ổ đĩa máy chủ qua StoragePort; S3 sau | Chủ dự án | 2026-11-07 |
| D11 | Giới hạn100MiB/tệp và giới hạn nhập/mục lục hiện tại; cấu hình được | Chủ dự án | 2026-11-07 |
| D12 | Giao diện sản phẩm tiếng Việt | Chủ dự án | 2026-11-07 |
| D13 | Không tự chuyển dữ liệu cũ; bắt đầu thư viện mới | Chủ dự án | 2026-11-07 |
| D14 | Sao lưu hằng ngày/giữ7bản; tách ổ gốc; giữ dấu xóa30ngày | Chủ dự án | 2026-11-07 |
| D15 | Duyệt bộ tài liệu hiện hành làm chuẩn1.0 | Chủ dự án | 2026-11-07 |
Không còn quyết định sản phẩm mở; xác minh kỹ thuật và đo chất lượng là công việc triển khai, không coi đã đạt vì tài liệu được duyệt.

## 8. Chất lượng và nghiệm thu
Yêu cầu phi chức năng nằm tại RD-00 §8; BD §13 chỉ cách kiểm chứng. Mỗi giai đoạn ghi lệnh, kết quả, ảnh và giới hạn. Chưa chốt chuẩn khi còn quyết định chặn/chưa rà soát. Sau chốt chuẩn mới áp dụng quản lý yêu cầu thay đổi.

## 9. Việc tiếp theo
Viết kế hoạch P0; chuyển hướng dẫn/cấu hình kỹ thuật và xác minh phiên bản, rủi ro theo BASELINE-REGISTER. Nếu cần đổi chuẩn1.0, ghi ADR/CR.

## 10. Định hướng Internet và Cloud sau bản đầu
Chủ dự án sẽ xem xét dịch vụ Cloud, có thể gồm AWS, khi cần truy cập ngoài nhà. Chưa chọn nhà cung cấp, dịch vụ, ngân sách hay mua tài nguyên.
Cần phân tích xác thực/kiểm soát truy cập trước công khai, máy chủ ứng dụng, cơ sở dữ liệu, lưu tệp, tên miền/HTTPS, sao lưu, chi phí và chuyển dữ liệu. Không mặc định đổi toàn bộ công nghệ hoặc dùng AWS. Viết phân tích và kế hoạch riêng trước triển khai.

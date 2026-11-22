# Tiến độ dự án

Cập nhật: 23/11/2026. Mốc tài liệu hiện hành: **1.0 đã duyệt**.

## Tình trạng hiện tại

- **Giai đoạn:** đã cập nhật môi trường Java/nginx theo yêu cầu riêng; lập trình P0 vẫn tạm dừng.
- **Nhánh:** `feat/book-reader-p0`, tách từ `chore/book-reader-baseline`.
- **Commit tài liệu gần nhất:** `c7cd433` — kế hoạch triển khai, sơ đồ và thiết kế PC/Mobile, đã push.
- **Quyết định sản phẩm:** đã chốt, không còn câu hỏi mở.
- **Ứng dụng mới:** chưa lập trình, chưa chạy kiểm thử nghiệp vụ hoặc migration V001.
- **DB thử:** đã tạo `book_reader_p0_test`, bật `ALLOW_SNAPSHOT_ISOLATION` sau khi được chủ dự án cho phép.
- **Môi trường:** xem [báo cáo Java/nginx ngày 23/11](SECURITY-UPDATE-2026-11-23.md); không coi cập nhật công cụ là đã hoàn thành P0.

## Đã hoàn thành

- Tạo dự án riêng từ mẫu công ty và phân tích mã cũ.
- Chốt 24 tài liệu chuẩn: yêu cầu, thiết kế, phân tích và tài liệu tham chiếu.
- Xác định 27 yêu cầu chức năng, 18 quy tắc nghiệp vụ và 59 tình huống nghiệm thu.
- Rà soát liên kết, đối chiếu yêu cầu–thiết kế và sửa bảng Markdown.
- Thống nhất tài liệu tiếng Việt và lưu bộ chuẩn lên GitHub.

## Việc tiếp theo

1. Sử dụng JDK dự án theo báo cáo Java/nginx; chọn đúng JDK khi chạy từ IDE.
2. Chờ chủ dự án yêu cầu tiếp tục lập trình P0 theo kế hoạch đã có.
3. Chuyển đồng bộ hướng dẫn/cấu hình mẫu sang Spring Boot, React/Vite và SQL Server.
4. Khởi tạo ứng dụng, kiểm thử và kiểm chứng kết nối/khởi động thực tế.

Chi tiết trách nhiệm và thời điểm: [Sổ mốc chuẩn](BASELINE-REGISTER.md).

## Vướng mắc và giới hạn

- Không có quyết định sản phẩm đang chặn công việc.
- Cấu hình kỹ thuật kế thừa chưa sẵn sàng chạy; F-P0-03 còn mở.
- Các kết quả kiểm tra tài liệu chưa chứng minh ứng dụng hoạt động.
- Tài khoản nhiều người dùng và triển khai Internet/Cloud/AWS thuộc giai đoạn sau.

## Cập nhật ngày 21/11/2026

- Rút gọn trang tiến độ; chuyển nhật ký cũ sang tệp lịch sử.
- Tách các đoạn dài trong tài liệu thành ý ngắn và bổ sung khoảng cách Markdown.
- Giữ nội dung đã duyệt, mã yêu cầu, API và bảng dữ liệu.
- Đây là chỉnh cách trình bày; không thay phạm vi hay trạng thái nghiệm thu.

## Lịch sử và tài liệu liên quan

- [Nhật ký chi tiết đến ngày 07/11/2026](history/PROGRESS-2026-11-07.md).
- [Quyết định đã chốt](OPEN-DECISIONS.md).
- [Các vấn đề phát hiện](FINDINGS.md).
- [Quy trình quản lý thay đổi](CR-MANAGEMENT.md).

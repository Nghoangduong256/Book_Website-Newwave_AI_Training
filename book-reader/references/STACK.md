# Tình trạng bộ công nghệ

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.


Đã xác nhận React/TypeScript/Vite, Java/Spring Boot/JPA và SQL Server. Đợt tài liệu chưa chốt phiên bản hoặc kiểm chứng thư viện chạy trong bản mới.
| Thành phần | Khai báo cũ/lựa chọn đã duyệt | Cần kiểm chứng |
|---|---|---|
| React/Vite/TypeScript | ^19.2.0 / ^7.2.4 / ~5.9.3 | Khóa phiên bản, cài và biên dịch; không coi khoảng phiên bản là bản đã kiểm |
| Spring Boot/Java | 4.0.2 /17 | Tương thích, bảo mật, hỗ trợ, khởi động/tích hợp |
| SQL Server/JDBC/JPA | Giữ công nghệ hiện tại | Phiên bản/giấy phép/kiến trúc máy và trình điều khiển |
| PDF | react-pdf/PDF.js | Tiến trình nền, mục lục, khoảng dữ liệu, văn bản |
| EPUB | Chọn epub.js | Vùng cách ly, CFI, màu, iOS; chọn phiên bản sau thử nghiệm |
| Cập nhật cấu trúc | Chọn Flyway | Hỗ trợ SQL Server và giấy phép phiên bản chọn |
| OpenAPI/mã gọi API | Sinh mã từ OpenAPI, công cụ cụ thể xác minh P0 | Tương thích Spring và sinh đúng giao diện |
| Ngoại tuyến | IndexedDB + service worker | Trình duyệt, hạn mức và việc xóa dữ liệu |
| Kiểm thử giao diện | Chọn Vitest/Playwright | Chốt phiên bản, ghép CI |
Chưa xác nhận bản mới nhất hoặc mô hình AI; AI ngoài phạm vi bản đầu.

## Phạm vi phê duyệt
Chuẩn1.0 duyệt lựa chọn và kế hoạch kiểm chứng, không duyệt các phiên bản range cũ thành phiên bản đã pin. Kỹ thuật xác minh/cập nhật số phiên bản ở P0 trước triển khai; giữ mục tiêu hành vi đã duyệt, nếu thay công nghệ/kiến trúc thì ADR/CR. Không còn câu hỏi sản phẩm mở, xem BASELINE-REGISTER.

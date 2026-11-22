# Tình trạng bộ công nghệ

- Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
- Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07.
- Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

- Đã xác nhận React/TypeScript/Vite, Java/Spring Boot/JPA và SQL Server.
- Đợt tài liệu chưa chốt phiên bản hoặc kiểm chứng thư viện chạy trong bản mới.

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

- Chưa xác nhận bản mới nhất hoặc mô hình AI;
- AI ngoài phạm vi bản đầu.

## Phạm vi phê duyệt

- Chuẩn1.0 duyệt lựa chọn và kế hoạch kiểm chứng, không duyệt các phiên bản range cũ thành phiên bản đã pin.
- Kỹ thuật xác minh/cập nhật số phiên bản ở P0 trước triển khai; giữ mục tiêu hành vi đã duyệt, nếu thay công nghệ/kiến trúc thì ADR/CR.
- Không còn câu hỏi sản phẩm mở, xem BASELINE-REGISTER.

## Xác minh môi trường ngày 23/11/2026

Đây là cập nhật kỹ thuật theo phạm vi P0 đã duyệt, không thay bộ công nghệ hoặc trạng thái nghiệm thu ứng dụng.

| Thành phần | Phiên bản được khóa | Phạm vi bằng chứng |
|---|---|---|
| JDK Windows x64 | Eclipse Temurin 17.0.21.1+2 | Đã cài, khớp SHA-256, chạy Java/javac/Maven và biên dịch/chạy kiểm nhanh thành công |
| nginx stable | 1.30.7 | Gói Windows đã kiểm chữ ký và `nginx -t`; image Alpine đã đối chiếu digest với Docker Hub |
| Maven trên máy | 3.9.16 | Có sẵn; phải chạy sau kích hoạt JDK dự án |

- Nguồn tải, mã SHA-256 và digest được khóa tại `source code/ops/toolchain.json`.
- JDK cũ toàn máy chưa được gỡ; từng cửa sổ/IDE cần chọn đúng JDK dự án.
- Spring Boot, JDBC/Flyway và mã nguồn mới chưa được kiểm chứng khởi động/tích hợp.
- [Báo cáo cập nhật và giới hạn](../management/SECURITY-UPDATE-2026-11-23.md).

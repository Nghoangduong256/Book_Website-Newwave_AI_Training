# Phân tích hiện trạng và hướng xây dựng lại

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.


## 1. Kết luận
Giữ React/TypeScript/Vite, Spring Boot/JPA, SQL Server. Áp dụng quy trình mẫu công ty; xây một ứng dụng máy chủ chia phân hệ và một giao diện. Không chuyển nguyên mã cũ hay chạy cấu hình Python/Next.js kế thừa.

## 2. Bằng chứng đã đọc trong ../Project_ngan
| Nguồn | Quan sát | Giới hạn |
|---|---|---|
| Frontend/book-app/package.json | Khai báo React19.2, Vite7.2.4, react-pdf10.3 bằng khoảng phiên bản | Chưa chứng minh phiên bản cài hay biên dịch thành công |
| src/pages/ReaderPage.tsx | Gọi API trước dữ liệu cục bộ; bố cục 320px+vùng đọc | Còn phụ thuộc máy chủ khi mất mạng, chưa kiểm trình duyệt |
| src/components/PdfViewer.tsx | Một trang, chuyển/thu phóng, đặt lại trang1 | Chưa lưu tiến độ/mục lục/màu |
| src/types/book.ts | pdfUrl và hasLocalFile ở cấp sách | Chưa có EPUB, phiên bản tệp, khả năng ngoại tuyến theo thiết bị |
| src/storage/pdfStore.ts | Test-Path trả False, các trang còn nhập mô-đun | Thiếu mã nguồn, chưa chạy biên dịch |
| Backend/.../entity/Book.java và dto/service/controller | Quản lý thông tin sách cơ bản | Chưa thấy tải tệp/tài khoản/tiến độ; chưa chạy API |
| Backend/DB/sql_migration_script.sql | Có lastReadPage,filePath,sourceType nhưng mô hình Java chưa khớp hết | Chưa biết lệnh nào đã áp dụng |
| template-ai/project-base-line-template | Quy trình đầy đủ, ứng dụng còn chỗ trống, mặc định FastAPI/Next/Postgres | Chưa phải hệ thống chạy sẵn |

## 3. Tái sử dụng, mở rộng và xây mới
| Khả năng | Hướng | Lý do |
|---|---|---|
| Quản lý thông tin sách, cấu hình xử lý PDF | Tái sử dụng có chọn lọc | Giữ hành vi hữu ích, viết lại giao diện tích hợp/kiểm thử |
| Thư viện/bộ đọc | Mở rộng hoặc viết lại | Điện thoại, màu, khả năng tiếp cận |
| Lưu tệp | Xây mới | Máy chủ và bản ngoại tuyến riêng từng thiết bị |
| EPUB/mục lục/vị trí | Xây mới | Hai hệ vị trí và bộ xử lý |
| CurrentReader/quyền sở hữu | Xây từ P0 | Tránh gắn quyền sau khi thêm tài khoản |
| RD/BD/quản lý thay đổi/kiểm chứng | Dùng lại mẫu | Chuyển hướng dẫn công nghệ trước lập trình |
| AI/RAG, Celery, vai trò tổ chức | Không dùng bản đầu | Ngoài yêu cầu hiện tại |

## 4. Ranh giới và rủi ro
PDF giữ bố cục, không hứa tự dàn hay đổi cỡ chữ như EPUB. Bản quét ảnh đọc được nhưng tìm chữ/tự nhận chương cần OCR, ngoài phạm vi.
EPUB tự dàn nội dung là chính; bố cục cố định chờ thử nghiệm, DRM không hỗ trợ. Mục lục cá nhân là dữ liệu ứng dụng, không sửa/xuất lại tệp gốc.
Ngoại tuyến không phải sao lưu; trình duyệt có thể xóa dữ liệu do hạn mức. Tài khoản tương lai vẫn cần chuyển dữ liệu, bảo vệ API/tệp/bộ nhớ đệm và kiểm hai danh tính.
Nhập URL có rủi ro truy cập mạng nội bộ (SSRF), cần kiểm DNS/IP/chuyển hướng và giới hạn tải. Dữ liệu IndexedDB cũ phải xuất từ đúng trình duyệt, máy chủ không tự lấy được.

## 5. Phương án
Giữ công nghệ để tập trung bộ đọc. Một ứng dụng chia phân hệ giảm vận hành. Giao diện lưu trữ cho phép đổi S3 sau; URL dùng tác vụ bền vững trong cơ sở dữ liệu với số thực thi giới hạn, chưa cần môi giới riêng.
Đã duyệt ổ đĩa máy chủ và mạng nhà, xác minh kỹ thuật ở P0.

## 6. Thử nghiệm trước triển khai
Kiểm PDF: tiến trình nền/văn bản/mục lục/khoảng dữ liệu; EPUB: vùng cách ly/CFI/màu/sách tiếng Việt; IndexedDB/PWA trên Safari iOS; TLS trên điện thoại; tải URL chống SSRF; Spring/JPA/trình điều khiển/cập nhật cấu trúc trên SQL Server thật.
Chốt phiên bản trong STACK sau thử nghiệm, không coi khai báo cũ là bằng chứng.

## 7. Nguồn kỹ thuật đối chiếu ngày 2026-11-03
- [API tài liệu PDF.js](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib-PDFDocumentProxy.html): mục lục, đích và chỉ số trang.
- [EPUB.js](https://github.com/futurepress/epub.js/): hiển thị, CFI và cảnh báo bảo mật khi bật mã lệnh.
- [Hạn mức và xóa dữ liệu trình duyệt](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria): dung lượng, thu hồi và lưu bền vững.
- [API lưu trữ trình duyệt](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API): ngữ cảnh an toàn, ước lượng và lưu bền vững.
- [rowversion của SQL Server](https://learn.microsoft.com/en-us/sql/t-sql/data-types/rowversion-transact-sql): mã kiểm soát thay đổi, không phải thời gian; thiết kế dùng bigint @Version.

## 8. Quyết định sau rà soát ngày 2026-11-07
Đã chốt phạm vi định dạng, mạng nội bộ nhà, đồng bộ hai chiều và ba thao tác xóa/reset. Các đề xuất cũ ở §4–§6 là bối cảnh phân tích; trạng thái hiện hành xem STRATEGY D4..D9 và OPEN-DECISIONS.
Internet/Cloud/AWS là hướng sau, chưa chọn dịch vụ. Review đã chỉ ra thiếu chiều nhận đồng bộ, quy tắc xóa chưa thống nhất, FR-03-06/P2 phụ thuộc P3, trạng thái sách/API/AC còn sơ lược; bản0.3 giải quyết trong RD/BD, chưa có bằng chứng runtime.

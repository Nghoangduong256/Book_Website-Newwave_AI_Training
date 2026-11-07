# BD-M01 — Thư viện và nhập sách

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

Yêu cầu/thiết kế đã được chủ dự án duyệt; chưa phải tính năng đã triển khai. Lịch sử quyết định xem management/OPEN-DECISIONS.md.

Tài liệu yêu cầu: ../RD/RD-01_library-import.md · Giai đoạn: P1 PDF; P2 EPUB

## 1. Tóm tắt
Quản lý thông tin mô tả và nhập một bản PDF/EPUB từ tệp hoặc URL trực tiếp; một sách có một phiên bản tệp bất biến ở bản đầu.
Áp dụng chuẩn chung BD-00, giao diện BD-01, dữ liệu BD-02, bảo mật BD-03 và hạ tầng BD-05. Bộ xử lý đọc sách xem BD-M02; bản đầu không có tính năng AI.

## 2. Nghiệp vụ và thành phần phụ thuộc
LibraryService quản lý thông tin sách; StoragePort quản lý nội dung tệp; ImportService quản lý tác vụ nhập sách. Bộ đọc nhận BookReadDescriptor qua LibraryReadService.requireReadable(CurrentReader, bookId), không truy cập trực tiếp tầng dữ liệu của phân hệ khác.
Tệp bất biến sau khi nhập. Xác minh MIME từ dữ liệu và cấu trúc EPUB, không chỉ dựa vào phần mở rộng hoặc tiêu đề HTTP.

## 3. Dữ liệu và trạng thái
lib_books/lib_files chỉ tạo sau nhập thành công; không có trạng thái QUEUED/RUNNING/READY trên sách. BookRead.availability là AVAILABLE hoặc UNREADABLE, mô tả tệp đang đọc được hay thiếu/hỏng.
lib_import_jobs có state QUEUED/RUNNING/COMPLETED/FAILED; phase mô tả bước đang làm, có thể WAITING_DUPLICATE_CHOICE khi chờ người dùng. COMPLETED cần bookId tạo mới hoặc sách cũ được chọn. FAILED không tạo book mới.
Thêm/sửa thông tin, kiểu trường và giới hạn theo BD-06 §2; schema theo BD-02. File immutable; không API thay tệp. SHA256 chỉ so trùng cùng chủ, không tự gộp.

## 4. API
Nguồn trường/kiểu/mặc định/phản hồi/lỗi/ví dụ: BD-06 §2/§6. Các tuyến dưới /api/v1.
POST /books/import-file: multipart file,metadata?,duplicateAction?; quyền book:create, Idempotency-Key. Trả201 sau commit hoặc409 DUPLICATE_BOOK để người dùng chọn. Chọn Vẫn nhập gửi lại khóa mới với CREATE_NEW.
POST /imports/url nhận url,metadata?,duplicateAction?; quyền import:create; trả202 job. GET /imports/{id} trả trạng thái; POST /imports/{id}/decision tiếp tục lựa chọn trùng (quyền import:create, khóa chống lặp).
GET /books có q/format/sort/limit/cursor; GET /books/{id} chi tiết. PATCH sửa metadata với If-Match; title rỗng bị từ chối, khác mặc định khi nhập. DELETE /books/{id} với If-Match và Idempotency-Key; trả204 sau đánh dấu xóa. Không hỗ trợ DELETE sách ngoại tuyến chỉ bằng việc xóa cache.
GET/HEAD /books/{id}/content yêu cầu file:read và kiểm quyền/tệp thực tế. Hỗ trợ bytes Range:206/Content-Range, sai416, toàn200; ETag checksum. Tệp thiếu/hỏng503 với mã lỗi phù hợp, vẫn giữ metadata/reading state. Không trả storage path.
Người dùng đặt lại tiến độ dùng PUT progress, không DELETE sách. API tệp qua backend là điều chỉnh có chủ đích so với template presigned-only; BD-03.

## 5. Màn hình
Tuyến và cách mở màn hình nằm trong BD-SCREEN-INDEX. Biểu mẫu nhập có hai thẻ Tệp/URL, nêu giới hạn và phân biệt Đang tải lên/Đang xử lý/Đã lưu; không hiển thị phần trăm giả. Thẻ sách có định dạng và khả năng đọc ngoại tuyến của thiết bị hiện tại.
Biểu mẫu sửa cảnh báo rời đi khi chưa lưu. Có trạng thái đang tải, trống, lỗi có thử lại, không tìm thấy và không có quyền.

## 6. Luồng chính và ngoại lệ
### 6.1 Nhập tệp
Nhận luồng giới hạn → tạm ngẫu nhiên → kiểm định dạng/tính toàn vẹn/SHA256 → kiểm trùng own → người dùng chọn nếu trùng → chuyển tệp nguyên tử → giao dịch tạo book/file và receipt → trả201.
Chỉ tạo book sau thành công. Lỗi DB xóa bù file vừa chuyển; nếu dọn lỗi thì ghi bản kê bền vững để đối soát sau khởi động. Không xóa tệp đang có tham chiếu.
File trùng: Mở sách đã có không tạo; Vẫn nhập tạo book/fileId mới riêng, không dùng chung object rồi vô tình xóa sách kia; Hủy không đổi thư viện. Dọn upload tạm sau lựa chọn/hết hạn.
### 6.2 Nhập URL
Lưu QUEUED trước202; worker nhận quyền xử lý có thời hạn → RUNNING; mạng/kiểm tệp xong mới chờ duplicate choice hoặc COMMITTING; giao dịch book/file/receipt+job COMPLETED. BookId duy nhất theo job chống nhân đôi khi retry/sự cố.
Lỗi chuyển FAILED có errorCode, không tạo sách đọc dở. Lỗi tạm tối đa3 lần, mỗi lần mạng120giây; khoảng chờ tăng hữu hạn. WAITING_DUPLICATE_CHOICE tạm giải phóng worker; TTL24giờ theo BD-06, không giữ kết nối120giây chờ người.
UI dừng hỏi sau tối đa5phút và cho mở lại trạng thái; dừng hỏi không hủy tác vụ. Mất ACK nhập gửi lại cùng key. Lỗi sau chuyển tệp đối soát cùng bản kê, không báo hoàn tất giả.
### 6.3 Sách không đọc được
Lần đọc/tải hoặc kiểm lưu trữ thấy thiếu/hỏng tệp → availability=UNREADABLE, cập nhật lý do/thời điểm kiểm và trả503 content. Vẫn GET được metadata và dữ liệu đọc. Thử lại kiểm tệp; chỉ AVAILABLE khi xác minh lại thành công. Không tự xóa hoặc thay file/locator; khôi phục từ backup vận hành giữ fileId/checksum. Chưa có chức năng tải đè tệp từ giao diện.
### 6.4 Xóa
Quy tắc nghiệp vụ RD-00 §7.2; xử lý pending/cách ly ở BD-M04 §6.5. DELETE đánh dấu book đã xóa trong một giao dịch, content/đọc tiếp online trả404. Không xóa cả IndexedDB ngay.
Thiết bị đã biết xóa dừng đọc, giữ pending cách ly và bỏ bytes sau khi ghi cách ly thành công. Thiết bị mất mạng nhận dấu xóa sau kết nối lại. Không tạo lại book từ outbox.
Dọn tệp vật lý sau thời hạn #5 đã chốt; metadata tombstone không xóa ngay. Thứ tự khóa ngoại/retention BD-02 §5.

## 7. Thực thi quy tắc nghiệp vụ
Giao dịch nhập và bản kê bảo đảm chỉ tạo sách/COMPLETED khi đầy đủ. Tầng dữ liệu lọc theo chủ sở hữu. Không có API thay nội dung tệp; đối soát xử lý các điểm sự cố.

## 8. Sự kiện
Bản đầu không dùng hệ thống môi giới thông điệp hay hàng đợi sự kiện máy chủ. Trạng thái nhập bền vững và giao dịch quyết định việc hoàn tất. Các phân hệ gọi dịch vụ công khai trong cùng tiến trình; sự kiện ra ngoài để sau.

## 9. Tác vụ nền
Tải URL và đối soát dùng tác vụ lưu trong SQL Server cùng bộ thực thi nền. Tối đa hai tác vụ đồng thời, cấu hình được. Giới hạn tải/kiểm tra mạng theo BD-03 §3. Mã lỗi phân biệt hết thời gian, URL bị chặn, tệp không hợp lệ, vượt dung lượng và lỗi lưu trữ.

## 10. AI
Không có.

## 11. Hiệu năng
Máy chủ phân trang theo khóa, dùng id phân biệt bản ghi cùng giá trị sắp xếp. Truyền tệp theo luồng, không nạp toàn bộ vào bộ nhớ Java. Chỉ mục chủ sở hữu/tiêu đề/ngày theo BD-02.

## 12. Bảo mật
Theo BD-03: kiểm chuyển hướng URL và DNS, kiểm tệp tải lên, lưu trữ riêng tư và kiểm chủ sở hữu kể cả API tác vụ. Từ chối hoặc bỏ qua đường dẫn/chủ sở hữu do người gọi tự cung cấp.


## 13. Kế hoạch kiểm thử
| Nhóm | Bằng chứng cần tạo |
|---|---|
| Yêu cầu và nghiệm thu | Mỗi cặp FR/AC có kiểm thử mang mã tương ứng; chưa có kết quả thực thi |
| Quy tắc nghiệp vụ | Mỗi BR có kiểm thử chứng minh bỏ điều kiện bảo vệ sẽ gây lỗi |
| Cách ly dữ liệu | Dùng hai danh tính người đọc; kiểm tra danh sách, chi tiết, sửa dữ liệu và tải tệp không vượt quyền; kiểm tra điều kiện lọc trong truy vấn |
| API | Dữ liệu không hợp lệ, UUID/vị trí sai, mã 404/409, thiếu If-Match trả 428, thử lại không gây tác dụng lặp |
| Giao diện | Đang tải, trống, lỗi có thử lại, không có quyền/không tìm thấy; bàn phím; sáng/tối; độ rộng 375/768/1280px |
| Luồng sử dụng | Thư viện → đọc → lưu → tải lại trang; thực hiện tình huống riêng của phân hệ trên thiết bị thật |
| Khả năng phục hồi | Mất mạng trước/sau phản hồi, tải lại trang, phiên bản tệp cũ, hết dung lượng thiết bị/ổ đĩa |
Bộ PDF mẫu gồm văn bản tiếng Việt, bản quét ảnh, có/không mục lục gốc, trang xoay, 500 trang, tệp hỏng và tệp mã hóa. Bộ EPUB mẫu gồm EPUB2 có NCX, EPUB3 có mục lục, nội dung tự dàn trang, ảnh/phông chữ tiếng Việt, thiếu mục lục, ZIP hỏng và nội dung độc hại.
EPUB bố cục cố định và PDF mật khẩu ngoài bản đầu theo D5; kiểm tệp đó bị từ chối đúng lý do. Dữ liệu mẫu phải có quyền sử dụng hợp pháp; lưu bản kê mã kiểm toàn vẹn và giấy phép, không đưa sách vi phạm bản quyền vào Git.

## 14. Đối chiếu yêu cầu với thiết kế
### 14.1 Yêu cầu → quy tắc → nghiệm thu
| Yêu cầu | Quy tắc liên quan | Tiêu chí nghiệm thu | Tình huống sử dụng |
|---|---|---|---|
| FR-01-01 | BR-01-01, BR-01-04 | AC-01-01, AC-01-09, AC-01-11, AC-01-14 | UC-01-01 |
| FR-01-02 | BR-01-01, BR-01-04 | AC-01-02, AC-01-10, AC-01-15 | UC-01-01 |
| FR-01-03 | GBR-01 | AC-01-03 | UC-01-02 |
| FR-01-04 | GBR-07 | AC-01-04 | UC-01-02 |
| FR-01-05 | BR-01-02, GBR-03 | AC-01-05, AC-01-12, AC-01-13 | UC-01-02 |
| FR-01-07 | BR-01-05 | AC-01-07, AC-01-08 | UC-01-01 |
| FR-01-06 | GBR-01 | AC-01-06 | UC-01-02 |

### 14.2 Nghiệm thu → thiết kế/API/màn hình → kiểm chứng
Đọc hợp đồng trường/lỗi tại BD-06; màn hình cụ thể tại BD-SCREEN-INDEX. Tham chiếu mục là trong BD này trừ khi ghi tên tài liệu khác. Kiểm thử dưới chỉ là dự kiến, không phải kết quả đạt.
| Tiêu chí | Quy tắc chính | Mục thiết kế | API/màn hình liên quan | Cách kiểm chứng dự kiến |
|---|---|---|---|---|
| AC-01-01 | BR-01-01 | §4, §6 | books/imports; SC-01-01..03 | test_AC_01_01; API tích hợp và luồng giao diện |
| AC-01-02 | BR-01-01 | §4, §6 | books/imports; SC-01-01..03 | test_AC_01_02; API tích hợp và luồng giao diện |
| AC-01-03 | GBR-01 | §4 | books/imports; SC-01-01..03 | test_AC_01_03; API tích hợp và luồng giao diện |
| AC-01-04 | BR-01-01 | §3, §4 | books/imports; SC-01-01..03 | test_AC_01_04; API tích hợp và luồng giao diện |
| AC-01-05 | BR-01-02 | §6.4 | books/imports; SC-01-01..03 | test_AC_01_05; API tích hợp và luồng giao diện |
| AC-01-06 | GBR-01 | §4; BD-05 §1 | books/imports; SC-01-01..03 | test_AC_01_06; API tích hợp và luồng giao diện |
| AC-01-07 | BR-01-05 | §4; BD-06 §2.3 | books/imports; SC-01-01..03 | test_AC_01_07; API tích hợp và luồng giao diện |
| AC-01-08 | BR-01-05 | §6.1 | books/imports; SC-01-01..03 | test_AC_01_08; API tích hợp và luồng giao diện |
| AC-01-09 | BR-01-04 | §6.1 | books/imports; SC-01-01..03 | test_AC_01_09; API tích hợp và luồng giao diện |
| AC-01-10 | BR-01-04 | §6.2 | books/imports; SC-01-01..03 | test_AC_01_10; API tích hợp và luồng giao diện |
| AC-01-11 | BR-01-01 | §4; BD-06 §6 | books/imports; SC-01-01..03 | test_AC_01_11; API tích hợp và luồng giao diện |
| AC-01-12 | GBR-03 | §6.4; BD-M04 §6.5 | books/imports; SC-01-01..03 | test_AC_01_12; API tích hợp và luồng giao diện |
| AC-01-13 | GBR-03 | §6.4; BD-M04 §6.5 | books/imports; SC-01-01..03 | test_AC_01_13; API tích hợp và luồng giao diện |
| AC-01-14 | BR-01-01 | §6.3 | books/imports; SC-01-01..03 | test_AC_01_14; API tích hợp và luồng giao diện |
| AC-01-15 | BR-01-05 | §6.2; BD-06 §2.3 | books/imports; SC-01-01..03 | test_AC_01_15; API tích hợp và luồng giao diện |

### 14.3 Quy tắc nghiệp vụ và khả năng truy cập màn hình
| Mã | Thiết kế và kiểm chứng |
|---|---|
| BR-01-01 | §3–§7, §12; test_BR_01_01 và các AC liên quan |
| BR-01-02 | §3–§7, §12; test_BR_01_02 và các AC liên quan |
| BR-01-03 | §3–§7, §12; test_BR_01_03 và các AC liên quan |
| BR-01-05 | §3–§7, §12; test_BR_01_05 và các AC liên quan |
| BR-01-04 | §3–§7, §12; test_BR_01_04 và các AC liên quan |
| UC-01-01 | §4–§6, RD §4; kiểm đi trọn luồng chính/ngoại lệ |
| UC-01-02 | §4–§6, RD §4; kiểm đi trọn luồng chính/ngoại lệ |
| SC-01-01 | §5 và BD-SCREEN-INDEX, kiểm mở bằng nút/trình đơn |
| SC-01-02 | §5 và BD-SCREEN-INDEX, kiểm mở bằng nút/trình đơn |
| SC-01-03 | §5 và BD-SCREEN-INDEX, kiểm mở bằng nút/trình đơn |

## 15. Vấn đề cần quyết định
API/cấu trúc dữ liệu đã chốt bản1.0; không còn quyết định sản phẩm mở. Thay đổi cần CR. Việc xác minh kỹ thuật vẫn phải thực hiện; chưa có mã nguồn hay kiểm chứng ứng dụng đang chạy.

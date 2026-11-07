# BD-00 — Kiến trúc và chuẩn chung

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.


## 1. Kiến trúc
Một ứng dụng Spring Boot chia phân hệ, dùng JPA và SQL Server; giao diện React/Vite chạy cùng nguồn qua máy chủ trung gian. Kiến trúc đích không dùng FastAPI/Next/Postgres/Celery. Hướng dẫn và Docker kế thừa còn phải chuyển ở P0.

## 2. Cấu trúc đích
- source code/backend/src/main/java/<base>/core: cấu hình, lỗi và giao diện xác định người đọc/quyền.
- modules/{library,readerdata,navigation,identity}: mỗi phân hệ có controller,dto,service,repository,entity.
- source code/backend/src/main/resources/db/migration: cập nhật cấu trúc SQL Server.
- source code/frontend/src/{app,features,components,lib/api,storage,i18n,styles}: giao diện, API sinh tự động, lưu cục bộ, ngôn ngữ và kiểu hiển thị.
Giao diện dùng React Router; không dùng cơ chế định tuyến/thành phần máy chủ của Next.js. Mỗi phía có khai báo thư viện, khóa phiên bản và lệnh kiểm tra riêng, chưa tạo trong đợt tài liệu.

## 3. Phân vùng tên
| Phân hệ | Tuyến sau /api/v1 | Tiền tố bảng |
|---|---|---|
| MOD-01 | /books, /imports | lib_ |
| MOD-02 | Tuyến trình duyệt /reader/:bookId | Không bảng riêng |
| MOD-03 | /books/{id}/toc, /books/{id}/bookmarks | nav_ |
| MOD-04 | /books/{id}/progress, /settings, /sync/manifest | rd_, sys_idempotency |
| MOD-05 | Chưa có tuyến đăng nhập bản đầu | id_readers; bảng tài khoản chưa chốt |

## 4. Phân lớp
Controller nhận/phân tích/kiểm tra dữ liệu và quyền, trả kết quả → Service xử lý nghiệp vụ và giao dịch → Repository truy cập dữ liệu qua JPA/truy vấn → Entity mô tả dữ liệu.
Controller không gọi Repository. Service dùng AccessPolicy và CurrentReader, không nhận danh tính tùy ý từ nội dung yêu cầu. StoragePort nhận khóa lưu trữ do máy chủ tạo, không nhận đường dẫn người dùng; tệp nằm ngoài cơ sở dữ liệu và vùng công khai của web.

## 5. Giao diện công khai giữa các phân hệ
| Giao diện | Bên cung cấp | Bên sử dụng | Đầu vào/kết quả |
|---|---|---|---|
| CurrentReader.resolve() | identity | Mọi dịch vụ | ReaderContext(readerId,mode) từ cấu hình/phiên tin cậy |
| AccessPolicy.require(action,reader) | core/identity | API nghiệp vụ | Quyền theo RD-00, từ chối thao tác thiếu quyền |
| LibraryReadService.requireReadable(reader,bookId) | library | navigation/readingdata | BookReadDescriptor nếu đúng chủ, tệp đọc được và chưa xóa; nếu không trả 404 |
| StoragePort | Hạ tầng library | Nhập/đọc tệp | put/openRange/delete/stat, khóa lưu trữ không lộ đường dẫn |
| ReaderAdapter | Bộ đọc trình duyệt | Điều hướng/tiến độ | Vị trí có kiểu, sự kiện ready/location/error |
| OfflineRepository | Lưu trữ trình duyệt | Các tính năng đọc | Lưu nguyên tử theo phân vùng, cùng hàng đợi thay đổi |
Tầng dữ liệu không đọc bảng phân hệ khác để lấy nghiệp vụ. Khóa ngoại ghép bảo vệ tính toàn vẹn, không thay giao diện tích hợp. LibraryReadService.requireOwned cho phép lấy metadata và dữ liệu đọc của sách chưa xóa kể cả tệp UNREADABLE; requireReadable kiểm thêm khả năng đọc bytes. Không phụ thuộc vòng library→readingdata; xóa dùng đánh dấu và đối soát.

## 6. Chuẩn API
OpenAPI sinh từ máy chủ ứng dụng; tạo mã gọi API TypeScript tự động, không sửa tay mã sinh.
UUID dạng chuỗi; JSON camelCase; tiền tố /api/v1. PATCH chỉ áp dụng trường có mặt, phân biệt null với không gửi.
GET chi tiết trả ETag chứa số phiên bản trong dấu nháy. Sửa dữ liệu đã có bắt buộc If-Match: thiếu trả 428, cũ trả 409. Tạo tiến độ dùng If-Match "0"; GET mục lục rỗng trả treeVersion=0.
Tạo trả 201; xóa trả 204; nhập URL trả 202. Lỗi dùng RFC9457 application/problem+json có code,detail,traceId, không lộ dấu vết ngăn xếp/đường dẫn/bí mật.
Danh sách mặc định limit=25, tối đa 100; phân trang theo khóa gồm giá trị sắp xếp+id, gắn bộ lọc và chủ sở hữu. Con trỏ sai trả 400. Chỉ cho titleAsc/createdDesc; kiểm cách so sánh chuỗi và thoát truy vấn tìm kiếm trên SQL Server.
Idempotency-Key UUID bắt buộc cho nhập/lựa chọn trùng/xóa sách, tạo/sửa/xóa đánh dấu, lưu/đặt lại tiến độ và ghi cây mục lục. Lưu mã băm yêu cầu và kết quả cùng giao dịch; yêu cầu lặp cùng nội dung trả lại kết quả, khác nội dung trả 409. PUT mục lục cũng dùng khóa để mất phản hồi không gây xung đột giả.
Không ghi nhãn hoàn tất cho tác vụ còn chạy.

Xem BD-06_API_CONTRACT.md để biết trường/kiểu/mặc định, ngoại lệ, snapshot và ví dụ; đây là nguồn triển khai OpenAPI.

## 7. Giao diện
Dùng TanStack Query quản lý dữ liệu máy chủ; thiết lập cục bộ/ngữ cảnh cho trạng thái hiển thị, chưa cần Zustand. Hàng đợi IndexedDB phải bền vững, không thay bằng bộ nhớ tạm.
Dùng giá trị thiết kế tập trung và danh mục chuỗi tiếng Việt. API trình duyệt chỉ dùng ở bộ chuyển tiếp/tính năng thích hợp; không kết xuất bộ đọc phía máy chủ.

## 8. Màn hình
BD-SCREEN-INDEX xác định tuyến/cách mở. Mỗi màn hình có đang tải, trống, lỗi có thử lại, không có quyền/không tìm thấy. Chờ đồng bộ/xung đột ngoại tuyến là trạng thái riêng.

## 9. Cơ sở dữ liệu
BD-02 là nguồn cấu trúc: uniqueidentifier,nvarchar,datetime2 UTC,bigint @Version. Không dùng kiểu/chức năng riêng PostgreSQL. Không sửa bước cập nhật đã áp dụng; cấu hình ddl-auto=validate ngoài kiểm thử, không tự đổi cấu trúc.

## 10. Kiểm chứng
Dùng Maven Wrapper chạy verify phía máy chủ; npm run check và npm run build phía giao diện, tạo các lệnh ở P0.
Tích hợp SQL Server thật, khởi động tiến trình và gọi HTTP kiểm sức khỏe/tuyến nghiệp vụ qua máy chủ trung gian; kiểm bố cục trong trình duyệt. Makefile cũ chưa là bước kiểm chứng hợp lệ. Chưa chạy phải ghi chưa chạy.

## 11. Đối chiếu quy tắc chung
| Quy tắc RD-00 | Thiết kế | Tên kiểm thử dự kiến |
|---|---|---|
| GBR-01 | §5; BD-03 §1 | test_GBR_01_owner_scope |
| GBR-02 | BD-M02 §4; BD-02 §2 | test_GBR_02_revision_locator |
| GBR-03 | BD-M04 §3/§6 | test_GBR_03_reload_outbox |
| GBR-04 | BD-M03 §6 | test_GBR_04_immutable_checksum |
| GBR-05 | BD-M04 §3 | test_GBR_05_device_availability |
| GBR-06 | BD-02 §1 | test_GBR_06_utc_roundtrip |
| GBR-07 | BD-M01 §6; BD-M04 §5 | test_GBR_07_honest_status |
| GBR-08 | BD-03 §4 | test_GBR_08_untrusted_content |
NFR-00-01..08 đo theo RD-00 §8, đính kết quả vào bước kiểm chứng giai đoạn. Các kiểm thử trên mới dự kiến, chưa viết/chạy.

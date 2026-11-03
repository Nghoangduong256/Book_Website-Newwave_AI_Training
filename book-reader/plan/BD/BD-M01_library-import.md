# BD-M01 — Thư viện và nhập sách

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.

Đây là thiết kế đề xuất, chưa phải tính năng đã triển khai. Quyết định sản phẩm chưa xác nhận xem management/OPEN-DECISIONS.md.

Tài liệu yêu cầu: ../RD/RD-01_library-import.md · Giai đoạn: P1

## 1. Tóm tắt
Quản lý thông tin mô tả và nhập một bản PDF/EPUB từ tệp hoặc URL trực tiếp; một sách có một phiên bản tệp bất biến ở bản đầu.
Áp dụng chuẩn chung BD-00, giao diện BD-01, dữ liệu BD-02, bảo mật BD-03 và hạ tầng BD-05. Bộ xử lý đọc sách xem BD-M02; bản đầu không có tính năng AI.

## 2. Nghiệp vụ và thành phần phụ thuộc
LibraryService quản lý thông tin sách; StoragePort quản lý nội dung tệp; ImportService quản lý tác vụ nhập sách. Bộ đọc nhận BookReadDescriptor qua LibraryReadService.requireReadable(CurrentReader, bookId), không truy cập trực tiếp tầng dữ liệu của phân hệ khác.
Tệp bất biến sau khi nhập. Xác minh MIME từ dữ liệu và cấu trúc EPUB, không chỉ dựa vào phần mở rộng hoặc tiêu đề HTTP.

## 3. Cấu trúc dữ liệu
Dùng lib_books, lib_files, lib_import_jobs theo BD-02 §2. Khóa chống thực hiện lặp của thao tác nhập được giới hạn theo chủ sở hữu. SHA-256 dùng kiểm toàn vẹn và cảnh báo trùng trong thư viện cá nhân, không đối chiếu công khai giữa người dùng.
publishYear có thể trống, kiểu int từ 1 đến 9999. Danh sách tags tối đa 20 mục, mỗi mục tối đa 50 ký tự; title tối đa 255; author có thể trống, tối đa 255.

## 4. API
### 4.1 Nhập tệp
POST /books/import-file nhận multipart gồm file và metadata tùy chọn; quyền book:create; Idempotency-Key dạng UUID bắt buộc. Trả 201 BookRead kèm ETag khi kiểm tra, chuyển tệp vào vùng chính và giao dịch cơ sở dữ liệu đều hoàn tất. Trả 413 khi quá dung lượng, 415 khi sai định dạng, 422 khi hỏng/chưa hỗ trợ; giới hạn xem quyết định #3.
### 4.2 Nhập URL
POST /imports/url nhận {url, metadata?}, quyền import:create và Idempotency-Key; trả 202 {id,state,bookId?,errorCode?}. GET /imports/{id} yêu cầu import:read. READY trả bookId; FAILED trả mã lỗi và cách thử lại. Muốn thử lại sau thất bại, tạo tác vụ mới bằng khóa mới.
### 4.3 Quản lý thông tin sách
GET /books?q=&format=&sort=&limit=25&cursor= yêu cầu book:read; GET /books/{id} lấy chi tiết. PATCH /books/{id} yêu cầu book:update và If-Match. DELETE /books/{id} yêu cầu book:delete và If-Match; trả 204 sau khi đánh dấu đã xóa.
### 4.4 Đọc nội dung tệp
GET/HEAD /books/{id}/content yêu cầu file:read; mỗi yêu cầu kiểm tra chủ sở hữu và trạng thái sách hiện tại. Dùng mã kiểm toàn vẹn làm ETag bất biến; hỗ trợ Accept-Ranges: bytes. Khoảng dữ liệu hợp lệ trả 206/Content-Range; không hợp lệ trả 416; toàn bộ nội dung trả 200. DTO không chứa đường dẫn lưu trữ.
Việc trả nội dung qua API là điều chỉnh có chủ đích so với quy tắc chỉ dùng URL ký sẵn trong mẫu; xem BD-03.

## 5. Màn hình
Tuyến và cách mở màn hình nằm trong BD-SCREEN-INDEX. Biểu mẫu nhập có hai thẻ Tệp/URL, nêu giới hạn và phân biệt Đang tải lên/Đang xử lý/Đã lưu; không hiển thị phần trăm giả. Thẻ sách có định dạng và khả năng đọc ngoại tuyến của thiết bị hiện tại.
Biểu mẫu sửa cảnh báo rời đi khi chưa lưu. Có trạng thái đang tải, trống, lỗi có thử lại, không tìm thấy và không có quyền.

## 6. Trình tự nhập sách và xử lý lỗi
Tệp: nhận theo luồng có giới hạn → lưu đường dẫn tạm ngẫu nhiên → kiểm tra nội dung/mã kiểm toàn vẹn → chuyển nguyên tử sang vùng chính → giao dịch tạo tệp/sách READY → phản hồi.
Nếu ghi cơ sở dữ liệu lỗi, xóa bù tệp vừa chuyển; lỗi dọn dẹp được ghi lại để xử lý tiếp. Bản kê nhập tạm lưu bền vững thao tác và đường dẫn. Sau khởi động lại, đối soát và xóa tệp không còn tham chiếu khi hết thời gian chờ; không xóa tệp đang được tham chiếu.
URL: lưu QUEUED trước phản hồi 202. Tiến trình nền nhận quyền xử lý có thời hạn cho một tác vụ, chuyển RUNNING → READY/FAILED và lưu mã sách trong cùng giao dịch hoàn tất. Ràng buộc kết quả duy nhất ngăn tạo trùng khi thử lại. Quyền xử lý hết hạn có thể được thu hồi để phục hồi sau sự cố; sự cố sau chuyển tệp dùng cùng bản kê để đối soát.
Đề xuất thử lại lỗi tạm thời tối đa ba lần và giới hạn tổng thời gian. Giao diện hiển thị Chờ xử lý/Đang xử lý/Hoàn tất/Thất bại, tương ứng QUEUED/RUNNING/READY/FAILED. Dừng hỏi trạng thái khi kết thúc hoặc sau tối đa 5 phút rồi cho tải lại; mỗi lần xử lý máy chủ tối đa 120 giây.
Xóa sách trước hết đánh dấu đã xóa; xóa tệp vật lý sau thời hạn đề xuất ở quyết định #5, có thể thử lại khi dọn dẹp lỗi. Thiết bị hiện tại xóa bộ nhớ đệm; thiết bị khác nhận biết khi đồng bộ.

## 7. Thực thi quy tắc nghiệp vụ
Giao dịch nhập và bản kê bảo đảm chỉ ghi READY khi đầy đủ. Tầng dữ liệu lọc theo chủ sở hữu. Không có API thay nội dung tệp; đối soát xử lý các điểm sự cố.

## 8. Sự kiện
Bản đầu không dùng hệ thống môi giới thông điệp hay hàng đợi sự kiện máy chủ. Trạng thái nhập bền vững và giao dịch quyết định việc hoàn tất. Các phân hệ gọi dịch vụ công khai trong cùng tiến trình; sự kiện ra ngoài để sau.

## 9. Tác vụ nền
Tải URL và đối soát dùng tác vụ lưu trong SQL Server cùng bộ thực thi nền. Đề xuất tối đa hai tác vụ đồng thời. Giới hạn tải/kiểm tra mạng theo BD-03 §3. Mã lỗi phân biệt hết thời gian, URL bị chặn, tệp không hợp lệ, vượt dung lượng và lỗi lưu trữ.

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
EPUB bố cục cố định chưa cam kết trước quyết định #6. Dữ liệu mẫu phải có quyền sử dụng hợp pháp; lưu bản kê mã kiểm toàn vẹn và giấy phép, không đưa sách vi phạm bản quyền vào Git.

## 14. Đối chiếu yêu cầu với thiết kế
### 14.1 Yêu cầu và tiêu chí nghiệm thu → thiết kế và kiểm thử
| FR | AC | Mục thiết kế | Tên kiểm thử dự kiến |
|---|---|---|---|
| FR-01-01 | AC-01-01 | §4.1, §6 | test_FR_01_01_AC_01_01 |
| FR-01-02 | AC-01-02 | §4.2, §6 | test_FR_01_02_AC_01_02 |
| FR-01-03 | AC-01-03 | §4.3, §5 | test_FR_01_03_AC_01_03 |
| FR-01-04 | AC-01-04 | §4.3 | test_FR_01_04_AC_01_04 |
| FR-01-05 | AC-01-05 | §4.3, §6 | test_FR_01_05_AC_01_05 |
| FR-01-06 | AC-01-06 | §2, §4.4 | test_FR_01_06_AC_01_06 |

### 14.2 Quy tắc nghiệp vụ → cơ chế thực thi
| BR | Mục thiết kế | Tên kiểm thử dự kiến |
|---|---|---|
| BR-01-01 | §6 | test_BR_01_01 |
| BR-01-02 | §2, §12 | test_BR_01_02 |
| BR-01-03 | §3 | test_BR_01_03 |
| BR-01-04 | §6 | test_BR_01_04 |

### 14.3 Tình huống sử dụng và màn hình
| ID | Thiết kế |
|---|---|
| UC-01-01 | §4–§6 |
| UC-01-02 | §4–§6 |
| SC-01-01 | §5 và BD-SCREEN-INDEX |
| SC-01-02 | §5 và BD-SCREEN-INDEX |
| SC-01-03 | §5 và BD-SCREEN-INDEX |

## 15. Vấn đề cần quyết định
Xem OPEN-DECISIONS. API và cấu trúc dữ liệu là bản nháp cần rà soát; chưa có mã nguồn hay kiểm chứng ứng dụng đang chạy.

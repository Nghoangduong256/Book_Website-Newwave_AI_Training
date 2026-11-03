# BD-M04 — Tiến độ, thiết lập và ngoại tuyến

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.

Đây là thiết kế đề xuất, chưa phải tính năng đã triển khai. Quyết định sản phẩm chưa xác nhận xem management/OPEN-DECISIONS.md.

Tài liệu yêu cầu: ../RD/RD-04_reading-state-offline.md · Giai đoạn: P1/P3

## 1. Tóm tắt
Lưu vị trí và thiết lập, tải bản ngoại tuyến trên thiết bị, hàng đợi thay đổi và giải quyết xung đột.
Áp dụng chuẩn chung BD-00, giao diện BD-01, dữ liệu BD-02, bảo mật BD-03 và hạ tầng BD-05. Bộ xử lý đọc sách xem BD-M02; bản đầu không có tính năng AI.

## 2. Ranh giới trách nhiệm
ReadingStateService quản lý tiến độ/thiết lập trên máy chủ; OfflineRepository quản lý tệp, bản kê và hàng đợi thay đổi ở trình duyệt. Thay đổi mục lục dùng giao diện BD-M03. Ranh giới tài khoản thuộc MOD-05.

## 3. Mô hình
rd_progress duy nhất theo (reader_id,book_id,file_id), có vị trí kiểm theo định dạng và phiên bản. rd_settings lưu bản sao thiết lập tùy chọn. Bản đầu ưu tiên thiết lập từng thiết bị; bản máy chủ không tự ghi đè.
IndexedDB lưu bản kê, tệp nhị phân, tiến độ, mục lục, đánh dấu và hàng đợi. Khóa phân vùng gồm {installationId,readerId,bookId,fileId,checksum}; deviceId ngẫu nhiên chỉ là thông tin thiết bị, không cấp quyền.
Hàng đợi gồm {mutationId,resource,entityId,baseVersion,body,sequence,state}. Một giao dịch cục bộ đồng thời lưu dữ liệu và thao tác chờ gửi. Mỗi nguồn ứng dụng chỉ có một bộ điều phối đồng bộ bằng khóa; nếu không có Web Locks thì dùng quyền điều phối có thời hạn. Áp dụng theo thứ tự của từng loại dữ liệu.

## 4. API
GET /books/{id}/progress, quyền progress:read, trả {locator?,version,updatedAt}; version=0 nếu chưa có.
PUT /books/{id}/progress, quyền progress:update, bắt buộc If-Match và Idempotency-Key; tạo mới dùng If-Match "0". Nội dung {fileId,locator,deviceId}; chủ sở hữu lấy từ ngữ cảnh tin cậy. Tranh chấp khóa duy nhất trả 409; thành công trả ETag mới và vị trí chuẩn.
GET /settings; PATCH /settings dùng If-Match và settings:update để chủ động sao lưu thiết lập, không tự ghi đè giữa thiết bị.
GET /sync/manifest?cursor=, quyền book:read, trả trạng thái sách thuộc chủ sở hữu gồm cả đã xóa/phiên bản tệp, con trỏ tiếp và mốc hết hạn. Con trỏ hết hạn buộc đối soát toàn bộ thư viện; sách chỉ còn ở bản cục bộ thì thu hồi quyền mở. Không có API đồng bộ tùy ý bảng/chủ sở hữu; mục lục dùng API riêng.
Máy chủ lưu chống thực hiện lặp theo (reader,method,path,key), mã băm yêu cầu, kết quả và thời hạn đề xuất 30 ngày. Cùng khóa khác nội dung trả 409. Thao tác không rõ kết quả đã hết hạn phải giữ cục bộ để đối soát, không âm thầm gửi như mới.

## 5. Trải nghiệm sử dụng
Biểu tượng ngoại tuyến lấy từ bản kê cục bộ. Tải về có trạng thái Chưa tải/Đang tải/Sẵn sàng/Lỗi; chỉ có phần trăm khi biết số byte thật, nếu không thì báo đang xử lý.
Hiển thị dung lượng ước tính nếu có; xin quyền lưu bền vững ở mức hỗ trợ tốt nhất, bị từ chối không làm ứng dụng dừng. Phân biệt Đã lưu cục bộ/Đã đồng bộ/Xung đột.
Màn hình thiết lập có thể xóa riêng tệp tải về; giữ dữ liệu đọc và hàng đợi, trừ khi người dùng chủ động xác nhận bỏ.

## 6. Thuật toán ngoại tuyến và đồng bộ
Tải: kiểm quyền/thông tin mới nhất → nhận dữ liệu theo luồng có giới hạn → tính mã băm → giao dịch lưu tệp và bản kê → đánh dấu sẵn sàng. Lỗi dung lượng/tải dở không được có nhãn sẵn sàng; tệp gốc máy chủ không bị ảnh hưởng.
Lưu phần khung ứng dụng, bộ xử lý PDF và tài nguyên cần thiết qua service worker; chỉ báo sẵn sàng sau khi lưu trước thành công. HTTPS bắt buộc, trừ localhost; điện thoại qua HTTP mạng LAN chưa đủ điều kiện ngoại tuyến.
Mở sách ưu tiên bản kê cục bộ, không chờ API. Thiếu dữ liệu thì đề nghị kết nối lại. Không bảo đảm đọc được sau khi trình duyệt xóa dữ liệu hoặc thu hồi quyền tức thời khi mất mạng.
Tự lưu vị trí bằng giao dịch cục bộ; đề xuất gom thay đổi trong 500ms. Cố gửi khi vị trí ổn định hoặc ứng dụng chuyển nền, nhưng không dựa vào yêu cầu lúc đóng trang. Mốc bền vững là giao dịch cục bộ đã hoàn tất. Chỉ gộp thao tác cùng loại chưa gửi; không đổi nội dung yêu cầu đang gửi với cùng khóa.
Kết nối lại: kiểm sách đã xóa và bản kê trước, sau đó xử lý hàng đợi. Sách bị xóa chặn ghi tiếp, đánh dấu không mở được; cho người dùng sao chép/xuất dữ liệu cục bộ chờ gửi hoặc chủ động bỏ, không tự tạo lại sách. Thử lại mạng với khoảng chờ tăng có giới hạn; sau năm lần hiển thị cách thử lại và giữ hàng đợi.
409: giữ bản cục bộ và máy chủ, tạm dừng hàng đợi liên quan, hiển thị hai vị trí. Chọn bản cục bộ thì gửi phiên bản mới nhất bằng khóa mới; chọn máy chủ thì xác nhận bỏ tiến độ cục bộ bị thay thế. Không lấy trang lớn nhất hay đồng hồ thiết bị để quyết định. Xung đột cây mục lục chọn toàn bản theo BD-M03; xung đột lặp không tạo vòng tự gửi vô hạn.
Xóa tệp ngoại tuyến không xóa sách máy chủ. Trước xóa bản kê phải cảnh báo dữ liệu chưa đồng bộ; dữ liệu chờ gửi vẫn giữ khi người dùng chỉ bỏ tệp. Xóa toàn bộ dữ liệu trình duyệt vẫn có thể mất thay đổi chỉ nằm cục bộ; giao diện nêu giới hạn này.
Đổi tài khoản tương lai cần đổi phân vùng và gỡ quyền đọc bộ nhớ đệm; tuyệt đối không gửi hàng đợi dưới danh tính khác.

## 7. Thực thi quy tắc
Kiểm toàn vẹn và giao dịch trước nhãn sẵn sàng; kiểm phiên bản tại máy chủ. Bản ghi chống thực hiện lặp, kết quả và thay đổi nghiệp vụ nằm trong cùng giao dịch. Mọi API áp dụng chính sách người đọc.

## 8. Sự kiện
Sự kiện có mạng/đổi trạng thái hiển thị kích hoạt đồng bộ có giới hạn. Có mạng không chứng minh máy chủ truy cập được.

## 9. Tác vụ nền
Tải và đồng bộ có thể hủy; không bắt buộc API đồng bộ nền trên iOS. Đồng bộ khi ứng dụng hoạt động; hướng dẫn mở lại để gửi thay đổi đang chờ.

## 10. AI
Không có.

## 11. Hiệu năng
Không tự tải mọi sách. Hiển thị hạn chế dung lượng; giới hạn tải theo chính sách máy chủ và chỗ trống thiết bị. Đo bộ nhớ ở P3.

## 12. Bảo mật
Bản kê riêng tư lọc theo chủ sở hữu. IndexedDB là vùng lưu theo nguồn ứng dụng, không phải mã hóa hay xác thực; người dùng cùng hồ sơ trình duyệt có thể đọc sách đã tải.
Khi có nhiều tài khoản, kiểm chứng đăng xuất, dọn dữ liệu và cách ly trước phát hành.


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
| FR-04-01 | AC-04-01 | §3, §4, §6 | test_FR_04_01_AC_04_01 |
| FR-04-02 | AC-04-02 | §3, §5 | test_FR_04_02_AC_04_02 |
| FR-04-03 | AC-04-03 | §5, §6 | test_FR_04_03_AC_04_03 |
| FR-04-04 | AC-04-04 | §6 | test_FR_04_04_AC_04_04 |
| FR-04-05 | AC-04-05 | §4, §6 | test_FR_04_05_AC_04_05 |
| FR-04-06 | AC-04-06 | §6 | test_FR_04_06_AC_04_06 |

### 14.2 Quy tắc nghiệp vụ → cơ chế thực thi
| BR | Mục thiết kế | Tên kiểm thử dự kiến |
|---|---|---|
| BR-04-01 | §3 | test_BR_04_01 |
| BR-04-02 | §6 | test_BR_04_02 |
| BR-04-03 | §6 | test_BR_04_03 |
| BR-04-04 | §6 | test_BR_04_04 |

### 14.3 Tình huống sử dụng và màn hình
| ID | Thiết kế |
|---|---|
| UC-04-01 | §4–§6 |
| UC-04-02 | §4–§6 |
| SC-04-01 | §5 và BD-SCREEN-INDEX |
| SC-04-02 | §5 và BD-SCREEN-INDEX |

## 15. Vấn đề cần quyết định
Xem OPEN-DECISIONS. API và cấu trúc dữ liệu là bản nháp cần rà soát; chưa có mã nguồn hay kiểm chứng ứng dụng đang chạy.

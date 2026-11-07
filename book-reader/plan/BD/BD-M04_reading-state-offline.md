# BD-M04 — Tiến độ, thiết lập và ngoại tuyến

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

Yêu cầu/thiết kế đã được chủ dự án duyệt; chưa phải tính năng đã triển khai. Lịch sử quyết định xem management/OPEN-DECISIONS.md.

Tài liệu yêu cầu: ../RD/RD-04_reading-state-offline.md · Giai đoạn: P1/P3

## 1. Tóm tắt
Lưu vị trí và thiết lập, tải bản ngoại tuyến trên thiết bị, hàng đợi thay đổi và giải quyết xung đột.
Áp dụng chuẩn chung BD-00, giao diện BD-01, dữ liệu BD-02, bảo mật BD-03 và hạ tầng BD-05. Bộ xử lý đọc sách xem BD-M02; bản đầu không có tính năng AI.

## 2. Ranh giới trách nhiệm
ReadingStateService quản lý tiến độ/thiết lập trên máy chủ; OfflineRepository quản lý tệp, bản kê và hàng đợi thay đổi ở trình duyệt. Thay đổi mục lục dùng giao diện BD-M03. Ranh giới tài khoản thuộc MOD-05.

## 3. Mô hình
rd_progress duy nhất theo (reader_id,book_id,file_id), có vị trí kiểm theo định dạng và phiên bản. locator có thể null biểu thị Chưa bắt đầu/Đã đặt lại; reset không làm mất số phiên bản. rd_settings lưu bản sao thiết lập tùy chọn. Bản đầu ưu tiên thiết lập từng thiết bị; bản máy chủ không tự ghi đè.
IndexedDB lưu bản kê, tệp nhị phân, tiến độ, mục lục, đánh dấu và hàng đợi. Khóa phân vùng gồm {installationId,readerId,bookId,fileId,checksum}; deviceId ngẫu nhiên chỉ là thông tin thiết bị, không cấp quyền.
Hàng đợi gồm {mutationId,resource,entityId,baseVersion,baseSnapshot,body,sequence,state}. Một giao dịch cục bộ đồng thời lưu dữ liệu và thao tác chờ gửi. Mỗi nguồn ứng dụng chỉ có một bộ điều phối đồng bộ bằng khóa; nếu không có Web Locks thì dùng quyền điều phối có thời hạn. Áp dụng theo thứ tự của từng loại dữ liệu.

## 4. API
Cấu trúc trường, mã lỗi và ví dụ theo BD-06_API_CONTRACT.md. Mọi tuyến có tiền tố /api/v1.
GET /books/{id}/progress, quyền progress:read, trả {locator,version,updatedAt}; bản chưa có dùng locator:null,version:0. PUT cùng tuyến yêu cầu progress:update, If-Match và Idempotency-Key, nhận {fileId,locator,deviceId}; locator:null là đặt lại, không DELETE bản ghi hay quay version về0.
GET /settings và PATCH /settings để người dùng chủ động sao lưu; không tự ghi đè thiết lập thiết bị khác.
GET /sync/manifest?cursor=, quyền book:read, trả toàn bộ danh sách sách gồm đã xóa, fileId/checksum, availability và bookVersion. Bản đầu dùng một lượt chụp nhất quán phân trang, không dùng con trỏ thay đổi tăng dần. Chỉ so sách vắng mặt khi đã nhận đủ toàn bộ lượt; lỗi/mất trang không được suy ra đã xóa.
GET /books/{id}/reading-snapshot, các quyền book:read/progress:read/navigation:read, trả toàn bộ progress,toc,bookmarks gồm dấu xóa còn giữ, cùng snapshotVersion. Bản chụp nhất quán trong một giao dịch; không ghép nhiều phản hồi ở các thời điểm khác nhau. Không trả thiết lập để ghi đè thiết bị.
Máy chủ lưu chống thực hiện lặp, nội dung và kết quả cùng giao dịch. Khóa cùng nội dung trả kết quả đã ghi trước khi xét lại If-Match, sau kiểm danh tính/quyền; khác nội dung trả409. Khóa hết thời hạn không rõ kết quả phải đối soát dữ liệu hiện tại, không tự gửi như mới.

## 5. Trải nghiệm sử dụng
Biểu tượng ngoại tuyến lấy từ bản kê cục bộ. Tải về có trạng thái Chưa tải/Đang tải/Sẵn sàng/Lỗi; chỉ có phần trăm khi biết số byte thật, nếu không thì báo đang xử lý.
Hiển thị dung lượng ước tính nếu có; xin quyền lưu bền vững ở mức hỗ trợ tốt nhất, bị từ chối không làm ứng dụng dừng. Phân biệt Đã lưu cục bộ/Đã đồng bộ/Xung đột.
Thiết lập có Xóa bản tải về và Đặt lại tiến độ với xác nhận nêu phạm vi. Màn hình SC-04-03 tại /settings/pending-data cho xem/copy/xuất JSON/bỏ dữ liệu cách ly; có trạng thái trống/lỗi và xác nhận trước bỏ. Hộp thoại conflict hiển thị vị trí hoặc nội dung hai bản, có Dùng thiết bị/Dùng máy chủ/Để sau; không dùng nhãn chung gây nhầm xóa sách.

## 6. Đồng bộ hai chiều, ngoại tuyến và xóa
### 6.1 Mở và tải
Tải: kiểm quyền/trạng thái → nhận tệp giới hạn → kiểm mã toàn vẹn → giao dịch lưu tệp và bản kê → Sẵn sàng. Lưu đủ khung ứng dụng, bộ xử lý, phông chữ/tài nguyên qua service worker. HTTPS nội bộ được tin cậy bắt buộc cho điện thoại; localhost là ngoại lệ phát triển.
Mở ngoại tuyến ưu tiên bản kê, không đợi API. Thiếu tệp thì đề nghị tải lại khi nối mạng; không giả đọc được sau khi trình duyệt thu hồi dung lượng.
Nếu đã biết sách bị xóa thì chặn mở. Chưa biết do mất mạng có thể vẫn đọc; nêu giới hạn thu hồi, không cam kết tuyệt đối.

### 6.2 Thời điểm và thứ tự đồng bộ
P1: khi mở sách trực tuyến và quay lại ứng dụng, lấy tiến độ mới trước khôi phục, rồi gửi thay đổi có phiên bản. P2: làm tương tự với cây mục lục/đánh dấu trực tuyến. P3: thêm lưu bền vững ngoại tuyến, đồng bộ khi nối lại và giải quyết xung đột đầy đủ.
Vòng đồng bộ: (1) xác nhận máy chủ truy cập được; (2) nhận đủ bản kê thư viện và xử lý sách xóa; (3) nhận reading-snapshot cho sách đang mở/có hàng đợi và cập nhật sách đã tải theo lượt có giới hạn; (4) so ba bản gốc đã xác nhận/local/server theo từng loại dữ liệu; (5) gửi thao tác không xung đột theo thứ tự; (6) nhận lại bản chụp sau xác nhận, đánh dấu đã đồng bộ.
Một bộ điều phối duy nhất mỗi nguồn ứng dụng; khóa/quyền điều phối có thời hạn. Bản chụp về muộn không ghi đè lần sửa local mới hơn; giữ sequence khi nhận/gửi. Khi có xung đột tạm dừng tài nguyên liên quan, không chặn đọc hoặc tài nguyên độc lập.

### 6.3 Quy tắc hợp nhất đã chốt
| Trường hợp | Hành vi |
|---|---|
| Không có local chưa gửi | Nhận bản máy chủ mới, gồm tiến độ/mục lục và xóa đánh dấu |
| Có local, version máy chủ bằng bản gốc | Gửi local, giữ khóa ổn định khi thử lại |
| Cả hai cùng đổi tiến độ, kể cả đặt lại | Giữ hai vị trí/trạng thái; chọn dùng thiết bị hoặc máy chủ; không lấy trang lớn nhất/đồng hồ thiết bị |
| Hai đánh dấu mới có UUID khác nhau | Giữ cả hai; nhập cùng vị trí không tự coi là trùng |
| Cùng đánh dấu sửa ở hai phía hoặc một phía xóa một phía sửa | Chọn bản thiết bị/máy chủ; không tự phục hồi bản đã xóa |
| Hai phía cùng sửa cây mục lục | Chọn toàn cây; không tự trộn ở bản đầu |
| Hai phía đã giống nhau | Ghi nhận bản xác nhận, không tạo yêu cầu thay đổi mới |
Chọn local: lấy version hiện tại, xác nhận ghi đè rồi tạo khóa mới. Chọn server: xác nhận bỏ các thay đổi local bị thay thế, giữ những thao tác độc lập. Người dùng có thể Để sau; cả hai bản vẫn giữ qua tải lại trang.
Bookmark local mới chưa từng gửi có thể tự bỏ nếu người dùng xóa nó; bookmark đã gửi/không rõ kết quả phải gửi xóa có phiên bản.
Máy chủ giữ dấu xóa theo thời hạn #5. Sau khi hết hạn, so với bản chụp đầy đủ: id từng được xác nhận nay vắng mặt là đã xóa; id local mới chưa gửi vẫn được tạo. Nếu id đã biết bị xóa mà local muốn giữ, yêu cầu người dùng xác nhận tạo đánh dấu mới bằng UUID mới.
Cây mục lục xử lý xóa cha theo BD-M03 §7; không chia PUT cây thành nhiều yêu cầu mất tính nguyên tử.

### 6.4 Bền vững và thử lại
Lưu entity + outbox trong cùng giao dịch IndexedDB. Gom vị trí500ms theo cấu hình; mốc bền vững là giao dịch local thành công, không phải đóng trang. Chỉ gộp yêu cầu chưa gửi; không đổi nội dung cùng khóa đang gửi.
Mất phản hồi: gửi lại đúng khóa/nội dung; máy chủ trả lại kết quả. Thử lại có khoảng chờ tăng; sau năm lần báo hành động và giữ hàng đợi. Không dựa API chạy nền iOS hay sự kiện có mạng để kết luận đã đồng bộ.
Không có chỗ lưu thì báo Chưa lưu, giữ màn hình/dữ liệu trong bộ nhớ nếu có và hướng giải phóng dung lượng; không báo Đã lưu cục bộ.

### 6.5 Xóa và dữ liệu cách ly
Quy tắc nghiệp vụ nguồn: RD-00 §7.2.
Xóa bản tải: bỏ blob và cờ tải hoàn chỉnh, giữ manifest metadata tối thiểu, tiến độ/mục lục/đánh dấu/outbox; không gọi DELETE /books.
Xóa sách khi có thao tác chưa gửi: lựa chọn Đồng bộ rồi xóa, Lưu dữ liệu chờ gửi riêng rồi xóa hoặc Hủy. Nhánh đồng bộ thất bại không gửi xóa; nhánh lưu riêng phải ghi cách ly thành công trước DELETE. P1/P2 chỉ có nhánh hủy/đợi lưu trực tuyến; chưa cung cấp lưu ngoại tuyến trước P3.
Máy chủ đánh dấu sách xóa trong một giao dịch. Thiết bị đang đọc nhận thông báo, dừng đọc và trở về thư viện sau xử lý pending. Khi thiết bị khác nhận dấu xóa, cách ly thay đổi chưa gửi trước khi bỏ tệp và khả năng mở; tuyệt đối không phát lại hàng đợi dưới sách đã xóa.
Bản cách ly chứa metadata nhận diện và dữ liệu cá nhân/locator, không gồm bytes sách; có màn hình danh sách, Sao chép/Xuất JSON hoặc Bỏ sau xác nhận. Không đồng bộ lại vào sách xóa, không hứa phục hồi file. Dữ liệu cách ly tồn tại tới khi chủ động bỏ hoặc xóa toàn bộ dữ liệu trình duyệt.
Đặt lại tiến độ: PUT locator:null giữ version tăng, hiển thị Chưa bắt đầu. Offline lưu cùng outbox; khi xung đột vẫn chọn giữa Chưa bắt đầu và vị trí máy chủ.
Đổi tài khoản tương lai phải đổi phân vùng/vô hiệu dữ liệu cũ; không gửi queue dưới danh tính khác.

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
EPUB bố cục cố định và PDF mật khẩu ngoài bản đầu theo D5; kiểm tệp đó bị từ chối đúng lý do. Dữ liệu mẫu phải có quyền sử dụng hợp pháp; lưu bản kê mã kiểm toàn vẹn và giấy phép, không đưa sách vi phạm bản quyền vào Git.

## 14. Đối chiếu yêu cầu với thiết kế
### 14.1 Yêu cầu → quy tắc → nghiệm thu
| Yêu cầu | Quy tắc liên quan | Tiêu chí nghiệm thu | Tình huống sử dụng |
|---|---|---|---|
| FR-04-01 | GBR-02 | AC-04-01 | UC-04-01 |
| FR-04-02 | GBR-07 | AC-04-02 | UC-04-01 |
| FR-04-03 | BR-04-01, BR-04-02, BR-04-04 | AC-04-03, AC-04-11, AC-04-13 | UC-04-02 |
| FR-04-04 | BR-04-01 | AC-04-04 | UC-04-02 |
| FR-04-05 | GBR-03 | AC-04-05, AC-04-12, AC-04-16 | UC-04-02 |
| FR-04-07 | GBR-07 | AC-04-07, AC-04-14 | UC-04-03 |
| FR-04-08 | BR-04-03 | AC-04-08, AC-04-09, AC-04-10, AC-04-15 | UC-04-01, UC-04-02 |
| FR-04-06 | BR-04-03 | AC-04-06 | UC-04-02 |

### 14.2 Nghiệm thu → thiết kế/API/màn hình → kiểm chứng
Đọc hợp đồng trường/lỗi tại BD-06; màn hình cụ thể tại BD-SCREEN-INDEX. Tham chiếu mục là trong BD này trừ khi ghi tên tài liệu khác. Kiểm thử dưới chỉ là dự kiến, không phải kết quả đạt.
| Tiêu chí | Quy tắc chính | Mục thiết kế | API/màn hình liên quan | Cách kiểm chứng dự kiến |
|---|---|---|---|---|
| AC-04-01 | GBR-02 | §3, §6 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_01; API tích hợp và luồng giao diện |
| AC-04-02 | GBR-07 | §3, §5 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_02; API tích hợp và luồng giao diện |
| AC-04-03 | BR-04-02 | §5, §6.1 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_03; API tích hợp và luồng giao diện |
| AC-04-04 | BR-04-01 | §6.1 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_04; API tích hợp và luồng giao diện |
| AC-04-05 | GBR-03 | §6.4 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_05; API tích hợp và luồng giao diện |
| AC-04-06 | BR-04-03 | §6.3 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_06; API tích hợp và luồng giao diện |
| AC-04-07 | GBR-07 | §4, §6.5 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_07; API tích hợp và luồng giao diện |
| AC-04-08 | BR-04-03 | §6.2 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_08; API tích hợp và luồng giao diện |
| AC-04-09 | BR-04-03 | §6.3 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_09; API tích hợp và luồng giao diện |
| AC-04-10 | BR-04-03 | §6.3 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_10; API tích hợp và luồng giao diện |
| AC-04-11 | BR-04-04 | §6.5 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_11; API tích hợp và luồng giao diện |
| AC-04-12 | GBR-03 | §6.5 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_12; API tích hợp và luồng giao diện |
| AC-04-13 | BR-04-02 | §6.1, §6.4 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_13; API tích hợp và luồng giao diện |
| AC-04-14 | BR-04-03 | §6.3 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_14; API tích hợp và luồng giao diện |
| AC-04-15 | GBR-03 | §4; BD-06 §5 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_15; API tích hợp và luồng giao diện |
| AC-04-16 | GBR-03 | §6.3 | progress/reading-snapshot/manifest; SC-04-01..03 | test_AC_04_16; API tích hợp và luồng giao diện |

### 14.3 Quy tắc nghiệp vụ và khả năng truy cập màn hình
| Mã | Thiết kế và kiểm chứng |
|---|---|
| BR-04-01 | §3–§7, §12; test_BR_04_01 và các AC liên quan |
| BR-04-02 | §3–§7, §12; test_BR_04_02 và các AC liên quan |
| BR-04-03 | §3–§7, §12; test_BR_04_03 và các AC liên quan |
| BR-04-04 | §3–§7, §12; test_BR_04_04 và các AC liên quan |
| UC-04-01 | §4–§6, RD §4; kiểm đi trọn luồng chính/ngoại lệ |
| UC-04-02 | §4–§6, RD §4; kiểm đi trọn luồng chính/ngoại lệ |
| UC-04-03 | §4–§6, RD §4; kiểm đi trọn luồng chính/ngoại lệ |
| SC-04-01 | §5 và BD-SCREEN-INDEX, kiểm mở bằng nút/trình đơn |
| SC-04-02 | §5 và BD-SCREEN-INDEX, kiểm mở bằng nút/trình đơn |

| SC-04-03 | §5/§6.5; BD-SCREEN-INDEX; kiểm xem/copy/xuất/bỏ dữ liệu cách ly |

## 15. Vấn đề cần quyết định
API/cấu trúc dữ liệu đã chốt bản1.0; không còn quyết định sản phẩm mở. Thay đổi cần CR. Việc xác minh kỹ thuật vẫn phải thực hiện; chưa có mã nguồn hay kiểm chứng ứng dụng đang chạy.

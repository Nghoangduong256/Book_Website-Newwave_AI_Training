# BD-M03 — Mục lục và đánh dấu

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

Yêu cầu/thiết kế đã được chủ dự án duyệt; chưa phải tính năng đã triển khai. Lịch sử quyết định xem management/OPEN-DECISIONS.md.

Tài liệu yêu cầu: ../RD/RD-03_navigation.md · Giai đoạn: P2 trực tuyến; P3 ngoại tuyến

## 1. Tóm tắt
Đọc mục lục gốc, tạo mục lục cá nhân phân cấp và đánh dấu theo vị trí; không viết lại tệp sách.
Áp dụng chuẩn chung BD-00, giao diện BD-01, dữ liệu BD-02, bảo mật BD-03 và hạ tầng BD-05. Bộ xử lý đọc sách xem BD-M02; bản đầu không có tính năng AI.

## 2. Nghiệp vụ
Bộ xử lý đọc sách cung cấp NativeToc; NavigationService chỉ lưu TocEntry và Bookmark cá nhân. LibraryReadService kiểm sách/tệp/chủ sở hữu; kiểm vị trí theo ReaderLocation.
Máy chủ không mặc định CFI là vị trí có thật; trình duyệt thử mở và xử lý lỗi an toàn.

## 3. Cấu trúc dữ liệu
nav_toc_entries và nav_bookmarks theo BD-02. UUID do trình duyệt tạo để dùng ngoại tuyến; API tạo nhận id nhưng không nhận chủ sở hữu. title từ 1 đến 200 ký tự; sort_order là số nguyên không âm. Khóa duy nhất và khóa ngoại ghép ràng buộc người đọc/sách/tệp/mục.
Khóa cha gồm parent_id,reader_id,book_id,file_id. Dịch vụ kiểm chu trình trong giao dịch khóa cây; tối đa 5 cấp. Không lưu mục lục gốc trên máy chủ; lưu đệm trong bản kê theo mã kiểm toàn vẹn.

## 4. API
Các tuyến dưới /books/{bookId}, quyền navigation:* theo RD-00; trường/kiểu/lỗi theo BD-06.
GET /toc trả cây cá nhân, treeVersion và ETag; chưa có trả cây rỗng/version0. PUT /toc bắt buộc If-Match và Idempotency-Key, nhận {fileId,entries}. Thay cả cây trong một giao dịch; kiểm id/cha/chu trình/vị trí/kích thước. Tối đa500mục/5cấp, cấu hình được. Không sửa mục lục gốc.
GET /bookmarks trả items gồm id/fileId/title/locator/version/deletedAt và con trỏ trang; client chỉ dùng bản đầy đủ để xác định vắng mặt. POST tạo dùng UUID client và khóa chống lặp; PATCH/DELETE cùng id bắt buộc If-Match và Idempotency-Key. Không nhận owner/reader do client gửi; sai sách trả404.
Sửa/xóa bookmark cũ xung đột trả409 cùng currentVersion/currentResource; UUID trùng nội dung khác trả ID_REUSED. Mất ACK gửi lại cùng khóa được trả kết quả trước kiểm stale version.
GET reading-snapshot ở BD-M04 là cách lấy đồng thời tiến độ/cây/bookmark cho đồng bộ; API đơn lẻ vẫn dùng để hiển thị trực tuyến.

## 5. Giao diện
Hai thẻ mục lục gốc/cá nhân, cùng danh sách đánh dấu. Biểu mẫu tạo từ vị trí hiện tại hiển thị trước trang/chương, yêu cầu tên và cho chọn cha.
Có nút lên/xuống hoặc chọn thứ tự dùng bàn phím, không chỉ kéo thả. Phân biệt Đã lưu trên thiết bị/Chờ đồng bộ/Xung đột. Lỗi mục lục có thử lại riêng, không chặn đọc sách.

## 6. Trình tự và giai đoạn
P2 nghiệm thu FR-03-01..05 trực tuyến: đọc gốc, tạo/sửa cây và đánh dấu, chờ server xác nhận mới ghi Đã lưu. Mạng lỗi giữ dữ liệu biểu mẫu và cho thử lại; chưa hứa lưu qua đóng ứng dụng.
P3 nghiệm thu FR-03-06: giao dịch local lưu dữ liệu và hàng đợi, dùng đồng bộ hai chiều và giải quyết xung đột tại BD-M04 §6.
Mục lục PDF dùng getOutline/getDestination/getPageIndex, đổi chỉ số0 sang trang1; EPUB mở href/fragment và CFI. Đích lỗi báo rõ, không đổi vị trí cũ.
Hai bookmark tạo khác UUID giữ cả hai. Cùng bookmark sửa/xóa hai phía phải chọn. Hai cây cùng đổi chọn toàn bản, không trộn. Không sửa file gốc; checksum trước/sau phải giống nhau.

## 7. Thực thi quy tắc
PUT toàn cây kiểm version nav_toc_sets và ghi nguyên tử. Trước so cây cũ và mới: muốn xóa mục đang có con phải chuyển/xóa con bằng một thao tác đã xác nhận trước; nếu cùng PUT xóa luôn cha và con thì trả422 PARENT_HAS_CHILDREN. PUT chỉ xóa cha sau khi cây server hiện tại không còn con. Quy tắc tránh coi xóa cả cây là đường vòng xóa cha.
Kiểm tất cả cha còn tồn tại trong cây mới, cùng sách/tệp/người đọc; không chu trình, không quá độ sâu. Mọi bookmark sửa/xóa kiểm version; tombstone không tự hồi sinh. Cách giữ lại bản đã xóa qua UUID mới chỉ sau user xác nhận.

## 8. Sự kiện
Không dùng môi giới thông điệp; sự kiện điều hướng cục bộ gọi ReaderAdapter.navigate.

## 9. Tác vụ nền
Không có tác vụ riêng; dùng hàng đợi đồng bộ của trình duyệt.

## 10. AI
Không tự trích tiêu đề chương hoặc OCR.

## 11. Quy mô
Giới hạn cây tại §3/§4 cần rà soát với quyết định #3. Phân trang danh sách đánh dấu khi nhiều; lưu đệm mục lục gốc theo mã kiểm toàn vẹn của tệp.

## 12. Bảo mật
Lọc chủ sở hữu cho danh sách/chi tiết/thay đổi. Tiêu đề mục gốc là văn bản thuần, không innerHTML. Đích mục lục ngoài tệp không tự mở kết nối mạng.


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
| FR-03-01 | BR-03-01 | AC-03-01, AC-03-13 | UC-03-01 |
| FR-03-02 | BR-03-01, BR-03-04 | AC-03-02, AC-03-12 | UC-03-02 |
| FR-03-03 | BR-03-02, BR-03-03, BR-03-05 | AC-03-03, AC-03-07, AC-03-08, AC-03-11 | UC-03-02 |
| FR-03-04 | BR-03-01, BR-03-05 | AC-03-04, AC-03-09, AC-03-10, AC-03-14 | UC-03-02 |
| FR-03-05 | BR-03-01 | AC-03-05 | UC-03-02 |
| FR-03-06 | GBR-03 | AC-03-06 | UC-03-02 |

### 14.2 Nghiệm thu → thiết kế/API/màn hình → kiểm chứng
Đọc hợp đồng trường/lỗi tại BD-06; màn hình cụ thể tại BD-SCREEN-INDEX. Tham chiếu mục là trong BD này trừ khi ghi tên tài liệu khác. Kiểm thử dưới chỉ là dự kiến, không phải kết quả đạt.
| Tiêu chí | Quy tắc chính | Mục thiết kế | API/màn hình liên quan | Cách kiểm chứng dự kiến |
|---|---|---|---|---|
| AC-03-01 | BR-03-01 | §6 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_01; API tích hợp và luồng giao diện |
| AC-03-02 | BR-03-01 | §3, §4 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_02; API tích hợp và luồng giao diện |
| AC-03-03 | BR-03-02 | §4, §7 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_03; API tích hợp và luồng giao diện |
| AC-03-04 | BR-03-01 | §4 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_04; API tích hợp và luồng giao diện |
| AC-03-05 | BR-03-01 | §5, §6 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_05; API tích hợp và luồng giao diện |
| AC-03-06 | GBR-03 | §6; BD-M04 §6 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_06; API tích hợp và luồng giao diện |
| AC-03-07 | BR-03-02 | §7 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_07; API tích hợp và luồng giao diện |
| AC-03-08 | BR-03-03 | §7 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_08; API tích hợp và luồng giao diện |
| AC-03-09 | BR-03-05 | §6; BD-M04 §6.3 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_09; API tích hợp và luồng giao diện |
| AC-03-10 | BR-03-05 | §6; BD-M04 §6.3 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_10; API tích hợp và luồng giao diện |
| AC-03-11 | BR-03-05 | §6 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_11; API tích hợp và luồng giao diện |
| AC-03-12 | BR-03-04 | §6 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_12; API tích hợp và luồng giao diện |
| AC-03-13 | BR-03-01 | §6 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_13; API tích hợp và luồng giao diện |
| AC-03-14 | GBR-07 | §4; BD-06 §6 | toc/bookmarks/reading-snapshot; SC-03-01 | test_AC_03_14; API tích hợp và luồng giao diện |

### 14.3 Quy tắc nghiệp vụ và khả năng truy cập màn hình
| Mã | Thiết kế và kiểm chứng |
|---|---|
| BR-03-01 | §3–§7, §12; test_BR_03_01 và các AC liên quan |
| BR-03-02 | §3–§7, §12; test_BR_03_02 và các AC liên quan |
| BR-03-03 | §3–§7, §12; test_BR_03_03 và các AC liên quan |
| BR-03-05 | §3–§7, §12; test_BR_03_05 và các AC liên quan |
| BR-03-04 | §3–§7, §12; test_BR_03_04 và các AC liên quan |
| UC-03-01 | §4–§6, RD §4; kiểm đi trọn luồng chính/ngoại lệ |
| UC-03-02 | §4–§6, RD §4; kiểm đi trọn luồng chính/ngoại lệ |
| SC-03-01 | §5 và BD-SCREEN-INDEX, kiểm mở bằng nút/trình đơn |

## 15. Vấn đề cần quyết định
API/cấu trúc dữ liệu đã chốt bản1.0; không còn quyết định sản phẩm mở. Thay đổi cần CR. Việc xác minh kỹ thuật vẫn phải thực hiện; chưa có mã nguồn hay kiểm chứng ứng dụng đang chạy.

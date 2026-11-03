# BD-M03 — Mục lục và bookmark

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.

Đây là thiết kế đề xuất, chưa phải tính năng đã triển khai. Quyết định sản phẩm chưa xác nhận xem management/OPEN-DECISIONS.md.

Tài liệu yêu cầu: ../RD/RD-03_navigation.md · Giai đoạn: P2

## 1. Tóm tắt
Đọc mục lục gốc, tạo mục lục cá nhân phân cấp và đánh dấu theo vị trí; không viết lại file sách.
Áp dụng chuẩn chung BD-00, giao diện BD-01, dữ liệu BD-02, bảo mật BD-03 và hạ tầng BD-05. Bộ xử lý đọc sách xem BD-M02; bản đầu không có tính năng AI.

## 2. Nghiệp vụ
Bộ xử lý đọc sách cung cấp NativeToc; NavigationService chỉ lưu TocEntry và Bookmark cá nhân. LibraryReadService kiểm sách/tệp/chủ sở hữu; kiểm vị trí theo ReaderLocation.
Máy chủ không mặc định CFI là vị trí có thật; trình duyệt thử mở và xử lý lỗi an toàn.

## 3. Cấu trúc dữ liệu
nav_toc_entries và nav_bookmarks theo BD-02. UUID do trình duyệt tạo để dùng ngoại tuyến; API tạo nhận id nhưng không nhận chủ sở hữu. title từ 1 đến 200 ký tự; sort_order là số nguyên không âm. Khóa duy nhất và khóa ngoại ghép ràng buộc người đọc/sách/tệp/mục.
Khóa cha gồm parent_id,reader_id,book_id,file_id. Dịch vụ kiểm chu trình trong giao dịch khóa cây; đề xuất tối đa 5 cấp. Không lưu mục lục gốc trên máy chủ; lưu đệm trong bản kê theo mã kiểm toàn vẹn.

## 4. API
Tất cả dưới /books/{bookId}, dùng navigation:* theo RD-00.
GET /toc trả cây cá nhân và ETag treeVersion. PUT /toc với If-Match treeVersion thay toàn bộ cây trong một giao dịch; kiểm mã mục, cha, chu trình, vị trí, kích thước. Đề xuất tối đa 500 mục; cây rỗng hợp lệ. Mục lục gốc đọc trực tiếp từ tệp, không gửi PUT.
GET /bookmarks lấy danh sách. POST /bookmarks nhận {id,fileId,title,locator}, Idempotency-Key. PATCH /bookmarks/{id} nhận {title,locator?}, If-Match. DELETE /bookmarks/{id} có If-Match, đánh dấu đã xóa. Mục thuộc sách khác trả 404.
Xung đột 409 trả phiên bản và dữ liệu máy chủ để chọn, không tự đổi gốc cây. UUID trùng nhưng nội dung khác trả 409.

## 5. Giao diện
Hai thẻ mục lục gốc/cá nhân, cùng danh sách đánh dấu. Biểu mẫu tạo từ vị trí hiện tại hiển thị trước trang/chương, yêu cầu tên và cho chọn cha.
Có nút lên/xuống hoặc chọn thứ tự dùng bàn phím, không chỉ kéo thả. Phân biệt Đã lưu trên thiết bị/Chờ đồng bộ/Xung đột. Lỗi mục lục có thử lại riêng, không chặn đọc sách.

## 6. Trình tự xử lý và ngoại tuyến
Mục lục PDF dùng getOutline/getDestination/getPageIndex; đổi chỉ số trang bắt đầu từ 0 sang số trang bắt đầu từ 1. Không tìm được đích thì báo không đến được, không làm ứng dụng dừng. EPUB mở href/fragment trong danh sách nội dung; mục cá nhân dùng CFI.
Cá nhân: ghi vị trí → kiểm hợp lệ → giao dịch cục bộ lưu mục và hàng đợi thay đổi → hiển thị → đồng bộ qua MOD-04. Khi máy chủ xác nhận, cập nhật phiên bản.
Sửa cây ngoại tuyến giữ treeVersion gốc; nếu máy chủ đã đổi, giữ cả hai bản để người dùng chọn hoặc áp dụng lại, không tự trộn cây. Mã kiểm toàn vẹn khác thì vô hiệu vị trí cũ.
Không có API ghi lại tệp sách; mã kiểm toàn vẹn giữ nguyên sau thêm/sửa/xóa mục.

## 7. Thực thi quy tắc
PUT toàn cây được tuần tự hóa bằng kiểm soát phiên bản lạc quan trên nav_toc_sets; kiểm chu trình/độ sâu/quyền sở hữu trước ghi. Xóa cha còn con trả 422. Mọi sửa đánh dấu kiểm phiên bản.

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
EPUB bố cục cố định chưa cam kết trước quyết định #6. Dữ liệu mẫu phải có quyền sử dụng hợp pháp; lưu bản kê mã kiểm toàn vẹn và giấy phép, không đưa sách vi phạm bản quyền vào Git.

## 14. Đối chiếu yêu cầu với thiết kế
### 14.1 Yêu cầu và tiêu chí nghiệm thu → thiết kế và kiểm thử
| FR | AC | Mục thiết kế | Tên kiểm thử dự kiến |
|---|---|---|---|
| FR-03-01 | AC-03-01 | §4, §6 | test_FR_03_01_AC_03_01 |
| FR-03-02 | AC-03-02 | §3, §4 | test_FR_03_02_AC_03_02 |
| FR-03-03 | AC-03-03 | §4, §7 | test_FR_03_03_AC_03_03 |
| FR-03-04 | AC-03-04 | §4 | test_FR_03_04_AC_03_04 |
| FR-03-05 | AC-03-05 | §5, §6 | test_FR_03_05_AC_03_05 |
| FR-03-06 | AC-03-06 | §6 | test_FR_03_06_AC_03_06 |

### 14.2 Quy tắc nghiệp vụ → cơ chế thực thi
| BR | Mục thiết kế | Tên kiểm thử dự kiến |
|---|---|---|
| BR-03-01 | §3, §12 | test_BR_03_01 |
| BR-03-02 | §3, §7 | test_BR_03_02 |
| BR-03-03 | §7 | test_BR_03_03 |
| BR-03-04 | §6 | test_BR_03_04 |

### 14.3 Tình huống sử dụng và màn hình
| ID | Thiết kế |
|---|---|
| UC-03-01 | §4–§6 |
| UC-03-02 | §4–§6 |
| SC-03-01 | §5 và BD-SCREEN-INDEX |

## 15. Vấn đề cần quyết định
Xem OPEN-DECISIONS. API và cấu trúc dữ liệu là bản nháp cần rà soát; chưa có mã nguồn hay kiểm chứng ứng dụng đang chạy.

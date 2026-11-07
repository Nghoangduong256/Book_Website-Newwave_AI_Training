# RD-04 — Tiến độ, thiết lập và ngoại tuyến

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

Yêu cầu/thiết kế đã được chủ dự án duyệt; chưa phải tính năng đã triển khai. Lịch sử quyết định xem management/OPEN-DECISIONS.md.

Phân hệ: MOD-04 · Giai đoạn: P1/P3 · Mục tiêu: BO-03, BO-04, BO-05

## 1. Mục đích và phạm vi
Lưu vị trí và thiết lập, tải bản ngoại tuyến trên thiết bị, hàng đợi thay đổi và giải quyết xung đột.
Ngoài phạm vi: STRATEGY §2; không thêm tính năng AI. Phụ thuộc RD-00, các phân hệ qua giao diện tích hợp BD-00.

### 1.1 Phân bổ nghiệm thu
P1 lưu/đặt lại tiến độ PDF trực tuyến; P2 thêm EPUB/thiết lập và nhận dữ liệu đọc trực tuyến; P3 ngoại tuyến và xung đột đầy đủ.
Giai đoạn của từng kịch bản tại §13; ghi P1/P2 nghĩa cùng hành vi cần nghiệm thu cho PDF ở P1 và EPUB ở P2, không phải được tùy chọn bỏ một.

## 2. Người sử dụng và quyền
Người đọc cá nhân, chỉ truy cập dữ liệu của mình theo RD-00 §6. Chưa triển khai nhiều tài khoản; không nhận chủ sở hữu do người gọi tự chọn.

## 3. Thuật ngữ
Sách là mục thư viện; phiên bản tệp là nội dung bất biến; định danh vị trí trỏ vào nội dung của phiên bản đó; bản ngoại tuyến nằm trên thiết bị. Thuật ngữ xem references/GLOSSARY.md.

## 4. Tình huống sử dụng
### UC-04-01 — Đọc tiếp giữa các lần và thiết bị
Mở/quay lại ứng dụng → nếu online nhận dữ liệu máy chủ → không có local pending thì dùng bản mới; có pending thì so với bản gốc và xử lý conflict → đọc và lưu.
P1/P2 còn online, P3 hỗ trợ lưu bền vững ngoại tuyến. Lỗi lưu không báo thành công. Không có tiến độ thì Chưa bắt đầu.
### UC-04-02 — Ngoại tuyến và nối lại
Chủ động tải sách đủ → mất mạng/ra ngoài nhà → mở lại và đọc/sửa điều hướng → nối mạng nhà → nhận đủ dữ liệu mới/xóa → gửi thay đổi hợp lệ → xác nhận đã đồng bộ.
Mất ACK thử lại không nhân đôi; lỗi/quota giữ dữ liệu nếu đã lưu thành công. Sách đã xóa thì cách ly pending, chặn phát lại; cho sao chép/xuất bản cứu hoặc bỏ. Xung đột cho chọn thiết bị/máy chủ/Để sau và giữ hai bản qua tải lại.
### UC-04-03 — Đặt lại tiến độ
Chọn Đặt lại tiến độ → thông báo chỉ xóa vị trí → xác nhận → Chưa bắt đầu; sách/tệp/mục lục/đánh dấu nguyên vẹn. Hủy giữ tất cả.
P3 offline cũng lưu thao tác; khi bên kia đồng thời đọc, xem Đã đặt lại và vị trí mới như hai bản xung đột. Không lấy trang lớn nhất tự thắng.

## 5. Yêu cầu chức năng
| ID | Yêu cầu bắt buộc | Tình huống sử dụng |
|---|---|---|
| FR-04-01 | Lưu vị trí PDF/EPUB và khôi phục khi mở lại sách. | UC-04-01 |
| FR-04-02 | Lưu tùy chọn màu giao diện và cách đọc trên thiết bị. | UC-04-01 |
| FR-04-03 | Chủ động tải/xóa bản ngoại tuyến và xem availability/dung lượng trên thiết bị hiện tại. | UC-04-02 |
| FR-04-04 | Mở sách ngoại tuyến sau tải lại trang mà không cần máy chủ ứng dụng khi bộ nhớ đệm đầy đủ. | UC-04-02 |
| FR-04-05 | Giữ thay đổi chưa đồng bộ qua tải lại trang và gửi lại khi có mạng mà không nhân đôi. | UC-04-02 |
| FR-04-07 | Đặt lại tiến độ thành Chưa bắt đầu sau xác nhận, giữ sách/mục lục/đánh dấu; đồng bộ như một thay đổi. | UC-04-03 |
| FR-04-08 | Khi mở sách, quay lại ứng dụng và nối mạng, nhận tiến độ/mục lục/đánh dấu mới từ máy chủ; không ghi đè thay đổi chưa gửi. | UC-04-01, UC-04-02 |
| FR-04-06 | Phát hiện xung đột từ hai thiết bị và cho chọn vị trí giữ lại; không âm thầm lấy trang lớn nhất. | UC-04-02 |

## 6. Quy tắc nghiệp vụ
| ID | Quy tắc |
|---|---|
| BR-04-01 | Khả năng đọc ngoại tuyến là trạng thái theo thiết bị; không dùng cờ toàn cục hasLocalFile. |
| BR-04-02 | Chỉ xác nhận ngoại tuyến khi tệp và bản kê đầy đủ, đúng mã kiểm toàn vẹn. |
| BR-04-03 | Không ghi đè thay đổi đồng thời theo đồng hồ thiết bị; giữ dữ liệu cục bộ khi xung đột. |
| BR-04-04 | Xóa bộ nhớ đệm phải cảnh báo khi có thay đổi chưa đồng bộ; không xóa hàng đợi thay đổi chờ gửi âm thầm. |

## 7. Dữ liệu nghiệp vụ
Vị trí và dữ liệu cá nhân phải gắn người đọc, sách và phiên bản tệp.
Thời hạn lưu giữ và xóa theo BD-02 và quyết định #5; trạng thái ngoại tuyến theo thiết bị, không đồng nhất với máy chủ.

## 8. Màn hình
| ID | Màn hình | Tuyến dự kiến | Cách mở |
|---|---|---|---|
| SC-04-01 | Cài đặt đọc/offline | /settings | Trình đơn Cài đặt |
| SC-04-03 | Dữ liệu chờ gửi cách ly | /settings/pending-data | Thông báo sách xóa hoặc Thiết lập → Dữ liệu chờ gửi |
| SC-04-02 | Xung đột đồng bộ | /reader/:bookId (hộp thoại) | Thông báo xung đột → Xử lý |

## 9. Báo cáo và xuất dữ liệu
Không báo cáo kinh doanh hoặc xuất tệp sách đã sửa; P3 có sao chép/xuất bản cứu dữ liệu cá nhân chưa đồng bộ khi sách bị xóa, không chứa file sách.

## 10. Tích hợp
Dùng chung cơ chế xác định người đọc và quyền sở hữu; các phân hệ trao đổi qua giao diện dịch vụ tại BD-00 §5. Đọc ngoại tuyến và thử lại phải giữ trạng thái rõ ràng cho người đọc.

## 11. AI
Không có; không gửi nội dung sách tới mô hình hay nhà cung cấp ngoài.

## 12. NFR
Áp dụng RD-00 §8; phép đo và dữ liệu mẫu tại BD-M04 §13. Kiểm thử mô phỏng đạt chưa chứng minh tương thích thiết bị thật.

## 13. Tiêu chí nghiệm thu
Mỗi dòng là tình huống riêng; chưa chạy. Các mã AC cũ01..06 được giữ và làm rõ; mã bổ sung không tái sử dụng. Điều kiện chung: đúng người đọc, đúng phiên bản tệp, nguồn hợp lệ, trừ khi dòng nêu ngoại lệ.

| Mã | Yêu cầu | Cho trước | Khi | Kết quả mong đợi | Giai đoạn |
|---|---|---|---|---|---|
| AC-04-01 | FR-04-01 | Đang đọc PDF/EPUB cùng revision | Lưu rồi đóng/mở lại | Khôi phục đúng locator đã xác nhận | P1/P2 |
| AC-04-02 | FR-04-02 | Đã chọn màu/cỡ chữ trên thiết bị | Tải lại, máy chủ có settings khác | Giữ thiết lập thiết bị; không tự ghi đè từ server | P1/P2 |
| AC-04-03 | FR-04-03 | Có sách hợp lệ và đủ dung lượng | Tải hoàn chỉnh rồi kiểm trên thiết bị khác | Chỉ thiết bị đã tải có nhãn Sẵn sàng; trước commit đủ không có | P3 |
| AC-04-04 | FR-04-04 | Shell/tệp/manifest tải đủ và cache chưa bị xóa | Tắt mạng rồi restart ở tuyến đọc trực tiếp | PDF/EPUB mở không cần backend | P3 |
| AC-04-05 | FR-04-05 | Đã lưu local và request commit server, ACK mất | Reload/nối lại/gửi cùng key | Giữ queue qua reload, không nhân đôi hay mất thao tác | P3 |
| AC-04-06 | FR-04-06 | Hai thiết bị đổi tiến độ kể cả đọc lùi | Đồng bộ | Hiện hai vị trí, không tự max-page/clock; chọn local/server/Để sau | P3 |
| AC-04-07 | FR-04-07 | Có sách/tệp/mục lục/đánh dấu và tiến độ | Chọn reset rồi Hủy hoặc xác nhận | Hủy giữ nguyên; xác nhận Chưa bắt đầu, dữ liệu khác nguyên vẹn, version tăng | P1/P2 |
| AC-04-08 | FR-04-08 | PC đã lưu mới, điện thoại không pending | Mở sách/quay app/kết nối lại | Điện thoại nhận progress/toc/bookmarks mới trước chọn bản đọc | P1/P2/P3 |
| AC-04-09 | FR-04-08 | Local có pending, server version bằng base | Đồng bộ | Gửi local không cần chọn, ACK cập nhật base | P3 |
| AC-04-10 | FR-04-08 | Local có pending, server cũng đổi | Nhận snapshot | Không ghi đè pending, phân loại conflict theo resource | P3 |
| AC-04-11 | FR-04-03 | Có tệp đã tải và pending | Chọn Xóa bản tải rồi xác nhận | Chỉ bỏ bytes/cờ ready, giữ metadata/reading/outbox, server nguyên vẹn | P3 |
| AC-04-12 | FR-04-05 | Thiết bị khác đã xóa sách | Kết nối lại có pending | Cách ly trước thu hồi bytes; có xem/copy/xuất/bỏ; không tạo lại server book | P3 |
| AC-04-13 | FR-04-03 | Hết dung lượng hoặc tải dở | Tải hoặc lưu local | Không ready/không báo đã lưu giả; có cách thử lại | P3 |
| AC-04-14 | FR-04-07 | A reset offline, B đọc tiếp online | A nối lại | Conflict Chưa bắt đầu/vị trí B, không tự chọn bên nào | P3 |
| AC-04-15 | FR-04-08 | Đang nhận bản kê nhiều trang | Lỗi/TTL hết giữa lượt | Không coi id chưa nhận là sách xóa; lấy snapshot mới, giữ local | P3 |
| AC-04-16 | FR-04-05 | Có xung đột chưa chọn | Chọn Để sau rồi reload | Hai bản còn nguyên, không tự phát lại đè server | P3 |

## 14. Vấn đề cần quyết định
Không còn quyết định sản phẩm mở. Lịch sử duyệt tại management/OPEN-DECISIONS.md; thay đổi sau chốt theo CR-MANAGEMENT. Chưa xác nhận yêu cầu nào đã triển khai.

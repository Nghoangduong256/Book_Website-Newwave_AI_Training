# RD-00 — Tổng quan và quy tắc chung

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


## 1. Mục tiêu nghiệp vụ
| Mã | Mục tiêu |
|---|---|
| BO-01 | Nhập và quản lý sách PDF/EPUB cá nhân |
| BO-02 | Đọc thoải mái trên điện thoại/máy tính với sáng/tối |
| BO-03 | Điều hướng chương và tiếp tục đúng vị trí |
| BO-04 | Đọc sách đã tải khi mất mạng, giữ thay đổi chưa đồng bộ |
| BO-05 | Chuẩn bị thêm tài khoản, không gắn dữ liệu vào một người toàn cục |

## 2. Phạm vi
Theo STRATEGY §2. RD nói hành vi; BD nói cơ chế. Giá trị ghi Đề xuất chưa coi là chuẩn đã duyệt.

## 3. Người sử dụng
Người đọc cá nhân có toàn quyền thư viện của mình, chưa có đăng nhập bản đầu. Thiết bị giữ bản ngoại tuyến, không phải danh tính. Người dùng có tài khoản và người vận hành thuộc MOD-05 tương lai. Chế độ cá nhân chỉ dùng môi trường riêng tư, cụ thể theo #1.

## 4. Quy tắc chung
| Mã | Quy tắc |
|---|---|
| GBR-01 | Mọi sách/dữ liệu đọc thuộc một người; không đọc/ghi dữ liệu người khác |
| GBR-02 | Vị trí và điều hướng gắn đúng phiên bản tệp |
| GBR-03 | Mất mạng không làm mất thay đổi đã lưu thành công trên thiết bị |
| GBR-04 | Không sửa tệp gốc khi chỉnh mục lục/đánh dấu |
| GBR-05 | Bản ngoại tuyến khác bản gốc máy chủ; trạng thái theo thiết bị |
| GBR-06 | Lưu thời gian UTC, hiển thị theo múi giờ người đọc |
| GBR-07 | Chỉ báo thành công khi hoàn tất thao tác; phân biệt lưu cục bộ/đã đồng bộ |
| GBR-08 | Nội dung sách không được thực thi như chỉ dẫn hay mã ứng dụng |

## 5. Định danh tài liệu
FR: yêu cầu chức năng; BR: quy tắc nghiệp vụ; UC: tình huống sử dụng; SC: màn hình; AC: tiêu chí nghiệm thu; NFR: yêu cầu phi chức năng.
Dạng mã FR-nn-mm, BR-nn-mm, UC-nn-mm, SC-nn-mm, AC-nn-mm, NFR-00-mm. Không dùng lại mã. Tên kiểm thử giữ mã, thay dấu gạch ngang bằng gạch dưới. BD §14 đối chiếu toàn bộ FR/BR/UC/SC/AC.

## 6. Danh mục quyền
AccessPolicy giới hạn dữ liệu của người hiện tại. Chế độ cá nhân cấp cho danh tính cố định, không nhận reader_id từ yêu cầu. Tên quyền giữ nguyên để triển khai:
| Đối tượng | Thao tác |
|---|---|
| book | read, create, update, delete |
| file | read |
| import | create, read |
| navigation | read, create, update, delete |
| progress | read, update |
| settings | read, update |
| offline | manage: quản lý bản trên thiết bị, không thay quyền đọc tệp máy chủ |
API kiểm tiến trình còn hoạt động được công khai có chủ đích; API nghiệp vụ đều kiểm chính sách. Chưa có phạm vi nhóm/toàn bộ/quản trị ở bản đầu.

## 7. Trạng thái và giới hạn
Chỉ đưa sách vào thư viện sau nhập thành công. Sách lỗi không giả READY. Xóa cần xác nhận; thiết bị khác vô hiệu bản đệm khi nối máy chủ lần tới, không thu hồi bản đã tải khi còn mất mạng. Giới hạn nhập theo #3.

## 8. Yêu cầu phi chức năng và nghiệm thu đề xuất
| Mã | Mục tiêu nháp | Điều kiện và cách đo |
|---|---|---|
| NFR-00-01 | Khung không tràn ngang ở 375/768/1280px | Kiểm trình duyệt; vùng cuộn PDF sau phóng to là ngoại lệ có chủ đích |
| NFR-00-02 | Dùng Tab, tiêu điểm rõ, nhãn đầy đủ, đóng bảng trượt bằng Escape, tương phản AA | Axe và kiểm tay; không cam kết sửa nội dung sách |
| NFR-00-03 | 95% yêu cầu danh sách thông tin sách không quá 500ms | 1.000 sách, 1 người, 10 yêu cầu đồng thời, 100 lượt sau làm nóng; ghi cấu hình máy |
| NFR-00-04 | PDF văn bản 20MiB và EPUB tự dàn 5MiB mở nội dung không quá 5 giây sau nhận đủ dữ liệu | 10 lần mỗi loại trên Chrome máy tính và Safari iPhone thật; ghi thiết bị/phiên bản |
| NFR-00-05 | Khởi động lại khi mất mạng mở được sách đã tải đủ | HTTPS, service worker đã hoạt động, dữ liệu chưa bị xóa; kiểm tự động và thiết bị thật |
| NFR-00-06 | Phục hồi cơ sở dữ liệu và tệp thành công, đúng mã kiểm toàn vẹn | Diễn tập trước phát hành; chưa cam kết RPO/RTO, xem #5 |
| NFR-00-07 | Cách ly dữ liệu và an toàn tệp/URL | Hai danh tính kiểm thử, URL/ZIP độc hại mẫu |
| NFR-00-08 | Không mất hàng đợi sau tải lại trang, không âm thầm ghi đè xung đột | Kiểm hai thiết bị, lỗi dung lượng/cơ sở dữ liệu |
Đây là đề xuất, chưa phải kết quả đo. Ghi rõ phiên bản trình duyệt/thiết bị khi nghiệm thu.

## 9. AI, báo cáo và ngôn ngữ
Không có AI, báo cáo kinh doanh hay xuất tệp chỉnh sửa ở bản đầu. Tiếng Việt theo đề xuất #4, chuỗi đi qua danh mục ngôn ngữ; chưa yêu cầu thêm ngôn ngữ khác.

## 10. Quyết định mở
management/OPEN-DECISIONS.md là nguồn duy nhất. Đã chốt nhiều người dùng thuộc tương lai, không hỏi lại.

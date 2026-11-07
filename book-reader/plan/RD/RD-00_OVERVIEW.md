# RD-00 — Tổng quan và quy tắc chung

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.


## 1. Mục tiêu nghiệp vụ
| Mã | Mục tiêu |
|---|---|
| BO-01 | Nhập và quản lý sách PDF/EPUB cá nhân |
| BO-02 | Đọc thoải mái trên điện thoại/máy tính với sáng/tối |
| BO-03 | Điều hướng chương và tiếp tục đúng vị trí |
| BO-04 | Đọc sách đã tải khi mất mạng, giữ thay đổi chưa đồng bộ |
| BO-05 | Chuẩn bị thêm tài khoản, không gắn dữ liệu vào một người toàn cục |

## 2. Phạm vi
Theo STRATEGY §2. RD nói hành vi; BD nói cơ chế. Giá trị bản1.0 đã được duyệt làm mục tiêu thiết kế; số đo kiểm chứng chưa có.

## 3. Người sử dụng và môi trường
Một người đọc cá nhân dùng PC/điện thoại trong mạng nội bộ nhà, cùng máy chủ đang chạy; chưa có đăng nhập. Thiết bị là nơi giữ bản ngoại tuyến, không phải danh tính.
PC có thể dùng dây mạng, điện thoại dùng Wi-Fi nếu cùng mạng và được phép kết nối. 4G/5G, Wi-Fi ngoài nhà không truy cập trực tiếp máy chủ ở bản đầu; sách tải đủ vẫn đọc ngoại tuyến.
Chỉ cho thiết bị tin cậy kết nối. Chế độ cá nhân chưa xác thực không phân biệt người khác cùng mạng. Internet/Cloud/AWS ghi nhận ở STRATEGY §10, chưa triển khai.

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

## 7. Trạng thái, xóa và bảo toàn dữ liệu
### 7.1 Nhập và khả năng đọc
Chỉ tạo sách sau nhập thành công. Tác vụ nhập có Chờ xử lý/Đang xử lý/Hoàn tất/Thất bại; tác vụ thất bại không tạo sách trong thư viện.
Sách đã có chỉ hiện Sẵn sàng khi đọc được tệp, hoặc Không thể đọc khi tệp thiếu/hỏng. Không thể đọc không đồng nghĩa sách đã xóa; giữ metadata, tiến độ, mục lục/đánh dấu và cho thử lại/liên hệ kiểm tra lưu trữ. Bản đầu chưa thay tệp vào sách cũ.
### 7.2 Ba thao tác khác nhau
| Thao tác | Xóa gì | Giữ gì | Điều kiện và hành vi |
|---|---|---|---|
| Xóa bản tải về | Tệp nhị phân trên thiết bị hiện tại và cờ đã tải | Sách máy chủ, tiến độ, mục lục, đánh dấu, hàng đợi, thông tin cần đối soát | Báo dữ liệu chưa gửi; xác nhận chỉ bỏ tệp, không tự bỏ hàng đợi |
| Xóa sách khỏi thư viện | Đánh dấu xóa trên máy chủ, ngừng mở trực tuyến; thu hồi bản tải khi thiết bị kết nối lại | Dữ liệu đọc theo thời hạn giữ; bản cục bộ chưa gửi được cách ly | Xác nhận rõ phạm vi; có thay đổi chưa gửi thì chọn đồng bộ trước hoặc lưu cách ly rồi xóa; thất bại không giả đã xóa |
| Đặt lại tiến độ | Thay vị trí bằng trạng thái Chưa bắt đầu | Sách, tệp đã tải, mục lục và đánh dấu | Xác nhận; là thay đổi đồng bộ có phiên bản, không xóa vật lý bản ghi tiến độ |
Chọn hủy thì không thay đổi gì. Chưa hỗ trợ khôi phục sách đã xóa qua giao diện; thời hạn lưu phục vụ đối soát/xử lý vận hành, không ngầm cam kết có Thùng rác.
Thiết bị mất mạng không bị thu hồi tức thời. Khi biết sách đã xóa, không cho mở tiếp; cách ly và cho sao chép/xuất dữ liệu cá nhân chưa gửi hoặc chủ động bỏ. Không tự tạo lại sách.
Xuất này chỉ là bản cứu dữ liệu cá nhân (JSON/văn bản), không phải xuất sách sửa mục lục; thuộc phạm vi P3.
### 7.3 Giới hạn
Dung lượng và thời hạn theo #3/#5 đã duyệt.

## 8. Yêu cầu phi chức năng và nghiệm thu đã chốt
| Mã | Mục tiêu đã chốt | Điều kiện và cách đo |
|---|---|---|
| NFR-00-01 | Khung không tràn ngang ở 375/768/1280px | Kiểm trình duyệt; vùng cuộn PDF sau phóng to là ngoại lệ có chủ đích |
| NFR-00-02 | Dùng Tab, tiêu điểm rõ, nhãn đầy đủ, đóng bảng trượt bằng Escape, tương phản AA | Axe và kiểm tay; không cam kết sửa nội dung sách |
| NFR-00-03 | 95% yêu cầu danh sách thông tin sách không quá 500ms | 1.000 sách, 1 người, 10 yêu cầu đồng thời, 100 lượt sau làm nóng; ghi cấu hình máy |
| NFR-00-04 | PDF văn bản 20MiB và EPUB tự dàn 5MiB mở nội dung không quá 5 giây sau nhận đủ dữ liệu | 10 lần mỗi loại trên Chrome máy tính và Safari iPhone thật; ghi thiết bị/phiên bản |
| NFR-00-05 | Khởi động lại khi mất mạng mở được sách đã tải đủ | HTTPS, service worker đã hoạt động, dữ liệu chưa bị xóa; kiểm tự động và thiết bị thật |
| NFR-00-06 | Phục hồi cơ sở dữ liệu và tệp thành công, đúng mã kiểm toàn vẹn | Diễn tập trước phát hành; chưa cam kết RPO/RTO, xem #5 |
| NFR-00-07 | Cách ly dữ liệu và an toàn tệp/URL | Hai danh tính kiểm thử, URL/ZIP độc hại mẫu |
| NFR-00-08 | Không mất hàng đợi sau tải lại trang, không âm thầm ghi đè xung đột | Kiểm hai thiết bị, lỗi dung lượng/cơ sở dữ liệu |
Đây là mục tiêu đã duyệt, chưa phải kết quả đo. Ghi rõ phiên bản trình duyệt/thiết bị khi nghiệm thu.

## 9. AI, báo cáo và ngôn ngữ
Không có AI, báo cáo kinh doanh hay xuất tệp chỉnh sửa ở bản đầu. Tiếng Việt theo #4 đã duyệt, chuỗi đi qua danh mục ngôn ngữ; chưa yêu cầu thêm ngôn ngữ khác.

## 10. Quyết định mở
management/OPEN-DECISIONS.md là nguồn duy nhất. Đã chốt nhiều người dùng thuộc tương lai, không hỏi lại.

## 11. Ma trận định dạng đã chốt
PDF thường và PDF quét ảnh đọc được; bản quét không hứa tìm chữ/OCR. EPUB2/3 tự dàn nội dung không DRM được hỗ trợ. PDF mật khẩu, EPUB có DRM và EPUB bố cục cố định bị từ chối với thông báo chưa hỗ trợ; dữ liệu điều hướng tệp gốc không bị sửa.

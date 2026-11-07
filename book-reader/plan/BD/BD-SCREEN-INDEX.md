# Danh mục màn hình

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.


| Mã | Màn hình | Tuyến | Cách mở | Giai đoạn |
|---|---|---|---|---|
| SC-01-01 | Thư viện | / | Trình đơn chính | P1 |
| SC-01-02 | Nhập sách | /books/import | Thư viện → Thêm sách | P1 |
| SC-01-03 | Chi tiết/sửa | /books/:id | Thẻ sách → Chi tiết | P1 |
| SC-02-01 | Bộ đọc | /reader/:bookId | Thẻ sách → Đọc | P1/P2 |
| SC-03-01 | Bảng mục lục/đánh dấu | Bảng trong bộ đọc | Thanh công cụ | P2 |
| SC-04-01 | Thiết lập/ngoại tuyến | /settings | Trình đơn chính | P3; điều khiển màu có trước |
| SC-04-03 | Dữ liệu chờ gửi cách ly | /settings/pending-data | Thiết lập hoặc thông báo sách xóa | P3 |
| SC-04-02 | Hộp thoại xung đột | Hộp thoại trong bộ đọc | Thông báo đồng bộ → Xử lý | P3 |
Lựa chọn sách trùng nằm trong Nhập sách: Mở sách đã có/Vẫn nhập/Hủy. Cảnh báo xóa sách ở Chi tiết/Thư viện; reset nằm trong thiết lập của bộ đọc, có trước P3. Xung đột gồm tiến độ/đánh dấu/cây, có Để sau. Trạng thái tác vụ nằm trong Nhập sách, không có màn hình ẩn. Bộ đọc có nút về thư viện. Trạng thái chung theo BD-01; chưa có màn hình đăng nhập bản đầu.

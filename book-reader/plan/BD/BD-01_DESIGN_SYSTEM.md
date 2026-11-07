# BD-01 — Quy chuẩn giao diện

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.


## 1. Giá trị thiết kế dùng chung
theme.css quản lý màu nền/bề mặt/chữ/chữ phụ/viền/điểm nhấn/lỗi/tiêu điểm, khoảng cách, bo góc, kiểu chữ và thời gian hiệu ứng cho sáng/tối. Thành phần không viết màu trực tiếp.
Mặc định theo hệ điều hành; lựa chọn người dùng lưu trên thiết bị. Chỉ đổi màu ảnh trong PDF khi chủ động bật bộ lọc đọc đêm.

## 2. Bố cục
Kiểm ở 375px điện thoại, 768px máy tính bảng, 1280px máy tính; đây không phải danh sách trình duyệt hỗ trợ. Lưới sách không vượt khung; biểu mẫu điện thoại một cột; thanh công cụ xuống dòng hoặc dùng trình đơn gọn có nhãn.
Bộ đọc dùng chiều cao khung nhìn động, vùng an toàn màn hình và min-width:0. Máy tính có thanh bên; điện thoại có bảng trượt. Chỉ cuộn ngang trong vùng xem khi phóng to.

## 3. Thành phần
Button/IconButton có tên cho công cụ hỗ trợ; Input/Select có nhãn/lỗi; Dialog/Drawer giữ tiêu điểm, đóng Escape và trả tiêu điểm. Thành phần dùng chung gồm EmptyState, RetryError, Loading, OfflineBadge, SyncStatus, ConflictDialog.
Không dùng biểu tượng thiếu nhãn. Sắp xếp được bằng bàn phím, không chỉ kéo thả.

## 4. Trạng thái màn hình
Khung chờ khi tải; trống có nút hành động; lỗi có thử lại và giữ dữ liệu cũ hợp lệ; thiếu quyền/không tìm thấy không lộ tên sách.
Tác vụ phân biệt chờ/đang xử lý/hoàn tất/thất bại; dữ liệu cục bộ phân biệt chờ đồng bộ/đã đồng bộ/xung đột. Không hiển thị tiến độ giả hay chi tiết công nghệ không giúp người dùng quyết định.

## 5. Điều khiển đọc
PDF có vừa khung/chọn trang/phóng to, giới hạn số trang nhập. EPUB có cỡ chữ/giãn dòng/lề. Dùng chung mục lục/đánh dấu/thiết lập.
Đổi sáng/tối giữ vị trí. Tách mục lục gốc/cá nhân; không ghi mục cá nhân là đã nhúng vào tệp.

## 6. Khả năng tiếp cận và ngôn ngữ
Theo RD-00 §8. Dùng danh mục tiếng Việt ở bản đầu, có dự phòng rõ ràng; không hiện khóa chuỗi thô. Kiểm nhãn/tiêu điểm/bàn phím/tương phản cả sáng/tối. Không coi chất lượng giao diện là cam kết khắc phục khả năng tiếp cận của PDF quét ảnh.

## 7. Xác nhận và lựa chọn đã chốt
Sách trùng: nêu tên sách đã có, các nút Mở sách đã có/Vẫn nhập/Hủy; không mặc định tự tạo hay gộp.
Xóa sách: thông báo ngừng mở trên các thiết bị sau đồng bộ, tách khỏi Xóa bản tải về. Có pending thì Đồng bộ rồi xóa/Lưu dữ liệu riêng rồi xóa/Hủy; phần lưu riêng chỉ có P3. Lỗi giữ nội dung và chưa chuyển màn hình như đã xóa.
Reset: thông báo chỉ đặt lại vị trí, giữ sách/mục lục/đánh dấu; Hủy/Đặt lại.
Conflict: hiển thị tên sách và hai vị trí/nội dung, không chỉ số version; có Dùng thiết bị/Dùng máy chủ/Để sau. Khi một bản là xóa/reset phải thể hiện rõ. Chọn bản máy chủ xác nhận bỏ local liên quan.
Dữ liệu cách ly có danh sách theo sách, ngày lưu, xem chi tiết, sao chép/xuất JSON và bỏ sau xác nhận. Màn hình chưa có dữ liệu có giải thích; không gọi đây là khôi phục sách.

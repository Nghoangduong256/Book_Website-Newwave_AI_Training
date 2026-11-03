# BD-01 — Quy chuẩn giao diện

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


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
Theo RD-00 §8. Đề xuất danh mục tiếng Việt ở bản đầu, có dự phòng rõ ràng; không hiện khóa chuỗi thô. Kiểm nhãn/tiêu điểm/bàn phím/tương phản cả sáng/tối. Không coi chất lượng giao diện là cam kết khắc phục khả năng tiếp cận của PDF quét ảnh.

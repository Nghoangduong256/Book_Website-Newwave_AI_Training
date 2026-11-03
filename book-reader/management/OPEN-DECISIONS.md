# Các quyết định còn mở

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


Quyết định đã chốt ở STRATEGY §7. Không hỏi lại bộ công nghệ hoặc hướng cá nhân trước. Đề xuất cho phép viết nháp, chưa đồng nghĩa đã duyệt hay đã triển khai.

| # | Câu hỏi và khuyến nghị | Công việc cần câu trả lời | Trả lời |
|---|---|---|---|
| 1 | Môi trường sử dụng? Đề xuất máy chủ riêng; máy tính truy cập loopback; điện thoại dùng HTTPS trong mạng/đường hầm có kiểm soát. Chế độ cá nhân chưa đăng nhập nên người truy cập được máy chủ có toàn quyền. | Triển khai và nghiệm thu điện thoại, không chặn tài liệu nháp | Chưa xác nhận |
| 2 | Lưu tệp bản đầu? Đề xuất vùng ổ đĩa máy chủ qua StoragePort; chuyển S3 sau. | Triển khai lưu trữ | Chưa xác nhận |
| 3 | Giới hạn nhập? Đề xuất 100MiB/tệp; EPUB giải nén tối đa 300MiB/5.000 mục, tỷ lệ nén 100:1; URL 120 giây/lần, ba chuyển hướng, hai tác vụ đồng thời; mục lục 500 mục/5 cấp. | Kiểm dữ liệu/tải trước phát hành; thử nghiệm có thể buộc giảm | Chưa xác nhận |
| 4 | Ngôn ngữ giao diện? Đề xuất tiếng Việt bản đầu, danh mục chuỗi có thể mở rộng. | Chốt danh mục ngôn ngữ | Chưa xác nhận |
| 5 | Dữ liệu cũ/sao lưu? Đề xuất không tự chuyển; chạy thử không ghi khi cần; sao lưu cơ sở dữ liệu+tệp mỗi ngày/giữ 7 bản; dấu xóa 30 ngày. | Chuyển dữ liệu, xóa vật lý và phát hành; không chặn tài liệu mới | Chưa xác nhận |
| 6 | EPUB bản đầu? Đề xuất EPUB2/3 tự dàn nội dung không DRM; bố cục cố định để sau thử nghiệm. PDF có mật khẩu chưa hỗ trợ. | Chốt tiêu chí nghiệm thu định dạng | Chưa xác nhận |
| 7 | Đồng bộ nhiều thiết bị của cùng người? Đề xuất có khi dùng chung máy chủ; xung đột chọn bản cục bộ/máy chủ, không tự lấy trang lớn nhất. | Chốt trải nghiệm đồng bộ | Chưa xác nhận |

Thông số kỹ thuật như thời gian gom thay đổi/thử lại cần ghi trong BD/cấu hình, không âm thầm biến thành quyết định nghiệp vụ. Giới hạn đề xuất chưa được hiển thị như hạn mức đã cam kết trước rà soát.

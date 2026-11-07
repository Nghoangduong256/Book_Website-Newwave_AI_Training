# Quyết định dự án

Phiên bản: 1.0 · Ngày: 2026-11-07 · Trạng thái: Đã xác nhận bởi chủ dự án.


## 1. Còn mở
Không còn quyết định sản phẩm đang mở tại mốc1.0. Các mục #2..#5 được chủ dự án chấp nhận theo đề xuất ngày2026-11-07. Số mục được giữ để truy vết, không đánh lại số.

## 2. Đã trả lời
| # | Nội dung | Quyết định | Người xác nhận/ngày |
|---|---|---|---|
| 1 | Môi trường | Chỉ mạng nhà; Internet/Cloud/AWS xem xét sau, chưa chọn dịch vụ | Chủ dự án,2026-11-07 |
| 2 | Lưu tệp | Ổ đĩa máy chủ qua StoragePort; chưa triển khai S3 | Chủ dự án,2026-11-07 |
| 3 | Giới hạn nhập | 100MiB/tệp (104.857.600byte, khoảng104,9MB); EPUB giải nén tối đa300MiB/5.000mục/tỷ lệ100:1; URL120giây/lần,3chuyển hướng,2tác vụ đồng thời; mục lục500mục/5cấp; cấu hình được | Chủ dự án,2026-11-07 |
| 4 | Ngôn ngữ sản phẩm | Tiếng Việt bản đầu; tên công nghệ/định danh kỹ thuật giữ khi cần | Chủ dự án,2026-11-07 |
| 5 | Dữ liệu cũ và bảo vệ dữ liệu | Không tự chuyển dữ liệu cũ; thư viện mới. Sao lưu DB+tệp mỗi ngày, giữ7bản tại thiết bị/vị trí tách ổ gốc. Giữ dấu xóa30ngày để đối soát; không cam kết Thùng rác/khôi phục qua UI | Chủ dự án,2026-11-07 |
| 6 | Định dạng | PDF thường/quét ảnh, EPUB2/3 tự dàn không DRM; không PDF mật khẩu/EPUB cố định bản đầu | Chủ dự án,2026-11-07 |
| 7 | Đồng bộ | Hai chiều cùng thư viện cá nhân; chọn bản khi xung đột, không tự lấy trang lớn nhất | Chủ dự án,2026-11-07 |
| 8 | Xóa/reset | Tách xóa bản tải/xóa sách/reset; giữ thay đổi chưa gửi | Chủ dự án,2026-11-07 |
| 9 | Trạng thái và ngoại lệ | Tạo book chỉ sau nhập thành công; tách job/file availability, sách trùng có lựa chọn | Chủ dự án,2026-11-07 |
| 10 | Nghiệm thu | Chi tiết API/ngoại lệ, nhiều AC/FR; FR-03-06 ở P3 | Chủ dự án,2026-11-07 |
| 11 | Chốt tài liệu | Chủ dự án đã rà soát và duyệt bộ hiện hành thành chuẩn1.0 | Chủ dự án,2026-11-07 |

## 3. Công việc triển khai, không phải quyết định mở
Đường dẫn ổ sách, vị trí sao lưu khác ổ gốc, chứng chỉ HTTPS nội bộ, phiên bản công cụ và số đo được chọn/kiểm trong P0 hoặc trước phát hành theo [sổ mốc chuẩn](BASELINE-REGISTER.md). Không ghi đã kiểm chứng khi chưa chạy.
Nếu kết quả đo đòi thay phạm vi/hành vi/giới hạn đã duyệt, tạo CR và ADR khi cần; không tự mở lại câu hỏi đã chốt. Không tự mua hạ tầng Cloud.

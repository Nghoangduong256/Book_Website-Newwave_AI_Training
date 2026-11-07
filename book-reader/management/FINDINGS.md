# Các vấn đề phát hiện

Bản ghi phát hiện · Cập nhật2026-11-07 · Tham chiếu chuẩn tài liệu1.0.


| Mã | Phát hiện | Bằng chứng | Xử lý |
|---|---|---|---|
| F-P0-01 | Dự án cũ thiếu pdfStore nhưng còn nhập mô-đun | Test-Path trả False; ReaderPage/ManageBooksPage | Không sửa bản cũ; thiết kế lưu trữ mới |
| F-P0-02 | Chưa ưu tiên đọc ngoại tuyến đầy đủ | ReaderPage gọi booksApi trước dữ liệu cục bộ | BD-M02/M04 |
| F-P0-03 | Hướng dẫn/cấu hình mẫu vẫn Python/Next/Postgres | Dockerfiles/CLAUDE/skills/STACK | Chuyển đồng bộ trước P0; chưa xong |
| F-P0-04 | Lệnh cập nhật dữ liệu cũ và mô hình Java chưa khớp | Có cột tiến độ trong SQL nhưng chưa có trong Book | Không chạy lệnh cũ vào cơ sở dữ liệu mới; dùng BD-02 |
| F-P0-05 | Lệnh khởi động mẫu chỉ gọi hàm tạo | source code/Makefile | Phải chạy tiến trình và gọi HTTP; BD-05 |
Chưa có lỗi nào được coi là đã tái hiện lúc chạy hay đã sửa bằng mã nguồn.

## Rà soát và xử lý đặc tả ngày 2026-11-07
| Mã | Nhận xét | Tài liệu xử lý | Trạng thái |
|---|---|---|---|
| F-RD-01 | Thiếu chiều nhận dữ liệu đọc từ thiết bị khác | BD-M04 §4/§6, BD-06 §5 | Đã bổ sung thiết kế; chưa kiểm thực thi |
| F-RD-02 | Xóa cache và giữ pending chưa nhất quán | RD-00 §7, BD-M01 §6.4, BD-M04 §6.5 | Đã thống nhất; chưa triển khai |
| F-RD-03 | MOD-03 toàn bộ P2 nhưng offline P3 | STRATEGY §6, RD-03 §1.1/§13 | FR-03-06 ở P3 |
| F-RD-04 | Quyết định môi trường/định dạng/sync mở | STRATEGY §7, OPEN-DECISIONS | Đã ghi câu trả lời; #2/#3/#4/#5 vẫn mở |
| F-RD-05 | READY sách không có trong schema | BD-02, BD-M01 §3/§6 | Book chỉ tạo khi xong; availability riêng |
| F-RD-06 | API thiếu trường/lỗi/mặc định | BD-06 | Đã định nghĩa; cần OpenAPI và kiểm tương thích khi triển khai |
| F-RD-07 | AC bao phủ sơ lược | RD-01..04 §13, BD-M01..04 §14 | 59 kịch bản dự kiến; chưa chạy |
| F-RD-08 | UC/ngoại lệ/màn hình thiếu | RD §4, BD-01 §7, SCREEN-INDEX | Đã bổ sung; cần rà soát bản0.3 |
Đây là xử lý nhận xét tài liệu, không ghi các phát hiện trên là lỗi code đã sửa.

## Chốt ngày2026-11-07
Bộ đặc tả đã được chủ dự án duyệt1.0, quyết định #2..#5 đã đóng. Các việc chuyển cấu hình và kiểm chứng runtime vẫn mở tới khi thực hiện; không tự đóng lỗi kỹ thuật chỉ vì tài liệu được duyệt.

# Các vấn đề phát hiện

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


| Mã | Phát hiện | Bằng chứng | Xử lý |
|---|---|---|---|
| F-P0-01 | Dự án cũ thiếu pdfStore nhưng còn nhập mô-đun | Test-Path trả False; ReaderPage/ManageBooksPage | Không sửa bản cũ; thiết kế lưu trữ mới |
| F-P0-02 | Chưa ưu tiên đọc ngoại tuyến đầy đủ | ReaderPage gọi booksApi trước dữ liệu cục bộ | BD-M02/M04 |
| F-P0-03 | Hướng dẫn/cấu hình mẫu vẫn Python/Next/Postgres | Dockerfiles/CLAUDE/skills/STACK | Chuyển đồng bộ trước P0; chưa xong |
| F-P0-04 | Lệnh cập nhật dữ liệu cũ và mô hình Java chưa khớp | Có cột tiến độ trong SQL nhưng chưa có trong Book | Không chạy lệnh cũ vào cơ sở dữ liệu mới; dùng BD-02 |
| F-P0-05 | Lệnh khởi động mẫu chỉ gọi hàm tạo | source code/Makefile | Phải chạy tiến trình và gọi HTTP; BD-05 |
Chưa có lỗi nào được coi là đã tái hiện lúc chạy hay đã sửa bằng mã nguồn.

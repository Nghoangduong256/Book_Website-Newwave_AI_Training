# Tiến độ

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


## Tình trạng hiện tại
| Nội dung | Trạng thái |
|---|---|
| Nhánh | chore/book-reader-baseline |
| Giai đoạn | Phân tích và bản nháp RD/BD |
| Đã hoàn thành | Phân tích nguồn cũ, thiết kế đúng công nghệ, bốn phân hệ bản đầu và ranh giới tài khoản tương lai |
| Bước tiếp theo | Rà soát quyết định mở; thử nghiệm bộ đọc/lưu trữ/bảo mật; chuyển hướng dẫn/cấu hình mẫu; viết kế hoạch từng giai đoạn |
| Còn lại | Duyệt chuẩn, chuyển mẫu đầy đủ, kiểm phiên bản, kế hoạch, mã nguồn và kiểm chứng thực thi |
| Vướng mắc | Không chặn tài liệu; môi trường/lưu trữ/giới hạn cần rà soát trước triển khai |

## 2026-11-03 — Phân tích và thiết kế nháp
Đọc lại bộ đọc PDF, mô hình Book, khai báo thư viện và POM, xác nhận thiếu pdfStore. Đối chiếu tài liệu chính thức theo phân tích §7.
RD-01..04 và BD-M01..04 có 24 yêu cầu chức năng,16 quy tắc,24 tiêu chí nghiệm thu với tên kiểm thử dự kiến. Tài khoản mới có giao diện tích hợp tương lai.
Lần kiểm tra trước:27 tài liệu,22 liên kết nội bộ, không lỗi đối chiếu; git diff --check trả0. Chưa chạy biên dịch, kiểm thử ứng dụng, cập nhật cơ sở dữ liệu hoặc trình duyệt. F-P0-03 vẫn mở, chưa chốt chuẩn hay tạo yêu cầu thay đổi.

## 2026-11-03 — Thống nhất ngôn ngữ
Theo yêu cầu người dùng, viết lại tiêu đề và lời giải thích bằng tiếng Việt; chỉ giữ tên công nghệ, định danh, mã yêu cầu, đường dẫn và lệnh cần thiết. Bổ sung bảng thuật ngữ và quy ước ngôn ngữ trong AGENTS/README.
Chỉnh 27 tài liệu đã soạn và AGENTS; không dịch các mẫu kỹ thuật kế thừa chưa dùng. Kiểm lại mã FR/BR/UC/SC/AC, đường dẫn API, tên kiểm thử và liên kết trước bàn giao. Chưa thay phạm vi hay trạng thái duyệt; chưa sửa mã ứng dụng.

Kết quả rà soát ngôn ngữ: 28 tài liệu/hướng dẫn có nội dung đúng bản chuẩn bị; 22 liên kết nội bộ hợp lệ; giữ 24 FR, 16 BR, 24 AC cùng mã UC/SC và bảng đối chiếu; không lỗi số mục RD/BD. Đây là kiểm tra tài liệu, không phải kiểm thử ứng dụng.

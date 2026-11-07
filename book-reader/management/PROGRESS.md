# Tiến độ

Bản ghi tiến độ · Cập nhật2026-11-07 · Mốc tài liệu hiện hành:1.0 đã duyệt.


## Tình trạng hiện tại
| Nội dung | Trạng thái |
|---|---|
| Nhánh | chore/book-reader-baseline |
| Giai đoạn | Đã chốt RD/BD1.0, chuẩn bị kế hoạch triển khai P0 |
| Đã hoàn thành | Phân tích nguồn cũ, thiết kế đúng công nghệ, bốn phân hệ bản đầu và ranh giới tài khoản tương lai |
| Quyết định mới | D4..D9: mạng nhà, phạm vi định dạng, sync/xóa/trạng thái/API/nghiệm thu đã chốt |
| Bước tiếp theo | Viết kế hoạch P0 và chuyển khung kỹ thuật; xác minh công cụ theo BASELINE-REGISTER |
| Còn lại | Cấu hình/mẫu kỹ thuật, pin phiên bản, kế hoạch, mã và kiểm chứng thực thi |
| Vướng mắc | Không còn quyết định sản phẩm mở; việc xác minh kỹ thuật có phụ trách/giai đoạn tại BASELINE-REGISTER |

## 2026-11-03 — Phân tích và thiết kế nháp
Đọc lại bộ đọc PDF, mô hình Book, khai báo thư viện và POM, xác nhận thiếu pdfStore. Đối chiếu tài liệu chính thức theo phân tích §7.
RD-01..04 và BD-M01..04 có 24 yêu cầu chức năng,16 quy tắc,24 tiêu chí nghiệm thu với tên kiểm thử dự kiến. Tài khoản mới có giao diện tích hợp tương lai.
Lần kiểm tra trước:27 tài liệu,22 liên kết nội bộ, không lỗi đối chiếu; git diff --check trả0. Chưa chạy biên dịch, kiểm thử ứng dụng, cập nhật cơ sở dữ liệu hoặc trình duyệt. F-P0-03 vẫn mở, chưa chốt chuẩn hay tạo yêu cầu thay đổi.

## 2026-11-03 — Thống nhất ngôn ngữ
Theo yêu cầu người dùng, viết lại tiêu đề và lời giải thích bằng tiếng Việt; chỉ giữ tên công nghệ, định danh, mã yêu cầu, đường dẫn và lệnh cần thiết. Bổ sung bảng thuật ngữ và quy ước ngôn ngữ trong AGENTS/README.
Chỉnh 27 tài liệu đã soạn và AGENTS; không dịch các mẫu kỹ thuật kế thừa chưa dùng. Kiểm lại mã FR/BR/UC/SC/AC, đường dẫn API, tên kiểm thử và liên kết trước bàn giao. Chưa thay phạm vi hay trạng thái duyệt; chưa sửa mã ứng dụng.

Kết quả rà soát ngôn ngữ: 28 tài liệu/hướng dẫn có nội dung đúng bản chuẩn bị; 22 liên kết nội bộ hợp lệ; giữ 24 FR, 16 BR, 24 AC cùng mã UC/SC và bảng đối chiếu; không lỗi số mục RD/BD. Đây là kiểm tra tài liệu, không phải kiểm thử ứng dụng.

## 2026-11-07 — Cập nhật sau rà soát BA
Chủ dự án xác nhận dùng mạng nội bộ trong nhà; Internet/Cloud, có thể AWS, xem xét sau, chưa chọn dịch vụ hoặc mua tài nguyên. Đồng ý đề xuất đồng bộ hai chiều, ba thao tác xóa/reset, trạng thái nhập/tệp, chi tiết API/ngoại lệ và tiêu chí nghiệm thu.
Cập nhật STRATEGY, RD-00..04, BD chung/phân hệ, màn hình và quyết định. Thêm BD-06 hợp đồng API và bản chụp nhận đồng bộ nhất quán. Dự kiến27 FR,18 BR,59 AC; giữ mã cũ và bổ sung mã mới. FR-03-06 về P3, P2 chỉ phần trực tuyến.
Giữ bản nháp tổng thể vì thông số/tài liệu kỹ thuật chưa chốt hoàn toàn; không tự gắn Approved/Baselined toàn bộ hoặc tạo CR cho tài liệu chưa baseline.
Chưa sửa mã ứng dụng, chưa chạy app/DB/browser. Đã giữ phần định dạng người dùng sửa trong BD-05, chỉ thay nội dung liên quan và thêm mục7. Chưa commit/push đợt này.

Kết quả kiểm tra tài liệu ngày 2026-11-07: 25 tài liệu thay đổi/thêm; 27 FR, 18 BR, 59 AC; 24 liên kết Markdown nội bộ hợp lệ; không mã trùng, không thiếu liên kết FR/BR/AC/UC/SC sang BD, số mục RD/BD đúng cấu trúc. git diff --check trả0, chỉ cảnh báo chuẩn hóa LF/CRLF. Không coi kết quả này là ứng dụng đã chạy hoặc kiểm thử nghiệm thu đã đạt.

## 2026-11-07 — Chốt chuẩn tài liệu1.0
Chủ dự án chấp nhận năm phần giải thích (bốn mục #2..#5, trong đó #5 tách chuyển dữ liệu và sao lưu) và duyệt bộ tài liệu hiện hành. Đóng quyết định còn mở, nâng STRATEGY/RD/BD/phân tích/thuật ngữ/lựa chọn công nghệ lên1.0. Sổ BASELINE-REGISTER xác định chính xác phạm vi, công việc kỹ thuật hoãn và cách quản lý thay đổi.
Không tự tạo CR cho mốc duyệt ban đầu. Thay hành vi sau mốc qua CR; mẫu tham khảo và mã/cấu hình chưa hoàn thiện không được đóng thành đạt. Chưa commit/push và chưa chạy app/tests/migration ở đợt này.

# RD-03 — Mục lục và đánh dấu

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

Yêu cầu/thiết kế đã được chủ dự án duyệt; chưa phải tính năng đã triển khai. Lịch sử quyết định xem management/OPEN-DECISIONS.md.

Phân hệ: MOD-03 · Giai đoạn: P2 trực tuyến; P3 ngoại tuyến · Mục tiêu: BO-03

## 1. Mục đích và phạm vi
Đọc mục lục gốc, tạo mục lục cá nhân phân cấp và đánh dấu theo vị trí; không viết lại tệp sách.
Ngoài phạm vi: STRATEGY §2; không thêm tính năng AI. Phụ thuộc RD-00, các phân hệ qua giao diện tích hợp BD-00.

### 1.1 Phân bổ nghiệm thu
P2 FR-03-01..05 trực tuyến; P3 FR-03-06 và các kịch bản xung đột/ngoại tuyến. Không yêu cầu P2 đạt toàn phân hệ.
Giai đoạn của từng kịch bản tại §13; ghi P1/P2 nghĩa cùng hành vi cần nghiệm thu cho PDF ở P1 và EPUB ở P2, không phải được tùy chọn bỏ một.

## 2. Người sử dụng và quyền
Người đọc cá nhân, chỉ truy cập dữ liệu của mình theo RD-00 §6. Chưa triển khai nhiều tài khoản; không nhận chủ sở hữu do người gọi tự chọn.

## 3. Thuật ngữ
Sách là mục thư viện; phiên bản tệp là nội dung bất biến; định danh vị trí trỏ vào nội dung của phiên bản đó; bản ngoại tuyến nằm trên thiết bị. Thuật ngữ xem references/GLOSSARY.md.

## 4. Tình huống sử dụng
### UC-03-01 — Mục lục gốc
Tại bộ đọc → mở Mục lục gốc → chọn mục → đến đích. Không có mục lục hiển thị trạng thái trống, gợi ý tạo mục cá nhân. Đích hỏng báo không mở được, giữ vị trí đọc.
### UC-03-02 — Mục lục cá nhân và đánh dấu
Tại vị trí hiện tại → tạo tên/mục cha tùy chọn → kiểm hợp lệ → lưu → điều hướng lại. Cho sửa tên/cha/thứ tự, tạo/sửa/xóa đánh dấu.
Cha còn con bị chặn xóa, phải chuyển/xóa con trước; Hủy không đổi cây. Xóa cả cha và con trong một thao tác vẫn bị chặn.
P2 trực tuyến: lỗi mạng giữ biểu mẫu, không hứa bền vững qua đóng trang. P3 ngoại tuyến: lưu thiết bị và hàng đợi, đóng/mở lại còn dữ liệu, nối mạng nhận/gửi theo MOD-04.
Hai đánh dấu tạo độc lập giữ cả hai; cùng mục bị sửa/xóa hai phía cho chọn bản; cây xung đột chọn toàn bản hoặc Để sau. Không sửa file sách gốc.

## 5. Yêu cầu chức năng
| ID | Yêu cầu bắt buộc | Tình huống sử dụng |
|---|---|---|
| FR-03-01 | Hiển thị mục lục gốc PDF/EPUB nếu có, có trạng thái chưa có mục lục. | UC-03-01 |
| FR-03-02 | Tạo mục lục cá nhân tại vị trí hiện tại, có tên và mục cha. | UC-03-02 |
| FR-03-03 | Sửa tên, đổi cha, sắp xếp và xóa mục lục cá nhân. | UC-03-02 |
| FR-03-04 | Tạo/sửa/xóa đánh dấu và điều hướng từ danh sách đánh dấu. | UC-03-02 |
| FR-03-05 | Phân biệt mục lục gốc với cá nhân, đồng bộ cá nhân khi trực tuyến. | UC-03-02 |
| FR-03-06 | Sách đã tải ngoại tuyến vẫn dùng mục lục, tạo và sửa mục cá nhân rồi đồng bộ lại. | UC-03-02 |

## 6. Quy tắc nghiệp vụ
| ID | Quy tắc |
|---|---|
| BR-03-01 | Mục lục gốc chỉ đọc; mục cá nhân thuộc người đọc và đúng phiên bản tệp. |
| BR-03-02 | Cây mục lục không có chu trình; cha và con cùng sách/người đọc. |
| BR-03-03 | Xóa mục cha có con bị chặn; cần chuyển/xóa con trước. |
| BR-03-05 | Hai đánh dấu mới khác mã giữ cả hai; cùng đánh dấu bị sửa/xóa hai phía phải chọn, cây mục lục xung đột chọn toàn cây. |
| BR-03-04 | Chỉnh điều hướng không ghi vào tệp gốc. |

## 7. Dữ liệu nghiệp vụ
Vị trí và dữ liệu cá nhân phải gắn người đọc, sách và phiên bản tệp.
Thời hạn lưu giữ và xóa theo BD-02 và quyết định #5; trạng thái ngoại tuyến theo thiết bị, không đồng nhất với máy chủ.

## 8. Màn hình
| ID | Màn hình | Tuyến dự kiến | Cách mở |
|---|---|---|---|
| SC-03-01 | Panel mục lục/bookmark | /reader/:bookId (bảng) | Thanh công cụ Mục lục/Đánh dấu |

## 9. Báo cáo và xuất dữ liệu
Không báo cáo kinh doanh hoặc xuất tệp sách đã sửa; P3 có sao chép/xuất bản cứu dữ liệu cá nhân chưa đồng bộ khi sách bị xóa, không chứa file sách.

## 10. Tích hợp
Dùng chung cơ chế xác định người đọc và quyền sở hữu; các phân hệ trao đổi qua giao diện dịch vụ tại BD-00 §5. Đọc ngoại tuyến và thử lại phải giữ trạng thái rõ ràng cho người đọc.

## 11. AI
Không có; không gửi nội dung sách tới mô hình hay nhà cung cấp ngoài.

## 12. NFR
Áp dụng RD-00 §8; phép đo và dữ liệu mẫu tại BD-M03 §13. Kiểm thử mô phỏng đạt chưa chứng minh tương thích thiết bị thật.

## 13. Tiêu chí nghiệm thu
Mỗi dòng là tình huống riêng; chưa chạy. Các mã AC cũ01..06 được giữ và làm rõ; mã bổ sung không tái sử dụng. Điều kiện chung: đúng người đọc, đúng phiên bản tệp, nguồn hợp lệ, trừ khi dòng nêu ngoại lệ.

| Mã | Yêu cầu | Cho trước | Khi | Kết quả mong đợi | Giai đoạn |
|---|---|---|---|---|---|
| AC-03-01 | FR-03-01 | Sách có/không mục lục gốc | Mở bảng mục lục | Có thì liệt kê/đi đúng; không có hiện trống và gợi ý tạo cá nhân | P2 |
| AC-03-02 | FR-03-02 | Đang tại vị trí hợp lệ | Tạo mục cá nhân có tên/cha | Lưu đúng sách/reader/revision và mở lại đến đúng chỗ | P2 |
| AC-03-03 | FR-03-03 | Cây có các mục | Sửa tên/đổi cha/sắp xếp và tải lại | Thứ tự/cha/tên đúng, không tạo chu trình | P2 |
| AC-03-04 | FR-03-04 | Có vị trí đọc | Tạo/sửa/xóa đánh dấu | Các thao tác lưu đúng, danh sách điều hướng đúng, xóa ẩn mục | P2 |
| AC-03-05 | FR-03-05 | Có mục lục gốc và cá nhân | Chọn tab/sửa mục | Phân biệt rõ; không cho sửa nhầm mục gốc; trực tuyến nhận được bản cá nhân mới | P2 |
| AC-03-06 | FR-03-06 | Sách tải đủ, mất mạng | Tạo/sửa mục cá nhân/đánh dấu, đóng/mở lại rồi nối mạng | Dữ liệu local tồn tại, gửi/nhận không nhân đôi | P3 |
| AC-03-07 | FR-03-03 | Mục A có con B | Cho A làm con B hoặc cha khác sách | Từ chối, cây cũ nguyên vẹn | P2 |
| AC-03-08 | FR-03-03 | Cha còn con | Xóa cha hoặc gửi cây bỏ cả cha/con một lần | 422, yêu cầu chuyển/xóa con trước; Hủy không đổi cây | P2 |
| AC-03-09 | FR-03-04 | Hai thiết bị tạo hai đánh dấu UUID khác | Đồng bộ | Giữ cả hai, kể cả cùng vị trí | P3 |
| AC-03-10 | FR-03-04 | Hai thiết bị sửa cùng đánh dấu, hoặc một sửa một xóa | Đồng bộ rồi chọn/Để sau | Hiện hai bản; giữ theo lựa chọn hoặc giữ xung đột, không tự hồi sinh | P3 |
| AC-03-11 | FR-03-03 | Hai thiết bị sửa cùng cây | Đồng bộ và chọn bản | Chọn toàn cây, không trộn; Để sau giữ cả hai qua reload | P3 |
| AC-03-12 | FR-03-02 | Biết checksum file trước tạo/sửa mục lục | Thực hiện CRUD điều hướng | Checksum file gốc không đổi | P2 |
| AC-03-13 | FR-03-01 | Mục gốc có đích hỏng | Chọn đích | Báo không đến được, giữ vị trí, không crash | P2 |
| AC-03-14 | FR-03-04 | Đánh dấu gửi thành công nhưng ACK mất | Thử lại cùng khóa | Không thêm mục trùng hay báo conflict giả | P3 |

## 14. Vấn đề cần quyết định
Không còn quyết định sản phẩm mở. Lịch sử duyệt tại management/OPEN-DECISIONS.md; thay đổi sau chốt theo CR-MANAGEMENT. Chưa xác nhận yêu cầu nào đã triển khai.

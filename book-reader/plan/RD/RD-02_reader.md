# RD-02 — Trình đọc PDF và EPUB

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

Yêu cầu/thiết kế đã được chủ dự án duyệt; chưa phải tính năng đã triển khai. Lịch sử quyết định xem management/OPEN-DECISIONS.md.

Phân hệ: MOD-02 · Giai đoạn: P1/P2 · Mục tiêu: BO-02, BO-03

## 1. Mục đích và phạm vi
Khung đọc chung, PDF và EPUB tự dàn lại nội dung; hiển thị sáng/tối, điều chỉnh cách đọc và tiếp tục từ định danh vị trí.
Ngoài phạm vi: STRATEGY §2; không thêm tính năng AI. Phụ thuộc RD-00, các phân hệ qua giao diện tích hợp BD-00.

### 1.1 Phân bổ nghiệm thu
P1 phần PDF; P2 phần EPUB; P3 các tình huống nhận xóa/ngoại tuyến.
Giai đoạn của từng kịch bản tại §13; ghi P1/P2 nghĩa cùng hành vi cần nghiệm thu cho PDF ở P1 và EPUB ở P2, không phải được tùy chọn bỏ một.

## 2. Người sử dụng và quyền
Người đọc cá nhân, chỉ truy cập dữ liệu của mình theo RD-00 §6. Chưa triển khai nhiều tài khoản; không nhận chủ sở hữu do người gọi tự chọn.

## 3. Thuật ngữ
Sách là mục thư viện; phiên bản tệp là nội dung bất biến; định danh vị trí trỏ vào nội dung của phiên bản đó; bản ngoại tuyến nằm trên thiết bị. Thuật ngữ xem references/GLOSSARY.md.

## 4. Tình huống sử dụng
### UC-02-01 — Mở và điều hướng
Chọn Đọc từ sách hợp lệ. Nếu online nhận vị trí mới theo quy tắc đồng bộ; offline dùng tệp tải đủ và vị trí local. Mở đúng vị trí/đầu sách nếu Chưa bắt đầu → chuyển trang/nội dung → lưu tiến độ.
Vị trí lỗi không ghi đè vị trí cũ; cho chọn về đầu hoặc chương khác. Tệp thiếu/hỏng/mật khẩu/DRM báo rõ và có nút về thư viện. Sách bị xóa trong lúc đọc thì dừng khi nhận biết và xử lý thay đổi chưa gửi theo RD-00.
### UC-02-02 — Điều chỉnh hiển thị
Mở thiết lập → đổi sáng/tối/cỡ chữ/giãn dòng/lề hoặc zoom → giữ nội dung đang đọc. Điều khiển phù hợp định dạng; không cho kỳ vọng PDF đổi cỡ chữ như EPUB.
Trên điện thoại, mở/đóng bảng công cụ và trở về đúng tiêu điểm; trên máy tính dùng chuột/bàn phím. Nếu đổi kích thước thất bại giữ vị trí trước, không tự ghi trang1.

## 5. Yêu cầu chức năng
| ID | Yêu cầu bắt buộc | Tình huống sử dụng |
|---|---|---|
| FR-02-01 | Đọc PDF theo trang, chuyển trước/sau, đến trang và vừa chiều rộng; cho phóng to và di chuyển vùng xem. | UC-02-01 |
| FR-02-02 | Đọc EPUB tự dàn lại nội dung, chuyển nội dung và chỉnh cỡ chữ/giãn dòng/lề. | UC-02-01 |
| FR-02-03 | Chuyển sáng/tối cho giao diện và EPUB; PDF cho giữ màu gốc hoặc bật bộ lọc đọc đêm. | UC-02-02 |
| FR-02-04 | Dùng bộ đọc trên điện thoại và máy tính; công cụ/mục lục không che thao tác đọc. | UC-02-02 |
| FR-02-05 | Báo lỗi tệp hỏng/định dạng chưa hỗ trợ; có đường quay lại thư viện. | UC-02-01 |
| FR-02-06 | Mở lại vị trí đã lưu và gửi thay đổi vị trí sang phần lưu tiến độ. | UC-02-01 |

## 6. Quy tắc nghiệp vụ
| ID | Quy tắc |
|---|---|
| BR-02-01 | PDF giữ bố cục gốc; không hứa tự dàn lại nội dung hoặc tìm chữ trong bản quét ảnh. |
| BR-02-02 | Đổi màu giao diện/cỡ chữ không thay đổi tệp gốc hoặc định danh vị trí nội dung. |
| BR-02-03 | Định danh vị trí không hợp lệ phải hiện lựa chọn về đầu sách, không ghi đè vị trí cũ âm thầm. |
| BR-02-04 | Nội dung EPUB không được chạy mã lệnh hoặc tự tải tài nguyên mạng ngoài. |

## 7. Dữ liệu nghiệp vụ
Vị trí và dữ liệu cá nhân phải gắn người đọc, sách và phiên bản tệp.
Thời hạn lưu giữ và xóa theo BD-02 và quyết định #5; trạng thái ngoại tuyến theo thiết bị, không đồng nhất với máy chủ.

## 8. Màn hình
| ID | Màn hình | Tuyến dự kiến | Cách mở |
|---|---|---|---|
| SC-02-01 | Bộ đọc | /reader/:bookId | Thẻ sách → Đọc |

## 9. Báo cáo và xuất dữ liệu
Không báo cáo kinh doanh hoặc xuất tệp sách đã sửa; P3 có sao chép/xuất bản cứu dữ liệu cá nhân chưa đồng bộ khi sách bị xóa, không chứa file sách.

## 10. Tích hợp
Dùng chung cơ chế xác định người đọc và quyền sở hữu; các phân hệ trao đổi qua giao diện dịch vụ tại BD-00 §5. Đọc ngoại tuyến và thử lại phải giữ trạng thái rõ ràng cho người đọc.

## 11. AI
Không có; không gửi nội dung sách tới mô hình hay nhà cung cấp ngoài.

## 12. NFR
Áp dụng RD-00 §8; phép đo và dữ liệu mẫu tại BD-M02 §13. Kiểm thử mô phỏng đạt chưa chứng minh tương thích thiết bị thật.

## 13. Tiêu chí nghiệm thu
Mỗi dòng là tình huống riêng; chưa chạy. Các mã AC cũ01..06 được giữ và làm rõ; mã bổ sung không tái sử dụng. Điều kiện chung: đúng người đọc, đúng phiên bản tệp, nguồn hợp lệ, trừ khi dòng nêu ngoại lệ.

| Mã | Yêu cầu | Cho trước | Khi | Kết quả mong đợi | Giai đoạn |
|---|---|---|---|---|---|
| AC-02-01 | FR-02-01 | PDF N trang đang trang1/N | Chuyển trước/sau, nhập trang0/N+1 | Không vượt giới hạn; nhập sai báo lỗi, giữ trang và tiến độ cũ | P1 |
| AC-02-02 | FR-02-02 | EPUB đang đoạn giữa chương | Đổi cỡ chữ | Tiếp tục cùng đoạn, không nhảy về đầu | P2 |
| AC-02-03 | FR-02-03 | Reader có nội dung và bảng công cụ | Đổi sáng/tối | Áp màu giao diện/EPUB, giữ vị trí; PDF có chọn màu gốc/bộ lọc đọc đêm | P1/P2 |
| AC-02-04 | FR-02-04 | Màn hình375/768/1280px | Mở/đóng công cụ và dùng bàn phím | Không che thao tác đọc, shell không tràn ngang; trả đúng focus | P1/P2 |
| AC-02-05 | FR-02-05 | Tệp hỏng hoặc định dạng chưa hỗ trợ | Mở sách | Lỗi rõ và có về thư viện, không trắng màn hình | P1/P2 |
| AC-02-06 | FR-02-06 | Có locator hợp lệ cùng revision | Mở lại sách | Khôi phục đúng chỗ trước khi tự lưu, không ghi trang1 lên tiến độ cũ | P1/P2 |
| AC-02-07 | FR-02-01 | PDF đã mở trên điện thoại | Vừa chiều rộng, zoom rồi pan | Fit đúng khung, zoom/pan hoạt động trong vùng xem | P1 |
| AC-02-08 | FR-02-02 | EPUB tự dàn đang đọc | Đổi giãn dòng/lề và chuyển phần trước/sau | Giá trị áp dụng, nội dung/điều hướng đúng; không đổi tệp gốc | P2 |
| AC-02-09 | FR-02-03 | PDF có ảnh màu | Bật rồi tắt lọc đọc đêm | Có thông báo ảnh đổi màu, tắt trả màu gốc và giữ vị trí | P1 |
| AC-02-10 | FR-02-06 | Locator sai trang/CFI hoặc sai revision | Mở lại | Báo lỗi, giữ bản cũ; chỉ về đầu khi user chọn | P1/P2 |
| AC-02-11 | FR-02-06 | Tiến độ là Chưa bắt đầu | Mở sách | Mở đầu, chưa tự ghi tiến độ trước khi đọc/điều hướng ổn định | P1/P2 |
| AC-02-12 | FR-02-05 | EPUB chứa mã lệnh/tài nguyên ngoài độc hại | Mở và điều hướng | Không chạy script/tự gọi mạng ngoài; lỗi kiểm soát, vẫn có lối thoát | P2 |
| AC-02-13 | FR-02-04 | Đang đọc trên điện thoại | Xoay màn hình/thay kích thước | Giữ vị trí nội dung, không lưu nhầm trang1 | P1/P2 |
| AC-02-14 | FR-02-06 | Đang đọc sách, thiết bị nhận dấu xóa server | Tiếp tục thao tác đọc | Dừng mở sau biết xóa; xử lý pending rồi về thư viện | P3 |

## 14. Vấn đề cần quyết định
Không còn quyết định sản phẩm mở. Lịch sử duyệt tại management/OPEN-DECISIONS.md; thay đổi sau chốt theo CR-MANAGEMENT. Chưa xác nhận yêu cầu nào đã triển khai.

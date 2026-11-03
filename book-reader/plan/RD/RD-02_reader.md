# RD-02 — Trình đọc PDF và EPUB

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.

Đây là thiết kế đề xuất, chưa phải tính năng đã triển khai. Quyết định sản phẩm chưa xác nhận xem management/OPEN-DECISIONS.md.

Phân hệ: MOD-02 · Giai đoạn: P1/P2 · Mục tiêu: BO-02, BO-03

## 1. Mục đích và phạm vi
Khung đọc chung, PDF và EPUB tự dàn lại nội dung; hiển thị sáng/tối, điều chỉnh cách đọc và tiếp tục từ định danh vị trí.
Ngoài phạm vi: STRATEGY §2; không thêm tính năng AI. Phụ thuộc RD-00, các phân hệ qua giao diện tích hợp BD-00.

## 2. Người sử dụng và quyền
Người đọc cá nhân, chỉ truy cập dữ liệu của mình theo RD-00 §6. Chưa triển khai nhiều tài khoản; không nhận chủ sở hữu do người gọi tự chọn.

## 3. Thuật ngữ
Sách là mục thư viện; phiên bản tệp là nội dung bất biến; định danh vị trí trỏ vào nội dung của phiên bản đó; bản ngoại tuyến nằm trên thiết bị. Thuật ngữ xem references/GLOSSARY.md.

## 4. Tình huống sử dụng
| ID | Hành vi | Luồng và ngoại lệ |
|---|---|---|
| UC-02-01 | Mở và điều hướng sách | Thư viện → Đọc → mở vị trí đã lưu → chuyển nội dung; lỗi có hướng xử lý, không giả thành công |
| UC-02-02 | Điều chỉnh hiển thị | Mở cài đặt → đổi màu/bố cục → nội dung giữ đúng vị trí; lỗi có hướng xử lý, không giả thành công |

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
Không báo cáo kinh doanh hoặc xuất tệp đã sửa v1.

## 10. Tích hợp
Dùng chung cơ chế xác định người đọc và quyền sở hữu; các phân hệ trao đổi qua giao diện dịch vụ tại BD-00 §5. Đọc ngoại tuyến và thử lại phải giữ trạng thái rõ ràng cho người đọc.

## 11. AI
Không có; không gửi nội dung sách tới mô hình hay nhà cung cấp ngoài.

## 12. NFR
Áp dụng RD-00 §8; phép đo và dữ liệu mẫu tại BD-M02 §13. Kiểm thử mô phỏng đạt chưa chứng minh tương thích thiết bị thật.

## 13. Tiêu chí nghiệm thu
Các tiêu chí dưới là kế hoạch nghiệm thu, CHƯA chạy.
| ID | Yêu cầu | Kịch bản kiểm chứng |
|---|---|---|
| AC-02-01 | FR-02-01 | Không vượt trang 1/N; trang vừa chiều rộng trên điện thoại |
| AC-02-02 | FR-02-02 | Đổi cỡ chữ rồi tiếp tục cùng đoạn nội dung |
| AC-02-03 | FR-02-03 | Màu áp dụng cả bảng trượt và nội dung EPUB; PDF có cảnh báo ảnh đổi màu |
| AC-02-04 | FR-02-04 | Bảng trượt đóng/mở và tiêu điểm bàn phím đúng; không tràn ngang khung ứng dụng |
| AC-02-05 | FR-02-05 | Lỗi phân tích tệp không làm ứng dụng trắng màn hình |
| AC-02-06 | FR-02-06 | PDF/EPUB khôi phục đúng phiên bản tệp trước khi tự lưu vị trí mới |

## 14. Vấn đề cần quyết định
Xem management/OPEN-DECISIONS.md. Chưa chốt làm chuẩn; không có yêu cầu nào được ghi là đã triển khai.

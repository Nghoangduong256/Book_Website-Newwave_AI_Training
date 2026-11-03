# RD-04 — Tiến độ, thiết lập và ngoại tuyến

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.

Đây là thiết kế đề xuất, chưa phải tính năng đã triển khai. Quyết định sản phẩm chưa xác nhận xem management/OPEN-DECISIONS.md.

Phân hệ: MOD-04 · Giai đoạn: P1/P3 · Mục tiêu: BO-03, BO-04, BO-05

## 1. Mục đích và phạm vi
Lưu vị trí và thiết lập, tải bản ngoại tuyến trên thiết bị, hàng đợi thay đổi và giải quyết xung đột.
Ngoài phạm vi: STRATEGY §2; không thêm tính năng AI. Phụ thuộc RD-00, các phân hệ qua giao diện tích hợp BD-00.

## 2. Người sử dụng và quyền
Người đọc cá nhân, chỉ truy cập dữ liệu của mình theo RD-00 §6. Chưa triển khai nhiều tài khoản; không nhận chủ sở hữu do người gọi tự chọn.

## 3. Thuật ngữ
Sách là mục thư viện; phiên bản tệp là nội dung bất biến; định danh vị trí trỏ vào nội dung của phiên bản đó; bản ngoại tuyến nằm trên thiết bị. Thuật ngữ xem references/GLOSSARY.md.

## 4. Tình huống sử dụng
| ID | Hành vi | Luồng và ngoại lệ |
|---|---|---|
| UC-04-01 | Đọc tiếp | Đọc → vị trí lưu local/server → mở lại → tiếp tục; lỗi có hướng xử lý, không giả thành công |
| UC-04-02 | Đọc ngoại tuyến và nối lại | Tải hoàn chỉnh → mất mạng/restart → đọc/sửa navigation → trực tuyến → đồng bộ hoặc xử lý xung đột; lỗi có hướng xử lý, không giả thành công |

## 5. Yêu cầu chức năng
| ID | Yêu cầu bắt buộc | Tình huống sử dụng |
|---|---|---|
| FR-04-01 | Lưu vị trí PDF/EPUB và khôi phục khi mở lại sách. | UC-04-01 |
| FR-04-02 | Lưu tùy chọn màu giao diện và cách đọc trên thiết bị. | UC-04-01 |
| FR-04-03 | Chủ động tải/xóa bản ngoại tuyến và xem availability/dung lượng trên thiết bị hiện tại. | UC-04-02 |
| FR-04-04 | Mở sách ngoại tuyến sau tải lại trang mà không cần máy chủ ứng dụng khi bộ nhớ đệm đầy đủ. | UC-04-02 |
| FR-04-05 | Giữ thay đổi chưa đồng bộ qua tải lại trang và gửi lại khi có mạng mà không nhân đôi. | UC-04-02 |
| FR-04-06 | Phát hiện xung đột từ hai thiết bị và cho chọn vị trí giữ lại; không âm thầm lấy trang lớn nhất. | UC-04-02 |

## 6. Quy tắc nghiệp vụ
| ID | Quy tắc |
|---|---|
| BR-04-01 | Khả năng đọc ngoại tuyến là trạng thái theo thiết bị; không dùng cờ toàn cục hasLocalFile. |
| BR-04-02 | Chỉ xác nhận ngoại tuyến khi tệp và bản kê đầy đủ, đúng mã kiểm toàn vẹn. |
| BR-04-03 | Không ghi đè thay đổi đồng thời theo đồng hồ thiết bị; giữ dữ liệu cục bộ khi xung đột. |
| BR-04-04 | Xóa bộ nhớ đệm phải cảnh báo khi có thay đổi chưa đồng bộ; không xóa hàng đợi thay đổi chờ gửi âm thầm. |

## 7. Dữ liệu nghiệp vụ
Vị trí và dữ liệu cá nhân phải gắn người đọc, sách và phiên bản tệp.
Thời hạn lưu giữ và xóa theo BD-02 và quyết định #5; trạng thái ngoại tuyến theo thiết bị, không đồng nhất với máy chủ.

## 8. Màn hình
| ID | Màn hình | Tuyến dự kiến | Cách mở |
|---|---|---|---|
| SC-04-01 | Cài đặt đọc/offline | /settings | Trình đơn Cài đặt |
| SC-04-02 | Xung đột đồng bộ | /reader/:bookId (hộp thoại) | Thông báo xung đột → Xử lý |

## 9. Báo cáo và xuất dữ liệu
Không báo cáo kinh doanh hoặc xuất tệp đã sửa v1.

## 10. Tích hợp
Dùng chung cơ chế xác định người đọc và quyền sở hữu; các phân hệ trao đổi qua giao diện dịch vụ tại BD-00 §5. Đọc ngoại tuyến và thử lại phải giữ trạng thái rõ ràng cho người đọc.

## 11. AI
Không có; không gửi nội dung sách tới mô hình hay nhà cung cấp ngoài.

## 12. NFR
Áp dụng RD-00 §8; phép đo và dữ liệu mẫu tại BD-M04 §13. Kiểm thử mô phỏng đạt chưa chứng minh tương thích thiết bị thật.

## 13. Tiêu chí nghiệm thu
Các tiêu chí dưới là kế hoạch nghiệm thu, CHƯA chạy.
| ID | Yêu cầu | Kịch bản kiểm chứng |
|---|---|---|
| AC-04-01 | FR-04-01 | Đóng/mở tiếp đúng định danh vị trí cùng phiên bản tệp |
| AC-04-02 | FR-04-02 | Tải lại trang giữ màu giao diện/cỡ chữ; lựa chọn mặc định không ghi đè tiến độ |
| AC-04-03 | FR-04-03 | Chỉ báo sẵn sàng sau hoàn tất lưu tệp và bản kê |
| AC-04-04 | FR-04-04 | Tắt mạng và khởi động lại PWA mở được PDF/EPUB đã tải |
| AC-04-05 | FR-04-05 | Thử lại sau mất phản hồi không tạo đánh dấu trùng |
| AC-04-06 | FR-04-06 | Thiết bị đọc lùi không bị đổi thành tiến độ lớn nhất |

## 14. Vấn đề cần quyết định
Xem management/OPEN-DECISIONS.md. Chưa chốt làm chuẩn; không có yêu cầu nào được ghi là đã triển khai.

# RD-03 — Mục lục và đánh dấu

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.

Đây là thiết kế đề xuất, chưa phải tính năng đã triển khai. Quyết định sản phẩm chưa xác nhận xem management/OPEN-DECISIONS.md.

Phân hệ: MOD-03 · Giai đoạn: P2 · Mục tiêu: BO-03

## 1. Mục đích và phạm vi
Đọc mục lục gốc, tạo mục lục cá nhân phân cấp và đánh dấu theo vị trí; không viết lại tệp sách.
Ngoài phạm vi: STRATEGY §2; không thêm tính năng AI. Phụ thuộc RD-00, các phân hệ qua giao diện tích hợp BD-00.

## 2. Người sử dụng và quyền
Người đọc cá nhân, chỉ truy cập dữ liệu của mình theo RD-00 §6. Chưa triển khai nhiều tài khoản; không nhận chủ sở hữu do người gọi tự chọn.

## 3. Thuật ngữ
Sách là mục thư viện; phiên bản tệp là nội dung bất biến; định danh vị trí trỏ vào nội dung của phiên bản đó; bản ngoại tuyến nằm trên thiết bị. Thuật ngữ xem references/GLOSSARY.md.

## 4. Tình huống sử dụng
| ID | Hành vi | Luồng và ngoại lệ |
|---|---|---|
| UC-03-01 | Đi theo mục lục gốc | Reader → Mục lục → chọn mục → đến vị trí; lỗi có hướng xử lý, không giả thành công |
| UC-03-02 | Tạo mục lục và đánh dấu | Vị trí hiện tại → đặt tên → lưu → sửa/xóa/sắp xếp → điều hướng; lỗi có hướng xử lý, không giả thành công |

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
| BR-03-04 | Chỉnh navigation không ghi vào tệp gốc. |

## 7. Dữ liệu nghiệp vụ
Vị trí và dữ liệu cá nhân phải gắn người đọc, sách và phiên bản tệp.
Thời hạn lưu giữ và xóa theo BD-02 và quyết định #5; trạng thái ngoại tuyến theo thiết bị, không đồng nhất với máy chủ.

## 8. Màn hình
| ID | Màn hình | Tuyến dự kiến | Cách mở |
|---|---|---|---|
| SC-03-01 | Panel mục lục/bookmark | /reader/:bookId (bảng) | Thanh công cụ Mục lục/Đánh dấu |

## 9. Báo cáo và xuất dữ liệu
Không báo cáo kinh doanh hoặc xuất tệp đã sửa v1.

## 10. Tích hợp
Dùng chung cơ chế xác định người đọc và quyền sở hữu; các phân hệ trao đổi qua giao diện dịch vụ tại BD-00 §5. Đọc ngoại tuyến và thử lại phải giữ trạng thái rõ ràng cho người đọc.

## 11. AI
Không có; không gửi nội dung sách tới mô hình hay nhà cung cấp ngoài.

## 12. NFR
Áp dụng RD-00 §8; phép đo và dữ liệu mẫu tại BD-M03 §13. Kiểm thử mô phỏng đạt chưa chứng minh tương thích thiết bị thật.

## 13. Tiêu chí nghiệm thu
Các tiêu chí dưới là kế hoạch nghiệm thu, CHƯA chạy.
| ID | Yêu cầu | Kịch bản kiểm chứng |
|---|---|---|
| AC-03-01 | FR-03-01 | Sách có/không outline đều mở reader được |
| AC-03-02 | FR-03-02 | Mục mới lưu và mở lại dẫn đúng vị trí |
| AC-03-03 | FR-03-03 | Reorder giữ ổn định sau tải lại trang; chu trình bị từ chối |
| AC-03-04 | FR-03-04 | Bookmark mở đúng PDF page/EPUB đoạn |
| AC-03-05 | FR-03-05 | giao diện không cho sửa nhầm mục gốc |
| AC-03-06 | FR-03-06 | Tạo đánh dấu ngoại tuyến tồn tại sau tải lại trang và đồng bộ không nhân đôi |

## 14. Vấn đề cần quyết định
Xem management/OPEN-DECISIONS.md. Chưa chốt làm chuẩn; không có yêu cầu nào được ghi là đã triển khai.

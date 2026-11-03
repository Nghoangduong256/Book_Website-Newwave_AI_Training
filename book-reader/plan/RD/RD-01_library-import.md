# RD-01 — Thư viện và nhập sách

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.

Đây là thiết kế đề xuất, chưa phải tính năng đã triển khai. Quyết định sản phẩm chưa xác nhận xem management/OPEN-DECISIONS.md.

Phân hệ: MOD-01 · Giai đoạn: P1 · Mục tiêu: BO-01, BO-05

## 1. Mục đích và phạm vi
Quản lý thông tin mô tả và nhập một bản PDF/EPUB từ tệp hoặc URL trực tiếp; một sách có một phiên bản tệp bất biến ở v1.
Ngoài phạm vi: STRATEGY §2; không thêm tính năng AI. Phụ thuộc RD-00, các phân hệ qua giao diện tích hợp BD-00.

## 2. Người sử dụng và quyền
Người đọc cá nhân, chỉ truy cập dữ liệu của mình theo RD-00 §6. Chưa triển khai nhiều tài khoản; không nhận chủ sở hữu do người gọi tự chọn.

## 3. Thuật ngữ
Sách là mục thư viện; phiên bản tệp là nội dung bất biến; định danh vị trí trỏ vào nội dung của phiên bản đó; bản ngoại tuyến nằm trên thiết bị. Thuật ngữ xem references/GLOSSARY.md.

## 4. Tình huống sử dụng
| ID | Hành vi | Luồng và ngoại lệ |
|---|---|---|
| UC-01-01 | Nhập sách | Chọn tệp hoặc nhập URL → kiểm tra → hiện kết quả; lỗi không tạo sách sẵn sàng; lỗi có hướng xử lý, không giả thành công |
| UC-01-02 | Quản lý thư viện | Tìm/lọc/sửa thông tin mô tả; xác nhận xóa → loại sách khỏi thư viện; lỗi có hướng xử lý, không giả thành công |

## 5. Yêu cầu chức năng
| ID | Yêu cầu bắt buộc | Tình huống sử dụng |
|---|---|---|
| FR-01-01 | Nhập PDF/EPUB từ thiết bị và báo lỗi rõ nếu loại, cấu trúc hoặc dung lượng không hợp lệ. | UC-01-01 |
| FR-01-02 | Nhập từ URL trực tiếp, xem trạng thái, thử lại khi lỗi và không báo hoàn tất trước khi sách sẵn sàng. | UC-01-01 |
| FR-01-03 | Liệt kê, tìm theo tên/tác giả, lọc định dạng và sắp xếp thư viện. | UC-01-02 |
| FR-01-04 | Sửa tiêu đề/tác giả/năm/tags, dùng tên tệp khi thiếu tiêu đề và cho phép tác giả chưa biết. | UC-01-02 |
| FR-01-05 | Xác nhận xóa sách; giữ nguyên tệp gốc trong quá trình sử dụng bình thường. | UC-01-02 |
| FR-01-06 | Mở cùng thư viện cá nhân trên máy tính và điện thoại nối cùng máy chủ. | UC-01-02 |

## 6. Quy tắc nghiệp vụ
| ID | Quy tắc |
|---|---|
| BR-01-01 | Chỉ sách nhập hoàn chỉnh mới xuất hiện ở trạng thái sẵn sàng. |
| BR-01-02 | Quyền sở hữu được xác định từ người đọc hiện tại; không do biểu mẫu quyết định. |
| BR-01-03 | Không thay nội dung tệp của sách đã có; nhập bản khác tạo sách mới. |
| BR-01-04 | Nhập thất bại không để lại sách đọc được hoặc tệp rác tồn tại vô hạn. |

## 7. Dữ liệu nghiệp vụ
Sách, bản tệp, kết quả nhập; sách thiếu tệp không được coi là sẵn sàng.
Thời hạn lưu giữ và xóa theo BD-02 và quyết định #5; trạng thái ngoại tuyến theo thiết bị, không đồng nhất với máy chủ.

## 8. Màn hình
| ID | Màn hình | Tuyến dự kiến | Cách mở |
|---|---|---|---|
| SC-01-01 | Thư viện | / | Trình đơn Thư viện |
| SC-01-02 | Nhập sách | /books/import | Nút Thêm sách |
| SC-01-03 | Chi tiết/sửa sách | /books/:id | Thẻ sách → Chi tiết |

## 9. Báo cáo và xuất dữ liệu
Không báo cáo kinh doanh hoặc xuất tệp đã sửa v1.

## 10. Tích hợp
Dùng chung cơ chế xác định người đọc và quyền sở hữu; các phân hệ trao đổi qua giao diện dịch vụ tại BD-00 §5. Đọc ngoại tuyến và thử lại phải giữ trạng thái rõ ràng cho người đọc.

## 11. AI
Không có; không gửi nội dung sách tới mô hình hay nhà cung cấp ngoài.

## 12. NFR
Áp dụng RD-00 §8; phép đo và dữ liệu mẫu tại BD-M01 §13. Kiểm thử mô phỏng đạt chưa chứng minh tương thích thiết bị thật.

## 13. Tiêu chí nghiệm thu
Các tiêu chí dưới là kế hoạch nghiệm thu, CHƯA chạy.
| ID | Yêu cầu | Kịch bản kiểm chứng |
|---|---|---|
| AC-01-01 | FR-01-01 | Tệp hợp lệ nhập được; tệp giả đuôi bị từ chối |
| AC-01-02 | FR-01-02 | URL chuyển hướng hợp lệ hoàn tất; URL nội bộ bị chặn |
| AC-01-03 | FR-01-03 | Kết quả đúng và chuyển trang không mất bộ lọc |
| AC-01-04 | FR-01-04 | Trường trống hợp lệ được lưu; tiêu đề sau khi dùng phương án dự phòng không rỗng |
| AC-01-05 | FR-01-05 | Hủy xác nhận giữ sách; đồng ý làm sách không còn mở trực tuyến |
| AC-01-06 | FR-01-06 | Thiết bị thứ hai truy cập tệp máy chủ mà không cần IndexedDB thiết bị thứ nhất |

## 14. Vấn đề cần quyết định
Xem management/OPEN-DECISIONS.md. Chưa chốt làm chuẩn; không có yêu cầu nào được ghi là đã triển khai.

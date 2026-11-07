# RD-01 — Thư viện và nhập sách

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

Yêu cầu/thiết kế đã được chủ dự án duyệt; chưa phải tính năng đã triển khai. Lịch sử quyết định xem management/OPEN-DECISIONS.md.

Phân hệ: MOD-01 · Giai đoạn: P1 PDF; P2 EPUB · Mục tiêu: BO-01, BO-05

## 1. Mục đích và phạm vi
Quản lý thông tin mô tả và nhập một bản PDF/EPUB từ tệp hoặc URL trực tiếp; một sách có một phiên bản tệp bất biến ở v1.
Ngoài phạm vi: STRATEGY §2; không thêm tính năng AI. Phụ thuộc RD-00, các phân hệ qua giao diện tích hợp BD-00.

### 1.1 Phân bổ nghiệm thu
P1 áp dụng PDF và luồng nhập/thư viện; P2 áp dụng cùng yêu cầu với EPUB.
Giai đoạn của từng kịch bản tại §13; ghi P1/P2 nghĩa cùng hành vi cần nghiệm thu cho PDF ở P1 và EPUB ở P2, không phải được tùy chọn bỏ một.

## 2. Người sử dụng và quyền
Người đọc cá nhân, chỉ truy cập dữ liệu của mình theo RD-00 §6. Chưa triển khai nhiều tài khoản; không nhận chủ sở hữu do người gọi tự chọn.

## 3. Thuật ngữ
Sách là mục thư viện; phiên bản tệp là nội dung bất biến; định danh vị trí trỏ vào nội dung của phiên bản đó; bản ngoại tuyến nằm trên thiết bị. Thuật ngữ xem references/GLOSSARY.md.

## 4. Tình huống sử dụng
### UC-01-01 — Nhập sách
Điều kiện: máy chủ truy cập được trong mạng nhà; người đọc có quyền và tệp/URL phù hợp.
Luồng chính: chọn nguồn → nhập thông tin tùy chọn → gửi → xem trạng thái → thành công thấy sách trong thư viện và mở đọc.
Ngoại lệ: tệp sai/hỏng/quá dung lượng/mật khẩu/DRM bị từ chối, không tạo sách; URL lỗi ghi thất bại, cho thử lại; trùng nội dung cho Mở cũ/Vẫn nhập/Hủy; mất phản hồi kiểm trạng thái hoặc gửi lại cùng thao tác, không tự tạo sách đôi.
Đóng màn hình URL không tự hủy tác vụ. Chờ lựa chọn trùng có thời hạn hiển thị, hết hạn báo thử lại; không tạo âm thầm.
Kết quả: sách mới hoàn chỉnh hoặc sách cũ được mở; thất bại/hủy không thay thư viện.
### UC-01-02 — Quản lý thư viện
Tìm/lọc/sắp xếp → mở chi tiết → sửa → lưu; dữ liệu sai giữ biểu mẫu và chỉ trường cần sửa. Sách thiếu/hỏng tệp vẫn có thông tin/dữ liệu đọc, báo Không thể đọc và cho thử lại.
Xóa: xem phạm vi → nếu có dữ liệu chưa gửi chọn đồng bộ trước/cách ly trước/hủy → xác nhận → sách rời thư viện. Nhánh đồng bộ thất bại không xóa. Lần xóa nhận ACK mất kiểm lại trạng thái, không báo thất bại giả.
Quy tắc xóa nguồn RD-00 §7; chuyển tệp gốc mới vào sách cũ chưa hỗ trợ.

## 5. Yêu cầu chức năng
| ID | Yêu cầu bắt buộc | Tình huống sử dụng |
|---|---|---|
| FR-01-01 | Nhập PDF/EPUB từ thiết bị và báo lỗi rõ nếu loại, cấu trúc hoặc dung lượng không hợp lệ. | UC-01-01 |
| FR-01-02 | Nhập từ URL trực tiếp, xem trạng thái, thử lại khi lỗi và không báo hoàn tất trước khi sách sẵn sàng. | UC-01-01 |
| FR-01-03 | Liệt kê, tìm theo tên/tác giả, lọc định dạng và sắp xếp thư viện. | UC-01-02 |
| FR-01-04 | Sửa tiêu đề/tác giả/năm/tags, dùng tên tệp khi thiếu tiêu đề và cho phép tác giả chưa biết. | UC-01-02 |
| FR-01-05 | Xác nhận xóa sách; giữ nguyên tệp gốc trong quá trình sử dụng bình thường. | UC-01-02 |
| FR-01-07 | Khi nhập trùng nội dung trong thư viện, cảnh báo và cho Mở sách đã có/Vẫn nhập/Hủy; không tự gộp. | UC-01-01 |
| FR-01-06 | Mở cùng thư viện cá nhân trên máy tính và điện thoại nối cùng máy chủ. | UC-01-02 |

## 6. Quy tắc nghiệp vụ
| ID | Quy tắc |
|---|---|
| BR-01-01 | Chỉ sách nhập hoàn chỉnh mới xuất hiện ở trạng thái sẵn sàng. |
| BR-01-02 | Quyền sở hữu được xác định từ người đọc hiện tại; không do biểu mẫu quyết định. |
| BR-01-03 | Không thay nội dung tệp của sách đã có; nhập bản khác tạo sách mới. |
| BR-01-05 | Trùng nội dung không có nghĩa được tự gộp; Vẫn nhập phải tạo sách riêng, Hủy không đổi thư viện. |
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
Không báo cáo kinh doanh hoặc xuất tệp sách đã sửa; P3 có sao chép/xuất bản cứu dữ liệu cá nhân chưa đồng bộ khi sách bị xóa, không chứa file sách.

## 10. Tích hợp
Dùng chung cơ chế xác định người đọc và quyền sở hữu; các phân hệ trao đổi qua giao diện dịch vụ tại BD-00 §5. Đọc ngoại tuyến và thử lại phải giữ trạng thái rõ ràng cho người đọc.

## 11. AI
Không có; không gửi nội dung sách tới mô hình hay nhà cung cấp ngoài.

## 12. NFR
Áp dụng RD-00 §8; phép đo và dữ liệu mẫu tại BD-M01 §13. Kiểm thử mô phỏng đạt chưa chứng minh tương thích thiết bị thật.

## 13. Tiêu chí nghiệm thu
Mỗi dòng là tình huống riêng; chưa chạy. Các mã AC cũ01..06 được giữ và làm rõ; mã bổ sung không tái sử dụng. Điều kiện chung: đúng người đọc, đúng phiên bản tệp, nguồn hợp lệ, trừ khi dòng nêu ngoại lệ.

| Mã | Yêu cầu | Cho trước | Khi | Kết quả mong đợi | Giai đoạn |
|---|---|---|---|---|---|
| AC-01-01 | FR-01-01 | Có PDF/EPUB hợp lệ trong giới hạn | Nhập tệp | Một sách hoàn chỉnh được tạo, mở được nội dung | P1 |
| AC-01-02 | FR-01-02 | URL trực tiếp hợp lệ qua chuyển hướng được phép | Nhập URL rồi theo dõi | Đủ trạng thái, thành công có bookId; URL nội bộ bị chặn không tạo sách | P1 |
| AC-01-03 | FR-01-03 | Có nhiều sách tên/tác giả/định dạng khác nhau | Tìm/lọc/sắp xếp và chuyển trang | Kết quả đúng điều kiện, không mất bộ lọc | P1 |
| AC-01-04 | FR-01-04 | Nhập thiếu tiêu đề/tác giả | Nhập và sửa metadata | Nhập dùng tên dự phòng; tác giả null; sửa title rỗng bị từ chối và giữ form | P1 |
| AC-01-05 | FR-01-05 | Sách đang có trong thư viện | Chọn Xóa rồi Hủy hoặc xác nhận | Hủy giữ nguyên; xác nhận xóa làm không mở online, không bỏ pending âm thầm | P1/P3 |
| AC-01-06 | FR-01-06 | PC và điện thoại được phép trong mạng nhà, máy chủ bật | Mở cùng sách trên điện thoại chưa có cache | Đọc được tệp server; 4G/Wi-Fi ngoài nhà không vào trực tiếp server | P1 |
| AC-01-07 | FR-01-07 | Nhập tệp trùng SHA256 sách own | Chọn Mở sách đã có | Mở bookId cũ, số sách không tăng | P1 |
| AC-01-08 | FR-01-07 | Nhập trùng nội dung | Chọn Vẫn nhập hoặc Hủy | Vẫn nhập tạo bookId/fileId riêng; Hủy không thay thư viện | P1 |
| AC-01-09 | FR-01-01 | Tệp sai đuôi/hỏng/quá giới hạn/mật khẩu/DRM | Gửi nhập | Báo lỗi đúng, không tạo sách, tệp tạm được đối soát/dọn | P1/P2 |
| AC-01-10 | FR-01-02 | URL lỗi mạng hoặc quá thời gian | Đợi xử lý và thử lại | FAILED có lý do/cách thử lại, không tạo sách đọc dở | P1 |
| AC-01-11 | FR-01-01 | Server đã commit nhập nhưng mất phản hồi | Gửi lại đúng khóa/nội dung | Trả cùng kết quả, chỉ một sách | P1 |
| AC-01-12 | FR-01-05 | Có dữ liệu chưa đồng bộ | Chọn Đồng bộ rồi xóa nhưng đồng bộ lỗi | Không xóa sách; dữ liệu giữ và có cách thử lại | P3 |
| AC-01-13 | FR-01-05 | Có pending và muốn xóa | Chọn Lưu riêng rồi xóa | Cách ly thành công trước xóa; còn xem/xuất pending, không mở sách đã xóa | P3 |
| AC-01-14 | FR-01-01 | Sách nhập thành công, file vật lý bị thiếu/hỏng sau đó | Mở nội dung | Không thể đọc có lý do và Thử lại; metadata/tiến độ/bookmarks vẫn giữ | P1 |
| AC-01-15 | FR-01-02 | Job URL chờ lựa chọn sách trùng | Đóng màn hình rồi mở lại hoặc hết hạn lựa chọn | Không tự tạo; xem lại lựa chọn, hết hạn báo thất bại/nhập lại | P1 |

## 14. Vấn đề cần quyết định
Không còn quyết định sản phẩm mở. Lịch sử duyệt tại management/OPEN-DECISIONS.md; thay đổi sau chốt theo CR-MANAGEMENT. Chưa xác nhận yêu cầu nào đã triển khai.

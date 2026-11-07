# BD-M02 — Trình đọc PDF và EPUB

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

Yêu cầu/thiết kế đã được chủ dự án duyệt; chưa phải tính năng đã triển khai. Lịch sử quyết định xem management/OPEN-DECISIONS.md.

Tài liệu yêu cầu: ../RD/RD-02_reader.md · Giai đoạn: P1/P2

## 1. Tóm tắt
Khung đọc chung, PDF và EPUB tự dàn nội dung; hiển thị sáng/tối, điều chỉnh cách đọc và tiếp tục từ định danh vị trí.
Áp dụng chuẩn chung BD-00, giao diện BD-01, dữ liệu BD-02, bảo mật BD-03 và hạ tầng BD-05. Bộ xử lý đọc sách xem BD-M02; bản đầu không có tính năng AI.

## 2. Giao diện bộ đọc
ReaderAdapter cung cấp open(file, locator?), navigate(locator), getLocation(), getToc(), applySettings(), dispose(); phát các sự kiện ready/location/error tương ứng Sẵn sàng/Đổi vị trí/Lỗi. Giao diện TypeScript không phụ thuộc React.
ReaderShell điều phối và hiển thị; MOD-04 lưu vị trí; MOD-03 điều hướng. open() chỉ cho lưu vị trí sau khôi phục thành công; lần hiển thị đầu không được đặt lại tiến độ máy chủ.

## 3. Dữ liệu và API
Không có bảng riêng cho bộ đọc. BookReadDescriptor từ MOD-01 gồm bookId,fileId,format,checksum,contentUrl,metadata. Thiết lập/tiến độ theo BD-M04; mục lục theo BD-M03.
Khi ngoại tuyến dùng bản kê đã kiểm chứng trên thiết bị, không gọi API bắt buộc. Khi online mở/quay lại sách, đối soát bản mới theo BD-M04 §6 trước chọn locator để restore. Không có thay đổi local thì dùng tiến độ máy chủ; có conflict cho đọc tại bản local tạm nhưng giữ cả hai vị trí tới khi chọn.

## 4. Bộ xử lý và định danh vị trí
PDF dùng react-pdf/PDF.js; phiên bản chờ thử nghiệm. Tiến trình xử lý PDF cùng nguồn ứng dụng, được đóng gói cục bộ để dùng ngoại tuyến. ResizeObserver tính chiều rộng trang; chỉ hiển thị trang hiện tại và vùng lân cận có giới hạn. Hủy lần vẽ/tải cũ, giải phóng tiến trình và URL tạm khi đổi sách. Lớp văn bản/chú thích chỉ hoạt động nếu tệp có nội dung tương ứng.
EPUB chọn epub.js; cần thử nghiệm CFI, đổi kích thước, màu và vùng cách ly trước triển khai. Nếu không đạt, ghi ADR/CR để đổi lựa chọn đã chốt. Gắn nội dung vào iframe; vô hiệu mã lệnh, biểu mẫu và cửa sổ bật lên; loại tài nguyên/liên kết nguy hiểm theo BD-03. Nội dung tự dàn lại mặc định một cột trên điện thoại, có tùy chọn cuộn/phân trang. EPUB bố cục cố định và DRM ngoài bản đầu theo D5.
Định danh PDF: {type:"pdf",fileId,page,offsetY}; page bắt đầu từ 1, offsetY từ 0 đến 1 theo chiều cao trang.
Định danh EPUB: {type:"epub",fileId,href,cfi}; href là đường dẫn tương đối trong danh sách nội dung, cfi là chuỗi có giới hạn và phải phân tích được, khớp tệp. Không lấy số trang EPUB làm định danh bền vững.

## 5. Giao diện
Thanh công cụ gồm về thư viện, tên sách, mục lục, đánh dấu và thiết lập. Máy tính có thanh bên280px; điện thoại dùng bảng trượt có giữ tiêu điểm bàn phím, đóng bằng Escape rồi trả tiêu điểm về nút mở.
Vùng đọc có min-width:0; chỉ cuộn ngang trong vùng xem khi phóng to. Màu theo BD-01; EPUB áp kiểu vào phạm vi nội dung, không đảo màu ảnh mặc định. Bộ lọc PDF đọc đêm do người dùng bật, có nhãn nêu ảnh hưởng màu ảnh.
Phím mũi tên không giành thao tác khi đang nhập liệu/hộp thoại hay dùng công cụ hỗ trợ. Luôn có nút và thao tác cuộn; cử chỉ chạm chỉ bổ trợ.

## 6. Mở sách và khôi phục vị trí
Tìm bản kê hoàn chỉnh trên thiết bị → lấy tệp/thông tin cục bộ; nếu thiếu và có mạng thì gọi LibraryReadService → tải bộ xử lý → kiểm phiên bản tệp/vị trí → khôi phục → phát ready → bắt đầu tự lưu.
Khi đổi sách, hủy yêu cầu và giải phóng bộ xử lý cũ để kết quả cũ không ghi vào sách mới.
Tệp chưa hỗ trợ, có DRM hoặc mật khẩu được báo rõ; bản đầu không lưu mật khẩu. Nếu progress.locator=null, mở đầu sách với nhãn Chưa bắt đầu, chỉ tự lưu sau điều hướng/đọc ổn định có chủ ý. Vị trí lỗi: giữ bản cũ, hỏi về đầu sách hoặc chọn chương; chỉ lưu sau khi người dùng chủ động điều hướng.
Trước đổi kích thước/cỡ chữ, giữ CFI rồi dàn trang lại và khôi phục; không tự ghi trang 1 trong lúc dàn lại.

## 7. Thực thi quy tắc
Kiểm giới hạn trang, phân tích vị trí hợp lệ và dùng thông tin tệp bất biến. EPUB không chạy mã lệnh. Chặn tài nguyên ngoài tại bộ hiển thị và bằng CSP; không chỉ lọc thông tin mô tả.

## 8. Sự kiện
ready/location/error chỉ dùng trong giao diện, không qua hệ thống môi giới thông điệp.

## 9. Tác vụ nền
Máy chủ không vẽ hay chuyển đổi sách. Phân tích nội dung trong trình duyệt/tiến trình nền có giới hạn thời gian, cho hủy và báo lỗi có cách khắc phục.

## 10. AI
Không OCR hoặc AI tự sinh mục lục ở bản đầu.

## 11. Hiệu năng
Không đưa toàn bộ PDF dài vào DOM; thử bộ 500 trang và ghi mức bộ nhớ cao nhất cùng cấu hình máy. EPUB chỉ tải phần cần; giới hạn gói nén trước giải nén.

## 12. Bảo mật
Theo BD-03. Phải chứng minh tắt mã lệnh bằng dữ liệu độc hại mẫu. Nếu không giữ được vùng cách ly mà vẫn dùng CFI, chưa phát hành EPUB; chọn bộ xử lý khác và ghi quyết định kiến trúc.


## 13. Kế hoạch kiểm thử
| Nhóm | Bằng chứng cần tạo |
|---|---|
| Yêu cầu và nghiệm thu | Mỗi cặp FR/AC có kiểm thử mang mã tương ứng; chưa có kết quả thực thi |
| Quy tắc nghiệp vụ | Mỗi BR có kiểm thử chứng minh bỏ điều kiện bảo vệ sẽ gây lỗi |
| Cách ly dữ liệu | Dùng hai danh tính người đọc; kiểm tra danh sách, chi tiết, sửa dữ liệu và tải tệp không vượt quyền; kiểm tra điều kiện lọc trong truy vấn |
| API | Dữ liệu không hợp lệ, UUID/vị trí sai, mã 404/409, thiếu If-Match trả 428, thử lại không gây tác dụng lặp |
| Giao diện | Đang tải, trống, lỗi có thử lại, không có quyền/không tìm thấy; bàn phím; sáng/tối; độ rộng 375/768/1280px |
| Luồng sử dụng | Thư viện → đọc → lưu → tải lại trang; thực hiện tình huống riêng của phân hệ trên thiết bị thật |
| Khả năng phục hồi | Mất mạng trước/sau phản hồi, tải lại trang, phiên bản tệp cũ, hết dung lượng thiết bị/ổ đĩa |
Bộ PDF mẫu gồm văn bản tiếng Việt, bản quét ảnh, có/không mục lục gốc, trang xoay, 500 trang, tệp hỏng và tệp mã hóa. Bộ EPUB mẫu gồm EPUB2 có NCX, EPUB3 có mục lục, nội dung tự dàn trang, ảnh/phông chữ tiếng Việt, thiếu mục lục, ZIP hỏng và nội dung độc hại.
EPUB bố cục cố định và PDF mật khẩu ngoài bản đầu theo D5; kiểm tệp đó bị từ chối đúng lý do. Dữ liệu mẫu phải có quyền sử dụng hợp pháp; lưu bản kê mã kiểm toàn vẹn và giấy phép, không đưa sách vi phạm bản quyền vào Git.

## 14. Đối chiếu yêu cầu với thiết kế
### 14.1 Yêu cầu → quy tắc → nghiệm thu
| Yêu cầu | Quy tắc liên quan | Tiêu chí nghiệm thu | Tình huống sử dụng |
|---|---|---|---|
| FR-02-01 | BR-02-01 | AC-02-01, AC-02-07 | UC-02-01 |
| FR-02-02 | BR-02-02 | AC-02-02, AC-02-08 | UC-02-01 |
| FR-02-03 | BR-02-02 | AC-02-03, AC-02-09 | UC-02-02 |
| FR-02-04 | GBR-07 | AC-02-04, AC-02-13 | UC-02-02 |
| FR-02-05 | BR-02-04 | AC-02-05, AC-02-12 | UC-02-01 |
| FR-02-06 | BR-02-03, GBR-02 | AC-02-06, AC-02-10, AC-02-11, AC-02-14 | UC-02-01 |

### 14.2 Nghiệm thu → thiết kế/API/màn hình → kiểm chứng
Đọc hợp đồng trường/lỗi tại BD-06; màn hình cụ thể tại BD-SCREEN-INDEX. Tham chiếu mục là trong BD này trừ khi ghi tên tài liệu khác. Kiểm thử dưới chỉ là dự kiến, không phải kết quả đạt.
| Tiêu chí | Quy tắc chính | Mục thiết kế | API/màn hình liên quan | Cách kiểm chứng dự kiến |
|---|---|---|---|---|
| AC-02-01 | BR-02-01 | §4, §6 | content/progress; SC-02-01 | test_AC_02_01; trình duyệt/thiết bị thật |
| AC-02-02 | BR-02-02 | §4, §6 | content/progress; SC-02-01 | test_AC_02_02; trình duyệt/thiết bị thật |
| AC-02-03 | BR-02-02 | §5 | content/progress; SC-02-01 | test_AC_02_03; trình duyệt/thiết bị thật |
| AC-02-04 | GBR-07 | §5 | content/progress; SC-02-01 | test_AC_02_04; trình duyệt/thiết bị thật |
| AC-02-05 | BR-02-01 | §6 | content/progress; SC-02-01 | test_AC_02_05; trình duyệt/thiết bị thật |
| AC-02-06 | GBR-02 | §2, §6 | content/progress; SC-02-01 | test_AC_02_06; trình duyệt/thiết bị thật |
| AC-02-07 | BR-02-01 | §4, §5 | content/progress; SC-02-01 | test_AC_02_07; trình duyệt/thiết bị thật |
| AC-02-08 | BR-02-02 | §4 | content/progress; SC-02-01 | test_AC_02_08; trình duyệt/thiết bị thật |
| AC-02-09 | BR-02-02 | §5 | content/progress; SC-02-01 | test_AC_02_09; trình duyệt/thiết bị thật |
| AC-02-10 | BR-02-03 | §6 | content/progress; SC-02-01 | test_AC_02_10; trình duyệt/thiết bị thật |
| AC-02-11 | GBR-07 | §6 | content/progress; SC-02-01 | test_AC_02_11; trình duyệt/thiết bị thật |
| AC-02-12 | BR-02-04 | §12; BD-03 §4 | content/progress; SC-02-01 | test_AC_02_12; trình duyệt/thiết bị thật |
| AC-02-13 | BR-02-02 | §6 | content/progress; SC-02-01 | test_AC_02_13; trình duyệt/thiết bị thật |
| AC-02-14 | GBR-01 | §6; BD-M04 §6.5 | content/progress; SC-02-01 | test_AC_02_14; trình duyệt/thiết bị thật |

### 14.3 Quy tắc nghiệp vụ và khả năng truy cập màn hình
| Mã | Thiết kế và kiểm chứng |
|---|---|
| BR-02-01 | §3–§7, §12; test_BR_02_01 và các AC liên quan |
| BR-02-02 | §3–§7, §12; test_BR_02_02 và các AC liên quan |
| BR-02-03 | §3–§7, §12; test_BR_02_03 và các AC liên quan |
| BR-02-04 | §3–§7, §12; test_BR_02_04 và các AC liên quan |
| UC-02-01 | §4–§6, RD §4; kiểm đi trọn luồng chính/ngoại lệ |
| UC-02-02 | §4–§6, RD §4; kiểm đi trọn luồng chính/ngoại lệ |
| SC-02-01 | §5 và BD-SCREEN-INDEX, kiểm mở bằng nút/trình đơn |

## 15. Vấn đề cần quyết định
API/cấu trúc dữ liệu đã chốt bản1.0; không còn quyết định sản phẩm mở. Thay đổi cần CR. Việc xác minh kỹ thuật vẫn phải thực hiện; chưa có mã nguồn hay kiểm chứng ứng dụng đang chạy.

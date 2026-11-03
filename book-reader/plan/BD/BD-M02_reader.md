# BD-M02 — Trình đọc PDF và EPUB

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.

Đây là thiết kế đề xuất, chưa phải tính năng đã triển khai. Quyết định sản phẩm chưa xác nhận xem management/OPEN-DECISIONS.md.

Tài liệu yêu cầu: ../RD/RD-02_reader.md · Giai đoạn: P1/P2

## 1. Tóm tắt
Khung đọc chung, PDF và EPUB tự dàn nội dung; hiển thị sáng/tối, điều chỉnh cách đọc và tiếp tục từ định danh vị trí.
Áp dụng chuẩn chung BD-00, giao diện BD-01, dữ liệu BD-02, bảo mật BD-03 và hạ tầng BD-05. Bộ xử lý đọc sách xem BD-M02; bản đầu không có tính năng AI.

## 2. Giao diện bộ đọc
ReaderAdapter cung cấp open(file, locator?), navigate(locator), getLocation(), getToc(), applySettings(), dispose(); phát các sự kiện ready/location/error tương ứng Sẵn sàng/Đổi vị trí/Lỗi. Giao diện TypeScript không phụ thuộc React.
ReaderShell điều phối và hiển thị; MOD-04 lưu vị trí; MOD-03 điều hướng. open() chỉ cho lưu vị trí sau khôi phục thành công; lần hiển thị đầu không được đặt lại tiến độ máy chủ.

## 3. Dữ liệu và API
Không có bảng riêng cho bộ đọc. BookReadDescriptor từ MOD-01 gồm bookId,fileId,format,checksum,contentUrl,metadata. Thiết lập/tiến độ theo BD-M04; mục lục theo BD-M03.
Khi ngoại tuyến dùng bản kê đã kiểm chứng trên thiết bị; không bắt buộc gọi API trước khi tìm tệp cục bộ.

## 4. Bộ xử lý và định danh vị trí
PDF dùng react-pdf/PDF.js; phiên bản chờ thử nghiệm. Tiến trình xử lý PDF cùng nguồn ứng dụng, được đóng gói cục bộ để dùng ngoại tuyến. ResizeObserver tính chiều rộng trang; chỉ hiển thị trang hiện tại và vùng lân cận có giới hạn. Hủy lần vẽ/tải cũ, giải phóng tiến trình và URL tạm khi đổi sách. Lớp văn bản/chú thích chỉ hoạt động nếu tệp có nội dung tương ứng.
EPUB đề xuất epub.js; cần thử nghiệm CFI, đổi kích thước, màu và vùng cách ly bảo mật trước khi chốt. Gắn nội dung vào iframe; vô hiệu mã lệnh, biểu mẫu và cửa sổ bật lên; loại tài nguyên/liên kết nguy hiểm theo BD-03. Nội dung tự dàn lại mặc định một cột trên điện thoại, có tùy chọn cuộn/phân trang. EPUB bố cục cố định chờ quyết định #6.
Định danh PDF: {type:"pdf",fileId,page,offsetY}; page bắt đầu từ 1, offsetY từ 0 đến 1 theo chiều cao trang.
Định danh EPUB: {type:"epub",fileId,href,cfi}; href là đường dẫn tương đối trong danh sách nội dung, cfi là chuỗi có giới hạn và phải phân tích được, khớp tệp. Không lấy số trang EPUB làm định danh bền vững.

## 5. Giao diện
Thanh công cụ gồm về thư viện, tên sách, mục lục, đánh dấu và thiết lập. Máy tính có thanh bên đề xuất 280px; điện thoại dùng bảng trượt có giữ tiêu điểm bàn phím, đóng bằng Escape rồi trả tiêu điểm về nút mở.
Vùng đọc có min-width:0; chỉ cuộn ngang trong vùng xem khi phóng to. Màu theo BD-01; EPUB áp kiểu vào phạm vi nội dung, không đảo màu ảnh mặc định. Bộ lọc PDF đọc đêm do người dùng bật, có nhãn nêu ảnh hưởng màu ảnh.
Phím mũi tên không giành thao tác khi đang nhập liệu/hộp thoại hay dùng công cụ hỗ trợ. Luôn có nút và thao tác cuộn; cử chỉ chạm chỉ bổ trợ.

## 6. Mở sách và khôi phục vị trí
Tìm bản kê hoàn chỉnh trên thiết bị → lấy tệp/thông tin cục bộ; nếu thiếu và có mạng thì gọi LibraryReadService → tải bộ xử lý → kiểm phiên bản tệp/vị trí → khôi phục → phát ready → bắt đầu tự lưu.
Khi đổi sách, hủy yêu cầu và giải phóng bộ xử lý cũ để kết quả cũ không ghi vào sách mới.
Tệp chưa hỗ trợ, có DRM hoặc mật khẩu được báo rõ; bản đầu không lưu mật khẩu. Vị trí lỗi: giữ bản cũ, hỏi về đầu sách hoặc chọn chương; chỉ lưu sau khi người dùng chủ động điều hướng.
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
EPUB bố cục cố định chưa cam kết trước quyết định #6. Dữ liệu mẫu phải có quyền sử dụng hợp pháp; lưu bản kê mã kiểm toàn vẹn và giấy phép, không đưa sách vi phạm bản quyền vào Git.

## 14. Đối chiếu yêu cầu với thiết kế
### 14.1 Yêu cầu và tiêu chí nghiệm thu → thiết kế và kiểm thử
| FR | AC | Mục thiết kế | Tên kiểm thử dự kiến |
|---|---|---|---|
| FR-02-01 | AC-02-01 | §4, §6 | test_FR_02_01_AC_02_01 |
| FR-02-02 | AC-02-02 | §4, §6 | test_FR_02_02_AC_02_02 |
| FR-02-03 | AC-02-03 | §5 | test_FR_02_03_AC_02_03 |
| FR-02-04 | AC-02-04 | §5 | test_FR_02_04_AC_02_04 |
| FR-02-05 | AC-02-05 | §6 | test_FR_02_05_AC_02_05 |
| FR-02-06 | AC-02-06 | §2, §6 | test_FR_02_06_AC_02_06 |

### 14.2 Quy tắc nghiệp vụ → cơ chế thực thi
| BR | Mục thiết kế | Tên kiểm thử dự kiến |
|---|---|---|
| BR-02-01 | §4 | test_BR_02_01 |
| BR-02-02 | §4, §6 | test_BR_02_02 |
| BR-02-03 | §6 | test_BR_02_03 |
| BR-02-04 | §12 | test_BR_02_04 |

### 14.3 Tình huống sử dụng và màn hình
| ID | Thiết kế |
|---|---|
| UC-02-01 | §4–§6 |
| UC-02-02 | §4–§6 |
| SC-02-01 | §5 và BD-SCREEN-INDEX |

## 15. Vấn đề cần quyết định
Xem OPEN-DECISIONS. API và cấu trúc dữ liệu là bản nháp cần rà soát; chưa có mã nguồn hay kiểm chứng ứng dụng đang chạy.

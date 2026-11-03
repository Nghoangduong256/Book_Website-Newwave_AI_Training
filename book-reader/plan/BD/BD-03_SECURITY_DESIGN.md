# BD-03 — Bảo mật và chế độ cá nhân

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


## 1. Ranh giới danh tính
Bộ cung cấp CurrentReader ở chế độ cá nhân dùng người đọc cố định trong cấu hình máy chủ, không lấy từ nội dung/tiêu đề/tham số yêu cầu. AccessPolicy dùng danh mục RD-00.
Mọi truy vấn tầng dữ liệu lọc chủ sở hữu/người đọc; mã không được thấy trả 404, thiếu quyền thao tác trả 403. Dùng hai danh tính giả lập khi kiểm thử, không mở tiêu đề chọn danh tính thử nghiệm trong sản phẩm.
Chế độ cá nhân chưa xác thực: người truy cập được máy chủ có thể thao tác toàn thư viện. Mặc định chỉ lắng nghe loopback; điện thoại cần HTTPS riêng tư hoặc đường hầm có kiểm soát truy cập theo quyết định #1. Không công khai Internet khi chưa xác thực; lọc chủ sở hữu chưa ngăn được truy cập trái phép qua mạng.

## 2. Tải lên và trả nội dung tệp
Chỉ nhận PDF/EPUB qua kiểm dữ liệu/cấu trúc; truyền theo luồng giới hạn. Tên gốc chỉ là thông tin mô tả. Khóa lưu ngẫu nhiên, đường dẫn chuẩn hóa phải trong vùng lưu; không đi theo liên kết tượng trưng ra ngoài.
Kiểm gói EPUB: vượt đường dẫn, đường dẫn tuyệt đối, liên kết tượng trưng, số mục, dung lượng sau giải nén, tỷ lệ nén. Giới hạn đề xuất ở #3.
Tệp ngoài vùng công khai; API kiểm quyền trước cả HEAD/yêu cầu khoảng dữ liệu, không lộ đường dẫn.
Trả tệp qua API là điều chỉnh có chủ đích so với mẫu dùng URL ký sẵn: dễ chạy một máy chủ và kiểm quyền thống nhất. Khi đổi S3, StoragePort có thể trả URL ký thời hạn ngắn; ghi quyết định kiến trúc về thời hạn/CORS/khoảng dữ liệu lúc triển khai.
Dùng Cache-Control: private. service worker không tự lưu đệm API/tệp; tải ngoại tuyến là thao tác riêng.

## 3. Nhập URL
Đề xuất chỉ HTTPS; cấm thông tin đăng nhập trong URL, giao thức khác và cổng ngoài danh sách 443.
Phân giải toàn bộ A/AAAA; chặn loopback, mạng riêng, link-local, multicast, địa chỉ dành riêng và dịch vụ metadata, kể cả dạng IPv4 ánh xạ.
Kiểm lại mỗi lần chuyển hướng, tối đa ba lần. Chống đổi DNS sau kiểm bằng kết nối đúng IP đã xét, vẫn giữ tên máy cho TLS/SNI. Không chỉ kiểm tên rồi cho thư viện tự phân giải lại.
Giới hạn dữ liệu thật kể cả thiếu Content-Length, giải nén và thời gian kết nối/đọc/toàn thao tác; bỏ cookie/thông tin xác thực. Không tải HTML hoặc thu thập trang. Nếu thư viện HTTP không cố định IP an toàn thì chưa phát hành nhập URL.
Không ghi URL đầy đủ/tham số vào nhật ký; chỉ giữ thông tin nguồn tối thiểu được bảo vệ và có thời hạn. Kiểm cả tiêu đề và đích chuyển hướng độc hại.

## 4. Nội dung EPUB/PDF không tin cậy
EPUB tắt mã lệnh; chặn biểu mẫu, cửa sổ bật lên và điều hướng trang cha. CSP ngăn kết nối ngoài; bộ tìm tài nguyên chỉ dùng mục ZIP đã kiểm. Lọc HTML/CSS có URL ngoài, @import, mã SVG và hàm xử lý sự kiện. Thông tin sách/tên mục lục là văn bản thuần.
Không thêm allow-scripts để sửa lỗi CFI. Thử nghiệm phải chứng minh vùng cách ly bảo mật vẫn hỗ trợ chọn chữ/điều hướng. Liên kết ngoài chỉ mở sau thao tác xác nhận, dùng noopener.
PDF không bật mã lệnh nhúng, hành động chạy chương trình hay thực thi tệp đính kèm. Liên kết ngoài cần xác nhận; không tự tải URL trong mục lục. Bộ xử lý PDF đóng gói cùng nguồn, không gửi sách cho nhà cung cấp ngoài.

## 5. Ghép module tài khoản tương lai
Module tài khoản cung cấp ReaderContext đã xác thực và AccessPolicy; phiên sai/hết hạn trả 401. Khi bật tài khoản, vô hiệu bộ cung cấp cá nhân; dừng khởi động nếu cấu hình mâu thuẫn.
Gắn reader_id cũ với tài khoản sau xác minh quyền sở hữu, trong giao dịch và có sao lưu; không nhận reader_id tùy ý.
Kiểm quyền cả tệp/tác vụ/bản kê/điều hướng/tiến độ. Đăng xuất/đổi tài khoản phải xóa hoặc vô hiệu phân vùng cũ; không gửi hàng đợi dưới danh tính mới. Không thu hồi tức thời thiết bị đang mất mạng; mã hóa/DRM ngoài bản đầu.

## 6. Nhật ký và bí mật
Ghi nhật ký nhập/xóa/thao tác nhạy cảm bị từ chối; không ghi mã truy cập, đường dẫn, tham số URL hay nội dung sách. .env không vào Git; cấu hình mẫu không chứa bí mật thật.
Giới hạn tần suất/dung lượng, danh sách nguồn được phép chính xác và cùng nguồn cho trình duyệt. Khi triển khai tài khoản cần thiết kế bổ sung phiên/cookie/CSRF.

## 7. Kiểm chứng bảo mật
Kiểm hai chủ sở hữu với danh sách/chi tiết/sửa/tải/HEAD/khoảng dữ liệu/tác vụ; URL chuyển hướng và đổi DNS; ZIP vượt đường dẫn/bom nén; EPUB độc hại không chạy mã hay gọi mạng; không bỏ qua điều kiện bảo vệ; từ chối cấu hình công khai chế độ cá nhân. Mới là kế hoạch, chưa chạy.

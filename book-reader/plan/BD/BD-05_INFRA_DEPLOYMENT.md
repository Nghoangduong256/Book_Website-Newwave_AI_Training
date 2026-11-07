# BD-05 — Hạ tầng và kiểm chứng

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.

## 1. Sơ đồ triển khai mạng nội bộ đã chốt

Bản đầu chỉ truy cập trong mạng nội bộ nhà. Một PC/máy chủ tại nhà chạy ứng dụng và cần bật khi thiết bị khác truy cập hoặc đồng bộ. Điện thoại Wi-Fi và PC dây mạng dùng được nếu cùng mạng và được phép kết nối.
nginx HTTPS lắng nghe địa chỉ mạng nội bộ theo cấu hình; /api/v1 giữ tiền tố khi chuyển tới Spring. Spring và SQL Server chỉ lộ cho nginx/ứng dụng qua loopback hoặc mạng container riêng; không mở cổng cơ sở dữ liệu ra LAN.
Tường lửa chỉ cho các thiết bị/địa chỉ nội bộ được chọn; không mở chuyển tiếp cổng router, tên miền/tunnel công khai hoặc truy cập Internet ở bản đầu. 4G/5G ngoài nhà không vào máy chủ; đọc bản ngoại tuyến đã tải đủ vẫn được.
HTTPS nội bộ dùng chứng chỉ được thiết bị tin cậy và tên/địa chỉ nội bộ ổn định; lựa chọn công cụ cấp/cài chứng chỉ xác minh ở P0. HTTPS không thay xác thực; người được kết nối tới ứng dụng cá nhân có thể thao tác toàn thư viện.
Giao diện biên dịch tĩnh → nginx → Spring Boot → SQL Server và vùng tệp riêng tư. Không dùng Celery/Valkey/Next khi chạy. Phiên bản/giấy phép/kiến trúc máy hỗ trợ SQL Server còn phải kiểm.

## 2. Giao diện cấu hình

APP_MODE=personal, PERSONAL_READER_ID, thông tin kết nối cơ sở dữ liệu, STORAGE_ROOT, PUBLIC_ORIGIN và giới hạn dung lượng/giải nén/thời gian/tác vụ đồng thời.
Máy chủ giữ cấu hình, giao diện chỉ nhận khả năng an toàn; không lộ thông tin xác thực. Giới hạn tải của nginx khớp máy chủ và kiểm cả dữ liệu thực nhận. Ví dụ kế thừa chưa sẵn sàng chạy.

## 3. Kiểm chứng dự kiến

Máy chủ: ./mvnw verify, Windows dùng mvnw.cmd; tích hợp SQL Server thật; chạy tiến trình, đợi sẵn sàng có hạn và gọi API qua trung gian.
Giao diện: npm ci, npm run check, npm run build; Playwright kiểm luồng đầy đủ và bố cục. Lệnh chưa tồn tại phải tạo P0, không ghi đã đạt.
CI kiểm mã API sinh khớp giao diện tích hợp, kiểm thử đơn vị/tích hợp và biên dịch tĩnh. Sau triển khai kiểm nhanh chức năng. /health báo tiến trình còn hoạt động khác với sẵn sàng cơ sở dữ liệu/lưu trữ; nginx khỏe không chứng minh API khỏe.

## 4. Ứng dụng web có thể cài đặt (PWA)

service worker chỉ lưu trước phần khung/tài nguyên có mã băm, bộ xử lý và phông chữ; dự phòng ngoại tuyến cho /reader/:id. Không lưu đệm API/tệp đại trà.
Khi còn thay đổi chờ gửi phải thông báo trước cập nhật; cập nhật IndexedDB giữ tương thích, không làm mất dữ liệu. HTTPS/chứng chỉ trên điện thoại là điều kiện vào P3.

## 5. Sao lưu, lưu giữ và phục hồi

Sao lưu cơ sở dữ liệu+tệp tại mốc nhất quán mỗi ngày, giữ 7 bản; giữ dấu xóa sách 30 ngày theo #5 đã duyệt.
Chưa cam kết mức mất dữ liệu/thời gian phục hồi (RPO/RTO) trước diễn tập. Phục hồi vào hệ riêng, kiểm khóa ngoại/mã toàn vẹn và mở sách. Chỉ xóa tệp vật lý sau thời hạn và đối soát tác vụ. Hết ổ đĩa phải báo rõ, không tạo sách hoặc báo hoàn tất giả.

## 6. Danh sách điều chỉnh mẫu

Trước lập trình: chuyển CLAUDE/rules/skills/agents sang Java/Vite; thay Dockerfiles/Compose/Makefile, README hai phía, STACK, GETTING-STARTED.
Rà soát rồi xóa/đánh dấu phần Python/Celery/AI không dùng trong bản sao; không sửa template-ai. AGENTS là hướng dẫn đầu vào, thiết kế hiện tại ưu tiên ví dụ cũ. Tài liệu đã chốt bản1.0; chưa viết kế hoạch triển khai.

## 7. Triển khai Internet và Cloud về sau
Theo D4, đây là giai đoạn riêng sau bản đầu. Chủ dự án sẽ cân nhắc Cloud, có thể AWS; chưa chọn nhà cung cấp, dịch vụ, vùng triển khai, ngân sách hay mua tài nguyên.
Trước công khai phải có xác thực/kiểm soát truy cập, HTTPS/tên miền, cấu hình mạng an toàn, sao lưu/giám sát, đánh giá chi phí và cách chuyển DB+tệp. Phân tích SQL Server/giấy phép/lưu trữ nếu đổi máy chủ; không mặc định phải chuyển cơ sở dữ liệu hoặc sử dụng S3.
Về kiến trúc giữ StoragePort và CurrentReader/AccessPolicy để hỗ trợ thay hạ tầng, nhưng chưa triển khai hay cam kết tích hợp sẵn dịch vụ AWS.

## 8. Giá trị vận hành đã duyệt
Tệp lưu trên ổ đĩa máy chủ qua StoragePort. Sao lưu DB+tệp hằng ngày, giữ7bản tại thiết bị/vị trí tách ổ chứa dữ liệu gốc; cấu hình đích cụ thể trước dữ liệu thật. Dấu xóa giữ30ngày, không đồng nghĩa có Thùng rác. Không tự chuyển dữ liệu cũ. Giới hạn100MiB/tệp và giới hạn EPUB/URL/mục lục theo quyết định #3; nginx/ứng dụng phải thống nhất. Kiểm chứng khôi phục và tải lớn chưa thực hiện.

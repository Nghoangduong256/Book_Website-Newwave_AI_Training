# BD-02 — Mô hình dữ liệu SQL Server

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


## 1. Quy ước
Khóa chính dùng uniqueidentifier do ứng dụng tạo ngẫu nhiên; chấp nhận UUID do trình duyệt tạo cho dữ liệu điều hướng ngoại tuyến. created_at/updated_at dùng datetime2(3), lưu UTC; version dùng bigint và @Version, khởi tạo bằng 1. rowversion của SQL Server không phải thời gian.
Mỗi khóa ngoại có chỉ mục, dùng ON DELETE NO ACTION để tránh nhiều đường xóa dây chuyền. Bảng nghiệp vụ có created_by/updated_by tham chiếu người đọc, cùng deleted_at cho phép trống. Tiến độ/thiết lập là trạng thái hiện tại, có phiên bản và không đánh dấu xóa riêng.
UUID người đọc cá nhân cố định theo cấu hình, khởi tạo lặp lại không nhân đôi; không tạo lại mỗi lần khởi động. Đây là cấu trúc dự kiến, chưa có lệnh cập nhật cơ sở dữ liệu được thực thi.

## 2. Bảng và ràng buộc
Tên bảng, trường và kiểu dữ liệu giữ tiếng Anh để triển khai chính xác. UQ là ràng buộc duy nhất; FK là khóa ngoại. “Cột chung” gồm các cột thời gian, người tạo/sửa, phiên bản và dấu xóa tại §1.
| Bảng | Cột và ý nghĩa | Khóa và ràng buộc |
|---|---|---|
| id_readers | id, display_name nvarchar(100), mode varchar(20), cột chung | mode PERSONAL hoặc ACCOUNT; liên kết tài khoản bổ sung sau |
| lib_books | id,owner_reader_id,title nvarchar(255),author có thể trống,publish_year int có thể trống,tags_json nvarchar(max),format varchar(4), cột chung | title không rỗng; format PDF/EPUB; năm 1..9999; ISJSON(tags_json); UQ(id,owner_reader_id) |
| lib_files | id,book_id,owner_reader_id,storage_key nvarchar(500),sha256 char(64),size_bytes bigint,mime varchar(100),original_name nvarchar(255), cột chung | size_bytes>0; UQ(book_id): bản đầu một phiên bản tệp/sách; UQ(storage_key); UQ(id,book_id,owner_reader_id); FK ghép sách/chủ sở hữu |
| lib_import_jobs | id,owner_reader_id,state,source_url được bảo vệ/có thể trống,result_book_id có thể trống,error_code,attempts,lease_until,deadline_at, cột chung | QUEUED/RUNNING/READY/FAILED; READY cần kết quả; FK ghép sách kết quả/chủ sở hữu |
| nav_toc_sets | id,reader_id,book_id,file_id, cột chung | UQ(reader_id,book_id,file_id); version kiểm soát cập nhật đồng thời toàn cây |
| nav_toc_entries | id,set_id,reader_id,book_id,file_id,parent_id có thể trống,title nvarchar(200),sort_order int,locator_json nvarchar(max), cột chung | UQ(id,reader_id,book_id,file_id); FK cha cùng người đọc/sách/tệp; FK bộ mục lục theo set/người đọc/sách/tệp; sort_order>=0, ISJSON |
| nav_bookmarks | id,reader_id,book_id,file_id,title nvarchar(200),locator_json nvarchar(max), cột chung | FK ghép tệp/sách/người đọc; ISJSON |
| rd_progress | id,reader_id,book_id,file_id,locator_json nvarchar(max),last_device_id UUID, cột chung | UQ(reader_id,book_id,file_id); FK ghép tệp/sách/người đọc; ISJSON |
| rd_settings | id,reader_id,settings_json nvarchar(max), cột chung | UQ(reader_id), ISJSON; bản đầu chỉ sao lưu khi người dùng chủ động |
| sys_idempotency | id,reader_id,method,path,key,request_hash,result_json,status_code,expires_at,created_at | UQ(reader_id,method,path,key); ghi kết quả cùng giao dịch; dọn sau hết hạn |
| sys_audit | id,reader_id,action,entity_id,trace_id,created_at | Chỉ thêm, không ghi URL đầy đủ, mã truy cập hoặc toàn bộ nội dung yêu cầu |
Khóa ngoại (file_id,book_id,reader_id) tham chiếu lib_files(id,book_id,owner_reader_id): bản đầu chỉ chủ sách có dữ liệu đọc. Chia sẻ tương lai cần mô hình quyền và bước chuyển dữ liệu riêng.
nav_toc_sets cũng có UQ(id,reader_id,book_id,file_id) để tạo FK ghép từ mục con. Khóa ngoại chủ sở hữu/người đọc bắt buộc NOT NULL; chỉ cho phép bỏ created_by/updated_by ở bước khởi tạo được ghi rõ.
locator_json chỉ chứa dữ liệu có kiểu theo định dạng; chủ sở hữu/sách/tệp dùng cột riêng. Java kiểm locator.fileId == file_id và định dạng khớp tệp; không truy vấn/sắp xếp theo JSON.

## 3. Chỉ mục
lib_books(owner_reader_id,deleted_at,title,id) phục vụ titleAsc; (owner_reader_id,deleted_at,created_at,id) phục vụ createdDesc. Tìm chứa chuỗi bằng LIKE có thoát ký tự đặc biệt; không khẳng định dùng được tìm kiếm chỉ mục hiệu quả khi có ký tự đại diện đầu chuỗi. Đo yêu cầu phi chức năng trước khi thêm tìm kiếm toàn văn.
rd_progress duy nhất theo người đọc/sách/tệp. Mục lục dùng (set_id,parent_id,sort_order,id); đánh dấu dùng (reader_id,book_id,created_at,id). Tác vụ nhập dùng (state,lease_until); bản kê đồng bộ dùng (owner_reader_id,updated_at,id).
Mỗi FK có chỉ mục; chỉ mục duy nhất có thể đáp ứng nếu thứ tự các cột đầu phù hợp.

## 4. Mốc đồng bộ
Thay đổi sách cập nhật updated_at từ máy chủ. Phân trang bản kê bằng thời gian+id, cố định mốc trên cho một lượt quét. Cần quy tắc ảnh chụp giao dịch/con trỏ để không bỏ sót thay đổi giữa các trang.
Thử nghiệm chế độ cách ly ảnh chụp của SQL Server hoặc nhật ký phiên bản trước triển khai. Nếu chưa chứng minh an toàn, đối soát toàn bộ thư viện là phương án bản đầu với mục tiêu tối đa 1.000 sách. Đề xuất giữ dấu xóa 30 ngày; con trỏ hết hạn buộc đối soát toàn bộ.

## 5. Tệp và giao dịch
Không lưu nội dung nhị phân trong cơ sở dữ liệu; thao tác ổ đĩa không mặc nhiên nguyên tử cùng SQL. Bản kê nhập bền vững, xử lý bù và đối soát theo BD-M01.
Đánh dấu xóa thông tin sách trước, dọn ổ đĩa sau thời hạn; không xóa nhật ký hoạt động theo tệp. Sao lưu gồm cơ sở dữ liệu và tệp/bản kê tại mốc nhất quán; bộ nhớ đệm trình duyệt không phải dữ liệu sao lưu máy chủ.

## 6. Thứ tự cập nhật cấu trúc
V001: danh tính/nhật ký; V002: thư viện/tệp/tác vụ; V003: tiến độ/thiết lập/chống thực hiện lặp; V004: mục lục/đánh dấu. Khóa ghép và ràng buộc nằm trong lệnh cập nhật, kiểm trên SQL Server thật; khởi tạo người đọc hai lần không nhân đôi.
Không tự nhập dữ liệu cũ: chạy thử không ghi để đối chiếu bookId số cũ sang UUID; xuất IndexedDB từ trình duyệt cũ nếu cần; kiểm mã toàn vẹn trước gắn tệp. Chờ xác nhận quyết định #5.

## 7. Kiểm chứng
Cập nhật trên cơ sở dữ liệu trống và có mẫu; tranh chấp phiên bản cũ; từ chối khóa ghép sai chủ sở hữu/cha; khởi tạo hai lần; dọn dẹp/đối soát sau sự cố; phục hồi cơ sở dữ liệu cùng tệp.
Quan hệ chính: người đọc → sách → tệp; người đọc+tệp → tiến độ/mục lục/đánh dấu; tác vụ nhập → sách kết quả. Chưa có số đo hay kết quả chạy.

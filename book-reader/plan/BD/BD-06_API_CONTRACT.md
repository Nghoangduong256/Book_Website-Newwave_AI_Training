# BD-06 — Dữ liệu API và xử lý ngoại lệ

Phiên bản: 1.0 · Ngày chốt: 2026-11-07 · Trạng thái: Đã chốt làm chuẩn (Baselined).
Người duyệt: Chủ dự án, xác nhận qua hội thoại ngày 2026-11-07. Duyệt tài liệu không có nghĩa đã triển khai hoặc kiểm thử đạt.


## 1. Phạm vi và quy ước
Bổ sung BD-00 §6; các tuyến có /api/v1. JSON camelCase, UUID chuỗi, thời gian ISO8601 UTC. Trường không được định nghĩa bị từ chối400 UNKNOWN_FIELD; readerId/ownerReaderId không lấy từ client.
Dữ liệu đầu vào được kiểm ở máy chủ. Chuỗi cắt khoảng trắng đầu/cuối; giới hạn ký tự tính Unicode code point, không tính byte. Giới hạn dung lượng/độ sâu theo #3 đã duyệt; cấu hình được và phải kiểm trước phát hành.
Body mẫu dưới minh họa cấu trúc, không phải mã nguồn thực thi. null khác với trường không gửi trên PATCH. Hợp đồng này là nguồn dữ liệu cho OpenAPI khi triển khai.

## 2. Thông tin và nhập sách
### 2.1 BookMetadata
| Trường | Kiểu | Khi nhập | Khi PATCH | Kiểm tra |
|---|---|---|---|---|
| title | string | Tùy chọn; rỗng/thiếu dùng tên tệp đã làm sạch, URL dùng tên tệp đích hoặc Tài liệu không tên | Không gửi giữ nguyên; null/rỗng bị từ chối | Không rỗng sau mặc định, tối đa255 |
| author | string hoặc null | Thiếu → null | Không gửi giữ; null/rỗng → null | Tối đa255 |
| publishYear | integer hoặc null | Thiếu → null | Không gửi giữ; null xóa | 1..9999 |
| tags | string[] | Thiếu → [] | Không gửi giữ; [] xóa hết; null bị từ chối | Tối đa20thẻ, mỗi thẻ1..50; bỏ trùng sau chuẩn hóa |
Không tự lấy nội dung tác giả/tiêu đề bên trong sách làm nguồn ưu tiên ở bản đầu; có thể đề xuất sau. format xác định từ tệp, không cho sửa bằng PATCH.

### 2.2 BookRead và BookReadDescriptor
BookRead: id UUID, title, author, publishYear, tags, format(PDF/EPUB), fileId UUID, checksum SHA256, sizeBytes>0, originalFileName, availability(AVAILABLE/UNREADABLE), unavailableReason(null/FILE_MISSING/FILE_CORRUPT), version>=1, createdAt,updatedAt.
Không có cột trạng thái nhập READY trên book. availability là kết quả kiểm tệp theo BD-M01; sách đã xóa không trả GET detail.
BookReadDescriptor bổ sung contentUrl nội bộ /api/v1/books/{id}/content và mime; không trả storageKey/đường dẫn ổ đĩa. Library list có items,nextCursor; offlineAvailable do client tự tính, không server flag.

### 2.3 Nhập và sách trùng
POST /books/import-file: multipart file bắt buộc, metadata JSON tùy chọn; Idempotency-Key bắt buộc. POST /imports/url: {url,metadata?,duplicateAction?}; url HTTPS trực tiếp bắt buộc. duplicateAction nếu có chỉ CREATE_NEW.
Nhập URL trả202 ImportJobRead; nhập file thành công trả201 BookRead. ImportJobRead gồm id,state(QUEUED/RUNNING/COMPLETED/FAILED),phase(VALIDATING/DOWNLOADING/WAITING_DUPLICATE_CHOICE/COMMITTING hoặc null),bookId hoặc null,error hoặc null,duplicateCandidates[],attempts,createdAt,updatedAt,decisionExpiresAt hoặc null. Mỗi ứng dụng hiển thị tên tiếng Việt, không dùng COMPLETED trước có bookId.
Tệp giống SHA256 của sách đang tồn tại cùng chủ → không tự gộp. Trả409 DUPLICATE_BOOK với candidate bookId cho nhập file; nhập URL giữ RUNNING/WAITING_DUPLICATE_CHOICE và danh sách để chọn. Không lộ sách người khác. Quyết định chọn là thao tác người dùng, không tự thử như lỗi mạng.
File: chọn Mở sách đã có thì GET book đó, không tạo; chọn Vẫn nhập thì gửi lại với duplicateAction=CREATE_NEW (multipart trường chuỗi), khóa mới, có thể cần chọn tệp lại nếu dữ liệu upload đã được dọn. URL: POST /imports/{id}/decision {action:OPEN_EXISTING,bookId} hoặc {action:CREATE_NEW}; Idempotency-Key. bookId bắt buộc thuộc danh sách và còn quyền đọc.
OPEN_EXISTING hoàn tất job với bookId cũ; CREATE_NEW tiếp tục tạo sách riêng. Chờ lựa chọn tối đa24giờ, hiển thị hạn; quá hạn FAILED/DECISION_EXPIRED và dọn tệp tạm; thời gian chờ người dùng không tính vào120giây xử lý mạng mỗi lần. Hủy chọn/đóng form không tự tạo. Không hỗ trợ hủy cứng tác vụ URL ở bản đầu; quay lại vẫn xem job tới hoàn tất/thất bại/hết hạn.
Idempotency-Key khác với kiểm sách trùng: một khóa cũ chỉ phát lại kết quả cùng thao tác; CREATE_NEW là chủ ý khác cần khóa mới.

## 3. Vị trí, tiến độ và thiết lập
### 3.1 ReadingLocator
PDF: {type:"pdf",fileId,page,offsetY}; page integer1..numPages, offsetY number0..1 mặc định0. EPUB: {type:"epub",fileId,href,cfi}; href đường dẫn tương đối thuộc spine, không URL ngoài; cfi chuỗi phân tích được. Giới hạn href<=2048,cfi<=8192ký tự, cấu hình được và cần kiểm với sách mẫu.
Máy chủ kiểm cấu trúc/type/fileId. Giới hạn trang cần metadata được xác nhận hoặc client kiểm thêm; trường hợp máy chủ chưa có numPages không được tuyên bố đã kiểm đầy đủ. Client luôn kiểm vị trí resolve thực tế; không tin CFI hợp lệ cấu trúc là mở được.
### 3.2 ProgressRead/Write
Read: {fileId,locator,version,updatedAt}; locator null là Chưa bắt đầu. Chưa có row version0; đã có reset vẫn version>=1.
Write: {fileId,locator,deviceId}, cả3 bắt buộc; locator có thể null để reset. Version dùng If-Match, không gửi owner. Reset cùng lúc bên kia đọc là conflict như sửa vị trí.
### 3.3 ReaderSettings
PATCH /settings nhận {theme?,pdfNightFilter?,epubFontSize?,epubLineHeight?,epubMargin?,epubFlow?}; theme LIGHT/DARK/SYSTEM, pdfNightFilter boolean, epubFlow PAGINATED/SCROLLED.
Dùng font12..36px, lineHeight1.2..2.4, margin8..48px. Mặc định SYSTEM,false,18,1.6,16,PAGINATED; các giá trị đã chốt thiết kế, cần thử nghiệm trước phát hành; thay đổi hành vi qua CR. Read trả settings+version. GET ban đầu trả mặc định/version0; PATCH đầu dùng If-Match "0", sau đó tăng version. Không tự áp bản sao máy chủ lên thiết lập thiết bị khác.

## 4. Mục lục và đánh dấu
TocRead: {fileId,treeVersion,entries:[{id,parentId,title,sortOrder,locator}]}.
TocWrite: {fileId,entries}, mỗi trường entry bắt buộc trừ parentId có thể null; UUID client tạo, title1..200, sortOrder integer>=0; locator đúng file. Thiếu entries400, entries[] nghĩa muốn cây rỗng nhưng vẫn phải qua quy tắc xóa cha/con. Parent và con cùng cây; không chu trình, không tự làm cha; thứ tự trùng dùng id để ổn định.
BookmarkRead: {id,fileId,title,locator,version,deletedAt,updatedAt}. Create gồm id,fileId,title,locator bắt buộc. PATCH cho title và/hoặc locator, không có trường nào trả400 EMPTY_PATCH; không cho thay id/fileId. DELETE lưu dấu xóa. Tên1..200. Không tự gộp bookmark cùng vị trí.
Khi tạo đánh dấu không nhập tên, giao diện đề xuất tên trang/chương nhưng vẫn gửi title hợp lệ. GET danh sách trả items,nextCursor, bao gồm dấu xóa khi dùng luồng đồng bộ; giao diện ẩn mục đã xóa.

## 5. Nhận dữ liệu nhất quán
### 5.1 LibraryManifest
GET /sync/manifest trả {snapshotId,items:[{bookId,bookVersion,fileId,checksum,deletedAt,availability}],nextCursor,expiresAt}. Duy trì tập id/phiên bản cố định cho toàn lượt: tạo bản chụp toàn danh mục own trong một giao dịch rồi phân trang bản chụp lưu có thời hạn ở sys_sync_snapshots. Cursor ràng owner/snapshot/filter, không cho trộn trang các lượt.
Thời hạn snapshot5phút, cấu hình được. Hết hạn trả410 SYNC_SNAPSHOT_EXPIRED; bỏ lượt dở, lấy lại từ đầu. Chỉ khi đủ trang mới xử lý id vắng mặt. Đây là bản chụp đầy đủ, không con trỏ thay đổi tăng dần.
### 5.2 ReadingSnapshot
GET /books/{id}/reading-snapshot trả {bookId,fileId,checksum,snapshotVersion,progress,toc,bookmarks:[BookmarkRead],capturedAt}. Toàn bộ dữ liệu một sách đọc trong giao dịch SQL Server SNAPSHOT (bật ALLOW_SNAPSHOT_ISOLATION ở P0 và kiểm thực tế). Không phân trang snapshot này ở bản đầu; kiểm hạn mức bộ nhớ theo số đánh dấu trong thử nghiệm, chưa tự cắt bớt.
snapshotVersion tăng khi tiến độ, cây hoặc bookmark đổi. published SyncRevisionService cập nhật sys_book_revisions trong cùng giao dịch nghiệp vụ; các phân hệ không trực tiếp sửa bảng nhau. Nếu đọc thấy book đã xóa thì404 BOOK_NOT_FOUND, không trả dữ liệu đọc như sách đang hoạt động.
Lỗi nhận snapshot không xóa local hoặc gửi đè máy chủ. Server tệp UNREADABLE vẫn cho lấy metadata/dữ liệu đọc nếu book chưa xóa; chỉ chặn đọc bytes.

## 6. Lỗi và đồng thời
| HTTP / code | Tình huống | Hành vi giao diện |
|---|---|---|
| 400 VALIDATION_ERROR/UNKNOWN_FIELD/EMPTY_PATCH | Thiếu/sai trường | Giữ form, chỉ rõ fields |
| 404 BOOK_NOT_FOUND/RESOURCE_NOT_FOUND | Không tồn tại hoặc không được thấy | Không lộ thông tin, trở về danh sách |
| 409 VERSION_CONFLICT | If-Match cũ | Giữ local và currentResource, cho chọn |
| 409 DUPLICATE_BOOK | Sách trùng nội dung | Mở cũ/Vẫn nhập/Hủy |
| 409 IDEMPOTENCY_KEY_REUSED/ID_REUSED | Khóa/id trùng khác nội dung | Không tự gửi như thao tác mới |
| 410 SYNC_SNAPSHOT_EXPIRED | Nhận danh sách dở quá hạn | Lấy bản chụp mới; giữ local |
| 413 FILE_TOO_LARGE | Quá giới hạn | Hiện mức hiện hành |
| 415 UNSUPPORTED_FORMAT | Loại chưa hỗ trợ | Nêu PDF/EPUB hợp lệ |
| 422 INVALID_BOOK/UNSUPPORTED_BOOK_FEATURE/INVALID_LOCATOR/PARENT_HAS_CHILDREN/INVALID_TOC | Hỏng/mật khẩu/DRM/cấu trúc sai | Giữ dữ liệu, hướng sửa rõ |
| 428 PRECONDITION_REQUIRED | Thiếu If-Match | Tải version hiện tại, không ghi đè ngầm |
| 503 STORAGE_UNAVAILABLE | Thiếu/hỏng tệp, hết dung lượng hoặc không truy cập lưu trữ | Báo không thể đọc/lưu và cho thử lại |
Problem body: {type,title,status,code,detail,traceId,fieldErrors?,currentVersion?,currentResource?,candidates?}; VERSION_CONFLICT có currentVersion/currentResource. fieldErrors chứa field/code/message; không chứa đường dẫn ổ đĩa/secret.
Kiểm quyền trước phát lại kết quả; phát lại receipt trước xét If-Match. Tạo mới version0 chỉ là quy ước API, DB sau tạo version1. Không nhận số phiên bản client như quyền tin cậy.

## 7. Ví dụ
Lưu PDF: PUT /api/v1/books/{bookId}/progress, If-Match:"3", Idempotency-Key:<UUID>, body {fileId:<UUID>,locator:{type:"pdf",fileId:<UUID>,page:20,offsetY:0.25},deviceId:<UUID>}. Thành công trả version4 và ETag "4".
Đặt lại: cùng endpoint, body {fileId:<UUID>,locator:null,deviceId:<UUID>} với version4; thành công version5, không xóa đánh dấu/mục lục.
Xung đột:409 {code:"VERSION_CONFLICT",currentVersion:6,currentResource:{locator:...,version:6},...}. Không bỏ bản trang20 của thiết bị trước khi người dùng chọn.
Các ký hiệu <UUID> và ... là minh họa, không phải JSON mẫu để gửi trực tiếp.

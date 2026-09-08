## Checklist nghiệm thu ngày 1

Trước khi kết thúc, hãy tự đánh dấu:

```
[V] Backend chạy ở port 8080
[V] GET /api/books trả HTTP 200
[V] Frontend chạy ở port 5500
[V] Có index.html
[V] Có manage.html
[V] Có reader.html
[V] Chuyển được giữa Thư viện và Quản lý sách
[V] Reader quay lại được Thư viện
[V] Sidebar giống bố cục mockup
[V] Không có inline style
[V] CSS variables hoạt động
[V] Giao diện có min-width 1024px
[V] Console nhận diện jQuery 3.7.1
[V] Không có lỗi đỏ trong Console
```

Bài tự đánh giá cuối ngày
Bạn nên tự trả lời năm câu sau:

1.  grid-template-columns: 220px minmax(0, 1fr) hoạt động như thế nào?

    > Khai báo này chia .app-layout thành hai cột:

         .app-layout {
             display: grid;
             grid-template-columns: 220px minmax(0, 1fr);
         }
         - Cột thứ nhất rộng cố định 220px, dùng cho sidebar.
         - Cột thứ hai nhận toàn bộ không gian còn lại, dùng cho nội dung chính.
         Ví dụ trình duyệt rộng 1440px:
         ┌──────── 220px ────────┬──────── phần còn lại ─────────────┐
         │ Sidebar               │ Main content                       │
         └───────────────────────┴────────────────────────────────────┘
         Ý nghĩa của 1fr
         fr là đơn vị phân chia không gian còn lại của CSS Grid.
         grid-template-columns: 220px 1fr;
         có nghĩa:
         1. Dành 220px cho sidebar.
         2. Cột nội dung lấy một phần của toàn bộ không gian còn lại.
         Tại sao dùng minmax(0, 1fr) thay cho 1fr?
         Mặc định, grid item thường không muốn nhỏ hơn kích thước nội dung của nó. Nếu bên trong có table, PDF hoặc chuỗi rất dài, cột 1fr có thể bị nội dung đẩy rộng và làm tràn layout.
         minmax(0, 1fr)
         có nghĩa:
         - Chiều rộng tối thiểu được phép là 0.
         - Chiều rộng tối đa là một phần không gian còn lại.
         Nó cho phép cột nội dung thực sự co lại trong giới hạn của grid. Phần tử con nào quá lớn phải tự xử lý bằng overflow, xuống dòng hoặc cắt nội dung.

2.  Vì sao cần box-sizing: border-box?
    > Mặc định trình duyệt sử dụng:
        box-sizing: content-box;
        Với content-box, width chỉ tính phần nội dung, chưa bao gồm padding và border.
        Ví dụ:
        input {
            width: 300px;
            padding: 12px;
            border: 1px solid;
        }
        Kích thước thực tế sẽ là:
        300 + 12 + 12 + 1 + 1 = 326px
        Điều này dễ làm input hoặc card vượt khỏi container.
        Khi sử dụng:
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }
        thì width: 300px đã bao gồm:
        - Content.
        - Padding trái/phải.
        - Border trái/phải.
        Kích thước cuối cùng vẫn là 300px.
        Điều này giúp việc tính layout trực quan hơn:
        input {
            width: 100%;
            padding: 12px;
        }
        Input vẫn nằm trong container thay vì bị padding đẩy rộng ra ngoài.
        Áp dụng cho ::before và ::after để các pseudo-element cũng dùng cùng cách tính kích thước.
3.  Vì sao jQuery phải được tải trước common.js?
    > common.js đang sử dụng các biến và hàm do jQuery cung cấp:
        $(function () {
            console.log($.fn.jquery);
        });
        Hai ký hiệu sau chỉ tồn tại sau khi jQuery được tải:
        $
        jQuery
        Vì trình duyệt thực thi các thẻ <script> theo thứ tự từ trên xuống, thứ tự đúng là:
        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        <script src="./js/common.js"></script>
        Luồng thực thi:
        Tải jQuery
        → tạo window.jQuery và window.$
        → chạy common.js
        → common.js sử dụng được $
        Nếu đảo ngược:
        <script src="./js/common.js"></script>
        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
        thì khi common.js chạy, $ chưa tồn tại. Trình duyệt báo:
        Uncaught ReferenceError: $ is not defined
        Nguyên tắc tổng quát là:
        Thư viện/phụ thuộc
        → code dùng chung
        → code riêng của từng trang
4.  Vì sao không nên viết API URL trực tiếp trong từng file?

    > Giả sử bạn viết URL trực tiếp ở nhiều nơi:

        // library.js
        $.get("http://localhost:8080/api/books");

        // manage.js
        $.post("http://localhost:8080/api/books", payload);

        // reader.js
        $.get(`http://localhost:8080/api/books/${id}`);
        Khi backend đổi port từ 8080 sang 9090, bạn phải tìm và sửa tất cả file. Một vị trí bị bỏ sót sẽ tạo ra lỗi khó phát hiện.
        Ngoài ra, URL giữa các file có thể bị viết không thống nhất:
        "http://localhost:8080/api"
        "http://127.0.0.1:8080/api"
        "http://localhost:8080/api/"
        Cách tốt hơn là khai báo tại một nơi:
        const APP_CONFIG = {
            API_BASE_URL: "http://localhost:8080/api"
        };
        Sau đó sử dụng:
        $.get(`${APP_CONFIG.API_BASE_URL}/books`);
        Lợi ích:
        - Chỉ sửa một nơi khi backend thay đổi.
        - Tránh sai chính tả và URL không thống nhất.
        - Dễ chuyển giữa local, test và production.
        - Giúp code gọi API ngắn và dễ đọc hơn.
        Tốt hơn nữa, từ ngày 3 ta sẽ tập trung các request trong một lớp API:
        const BookApi = {
            getAll() {
                return $.ajax({
                    url: `${APP_CONFIG.API_BASE_URL}/books`,
                    method: "GET"
                });
            }
        };
        Khi đó file giao diện chỉ cần gọi:
        BookApi.getAll();
        File giao diện không cần biết backend dùng URL cụ thể nào.

5.  Sự khác nhau giữa .sidebar-nav**item và .sidebar-nav**item--active là gì?

    > Đây là cách đặt tên theo tư duy BEM:

        Block:    sidebar-nav
        Element:  sidebar-nav__item
        Modifier: sidebar-nav__item--active
        .sidebar-nav__item
        Đây là style cơ bản áp dụng cho tất cả menu item:
        .sidebar-nav__item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 11px 12px;

            color: var(--color-text-secondary);
            border-radius: var(--radius-medium);
        }
        Nó quy định:
        - Layout.
        - Khoảng cách.
        - Padding.
        - Màu mặc định.
        - Bo góc.
        Cả “Thư viện” và “Quản lý sách” đều dùng class này.
        .sidebar-nav__item--active
        Đây là modifier biểu thị trạng thái trang đang được chọn:
        .sidebar-nav__item--active {
            color: var(--color-primary);
            background: #eef2ff;
            font-weight: 600;
        }
        Nó chỉ bổ sung hoặc ghi đè một số thuộc tính trạng thái:
        - Đổi màu chữ.
        - Thêm màu nền.
        - Tăng độ đậm.
        HTML thường kết hợp cả hai class:
        <a
            class="sidebar-nav__item sidebar-nav__item--active"
            href="./index.html"
        >
            Thư viện
        </a>
        Không nên chỉ viết:
        <a class="sidebar-nav__item--active">
        Bởi vì modifier không chứa toàn bộ layout, padding và border radius của item cơ bản.
        Có thể hiểu như sau:
        .sidebar-nav__item
        = “Đây là một menu item”

        .sidebar-nav__item--active
        = “Menu item này đang được chọn”

---

## Checklist hoàn thành ngày 2

```
[V] html lang đã đổi thành vi
[V] Nút Thêm sách dẫn tới manage.html
[V] Toolbar có input tìm kiếm
[V] Toolbar có select sắp xếp
[V] Grid có đúng ba cột
[V] Có sáu book card
[V] Mỗi card có cover, title, author và year
[V] Mỗi card có tags
[V] Mỗi card có trạng thái Offline hoặc URL
[V] Nút Đọc sách dẫn tới reader.html?id=...
[V] Card có hover
[V] Button và menu có focus-visible
[V] Không có CSS inline
[?] Không có lỗi đỏ trong Console
[V] Chưa gọi API
```

Bài tự đánh giá cuối ngày
Bạn nên tự trả lời:

1.  Vì sao book-card dùng <article> thay vì <div>?
    > Mỗi 1 book-card sẽ có nội dung riêng rẽ nên sẽ dùng article, div thường thiên về component dùng chung
2.  minmax(0, 1fr) giải quyết vấn đề gì?
    > Không cần phải căn chỉnh chi tiết từng component, để cho trình duyệt tự quyết định độ rộng/hẹp nhất của component
3.  Sự khác nhau giữa :hover, :focus và :focus-visible?
    > :hover - di chuột vào
         :focus - phần tập trung (khi bấm Tab)
         :focus-visible - khi tập trung vào 1 component thì cho nó nổi bật lên
4.  Vì sao cover được làm bằng CSS thay vì ảnh thật?
    > Đã có ảnh thật đâu :)
5.  Ngày mai, phần HTML nào sẽ được jQuery tạo động?
    > Phần component đọc sách (reader.html)

## Checklist hoàn thành ngày 3

```
[V] Có js/api.js
[V] api.js được import trước library.js
[V] Sáu card tĩnh đã được xóa
[V] GET /api/books trả 200
[V] Card được tạo từ dữ liệu API
[V] Sidebar hiển thị đúng số sách
[V] Tìm kiếm hoạt động
[V] Tìm kiếm có debounce
[V] Sắp xếp A–Z và Z–A hoạt động
[V] Sắp xếp theo năm hoạt động
[V] Loading state hoạt động
[V] Error state hoạt động
[V] Nút Thử lại hoạt động
[V] Empty state hoạt động
[V] Không có lỗi đỏ trong Console
[V] Nút Đọc sách chứa đúng ID thật
```

## Checklist hoàn thành ngày 4

```
[V] Menu Quản lý sách có trạng thái active
[V] manage.html import api.js
[V] Bảng được render từ API
[V] Sidebar hiển thị đúng số sách
[V] Tìm kiếm hoạt động
[V] Lọc trạng thái PDF hoạt động
[V] Event delegation cho Sửa/Xóa hoạt động
[V] Modal Thêm sách mở với form trống
[V] Modal Sửa sách điền đúng dữ liệu
[V] Modal đóng được bằng 4 cách
[V] Title và author bắt buộc
[V] Năm phải là số nguyên
[V] URL phải là HTTP hoặc HTTPS
[V] File phải là PDF
[V] Payload xuất hiện trong Console
[V] Chưa gọi POST/PUT/DELETE
[V] Không có lỗi đỏ trong Console
```

## Checklist hoàn thành ngày 5

```
[V] POST thêm sách hoạt động
[V] PUT sửa sách không tạo thêm bản ghi
[V] Sửa metadata giữ nguyên hasLocalFile cũ
[V] Modal không đóng khi đang lưu
[V] Submit liên tục không gửi trùng request
[V] Lỗi lưu giữ nguyên form
[V] Toast hiển thị bằng text an toàn
[V] Xóa có xác nhận đúng tên sách
[V] Hủy xóa không gọi DELETE
[V] DELETE thành công mới cập nhật bảng
[V] Refresh trang vẫn thấy kết quả đúng
[V] Chỉ thử xóa sách test không có PDF offline
```

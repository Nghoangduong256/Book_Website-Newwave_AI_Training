## Hàm chính

Đây là phần khởi tạo và đăng ký sự kiện cho trang Quản lý sách. Đoạn code chưa thực hiện thêm, sửa hoặc xóa dữ liệu; nó mới xác định phản ứng của giao diện khi người dùng thao tác.

## 1. Chế độ nghiêm ngặt

```javascript
"use strict";
```

Strict mode giúp JavaScript phát hiện một số lỗi dễ bị bỏ qua, chẳng hạn:

```javascript
bookId = 10;
```

Nếu `bookId` chưa được khai báo, strict mode sẽ báo lỗi thay vì tự tạo biến global.

---

## 2. Chờ DOM tải xong

```javascript
$(function () {
  // Code của trang
});
```

Đây là cách viết rút gọn của jQuery:

```javascript
$(document).ready(function () {
  // Code của trang
});
```

Code bên trong chỉ chạy sau khi HTML đã được phân tích xong. Nhờ vậy, jQuery có thể tìm thấy các phần tử như:

```javascript
$("#bookTableBody");
$("#bookModal");
$("#bookForm");
```

Nếu chạy JavaScript trước khi DOM tồn tại, selector có thể trả về tập rỗng.

---

# 3. State của trang

```javascript
let allBooks = [];
```

Chứa toàn bộ sách lấy từ API:

```javascript
allBooks = [
  {
    id: 2,
    title: "Tên sách",
    author: "Tác giả",
  },
];
```

Biến này được dùng để:

- Render bảng.
- Tìm kiếm.
- Lọc theo PDF.
- Tìm sách cần sửa.

---

```javascript
let editingBookId = null;
```

Cho biết form hiện đang ở chế độ nào:

```javascript
editingBookId === null;
```

nghĩa là thêm sách mới.

```javascript
editingBookId === 2;
```

nghĩa là đang sửa sách có ID bằng `2`.

Có thể hình dung:

```text
null   → CREATE
có ID  → UPDATE
```

---

```javascript
let searchTimer = null;
```

Dùng cho debounce ô tìm kiếm.

Khi người dùng gõ liên tục, chương trình không lọc lại bảng sau mỗi phím ngay lập tức. Nó chờ người dùng dừng gõ khoảng 250 ms rồi mới gọi `applyFilters()`.

---

```javascript
let lastFocusedElement = null;
```

Lưu phần tử đang được focus trước khi modal mở.

Ví dụ người dùng bấm nút “Sửa”:

```text
Nút Sửa đang được focus
→ modal mở
→ focus chuyển vào input Tiêu đề
→ modal đóng
→ focus quay lại nút Sửa
```

Điều này cải thiện keyboard accessibility.

---

# 4. Cache các phần tử DOM

```javascript
const $tableBody = $("#bookTableBody");
const $tablePanel = $("#bookTablePanel");
const $manageState = $("#manageState");
const $loadingState = $("#manageLoadingState");
const $errorState = $("#manageErrorState");
const $emptyState = $("#manageEmptyState");
const $modal = $("#bookModal");
const $form = $("#bookForm");
```

Dấu `$` đầu tên biến là quy ước để nói rằng biến đang chứa một jQuery object.

Ví dụ:

```javascript
const $modal = $("#bookModal");
```

`$modal` không phải DOM element thuần mà là jQuery object. Vì vậy có thể gọi:

```javascript
$modal.addClass("is-hidden");
$modal.removeClass("is-hidden");
$modal.attr("aria-hidden", "true");
```

Nếu không cache, code có thể phải tìm lại cùng phần tử nhiều lần:

```javascript
$("#bookModal").removeClass("is-hidden");
$("#bookModal").attr("aria-hidden", "false");
$("#bookModal").find("input");
```

Cache giúp code ngắn và thể hiện rõ các phần tử quan trọng của trang.

## jQuery object và DOM element thuần

```javascript
const $form = $("#bookForm");
```

Đây là jQuery object.

Muốn lấy DOM element đầu tiên bên trong:

```javascript
$form[0];
```

Ví dụ:

```javascript
$form[0].reset();
```

`reset()` là method của HTML form thuần, không phải method của jQuery.

---

# 5. Khởi tạo trang

```javascript
initialize();
```

Ngay khi DOM đã sẵn sàng, gọi hàm khởi tạo:

```javascript
function initialize() {
  bindEvents();
  loadBooks();
}
```

Hàm này làm hai việc:

```text
bindEvents() → đăng ký các sự kiện
loadBooks()  → lấy danh sách sách từ API
```

Thứ tự này hợp lý vì giao diện nên sẵn sàng phản hồi thao tác trước, sau đó mới tải dữ liệu.

---

# 6. Đăng ký sự kiện

```javascript
function bindEvents() {
    ...
}
```

Hàm này tập trung toàn bộ việc gắn event listener vào một nơi.

Thay vì rải rác:

```javascript
$("#button1").on(...);
```

ở nhiều vị trí, chúng được gom vào `bindEvents()` để dễ kiểm tra và bảo trì.

---

## 7. Mở modal thêm sách

```javascript
$("#openCreateBookButton").on("click", openCreateModal);
```

Khi bấm nút `#openCreateBookButton`, jQuery gọi:

```javascript
openCreateModal();
```

Cách viết này:

```javascript
.on("click", openCreateModal)
```

tương đương với:

```javascript
.on("click", function () {
    openCreateModal();
});
```

Không viết:

```javascript
.on("click", openCreateModal());
```

vì dấu `()` sẽ khiến hàm chạy ngay khi trang khởi tạo, thay vì chờ click.

---

## 8. Đóng modal bằng nhiều nút

```javascript
$("[data-close-modal]").on("click", closeModal);
```

Selector này tìm mọi phần tử có attribute:

```html
data-close-modal
```

Ví dụ:

```html
<button data-close-modal>×</button> <button data-close-modal>Hủy</button>
```

Cả hai button cùng dùng chung hàm:

```javascript
closeModal();
```

Đây là lợi ích của custom `data-*` attribute: JavaScript không cần phụ thuộc vào text hiển thị của button.

---

## 9. Đóng modal khi click nền tối

```javascript
$modal.on("click", function (event) {
  if ($(event.target).is("#bookModal")) {
    closeModal();
  }
});
```

`event.target` là phần tử thực tế được người dùng click.

Modal có cấu trúc tương tự:

```html
<div id="bookModal">
  <div class="modal__dialog">Nội dung form</div>
</div>
```

Nếu click vùng nền:

```javascript
event.target === #bookModal
```

thì đóng modal.

Nếu click input hoặc nội dung dialog:

```javascript
event.target !== #bookModal
```

thì không đóng.

Điều kiện này ngăn modal bị đóng khi người dùng thao tác bên trong form.

---

## 10. Đóng modal bằng phím Escape

```javascript
$(document).on("keydown", function (event) {
  if (event.key === "Escape" && !$modal.hasClass("is-hidden")) {
    closeModal();
  }
});
```

Sự kiện được đăng ký trên toàn bộ document vì phím Escape có thể được nhấn khi focus đang ở bất kỳ input nào.

Điều kiện thứ nhất:

```javascript
event.key === "Escape";
```

Người dùng vừa nhấn Escape.

Điều kiện thứ hai:

```javascript
!$modal.hasClass("is-hidden");
```

Modal đang hiển thị.

Dấu `!` đảo ngược kết quả:

```javascript
$modal.hasClass("is-hidden"); // modal đang ẩn
!$modal.hasClass("is-hidden"); // modal không ẩn
```

Chỉ khi cả hai điều kiện đúng, `closeModal()` mới chạy.

---

# 11. Debounce tìm kiếm

```javascript
$("#manageBookSearch").on("input", function () {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(applyFilters, 250);
});
```

Sự kiện `input` xảy ra khi:

- Gõ phím.
- Xóa ký tự.
- Paste nội dung.
- Bấm nút xóa của input search.

Mỗi lần input thay đổi:

```javascript
clearTimeout(searchTimer);
```

hủy lần lọc đang chờ trước đó.

Sau đó:

```javascript
searchTimer = setTimeout(applyFilters, 250);
```

đặt lịch gọi `applyFilters()` sau 250 ms.

Ví dụ người dùng gõ `Java`:

```text
Gõ J    → đặt timer 250 ms
Gõ a    → hủy timer cũ, đặt timer mới
Gõ v    → hủy timer cũ, đặt timer mới
Gõ a    → hủy timer cũ, đặt timer mới
Dừng    → sau 250 ms mới filter
```

Đó là debounce.

---

# 12. Lọc khi select thay đổi

```javascript
$("#pdfFilter").on("change", applyFilters);
```

Khi người dùng chọn trạng thái PDF khác, gọi ngay:

```javascript
applyFilters();
```

Không cần debounce vì select chỉ phát sinh một thay đổi có chủ đích, không liên tục như việc gõ bàn phím.

---

# 13. Tải lại khi có lỗi

```javascript
$("#manageRetryButton").on("click", loadBooks);
```

Khi API thất bại, giao diện hiển thị nút “Thử lại”.

Bấm nút sẽ chạy lại:

```javascript
loadBooks();
```

---

# 14. Event delegation cho nút Sửa

```javascript
$tableBody.on("click", ".edit-book-button", function () {
  const bookId = Number($(this).closest("tr").data("book-id"));

  openEditModal(bookId);
});
```

Đây là phần quan trọng nhất của đoạn code.

Các dòng trong bảng được tạo sau khi API trả dữ liệu:

```javascript
$tableBody.html(rowsHtml);
```

Khi `bindEvents()` chạy, các button `.edit-book-button` có thể chưa tồn tại. Vì vậy không nên viết:

```javascript
$(".edit-book-button").on("click", ...);
```

Thay vào đó, event được gắn vào `tbody`, vốn đã tồn tại:

```javascript
$tableBody.on("click", ".edit-book-button", handler);
```

Khi click nổi lên từ button đến `tbody`, jQuery kiểm tra xem nguồn click có khớp `.edit-book-button` không.

Đó là event delegation.

### Lấy ID sách

```javascript
$(this);
```

Trong callback thường, `this` là button vừa được click.

```javascript
$(this).closest("tr");
```

Đi từ button lên dòng `<tr>` gần nhất.

Giả sử HTML:

```html
<tr data-book-id="12">
  <td>
    <button class="edit-book-button">Sửa</button>
  </td>
</tr>
```

Tiếp theo:

```javascript
.data("book-id")
```

đọc giá trị:

```text
12
```

Sau đó:

```javascript
Number(...)
```

chuyển nó thành number.

Cuối cùng:

```javascript
openEditModal(bookId);
```

mở modal và điền dữ liệu sách có ID tương ứng.

---

# 15. Event delegation cho nút Xóa

```javascript
$tableBody.on("click", ".delete-book-button", function () {
  const bookId = Number($(this).closest("tr").data("book-id"));

  console.log("Delete book on day 5:", bookId);
});
```

Cách lấy ID giống nút Sửa.

Hiện tại chưa gọi API xóa. Nó chỉ in ra Console:

```text
Delete book on day 5: 12
```

Ngày 5 đoạn này sẽ được thay bằng mở confirm modal hoặc gọi hàm:

```javascript
openDeleteConfirmation(bookId);
```

---

# 16. Bắt submit form

```javascript
$form.on("submit", handleFormSubmit);
```

Sự kiện được gắn vào form, không chỉ vào button submit.

Điều này quan trọng vì form có thể được submit bằng:

- Bấm button submit.
- Nhấn Enter trong input.
- JavaScript gọi submit.

Trong `handleFormSubmit`, bước đầu tiên thường là:

```javascript
event.preventDefault();
```

Nếu không có nó, trình duyệt sẽ submit HTML truyền thống và reload trang.

---

# Toàn bộ luồng hoạt động

```text
DOM tải xong
    ↓
Khởi tạo các biến state
    ↓
Cache các DOM element
    ↓
initialize()
    ├── bindEvents()
    │   ├── nút Thêm
    │   ├── nút đóng modal
    │   ├── click backdrop
    │   ├── phím Escape
    │   ├── tìm kiếm
    │   ├── lọc PDF
    │   ├── thử lại
    │   ├── nút Sửa động
    │   ├── nút Xóa động
    │   └── submit form
    │
    └── loadBooks()
        └── gọi API và render bảng
```

Điểm cốt lõi cần ghi nhớ:

- `allBooks` là dữ liệu của trang.
- `editingBookId` phân biệt thêm và sửa.
- Biến bắt đầu bằng `$` thường là jQuery object.
- `bindEvents()` gom việc đăng ký sự kiện.
- Debounce tránh filter quá nhiều lần.
- Event delegation xử lý các button được render động.
- Modal có nhiều cách đóng nhưng cùng gọi `closeModal()`.
- Submit được bắt ở `<form>`, không chỉ ở button.

## Hàm `openModal()`

```javascript
function openModal() {
    $modal.removeClass("is-hidden");
```

`$modal` là phần tử modal đã được jQuery lưu trước đó, thường là:

```javascript
const $modal = $("#bookModal");
```

`removeClass("is-hidden")` xóa class đang ẩn modal.

Ví dụ CSS:

```css
.is-hidden {
  display: none !important;
}
```

Sau khi class bị xóa, modal xuất hiện.

```javascript
$modal.attr("aria-hidden", "false");
```

Cập nhật thuộc tính hỗ trợ accessibility:

```html
aria-hidden="false"
```

Nó thông báo cho công nghệ hỗ trợ như screen reader rằng modal hiện đang được hiển thị và có thể tương tác.

Lưu ý: `aria-hidden` không tự làm modal xuất hiện. Việc hiển thị thực tế được CSS và class `is-hidden` quyết định.

```javascript
$("body").addClass("modal-open");
```

Thêm class vào thẻ `<body>`:

```html
<body class="modal-open"></body>
```

CSS tương ứng thường là:

```css
body.modal-open {
  overflow: hidden;
}
```

Mục đích là khóa thanh cuộn của trang phía sau. Khi modal đang mở, người dùng chỉ nên tương tác với modal, không nên cuộn nội dung nền.

```javascript
    setTimeout(function () {
        $("#bookTitle").trigger("focus");
    }, 0);
}
```

Sau khi mở modal, code đưa focus vào ô Tiêu đề:

```html
<input id="bookTitle" />
```

Tương đương với JavaScript thuần:

```javascript
document.getElementById("bookTitle").focus();
```

### Vì sao dùng `setTimeout(..., 0)`?

`0` không có nghĩa là chạy ngay lập tức. Callback được đưa vào hàng đợi để chạy sau khi đoạn JavaScript hiện tại hoàn tất.

Thứ tự gần đúng:

```text
1. Xóa is-hidden
2. Cập nhật aria-hidden
3. Thêm modal-open vào body
4. Trình duyệt cập nhật trạng thái modal
5. Focus vào bookTitle
```

Nếu gọi focus ngay trước khi trình duyệt xử lý việc hiển thị modal, trong một số tình huống focus có thể không hoạt động như mong đợi.

---

## Hàm `closeModal()`

```javascript
function closeModal() {
    $modal.addClass("is-hidden");
```

Thêm lại class `is-hidden`, làm modal biến mất:

```html
<div id="bookModal" class="modal is-hidden"></div>
```

```javascript
$modal.attr("aria-hidden", "true");
```

Thông báo cho screen reader rằng modal hiện không còn được hiển thị.

```javascript
$("body").removeClass("modal-open");
```

Xóa trạng thái khóa trang khỏi `<body>`.

Nếu CSS là:

```css
body.modal-open {
  overflow: hidden;
}
```

thì sau khi class bị xóa, trang chính có thể cuộn bình thường trở lại.

```javascript
    if (lastFocusedElement) {
        $(lastFocusedElement).trigger("focus");
    }
}
```

Khi đóng modal, focus được trả về phần tử đã mở modal.

`lastFocusedElement` thường được lưu trước khi mở modal:

```javascript
lastFocusedElement = document.activeElement;
```

Ví dụ người dùng bấm nút:

```html
<button class="edit-book-button">Sửa</button>
```

Khi đó:

```javascript
lastFocusedElement;
```

sẽ tham chiếu tới chính nút “Sửa” đó.

Luồng focus:

```text
Người dùng bấm “Sửa”
→ lưu nút “Sửa” vào lastFocusedElement
→ mở modal
→ focus chuyển tới ô Tiêu đề
→ người dùng đóng modal
→ focus quay lại nút “Sửa”
```

Điều kiện:

```javascript
if (lastFocusedElement)
```

giúp tránh lỗi nếu chưa có phần tử nào được lưu.

## Vai trò của từng cơ chế

| Code                           | Vai trò                          |
| ------------------------------ | -------------------------------- |
| `removeClass("is-hidden")`     | Hiển thị modal                   |
| `addClass("is-hidden")`        | Ẩn modal                         |
| `aria-hidden="false"`          | Thông báo modal đang hiện        |
| `aria-hidden="true"`           | Thông báo modal đang ẩn          |
| `body.modal-open`              | Khóa cuộn trang nền              |
| `focus()` vào `bookTitle`      | Đưa người dùng vào form ngay     |
| Focus lại `lastFocusedElement` | Đưa người dùng về đúng vị trí cũ |

Tóm lại, hai hàm không chỉ bật/tắt giao diện modal mà còn đồng bộ ba loại trạng thái:

```text
Trạng thái hiển thị bằng CSS
+ trạng thái accessibility bằng ARIA
+ trạng thái focus của bàn phím
```

Đoạn code này quản lý trạng thái lỗi validation của form. Nó gồm hai hàm:

- `clearValidation()`: xóa toàn bộ lỗi cũ.
- `setFieldError()`: hiển thị lỗi cho một trường cụ thể.

## Hàm `clearValidation()`

```javascript
function clearValidation() {
```

Hàm này thường được gọi:

- Trước khi validate lại form.
- Khi mở modal thêm sách.
- Khi chuyển từ sửa cuốn sách này sang cuốn khác.
- Sau khi reset form.

### Xóa nội dung thông báo lỗi

```javascript
$(".form-error").text("").addClass("is-hidden");
```

Selector:

```javascript
$(".form-error");
```

chọn tất cả phần tử có class `form-error`, ví dụ:

```html
<p id="bookTitleError" class="form-error">Vui lòng nhập tiêu đề.</p>
```

Lệnh:

```javascript
.text("")
```

xóa nội dung bên trong:

```html
<p id="bookTitleError" class="form-error"></p>
```

Sau đó:

```javascript
.addClass("is-hidden")
```

ẩn phần tử bằng CSS:

```css
.is-hidden {
  display: none !important;
}
```

Nhờ method chaining, đoạn này:

```javascript
$(".form-error").text("").addClass("is-hidden");
```

tương đương:

```javascript
const $errors = $(".form-error");

$errors.text("");
$errors.addClass("is-hidden");
```

### Xóa viền đỏ khỏi input

```javascript
$(".form-control").removeClass("form-control--error");
```

Chọn tất cả input/select có class:

```html
<input class="form-control form-control--error" />
```

Sau đó xóa `form-control--error`:

```html
<input class="form-control" />
```

CSS lỗi có thể là:

```css
.form-control--error {
  border-color: var(--color-danger);
}
```

Khi class bị xóa, input quay lại giao diện bình thường.

### Xóa trạng thái chung của form

```javascript
$("#formStatus").text("");
```

`#formStatus` là vùng hiển thị thông báo chung, chẳng hạn:

```html
<span id="formStatus"> Dữ liệu hợp lệ — ngày 5 sẽ gửi lên API. </span>
```

`.text("")` xóa thông báo đó để lần kiểm tra mới không còn hiển thị kết quả cũ.

### Kết quả của `clearValidation()`

Trước:

```text
Tiêu đề: viền đỏ
“Vui lòng nhập tiêu đề.”

Tác giả: viền đỏ
“Vui lòng nhập tác giả.”

Form status:
“Dữ liệu không hợp lệ.”
```

Sau:

```text
Tiêu đề: bình thường
Không có thông báo lỗi

Tác giả: bình thường
Không có thông báo lỗi

Form status: trống
```

---

## Hàm `setFieldError()`

```javascript
function setFieldError(
    fieldSelector,
    errorSelector,
    message
) {
```

Hàm nhận ba tham số:

| Tham số         | Ý nghĩa                 | Ví dụ                      |
| --------------- | ----------------------- | -------------------------- |
| `fieldSelector` | Selector của input lỗi  | `"#bookTitle"`             |
| `errorSelector` | Selector vùng thông báo | `"#bookTitleError"`        |
| `message`       | Nội dung lỗi            | `"Vui lòng nhập tiêu đề."` |

Ví dụ gọi:

```javascript
setFieldError("#bookTitle", "#bookTitleError", "Vui lòng nhập tiêu đề.");
```

### Đánh dấu input lỗi

```javascript
$(fieldSelector).addClass("form-control--error");
```

Khi:

```javascript
fieldSelector = "#bookTitle";
```

thì đoạn code tương đương:

```javascript
$("#bookTitle").addClass("form-control--error");
```

HTML thay đổi từ:

```html
<input id="bookTitle" class="form-control" />
```

thành:

```html
<input id="bookTitle" class="form-control form-control--error" />
```

Input sẽ có viền đỏ theo CSS.

### Gán và hiển thị thông báo lỗi

```javascript
$(errorSelector).text(message).removeClass("is-hidden");
```

Nếu:

```javascript
errorSelector = "#bookTitleError";
message = "Vui lòng nhập tiêu đề.";
```

thì tương đương:

```javascript
$("#bookTitleError").text("Vui lòng nhập tiêu đề.").removeClass("is-hidden");
```

Trước:

```html
<p id="bookTitleError" class="form-error is-hidden"></p>
```

Sau:

```html
<p id="bookTitleError" class="form-error">Vui lòng nhập tiêu đề.</p>
```

Thông báo lỗi được hiển thị ngay dưới input.

## Cách hai hàm phối hợp

Thông thường hàm validate sẽ bắt đầu bằng:

```javascript
function validateForm() {
  clearValidation();

  let isValid = true;

  const title = $("#bookTitle").val().trim();

  if (!title) {
    setFieldError("#bookTitle", "#bookTitleError", "Vui lòng nhập tiêu đề.");

    isValid = false;
  }

  return isValid;
}
```

Luồng xử lý:

```text
Người dùng submit form
→ clearValidation() xóa lỗi lần trước
→ kiểm tra lại từng field
→ field nào sai thì gọi setFieldError()
→ chỉ hiển thị các lỗi đang tồn tại
```

Việc xóa lỗi trước rất quan trọng. Nếu không có `clearValidation()`, lỗi cũ có thể vẫn tồn tại dù người dùng đã sửa dữ liệu đúng.

## Ví dụ qua hai lần submit

Lần đầu, người dùng để trống tiêu đề:

```javascript
setFieldError("#bookTitle", "#bookTitleError", "Vui lòng nhập tiêu đề.");
```

Kết quả:

```text
Tiêu đề có viền đỏ
Thông báo lỗi xuất hiện
```

Người dùng nhập `"Clean Code"` rồi submit lần hai:

```javascript
clearValidation();
```

Lỗi cũ bị xóa. Vì tiêu đề hiện hợp lệ nên `setFieldError()` không được gọi lại.

Kết quả:

```text
Tiêu đề không còn viền đỏ
Thông báo lỗi không còn
```

Tóm lại:

```text
clearValidation()
= đưa toàn bộ form về trạng thái không có lỗi

setFieldError(...)
= đánh dấu và hiển thị lỗi cho một field cụ thể
```

## Hàm handleFormSubmit()

Hành vi cần hiểu:

- Lưu thành công → đóng modal, thông báo, tải lại bảng.
- Lưu thất bại → giữ modal và dữ liệu đã nhập để người dùng sửa/thử lại.
- Lưu thành công nhưng tải lại bảng thất bại → vẫn thông báo đã lưu; bảng hiện lỗi tải dữ liệu. Không hiểu nhầm thành “chưa lưu”.
  Checkpoint: hoàn thành thêm/sửa trước khi chuyển sang xóa.

Hàm `handleFormSubmit()` xử lý toàn bộ quá trình khi người dùng submit form thêm hoặc sửa sách:

```text
Submit form
→ Ngăn reload trang
→ Chống gửi trùng
→ Validate
→ Tạo payload
→ Chọn POST hoặc PUT
→ Khóa form
→ Xử lý thành công/thất bại
```

## 1. Ngăn trình duyệt reload

```javascript
event.preventDefault();
```

Mặc định, submit form sẽ tải lại trang. Lệnh này chặn hành vi đó để jQuery gửi request AJAX mà không reload.

---

## 2. Chống gửi request nhiều lần

```javascript
if (isSaving) {
  return;
}
```

`isSaving` là cờ trạng thái:

```javascript
false → chưa gửi request
true  → đang chờ server phản hồi
```

Nếu người dùng bấm nút Lưu liên tục trong lúc request trước chưa hoàn thành, hàm sẽ dừng ngay tại `return`.

Nếu thiếu đoạn này, người dùng có thể vô tình thêm cùng một cuốn sách nhiều lần.

---

## 3. Kiểm tra dữ liệu form

```javascript
if (!validateForm()) {
  $form.find(".form-control--error").first().trigger("focus");

  return;
}
```

`validateForm()` trả về:

```javascript
true; // Dữ liệu hợp lệ
false; // Có ít nhất một lỗi
```

Dấu `!` phủ định kết quả:

```javascript
!true; // false
!false; // true
```

Vì vậy, block này chỉ chạy khi form không hợp lệ.

### Tìm trường bị lỗi đầu tiên

```javascript
$form.find(".form-control--error");
```

- `$form` là đối tượng jQuery đại diện cho form.
- `.find()` tìm các phần tử con có class `form-control--error`.

```javascript
.first()
```

Chọn trường lỗi đầu tiên.

```javascript
.trigger("focus")
```

Đưa con trỏ vào trường đó để người dùng biết nên sửa ở đâu.

Sau đó:

```javascript
return;
```

dừng hàm, không gọi API.

---

## 4. Tạo dữ liệu gửi lên backend

```javascript
const payload = createPayload();
```

`createPayload()` đọc giá trị từ các input và tạo object:

```javascript
{
    title: "Clean Code",
    author: "Robert C. Martin",
    publishYear: 2008,
    tags: "Lập trình, kỹ năng",
    pdfUrl: null,
    hasLocalFile: false
}
```

Object này có cấu trúc tương ứng với `BookRequest` ở backend.

---

## 5. Xác định thêm mới hay chỉnh sửa

```javascript
const isEditing = editingBookId !== null;
const bookId = editingBookId;
```

Quy ước state hiện tại:

```javascript
editingBookId === null;
```

nghĩa là đang thêm sách mới.

Ví dụ:

```javascript
editingBookId === 5;
```

nghĩa là đang sửa sách có ID `5`.

Do đó:

```javascript
const isEditing = editingBookId !== null;
```

sẽ tạo giá trị:

```text
editingBookId = null → isEditing = false → thêm sách
editingBookId = 5    → isEditing = true  → sửa sách
```

### Vì sao copy ID vào `bookId`?

```javascript
const bookId = editingBookId;
```

`editingBookId` là biến state có thể thay đổi sau này. `bookId` lưu lại ID của đúng thao tác submit hiện tại để request sử dụng ổn định.

---

## 6. Chuyển giao diện sang trạng thái đang lưu

```javascript
setSaving(true);
```

Hàm này thường thực hiện:

- Đặt `isSaving = true`.
- Khóa input.
- Khóa nút submit.
- Đổi chữ nút thành “Đang lưu...”.
- Ngăn modal bị đóng trong lúc request đang chạy.

Đây vừa là UX feedback, vừa ngăn gửi request trùng.

---

## 7. Chọn API phù hợp

```javascript
const request = isEditing
  ? BookApi.update(bookId, payload)
  : BookApi.create(payload);
```

Đây là toán tử ba ngôi:

```javascript
điều_kiện ? giá_trị_khi_đúng : giá_trị_khi_sai;
```

Tương đương:

```javascript
let request;

if (isEditing) {
  request = BookApi.update(bookId, payload);
} else {
  request = BookApi.create(payload);
}
```

Khi sửa:

```javascript
BookApi.update(bookId, payload);
```

gửi:

```http
PUT /api/books/{bookId}
```

Khi thêm:

```javascript
BookApi.create(payload);
```

gửi:

```http
POST /api/books
```

Cả hai phương thức đều trả về jqXHR, nên có thể xử lý bằng `.done()` và `.fail()`.

---

## 8. Khi request thành công

```javascript
request.done(function () {
  // ...
});
```

`.done()` chỉ chạy khi server phản hồi thành công.

### Mở khóa trạng thái

```javascript
setSaving(false);
```

Đặt lại:

```javascript
isSaving = false;
```

và mở khóa các control.

### Đóng modal

```javascript
closeModal();
```

Form không còn cần hiển thị vì dữ liệu đã được lưu.

Thứ tự này quan trọng:

```javascript
setSaving(false);
closeModal();
```

Vì `closeModal()` đã được thiết kế không cho đóng khi `isSaving === true`.

Nếu đảo thứ tự, modal có thể không đóng.

### Hiển thị thông báo tương ứng

```javascript
showToast(isEditing ? "Đã cập nhật sách." : "Đã thêm sách mới.");
```

Nếu `isEditing` là `true`:

```text
Đã cập nhật sách.
```

Nếu là `false`:

```text
Đã thêm sách mới.
```

### Tải lại bảng

```javascript
loadBooks();
```

Hàm này gọi lại:

```http
GET /api/books
```

và render bảng từ dữ liệu mới nhất trong database.

Cách này đơn giản và đáng tin cậy hơn việc tự đoán dữ liệu trong UI cần thay đổi thế nào.

### Trả focus về nút thêm sách

```javascript
$("#openCreateBookButton").trigger("focus");
```

Đây là cải thiện accessibility: sau khi modal đóng, focus được đưa về một control có thật trên màn hình.

---

## 9. Khi request thất bại

```javascript
.fail(function (xhr, textStatus) {
    // ...
});
```

`.fail()` chạy khi:

- Backend không hoạt động.
- Mất kết nối.
- Request timeout.
- Server trả HTTP 400, 404 hoặc 500.

### Các tham số callback

```javascript
xhr;
```

chứa thông tin response:

```javascript
xhr.status;
xhr.responseText;
xhr.responseJSON;
```

```javascript
textStatus;
```

mô tả trạng thái jQuery, ví dụ:

```text
"error"
"timeout"
"parsererror"
"abort"
```

### Mở khóa form

```javascript
setSaving(false);
```

Người dùng có thể sửa dữ liệu hoặc thử lại.

### Ghi chi tiết vào Console

```javascript
console.error("Save book failed:", xhr);
```

Thông tin kỹ thuật dành cho lập trình viên được ghi vào DevTools.

### Hiển thị lỗi cho người dùng

```javascript
$("#formStatus")
  .text(getRequestError(xhr, textStatus))
  .addClass("form-status--error");
```

Chuỗi method này tương đương:

```javascript
const $formStatus = $("#formStatus");

$formStatus.text(getRequestError(xhr, textStatus));

$formStatus.addClass("form-status--error");
```

`getRequestError()` chuyển lỗi kỹ thuật thành thông báo dễ hiểu, chẳng hạn:

```text
Không thể kết nối tới backend.
Backend từ chối dữ liệu.
Không tìm thấy sách.
Thao tác thất bại. HTTP 500.
```

Modal vẫn mở và dữ liệu vẫn còn để người dùng sửa.

## Tóm tắt theo hai nhánh

```text
handleFormSubmit
│
├─ Đang lưu?
│  └─ Có → dừng
│
├─ Form hợp lệ?
│  └─ Không → focus lỗi đầu tiên → dừng
│
├─ Tạo payload
├─ Thêm hay sửa?
├─ Khóa form
├─ Gửi POST hoặc PUT
│
├─ Thành công
│  ├─ Mở khóa
│  ├─ Đóng modal
│  ├─ Hiện toast
│  ├─ Tải lại bảng
│  └─ Trả focus
│
└─ Thất bại
   ├─ Mở khóa
   ├─ Ghi lỗi Console
   ├─ Hiện lỗi trong form
   └─ Giữ modal và dữ liệu
```

Điểm cốt lõi của hàm là: **một handler duy nhất có thể xử lý cả thêm và sửa sách**, dựa vào `editingBookId`.

## Hàm saveBookWithOptionalPdf()

Hàm này có nhiệm vụ lưu thông tin sách vào backend và, nếu người dùng chọn PDF, lưu thêm file đó vào IndexedDB.

Nó xử lý cả hai trường hợp:

- Thêm sách mới.
- Chỉnh sửa sách đã tồn tại.

## 1. Các tham số đầu vào

```javascript
async function saveBookWithOptionalPdf(
    isEditing,
    bookId,
    payload,
    pdfFile
)
```

Ý nghĩa:

- `isEditing`: đang sửa sách hay thêm mới.
- `bookId`: ID sách đang sửa; khi thêm mới thường là `null`.
- `payload`: thông tin gửi tới backend.
- `pdfFile`: file PDF người dùng chọn; có thể là `null`.

Ví dụ `payload`:

```javascript
{
    title: "Clean Code",
    author: "Robert C. Martin",
    publishYear: 2008,
    tags: "programming, clean code",
    pdfUrl: null,
    hasLocalFile: false
}
```

Hàm là `async`, nên:

- Có thể sử dụng `await`.
- Luôn trả về một `Promise`.
- Nếu xảy ra lỗi không được xử lý, Promise sẽ bị reject.

---

## 2. Thêm hoặc cập nhật metadata

```javascript
let savedBook = isEditing
  ? await BookApi.update(bookId, payload)
  : await BookApi.create(payload);
```

Đây là toán tử ba ngôi:

```javascript
condition ? valueIfTrue : valueIfFalse;
```

Tương đương:

```javascript
let savedBook;

if (isEditing) {
  savedBook = await BookApi.update(bookId, payload);
} else {
  savedBook = await BookApi.create(payload);
}
```

Nếu đang sửa:

```http
PUT /api/books/{bookId}
```

Nếu đang thêm:

```http
POST /api/books
```

`await` khiến hàm chờ backend phản hồi trước khi chạy dòng tiếp theo.

Kết quả được gán vào `savedBook`:

```javascript
{
    id: 10,
    title: "Clean Code",
    author: "Robert C. Martin",
    hasLocalFile: false
}
```

Việc chờ backend trước rất quan trọng khi thêm mới, bởi file PDF phải được lưu theo `bookId`, nhưng trước khi backend tạo sách thì frontend chưa có ID đó.

Luồng:

```text
Tạo sách trên backend
→ nhận bookId
→ dùng bookId lưu PDF vào IndexedDB
```

---

## 3. Không có PDF thì kết thúc sớm

```javascript
if (!pdfFile) {
  return savedBook;
}
```

`!pdfFile` đúng khi:

```javascript
pdfFile === null;
pdfFile === undefined;
```

Nếu người dùng không chọn PDF, hàm không cần làm việc với IndexedDB và trả ngay sách vừa lưu.

Đây gọi là early return.

Ví dụ:

```text
Người dùng chỉ nhập tên, tác giả và URL
→ backend lưu metadata
→ không có file offline
→ kết thúc hàm
```

---

## 4. Lưu PDF vào IndexedDB

```javascript
await PdfStore.save(savedBook.id, pdfFile);
```

File được lưu bằng ID mà backend vừa trả về:

```javascript
PdfStore.save(10, pdfFile);
```

Record trong IndexedDB có thể giống:

```javascript
{
    bookId: 10,
    blob: pdfFile,
    fileName: "clean-code.pdf",
    mimeType: "application/pdf"
}
```

`await` bảo đảm file phải được lưu xong trước khi frontend báo với backend rằng sách có PDF offline.

Thứ tự này tránh trường hợp:

```text
Backend: hasLocalFile = true
IndexedDB: không có file
```

---

## 5. Kiểm tra backend đã biết có file chưa

```javascript
if (!savedBook.hasLocalFile) {
```

Nếu `hasLocalFile` đang là `false`, backend chưa biết PDF vừa được lưu vào trình duyệt.

Frontend cần gọi update lần nữa:

```javascript
savedBook = await BookApi.update(savedBook.id, {
  ...payload,
  hasLocalFile: true,
});
```

Dấu spread:

```javascript
...payload
```

sao chép các thuộc tính trong `payload`.

Ví dụ:

```javascript
const payload = {
  title: "Clean Code",
  author: "Robert C. Martin",
  hasLocalFile: false,
};
```

Thì:

```javascript
{
    ...payload,
    hasLocalFile: true
}
```

tạo ra:

```javascript
{
    title: "Clean Code",
    author: "Robert C. Martin",
    hasLocalFile: true
}
```

Thuộc tính phía sau ghi đè thuộc tính phía trước. Vì vậy `hasLocalFile` cuối cùng là `true`.

Backend lúc này được cập nhật:

```text
Sách ID 10 có PDF offline trong trình duyệt
```

Kết quả update mới lại được gán cho `savedBook`.

---

## 6. Vì sao có `try/catch`?

```javascript
try {
    savedBook = await BookApi.update(...);
} catch (error) {
    await PdfStore.remove(savedBook.id);
    throw error;
}
```

Tình huống cần xử lý:

1. PDF đã lưu thành công vào IndexedDB.
2. Frontend gọi backend để đặt `hasLocalFile: true`.
3. Request backend thất bại.

Nếu không xử lý:

```text
IndexedDB: có PDF
Backend: hasLocalFile = false
```

Hai nơi sẽ không đồng bộ.

Do đó trong `catch`:

```javascript
await PdfStore.remove(savedBook.id);
```

frontend xóa PDF vừa lưu để quay lại trạng thái trước đó.

Đây là một dạng rollback hoặc compensating action: không thể rollback cả backend và IndexedDB bằng một database transaction chung, nên frontend tự thực hiện thao tác bù trừ.

Sau đó:

```javascript
throw error;
```

ném lại lỗi cho hàm gọi bên ngoài xử lý.

Ví dụ bên ngoài:

```javascript
try {
    await saveBookWithOptionalPdf(...);
    showToast("Lưu thành công");
} catch (error) {
    showToast("Lưu thất bại", "error");
}
```

Nếu không `throw error`, hàm bên ngoài có thể hiểu nhầm rằng thao tác đã thành công.

---

## 7. Trả về kết quả cuối cùng

```javascript
return savedBook;
```

Nếu mọi thứ thành công, hàm trả về sách mới nhất do backend trả về.

Khi có PDF:

```javascript
{
    id: 10,
    title: "Clean Code",
    hasLocalFile: true
}
```

Khi không có PDF:

```javascript
{
    id: 10,
    title: "Clean Code",
    hasLocalFile: false
}
```

## Luồng tổng thể

### Thêm sách không có PDF

```text
POST metadata
→ backend trả sách
→ pdfFile không tồn tại
→ trả savedBook
```

### Thêm sách có PDF

```text
POST metadata với hasLocalFile = false
→ nhận bookId
→ lưu PDF vào IndexedDB
→ PUT hasLocalFile = true
→ trả savedBook
```

### Sửa sách đã có PDF, không chọn file mới

```text
PUT metadata, giữ hasLocalFile = true
→ không có pdfFile mới
→ trả savedBook
```

### Thay PDF của sách đã có PDF

```text
PUT metadata, hasLocalFile vẫn là true
→ ghi đè PDF trong IndexedDB
→ không cần gọi PUT lần hai
→ trả savedBook
```

### Backend update trạng thái file thất bại

```text
Lưu PDF vào IndexedDB thành công
→ PUT hasLocalFile = true thất bại
→ xóa PDF vừa lưu
→ ném lỗi ra ngoài
```

Tóm lại, điểm chính của hàm là đảm bảo thứ tự:

```text
Metadata được lưu
→ PDF được lưu thật
→ backend mới đánh dấu hasLocalFile = true
```

Nhờ vậy, backend không báo rằng sách có file offline trước khi file thực sự tồn tại trong IndexedDB.

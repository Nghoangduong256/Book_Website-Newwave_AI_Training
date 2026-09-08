Được. Đoạn code này có hai loại xử lý bất đồng bộ:

1. `setTimeout()` dùng để debounce tìm kiếm.
2. `loadBooks()` nhiều khả năng gọi AJAX để lấy dữ liệu từ backend.

Trước hết, hãy nhìn luồng tổng quát:

```text
Trang HTML tải xong
→ khởi tạo trang
→ đăng ký các sự kiện
→ gọi API tải sách
→ chờ người dùng tìm kiếm/sắp xếp/thử lại
```

## 1. `"use strict"`

```javascript
"use strict";
```

Bật chế độ kiểm tra JavaScript nghiêm ngặt.

Ví dụ, nếu quên khai báo biến:

```javascript
bookCount = 10;
```

Strict mode sẽ báo lỗi. Bạn phải viết:

```javascript
let bookCount = 10;
```

Nó giúp tránh một số lỗi JavaScript khó phát hiện.

## 2. Chờ DOM tải xong

```javascript
$(function () {
  // Code của trang
});
```

Đây là dạng rút gọn của:

```javascript
$(document).ready(function () {
  // Code của trang
});
```

Ý nghĩa:

> Chỉ chạy code bên trong sau khi cấu trúc HTML đã được trình duyệt tạo xong.

Nếu JavaScript chạy quá sớm:

```javascript
const $bookGrid = $("#bookGrid");
```

thì `#bookGrid` có thể chưa tồn tại.

Đây cũng là một dạng xử lý theo sự kiện: hàm được truyền vào `$()` chưa chạy ngay nếu DOM chưa sẵn sàng. jQuery sẽ gọi nó khi DOM đã tải xong.

## 3. State của trang

```javascript
let allBooks = [];
let searchTimer = null;
```

### `allBooks`

```javascript
let allBooks = [];
```

Dùng để giữ danh sách sách gốc lấy từ backend.

Ví dụ sau khi API trả kết quả:

```javascript
allBooks = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
  },
  {
    id: 2,
    title: "Refactoring",
    author: "Martin Fowler",
  },
];
```

Khi tìm kiếm, không nên xóa phần tử khỏi `allBooks`. Thay vào đó, tạo một mảng đã lọc:

```javascript
const filteredBooks = allBooks.filter(...);
```

Nhờ vậy, khi người dùng xóa từ khóa tìm kiếm, ta vẫn còn dữ liệu gốc để hiển thị lại.

### `searchTimer`

```javascript
let searchTimer = null;
```

Biến này giữ ID của lần `setTimeout()` gần nhất.

Nó được dùng để thực hiện debounce:

> Chỉ lọc sách sau khi người dùng ngừng gõ 250 ms.

## 4. Cache phần tử DOM

```javascript
const $bookGrid = $("#bookGrid");
const $libraryState = $("#libraryState");
const $loadingState = $("#loadingState");
const $errorState = $("#errorState");
const $emptyState = $("#emptyState");
```

Dấu `$` đầu tên biến là quy ước, không phải cú pháp đặc biệt.

Nó cho biết biến đang chứa một jQuery object:

```javascript
const $bookGrid = $("#bookGrid");
```

thay vì DOM element thuần:

```javascript
const bookGrid = document.getElementById("bookGrid");
```

Vì là jQuery object nên có thể dùng:

```javascript
$bookGrid.empty();
$bookGrid.html(cardsHtml);
$bookGrid.addClass("is-hidden");
```

Việc lưu phần tử vào biến giúp không phải tìm lại nó nhiều lần:

```javascript
$("#bookGrid").empty();
$("#bookGrid").html(cardsHtml);
$("#bookGrid").removeClass("is-hidden");
```

thành:

```javascript
$bookGrid.empty();
$bookGrid.html(cardsHtml);
$bookGrid.removeClass("is-hidden");
```

## 5. Khởi động trang

```javascript
initialize();
```

Hàm được gọi ngay sau khi DOM đã sẵn sàng.

```javascript
function initialize() {
  bindEvents();
  loadBooks();
}
```

Nó thực hiện hai việc:

```text
bindEvents() → đăng ký hành vi tương tác
loadBooks()  → lấy dữ liệu sách từ backend
```

### Vì sao đăng ký event trước rồi mới tải sách?

```javascript
bindEvents();
loadBooks();
```

Điều này giúp các control được chuẩn bị trước. Trong lúc API đang tải, sự kiện “Thử lại” hoặc các event khác đã được đăng ký.

Trong trường hợp hiện tại, đổi thứ tự chưa chắc tạo lỗi ngay, nhưng đăng ký event trước là cách tổ chức hợp lý.

# Phần bất đồng bộ thứ nhất: sự kiện

## 6. `bindEvents()`

```javascript
function bindEvents() {
  $("#bookSearch").on("input", function () {
    // ...
  });

  $("#bookSort").on("change", function () {
    // ...
  });

  $("#retryLoadButton").on("click", function () {
    // ...
  });
}
```

Đoạn này không gọi các hàm xử lý ngay. Nó chỉ đăng ký:

```text
Nếu input thay đổi → chạy callback tìm kiếm
Nếu select thay đổi → chạy callback sắp xếp
Nếu button được bấm → tải lại sách
```

Ví dụ:

```javascript
$("#retryLoadButton").on("click", function () {
  loadBooks();
});
```

Khi JavaScript chạy tới đây, `loadBooks()` chưa được gọi bởi event handler.

Nó chỉ chạy trong tương lai, khi người dùng click.

Đó là đặc điểm của lập trình bất đồng bộ theo sự kiện.

## 7. Event `input`

```javascript
$("#bookSearch").on("input", function () {
  // ...
});
```

Event `input` xảy ra mỗi khi giá trị input thay đổi:

- Nhập một ký tự.
- Xóa ký tự.
- Paste nội dung.
- Cut nội dung.

Ví dụ nhập `"Clean"` sẽ có thể tạo ra năm event:

```text
C
Cl
Cle
Clea
Clean
```

Nếu gọi `applyFilters()` ngay trong mỗi event:

```javascript
$("#bookSearch").on("input", function () {
  applyFilters();
});
```

thì lọc danh sách năm lần.

Với ít sách thì chưa đáng kể, nhưng đây là cơ hội để học debounce.

# Phần bất đồng bộ thứ hai: debounce

## 8. `clearTimeout()`

```javascript
clearTimeout(searchTimer);
```

Lệnh này hủy lần hẹn giờ trước đó, nếu nó chưa chạy.

## 9. `setTimeout()`

```javascript
searchTimer = setTimeout(function () {
  applyFilters();
}, 250);
```

Ý nghĩa:

> Hẹn chạy `applyFilters()` sau ít nhất 250 ms.

`setTimeout()` không dừng chương trình để chờ 250 ms.

Nó đăng ký callback rồi trả quyền điều khiển ngay:

```text
Đăng ký callback
→ JavaScript tiếp tục làm việc khác
→ đủ 250 ms và call stack rảnh
→ callback được đưa vào thực thi
```

### Ví dụ người dùng nhập chậm

Người dùng nhập `A`, sau đó không gõ tiếp:

```text
0 ms:   event input xảy ra
1 ms:   tạo timer số 1
251 ms: timer số 1 gọi applyFilters()
```

### Ví dụ người dùng nhập nhanh

Người dùng nhập `"ABC"`:

```text
0 ms:   nhập A → tạo timer 1
100 ms: nhập B → hủy timer 1 → tạo timer 2
180 ms: nhập C → hủy timer 2 → tạo timer 3
430 ms: timer 3 chạy applyFilters()
```

Kết quả: `applyFilters()` chỉ chạy một lần sau ký tự cuối cùng.

Đây chính là debounce.

## 10. Vì sao phải lưu kết quả của `setTimeout()`?

```javascript
searchTimer = setTimeout(...);
```

`setTimeout()` trả về ID của timer.

Ví dụ khái niệm:

```javascript
searchTimer = 3;
```

Nhờ ID này, lần nhập tiếp theo có thể hủy đúng timer:

```javascript
clearTimeout(searchTimer);
```

Nếu không lưu ID:

```javascript
setTimeout(function () {
  applyFilters();
}, 250);
```

thì không biết phải hủy timer nào. Khi nhập `"ABC"`, cả ba callback đều có thể chạy.

# Event sắp xếp

```javascript
$("#bookSort").on("change", function () {
  applyFilters();
});
```

Khi người dùng chọn cách sắp xếp mới, `applyFilters()` chạy ngay.

Không cần debounce select vì người dùng thường chỉ tạo một event cho mỗi lần chọn.

`applyFilters()` dự kiến sẽ:

1. Lấy từ khóa tìm kiếm.
2. Lấy kiểu sắp xếp.
3. Lọc từ `allBooks`.
4. Sắp xếp kết quả.
5. Render lại card.

# Event thử lại

```javascript
$("#retryLoadButton").on("click", function () {
  loadBooks();
});
```

Nếu API thất bại và người dùng bấm “Thử lại”, ứng dụng gọi lại `loadBooks()`.

`loadBooks()` thường có dạng:

```javascript
function loadBooks() {
  showLoadingState();

  BookApi.getAll()
    .done(function (data) {
      allBooks = data;
      applyFilters();
    })
    .fail(function () {
      showErrorState();
    });
}
```

# Bất đồng bộ khi gọi API

Giả sử:

```javascript
BookApi.getAll();
```

sử dụng:

```javascript
$.ajax({
  url: "http://localhost:8080/api/books",
  method: "GET",
});
```

Request HTTP không trả kết quả ngay. JavaScript không đứng yên chờ backend.

Luồng thực tế:

```text
1. Gọi loadBooks()
2. Hiển thị loading
3. Gửi HTTP request
4. loadBooks() tạm kết thúc
5. Trình duyệt tiếp tục xử lý giao diện
6. Backend trả response
7. Callback .done() hoặc .fail() được gọi
```

Ví dụ:

```javascript
console.log("A");

BookApi.getAll().done(function () {
  console.log("B");
});

console.log("C");
```

Kết quả thường là:

```text
A
C
B
```

Không phải:

```text
A
B
C
```

Vì callback `.done()` chỉ chạy sau khi backend trả kết quả.

## `.done()` và `.fail()`

```javascript
BookApi.getAll()
  .done(function (data) {
    allBooks = data;
  })
  .fail(function (xhr) {
    console.error(xhr);
  });
```

- `.done()` chạy khi request thành công.
- `.fail()` chạy khi request thất bại.
- `data` là dữ liệu backend trả về.
- `xhr` chứa thông tin request lỗi.

Có thể thêm:

```javascript
.always(function () {
    console.log("Request đã kết thúc");
});
```

`.always()` chạy trong cả hai trường hợp thành công và thất bại.

# Closure trong đoạn code

Các callback vẫn truy cập được:

```javascript
allBooks;
searchTimer;
$bookGrid;
```

mặc dù chúng chạy sau khi event xảy ra hoặc API trả về.

Ví dụ:

```javascript
$("#bookSearch").on("input", function () {
  clearTimeout(searchTimer);
});
```

Callback nhớ được biến `searchTimer` thuộc scope bên ngoài. Cơ chế đó gọi là closure.

Bạn có thể hình dung:

```text
Callback không chỉ giữ code của nó
Callback còn nhớ môi trường nơi nó được tạo
```

# Bất đồng bộ không có nghĩa là chạy song song

Trong code frontend JavaScript thông thường:

- Main JavaScript vẫn chạy chủ yếu trên một thread.
- Timer, network và browser event được môi trường trình duyệt theo dõi.
- Khi có kết quả, callback được đưa vào hàng đợi.
- Event loop đưa callback vào call stack khi stack trống.

Mô hình đơn giản:

```text
Call stack
    ↓
Web APIs: timer, network, DOM events
    ↓
Callback queue
    ↓
Event loop
    ↓
Call stack
```

Ví dụ khi timer đủ 250 ms nhưng JavaScript đang bận:

```javascript
setTimeout(function () {
  console.log("Timer");
}, 250);

doVeryHeavyWork();
```

Callback không chắc chạy đúng tại mili-giây 250. Nó chỉ chạy khi:

1. Đã qua ít nhất 250 ms.
2. Call stack đã trống.

## Tóm tắt đoạn code

```javascript
$(function () {
```

Chờ DOM sẵn sàng.

```javascript
let allBooks = [];
```

Lưu dữ liệu sách gốc.

```javascript
let searchTimer = null;
```

Lưu timer để debounce.

```javascript
const $bookGrid = $("#bookGrid");
```

Cache jQuery object.

```javascript
initialize();
```

Khởi động trang.

```javascript
bindEvents();
```

Đăng ký callback cho các hành động tương lai.

```javascript
loadBooks();
```

Gửi request bất đồng bộ tới backend.

```javascript
setTimeout(..., 250);
```

Hẹn lọc sách sau 250 ms.

```javascript
clearTimeout(searchTimer);
```

Hủy lần lọc cũ khi người dùng tiếp tục nhập.

Điểm quan trọng nhất bạn nên ghi nhớ:

> Code bất đồng bộ không chờ kết quả tại chỗ. Nó đăng ký công việc và cung cấp callback để chạy khi timer, request hoặc sự kiện hoàn thành.

## Hàm applyFilters()

Hàm `applyFilters()` thực hiện ba việc theo thứ tự:

```text
Đọc điều kiện trên giao diện
→ lọc danh sách sách
→ sắp xếp và render kết quả
```

## 1. Lấy từ khóa tìm kiếm

```javascript
const keyword = normalizeText($("#bookSearch").val());
```

Trong đó:

```javascript
$("#bookSearch");
```

dùng jQuery chọn phần tử có:

```html
id="bookSearch"
```

`.val()` lấy giá trị người dùng nhập vào input.

`normalizeText()` chuẩn hóa giá trị, thường là:

- Chuyển `null`/`undefined` thành chuỗi rỗng.
- Xóa khoảng trắng thừa ở đầu và cuối.
- Chuyển thành chữ thường.

Ví dụ:

```text
"  Clean CODE  "
```

trở thành:

```text
"clean code"
```

Nhờ vậy tìm kiếm không phân biệt chữ hoa, chữ thường hay khoảng trắng ngoài cùng.

## 2. Lấy kiểu sắp xếp

```javascript
const sortType = $("#bookSort").val();
```

jQuery lấy giá trị đang được chọn trong:

```html
<select id="bookSort"></select>
```

Ví dụ kết quả có thể là:

```javascript
"TITLE_ASC";
"TITLE_DESC";
"YEAR_ASC";
"YEAR_DESC";
"CREATED_DESC";
```

Giá trị này sẽ được truyền cho `sortBooks()`.

## 3. Lọc danh sách sách

```javascript
const filteredBooks = allBooks.filter(function (book) {
```

`allBooks` là danh sách sách gốc lấy từ backend.

`.filter()` duyệt qua từng cuốn sách và tạo một mảng mới:

- Callback trả về `true`: giữ lại cuốn sách.
- Callback trả về `false`: loại cuốn sách khỏi kết quả.

Quan trọng: `.filter()` không thay đổi `allBooks`.

Ví dụ:

```javascript
allBooks = [bookA, bookB, bookC];
filteredBooks = [bookA, bookC];
```

Danh sách `allBooks` vẫn giữ nguyên ba phần tử.

## 4. Không có từ khóa thì giữ lại mọi sách

```javascript
if (!keyword) {
  return true;
}
```

Nếu input rỗng, `keyword` là:

```javascript
"";
```

Chuỗi rỗng là giá trị falsy, nên:

```javascript
!keyword;
```

sẽ là `true`.

Callback trả về `true` cho từng cuốn sách, vì vậy toàn bộ danh sách được giữ lại.

Có thể hiểu như sau:

```text
Không nhập từ khóa
→ không cần lọc
→ hiển thị tất cả sách
```

## 5. Ghép những trường cần tìm kiếm

```javascript
const searchableText = normalizeText(
  [book.title, book.author, book.tags].join(" "),
);
```

Đoạn này tạo một mảng:

```javascript
[book.title, book.author, book.tags];
```

Ví dụ:

```javascript
["Clean Code", "Robert C. Martin", "Lập trình, Kỹ năng"];
```

Sau đó:

```javascript
.join(" ")
```

ghép chúng thành một chuỗi, cách nhau bởi dấu cách:

```text
Clean Code Robert C. Martin Lập trình, Kỹ năng
```

Cuối cùng `normalizeText()` biến nó thành:

```text
clean code robert c. martin lập trình, kỹ năng
```

Nhờ ghép các trường lại, không cần viết ba điều kiện riêng:

```javascript
book.title.includes(keyword);
book.author.includes(keyword);
book.tags.includes(keyword);
```

Người dùng có thể tìm theo tên sách, tác giả hoặc tag bằng cùng một ô input.

## 6. Kiểm tra từ khóa có nằm trong dữ liệu không

```javascript
return searchableText.includes(keyword);
```

`.includes()` trả về boolean.

Ví dụ:

```javascript
"clean code robert c. martin lập trình".includes("robert");
// true
```

```javascript
"clean code robert c. martin lập trình".includes("javascript");
// false
```

Nếu kết quả là `true`, sách được giữ lại trong `filteredBooks`.

## 7. Sắp xếp kết quả đã lọc

```javascript
sortBooks(filteredBooks, sortType);
```

Hàm này nhận:

- `filteredBooks`: danh sách sau khi tìm kiếm.
- `sortType`: lựa chọn sắp xếp hiện tại.

Ví dụ:

```javascript
sortBooks(filteredBooks, "TITLE_ASC");
```

Quy trình cố ý lọc trước rồi mới sắp xếp:

```text
100 cuốn sách
→ lọc còn 8 cuốn
→ sắp xếp 8 cuốn
```

## 8. Render kết quả

```javascript
renderBooks(filteredBooks, keyword);
```

Hàm này cập nhật giao diện:

- Có kết quả: tạo các book card.
- Không có kết quả: hiện empty state.
- `keyword` được truyền vào để có thể hiện thông báo như:

```text
Không có kết quả phù hợp với “javascript”.
```

## Ví dụ hoàn chỉnh

Giả sử:

```javascript
allBooks = [
  {
    title: "Clean Code",
    author: "Robert Martin",
    tags: "Lập trình",
  },
  {
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    tags: "Frontend",
  },
];
```

Người dùng nhập:

```text
frontend
```

Khi duyệt `Clean Code`:

```javascript
searchableText = "clean code robert martin lập trình";

searchableText.includes("frontend");
// false
```

Khi duyệt `Eloquent JavaScript`:

```javascript
searchableText = "eloquent javascript marijn haverbeke frontend";

searchableText.includes("frontend");
// true
```

Kết quả:

```javascript
filteredBooks = [
  {
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    tags: "Frontend",
  },
];
```

Sau đó sách này được sắp xếp và render.

Tóm tắt ngắn gọn:

```javascript
function applyFilters() {
  // 1. Đọc từ khóa và kiểu sắp xếp
  // 2. Duyệt allBooks, giữ lại sách khớp từ khóa
  // 3. Sắp xếp kết quả
  // 4. Vẽ lại giao diện
}
```

Một điểm quan trọng: tên hàm là `applyFilters`, nhưng nó đang đảm nhiệm cả lọc, sắp xếp và yêu cầu render. Với quy mô nhỏ hiện tại, cách tổ chức này hoàn toàn phù hợp.

## Hàm sortBooks()

Hàm `sortBooks()` sắp xếp mảng sách theo lựa chọn của người dùng:

```javascript
function sortBooks(books, sortType) {
```

Hai tham số:

- `books`: mảng sách cần sắp xếp.
- `sortType`: kiểu sắp xếp, ví dụ `TITLE_ASC` hoặc `YEAR_DESC`.

Luồng hoạt động:

```text
Nhận danh sách sách
→ so sánh từng cặp sách
→ đổi vị trí các phần tử
→ mảng books được sắp xếp
```

## 1. `sort()` thay đổi trực tiếp mảng

```javascript
books.sort(function (firstBook, secondBook) {
```

`.sort()` nhận một hàm so sánh hai phần tử:

- `firstBook`: cuốn sách thứ nhất.
- `secondBook`: cuốn sách thứ hai.

Hàm so sánh phải trả về một số:

```text
Số âm   → firstBook đứng trước secondBook
Số dương → firstBook đứng sau secondBook
0        → giữ thứ tự tương đối
```

Ví dụ:

```javascript
[3, 1, 2].sort(function (first, second) {
  return first - second;
});
```

Kết quả:

```javascript
[1, 2, 3];
```

Lưu ý: `.sort()` thay đổi trực tiếp mảng `books`, không tạo mảng mới.

Trong code hiện tại điều này an toàn vì `books` là `filteredBooks`, được tạo trước đó bằng `.filter()`:

```javascript
const filteredBooks = allBooks.filter(...);
sortBooks(filteredBooks, sortType);
```

Do đó `allBooks` không bị thay đổi thứ tự.

## 2. Chọn cách sắp xếp bằng `switch`

```javascript
switch (sortType) {
```

Tùy theo giá trị `sortType`, chương trình sử dụng một phép so sánh khác.

Ví dụ:

```javascript
sortType === "TITLE_DESC";
```

thì chạy nhánh sắp xếp tiêu đề Z–A.

---

## 3. Sắp xếp tiêu đề Z–A

```javascript
case "TITLE_DESC":
    return secondBook.title.localeCompare(
        firstBook.title,
        "vi"
    );
```

`localeCompare()` so sánh hai chuỗi theo quy tắc ngôn ngữ.

Ví dụ:

```javascript
"An".localeCompare("Bình", "vi");
```

Khi sắp xếp tăng dần A–Z, thường viết:

```javascript
firstBook.title.localeCompare(secondBook.title, "vi");
```

Nhưng ở đây thứ tự được đảo lại:

```javascript
secondBook.title.localeCompare(firstBook.title, "vi");
```

nên kết quả là Z–A.

Ví dụ:

```text
Clean Code
Đế Bá
Eloquent JavaScript
```

sẽ được sắp xếp theo chiều giảm dần của tiêu đề.

Tham số `"vi"` yêu cầu trình duyệt áp dụng quy tắc so sánh phù hợp với tiếng Việt.

---

## 4. Sắp xếp năm tăng dần

```javascript
case "YEAR_ASC":
    return (
        (firstBook.publishYear ?? Number.MAX_SAFE_INTEGER)
        - (secondBook.publishYear ?? Number.MAX_SAFE_INTEGER)
    );
```

Sắp xếp tăng dần sử dụng:

```javascript
năm thứ nhất - năm thứ hai
```

Ví dụ:

```javascript
2008 - 2018;
// -10
```

Kết quả âm nên sách năm `2008` đứng trước sách năm `2018`.

### Ý nghĩa của `??`

```javascript
firstBook.publishYear ?? Number.MAX_SAFE_INTEGER;
```

Toán tử `??` sử dụng giá trị bên phải nếu bên trái là:

```javascript
null;
undefined;
```

Ví dụ:

```javascript
2008 ?? Number.MAX_SAFE_INTEGER;
// 2008
```

```javascript
null ?? Number.MAX_SAFE_INTEGER;
// 9007199254740991
```

`Number.MAX_SAFE_INTEGER` là một số rất lớn:

```javascript
9007199254740991;
```

Sách không có năm được xem như có một năm cực lớn, vì vậy khi sắp xếp tăng dần, chúng nằm cuối danh sách.

Ví dụ:

```text
2008
2018
2020
không có năm
```

---

## 5. Sắp xếp năm giảm dần

```javascript
case "YEAR_DESC":
    return (
        (secondBook.publishYear ?? Number.MIN_SAFE_INTEGER)
        - (firstBook.publishYear ?? Number.MIN_SAFE_INTEGER)
    );
```

Để sắp xếp giảm dần, thứ tự phép trừ được đảo lại:

```javascript
năm thứ hai - năm thứ nhất
```

Ví dụ:

```javascript
2018 - 2008;
// 10
```

Kết quả dương nên sách `firstBook` năm 2008 bị đưa ra sau sách năm 2018.

### Xử lý sách không có năm

`Number.MIN_SAFE_INTEGER` là một số âm rất nhỏ:

```javascript
-9007199254740991;
```

Nếu sách không có năm, nó được xem như có năm cực nhỏ. Vì vậy khi sắp xếp giảm dần, sách đó cũng nằm cuối danh sách.

Kết quả:

```text
2020
2018
2008
không có năm
```

Việc dùng hai giá trị khác nhau có chủ đích:

```javascript
YEAR_ASC  → null biến thành số cực lớn
YEAR_DESC → null biến thành số cực nhỏ
```

Mục tiêu chung là luôn đặt sách không có năm ở cuối.

---

## 6. Sắp xếp theo ngày tạo mới nhất

```javascript
case "CREATED_DESC":
    return String(secondBook.createdAt ?? "")
        .localeCompare(String(firstBook.createdAt ?? ""));
```

`createdAt` từ backend thường có dạng ISO:

```text
2026-08-25T10:30:00
2026-08-26T09:15:00
```

Chuỗi ngày ISO có thể so sánh theo thứ tự chữ vì nó được sắp từ đơn vị lớn đến nhỏ:

```text
năm → tháng → ngày → giờ → phút → giây
```

Ví dụ:

```javascript
"2026-08-26T09:15:00".localeCompare("2026-08-25T10:30:00");

// số dương
```

`secondBook` được đặt trước `firstBook`, nên đây là thứ tự giảm dần:

```text
Sách mới nhất
→ sách cũ hơn
```

Phần:

```javascript
String(secondBook.createdAt ?? "");
```

đảm bảo giá trị luôn là chuỗi, kể cả khi `createdAt` là `null`.

Cách so sánh chuỗi này hoạt động tốt khi backend luôn trả ngày theo cùng một định dạng ISO.

---

## 7. Sắp xếp tiêu đề A–Z

```javascript
case "TITLE_ASC":
default:
    return firstBook.title.localeCompare(
        secondBook.title,
        "vi"
    );
```

Thứ tự so sánh là:

```javascript
firstBook.title.localeCompare(secondBook.title, "vi");
```

nên tiêu đề được sắp xếp A–Z.

Ví dụ:

```text
Clean Code
Eloquent JavaScript
Refactoring
```

### Vì sao có cả `case` và `default`?

```javascript
case "TITLE_ASC":
default:
```

Hai nhánh dùng chung một đoạn lệnh.

Nghĩa là:

- `sortType` bằng `"TITLE_ASC"`: sắp xếp A–Z.
- `sortType` không khớp bất kỳ trường hợp nào: cũng sắp xếp A–Z.

Điều này tạo một lựa chọn mặc định an toàn.

Ví dụ:

```javascript
sortBooks(books, undefined);
```

vẫn sắp xếp theo tiêu đề A–Z thay vì không làm gì.

## Ví dụ hoàn chỉnh

Dữ liệu:

```javascript
const books = [
  {
    title: "Refactoring",
    publishYear: 2018,
  },
  {
    title: "Clean Code",
    publishYear: 2008,
  },
  {
    title: "JavaScript Guide",
    publishYear: null,
  },
];
```

Gọi:

```javascript
sortBooks(books, "YEAR_ASC");
```

Kết quả:

```text
Clean Code — 2008
Refactoring — 2018
JavaScript Guide — không có năm
```

Gọi:

```javascript
sortBooks(books, "TITLE_ASC");
```

Kết quả:

```text
Clean Code
JavaScript Guide
Refactoring
```

## Tóm tắt các nhánh

| `sortType`           | Kết quả                      |
| -------------------- | ---------------------------- |
| `TITLE_ASC`          | Tiêu đề A–Z                  |
| `TITLE_DESC`         | Tiêu đề Z–A                  |
| `YEAR_ASC`           | Năm cũ đến mới               |
| `YEAR_DESC`          | Năm mới đến cũ               |
| `CREATED_DESC`       | Sách được thêm gần đây trước |
| Giá trị không hợp lệ | Mặc định tiêu đề A–Z         |

Điểm quan trọng nhất cần nhớ:

```javascript
sortBooks(filteredBooks, sortType);
```

sẽ thay đổi trực tiếp thứ tự của `filteredBooks`, nhưng không ảnh hưởng tới `allBooks` vì `filteredBooks` là mảng mới được tạo bởi `.filter()`.

## Hàm escapeHtml()

Hàm `escapeHtml()` biến dữ liệu thành văn bản HTML an toàn trước khi chèn vào template string:

```javascript
function escapeHtml(value) {
  return $("<div>")
    .text(String(value ?? ""))
    .html();
}
```

Ví dụ:

```javascript
const title = '<script>alert("XSS")</script>';

escapeHtml(title);
```

Kết quả:

```html
&lt;script&gt;alert("XSS")&lt;/script&gt;
```

Khi chèn kết quả vào giao diện, trình duyệt chỉ hiển thị dòng chữ `<script>...`, không thực thi JavaScript.

## Giải thích từng phần

### 1. `value ?? ""`

Toán tử `??` gọi là nullish coalescing:

```javascript
value ?? "";
```

Nó trả về chuỗi rỗng nếu `value` là:

```javascript
null;
undefined;
```

Ví dụ:

```javascript
null ?? ""; // ""
undefined ?? ""; // ""
"Clean Code" ?? ""; // "Clean Code"
0 ?? ""; // 0
false ?? ""; // false
```

Khác với `||`, toán tử `??` không thay thế các giá trị hợp lệ như `0` và `false`.

### 2. `String(...)`

```javascript
String(value ?? "");
```

Chuyển dữ liệu thành chuỗi:

```javascript
String(2024); // "2024"
String(false); // "false"
String(null ?? ""); // ""
```

Nhờ vậy `.text()` luôn nhận được một chuỗi hợp lệ.

### 3. `$("<div>")`

```javascript
$("<div>");
```

jQuery tạo một phần tử `<div>` tạm thời trong bộ nhớ:

```html
<div></div>
```

Phần tử này chưa được thêm vào trang.

### 4. `.text(...)`

```javascript
.text('<script>alert("XSS")</script>')
```

`.text()` đặt giá trị dưới dạng văn bản thuần, không diễn giải nó thành HTML.

Về mặt ý nghĩa, phần tử tạm sẽ chứa:

```html
<div>&lt;script&gt;alert("XSS")&lt;/script&gt;</div>
```

Các ký tự đặc biệt được mã hóa:

```text
<  → &lt;
>  → &gt;
&  → &amp;
"  → &quot; trong một số ngữ cảnh
```

### 5. `.html()`

Ở đây `.html()` không truyền tham số nên nó đọc nội dung HTML bên trong `<div>` tạm:

```javascript
.html();
```

Do nội dung trước đó được đặt bằng `.text()`, kết quả nhận được là chuỗi đã escape:

```html
&lt;script&gt;alert("XSS")&lt;/script&gt;
```

## Luồng hoạt động

```text
Dữ liệu chưa tin cậy
        ↓
Chuyển null/undefined thành ""
        ↓
Chuyển thành chuỗi
        ↓
Đặt vào div bằng .text()
        ↓
jQuery mã hóa ký tự HTML
        ↓
Đọc lại bằng .html()
        ↓
Chuỗi HTML an toàn
```

## Vì sao cần hàm này?

Trong `createBookCard()`, chúng ta tạo HTML bằng template string:

```javascript
return `
    <h2>${book.title}</h2>
`;
```

Nếu `book.title` chứa:

```html
<img src="x" onerror="alert('XSS')" />
```

và chèn trực tiếp bằng:

```javascript
$("#bookGrid").html(cardsHtml);
```

trình duyệt có thể diễn giải nó thành HTML và thực thi `onerror`.

Dùng `escapeHtml()`:

```javascript
const title = escapeHtml(book.title);

return `
    <h2>${title}</h2>
`;
```

trình duyệt chỉ hiển thị nội dung đó như văn bản.

## Điểm quan trọng

Hàm này phù hợp khi bạn cần đưa dữ liệu vào một chuỗi HTML:

```javascript
const html = `<h2>${escapeHtml(book.title)}</h2>`;
```

Nếu tạo DOM bằng jQuery và dùng `.text()` trực tiếp thì không cần escape thêm:

```javascript
$("<h2>").addClass("book-card__title").text(book.title);
```

Cách trên vốn đã an toàn vì `.text()` không xử lý `book.title` như HTML.

Tóm lại, kỹ thuật của hàm là:

```text
Ghi dữ liệu bằng .text()
→ đọc lại bằng .html()
→ nhận chuỗi đã được HTML-escape
```

Đúng là trong trường hợp sử dụng bình thường, `book.title` chỉ chứa tên sách:

```text
Clean Code
Đế Bá
Nhà giả kim
```

Nhưng JavaScript và trình duyệt không biết đây là “tên sách”. Với chúng, `book.title` chỉ là một chuỗi ký tự. Nếu chuỗi đó được đặt vào template HTML, trình duyệt sẽ cố diễn giải các ký tự `<...>` như thẻ HTML.

## Logic dẫn đến `escapeHtml()`

Bạn đang tạo card theo cách này:

```javascript
function createBookCard(book) {
  return `
        <article class="book-card">
            <h2>${book.title}</h2>
        </article>
    `;
}
```

Sau đó đưa chuỗi vào trang:

```javascript
$("#bookGrid").html(createBookCard(book));
```

Giả sử:

```javascript
book.title = "Clean Code";
```

Chuỗi cuối cùng là:

```html
<article class="book-card">
  <h2>Clean Code</h2>
</article>
```

Không có vấn đề gì.

Nhưng giả sử vì một lý do nào đó database chứa:

```javascript
book.title = "<strong>Clean Code</strong>";
```

Chuỗi cuối cùng trở thành:

```html
<h2><strong>Clean Code</strong></h2>
```

Trình duyệt không hiển thị nguyên văn:

```text
<strong>Clean Code</strong>
```

Nó tạo một thẻ `<strong>` thật.

Đó là vì dữ liệu được chèn vào chuỗi HTML trước khi gọi `.html()`.

## Làm sao `<img>` có thể đi vào `book.title`?

Người dùng không cần tải ảnh lên. Họ chỉ cần nhập chuỗi giống HTML vào ô tiêu đề.

Ví dụ form có:

```html
<input id="title" />
```

Người dùng nhập:

```html
<img src="abc" />
```

Khi JavaScript đọc input:

```javascript
const title = $("#title").val();
```

kết quả chỉ là một chuỗi:

```javascript
"<img src=\"abc\">";
```

Nếu backend không loại bỏ chuỗi này, nó có thể được lưu nguyên vào database:

```text
books.title = <img src="abc">
```

Khi tải danh sách lại, API trả về:

```json
{
  "id": 10,
  "title": "<img src=\"abc\">"
}
```

Sau đó frontend tạo card:

```javascript
const html = `<h2>${book.title}</h2>`;
$("#bookGrid").html(html);
```

Trình duyệt nhận được:

```html
<h2><img src="abc" /></h2>
```

Lúc này trình duyệt tạo thẻ ảnh thật.

Vì vậy, “chèn ảnh” ở đây không có nghĩa là người dùng upload một file ảnh. Họ nhập một đoạn văn bản có cú pháp giống thẻ HTML, còn `.html()` biến đoạn văn bản đó thành phần tử HTML.

## Trường hợp nguy hiểm hơn

Người dùng có thể nhập tiêu đề:

```html
<img src="invalid" onerror="alert('Xin chào')" />
```

Sau khi render:

```html
<h2>
  <img src="invalid" onerror="alert('Xin chào')" />
</h2>
```

Ảnh `invalid` không tải được, nên trình duyệt chạy đoạn JavaScript trong `onerror`.

Đây là một ví dụ về XSS — Cross-Site Scripting.

Luồng đầy đủ:

```text
Người dùng nhập chuỗi có HTML
        ↓
Backend lưu nguyên chuỗi vào database
        ↓
API trả chuỗi cho frontend
        ↓
Frontend nối chuỗi đó vào template HTML
        ↓
jQuery .html() đưa template vào DOM
        ↓
Trình duyệt hiểu dữ liệu thành thẻ HTML thật
```

## Nhưng website này chỉ do tôi sử dụng thì sao?

Nếu chỉ bạn sử dụng website, rủi ro thực tế thấp hơn. Tuy nhiên vẫn có thể xuất hiện dữ liệu ngoài ý muốn từ:

- Dữ liệu nhập sai.
- Dữ liệu được import từ file.
- Dữ liệu cũ trong database.
- API được gọi trực tiếp bằng Postman.
- Backend validation chưa kiểm tra nội dung HTML.
- Sau này website có thêm người sử dụng.

Quan trọng hơn, đây là thói quen nền tảng:

> Dữ liệu được lấy từ API hoặc input không nên được tin tưởng khi đưa vào HTML.

## `escapeHtml()` thay đổi điều gì?

Không escape:

```javascript
book.title = "<strong>Clean Code</strong>";

const html = `<h2>${book.title}</h2>`;
```

Kết quả được trình duyệt hiểu là:

```html
<h2><strong>Clean Code</strong></h2>
```

Có escape:

```javascript
const title = escapeHtml(book.title);
const html = `<h2>${title}</h2>`;
```

Kết quả:

```html
<h2>&lt;strong&gt;Clean Code&lt;/strong&gt;</h2>
```

Trình duyệt hiển thị:

```text
<strong>Clean Code</strong>
```

Nó không tạo thẻ `<strong>`.

## Tại sao không cần escape toàn bộ card?

Bởi vì cấu trúc card do lập trình viên viết và được tin tưởng:

```javascript
return `
    <article class="book-card">
        <h2>${title}</h2>
    </article>
`;
```

Phân biệt hai loại nội dung:

```javascript
// Cấu trúc do lập trình viên kiểm soát
<article>
<h2>
</h2>
</article>

// Dữ liệu từ API, không hoàn toàn kiểm soát
${book.title}
${book.author}
${book.tags}
```

Chỉ dữ liệu động cần được xử lý.

## Có cách nào dễ hiểu hơn không?

Có. Thay vì tạo cả card bằng chuỗi HTML, bạn có thể tạo DOM bằng jQuery:

```javascript
function createBookCard(book) {
  const $card = $("<article>").addClass("book-card");

  const $title = $("<h2>").addClass("book-card__title").text(book.title);

  $card.append($title);

  return $card;
}
```

Điểm quan trọng:

```javascript
.text(book.title)
```

`.text()` luôn coi `book.title` là văn bản, nên không cần gọi `escapeHtml()`.

So sánh:

```javascript
// Dữ liệu được hiểu như HTML
$title.html(book.title);

// Dữ liệu được hiểu như văn bản
$title.text(book.title);
```

Với người đang học jQuery, cách tạo DOM bằng `.text()` có thể dễ hình dung và an toàn hơn. Tuy nhiên, khi card có nhiều HTML, code sẽ dài hơn template string.

## Kết luận ngắn gọn

Bạn cần `escapeHtml()` không phải vì tiêu đề sách “đáng lẽ chứa ảnh”, mà vì:

```text
book.title chỉ là một chuỗi
+
chuỗi được nối vào HTML
+
card được render bằng .html()
=
trình duyệt có thể hiểu chuỗi đó như mã HTML
```

Nếu bạn dùng:

```javascript
$("#bookTitle").text(book.title);
```

thì không cần `escapeHtml()`.

Nếu bạn dùng:

```javascript
const card = `<h2>${book.title}</h2>`;
$("#bookGrid").html(card);
```

thì nên escape `book.title` trước.

## const coverColors

Đoạn code này tạo hai thông tin trang trí cho bìa sách:

1. Chữ viết tắt từ tiêu đề sách.
2. Màu bìa dựa trên ID của sách.

Ví dụ:

```javascript
const book = {
  id: 7,
  title: "Clean Code",
};
```

Kết quả:

```text
Chữ trên bìa: CC
Màu bìa: orange
```

## 1. Danh sách màu

```javascript
const coverColors = ["blue", "orange", "green", "purple", "navy", "red"];
```

Đây là danh sách tên màu tương ứng với các class CSS:

```css
.book-cover--blue {
}
.book-cover--orange {
}
.book-cover--green {
}
.book-cover--purple {
}
.book-cover--navy {
}
.book-cover--red {
}
```

Khi tạo card, kết quả được đưa vào class:

```javascript
const color = getCoverColor(book, index);

const html = `
    <div class="book-cover book-cover--${color}">
    </div>
`;
```

Nếu `color` là `"orange"`, HTML cuối cùng là:

```html
<div class="book-cover book-cover--orange"></div>
```

---

# Hàm `createBookInitials()`

```javascript
function createBookInitials(title) {
  const words = String(title ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "BK";
  }

  return words
    .slice(0, 2)
    .map(function (word) {
      return word.charAt(0).toUpperCase();
    })
    .join("");
}
```

Mục đích của hàm là lấy tối đa hai chữ cái đầu từ tiêu đề sách.

## Bước 1 — Chuẩn hóa đầu vào

```javascript
String(title ?? "");
```

Nếu `title` là `null` hoặc `undefined`, thay bằng chuỗi rỗng:

```javascript
String(null ?? ""); // ""
String(undefined ?? ""); // ""
String("Clean Code"); // "Clean Code"
```

## Bước 2 — Xóa khoảng trắng thừa

```javascript
.trim()
```

Ví dụ:

```javascript
"   Clean Code   ".trim();
```

Kết quả:

```text
Clean Code
```

## Bước 3 — Tách tiêu đề thành các từ

```javascript
.split(/\s+/)
```

`/\s+/` là regular expression:

```text
\s  → một ký tự khoảng trắng
+   → xuất hiện một hoặc nhiều lần
```

Nó có thể xử lý:

- Một dấu cách.
- Nhiều dấu cách.
- Tab.
- Ký tự xuống dòng.

Ví dụ:

```javascript
"Clean    Code".split(/\s+/);
```

Kết quả:

```javascript
["Clean", "Code"];
```

Ví dụ:

```javascript
"The Design of Everyday Things".split(/\s+/);
```

Kết quả:

```javascript
["The", "Design", "of", "Everyday", "Things"];
```

## Bước 4 — Loại bỏ phần tử rỗng

```javascript
.filter(Boolean)
```

Nó giữ lại các phần tử có giá trị truthy và loại bỏ chuỗi rỗng.

Ví dụ:

```javascript
["Clean", "", "Code"].filter(Boolean);
```

Kết quả:

```javascript
["Clean", "Code"];
```

Sau các bước trên:

```javascript
const words = ["The", "Design", "of", "Everyday", "Things"];
```

## Bước 5 — Kiểm tra tiêu đề rỗng

```javascript
if (words.length === 0) {
  return "BK";
}
```

Nếu sách không có tiêu đề hợp lệ, dùng `"BK"` — viết tắt của “Book” — làm giá trị mặc định.

Ví dụ:

```javascript
createBookInitials("");
createBookInitials(null);
createBookInitials("    ");
```

Đều trả về:

```text
BK
```

## Bước 6 — Chỉ lấy hai từ đầu tiên

```javascript
.slice(0, 2)
```

Ví dụ:

```javascript
["The", "Design", "of", "Everyday", "Things"].slice(0, 2);
```

Kết quả:

```javascript
["The", "Design"];
```

Mảng gốc không bị thay đổi.

## Bước 7 — Lấy chữ cái đầu

```javascript
.map(function (word) {
    return word.charAt(0).toUpperCase();
})
```

Với:

```javascript
["The", "Design"];
```

Quá trình là:

```text
"The"    → "T"
"Design" → "D"
```

Kết quả của `.map()`:

```javascript
["T", "D"];
```

## Bước 8 — Ghép các chữ lại

```javascript
.join("")
```

```javascript
["T", "D"].join("");
```

Kết quả:

```text
TD
```

Một số ví dụ:

```javascript
createBookInitials("Clean Code"); // "CC"
createBookInitials("Refactoring"); // "R"
createBookInitials("Eloquent JavaScript"); // "EJ"
createBookInitials("The Design of Everyday Things"); // "TD"
createBookInitials(""); // "BK"
```

---

# Hàm `getCoverColor()`

```javascript
function getCoverColor(book, index) {
  const numericId = Number(book.id);

  const colorIndex = Number.isFinite(numericId)
    ? numericId % coverColors.length
    : index % coverColors.length;

  return coverColors[colorIndex];
}
```

Mục đích là chọn một màu trong `coverColors`.

## Bước 1 — Chuyển ID thành số

```javascript
const numericId = Number(book.id);
```

Ví dụ:

```javascript
Number(7); // 7
Number("7"); // 7
Number("abc"); // NaN
Number(undefined); // NaN
```

Backend thường trả ID dạng số, nhưng bước này làm hàm chịu được cả ID dạng chuỗi.

## Bước 2 — Kiểm tra ID có phải số hợp lệ không

```javascript
Number.isFinite(numericId);
```

Ví dụ:

```javascript
Number.isFinite(7); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
```

## Bước 3 — Dùng toán tử chia lấy dư

```javascript
numericId % coverColors.length;
```

Danh sách có sáu màu:

```javascript
coverColors.length; // 6
```

Phép `% 6` luôn cho kết quả từ `0` đến `5`, vừa đúng với index của mảng:

```text
ID 1  % 6 = 1 → orange
ID 2  % 6 = 2 → green
ID 3  % 6 = 3 → purple
ID 4  % 6 = 4 → navy
ID 5  % 6 = 5 → red
ID 6  % 6 = 0 → blue
ID 7  % 6 = 1 → orange
```

Sau sáu cuốn, màu bắt đầu lặp lại.

## Bước 4 — Fallback sang vị trí card

Đoạn này sử dụng toán tử ba ngôi:

```javascript
const colorIndex = Number.isFinite(numericId)
  ? numericId % coverColors.length
  : index % coverColors.length;
```

Có thể viết lại bằng `if/else`:

```javascript
let colorIndex;

if (Number.isFinite(numericId)) {
  colorIndex = numericId % coverColors.length;
} else {
  colorIndex = index % coverColors.length;
}
```

Ý nghĩa:

- Nếu sách có ID hợp lệ: chọn màu theo ID.
- Nếu không có ID: chọn màu theo vị trí card.

Ví dụ:

```javascript
getCoverColor({ id: 7 }, 0);
```

```text
7 % 6 = 1
coverColors[1] = "orange"
```

Nếu ID không hợp lệ:

```javascript
getCoverColor({ id: undefined }, 2);
```

```text
2 % 6 = 2
coverColors[2] = "green"
```

## Tại sao ưu tiên ID thay vì `index`?

Giả sử card được chọn màu hoàn toàn theo vị trí:

```text
Vị trí 0 → blue
Vị trí 1 → orange
Vị trí 2 → green
```

Khi người dùng sắp xếp lại sách, vị trí thay đổi và một cuốn sách có thể đổi màu.

Nếu chọn theo ID:

```text
Sách ID 7 luôn → orange
Sách ID 8 luôn → green
```

Dù tìm kiếm hoặc sắp xếp, cùng một cuốn sách vẫn giữ màu giống nhau.

## Bước 5 — Trả về tên màu

```javascript
return coverColors[colorIndex];
```

Ví dụ:

```javascript
colorIndex = 3;
```

Kết quả:

```javascript
coverColors[3]; // "purple"
```

Sau đó dùng trong HTML:

```javascript
const coverColor = getCoverColor(book, index);

return `
    <div class="book-cover book-cover--${coverColor}">
        ${createBookInitials(book.title)}
    </div>
`;
```

Nếu:

```javascript
book = {
  id: 7,
  title: "Clean Code",
};
```

HTML được tạo:

```html
<div class="book-cover book-cover--orange">CC</div>
```

Tóm lại:

```text
createBookInitials(title)
→ biến "Clean Code" thành "CC"

getCoverColor(book, index)
→ biến ID sách thành tên màu ổn định

Hai kết quả
→ tạo bìa sách giả mà không cần ảnh thật
```

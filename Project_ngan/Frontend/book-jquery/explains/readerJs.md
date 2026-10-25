Đoạn `reader.js` có nhiệm vụ:

```text
Lấy ID sách từ URL
→ lấy metadata sách từ Spring Boot
→ tìm PDF offline trong IndexedDB
→ nếu không có thì dùng URL PDF
→ dùng PDF.js render PDF lên canvas
→ điều khiển chuyển trang, zoom và download
```

# 1. Import PDF.js

```javascript
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";

import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
```

- `pdfjsLib` là thư viện chính để đọc và render PDF.
- `pdfWorkerUrl` là đường dẫn tới worker của PDF.js.
- `?url` là cú pháp của Vite, yêu cầu Vite trả về URL của file thay vì import nó như JavaScript thông thường.

```javascript
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
```

PDF có thể mất nhiều tài nguyên để phân tích. PDF.js dùng Web Worker để thực hiện công việc nặng ở luồng riêng, tránh làm treo giao diện.

---

# 2. Chờ DOM sẵn sàng

```javascript
$(function () {
  // ...
});
```

Đây là cách viết rút gọn của jQuery:

```javascript
$(document).ready(function () {
  // ...
});
```

Code bên trong chỉ chạy sau khi HTML đã được tạo xong.

---

# 3. State của Reader

```javascript
let pdfDocument = null;
let currentPage = 1;
let scale = 1.1;
let isRendering = false;
let downloadObjectUrl = null;
```

Ý nghĩa:

| Biến                | Mục đích                               |
| ------------------- | -------------------------------------- |
| `pdfDocument`       | Tài liệu PDF đã được PDF.js tải        |
| `currentPage`       | Trang đang hiển thị                    |
| `scale`             | Tỷ lệ zoom, ban đầu 110%               |
| `isRendering`       | Cho biết PDF.js có đang vẽ trang không |
| `downloadObjectUrl` | URL tạm dùng để tải Blob PDF offline   |

Ba phần tử DOM được cache:

```javascript
const $loading = $("#readerLoading");
const $error = $("#readerError");
const $layout = $("#readerLayout");
```

Dấu `$` trong tên biến là quy ước cho biết biến đang chứa một jQuery object.

---

# 4. Điểm bắt đầu

```javascript
initialize();

function initialize() {
  bindEvents();
  loadReader();
}
```

Khi trang sẵn sàng:

1. `bindEvents()` gắn sự kiện cho các nút.
2. `loadReader()` tải sách và PDF.

---

# 5. Gắn sự kiện điều khiển

## Trang trước

```javascript
$("#previousPageButton").on("click", function () {
  if (currentPage > 1) {
    currentPage--;
    renderCurrentPage();
  }
});
```

Chỉ giảm trang nếu chưa đứng ở trang đầu.

## Trang sau

```javascript
if (
    pdfDocument
    && currentPage < pdfDocument.numPages
)
```

Hai điều kiện:

- PDF đã được tải.
- Trang hiện tại chưa phải trang cuối.

Sau đó:

```javascript
currentPage++;
renderCurrentPage();
```

## Thu nhỏ

```javascript
scale = Math.max(0.6, Number((scale - 0.1).toFixed(1)));
```

Ví dụ:

```text
1.1 → 1.0 → 0.9 → ... → 0.6
```

`Math.max(0.6, ...)` không cho zoom nhỏ hơn 60%.

`toFixed(1)` tránh lỗi số thực kiểu:

```text
1.1 - 0.1 = 1.0000000000000002
```

## Phóng to

```javascript
scale = Math.min(2.2, Number((scale + 0.1).toFixed(1)));
```

Không cho zoom lớn hơn 220%.

## Thu hồi Object URL

```javascript
$(window).on("beforeunload", function () {
  if (downloadObjectUrl) {
    URL.revokeObjectURL(downloadObjectUrl);
  }
});
```

PDF offline được biến thành URL tạm bằng:

```javascript
URL.createObjectURL(blob);
```

URL này chiếm tài nguyên trình duyệt. Khi rời trang, `revokeObjectURL()` giải phóng nó.

---

# 6. Lấy ID sách từ URL

Giả sử URL là:

```text
reader.html?id=9
```

Hàm:

```javascript
function getBookId() {
  const parameters = new URLSearchParams(window.location.search);

  const bookId = Number(parameters.get("id"));

  return Number.isInteger(bookId) && bookId > 0 ? bookId : null;
}
```

Các bước:

```javascript
window.location.search;
```

trả về:

```text
?id=9
```

Sau đó:

```javascript
parameters.get("id");
```

trả về chuỗi:

```text
"9"
```

`Number()` chuyển thành số `9`.

Nếu ID không phải số nguyên dương, hàm trả `null`.

---

# 7. Luồng tải Reader

```javascript
async function loadReader() {
```

Hàm này điều phối toàn bộ quá trình tải sách.

## Kiểm tra ID

```javascript
const bookId = getBookId();

if (bookId === null) {
  showError("ID sách không hợp lệ.");
  return;
}
```

Ví dụ các URL không hợp lệ:

```text
reader.html
reader.html?id=abc
reader.html?id=-5
reader.html?id=2.5
```

## Lấy metadata từ backend

```javascript
const book = await BookApi.getById(bookId);
```

Gửi request:

```http
GET /api/books/9
```

Kết quả có thể là:

```javascript
{
    id: 9,
    title: "Clean Code",
    author: "Robert C. Martin",
    publishYear: 2008,
    tags: "Lập trình, Kỹ năng",
    pdfUrl: null,
    hasLocalFile: true
}
```

## Tìm PDF trong IndexedDB

```javascript
const localPdf = await PdfStore.get(bookId);
```

`localPdf` có thể là:

```javascript
{
    bookId: 9,
    blob: Blob,
    fileName: "clean-code.pdf",
    mimeType: "application/pdf",
    savedAt: "..."
}
```

Nếu không có thì kết quả là `null`.

## Hiển thị thông tin sách

```javascript
renderBookInformation(book);
```

Hàm này hiển thị tiêu đề, tác giả, năm, tags và chữ viết tắt trên cover.

## Chọn nguồn PDF

```javascript
if (localPdf?.blob) {
```

Optional chaining `?.` giúp kiểm tra an toàn:

```javascript
localPdf !== null && localPdf.blob;
```

Nếu có PDF offline:

```javascript
await loadLocalPdf(localPdf);
configureLocalDownload(localPdf);
showSource("Offline", "offline");
```

Nếu không có offline nhưng có URL:

```javascript
else if (book.pdfUrl) {
    await loadRemotePdf(book.pdfUrl);
    configureRemoteDownload(book.pdfUrl);
    showSource("URL", "url");
}
```

Nếu không có cả hai:

```javascript
throw new Error("Sách này chưa có PDF offline hoặc URL PDF.");
```

Thứ tự ưu tiên là:

```text
PDF offline
→ URL PDF
→ báo lỗi
```

Lưu ý rằng code kiểm tra IndexedDB thực tế, không chỉ tin vào `book.hasLocalFile`.

## Hiện giao diện chính

```javascript
$loading.addClass("is-hidden");
$error.addClass("is-hidden");
$layout.removeClass("is-hidden");
```

Sau khi PDF tải thành công:

- Ẩn loading.
- Ẩn error.
- Hiện Reader.

## Xử lý lỗi

```javascript
catch (error) {
    console.error("Load reader failed:", error);
```

Nếu backend trả HTTP 404:

```javascript
if (error?.status === 404) {
  showError("Không tìm thấy sách.");
  return;
}
```

Các lỗi khác dùng message từ exception:

```javascript
showError(error?.message || "Không thể tải PDF.");
```

---

# 8. Đọc PDF offline

```javascript
async function loadLocalPdf(localPdf) {
    const buffer = await localPdf.blob.arrayBuffer();
```

PDF trong IndexedDB là một `Blob`. PDF.js cần dữ liệu dạng byte nên Blob được chuyển thành `ArrayBuffer`.

```javascript
const loadingTask = pdfjsLib.getDocument({
  data: new Uint8Array(buffer),
});
```

`Uint8Array` biểu diễn nội dung PDF dưới dạng mảng byte.

```javascript
pdfDocument = await loadingTask.promise;
```

`getDocument()` không trả ngay PDF hoàn chỉnh. Nó trả một loading task, sau đó chờ `.promise`.

Khi tải xong:

```javascript
currentPage = 1;
await renderCurrentPage();
```

---

# 9. Đọc PDF từ URL

```javascript
async function loadRemotePdf(pdfUrl) {
  const loadingTask = pdfjsLib.getDocument(pdfUrl);

  pdfDocument = await loadingTask.promise;
  currentPage = 1;

  await renderCurrentPage();
}
```

PDF.js tự gửi request tới URL.

URL nguồn cần cho phép CORS. Nếu URL mở được trong tab trình duyệt nhưng PDF.js không tải được, nguyên nhân thường là server PDF không trả header CORS phù hợp.

---

# 10. Render một trang lên canvas

```javascript
async function renderCurrentPage() {
    if (!pdfDocument || isRendering) {
        return;
    }
```

Không render nếu:

- PDF chưa tải.
- Một trang khác đang render.

```javascript
isRendering = true;
updateControls();
```

Các nút được khóa trong thời gian render.

## Lấy trang

```javascript
const page = await pdfDocument.getPage(currentPage);
```

Ví dụ `currentPage = 3` sẽ lấy trang 3.

## Tính kích thước

```javascript
const viewport = page.getViewport({ scale });
```

`viewport` chứa kích thước trang sau khi áp dụng zoom.

Ví dụ:

```text
Kích thước gốc: 600 × 800
Scale: 1.1
Viewport: 660 × 880
```

## Lấy canvas

```javascript
const canvas = $("#pdfCanvas")[0];
const context = canvas.getContext("2d");
```

`$("#pdfCanvas")` trả jQuery object.

`[0]` lấy DOM canvas thật, vì `getContext()` là phương thức của HTMLCanvasElement, không phải của jQuery.

## Hỗ trợ màn hình độ phân giải cao

```javascript
const pixelRatio = window.devicePixelRatio || 1;
```

Màn hình thường có thể là `1`, còn màn hình HiDPI có thể là `2`.

```javascript
canvas.width = Math.floor(viewport.width * pixelRatio);

canvas.height = Math.floor(viewport.height * pixelRatio);
```

Đây là kích thước pixel thật của canvas.

```javascript
canvas.style.width = `${Math.floor(viewport.width)}px`;
canvas.style.height = `${Math.floor(viewport.height)}px`;
```

Đây là kích thước hiển thị bằng CSS.

Ví dụ với `pixelRatio = 2`:

```text
Canvas thật:      1320 × 1760 pixels
Kích thước CSS:   660 × 880 pixels
```

Kết quả hiển thị sắc nét hơn.

## Vẽ PDF

```javascript
await page.render({
  canvasContext: context,
  viewport,
  transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0],
}).promise;
```

Ma trận:

```javascript
[pixelRatio, 0, 0, pixelRatio, 0, 0];
```

phóng tọa độ render theo mật độ pixel của màn hình.

Cuối cùng:

```javascript
finally {
    isRendering = false;
    updateControls();
}
```

Dù thành công hay lỗi, trạng thái render đều được mở khóa.

---

# 11. Cập nhật toolbar

```javascript
const totalPages = pdfDocument?.numPages ?? 0;
```

Nếu PDF tồn tại, lấy tổng số trang. Nếu chưa có thì dùng `0`.

```javascript
$("#pageIndicator").text(`Trang ${currentPage} / ${totalPages || "—"}`);
```

Hiển thị:

```text
Trang 3 / 250
```

Zoom:

```javascript
$("#zoomIndicator").text(`${Math.round(scale * 100)}%`);
```

Ví dụ `scale = 1.1` thành `110%`.

Các nút được bật/tắt theo trạng thái:

```javascript
$("#previousPageButton").prop("disabled", isRendering || currentPage <= 1);
```

- Khóa khi đang render.
- Khóa khi đang ở trang đầu.

Tương tự cho next và zoom.

---

# 12. Hiển thị metadata sách

```javascript
$("#readerPageTitle").text(book.title);
```

Dùng `.text()` thay vì `.html()` để dữ liệu từ backend không được diễn giải thành HTML.

```javascript
$("#readerPageDescription").text(
  `${book.author} · ${book.publishYear ?? "Không rõ năm"}`,
);
```

Toán tử `??` chỉ sử dụng giá trị bên phải khi bên trái là `null` hoặc `undefined`.

## Chuyển tags thành phần tử HTML

```javascript
const tags = String(book.tags ?? "")
  .split(",")
  .map(function (tag) {
    return tag.trim();
  })
  .filter(Boolean);
```

Ví dụ:

```text
"JavaScript, Frontend, Kỹ năng"
```

trở thành:

```javascript
["JavaScript", "Frontend", "Kỹ năng"];
```

Sau đó mỗi tag được tạo bằng jQuery:

```javascript
$("<span>").addClass("tag").text(tag).appendTo($tagContainer);
```

Cách này an toàn hơn ghép HTML trực tiếp.

---

# 13. Tạo chữ viết tắt

```javascript
createInitials("Clean Code");
```

Kết quả:

```text
CC
```

Hàm:

1. Chuyển title thành chuỗi.
2. Xóa khoảng trắng đầu/cuối.
3. Tách theo khoảng trắng.
4. Lấy tối đa hai từ.
5. Lấy ký tự đầu.
6. Chuyển thành chữ hoa.

Nếu title rỗng, trả:

```text
BK
```

---

# 14. Hiển thị nguồn PDF

```javascript
showSource("Offline", "offline");
```

Hàm cập nhật text và class:

```javascript
$("#readerSourceBadge")
    .text(label)
    .removeClass(
        "status-badge--offline status-badge--url"
    )
    .addClass(...);
```

Phải xóa class cũ trước để badge không đồng thời có cả style Offline và URL.

---

# 15. Download PDF

## PDF offline

```javascript
downloadObjectUrl = URL.createObjectURL(localPdf.blob);
```

Trình duyệt tạo một URL tạm, ví dụ:

```text
blob:http://127.0.0.1:5500/...
```

Sau đó:

```javascript
$("#downloadPdfButton")
  .attr("href", downloadObjectUrl)
  .attr("download", localPdf.fileName || "book.pdf")
  .removeAttr("target");
```

Thuộc tính `download` yêu cầu trình duyệt tải file với tên đã lưu.

## PDF URL

```javascript
$("#downloadPdfButton")
  .attr("href", pdfUrl)
  .attr("target", "_blank")
  .attr("rel", "noopener noreferrer")
  .removeAttr("download");
```

PDF remote được mở trong tab mới.

`noopener noreferrer` ngăn trang mới truy cập ngược lại trang ứng dụng qua `window.opener`.

Không đảm bảo URL remote luôn tải xuống trực tiếp; hành vi phụ thuộc server nguồn.

---

# 16. Hiển thị lỗi

```javascript
function showError(message) {
  $loading.addClass("is-hidden");
  $layout.addClass("is-hidden");

  $("#readerErrorMessage").text(message);
  $error.removeClass("is-hidden");
}
```

Khi lỗi:

- Ẩn loading.
- Ẩn Reader.
- Điền thông báo an toàn.
- Hiện error state.

## Tóm tắt kiến trúc

```text
reader.html?id=9
        │
        ▼
    getBookId()
        │
        ▼
BookApi.getById(9)
        │
        ▼
 PdfStore.get(9)
        │
        ├── Có Blob ──► loadLocalPdf()
        │
        ├── Không Blob, có URL ──► loadRemotePdf()
        │
        └── Không có cả hai ──► showError()

PDF.js getDocument()
        │
        ▼
   pdfDocument
        │
        ▼
getPage(currentPage)
        │
        ▼
render vào <canvas>
```

Một điểm cần lưu ý: khi `isRendering === true`, thao tác chuyển trang hoặc zoom mới sẽ bị bỏ qua. Đây là cách chống render chồng đơn giản. Với dự án luyện tập hiện tại là chấp nhận được; phiên bản nâng cao có thể dùng hàng đợi để ghi nhớ thao tác cuối cùng của người dùng.

Đoạn code này tạo một module nhỏ tên `PdfStore`, dùng IndexedDB để lưu, đọc và xóa file PDF ngay trong trình duyệt theo `bookId`.

Nó cung cấp ba hàm:

```javascript
PdfStore.save(bookId, file);
PdfStore.get(bookId);
PdfStore.remove(bookId);
```

## 1. Cấu trúc tổng thể

```javascript
const PdfStore = (function () {
  // Code nội bộ

  return {
    save,
    get,
    remove,
  };
})();
```

Đây là IIFE — Immediately Invoked Function Expression, tức hàm được tạo ra rồi chạy ngay lập tức.

Có thể hiểu gần giống:

```javascript
function createPdfStore() {
  // ...
  return {
    save,
    get,
    remove,
  };
}

const PdfStore = createPdfStore();
```

Mục đích là đóng gói code:

- Bên ngoài chỉ gọi được `save`, `get`, `remove`.
- Không truy cập trực tiếp được `DATABASE_NAME`, `STORE_NAME`, `openDatabase`.
- Tránh tạo quá nhiều biến global.

Ví dụ:

```javascript
PdfStore.save(...);         // Gọi được
PdfStore.openDatabase();    // Không gọi được
PdfStore.STORE_NAME;        // Không truy cập được
```

## 2. Các hằng số cấu hình

```javascript
const DATABASE_NAME = "book-library-database";
const DATABASE_VERSION = 1;
const STORE_NAME = "pdf-files";
```

Ý nghĩa:

```text
book-library-database
└── pdf-files
    ├── bookId: 1
    ├── bookId: 2
    └── bookId: 3
```

- `DATABASE_NAME`: tên database IndexedDB.
- `DATABASE_VERSION`: phiên bản cấu trúc database.
- `STORE_NAME`: tên object store, tương tự một table trong SQL.

So sánh gần đúng:

| SQL Server  | IndexedDB          |
| ----------- | ------------------ |
| Database    | Database           |
| Table       | Object store       |
| Row         | Object/record      |
| Primary key | Key hoặc `keyPath` |
| Transaction | Transaction        |

## 3. Hàm `openDatabase()`

```javascript
function openDatabase() {
    return new Promise(function (resolve, reject) {
        const request = indexedDB.open(
            DATABASE_NAME,
            DATABASE_VERSION
        );
```

`indexedDB.open()` hoạt động bất đồng bộ, nhưng API gốc sử dụng event thay vì Promise.

Do đó code bọc nó trong:

```javascript
new Promise(...)
```

Nhờ vậy các hàm khác có thể dùng:

```javascript
const database = await openDatabase();
```

### Khi database được tạo hoặc nâng version

```javascript
request.onupgradeneeded = function () {
  const database = request.result;

  if (!database.objectStoreNames.contains(STORE_NAME)) {
    database.createObjectStore(STORE_NAME, {
      keyPath: "bookId",
    });
  }
};
```

`onupgradeneeded` chạy khi:

- Database chưa tồn tại.
- `DATABASE_VERSION` tăng lên.

Lần đầu mở database, code tạo object store:

```javascript
database.createObjectStore("pdf-files", {
  keyPath: "bookId",
});
```

`keyPath: "bookId"` quy định thuộc tính `bookId` là khóa chính.

Ví dụ record:

```javascript
{
    bookId: 9,
    blob: file,
    fileName: "clean-code.pdf"
}
```

Khi lưu lại một record cũng có `bookId: 9`, record cũ sẽ bị thay thế.

### Khi mở thành công

```javascript
request.onsuccess = function () {
  resolve(request.result);
};
```

`request.result` lúc này là đối tượng kết nối database.

Promise chuyển sang trạng thái fulfilled:

```javascript
const database = await openDatabase();
```

### Khi mở thất bại

```javascript
request.onerror = function () {
  reject(request.error);
};
```

Promise bị reject. Code gọi hàm có thể bắt lỗi:

```javascript
try {
  await PdfStore.save(9, file);
} catch (error) {
  console.error(error);
}
```

### Khi nâng cấp bị chặn

```javascript
request.onblocked = function () {
  reject(new Error("IndexedDB đang bị khóa bởi một tab khác."));
};
```

Tình huống thường gặp:

1. Một tab đang mở database phiên bản 1.
2. Tab khác muốn nâng lên phiên bản 2.
3. Tab cũ chưa đóng kết nối.
4. Quá trình nâng cấp bị chặn.

Trong project hiện tại version vẫn là `1`, nên trường hợp này ít xảy ra.

---

## 4. Hàm `save(bookId, file)`

```javascript
async function save(bookId, file) {
    const database = await openDatabase();
```

Đầu tiên, hàm mở database và chờ kết quả.

### Tạo transaction ghi dữ liệu

```javascript
const transaction = database.transaction(STORE_NAME, "readwrite");
```

Chế độ `readwrite` cho phép:

- Thêm record.
- Sửa record.
- Xóa record.

Lấy object store:

```javascript
const store = transaction.objectStore(STORE_NAME);
```

### Lưu record

```javascript
store.put({
  bookId: Number(bookId),
  blob: file,
  fileName: file.name,
  mimeType: file.type || "application/pdf",
  savedAt: new Date().toISOString(),
});
```

Record được lưu có dạng:

```javascript
{
    bookId: 9,
    blob: File,
    fileName: "book.pdf",
    mimeType: "application/pdf",
    savedAt: "2026-09-06T08:00:00.000Z"
}
```

Ý nghĩa các trường:

- `bookId`: liên kết file với sách trên backend.
- `blob`: nội dung nhị phân của PDF.
- `fileName`: tên file gốc.
- `mimeType`: loại file.
- `savedAt`: thời điểm lưu.

`put()` có hai hành vi:

```text
Chưa có bookId → thêm mới
Đã có bookId   → thay thế record cũ
```

Nếu muốn chỉ thêm mới và báo lỗi khi trùng key, IndexedDB có `add()`. Với trường hợp thay PDF, `put()` phù hợp hơn.

### Chờ toàn bộ transaction hoàn thành

```javascript
transaction.oncomplete = function () {
  database.close();
  resolve();
};
```

Điểm quan trọng: code resolve khi **transaction hoàn tất**, không phải ngay sau khi gọi `store.put()`.

`store.put()` chỉ mới đưa ra yêu cầu ghi. Dữ liệu chưa chắc đã được commit tại dòng tiếp theo.

Luồng đúng:

```text
store.put()
→ IndexedDB ghi dữ liệu
→ transaction complete
→ đóng kết nối
→ resolve Promise
```

### Khi transaction lỗi

```javascript
transaction.onerror = function () {
  const error = transaction.error;
  database.close();
  reject(error);
};
```

### Khi transaction bị hủy

```javascript
transaction.onabort = function () {
  const error = transaction.error;
  database.close();
  reject(error);
};
```

`error` và `abort` hơi khác nhau:

- `error`: một thao tác trong transaction gặp lỗi.
- `abort`: toàn bộ transaction bị hủy và thay đổi không được commit.

---

## 5. Hàm `get(bookId)`

```javascript
async function get(bookId) {
    const database = await openDatabase();
```

Mở database trước.

### Tạo transaction chỉ đọc

```javascript
const transaction = database.transaction(STORE_NAME, "readonly");
```

`readonly` chỉ dùng để đọc, không được ghi hoặc xóa. Nó nhẹ và an toàn hơn `readwrite`.

### Tìm record theo khóa chính

```javascript
const store = transaction.objectStore(STORE_NAME);
const request = store.get(Number(bookId));
```

Ví dụ:

```javascript
await PdfStore.get(9);
```

tương đương ý tưởng SQL:

```sql
SELECT *
FROM pdf_files
WHERE bookId = 9;
```

### Khi tìm xong

```javascript
request.onsuccess = function () {
  resolve(request.result ?? null);
};
```

Có hai trường hợp:

```javascript
// Tìm thấy
{
    bookId: 9,
    blob: File,
    fileName: "book.pdf"
}

// Không tìm thấy
null
```

Toán tử:

```javascript
request.result ?? null;
```

nghĩa là nếu `request.result` là `null` hoặc `undefined`, trả về `null`.

Ở Reader có thể dùng:

```javascript
const localPdf = await PdfStore.get(bookId);

if (localPdf?.blob) {
  // Đọc file offline
} else {
  // Fallback sang pdfUrl
}
```

### Đóng kết nối

```javascript
transaction.oncomplete = function () {
  database.close();
};
```

Sau khi transaction đọc hoàn tất, kết nối database được đóng.

---

## 6. Hàm `remove(bookId)`

```javascript
async function remove(bookId) {
    const database = await openDatabase();
```

Mở database, sau đó tạo transaction ghi:

```javascript
const transaction = database.transaction(STORE_NAME, "readwrite");
```

Xóa record theo khóa chính:

```javascript
transaction.objectStore(STORE_NAME).delete(Number(bookId));
```

Có thể viết tách ra:

```javascript
const store = transaction.objectStore(STORE_NAME);
store.delete(Number(bookId));
```

Hai cách hoàn toàn tương đương.

Khi transaction hoàn tất:

```javascript
transaction.oncomplete = function () {
  database.close();
  resolve();
};
```

Nếu không tồn tại `bookId`, IndexedDB thường vẫn coi thao tác xóa là thành công. Nó không báo “record not found”.

---

## 7. Đối tượng public được trả ra

Cuối IIFE:

```javascript
return {
  save,
  get,
  remove,
};
```

Cú pháp rút gọn này tương đương:

```javascript
return {
  save: save,
  get: get,
  remove: remove,
};
```

Kết quả cuối cùng:

```javascript
PdfStore = {
    save: function (...) {},
    get: function (...) {},
    remove: function (...) {}
};
```

Cách sử dụng:

```javascript
await PdfStore.save(bookId, pdfFile);

const localPdf = await PdfStore.get(bookId);

await PdfStore.remove(bookId);
```

## 8. Luồng sử dụng trong dự án

### Thêm sách có PDF

```text
POST metadata lên backend
→ backend trả bookId = 9
→ PdfStore.save(9, file)
→ PUT hasLocalFile = true
```

### Đọc sách

```text
PdfStore.get(9)
├── Có blob  → đọc PDF offline
└── Không có → thử book.pdfUrl
```

### Xóa sách

```text
DELETE metadata trên backend
→ PdfStore.remove(9)
```

## 9. PDF được lưu ở đâu?

File không được lưu trong SQL Server và cũng không nằm trong thư mục project.

Nó nằm trong bộ nhớ của trình duyệt:

```text
Chrome
└── Origin: http://127.0.0.1:5500
    └── IndexedDB
        └── book-library-database
            └── pdf-files
```

Bạn có thể xem tại:

```text
DevTools
→ Application
→ IndexedDB
→ book-library-database
→ pdf-files
```

Vì dữ liệu gắn với origin nên:

```text
http://127.0.0.1:5500
```

và:

```text
http://localhost:5500
```

có hai IndexedDB khác nhau.

## 10. Một điểm có thể cải thiện

Trong `get()`, khi `request.onerror` xảy ra, code reject nhưng chưa đóng database ngay:

```javascript
request.onerror = function () {
  reject(request.error);
};
```

Có thể sửa thành:

```javascript
request.onerror = function () {
  const error = request.error;
  database.close();
  reject(error);
};
```

Hoặc quản lý việc đóng kết nối thống nhất qua các event của transaction.

Tuy nhiên, với bài luyện tập hiện tại, thiết kế tổng thể của đoạn code là hợp lý: API event-based của IndexedDB đã được bọc thành Promise, nhờ đó phần còn lại của ứng dụng có thể sử dụng `async/await` dễ đọc hơn.

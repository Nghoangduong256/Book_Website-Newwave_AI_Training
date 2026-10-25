# Book Library jQuery Frontend

Frontend quản lý và đọc sách được xây dựng bằng HTML, CSS, jQuery, IndexedDB và PDF.js. Backend sử dụng Spring Boot và SQL Server.

## Chức năng

- Hiển thị và tìm kiếm sách
- Sắp xếp danh sách sách
- Thêm, sửa và xóa sách
- Lưu PDF offline bằng IndexedDB
- Đọc PDF offline từ IndexedDB hoặc từ URL
- Hiển thị loading, empty và error state

## Công nghệ

- HTML5
- CSS3
- jQuery 3.7.1
- IndexedDB
- PDF.js
- Vite
- Spring Boot REST API
- SQL Server

## Chạy backend

Bấm Run tại Application.java

Backend chạy tại:
http://localhost:8080

## Chạy frontend

Chạy lệnh terminal:
npm install
npm run dev

Frontend chạy tại:
http://127.0.0.1:5500

Cấu trúc chính

- index.html: màn hình thư viện
- manage.html: màn hình quản lý sách
- reader.html: màn hình giao diện đọc PDF
- js/api.js: giao tiếp REST API
- js/pdf-store.js: lưu PDF trong IndexedDB
- js/library.js: logic thư viện
- js/manage.js: logic CRUD
- js/reader.js: logic PDF Reader

`Lưu ý`:
PDF offline được lưu trong IndexedDB của trình duyệt và phụ thuộc vào origin. Không chuyển đổi giữa localhost và 127.0.0.1.

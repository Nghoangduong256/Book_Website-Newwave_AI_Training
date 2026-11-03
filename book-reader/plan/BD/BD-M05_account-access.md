# BD-M05 — Giao diện tích hợp tài khoản tương lai

Phiên bản: 0.2 · Ngày: 2026-11-03 · Trạng thái: Bản nháp — chưa chốt làm chuẩn.


Nguồn yêu cầu: RD-05_account-access.md. Chưa triển khai; không phải thiết kế tài khoản hoàn chỉnh.

## 1. Giao diện cần có ở P0
CurrentReader.resolve() trả ReaderContext(readerId,mode); AccessPolicy.require(action,context) kiểm quyền. Bộ cung cấp cá nhân đọc cấu hình ổn định. Nghiệp vụ không phụ thuộc cách triển khai phiên/bảo mật.

## 2. Dữ liệu và chuyển đổi
id_readers là danh tính nghiệp vụ; bổ sung liên kết tài khoản sau, không đổi UUID khóa ngoại hàng loạt.
Gắn người đọc cá nhân với tài khoản là thao tác được xác minh do người vận hành thực hiện, không có API công khai. Sao lưu và diễn tập hoàn tác trước chuyển chế độ.

## 3. Ghép phân hệ
Thêm bộ chuyển tiếp xác thực/phiên, vô hiệu bộ cá nhân; vẫn lọc chủ sở hữu. Chưa chọn đăng nhập/đăng ký/mật khẩu/lưu phiên/phân quyền theo vai trò; không triển khai theo ví dụ cũ.

## 4. Đối chiếu yêu cầu tương lai
| Yêu cầu | Thiết kế | Kiểm chứng tương lai |
|---|---|---|
| FR-05-01 | §1, §3 | Ngữ cảnh xác thực/hết hạn |
| FR-05-02 | BD-03 §1/§5 | API/tệp cách ly tài khoản |
| FR-05-03 | §2 | Chuyển dữ liệu và hoàn tác |
| FR-05-04 | BD-M04 §6 | Cách ly bộ nhớ đệm/hàng đợi khi đăng xuất/đổi tài khoản |
Chưa có mã nguồn, kiểm thử hoặc màn hình tài khoản.

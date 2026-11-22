# Báo cáo cập nhật Java và nginx

- **Ngày:** 23/11/2026, múi giờ Asia/Tokyo.
- **Nhánh:** `feat/book-reader-p0`.
- **Phiên bản:** 1.0 — báo cáo kết quả kỹ thuật.
- **Trạng thái:** đã cập nhật và kiểm chứng JDK riêng cho dự án cùng cấu hình nginx; P0 chưa hoàn tất.
- **Phạm vi:** CVE-2026-114938 (Java4Shell) và nhóm lỗi nginx được vá trong 1.30.7/1.31.9.
- **Ủy quyền:** chủ dự án yêu cầu cập nhật môi trường Java, cấu hình nginx và viết báo cáo qua hội thoại.

## 1. Thay đổi

| Thành phần | Trước | Sau / kết quả hiện tại |
|---|---|---|
| Java của Book Reader | PATH trỏ tới Oracle JDK 24.0.2 | Đã cài Temurin JDK 17.0.21.1+2 trong `source code/.runtime/`, kiểm SHA-256 khớp metadata nhà cung cấp |
| Kích hoạt Java | Phụ thuộc Java toàn máy | Có `ops/Use-ProjectJava.ps1`, kiểm đúng phiên bản trước khi đặt JAVA_HOME/PATH cho cửa sổ hiện tại |
| Cài lại JDK | Chưa có lệnh riêng | Có `ops/Install-ProjectJava.ps1`, kiểm SHA-256 trước khi giải nén |
| Image nginx | `nginx:1.27-alpine` | `nginx:1.30.7-alpine`, khóa digest trong Compose và `ops/toolchain.json` |
| Cổng nginx trong Compose | Công bố trên mọi địa chỉ máy | `127.0.0.1:${PROXY_PORT:-8080}:80`, chỉ thử tại máy |
| HTTP/2, HTTP/3 | HTTP/2 chưa bật | Ghi rõ `http2 off`; không có listener QUIC hoặc quảng bá HTTP/3 |
| Chuyển tiếp API | `/api/` bị bỏ khi chuyển tiếp | Giữ nguyên đường dẫn `/api/v1/...`, đúng BD-05 |
| Upstream | Địa chỉ nằm trong tệp server | Tách `infra/nginx/upstreams.conf`, dùng nhóm upstream cố định |
| Công cụ kiểm nginx | Chưa có | Có `ops/Test-NginxConfig.ps1` |
| Mã hóa mặc định của JDK 17 trên máy | MS932 theo vùng Windows | Lệnh kích hoạt đặt `-Dfile.encoding=UTF-8` cho cửa sổ hiện tại |

Không sửa yêu cầu sản phẩm hoặc thay bộ công nghệ. Phiên bản, nguồn tải và mã kiểm được quản lý tại [toolchain.json](<../source code/ops/toolchain.json>).

## 2. Bằng chứng kiểm chứng

| Phép kiểm | Kết quả |
|---|---|
| Tải JDK và đối chiếu SHA-256 nhà cung cấp | Khớp; chỉ giải nén và chạy sau kiểm mã toàn vẹn |
| `java -version` sau kích hoạt | OpenJDK Runtime Environment Temurin-17.0.21.1+2 |
| `javac -version` sau kích hoạt | javac 17.0.21.1 |
| `mvn --version` sau kích hoạt | Maven 3.9.16, Java 17.0.21.1, vendor Eclipse Adoptium, đúng thư mục `.runtime/` |
| Biên dịch/chạy kiểm nhanh Java | `javac` rồi `java` chạy ToolchainSmoke: `TOOLCHAIN_SMOKE_OK runtime=17.0.21.1+2`; chỉ dùng chuỗi Base64 hợp lệ |
| Chạy lại cài đặt/kích hoạt | Thành công với gói đã kiểm mã; không tải hoặc nhân đôi JDK |
| Digest image nginx với Docker Hub | Khớp nội dung manifest OCI; có bản `linux/amd64` |
| Chữ ký gói nginx Windows | `gpgv`: Good signature / VALIDSIG, khóa Sergey Kandaurov tải từ nginx.org |
| Phiên bản nginx đã giải nén | `nginx/1.30.7` |
| Cú pháp server nginx | `nginx -t`: syntax is ok; test is successful |
| Cú pháp 3 script PowerShell | Không có lỗi khi phân tích bằng PowerShell Parser |
| DB thử được cho phép ở phiên trước | `book_reader_p0_test`, `ALLOW_SNAPSHOT_ISOLATION=ON` |

Kiểm nginx dùng nguyên tệp server đã sửa, nhưng thay upstream DNS của Docker bằng loopback trong vỏ kiểm thử. Không có backend giả được coi là ứng dụng đã triển khai.

## 3. Cách sử dụng

Từ thư mục `book-reader/source code/`, trong PowerShell:

```powershell
& './ops/Use-ProjectJava.ps1'
java -version
javac -version
mvn --version
& './ops/Test-NginxConfig.ps1'
```

Trên máy mới, chạy `ops/Install-ProjectJava.ps1` trước để tải đúng JDK và kiểm mã toàn vẹn.

## 4. Phạm vi cập nhật Java

- Cấu hình Java chỉ có hiệu lực trong cửa sổ PowerShell đã chạy lệnh kích hoạt.
- Lệnh kích hoạt cũng đặt UTF-8 cho JVM trong cửa sổ đó, không thay thiết lập mã hóa toàn máy.
- Java 24.0.2 toàn máy và các JDK cũ trong `.jdks` vẫn còn; chưa gỡ hoặc sửa chúng.
- IDE cần chọn Project SDK và Maven JDK là bản trong `.runtime/` theo `toolchain.json`.
- Khai báo `java.version=17` khi viết Maven không tự thay runtime; phải kiểm `mvn --version` và tiến trình thực tế.
- Kết quả này không chứng minh mọi phần mềm hoặc JRE đi kèm trên máy đã được vá.

## 5. Tình trạng hệ thống và giới hạn

- Lập trình ứng dụng P0 vẫn tạm dừng; đợt này chỉ cập nhật môi trường.
- Chưa có ứng dụng Spring Boot/React mới, chưa chạy kiểm thử nghiệp vụ hoặc migration V001.
- DB thử đã được tạo ở phiên trước; đợt này chỉ đọc trạng thái, không sửa DB khác.
- Chưa có Docker trên PATH; không chạy pull/build/container hoặc `docker compose up`.
- Compose, Dockerfiles và các hướng dẫn mẫu còn Python/Next.js/PostgreSQL; chưa sẵn sàng chạy toàn bộ.
- Chưa cấp chứng chỉ, kiểm HTTPS/điện thoại hoặc cho phép truy cập LAN; không đổi tường lửa.
- nginx Windows chỉ dùng kiểm cấu hình; chưa khởi động máy chủ hoặc cài dịch vụ.
- Không chạy PoC, không chứng nhận hệ thống an toàn toàn diện, không đóng P0.
- Không commit hoặc push trong đợt này.

## 6. Việc còn lại

1. Chọn JDK mới cho Project SDK và Maven JDK trong IDE trước khi dùng IDE để chạy dự án.
2. Khi tiếp tục P0: chuyển toàn bộ cấu hình mẫu sang stack đã chốt.
3. Chạy kiểm thử backend/frontend/SQL Server và ghép hệ thống qua nginx.
4. Cấu hình HTTPS nội bộ, ranh giới mạng và kiểm thiết bị thật trước khi dùng dữ liệu thật.
5. Trước triển khai Linux/AWS: rà kernel/SCTP, xác thực, quyền truy cập và cấu hình máy chủ riêng.

## 7. Nguồn đối chiếu

- [Temurin 17.0.21.1+2](https://github.com/adoptium/temurin17-binaries/releases/tag/jdk-17.0.21.1%2B2).
- [Metadata gói Temurin Windows x64](https://api.adoptium.net/v3/assets/latest/17/hotspot?architecture=x64&image_type=jdk&os=windows&vendor=eclipse); phiên bản cụ thể được khóa ở toolchain.json.
- [Oracle: bản cập nhật bảo mật tháng 11/2026](https://www.oracle.com/security-alerts/cspunov2026.html#AppendixJAVA).
- [nginx: thông báo bảo mật](https://nginx.org/en/security_advisories.html).
- [Khóa PGP chính thức nginx](https://nginx.org/en/pgp_keys.html).
- [Chỉ thị HTTP/2](https://nginx.org/en/docs/http/ngx_http_v2_module.html#http2).

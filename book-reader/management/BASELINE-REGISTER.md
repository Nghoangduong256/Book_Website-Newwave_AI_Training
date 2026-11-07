# Sổ mốc tài liệu chuẩn

Phiên bản: 1.0 · Ngày: 2026-11-07 · Trạng thái: Đã xác nhận bởi chủ dự án.


## 1. Mốc chuẩn
Mã BASELINE-1.0, chốt2026-11-07 bởi chủ dự án qua hội thoại: chấp nhận năm phần còn mở và bộ tài liệu đã rà soát. Ghi nhận bao gồm sửa định dạng bảng AC ở RD-01..04; không phải xác nhận mã đã triển khai/kiểm thử đạt.
Tài liệu trong bảng được nâng1.0 cùng ngày; đây là danh sách nguồn cho CR-MANAGEMENT.

## 2. Danh sách
| Tài liệu | Phiên bản | Phạm vi được duyệt |
|---|---|---|
| [plan/STRATEGY.md](../plan/STRATEGY.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/analysis/01_CURRENT_STATE_AND_GAP.md](../plan/analysis/01_CURRENT_STATE_AND_GAP.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-01_DESIGN_SYSTEM.md](../plan/BD/BD-01_DESIGN_SYSTEM.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-00_OVERVIEW.md](../plan/BD/BD-00_OVERVIEW.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-INDEX.md](../plan/BD/BD-INDEX.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-02_DATA_MODEL.md](../plan/BD/BD-02_DATA_MODEL.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-06_API_CONTRACT.md](../plan/BD/BD-06_API_CONTRACT.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-03_SECURITY_DESIGN.md](../plan/BD/BD-03_SECURITY_DESIGN.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-05_INFRA_DEPLOYMENT.md](../plan/BD/BD-05_INFRA_DEPLOYMENT.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-M05_account-access.md](../plan/BD/BD-M05_account-access.md) | 1.0 | Ranh giới tích hợp tương lai; không phải module tài khoản hoàn chỉnh |
| [plan/BD/BD-M01_library-import.md](../plan/BD/BD-M01_library-import.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-M02_reader.md](../plan/BD/BD-M02_reader.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-SCREEN-INDEX.md](../plan/BD/BD-SCREEN-INDEX.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-M04_reading-state-offline.md](../plan/BD/BD-M04_reading-state-offline.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/RD/RD-03_navigation.md](../plan/RD/RD-03_navigation.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/BD/BD-M03_navigation.md](../plan/BD/BD-M03_navigation.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/RD/RD-INDEX.md](../plan/RD/RD-INDEX.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/RD/RD-00_OVERVIEW.md](../plan/RD/RD-00_OVERVIEW.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/RD/RD-01_library-import.md](../plan/RD/RD-01_library-import.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/RD/RD-02_reader.md](../plan/RD/RD-02_reader.md) | 1.0 | Nội dung tài liệu hiện hành |
| [references/GLOSSARY.md](../references/GLOSSARY.md) | 1.0 | Nội dung tài liệu hiện hành |
| [plan/RD/RD-05_account-access.md](../plan/RD/RD-05_account-access.md) | 1.0 | Ranh giới tích hợp tương lai; không phải module tài khoản hoàn chỉnh |
| [plan/RD/RD-04_reading-state-offline.md](../plan/RD/RD-04_reading-state-offline.md) | 1.0 | Nội dung tài liệu hiện hành |
| [references/STACK.md](../references/STACK.md) | 1.0 | Lựa chọn công nghệ và danh sách xác minh; chưa pin/kiểm chứng phiên bản |

## 3. Hoãn có chủ đích và việc phải thực hiện
| Việc | Phụ trách | Hạn thực hiện | Điều kiện |
|---|---|---|---|
| Pin/kiểm phiên bản Java/Spring/JDBC/Flyway/frontend, giấy phép công cụ | Kỹ thuật | P0 trước triển khai thành phần | Ghi kết quả STACK; đổi công nghệ/hành vi cần CR/ADR |
| Thử PDF/EPUB, CFI, sandbox, mobile | Kỹ thuật | Trước đóng P1/P2 tương ứng | Nếu thư viện không đạt dùng CR; không tự đổi yêu cầu |
| Chuyển rules/skills/Docker/Makefile sang stack đã chọn | Kỹ thuật | P0 trước dùng | Mẫu cũ không tự trở thành cấu hình đã kiểm |
| Chứng chỉ HTTPS, firewall LAN, đường dẫn sách và ổ sao lưu tách biệt | Kỹ thuật, chủ dự án cung cấp thiết bị | Trước dữ liệu thật/kiểm mobile | Không public Internet; không mua tài nguyên mặc định |
| Đo NFR, sao lưu/restore, kiểm các ngưỡng100MiB và giải nén | Kỹ thuật | Gate liên quan và trước phát hành | Mục tiêu đã duyệt; chưa có số đo hay RPO/RTO cam kết |
| Tài khoản và Internet/Cloud/AWS | Chủ dự án và kỹ thuật | Giai đoạn tương lai chưa lên lịch | Chỉ ranh giới/lộ trình được duyệt, chưa chọn nhà cung cấp/ngân sách |

## 4. Quản lý sau mốc
Đổi phạm vi, nghiệp vụ, API/schema/hành vi hoặc mục tiêu đã duyệt: CR theo [quy trình](CR-MANAGEMENT.md); ADR nếu đổi kiến trúc. Sửa lỗi chữ/Markdown không đổi nghĩa được chỉnh trực tiếp, ghi lịch sử thích hợp.
Mẫu *TEMPLATE.md, Px-EXIT-GATE, ví dụ kỹ thuật kế thừa chưa chuyển và mã ứng dụng không nằm trong bảng phê duyệt. Hồ sơ tiến độ/phát hiện/quyết định là bản ghi sống, cập nhật bằng kết quả thật.

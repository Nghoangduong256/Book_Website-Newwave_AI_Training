# Bàn giao Book Reader cho Codex trên máy khác

Cập nhật: **24/11/2026** · Phiên bản: **1.0** · Hồ sơ bàn giao, không phải biên bản nghiệm thu P0.

**Điểm tiếp tục:** đã chốt yêu cầu/thiết kế và cập nhật công cụ Java/nginx. **Lập trình P0 vẫn tạm dừng theo yêu cầu chủ dự án.** Đọc tài liệu, báo lại hiện trạng và chờ yêu cầu tiếp tục; không tự khởi động triển khai chỉ vì đọc tệp này.

## 1. Đúng repository và nhánh

| Nội dung | Giá trị tại lần bàn giao |
|---|---|
| Repository | `https://github.com/Nghoangduong256/Book_Website-Newwave_AI_Training.git` |
| Dự án đang phát triển | `book-reader/`, tính từ gốc repository |
| Nhánh công việc | `feat/book-reader-p0` |
| Nhánh mẫu được giữ lại | `chore/book-reader-baseline` |
| Commit gần nhất đã push trước tệp này | `f5dd781` — cập nhật Java/nginx và báo cáo |
| Mốc trước đó | `c7cd433` — kế hoạch, sơ đồ hệ thống và thiết kế PC/Mobile |

Đây là ảnh chụp tiến độ, không thay lịch sử Git. Khi tiếp nhận, kiểm `git status`, `git branch --show-current` và `git log -5 --oneline`; nếu khác bảng, đọc các thay đổi mới trước khi làm tiếp.

Đường dẫn tuyệt đối ở máy cũ có thể khác máy mới. Không suy ra repository đúng từ thư mục làm việc của chat: các phiên trước có lúc mở nhầm `Project_ngan/Frontend` ở một cây thư mục khác.

## 2. Mục tiêu và quyết định đã chốt

- Web đọc sách PDF/EPUB trên PC và Mobile; giao diện tiếng Việt, sáng/tối.
- Giữ **React + TypeScript + Vite**, **Java + Spring Boot + JPA**, **SQL Server**.
- Làm dự án riêng từ mẫu công ty. `Project_ngan/` là bản cũ, `template-ai/` là mẫu gốc; không sửa hai thư mục này khi làm Book Reader.
- Cá nhân trước, chưa có đăng nhập. Chuẩn bị `CurrentReader`/`AccessPolicy` và quyền sở hữu để có thể ghép phân hệ tài khoản về sau.
- Bản đầu chỉ mạng nhà, thiết bị tin cậy; Internet/AWS là giai đoạn riêng, chưa chọn hoặc mua dịch vụ.
- Nhập tệp hoặc URL; PDF thường/quét ảnh, EPUB2/3 tự dàn nội dung không DRM. Không OCR, PDF mật khẩu, EPUB cố định/DRM hoặc xuất sách đã sửa ở bản đầu.
- Tệp gốc lưu trên ổ đĩa máy chủ qua `StoragePort`; mục lục cá nhân/đánh dấu không sửa tệp gốc.
- Giới hạn **100 MiB/tệp**. Giới hạn EPUB, URL, mục lục và sao lưu xem [quyết định đã chốt](OPEN-DECISIONS.md).
- Đồng bộ hai chiều; xung đột để người đọc lựa chọn, không tự chọn trang lớn nhất.
- Phân biệt xóa bản tải trên thiết bị, xóa sách khỏi thư viện và đặt lại tiến độ; giữ thay đổi chưa gửi theo RD/BD.

Không hỏi lại các quyết định sản phẩm đã chốt. Thay hành vi/phạm vi chuẩn 1.0 phải theo quy trình yêu cầu thay đổi.

## 3. Đã làm và chưa làm

| Hạng mục | Tình trạng thực tế |
|---|---|
| Phân tích dự án cũ, tạo bản riêng từ template | Đã làm |
| RD/BD chuẩn 1.0 | Chủ dự án đã duyệt ngày 07/11/2026; 24 tài liệu, 27 FR, 18 BR, 59 tình huống nghiệm thu |
| Ngôn ngữ và trình bày tài liệu | Đã rà tiếng Việt, sửa bảng và chia ý; nhật ký dài chuyển sang lịch sử |
| Kế hoạch tổng thể và kế hoạch P0 | Đã viết; P0 từng được yêu cầu bắt đầu rồi tạm dừng |
| Sơ đồ hệ thống và 8 màn hình/thành phần | Đã viết |
| Phác thảo giao diện PC/Mobile tối giản | Chủ dự án đã xem và chấp nhận; đây là bản minh họa, không phải ứng dụng |
| Công cụ Java/nginx | Đã cập nhật và kiểm chứng trên máy cũ, đã commit/push |
| Backend/frontend mới, API nghiệp vụ | **Chưa viết**; chưa có `backend/pom.xml` hoặc `frontend/package.json` của bản mới tại mốc này |
| Migration V001 và kiểm thử nghiệp vụ | **Chưa viết/chạy** |
| Docker, HTTPS, CI, trình duyệt/điện thoại thật | **Chưa kiểm chứng hệ thống hoàn chỉnh** |

Các tệp `CLAUDE.md`, `.claude/rules/skills/agents`, Dockerfiles, Makefile, Compose và GETTING-STARTED còn ví dụ công nghệ cũ. Ngoại trừ phần cập nhật đã ghi nhận, **không chạy hướng dẫn mẫu như một hệ thống đã sẵn sàng**. F-P0-03 vẫn mở.

## 4. Thứ tự đọc để tiếp nhận

Đường dẫn trong bảng tính từ `book-reader/`.

| Thứ tự | Tài liệu | Mục đích |
|---|---|---|
| 1 | [AGENTS.md](../AGENTS.md), [PROGRESS.md](PROGRESS.md), tệp bàn giao này | Quy tắc, điểm dừng và ngữ cảnh hội thoại |
| 2 | [Báo cáo Java/nginx](SECURITY-UPDATE-2026-11-23.md), [STACK](../references/STACK.md) | Kết quả đã chạy và giới hạn môi trường |
| 3 | [Kế hoạch tổng thể](IMPLEMENTATION-ROADMAP.md), [kế hoạch P0](<../plan/Implementation plan/01_IMPL_PLAN_P0.md>) | Phạm vi từng giai đoạn, bước thực hiện và tiêu chí P0 |
| 4 | [Sơ đồ hệ thống/màn hình](../plan/BD/SYSTEM-AND-SCREEN-MAP.md), [phác thảo PC/Mobile](../../work/book-reader-ui/book-reader-ui-proposal.html) | Bố cục và luồng đã được trao đổi |
| 5 | [RD-INDEX](../plan/RD/RD-INDEX.md), [BD-INDEX](../plan/BD/BD-INDEX.md) | Mở tài liệu phù hợp với phần sắp triển khai |
| 6 | [BASELINE-REGISTER](BASELINE-REGISTER.md), [OPEN-DECISIONS](OPEN-DECISIONS.md), [FINDINGS](FINDINGS.md) | Chuẩn đã duyệt, quyết định và việc còn thiếu |

Khi viết mã, đọc BD-00 về kiến trúc/API, BD-01 về giao diện, BD-02 về dữ liệu, BD-03 về bảo mật và BD-05 về vận hành. Không áp dụng ví dụ Python/Next.js/PostgreSQL trái với bộ công nghệ đã chốt.

## 5. Thiết lập máy thứ hai

Các lệnh dưới đây là hướng dẫn; chỉ chạy khi chủ dự án cho phép nhóm thao tác tương ứng.

```powershell
git clone --branch feat/book-reader-p0 https://github.com/Nghoangduong256/Book_Website-Newwave_AI_Training.git
Set-Location 'Book_Website-Newwave_AI_Training'
git status --short --branch
git log -5 --oneline
```

Kiểm môi trường mới trước khi cài: hệ điều hành/CPU, Git, Node/npm, Maven, SQL Server, Docker. Không sao chép kết quả máy cũ thành kết quả máy mới.

**Java trên Windows x64**, sau khi được phép tải/cài công cụ:

```powershell
Set-Location 'book-reader/source code'
& './ops/Install-ProjectJava.ps1'
java -version
javac -version
mvn --version
```

- Phiên bản/hash khóa trong [ops/toolchain.json](<../source code/ops/toolchain.json>): Temurin **17.0.21.1+2** tại lần kiểm 23/11/2026.
- Script kiểm SHA-256 trước khi giải nén. Cửa sổ PowerShell mới chạy `ops/Use-ProjectJava.ps1` để kích hoạt JDK và UTF-8 cho JVM.
- Chọn cùng JDK cho Project SDK và Maven JDK trong IDE. Không chỉ đổi `java.version` trong Maven rồi cho rằng runtime đã đổi.
- Script hiện dành cho Windows x64; máy khác hệ điều hành/kiến trúc cần phương án tương ứng, không chạy nguyên script.

**nginx:** Compose đã khóa **1.30.7-alpine kèm digest**; HTTP/2 tắt, không có listener QUIC, cổng proxy chỉ loopback. Không chạy toàn bộ Compose kế thừa. `ops/Test-NginxConfig.ps1` cần gói nginx Windows đúng bản, kiểm chữ ký/hash và giải nén trước; hiện chưa có script tự cài nginx.

Các phiên bản trên là mốc đã kiểm, không phải cam kết mới nhất mãi mãi. Trước cài/triển khai ở thời điểm khác, đối chiếu thông báo nhà cung cấp; không chạy PoC để thử máy.

## 6. Những gì Git clone không mang sang

| Thành phần | Máy cũ | Máy mới cần làm gì |
|---|---|---|
| `source code/.runtime/` | JDK, nginx Windows, gói tải, kết quả kiểm nhanh; Git bỏ qua | Cài/xác minh lại; clone chỉ có script và thông số khóa |
| SQL Server | Có SQL Server 2022 Developer | Xác minh hoặc xin phép cài môi trường thử |
| DB `book_reader_p0_test` | Đã được cho phép tạo, bật `ALLOW_SNAPSHOT_ISOLATION`; chưa có V001 | Không có qua Git; xin phép trước khi tạo/cấu hình DB mới |
| Java toàn máy/IDE | Java 24.0.2 và một số JDK cũ vẫn còn | Chọn JDK dự án; không giả định mọi JRE trên máy đã vá |
| Maven, Node/npm | Máy cũ đã nhận Maven 3.9.16, Node 22.18.0, npm 10.9.3 | Kiểm lại; chưa coi là bộ phiên bản ứng dụng hoàn chỉnh đã nghiệm thu |
| `.env`, bí mật, chứng chỉ, sách, bản tải trình duyệt | Không được đưa vào Git; HTTPS chưa thiết lập cho bản mới | Cấu hình riêng theo máy, không đưa bí mật/dữ liệu thật vào báo cáo hoặc commit |

Máy cũ chưa tìm thấy Docker trên PATH, chưa chạy container. Chỉ đã kiểm Java/javac/Maven, biên dịch/chạy kiểm nhanh, hash/chữ ký và cú pháp server nginx. Chưa chứng minh backend–DB–frontend–HTTPS hoạt động cùng nhau.

## 7. Công việc tiếp theo khi được yêu cầu tiếp tục P0

1. **S1:** kiểm lại môi trường máy đang làm, khóa phiên bản tương thích và xử lý các phụ thuộc còn thiếu.
2. **S2:** chuyển đồng bộ hướng dẫn/cấu hình mẫu sang Spring Boot, React/Vite và SQL Server.
3. **S3:** dựng backend, cấu hình có kiểm tra, lỗi RFC9457, mã truy vết và kiểm sức khỏe.
4. **S4:** cấu hình JPA/Flyway, V001 danh tính/nhật ký; kiểm migration và khởi tạo lặp trên SQL Server thật.
5. **S5:** `CurrentReader`, `ReaderContext`, `AccessPolicy`; không nhận danh tính từ body/header/query.
6. **S6:** dựng khung React, định tuyến, tiếng Việt, sáng/tối, trạng thái chung, Query và công cụ sinh mã API.
7. **S7:** ghép nginx/HTTPS, CI, kiểm thử và biên bản P0. Đối chiếu **P0-AC-01…09** trong kế hoạch; chưa đạt thì không đóng giai đoạn.

Về sau: **P1** thư viện/PDF → **P2** EPUB/mục lục/đánh dấu → **P3** ngoại tuyến/đồng bộ → nghiệm thu toàn hệ thống. Không đưa chức năng các giai đoạn sau vào P0 để báo đã hoàn thành.

## 8. Quyền thao tác và cách làm việc

- Chủ dự án yêu cầu giải thích ngắn, ưu tiên tiếng Việt, chia ý rõ và hỗ trợ người mới hiểu mã.
- Trước lệnh/sửa/xóa, nêu phạm vi và lấy phép theo yêu cầu hiện hành; không tự coi việc đọc bàn giao là cho phép cài đặt hoặc lập trình. Tận dụng quyền đã được xác nhận trong cùng phiên, không hỏi lại vô ích.
- Chủ dự án từng đồng ý tạo DB thử trên **máy cũ** và đặt workflow tại `.github/workflows/book-reader-p0.yml` ở gốc repository. DB mới vẫn cần xác nhận môi trường/quyền; workflow mới **chưa được tạo**.
- Đề xuất tải nginx/tạo chứng chỉ để kiểm HTTPS từng bị dừng trước khi được duyệt. Sau đó chỉ đợt Java/nginx được làm và push; không suy thành quyền cấp chứng chỉ hoặc đổi tường lửa.
- Commit/push theo yêu cầu riêng. Không tự mua AWS, mở Internet, chuyển dữ liệu cũ, sửa mẫu gốc hoặc tạo Git lồng.
- Sửa hướng dẫn kỹ thuật mâu thuẫn trước khi dùng. Không thay thiết kế đã chốt bằng ví dụ template; nếu đổi hành vi thì theo CR/ADR.

## 9. Quy trình chuyển qua lại hai máy

1. Khi kết thúc phiên, cập nhật [PROGRESS](PROGRESS.md) và tệp này: đã làm, kết quả kiểm, việc chưa xong, bước tiếp và giới hạn quyền thao tác.
2. Kiểm `git status`; chỉ đưa đúng tệp liên quan vào commit. Commit/push khi được yêu cầu để máy kia nhận được tài liệu và mã mới.
3. Máy tiếp nhận kiểm thay đổi cục bộ trước. Khi đã được phép đồng bộ và cây làm việc phù hợp, dùng `git fetch origin`, chuyển đúng nhánh rồi `git pull --ff-only`.
4. Nếu có thay đổi chưa lưu hoặc nhánh phân kỳ, báo tình trạng trước; không tự reset/force-push hay ghi đè công việc máy kia.
5. Đọc Git và tài liệu cập nhật, kiểm lại môi trường; không dùng đường dẫn máy cũ hoặc bằng chứng kiểm cũ thay cho phép kiểm mới.

**Lưu ý:** tệp bàn giao mới chỉ xuất hiện trong clone sau khi được commit và push. Yêu cầu tạo tệp này không tự bao gồm commit/push.

## 10. Lời nhắn dùng ở chat mới

> Hãy đọc `book-reader/AGENTS.md`, `book-reader/management/PROGRESS.md` và `book-reader/management/CODEX-HANDOFF.md`. Tôi cho phép dùng các lệnh chỉ đọc để kiểm tra repository. Hãy tóm tắt điểm dừng và công việc tiếp theo, đối chiếu Git hiện tại. Chưa tự cài đặt, sửa/xóa tệp, lập trình, chạy kiểm thử hoặc commit/push cho tới khi tôi yêu cầu cụ thể.

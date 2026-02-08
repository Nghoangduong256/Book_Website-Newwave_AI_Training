import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { booksApi } from "../api/booksApi";
import type { Book } from "../types/book";
import { getPdf } from "../storage/pdfStore";
import PdfViewer from "../components/PdfViewer";

export default function ReaderPage() {
    const { id } = useParams();
    const bookId = Number(id);

    const [book, setBook] = useState<Book | null>(null);
    const [source, setSource] = useState<string | Blob | null>(null);
    const [fileName, setFileName] = useState<string>("book.pdf");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErr(null);

                const b = await booksApi.get(bookId);
                setBook(b);

                // ưu tiên offline
                const local = await getPdf(bookId);
                if (local?.blob) {
                    setSource(local.blob);
                    setFileName(local.fileName ?? `${b.title}.pdf`);
                    return;
                }

                // fallback URL
                if (b.pdfUrl) {
                    setSource(b.pdfUrl);
                    setFileName(`${b.title}.pdf`);
                    return;
                }

                setErr("Sách này không có PDF offline và cũng không có URL PDF.");
            } catch (e: any) {
                setErr(e?.message ?? "Load reader failed");
            } finally {
                setLoading(false);
            }
        })();
    }, [bookId]);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 14 }}>
            <div style={{ background: "white", border: "1px solid #e2e6f0", borderRadius: 14, padding: 14 }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>📄 Chọn sách để đọc</div>

                {book ? (
                    <>
                        <div style={{ fontSize: 18, fontWeight: 900 }}>{book.title}</div>
                        <div style={{ color: "#5b6472", marginTop: 4 }}>
                            {book.author} • {book.publishYear ?? "—"} • {book.pdfUrl ? "URL" : "—"}
                        </div>
                    </>
                ) : null}

                <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
                    Ưu tiên đọc offline (IndexedDB). Nếu không có thì dùng URL PDF.
                </div>
            </div>

            <div>
                {loading ? <div>Đang tải...</div> : null}
                {err ? (
                    <div style={{ color: "#c92a2a", background: "#fff5f5", border: "1px solid #ffc9c9", padding: 12, borderRadius: 12 }}>
                        {err}
                    </div>
                ) : null}
                {source ? <PdfViewer source={source} fileName={fileName} /> : null}
            </div>
        </div>
    );
}

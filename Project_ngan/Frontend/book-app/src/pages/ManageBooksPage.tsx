import { useEffect, useState } from "react";
import type { Book, BookUpsert } from "../types/book";
import { booksApi } from "../api/booksApi";
import BookForm from "../components/BookForm";
import { deletePdf, savePdf } from "../storage/pdfStore";
import { Link } from "react-router-dom";

export default function ManageBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [editing, setEditing] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    async function refresh() {
        const data = await booksApi.list();
        setBooks(data);
    }

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErr(null);
                await refresh();
            } catch (e: any) {
                setErr(e?.message ?? "Load failed");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function handleSubmit(payload: BookUpsert, localPdf?: { blob: Blob; fileName: string } | null) {
        // 1) Lưu metadata lên backend trước để có bookId
        let saved: Book;
        if (editing?.id) {
            saved = await booksApi.update(editing.id, payload);
        } else {
            saved = await booksApi.create(payload);
        }

        // 2) Nếu có file PDF local -> lưu IndexedDB theo bookId
        if (localPdf?.blob) {
            await savePdf(saved.id, localPdf.blob, localPdf.fileName);

            // Nếu backend chưa set hasLocalFile=true (do bạn muốn backend tự tính) thì bạn có thể update thêm 1 lần.
            // Ở đây mình assume payload đã có hasLocalFile = true.
        }

        setEditing(null);
        await refresh();
    }

    async function handleDelete(book: Book) {
        const ok = confirm(`Xóa sách "${book.title}"?`);
        if (!ok) return;

        await booksApi.remove(book.id);
        await deletePdf(book.id); // xoá luôn offline PDF nếu có
        await refresh();
        if (editing?.id === book.id) setEditing(null);
    }

    return (
        <div>
            <BookForm
                initial={editing}
                onSubmit={handleSubmit}
                onReset={() => setEditing(null)}
            />

            <div style={{ marginTop: 14 }}>
                {loading ? <div>Đang tải...</div> : null}
                {err ? (
                    <div style={{ color: "#c92a2a", background: "#fff5f5", border: "1px solid #ffc9c9", padding: 12, borderRadius: 12 }}>
                        {err}
                    </div>
                ) : null}
            </div>

            <div
                style={{
                    marginTop: 14,
                    background: "white",
                    border: "1px solid #e2e6f0",
                    borderRadius: 14,
                    overflow: "hidden",
                }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.7fr 1.8fr 0.8fr 1fr", fontWeight: 800, padding: 12, borderBottom: "1px solid #eef1f7" }}>
                    <div>Tiêu đề</div>
                    <div>Tác giả</div>
                    <div>Năm</div>
                    <div>Tags</div>
                    <div>PDF</div>
                    <div>Hành động</div>
                </div>

                {books.map((b) => (
                    <div key={b.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.7fr 1.8fr 0.8fr 1fr", padding: 12, borderBottom: "1px solid #f3f5fb", alignItems: "center" }}>
                        <div>{b.title}</div>
                        <div>{b.author}</div>
                        <div>{b.publishYear ?? "—"}</div>
                        <div style={{ color: "#5b6472" }}>{b.tags ?? "—"}</div>
                        <div>
                            {b.pdfUrl ? (
                                <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 10, border: "1px solid #d6dbe6" }}>URL</span>
                            ) : (
                                <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 10, border: "1px solid #d6dbe6" }}>—</span>
                            )}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <Link
                                to={`/reader/${b.id}`}
                                style={{
                                    padding: "8px 10px",
                                    borderRadius: 10,
                                    background: "#1f6feb",
                                    color: "white",
                                    textDecoration: "none",
                                    fontWeight: 700,
                                }}
                                title="Đọc"
                            >
                                📖
                            </Link>

                            <button
                                onClick={() => setEditing(b)}
                                style={{
                                    padding: "8px 10px",
                                    borderRadius: 10,
                                    border: "1px solid #ffd43b",
                                    background: "#ffd43b",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                }}
                                title="Sửa"
                            >
                                ✏️
                            </button>

                            <button
                                onClick={() => handleDelete(b)}
                                style={{
                                    padding: "8px 10px",
                                    borderRadius: 10,
                                    border: "1px solid #fa5252",
                                    background: "#fa5252",
                                    color: "white",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                }}
                                title="Xóa"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

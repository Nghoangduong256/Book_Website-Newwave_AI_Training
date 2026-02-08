import type { Book } from "../types/book";
import { Link } from "react-router-dom";

function parseTags(tags?: string | null) {
    if (!tags) return [];
    return tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 6);
}

export default function BookCard({ book }: { book: Book }) {
    const tags = parseTags(book.tags);

    return (
        <div
            style={{
                background: "white",
                border: "1px solid #e2e6f0",
                borderRadius: 14,
                padding: 16,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{book.title}</div>
                    <div style={{ color: "#5b6472", marginTop: 4 }}>
                        {book.author} • {book.publishYear ?? "—"}
                    </div>
                </div>

                {book.pdfUrl ? (
                    <span
                        style={{
                            fontSize: 12,
                            padding: "4px 8px",
                            borderRadius: 10,
                            border: "1px solid #d6dbe6",
                            color: "#4c5563",
                            height: "fit-content",
                        }}
                    >
                        URL
                    </span>
                ) : null}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {tags.map((t) => (
                    <span key={t} style={{ fontSize: 12, padding: "4px 8px", borderRadius: 999, background: "#eef3ff" }}>
                        {t}
                    </span>
                ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <Link
                    to={`/reader/${book.id}`}
                    style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: "#1f6feb",
                        color: "white",
                        textDecoration: "none",
                        fontWeight: 600,
                    }}
                >
                    📖 Đọc
                </Link>
                <div
                    title={book.hasLocalFile ? "Có PDF offline" : "Chưa có PDF offline"}
                    style={{
                        width: 44,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 12,
                        border: "1px solid #d6dbe6",
                        background: "white",
                        color: book.hasLocalFile ? "#2f9e44" : "#9aa3b2",
                        fontWeight: 700,
                    }}
                >
                    ⬇
                </div>
            </div>
        </div>
    );
}

import { useEffect, useMemo, useState } from "react";
import { booksApi } from "../api/booksApi";
import type { Book, SortKey } from "../types/book";
import BookCard from "../components/BookCard";

function sortBooks(items: Book[], sort: SortKey) {
    const arr = [...items];
    switch (sort) {
        case "TITLE_ASC":
            arr.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "TITLE_DESC":
            arr.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case "YEAR_ASC":
            arr.sort((a, b) => (a.publishYear ?? 999999) - (b.publishYear ?? 999999));
            break;
        case "YEAR_DESC":
            arr.sort((a, b) => (b.publishYear ?? -999999) - (a.publishYear ?? -999999));
            break;
        default:
            arr.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    }
    return arr;
}

export default function LibraryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [q, setQ] = useState("");
    const [sort, setSort] = useState<SortKey>("TITLE_ASC");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const data = await booksApi.list();
                setBooks(data);
            } catch (e: any) {
                setErr(e?.message ?? "Load books failed");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        const base = keyword
            ? books.filter((b) => {
                const hay = `${b.title} ${b.author} ${b.tags ?? ""}`.toLowerCase();
                return hay.includes(keyword);
            })
            : books;
        return sortBooks(base, sort);
    }, [books, q, sort]);

    return (
        <div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Tìm kiếm</div>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Nhập tên sách / tác giả / tag..."
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #d6dbe6",
                            outline: "none",
                        }}
                    />
                </div>

                <div style={{ minWidth: 240 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Sắp xếp</div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #d6dbe6",
                            background: "white",
                        }}
                    >
                        <option value="TITLE_ASC">Theo tiêu đề (A→Z)</option>
                        <option value="TITLE_DESC">Theo tiêu đề (Z→A)</option>
                        <option value="YEAR_ASC">Theo năm (tăng dần)</option>
                        <option value="YEAR_DESC">Theo năm (giảm dần)</option>
                        <option value="CREATED_DESC">Mới nhất</option>
                    </select>
                </div>
            </div>

            <div style={{ marginTop: 18 }}>
                {loading ? <div>Đang tải...</div> : null}
                {err ? (
                    <div style={{ color: "#c92a2a", background: "#fff5f5", border: "1px solid #ffc9c9", padding: 12, borderRadius: 12 }}>
                        {err}
                    </div>
                ) : null}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14, marginTop: 14 }}>
                    {filtered.map((b) => (
                        <BookCard key={b.id} book={b} />
                    ))}
                </div>
            </div>
        </div>
    );
}

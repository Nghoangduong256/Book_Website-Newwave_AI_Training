import { useEffect, useMemo, useState } from "react";
import type { Book, BookUpsert } from "../types/book";

type Props = {
    initial?: Book | null;
    onSubmit: (payload: BookUpsert, localPdf?: { blob: Blob; fileName: string } | null) => Promise<void>;
    onReset?: () => void;
};

export default function BookForm({ initial, onSubmit, onReset }: Props) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publishYear, setPublishYear] = useState<string>("");
    const [tags, setTags] = useState("");
    const [pdfUrl, setPdfUrl] = useState("");

    const [localFile, setLocalFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!initial) return;
        setTitle(initial.title ?? "");
        setAuthor(initial.author ?? "");
        setPublishYear(initial.publishYear?.toString() ?? "");
        setTags(initial.tags ?? "");
        setPdfUrl(initial.pdfUrl ?? "");
        setLocalFile(null);
    }, [initial]);

    const canSave = useMemo(() => title.trim().length > 0 && author.trim().length > 0, [title, author]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSave) {
            setErr("Vui lòng nhập Tiêu đề và Tác giả.");
            return;
        }

        setSaving(true);
        setErr(null);

        try {
            const payload: BookUpsert = {
                title: title.trim(),
                author: author.trim(),
                publishYear: publishYear.trim() ? Number(publishYear.trim()) : null,
                tags: tags.trim() ? tags.trim() : null,
                pdfUrl: pdfUrl.trim() ? pdfUrl.trim() : null,
                hasLocalFile: !!localFile || !!initial?.hasLocalFile,
            };

            const localPdf = localFile
                ? { blob: localFile as unknown as Blob, fileName: localFile.name }
                : null;

            await onSubmit(payload, localPdf);
            setLocalFile(null);
        } catch (e: any) {
            setErr(e?.message ?? "Save failed");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                background: "white",
                border: "1px solid #e2e6f0",
                borderRadius: 14,
                padding: 16,
            }}
        >
            <div style={{ fontWeight: 800, marginBottom: 12 }}>✏️ Thêm / Sửa sách</div>

            {err ? (
                <div style={{ marginBottom: 12, color: "#c92a2a", background: "#fff5f5", border: "1px solid #ffc9c9", padding: 10, borderRadius: 12 }}>
                    {err}
                </div>
            ) : null}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Tiêu đề</div>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "90%", padding: "10px 12px", borderRadius: 12, border: "1px solid #d6dbe6" }}
                    />
                </div>
                <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Tác giả</div>
                    <input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        style={{ width: "90%", padding: "10px 12px", borderRadius: 12, border: "1px solid #d6dbe6" }}
                    />
                </div>

                <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Năm xuất bản</div>
                    <input
                        value={publishYear}
                        onChange={(e) => setPublishYear(e.target.value)}
                        placeholder="2024 hoặc -500"
                        inputMode="numeric"
                        style={{ width: "90%", padding: "10px 12px", borderRadius: 12, border: "1px solid #d6dbe6" }}
                    />
                </div>

                <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Tags (phân tách bằng dấu phẩy)</div>
                    <input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="khoa học, kỹ năng, tiểu thuyết"
                        style={{ width: "90%", padding: "10px 12px", borderRadius: 12, border: "1px solid #d6dbe6" }}
                    />
                </div>

                <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Tải tệp PDF (lưu trong trình duyệt)</div>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setLocalFile(e.target.files?.[0] ?? null)}
                    />
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                        Dung lượng lớn vẫn ổn (dùng IndexedDB). Bạn cũng có thể để trống và dùng URL.
                    </div>
                </div>

                <div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Hoặc URL PDF (không lưu cục bộ)</div>
                    <input
                        value={pdfUrl}
                        onChange={(e) => setPdfUrl(e.target.value)}
                        placeholder="https://example.com/sample.pdf"
                        style={{ width: "90%", padding: "10px 12px", borderRadius: 12, border: "1px solid #d6dbe6" }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1px solid #2f9e44",
                        background: "#2f9e44",
                        color: "white",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    💾 Lưu
                </button>

                <button
                    type="button"
                    onClick={onReset}
                    style={{
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1px solid #d6dbe6",
                        background: "white",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    ↩ Reset
                </button>
            </div>
        </form>
    );
}

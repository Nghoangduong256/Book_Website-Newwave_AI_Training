import { useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// IMPORTANT: set worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

type Props = {
    source: string | Blob;
    fileName?: string;
};

export default function PdfViewer({ source, fileName }: Props) {
    const [numPages, setNumPages] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.1);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        setPage(1);
        setScale(1.1);
        setErr(null);
    }, [source]);

    const canPrev = page > 1;
    const canNext = numPages > 0 && page < numPages;

    const downloadUrl = useMemo(() => {
        if (typeof source === "string") return source;
        return URL.createObjectURL(source);
    }, [source]);

    useEffect(() => {
        return () => {
            if (typeof source !== "string") {
                URL.revokeObjectURL(downloadUrl);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!canPrev}
                    style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #d6dbe6", background: "white", cursor: "pointer" }}
                >
                    ◀
                </button>

                <div style={{ fontWeight: 800 }}>
                    Trang {numPages ? page : "-"} / {numPages ? numPages : "-"}
                </div>

                <button
                    onClick={() => setPage((p) => (numPages ? Math.min(numPages, p + 1) : p))}
                    disabled={!canNext}
                    style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #d6dbe6", background: "white", cursor: "pointer" }}
                >
                    ▶
                </button>

                <button
                    onClick={() => setScale((s) => Math.max(0.6, Number((s - 0.1).toFixed(2))))}
                    style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #d6dbe6", background: "white", cursor: "pointer" }}
                    title="Zoom out"
                >
                    ➖
                </button>

                <button
                    onClick={() => setScale((s) => Math.min(2.2, Number((s + 0.1).toFixed(2))))}
                    style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #d6dbe6", background: "white", cursor: "pointer" }}
                    title="Zoom in"
                >
                    ➕
                </button>

                <a
                    href={downloadUrl}
                    download={fileName ?? "book.pdf"}
                    style={{
                        marginLeft: "auto",
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #2f9e44",
                        background: "white",
                        textDecoration: "none",
                        color: "#2f9e44",
                        fontWeight: 800,
                    }}
                    title="Download"
                >
                    ⬇
                </a>
            </div>

            {err ? (
                <div style={{ color: "#c92a2a", background: "#fff5f5", border: "1px solid #ffc9c9", padding: 12, borderRadius: 12 }}>
                    {err}
                </div>
            ) : null}

            <div style={{ background: "white", border: "1px solid #e2e6f0", borderRadius: 14, padding: 12, overflow: "auto" }}>
                <Document
                    file={source}
                    onLoadSuccess={(pdf) => {
                        setNumPages(pdf.numPages);
                        setPage(1);
                    }}
                    onLoadError={(e: any) => setErr(e?.message ?? "Cannot load PDF")}
                    loading={<div>Đang tải PDF...</div>}
                >
                    <Page pageNumber={page} scale={scale} />
                </Document>
            </div>
        </div>
    );
}
